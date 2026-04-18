import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, Truck, Send, Bot,
  FileText, Settings, ChevronLeft, ChevronRight,
  Ship, MapPin, Clock, DollarSign, TrendingUp, AlertCircle, Package,
  Bell, LogOut, Home, Globe, X, Plus, Trash2,
  ShoppingCart, Building2, Route, Container,
  CheckCircle, Edit, Eye, Users, BarChart3,
  Target, TrendingDown, Radar, Zap, Award, Crown,
  Star, Check, ArrowUpRight, ArrowDownRight, Minus,
  Gauge, Trophy, Shield, Timer, ThumbsUp, ChevronDown, Sparkles, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ContainerSelector from '../components/ContainerSelector';
import toast from 'react-hot-toast';

// Freight-specific data
const freightRequests = [
  {
    id: 'REQ-2025-0041',
    source: 'buyer',
    fromName: 'Gulf Trading Co.',
    fromCountry: 'UAE',
    fromFlag: '🇦🇪',
    origin: 'Istanbul',
    destination: 'Dubai',
    container: '40ft HC',
    cargo: 'FMCG Food Products',
    weight: 18,
    readyDate: 'Feb 15, 2025',
    status: 'pending',
    receivedDate: '2 hours ago',
    quotedPrice: null,
    quotedTransit: null
  },
  {
    id: 'REQ-2025-0042',
    source: 'supplier',
    fromName: 'OZMO Confectionery',
    fromCountry: 'Turkey',
    fromFlag: '🇹🇷',
    origin: 'Mersin',
    destination: 'Jeddah',
    container: '40ft',
    cargo: 'Confectionery Products',
    weight: 22,
    readyDate: 'Feb 20, 2025',
    status: 'pending',
    receivedDate: '4 hours ago',
    quotedPrice: null,
    quotedTransit: null
  },
  {
    id: 'REQ-2025-0043',
    source: 'buyer',
    fromName: 'Al Meera Consumer Goods',
    fromCountry: 'Qatar',
    fromFlag: '🇶🇦',
    origin: 'Rotterdam',
    destination: 'Hamad Port',
    container: '20ft RF',
    cargo: 'Dairy Products',
    weight: 15,
    readyDate: 'Feb 10, 2025',
    status: 'quoted',
    receivedDate: 'Yesterday',
    quotedPrice: 3200,
    quotedTransit: 18
  },
  {
    id: 'REQ-2025-0044',
    source: 'supplier',
    fromName: 'Baladna Food Industries',
    fromCountry: 'Qatar',
    fromFlag: '🇶🇦',
    origin: 'Doha',
    destination: 'Muscat',
    container: '40ft HC',
    cargo: 'Fresh Milk',
    weight: 20,
    readyDate: 'Feb 25, 2025',
    status: 'pending',
    receivedDate: '1 day ago',
    quotedPrice: null,
    quotedTransit: null
  },
  {
    id: 'REQ-2025-0045',
    source: 'buyer',
    fromName: 'Spinneys Dubai',
    fromCountry: 'UAE',
    fromFlag: '🇦🇪',
    origin: 'Shanghai',
    destination: 'Jebel Ali',
    container: '40ft GP',
    cargo: 'Consumer Goods',
    weight: 25,
    readyDate: 'Mar 01, 2025',
    status: 'pending',
    receivedDate: '2 days ago',
    quotedPrice: null,
    quotedTransit: null
  }
];

// ========== LIVE CARGO RADAR DATA ==========
const liveCargoRadar = [
  {
    id: 1,
    urgency: 'urgent',
    origin: 'Istanbul',
    destination: 'Dubai',
    container: '40ft HC',
    cargo: 'FMCG Products',
    readyDate: 'Tomorrow',
    revenue: 1800,
    competitors: 2,
    timeLeft: 30
  },
  {
    id: 2,
    urgency: 'upcoming',
    origin: 'Mersin',
    destination: 'Jeddah',
    container: '40ft',
    cargo: 'Confectionery',
    readyDate: 'Next week',
    revenue: 2200,
    competitors: 4,
    timeLeft: null
  },
  {
    id: 3,
    urgency: 'available',
    origin: 'Rotterdam',
    destination: 'Hamad',
    container: 'Reefer',
    cargo: 'Dairy',
    readyDate: 'In 2 weeks',
    revenue: 3400,
    competitors: 1,
    timeLeft: null
  }
];

// ========== AUTO-QUOTE ENGINE DATA ==========
const autoQuoteConfig = {
  enabled: true,
  routes: ['Istanbul → Dubai', 'Mersin → Jeddah'],
  containers: ['40ft HC', '20ft'],
  strategy: 'balanced',
  maxQuotesPerDay: 20
};

const autoQuoteStats = {
  quotesSent: 47,
  accepted: 12,
  winRate: 26,
  revenue: 28400,
  hoursSaved: 8
};

// ========== COMPETITIVE INTEL DATA ==========
const competitiveRoutes = [
  {
    origin: 'Istanbul',
    destination: 'Dubai',
    container: '40ft HC',
    yourRate: 1800,
    marketLow: 1650,
    marketAvg: 1780,
    marketHigh: 2100,
    winRate: 34,
    suggestion: 'Drop to $1,750 to win 15% more deals',
    impact: 8200
  },
  {
    origin: 'Mersin',
    destination: 'Jeddah',
    container: '40ft',
    yourRate: 2200,
    marketLow: 2000,
    marketAvg: 2150,
    marketHigh: 2500,
    winRate: 28,
    suggestion: 'Raise to $2,300 — high demand',
    impact: 9600
  },
  {
    origin: 'Hamburg',
    destination: 'Dubai',
    container: '40ft HC',
    yourRate: 2800,
    marketLow: 2700,
    marketAvg: 2850,
    marketHigh: 3100,
    winRate: 41,
    suggestion: 'Premium justified — best win rate',
    impact: null
  }
];

// ========== RELIABILITY SCORE DATA ==========
const reliabilityScore = {
  overall: 96.8,
  breakdown: [
    { metric: 'On-time deliveries', value: 98, trend: 'up' },
    { metric: 'Documentation accuracy', value: 95, trend: 'stable' },
    { metric: 'Customer satisfaction', value: 4.8, suffix: '/5', trend: 'up' },
    { metric: 'Response time', value: 1.2, suffix: 'hrs', trend: 'up' }
  ],
  tier: 'Top 5% of carriers',
  nextTier: 'Premium Partner',
  nextTierRequirement: 99,
  nextTierBenefits: ['Featured in Expo Hall', '20% more requests', 'Higher rates accepted']
};

