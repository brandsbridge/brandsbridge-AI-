// ============================================
// BRANDS BRIDGE AI - MASTER FEATURE CONTROL
// ============================================
// This is the SINGLE SOURCE OF TRUTH
// for all features on the platform.
// Every feature status change happens here.
// ============================================

export type FeatureStatus =
  | 'admin_only'    // Only admin sees it
  | 'beta'          // Selected users only
  | 'suppliers'     // All suppliers
  | 'buyers'        // All buyers
  | 'shipping'      // Shipping companies
  | 'all_users'     // Everyone logged in
  | 'public'        // Visible to visitors
  | 'disabled';     // Hidden from everyone

export type FeatureCategory =
  | 'core'
  | 'supplier'
  | 'buyer'
  | 'shipping'
  | 'public'
  | 'ai'
  | 'payments'
  | 'future';

export type FeaturePlan = 'free' | 'growth' | 'enterprise' | 'all';

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  status: FeatureStatus;
  visibleTo: string[]; // list of specific user emails for granular control
  buildDate: string | null;
  deployDate: string | null;
  builtBy: string | null;
  notes: string;
  icon: string;
  isMonetized: boolean;
  plan: FeaturePlan;
  usageStats?: {
    views: number;
    activeUsers: number;
    conversions: number;
  };
}

