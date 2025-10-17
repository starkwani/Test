import { WebsiteData } from '@/types';

export const defaultWebsiteData: WebsiteData = {
  siteSettings: {
    siteName: 'Elven Escapes',
    siteTitle: 'Elven Escapes | Tour and Travels',
    heroBackgroundImage: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1920',
    popularDestinations: [
      'Goa, India',
      'Kerala Backwaters',
      'Rajasthan Heritage',
      'Himachal Pradesh',
      'Kashmir Valley',
      'Andaman Islands'
    ]
  },
  tourPackages: [
    {
      id: '1',
      name: 'Goa Beach Paradise',
      description: 'Experience the magic of Goa with pristine beaches, Portuguese heritage, and vibrant nightlife.',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 25000,
      discountedPrice: 19999,
      duration: '5 Days / 4 Nights',
      location: 'Goa, India',
      features: ['Beach Resort', 'All Meals Included', 'Airport Transfers', 'Water Sports', 'Sightseeing'],
      rating: 4.8,
      reviews: 124
    },
    {
      id: '2',
      name: 'Kerala Backwater Cruise',
      description: 'Serene backwaters, lush greenery, and traditional houseboats in God\'s Own Country.',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 35000,
      discountedPrice: 29999,
      duration: '6 Days / 5 Nights',
      location: 'Kerala, India',
      features: ['Houseboat Stay', 'Ayurvedic Spa', 'Local Cuisine', 'Tea Plantation Visit', 'Cultural Shows'],
      rating: 4.9,
      reviews: 89
    },
    {
      id: '3',
      name: 'Rajasthan Royal Heritage',
      description: 'Majestic palaces, desert safaris, and royal culture in the Land of Kings.',
      image: 'https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 45000,
      discountedPrice: 39999,
      duration: '8 Days / 7 Nights',
      location: 'Rajasthan, India',
      features: ['Palace Hotels', 'Desert Safari', 'Camel Rides', 'Folk Performances', 'Heritage Tours'],
      rating: 5.0,
      reviews: 156
    },
    {
      id: '4',
      name: 'Himachal Hill Station',
      description: 'Snow-capped mountains, adventure activities, and scenic beauty in the Himalayas.',
      image: 'https://images.pexels.com/photos/161251/senso-ji-temple-japan-kyoto-landmark-161251.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 32000,
      discountedPrice: 27999,
      duration: '7 Days / 6 Nights',
      location: 'Himachal Pradesh, India',
      features: ['Mountain Resort', 'Adventure Sports', 'Scenic Drives', 'Local Markets', 'Temple Visits'],
      rating: 4.7,
      reviews: 98
    },
    {
      id: '5',
      name: 'Kashmir Valley Experience',
      description: 'Paradise on Earth with Dal Lake, Mughal gardens, and breathtaking landscapes.',
      image: 'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 38000,
      discountedPrice: 33999,
      duration: '6 Days / 5 Nights',
      location: 'Kashmir, India',
      features: ['Houseboat Stay', 'Shikara Rides', 'Garden Tours', 'Local Handicrafts', 'Mountain Views'],
      rating: 4.9,
      reviews: 142
    },
    {
      id: '6',
      name: 'Andaman Island Getaway',
      description: 'Crystal clear waters, coral reefs, and pristine beaches in the Bay of Bengal.',
      image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 42000,
      discountedPrice: 37999,
      duration: '7 Days / 6 Nights',
      location: 'Andaman Islands, India',
      features: ['Beach Resort', 'Scuba Diving', 'Island Hopping', 'Water Sports', 'Seafood Cuisine'],
      rating: 4.6,
      reviews: 87
    }
  ],
  reviews: [
    {
      id: '1',
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Absolutely incredible experience! The Goa package exceeded all my expectations. The accommodations were luxurious and the local guides were fantastic.',
      date: '2024-01-15',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      approved: true
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'The Kerala backwater cruise was breathtaking! Every detail was perfectly planned. Highly recommend Elven Escapes Tour and Travels for anyone seeking quality travel experiences.',
      date: '2024-01-10',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      approved: true
    },
    {
      id: '3',
      name: 'Anita Patel',
      rating: 4,
      comment: 'Amazing trip to Rajasthan! The cultural experiences were authentic and the accommodations were excellent. Great value for money.',
      date: '2024-01-05',
      avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150',
      approved: true
    },
    {
      id: '4',
      name: 'Vikram Singh',
      rating: 5,
      comment: 'The Kashmir valley experience was a once-in-a-lifetime journey! The houseboat stay and shikara rides were unforgettable.',
      date: '2023-12-28',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      approved: true
    }
  ],
  contactInfo: {
    address: 'Kadlabal Pampore, Jammu and Kashmir 192121, India',
    phone: '+916005814691',
    email: 'Elvenescapestourandtravels@gmail.com',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.3076413739973!2d74.908367!3d34.0103134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e18b228475a135%3A0x1be1a8e1768ee104!2sElven%20Escapes%20Tour%20And%20Travels!5e0!3m2!1sen!2sin!4v1751195507371!5m2!1sen!2sin',
    coordinates: {
      lat: 34.010384548193876,
      lng: 74.90837772883583
    }, 
  },
  aboutContent: {
    title: 'About Elven Escapes Tour and Travels',
    description: 'For over a decade, Elven Escapes Tour and Travles has been crafting extraordinary travel experiences across India that create lasting memories. We specialize in curated luxury tours that combine adventure, culture, and comfort.',
    mission: 'Our mission is to inspire and enable people to explore the incredible diversity of India through carefully designed travel experiences that showcase the beauty, culture, and wonder of each destination.',
    vision: 'To be India\'s most trusted travel companion, creating transformative journeys that broaden perspectives and create lifelong memories while promoting sustainable tourism.',
    missionVisionImage: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
    whyChooseUs: [
      'Expert local guides with deep cultural knowledge',
      'Handpicked accommodations for comfort and authenticity',
      'Small group sizes for personalized experiences',
      '24/7 customer support throughout your journey',
      'Sustainable tourism practices',
      'Best price guarantee with transparent pricing'
    ],
    teamMembers: [
      {
        id: '1',
        name: 'Arjun Mehta',
        role: 'Founder & CEO',
        image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'With over 15 years in luxury travel across India, Arjun founded Elven Escapes Tour and Travles to share his passion for extraordinary Indian experiences.'
      },
      {
        id: '2',
        name: 'Kavya Sharma',
        role: 'Head of Operations',
        image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Kavya ensures every detail of your journey is perfectly planned and executed with precision and care, bringing 12 years of operational excellence.'
      },
      {
        id: '3',
        name: 'Rohit Gupta',
        role: 'Customer Experience Director',
        image: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Rohit leads our customer service team, ensuring every traveler feels valued and supported throughout their incredible Indian journey.'
      }
    ]
  }
};