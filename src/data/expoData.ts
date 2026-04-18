// Expo Data - Brands Bridge Monthly Live Expo System

export interface ExpoSeller {
  name: string;
  title: string;
  email: string;
  whatsapp: string;
  languages: string[];
  products: string[];
  targetMarkets: string[];
  room?: string;
}

export interface ExpoApplication {
  id: string;
  companyId: string;
  companyName: string;
  country: string;
  flag: string;
  package: 'solo' | 'team' | 'squad' | 'enterprise';
  sellers: ExpoSeller[];
  payment: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  approvedDate?: string;
  expoHeadline?: string;
  specialOffer?: 'expo_discount' | 'free_sample' | 'express_shipping' | 'bulk_bonus';
  message?: string;
}

export interface ExpoPackage {
  id: string;
  name: string;
  sellers: number;
  rooms: number;
  price: number;
  meetings: number;
  popular: boolean;
  features: string[];
}

export interface Expo {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  registrationDeadline: string;
  status: 'upcoming' | 'registration_open' | 'live' | 'completed';
  maxCompanies: number;
  maxRooms: number;
  registeredCompanies: number;
  confirmedBuyers: number;
  totalRoomsBooked: number;
}

export interface ShippingExpoApplication {
  id: string;
  companyId: string;
  companyName: string;
  country: string;
  flag: string;
  package: 'logistics_partner';
  price: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  routes: string[];
  containerTypes: string[];
  discountOffer?: number;
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorWhatsapp: string;
  zone?: string;
}

export interface ExpoTestimonial {
  id: string;
  quote: string;
  author: string;
  company: string;
  country: string;
  flag: string;
  deals?: string;
}

// Upcoming Expo Data
export const upcomingExpo: Expo = {
  id: 'expo-may-2025',
  name: 'Brands Bridge Live Expo',
  date: '2025-05-29',
  startTime: '08:00',
  endTime: '20:00',
  timezone: 'GST (UTC+4)',
  registrationDeadline: '2025-05-25',
  status: 'registration_open',
  maxCompanies: 100,
  maxRooms: 500,
  registeredCompanies: 47,
  confirmedBuyers: 312,
  totalRoomsBooked: 124
};

