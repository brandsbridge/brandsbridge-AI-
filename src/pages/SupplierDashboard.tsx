import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, PieChart, Package, FileText, Video,
  Megaphone, Ship, Settings, ChevronLeft, ChevronRight, TrendingUp,
  Zap, Plus, Mail, Play, FileBarChart, AlertCircle, Package2,
  DollarSign, Target, Clock, Activity, ChevronDown, Menu, X,
  Loader2, Globe, Bell, LogOut, Home, Building2, Calendar, Check,
  UsersRound, DoorOpen, CreditCard, Star, Sparkles, UserPlus,
  MessageSquare, Eye, Edit3, Send, Copy, ExternalLink, ArrowRight,
  TrendingDown, Award, AlertTriangle, Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isFeatureVisible } from '../data/featureFlags';
import { upcomingExpo, expoPackages, formatExpoDate } from '../data/expoData';
import { expoRooms as mockExpoRooms, preRegisteredBuyers } from '../data/mockData';
import toast from 'react-hot-toast';

type SubMenu = 'pipeline' | 'leads' | 'companies' | 'inventory' | 'finance' | 'export-docs' | 'search-boost' | 'email-catalog' | null;

const COUNTRIES = [
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman', 'Bahrain',
  'Turkey', 'Egypt', 'Morocco', 'Germany', 'UK', 'USA', 'India', 'China',
  'Brazil', 'Indonesia', 'Malaysia', 'Thailand', 'Vietnam', 'South Africa'
];

const SupplierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('overview');
  const [expandedSubmenu, setExpandedSubmenu] = useState<SubMenu>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState(false);
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [selectedSessionType, setSelectedSessionType] = useState<'video' | 'audio' | 'chat'>('video');
  const [showExpoModal, setShowExpoModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [expoRegistered, setExpoRegistered] = useState(false);

  // Expo Tab State
  const [expoTabStep, setExpoTabStep] = useState(1); // 1-4 for registration wizard
  const [expoStatus, setExpoStatus] = useState<'not_registered' | 'pending' | 'approved' | 'live'>('not_registered');
  const [expoSellers, setExpoSellers] = useState<Array<{
    name: string;
    title: string;
    email: string;
    whatsapp: string;
    languages: string[];
    products: string[];
  }>>([]);
  const [expoProfile, setExpoProfile] = useState({
    headline: '',
    products: [] as string[],
    offer: 'discount' as 'discount' | 'sample' | 'bulk',
    offerValue: '10'
  });
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Feature visibility checks
  const userRole = user?.role || 'supplier';
  const userEmail = user?.email || '';

  // Add Lead Form State
  const [leadForm, setLeadForm] = useState({
    companyName: '',
    country: '',
    email: '',
    dealValue: '',
    productInterest: ''
  });

  // Campaign Form State
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    category: 'Confectionery',
    targetCountry: 'United Arab Emirates',
    recipients: '500'
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    companyName: user?.company || 'Golden Dates Co.',
    contactEmail: user?.email || 'export@goldendates.com',
    notifications: true,
    language: 'English'
  });

  // AI Sales Coach State
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const aiCoachTips = [
    {
      text: "Your response time dropped to 4 hours this week (was 2 hours). Buyers who wait more than 3 hours are 40% less likely to close.",
      action: "Improve Response Time",
      actionRoute: "/live-deal-room"
    },
    {
      text: "Companies that post 3+ products in Virtual Booth get 3x more inquiries. You have 1 product. Add 2 more to double your leads.",
      action: "Add Products Now",
      actionRoute: "/supplier/profile-editor"
    },
    {
      text: "Suppliers who go LIVE weekly close 60% more deals. You haven't been live in 8 days.",
      action: "Schedule Live Session",
      actionRoute: "/live-deal-room"
    }
  ];

  // My Day Tasks Data
  const myDayTasks = {
    urgent: {
      count: 3,
      waitTime: "18 hours",
      lostRevenue: "$45,000",
      action: "Reply Now"
    },
    opportunity: {
      company: "Al Meera",
      views: 4,
      message: "They haven't sent an inquiry yet. AI suggests: reach out with a product sample offer.",
      action: "Start Conversation"
    },
    insight: {
      title: "Cocoa prices dropped 8% this week",
      deals: 3,
      savings: "$12,400",
      action: "View Deals"
    },
    readyToClose: {
      deal: "OZMO",
      value: "$186,000",
      status: "Contract signed, invoice sent. Just needs buyer confirmation.",
      action: "Send Reminder"
    }
  };

  // Weekly Performance Data
  const weeklyStats = {
    inquiries: { value: 23, change: "+35%", trend: "up" },
    meetings: { value: 8, change: "+12%", trend: "up" },
    conversion: { value: "34%", change: "Above industry avg 18%", badge: "Top performer", trend: "up" },
    pipeline: { value: "$847K", change: "+$124K this week", trend: "up" }
  };

  // Competitor Intelligence Data
  const competitorInsights = [
    {
      text: "A similar manufacturer in Turkey added 15 new products this week and received 47 inquiries",
      action: "See What Categories"
    },
    {
      text: "3 companies in your category are running expo-day special offers this month. Consider matching.",
      action: "Learn More"
    },
    {
      text: "Average response time in your category: 1.8 hours. Your average: 4.2 hours.",
      action: "Improve Now"
    }
  ];

  // Auto-rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % aiCoachTips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const toggleSubmenu = (sub: SubMenu) => {
    setExpandedSubmenu(expandedSubmenu === sub ? null : sub);
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

  const handleAddSeller = () => {
    const maxSellers = selectedPackage ? expoPackages.find(p => p.id === selectedPackage)?.sellers || 1 : 1;
    if (expoSellers.length < maxSellers) {
      setExpoSellers([...expoSellers, {
        name: '',
        title: '',
        email: '',
        whatsapp: '',
        languages: [],
        products: []
      }]);
    }
  };

  const handleRemoveSeller = (index: number) => {
    setExpoSellers(expoSellers.filter((_, i) => i !== index));
  };

  const handleUpdateSeller = (index: number, field: string, value: any) => {
    const updated = [...expoSellers];
    (updated[index] as any)[field] = value;
    setExpoSellers(updated);
  };

  const handleGenerateHeadline = () => {
    const headlines = [
      'Premium Quality FMCG Products — Direct from Manufacturer',
      'Your Trusted Partner for GCC Food Exports',
      'Wholesale Food Supply — Competitive Prices Guaranteed',
      'Authentic Middle Eastern Dates & Confectionery',
      'Fresh Dairy & Beverages — Export Ready'
    ];
    setExpoProfile({ ...expoProfile, headline: headlines[Math.floor(Math.random() * headlines.length)] });
    toast.success('Headline generated by AI!');
  };

  const handleSubmitExpoRegistration = () => {
    if (!selectedPackage) {
      toast.error('Please select a package');
      return;
    }
    if (expoSellers.length === 0) {
      toast.error('Please add at least one seller');
      return;
    }
    setExpoStatus('pending');
    toast.success('Registration submitted! We\'ll review your application within 24 hours.');
  };

  const copyRoomCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Room code copied!');
  };

  const handleAddLead = () => {
    if (!leadForm.companyName || !leadForm.email) {
      toast.error('Please fill in required fields');
      return;
    }
    toast.success(`Lead "${leadForm.companyName}" added to pipeline!`);
    setShowAddLeadModal(false);
    setLeadForm({ companyName: '', country: '', email: '', dealValue: '', productInterest: '' });
  };

  const handleSendCampaign = () => {
    if (!campaignForm.name) {
      toast.error('Please enter a campaign name');
      return;
    }
    toast.success(`Campaign "${campaignForm.name}" launched! Reaching ${campaignForm.recipients} buyers.`);
    setShowCampaignModal(false);
    setCampaignForm({ name: '', category: 'Confectionery', targetCountry: 'United Arab Emirates', recipients: '500' });
  };

  const handleGenerateReport = () => {
    toast.success('Weekly report generated and downloaded!');
    setShowReportModal(false);
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
    setShowSettingsModal(false);
  };

  const handleGoLive = () => {
    setShowGoLiveModal(true);
  };

  const handleConfirmGoLive = () => {
    setShowGoLiveModal(false);
    toast.success(`Starting ${selectedSessionType} session!`);
    navigate('/live-deal-room');
  };

  const handleExpoRegister = () => {
    if (!selectedPackage) {
      toast.error('Please select a package');
      return;
    }
    const pkg = expoPackages.find(p => p.id === selectedPackage);
    toast.success(`Registered for ${pkg?.name} package! We'll contact you shortly.`);
    setExpoRegistered(true);
    setShowExpoModal(false);
    setSelectedPackage(null);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // ========== MY DAY ACTION HANDLERS ==========

  const handleReplyNow = () => {
    navigate('/crm?filter=waiting');
  };

  const [showConversationModal, setShowConversationModal] = useState(false);
  const [conversationTemplate, setConversationTemplate] = useState('');

  const handleStartConversation = () => {
    setConversationTemplate(`Hi team at ${myDayTasks.opportunity.company},

I noticed you've been reviewing our company profile on Brands Bridge AI.

We specialize in premium confectionery and snacks with exports across the GCC region.

Would you like me to send product samples or discuss a potential order?

Looking forward to hearing from you!

Best regards,
Golden Dates Export Team`);
    setShowConversationModal(true);
  };

  const handleSendConversation = () => {
    toast.success(`Message sent to ${myDayTasks.opportunity.company}!`);
    setShowConversationModal(false);
  };

  const handleViewDeals = () => {
    navigate('/crm?filter=cocoa');
  };

  const [showReminderModal, setShowReminderModal] = useState(false);

  const handleSendReminder = () => {
    setShowReminderModal(true);
  };

  const handleConfirmReminder = () => {
    toast.success(`Reminder sent to ${myDayTasks.readyToClose.deal} via WhatsApp & Email!`);
    setShowReminderModal(false);
  };

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, featureId: null },
    { id: 'profile-editor', label: 'My Public Profile', icon: Building2, path: '/supplier/profile-editor', featureId: 'profile_editor' },
    {
      id: 'crm', label: 'Sales CRM', icon: Users, featureId: 'crm_dashboard',
      children: [
        { id: 'pipeline', label: 'Pipeline', path: '/crm' },
        { id: 'leads', label: 'Leads', path: '/crm' },
        { id: 'companies', label: 'Companies', path: '/companies' },
      ]
    },
    {
      id: 'crb', label: 'CRB Hub (ERP)', icon: Package, featureId: 'crb_hub',
      children: [
        { id: 'inventory', label: 'Inventory', path: '/crb-hub' },
        { id: 'finance', label: 'Finance', path: '/crb-hub' },
        { id: 'export-docs', label: 'Export Docs', path: '/crb-hub' },
      ]
    },
    { id: 'live-deal-room', label: 'Live Deal Room', icon: Video, badge: 'LIVE', path: '/live-deal-room', featureId: 'live_deal_room' },
    {
      id: 'monthly-expo', label: 'Monthly Expo', icon: Calendar, featureId: null,
      badge: expoStatus === 'approved' ? 'APPROVED' : expoStatus === 'pending' ? 'PENDING' : undefined
    },
    {
      id: 'campaigns', label: 'Campaigns', icon: Megaphone, featureId: null,
      children: [
        { id: 'search-boost', label: 'Search Boost', path: '/dashboard' },
        { id: 'email-catalog', label: 'Email Catalog', path: '/dashboard' },
      ]
    },
    { id: 'logistics', label: 'Logistics', icon: Ship, path: '/logistics', featureId: 'logistics_hub', badge: '3PL' },
    { id: 'virtual-booth', label: 'Virtual Booth', icon: Video, path: '/supplier/booth', featureId: 'virtual_booth' },
    { id: 'settings', label: 'Settings', icon: Settings, featureId: null },
  ];

  const kpis = [
    { label: 'Total Pipeline Value', value: 838000, change: '+12.5%', icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Active Leads', value: '6', change: '+8 this week', icon: Target, color: 'text-blue-400' },
    { label: 'Avg Conversion Rate', value: '55%', change: '+5.2%', icon: TrendingUp, color: 'text-purple-400' },
    { label: 'AI Predicted Revenue', value: 460900, change: 'AI-powered', icon: Zap, color: 'text-amber-400', badge: 'AI' },
  ];

  const allTasks = [
    { id: 1, text: '3 hot leads need follow-up today', urgent: false, completed: false },
    { id: 2, text: 'Apple Juice stock running low — consider restocking', urgent: false, completed: false },
    { id: 3, text: 'Sugar prices dropped 2.8% — update pricing', urgent: false, completed: true },
    { id: 4, text: 'LIVE: 12 buyers searching for Confectionery', urgent: true, completed: false },
    { id: 5, text: 'Follow up with Gulf Trading Co.', urgent: false, completed: false },
    { id: 6, text: 'Review Q2 export documents', urgent: false, completed: false },
    { id: 7, text: 'Deal closing soon — do you need storage in Dubai?', urgent: true, type: 'storage', completed: false },
  ];

  // Find storage alert
  const storageAlert = {
    show: true,
    deal: 'Almarai Company',
    destination: 'Dubai',
    product: 'Chocolate products',
    quantity: '40 pallets'
  };

  const aiBriefings = showAllTasks || expandedTasks ? allTasks.map(t => ({
    icon: t.completed ? '✅' : (t.urgent ? '🔴' : '📋'),
    text: t.text,
    urgent: t.urgent
  })) : [
    { icon: '🎯', text: '3 hot leads need follow-up today', urgent: false },
    { icon: '📦', text: 'Apple Juice stock running low — consider restocking before winter demand', urgent: false },
    { icon: '💰', text: 'Sugar prices dropped 2.8% — update your pricing to stay competitive', urgent: false },
    { icon: '🔴', text: 'LIVE OPPORTUNITY: 12 buyers searching for Confectionery right now', urgent: true },
  ];

  const recentActivity = [
    { action: 'New lead from Gulf Trading Co.', time: '2 min ago', type: 'lead' },
    { action: 'Quote sent to Premium Foods Ltd', time: '15 min ago', type: 'quote' },
    { action: 'Contract signed with Almarai', time: '1 hour ago', type: 'deal' },
    { action: 'Shipment arrived at Dubai port', time: '3 hours ago', type: 'logistics' },
    { action: 'New review received (5 stars)', time: '5 hours ago', type: 'review' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-[#111827] border-r border-slate-800 flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-lg flex items-center justify-center">
                <Package2 className="w-4 h-4 text-[#0A0F1E]" />
              </div>
              <span className="font-bold text-white">Supplier Hub</span>
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
          {menuItems
            .filter(item => !item.featureId || isFeatureVisible(item.featureId, userRole, userEmail))
            .map((item) => (
            <div key={item.id}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.id as SubMenu)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      activeMenu === item.id ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left font-medium">{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedSubmenu === item.id ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                  {!collapsed && expandedSubmenu === item.id && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => {
                        // Determine the correct path for each submenu item
                        let navigatePath = child.path || '/';
                        if (item.id === 'crm') {
                          navigatePath = '/crm';
                        } else if (item.id === 'crb') {
                          navigatePath = '/crb-hub';
                        } else if (item.id === 'campaigns') {
                          navigatePath = '/dashboard';
                        }

                        return (
                          <button
                            key={child.id}
                            onClick={() => navigate(navigatePath)}
                            className="w-full text-left block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                          >
                            {child.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : item.id === 'settings' ? (
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    activeMenu === item.id ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="flex-1 font-medium">{item.label}</span>}
                </button>
              ) : (
                <Link
                  to={item.path || '#'}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    activeMenu === item.id ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-800 space-y-2">
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
                Logged in as {user?.email || 'supplier@demo.com'}
              </div>
            </div>
          )}
          {!collapsed && (
            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="text-xs text-slate-400 mb-1">Storage Used</div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-gradient-to-r from-[#D4AF37] to-amber-500 rounded-full" />
              </div>
              <div className="text-xs text-slate-500 mt-1">60% of 10GB</div>
            </div>
          )}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-[#0A0F1E]">{user?.name?.charAt(0) || 'S'}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user?.name || 'Supplier'}</div>
                <div className="text-xs text-slate-400">Supplier Account</div>
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
          <div className="text-sm font-medium text-white">Supplier Hub</div>

          {/* Right: Bell, User, Logout */}
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors relative">
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <span className="text-sm text-white font-medium">{user?.name || 'Supplier'}</span>
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
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-white">{user?.company || 'Golden Dates Co.'}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-400 text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> KYB Verified
                  </span>
                  <span className="text-xs text-slate-500">Member since 2024</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toast.success('Analytics coming soon!')}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Analytics
              </button>
              <button
                onClick={handleGoLive}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all animate-pulse flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                Go Live 🔴
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* MONTHLY EXPO TAB CONTENT */}
          {activeMenu === 'monthly-expo' && (
            <div className="space-y-6">
              {/* Expo Header */}
              <div className="bg-gradient-to-r from-[#D4AF37]/20 via-amber-500/10 to-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-6 h-6 text-[#D4AF37]" />
                      <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">Monthly Live Expo</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">May 29, 2025</h2>
                    <p className="text-slate-400">8:00 AM - 8:00 PM GST • Virtual Trade Exhibition</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {countdown.days}d {countdown.hours}h {countdown.minutes}m
                    </div>
                    <div className="text-slate-400 text-sm">until expo day</div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{upcomingExpo.registeredCompanies}</div>
                    <div className="text-slate-400 text-sm">Companies</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{upcomingExpo.totalRoomsBooked}</div>
                    <div className="text-slate-400 text-sm">Rooms Booked</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-400">{upcomingExpo.confirmedBuyers}+</div>
                    <div className="text-slate-400 text-sm">Buyers Waiting</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-amber-400">$3.2M</div>
                    <div className="text-slate-400 text-sm">Expected Deals</div>
                  </div>
                </div>
              </div>

              {/* NOT REGISTERED - Registration Wizard */}
              {expoStatus === 'not_registered' && (
                <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                  {/* Wizard Steps */}
                  <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                      {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            expoTabStep >= step
                              ? 'bg-[#D4AF37] text-black'
                              : 'bg-slate-700 text-slate-400'
                          }`}>
                            {expoTabStep > step ? <Check className="w-4 h-4" /> : step}
                          </div>
                          <span className={`ml-2 text-sm font-medium ${
                            expoTabStep >= step ? 'text-white' : 'text-slate-500'
                          }`}>
                            {step === 1 ? 'Package' : step === 2 ? 'Sellers' : step === 3 ? 'Profile' : 'Review'}
                          </span>
                          {step < 4 && <div className={`w-16 h-0.5 mx-4 ${
                            expoTabStep > step ? 'bg-[#D4AF37]' : 'bg-slate-700'
                          }`} />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* STEP 1: Choose Package */}
                    {expoTabStep === 1 && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">Choose Your Expo Package</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {expoPackages.map(pkg => (
                            <div
                              key={pkg.id}
                              onClick={() => setSelectedPackage(pkg.id)}
                              className={`relative cursor-pointer rounded-xl p-5 transition-all ${
                                selectedPackage === pkg.id
                                  ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]'
                                  : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
                              }`}
                            >
                              {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black text-xs font-bold rounded-full">
                                  POPULAR
                                </div>
                              )}
                              <div className="text-center mb-4">
                                <h4 className="text-lg font-bold text-white mb-1">{pkg.name}</h4>
                                <div className="text-3xl font-bold text-[#D4AF37]">${pkg.price}</div>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-300">
                                  <UsersRound className="w-4 h-4 text-slate-500" />
                                  <span>{pkg.sellers} Seller{pkg.sellers > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <DoorOpen className="w-4 h-4 text-slate-500" />
                                  <span>{pkg.rooms} Room{pkg.rooms > 1 ? 's' : ''}</span>
                                </div>
                              </div>
                              {selectedPackage === pkg.id && (
                                <div className="absolute top-3 right-3">
                                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-black" />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Add Sellers */}
                    {expoTabStep === 2 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">
                            Add Your Expo Sellers
                            <span className="text-slate-400 text-base font-normal ml-2">
                              (Max {selectedPackage ? expoPackages.find(p => p.id === selectedPackage)?.sellers : 1})
                            </span>
                          </h3>
                          <button
                            onClick={handleAddSeller}
                            disabled={expoSellers.length >= (selectedPackage ? expoPackages.find(p => p.id === selectedPackage)?.sellers || 1 : 1)}
                            className="px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <UserPlus className="w-4 h-4" />
                            Add Seller
                          </button>
                        </div>

                        <div className="space-y-4">
                          {expoSellers.map((seller, index) => (
                            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-white font-semibold">Seller #{index + 1}</h4>
                                <button
                                  onClick={() => handleRemoveSeller(index)}
                                  className="text-red-400 hover:text-red-300 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm text-slate-400 mb-2">Full Name *</label>
                                  <input
                                    type="text"
                                    value={seller.name}
                                    onChange={(e) => handleUpdateSeller(index, 'name', e.target.value)}
                                    placeholder="e.g., Mohammed Al Kuwari"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-slate-400 mb-2">Job Title *</label>
                                  <input
                                    type="text"
                                    value={seller.title}
                                    onChange={(e) => handleUpdateSeller(index, 'title', e.target.value)}
                                    placeholder="e.g., Export Manager"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-slate-400 mb-2">Email *</label>
                                  <input
                                    type="email"
                                    value={seller.email}
                                    onChange={(e) => handleUpdateSeller(index, 'email', e.target.value)}
                                    placeholder="mohammed@company.com"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-slate-400 mb-2">WhatsApp *</label>
                                  <input
                                    type="text"
                                    value={seller.whatsapp}
                                    onChange={(e) => handleUpdateSeller(index, 'whatsapp', e.target.value)}
                                    placeholder="+974 1234 5678"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                                  />
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm text-slate-400 mb-2">Languages</label>
                                <div className="flex flex-wrap gap-2">
                                  {['English', 'Arabic', 'French', 'Spanish', 'Chinese'].map(lang => (
                                    <button
                                      key={lang}
                                      onClick={() => {
                                        const langs = seller.languages.includes(lang)
                                          ? seller.languages.filter(l => l !== lang)
                                          : [...seller.languages, lang];
                                        handleUpdateSeller(index, 'languages', langs);
                                      }}
                                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        seller.languages.includes(lang)
                                          ? 'bg-[#D4AF37] text-black'
                                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                      }`}
                                    >
                                      {lang}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}

                          {expoSellers.length === 0 && (
                            <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                              <UserPlus className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                              <p className="text-slate-400">No sellers added yet. Click "Add Seller" to begin.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Company Expo Profile */}
                    {expoTabStep === 3 && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">Company Expo Profile</h3>
                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm text-slate-400 mb-2">Expo Headline (80 characters)</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={expoProfile.headline}
                                onChange={(e) => setExpoProfile({ ...expoProfile, headline: e.target.value.slice(0, 80) })}
                                placeholder="Describe what makes your company special..."
                                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                              />
                              <button
                                onClick={handleGenerateHeadline}
                                className="px-4 py-3 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-colors flex items-center gap-2"
                              >
                                <Sparkles className="w-4 h-4" />
                                AI Generate
                              </button>
                            </div>
                            <div className="text-right text-xs text-slate-500 mt-1">
                              {expoProfile.headline.length}/80
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-slate-400 mb-2">Products to Feature (select up to 3)</label>
                            <div className="flex flex-wrap gap-2">
                              {['FMCG', 'Dairy', 'Beverages', 'Confectionery', 'Snacks', 'Dates', 'Chocolate', 'Frozen Foods', 'Organic', 'Halal'].map(prod => (
                                <button
                                  key={prod}
                                  onClick={() => {
                                    const prods = expoProfile.products.includes(prod)
                                      ? expoProfile.products.filter(p => p !== prod)
                                      : expoProfile.products.length < 3
                                        ? [...expoProfile.products, prod]
                                        : expoProfile.products;
                                    setExpoProfile({ ...expoProfile, products: prods });
                                  }}
                                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                    expoProfile.products.includes(prod)
                                      ? 'bg-[#D4AF37] text-black'
                                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                  }`}
                                >
                                  {prod}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-slate-400 mb-2">Expo-Day Special Offer</label>
                            <div className="flex gap-3">
                              {[
                                { id: 'discount', label: 'Expo Discount', icon: '%' },
                                { id: 'sample', label: 'Free Sample', icon: '🎁' },
                                { id: 'bulk', label: 'Bulk Bonus', icon: '📦' }
                              ].map(offer => (
                                <button
                                  key={offer.id}
                                  onClick={() => setExpoProfile({ ...expoProfile, offer: offer.id as any })}
                                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                                    expoProfile.offer === offer.id
                                      ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37] text-white'
                                      : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600'
                                  }`}
                                >
                                  <span className="text-xl">{offer.icon}</span>
                                  <span className="block mt-1 text-sm">{offer.label}</span>
                                </button>
                              ))}
                            </div>
                            <div className="mt-3">
                              <label className="block text-sm text-slate-400 mb-2">Offer Value</label>
                              <input
                                type="text"
                                value={expoProfile.offerValue}
                                onChange={(e) => setExpoProfile({ ...expoProfile, offerValue: e.target.value })}
                                placeholder="e.g., 10% or 5kg free"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: Review & Submit */}
                    {expoTabStep === 4 && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">Review & Submit</h3>
                        <div className="space-y-4">
                          {/* Package Summary */}
                          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                            <h4 className="text-white font-semibold mb-3">Selected Package</h4>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-lg text-white font-medium">
                                  {selectedPackage ? expoPackages.find(p => p.id === selectedPackage)?.name : 'None selected'}
                                </p>
                                <p className="text-slate-400 text-sm">
                                  {expoSellers.length} seller(s) • {selectedPackage ? expoPackages.find(p => p.id === selectedPackage)?.rooms : 0} room(s)
                                </p>
                              </div>
                              <button
                                onClick={() => setExpoTabStep(1)}
                                className="text-[#D4AF37] hover:underline text-sm"
                              >
                                Change
                              </button>
                            </div>
                          </div>

                          {/* Sellers Summary */}
                          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                            <h4 className="text-white font-semibold mb-3">Your Expo Team</h4>
                            <div className="space-y-2">
                              {expoSellers.map((seller, index) => (
                                <div key={index} className="flex items-center gap-3 py-2 border-b border-slate-700 last:border-0">
                                  <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold text-sm">
                                    {seller.name?.charAt(0) || 'S'}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-white text-sm">{seller.name || 'Unnamed'}</p>
                                    <p className="text-slate-400 text-xs">{seller.title || 'No title'}</p>
                                  </div>
                                  <button
                                    onClick={() => setExpoTabStep(2)}
                                    className="text-slate-400 hover:text-white"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Profile Summary */}
                          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                            <h4 className="text-white font-semibold mb-3">Expo Profile</h4>
                            <div className="space-y-2">
                              <p className="text-slate-300 text-sm">
                                <span className="text-slate-500">Headline:</span> {expoProfile.headline || 'Not set'}
                              </p>
                              <p className="text-slate-300 text-sm">
                                <span className="text-slate-500">Products:</span> {expoProfile.products.join(', ') || 'None selected'}
                              </p>
                              <p className="text-slate-300 text-sm">
                                <span className="text-slate-500">Special Offer:</span> {expoProfile.offerValue} {expoProfile.offer === 'discount' ? '% off' : expoProfile.offer === 'sample' ? 'Free Sample' : 'Bulk Bonus'}
                              </p>
                            </div>
                            <button
                              onClick={() => setExpoTabStep(3)}
                              className="mt-3 text-[#D4AF37] hover:underline text-sm"
                            >
                              Edit Profile
                            </button>
                          </div>

                          {/* Terms */}
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                            <p className="text-amber-400 text-sm">
                              By submitting, you agree to the Expo Terms & Conditions. Payment of ${selectedPackage ? expoPackages.find(p => p.id === selectedPackage)?.price : 0} will be processed upon approval.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Wizard Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
                      <button
                        onClick={() => setExpoTabStep(Math.max(1, expoTabStep - 1))}
                        disabled={expoTabStep === 1}
                        className="px-6 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Back
                      </button>
                      {expoTabStep < 4 ? (
                        <button
                          onClick={() => setExpoTabStep(expoTabStep + 1)}
                          className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
                        >
                          Continue →
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitExpoRegistration}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
                        >
                          <Send className="w-5 h-5" />
                          Submit Application
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PENDING STATUS */}
              {expoStatus === 'pending' && (
                <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-amber-500/10 px-6 py-8 border-b border-amber-500/20 text-center">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Application Under Review</h3>
                    <p className="text-slate-400">We'll review your application within 24 hours</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 text-sm">Package</span>
                          <span className="text-white font-medium">
                            {selectedPackage ? expoPackages.find(p => p.id === selectedPackage)?.name : 'Team Package'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 text-sm">Sellers</span>
                          <span className="text-white font-medium">{expoSellers.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">Status</span>
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded">
                            PENDING REVIEW
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpoStatus('not_registered')}
                        className="w-full py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
                      >
                        Edit Application
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* APPROVED STATUS - Expo Dashboard */}
              {expoStatus === 'approved' && (
                <div className="space-y-6">
                  {/* Success Header */}
                  <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">You're In! May 29 Expo Confirmed</h3>
                        <p className="text-slate-400">Your rooms are ready. Prepare your team for expo day!</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="text-sm text-slate-400 mb-1">Expo starts in</div>
                      <div className="text-3xl font-bold text-white">
                        {countdown.days} days, {countdown.hours} hours, {countdown.minutes} minutes
                      </div>
                    </div>
                  </div>

                  {/* Your Rooms */}
                  <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">Your Expo Rooms</h3>
                      <button
                        onClick={() => navigate('/live-expo')}
                        className="px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-amber-500 transition-colors flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Preview Expo Hall
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      {mockExpoRooms.slice(0, 3).map((room, index) => (
                        <div key={room.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                room.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                                room.status === 'busy' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                <DoorOpen className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">{room.accessCode}</h4>
                                <p className="text-slate-400 text-sm">{room.sellerName} • {room.products.join(', ')}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-white font-medium">
                                  {room.waitingCount === 0 ? 'Available' : `${room.waitingCount} waiting`}
                                </div>
                                <div className="text-slate-400 text-xs">
                                  {room.totalMeetings} meetings • ${room.dealValue.toLocaleString()}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => navigate('/live-deal-room')}
                                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                                >
                                  Test Room
                                </button>
                                <button
                                  onClick={() => copyRoomCode(room.accessCode)}
                                  className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pre-Registered Buyers */}
                  <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700">
                      <h3 className="text-lg font-bold text-white">
                        Pre-Registered Buyers
                        <span className="ml-2 text-slate-400 font-normal text-sm">
                          ({preRegisteredBuyers.length} interested in your products)
                        </span>
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
                              <th className="pb-3 font-medium">Name</th>
                              <th className="pb-3 font-medium">Company</th>
                              <th className="pb-3 font-medium">Country</th>
                              <th className="pb-3 font-medium">Interest</th>
                              <th className="pb-3 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {preRegisteredBuyers.slice(0, 5).map((buyer) => (
                              <tr key={buyer.id} className="border-b border-slate-800 last:border-0">
                                <td className="py-3 text-white">{buyer.name}</td>
                                <td className="py-3 text-slate-300">{buyer.company}</td>
                                <td className="py-3 text-slate-300">{buyer.country}</td>
                                <td className="py-3 text-slate-300">{buyer.productInterests?.join(', ') || '-'}</td>
                                <td className="py-3">
                                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded">
                                    Confirmed
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Preparation Checklist */}
                  <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700">
                      <h3 className="text-lg font-bold text-white">Expo Preparation Checklist</h3>
                    </div>
                    <div className="p-6 space-y-3">
                      {[
                        { label: 'Update company profile', done: true },
                        { label: 'Add expo products', done: true },
                        { label: 'Set special offer', done: false },
                        { label: 'Brief sellers on platform', done: false },
                        { label: 'Test camera/microphone', done: false },
                        { label: 'Review buyer list', done: false }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                            item.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
                          }`}>
                            {item.done && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={item.done ? 'text-slate-400 line-through' : 'text-white'}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setExpoStatus('not_registered')}
                      className="flex-1 py-4 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-5 h-5" />
                      Edit Registration
                    </button>
                    <button
                      onClick={() => navigate('/live-expo')}
                      className="flex-1 py-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      Preview Your Booth
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Monthly Live Expo Banner (when not on expo tab) */}
          {activeMenu !== 'monthly-expo' && !expoRegistered && (
            <div className="relative bg-gradient-to-r from-[#D4AF37]/20 via-amber-500/10 to-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-2xl p-6 mb-6 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }} />
              </div>

              <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Left - Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">Monthly Live Expo</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Join the Next Virtual Trade Exhibition</h3>
                  <p className="text-slate-300 mb-4">Connect with {upcomingExpo.confirmedBuyers}+ pre-registered buyers. Last Thursday of every month, 8 AM - 8 PM GST.</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <UsersRound className="w-4 h-4 text-emerald-400" />
                      <span>{upcomingExpo.registeredCompanies} companies registered</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <DoorOpen className="w-4 h-4 text-blue-400" />
                      <span>{upcomingExpo.totalRoomsBooked} rooms booked</span>
                    </div>
                  </div>
                </div>

                {/* Right - Action */}
                <div className="flex flex-col items-start lg:items-end gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">May 29, 2025</div>
                    <div className="text-slate-400 text-sm">Registration deadline: May 25</div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowExpoModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
                    >
                      Register Now
                    </button>
                    <button
                      onClick={() => toast.success('View past expo results')}
                      className="px-4 py-3 bg-slate-800/50 text-white border border-slate-700 rounded-xl hover:bg-slate-700/50 transition-colors"
                    >
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Registered Banner (only show when not on expo tab) */}
          {expoRegistered && activeMenu !== 'monthly-expo' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">You're Registered for the Expo!</h4>
                  <p className="text-slate-400 text-sm">May 29, 2025 • We'll send you your room assignment soon</p>
                </div>
              </div>
              <button
                onClick={() => setActiveMenu('monthly-expo')}
                className="text-emerald-400 text-sm hover:text-emerald-300"
              >
                View Expo →
              </button>
            </div>
          )}

          {/* Dashboard Content (only when not on expo tab) */}
          {activeMenu !== 'monthly-expo' && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map((kpi, index) => (
              <div key={index} className="bg-[#111827] border border-slate-800 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center ${kpi.color}`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  {kpi.badge && (
                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded text-purple-400 text-xs font-medium">
                      {kpi.badge}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {typeof kpi.value === 'number' ? formatCurrency(kpi.value) : kpi.value}
                </div>
                <div className="text-sm text-slate-400">{kpi.label}</div>
                <div className="text-xs text-emerald-400 mt-2">{kpi.change}</div>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - AI Briefing (60%) */}
            <div className="lg:col-span-2 space-y-6">

              {/* ========== MY DAY MODULE ========== */}
              <div className="space-y-6">
                {/* My Day Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span className="text-2xl">☀️</span>
                      Good morning, {user?.name?.split(' ')[0] || 'Supplier'}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Here's what needs your attention today</p>
                  </div>
                  <div className="text-sm text-slate-500">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                </div>

                {/* My Day 4 Smart Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1 - URGENT: Red left border */}
                  <div
                    className="bg-[#111827] border border-slate-800 rounded-xl p-5 relative overflow-hidden cursor-pointer hover:border-red-500/50 transition-all"
                    style={{ borderLeft: '4px solid #EF4444' }}
                    onClick={handleReplyNow}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🔴</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded uppercase">Urgent</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">
                          {myDayTasks.urgent.count} buyers waiting for your response
                        </h3>
                        <p className="text-slate-400 text-sm mb-3">
                          Longest wait: {myDayTasks.urgent.waitTime} • Est. lost revenue: <span className="text-red-400 font-semibold">{myDayTasks.urgent.lostRevenue}</span>
                        </p>
                        <button onClick={(e) => { e.stopPropagation(); handleReplyNow(); }} className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-semibold rounded-lg hover:shadow-lg transition-all text-sm flex items-center gap-2">
                          {myDayTasks.urgent.action} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 - OPPORTUNITY: Gold left border */}
                  <div
                    className="bg-[#111827] border border-slate-800 rounded-xl p-5 relative overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all"
                    style={{ borderLeft: '4px solid #D4AF37' }}
                    onClick={handleStartConversation}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">⭐</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded uppercase">Opportunity</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">
                          {myDayTasks.opportunity.company} viewed your profile {myDayTasks.opportunity.views}x this week
                        </h3>
                        <p className="text-slate-400 text-sm mb-3">{myDayTasks.opportunity.message}</p>
                        <button onClick={(e) => { e.stopPropagation(); handleStartConversation(); }} className="px-4 py-2 bg-teal-500/20 border border-teal-500/40 text-teal-400 font-semibold rounded-lg hover:bg-teal-500/30 transition-all text-sm flex items-center gap-2">
                          {myDayTasks.opportunity.action} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 - AI INSIGHT: Teal left border */}
                  <div
                    className="bg-[#111827] border border-slate-800 rounded-xl p-5 relative overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-all"
                    style={{ borderLeft: '4px solid #06B6D4' }}
                    onClick={handleViewDeals}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded uppercase">AI Insight</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">{myDayTasks.insight.title}</h3>
                        <p className="text-slate-400 text-sm mb-3">
                          {myDayTasks.insight.deals} of your active deals include cocoa. You can improve margins by <span className="text-cyan-400 font-semibold">{myDayTasks.insight.savings}</span> if you renegotiate now.
                        </p>
                        <button onClick={(e) => { e.stopPropagation(); handleViewDeals(); }} className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-all text-sm flex items-center gap-2 border border-slate-600">
                          {myDayTasks.insight.action} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card 4 - READY TO CLOSE: Emerald left border */}
                  <div
                    className="bg-[#111827] border border-slate-800 rounded-xl p-5 relative overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all"
                    style={{ borderLeft: '4px solid #10B981' }}
                    onClick={handleSendReminder}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">💰</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded uppercase">Ready to Close</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">
                          {myDayTasks.readyToClose.deal} deal is ready to close
                        </h3>
                        <p className="text-slate-400 text-sm mb-3">
                          {myDayTasks.readyToClose.status} • Value: <span className="text-emerald-400 font-semibold">{myDayTasks.readyToClose.value}</span>
                        </p>
                        <button onClick={(e) => { e.stopPropagation(); handleSendReminder(); }} className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-semibold rounded-lg hover:shadow-lg transition-all text-sm flex items-center gap-2">
                          {myDayTasks.readyToClose.action} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========== WEEKLY PERFORMANCE MODULE ========== */}
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  📊 This Week at a Glance
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {/* Card 1 - Inquiries */}
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">{weeklyStats.inquiries.value}</div>
                    <div className="text-sm text-slate-400 mb-2">new inquiries</div>
                    <div className="flex items-center justify-center gap-1 text-emerald-400 text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      {weeklyStats.inquiries.change}
                    </div>
                  </div>
                  {/* Card 2 - Meetings */}
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">{weeklyStats.meetings.value}</div>
                    <div className="text-sm text-slate-400 mb-2">live deal sessions</div>
                    <div className="flex items-center justify-center gap-1 text-emerald-400 text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      {weeklyStats.meetings.change}
                    </div>
                  </div>
                  {/* Card 3 - Conversion */}
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center relative">
                    {weeklyStats.conversion.badge && (
                      <div className="absolute -top-2 right-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">
                        {weeklyStats.conversion.badge}
                      </div>
                    )}
                    <div className="text-3xl font-bold text-white mb-1">{weeklyStats.conversion.value}</div>
                    <div className="text-sm text-slate-400 mb-2">inquiry to deal</div>
                    <div className="text-emerald-400 text-sm font-medium">
                      {weeklyStats.conversion.change}
                    </div>
                  </div>
                  {/* Card 4 - Pipeline */}
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">{weeklyStats.pipeline.value}</div>
                    <div className="text-sm text-slate-400 mb-2">active deal value</div>
                    <div className="flex items-center justify-center gap-1 text-emerald-400 text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      {weeklyStats.pipeline.change}
                    </div>
                  </div>
                </div>
              </div>

              {/* ========== COMPETITIVE INTELLIGENCE MODULE ========== */}
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  👀 Competitor Activity
                </h3>
                <p className="text-sm text-slate-400 mb-4">See what similar companies are doing on the platform</p>
                <div className="space-y-3">
                  {competitorInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => toast.success(insight.action + ' clicked')}
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-white text-sm">{insight.text}</p>
                      </div>
                      <button className="text-[#D4AF37] text-sm font-medium hover:underline whitespace-nowrap">
                        {insight.action} →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Storage Alert */}
              {storageAlert.show && (
                <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 border-2 border-cyan-500/40 rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-cyan-500/30 text-cyan-300 text-xs font-semibold rounded uppercase">
                          Deal Closing Soon
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded">
                          AI Detected
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        Do you need storage in {storageAlert.destination}?
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">
                        Your deal with {storageAlert.deal} is closing. You have {storageAlert.quantity} of {storageAlert.product} heading to {storageAlert.destination}.
                        We found 3 verified 3PL companies with available space.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate('/companies?tab=shipping&subtab=3pl')}
                          className="px-4 py-2.5 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
                        >
                          <Package className="w-4 h-4" />
                          Find 3PL Storage
                        </button>
                        <button
                          onClick={() => toast('Reminder snoozed for 24 hours')}
                          className="px-4 py-2.5 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                        >
                          Not Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Briefing */}
              <div className="bg-[#111827] border-2 border-[#D4AF37]/30 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-amber-500/10 px-6 py-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-amber-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#0A0F1E]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Today's AI Briefing</h2>
                      <p className="text-sm text-slate-400">Generated just for you • 8:30 AM</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {aiBriefings.map((briefing, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-4 rounded-xl ${
                        briefing.urgent ? 'bg-red-500/10 border border-red-500/20' : 'bg-slate-800/50'
                      }`}
                    >
                      <span className="text-2xl">{briefing.icon}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{briefing.text}</p>
                        {briefing.urgent && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded">
                            Action Required
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setExpandedTasks(!expandedTasks)}
                    className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {expandedTasks ? 'Show Less ↑' : 'View All Tasks →'}
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'deal' ? 'bg-emerald-400' :
                        activity.type === 'lead' ? 'bg-blue-400' :
                        activity.type === 'quote' ? 'bg-amber-400' :
                        activity.type === 'logistics' ? 'bg-purple-400' : 'bg-slate-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-white">{activity.action}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Quick Actions & Live Deals */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAddLeadModal(true)}
                    className="w-full py-3 px-4 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center gap-3 font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Lead
                  </button>
                  <button
                    onClick={() => setShowCampaignModal(true)}
                    className="w-full py-3 px-4 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400 hover:bg-amber-500/30 transition-colors flex items-center gap-3 font-medium"
                  >
                    <Mail className="w-5 h-5" />
                    Send Catalog Campaign
                  </button>
                  <button
                    onClick={() => navigate('/live-deal-room')}
                    className="w-full py-3 px-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-3 font-medium"
                  >
                    <Play className="w-5 h-5" />
                    Start Live Session
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full py-3 px-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-3 font-medium"
                  >
                    <FileBarChart className="w-5 h-5" />
                    Generate Weekly Report
                  </button>
                  <button
                    onClick={() => {
                      navigate('/companies?tab=shipping&subtab=3pl');
                      toast.success('Finding cold storage for your shipments...');
                    }}
                    className="w-full py-3 px-4 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-500/30 transition-colors flex items-center gap-3 font-medium"
                  >
                    <Package className="w-5 h-5" />
                    Find Cold Storage
                  </button>
                </div>
              </div>

              {/* Live Now */}
              <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <h3 className="text-lg font-bold text-white">Live Deals</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm font-medium text-white">Gulf Trading Co. — Confectionery RFQ</div>
                    <div className="text-xs text-slate-400 mt-1">3 suppliers competing • $85K value</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">Negotiating</span>
                      <span className="text-xs text-slate-500">Ends in 2h 15m</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm font-medium text-white">Premium Foods Ltd — Dairy Products</div>
                    <div className="text-xs text-slate-400 mt-1">2 suppliers competing • $156K value</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">Qualifying</span>
                      <span className="text-xs text-slate-500">Ends in 5h 30m</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/live-deal-room')}
                  className="w-full mt-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  View All Live Deals
                </button>
              </div>

              {/* AI Sales Coach - Floating Card */}
              <div className="sticky top-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">AI Sales Coach</h3>
                    <p className="text-xs text-slate-400">Personalized tips based on your activity</p>
                  </div>
                </div>

                {/* Rotating Tip */}
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {aiCoachTips[currentTipIndex].text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mb-4">
                  {aiCoachTips.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTipIndex ? 'bg-purple-400 w-4' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => navigate(aiCoachTips[currentTipIndex].actionRoute)}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {aiCoachTips[currentTipIndex].action}
                </button>
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </main>

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add New Lead</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={leadForm.companyName}
                  onChange={(e) => setLeadForm({...leadForm, companyName: e.target.value})}
                  placeholder="Enter company name"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Country</label>
                <select
                  value={leadForm.country}
                  onChange={(e) => setLeadForm({...leadForm, country: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Email *</label>
                <input
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                  placeholder="contact@company.com"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Deal Value ($)</label>
                <input
                  type="number"
                  value={leadForm.dealValue}
                  onChange={(e) => setLeadForm({...leadForm, dealValue: e.target.value})}
                  placeholder="50000"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Product Interest</label>
                <input
                  type="text"
                  value={leadForm.productInterest}
                  onChange={(e) => setLeadForm({...leadForm, productInterest: e.target.value})}
                  placeholder="e.g. Dates, Confectionery"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button
                onClick={handleAddLead}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
              >
                Save Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">New Email Campaign</h3>
              <button onClick={() => setShowCampaignModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                  placeholder="e.g., Premium Dates Q2 Campaign"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Target Category</label>
                <select
                  value={campaignForm.category}
                  onChange={(e) => setCampaignForm({...campaignForm, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option>Chocolate</option>
                  <option>Dairy</option>
                  <option>Beverages</option>
                  <option>Snacks</option>
                  <option>Confectionery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Target Country</label>
                <select
                  value={campaignForm.targetCountry}
                  onChange={(e) => setCampaignForm({...campaignForm, targetCountry: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Recipients</label>
                <select
                  value={campaignForm.recipients}
                  onChange={(e) => setCampaignForm({...campaignForm, recipients: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="100">100 recipients</option>
                  <option value="500">500 recipients</option>
                  <option value="1000">1,000 recipients</option>
                  <option value="5000">5,000 recipients</option>
                </select>
              </div>
              <button
                onClick={handleSendCampaign}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Launch Campaign →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Weekly Performance Report</h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            {isGeneratingReport ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Generating your report...</p>
              </div>
            ) : (
              <>
                <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                  <div className="text-sm text-slate-400 mb-4">Week: March 25 - March 31, 2024</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-slate-700">
                      <span className="text-slate-300">New Leads</span>
                      <span className="text-white font-bold">8</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-700">
                      <span className="text-slate-300">Deals Closed</span>
                      <span className="text-emerald-400 font-bold">3</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-700">
                      <span className="text-slate-300">Revenue</span>
                      <span className="text-[#D4AF37] font-bold">$47,500</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-300">Top Market</span>
                      <span className="text-white font-bold">UAE</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => toast.success('PDF downloaded!')}
                    className="flex-1 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => toast.success('Report sent to your email!')}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    Email to Team
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Conversation Modal */}
      {showConversationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Send Message to {myDayTasks.opportunity.company}</h3>
              <button onClick={() => setShowConversationModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">To</label>
                <input
                  type="text"
                  value={`${myDayTasks.opportunity.company} Team`}
                  disabled
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Message</label>
                <textarea
                  value={conversationTemplate}
                  onChange={(e) => setConversationTemplate(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>
              <button
                onClick={handleSendConversation}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Send Reminder to {myDayTasks.readyToClose.deal}</h3>
              <button onClick={() => setShowReminderModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-400 font-medium">Deal Value: {myDayTasks.readyToClose.value}</span>
                </div>
                <p className="text-slate-300 text-sm">{myDayTasks.readyToClose.status}</p>
              </div>
              <p className="text-slate-400 text-sm">This will send a reminder via:</p>
              <div className="flex gap-3">
                <div className="flex-1 bg-slate-800 rounded-xl p-4 text-center">
                  <MessageSquare className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <span className="text-white text-sm font-medium">WhatsApp</span>
                </div>
                <div className="flex-1 bg-slate-800 rounded-xl p-4 text-center">
                  <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <span className="text-white text-sm font-medium">Email</span>
                </div>
              </div>
              <button
                onClick={handleConfirmReminder}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
              >
                Send Reminder Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Company Name</label>
                <input
                  type="text"
                  value={settingsForm.companyName}
                  onChange={(e) => setSettingsForm({...settingsForm, companyName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={settingsForm.contactEmail}
                  onChange={(e) => setSettingsForm({...settingsForm, contactEmail: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Language</label>
                <select
                  value={settingsForm.language}
                  onChange={(e) => setSettingsForm({...settingsForm, language: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option>English</option>
                  <option>Arabic</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-white">Email Notifications</span>
                <button
                  onClick={() => setSettingsForm({...settingsForm, notifications: !settingsForm.notifications})}
                  className={`w-12 h-6 rounded-full transition-colors ${settingsForm.notifications ? 'bg-[#D4AF37]' : 'bg-slate-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settingsForm.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <button
                onClick={handleSaveSettings}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Go Live Confirmation Modal */}
      {showGoLiveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Ready to Go Live?</h3>
              <button onClick={() => setShowGoLiveModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <p className="text-slate-300 text-sm mb-4">
                You will be visible to all buyers on the platform during your session. Make sure your camera and microphone are ready.
              </p>
              <div className="text-sm text-slate-400 mb-4">Select Session Type:</div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  onClick={() => setSelectedSessionType('video')}
                  className={`py-3 rounded-xl font-medium text-sm transition-all ${
                    selectedSessionType === 'video'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Video
                </button>
                <button
                  onClick={() => setSelectedSessionType('audio')}
                  className={`py-3 rounded-xl font-medium text-sm transition-all ${
                    selectedSessionType === 'audio'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Audio Only
                </button>
                <button
                  onClick={() => setSelectedSessionType('chat')}
                  className={`py-3 rounded-xl font-medium text-sm transition-all ${
                    selectedSessionType === 'chat'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Chat Only
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGoLiveModal(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGoLive}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                Start Live Session →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expo Registration Modal */}
      {showExpoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#D4AF37]/20 to-amber-500/10 px-6 py-5 border-b border-slate-700 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-sm font-semibold">Monthly Live Expo</span>
                </div>
                <h2 className="text-xl font-bold text-white">Choose Your Package</h2>
              </div>
              <button
                onClick={() => { setShowExpoModal(false); setSelectedPackage(null); }}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Event Info */}
              <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-white">May 29, 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-white">8:00 AM - 8:00 PM GST</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersRound className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">{upcomingExpo.confirmedBuyers}+ buyers waiting</span>
                  </div>
                </div>
              </div>

              {/* Packages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {expoPackages.map(pkg => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative cursor-pointer rounded-xl p-5 transition-all ${
                      selectedPackage === pkg.id
                        ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]'
                        : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black text-xs font-bold rounded-full">
                        MOST POPULAR
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
                      <div className="text-3xl font-bold text-[#D4AF37]">${pkg.price}</div>
                      <div className="text-slate-400 text-sm">per expo</div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <UsersRound className="w-4 h-4 text-slate-500" />
                        <span>{pkg.sellers} Export Seller{pkg.sellers > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <DoorOpen className="w-4 h-4 text-slate-500" />
                        <span>{pkg.rooms} Live Deal Room{pkg.rooms > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Target className="w-4 h-4 text-slate-500" />
                        <span>Up to {pkg.meetings} buyer meetings</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {pkg.features.slice(3).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {selectedPackage === pkg.id && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* What's Included */}
              <div className="bg-slate-800/50 rounded-xl p-5 mb-6">
                <h4 className="text-white font-semibold mb-3">What's Included for All Packages:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Video className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Live Video Meetings</p>
                      <p className="text-slate-400 text-xs">Face-to-face with verified buyers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UsersRound className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Buyer Matching</p>
                      <p className="text-slate-400 text-xs">AI-powered lead generation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Instant Payments</p>
                      <p className="text-slate-400 text-xs">Secure escrow transactions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  Need help choosing? <button onClick={() => toast.success('Contact sales@brandsbridge.ai')} className="text-[#D4AF37] hover:underline">Talk to our team</button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowExpoModal(false); setSelectedPackage(null); }}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExpoRegister}
                    disabled={!selectedPackage}
                    className={`px-6 py-3 font-bold rounded-xl transition-all ${
                      selectedPackage
                        ? 'bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black hover:shadow-lg hover:shadow-[#D4AF37]/30'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Register for ${selectedPackage ? expoPackages.find(p => p.id === selectedPackage)?.price : 0}
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

export default SupplierDashboard;