// ========== ROUTE INTELLIGENCE DATA ==========
const routePerformance = [
  { route: 'Istanbul → Dubai', shipments: 23, revenue: 41400, avgRate: 1800, winRate: 34, trend: 'up', pending: 8 },
  { route: 'Mersin → Jeddah', shipments: 18, revenue: 39600, avgRate: 2200, winRate: 28, trend: 'stable', pending: 5 },
  { route: 'Hamburg → Dubai', shipments: 12, revenue: 33600, avgRate: 2800, winRate: 41, trend: 'up', pending: 12 }
];

const activeShipments = [
  {
    id: 'SHP-001',
    reference: 'APX-2025-0089',
    customer: 'Baladna Food Industries',
    customerFlag: '🇶🇦',
    origin: 'Shanghai',
    destination: 'Dubai',
    container: '40ft',
    status: 'in_transit',
    eta: 'Feb 10, 2025',
    value: 18500,
    blNumber: 'APXBL20250089'
  },
  {
    id: 'SHP-002',
    reference: 'APX-2025-0090',
    customer: 'Al Meera Consumer Goods',
    customerFlag: '🇶🇦',
    origin: 'Mumbai',
    destination: 'Riyadh',
    container: '20ft',
    status: 'customs',
    eta: 'Feb 05, 2025',
    value: 8200,
    blNumber: 'APXBL20250090'
  },
  {
    id: 'SHP-003',
    reference: 'APX-2025-0091',
    customer: 'Carrefour Middle East',
    customerFlag: '🇦🇪',
    origin: 'Hamburg',
    destination: 'Jeddah',
    container: '40ft HC',
    status: 'delivered',
    eta: 'Jan 28, 2025',
    value: 24600,
    blNumber: 'APXBL20250091'
  }
];

const FreightDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('overview');
  const [inboxFilter, setInboxFilter] = useState<'all' | 'buyer' | 'supplier' | 'quoted' | 'archived'>('all');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<typeof freightRequests[0] | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    fobPrice: '',
    cifPrice: '',
    containerType: '40ft-hc',
    transitDays: '',
    validUntil: '',
    notes: '',
    insuranceIncluded: false
  });
  const [selectedCargoRequest, setSelectedCargoRequest] = useState<typeof liveCargoRadar[0] | null>(null);

  // Auto-Quote toggle state
  const [autoQuoteEnabled, setAutoQuoteEnabled] = useState(true);
  const [pricingStrategy, setPricingStrategy] = useState<'aggressive' | 'balanced' | 'premium'>('balanced');

  // Profile state for Public Profile Manager
  const [profileForm, setProfileForm] = useState({
    companyName: 'Apex Global Logistics',
    headquarters: 'United Arab Emirates',
    partneredWith: 'Maersk, MSC, CMA CGM',
    description: 'Leading freight forwarding company specializing in GCC-MEA trade routes.',
    routes: [
      { origin: 'Shanghai', destination: 'Dubai', price: '$2,800', days: 14 },
      { origin: 'Istanbul', destination: 'GCC Ports', price: '$1,500', days: 7 },
      { origin: 'Rotterdam', destination: 'Jeddah', price: '$2,200', days: 12 }
    ],
    containers: ['20ft', '40ft', '40ft HC', '20ft RF', '40ft RF'],
    fleetSize: 45,
    capacity: 125000
  });

  const sidebarSections = [
    {
      title: 'OPERATIONS',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'inbox', label: 'Unified Inbox', icon: Inbox, badge: '5' },
        { id: 'shipments', label: 'Active Shipments', icon: Truck },
        { id: 'quotes', label: 'Submitted Quotes', icon: Send },
      ]
    },
    {
      title: 'MARKETPLACE',
      items: [
        { id: 'public-profile', label: 'Public Profile', icon: Globe },
        { id: 'routes', label: 'My Routes', icon: Route },
        { id: 'containers', label: 'Container Availability', icon: Container },
      ]
    },
    {
      title: 'TOOLS',
      items: [
        { id: 'ai-optimizer', label: 'AI Cargo Optimizer', icon: Bot, badge: 'AI' },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const kpis = [
    { label: 'New Requests', value: '5', icon: Inbox, urgent: true, color: '#1E40AF' },
    { label: 'Active Shipments', value: '8', icon: Truck, color: '#60A5FA' },
    { label: 'Monthly Revenue', value: '$45.2K', icon: DollarSign, color: '#94A3B8' },
    { label: 'AI Reliability', value: '97%', icon: TrendingUp, color: '#60A5FA', badge: 'AI' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_transit': return { label: 'In Transit', bg: 'bg-blue-500/20', text: 'text-blue-400' };
      case 'customs': return { label: 'Customs', bg: 'bg-amber-500/20', text: 'text-amber-400' };
      case 'delivered': return { label: 'Delivered', bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
      default: return { label: status, bg: 'bg-slate-500/20', text: 'text-slate-400' };
    }
  };

  const filteredRequests = freightRequests.filter(req => {
    if (inboxFilter === 'all') return true;
    if (inboxFilter === 'buyer') return req.source === 'buyer';
    if (inboxFilter === 'supplier') return req.source === 'supplier';
    if (inboxFilter === 'quoted') return req.status === 'quoted';
    if (inboxFilter === 'archived') return req.status === 'archived';
    return true;
  });

  const handleSubmitQuote = (request: typeof freightRequests[0]) => {
    setSelectedRequest(request);
    setQuoteForm({
      fobPrice: '',
      cifPrice: '',
      containerType: '40ft-hc',
      transitDays: '',
      validUntil: '',
      notes: '',
      insuranceIncluded: false
    });
    setShowQuoteModal(true);
  };

  const handleConfirmQuote = () => {
    if (!quoteForm.cifPrice || !quoteForm.transitDays) {
      toast.error('Please fill in CIF Price and Transit Days');
      return;
    }
    toast.success('Quote sent successfully! The requester has been notified.');
    setShowQuoteModal(false);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // Handle opening quote from Live Cargo Radar
  const handleOpenCargoQuote = (cargo: typeof liveCargoRadar[0]) => {
    setSelectedCargoRequest(cargo);
    setQuoteForm({
      fobPrice: '',
      cifPrice: '',
      containerType: '40ft-hc',
      transitDays: '',
      validUntil: '',
      notes: '',
      insuranceIncluded: false
    });
    setShowQuoteModal(true);
  };

  // Apply AI suggested price
  const handleApplySuggestedPrice = () => {
    const suggestedPrice = quoteForm.cifPrice ? parseInt(quoteForm.cifPrice) : 1750;
    // Apply 60% win probability price
    setQuoteForm({ ...quoteForm, cifPrice: suggestedPrice.toString() });
    toast.success('Suggested price applied: $' + suggestedPrice);
  };

  // Handle confirming cargo quote
  const handleConfirmCargoQuote = () => {
    if (!quoteForm.cifPrice || !quoteForm.transitDays) {
      toast.error('Please fill in CIF Price and Transit Days');
      return;
    }
    toast.success('Quote submitted! Buyer will respond within 2 hours');
    setShowQuoteModal(false);
    setSelectedCargoRequest(null);
    navigate('/freight/quotes');
  };

  // Get market data for pricing intelligence panel
  const getMarketData = (origin: string, destination: string) => {
    return {
      avgPrice: 1780,
      low: 1650,
      high: 2100,
      winRateAtPrice: 34,
      suggestedPrice: 1750,
      winProbability: 60
    };
  };

  return (
    <div className="min-h-screen bg-[#050B18] flex">
      {/* FREIGHT SIDEBAR - Navy Blue/Silver Theme */}
      <aside className={`${collapsed ? 'w-20' : 'w-72'} bg-[#070E1F] border-r border-[#1E3A5F] flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#1E3A5F] flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1E40AF] to-[#60A5FA] rounded-xl flex items-center justify-center">
                <Ship className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-lg">Logistics OS</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-[#1E3A5F] rounded-lg transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5 text-slate-400" /> : <ChevronLeft className="w-5 h-5 text-slate-400" />}
          </button>
        </div>

        {/* Navigation - Freight Only Items */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-4">
              {!collapsed && (
                <div className="text-[10px] text-slate-500 uppercase tracking-wider px-3 mb-2">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-1 ${
                    activeMenu === item.id
                      ? 'bg-[#1E40AF]/50 text-white border border-[#1E40AF]'
                      : 'text-slate-400 hover:text-white hover:bg-[#1E3A5F]/50'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 font-medium text-sm">{item.label}</span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          item.id === 'inbox'
                            ? 'bg-blue-500/30 text-blue-400'
                            : 'bg-purple-500/30 text-purple-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-[#1E3A5F] space-y-2">
          <button
            onClick={() => setActiveMenu('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeMenu === 'settings' ? 'bg-[#1E40AF]/50 text-white' : 'text-slate-400 hover:text-white hover:bg-[#1E3A5F]/50'
            }`}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span className="font-medium text-sm">Settings</span>}
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-[#1E3A5F]/50 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            {!collapsed && <span>Back to Home</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>

          {!collapsed && (
            <div className="pt-2 border-t border-[#1E3A5F]">
              <div className="text-[10px] text-slate-500 text-center mb-2">
                Logged in as {user?.email || 'shipping@brandsbridge.ai'}
              </div>
            </div>
          )}

          {!collapsed && (
            <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-[10px] font-medium text-emerald-400">KYB Verified Carrier</span>
              </div>
              <div className="text-sm text-white font-semibold">{user?.name || 'Apex Global Logistics'}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Partnered with Maersk & MSC</div>
            </div>
          )}

          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 bg-gradient-to-br from-[#1E40AF] to-[#60A5FA] rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">{user?.name?.charAt(0) || 'A'}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user?.name || 'Freight Manager'}</div>
                <div className="text-[10px] text-slate-400">Shipping Account</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${collapsed ? 'ml-20' : 'ml-72'} transition-all duration-300`}>
        {/* Top Header */}
        <div className="h-14 bg-[#050B18] border-b border-[#1E3A5F]/50 flex items-center justify-between px-6">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-7 h-7 bg-gradient-to-br from-[#1E40AF] to-[#60A5FA] rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Brands Bridge AI</span>
          </div>
          <div className="text-sm font-medium text-white">Logistics OS</div>
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-[#1E3A5F] rounded-lg transition-colors relative">
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <span className="text-sm text-white font-medium">{user?.name || 'Freight Manager'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* ============ OVERVIEW ============ */}
          {activeMenu === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {user?.name?.split(' ')[0] || 'Captain'}
                </h1>
                <p className="text-slate-400 mt-1">5 new quote requests need your attention</p>
              </div>

              {/* KPI Cards - Navy Blue Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, index) => (
                  <div key={index} className={`bg-[#0C1628] border rounded-xl p-5 ${kpi.urgent ? 'border-blue-500/30' : 'border-[#1E3A5F]'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[#1E3A5F]`}>
                        <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                      </div>
                      {kpi.badge && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-bold rounded">
                          {kpi.badge}
                        </span>
                      )}
                    </div>
                    <div className={`text-2xl font-bold mb-1`} style={{ color: kpi.color }}>
                      {kpi.value}
                    </div>
                    <div className="text-sm text-slate-400">{kpi.label}</div>
                    {kpi.urgent && (
                      <div className="text-[10px] text-blue-400 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Action needed
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ========== LIVE CARGO RADAR ========== */}
              <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#1E3A5F]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center">
                      <Radar className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Live Cargo Radar</h2>
                      <p className="text-xs text-slate-400">See cargo needing freight — right now</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                      </span>
                      <span className="text-xs text-cyan-400 font-medium">LIVE</span>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="relative h-32 bg-gradient-to-br from-[#070E1F] to-[#0C1628] overflow-hidden">
                  {/* Animated grid lines */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60A5FA" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                  {/* Pulsing dots for routes */}
                  <div className="absolute top-6 left-[25%]">
                    <div className="relative">
                      <div className="animate-ping absolute h-4 w-4 bg-red-500/50 rounded-full"></div>
                      <div className="relative h-4 w-4 bg-red-500 rounded-full border-2 border-white/50"></div>
                    </div>
                  </div>
                  <div className="absolute top-10 left-[50%]">
                    <div className="relative">
                      <div className="animate-ping absolute h-4 w-4 bg-amber-500/50 rounded-full" style={{ animationDelay: '0.5s' }}></div>
                      <div className="relative h-4 w-4 bg-amber-500 rounded-full border-2 border-white/50"></div>
                    </div>
                  </div>
                  <div className="absolute top-16 left-[70%]">
                    <div className="relative">
                      <div className="animate-ping absolute h-4 w-4 bg-emerald-500/50 rounded-full" style={{ animationDelay: '1s' }}></div>
                      <div className="relative h-4 w-4 bg-emerald-500 rounded-full border-2 border-white/50"></div>
                    </div>
                  </div>
                  {/* Route lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                    <line x1="25%" y1="24%" x2="50%" y2="35%" stroke="#60A5FA" strokeWidth="1" strokeDasharray="4 2" opacity="0.5"/>
                    <line x1="50%" y1="35%" x2="70%" y2="55%" stroke="#60A5FA" strokeWidth="1" strokeDasharray="4 2" opacity="0.5"/>
                  </svg>
                  <div className="absolute bottom-2 right-3 text-[10px] text-slate-500">
                    3 active freight requests in your region
                  </div>
                </div>

                {/* Cargo Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
                  {liveCargoRadar.map((cargo) => (
                    <div
                      key={cargo.id}
                      className={`p-4 rounded-xl border ${
                        cargo.urgency === 'urgent'
                          ? 'bg-red-500/10 border-red-500/30'
                          : cargo.urgency === 'upcoming'
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-emerald-500/10 border-emerald-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            cargo.urgency === 'urgent' ? 'bg-red-500' :
                            cargo.urgency === 'upcoming' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <span className="text-sm font-semibold text-white">
                            {cargo.origin} → {cargo.destination}
                          </span>
                        </div>
                        {cargo.urgency === 'urgent' && cargo.timeLeft && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-medium animate-pulse">
                            {cargo.timeLeft}s left
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mb-2">
                        {cargo.container} | {cargo.cargo}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-emerald-400">${cargo.revenue.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-500">Ready: {cargo.readyDate}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400">{cargo.competitors} competing</div>
                          <button
                            onClick={() => handleOpenCargoQuote(cargo)}
                            className={`text-[10px] font-medium mt-1 px-3 py-1 rounded-lg transition-all ${
                              cargo.urgency === 'urgent'
                                ? 'bg-red-500/30 text-red-300 hover:bg-red-500/50'
                                : 'bg-blue-500/30 text-blue-300 hover:bg-blue-500/50'
                            }`}
                          >
                            {cargo.urgency === 'urgent' ? 'Submit Quote →' : 'Quick Quote →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ========== AUTO-QUOTE ENGINE + COMPETITIVE INTEL ========== */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Auto-Quote Engine */}
                <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Auto-Quote Engine</h2>
                      <p className="text-xs text-slate-400">Let AI submit quotes while you focus on bigger deals</p>
                    </div>
                  </div>

                  {/* Toggle */}
                  <div className="flex items-center justify-between p-3 bg-[#070E1F] rounded-xl mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">Auto-quote enabled</span>
                    </div>
                    <button
                      onClick={() => {
                        setAutoQuoteEnabled(!autoQuoteEnabled);
                        toast.success(autoQuoteEnabled ? 'Auto-quote disabled' : 'Auto-quote enabled');
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        autoQuoteEnabled ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        autoQuoteEnabled ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  {/* Rules Summary */}
                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-slate-400 mb-2">Rules you set:</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {autoQuoteConfig.routes.map((route, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] rounded-lg flex items-center gap-1">
                          {route}
                          <X className="w-3 h-3 cursor-pointer hover:text-white" />
                        </span>
                      ))}
                      <button className="px-2 py-1 border border-dashed border-slate-600 text-slate-400 text-[10px] rounded-lg flex items-center gap-1 hover:border-blue-500 hover:text-blue-400">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {autoQuoteConfig.containers.map((c, i) => (
                        <span key={i} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] rounded-lg">{c}</span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Strategy */}
                  <div className="mb-4">
                    <div className="text-xs text-slate-400 mb-2">Pricing strategy:</div>
                    <div className="flex gap-2">
                      {[
                        { id: 'aggressive', label: 'Aggressive (-10%)', color: 'amber' },
                        { id: 'balanced', label: 'Balanced (market)', color: 'blue' },
                        { id: 'premium', label: 'Premium (+5%)', color: 'emerald' }
                      ].map((strat) => (
                        <button
                          key={strat.id}
                          onClick={() => setPricingStrategy(strat.id as typeof pricingStrategy)}
                          className={`px-3 py-1.5 text-[10px] font-medium rounded-lg transition-all ${
                            pricingStrategy === strat.id
                              ? strat.color === 'amber' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                              : strat.color === 'blue' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                              : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                              : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {strat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stats Card */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-500/20">
                    <div className="text-xs text-slate-400 mb-3">This week:</div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-xl font-bold text-white">{autoQuoteStats.quotesSent}</div>
                        <div className="text-[10px] text-slate-400">auto-quotes sent</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-emerald-400">{autoQuoteStats.accepted}</div>
                        <div className="text-[10px] text-slate-400">accepted ({autoQuoteStats.winRate}% win rate)</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-purple-300">${(autoQuoteStats.revenue / 1000).toFixed(1)}K</div>
                        <div className="text-[10px] text-slate-400">revenue generated</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-cyan-300">{autoQuoteStats.hoursSaved}h</div>
                        <div className="text-[10px] text-slate-400">time saved</div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-3 py-2 text-xs text-blue-400 hover:text-blue-300 font-medium">
                    Configure Rules →
                  </button>
                </div>

                {/* Competitive Intel */}
                <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Know Your Competition</h2>
                      <p className="text-xs text-slate-400">Your rates vs market rates</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {competitiveRoutes.slice(0, 2).map((route, index) => {
                      const position = route.yourRate < route.marketAvg ? 'below' : route.yourRate > route.marketAvg ? 'above' : 'at';
                      const positionColor = position === 'below' ? 'text-amber-400' : position === 'above' ? 'text-emerald-400' : 'text-blue-400';
                      return (
                        <div key={index} className="p-3 bg-[#070E1F] rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-white">
                              {route.origin} → {route.destination} ({route.container})
                            </div>
                            <span className={`text-[10px] font-medium ${positionColor}`}>
                              {position === 'below' ? '↓ Below avg' : position === 'above' ? '↑ Above avg' : 'At market'} • {route.winRate}% win
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] text-slate-500 mb-2">
                            <span>Low: ${route.marketLow}</span>
                            <span>Avg: ${route.marketAvg}</span>
                            <span>High: ${route.marketHigh}</span>
                          </div>
                          <div className="text-xs text-slate-400 mb-1">Your rate: <span className="text-white font-medium">${route.yourRate}</span></div>
                          {route.impact && (
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700">
                              <div className="text-[10px] text-amber-400">{route.suggestion}</div>
                              <button className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded hover:bg-amber-500/30">
                                Adjust
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button className="w-full mt-3 py-2 text-xs text-blue-400 hover:text-blue-300 font-medium">
                    View All Routes →
                  </button>
                </div>
              </div>

              {/* ========== RELIABILITY SCORE + ROUTE PERFORMANCE ========== */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reliability Score Builder */}
                <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Your Reliability Score</h2>
                      <p className="text-xs text-slate-400">AI-powered carrier rating</p>
                    </div>
                  </div>

                  {/* Big Score */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-end gap-1">
                      <span className="text-5xl font-bold text-yellow-400">{reliabilityScore.overall}</span>
                      <span className="text-xl text-yellow-400 mb-1">%</span>
                    </div>
                    <div className="text-sm text-emerald-400 font-medium mt-1">{reliabilityScore.tier}</div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-yellow-400">Top 5% of carriers</span>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {reliabilityScore.breakdown.map((item, index) => (
                      <div key={index} className="p-2 bg-[#070E1F] rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-slate-500 truncate">{item.metric}</span>
                          {item.trend === 'up' ? (
                            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                          ) : item.trend === 'stable' ? (
                            <Minus className="w-3 h-3 text-slate-400" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-400" />
                          )}
                        </div>
                        <div className="text-sm font-bold text-white">
                          {item.value}{item.suffix || '%'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Next Tier */}
                  <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl p-4 border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-300">Next: {reliabilityScore.nextTier}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">
                      Improve documentation by 3% to reach {reliabilityScore.nextTierRequirement}%+
                    </p>
                    <div className="space-y-1 mb-3">
                      {reliabilityScore.nextTierBenefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-1 text-[10px] text-emerald-400">
                          <Check className="w-3 h-3" /> {benefit}
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-2 bg-yellow-500/20 text-yellow-300 text-xs font-medium rounded-lg hover:bg-yellow-500/30 transition-colors">
                      View Documentation Issues →
                    </button>
                  </div>
                </div>

                {/* Route Intelligence */}
                <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#1E3A5F]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Route className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">Route Performance</h2>
                        <p className="text-xs text-slate-400">Your top routes this month</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#070E1F]">
                        <tr className="text-left text-[10px] text-slate-500 uppercase">
                          <th className="px-4 py-2 font-medium">Route</th>
                          <th className="px-3 py-2 font-medium">Shipments</th>
                          <th className="px-3 py-2 font-medium">Revenue</th>
                          <th className="px-3 py-2 font-medium">Win Rate</th>
                          <th className="px-3 py-2 font-medium">Trend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E3A5F]">
                        {routePerformance.map((route, index) => (
                          <tr key={index} className="hover:bg-[#1E3A5F]/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-white">{route.route}</div>
                              <div className="text-[10px] text-slate-500">${route.avgRate.toLocaleString()}/shipment</div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="text-sm text-slate-300">{route.shipments}</div>
                              <div className="text-[10px] text-cyan-400">{route.pending} pending</div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="text-sm font-medium text-emerald-400">${(route.revenue / 1000).toFixed(1)}K</div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-slate-300">{route.winRate}%</span>
                                {route.winRate >= 35 ? (
                                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                ) : route.winRate >= 25 ? (
                                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                ) : (
                                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              {route.trend === 'up' ? (
                                <div className="flex items-center gap-1 text-emerald-400">
                                  <TrendingUp className="w-4 h-4" />
                                  <span className="text-[10px]">+12%</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-slate-400">
                                  <Minus className="w-4 h-4" />
                                  <span className="text-[10px]">0%</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* AI Insight */}
                  <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-t border-[#1E3A5F]">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3 h-3 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-xs text-white font-medium mb-1">AI Insight</div>
                        <p className="text-[10px] text-slate-400 mb-2">
                          Hamburg → Dubai has your highest win rate. Consider bidding on more Hamburg originations.
                        </p>
                        <button className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded hover:bg-cyan-500/30 transition-colors">
                          View {routePerformance[2].pending} Opportunities →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Quote Requests */}
                <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#1E3A5F] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Inbox className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">Recent Quote Requests</h2>
                        <p className="text-xs text-slate-400">Latest from buyers & suppliers</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveMenu('inbox')}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="divide-y divide-[#1E3A5F]">
                    {freightRequests.slice(0, 3).map((req) => (
                      <div key={req.id} className="p-4 hover:bg-[#1E3A5F]/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-mono text-slate-500">{req.id}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                            req.source === 'buyer' ? 'bg-blue-500/20 text-blue-400' : 'bg-teal-500/20 text-teal-400'
                          }`}>
                            {req.source === 'buyer' ? 'From Buyer' : 'From Supplier'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span className="text-white">{req.origin}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-white">{req.destination}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-slate-500">{req.container} • {req.weight} MT</span>
                          <span className="text-[10px] text-slate-400">{req.receivedDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Shipments */}
                <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#1E3A5F] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Truck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">Active Shipments</h2>
                        <p className="text-xs text-slate-400">Track your in-progress deliveries</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveMenu('shipments')}
                      className="text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="divide-y divide-[#1E3A5F]">
                    {activeShipments.slice(0, 3).map((shipment) => {
                      const badge = getStatusBadge(shipment.status);
                      return (
                        <div key={shipment.id} className="p-4 hover:bg-[#1E3A5F]/30 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-mono text-slate-300">{shipment.reference}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-white">{shipment.customer}</span>
                            <span>{shipment.customerFlag}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-slate-500">{shipment.container}</span>
                            <span className="text-[10px] text-emerald-400 font-medium">${shipment.value.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ UNIFIED INBOX ============ */}
          {activeMenu === 'inbox' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Unified Inbox</h1>
                  <p className="text-slate-400 mt-1">All quote requests from buyers and suppliers in one place</p>
                </div>
                <Link
                  to="/logistics"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#1E40AF] to-[#60A5FA] text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Globe className="w-5 h-5" />
                  View Marketplace
                </Link>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 bg-[#0C1628] p-1 rounded-xl w-fit border border-[#1E3A5F]">
                {[
                  { id: 'all', label: 'All', count: freightRequests.length },
                  { id: 'buyer', label: 'From Buyers', count: freightRequests.filter(r => r.source === 'buyer').length, color: 'blue' },
                  { id: 'supplier', label: 'From Suppliers', count: freightRequests.filter(r => r.source === 'supplier').length, color: 'teal' },
                  { id: 'quoted', label: 'Quoted', count: freightRequests.filter(r => r.status === 'quoted').length },
                  { id: 'archived', label: 'Archived', count: 0 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setInboxFilter(tab.id as typeof inboxFilter)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                      inboxFilter === tab.id
                        ? 'bg-[#1E40AF] text-white'
                        : 'text-slate-400 hover:text-white hover:bg-[#1E3A5F]'
                    }`}
                  >
                    {tab.label}
                    <span className={`px-1.5 py-0.5 text-[10px] rounded ${
                      inboxFilter === tab.id
                        ? 'bg-white/20 text-white'
                        : tab.color === 'blue'
                          ? 'bg-blue-500/20 text-blue-400'
                          : tab.color === 'teal'
                            ? 'bg-teal-500/20 text-teal-400'
                            : 'bg-slate-700 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Request Cards */}
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-5 hover:border-[#1E40AF]/50 transition-all">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-slate-500">{request.id}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${
                              request.source === 'buyer'
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                : 'bg-teal-500/20 text-teal-400 border-teal-500/30'
                            }`}>
                              {request.source === 'buyer' ? 'From Buyer' : 'From Supplier'}
                            </span>
                            {request.status === 'quoted' && (
                              <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Quoted
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-white">{request.fromName}</h3>
                          <p className="text-sm text-slate-400">{request.cargo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-slate-400">{request.receivedDate}</span>
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-[#070E1F] rounded-xl mb-4">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Origin</div>
                        <div className="text-sm font-medium text-white flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {request.origin}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Destination</div>
                        <div className="text-sm font-medium text-white flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {request.destination}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Container</div>
                        <div className="text-sm font-medium text-white">{request.container}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Weight</div>
                        <div className="text-sm font-medium text-white">{request.weight} MT</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Ready Date</div>
                        <div className="text-sm font-medium text-white flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {request.readyDate}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#1E3A5F]">
                      <div className="text-sm text-slate-400">
                        From: {request.fromName} {request.fromFlag}
                      </div>
                      <div className="flex items-center gap-2">
                        {request.status !== 'quoted' ? (
                          <>
                            <button className="px-4 py-2 bg-[#1E3A5F] text-slate-300 text-sm font-medium rounded-lg hover:bg-[#1E3A5F]/80 transition-colors">
                              View Details
                            </button>
                            <button
                              onClick={() => handleSubmitQuote(request)}
                              className="px-5 py-2 bg-gradient-to-r from-[#1E40AF] to-[#60A5FA] text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                            >
                              Submit Quote
                              <Send className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Quote Sent: ${request.quotedPrice?.toLocaleString()} / {request.quotedTransit} days
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ PUBLIC PROFILE MANAGER ============ */}
          {activeMenu === 'public-profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Public Profile Manager</h1>
                <p className="text-slate-400 mt-1">Control how your company appears on the Logistics Marketplace</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Edit Form - Left 60% */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Edit className="w-5 h-5 text-blue-400" />
                      Company Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Company Name</label>
                        <input
                          type="text"
                          value={profileForm.companyName}
                          onChange={(e) => setProfileForm({...profileForm, companyName: e.target.value})}
                          className="w-full px-4 py-3 bg-[#070E1F] border border-[#1E3A5F] rounded-xl text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Headquarters Country</label>
                        <input
                          type="text"
                          value={profileForm.headquarters}
                          onChange={(e) => setProfileForm({...profileForm, headquarters: e.target.value})}
                          className="w-full px-4 py-3 bg-[#070E1F] border border-[#1E3A5F] rounded-xl text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Partnered With</label>
                        <input
                          type="text"
                          value={profileForm.partneredWith}
                          onChange={(e) => setProfileForm({...profileForm, partneredWith: e.target.value})}
                          className="w-full px-4 py-3 bg-[#070E1F] border border-[#1E3A5F] rounded-xl text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Description</label>
                        <textarea
                          value={profileForm.description}
                          onChange={(e) => setProfileForm({...profileForm, description: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-3 bg-[#070E1F] border border-[#1E3A5F] rounded-xl text-white focus:outline-none focus:border-blue-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Routes */}
                  <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Route className="w-5 h-5 text-emerald-400" />
                      Routes & Pricing
                    </h3>
                    <div className="space-y-3">
                      {profileForm.routes.map((route, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-[#070E1F] rounded-xl">
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={route.origin}
                              onChange={(e) => {
                                const newRoutes = [...profileForm.routes];
                                newRoutes[index].origin = e.target.value;
                                setProfileForm({...profileForm, routes: newRoutes});
                              }}
                              className="px-3 py-2 bg-[#0C1628] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                              placeholder="Origin"
                            />
                            <input
                              type="text"
                              value={route.destination}
                              onChange={(e) => {
                                const newRoutes = [...profileForm.routes];
                                newRoutes[index].destination = e.target.value;
                                setProfileForm({...profileForm, routes: newRoutes});
                              }}
                              className="px-3 py-2 bg-[#0C1628] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                              placeholder="Destination"
                            />
                            <input
                              type="text"
                              value={route.price}
                              onChange={(e) => {
                                const newRoutes = [...profileForm.routes];
                                newRoutes[index].price = e.target.value;
                                setProfileForm({...profileForm, routes: newRoutes});
                              }}
                              className="px-3 py-2 bg-[#0C1628] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                              placeholder="Price"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const newRoutes = profileForm.routes.filter((_, i) => i !== index);
                              setProfileForm({...profileForm, routes: newRoutes});
                            }}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setProfileForm({
                            ...profileForm,
                            routes: [...profileForm.routes, { origin: '', destination: '', price: '', days: 0 }]
                          });
                        }}
                        className="w-full py-3 border border-dashed border-[#1E3A5F] text-slate-400 rounded-xl hover:border-blue-500 hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Route
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success('Profile updated and published!')}
                    className="w-full py-3 bg-gradient-to-r from-[#1E40AF] to-[#60A5FA] text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Save & Publish Profile
                  </button>
                </div>

                {/* Live Preview - Right 40% */}
                <div className="lg:col-span-2">
                  <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-6 sticky top-24">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-purple-400" />
                      Live Preview
                    </h3>
                    <div className="bg-[#070E1F] rounded-xl p-4 border border-[#1E3A5F]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1E40AF] to-[#60A5FA] rounded-xl flex items-center justify-center">
                          <Ship className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{profileForm.companyName}</h4>
                          <p className="text-xs text-slate-400">{profileForm.headquarters}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{profileForm.description}</p>
                      <div className="flex items-center gap-1 mb-3">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                        <span className="text-xs text-emerald-400">Verified Carrier</span>
                      </div>
                      <div className="text-xs text-slate-500 mb-3">Partnered with {profileForm.partneredWith}</div>
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400 uppercase">Available Routes:</div>
                        {profileForm.routes.map((route, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-slate-300">{route.origin} → {route.destination}</span>
                            <span className="text-blue-400 font-medium">{route.price}</span>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-4 py-2 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-500/30 transition-colors">
                        Request Custom Quote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ ACTIVE SHIPMENTS ============ */}
          {activeMenu === 'shipments' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Active Shipments</h1>
                <p className="text-slate-400 mt-1">Track all your in-progress and completed shipments</p>
              </div>
              <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#070E1F]">
                    <tr className="text-left text-xs text-slate-400 uppercase">
                      <th className="px-5 py-3 font-medium">Reference</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Route</th>
                      <th className="px-4 py-3 font-medium">Container</th>
                      <th className="px-4 py-3 font-medium">ETA</th>
                      <th className="px-4 py-3 font-medium">Value</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E3A5F]">
                    {activeShipments.map((shipment) => {
                      const badge = getStatusBadge(shipment.status);
                      return (
                        <tr key={shipment.id} className="hover:bg-[#1E3A5F]/30 transition-colors">
                          <td className="px-5 py-4">
                            <span className="text-sm font-mono text-slate-300">{shipment.reference}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-sm text-white">
                              {shipment.customer} {shipment.customerFlag}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-sm text-slate-300">
                              <MapPin className="w-3 h-3" />
                              {shipment.origin} → {shipment.destination}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-[#1E3A5F] text-slate-300 text-sm rounded">
                              {shipment.container}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-sm text-slate-400">
                              <Clock className="w-3 h-3" />
                              {shipment.eta}
                            </div>
                          </td>
                          <td className="px-4 py-4 font-medium text-emerald-400">
                            ${shipment.value.toLocaleString()}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Submitted Quotes */}
          {activeMenu === 'quotes' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Submitted Quotes</h2>
                <p className="text-slate-400 text-sm mt-1">Quotes you've sent to buyers and suppliers</p>
              </div>
              <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#13233E] text-slate-400 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left">Quote #</th>
                      <th className="px-4 py-3 text-left">Route</th>
                      <th className="px-4 py-3 text-left">Price</th>
                      <th className="px-4 py-3 text-left">Transit</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E3A5F]">
                    {[
                      { id: 'Q-4821', route: 'Jeddah → Doha', price: '$2,850', transit: '4 days', status: 'Pending', color: 'text-amber-400' },
                      { id: 'Q-4820', route: 'Dubai → Riyadh', price: '$1,920', transit: '3 days', status: 'Won', color: 'text-emerald-400' },
                      { id: 'Q-4819', route: 'Hamad → Jebel Ali', price: '$3,400', transit: '5 days', status: 'Lost', color: 'text-red-400' },
                      { id: 'Q-4818', route: 'Sohar → Khalifa', price: '$2,100', transit: '2 days', status: 'Pending', color: 'text-amber-400' },
                    ].map((q) => (
                      <tr key={q.id} className="hover:bg-[#13233E]/40">
                        <td className="px-4 py-3 text-white font-semibold">{q.id}</td>
                        <td className="px-4 py-3 text-slate-300">{q.route}</td>
                        <td className="px-4 py-3 text-emerald-400 font-semibold">{q.price}</td>
                        <td className="px-4 py-3 text-slate-400">{q.transit}</td>
                        <td className={`px-4 py-3 font-semibold ${q.color}`}>{q.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* My Routes */}
          {activeMenu === 'routes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">My Routes</h2>
                  <p className="text-slate-400 text-sm mt-1">Active lanes you service</p>
                </div>
                <button onClick={() => toast.success('Opening route builder')} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-sm font-semibold">+ Add Route</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { origin: 'Jebel Ali', dest: 'Hamad Port', frequency: 'Daily', avgRate: '$2,400' },
                  { origin: 'Jeddah', dest: 'Doha', frequency: '3x / week', avgRate: '$2,900' },
                  { origin: 'Dubai', dest: 'Riyadh', frequency: 'Weekly', avgRate: '$1,950' },
                  { origin: 'Sohar', dest: 'Khalifa Port', frequency: '2x / week', avgRate: '$2,100' },
                ].map((r, idx) => (
                  <div key={idx} className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white font-semibold mb-2">
                      <MapPin className="w-4 h-4 text-blue-400" /> {r.origin} → {r.dest}
                    </div>
                    <div className="text-sm text-slate-400">{r.frequency} · Avg rate {r.avgRate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Container Availability */}
          {activeMenu === 'containers' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Container Availability</h2>
                <p className="text-slate-400 text-sm mt-1">Equipment inventory by port</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { port: 'Jebel Ali', c20: 124, c40: 86, reefer: 18 },
                  { port: 'Hamad Port', c20: 62, c40: 40, reefer: 22 },
                  { port: 'Jeddah', c20: 98, c40: 71, reefer: 14 },
                  { port: 'Khalifa Port', c20: 45, c40: 28, reefer: 9 },
                ].map((p) => (
                  <div key={p.port} className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">{p.port}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-slate-300"><span>20ft</span><span className="text-white font-semibold">{p.c20}</span></div>
                      <div className="flex justify-between text-slate-300"><span>40ft</span><span className="text-white font-semibold">{p.c40}</span></div>
                      <div className="flex justify-between text-slate-300"><span>Reefer</span><span className="text-emerald-400 font-semibold">{p.reefer}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Cargo Optimizer */}
          {activeMenu === 'ai-optimizer' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-400" /> AI Cargo Optimizer
                </h2>
                <p className="text-slate-400 text-sm mt-1">Smart load consolidation recommendations</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Consolidation opportunity detected</h3>
                <p className="text-slate-300 text-sm mb-4">3 LCL shipments going Jeddah → Doha this week. Combine into 1 x 40ft container to save ~$840.</p>
                <button onClick={() => toast.success('Optimizer proposal sent to buyers')} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-sm font-semibold">Apply Optimization</button>
              </div>
            </div>
          )}

          {/* Documents */}
          {activeMenu === 'documents' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Documents</h2>
                <p className="text-slate-400 text-sm mt-1">Bill of lading, customs docs, rate sheets</p>
              </div>
              <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl divide-y divide-[#1E3A5F]">
                {[
                  { name: 'BOL-2026-0421.pdf', type: 'Bill of Lading', date: 'Apr 18, 2026' },
                  { name: 'Rate-Sheet-Q2.pdf', type: 'Rate Sheet', date: 'Apr 01, 2026' },
                  { name: 'Customs-0418.pdf', type: 'Customs Declaration', date: 'Apr 18, 2026' },
                  { name: 'Insurance-cert.pdf', type: 'Insurance', date: 'Mar 28, 2026' },
                ].map((d) => (
                  <div key={d.name} className="flex items-center justify-between px-4 py-3 hover:bg-[#13233E]/40">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-white text-sm font-medium">{d.name}</div>
                        <div className="text-xs text-slate-500">{d.type} · {d.date}</div>
                      </div>
                    </div>
                    <button onClick={() => toast.success(`Downloading ${d.name}`)} className="text-blue-400 text-sm hover:text-blue-300">Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeMenu === 'analytics' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Analytics</h2>
                <p className="text-slate-400 text-sm mt-1">Revenue, win rate, and lane performance</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'MTD Revenue', value: '$45.2K', trend: '+18%' },
                  { label: 'Quotes Sent', value: '142', trend: '+9%' },
                  { label: 'Win Rate', value: '38%', trend: '+4%' },
                  { label: 'Avg Margin', value: '16.2%', trend: '+1.1%' },
                ].map((k) => (
                  <div key={k.label} className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">{k.label}</div>
                    <div className="text-2xl font-bold text-white">{k.value}</div>
                    <div className="text-emerald-400 text-xs mt-1">{k.trend}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeMenu === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <p className="text-slate-400 text-sm mt-1">Company info, API integrations, team</p>
              </div>
              <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-5 space-y-4">
                <h3 className="text-white font-semibold">Company Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Company Name</label>
                    <input defaultValue="Gulf Shipping Services" className="w-full px-3 py-2 bg-[#13233E] border border-[#1E3A5F] rounded-lg text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Contact Email</label>
                    <input defaultValue="shipping@brandsbridge.ai" className="w-full px-3 py-2 bg-[#13233E] border border-[#1E3A5F] rounded-lg text-white text-sm" />
                  </div>
                </div>
              </div>
              <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-5 space-y-3">
                <h3 className="text-white font-semibold">API Integrations</h3>
                {[
                  { name: 'Maersk Rates API', connected: true },
                  { name: 'MSC Schedule API', connected: true },
                  { name: 'Port Tracker Webhooks', connected: false },
                ].map((i) => (
                  <div key={i.name} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{i.name}</span>
                    <button onClick={() => toast.success(i.connected ? 'Disconnected' : 'Connection initiated')} className={i.connected ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'}>
                      {i.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-5 space-y-3">
                <h3 className="text-white font-semibold">Notification Preferences</h3>
                {['New quote requests', 'Shipment milestones', 'Weekly performance digest'].map((n) => (
                  <label key={n} className="flex items-center gap-3 text-sm text-slate-300">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-500" />
                    {n}
                  </label>
                ))}
              </div>
              <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-5">
                <h3 className="text-white font-semibold mb-3">Team Management</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Gulf Logistics Team', role: 'Admin' },
                    { name: 'Rashid Al Mansoori', role: 'Dispatcher' },
                    { name: 'Noor Ahmed', role: 'Accounting' },
                  ].map((m) => (
                    <div key={m.name} className="flex items-center justify-between text-sm py-2 border-b border-[#1E3A5F] last:border-0">
                      <div>
                        <span className="text-white">{m.name}</span>
                        <span className="text-slate-500 ml-2">· {m.role}</span>
                      </div>
                      <button onClick={() => toast.success('Team member removed')} className="text-red-400 hover:text-red-300">Remove</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => toast.success('Invite sent')} className="mt-3 text-blue-400 text-sm hover:text-blue-300">+ Invite Team Member</button>
              </div>
              <div className="flex justify-end">
                <button onClick={() => toast.success('Settings saved')} className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-semibold text-sm">Save Settings</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Submit Quote Modal - Works for both Unified Inbox and Live Cargo Radar */}
      {showQuoteModal && (selectedRequest || selectedCargoRequest) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {selectedCargoRequest
                  ? `Submit Quote: ${selectedCargoRequest.origin} → ${selectedCargoRequest.destination}`
                  : `Submit Quote for ${selectedRequest?.id}`}
              </h3>
              <button onClick={() => { setShowQuoteModal(false); setSelectedCargoRequest(null); }} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Quote Form */}
              <div className="lg:col-span-2 space-y-4">
                {/* Route Info (Pre-filled) */}
                <div className="bg-[#070E1F] rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-8 h-8 text-blue-400" />
                    <div>
                      <h4 className="text-white font-semibold">
                        {selectedCargoRequest
                          ? `${selectedCargoRequest.origin} → ${selectedCargoRequest.destination}`
                          : `${selectedRequest?.origin} → ${selectedRequest?.destination}`}
                      </h4>
                      <p className="text-sm text-slate-400">
                        {selectedCargoRequest
                          ? `${selectedCargoRequest.container} | ${selectedCargoRequest.cargo}`
                          : `${selectedRequest?.container} | ${selectedRequest?.cargo}`}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-500">
                    <span>Weight: {selectedCargoRequest ? selectedCargoRequest.revenue / 100 : selectedRequest?.weight} MT</span>
                    <span>Ready: {selectedCargoRequest ? selectedCargoRequest.readyDate : selectedRequest?.readyDate}</span>
                    <span>Source: {selectedCargoRequest ? 'Cargo Radar' : (selectedRequest?.source === 'buyer' ? 'Buyer Request' : 'Supplier Request')}</span>
                  </div>
                </div>

                {/* YOUR QUOTE Form */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Your Quote
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">FOB Price (USD) *</label>
                      <input
                        type="number"
                        value={quoteForm.fobPrice}
                        onChange={(e) => setQuoteForm({...quoteForm, fobPrice: e.target.value})}
                        placeholder="1600"
                        className="w-full px-4 py-3 bg-[#070E1F] border border-[#1E3A5F] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">CIF Price (USD) *</label>
                      <input
                        type="number"
                        value={quoteForm.cifPrice}
                        onChange={(e) => setQuoteForm({...quoteForm, cifPrice: e.target.value})}
                        placeholder="1750"
                        className="w-full px-4 py-3 bg-[#070E1F] border border-[#1E3A5F] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Container Type</label>
                    <ContainerSelector
                      value={quoteForm.containerType}
                      onChange={(val) => setQuoteForm({...quoteForm, containerType: val})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Transit Time (days)</label>
                      <input
                        type="number"
                        value={quoteForm.transitDays}
                        onChange={(e) => setQuoteForm({...quoteForm, transitDays: e.target.value})}
                        placeholder="14"
                        className="w-full px-4 py-3 bg-[#070E1F] border border-[#1E3A5F] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Valid Until</label>
                      <input
                        type="date"
                        value={quoteForm.validUntil}
                        onChange={(e) => setQuoteForm({...quoteForm, validUntil: e.target.value})}
                        className="w-full px-4 py-3 bg-[#070E1F] border border-[#1E3A5F] rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Special Notes</label>
                    <textarea
                      value={quoteForm.notes}
                      onChange={(e) => setQuoteForm({...quoteForm, notes: e.target.value})}
                      placeholder="Any special conditions or requirements..."
                      rows={3}
                      className="w-full px-4 py-3 bg-[#070E1F] border border-[#1E3A5F] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* Insurance Toggle */}
                  <div className="flex items-center justify-between p-3 bg-[#070E1F] rounded-xl">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-white">Insurance included</span>
                    </div>
                    <button
                      onClick={() => setQuoteForm({...quoteForm, insuranceIncluded: !quoteForm.insuranceIncluded})}
                      className={`w-10 h-5 rounded-full transition-all relative ${
                        quoteForm.insuranceIncluded ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                        quoteForm.insuranceIncluded ? 'left-5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>

                  <button
                    onClick={handleConfirmCargoQuote}
                    className="w-full py-3 bg-gradient-to-r from-[#1E40AF] to-[#60A5FA] text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Send Quote
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column - Pricing Intelligence Panel */}
              <div className="space-y-4">
                <div className="bg-[#070E1F] rounded-xl p-4 border border-[#1E3A5F]">
                  <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Market Intelligence
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">30-day avg:</span>
                      <span className="text-white font-medium">$1,780</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Low:</span>
                      <span className="text-emerald-400">$1,650</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">High:</span>
                      <span className="text-red-400">$2,100</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-700">
                      <span className="text-slate-400">Your win rate:</span>
                      <span className="text-blue-400">34%</span>
                    </div>
                  </div>
                </div>

                {/* AI Suggestion */}
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl p-4 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 text-xs font-semibold">AI SUGGESTION</span>
                  </div>
                  <div className="text-white text-sm font-medium mb-3">
                    Price $1,750 for <span className="text-emerald-400">60% win probability</span>
                  </div>
                  <button
                    onClick={handleApplySuggestedPrice}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-lg text-xs font-semibold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3 h-3" />
                    Apply Suggested Price
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreightDashboard;
