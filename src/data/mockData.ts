// Mock Data for CMS-Ready Structure - DIGITAL FOOD EXPO
// This structure supports Webflow CMS and future VR integration

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
  // Meeting Request System
  internationalSalesEmail?: string;
  googleMeetLink?: string;
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

export interface CargoAuction {
  id: string;
  sellerId: string;
  sellerName: string;
  productName: string;
  productImage: string;
  quantity: string;
  containerType: string;
  originPort: string;
  targetMarkets: string[];
  destinationPorts: { port: string; price: number }[];
  minDeposit: number;
  depositPercent: number;
  expiresAt: string;
  status: 'active' | 'reserved' | 'sold' | 'expired';
  certifications: string[];
  specifications: string;
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
    paymentTerms: ['LC at Sight', 'TT 30% advance'], shippingPorts: ['Doha', 'Hamad Port']
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
    paymentTerms: ['LC at Sight', 'TT 50% advance'], shippingPorts: ['Doha', 'Hamad Port']
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
    paymentTerms: ['LC at Sight', 'TT', 'EXW'], shippingPorts: ['Doha', 'Hamad Port']
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
    paymentTerms: ['LC at Sight', 'TT 50% advance'], shippingPorts: ['Jeddah', 'Dammam', 'Riyadh']
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
    paymentTerms: ['LC at Sight', 'TT 30% advance'], shippingPorts: ['Jeddah', 'Dammam']
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
    paymentTerms: ['LC at Sight', 'TT 30% advance'], shippingPorts: ['Jebel Ali', 'Abu Dhabi']
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
    paymentTerms: ['LC at Sight', 'TT 30% advance'], shippingPorts: ['Jebel Ali']
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
    paymentTerms: ['LC at Sight', 'TT 50% advance'], shippingPorts: ['Jebel Ali', 'Abu Dhabi']
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
    paymentTerms: ['LC at Sight', 'TT 30% advance'], shippingPorts: ['Shuwaikh', 'Doha Port']
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
    paymentTerms: ['LC at Sight', 'TT 30% advance'], shippingPorts: ['Sohar', 'Muscat']
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

// DAILY CARGO AUCTION
export const cargoAuctions: CargoAuction[] = [
  {
    id: '1', sellerId: '1', sellerName: 'OZMO Confectionery',
    productName: 'Chocolate Wafer Bars - 750g Family Pack',
    productImage: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400',
    quantity: '1 x 40ft Container (1,200 cases)', containerType: '40ft Reefer',
    originPort: 'Mersin, Turkey', targetMarkets: ['GCC', 'Middle East', 'North Africa'],
    destinationPorts: [
      { port: 'Jeddah, Saudi Arabia', price: 28500 },
      { port: 'Dubai, UAE', price: 27200 },
      { port: 'Kuwait City, Kuwait', price: 29100 },
      { port: 'Casablanca, Morocco', price: 31200 }
    ],
    minDeposit: 5700, depositPercent: 20, expiresAt: '2024-01-20T23:59:59', status: 'active',
    certifications: ['Halal', 'ISO 22000'], specifications: 'Shelf life: 12 months, Storage: Cool & dry place'
  },
  {
    id: '2', sellerId: '2', sellerName: 'Almarai Company',
    productName: 'UHT Full Cream Milk - 1L Tetra Pack',
    productImage: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400',
    quantity: '2 x 40ft Containers (4,800 cases)', containerType: '40ft Dry',
    originPort: 'Jeddah, Saudi Arabia', targetMarkets: ['GCC', 'Africa', 'Levant'],
    destinationPorts: [
      { port: 'Djibouti', price: 52000 },
      { port: 'Mogadishu, Somalia', price: 54500 },
      { port: 'Aden, Yemen', price: 48000 },
      { port: 'Amman, Jordan', price: 46500 }
    ],
    minDeposit: 9600, depositPercent: 20, expiresAt: '2024-01-22T23:59:59', status: 'active',
    certifications: ['Halal', 'SASO'], specifications: 'Shelf life: 9 months, UHT treated'
  },
  {
    id: '3', sellerId: '5', sellerName: 'Nile Foods International',
    productName: 'Canned Fava Beans (Foul Medames) - 400g',
    productImage: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400',
    quantity: '1 x 20ft Container (2,400 cases)', containerType: '20ft Dry',
    originPort: 'Alexandria, Egypt', targetMarkets: ['Middle East', 'Europe', 'USA'],
    destinationPorts: [
      { port: 'Beirut, Lebanon', price: 18500 },
      { port: 'Dubai, UAE', price: 21200 },
      { port: 'Rotterdam, Netherlands', price: 24500 },
      { port: 'New York, USA', price: 28000 }
    ],
    minDeposit: 3700, depositPercent: 20, expiresAt: '2024-01-25T23:59:59', status: 'active',
    certifications: ['ISO 22000', 'Halal', 'FDA'], specifications: 'Shelf life: 36 months, Ready to eat'
  }
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
