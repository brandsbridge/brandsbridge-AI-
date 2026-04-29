// Mock Data for CMS-Ready Structure - DIGITAL FOOD EXPO
// This structure supports Webflow CMS and future VR integration

export interface CompanyReview {
  buyerId: string;
  rating: number;
  comment?: string;
  dealId?: string;
  date: string;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
  country: string;
  countryFlag: string;
  city: string;
  businessType: 'Manufacturer' | 'Exporter' | 'Importer' | 'Distributor' | 'Agent';
  categories: string[];
  exportCountries: string[];
  yearEstablished: number;
  employees: string;
  certifications: string[];
  website: string;
  whatsapp: string;
  email: string;
  exportManager: {
    name: string;
    email: string;
    whatsapp: string;
  };
  salesManager: {
    name: string;
    email: string;
  };
  gallery: string[];
  featured: boolean;
  verified: boolean;
  subscriptionPlan: 'Free' | 'Basic' | 'Premium' | 'Expo';
  joinDate: string;
  // Virtual Booth Features (Phase 2)
  boothNumber?: string;
  virtualTourUrl?: string;
  factoryVideoUrl?: string;
  productCatalogUrl?: string;
  minOrderValue?: string;
  leadTime?: string;
  paymentTerms?: string[];
  shippingPorts?: string[];
  // Virtual Booth Full Data
  videoId?: string;
  factoryImage?: string;
  products?: Product[];
  milestones?: { year: string; event: string }[];
  isLive?: boolean;
  exportCount?: number;
  monthlyContainers?: number;
  contactPerson?: {
    name: string;
    title: string;
    photo?: string;
    languages: string[];
  };
  activeCargo?: {
    product: string;
    containerType: string;
    route: string;
    price: number;
  };
  // Additional fields
  internationalSalesEmail?: string;
  googleMeetLink?: string;
  // Claim System
  status?: 'claimed' | 'unclaimed';
  profileViews?: number;
  pendingInquiries?: number;
  // AI Reliability Engine inputs (Step 3)
  // KYB & Compliance
  kybStatus?: 'verified' | 'pending' | 'none';
  documentsUploaded?: string[];
  documentsRequired?: string[];
  // Performance metrics
  avgResponseTimeHours?: number;
  completedDeals?: number;
  joinedDate?: string;
  // Reviews
  reviews?: CompanyReview[];
}

export interface Product {
  id: string;
  name: string;
  image: string;
  priceRange: string;
  unit: string;
  moq: string;
  leadTime: string;
  certifications: string[];
}

// Meeting Request System
export interface MeetingRequest {
  id: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  // Client Information
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  clientCountry: string;
  clientPhone?: string;
  // Meeting Details
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  meetingType: 'video' | 'voice';
  googleMeetLink?: string;
  // Inquiry
  productInterest: string;
  message: string;
  estimatedVolume?: string;
  // Status & Timestamps
  status: MeetingStatus;
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string;
  confirmationToken?: string;
  // Notifications
  companyNotified: boolean;
  clientNotified: boolean;
  adminNotified: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  companyCount: number;
}

export interface Country {
  id: string;
  slug: string;
  name: string;
  flag: string;
  region: string;
  code: string;
  companyCount: number;
}

export type MeetingStatus = 'pending' | 'accepted' | 'declined' | 'confirmed' | 'completed' | 'cancelled';

export interface MeetingRequest {
  id: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  // Client Information
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  clientCountry: string;
  clientPhone?: string;
  // Meeting Details
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  meetingType: 'video' | 'voice';
  googleMeetLink?: string;
  // Inquiry
  productInterest: string;
  message: string;
  estimatedVolume?: string;
  // Status & Timestamps
  status: MeetingStatus;
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string;
  confirmationToken?: string;
  // Notifications
  companyNotified: boolean;
  clientNotified: boolean;
  adminNotified: boolean;
}

export interface CommodityPrice {
  id: string;
  commodity: string;
  unit: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  date: string;
  source: string;
  region: string;
  category: 'dairy' | 'sugar' | 'oil';
}

// ============================================
// BRANDS BRIDGE AI AGENTS SYSTEM
// ============================================

export type AgentType = 'buyer' | 'seller' | 'matchmaker' | 'market-watch';

export interface AgentMessage {
  id: string;
  role: 'agent' | 'user';
  content: string;
  timestamp: string;
  agentType?: AgentType;
  metadata?: {
    companies?: string[];
    products?: string[];
    priceAlert?: boolean;
    meetingScheduled?: boolean;
    quotationGenerated?: boolean;
  };
}

export interface AgentConversation {
  id: string;
  agentType: AgentType;
  userId: string;
  companyId?: string;
  messages: AgentMessage[];
  status: 'active' | 'resolved' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  language: string;
}

export interface BuyerInquiry {
  id: string;
  buyerName: string;
  buyerCompany: string;
  buyerCountry: string;
  buyerEmail: string;
  productCategory: string;
  productDescription: string;
  quantity: string;
  targetPrice: string;
  deliveryTerms: string;
  timeline: string;
  certifications: string[];
  status: 'new' | 'matched' | 'quoted' | 'negotiating' | 'closed';
  matchedCompanies: string[];
  createdAt: string;
}

export interface SellerQuotation {
  id: string;
  sellerId: string;
  buyerInquiryId: string;
  productName: string;
  quantity: string;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  incoterms: string;
  paymentTerms: string;
  deliveryTime: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  commodity: string;
  condition: 'above' | 'below' | 'change';
  threshold: number;
  isActive: boolean;
  lastTriggered?: string;
  createdAt: string;
}

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  phase: 'mvp' | 'advanced';
}

// Walk-in Buyer Interface (no account required)
export interface WalkinBuyer {
  id: string;
  name: string;
  company: string;
  country: string;
  countryFlag: string;
  whatsapp: string;
  email: string;
  products: string[];
  targetCountries: string[];
  registrationTime: string;
  checkedIn: boolean;
  checkInTime?: string;
  meetingsHeld: number;
  cardsCollected: number;
  notes?: string;
}

// Pre-Registered Buyer Interface
export interface PreRegisteredBuyer {
  id: string;
  name: string;
  company: string;
  country: string;
  countryFlag: string;
  email: string;
  whatsapp: string;
  productInterests: string[];
  targetCountries: string[];
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'attended' | 'no-show';
  meetingsScheduled: number;
  meetingsCompleted: number;
  attendedSessions: string[];
}

// Expo Room Status
export interface ExpoRoom {
  id: string;
  companyId: string;
  companyName: string;
  companyFlag: string;
  sellerName: string;
  sellerTitle: string;
  sellerLanguages: string[];
  products: string[];
  status: 'available' | 'busy' | 'full' | 'live' | 'ended' | 'queued';
  waitingCount: number;
  estimatedWait: number; // minutes
  accessCode: string;
  totalMeetings: number;
  totalDeals: number;
  dealValue: number;
}

// Agent Definitions with Capabilities
export const agentDefinitions = {
  buyer: {
    id: 'buyer-agent',
    name: 'Buyer Agent',
    title: 'Your Personal Trade Assistant',
    description: 'I help you find the perfect suppliers, compare prices, and handle all communications. Tell me what you need, and I\'ll do the work.',
    avatar: '/agents/buyer-agent.svg',
    color: '#D4AF37',
    greeting: {
      en: "Hello! I'm your personal Buyer Agent. What products are you looking for today?",
      ar: "مرحباً! أنا وكيل المشتريات الخاص بك. ما المنتجات التي تبحث عنها اليوم؟",
      tr: "Merhaba! Ben sizin Alıcı Temsilcinizim. Bugün hangi ürünleri arıyorsunuz?",
      es: "¡Hola! Soy tu Agente de Compras personal. ¿Qué productos estás buscando hoy?",
      fr: "Bonjour! Je suis votre Agent Acheteur personnel. Quels produits recherchez-vous aujourd'hui?",
      de: "Hallo! Ich bin Ihr persönlicher Einkaufsagent. Nach welchen Produkten suchen Sie heute?",
      zh: "您好！我是您的专属采购代理。您今天需要什么产品？",
      ru: "Здравствуйте! Я ваш персональный Агент по закупкам. Какие продукты вы ищете сегодня?"
    },
    capabilities: [
      { id: 'search', name: 'Smart Search', description: 'Find suppliers by product, category, country, or certification', phase: 'mvp' },
      { id: 'filter', name: 'Advanced Filtering', description: 'Filter by MOQ, lead time, payment terms, and shipping ports', phase: 'mvp' },
      { id: 'message', name: 'Write Messages', description: 'Draft professional inquiry messages to suppliers', phase: 'mvp' },
      { id: 'schedule', name: 'Schedule Meetings', description: 'Book video or voice calls with suppliers', phase: 'mvp' },
      { id: 'alerts', name: 'Product Alerts', description: 'Get notified when new matching suppliers join', phase: 'advanced' },
      { id: 'negotiate', name: 'Price Negotiation', description: 'Help negotiate better terms with suppliers', phase: 'advanced' },
      { id: 'compare', name: 'Supplier Comparison', description: 'Generate comparison reports across suppliers', phase: 'advanced' }
    ]
  },
  seller: {
    id: 'seller-agent',
    name: 'Seller Agent',
    title: 'Your Virtual Export Manager',
    description: 'I manage your booth, handle buyer inquiries, create quotations, and prioritize leads. Your 24/7 trade representative.',
    avatar: '/agents/seller-agent.svg',
    color: '#CD7F32',
    greeting: {
      en: "Welcome! I'm managing inquiries for your company. How can I assist you today?",
      ar: "مرحباً! أنا أدير الاستفسارات لشركتك. كيف يمكنني مساعدتك اليوم؟",
      tr: "Hoş geldiniz! Şirketiniz için talepleri yönetiyorum. Size bugün nasıl yardımcı olabilirim?",
      es: "¡Bienvenido! Estoy gestionando las consultas de su empresa. ¿Cómo puedo ayudarle hoy?",
      fr: "Bienvenue! Je gère les demandes pour votre entreprise. Comment puis-je vous aider aujourd'hui?",
      de: "Willkommen! Ich verwalte Anfragen für Ihr Unternehmen. Wie kann ich Ihnen heute helfen?",
      zh: "欢迎！我正在为贵公司管理询价。今天我能为您提供什么帮助？",
      ru: "Добро пожаловать! Я управляю запросами для вашей компании. Как я могу помочь вам сегодня?"
    },
    capabilities: [
      { id: 'inquiries', name: 'Inquiry Management', description: 'Organize and prioritize incoming buyer inquiries', phase: 'mvp' },
      { id: 'quotation', name: 'Create Quotations', description: 'Generate professional quotations in seconds', phase: 'mvp' },
      { id: 'proforma', name: 'Proforma Invoices', description: 'Create and send proforma invoices to buyers', phase: 'mvp' },
      { id: 'respond', name: 'Auto-Response', description: 'Respond to buyers in their language automatically', phase: 'mvp' },
      { id: 'priority', name: 'Lead Scoring', description: 'Automatically prioritize buyers by potential value', phase: 'advanced' },
      { id: 'followup', name: 'Follow-up Reminders', description: 'Schedule and send follow-up messages', phase: 'advanced' },
      { id: 'analytics', name: 'Performance Analytics', description: 'Track response rates and conversion metrics', phase: 'advanced' }
    ]
  },
  matchmaker: {
    id: 'matchmaker-agent',
    name: 'Matchmaking Agent',
    title: 'Your Trade Connection Engine',
    description: 'I work silently in the background, analyzing buyer needs and seller offerings to create perfect matches.',
    avatar: '/agents/matchmaker-agent.svg',
    color: '#3C2415',
    greeting: {
      en: "I'm analyzing thousands of connections to find your perfect trade partners...",
      ar: "أقوم بتحليل آلاف الاتصالات للعثور على شركاء التجارة المثاليين لك...",
      tr: "Mükemmel ticaret ortaklarınızı bulmak için binlerce bağlantıyı analiz ediyorum...",
      es: "Estoy analizando miles de conexiones para encontrar sus socios comerciales perfectos...",
      fr: "J'analyse des milliers de connexions pour trouver vos partenaires commerciaux parfaits...",
      de: "Ich analysiere Tausende von Verbindungen, um Ihre perfekten Handelspartner zu finden...",
      zh: "我正在分析数千个连接，为您寻找完美的贸易伙伴...",
      ru: "Я анализирую тысячи связей, чтобы найти ваших идеальных торговых партнеров..."
    },
    capabilities: [
      { id: 'match', name: 'Smart Matching', description: 'Match buyers with ideal sellers based on requirements', phase: 'mvp' },
      { id: 'recommend', name: 'Recommendations', description: 'Suggest best suppliers for specific product needs', phase: 'mvp' },
      { id: 'notify', name: 'Match Notifications', description: 'Alert both parties when a good match is found', phase: 'mvp' },
      { id: 'score', name: 'Compatibility Score', description: 'Calculate match quality percentage', phase: 'advanced' },
      { id: 'learn', name: 'Learning Algorithm', description: 'Improve matches based on successful connections', phase: 'advanced' },
      { id: 'trends', name: 'Market Trends', description: 'Identify emerging product and market trends', phase: 'advanced' }
    ]
  },
  'market-watch': {
    id: 'market-watch-agent',
    name: 'Market Watch Agent',
    title: 'Your Commodity Intelligence',
    description: 'I monitor global commodity prices, auction activity, and market movements. Never miss an opportunity.',
    avatar: '/agents/market-watch-agent.svg',
    color: '#8B5A2B',
    greeting: {
      en: "Markets are active! I'm tracking all price movements and auction opportunities for you.",
      ar: "الأسواق نشطة! أتابع جميع تحركات الأسعار وفرص المزادات من أجلك.",
      tr: "Piyasalar aktif! Sizin için tüm fiyat hareketlerini ve açık artırma fırsatlarını takip ediyorum.",
      es: "¡Los mercados están activos! Estoy rastreando todos los movimientos de precios y oportunidades de subasta para usted.",
      fr: "Les marchés sont actifs! Je surveille tous les mouvements de prix et les opportunités d'enchères pour vous.",
      de: "Die Märkte sind aktiv! Ich verfolge alle Preisbewegungen und Auktionsmöglichkeiten für Sie.",
      zh: "市场活跃！我正在为您追踪所有价格变动和拍卖机会。",
      ru: "Рынки активны! Я отслеживаю все ценовые движения и возможности аукционов для вас."
    },
    capabilities: [
      { id: 'prices', name: 'Live Prices', description: 'Track real-time commodity prices', phase: 'mvp' },
      { id: 'alerts', name: 'Price Alerts', description: 'Get notified when prices hit your targets', phase: 'mvp' },
      { id: 'auctions', name: 'Auction Monitoring', description: 'Track active cargo auctions and expiry times', phase: 'mvp' },
      { id: 'forecast', name: 'Price Forecasts', description: 'AI-powered price trend predictions', phase: 'advanced' },
      { id: 'arbitrage', name: 'Arbitrage Finder', description: 'Identify price differences across regions', phase: 'advanced' },
      { id: 'reports', name: 'Market Reports', description: 'Weekly and monthly market analysis reports', phase: 'advanced' }
    ]
  }
};

