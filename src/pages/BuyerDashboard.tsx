import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Radio, FileText, Package, FolderOpen, Bot,
  Settings, ChevronLeft, ChevronRight, Search, Plus, Clock,
  DollarSign, Ship, TrendingDown, Sparkles, ChevronDown, MessageSquare,
  Loader2, X, Send, Eye, FileBarChart, Bell, LogOut, Home, Globe,
  Calendar, Check, UsersRound, Video, MapPin, ExternalLink, Zap,
  TrendingUp, Target, AlertTriangle, ArrowRight, Package2, Truck,
  CreditCard, BarChart3, Download, RefreshCw, Clock3, CheckCircle2, XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGlobalTrade, Deal } from '../contexts/GlobalTradeContext';
import { upcomingExpo, expoPackages } from '../data/expoData';
import { preRegisteredBuyers } from '../data/mockData';
import toast from 'react-hot-toast';

const BuyerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { deals, updateDealStatus, getBuyerStats, notifications, markNotificationRead, markAllNotificationsRead, addNotification } = useGlobalTrade();
  const buyerStats = getBuyerStats();
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('overview');
  const [aiQuery, setAiQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  // Expo State
  const [isPreRegistered, setIsPreRegistered] = useState(false);
  const [showPreRegModal, setShowPreRegModal] = useState(false);
  const [preRegInterests, setPreRegInterests] = useState<string[]>([]);
  const [preRegCountries, setPreRegCountries] = useState<string[]>([]);
  const [preRegWhatsApp, setPreRegWhatsApp] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RFQ Form State
  const [rfqForm, setRfqForm] = useState({
    product: '',
    quantity: '',
    destination: '',
    certifications: '',
    targetPrice: ''
  });

  // Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    message: 'Hi, I am interested in your products. Please share your catalog and pricing.',
    quantity: '10 MT',
    deliveryTime: 'As soon as possible'
  });

  const menuItems = [
    { id: 'expo', label: 'Expo Hall', icon: Building2, path: '/companies', desc: 'Browse suppliers' },
    { id: 'radar', label: 'Live Radar', icon: Radio, badge: 'LIVE', path: '/buyer/live-radar', desc: 'Real-time opportunities' },
    { id: 'live-expo', label: 'Live Expo', icon: Calendar, badge: 'MAY 29', path: '/live-expo', desc: 'Virtual trade event' },
    { id: 'rfqs', label: 'My RFQs', icon: FileText, path: '/buyer/rfqs', desc: 'Request quotes' },
    { id: 'orders', label: 'My Orders', icon: Package, path: '/buyer/orders', desc: 'Track shipments' },
    { id: 'documents', label: 'Documents', icon: FolderOpen, path: '/buyer/documents', desc: 'Contracts & invoices' },
    { id: 'ai-agent', label: 'AI Sourcing Agent', icon: Bot, badge: 'AI', path: '/buyer/ai-sourcing', desc: 'Smart sourcing' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/buyer/settings', desc: 'Account preferences' },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  const kpis = [
    { label: 'Active RFQs', value: '4', icon: FileText, color: 'text-blue-400', change: '+2 this week' },
    { label: 'Total Spend (Q)', value: 116250, icon: DollarSign, color: 'text-emerald-400', change: '+18% vs last quarter' },
    { label: 'Cost Saved via AI', value: 12500, icon: TrendingDown, color: 'text-amber-400', change: 'AI optimization' },
    { label: 'Pending Shipments', value: '2', icon: Ship, color: 'text-purple-400', change: 'In transit' },
  ];

  // ========== SOURCING MISSION CONTROL DATA ==========
  const activeSourcing = [
    {
      id: 1,
      product: 'UHT Milk',
      quantity: '500 MT',
      quotes: 3,
      bestPrice: '$1.45/L',
      worstPrice: '$1.78/L',
      savings: '$165,000',
      status: 'Quotes Received'
    },
    {
      id: 2,
      product: 'Chocolate Wafers',
      quantity: '1,000 cases',
      quotes: 5,
      bestPrice: '$2.80',
      worstPrice: '$3.45',
      savings: null,
      status: 'Ready to Accept'
    },
    {
      id: 3,
      product: 'Basmati Rice',
      quantity: '200 MT',
      quotes: 4,
      currentOffer: '$450/MT',
      savings: null,
      status: 'In Negotiation'
    },
  ];

  const pendingShipments = [
    {
      id: 1,
      supplier: 'Al Meera Dairy Products',
      container: '40ft Reefer',
      eta: 'Feb 10',
      daysLeft: 12,
      tracking: 'Live',
      status: 'In transit — at sea'
    },
    {
      id: 2,
      supplier: 'OZMO Confectionery',
      container: '40ft HC',
      eta: 'Feb 15',
      daysLeft: 17,
      tracking: 'Standard',
      status: 'Loading at Mersin port'
    },
  ];

  const budgetTracker = {
    spent: 116000,
    total: 250000,
    percentage: 46,
    categories: [
      { name: 'Dairy', amount: 45000, percentage: 38 },
      { name: 'Confectionery', amount: 38000, percentage: 33 },
      { name: 'Frozen Foods', amount: 22000, percentage: 19 },
      { name: 'Other', amount: 11000, percentage: 10 },
    ],
    aiInsight: "You're under-spending on dairy this quarter. Market prices dropping — good time to lock volume."
  };

  // ========== SMART REORDER DATA ==========
  const reorderSuggestions = [
    {
      id: 1,
      product: 'UHT Milk',
      frequency: 'Every 45 days',
      lastOrder: '42 days ago',
      supplier: 'Baladna Food Industries',
      previousPrice: '$1.45/L',
      urgency: 'high'
    },
    {
      id: 2,
      product: 'Chocolate',
      frequency: 'Every 60 days',
      lastOrder: '56 days ago',
      dueIn: '4 days',
      urgency: 'medium'
    },
    {
      id: 3,
      product: 'Frozen Vegetables',
      frequency: 'Every 30 days',
      lastOrder: '90 days ago',
      urgency: 'low'
    },
  ];

  // ========== MARKET ALERTS DATA ==========
  const marketAlerts = [
    {
      id: 'alert-1',
      type: 'price_drop',
      icon: '🔴',
      title: 'PRICE DROP',
      message: 'Sugar prices dropped 15% this week. You buy sugar-based products regularly. Good time to negotiate.',
      action: 'Start Negotiation'
    },
    {
      id: 'alert-2',
      type: 'supply_shock',
      icon: '🟡',
      title: 'SUPPLY SHOCK',
      message: 'Cocoa harvest affected in Ivory Coast. Prices expected to rise 20% in 30 days.',
      action: 'Lock Prices Now'
    },
    {
      id: 'alert-3',
      type: 'new_supplier',
      icon: '🟢',
      title: 'NEW SUPPLIER',
      message: 'A new Halal-certified dairy supplier just joined. Match score for you: 94%',
      action: 'View Supplier'
    },
  ];

  // ========== SAVINGS TRACKER DATA ==========
  const savingsData = {
    total: 47230,
    breakdown: [
      { label: 'Better pricing via AI matching', amount: 28400 },
      { label: 'Reduced travel/expo costs', amount: 12000 },
      { label: 'Lower freight via marketplace', amount: 6830 },
    ],
    trend: [12000, 18500, 22000, 31000, 38000, 47230],
    trendLabels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
  };

  const quickCategories = [
    { name: 'Chocolate & Confectionery', count: 156 },
    { name: 'Dairy Products', count: 89 },
    { name: 'Beverages', count: 234 },
    { name: 'Snacks', count: 112 },
    { name: 'Oils & Fats', count: 67 },
  ];

  const searchResults = [
    {
      id: 1,
      name: 'OZMO Confectionery',
      flag: '🇹🇷',
      match: 97,
      category: 'Chocolate & Wafers',
      capacity: '50+ containers/month',
      certifications: 'ISO 22000, Halal',
      minOrder: '$5,000'
    },
    {
      id: 2,
      name: 'Almarai Company',
      flag: '🇸🇦',
      match: 94,
      category: 'Dairy & Food Products',
      capacity: '100+ containers/month',
      certifications: 'FSSC 22000',
      minOrder: '$10,000'
    },
    {
      id: 3,
      name: 'German Foods GmbH',
      flag: '🇩🇪',
      match: 89,
      category: 'Premium Confectionery',
      capacity: '20+ containers/month',
      certifications: 'BRC Grade A',
      minOrder: '$3,000'
    },
  ];

  const recentQuotes = [
    { supplier: 'Golden Dates Co.', product: 'Premium Dates - 5MT', status: 'Received', amount: 12500, time: '2 hours ago' },
    { supplier: 'Medina Foods', product: 'Halal Snacks - 10MT', status: 'Pending', amount: 28500, time: '1 day ago' },
    { supplier: 'Istanbul Sweets', product: 'Turkish Delight - 3MT', status: 'Received', amount: 8500, time: '2 days ago' },
  ];

  const handleSearch = () => {
    if (!aiQuery.trim()) {
      toast.error('Please enter what you want to source');
      return;
    }
    setIsSearching(true);
    setShowResults(false);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
      toast.success(`Found 3 suppliers matching "${aiQuery}"`);
    }, 1500);
  };

  const handleQuickCategory = (category: string) => {
    setAiQuery(category);
    setIsSearching(true);
    setShowResults(false);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
      toast.success(`Found 3 suppliers for "${category}"`);
    }, 1500);
  };

  const handleSendInquiry = (supplierName: string) => {
    setSelectedSupplier(supplierName);
    setShowInquiryModal(true);
  };

  const handleSubmitInquiry = () => {
    toast.success(`Inquiry sent to ${selectedSupplier}!`);
    setShowInquiryModal(false);
    setInquiryForm({ message: 'Hi, I am interested in your products. Please share your catalog and pricing.', quantity: '10 MT', deliveryTime: 'As soon as possible' });
  };

  const handleRequestQuote = (supplierName: string) => {
    setSelectedSupplier(supplierName);
    setRfqForm({ ...rfqForm, product: aiQuery || 'Confectionery' });
    setShowQuoteModal(true);
  };

  const handleSubmitQuote = () => {
    if (!rfqForm.product || !rfqForm.quantity || !rfqForm.destination) {
      toast.error('Please fill in required fields');
      return;
    }
    toast.success(`RFQ submitted to ${selectedSupplier}!`);
    setShowQuoteModal(false);
    setRfqForm({ product: '', quantity: '', destination: '', certifications: '', targetPrice: '' });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // ========== GLOBAL TRADE FLOW HANDLERS ==========
  const handleAcceptQuote = (deal: Deal) => {
    updateDealStatus(deal.id, 'accepted');
    // Notify supplier about accepted deal
    addNotification({
      type: 'deal_accepted',
      title: 'Deal Accepted!',
      message: `${deal.buyerCompany} accepted your quote for ${deal.product}`,
      dashboard: 'supplier',
      relatedId: deal.id
    });
    toast.success(
      <div>
        <div className="font-semibold">Quote Accepted!</div>
        <div className="text-sm text-gray-300">{deal.product} from {deal.buyerCompany}</div>
        <div className="text-sm text-emerald-400 mt-1">Supplier has been notified</div>
      </div>,
      { duration: 5000 }
    );
  };

  const handleRejectQuote = (deal: Deal) => {
    updateDealStatus(deal.id, 'rejected');
    toast.success(`Quote for ${deal.product} declined`);
  };

  const handleNegotiateQuote = (deal: Deal) => {
    updateDealStatus(deal.id, 'negotiating');
    toast.success(`Entering negotiation for ${deal.product}`);
  };

  const handleViewProfile = (supplierName: string) => {
    toast.success(`Viewing ${supplierName} profile...`);
    navigate('/companies');
  };

  const handleCompareQuotes = (rfqId: string) => {
    navigate(`/buyer/rfqs/${rfqId}`);
  };

  const handleAcceptBestQuote = (rfqId: string) => {
    navigate(`/buyer/rfqs/${rfqId}`);
  };

  const handleContinueRFQ = (rfqId: string) => {
    navigate(`/buyer/rfqs/${rfqId}`);
  };

  const handleTrackShipment = (shipmentId: string) => {
    navigate(`/buyer/orders/${shipmentId}`);
  };

  const handleViewShipment = (shipmentId: string) => {
    navigate(`/buyer/orders/${shipmentId}`);
  };

  const handleReorder = (suggestion: typeof reorderSuggestions[0]) => {
    toast.success(`Reorder for ${suggestion.product} initiated!`);
  };

  const handleNewQuote = (suggestion: typeof reorderSuggestions[0]) => {
    setAiQuery(suggestion.product);
    setShowQuoteModal(true);
  };

  const handleMarketAlertAction = (alertId: string) => {
    toast.success('Opening negotiation with suppliers...');
  };

  const handlePlaceBid = () => {
    toast.success('Bid placed! You\'re now competing.');
  };

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date('2025-05-29T08:00:00');

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePreRegister = () => {
    if (preRegInterests.length === 0) {
      toast.error('Please select at least one product interest');
      return;
    }
    setIsPreRegistered(true);
    setShowPreRegModal(false);
    toast.success('You\'re registered for May 29 Expo! We\'ll notify you when it starts.');
  };

  const handleScheduleMeeting = (companyName: string) => {
    toast.success(`Meeting request sent to ${companyName}! They'll confirm before expo day.`);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-[#111827] border-r border-slate-800 flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Buyer Hub</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5 text-slate-400" /> : <ChevronLeft className="w-5 h-5 text-slate-400" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setActiveMenu(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeMenu === item.id ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        item.badge === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-800">
          {!collapsed && (
            <div className="bg-slate-800/50 rounded-xl p-3 mb-3">
              <div className="text-xs text-slate-400 mb-2">Sourcing Budget</div>
              <div className="text-lg font-bold text-white">$250,000</div>
              <div className="text-xs text-slate-500">Available this quarter</div>
            </div>
          )}
          {/* Back to Home & Logout */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            {!collapsed && <span>Back to Home</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
          {!collapsed && (
            <div className="pt-2 border-t border-slate-700">
              <div className="text-xs text-slate-500 text-center">
                Logged in as {user?.email || 'buyer@demo.com'}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">{user?.name?.charAt(0) || 'B'}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user?.name || 'Buyer'}</div>
                <div className="text-xs text-slate-400">Buyer Account</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* PERSISTENT TOP HEADER */}
        <div className="h-12 bg-[#0A0F1E] border-b border-slate-800/50 flex items-center justify-between px-6">
          {/* Left: Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-7 h-7 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#0A0F1E]" />
            </div>
            <span className="text-sm font-semibold text-white">Brands Bridge AI</span>
          </div>

          {/* Center: Platform Name */}
          <div className="text-sm font-medium text-white">Buyer Hub</div>

          {/* Right: Bell, User, Logout */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors relative"
              >
                <Bell className="w-4 h-4 text-slate-400" />
                {notifications.filter(n => !n.read && n.dashboard === 'buyer').length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                    {notifications.filter(n => !n.read && n.dashboard === 'buyer').length}
                  </span>
                )}
              </button>
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-10 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
                  <div className="p-3 border-b border-slate-700 flex items-center justify-between">
                    <span className="text-white font-semibold">Notifications</span>
                    <button
                      onClick={() => { markAllNotificationsRead(); toast.success('All notifications marked as read'); }}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.filter(n => n.dashboard === 'buyer').length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.filter(n => n.dashboard === 'buyer').slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer ${
                            !notif.read ? 'bg-blue-500/5' : ''
                          }`}
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <div className="flex items-start gap-2">
                            {!notif.read && <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0" />}
                            <div className="flex-1">
                              <div className="text-white text-sm font-medium">{notif.title}</div>
                              <div className="text-slate-400 text-xs mt-0.5">{notif.message}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <span className="text-sm text-white font-medium">{user?.name || 'Buyer'}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Top Bar */}
        <header className="sticky top-12 z-30 bg-[#0A0F1E]/95 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                Good morning, {user?.name?.split(' ')[0] || 'Buyer'} 👋
              </h1>
              <p className="text-slate-400">2 new quotes received from your RFQs</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Messages (3)
              </button>
              <Link
                to="/companies"
                className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New RFQ
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* LIVE EXPO TAB */}
          {activeMenu === 'live-expo' && (
            <div className="space-y-6">
              {/* Expo Hero Banner */}
              <div className="relative bg-gradient-to-r from-[#D4AF37]/20 via-amber-500/10 to-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-2xl p-6 overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }} />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-semibold rounded-full animate-pulse">
                      UPCOMING
                    </div>
                    <span className="text-[#D4AF37] text-sm font-medium">Monthly Live Expo</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">May 29, 2025</h2>
                  <p className="text-slate-400 mb-4">8:00 AM - 8:00 PM GST • 47 companies will be live</p>

                  {/* Countdown */}
                  <div className="flex gap-4 mb-6">
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center min-w-[80px]">
                      <div className="text-3xl font-bold text-white">{countdown.days}</div>
                      <div className="text-slate-400 text-xs uppercase">Days</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center min-w-[80px]">
                      <div className="text-3xl font-bold text-white">{countdown.hours}</div>
                      <div className="text-slate-400 text-xs uppercase">Hours</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center min-w-[80px]">
                      <div className="text-3xl font-bold text-white">{countdown.minutes}</div>
                      <div className="text-slate-400 text-xs uppercase">Minutes</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center min-w-[80px]">
                      <div className="text-3xl font-bold text-white">{countdown.seconds}</div>
                      <div className="text-slate-400 text-xs uppercase">Seconds</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">47</div>
                      <div className="text-slate-400 text-sm">Companies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">{upcomingExpo.confirmedBuyers}+</div>
                      <div className="text-slate-400 text-sm">Buyers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{upcomingExpo.totalRoomsBooked}</div>
                      <div className="text-slate-400 text-sm">Rooms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-400">$3.2M</div>
                      <div className="text-slate-400 text-sm">Expected Deals</div>
                    </div>
                  </div>

                  {/* Pre-Registration */}
                  {!isPreRegistered ? (
                    <button
                      onClick={() => setShowPreRegModal(true)}
                      className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      Pre-Register to Attend (Free)
                    </button>
                  ) : (
                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                      <Check className="w-6 h-6 text-emerald-400" />
                      <div>
                        <p className="text-white font-semibold">You're Registered!</p>
                        <p className="text-slate-400 text-sm">We'll notify you when the expo starts</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Companies to Meet */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Companies to Meet</h3>
                    <p className="text-slate-400 text-sm">Based on your sourcing interests</p>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Al Meera Consumer Goods', country: '🇶🇦', category: 'FMCG', match: 96 },
                    { name: 'Baladna Food Industries', country: '🇶🇦', category: 'Dairy', match: 94 },
                    { name: 'Qatar Food Factory', country: '🇶🇦', category: 'Beverages', match: 89 }
                  ].map((company, index) => (
                    <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{company.country}</span>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{company.name}</h4>
                          <p className="text-slate-400 text-sm">{company.category}</p>
                        </div>
                        <div className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg text-sm font-semibold">
                          {company.match}%
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleScheduleMeeting(company.name)}
                          className="flex-1 py-2 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-amber-500 transition-colors text-sm"
                        >
                          Pre-Schedule Meeting
                        </button>
                        <button
                          onClick={() => navigate('/companies')}
                          className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories Available */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Product Categories at Expo</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { name: 'Dairy', count: 12, emoji: '🥛' },
                    { name: 'FMCG', count: 18, emoji: '🛒' },
                    { name: 'Confectionery', count: 8, emoji: '🍫' },
                    { name: 'Beverages', count: 6, emoji: '🥤' },
                    { name: 'Snacks', count: 5, emoji: '🍿' }
                  ].map((cat, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-xl p-4 text-center">
                      <span className="text-2xl mb-2 block">{cat.emoji}</span>
                      <div className="text-white font-medium">{cat.name}</div>
                      <div className="text-slate-400 text-sm">{cat.count} companies</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enter Expo Hall */}
              <button
                onClick={() => navigate('/live-expo')}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Enter Full Expo Hall (on expo day)
              </button>
            </div>
          )}

          {/* Dashboard Content (when not on expo tab) */}
          {activeMenu !== 'live-expo' && (
            <>
              {/* ========== SOURCING MISSION CONTROL ========== */}
              <div className="mb-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>🎯</span> Sourcing Mission Control
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Everything your procurement team needs — in one view</p>
                </div>

                {/* ========== INCOMING QUOTES (GLOBAL TRADE FLOW) ========== */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <span>📨</span> Incoming Quotes
                        </h3>
                        <p className="text-xs text-slate-400">Accept to move deals forward to suppliers</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold">
                      {deals.filter(d => d.status === 'pending').length} pending
                    </div>
                  </div>

                  {deals.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No quotes yet. Start sourcing to receive quotes from suppliers.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {deals.slice(0, 4).map((deal) => (
                        <div
                          key={deal.id}
                          className={`rounded-xl p-4 border ${
                            deal.status === 'pending'
                              ? 'bg-slate-800/50 border-slate-700'
                              : deal.status === 'accepted'
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : deal.status === 'negotiating'
                              ? 'bg-amber-500/10 border-amber-500/30'
                              : 'bg-slate-800/30 border-slate-700/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-white font-semibold">{deal.product}</h4>
                              <p className="text-sm text-slate-400">{deal.buyerCompany} • {deal.country}</p>
                            </div>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                              deal.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                              deal.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                              deal.status === 'negotiating' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-slate-700 text-slate-400'
                            }`}>
                              {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm mb-4">
                            <div>
                              <span className="text-slate-500">Qty:</span>
                              <span className="text-white ml-1">{deal.quantity}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Target:</span>
                              <span className="text-emerald-400 ml-1">{deal.targetPrice}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Value:</span>
                              <span className="text-white ml-1">${deal.value.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Action buttons based on status */}
                          {deal.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptQuote(deal)}
                                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleNegotiateQuote(deal)}
                                className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-500/30"
                              >
                                Negotiate
                              </button>
                              <button
                                onClick={() => handleRejectQuote(deal)}
                                className="px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/30"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {deal.status === 'accepted' && (
                            <div className="flex items-center gap-2 text-emerald-400 text-sm">
                              <CheckCircle2 className="w-4 h-4" />
                              Deal accepted — supplier notified
                            </div>
                          )}
                          {deal.status === 'negotiating' && (
                            <button
                              onClick={() => handleAcceptQuote(deal)}
                              className="w-full py-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black text-sm font-semibold rounded-lg"
                            >
                              Send Counter Offer →
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* COLUMN 1 - Active Sourcing */}
                  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">🔍</span>
                      <h3 className="text-white font-bold">You're sourcing right now</h3>
                    </div>
                    <div className="space-y-4">
                      {activeSourcing.map((item) => (
                        <div key={item.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-blue-500/30 transition-all cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-semibold">{item.product}</span>
                            <span className="text-xs text-slate-400">{item.quantity}</span>
                          </div>
                          <div className="text-xs text-slate-400 mb-2">
                            {item.quotes} quotes received
                          </div>
                          {item.savings ? (
                            <>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-emerald-400">Best: {item.bestPrice}</span>
                                <span className="text-slate-500">|</span>
                                <span className="text-red-400">Worst: {item.worstPrice}</span>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-emerald-400 text-xs font-medium">Savings: {item.savings}</span>
                                <button
                                  onClick={() => handleCompareQuotes('rfq-001')}
                                  className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600">
                                  Compare Now →
                                </button>
                              </div>
                            </>
                          ) : item.currentOffer ? (
                            <>
                              <div className="text-xs text-slate-400 mb-2">
                                Current offer: {item.currentOffer}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-medium ${
                                  item.status === 'Ready to Accept' ? 'text-emerald-400' : 'text-amber-400'
                                }`}>
                                  {item.status}
                                </span>
                                <button
                                  onClick={() => handleContinueRFQ(item.status === 'Ready to Accept' ? 'rfq-002' : 'rfq-003')}
                                  className="px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black text-xs font-medium rounded-lg">
                                  {item.status === 'Ready to Accept' ? 'Accept Best Quote →' : 'Continue →'}
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-emerald-400 text-xs font-medium">{item.status}</span>
                              <button className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600">
                                Continue →
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COLUMN 2 - Arriving Soon */}
                  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">📦</span>
                      <h3 className="text-white font-bold">Pending Shipments</h3>
                    </div>
                    <div className="space-y-4">
                      {pendingShipments.map((shipment) => (
                        <div key={shipment.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-emerald-500/30 transition-all cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-semibold text-sm">{shipment.supplier}</span>
                            {shipment.tracking === 'Live' && (
                              <span className="flex items-center gap-1 text-xs text-emerald-400">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                Live ✓
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                            <Truck className="w-3 h-3" />
                            <span>{shipment.container}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs text-slate-500">ETA:</span>
                              <span className="text-white text-sm ml-1">{shipment.eta}</span>
                              <span className="text-xs text-amber-400 ml-1">({shipment.daysLeft} days)</span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-slate-400">{shipment.status}</div>
                          <button
                            onClick={() => handleTrackShipment(shipment.id === 1 ? 'shp-001' : 'shp-002')}
                            className="w-full mt-3 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium rounded-lg hover:bg-emerald-500/30">
                            {shipment.tracking === 'Live' ? 'Track Live →' : 'View Details →'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COLUMN 3 - Budget Tracker */}
                  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">💰</span>
                      <h3 className="text-white font-bold">This Quarter</h3>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-white font-bold">{formatCurrency(budgetTracker.spent)}</span>
                        <span className="text-slate-400">/ {formatCurrency(budgetTracker.total)}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
                          style={{ width: `${budgetTracker.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-blue-400 mt-1">{budgetTracker.percentage}% used</div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="space-y-2 mb-4">
                      {budgetTracker.categories.map((cat, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              index === 0 ? 'bg-blue-400' : index === 1 ? 'bg-amber-400' : index === 2 ? 'bg-purple-400' : 'bg-slate-400'
                            }`}></div>
                            <span className="text-slate-300 text-sm">{cat.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-white text-sm">{formatCurrency(cat.amount)}</span>
                            <span className="text-slate-500 text-xs ml-1">({cat.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Recommendation */}
                    <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-xl p-3">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-300 leading-relaxed">{budgetTracker.aiInsight}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========== SMART REORDER SECTION ========== */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🔄</span> Time to Reorder
                </h2>
                <p className="text-slate-400 text-sm mt-1">Based on your historical order patterns</p>
              </div>
              <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 text-sm">
                <RefreshCw className="w-4 h-4" />
                Refresh Suggestions
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reorderSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`rounded-xl p-5 border ${
                    suggestion.urgency === 'high'
                      ? 'bg-red-500/5 border-red-500/20'
                      : suggestion.urgency === 'medium'
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : 'bg-slate-800/30 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Clock3 className={`w-5 h-5 ${
                      suggestion.urgency === 'high' ? 'text-red-400' : suggestion.urgency === 'medium' ? 'text-amber-400' : 'text-slate-400'
                    }`} />
                    <span className={`text-xs font-semibold uppercase ${
                      suggestion.urgency === 'high' ? 'text-red-400' : suggestion.urgency === 'medium' ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                      {suggestion.urgency === 'high' ? 'Due Now' : suggestion.urgency === 'medium' ? 'Coming Up' : 'Stale'}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-1">{suggestion.product}</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    You order {suggestion.frequency}. Last order: {suggestion.lastOrder}
                    {suggestion.dueIn && ` • Due in ${suggestion.dueIn}`}
                  </p>

                  {suggestion.supplier && (
                    <p className="text-xs text-slate-500 mb-3">
                      Supplier: {suggestion.supplier} • {suggestion.previousPrice}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReorder(suggestion)}
                      className="flex-1 py-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-semibold rounded-lg hover:shadow-lg text-sm">
                      {suggestion.urgency === 'low' ? 'Yes, reorder' : 'Reorder Same Terms →'}
                    </button>
                    {suggestion.urgency === 'low' ? (
                      <button className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm">
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleNewQuote(suggestion)}
                        className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm">
                        New Quote
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========== AI SOURCING ASSISTANT ========== */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#0B5E75] to-teal-600 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Sourcing Assistant</h2>
                  <p className="text-teal-100">Powered by Brands Bridge AI Core</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-lg text-white font-medium mb-4">What do you need to source today?</p>
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g. 500MT of cocoa powder, Halal certified, delivered to Dubai port"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching AI Database...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Find Best Suppliers
                  </>
                )}
              </button>

              {/* Quick Source Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-slate-400 mr-2">Quick source:</span>
                {quickCategories.map((cat, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickCategory(cat.name)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Search Results */}
          {showResults && (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 px-6 py-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">AI Matched Suppliers</h3>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">{searchResults.length} found</span>
                  </div>
                  <button onClick={() => setShowResults(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {searchResults.map((supplier) => (
                  <div key={supplier.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {supplier.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            {supplier.name} <span className="text-lg">{supplier.flag}</span>
                          </h4>
                          <p className="text-sm text-slate-400">{supplier.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
                          {supplier.match}% Match
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                      <span>{supplier.capacity}</span>
                      <span>•</span>
                      <span>{supplier.certifications}</span>
                      <span>•</span>
                      <span>Min. Order: {supplier.minOrder}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSendInquiry(supplier.name)}
                        className="flex-1 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg font-medium hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Inquiry
                      </button>
                      <button
                        onClick={() => handleViewProfile(supplier.name)}
                        className="flex-1 py-2 bg-slate-700 border border-slate-600 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                      <button
                        onClick={() => handleRequestQuote(supplier.name)}
                        className="flex-1 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
                      >
                        <FileBarChart className="w-4 h-4" />
                        Request Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Two Column + Market Alerts Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Quotes */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Recent Quotes</h3>
                <Link to="/procurement" className="text-sm text-[#D4AF37] hover:underline">View All →</Link>
              </div>
              <div className="space-y-3">
                {recentQuotes.map((quote, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-white">{quote.supplier}</div>
                        <div className="text-sm text-slate-400 mt-1">{quote.product}</div>
                        <div className="text-xs text-slate-500 mt-1">{quote.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">{formatCurrency(quote.amount)}</div>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded ${
                          quote.status === 'Received' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {quote.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Opportunities */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <h3 className="text-lg font-bold text-white">Live Opportunities</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded animate-pulse">LIVE NOW</span>
                    <span className="text-xs text-slate-500">Ends in 45 min</span>
                  </div>
                  <div className="font-medium text-white">Sugar bulk order — 200MT</div>
                  <div className="text-sm text-slate-400 mt-1">5 suppliers competing</div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-emerald-400 font-medium">Best: $485/MT</span>
                    <button
                        onClick={handlePlaceBid}
                        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg font-medium">Place Bid</button>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded">New</span>
                    <span className="text-xs text-slate-500">Posted 2 hours ago</span>
                  </div>
                  <div className="font-medium text-white">Olive Oil — Premium Grade</div>
                  <div className="text-sm text-slate-400 mt-1">8 suppliers available</div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-slate-400">Est. $125,000</span>
                    <button className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded-lg font-medium">View Details</button>
                  </div>
                </div>
              </div>
              <Link
                to="/live-deal-room"
                className="block mt-4 py-3 bg-slate-800 text-slate-300 text-center rounded-xl font-medium hover:bg-slate-700 transition-colors"
              >
                Browse All Live Deals →
              </Link>
            </div>

            {/* ========== MARKET ALERTS WIDGET ========== */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 sticky top-[100px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">⚡ Market Alerts</h3>
                  <p className="text-xs text-slate-400">For your portfolio</p>
                </div>
              </div>

              <div className="space-y-4">
                {marketAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-xl p-4 border ${
                      alert.type === 'price_drop'
                        ? 'bg-red-500/10 border-red-500/20'
                        : alert.type === 'supply_shock'
                        ? 'bg-amber-500/10 border-amber-500/20'
                        : 'bg-emerald-500/10 border-emerald-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{alert.icon}</span>
                      <div className="flex-1">
                        <span className={`text-xs font-bold uppercase ${
                          alert.type === 'price_drop'
                            ? 'text-red-400'
                            : alert.type === 'supply_shock'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}>
                          {alert.title}
                        </span>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>
                        <button
                          onClick={() => handleMarketAlertAction(alert.id)}
                          className={`mt-3 px-3 py-1.5 text-xs font-medium rounded-lg w-full ${
                            alert.type === 'price_drop'
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : alert.type === 'supply_shock'
                              ? 'bg-amber-500 text-black hover:bg-amber-600'
                              : 'bg-emerald-500 text-white hover:bg-emerald-600'
                          }`}>
                          {alert.action}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========== SAVINGS TRACKER ========== */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>💸</span> Your Savings on Brands Bridge
                </h2>
                <p className="text-slate-400 text-sm mt-1">vs your previous sourcing process</p>
              </div>
              <button
                onClick={() => toast.success('Generating CFO impact report...')}
                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Share Impact Report →
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Big Number & Breakdown */}
              <div>
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-4">
                  <div className="text-4xl font-bold text-emerald-400 mb-1">
                    {formatCurrency(savingsData.total)}
                  </div>
                  <div className="text-slate-400 text-sm">saved this quarter</div>
                </div>

                <div className="space-y-3">
                  {savingsData.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-800/30 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-emerald-500/20 text-emerald-400' :
                          index === 1 ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {index === 0 ? <TrendingUp className="w-4 h-4" /> :
                           index === 1 ? <Ship className="w-4 h-4" /> :
                           <Truck className="w-4 h-4" />}
                        </div>
                        <span className="text-slate-300 text-sm">{item.label}</span>
                      </div>
                      <span className="text-white font-semibold">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6-Month Trend Chart */}
              <div className="bg-slate-800/30 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold">6-Month Savings Trend</h4>
                  <span className="text-emerald-400 text-sm font-medium">+294% growth</span>
                </div>

                {/* Simple SVG Chart */}
                <div className="h-40 flex items-end justify-between gap-2 mb-4">
                  {savingsData.trend.map((value, index) => {
                    const maxValue = Math.max(...savingsData.trend);
                    const height = (value / maxValue) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${height}%` }}></div>
                        <span className="text-xs text-slate-500">{savingsData.trendLabels[index]}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                    <span>Cumulative Savings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </main>

      {/* Pre-Registration Modal */}
      {showPreRegModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-[#D4AF37]/20 to-amber-500/10 px-6 py-5 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Pre-Register for Expo</h3>
                <p className="text-slate-400 text-sm">May 29, 2025 • It's free!</p>
              </div>
              <button onClick={() => setShowPreRegModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Your Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">WhatsApp Number</label>
                <input
                  type="text"
                  value={preRegWhatsApp}
                  onChange={(e) => setPreRegWhatsApp(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <p className="text-xs text-slate-500 mt-1">We'll send you room links via WhatsApp</p>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Product Interests (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {['Dairy', 'FMCG', 'Confectionery', 'Beverages', 'Snacks', 'Dates', 'Organic'].map(prod => (
                    <button
                      key={prod}
                      onClick={() => {
                        setPreRegInterests(preRegInterests.includes(prod)
                          ? preRegInterests.filter(p => p !== prod)
                          : [...preRegInterests, prod]);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        preRegInterests.includes(prod)
                          ? 'bg-[#D4AF37] text-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {prod}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Countries of Interest</label>
                <div className="flex flex-wrap gap-2">
                  {['UAE', 'Saudi Arabia', 'Qatar', 'Turkey', 'Germany', 'Egypt'].map(country => (
                    <button
                      key={country}
                      onClick={() => {
                        setPreRegCountries(preRegCountries.includes(country)
                          ? preRegCountries.filter(c => c !== country)
                          : [...preRegCountries, country]);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        preRegCountries.includes(country)
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handlePreRegister}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Pre-Register Free
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Send Inquiry to {selectedSupplier}</h3>
              <button onClick={() => setShowInquiryModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Your Message</label>
                <textarea
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Quantity Needed</label>
                <input
                  type="text"
                  value={inquiryForm.quantity}
                  onChange={(e) => setInquiryForm({...inquiryForm, quantity: e.target.value})}
                  placeholder="e.g. 10 MT"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Delivery Time</label>
                <input
                  type="text"
                  value={inquiryForm.deliveryTime}
                  onChange={(e) => setInquiryForm({...inquiryForm, deliveryTime: e.target.value})}
                  placeholder="e.g. Within 30 days"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button
                onClick={handleSubmitInquiry}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Request Quote from {selectedSupplier}</h3>
              <button onClick={() => setShowQuoteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Product Needed *</label>
                <input
                  type="text"
                  value={rfqForm.product}
                  onChange={(e) => setRfqForm({...rfqForm, product: e.target.value})}
                  placeholder="e.g. Chocolate Wafers"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Quantity (MT) *</label>
                <input
                  type="text"
                  value={rfqForm.quantity}
                  onChange={(e) => setRfqForm({...rfqForm, quantity: e.target.value})}
                  placeholder="e.g. 50 MT"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Destination Port *</label>
                <input
                  type="text"
                  value={rfqForm.destination}
                  onChange={(e) => setRfqForm({...rfqForm, destination: e.target.value})}
                  placeholder="e.g. Jebel Ali, Dubai"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Required Certifications</label>
                <input
                  type="text"
                  value={rfqForm.certifications}
                  onChange={(e) => setRfqForm({...rfqForm, certifications: e.target.value})}
                  placeholder="e.g. Halal, ISO 22000"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Target Price (optional)</label>
                <input
                  type="text"
                  value={rfqForm.targetPrice}
                  onChange={(e) => setRfqForm({...rfqForm, targetPrice: e.target.value})}
                  placeholder="e.g. $2,500/MT"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button
                onClick={handleSubmitQuote}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                <FileBarChart className="w-5 h-5" />
                Submit RFQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
