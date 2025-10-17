'use client';

import { useEffect } from 'react';
import { preloadCriticalImages } from '@/lib/imageCache';
import { useAdmin } from '@/contexts/AdminContext';

const ImagePreloader = () => {
  const { websiteData, isLoading } = useAdmin();

  useEffect(() => {
    if (!isLoading && websiteData) {
      // Preload critical images in the background
      const criticalImages = [
        websiteData.siteSettings.heroBackgroundImage,
        ...websiteData.tourPackages.slice(0, 6).map(pkg => pkg.image),
        websiteData.aboutContent.missionVisionImage,
        ...websiteData.aboutContent.teamMembers.map(member => member.image),
        ...websiteData.reviews.slice(0, 4).map(review => review.avatar).filter(Boolean)
      ].filter(Boolean) as string[];

      // Preload images with a slight delay to not interfere with initial page load
      setTimeout(() => {
        preloadCriticalImages(criticalImages);
      }, 1000);
    }
  }, [websiteData, isLoading]);

  return null; // This component doesn't render anything
};

export default ImagePreloader;