export const FEATURE_FLAGS: Feature[] = [

  // ═══════════════════════════════════════════
  // 🔵 CORE FEATURES (Already Live)
  // ═══════════════════════════════════════════

  {
    id: 'expo_hall',
    name: 'Expo Hall',
    description: 'Public company directory with search and filters',
    category: 'core',
    status: 'public',
    visibleTo: [],
    buildDate: '2025-01-01',
    deployDate: '2025-01-15',
    builtBy: 'MiniMax Agent',
    notes: 'Core feature - always public',
    icon: '🏛️',
    isMonetized: false,
    plan: 'all',
    usageStats: { views: 12500, activeUsers: 890, conversions: 234 }
  },
  {
    id: 'live_deal_room',
    name: 'Live Deal Room',
    description: 'Real-time video negotiation between buyers and suppliers',
    category: 'supplier',
    status: 'all_users',
    visibleTo: [],
    buildDate: '2025-01-10',
    deployDate: '2025-01-20',
    builtBy: 'MiniMax Agent',
    notes: 'Live now for all users - popular feature',
    icon: '🔴',
    isMonetized: true,
    plan: 'growth',
    usageStats: { views: 3420, activeUsers: 156, conversions: 89 }
  },
  {
    id: 'virtual_booth',
    name: 'Virtual Booth',
    description: 'Company virtual visit experience with 360° views',
    category: 'supplier',
    status: 'all_users',
    visibleTo: [],
    buildDate: '2025-01-25',
    deployDate: '2025-02-01',
    builtBy: 'MiniMax Agent',
    notes: 'Deployed to all users - unique selling point',
    icon: '🥽',
    isMonetized: true,
    plan: 'growth',
    usageStats: { views: 2890, activeUsers: 234, conversions: 67 }
  },
  {
    id: 'crm_dashboard',
    name: 'Sales CRM',
    description: 'Supplier sales pipeline and lead management',
    category: 'supplier',
    status: 'suppliers',
    visibleTo: [],
    buildDate: '2025-01-05',
    deployDate: '2025-01-18',
    builtBy: 'MiniMax Agent',
    notes: 'Suppliers only - driving engagement',
    icon: '📊',
    isMonetized: true,
    plan: 'growth',
    usageStats: { views: 1890, activeUsers: 45, conversions: 12 }
  },
  {
    id: 'crb_hub',
    name: 'CRB Hub (ERP)',
    description: 'Full ERP system for supplier operations',
    category: 'supplier',
    status: 'suppliers',
    visibleTo: [],
    buildDate: '2025-01-08',
    deployDate: '2025-01-22',
    builtBy: 'MiniMax Agent',
    notes: 'Enterprise plan feature - premium tier',
    icon: '📦',
    isMonetized: true,
    plan: 'enterprise',
    usageStats: { views: 890, activeUsers: 12, conversions: 5 }
  },
  {
    id: 'procurement_hub',
    name: 'Procurement Hub',
    description: 'Buyer sourcing and RFQ management system',
    category: 'buyer',
    status: 'buyers',
    visibleTo: [],
    buildDate: '2025-01-12',
    deployDate: '2025-01-25',
    builtBy: 'MiniMax Agent',
    notes: 'Buyers only - free tier feature',
    icon: '🛒',
    isMonetized: false,
    plan: 'free',
    usageStats: { views: 2340, activeUsers: 67, conversions: 34 }
  },
  {
    id: 'logistics_hub',
    name: 'Logistics Hub',
    description: 'Freight marketplace and shipping coordination',
    category: 'shipping',
    status: 'all_users',
    visibleTo: [],
    buildDate: '2025-01-15',
    deployDate: '2025-01-28',
    builtBy: 'MiniMax Agent',
    notes: 'Public marketplace - connecting all roles',
    icon: '🚢',
    isMonetized: true,
    plan: 'growth',
    usageStats: { views: 4560, activeUsers: 123, conversions: 56 }
  },
  {
    id: '3pl_portal',
    name: '3PL & Cold Storage Portal',
    description: 'Temperature-controlled warehouse directory with AI matching and supplier intelligence',
    category: 'shipping',
    status: 'all_users',
    visibleTo: [],
    buildDate: '2025-04-17',
    deployDate: '2025-04-17',
    builtBy: 'MiniMax Agent',
    notes: 'Newly launched. Connects suppliers with 3PL providers for storage needs. AI suggests suppliers based on destination cities.',
    icon: '❄️',
    isMonetized: true,
    plan: 'growth',
    usageStats: { views: 0, activeUsers: 0, conversions: 0 }
  },
  {
    id: 'cargo_auction',
    name: 'Cargo Auction',
    description: 'Ready-to-ship container marketplace',
    category: 'public',
    status: 'all_users',
    visibleTo: [],
    buildDate: '2025-01-18',
    deployDate: '2025-02-01',
    builtBy: 'MiniMax Agent',
    notes: 'Premium members only - high value feature',
    icon: '⚡',
    isMonetized: true,
    plan: 'growth',
    usageStats: { views: 1890, activeUsers: 45, conversions: 23 }
  },
  {
    id: 'market_prices',
    name: 'Market Intelligence',
    description: 'Live FMCG commodity prices and trends',
    category: 'public',
    status: 'public',
    visibleTo: [],
    buildDate: '2025-01-20',
    deployDate: '2025-02-01',
    builtBy: 'MiniMax Agent',
    notes: 'Free for all - great for engagement',
    icon: '📈',
    isMonetized: false,
    plan: 'free',
    usageStats: { views: 8900, activeUsers: 456, conversions: 0 }
  },
  {
    id: 'ai_assistant',
    name: 'AI Chat Assistant',
    description: 'Floating AI helper for instant support',
    category: 'ai',
    status: 'public',
    visibleTo: [],
    buildDate: '2025-01-22',
    deployDate: '2025-02-01',
    builtBy: 'MiniMax Agent',
    notes: 'Available to everyone - AI powered',
    icon: '🤖',
    isMonetized: false,
    plan: 'all',
    usageStats: { views: 15000, activeUsers: 2340, conversions: 0 }
  },

  // ═══════════════════════════════════════════
  // 🟡 IN TESTING (Admin Only)
  // ═══════════════════════════════════════════

  {
    id: 'vr_expo',
    name: 'VR Expo Experience',
    description: 'Full virtual reality expo with immersive booths',
    category: 'future',
    status: 'admin_only',
    visibleTo: ['admin@brandsbridge.ai'],
    buildDate: '2025-02-01',
    deployDate: null,
    builtBy: 'MiniMax Agent',
    notes: 'Building WebVR foundation. Target: 2026 WebVR launch, 2027 Full VR platform. Event planned for first users.',
    icon: '🥽',
    isMonetized: true,
    plan: 'enterprise'
  },
  {
    id: 'profile_editor',
    name: 'Supplier Profile Editor',
    description: 'Full profile management with AI-powered writing',
    category: 'supplier',
    status: 'admin_only',
    visibleTo: ['admin@brandsbridge.ai'],
    buildDate: '2025-02-01',
    deployDate: null,
    builtBy: 'MiniMax Agent',
    notes: 'Testing AI writing tools. Ready for supplier beta soon.',
    icon: '✏️',
    isMonetized: false,
    plan: 'all'
  },
  {
    id: 'claim_profile',
    name: 'Claim Profile System',
    description: 'Unclaimed company claiming and verification',
    category: 'public',
    status: 'admin_only',
    visibleTo: ['admin@brandsbridge.ai'],
    buildDate: '2025-02-01',
    deployDate: null,
    builtBy: 'MiniMax Agent',
    notes: 'Core growth strategy. 5000 companies plan. Deploy after testing.',
    icon: '🏷️',
    isMonetized: false,
    plan: 'all'
  },
  {
    id: 'super_admin_ops',
    name: 'Platform Control Center',
    description: 'Complete admin dashboard with all platform controls',
    category: 'core',
    status: 'admin_only',
    visibleTo: ['admin@brandsbridge.ai'],
    buildDate: '2025-04-13',
    deployDate: null,
    builtBy: 'MiniMax Agent',
    notes: 'Newly built. Central hub for all platform management.',
    icon: '⚙️',
    isMonetized: false,
    plan: 'all'
  },

  // ═══════════════════════════════════════════
  // 🔴 DISABLED / FUTURE FEATURES
  // ═══════════════════════════════════════════

  {
    id: 'arabic_language',
    name: 'Arabic Language Support',
    description: 'Full RTL Arabic interface for GCC market',
    category: 'future',
    status: 'disabled',
    visibleTo: [],
    buildDate: null,
    deployDate: null,
    builtBy: null,
    notes: 'Priority for GCC market. Plan: Build in admin first, test RTL layouts, then deploy to all users.',
    icon: '🌐',
    isMonetized: false,
    plan: 'all'
  },
  {
    id: 'stripe_payments',
    name: 'Real Payment System',
    description: 'Stripe subscription billing and invoicing',
    category: 'future',
    status: 'disabled',
    visibleTo: [],
    buildDate: null,
    deployDate: null,
    builtBy: null,
    notes: 'Critical for revenue. Build payment flows in admin, test with 3 beta companies, then deploy to all suppliers.',
    icon: '💳',
    isMonetized: true,
    plan: 'growth'
  },
  {
    id: 'mobile_app',
    name: 'Mobile Application',
    description: 'iOS and Android native apps',
    category: 'future',
    status: 'disabled',
    visibleTo: [],
    buildDate: null,
    deployDate: null,
    builtBy: null,
    notes: 'Phase 2 development. Suppliers need mobile CRM. Buyers need shipment tracking.',
    icon: '📱',
    isMonetized: false,
    plan: 'all'
  },
  {
    id: 'rfq_system',
    name: 'Full RFQ System',
    description: 'Complete request for quotation flow with negotiations',
    category: 'future',
    status: 'disabled',
    visibleTo: [],
    buildDate: null,
    deployDate: null,
    builtBy: null,
    notes: 'Core trading feature. Build supplier side first, then buyer side, connect both in admin testing.',
    icon: '📋',
    isMonetized: false,
    plan: 'growth'
  },
  {
    id: 'reviews_system',
    name: 'Reviews & Ratings',
    description: 'Verified buyer reviews for suppliers',
    category: 'future',
    status: 'disabled',
    visibleTo: [],
    buildDate: null,
    deployDate: null,
    builtBy: null,
    notes: 'Trust building feature. Launch event idea: invite 20 buyers to review 10 suppliers at launch.',
    icon: '⭐',
    isMonetized: false,
    plan: 'all'
  },
  {
    id: 'escrow_payments',
    name: 'Escrow Payment Protection',
    description: 'Secure trade payments with escrow protection',
    category: 'future',
    status: 'disabled',
    visibleTo: [],
    buildDate: null,
    deployDate: null,
    builtBy: null,
    notes: 'Premium differentiator. Partner with payment provider. Test with 5 real transactions before public launch.',
    icon: '🔒',
    isMonetized: true,
    plan: 'enterprise'
  },
  {
    id: 'ai_matchmaking',
    name: 'AI Smart Matchmaking',
    description: 'Real AI buyer-supplier intelligent matching',
    category: 'ai',
    status: 'disabled',
    visibleTo: [],
    buildDate: null,
    deployDate: null,
    builtBy: null,
    notes: 'Connect to real Claude/GPT API. Train on platform data. Test accuracy in admin before showing to users.',
    icon: '🧠',
    isMonetized: true,
    plan: 'enterprise'
  },
  {
    id: 'certification_tracker',
    name: 'Certification Tracker',
    description: 'Auto-alerts for expiring certifications',
    category: 'supplier',
    status: 'disabled',
    visibleTo: [],
    buildDate: null,
    deployDate: null,
    builtBy: null,
    notes: 'Daily value feature. Keeps suppliers active daily. Build notification system first.',
    icon: '📜',
    isMonetized: false,
    plan: 'growth'
  },
  {
    id: 'trade_finance',
    name: 'Trade Finance Integration',
    description: 'Letters of credit and trade financing',
    category: 'future',
    status: 'disabled',
    visibleTo: [],
    buildDate: null,
    deployDate: null,
    builtBy: null,
    notes: 'Bank partnership needed. QNB or Qatar Islamic Bank. High value for large deals.',
    icon: '🏦',
    isMonetized: true,
    plan: 'enterprise'
  },
  {
    id: 'event_system',
    name: 'Virtual Events & Webinars',
    description: 'Platform-hosted trade events and webinars',
    category: 'future',
    status: 'disabled',
    visibleTo: [],
    buildDate: null,
    deployDate: null,
    builtBy: null,
    notes: 'Launch event strategy: Host quarterly virtual expos. Charge companies to exhibit. Invite buyers for free. First event target: 2026 WebVR launch, 2027 Full VR.',
    icon: '🎪',
    isMonetized: true,
    plan: 'enterprise'
  },
  {
    id: 'newsletter_system',
    name: 'Newsletter System',
    description: 'Automated email newsletters and updates',
    category: 'future',
    status: 'disabled',
    visibleTo: [],
    buildDate: null,
    deployDate: null,
    builtBy: null,
    notes: 'Keep users engaged with weekly market updates and new supplier alerts.',
    icon: '📧',
    isMonetized: false,
    plan: 'all'
  },
  {
    id: 'analytics_dashboard',
    name: 'Advanced Analytics',
    description: 'Deep insights and business intelligence',
    category: 'future',
    status: 'disabled',
    visibleTo: [],
    buildDate: null,
    deployDate: null,
    builtBy: null,
    notes: 'Help suppliers understand their performance and buyer behavior.',
    icon: '📊',
    isMonetized: true,
    plan: 'enterprise'
  },
  {
    id: 'monthly_live_expo',
    name: 'Monthly Live Expo',
    description: 'Monthly virtual trade show event system with live deal rooms, exhibitor packages, and buyer matching',
    category: 'core',
    status: 'all_users',
    visibleTo: [],
    buildDate: '2025-02-01',
    deployDate: '2025-02-01',
    builtBy: 'MiniMax Agent',
    notes: 'Core revenue feature. Monthly recurring event on last Thursday. Admin controls all registrations. Suppliers pay per seller slot ($149-$799). Shipping companies get Logistics Zone ($99). Buyers always FREE.',
    icon: '📅',
    isMonetized: true,
    plan: 'all',
    usageStats: { views: 4500, activeUsers: 312, conversions: 89 }
  }
];

