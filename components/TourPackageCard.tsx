'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, MessageCircle } from 'lucide-react';
import { TourPackage } from '@/types';
import LazyImage from '@/components/LazyImage';
import { memo, useCallback } from 'react';

interface TourPackageCardProps {
  package: TourPackage;
}

const TourPackageCard = memo<TourPackageCardProps>(({ package: pkg }) => {
  const handleWhatsAppContact = useCallback(() => {
    const message = `Hi! I'm interested in the "${pkg.name}" tour package. Could you please provide more details?`;
    const phoneNumber = '+916005814691'; // Indian phone number
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }, [pkg.name]);

  const discountPercentage = pkg.discountedPrice 
    ? Math.round(((pkg.price - pkg.discountedPrice) / pkg.price) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col will-change-transform bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] relative bg-gray-200 dark:bg-gray-700">
          <LazyImage
            src={pkg.image}
            alt={pkg.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            quality={80}
          />
        </div>
        {pkg.discountedPrice && (
          <Badge className="absolute top-4 left-4 bg-red-500 text-white">
            {discountPercentage}% OFF
          </Badge>
        )}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{pkg.rating}</span>
          <span className="text-xs text-gray-600 dark:text-gray-400">({pkg.reviews})</span>
        </div>
      </div>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{pkg.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 flex-1">{pkg.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{pkg.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{pkg.duration}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {pkg.features.slice(0, 5).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {feature}
            </Badge>
          ))}
          {pkg.features.length > 3 && (
            <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
              +{pkg.features.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {pkg.discountedPrice ? (
              <>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatPrice(pkg.discountedPrice)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(pkg.price)}
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(pkg.price)}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={handleWhatsAppContact}
          className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white transition-colors duration-200"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact via WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
});

TourPackageCard.displayName = 'TourPackageCard';

export default TourPackageCard;
