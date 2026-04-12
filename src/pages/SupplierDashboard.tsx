import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, PieChart, Package, FileText, Video,
  Megaphone, Ship, Settings, ChevronLeft, ChevronRight, TrendingUp,
  Zap, Plus, Mail, Play, FileBarChart, AlertCircle, Package2,
  DollarSign, Target, Clock, Activity, ChevronDown, Menu, X,
  Loader2, Globe, Bell, LogOut, Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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

  const toggleSubmenu = (sub: SubMenu) => {
    setExpandedSubmenu(expandedSubmenu === sub ? null : sub);
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

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'crm', label: 'Sales CRM', icon: Users,
      children: [
        { id: 'pipeline', label: 'Pipeline', path: '/crm' },
        { id: 'leads', label: 'Leads', path: '/crm' },
        { id: 'companies', label: 'Companies', path: '/companies' },
      ]
    },
    {
      id: 'crb', label: 'CRB Hub (ERP)', icon: Package,
      children: [
        { id: 'inventory', label: 'Inventory', path: '/crb-hub' },
        { id: 'finance', label: 'Finance', path: '/crb-hub' },
        { id: 'export-docs', label: 'Export Docs', path: '/crb-hub' },
      ]
    },
    { id: 'live-deal-room', label: 'Live Deal Room', icon: Video, badge: 'LIVE', path: '/live-deal-room' },
    {
      id: 'campaigns', label: 'Campaigns', icon: Megaphone,
      children: [
        { id: 'search-boost', label: 'Search Boost', path: '/dashboard' },
        { id: 'email-catalog', label: 'Email Catalog', path: '/dashboard' },
      ]
    },
    { id: 'logistics', label: 'Logistics', icon: Ship, path: '/logistics' },
    { id: 'settings', label: 'Settings', icon: Settings },
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
  ];

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
          {menuItems.map((item) => (
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

            {/* Right - Quick Actions (40%) */}
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
            </div>
          </div>
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
            <button
              onClick={handleGenerateReport}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
            >
              <FileBarChart className="w-5 h-5" />
              Download PDF Report
            </button>
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
    </div>
  );
};

export default SupplierDashboard;