// ═══════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════

/**
 * Check if a feature is visible to a specific user
 */
export const isFeatureVisible = (
  featureId: string,
  userRole: string,
  userEmail: string
): boolean => {
  const feature = FEATURE_FLAGS.find(f => f.id === featureId);
  if (!feature) return false;

  // Admin always sees everything
  if (userRole === 'admin') return true;

  switch (feature.status) {
    case 'disabled':
      return false;
    case 'admin_only':
      return userRole === 'admin';
    case 'beta':
      return feature.visibleTo.includes(userEmail);
    case 'suppliers':
      return userRole === 'supplier';
    case 'buyers':
      return userRole === 'buyer';
    case 'shipping':
      return userRole === 'shipping';
    case 'all_users':
      return userRole !== 'guest' && userRole !== '';
    case 'public':
      return true;
    default:
      return false;
  }
};

/**
 * Get all features visible to a user
 */
export const getVisibleFeatures = (
  userRole: string,
  userEmail: string
): Feature[] => {
  return FEATURE_FLAGS.filter(feature =>
    isFeatureVisible(feature.id, userRole, userEmail)
  );
};

/**
 * Get features by status group
 */
export const getFeaturesByStatus = (
  status: FeatureStatus
): Feature[] => {
  return FEATURE_FLAGS.filter(f => f.status === status);
};

