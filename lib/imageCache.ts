// Image caching utility for better performance
interface CachedImage {
  url: string;
  blob: Blob;
  timestamp: number;
  expiryTime: number;
}

class ImageCacheManager {
  private cache: Map<string, CachedImage> = new Map();
  private readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly MAX_CACHE_SIZE = 50; // Maximum number of images to cache
  private readonly STORAGE_KEY = 'wanderlust_image_cache';

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
      this.cleanExpiredImages();
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Note: We can't store blobs in localStorage, so we'll only cache URLs
        // The actual blob caching will be in memory only
        Object.keys(data).forEach(url => {
          if (data[url].timestamp && Date.now() - data[url].timestamp < this.CACHE_DURATION) {
            // Mark as cached but don't load blob (will be fetched on demand)
            this.cache.set(url, {
              url,
              blob: new Blob(), // Placeholder
              timestamp: data[url].timestamp,
              expiryTime: data[url].expiryTime
            });
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load image cache from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data: Record<string, { timestamp: number; expiryTime: number }> = {};
      this.cache.forEach((cachedImage, url) => {
        data[url] = {
          timestamp: cachedImage.timestamp,
          expiryTime: cachedImage.expiryTime
        };
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save image cache to storage:', error);
    }
  }

  private cleanExpiredImages(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((cachedImage, url) => {
      if (now > cachedImage.expiryTime) {
        expiredKeys.push(url);
      }
    });

    expiredKeys.forEach(key => {
      this.cache.delete(key);
    });

    if (expiredKeys.length > 0) {
      this.saveToStorage();
    }
  }

  private enforceMaxSize(): void {
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, this.cache.size - this.MAX_CACHE_SIZE);
      toRemove.forEach(([url]) => {
        this.cache.delete(url);
      });
      
      this.saveToStorage();
    }
  }

  async getCachedImage(url: string): Promise<string | null> {
    const cached = this.cache.get(url);
    
    if (cached && Date.now() < cached.expiryTime) {
      // If we have a valid blob, return it
      if (cached.blob.size > 0) {
        return URL.createObjectURL(cached.blob);
      }
      
      // If we only have metadata, fetch the image
      try {
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          cached.blob = blob;
          return URL.createObjectURL(blob);
        }
      } catch (error) {
        console.warn('Failed to fetch cached image:', error);
      }
    }
    
    return null;
  }

  async cacheImage(url: string): Promise<string> {
    try {
      // Check if already cached and valid
      const cachedUrl = await this.getCachedImage(url);
      if (cachedUrl) {
        return cachedUrl;
      }

      // Fetch and cache the image
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      const now = Date.now();
      
      this.cache.set(url, {
        url,
        blob,
        timestamp: now,
        expiryTime: now + this.CACHE_DURATION
      });

      this.enforceMaxSize();
      this.saveToStorage();

      return URL.createObjectURL(blob);
    } catch (error) {
      console.warn('Failed to cache image:', error);
      return url; // Return original URL as fallback
    }
  }

  isCached(url: string): boolean {
    const cached = this.cache.get(url);
    return cached ? Date.now() < cached.expiryTime : false;
  }

  clearCache(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  getCacheStats(): { size: number; urls: string[] } {
    return {
      size: this.cache.size,
      urls: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const imageCache = new ImageCacheManager();

// Preload critical images
export const preloadCriticalImages = async (urls: string[]): Promise<void> => {
  const promises = urls.map(url => imageCache.cacheImage(url));
  try {
    await Promise.allSettled(promises);
    console.log('Critical images preloaded');
  } catch (error) {
    console.warn('Some critical images failed to preload:', error);
  }
};