// Sample Agent Conversations
export const sampleConversations: AgentMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'I need chocolate suppliers from Turkey that can export to UAE',
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    role: 'agent',
    content: 'I found 12 verified chocolate manufacturers in Turkey that export to UAE. The top recommendation is OZMO Confectionery - they have Halal certification, BRC approval, and can deliver within 30-45 days. Would you like me to schedule a video meeting with their export manager?',
    timestamp: '2024-01-15T10:30:05Z',
    agentType: 'buyer',
    metadata: {
      companies: ['ozmo-confectionery'],
      meetingScheduled: false
    }
  },
  {
    id: '3',
    role: 'user',
    content: 'Yes, schedule a meeting for next week',
    timestamp: '2024-01-15T10:31:00Z'
  },
  {
    id: '4',
    role: 'agent',
    content: 'I\'ve sent a meeting request to OZMO Confectionery for next Tuesday at 2:00 PM (Dubai time). Their export manager, Mehmet Yilmaz, will join. I\'ve also drafted an inquiry message introducing your company. Would you like me to send it now?',
    timestamp: '2024-01-15T10:31:05Z',
    agentType: 'buyer',
    metadata: {
      companies: ['ozmo-confectionery'],
      meetingScheduled: true
    }
  }
];

// Sample Buyer Inquiries
export const sampleInquiries: BuyerInquiry[] = [
  {
    id: '1',
    buyerName: 'Mohammed Al-Hassan',
    buyerCompany: 'Gulf Trading Co.',
    buyerCountry: 'UAE',
    buyerEmail: 'mohammed@gulftrading.ae',
    productCategory: 'Confectionery & Chocolate',
    productDescription: 'Looking for chocolate wafer bars, 750g family packs, minimum 12 months shelf life',
    quantity: '2 x 40ft containers monthly',
    targetPrice: '$25,000 per container CIF Dubai',
    deliveryTerms: 'CIF Dubai',
    timeline: 'Ongoing monthly supply',
    certifications: ['Halal', 'ISO 22000'],
    status: 'matched',
    matchedCompanies: ['ozmo-confectionery', 'german-foods-gmbh'],
    createdAt: '2024-01-14T08:00:00Z'
  },
  {
    id: '2',
    buyerName: 'Sarah Johnson',
    buyerCompany: 'Premium Foods UK',
    buyerCountry: 'United Kingdom',
    buyerEmail: 'sarah@premiumfoods.uk',
    productCategory: 'Dairy Products',
    productDescription: 'Seeking UHT milk and butter suppliers for UK retail market',
    quantity: '5 containers per quarter',
    targetPrice: 'Market competitive',
    deliveryTerms: 'CIF Felixstowe',
    timeline: 'Q2 2024 start',
    certifications: ['BRC', 'Organic preferred'],
    status: 'new',
    matchedCompanies: [],
    createdAt: '2024-01-15T09:30:00Z'
  }
];