/**
 * Get features by category
 */
export const getFeaturesByCategory = (
  category: FeatureCategory
): Feature[] => {
  return FEATURE_FLAGS.filter(f => f.category === category);
};

/**
 * Get live features count
 */
export const getLiveFeaturesCount = (): number => {
  return FEATURE_FLAGS.filter(f =>
    ['public', 'all_users', 'suppliers', 'buyers', 'shipping'].includes(f.status)
  ).length;
};

/**
 * Get testing features count
 */
export const getTestingFeaturesCount = (): number => {
  return FEATURE_FLAGS.filter(f =>
    ['admin_only', 'beta'].includes(f.status)
  ).length;
};

/**
 * Get future features count
 */
export const getFutureFeaturesCount = (): number => {
  return FEATURE_FLAGS.filter(f => f.status === 'disabled').length;
};

/**
 * Update feature status (for admin operations)
 */
export const updateFeatureStatus = (
  featureId: string,
  newStatus: FeatureStatus,
  newVisibleTo: string[] = [],
  deployDate: string | null = null
): boolean => {
  const featureIndex = FEATURE_FLAGS.findIndex(f => f.id === featureId);
  if (featureIndex === -1) return false;

  FEATURE_FLAGS[featureIndex] = {
    ...FEATURE_FLAGS[featureIndex],
    status: newStatus,
    visibleTo: newVisibleTo,
    deployDate: deployDate || new Date().toISOString().split('T')[0],
    notes: `${FEATURE_FLAGS[featureIndex].notes}\n[${new Date().toISOString().split('T')[0]}] Status changed to: ${newStatus}`
  };

  return true;
};

