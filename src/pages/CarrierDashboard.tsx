import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, Truck, Send, Bot,
  FileText, Settings, ChevronLeft, ChevronRight,
  Ship, MapPin, Clock, DollarSign, TrendingUp, AlertCircle, Package,
  Bell, LogOut, Home, Globe, X, Filter, Search, CheckCircle,
  MessageSquare, ArrowRight, Calendar, Package2, Anchor
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface FreightRequest {
  id: string;
  source: 'direct-buyer' | 'supplier-crm';
  company: string;
  cargoType: string;
  containerType: '20ft' | '40ft' | '40ft HC' | '20ft RF' | '40ft RF' | 'CBM (LCL)';
  origin: string;
  destination: string;
  targetDate: string;
  volume: string;
  estimatedValue: string;
  priority: 'urgent' | 'high' | 'normal';
  status: 'new' | 'quoted' | 'won' | 'lost';
  requestDate: string;
  buyerContact?: string;
  supplierContact?: string;
  notes?: string;
}

const CarrierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('freight-requests');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<FreightRequest | null>(null);
  const [filterSource, setFilterSource] = useState<'all' | 'direct-buyer' | 'supplier-crm'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    fobPrice: '',
    cifPrice: '',
    freightCost: '',
    transitDays: '',
    validUntil: '',
    notes: ''
  });

  // Sample Freight Requests Data
  const [freightRequests] = useState<FreightRequest[]>([
    {
      id: 'FR-2024-001',
      source: 'direct-buyer',
      company: 'Lulu Group International',
      cargoType: 'FMCG Products',
      containerType: '40ft HC',
      origin: 'Shanghai, China',
      destination: 'Dubai, UAE',
      targetDate: 'Dec 25, 2024',
      volume: '2 containers',
      estimatedValue: '$45,000',
      priority: 'high',
      status: 'new',
      requestDate: 'Dec 10, 2024',
      buyerContact: 'procurement@lulugroup.com',
      notes: 'Temperature controlled cargo'
    },
    {
      id: 'FR-2024-002',
      source: 'supplier-crm',
      company: 'OZMO Confectionery',
      cargoType: 'Chocolate & Wafers',
      containerType: '20ft RF',
      origin: 'Istanbul, Turkey',
      destination: 'Riyadh, Saudi Arabia',
      targetDate: 'Dec 28, 2024',
      volume: '1 container',
      estimatedValue: '$18,500',
      priority: 'normal',
      status: 'new',
      requestDate: 'Dec 11, 2024',
      supplierContact: 'export@ozmo.com.tr',
      notes: 'Halal certified'
    },
    {
      id: 'FR-2024-003',
      source: 'direct-buyer',
      company: 'Carrefour Middle East',
      cargoType: 'Dairy Products',
      containerType: '40ft RF',
      origin: 'Hamburg, Germany',
      destination: 'Jeddah, Saudi Arabia',
      targetDate: 'Dec 20, 2024',
      volume: '3 containers',
      estimatedValue: '$85,000',
      priority: 'urgent',
      status: 'new',
      requestDate: 'Dec 09, 2024',
      buyerContact: 'imports@carrefourme.com',
      notes: 'Urgent delivery required'
    },
    {
      id: 'FR-2024-004',
      source: 'supplier-crm',
      company: 'Baladna Food Industries',
      cargoType: 'Fresh Milk',
      containerType: '20ft RF',
      origin: 'Doha, Qatar',
      destination: 'Muscat, Oman',
      targetDate: 'Dec 22, 2024',
      volume: '1 container',
      estimatedValue: '$12,000',
      priority: 'high',
      status: 'quoted',
      requestDate: 'Dec 08, 2024',
      supplierContact: 'logistics@baladna.com.qa'
    },
    {
      id: 'FR-2024-005',
      source: 'direct-buyer',
      company: 'Spinneys Dubai',
      cargoType: 'Beverages',
      containerType: 'CBM (LCL)',
      origin: 'Rotterdam, Netherlands',
      destination: 'Dubai, UAE',
      targetDate: 'Jan 05, 2025',
      volume: '15 CBM',
      estimatedValue: '$8,500',
      priority: 'normal',
      status: 'new',
      requestDate: 'Dec 12, 2024',
      buyerContact: 'procurement@spinneys.ae'
    },
    {
      id: 'FR-2024-006',
      source: 'supplier-crm',
      company: 'Al Meera Consumer Goods',
      cargoType: 'Snacks & Confectionery',
      containerType: '40ft',
      origin: 'Mumbai, India',
      destination: 'Doha, Qatar',
      targetDate: 'Jan 10, 2025',
      volume: '2 containers',
      estimatedValue: '$32,000',
      priority: 'normal',
      status: 'new',
      requestDate: 'Dec 13, 2024',
      supplierContact: 'shipping@almeera.com.qa'
    }
  ]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/carrier' },
    { id: 'freight-requests', label: 'Freight Requests', icon: Inbox, badge: '6', path: '/carrier' },
    { id: 'quotes-submitted', label: 'Quotes Submitted', icon: Send, path: '/carrier' },
    { id: 'active-shipments', label: 'Active Shipments', icon: Truck, path: '/carrier' },
    { id: 'ai-optimizer', label: 'AI Route Optimizer', icon: Bot, badge: 'AI', path: '/carrier' },
    { id: 'documents', label: 'Documents', icon: FileText, path: '/carrier' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/carrier' },
  ];

  const kpis = [
    { label: 'New Requests', value: '6', icon: Inbox, color: 'text-blue-400', urgent: true },
    { label: 'Active Shipments', value: '12', icon: Truck, color: 'text-emerald-400' },
    { label: 'Monthly Revenue', value: '$285K', icon: DollarSign, color: 'text-slate-300' },
    { label: 'Win Rate', value: '78%', icon: TrendingUp, color: 'text-purple-400', badge: 'AI' },
  ];

  const filteredRequests = freightRequests.filter(req => {
    const matchesSource = filterSource === 'all' || req.source === filterSource;
    const matchesSearch = searchQuery === '' ||
      req.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400';
      case 'quoted': return 'bg-amber-500/20 text-amber-400';
      case 'won': return 'bg-emerald-500/20 text-emerald-400';
      case 'lost': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  const getSourceBadge = (source: string) => {
    if (source === 'direct-buyer') {
      return (
        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded border border-emerald-500/30">
          Direct Buyer Request
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-semibold rounded border border-purple-500/30">
        Supplier CRM Request
      </span>
    );
  };

  const handleSubmitQuote = (request: FreightRequest) => {
    setSelectedRequest(request);
    setShowQuoteModal(true);
  };

  const handleConfirmQuote = () => {
    if (!quoteForm.freightCost || !quoteForm.transitDays) {
      toast.error('Please fill in required fields');
      return;
    }
    toast.success('Quote submitted successfully!');
    setShowQuoteModal(false);
    setQuoteForm({ fobPrice: '', cifPrice: '', freightCost: '', transitDays: '', validUntil: '', notes: '' });
    setSelectedRequest(null);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1225] flex">
      {/* Sidebar - Navy Blue Theme */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-[#0F1729] border-r border-slate-700/50 flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center">
                <Anchor className="w-4 h-4 text-[#0B1225]" />
              </div>
              <span className="font-bold text-white">Carrier Hub</span>
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
                activeMenu === item.id ? 'bg-slate-600/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-700/50 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
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
            <div className="pt-2 border-t border-slate-700/50">
              <div className="text-xs text-slate-500 text-center">
                Logged in as {user?.email || 'carrier@demo.com'}
              </div>
            </div>
          )}
          {!collapsed && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-xs font-medium text-slate-300">Verified Carrier</span>
              </div>
              <div className="text-sm text-white font-medium">Maersk Line</div>
              <div className="text-xs text-slate-400">Global Shipping Partner</div>
            </div>
          )}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-[#0B1225]">{user?.name?.charAt(0) || 'C'}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user?.name || 'Carrier'}</div>
                <div className="text-xs text-slate-400">Shipping Account</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* Top Header */}
        <div className="h-12 bg-[#0B1225] border-b border-slate-700/50 flex items-center justify-between px-6">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-7 h-7 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#0B1225]" />
            </div>
            <span className="text-sm font-semibold text-white">Brands Bridge AI</span>
          </div>

          <div className="text-sm font-medium text-white">Carrier Hub</div>

          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors relative">
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <span className="text-sm text-white font-medium">{user?.name || 'Carrier'}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Freight Requests Inbox */}
          {activeMenu === 'freight-requests' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Freight Requests Inbox</h1>
                  <p className="text-slate-400 mt-1">Manage incoming quote requests from buyers and suppliers</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Export
                  </button>
                  <Link
                    to="/logistics"
                    className="px-5 py-2.5 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-slate-500/30 transition-all flex items-center gap-2"
                  >
                    <Ship className="w-5 h-5" />
                    View Public Profile
                  </Link>
                </div>
              </div>

              {/* Source Filter Tabs */}
              <div className="flex items-center gap-4 bg-slate-800/30 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setFilterSource('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    filterSource === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Requests
                </button>
                <button
                  onClick={() => setFilterSource('direct-buyer')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                    filterSource === 'direct-buyer' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Direct Buyer
                </button>
                <button
                  onClick={() => setFilterSource('supplier-crm')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                    filterSource === 'supplier-crm' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  Supplier CRM
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by company, route, or request ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                />
              </div>

              {/* Requests List */}
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all"
                  >
                    {/* Request Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center">
                          <Package2 className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono text-slate-500">{request.id}</span>
                            {getSourceBadge(request.source)}
                            <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getPriorityColor(request.priority)}`}>
                              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-white">{request.company}</h3>
                          <p className="text-sm text-slate-400">{request.cargoType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Cargo Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 p-4 bg-slate-900/50 rounded-xl">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Container Type</div>
                        <div className="text-sm font-medium text-white">{request.containerType}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Volume</div>
                        <div className="text-sm font-medium text-white">{request.volume}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Origin</div>
                        <div className="text-sm font-medium text-white flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {request.origin}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Destination</div>
                        <div className="text-sm font-medium text-white flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {request.destination}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Target Date</div>
                        <div className="text-sm font-medium text-white flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {request.targetDate}
                        </div>
                      </div>
                    </div>

                    {/* Request Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">
                          Requested: {request.requestDate}
                        </span>
                        {request.notes && (
                          <span className="text-sm text-slate-500 italic">
                            Note: {request.notes}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Contact
                        </button>
                        <button
                          onClick={() => handleSubmitQuote(request)}
                          className="px-5 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-slate-500/30 transition-all flex items-center gap-2"
                        >
                          Submit Quote
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredRequests.length === 0 && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Inbox className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No requests found</h3>
                  <p className="text-slate-400">
                    {filterSource !== 'all'
                      ? 'Try changing the filter or search criteria'
                      : 'New freight requests will appear here'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Overview (Default) */}
          {activeMenu === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0] || 'Captain'}</h1>
                <p className="text-slate-400 mt-1">6 new freight requests need your attention</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, index) => (
                  <div key={index} className={`bg-slate-800/50 border rounded-xl p-5 ${kpi.urgent ? 'border-blue-500/30' : 'border-slate-700/50'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center ${kpi.color}`}>
                        <kpi.icon className="w-5 h-5" />
                      </div>
                      {kpi.badge && (
                        <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs font-medium rounded">
                          {kpi.badge}
                        </span>
                      )}
                    </div>
                    <div className={`text-2xl font-bold ${kpi.urgent ? 'text-blue-400' : 'text-white'} mb-1`}>
                      {kpi.value}
                    </div>
                    <div className="text-sm text-slate-400">{kpi.label}</div>
                    {kpi.urgent && (
                      <div className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Action needed
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveMenu('freight-requests')}
                    className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl hover:border-slate-600/50 transition-all text-left"
                  >
                    <Inbox className="w-6 h-6 text-blue-400 mb-2" />
                    <div className="text-white font-medium">View All Requests</div>
                    <div className="text-sm text-slate-400">6 pending requests</div>
                  </button>
                  <button className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl hover:border-slate-600/50 transition-all text-left">
                    <Truck className="w-6 h-6 text-emerald-400 mb-2" />
                    <div className="text-white font-medium">Track Shipments</div>
                    <div className="text-sm text-slate-400">12 active shipments</div>
                  </button>
                  <button className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl hover:border-slate-600/50 transition-all text-left">
                    <Bot className="w-6 h-6 text-purple-400 mb-2" />
                    <div className="text-white font-medium">AI Route Optimizer</div>
                    <div className="text-sm text-slate-400">Optimize your routes</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Submit Quote Modal */}
      {showQuoteModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Submit Freight Quote</h3>
              <button onClick={() => setShowQuoteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Request Info */}
            <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Package2 className="w-8 h-8 text-slate-400" />
                <div>
                  <h4 className="text-white font-semibold">{selectedRequest.company}</h4>
                  <p className="text-sm text-slate-400">
                    {selectedRequest.containerType} • {selectedRequest.origin} → {selectedRequest.destination}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Est. Value: {selectedRequest.estimatedValue}</span>
                <span>•</span>
                <span>Target: {selectedRequest.targetDate}</span>
              </div>
              {getSourceBadge(selectedRequest.source)}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Freight Cost *</label>
                <input
                  type="number"
                  value={quoteForm.freightCost}
                  onChange={(e) => setQuoteForm({...quoteForm, freightCost: e.target.value})}
                  placeholder="2500"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Transit Time (days) *</label>
                <input
                  type="number"
                  value={quoteForm.transitDays}
                  onChange={(e) => setQuoteForm({...quoteForm, transitDays: e.target.value})}
                  placeholder="14"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Valid Until</label>
                <input
                  type="date"
                  value={quoteForm.validUntil}
                  onChange={(e) => setQuoteForm({...quoteForm, validUntil: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Additional Notes</label>
                <textarea
                  value={quoteForm.notes}
                  onChange={(e) => setQuoteForm({...quoteForm, notes: e.target.value})}
                  placeholder="Any special conditions or requirements..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 resize-none"
                />
              </div>
              <button
                onClick={handleConfirmQuote}
                className="w-full py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-slate-500/30 transition-all flex items-center justify-center gap-2"
              >
                Submit Quote
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarrierDashboard;
