import { NextRequest, NextResponse } from 'next/server';
import { defaultWebsiteData } from '@/lib/data';

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

// In-memory storage for the current session
let websiteData = { ...defaultWebsiteData };

export async function GET() {
  try {
    const client = await getMongoClient();
    
    if (client) {
      // Try to get data from MongoDB
      const db = client.db('tour-website');
      const storedData = await db.collection('website-data').findOne({ _id: 'main' });
      
      if (storedData) {
        // Remove MongoDB _id field and return the data
        const { _id, ...data } = storedData;
        websiteData = data;
        return NextResponse.json(data);
      }
    }
    
    // Fallback to in-memory data
    return NextResponse.json(websiteData);
  } catch (error) {
    console.error('Error fetching website data:', error);
    return NextResponse.json(websiteData);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Update the in-memory data immediately
    websiteData = { ...data };
    
    const client = await getMongoClient();
    
    if (client) {
      // Save to MongoDB if available
      const db = client.db('tour-website');
      await db.collection('website-data').replaceOne(
        { _id: 'main' },
        { _id: 'main', ...data },
        { upsert: true }
      );
      console.log('Data saved to MongoDB successfully');
    } else {
      console.log('Data saved to in-memory storage (MongoDB not available)');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating website data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}