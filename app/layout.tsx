import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AdminProvider } from '@/contexts/AdminContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
});

// Loading component for Suspense fallbacks
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch website data on the server
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/website-data`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        title: data.siteSettings.siteTitle,
        description: `${data.siteSettings.siteName} - Premium travel experiences across India. Discover our curated collection of extraordinary Indian travel packages and create unforgettable memories.`,
        keywords: 'travel, tours, vacation, luxury travel, adventure, travel packages, destinations, wanderlust, india travel, indian tours',
        authors: [{ name: data.siteSettings.siteName }],
        creator: data.siteSettings.siteName,
        publisher: data.siteSettings.siteName,
        formatDetection: {
          email: false,
          address: false,
          telephone: false,
        },
        metadataBase: new URL(baseUrl),
        alternates: {
          canonical: baseUrl,
        },
        openGraph: {
          title: data.siteSettings.siteTitle,
          description: `${data.siteSettings.siteName} - Premium travel experiences across India`,
          url: baseUrl,
          siteName: data.siteSettings.siteName,
          type: 'website',
          locale: 'en_IN',
          images: [
            {
              url: data.siteSettings.heroBackgroundImage,
              width: 1200,
              height: 630,
              alt: `${data.siteSettings.siteName} - Indian Travel Experiences`,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: data.siteSettings.siteTitle,
          description: `${data.siteSettings.siteName} - Premium travel experiences across India`,
          images: [data.siteSettings.heroBackgroundImage],
        },
        robots: {
          index: true,
          follow: true,
          nocache: false,
          googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
        icons: {
          icon: '/favicon.ico',
        },
        manifest: '/manifest.json',
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  // Fallback metadata
  return {
    title: 'Elven Escapes | Tour and Travles',
    description: 'Elven Escapes Tour and Travles - Premium travel experiences across India. Discover our curated collection of extraordinary Indian travel packages and create unforgettable memories.',
    keywords: 'travel, tours, vacation, luxury travel, adventure, travel packages, destinations, wanderlust, india travel, indian tours',
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    icons: {
      icon: '/favicon.ico',
    },
    manifest: '/manifest.json',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var initialTheme = theme || systemTheme;
                  document.documentElement.classList.add(initialTheme);
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider>
          <AdminProvider>
            <div className="min-h-screen flex flex-col">
              <Suspense fallback={
                <div className="h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50 flex items-center justify-between px-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-blue-600 rounded"></div>
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="hidden md:flex space-x-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              }>
                <Navbar />
              </Suspense>
              <main className="flex-1 pt-16">
                <Suspense fallback={<LoadingSpinner />}>
                  {children}
                </Suspense>
              </main>
              <Suspense fallback={<div className="bg-gray-900 dark:bg-gray-800 h-64" />}>
                <Footer />
              </Suspense>
            </div>
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}