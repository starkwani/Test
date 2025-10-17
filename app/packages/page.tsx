'use client';

import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

// Lazy load the tour package card component
const TourPackageCard = lazy(() => import('@/components/TourPackageCard'));

// Loading skeleton for packages
const PackageCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-gray-300 dark:bg-gray-600"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
      <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  </div>
);

export default function PackagesPage() {
  const { websiteData, isLoading } = useAdmin();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  // Prevent hydration mismatch by using empty array until mounted
  const [filteredPackages, setFilteredPackages] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize packages to prevent unnecessary re-renders
  const packages = useMemo(() => {
    return mounted && !isLoading ? websiteData.tourPackages : [];
  }, [mounted, isLoading, websiteData.tourPackages]);

  useEffect(() => {
    if (!mounted || isLoading) {
      setFilteredPackages([]);
      return;
    }
    
    let filtered = packages.filter(pkg =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort packages
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredPackages(filtered);
  }, [searchTerm, sortBy, packages, mounted, isLoading]);

  // Show loading state until fully mounted and data is loaded
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
        {/* Header Skeleton */}
        <section className="relative py-24 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-12 bg-white/20 rounded mb-6 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded max-w-3xl mx-auto animate-pulse"></div>
          </div>
        </section>
        
        {/* Filters Skeleton */}
        <section className="py-8 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded max-w-md flex-1 animate-pulse"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-48 animate-pulse"></div>
            </div>
          </div>
        </section>
        
        {/* Packages Grid Skeleton */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="relative py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Tour Packages</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Discover our curated collection of extraordinary travel experiences around the world
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectItem value="name" className="text-gray-900 dark:text-white">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low" className="text-gray-900 dark:text-white">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high" className="text-gray-900 dark:text-white">Price (High to Low)</SelectItem>
                  <SelectItem value="rating" className="text-gray-900 dark:text-white">Rating (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Suspense fallback={
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PackageCardSkeleton key={i} />
                  ))}
                </>
              }>
                {filteredPackages.map((pkg) => (
                  <TourPackageCard key={pkg.id} package={pkg} />
                ))}
              </Suspense>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No packages found matching your criteria.</p>
              <Button 
                onClick={() => setSearchTerm('')}
                className="mt-4"
                variant="outline"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
