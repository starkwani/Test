'use client';

import { useAdmin } from '@/contexts/AdminContext';
import { useEffect } from 'react';

export default function DynamicMetadata() {
  const { websiteData, isLoading } = useAdmin();

  useEffect(() => {
    // Only update if not loading and we have data
    if (!isLoading && websiteData.siteSettings.siteTitle) {
      // Update document title
      document.title = websiteData.siteSettings.siteTitle;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `${websiteData.siteSettings.siteName} - Premium travel experiences around the world`
        );
      } else {
        const newMetaDescription = document.createElement('meta');
        newMetaDescription.name = 'description';
        newMetaDescription.content = `${websiteData.siteSettings.siteName} - Premium travel experiences around the world`;
        document.head.appendChild(newMetaDescription);
      }

      // Update Open Graph title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', websiteData.siteSettings.siteTitle);
      } else {
        const newOgTitle = document.createElement('meta');
        newOgTitle.setAttribute('property', 'og:title');
        newOgTitle.content = websiteData.siteSettings.siteTitle;
        document.head.appendChild(newOgTitle);
      }

      // Update Open Graph site name
      const ogSiteName = document.querySelector('meta[property="og:site_name"]');
      if (ogSiteName) {
        ogSiteName.setAttribute('content', websiteData.siteSettings.siteName);
      } else {
        const newOgSiteName = document.createElement('meta');
        newOgSiteName.setAttribute('property', 'og:site_name');
        newOgSiteName.content = websiteData.siteSettings.siteName;
        document.head.appendChild(newOgSiteName);
      }
    }
  }, [websiteData.siteSettings.siteTitle, websiteData.siteSettings.siteName, isLoading]);

  return null;
}