import { NextRequest, NextResponse } from 'next/server';

let clientPromise: Promise<any> | null = null;

// Dynamically import MongoDB only if available
async function getMongoClient() {
  if (!clientPromise) {
    try {
      const mongodb = await import('@/lib/mongodb');
      clientPromise = mongodb.default;
    } catch (error) {
      console.warn('MongoDB not available, using in-memory storage');
      return null;
    }
  }
  
  try {
    return await clientPromise;
  } catch (error) {
    console.warn('MongoDB connection failed, using fallback data');
    return null;
  }
}

// In-memory storage for pending reviews when MongoDB is not available
let pendingReviews: any[] = [];

// Type for MongoDB document with _id
interface MongoReview {
  _id?: any;
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
  submittedAt: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const reviewData = await request.json();
    const client = await getMongoClient();
    
    const newReview = {
      ...reviewData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      approved: false, // Reviews need admin approval
      submittedAt: new Date().toISOString()
    };
    
    if (client) {
      const db = client.db('tour-website');
      await db.collection('pending-reviews').insertOne(newReview);
      console.log('Review saved to MongoDB:', newReview.id);
    } else {
      // Store in memory when MongoDB is not available
      pendingReviews.push(newReview);
      console.log('Review saved to memory storage:', newReview.id);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Review submitted successfully! It will be reviewed by our team before being published.',
      reviewId: newReview.id
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ 
      error: 'Failed to submit review. Please try again.' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await getMongoClient();
    
    if (client) {
      const db = client.db('tour-website');
      const reviews = await db.collection('pending-reviews').find({}).toArray();
      return NextResponse.json(reviews.map((review: MongoReview) => {
        const { _id, ...reviewData } = review;
        return reviewData;
      }));
    } else {
      // Return in-memory reviews when MongoDB is not available
      return NextResponse.json(pendingReviews);
    }
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    return NextResponse.json([]);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { reviewId, action } = await request.json();
    const client = await getMongoClient();
    
    if (client) {
      const db = client.db('tour-website');
      
      if (action === 'approve') {
        // Move review from pending to approved
        const review = await db.collection('pending-reviews').findOne({ id: reviewId });
        if (review) {
          const { _id, ...reviewData } = review;
          const approvedReview = { ...reviewData, approved: true };
          
          // Add to main reviews collection (this would need to be integrated with website data)
          await db.collection('approved-reviews').insertOne(approvedReview);
          
          // Remove from pending
          await db.collection('pending-reviews').deleteOne({ id: reviewId });
          
          return NextResponse.json({ success: true, message: 'Review approved successfully' });
        }
      } else if (action === 'reject') {
        // Delete the review
        await db.collection('pending-reviews').deleteOne({ id: reviewId });
        return NextResponse.json({ success: true, message: 'Review rejected and deleted' });
      }
    } else {
      // Handle in-memory storage
      if (action === 'approve') {
        const reviewIndex = pendingReviews.findIndex(r => r.id === reviewId);
        if (reviewIndex !== -1) {
          pendingReviews[reviewIndex].approved = true;
          return NextResponse.json({ success: true, message: 'Review approved successfully' });
        }
      } else if (action === 'reject') {
        pendingReviews = pendingReviews.filter(r => r.id !== reviewId);
        return NextResponse.json({ success: true, message: 'Review rejected and deleted' });
      }
    }
    
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}