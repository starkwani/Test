'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Award, Users, Globe, Heart } from 'lucide-react';
import LazyImage from '@/components/LazyImage';
import { useAdmin } from '@/contexts/AdminContext';

// Lazy load heavy components
const TeamMemberCard = lazy(() => import('@/components/TeamMemberCard'));

// Loading skeleton for team members
const TeamMemberSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
    <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3 w-3/4 mx-auto"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
  </div>
);

export default function AboutPage() {
  const { websiteData, isLoading } = useAdmin();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state until fully mounted and data is loaded
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
        {/* Header Skeleton */}
        <section className="relative py-24 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-12 bg-white/20 rounded mb-6 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded max-w-3xl mx-auto animate-pulse"></div>
          </div>
        </section>
        
        {/* Content Skeleton */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
              <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const { aboutContent } = websiteData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="relative py-24 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">{aboutContent.title}</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {aboutContent.description}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                {aboutContent.mission}
              </p>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {aboutContent.vision}
              </p>
            </div>
            
            <div className="relative w-full h-96">
              <LazyImage
                src={aboutContent.missionVisionImage}
                alt="Our Team"
                fill
                className="rounded-lg shadow-lg object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We stand out from the crowd with our commitment to excellence and personalized service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {aboutContent.whyChooseUs.map((reason, index) => (
              <Card key={index} className="text-center will-change-transform bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <p className="text-gray-700 dark:text-gray-300">{reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center will-change-transform bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Excellence</h3>
                <p className="text-gray-600 dark:text-gray-300">We strive for perfection in every detail of your journey.</p>
              </CardContent>
            </Card>

            <Card className="text-center will-change-transform bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Community</h3>
                <p className="text-gray-600 dark:text-gray-300">We build lasting relationships with travelers and local communities.</p>
              </CardContent>
            </Card>

            <Card className="text-center will-change-transform bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <Globe className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Sustainability</h3>
                <p className="text-gray-600 dark:text-gray-300">We promote responsible tourism that benefits everyone.</p>
              </CardContent>
            </Card>

            <Card className="text-center will-change-transform bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <Heart className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Passion</h3>
                <p className="text-gray-600 dark:text-gray-300">Our love for travel drives us to create extraordinary experiences.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Passionate travel experts dedicated to making your dreams come true
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Suspense fallback={
              <>
                <TeamMemberSkeleton />
                <TeamMemberSkeleton />
                <TeamMemberSkeleton />
              </>
            }>
              {aboutContent.teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
