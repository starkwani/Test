import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Review } from '@/types';
import LazyImage from '@/components/LazyImage';
import { memo } from 'react';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = memo<ReviewCardProps>(({ review }) => {
  return (
    <Card className="h-full will-change-transform bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
            <div className="w-full h-full relative">
              <LazyImage
                src={review.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={review.name}
                fill
                sizes="48px"
                className="object-cover w-full h-full"
                quality={75}
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate">{review.name}</h4>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">{review.comment}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
});

ReviewCard.displayName = 'ReviewCard';

export default ReviewCard;