// Expo Packages
export const expoPackages: ExpoPackage[] = [
  {
    id: 'solo',
    name: 'Solo',
    sellers: 1,
    rooms: 1,
    price: 149,
    meetings: 20,
    popular: false,
    features: [
      '1 Export Seller',
      '1 Live Deal Room',
      'Up to 20 buyer meetings',
      'Basic analytics'
    ]
  },
  {
    id: 'team',
    name: 'Team',
    sellers: 3,
    rooms: 3,
    price: 349,
    meetings: 60,
    popular: true,
    features: [
      '3 Export Sellers',
      '3 Simultaneous Live Rooms',
      'Up to 60 buyer meetings',
      'Full analytics + recordings'
    ]
  },
  {
    id: 'squad',
    name: 'Squad',
    sellers: 5,
    rooms: 5,
    price: 499,
    meetings: 100,
    popular: false,
    features: [
      '5 Export Sellers',
      '5 Simultaneous Live Rooms',
      'Up to 100 buyer meetings',
      'Priority buyer matching',
      'Featured in expo directory'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    sellers: 10,
    rooms: 10,
    price: 799,
    meetings: 999,
    popular: false,
    features: [
      '10 Export Sellers',
      '10 Simultaneous Live Rooms',
      'Unlimited buyer meetings',
      'VIP buyer queue',
      'Homepage featured banner',
      'Dedicated expo support'
    ]
  }
];

// Shipping Expo Package
export const shippingExpoPackage = {
  id: 'logistics_partner',
  name: 'Logistics Partner',
  price: 99,
  features: [
    'Listed in Logistics Zone',
    'Receive freight requests from all expo companies',
    'Submit live quotes',
    'Real-time cargo matching'
  ]
};

// Expo Routes for Shipping
export const availableRoutes = [
  'Istanbul → GCC ports',
  'Rotterdam → GCC ports',
  'Hamburg → GCC ports',
  'Singapore → GCC ports',
  'Shanghai → GCC ports',
  'Mumbai → GCC ports',
  'East Coast USA → GCC ports',
  'South America → GCC ports'
];

// Container Types
export const containerTypes = [
  '20ft Dry',
  '40ft Dry',
  '40ft High Cube',
  '20ft Reefer (Refrigerated)',
  '40ft Reefer (Refrigerated)',
  '20ft Open Top',
  '40ft Open Top'
];

// Expo Testimonials
export const expoTestimonials: ExpoTestimonial[] = [
  {
    id: 'test-1',
    quote: 'We closed 3 container orders worth $186,000 in a single day. This platform is a game-changer for FMCG trade.',
    author: 'Mohammed Al Kuwari',
    company: 'Al Meera Consumer Goods',
    country: 'Qatar',
    flag: '🇶🇦',
    deals: '$186,000 in deals'
  },
  {
    id: 'test-2',
    quote: 'Met 12 qualified buyers in 8 hours. Better than 5 days at Gulfood. And I never left my office.',
    author: 'Khalid Al Romaihi',
    company: 'Baladna Food Industries',
    country: 'Qatar',
    flag: '🇶🇦',
    deals: '12 qualified buyers'
  },
  {
    id: 'test-3',
    quote: 'Booked 4 full containers during the expo. Zero travel cost, zero hotel bills. Just pure business.',
    author: 'Ahmed Al Rashid',
    company: 'Al Othaim Markets',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    deals: '4 containers booked'
  }
];

// Sample Expo Applications
export const expoApplications: ExpoApplication[] = [
  {
    id: 'app-001',
    companyId: 'al-meera-consumer-goods',
    companyName: 'Al Meera Consumer Goods',
    country: 'Qatar',
    flag: '🇶🇦',
    package: 'team',
    sellers: [
      {
        name: 'Mohammed Al Kuwari',
        title: 'Export Manager',
        email: 'export@almeera.com.qa',
        whatsapp: '+97444123456',
        languages: ['AR', 'EN'],
        products: ['FMCG', 'Dairy'],
        targetMarkets: ['GCC', 'Europe'],
        room: 'A-12'
      },
      {
        name: 'Sara Al Jaber',
        title: 'Sales Manager',
        email: 'sales@almeera.com.qa',
        whatsapp: '+97444123457',
        languages: ['AR', 'EN'],
        products: ['Beverages', 'Snacks'],
        targetMarkets: ['GCC'],
        room: 'A-13'
      },
      {
        name: 'Khalid Hassan',
        title: 'Trade Specialist',
        email: 'trade@almeera.com.qa',
        whatsapp: '+97444123458',
        languages: ['AR'],
        products: ['FMCG'],
        targetMarkets: ['GCC', 'Africa'],
        room: 'A-14'
      }
    ],
    payment: 349,
    paymentStatus: 'paid',
    status: 'approved',
    submittedDate: '2025-01-28',
    approvedDate: '2025-01-29',
    expoHeadline: 'Premium Qatari FMCG — Direct from Doha',
    specialOffer: 'expo_discount'
  },
  {
    id: 'app-002',
    companyId: 'baladna-food',
    companyName: 'Baladna Food Industries',
    country: 'Qatar',
    flag: '🇶🇦',
    package: 'squad',
    sellers: [
      {
        name: 'Omar Hassan',
        title: 'Export Director',
        email: 'omar@baladna.com.qa',
        whatsapp: '+97444123460',
        languages: ['AR', 'EN'],
        products: ['Dairy', 'Beverages'],
        targetMarkets: ['GCC', 'Africa'],
        room: 'B-01'
      },
      {
        name: 'Fatima Al Meer',
        title: 'Sales Lead',
        email: 'fatima@baladna.com.qa',
        whatsapp: '+97444123461',
        languages: ['AR', 'EN'],
        products: ['Dairy'],
        targetMarkets: ['GCC'],
        room: 'B-02'
      },
      {
        name: 'Youssef Ahmed',
        title: 'Trade Manager',
        email: 'youssef@baladna.com.qa',
        whatsapp: '+97444123462',
        languages: ['AR', 'EN', 'FR'],
        products: ['Dairy', 'Beverages'],
        targetMarkets: ['GCC', 'Europe', 'Africa'],
        room: 'B-03'
      }
    ],
    payment: 499,
    paymentStatus: 'paid',
    status: 'approved',
    submittedDate: '2025-01-26',
    approvedDate: '2025-01-27',
    expoHeadline: 'Qatars Premier Dairy — Fresh from Farm to Gulf',
    specialOffer: 'free_sample'
  },
  {
    id: 'app-003',
    companyId: 'al-jazeera-food',
    companyName: 'Al Jazeera Food Co.',
    country: 'Qatar',
    flag: '🇶🇦',
    package: 'team',
    sellers: [
      {
        name: 'Ahmed Mohammed',
        title: 'Export Manager',
        email: 'export@aljazeerafood.com',
        whatsapp: '+97444123470',
        languages: ['AR', 'EN'],
        products: ['FMCG', 'Snacks', 'Beverages'],
        targetMarkets: ['GCC', 'Europe']
      },
      {
        name: 'Sara Al Jaber',
        title: 'Sales Executive',
        email: 'sales@aljazeerafood.com',
        whatsapp: '+97444123471',
        languages: ['AR', 'EN'],
        products: ['Snacks', 'Beverages'],
        targetMarkets: ['GCC']
      },
      {
        name: 'Khalid Hassan',
        title: 'Trade Coordinator',
        email: 'trade@aljazeerafood.com',
        whatsapp: '+97444123472',
        languages: ['AR'],
        products: ['FMCG'],
        targetMarkets: ['GCC', 'Africa']
      }
    ],
    payment: 349,
    paymentStatus: 'paid',
    status: 'pending',
    submittedDate: '2025-01-28',
    expoHeadline: 'Your One-Stop FMCG Partner from Qatar',
    message: 'We want to showcase our new product line to GCC buyers'
  },
  {
    id: 'app-004',
    companyId: 'ozmo-confectionery',
    companyName: 'OZMO Confectionery',
    country: 'Turkey',
    flag: '🇹🇷',
    package: 'squad',
    sellers: [
      {
        name: 'Mehmet Yilmaz',
        title: 'International Sales Director',
        email: 'mehmet@ozmo.com.tr',
        whatsapp: '+905551234560',
        languages: ['TR', 'EN', 'AR'],
        products: ['Confectionery', 'Chocolate', 'Snacks'],
        targetMarkets: ['GCC', 'Europe', 'Africa']
      },
      {
        name: 'Ayse Kaya',
        title: 'Export Sales Manager',
        email: 'ayse@ozmo.com.tr',
        whatsapp: '+905551234561',
        languages: ['TR', 'EN'],
        products: ['Chocolate', 'Biscuits'],
        targetMarkets: ['GCC', 'Europe']
      },
      {
        name: 'Ali Demir',
        title: 'Trade Development',
        email: 'ali@ozmo.com.tr',
        whatsapp: '+905551234562',
        languages: ['TR', 'EN', 'DE'],
        products: ['Confectionery'],
        targetMarkets: ['GCC', 'Europe']
      }
    ],
    payment: 499,
    paymentStatus: 'paid',
    status: 'pending',
    submittedDate: '2025-01-29',
    expoHeadline: 'Premium Turkish Sweets — Since 1978',
    message: 'Excited to connect with GCC distributors'
  }
];

// Sample Shipping Applications
export const shippingExpoApplications: ShippingExpoApplication[] = [
  {
    id: 'ship-001',
    companyId: 'gulf-shipping-co',
    companyName: 'Gulf Shipping Co.',
    country: 'UAE',
    flag: '🇦🇪',
    package: 'logistics_partner',
    price: 99,
    paymentStatus: 'paid',
    status: 'approved',
    submittedDate: '2025-01-25',
    routes: ['Istanbul → GCC ports', 'Singapore → GCC ports'],
    containerTypes: ['20ft Dry', '40ft Dry', '40ft High Cube', '20ft Reefer (Refrigerated)', '40ft Reefer (Refrigerated)'],
    discountOffer: 10,
    coordinatorName: 'Ahmed Al Hashimi',
    coordinatorEmail: 'ahmed@gulfshipping.ae',
    coordinatorWhatsapp: '+971501234567',
    zone: 'L-01'
  },
  {
    id: 'ship-002',
    companyId: 'al-maidenn-freight',
    companyName: 'Al Maidan Freight',
    country: 'Qatar',
    flag: '🇶🇦',
    package: 'logistics_partner',
    price: 99,
    paymentStatus: 'paid',
    status: 'approved',
    submittedDate: '2025-01-26',
    routes: ['Rotterdam → GCC ports', 'Hamburg → GCC ports'],
    containerTypes: ['20ft Dry', '40ft Dry', '40ft High Cube'],
    discountOffer: 5,
    coordinatorName: 'Hassan Al Kuwari',
    coordinatorEmail: 'hassan@almaidanfreight.com',
    coordinatorWhatsapp: '+97444123480',
    zone: 'L-02'
  }
];

// Expo History
export const expoHistory = [
  {
    id: 'expo-apr-2025',
    name: 'April 2025 Expo',
    date: '2025-04-24',
    companies: 18,
    buyers: 312,
    revenue: 8450,
    deals: 47,
    estimatedValue: 2400000,
    status: 'completed'
  },
  {
    id: 'expo-mar-2025',
    name: 'March 2025 Expo',
    date: '2025-03-27',
    companies: 12,
    buyers: 198,
    revenue: 5200,
    deals: 31,
    estimatedValue: 1450000,
    status: 'completed'
  },
  {
    id: 'expo-feb-2025',
    name: 'February 2025 Expo',
    date: '2025-02-27',
    companies: 8,
    buyers: 124,
    revenue: 3200,
    deals: 19,
    estimatedValue: 890000,
    status: 'completed'
  }
];

// Helper functions
export const getNextExpoDate = (): string => {
  const today = new Date();
  const may29 = new Date('2025-05-29');

  if (today <= may29) {
    return '2025-05-29';
  }

  // Calculate next Thursday of the month
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  let lastThursday = new Date(nextMonth.getTime());
  lastThursday.setDate(lastThursday.getDate() - 1);

  while (lastThursday.getDay() !== 4) {
    lastThursday.setDate(lastThursday.getDate() - 1);
  }

  return lastThursday.toISOString().split('T')[0];
};

export const formatExpoDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getExpoStatus = (expo: Expo): string => {
  const today = new Date();
  const expoDate = new Date(expo.date);
  const deadline = new Date(expo.registrationDeadline);

  if (today >= expoDate && today <= new Date(`${expo.date}T${expo.endTime}`)) {
    return 'live';
  }
  if (today > expoDate) {
    return 'completed';
  }
  if (today >= deadline) {
    return 'registration_closed';
  }
  return 'registration_open';
};
