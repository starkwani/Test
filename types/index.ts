export interface TourPackage {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discountedPrice?: number;
  duration: string;
  location: string;
  features: string[];
  rating: number;
  reviews: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  approved?: boolean;
  submittedAt?: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface AboutContent {
  title: string;
  description: string;
  mission: string;
  vision: string;
  whyChooseUs: string[];
  teamMembers: TeamMember[];
  missionVisionImage: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  description: string;
}

export interface SiteSettings {
  siteName: string;
  siteTitle: string;
  popularDestinations: string[];
  heroBackgroundImage: string;
}

export interface WebsiteData {
  tourPackages: TourPackage[];
  reviews: Review[];
  contactInfo: ContactInfo;
  aboutContent: AboutContent;
  siteSettings: SiteSettings;
}