// ═══════════════════════════════════════════
// LAUNCH EVENTS DATA
// ═══════════════════════════════════════════

export interface LaunchEvent {
  id: string;
  name: string;
  featuredFeature: string; // feature id
  targetDate: string;
  description: string;
  invitedCompanies: string[];
  incentive: string;
  status: 'planning' | 'recruiting' | 'active' | 'completed' | 'cancelled';
  acceptedCount: number;
  pendingCount: number;
  attendedCount: number;
}

export const LAUNCH_EVENTS: LaunchEvent[] = [
  {
    id: 'event_1',
    name: 'Full VR Trade World Launch',
    featuredFeature: 'vr_expo',
    targetDate: '2027-03-15',
    description: 'First virtual reality expo experience for selected enterprise partners',
    invitedCompanies: ['Almarai Company', 'Americana Foods', 'Almarai Co.'],
    incentive: '3 months free Enterprise plan + Featured booth listing',
    status: 'planning',
    acceptedCount: 23,
    pendingCount: 27,
    attendedCount: 0
  },
  {
    id: 'event_2',
    name: 'Stripe Payment Pilot',
    featuredFeature: 'stripe_payments',
    targetDate: '2026-04-20',
    description: 'Pilot real payment processing with 10 selected suppliers',
    invitedCompanies: ['Baladna Foods', 'Qatar National Import & Export'],
    incentive: '0% transaction fees for 6 months',
    status: 'recruiting',
    acceptedCount: 2,
    pendingCount: 8,
    attendedCount: 0
  },
  {
    id: 'event_3',
    name: 'Arabic Platform Launch',
    featuredFeature: 'arabic_language',
    targetDate: '2026-10-01',
    description: 'Full Arabic language interface for GCC market expansion',
    invitedCompanies: [],
    incentive: 'Early adopter badge + 6 months featured',
    status: 'planning',
    acceptedCount: 0,
    pendingCount: 0,
    attendedCount: 0
  }
];

/**
 * Get all upcoming events
 */
export const getUpcomingEvents = (): LaunchEvent[] => {
  return LAUNCH_EVENTS.filter(e =>
    e.status === 'planning' || e.status === 'recruiting'
  );
};
