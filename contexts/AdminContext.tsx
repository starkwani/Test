'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WebsiteData } from '@/types';
import { defaultWebsiteData } from '@/lib/data';

interface AdminContextType {
  isAuthenticated: boolean;
  websiteData: WebsiteData;
  sendOTP: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateWebsiteData: (data: WebsiteData) => Promise<void>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [websiteData, setWebsiteData] = useState<WebsiteData>(defaultWebsiteData);

  const refreshData = useCallback(async () => {
    try {
      const response = await fetch('/api/website-data', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setWebsiteData(data);
        
        // Update document title immediately when data changes
        if (typeof window !== 'undefined' && data.siteSettings.siteTitle) {
          document.title = data.siteSettings.siteTitle;
        }
        
        console.log('Website data refreshed successfully');
      } else {
        console.error('Failed to fetch website data');
        setWebsiteData(defaultWebsiteData);
      }
    } catch (error) {
      console.error('Error fetching website data:', error);
      setWebsiteData(defaultWebsiteData);
    } finally {
      // Add a small delay to ensure smooth loading transition
      setTimeout(() => setIsLoading(false), 100);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // Check authentication status from localStorage
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    // Load initial data only once
    refreshData();
  }, [refreshData]);

  // Update document title when websiteData changes
  useEffect(() => {
    if (typeof window !== 'undefined' && websiteData.siteSettings.siteTitle) {
      document.title = websiteData.siteSettings.siteTitle;
    }
  }, [websiteData.siteSettings.siteTitle]);

  const sendOTP = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Failed to send OTP' };
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  }, []);

  const updateWebsiteData = useCallback(async (data: WebsiteData) => {
    try {
      // Optimistically update the UI immediately
      setWebsiteData(data);
      
      // Update document title immediately
      if (typeof window !== 'undefined' && data.siteSettings.siteTitle) {
        document.title = data.siteSettings.siteTitle;
      }
      
      // Send to server
      const response = await fetch('/api/website-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Data updated successfully');
      } else {
        console.error('Failed to save data to server');
        // Revert optimistic update on failure
        await refreshData();
      }
    } catch (error) {
      console.error('Error updating website data:', error);
      // Revert optimistic update on failure
      await refreshData();
    }
  }, [refreshData]);

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      websiteData,
      sendOTP,
      verifyOTP,
      logout,
      updateWebsiteData,
      refreshData,
      isLoading
    }}>
      {children}
    </AdminContext.Provider>
  );
};
