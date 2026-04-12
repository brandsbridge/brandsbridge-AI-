import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Radio, FileText, Package, FolderOpen, Bot,
  Settings, ChevronLeft, ChevronRight, Search, Plus, Clock,
  DollarSign, Ship, TrendingDown, Sparkles, ChevronDown, MessageSquare,
  Loader2, X, Send, Eye, FileBarChart, Bell, LogOut, Home, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BuyerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('overview');
  const [aiQuery, setAiQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');

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
    { id: 'radar', label: 'Live Radar', icon: Radio, badge: 'LIVE', path: '/live-deal-room', desc: 'Real-time opportunities' },
    { id: 'rfqs', label: 'My RFQs', icon: FileText, path: '/procurement', desc: 'Request quotes' },
    { id: 'orders', label: 'My Orders', icon: Package, path: '/procurement', desc: 'Track shipments' },
    { id: 'documents', label: 'Documents', icon: FolderOpen, path: '/crb-hub', desc: 'Contracts & invoices' },
    { id: 'ai-agent', label: 'AI Sourcing Agent', icon: Bot, badge: 'AI', path: '/agents', desc: 'Smart sourcing' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', desc: 'Account preferences' },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  const kpis = [
    { label: 'Active RFQs', value: '4', icon: FileText, color: 'text-blue-400', change: '+2 this week' },
    { label: 'Total Spend (Q)', value: 116250, icon: DollarSign, color: 'text-emerald-400', change: '+18% vs last quarter' },
    { label: 'Cost Saved via AI', value: 12500, icon: TrendingDown, color: 'text-amber-400', change: 'AI optimization' },
    { label: 'Pending Shipments', value: '2', icon: Ship, color: 'text-purple-400', change: 'In transit' },
  ];

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

  const handleViewProfile = (supplierName: string) => {
    toast.success(`Viewing ${supplierName} profile...`);
    navigate('/companies');
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
            <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors relative">
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
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
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map((kpi, index) => (
              <div key={index} className="bg-[#111827] border border-slate-800 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center ${kpi.color}`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {typeof kpi.value === 'number' ? formatCurrency(kpi.value) : kpi.value}
                </div>
                <div className="text-sm text-slate-400">{kpi.label}</div>
                <div className="text-xs text-emerald-400 mt-2">{kpi.change}</div>
              </div>
            ))}
          </div>

          {/* AI Sourcing Assistant */}
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

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <button className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg font-medium">Place Bid</button>
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
          </div>
        </div>
      </main>

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
