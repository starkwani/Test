'use client';

import { useState, useEffect, memo, lazy, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star, Users, Award, Globe } from 'lucide-react';
import LazyImage from '@/components/LazyImage';
import DynamicMetadata from '@/components/DynamicMetadata';
import { useAdmin } from '@/contexts/AdminContext';
import { preloadCriticalImages } from '@/lib/imageCache';

// Lazy load components that are not immediately visible
const TourPackageCard = lazy(() => import('@/components/TourPackageCard'));

const StatCard = memo(({ icon: Icon, value, label }: { icon: any, value: string, label: string }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{value}</div>
    <div className="text-gray-600 dark:text-gray-300">{label}</div>
  </div>
));

StatCard.displayName = 'StatCard';

const FeatureCard = memo(({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <Card className="text-center h-full will-change-transform bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
    <CardContent className="p-6">
      <Icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </CardContent>
  </Card>
));

FeatureCard.displayName = 'FeatureCard';

// Loading skeleton for tour packages
const PackageCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-gray-300 dark:bg-gray-600"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
    </div>
  </div>
);

export default function Home() {
  const { websiteData, isLoading } = useAdmin();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Preload critical images for better performance
    if (!isLoading && websiteData.siteSettings.heroBackgroundImage) {
      const criticalImages = [
        websiteData.siteSettings.heroBackgroundImage,
        ...websiteData.tourPackages.slice(0, 3).map(pkg => pkg.image)
      ];
      preloadCriticalImages(criticalImages);
    }
  }, [isLoading, websiteData]);

  // Safely get featured packages - must be called unconditionally
  const featuredPackages = useMemo(() => {
    return mounted && !isLoading ? websiteData.tourPackages.slice(0, 3) : [];
  }, [mounted, isLoading, websiteData.tourPackages]);

  // Show loading state until fully mounted and data is loaded
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section Skeleton */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 w-full h-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <div className="h-16 bg-white/20 rounded mb-6 animate-pulse"></div>
            <div className="h-8 bg-white/20 rounded mb-8 animate-pulse"></div>
            <div className="flex space-x-4 justify-center">
              <div className="h-12 w-32 bg-white/20 rounded animate-pulse"></div>
              <div className="h-12 w-32 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </section>
        
        {/* Stats Section Skeleton */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Packages Skeleton */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded mb-4 max-w-md mx-auto animate-pulse"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded max-w-3xl mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <DynamicMetadata />
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 w-full h-full">
            <LazyImage
              src={websiteData.siteSettings.heroBackgroundImage}
              alt="Hero Background"
              fill
              sizes="100vw"
              className="object-cover w-full h-full"
              priority
              quality={85}
            />
            <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
          </div>
          
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in text-white">
              Discover Incredible
              <span className="block text-blue-400 dark:text-blue-300">India</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 text-white">
              Experience the diversity and beauty of India with our carefully curated luxury travel packages
            </p>
            <div className="space-x-4 hero-cta-button">
              <Button asChild size="lg" className="mb-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-lg px-8 py-4 transition-colors duration-200 text-white font-semibold">
                <Link href="/packages">
                  <span className="btn-text">Explore Packages</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hero-button-outline text-lg px-8 py-4 transition-all duration-300 font-semibold">
                <Link href="/about">
                  <span className="btn-text">Learn More</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard icon={null} value="10+" label="Years Experience" />
              <StatCard icon={null} value="25+" label="Indian Destinations" />
              <StatCard icon={null} value="5000+" label="Happy Travelers" />
              <StatCard icon={null} value="4.9" label="Average Rating" />
            </div>
          </div>
        </section>

        {/* Featured Packages */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Destinations</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover our most popular Indian travel packages, carefully crafted to provide unforgettable experiences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <Suspense fallback={
                <>
                  <PackageCardSkeleton />
                  <PackageCardSkeleton />
                  <PackageCardSkeleton />
                </>
              }>
                {featuredPackages.map((pkg) => (
                  <TourPackageCard key={pkg.id} package={pkg} />
                ))}
              </Suspense>
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200">
                <Link href="/packages">
                  View All Packages
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose {websiteData.siteSettings.siteName}?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We provide exceptional Indian travel experiences with unmatched service and attention to detail
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={Star} 
                title="Expert Guides" 
                description="Local experts with deep cultural knowledge and passion for Indian heritage." 
              />
              <FeatureCard 
                icon={Users} 
                title="Small Groups" 
                description="Intimate group sizes for personalized attention and authentic Indian experiences." 
              />
              <FeatureCard 
                icon={Award} 
                title="Award Winning" 
                description="Recognized for excellence in Indian travel services and customer satisfaction." 
              />
              <FeatureCard 
                icon={Globe} 
                title="Pan-India Network" 
                description="Extensive partnerships ensuring seamless travel experiences across India." 
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 dark:bg-blue-800 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-4 text-white">Ready for Your Indian Adventure?</h2>
            <p className="text-xl mb-8 opacity-90 text-white">
              Join thousands of satisfied travelers who have experienced incredible India with us
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" variant="secondary" className="mb-2 text-lg px-8 py-4 transition-colors duration-200 bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-800 dark:hover:bg-gray-200">
                <Link href="/packages">Start Planning</Link>
              </Button>
              <Button asChild size="lg" className="text-lg px-8 py-4 border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-600 dark:hover:text-blue-800 transition-all duration-300">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