// Sample Categories
export const categories: Category[] = [
  { id: '1', slug: 'confectionery-chocolate', name: 'Confectionery & Chocolate', icon: '🍫', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', description: 'Chocolates, candies, sweets, and confectionery products', companyCount: 245 },
  { id: '2', slug: 'dairy-products', name: 'Dairy Products', icon: '🥛', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400', description: 'Milk, cheese, yogurt, butter, and dairy derivatives', companyCount: 189 },
  { id: '3', slug: 'beverages', name: 'Beverages', icon: '🥤', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400', description: 'Soft drinks, juices, water, energy drinks', companyCount: 312 },
  { id: '4', slug: 'snacks-chips', name: 'Snacks & Chips', icon: '🥨', image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400', description: 'Chips, nuts, crackers, and savory snacks', companyCount: 178 },
  { id: '5', slug: 'canned-foods', name: 'Canned Foods', icon: '🥫', image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400', description: 'Canned vegetables, fruits, fish, and meat', companyCount: 156 },
  { id: '6', slug: 'bakery-products', name: 'Bakery Products', icon: '🥐', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', description: 'Bread, pastries, cookies, and baked goods', companyCount: 134 },
  { id: '7', slug: 'frozen-foods', name: 'Frozen Foods', icon: '🧊', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400', description: 'Frozen vegetables, meals, seafood, and desserts', companyCount: 98 },
  { id: '8', slug: 'sauces-condiments', name: 'Sauces & Condiments', icon: '🫙', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400', description: 'Sauces, dressings, spices, and seasonings', companyCount: 167 },
  { id: '9', slug: 'oils-fats', name: 'Oils & Fats', icon: '🫒', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', description: 'Cooking oils, olive oil, vegetable fats', companyCount: 89 },
  { id: '10', slug: 'sugar-sweeteners', name: 'Sugar & Sweeteners', icon: '🍬', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400', description: 'Raw sugar, refined sugar, sweeteners', companyCount: 67 },
  { id: '11', slug: 'fmcg-exporters', name: 'FMCG Exporters | المصدرون', icon: '📦', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400', description: 'Global FMCG exporters and wholesale traders', companyCount: 16 }
];

// Sample Countries
export const countries: Country[] = [
  { id: '1', slug: 'turkey', name: 'Turkey', flag: '🇹🇷', region: 'Europe', code: 'TR', companyCount: 456 },
  { id: '2', slug: 'uae', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', code: 'AE', companyCount: 234 },
  { id: '3', slug: 'germany', name: 'Germany', flag: '🇩🇪', region: 'Europe', code: 'DE', companyCount: 312 },
  { id: '4', slug: 'italy', name: 'Italy', flag: '🇮🇹', region: 'Europe', code: 'IT', companyCount: 289 },
  { id: '5', slug: 'spain', name: 'Spain', flag: '🇪🇸', region: 'Europe', code: 'ES', companyCount: 198 },
  { id: '6', slug: 'egypt', name: 'Egypt', flag: '🇪🇬', region: 'Africa', code: 'EG', companyCount: 167 },
  { id: '7', slug: 'india', name: 'India', flag: '🇮🇳', region: 'Asia', code: 'IN', companyCount: 423 },
  { id: '8', slug: 'brazil', name: 'Brazil', flag: '🇧🇷', region: 'Americas', code: 'BR', companyCount: 189 },
  { id: '9', slug: 'poland', name: 'Poland', flag: '🇵🇱', region: 'Europe', code: 'PL', companyCount: 145 },
  { id: '10', slug: 'saudi-arabia', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', code: 'SA', companyCount: 178 },
];

// Sample Companies with Virtual Booth Data - GCC REGION
export const companies: Company[] = [
  // ============================================
  // QATAR COMPANIES
  // ============================================
  {
    id: '1', slug: 'al-meera-consumer-goods', name: 'Al Meera Consumer Goods',
    logo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200',
    description: "Al Meera is Qatar's leading retail and FMCG distribution company, supplying over 500 retail outlets across Qatar and the GCC.",
    country: 'Qatar', countryFlag: '🇶🇦', city: 'Doha', businessType: 'Distributor',
    categories: ['FMCG', 'Beverages', 'Dairy Products', 'Snacks & Chips'],
    exportCountries: ['UAE', 'Saudi Arabia', 'Kuwait', 'Bahrain', 'Oman'],
    yearEstablished: 1994, employees: '500+',
    certifications: ['ISO 22000', 'HACCP', 'Halal'],
    website: 'https://www.almeera.com.qa', whatsapp: '+97444123456', email: 'export@almeera.com.qa',
    exportManager: { name: 'Mohammed Al Kuwari', email: 'export@almeera.com.qa', whatsapp: '+97444123456' },
    salesManager: { name: 'Fatima Al Mannai', email: 'sales@almeera.com.qa' },
    gallery: ['https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600'],
    featured: true, verified: true, subscriptionPlan: 'Expo', joinDate: '2024-01-15',
    boothNumber: 'QA-001', minOrderValue: '$10,000', leadTime: '7-14 days',
    paymentTerms: ['LC at Sight', 'TT 30% advance'], shippingPorts: ['Doha', 'Hamad Port'],
    // Virtual Booth Data
    videoId: 'kU6FGkSBmvE',
    factoryImage: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1200',
    products: [
      { id: '1', name: 'Premium Dates - 1kg Pack', image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400', priceRange: '$8.50 - $10.00', unit: 'per case (12kg)', moq: '100 cases', leadTime: '7-14 days', certifications: ['Halal', 'ISO 22000'] },
      { id: '2', name: 'Arabic Coffee Blend - 500g', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', priceRange: '$12.00 - $15.00', unit: 'per case (24 units)', moq: '50 cases', leadTime: '7-14 days', certifications: ['Halal'] },
      { id: '3', name: 'Rose Water - 1L Glass', image: 'https://images.unsplash.com/photo-1595257841889-eca2678454e2?w=400', priceRange: '$6.00 - $8.00', unit: 'per case (12 units)', moq: '100 cases', leadTime: '14-21 days', certifications: ['Halal', 'Organic'] },
      { id: '4', name: 'Mixed Nuts - 1kg Premium', image: 'https://images.unsplash.com/photo-1536591375509-e5b6c5d76c5d?w=400', priceRange: '$18.00 - $22.00', unit: 'per case (10kg)', moq: '50 cases', leadTime: '14-21 days', certifications: ['Halal', 'ISO 22000'] },
      { id: '5', name: 'Tahini Paste - 1kg', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', priceRange: '$7.00 - $9.00', unit: 'per case (12 units)', moq: '100 cases', leadTime: '7-14 days', certifications: ['Halal'] },
      { id: '6', name: 'Halawa Box - 500g', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400', priceRange: '$9.00 - $11.00', unit: 'per case (24 units)', moq: '50 cases', leadTime: '7-14 days', certifications: ['Halal', 'ISO'] },
    ],
    milestones: [
      { year: '1994', event: 'Founded in Doha' },
      { year: '2002', event: 'First hypermarket opened' },
      { year: '2010', event: '500 retail outlets reached' },
      { year: '2015', event: 'GCC expansion started' },
      { year: '2024', event: 'Joined Brands Bridge AI' },
    ],
    isLive: true,
    exportCount: 45,
    monthlyContainers: 25,
    contactPerson: { name: 'Mohammed Al Kuwari', title: 'Export Manager', languages: ['🇬🇧 EN', '🇸🇦 AR'] },
    activeCargo: { product: 'Premium Dates Mix', containerType: '40ft Dry', route: '→ Dubai/Jeddah', price: 24800 },
    status: 'claimed',
    profileViews: 342,
    kybStatus: 'verified',
    documentsUploaded: ['CR', 'Tax', 'ISO22000', 'Halal'],
    avgResponseTimeHours: 7,
    completedDeals: 4,
    joinedDate: '2025-08-20',
    reviews: [
      { buyerId: 'buyer_uae_almaya_062', rating: 4.4, comment: 'Quality consistent with specs, smooth communication.', date: '2025-09-12' },
      { buyerId: 'buyer_qat_almeera_063', rating: 4.5, comment: 'Reliable supplier, on-time delivery.', date: '2025-11-04' },
      { buyerId: 'buyer_kwt_sultan_064', rating: 4.6, comment: 'Professional team, clear contracts.', dealId: 'deal_2025_031', date: '2025-12-18' },
      { buyerId: 'buyer_bhr_jawad_065', rating: 4.5, comment: 'Solid pricing, items as described.', date: '2026-02-02' },
      { buyerId: 'buyer_omn_lulu_066', rating: 4.5, comment: 'Pleasant negotiation, fair payment terms.', date: '2026-04-08' },
    ],
  },
  {
    id: '2', slug: 'baladna-food-industries', name: 'Baladna Food Industries',
    logo: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200',
    description: "Baladna is Qatar's largest dairy manufacturer, producing fresh milk, laban, yogurt, and juice products. Established after the 2017 blockade to ensure Qatar's food security.",
    country: 'Qatar', countryFlag: '🇶🇦', city: 'Al Khor', businessType: 'Manufacturer',
    categories: ['Dairy Products', 'Beverages', 'Fresh Food'],
    exportCountries: ['UAE', 'Kuwait', 'Oman', 'UK', 'USA'],
    yearEstablished: 2017, employees: '1000+',
    certifications: ['ISO 22000', 'FSSC 22000', 'Halal', 'HACCP'],
    website: 'https://www.baladna.com', whatsapp: '+97444567890', email: 'export@baladna.com',
    exportManager: { name: 'Khalid Al Romaihi', email: 'export@baladna.com', whatsapp: '+97444567890' },
    salesManager: { name: 'Sara Al Jaber', email: 'sales@baladna.com' },
    gallery: ['https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600'],
    featured: true, verified: true, subscriptionPlan: 'Expo', joinDate: '2024-01-20',
    boothNumber: 'QA-002', minOrderValue: '$15,000', leadTime: '14-21 days',
    paymentTerms: ['LC at Sight', 'TT 50% advance'], shippingPorts: ['Doha', 'Hamad Port'],
    videoId: 'dQw4w9WgXcQ',
    factoryImage: 'https://images.unsplash.com/photo-1584635491253-83edb4b6701b?w=1200',
    products: [
      { id: '1', name: 'Fresh Milk - 1L', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400', priceRange: '$2.80 - $3.20', unit: 'per case (12L)', moq: '200 cases', leadTime: '7-14 days', certifications: ['Halal', 'ISO 22000'] },
      { id: '2', name: 'Laban - 1L', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', priceRange: '$3.20 - $3.80', unit: 'per case (12L)', moq: '150 cases', leadTime: '7-14 days', certifications: ['Halal'] },
      { id: '3', name: 'Yogurt - 1kg Tub', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', priceRange: '$4.50 - $5.20', unit: 'per case (6 units)', moq: '100 cases', leadTime: '7-14 days', certifications: ['Halal', 'ISO 22000'] },
    ],
    milestones: [{ year: '2017', event: 'Founded post-blockade' }, { year: '2019', event: '10,000 cows reached' }, { year: '2024', event: 'Joined Brands Bridge AI' }],
    isLive: false,
    contactPerson: { name: 'Khalid Al Romaihi', title: 'Export Manager', languages: ['🇬🇧 EN', '🇸🇦 AR'] },
    activeCargo: { product: 'UHT Milk 1L', containerType: '40ft Reefer', route: '→ UAE/Oman', price: 32000 },
    status: 'claimed',
    profileViews: 256,
    kybStatus: 'verified',
    documentsUploaded: ['CR', 'Tax', 'HACCP', 'Halal'],
    avgResponseTimeHours: 8,
    completedDeals: 22,
    joinedDate: '2024-12-20',
    reviews: [
      { buyerId: 'buyer_uae_almaya_034', rating: 4.5, comment: 'Quality consistent with specs, smooth communication.', date: '2025-01-20' },
      { buyerId: 'buyer_qat_almeera_035', rating: 4.6, comment: 'Reliable supplier, on-time delivery.', date: '2025-02-14' },
      { buyerId: 'buyer_kwt_sultan_036', rating: 4.7, comment: 'Professional team, clear contracts.', dealId: 'deal_2025_007', date: '2025-03-08' },
      { buyerId: 'buyer_uae_lulu_037', rating: 4.5, comment: 'Solid pricing, items as described.', date: '2025-04-22' },
      { buyerId: 'buyer_bhr_jawad_038', rating: 4.6, comment: 'Responsive sales team and accurate documentation.', date: '2025-06-09' },
      { buyerId: 'buyer_omn_carrefour_039', rating: 4.7, comment: 'Pleasant negotiation, fair payment terms.', date: '2025-07-15' },
      { buyerId: 'buyer_qat_lulu_040', rating: 4.6, comment: 'Reasonable lead time, packaging held up well.', date: '2025-08-28' },
      { buyerId: 'buyer_egy_metro_041', rating: 4.5, comment: 'Easy onboarding, paperwork was clean.', dealId: 'deal_2025_022', date: '2025-09-30' },
      { buyerId: 'buyer_sau_panda_042', rating: 4.6, comment: 'Specs matched on first shipment, no rework needed.', date: '2025-11-04' },
      { buyerId: 'buyer_uae_carrefour_043', rating: 4.7, comment: 'Communication consistent throughout the deal.', date: '2025-12-12' },
      { buyerId: 'buyer_kwt_alothaim_044', rating: 4.6, comment: 'Quotes turned around quickly, samples on point.', date: '2026-01-15' },
      { buyerId: 'buyer_qat_almeera_045', rating: 4.5, comment: 'Good response on quotes, samples met expectations.', date: '2026-02-08' },
      { buyerId: 'buyer_omn_lulu_046', rating: 4.7, comment: 'Quality consistent with specs, smooth communication.', dealId: 'deal_2026_002', date: '2026-03-02' },
      { buyerId: 'buyer_uae_almaya_047', rating: 4.5, comment: 'Reliable supplier, on-time delivery.', date: '2026-03-25' },
      { buyerId: 'buyer_kwt_sultan_048', rating: 4.7, comment: 'Professional team, clear contracts.', date: '2026-04-15' },
    ],
  },
  {
    id: '3', slug: 'qatar-national-import-export', name: 'Qatar National Import & Export',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200',
    description: "Qatar's premier FMCG export company, connecting local manufacturers with global buyers across 45+ countries.",
    country: 'Qatar', countryFlag: '🇶🇦', city: 'Doha', businessType: 'Exporter',
    categories: ['FMCG', 'Food Products', 'Confectionery & Chocolate', 'Snacks & Chips'],
    exportCountries: ['Saudi Arabia', 'UAE', 'Germany', 'UK', 'USA', 'Australia'],
    yearEstablished: 2005, employees: '200+',
    certifications: ['ISO 9001', 'Halal', 'HACCP'],
    website: 'https://www.qnie.com.qa', whatsapp: '+97433123456', email: 'trade@qnie.com.qa',
    exportManager: { name: 'Ahmad Al Sulaiti', email: 'trade@qnie.com.qa', whatsapp: '+97433123456' },
    salesManager: { name: 'Maryam Al Thani', email: 'sales@qnie.com.qa' },
    gallery: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600'],
    featured: true, verified: true, subscriptionPlan: 'Expo', joinDate: '2024-01-10',
    boothNumber: 'QA-003', minOrderValue: '$5,000', leadTime: '7-14 days',
    paymentTerms: ['LC at Sight', 'TT', 'EXW'], shippingPorts: ['Doha', 'Hamad Port'],
    status: 'claimed',
    profileViews: 189,
    kybStatus: 'verified',
    documentsUploaded: ['CR', 'Tax', 'HACCP'],
    avgResponseTimeHours: 10,
    completedDeals: 5,
    joinedDate: '2025-11-25',
    reviews: [
      { buyerId: 'buyer_uae_almaya_084', rating: 4.3, comment: 'Quality consistent with specs, smooth communication.', date: '2026-01-15' },
      { buyerId: 'buyer_sau_panda_085', rating: 4.5, comment: 'Solid pricing, items as described.', date: '2026-03-28' },
    ],
  },
  // ============================================
  // SAUDI ARABIA COMPANIES
  // ============================================
  {
    id: '4', slug: 'almarai-company', name: 'Almarai Company',
    logo: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200',
    description: "Almarai is the world's largest vertically integrated dairy company, producing premium dairy, juice, and bakery products across the GCC and beyond.",
    country: 'Saudi Arabia', countryFlag: '🇸🇦', city: 'Riyadh', businessType: 'Manufacturer',
    categories: ['Dairy Products', 'Beverages', 'Bakery Products', 'Food Products'],
    exportCountries: ['UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Egypt'],
    yearEstablished: 1977, employees: '5000+',
    certifications: ['ISO 22000', 'FSSC 22000', 'BRC', 'Halal', 'IFS'],
    website: 'https://www.almarai.com', whatsapp: '+966112345678', email: 'export@almarai.com',
    exportManager: { name: 'Fahad Al Otaibi', email: 'export@almarai.com', whatsapp: '+966112345678' },
    salesManager: { name: 'Nora Al Rashid', email: 'sales@almarai.com' },
    gallery: ['https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600'],
    featured: true, verified: true, subscriptionPlan: 'Expo', joinDate: '2024-01-05',
    boothNumber: 'SA-001', minOrderValue: '$20,000', leadTime: '14-21 days',
    paymentTerms: ['LC at Sight', 'TT 50% advance'], shippingPorts: ['Jeddah', 'Dammam', 'Riyadh'],
    status: 'claimed',
    profileViews: 478,
    kybStatus: 'verified',
    documentsUploaded: ['CR', 'Tax', 'ISO22000', 'HACCP', 'Halal'],
    avgResponseTimeHours: 3,
    completedDeals: 18,
    joinedDate: '2024-09-15',
    reviews: [
      { buyerId: 'buyer_uae_almaya_001', rating: 4.5, comment: 'Quality consistent with specs, smooth communication.', date: '2024-11-08' },
      { buyerId: 'buyer_qat_almeera_002', rating: 4.7, comment: 'Reliable supplier, on-time delivery.', dealId: 'deal_2025_017', date: '2025-02-14' },
      { buyerId: 'buyer_kwt_sultan_003', rating: 4.8, comment: 'Professional team, clear contracts.', date: '2025-05-21' },
      { buyerId: 'buyer_uae_carrefour_004', rating: 4.7, comment: 'Solid pricing, items as described.', dealId: 'deal_2025_034', date: '2025-08-03' },
      { buyerId: 'buyer_bhr_lulu_005', rating: 4.8, comment: 'Responsive sales team and accurate documentation.', date: '2025-10-19' },
      { buyerId: 'buyer_omn_lulu_006', rating: 4.7, comment: 'Specs matched on first shipment, no rework needed.', date: '2025-12-11' },
      { buyerId: 'buyer_egy_metro_007', rating: 4.6, comment: 'Pleasant negotiation, fair payment terms.', date: '2026-02-08' },
      { buyerId: 'buyer_sau_panda_008', rating: 4.8, comment: 'Easy onboarding, paperwork was clean.', dealId: 'deal_2026_009', date: '2026-04-12' },
    ],
  },
  {
    id: '5', slug: 'savola-group', name: 'Savola Group',
    logo: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200',
    description: 'Savola Group is a leading FMCG conglomerate in the MENA region, manufacturing edible oils, sugar, and pasta under brands like Afia, Al Arabi, and others.',
    country: 'Saudi Arabia', countryFlag: '🇸🇦', city: 'Jeddah', businessType: 'Manufacturer',
    categories: ['Oils & Fats', 'Sugar & Sweeteners', 'Food Ingredients'],
    exportCountries: ['UAE', 'Qatar', 'Egypt', 'Morocco', 'Sudan', 'Turkey'],
    yearEstablished: 1979, employees: '3000+',
    certifications: ['ISO 22000', 'Halal', 'FSSC 22000', 'BRC'],
    website: 'https://www.savola.com', whatsapp: '+966122345678', email: 'export@savola.com',
    exportManager: { name: 'Waleed Al Ghamdi', email: 'export@savola.com', whatsapp: '+966122345678' },
    salesManager: { name: 'Layla Al Zahrani', email: 'sales@savola.com' },
    gallery: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600'],
    featured: true, verified: true, subscriptionPlan: 'Expo', joinDate: '2024-01-08',
    boothNumber: 'SA-002', minOrderValue: '$25,000', leadTime: '14-21 days',
    paymentTerms: ['LC at Sight', 'TT 30% advance'], shippingPorts: ['Jeddah', 'Dammam'],
    status: 'claimed',
    profileViews: 312,
    kybStatus: 'verified',
    documentsUploaded: ['CR', 'Tax', 'ISO22000', 'HACCP', 'Halal'],
    avgResponseTimeHours: 7,
    completedDeals: 28,
    joinedDate: '2024-08-10',
    reviews: [
      { buyerId: 'buyer_uae_almaya_010', rating: 4.6, comment: 'Quality consistent with specs, smooth communication.', date: '2024-10-05' },
      { buyerId: 'buyer_qat_almeera_011', rating: 4.7, comment: 'Reliable supplier, on-time delivery.', date: '2024-12-20' },
      { buyerId: 'buyer_kwt_sultan_012', rating: 4.8, comment: 'Professional team, clear contracts.', dealId: 'deal_2025_002', date: '2025-02-08' },
      { buyerId: 'buyer_uae_lulu_013', rating: 4.7, comment: 'Specs matched on first shipment, no rework needed.', date: '2025-04-15' },
      { buyerId: 'buyer_omn_carrefour_014', rating: 4.8, comment: 'Solid pricing, items as described.', date: '2025-06-02' },
      { buyerId: 'buyer_bhr_jawad_015', rating: 4.6, comment: 'Responsive sales team and accurate documentation.', dealId: 'deal_2025_019', date: '2025-07-22' },
      { buyerId: 'buyer_qat_lulu_016', rating: 4.7, comment: 'Pleasant negotiation, fair payment terms.', date: '2025-09-09' },
      { buyerId: 'buyer_egy_metro_017', rating: 4.8, comment: 'Easy onboarding, paperwork was clean.', date: '2025-10-25' },
      { buyerId: 'buyer_sau_panda_018', rating: 4.7, comment: 'Reasonable lead time, packaging held up well.', date: '2025-12-04' },
      { buyerId: 'buyer_uae_carrefour_019', rating: 4.6, comment: 'Communication consistent throughout the deal.', date: '2026-01-18' },
      { buyerId: 'buyer_kwt_alothaim_020', rating: 4.7, comment: 'Quotes turned around quickly, samples on point.', dealId: 'deal_2026_004', date: '2026-03-05' },
      { buyerId: 'buyer_qat_almeera_021', rating: 4.7, comment: 'Good response on quotes, samples met expectations.', date: '2026-04-08' },
    ],
  },
  // ============================================
  // UAE COMPANIES
  // ============================================
  {
    id: '6', slug: 'al-ain-farms', name: 'Al Ain Farms',
    logo: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200',
    description: "Al Ain Farms is UAE's leading dairy producer, known for premium fresh milk, laban, yogurt, and juice products distributed across the GCC.",
    country: 'UAE', countryFlag: '🇦🇪', city: 'Abu Dhabi', businessType: 'Manufacturer',
    categories: ['Dairy Products', 'Fresh Food', 'Beverages'],
    exportCountries: ['Qatar', 'Saudi Arabia', 'Kuwait', 'Bahrain', 'Oman'],
    yearEstablished: 1981, employees: '800+',
    certifications: ['ISO 22000', 'Halal', 'HACCP', 'FSSC 22000'],
    website: 'https://www.alainfarms.ae', whatsapp: '+97124567890', email: 'export@alainfarms.ae',
    exportManager: { name: 'Omar Al Mazrouei', email: 'export@alainfarms.ae', whatsapp: '+97124567890' },
    salesManager: { name: 'Hessa Al Dhaheri', email: 'sales@alainfarms.ae' },
    gallery: ['https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600'],
    featured: true, verified: true, subscriptionPlan: 'Expo', joinDate: '2024-01-12',
    boothNumber: 'AE-001', minOrderValue: '$12,000', leadTime: '7-14 days',
    paymentTerms: ['LC at Sight', 'TT 30% advance'], shippingPorts: ['Jebel Ali', 'Abu Dhabi'],
    status: 'claimed',
    profileViews: 267,
    kybStatus: 'verified',
    documentsUploaded: ['CR', 'Tax', 'ISO22000', 'Halal'],
    avgResponseTimeHours: 6,
    completedDeals: 14,
    joinedDate: '2025-02-15',
    reviews: [
      { buyerId: 'buyer_qat_almeera_050', rating: 4.3, comment: 'Quality consistent with specs, smooth communication.', date: '2025-03-15' },
      { buyerId: 'buyer_kwt_sultan_051', rating: 4.4, comment: 'Reliable supplier, on-time delivery.', date: '2025-04-22' },
      { buyerId: 'buyer_uae_lulu_052', rating: 4.5, comment: 'Solid pricing, items as described.', dealId: 'deal_2025_014', date: '2025-05-30' },
      { buyerId: 'buyer_bhr_jawad_053', rating: 4.4, comment: 'Professional team, clear contracts.', date: '2025-07-08' },
      { buyerId: 'buyer_omn_lulu_054', rating: 4.3, comment: 'Pleasant negotiation, fair payment terms.', date: '2025-08-19' },
      { buyerId: 'buyer_qat_lulu_055', rating: 4.5, comment: 'Reasonable lead time, packaging held up well.', date: '2025-10-02' },
      { buyerId: 'buyer_egy_metro_056', rating: 4.4, comment: 'Easy onboarding, paperwork was clean.', date: '2025-11-15' },
      { buyerId: 'buyer_sau_panda_057', rating: 4.3, comment: 'Specs matched on first shipment, no rework needed.', date: '2025-12-22' },
      { buyerId: 'buyer_uae_carrefour_058', rating: 4.5, comment: 'Communication consistent throughout the deal.', dealId: 'deal_2026_001', date: '2026-02-04' },
      { buyerId: 'buyer_kwt_alothaim_059', rating: 4.4, comment: 'Quotes turned around quickly, samples on point.', date: '2026-03-10' },
      { buyerId: 'buyer_qat_almeera_060', rating: 4.4, comment: 'Good response on quotes, samples met expectations.', date: '2026-04-12' },
    ],
  },
  {
    id: '7', slug: 'national-food-industries', name: 'National Food Industries',
    logo: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=200',
    description: 'National Food Industries (NFI) is one of the UAE\'s largest snack food manufacturers, producing chips, crackers, and confectionery for regional and global markets.',
    country: 'UAE', countryFlag: '🇦🇪', city: 'Dubai', businessType: 'Manufacturer',
    categories: ['Snacks & Chips', 'Confectionery & Chocolate', 'Bakery Products'],
    exportCountries: ['Qatar', 'Saudi Arabia', 'Kuwait', 'UK', 'USA', 'Australia'],
    yearEstablished: 1989, employees: '600+',
    certifications: ['ISO 22000', 'Halal', 'BRC', 'IFS'],
    website: 'https://www.nfi.ae', whatsapp: '+97143456789', email: 'export@nfi.ae',
    exportManager: { name: 'Rashid Al Falasi', email: 'export@nfi.ae', whatsapp: '+97143456789' },
    salesManager: { name: 'Aisha Al Muhairi', email: 'sales@nfi.ae' },
    gallery: ['https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=600'],
    featured: true, verified: true, subscriptionPlan: 'Premium', joinDate: '2024-01-18',
    boothNumber: 'AE-002', minOrderValue: '$8,000', leadTime: '14-21 days',
    paymentTerms: ['LC at Sight', 'TT 30% advance'], shippingPorts: ['Jebel Ali'],
    status: 'claimed',
    profileViews: 198,
    kybStatus: 'verified',
    documentsUploaded: ['CR', 'Tax', 'HACCP'],
    avgResponseTimeHours: 6,
    completedDeals: 10,
    joinedDate: '2025-07-25',
    reviews: [
      { buyerId: 'buyer_uae_lulu_068', rating: 4.5, comment: 'Quality consistent with specs, smooth communication.', date: '2025-09-20' },
      { buyerId: 'buyer_qat_lulu_069', rating: 4.6, comment: 'Reliable supplier, on-time delivery.', dealId: 'deal_2025_026', date: '2025-11-12' },
      { buyerId: 'buyer_kwt_sultan_070', rating: 4.7, comment: 'Solid pricing, items as described.', date: '2026-01-25' },
      { buyerId: 'buyer_egy_metro_071', rating: 4.6, comment: 'Communication consistent throughout the deal.', date: '2026-03-30' },
    ],
  },
  {
    id: '8', slug: 'americana-foods', name: 'Americana Foods',
    logo: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200',
    description: 'Americana Foods is one of the largest food companies in the Arab world, operating restaurants and manufacturing frozen and processed foods across the MENA region.',
    country: 'UAE', countryFlag: '🇦🇪', city: 'Dubai', businessType: 'Manufacturer',
    categories: ['Frozen Foods', 'Fast Food', 'Bakery Products', 'Food Products'],
    exportCountries: ['Qatar', 'Saudi Arabia', 'Kuwait', 'Egypt', 'Jordan', 'UK'],
    yearEstablished: 1964, employees: '2000+',
    certifications: ['ISO 22000', 'Halal', 'FSSC 22000', 'BRC', 'IFS'],
    website: 'https://www.americana-food.com', whatsapp: '+97143789012', email: 'export@americana-food.com',
    exportManager: { name: 'Karim Al Sayed', email: 'export@americana-food.com', whatsapp: '+97143789012' },
    salesManager: { name: 'Reem Al Hashimi', email: 'sales@americana-food.com' },
    gallery: ['https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600'],
    featured: true, verified: true, subscriptionPlan: 'Expo', joinDate: '2024-01-22',
    boothNumber: 'AE-003', minOrderValue: '$18,000', leadTime: '14-21 days',
    paymentTerms: ['LC at Sight', 'TT 50% advance'], shippingPorts: ['Jebel Ali', 'Abu Dhabi'],
    status: 'claimed',
    profileViews: 145,
    kybStatus: 'verified',
    documentsUploaded: ['CR', 'Tax', 'ISO22000', 'Halal'],
    avgResponseTimeHours: 4,
    completedDeals: 35,
    joinedDate: '2024-10-05',
    reviews: [
      { buyerId: 'buyer_qat_almeera_023', rating: 4.4, comment: 'Quality consistent with specs, smooth communication.', date: '2024-11-22' },
      { buyerId: 'buyer_kwt_sultan_024', rating: 4.5, comment: 'Reliable supplier, on-time delivery.', date: '2025-01-30' },
      { buyerId: 'buyer_uae_lulu_025', rating: 4.6, comment: 'Solid pricing, items as described.', dealId: 'deal_2025_011', date: '2025-04-08' },
      { buyerId: 'buyer_bhr_jawad_026', rating: 4.5, comment: 'Professional team, clear contracts.', date: '2025-06-15' },
      { buyerId: 'buyer_omn_lulu_027', rating: 4.4, comment: 'Pleasant negotiation, fair payment terms.', date: '2025-08-20' },
      { buyerId: 'buyer_qat_lulu_028', rating: 4.5, comment: 'Reasonable lead time, packaging held up well.', date: '2025-10-04' },
      { buyerId: 'buyer_egy_metro_029', rating: 4.6, comment: 'Easy onboarding, paperwork was clean.', dealId: 'deal_2025_028', date: '2025-11-18' },
      { buyerId: 'buyer_sau_panda_030', rating: 4.5, comment: 'Specs matched on first shipment, no rework needed.', date: '2026-01-12' },
      { buyerId: 'buyer_uae_carrefour_031', rating: 4.5, comment: 'Communication consistent throughout the deal.', date: '2026-02-25' },
      { buyerId: 'buyer_kwt_alothaim_032', rating: 4.5, comment: 'Quotes turned around quickly, samples on point.', date: '2026-04-03' },
    ],
  },
  // ============================================
  // KUWAIT COMPANIES
  // ============================================
  {
    id: '9', slug: 'gulf-food-industries', name: 'Gulf Food Industries',
    logo: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=200',
    description: "Gulf Food Industries is Kuwait's premier FMCG manufacturer, producing chocolates, snacks, and beverages for the GCC and international markets.",
    country: 'Kuwait', countryFlag: '🇰🇼', city: 'Kuwait City', businessType: 'Manufacturer',
    categories: ['Confectionery & Chocolate', 'Snacks & Chips', 'Beverages'],
    exportCountries: ['Qatar', 'UAE', 'Saudi Arabia', 'Bahrain', 'Jordan'],
    yearEstablished: 1995, employees: '400+',
    certifications: ['ISO 22000', 'Halal', 'HACCP'],
    website: 'https://www.gfi.com.kw', whatsapp: '+96522345678', email: 'export@gfi.com.kw',
    exportManager: { name: 'Jassim Al Mutairi', email: 'export@gfi.com.kw', whatsapp: '+96522345678' },
    salesManager: { name: 'Dana Al Sabah', email: 'sales@gfi.com.kw' },
    gallery: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600'],
    featured: true, verified: true, subscriptionPlan: 'Premium', joinDate: '2024-01-25',
    boothNumber: 'KW-001', minOrderValue: '$6,000', leadTime: '14-21 days',
    paymentTerms: ['LC at Sight', 'TT 30% advance'], shippingPorts: ['Shuwaikh', 'Doha Port'],
    status: 'claimed',
    profileViews: 223,
    kybStatus: 'verified',
    documentsUploaded: ['CR', 'Tax', 'Halal'],
    avgResponseTimeHours: 7,
    completedDeals: 12,
    joinedDate: '2025-11-15',
    reviews: [
      { buyerId: 'buyer_uae_lulu_073', rating: 4.4, comment: 'Quality consistent with specs, smooth communication.', date: '2026-01-08' },
      { buyerId: 'buyer_qat_almeera_074', rating: 4.5, comment: 'Reliable supplier, on-time delivery.', date: '2026-01-30' },
      { buyerId: 'buyer_sau_panda_075', rating: 4.6, comment: 'Solid pricing, items as described.', dealId: 'deal_2026_007', date: '2026-02-18' },
      { buyerId: 'buyer_bhr_jawad_076', rating: 4.5, comment: 'Professional team, clear contracts.', date: '2026-03-05' },
      { buyerId: 'buyer_kwt_sultan_077', rating: 4.4, comment: 'Pleasant negotiation, fair payment terms.', date: '2026-03-22' },
      { buyerId: 'buyer_uae_carrefour_078', rating: 4.6, comment: 'Communication consistent throughout the deal.', date: '2026-04-15' },
    ],
  },
  // ============================================
  // OMAN COMPANIES
  // ============================================
  {
    id: '10', slug: 'oman-food-industries', name: 'Oman Food Industries',
    logo: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=200',
    description: 'Oman Food Industries is a leading food manufacturer in the Sultanate, specializing in canned fish, seafood, and processed food products for export.',
    country: 'Oman', countryFlag: '🇴🇲', city: 'Muscat', businessType: 'Manufacturer',
    categories: ['Seafood', 'Canned Foods', 'Food Products', 'Beverages'],
    exportCountries: ['Qatar', 'UAE', 'Saudi Arabia', 'UK', 'Germany'],
    yearEstablished: 1988, employees: '350+',
    certifications: ['ISO 22000', 'Halal', 'HACCP', 'MSC'],
    website: 'https://www.ofi.om', whatsapp: '+96824567890', email: 'export@ofi.om',
    exportManager: { name: 'Said Al Busaidi', email: 'export@ofi.om', whatsapp: '+96824567890' },
    salesManager: { name: 'Fatma Al Balushi', email: 'sales@ofi.om' },
    gallery: ['https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600'],
    featured: true, verified: true, subscriptionPlan: 'Premium', joinDate: '2024-01-28',
    boothNumber: 'OM-001', minOrderValue: '$7,000', leadTime: '14-21 days',
    paymentTerms: ['LC at Sight', 'TT 30% advance'], shippingPorts: ['Sohar', 'Muscat'],
    status: 'claimed',
    profileViews: 167,
    kybStatus: 'verified',
    documentsUploaded: ['CR', 'Tax', 'ISO22000'],
    avgResponseTimeHours: 9,
    completedDeals: 4,
    joinedDate: '2025-09-10',
    reviews: [
      { buyerId: 'buyer_uae_lulu_080', rating: 4.2, comment: 'Quality consistent with specs, smooth communication.', date: '2025-10-15' },
      { buyerId: 'buyer_qat_lulu_081', rating: 4.3, comment: 'Reliable supplier, on-time delivery.', dealId: 'deal_2025_038', date: '2026-01-22' },
      { buyerId: 'buyer_kwt_sultan_082', rating: 4.4, comment: 'Reasonable lead time, packaging held up well.', date: '2026-04-02' },
    ],
  },
  // ============================================
  // UNCLAIMED COMPANIES (Not yet claimed by owners)
  // ============================================
  {
    id: '11', slug: 'al-jazeera-food-co', name: 'Al Jazeera Food Co.',
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200',
    description: 'A growing food distribution company in Qatar serving retail and HORECA sectors across the region.',
    country: 'Qatar', countryFlag: '🇶🇦', city: 'Doha', businessType: 'Distributor',
    categories: ['FMCG', 'Snacks & Chips'],
    exportCountries: ['UAE', 'Saudi Arabia', 'Kuwait'],
    yearEstablished: 2015, employees: '51-200',
    certifications: ['Halal'],
    website: '', whatsapp: '', email: '',
    exportManager: { name: '', email: '', whatsapp: '' },
    salesManager: { name: '', email: '' },
    gallery: [],
    featured: false, verified: false, subscriptionPlan: 'Free', joinDate: '2024-02-01',
    status: 'unclaimed',
    profileViews: 234,
    pendingInquiries: 8,
    kybStatus: 'pending',
    documentsUploaded: ['CR', 'Tax', 'ISO22000', 'Halal'],
    avgResponseTimeHours: 8,
    completedDeals: 10,
    joinedDate: '2025-07-10',
    reviews: [],
  },
  {
    id: '12', slug: 'gulf-sweets-factory', name: 'Gulf Sweets Factory',
    logo: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=200',
    description: 'Traditional Arabic sweets and confectionery manufacturer producing high-quality halawa, baklava, and regional specialties.',
    country: 'Kuwait', countryFlag: '🇰🇼', city: 'Kuwait City', businessType: 'Manufacturer',
    categories: ['Confectionery & Chocolate', 'Snacks & Chips'],
    exportCountries: ['UAE', 'Saudi Arabia', 'Bahrain'],
    yearEstablished: 2008, employees: '201-500',
    certifications: ['Halal', 'ISO 22000'],
    website: '', whatsapp: '', email: '',
    exportManager: { name: '', email: '', whatsapp: '' },
    salesManager: { name: '', email: '' },
    gallery: [],
    featured: false, verified: false, subscriptionPlan: 'Free', joinDate: '2024-02-05',
    status: 'unclaimed',
    profileViews: 156,
    pendingInquiries: 3,
    kybStatus: 'pending',
    documentsUploaded: ['CR', 'Tax', 'HACCP', 'Halal'],
    avgResponseTimeHours: 10,
    completedDeals: 8,
    joinedDate: '2025-12-15',
    reviews: [],
  },
  {
    id: '13', slug: 'doha-dairy-products', name: 'Doha Dairy Products',
    logo: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200',
    description: 'Fresh dairy products manufacturer supplying Qatar and the GCC with premium milk, yogurt, and laban.',
    country: 'Qatar', countryFlag: '🇶🇦', city: 'Doha', businessType: 'Manufacturer',
    categories: ['Dairy Products', 'Beverages'],
    exportCountries: ['UAE', 'Saudi Arabia', 'Oman'],
    yearEstablished: 2012, employees: '51-200',
    certifications: ['Halal', 'HACCP'],
    website: '', whatsapp: '', email: '',
    exportManager: { name: '', email: '', whatsapp: '' },
    salesManager: { name: '', email: '' },
    gallery: [],
    featured: false, verified: false, subscriptionPlan: 'Free', joinDate: '2024-02-08',
    status: 'unclaimed',
    profileViews: 89,
    pendingInquiries: 5,
    kybStatus: 'pending',
    documentsUploaded: ['CR', 'Tax', 'Halal'],
    avgResponseTimeHours: 9,
    completedDeals: 7,
    joinedDate: '2025-09-20',
    reviews: [],
  },
  {
    id: '14', slug: 'emirates-natural-foods', name: 'Emirates Natural Foods',
    logo: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200',
    description: 'Organic and natural food products supplier specializing in health foods, grains, and superfoods for the UAE market.',
    country: 'UAE', countryFlag: '🇦🇪', city: 'Dubai', businessType: 'Exporter',
    categories: ['Organic', 'FMCG', 'Food Ingredients'],
    exportCountries: ['Saudi Arabia', 'Qatar', 'Kuwait', 'Europe'],
    yearEstablished: 2018, employees: '11-50',
    certifications: ['Organic', 'Halal'],
    website: '', whatsapp: '', email: '',
    exportManager: { name: '', email: '', whatsapp: '' },
    salesManager: { name: '', email: '' },
    gallery: [],
    featured: false, verified: false, subscriptionPlan: 'Free', joinDate: '2024-02-10',
    status: 'unclaimed',
    profileViews: 312,
    pendingInquiries: 12,
    kybStatus: 'pending',
    documentsUploaded: ['CR', 'Tax', 'HACCP'],
    avgResponseTimeHours: 11,
    completedDeals: 6,
    joinedDate: '2025-12-25',
    reviews: [],
  },
  {
    id: '15', slug: 'riyadh-food-industries', name: 'Riyadh Food Industries',
    logo: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=200',
    description: 'Leading snack food manufacturer in Saudi Arabia producing chips, extruded snacks, and ready-to-eat products for domestic and export markets.',
    country: 'Saudi Arabia', countryFlag: '🇸🇦', city: 'Riyadh', businessType: 'Manufacturer',
    categories: ['Snacks & Chips', 'Beverages', 'Confectionery & Chocolate'],
    exportCountries: ['UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Egypt', 'Jordan'],
    yearEstablished: 2005, employees: '500+',
    certifications: ['ISO 22000', 'Halal', 'BRC'],
    website: '', whatsapp: '', email: '',
    exportManager: { name: '', email: '', whatsapp: '' },
    salesManager: { name: '', email: '' },
    gallery: [],
    featured: false, verified: false, subscriptionPlan: 'Free', joinDate: '2024-02-12',
    status: 'unclaimed',
    profileViews: 445,
    pendingInquiries: 19,
    kybStatus: 'pending',
    documentsUploaded: ['CR', 'Tax', 'ISO22000'],
    avgResponseTimeHours: 10,
    completedDeals: 5,
    joinedDate: '2025-07-30',
    reviews: [],
  }
];

// BRANDS BRIDGE MARKET INDEX - Commodity Prices
export const commodityPrices: CommodityPrice[] = [
  // DAIRY
  { id: '1', commodity: 'Whole Milk Powder', unit: 'MT', currentPrice: 3250, previousPrice: 3180, change: 70, changePercent: 2.2, date: '2024-01-15', source: 'Global Dairy Trade', region: 'Global', category: 'dairy' },
  { id: '2', commodity: 'Skimmed Milk Powder', unit: 'MT', currentPrice: 2680, previousPrice: 2720, change: -40, changePercent: -1.5, date: '2024-01-15', source: 'Global Dairy Trade', region: 'Global', category: 'dairy' },
  { id: '3', commodity: 'Butter', unit: 'MT', currentPrice: 5420, previousPrice: 5350, change: 70, changePercent: 1.3, date: '2024-01-15', source: 'Global Dairy Trade', region: 'EU', category: 'dairy' },
  { id: '4', commodity: 'Cheddar Cheese', unit: 'MT', currentPrice: 4180, previousPrice: 4200, change: -20, changePercent: -0.5, date: '2024-01-15', source: 'Global Dairy Trade', region: 'Global', category: 'dairy' },
  // SUGAR
  { id: '5', commodity: 'White Sugar (ICE)', unit: 'MT', currentPrice: 628, previousPrice: 615, change: 13, changePercent: 2.1, date: '2024-01-15', source: 'ICE Futures', region: 'Global', category: 'sugar' },
  { id: '6', commodity: 'Raw Sugar #11', unit: 'MT', currentPrice: 495, previousPrice: 485, change: 10, changePercent: 2.1, date: '2024-01-15', source: 'ICE Futures', region: 'Global', category: 'sugar' },
  { id: '7', commodity: 'Brazilian Sugar VHP', unit: 'MT', currentPrice: 520, previousPrice: 512, change: 8, changePercent: 1.6, date: '2024-01-15', source: 'Santos FOB', region: 'Brazil', category: 'sugar' },
  // OIL
  { id: '8', commodity: 'Palm Oil (CPO)', unit: 'MT', currentPrice: 892, previousPrice: 878, change: 14, changePercent: 1.6, date: '2024-01-15', source: 'Bursa Malaysia', region: 'Malaysia', category: 'oil' },
  { id: '9', commodity: 'Soybean Oil', unit: 'MT', currentPrice: 1045, previousPrice: 1062, change: -17, changePercent: -1.6, date: '2024-01-15', source: 'CBOT', region: 'USA', category: 'oil' },
  { id: '10', commodity: 'Sunflower Oil', unit: 'MT', currentPrice: 1120, previousPrice: 1095, change: 25, changePercent: 2.3, date: '2024-01-15', source: 'Rotterdam FOB', region: 'EU', category: 'oil' },
  { id: '11', commodity: 'Olive Oil (Extra Virgin)', unit: 'MT', currentPrice: 8450, previousPrice: 8200, change: 250, changePercent: 3.0, date: '2024-01-15', source: 'EU Market', region: 'Spain', category: 'oil' },
];

// Platform Stats
export const platformStats = {
  companies: 2450,
  countries: 85,
  categories: 24,
  connections: 15000,
  virtualBooths: 850,
  dailyVisitors: 12000,
  agentConversations: 5420,
  matchesMade: 890
};

// Exhibition Cost Comparison
export const exhibitionCosts = {
  traditional: {
    boothRental: 15000,
    boothDesign: 8000,
    flights: 3500,
    hotels: 2800,
    meals: 1200,
    marketing: 5000,
    staffTime: 8000,
    total: 43500
  },
  brandsBridge: {
    annualPremium: 2400,
    setupTime: 0,
    travel: 0,
    total: 2400
  },
  savings: 41100,
  savingsPercent: 94.5
};

// ============================================
// COMPANY DASHBOARD - ADVERTISING & CAMPAIGNS
// ============================================

export type CampaignType = 'search_boost' | 'email_catalog';
export type CampaignStatus = 'active' | 'paused' | 'completed' | 'pending' | 'rejected';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface CampaignPricing {
  searchBoostPerWeek: number;
  emailPerThousand: number;
  top10PremiumMultiplier: number;
  minimumBudget: number;
}

export interface SearchBoostCampaign {
  id: string;
  companyId: string;
  name: string;
  type: 'search_boost';
  status: CampaignStatus;
  // Targeting
  categories: string[];
  targetCountries: string[];
  targetCustomerCount: number;
  // Boost Settings
  rankPosition: number; // 1-10 for top 10 visibility
  isTopTenBoost: boolean;
  // Budget & Duration
  weeklyBudget: number;
  durationWeeks: number;
  totalBudget: number;
  // Performance
  impressions: number;
  clicks: number;
  inquiries: number;
  // Dates
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCatalogCampaign {
  id: string;
  companyId: string;
  name: string;
  type: 'email_catalog';
  status: CampaignStatus;
  // Targeting
  categories: string[];
  targetCountries: string[];
  recipientCount: number;
  // Email Content
  catalogSubject: string;
  catalogContent: string;
  productImages: string[];
  // Privacy (Sender/Recipient protection)
  usePlatformEmail: boolean;
  hideCompanyEmail: boolean;
  hideRecipientEmails: boolean;
  // Budget
  costPerThousand: number;
  totalRecipients: number;
  totalBudget: number;
  // Performance
  emailsSent: number;
  emailsOpened: number;
  clickThroughRate: number;
  // Dates
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export type Campaign = SearchBoostCampaign | EmailCatalogCampaign;

export interface PaymentRecord {
  id: string;
  companyId: string;
  campaignId: string;
  campaignName: string;
  amount: number;
  currency: string;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'paypal' | 'crypto';
  status: PaymentStatus;
  transactionId?: string;
  receiptUrl?: string;
  createdAt: string;
  paidAt?: string;
}

export interface CompanyDashboardData {
  company: Company;
  profileCompleteness: number;
  isRegistered: boolean;
  registrationStep: number;
  // Campaign Stats
  activeCampaigns: number;
  totalCampaignSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalInquiries: number;
  // Recent Activity
  recentInquiries: number;
  recentMeetings: number;
  profileViews: number;
}

export interface CampaignFormData {
  // Common
  name: string;
  categories: string[];
  targetCountries: string[];
  // Search Boost specific
  isTopTenBoost?: boolean;
  weeklyBudget?: number;
  durationWeeks?: number;
  // Email Campaign specific
  catalogSubject?: string;
  catalogContent?: string;
  productImages?: string[];
  recipientCount?: number;
}

// Campaign Pricing Configuration
export const campaignPricing: CampaignPricing = {
  searchBoostPerWeek: 50,
  emailPerThousand: 25,
  top10PremiumMultiplier: 2.5,
  minimumBudget: 100
};

// Sample Campaigns
export const sampleCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    companyId: '1',
    name: 'Premium Chocolate - GCC Visibility',
    type: 'search_boost',
    status: 'active',
    categories: ['Confectionery & Chocolate'],
    targetCountries: ['UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman'],
    targetCustomerCount: 2500,
    rankPosition: 3,
    isTopTenBoost: true,
    weeklyBudget: 150,
    durationWeeks: 4,
    totalBudget: 600,
    impressions: 12500,
    clicks: 890,
    inquiries: 45,
    startDate: '2024-01-15',
    endDate: '2024-02-12',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-28'
  },
  {
    id: 'camp-2',
    companyId: '1',
    name: 'Chocolate Catalog - Middle East Distribution',
    type: 'email_catalog',
    status: 'active',
    categories: ['Confectionery & Chocolate', 'Snacks & Chips'],
    targetCountries: ['UAE', 'Saudi Arabia', 'Egypt', 'Jordan', 'Lebanon'],
    recipientCount: 1500,
    catalogSubject: 'Premium Turkish Chocolates from OZMO - Exclusive Distribution Opportunity',
    catalogContent: 'Explore our range of premium chocolate wafers, biscuits, and snacks...',
    productImages: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600'],
    usePlatformEmail: true,
    hideCompanyEmail: true,
    hideRecipientEmails: true,
    costPerThousand: 25,
    totalRecipients: 1500,
    totalBudget: 37.50,
    emailsSent: 1500,
    emailsOpened: 485,
    clickThroughRate: 12.5,
    startDate: '2024-01-10',
    endDate: '2024-01-17',
    createdAt: '2024-01-09',
    updatedAt: '2024-01-17'
  }
];

// Sample Payment Records
export const samplePayments: PaymentRecord[] = [
  {
    id: 'pay-1',
    companyId: '1',
    campaignId: 'camp-1',
    campaignName: 'Premium Chocolate - GCC Visibility',
    amount: 600,
    currency: 'USD',
    paymentMethod: 'credit_card',
    status: 'completed',
    transactionId: 'TXN-2024-001234',
    receiptUrl: '#',
    createdAt: '2024-01-14',
    paidAt: '2024-01-14'
  },
  {
    id: 'pay-2',
    companyId: '1',
    campaignId: 'camp-2',
    campaignName: 'Chocolate Catalog - Middle East Distribution',
    amount: 37.50,
    currency: 'USD',
    paymentMethod: 'paypal',
    status: 'completed',
    transactionId: 'PP-2024-005678',
    createdAt: '2024-01-09',
    paidAt: '2024-01-09'
  }
];

// Sample Dashboard Data
export const sampleDashboardData: CompanyDashboardData = {
  company: companies[0],
  profileCompleteness: 75,
  isRegistered: true,
  registrationStep: 5,
  activeCampaigns: 2,
  totalCampaignSpent: 637.50,
  totalImpressions: 12500,
  totalClicks: 890,
  totalInquiries: 45,
  recentInquiries: 12,
  recentMeetings: 3,
  profileViews: 156
};
// === EXPO DATA ===

// Walk-in Buyers (no account needed)
export interface WalkinBuyer {
  id: string;
  name: string;
  company: string;
  country: string;
  countryFlag: string;
  whatsapp: string;
  email: string;
  products: string[];
  targetCountries: string[];
  registrationTime: string;
  checkedIn: boolean;
  checkInTime?: string;
  meetingsHeld: number;
  cardsCollected: number;
  notes?: string;
}

// Note: walkinBuyers is defined later in the file with correct schema

// Pre-registered Buyers (have accounts)
export interface PreRegisteredBuyer {
  id: string;
  name: string;
  company: string;
  country: string;
  countryFlag: string;
  email: string;
  whatsapp: string;
  productInterests: string[];
  targetCountries: string[];
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'attended' | 'no-show';
  meetingsScheduled: number;
  meetingsCompleted: number;
  attendedSessions: string[];
}

// Note: preRegisteredBuyers is defined later in the file with correct schema

// Expo Room Status
export interface ExpoRoom {
  id: string;
  companyId: string;
  companyName: string;
  companyFlag: string;
  sellerName: string;
  sellerTitle: string;
  sellerLanguages: string[];
  products: string[];
  status: 'available' | 'busy' | 'full' | 'live' | 'ended' | 'queued';
  waitingCount: number;
  estimatedWait: number; // minutes
  accessCode: string;
  totalMeetings: number;
  totalDeals: number;
  dealValue: number;
}

export const expoRooms: ExpoRoom[] = [
  {
    id: 'room-a12',
    companyId: '1',
    companyName: 'Al Meera Consumer Goods',
    companyFlag: '🇶🇦',
    sellerName: 'Mohammed Al Kuwari',
    sellerTitle: 'Export Manager',
    sellerLanguages: ['EN', 'AR'],
    products: ['FMCG', 'Dairy', 'Beverages'],
    status: 'available',
    waitingCount: 0,
    estimatedWait: 0,
    accessCode: 'BB-A12-2025',
    totalMeetings: 0,
    totalDeals: 0,
    dealValue: 0
  },
  {
    id: 'room-a13',
    companyId: '1',
    companyName: 'Al Meera Consumer Goods',
    companyFlag: '🇶🇦',
    sellerName: 'Sara Al Jaber',
    sellerTitle: 'Sales Manager',
    sellerLanguages: ['EN'],
    products: ['Beverages'],
    status: 'busy',
    waitingCount: 2,
    estimatedWait: 8,
    accessCode: 'BB-A13-2025',
    totalMeetings: 3,
    totalDeals: 1,
    dealValue: 12000
  },
  {
    id: 'room-a14',
    companyId: '1',
    companyName: 'Al Meera Consumer Goods',
    companyFlag: '🇶🇦',
    sellerName: 'Khalid Hassan',
    sellerTitle: 'Trade Specialist',
    sellerLanguages: ['AR'],
    products: ['Snacks'],
    status: 'full',
    waitingCount: 5,
    estimatedWait: 18,
    accessCode: 'BB-A14-2025',
    totalMeetings: 8,
    totalDeals: 2,
    dealValue: 28000
  },
  {
    id: 'room-b01',
    companyId: '2',
    companyName: 'Baladna Food Industries',
    companyFlag: '🇶🇦',
    sellerName: 'Khalid Al Romaihi',
    sellerTitle: 'Export Manager',
    sellerLanguages: ['EN', 'AR'],
    products: ['Dairy', 'Fresh Food'],
    status: 'available',
    waitingCount: 0,
    estimatedWait: 0,
    accessCode: 'BB-B01-2025',
    totalMeetings: 0,
    totalDeals: 0,
    dealValue: 0
  },
  {
    id: 'room-b02',
    companyId: '2',
    companyName: 'Baladna Food Industries',
    companyFlag: '🇶🇦',
    sellerName: 'Nadia Al Baker',
    sellerTitle: 'Sales Director',
    sellerLanguages: ['EN', 'AR', 'FR'],
    products: ['Beverages'],
    status: 'busy',
    waitingCount: 3,
    estimatedWait: 12,
    accessCode: 'BB-B02-2025',
    totalMeetings: 5,
    totalDeals: 2,
    dealValue: 35000
  },
  {
    id: 'room-c01',
    companyId: '3',
    companyName: 'OZMO Confectionery',
    companyFlag: '🇹🇷',
    sellerName: 'Mehmet Yilmaz',
    sellerTitle: 'Export Manager',
    sellerLanguages: ['EN', 'TR'],
    products: ['Confectionery', 'Chocolate'],
    status: 'available',
    waitingCount: 0,
    estimatedWait: 0,
    accessCode: 'BB-C01-2025',
    totalMeetings: 0,
    totalDeals: 0,
    dealValue: 0
  },
  {
    id: 'room-c02',
    companyId: '3',
    companyName: 'OZMO Confectionery',
    companyFlag: '🇹🇷',
    sellerName: 'Ayse Kaya',
    sellerTitle: 'Sales Manager',
    sellerLanguages: ['EN', 'TR', 'AR'],
    products: ['Confectionery'],
    status: 'busy',
    waitingCount: 4,
    estimatedWait: 15,
    accessCode: 'BB-C02-2025',
    totalMeetings: 6,
    totalDeals: 3,
    dealValue: 45000
  }
];

// Logistics Zone Companies
export interface LogisticsCompany {
  id: string;
  name: string;
  flag: string;
  routes: string[];
  containerTypes: string[];
  specialRate: string;
  requestsReceived: number;
  quotesSubmitted: number;
  status: 'available' | 'busy';
}

export const logisticsCompanies: LogisticsCompany[] = [
  {
    id: 'log-001',
    name: 'Maersk Middle East',
    flag: '🇩🇰',
    routes: ['Dubai → Rotterdam', 'Doha → Hamburg', 'Jeddah → Singapore'],
    containerTypes: ['20ft', '40ft', '40ft HC', 'Reefer'],
    specialRate: '15% off expo day',
    requestsReceived: 12,
    quotesSubmitted: 8,
    status: 'available'
  },
  {
    id: 'log-002',
    name: 'MSC Gulf',
    flag: '🇮🇹',
    routes: ['Dubai → Felixstowe', 'Qatar → Germany'],
    containerTypes: ['20ft', '40ft', '40ft HC'],
    specialRate: '10% discount today',
    requestsReceived: 8,
    quotesSubmitted: 5,
    status: 'busy'
  },
  {
    id: 'log-003',
    name: 'Gulf Shipping Co.',
    flag: '🇦🇪',
    routes: ['GCC → Europe', 'Qatar → UK', 'UAE → India'],
    containerTypes: ['20ft', '40ft', 'Reefer'],
    specialRate: 'Free documentation',
    requestsReceived: 6,
    quotesSubmitted: 4,
    status: 'available'
  }
];

// Walk-in Buyers Sample Data
export const walkinBuyers: WalkinBuyer[] = [
  {
    id: 'ww-001',
    name: 'Khalid Mahmoud',
    company: 'Fresh Mart Qatar',
    country: 'Qatar',
    countryFlag: '🇶🇦',
    whatsapp: '+97412345678',
    email: 'khalid@freshmart.qa',
    products: ['Dairy Products', 'Fresh Fruits', 'Organic Vegetables'],
    targetCountries: ['UAE', 'Saudi Arabia', 'Turkey'],
    registrationTime: '2025-04-14T09:30:00',
    checkedIn: true,
    checkInTime: '2025-04-14T09:35:00',
    meetingsHeld: 3,
    cardsCollected: 5
  },
  {
    id: 'ww-002',
    name: 'Priya Sharma',
    company: 'Spice Route Trading',
    country: 'India',
    countryFlag: '🇮🇳',
    whatsapp: '+919876543210',
    email: 'priya@spiceroute.in',
    products: ['Spices', 'Seasonings', 'Herbs'],
    targetCountries: ['UAE', 'Saudi Arabia', 'Qatar'],
    registrationTime: '2025-04-14T10:15:00',
    checkedIn: true,
    checkInTime: '2025-04-14T10:20:00',
    meetingsHeld: 2,
    cardsCollected: 3
  },
  {
    id: 'ww-003',
    name: 'Ahmed Hassan',
    company: 'Gulf Food Importer',
    country: 'Egypt',
    countryFlag: '🇪🇬',
    whatsapp: '+201234567890',
    email: 'ahmed@gulfood.com.eg',
    products: ['Confectionery', 'Beverages', 'Snack Foods'],
    targetCountries: ['Saudi Arabia', 'UAE', 'Kuwait'],
    registrationTime: '2025-04-14T11:00:00',
    checkedIn: false,
    meetingsHeld: 0,
    cardsCollected: 0
  },
  {
    id: 'ww-004',
    name: 'Lisa Chen',
    company: 'Pacific Rim Foods',
    country: 'Singapore',
    countryFlag: '🇸🇬',
    whatsapp: '+6598765432',
    email: 'lisa@pacificrim.sg',
    products: ['Seafood', 'Rice Products', 'Tropical Fruits'],
    targetCountries: ['UAE', 'Saudi Arabia', 'Qatar'],
    registrationTime: '2025-04-14T11:45:00',
    checkedIn: true,
    checkInTime: '2025-04-14T11:50:00',
    meetingsHeld: 4,
    cardsCollected: 6
  }
];

// Pre-Registered Buyers Sample Data
export const preRegisteredBuyers: PreRegisteredBuyer[] = [
  {
    id: 'rb-001',
    name: 'Mohammed Al Rashid',
    company: 'Al Meera Group',
    country: 'Qatar',
    countryFlag: '🇶🇦',
    email: 'm.alrashid@almeera.qa',
    whatsapp: '+97455224433',
    productInterests: ['Dairy Products', 'Fresh Fruits', 'Beverages'],
    targetCountries: ['UAE', 'Turkey', 'Europe'],
    registrationDate: '2025-04-10',
    status: 'confirmed',
    meetingsScheduled: 5,
    meetingsCompleted: 2,
    attendedSessions: ['Dairy Showcase', 'Beverage Tasting']
  },
  {
    id: 'rb-002',
    name: 'Sarah Williams',
    company: 'EuroMart Retail',
    country: 'Germany',
    countryFlag: '🇩🇪',
    email: 'sarah.w@euromart.de',
    whatsapp: '+4917655223344',
    productInterests: ['Premium Snacks', 'Organic Foods', 'Vegan Products'],
    targetCountries: ['Turkey', 'Morocco', 'Egypt'],
    registrationDate: '2025-04-08',
    status: 'confirmed',
    meetingsScheduled: 3,
    meetingsCompleted: 1,
    attendedSessions: ['Premium Snacks']
  },
  {
    id: 'rb-003',
    name: 'James Liu',
    company: 'Asian Foods Co.',
    country: 'Hong Kong',
    countryFlag: '🇭🇰',
    email: 'james.liu@asianfoods.hk',
    whatsapp: '+85291234567',
    productInterests: ['Seafood', 'Rice Products', 'Asian Sauces'],
    targetCountries: ['UAE', 'Saudi Arabia', 'Qatar'],
    registrationDate: '2025-04-05',
    status: 'attended',
    meetingsScheduled: 4,
    meetingsCompleted: 4,
    attendedSessions: ['Seafood Showcase', 'Asian Cuisine', 'Rice Products', 'Sauce Tasting']
  },
  {
    id: 'rb-004',
    name: 'Fatima Al Zain',
    company: 'Gulf Retail Company',
    country: 'Bahrain',
    countryFlag: '🇧🇭',
    email: 'fatima@gulfretail.bh',
    whatsapp: '+97339284756',
    productInterests: ['Confectionery', 'Bakery Products', 'Beverages'],
    targetCountries: ['UAE', 'Turkey', 'Lebanon'],
    registrationDate: '2025-04-12',
    status: 'pending',
    meetingsScheduled: 2,
    meetingsCompleted: 0,
    attendedSessions: []
  }
];

// ============================================
// 3PL & COLD STORAGE DATA
// ============================================

export interface ThreePLInventory {
  id: string;
  clientId: string;
  clientName: string;
  clientCountry: string;
  clientFlag: string;
  product: string;
  category: string;
  pallets: number;
  zone: 'Frozen' | 'Chilled' | 'Ambient' | 'Controlled';
  temperature: string;
  entryDate: string;
  exitDate: string;
  status: 'active' | 'expiring_soon' | 'released';
  linkedDeal?: string;
  warehouseId: string;
}

export interface ThreePLRequest {
  id: string;
  source: 'supplier' | 'buyer';
  fromName: string;
  fromFlag: string;
  product: string;
  pallets: number;
  zone: string;
  tempRequired: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  linkedDeal?: string;
  status: 'pending' | 'quoted' | 'accepted' | 'declined';
  receivedDate: string;
  specialRequirements?: string;
}

export interface TemperatureZone {
  id: string;
  name: string;
  type: 'Frozen' | 'Chilled' | 'Ambient' | 'Controlled';
  icon: string;
  tempRange: string;
  currentTemp: string;
  capacity: number;
  inUse: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface PalletListing {
  id: string;
  zoneType: 'Frozen' | 'Chilled' | 'Ambient' | 'Controlled';
  availablePallets: number;
  pricePerDay: number;
  pricePerMonth: number;
  availableFrom: string;
  availableUntil: string;
  minBooking: number;
  certifications: string[];
  specialNotes?: string;
  visibility: 'public' | 'private';
  status: 'active' | 'booked' | 'expired';
}

export interface DigitalReceipt {
  id: string;
  receiptType: 'received' | 'release';
  clientName: string;
  clientFlag: string;
  product: string;
  pallets: number;
  zone: string;
  entryDate: string;
  exitDate?: string;
  status: 'pending' | 'issued' | 'sent';
  warehouseId: string;
}

export const threePLInventory: ThreePLInventory[] = [
  {
    id: 'inv-001',
    clientId: 'baladna-food',
    clientName: 'Baladna Food Industries',
    clientCountry: 'Qatar',
    clientFlag: '🇶🇦',
    product: 'UHT Full Cream Milk',
    category: 'Dairy',
    pallets: 120,
    zone: 'Chilled',
    temperature: '4°C',
    entryDate: '2025-01-15',
    exitDate: '2025-02-15',
    status: 'active',
    linkedDeal: 'BB-0892',
    warehouseId: '3pl@brandsbridge.ai'
  },
  {
    id: 'inv-002',
    clientId: 'al-meera',
    clientName: 'Al Meera Consumer Goods',
    clientCountry: 'Qatar',
    clientFlag: '🇶🇦',
    product: 'Frozen Vegetables',
    category: 'Food',
    pallets: 85,
    zone: 'Frozen',
    temperature: '-18°C',
    entryDate: '2025-01-20',
    exitDate: '2025-02-20',
    status: 'active',
    warehouseId: '3pl@brandsbridge.ai'
  },
  {
    id: 'inv-003',
    clientId: 'ozmo-confectionery',
    clientName: 'OZMO Confectionery',
    clientCountry: 'Turkey',
    clientFlag: '🇹🇷',
    product: 'Chocolate Wafers',
    category: 'Confectionery',
    pallets: 200,
    zone: 'Ambient',
    temperature: '18°C',
    entryDate: '2025-01-22',
    exitDate: '2025-03-01',
    status: 'active',
    warehouseId: '3pl@brandsbridge.ai'
  },
  {
    id: 'inv-004',
    clientId: 'gulf-foods',
    clientName: 'Gulf Foods LLC',
    clientCountry: 'Saudi Arabia',
    clientFlag: '🇸🇦',
    product: 'Frozen Chicken',
    category: 'Protein',
    pallets: 150,
    zone: 'Frozen',
    temperature: '-20°C',
    entryDate: '2025-01-25',
    exitDate: '2025-02-10',
    status: 'expiring_soon',
    warehouseId: '3pl@brandsbridge.ai'
  },
  {
    id: 'inv-005',
    clientId: 'savola-group',
    clientName: 'Savola Group',
    clientCountry: 'Saudi Arabia',
    clientFlag: '🇸🇦',
    product: 'Edible Oils',
    category: 'FMCG',
    pallets: 95,
    zone: 'Ambient',
    temperature: '22°C',
    entryDate: '2025-01-10',
    exitDate: '2025-02-28',
    status: 'active',
    warehouseId: '3pl@brandsbridge.ai'
  }
];

export const threePLRequests: ThreePLRequest[] = [
  {
    id: 'req-3pl-001',
    source: 'supplier',
    fromName: 'Baladna Food Industries',
    fromFlag: '🇶🇦',
    product: 'UHT Full Cream Milk',
    pallets: 200,
    zone: 'Chilled',
    tempRequired: '2-8°C',
    durationDays: 45,
    startDate: '2025-02-01',
    endDate: '2025-03-15',
    linkedDeal: 'BB-0892',
    status: 'pending',
    receivedDate: '2025-01-29',
    specialRequirements: 'Halal certified storage required'
  },
  {
    id: 'req-3pl-002',
    source: 'supplier',
    fromName: 'OZMO Confectionery',
    fromFlag: '🇹🇷',
    product: 'Chocolate Products',
    pallets: 80,
    zone: 'Ambient',
    tempRequired: '15-20°C',
    durationDays: 30,
    startDate: '2025-02-05',
    endDate: '2025-03-05',
    status: 'pending',
    receivedDate: '2025-01-28'
  },
  {
    id: 'req-3pl-003',
    source: 'buyer',
    fromName: 'Carrefour UAE',
    fromFlag: '🇦🇪',
    product: 'Frozen Seafood Mix',
    pallets: 150,
    zone: 'Frozen',
    tempRequired: '-25°C to -18°C',
    durationDays: 60,
    startDate: '2025-02-10',
    endDate: '2025-04-10',
    status: 'quoted',
    receivedDate: '2025-01-27'
  },
  {
    id: 'req-3pl-004',
    source: 'supplier',
    fromName: 'Nile Foods Trading',
    fromFlag: '🇪🇬',
    product: 'Canned Tomatoes',
    pallets: 100,
    zone: 'Ambient',
    tempRequired: '15-25°C',
    durationDays: 90,
    startDate: '2025-02-15',
    endDate: '2025-05-15',
    status: 'pending',
    receivedDate: '2025-01-26'
  },
  {
    id: 'req-3pl-005',
    source: 'supplier',
    fromName: 'Almarai Company',
    fromFlag: '🇸🇦',
    product: 'Fresh Dairy Products',
    pallets: 300,
    zone: 'Chilled',
    tempRequired: '0-5°C',
    durationDays: 21,
    startDate: '2025-02-01',
    endDate: '2025-02-21',
    status: 'accepted',
    receivedDate: '2025-01-25'
  }
];

export const temperatureZones: TemperatureZone[] = [
  {
    id: 'zone-a',
    name: 'ZONE A',
    type: 'Frozen',
    icon: '❄️',
    tempRange: '-25°C to -15°C',
    currentTemp: '-18°C',
    capacity: 500,
    inUse: 235,
    status: 'normal'
  },
  {
    id: 'zone-b',
    name: 'ZONE B',
    type: 'Chilled',
    icon: '🧊',
    tempRange: '0°C to 8°C',
    currentTemp: '4°C',
    capacity: 400,
    inUse: 120,
    status: 'normal'
  },
  {
    id: 'zone-c',
    name: 'ZONE C',
    type: 'Ambient',
    icon: '🌡️',
    tempRange: '15°C to 25°C',
    currentTemp: '22°C',
    capacity: 600,
    inUse: 295,
    status: 'normal'
  },
  {
    id: 'zone-d',
    name: 'ZONE D',
    type: 'Controlled',
    icon: '🔬',
    tempRange: 'Custom',
    currentTemp: '12°C',
    capacity: 500,
    inUse: 490,
    status: 'warning'
  }
];

export const palletListings: PalletListing[] = [
  {
    id: 'listing-001',
    zoneType: 'Frozen',
    availablePallets: 265,
    pricePerDay: 2.5,
    pricePerMonth: 65,
    availableFrom: '2025-01-15',
    availableUntil: '2025-06-15',
    minBooking: 20,
    certifications: ['Halal', 'ISO 22000'],
    specialNotes: 'Ideal for frozen proteins and seafood',
    visibility: 'public',
    status: 'active'
  },
  {
    id: 'listing-002',
    zoneType: 'Chilled',
    availablePallets: 280,
    pricePerDay: 3.0,
    pricePerMonth: 80,
    availableFrom: '2025-01-15',
    availableUntil: '2025-06-15',
    minBooking: 15,
    certifications: ['Halal', 'Temperature Log'],
    specialNotes: 'Perfect for dairy and fresh produce',
    visibility: 'public',
    status: 'active'
  },
  {
    id: 'listing-003',
    zoneType: 'Ambient',
    availablePallets: 305,
    pricePerDay: 1.8,
    pricePerMonth: 48,
    availableFrom: '2025-01-15',
    availableUntil: '2025-06-15',
    minBooking: 25,
    certifications: ['Halal', 'Organic'],
    specialNotes: 'Dry goods, confectionery, canned products',
    visibility: 'public',
    status: 'active'
  }
];

export const digitalReceipts: DigitalReceipt[] = [
  {
    id: 'rcpt-001',
    receiptType: 'received',
    clientName: 'Baladna Food Industries',
    clientFlag: '🇶🇦',
    product: 'UHT Full Cream Milk',
    pallets: 120,
    zone: 'Chilled',
    entryDate: '2025-01-15',
    status: 'issued',
    warehouseId: '3pl@brandsbridge.ai'
  },
  {
    id: 'rcpt-002',
    receiptType: 'received',
    clientName: 'Al Meera Consumer Goods',
    clientFlag: '🇶🇦',
    product: 'Frozen Vegetables',
    pallets: 85,
    zone: 'Frozen',
    entryDate: '2025-01-20',
    status: 'issued',
    warehouseId: '3pl@brandsbridge.ai'
  },
  {
    id: 'rcpt-003',
    receiptType: 'release',
    clientName: 'Fresh Valley Foods',
    clientFlag: '🇦🇪',
    product: 'Fresh Poultry',
    pallets: 75,
    zone: 'Chilled',
    entryDate: '2025-01-05',
    exitDate: '2025-01-25',
    status: 'sent',
    warehouseId: '3pl@brandsbridge.ai'
  }
];

export const suggestedSuppliers: { id: string; name: string; flag: string; product: string; reason: string }[] = [
  {
    id: 'sug-001',
    name: 'Fresh Valley Foods',
    flag: '🇦🇪',
    product: 'Fresh Poultry',
    reason: 'Expanding cold storage needs'
  },
  {
    id: 'sug-002',
    name: 'Dubai Seafood Co.',
    flag: '🇦🇪',
    product: 'Premium Seafood',
    reason: 'Recently secured export deals'
  },
  {
    id: 'sug-003',
    name: 'Al Ain Dairy',
    flag: '🇦🇪',
    product: 'Fresh Dairy',
    reason: 'Looking for GCC distribution'
  }
];

// ============================================
// 3PL SUGGESTED SUPPLIERS (AI Intelligence)
// ============================================

export interface SuggestedSupplier3PL {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierCountry: string;
  supplierFlag: string;
  product: string;
  estimatedPallets: number;
  suggestedZone: string;
  reason: string;
  shipmentRoute: string;
  confidence: number;
  eta: string;
  status: 'new' | 'contacted' | 'converted' | 'archived';
  source: string;
}

export const suggestedSuppliers3PL: SuggestedSupplier3PL[] = [
  {
    id: 'sug-3pl-001',
    supplierId: 'ozmo-confectionery',
    supplierName: 'OZMO Confectionery',
    supplierCountry: 'Turkey',
    supplierFlag: '🇹🇷',
    product: 'Chocolate & Confectionery',
    estimatedPallets: 80,
    suggestedZone: 'Ambient',
    reason: 'Active shipment to Dubai detected',
    shipmentRoute: 'Istanbul → Dubai',
    confidence: 87,
    eta: '2025-02-08',
    status: 'new',
    source: 'shipping_intelligence'
  },
  {
    id: 'sug-3pl-002',
    supplierId: 'baladna-food-industries',
    supplierName: 'Baladna Food Industries',
    supplierCountry: 'Qatar',
    supplierFlag: '🇶🇦',
    product: 'Dairy Products — UHT Milk',
    estimatedPallets: 150,
    suggestedZone: 'Chilled',
    reason: 'Regular monthly shipments detected',
    shipmentRoute: 'Doha → Dubai',
    confidence: 94,
    eta: '2025-02-12',
    status: 'new',
    source: 'shipping_intelligence'
  },
  {
    id: 'sug-3pl-003',
    supplierId: 'gulf-food-industries',
    supplierName: 'Gulf Food Industries',
    supplierCountry: 'Kuwait',
    supplierFlag: '🇰🇼',
    product: 'Frozen Food Products',
    estimatedPallets: 60,
    suggestedZone: 'Frozen',
    reason: 'New trade route opened to UAE',
    shipmentRoute: 'Kuwait → Dubai',
    confidence: 72,
    eta: '2025-02-20',
    status: 'new',
    source: 'shipping_intelligence'
  },
  {
    id: 'sug-3pl-004',
    supplierId: 'nile-foods-trading',
    supplierName: 'Nile Foods Trading',
    supplierCountry: 'Egypt',
    supplierFlag: '🇪🇬',
    product: 'Canned & Preserved Foods',
    estimatedPallets: 120,
    suggestedZone: 'Ambient',
    reason: 'Expanded distribution to GCC',
    shipmentRoute: 'Cairo → Dubai',
    confidence: 81,
    eta: '2025-02-15',
    status: 'contacted',
    source: 'shipping_intelligence'
  },
  {
    id: 'sug-3pl-005',
    supplierId: 'almarai-company',
    supplierName: 'Almarai Company',
    supplierCountry: 'Saudi Arabia',
    supplierFlag: '🇸🇦',
    product: 'Fresh Dairy & Juices',
    estimatedPallets: 200,
    suggestedZone: 'Chilled',
    reason: 'New retail partnership in UAE',
    shipmentRoute: 'Riyadh → Dubai',
    confidence: 91,
    eta: '2025-02-25',
    status: 'converted',
    source: 'shipping_intelligence'
  }
];

// ============================================
// 3PL COMPANIES FOR EXPO HALL
// ============================================

export interface ThreePLCompany {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  country: string;
  countryFlag: string;
  city: string;
  yearEstablished: number;
  warehouseCount: number;
  totalCapacity: number;
  availableNow: number;
  services: string[];
  certifications: string[];
  aiReliability: number;
  verified: boolean;
  pricing?: {
    frozen?: number;
    chilled?: number;
    ambient?: number;
    minBooking: number;
  };
  contactPerson: string;
  contactTitle: string;
  whatsapp: string;
  email: string;
  languages: string[];
}

export const threePLCompanies: ThreePLCompany[] = [
  {
    id: '3pl-001',
    name: 'Gulf Cold Chain Co.',
    logo: '🏭',
    tagline: 'Premium cold storage solutions across the GCC',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    city: 'Dubai',
    yearEstablished: 2015,
    warehouseCount: 2,
    totalCapacity: 2000,
    availableNow: 760,
    services: ['Frozen Storage', 'Chilled Storage', 'Ambient Storage', 'Cross-Docking', 'Pick & Pack'],
    certifications: ['ISO 22000', 'Halal Certified Storage', 'HACCP'],
    aiReliability: 96,
    verified: true,
    pricing: {
      frozen: 2.5,
      chilled: 3.0,
      ambient: 1.8,
      minBooking: 20
    },
    contactPerson: 'Ahmed Al Mansoori',
    contactTitle: 'Business Development Manager',
    whatsapp: '+971501234567',
    email: 'business@gulfcoldchain.ae',
    languages: ['English', 'Arabic', 'Hindi']
  },
  {
    id: '3pl-002',
    name: 'Emirates Cold Storage',
    logo: '❄️',
    tagline: 'Your trusted partner in temperature-controlled logistics',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    city: 'Abu Dhabi',
    yearEstablished: 2010,
    warehouseCount: 3,
    totalCapacity: 3500,
    availableNow: 1250,
    services: ['Frozen Storage', 'Chilled Storage', 'Controlled Atmosphere', 'Bonded Warehouse', 'Customs Clearance'],
    certifications: ['ISO 9001', 'ISO 22000', 'GDP', 'FIATA Member', 'Customs Bonded'],
    aiReliability: 98,
    verified: true,
    pricing: {
      frozen: 2.8,
      chilled: 3.5,
      ambient: 2.0,
      minBooking: 25
    },
    contactPerson: 'Fatima Al Zaabi',
    contactTitle: 'Operations Director',
    whatsapp: '+971502345678',
    email: 'ops@emiratescold.ae',
    languages: ['English', 'Arabic']
  },
  {
    id: '3pl-003',
    name: 'Qatar Cold Logistics',
    logo: '🏢',
    tagline: 'State-of-the-art cold chain solutions in Qatar',
    country: 'Qatar',
    countryFlag: '🇶🇦',
    city: 'Doha',
    yearEstablished: 2018,
    warehouseCount: 1,
    totalCapacity: 1500,
    availableNow: 450,
    services: ['Frozen Storage', 'Chilled Storage', 'Last-Mile Delivery', 'Inventory Management'],
    certifications: ['ISO 22000', 'Halal Certified Storage'],
    aiReliability: 94,
    verified: true,
    pricing: {
      frozen: 3.2,
      chilled: 3.8,
      ambient: 2.2,
      minBooking: 15
    },
    contactPerson: 'Mohammed Al Emadi',
    contactTitle: 'Sales Manager',
    whatsapp: '+97466123456',
    email: 'sales@qatarcold.qa',
    languages: ['English', 'Arabic', 'French']
  },
  {
    id: '3pl-004',
    name: 'Saudi Cold Chain Co.',
    logo: '🌡️',
    tagline: 'Connecting the Kingdom through precision cold chain',
    country: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    city: 'Jeddah',
    yearEstablished: 2012,
    warehouseCount: 4,
    totalCapacity: 5000,
    availableNow: 1800,
    services: ['Frozen Storage', 'Chilled Storage', 'Ambient Storage', 'Hazmat Storage', 'Cross-Docking', 'Last-Mile Delivery'],
    certifications: ['ISO 9001', 'ISO 22000', 'HACCP', 'Halal Certified Storage', 'GDP'],
    aiReliability: 97,
    verified: true,
    pricing: {
      frozen: 2.2,
      chilled: 2.8,
      ambient: 1.5,
      minBooking: 30
    },
    contactPerson: 'Khalid Al Ghamdi',
    contactTitle: 'General Manager',
    whatsapp: '+966501234567',
    email: 'info@saudicoldchain.sa',
    languages: ['English', 'Arabic']
  }
];

// ============================================
// CARGO AUCTION DATA - Ready-to-Ship Containers
// ============================================

export interface CargoAuctionItem {
  id: string;
  productName: string;
  productVariant: string;
  category: string;
  supplierId: string;
  supplierName: string;
  supplierCountry: string;
  supplierFlag: string;
  supplierVerified: boolean;
  container: {
    type: string;
    quantity: number;
    cases: number;
    grossWeight: string;
    volume?: string;
  };
  origin: {
    port: string;
    country: string;
    readyDate: string;
  };
  certifications: string[];
  productDetails: {
    shelfLife: string;
    storage: string;
    minTemp?: number;
    maxTemp?: number;
  };
  targetMarkets: string[];
  deliveryPrices: {
    port: string;
    country: string;
    price: number;
    flag: string;
  }[];
  media: {
    images: string[];
    videos?: {
      type: string;
      url: string;
      thumbnail: string;
    }[];
  };
  auction: {
    createdAt: string;
    expiresAt: string;
    status: 'active' | 'reserved' | 'sold' | 'expired';
    reservations: number;
    views: number;
  };
  platformFees: {
    platformFeePercent: number;
    escrowFee: number;
    depositPercent: number;
  };
}

export const cargoAuctions: CargoAuctionItem[] = [
  {
    id: 'CA-2025-001',
    productName: 'Chocolate Wafer Bars',
    productVariant: '750g Family Pack',
    category: 'Confectionery',
    supplierId: 'ozmo-confectionery',
    supplierName: 'OZMO Confectionery',
    supplierCountry: 'Turkey',
    supplierFlag: '🇹🇷',
    supplierVerified: true,
    container: {
      type: '40ft',
      quantity: 1,
      cases: 1200,
      grossWeight: '18 MT',
      volume: '55 CBM'
    },
    origin: {
      port: 'Mersin',
      country: 'Turkey',
      readyDate: '2025-01-30'
    },
    certifications: ['Halal', 'ISO 22000', 'HACCP'],
    productDetails: {
      shelfLife: '12 months',
      storage: 'Cool & dry place',
      minTemp: 15,
      maxTemp: 25
    },
    targetMarkets: ['GCC', 'Middle East', 'North Africa'],
    deliveryPrices: [
      { port: 'Jeddah', country: 'Saudi Arabia', price: 28500, flag: '🇸🇦' },
      { port: 'Dubai', country: 'UAE', price: 27200, flag: '🇦🇪' },
      { port: 'Kuwait City', country: 'Kuwait', price: 29100, flag: '🇰🇼' },
      { port: 'Doha', country: 'Qatar', price: 26800, flag: '🇶🇦' },
      { port: 'Casablanca', country: 'Morocco', price: 31200, flag: '🇲🇦' }
    ],
    media: {
      images: [
        'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop'
      ],
      videos: [
        {
          type: 'product',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200&h=150&fit=crop'
        }
      ]
    },
    auction: {
      createdAt: '2025-01-30T08:00:00Z',
      expiresAt: '2025-01-31T08:00:00Z',
      status: 'active',
      reservations: 0,
      views: 147
    },
    platformFees: {
      platformFeePercent: 2,
      escrowFee: 150,
      depositPercent: 20
    }
  },
  {
    id: 'CA-2025-002',
    productName: 'UHT Full Cream Milk',
    productVariant: '1L Tetra Pack',
    category: 'Dairy',
    supplierId: 'baladna-food',
    supplierName: 'Baladna Food Industries',
    supplierCountry: 'Qatar',
    supplierFlag: '🇶🇦',
    supplierVerified: true,
    container: {
      type: '40ft Reefer',
      quantity: 1,
      cases: 2400,
      grossWeight: '24 MT',
      volume: '60 CBM'
    },
    origin: {
      port: 'Hamad',
      country: 'Qatar',
      readyDate: '2025-01-30'
    },
    certifications: ['Halal', 'ISO 22000', 'ISO 9001'],
    productDetails: {
      shelfLife: '9 months',
      storage: 'Room temperature before opening, refrigerate after',
      minTemp: 2,
      maxTemp: 8
    },
    targetMarkets: ['GCC', 'Middle East'],
    deliveryPrices: [
      { port: 'Dubai', country: 'UAE', price: 32400, flag: '🇦🇪' },
      { port: 'Jeddah', country: 'Saudi Arabia', price: 34200, flag: '🇸🇦' },
      { port: 'Muscat', country: 'Oman', price: 33100, flag: '🇴🇲' }
    ],
    media: {
      images: [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop'
      ]
    },
    auction: {
      createdAt: '2025-01-30T06:00:00Z',
      expiresAt: '2025-01-31T14:00:00Z',
      status: 'active',
      reservations: 0,
      views: 89
    },
    platformFees: {
      platformFeePercent: 2,
      escrowFee: 150,
      depositPercent: 20
    }
  },
  {
    id: 'CA-2025-003',
    productName: 'Basmati Rice Premium',
    productVariant: '25kg Bags',
    category: 'Grains',
    supplierId: 'al-rahma-rice',
    supplierName: 'Al Rahma Rice Mills',
    supplierCountry: 'Pakistan',
    supplierFlag: '🇵🇰',
    supplierVerified: true,
    container: {
      type: '20ft',
      quantity: 1,
      cases: 1000,
      grossWeight: '25 MT',
      volume: '32 CBM'
    },
    origin: {
      port: 'Karachi',
      country: 'Pakistan',
      readyDate: '2025-01-30'
    },
    certifications: ['IPM', 'Halal', 'ISO 22000'],
    productDetails: {
      shelfLife: '24 months',
      storage: 'Cool & dry place, away from direct sunlight'
    },
    targetMarkets: ['GCC', 'Middle East', 'East Africa'],
    deliveryPrices: [
      { port: 'Jeddah', country: 'Saudi Arabia', price: 42500, flag: '🇸🇦' },
      { port: 'Dubai', country: 'UAE', price: 41200, flag: '🇦🇪' },
      { port: 'Mombasa', country: 'Kenya', price: 44800, flag: '🇰🇪' }
    ],
    media: {
      images: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=400&fit=crop'
      ]
    },
    auction: {
      createdAt: '2025-01-29T10:00:00Z',
      expiresAt: '2025-01-30T22:00:00Z',
      status: 'active',
      reservations: 0,
      views: 234
    },
    platformFees: {
      platformFeePercent: 2,
      escrowFee: 150,
      depositPercent: 20
    }
  },
  {
    id: 'CA-2025-004',
    productName: 'Premium Dates Medjool',
    productVariant: '1kg Gift Box',
    category: 'Dried Fruits',
    supplierId: 'al-dhafrah-dates',
    supplierName: 'Al Dhafrah Dates Co.',
    supplierCountry: 'UAE',
    supplierFlag: '🇦🇪',
    supplierVerified: true,
    container: {
      type: '20ft',
      quantity: 1,
      cases: 800,
      grossWeight: '12 MT',
      volume: '28 CBM'
    },
    origin: {
      port: 'Dubai',
      country: 'UAE',
      readyDate: '2025-01-29'
    },
    certifications: ['Halal', 'Organic', 'ISO 22000'],
    productDetails: {
      shelfLife: '18 months',
      storage: 'Cool & dry place'
    },
    targetMarkets: ['Europe', 'Asia Pacific', 'North America'],
    deliveryPrices: [
      { port: 'Rotterdam', country: 'Netherlands', price: 35800, flag: '🇳🇱' },
      { port: 'Hamburg', country: 'Germany', price: 36200, flag: '🇩🇪' },
      { port: 'Singapore', country: 'Singapore', price: 38500, flag: '🇸🇬' }
    ],
    media: {
      images: [
        'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1568702846914-96b305d2uj87?w=400&h=400&fit=crop'
      ]
    },
    auction: {
      createdAt: '2025-01-29T08:00:00Z',
      expiresAt: '2025-01-30T08:00:00Z',
      status: 'active',
      reservations: 0,
      views: 178
    },
    platformFees: {
      platformFeePercent: 2,
      escrowFee: 150,
      depositPercent: 20
    }
  },
  {
    id: 'CA-2025-005',
    productName: 'Frozen Chicken Breast',
    productVariant: '2.5kg Bag (IQF)',
    category: 'Meat & Poultry',
    supplierId: 'nile-poultry',
    supplierName: 'Nile Poultry Exports',
    supplierCountry: 'Egypt',
    supplierFlag: '🇪🇬',
    supplierVerified: true,
    container: {
      type: '40ft Reefer',
      quantity: 1,
      cases: 1500,
      grossWeight: '26 MT',
      volume: '50 CBM'
    },
    origin: {
      port: 'Port Said',
      country: 'Egypt',
      readyDate: '2025-01-30'
    },
    certifications: ['Halal', 'ISO 22000', 'HACCP', 'EU Export Approved'],
    productDetails: {
      shelfLife: '12 months',
      storage: 'Frozen at -18°C or below'
    },
    targetMarkets: ['GCC', 'Middle East', 'West Africa'],
    deliveryPrices: [
      { port: 'Jeddah', country: 'Saudi Arabia', price: 48500, flag: '🇸🇦' },
      { port: 'Dubai', country: 'UAE', price: 47200, flag: '🇦🇪' },
      { port: 'Lagos', country: 'Nigeria', price: 51200, flag: '🇳🇬' }
    ],
    media: {
      images: [
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=400&fit=crop'
      ]
    },
    auction: {
      createdAt: '2025-01-30T04:00:00Z',
      expiresAt: '2025-01-31T04:00:00Z',
      status: 'active',
      reservations: 0,
      views: 312
    },
    platformFees: {
      platformFeePercent: 2,
      escrowFee: 200,
      depositPercent: 20
    }
  }
];

// ============================================
// SUPPLIER CARGO AUCTION DATA
// ============================================

export interface SupplierCargoListing {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierCountry: string;
  supplierFlag: string;
  supplierVerified: boolean;
  productName: string;
  productVariant: string;
  category: string;
  container: {
    type: string;
    quantity: number;
    cases: number;
    grossWeight: string;
    volume?: string;
  };
  origin: {
    port: string;
    country: string;
    readyDate: string;
  };
  certifications: string[];
  productDetails: {
    shelfLife: string;
    storage: string;
    minTemp?: number;
    maxTemp?: number;
  };
  deliveryPrices: {
    port: string;
    country: string;
    price: number;
    flag: string;
  }[];
  media: {
    images: string[];
    videos?: {
      type: string;
      url: string;
      thumbnail: string;
    }[];
  };
  auction: {
    createdAt: string;
    expiresAt: string;
    status: 'active' | 'reserved' | 'sold' | 'expired';
    duration: number;
    autoRenew: boolean;
  };
  stats: {
    views: number;
    reservations: number;
  };
}

export interface SupplierCargoReservation {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerCountry: string;
  buyerFlag: string;
  contactPerson: string;
  productName: string;
  containerType: string;
  destination: {
    port: string;
    country: string;
    flag: string;
  };
  totalPrice: number;
  depositPaid: number;
  balanceOnArrival: number;
  status: 'awaiting_dispatch' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shipByDate: string;
  trackingInfo?: string;
  blNumber?: string;
  isUrgent: boolean;
  timeRemaining: string;
}

export const supplierCargoListings: SupplierCargoListing[] = [
  {
    id: 'sup-cargo-001',
    supplierId: 'ozmo-confectionery',
    supplierName: 'OZMO Confectionery',
    supplierCountry: 'Turkey',
    supplierFlag: '🇹🇷',
    supplierVerified: true,
    productName: 'Chocolate Wafer Bars',
    productVariant: '750g Family Pack',
    category: 'Confectionery',
    container: {
      type: '40ft',
      quantity: 1,
      cases: 1200,
      grossWeight: '18 MT',
      volume: '55 CBM'
    },
    origin: {
      port: 'Mersin',
      country: 'Turkey',
      readyDate: '2025-01-30'
    },
    certifications: ['Halal', 'ISO 22000', 'HACCP'],
    productDetails: {
      shelfLife: '12 months',
      storage: 'Cool & dry place',
      minTemp: 15,
      maxTemp: 25
    },
    deliveryPrices: [
      { port: 'Jeddah', country: 'Saudi Arabia', price: 28500, flag: '🇸🇦' },
      { port: 'Dubai', country: 'UAE', price: 27200, flag: '🇦🇪' },
      { port: 'Kuwait City', country: 'Kuwait', price: 29100, flag: '🇰🇼' },
      { port: 'Doha', country: 'Qatar', price: 26800, flag: '🇶🇦' }
    ],
    media: {
      images: [
        'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
      ]
    },
    auction: {
      createdAt: '2025-01-30T08:00:00Z',
      expiresAt: '2025-01-31T08:00:00Z',
      status: 'active',
      duration: 24,
      autoRenew: false
    },
    stats: {
      views: 147,
      reservations: 0
    }
  },
  {
    id: 'sup-cargo-002',
    supplierId: 'baladna-food',
    supplierName: 'Baladna Food Industries',
    supplierCountry: 'Qatar',
    supplierFlag: '🇶🇦',
    supplierVerified: true,
    productName: 'UHT Full Cream Milk',
    productVariant: '1L Tetra Pack',
    category: 'Dairy',
    container: {
      type: '40ft Reefer',
      quantity: 1,
      cases: 2400,
      grossWeight: '24 MT',
      volume: '60 CBM'
    },
    origin: {
      port: 'Hamad',
      country: 'Qatar',
      readyDate: '2025-01-30'
    },
    certifications: ['Halal', 'ISO 22000', 'ISO 9001'],
    productDetails: {
      shelfLife: '9 months',
      storage: 'Room temperature before opening, refrigerate after',
      minTemp: 2,
      maxTemp: 8
    },
    deliveryPrices: [
      { port: 'Dubai', country: 'UAE', price: 32400, flag: '🇦🇪' },
      { port: 'Jeddah', country: 'Saudi Arabia', price: 34200, flag: '🇸🇦' }
    ],
    media: {
      images: [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop'
      ]
    },
    auction: {
      createdAt: '2025-01-30T06:00:00Z',
      expiresAt: '2025-01-31T14:00:00Z',
      status: 'active',
      duration: 24,
      autoRenew: true
    },
    stats: {
      views: 89,
      reservations: 0
    }
  }
];

export const supplierCargoReservations: SupplierCargoReservation[] = [
  {
    id: 'CR-2025-0892',
    listingId: 'sup-cargo-001',
    buyerId: 'buyer-001',
    buyerName: 'Ahmed Al Rashid',
    buyerCompany: 'Al Meera Consumer Goods',
    buyerCountry: 'Qatar',
    buyerFlag: '🇶🇦',
    contactPerson: 'Ahmed Al Rashid',
    productName: 'Chocolate Wafer Bars 750g',
    containerType: '40ft HC',
    destination: {
      port: 'Jeddah',
      country: 'Saudi Arabia',
      flag: '🇸🇦'
    },
    totalPrice: 28500,
    depositPaid: 5700,
    balanceOnArrival: 22800,
    status: 'awaiting_dispatch',
    createdAt: '2025-01-30T10:30:00Z',
    shipByDate: '2025-02-01T10:30:00Z',
    isUrgent: true,
    timeRemaining: '46h 15m'
  },
  {
    id: 'CR-2025-0891',
    listingId: 'sup-cargo-002',
    buyerId: 'buyer-002',
    buyerName: 'Khalid Hassan',
    buyerCompany: 'Union Coop UAE',
    buyerCountry: 'UAE',
    buyerFlag: '🇦🇪',
    contactPerson: 'Khalid Hassan',
    productName: 'UHT Full Cream Milk 1L',
    containerType: '40ft Reefer',
    destination: {
      port: 'Dubai',
      country: 'UAE',
      flag: '🇦🇪'
    },
    totalPrice: 32400,
    depositPaid: 6480,
    balanceOnArrival: 25920,
    status: 'shipped',
    createdAt: '2025-01-28T14:00:00Z',
    shipByDate: '2025-01-30T14:00:00Z',
    trackingInfo: 'MAEU-7823456',
    blNumber: 'HLC-DXB-2025-001234',
    isUrgent: false,
    timeRemaining: 'Shipped'
  }
];

// Penalty Records
export interface PenaltyRecord {
  supplierId: string;
  offense: 'cancellation' | 'late_ship' | 'false_listing';
  date: string;
  amount: number;
  status: 'active' | 'resolved';
  listingId?: string;
  reservationId?: string;
}

export const supplierPenalties: PenaltyRecord[] = [];

// Supplier Cargo Stats
export const supplierCargoStats = {
  totalListings: 24,
  soldListings: 18,
  conversionRate: 75,
  avgTimeToSell: 14,
  onTimeRate: 100,
  supplierRating: 4.9,
  cancellationPenalty: 0,
  topDestinations: [
    { port: 'Jeddah', country: 'Saudi Arabia', shipments: 8 },
    { port: 'Dubai', country: 'UAE', shipments: 5 },
    { port: 'Kuwait', country: 'Kuwait', shipments: 3 },
    { port: 'Doha', country: 'Qatar', shipments: 2 },
    { port: 'Casablanca', country: 'Morocco', shipments: 1 },
  ],
  revenueHistory: [
    { month: 'Aug', revenue: 24500 },
    { month: 'Sep', revenue: 32100 },
    { month: 'Oct', revenue: 28900 },
    { month: 'Nov', revenue: 41200 },
    { month: 'Dec', revenue: 38500 },
    { month: 'Jan', revenue: 43100 },
  ]
};
