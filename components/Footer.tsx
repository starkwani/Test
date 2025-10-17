'use client';

import Link from 'next/link';
import { Plane, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

const Footer = () => {
  const { websiteData } = useAdmin();
  const { siteSettings, contactInfo } = websiteData;

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">{siteSettings.siteName}</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Creating extraordinary travel experiences that inspire and transform lives through carefully curated journeys around the world.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white text-sm transition-colors">Home</Link>
              <Link href="/packages" className="block text-gray-300 hover:text-white text-sm transition-colors">Tour Packages</Link>
              <Link href="/about" className="block text-gray-300 hover:text-white text-sm transition-colors">About Us</Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white text-sm transition-colors">Contact</Link>
              <Link href="/reviews" className="block text-gray-300 hover:text-white text-sm transition-colors">Reviews</Link>
            </div>
          </div>

          {/* Popular Destinations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Popular Destinations</h3>
            <div className="space-y-2">
              {siteSettings.popularDestinations.map((destination, index) => (
                <div key={index} className="text-gray-300 text-sm">{destination}</div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">{contactInfo.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">{contactInfo.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2024 {siteSettings.siteName}. All rights reserved. | Privacy Policy | Terms of Service
            </p>
            
            {/* Developer Credits */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">Developed with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span className="text-gray-400">by</span>
              <a 
                href="https://instagram.com/fay_salwani" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <Instagram className="h-4 w-4" />
                <span>fay_salwani</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;