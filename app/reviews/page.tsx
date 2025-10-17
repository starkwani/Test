'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import { useAdmin } from '@/contexts/AdminContext';

export default function ReviewsPage() {
  const { websiteData } = useAdmin();
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setReviewForm({ name: '', rating: 5, comment: '' });
        
        // Show success message for 3 seconds then close dialog
        setTimeout(() => {
          setSubmitSuccess(false);
          setIsDialogOpen(false);
        }, 3000);
      } else {
        alert(result.error || 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }

    setIsSubmitting(false);
  };

  if (!mounted) {
    return null;
  }

  const { reviews } = websiteData;
  const approvedReviews = reviews.filter(review => review.approved !== false);
  const averageRating = approvedReviews.length > 0 
    ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length 
    : 0;
  const totalReviews = approvedReviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: approvedReviews.filter(r => r.rating === rating).length,
    percentage: totalReviews > 0 ? (approvedReviews.filter(r => r.rating === rating).length / totalReviews) * 100 : 0
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="relative py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Customer Reviews</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Hear what our travelers have to say about their incredible experiences with us
          </p>
        </div>
      </section>

      {/* Review Stats */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Overall Rating */}
            <Card className="text-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {totalReviews > 0 ? averageRating.toFixed(1) : '0.0'}
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < Math.floor(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Based on {totalReviews} reviews</p>
              </CardContent>
            </Card>

            {/* Total Reviews */}
            <Card className="text-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{totalReviews}+</div>
                <p className="text-gray-600 dark:text-gray-300">Happy Customers</p>
              </CardContent>
            </Card>

            {/* Satisfaction Rate */}
            <Card className="text-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <CardContent className="p-8">
                <Award className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {totalReviews > 0 ? Math.round((approvedReviews.filter(r => r.rating >= 4).length / totalReviews) * 100) : 0}%
                </div>
                <p className="text-gray-600 dark:text-gray-300">Satisfaction Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Rating Distribution */}
          {totalReviews > 0 && (
            <Card className="mb-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Rating Distribution</h3>
                <div className="space-y-4">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 w-16">
                        <span className="font-medium text-gray-900 dark:text-white">{rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300 w-12">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real experiences from real travelers who've trusted us with their dream vacations
            </p>
          </div>

          {totalReviews > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {approvedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Be the first to share your travel experience with us!</p>
            </div>
          )}

          {/* CTA */}
          <div className="text-center">
            <Card className="inline-block bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Share Your Experience</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Traveled with us? We'd love to hear about your journey!
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      Leave a Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-white">Leave a Review</DialogTitle>
                    </DialogHeader>
                    
                    {submitSuccess ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Thank You!</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Your review has been submitted successfully! It will be reviewed by our team before being published.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Your Name *
                          </label>
                          <Input
                            id="review-name"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                            required
                            disabled={isSubmitting}
                            placeholder="Enter your full name"
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Rating *
                          </label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                disabled={isSubmitting}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-8 w-8 transition-colors ${
                                    star <= reviewForm.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {reviewForm.rating === 1 && "Poor"}
                            {reviewForm.rating === 2 && "Fair"}
                            {reviewForm.rating === 3 && "Good"}
                            {reviewForm.rating === 4 && "Very Good"}
                            {reviewForm.rating === 5 && "Excellent"}
                          </p>
                        </div>
                        <div>
                          <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Your Review *
                          </label>
                          <Textarea
                            id="review-comment"
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            rows={4}
                            required
                            disabled={isSubmitting}
                            placeholder="Tell us about your experience with our travel services..."
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isSubmitting}
                            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                          </Button>
                        </div>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Trusted by Thousands</h2>
            <p className="text-gray-600 dark:text-gray-300">Join our community of satisfied travelers</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <TrendingUp className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">98%</div>
              <div className="text-gray-600 dark:text-gray-300">Customer Retention</div>
            </div>
            <div>
              <Award className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">15+</div>
              <div className="text-gray-600 dark:text-gray-300">Industry Awards</div>
            </div>
            <div>
              <Users className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">5000+</div>
              <div className="text-gray-600 dark:text-gray-300">Happy Travelers</div>
            </div>
            <div>
              <Star className="h-12 w-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalReviews > 0 ? averageRating.toFixed(1) : '4.9'}/5
              </div>
              <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
