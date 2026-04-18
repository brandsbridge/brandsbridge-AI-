import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGlobalTrade } from '../contexts/GlobalTradeContext';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Inbox, Truck, Package, Boxes, Thermometer,
  Warehouse, Quote, FileText, Settings, LogOut, BarChart3,
  Plus, Search, Eye, AlertTriangle, Send, X, CheckCircle,
  MapPin, Calendar, ChevronRight, Shield, Globe, Sparkles,
  Download, Bell, Clock, TrendingUp, Snowflake, Droplets, Sun,
  Building2, Award, FlaskConical, Lightbulb, ArrowLeft,
  Target, TrendingDown, DollarSign, Users, Activity, Zap,
  ArrowDownRight, RefreshCw, Percent, AlertCircle, CheckSquare,
  PackageCheck
} from 'lucide-react';
import {
  threePLInventory, threePLRequests, temperatureZones,
  palletListings, digitalReceipts, suggestedSuppliers,
  ThreePLInventory, ThreePLRequest, TemperatureZone, PalletListing, DigitalReceipt
} from '../data/mockData';

// Color Theme - Ice Blue / Slate
const colors = {
  bg: '#050B18',
  sidebar: '#070E1F',
  card: '#0C1628',
  primary: '#0369A1',
  accent: '#38BDF8',
  silver: '#94A3B8',
  border: '#1E3A5F',
  success: '#10B981',
  gold: '#D4AF37',
  warning: '#F59E0B',
  danger: '#EF4444'
};

type Section = 'overview' | 'inventory' | 'zones' | 'pallets' | 'requests' | 'quotes' | 'profile' | 'services' | 'certifications' | 'receipts' | 'analytics' | 'settings';

interface SidebarItem {
  id: Section;
  label: string;
  icon: React.ElementType;
  badge?: string;
  route?: string;
}

const ThreePLDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useGlobalTrade();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuoteModal, setShowQuoteModal] = useState<ThreePLRequest | null>(null);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [requestFilter, setRequestFilter] = useState<'all' | 'new' | 'quoted' | 'active'>('all');

  const sidebarSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'overview' as Section, label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'INVENTORY',
      items: [
        { id: 'inventory' as Section, label: 'Inventory Manager', icon: Boxes },
        { id: 'zones' as Section, label: 'Temperature Zones', icon: Thermometer },
        { id: 'pallets' as Section, label: 'Pallet Availability', icon: Package }
      ]
    },
    {
      title: 'BUSINESS',
      items: [
        { id: 'requests' as Section, label: 'Storage Requests', icon: Inbox, badge: '3' },
        { id: 'quotes' as Section, label: 'My Quotes', icon: Send },
        { id: 'analytics' as Section, label: 'Analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'PROFILE',
      items: [
        { id: 'profile' as Section, label: 'My Public Profile', icon: Globe, route: '/3pl/profile' },
        { id: 'suggested' as Section, label: 'Suggested Suppliers', icon: Lightbulb, badge: '3' }
      ]
    },
    {
      title: 'TOOLS',
      items: [
        { id: 'receipts' as Section, label: 'Digital Receipts', icon: FileText },
        { id: 'settings' as Section, label: 'Settings', icon: Settings }
      ]
    }
  ];

  // ========== ROI TRACKER DATA ==========
  const roiData = {
    totalEarnings: 47800,
    subscription: 299,
    roiMultiplier: 159,
    breakdown: [
      { label: 'Storage bookings', amount: 32400 },
      { label: 'Cross-dock services', amount: 8200 },
      { label: 'Last-mile delivery', amount: 7200 },
    ]
  };

  // ========== OPPORTUNITY RADAR DATA ==========
  const opportunities = [
    {
      id: 1,
      urgency: 'urgent',
      company: 'Baladna Food Industries',
      flag: '🇶🇦',
      needs: '200 pallets Chilled storage',
      duration: '45 days',
      location: 'Dubai',
      revenue: '$27,000',
      matchReasons: ['760 pallets available', 'Chilled zone active', 'Halal certified match']
    },
    {
      id: 2,
      urgency: 'upcoming',
      company: 'OZMO Confectionery',
      flag: '🇹🇷',
      needs: '80 pallets Ambient',
      duration: '30 days',
      location: 'Jebel Ali',
      revenue: '$7,200',
      matchReasons: ['Ambient zone available', '80 pallets capacity']
    },
    {
      id: 3,
      urgency: 'recurring',
      company: 'Gulf Foods LLC',
      flag: '🇸🇦',
      needs: 'Monthly shipments to UAE',
      duration: 'Recurring',
      location: 'Jeddah → Dubai',
      revenue: '$86,000/year',
      matchReasons: ['Monthly pattern detected', 'Long-term relationship']
    },
  ];

  // ========== CAPACITY ZONES DATA ==========
  const capacityZones = [
    { name: 'Zone A (Frozen)', fill: 47, available: 530, total: 1000, color: '#38BDF8' },
    { name: 'Zone B (Chilled)', fill: 30, available: 700, total: 1000, color: '#06B6D4' },
    { name: 'Zone C (Ambient)', fill: 49, available: 510, total: 1000, color: '#FBBF24' },
    { name: 'Zone D (Controlled)', fill: 98, available: 20, total: 1000, color: '#A855F7', warning: true },
  ];

  const capacityInsights = [
    {
      type: 'warning',
      zone: 'Zone D',
      problem: 'Near capacity. Losing $200/day by not accepting new controlled storage.',
      suggestion: 'Move 20 pallets from Ambient to Controlled',
      action: 'Review Move'
    },
    {
      type: 'opportunity',
      zone: 'Zone B',
      problem: 'Chilled zone is underutilized.',
      suggestion: 'Launch 20% discount to fill in 7 days',
      action: 'Launch Promotion'
    },
  ];

  // ========== PRICING COACH DATA ==========
  const pricingData = [
    {
      zone: 'Frozen',
      currentRate: 4.50,
      marketAverage: 4.20,
      position: 'Premium (+7%)',
      demand: 'HIGH',
      suggestion: 'Raise to $4.80 — add $4,500/month',
      color: '#38BDF8'
    },
    {
      zone: 'Chilled',
      currentRate: 3.20,
      marketAverage: 3.50,
      position: 'Below market (-9%)',
      demand: 'Normal',
      suggestion: 'Raise to $3.40 — add $1,800/month',
      color: '#06B6D4'
    },
  ];

  // ========== CLIENT HEALTH DATA ==========
  const clientHealth = [
    { id: 1, name: 'Baladna', flag: '🇶🇦', pallets: 120, revenue: 5400, status: 'healthy', lastStock: '2 days ago' },
    { id: 2, name: 'OZMO', flag: '🇹🇷', pallets: 200, revenue: 6000, status: 'healthy', lastStock: '5 days ago' },
    { id: 3, name: 'Gulf Foods', flag: '🇸🇦', pallets: 150, revenue: 6750, status: 'expiring', lastStock: '12 days ago' },
    { id: 4, name: 'Savola', flag: '🇸🇦', pallets: 95, revenue: 2900, status: 'critical', lastStock: '60 days ago' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ========== GLOBAL TRADE FLOW HANDLER ==========
  // When 3PL releases stock, notify the client
  const handleReleaseStock = (client: { id: number; name: string; pallets: number }) => {
    // Add notification to global context (this will appear in buyer's dashboard)
    addNotification({
      type: 'stock_released',
      title: 'Stock Released!',
      message: `${client.name} released ${client.pallets} pallets from storage. Ready for dispatch.`,
      dashboard: 'buyer',
      relatedId: `client-${client.id}`
    });

    toast.success(
      <div>
        <div className="font-semibold">Stock Released!</div>
        <div className="text-sm text-gray-300">{client.name} - {client.pallets} pallets</div>
        <div className="text-sm text-emerald-400 mt-1">Client has been notified</div>
      </div>,
      { duration: 5000 }
    );
  };

  // When 3PL dispatches shipment, notify the client
  const handleDispatchShipment = (client: { id: number; name: string; pallets: number }) => {
    addNotification({
      type: 'shipment_update',
      title: 'Shipment Dispatched!',
      message: `${client.pallets} pallets dispatched for ${client.name}. Track in real-time.`,
      dashboard: 'buyer',
      relatedId: `client-${client.id}`
    });

    toast.success(
      <div>
        <div className="font-semibold">Shipment Dispatched!</div>
        <div className="text-sm text-gray-300">{client.pallets} pallets for {client.name}</div>
        <div className="text-sm text-emerald-400 mt-1">Tracking info sent to client</div>
      </div>,
      { duration: 5000 }
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Stats
  const totalCapacity = temperatureZones.reduce((sum, z) => sum + z.capacity, 0);
  const usedCapacity = temperatureZones.reduce((sum, z) => sum + z.inUse, 0);
  const availablePallets = totalCapacity - usedCapacity;
  const pendingRequests = threePLRequests.filter(r => r.status === 'pending').length;
  const activeClients = [...new Set(threePLInventory.map(i => i.clientId))].length;

  const filteredInventory = threePLInventory.filter(inv => {
    const matchesZone = selectedZone === 'All Zones' || inv.zone === selectedZone;
    const matchesSearch = inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.product.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const filteredRequests = threePLRequests.filter(req => {
    if (requestFilter === 'new') return req.status === 'pending';
    if (requestFilter === 'quoted') return req.status === 'quoted';
    if (requestFilter === 'active') return req.status === 'accepted';
    return true;
  });

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'Frozen': return { bg: 'rgba(56,189,248,0.15)', border: '#38BDF8', icon: Snowflake };
      case 'Chilled': return { bg: 'rgba(6,182,212,0.15)', border: '#06B6D4', icon: Droplets };
      case 'Ambient': return { bg: 'rgba(251,191,36,0.15)', border: '#FBBF24', icon: Sun };
      case 'Controlled': return { bg: 'rgba(168,85,247,0.15)', border: '#A855F7', icon: FlaskConical };
      default: return { bg: 'rgba(148,163,184,0.15)', border: '#94A3B8', icon: Thermometer };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return { bg: 'rgba(16,185,129,0.15)', text: '#10B981', label: 'Active' };
      case 'expiring_soon': return { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B', label: 'Expiring Soon' };
      case 'pending': return { bg: 'rgba(56,189,248,0.15)', text: '#38BDF8', label: 'Pending' };
      case 'quoted': return { bg: 'rgba(168,85,247,0.15)', text: '#A855F7', label: 'Quoted' };
      case 'accepted': return { bg: 'rgba(16,185,129,0.15)', text: '#10B981', label: 'Accepted' };
      case 'declined': return { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', label: 'Declined' };
      default: return { bg: 'rgba(148,163,184,0.15)', text: '#94A3B8', label: status };
    }
  };

  // Render sections
  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            {getGreeting()}, {user?.name || 'Gulf Cold Chain Co.'}
          </h1>
          <p className="text-gray-400 mt-1">
            {pendingRequests > 0 ? `${pendingRequests} new storage requests need your attention` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"
            style={{ background: 'rgba(56,189,248,0.15)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.3)' }}>
            <Shield className="w-4 h-4" />
            KYB Verified 3PL
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl p-5 border" style={{ background: colors.card, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Total Pallets</span>
            <Package className="w-5 h-5" style={{ color: colors.accent }} />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{usedCapacity.toLocaleString()}</div>
          <div className="text-sm text-gray-400 mb-3">of {totalCapacity.toLocaleString()} capacity</div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: colors.border }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${(usedCapacity / totalCapacity) * 100}%`, background: colors.accent }} />
          </div>
        </div>

        <div className="rounded-xl p-5 border" style={{ background: colors.card, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Available Now</span>
            <Boxes className="w-5 h-5" style={{ color: colors.success }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: colors.success }}>{availablePallets.toLocaleString()}</div>
          <div className="text-sm text-gray-400 mt-2">pallets ready to book</div>
        </div>

        <div className="rounded-xl p-5 border" style={{ background: colors.card, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Active Clients</span>
            <Building2 className="w-5 h-5" style={{ color: colors.primary }} />
          </div>
          <div className="text-3xl font-bold text-white">{activeClients}</div>
          <div className="text-sm text-gray-400 mt-2">companies storing with you</div>
        </div>

        <div className="rounded-xl p-5 border" style={{ background: colors.card, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">This Month Revenue</span>
            <TrendingUp className="w-5 h-5" style={{ color: colors.gold }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: colors.gold }}>$28,400</div>
          <div className="text-sm flex items-center gap-1 mt-2" style={{ color: colors.success }}>
            <TrendingUp className="w-4 h-4" /> +18% vs last month
          </div>
        </div>

        <div className="rounded-xl p-5 border" style={{ background: colors.card, borderColor: pendingRequests > 0 ? colors.warning : colors.border }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Pending Requests</span>
            <Inbox className="w-5 h-5" style={{ color: pendingRequests > 0 ? colors.warning : colors.silver }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: pendingRequests > 0 ? colors.warning : 'white' }}>{pendingRequests}</div>
          <div className="text-sm text-gray-400 mt-2">need your response</div>
        </div>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Storage Requests */}
        <div className="rounded-xl border" style={{ background: colors.card, borderColor: colors.border }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
            <h2 className="text-lg font-semibold text-white">Recent Storage Requests</h2>
            <button onClick={() => setActiveSection('requests')} className="text-sm flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: colors.accent }}>
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {threePLRequests.slice(0, 3).map(req => {
              const statusBadge = getStatusBadge(req.status);
              return (
                <div key={req.id} className="p-4 rounded-lg border" style={{ background: colors.bg, borderColor: colors.border }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{req.fromFlag}</span>
                      <span className="font-medium text-white">{req.fromName}</span>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: statusBadge.bg, color: statusBadge.text }}>
                      {statusBadge.label}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    {req.pallets} pallets • {req.zone} • {req.tempRequired}
                  </div>
                  <div className="text-sm text-gray-500">
                    {req.product} • {req.durationDays} days
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggested Suppliers */}
        <div className="rounded-xl border" style={{ background: colors.card, borderColor: colors.border }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: colors.gold }} />
              Suppliers Who May Need You
            </h2>
            <button className="text-sm flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: colors.accent }}>
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {suggestedSuppliers.map(sup => (
              <div key={sup.id} className="p-4 rounded-lg border" style={{ background: colors.bg, borderColor: colors.border }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{sup.flag}</span>
                  <span className="font-medium text-white">{sup.name}</span>
                </div>
                <div className="text-sm text-gray-400 mb-1">{sup.product}</div>
                <div className="text-xs text-gray-500">{sup.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== OPPORTUNITY RADAR ========== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6" style={{ color: colors.warning }} />
            Opportunities Near You
          </h2>
          <button className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all hover:opacity-80"
            style={{ background: colors.border, color: colors.silver }}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className={`rounded-xl border p-5 ${
                opp.urgency === 'urgent'
                  ? 'border-red-500/30 bg-red-500/5'
                  : opp.urgency === 'upcoming'
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-emerald-500/30 bg-emerald-500/5'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{opp.flag}</span>
                  <span className="font-bold text-white">{opp.company}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  opp.urgency === 'urgent' ? 'bg-red-500/20 text-red-400' :
                  opp.urgency === 'upcoming' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {opp.urgency === 'urgent' ? '🔥 URGENT' : opp.urgency === 'upcoming' ? 'Starting 7d' : 'Recurring'}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-1 text-sm mb-3">
                <div className="text-gray-400">Needs: <span className="text-white">{opp.needs}</span></div>
                <div className="text-gray-400">Duration: <span className="text-white">{opp.duration}</span></div>
                <div className="text-gray-400">Location: <span className="text-white">{opp.location}</span></div>
                <div className="text-gray-400">Revenue: <span className="font-bold" style={{ color: colors.gold }}>{opp.revenue}</span></div>
              </div>

              {/* Why You */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">Why you:</div>
                {opp.matchReasons.map((reason, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckSquare className="w-3 h-3" /> {reason}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {opp.urgency === 'urgent' ? (
                  <button
                    onClick={() => toast.success(`Sending quote to ${opp.company}...`)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: colors.gold, color: colors.bg }}
                  >
                    <Send className="w-4 h-4" />
                    Send Quote Now
                  </button>
                ) : opp.urgency === 'recurring' ? (
                  <button
                    onClick={() => toast.success(`Setting up recurring deal with ${opp.company}...`)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'rgba(16,185,129,0.2)', color: colors.success }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Setup Recurring
                  </button>
                ) : (
                  <button
                    onClick={() => toast.success(`Quick quote for ${opp.company}...`)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'rgba(56,189,248,0.2)', color: colors.accent }}
                  >
                    <Zap className="w-4 h-4" />
                    Quick Quote
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== CAPACITY + PRICING (2 columns) ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity Optimizer */}
        <div className="rounded-xl border p-5" style={{ background: colors.card, borderColor: colors.border }}>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Warehouse className="w-5 h-5" style={{ color: colors.accent }} />
            Smart Capacity
          </h3>

          {/* Visual Zones */}
          <div className="space-y-3 mb-4">
            {capacityZones.map((zone, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">{zone.name}</span>
                  <span className={`text-sm font-medium ${zone.warning ? 'text-red-400' : 'text-white'}`}>
                    {zone.fill}% full {zone.warning && '⚠️'}
                  </span>
                </div>
                <div className="h-4 rounded-full overflow-hidden" style={{ background: colors.border }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${zone.fill}%`, background: zone.color }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{zone.available.toLocaleString()} pallets available</div>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          <div className="space-y-3">
            {capacityInsights.map((insight, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-3 border ${
                  insight.type === 'warning'
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-emerald-500/10 border-emerald-500/20'
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${insight.type === 'warning' ? 'text-red-400' : 'text-emerald-400'}`} />
                  <div>
                    <p className="text-sm text-white mb-1">{insight.zone}: {insight.problem}</p>
                    <p className="text-xs text-gray-400 mb-2">Suggestion: {insight.suggestion}</p>
                    <button
                      onClick={() => toast.success(`Opening ${insight.action}...`)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        insight.type === 'warning'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {insight.action} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligent Pricing */}
        <div className="rounded-xl border p-5" style={{ background: colors.card, borderColor: colors.border }}>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: colors.gold }} />
            Dynamic Pricing Coach
          </h3>

          <div className="space-y-4">
            {pricingData.map((pricing, idx) => (
              <div key={idx} className="rounded-lg p-4 border" style={{ borderColor: colors.border, background: colors.bg }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ background: pricing.color }}></div>
                    <span className="font-medium text-white">{pricing.zone}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    pricing.demand === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {pricing.demand}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">${pricing.currentRate}</div>
                    <div className="text-xs text-gray-500">Your rate</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-400">${pricing.marketAverage}</div>
                    <div className="text-xs text-gray-500">Market avg</div>
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${pricing.currentRate > pricing.marketAverage ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {pricing.position}
                    </div>
                    <div className="text-xs text-gray-500">Position</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded p-3 mb-3">
                  <p className="text-sm text-emerald-400">💡 {pricing.suggestion}</p>
                </div>

                <button
                  onClick={() => toast.success(`Opening pricing adjustment for ${pricing.zone}...`)}
                  className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'rgba(56,189,248,0.2)', color: colors.accent }}
                >
                  Adjust Pricing →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== CLIENT HEALTH MONITOR ========== */}
      <div className="rounded-xl border" style={{ background: colors.card, borderColor: colors.border }}>
        <div className="p-5 border-b" style={{ borderColor: colors.border }}>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: colors.accent }} />
            Your Clients
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: colors.bg }}>
              <tr className="text-left text-xs text-gray-400 uppercase">
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Revenue</th>
                <th className="px-5 py-3">Health</th>
                <th className="px-5 py-3">Last Stock</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: colors.border }}>
              {clientHealth.map((client) => (
                <tr key={client.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span>{client.flag}</span>
                      <span className="font-medium text-white">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-white">{client.pallets} pallets</td>
                  <td className="px-5 py-4">
                    <span className="text-white font-medium">${client.revenue.toLocaleString()}/mo</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${
                      client.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' :
                      client.status === 'expiring' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {client.status === 'healthy' ? '🟢' : client.status === 'expiring' ? '🟡' : '🔴'}
                      {client.status === 'healthy' ? 'Healthy' : client.status === 'expiring' ? 'Expiring' : 'Critical'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm">{client.lastStock}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReleaseStock(client)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                        style={{
                          background: 'rgba(16,185,129,0.2)',
                          color: colors.success
                        }}
                      >
                        <PackageCheck className="w-3 h-3" />
                        Release Stock
                      </button>
                      <button
                        onClick={() => {
                          if (client.status === 'critical') {
                            toast.success(`Reaching out to ${client.name} via WhatsApp...`);
                          } else {
                            toast.success(`Viewing ${client.name} details...`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: client.status === 'critical' ? 'rgba(239,68,68,0.2)' : 'rgba(56,189,248,0.2)',
                          color: client.status === 'critical' ? colors.danger : colors.accent
                        }}
                      >
                        {client.status === 'critical' ? 'Send WhatsApp →' : 'View'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Inventory Manager</h1>
        <p className="text-gray-400 mt-1">Track everything stored in your warehouse in real time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 border" style={{ background: colors.card, borderColor: colors.border }}>
          <div className="text-sm text-gray-400">Total SKUs</div>
          <div className="text-2xl font-bold text-white">{threePLInventory.length}</div>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: colors.card, borderColor: colors.border }}>
          <div className="text-sm text-gray-400">Pallets in Use</div>
          <div className="text-2xl font-bold" style={{ color: colors.accent }}>{usedCapacity}</div>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: colors.card, borderColor: colors.border }}>
          <div className="text-sm text-gray-400">Clients</div>
          <div className="text-2xl font-bold text-white">{activeClients}</div>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: colors.card, borderColor: colors.border }}>
          <div className="text-sm text-gray-400">Zones Active</div>
          <div className="text-2xl font-bold text-white">{temperatureZones.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {['All Zones', 'Frozen', 'Chilled', 'Ambient', 'Controlled'].map(zone => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: selectedZone === zone ? colors.accent : 'transparent',
                color: selectedZone === zone ? colors.bg : colors.silver,
                border: `1px solid ${selectedZone === zone ? colors.accent : colors.border}`
              }}
            >
              {zone}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search client or product..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none transition-all"
            style={{ background: colors.card, borderColor: colors.border, color: 'white' }}
          />
        </div>
        <button
          onClick={() => setShowAddInventory(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90"
          style={{ background: colors.accent, color: colors.bg }}
        >
          <Plus className="w-4 h-4" /> Add New Client Stock
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: colors.card, borderColor: colors.border }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: colors.sidebar }}>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Pallets</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Zone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Temp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Entry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Exit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(inv => {
                const zoneStyle = getZoneColor(inv.zone);
                const statusBadge = getStatusBadge(inv.status);
                return (
                  <tr key={inv.id} className="border-t" style={{ borderColor: colors.border }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>{inv.clientFlag}</span>
                        <span className="font-medium text-white">{inv.clientName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{inv.product}</td>
                    <td className="px-4 py-3 text-white font-medium">{inv.pallets}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: zoneStyle.bg, color: zoneStyle.border, border: `1px solid ${zoneStyle.border}` }}>
                        {inv.zone}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{inv.temperature}</td>
                    <td className="px-4 py-3 text-gray-400">{inv.entryDate}</td>
                    <td className="px-4 py-3 text-gray-400">{inv.exitDate}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: statusBadge.bg, color: statusBadge.text }}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="p-1.5 rounded hover:bg-white/10 transition-colors" title="View">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Alert">
                          <Bell className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Release">
                          <Package className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderZones = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Temperature Zone Management</h1>
        <p className="text-gray-400 mt-1">Monitor and manage your storage zones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {temperatureZones.map(zone => {
          const zoneStyle = getZoneColor(zone.type);
          const usagePercent = (zone.inUse / zone.capacity) * 100;
          const isWarning = usagePercent > 80 || zone.status === 'warning';

          return (
            <div key={zone.id} className="rounded-xl border p-6" style={{ background: colors.card, borderColor: isWarning ? colors.warning : colors.border }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: zoneStyle.bg }}>
                    {zone.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{zone.name}</h3>
                    <p className="text-sm text-gray-400">{zone.type}</p>
                  </div>
                </div>
                {zone.status === 'warning' && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{ background: 'rgba(245,158,11,0.15)', color: colors.warning }}>
                    <AlertTriangle className="w-3 h-3" /> Near Capacity
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Temperature Range</span>
                  <span className="text-white font-medium">{zone.tempRange}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Current</span>
                  <span className="text-lg font-bold" style={{ color: zoneStyle.border }}>{zone.currentTemp}</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Capacity</span>
                    <span className="text-white">{zone.inUse} / {zone.capacity} pallets</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: colors.border }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${usagePercent}%`,
                        background: isWarning ? colors.warning : zoneStyle.border
                      }}
                    />
                  </div>
                  <div className="text-xs text-right mt-1" style={{ color: isWarning ? colors.warning : colors.silver }}>
                    {usagePercent.toFixed(0)}% full
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-white/5" style={{ borderColor: colors.border, color: colors.silver }}>
                    Manage Zone
                  </button>
                  <button className="flex-1 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-white/5" style={{ borderColor: colors.border, color: colors.silver }}>
                    Set Alert
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPallets = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pallet Marketplace</h1>
        <p className="text-gray-400 mt-1">List your available space for suppliers to book directly</p>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">This is what suppliers see when they search for storage.</p>
        <button
          onClick={() => setShowAddListing(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90"
          style={{ background: colors.accent, color: colors.bg }}
        >
          <Plus className="w-4 h-4" /> Add New Listing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {palletListings.map(listing => {
          const zoneStyle = getZoneColor(listing.zoneType);
          return (
            <div key={listing.id} className="rounded-xl border p-6" style={{ background: colors.card, borderColor: colors.border }}>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: zoneStyle.bg, color: zoneStyle.border }}>
                  {listing.zoneType}
                </span>
                <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: 'rgba(16,185,129,0.15)', color: colors.success }}>
                  Active
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Available</span>
                  <span className="text-white font-bold">{listing.availablePallets} pallets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Per Day</span>
                  <span className="text-white font-bold">${listing.pricePerDay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Per Month</span>
                  <span className="text-white font-bold">${listing.pricePerMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Min Booking</span>
                  <span className="text-gray-300">{listing.minBooking} pallets</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {listing.certifications.map(cert => (
                  <span key={cert} className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(212,175,55,0.15)', color: colors.gold }}>
                    {cert}
                  </span>
                ))}
              </div>

              <div className="text-sm text-gray-400 mb-4">
                {listing.availableFrom} — {listing.availableUntil}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-white/5" style={{ borderColor: colors.border, color: colors.silver }}>
                  Edit
                </button>
                <button className="flex-1 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-white/5" style={{ borderColor: colors.border, color: colors.silver }}>
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Storage Requests</h1>
        <p className="text-gray-400 mt-1">Requests from suppliers and buyers needing warehouse space</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All', count: threePLRequests.length },
          { key: 'new', label: 'New', count: threePLRequests.filter(r => r.status === 'pending').length },
          { key: 'quoted', label: 'Quoted', count: threePLRequests.filter(r => r.status === 'quoted').length },
          { key: 'active', label: 'Active', count: threePLRequests.filter(r => r.status === 'accepted').length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setRequestFilter(tab.key as typeof requestFilter)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: requestFilter === tab.key ? colors.accent : 'transparent',
              color: requestFilter === tab.key ? colors.bg : colors.silver,
              border: `1px solid ${requestFilter === tab.key ? colors.accent : colors.border}`
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map(req => {
          const statusBadge = getStatusBadge(req.status);
          return (
            <div key={req.id} className="rounded-xl border p-6" style={{ background: colors.card, borderColor: colors.border }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm px-2 py-1 rounded" style={{ background: req.source === 'supplier' ? 'rgba(56,189,248,0.15)' : 'rgba(168,85,247,0.15)', color: req.source === 'supplier' ? colors.accent : '#A855F7' }}>
                    {req.source === 'supplier' ? '🏭 From Supplier' : '🛒 From Buyer'}
                  </span>
                </div>
                <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: statusBadge.bg, color: statusBadge.text }}>
                  {statusBadge.label}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{req.fromFlag}</span>
                <span className="font-bold text-white">{req.fromName}</span>
              </div>
              <div className="text-sm text-gray-500 mb-4 font-mono">{req.id}</div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Product</span>
                  <span className="text-white">{req.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quantity</span>
                  <span className="text-white">{req.pallets} pallets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Zone Needed</span>
                  <span className="text-white">{req.zone} ({req.tempRequired})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white">{req.durationDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Period</span>
                  <span className="text-white">{req.startDate} → {req.endDate}</span>
                </div>
                {req.linkedDeal && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Linked to</span>
                    <span className="text-white font-mono">{req.linkedDeal}</span>
                  </div>
                )}
                {req.specialRequirements && (
                  <div className="mt-2 p-2 rounded text-sm" style={{ background: 'rgba(212,175,55,0.1)', color: colors.gold }}>
                    Special: {req.specialRequirements}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {req.status === 'pending' && (
                  <>
                    <button
                      onClick={() => setShowQuoteModal(req)}
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                      style={{ background: colors.accent, color: colors.bg }}
                    >
                      Send Quote
                    </button>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-white/5" style={{ borderColor: colors.border, color: colors.silver }}>
                      Info
                    </button>
                  </>
                )}
                {req.status !== 'pending' && (
                  <button className="flex-1 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-white/5" style={{ borderColor: colors.border, color: colors.silver }}>
                    View Details
                  </button>
                )}
                {req.status === 'pending' && (
                  <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-white/5" style={{ borderColor: colors.danger, color: colors.danger }}>
                    Decline
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderQuotes = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Quotes</h1>
        <p className="text-gray-400 mt-1">Track your submitted storage quotes</p>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: colors.card, borderColor: colors.border }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: colors.sidebar }}>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Quote Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Sent Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t" style={{ borderColor: colors.border }}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span>🇦🇪</span>
                  <span className="text-white">Carrefour UAE</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-300">Frozen Seafood Mix</td>
              <td className="px-4 py-3 text-white font-medium">$12,400</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: 'rgba(168,85,247,0.15)', color: '#A855F7' }}>
                  Awaiting Response
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400">Jan 27, 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Public Profile</h1>
        <p className="text-gray-400 mt-1">Manage how your warehouse appears to suppliers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border p-6" style={{ background: colors.card, borderColor: colors.border }}>
            <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Company Name</label>
                <input type="text" defaultValue="Gulf Cold Chain Co." className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">City</label>
                  <input type="text" defaultValue="Dubai, UAE" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Country</label>
                  <input type="text" defaultValue="United Arab Emirates" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Address</label>
                <input type="text" defaultValue="Dubai Industrial City, Dubai, UAE" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-6" style={{ background: colors.card, borderColor: colors.border }}>
            <h3 className="text-lg font-semibold text-white mb-4">Storage Services</h3>
            <div className="space-y-3">
              {['Frozen Storage (-25°C to -15°C)', 'Chilled Storage (0°C to 8°C)', 'Ambient Storage (15°C to 25°C)', 'Controlled Temperature Storage'].map((service, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded" style={{ accentColor: colors.accent }} />
                  <span className="text-white">{service}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="px-6 py-3 rounded-lg font-medium transition-all hover:opacity-90" style={{ background: colors.accent, color: colors.bg }}>
            Save Changes
          </button>
        </div>

        {/* Live Preview */}
        <div className="rounded-xl border p-6" style={{ background: colors.card, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
          <div className="rounded-lg border p-4" style={{ background: colors.bg, borderColor: colors.border }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: colors.accent }}>
                <Warehouse className="w-6 h-6" style={{ color: colors.bg }} />
              </div>
              <div>
                <h4 className="font-bold text-white">Gulf Cold Chain Co.</h4>
                <p className="text-sm text-gray-400">🇦🇪 Dubai, UAE</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" style={{ color: colors.accent }} />
                <span className="text-gray-300">KYB Verified 3PL</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4" style={{ color: colors.accent }} />
                <span className="text-gray-300">2,000 pallets capacity</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Frozen', 'Chilled', 'Ambient'].map(zone => (
                <span key={zone} className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(56,189,248,0.15)', color: colors.accent }}>
                  {zone}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReceipts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Digital Receipts</h1>
          <p className="text-gray-400 mt-1">Proof of storage for every shipment — automatically generated</p>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90" style={{ background: colors.accent, color: colors.bg }}>
          <Plus className="w-4 h-4" /> Generate New Receipt
        </button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: colors.card, borderColor: colors.border }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: colors.sidebar }}>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Receipt #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Pallets</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {digitalReceipts.map(receipt => (
              <tr key={receipt.id} className="border-t" style={{ borderColor: colors.border }}>
                <td className="px-4 py-3 font-mono text-white">{receipt.id}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: receipt.receiptType === 'received' ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.15)', color: receipt.receiptType === 'received' ? colors.success : colors.accent }}>
                    {receipt.receiptType === 'received' ? '✅ Received' : '📤 Release'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>{receipt.clientFlag}</span>
                    <span className="text-white">{receipt.clientName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300">{receipt.product}</td>
                <td className="px-4 py-3 text-white font-medium">{receipt.pallets}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: 'rgba(16,185,129,0.15)', color: colors.success }}>
                    {receipt.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded hover:bg-white/10 transition-colors" title="View">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Download">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderServices = () => {
    const services = [
      { name: 'Ambient Storage', desc: '15°C – 25°C dry goods', price: '$12 / pallet / month', active: true },
      { name: 'Chilled Storage', desc: '2°C – 8°C dairy & produce', price: '$22 / pallet / month', active: true },
      { name: 'Frozen Storage', desc: '-20°C frozen goods', price: '$32 / pallet / month', active: true },
      { name: 'Cross-Docking', desc: 'Same-day in/out', price: '$8 / pallet', active: true },
      { name: 'Pick & Pack', desc: 'Order fulfillment', price: '$1.80 / order', active: false },
      { name: 'Last-Mile Delivery', desc: 'GCC distribution', price: 'Custom quote', active: false },
    ];
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Services Manager</h1>
            <p className="text-gray-400 mt-1">Configure your warehouse services and pricing</p>
          </div>
          <button onClick={() => toast.success('Opening new service form')} className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-slate-900 rounded-lg text-sm font-semibold">+ Add Service</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.name} className="rounded-xl border p-5" style={{ background: colors.card, borderColor: colors.border }}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-white">{s.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${s.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>{s.active ? 'Active' : 'Inactive'}</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">{s.desc}</p>
              <div className="text-amber-400 font-semibold text-sm mb-3">{s.price}</div>
              <div className="flex gap-2">
                <button onClick={() => toast.success(`${s.name} settings opened`)} className="flex-1 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded text-xs">Edit</button>
                <button onClick={() => toast.success(`${s.name} toggled`)} className="flex-1 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded text-xs">{s.active ? 'Pause' : 'Enable'}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Certifications</h1>
        <p className="text-gray-400 mt-1">Manage your warehouse certifications and compliance</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['ISO 22000', 'Halal', 'Temperature Log'].map((cert, i) => (
          <div key={i} className="rounded-xl border p-6 text-center" style={{ background: colors.card, borderColor: colors.border }}>
            <Award className="w-10 h-10 mx-auto mb-3" style={{ color: colors.gold }} />
            <h3 className="font-bold text-white">{cert}</h3>
            <p className="text-sm text-gray-400 mt-1">Verified</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => {
    const kpis = [
      { label: 'Monthly Revenue', value: '$47.8K', trend: '+12%' },
      { label: 'Occupancy Rate', value: '84%', trend: '+6%' },
      { label: 'Client Retention', value: '92%', trend: '+2%' },
      { label: 'Pallets Stored', value: '2,148', trend: '+108' },
    ];
    const monthly = [
      { m: 'Nov', v: 32 }, { m: 'Dec', v: 38 }, { m: 'Jan', v: 41 },
      { m: 'Feb', v: 44 }, { m: 'Mar', v: 46 }, { m: 'Apr', v: 48 },
    ];
    const max = Math.max(...monthly.map((m) => m.v));
    const topProducts = [
      { name: 'UHT Milk 1L', pallets: 412, client: 'Baladna' },
      { name: 'Frozen Chicken', pallets: 288, client: 'Americana' },
      { name: 'Yogurt 500g', pallets: 214, client: 'Almarai' },
      { name: 'Sunflower Oil', pallets: 182, client: 'Savola' },
      { name: 'Fresh Dates', pallets: 146, client: 'Al Ain Farms' },
    ];
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Monthly revenue, occupancy trends, top products stored</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border p-4" style={{ background: colors.card, borderColor: colors.border }}>
              <div className="text-gray-400 text-xs mb-1">{k.label}</div>
              <div className="text-2xl font-bold text-white">{k.value}</div>
              <div className="text-emerald-400 text-xs mt-1">{k.trend}</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border p-5" style={{ background: colors.card, borderColor: colors.border }}>
          <h3 className="text-white font-semibold mb-4">Revenue Trend (last 6 months)</h3>
          <div className="flex items-end gap-4 h-40">
            {monthly.map((m) => (
              <div key={m.m} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-[#D4AF37] to-amber-300 rounded-t" style={{ height: `${(m.v / max) * 100}%` }} />
                <div className="text-xs text-gray-400">{m.m}</div>
                <div className="text-xs text-white font-semibold">${m.v}K</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: colors.card, borderColor: colors.border }}>
          <h3 className="text-white font-semibold mb-4">Top Products Stored</h3>
          <div className="divide-y divide-slate-700/50">
            {topProducts.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-white text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">Client: {p.client}</div>
                </div>
                <div className="text-amber-400 font-semibold text-sm">{p.pallets} pallets</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Warehouse info, team members, billing, notifications</p>
      </div>
      <div className="rounded-xl border p-5 space-y-4" style={{ background: colors.card, borderColor: colors.border }}>
        <h3 className="text-white font-semibold">Warehouse Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Warehouse Name</label>
            <input defaultValue="Gulf Cold Chain Co." className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Location</label>
            <input defaultValue="Jebel Ali Free Zone, Dubai" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Total Capacity (pallets)</label>
            <input defaultValue="2,500" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Operating Hours</label>
            <input defaultValue="24/7" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm" />
          </div>
        </div>
      </div>
      <div className="rounded-xl border p-5" style={{ background: colors.card, borderColor: colors.border }}>
        <h3 className="text-white font-semibold mb-3">Team Members</h3>
        <div className="space-y-2">
          {[
            { name: 'Warehouse Ops Lead', email: 'ops@gulfcoldchain.com', role: 'Admin' },
            { name: 'Night Shift Manager', email: 'night@gulfcoldchain.com', role: 'Operator' },
            { name: 'Billing', email: 'billing@gulfcoldchain.com', role: 'Finance' },
          ].map((m) => (
            <div key={m.email} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0 text-sm">
              <div>
                <span className="text-white">{m.name}</span>
                <span className="text-gray-500 ml-2">· {m.email} · {m.role}</span>
              </div>
              <button onClick={() => toast.success('Member removed')} className="text-red-400 hover:text-red-300">Remove</button>
            </div>
          ))}
        </div>
        <button onClick={() => toast.success('Invite sent')} className="mt-3 text-sm text-amber-400 hover:text-amber-300">+ Invite Team Member</button>
      </div>
      <div className="rounded-xl border p-5 space-y-3" style={{ background: colors.card, borderColor: colors.border }}>
        <h3 className="text-white font-semibold">Billing</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Current Plan</span>
          <span className="text-amber-400 font-semibold">Enterprise Warehouse · $499/mo</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Next Invoice</span>
          <span className="text-white">May 01, 2026</span>
        </div>
        <button onClick={() => toast.success('Opening billing portal')} className="text-sm text-amber-400 hover:text-amber-300">Manage Billing</button>
      </div>
      <div className="rounded-xl border p-5 space-y-3" style={{ background: colors.card, borderColor: colors.border }}>
        <h3 className="text-white font-semibold">Notification Preferences</h3>
        {['New storage requests', 'Temperature excursions', 'Low capacity alerts', 'Weekly digest'].map((n) => (
          <label key={n} className="flex items-center gap-3 text-sm text-gray-300">
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-500" />
            {n}
          </label>
        ))}
      </div>
      <div className="flex justify-end">
        <button onClick={() => toast.success('Settings saved')} className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-slate-900 rounded-lg font-semibold text-sm">Save Settings</button>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'inventory': return renderInventory();
      case 'zones': return renderZones();
      case 'pallets': return renderPallets();
      case 'requests': return renderRequests();
      case 'quotes': return renderQuotes();
      case 'profile': return renderProfile();
      case 'receipts': return renderReceipts();
      case 'services': return renderServices();
      case 'certifications': return renderCertifications();
      case 'analytics': return renderAnalytics();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: colors.bg }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r h-screen sticky top-0 overflow-y-auto" style={{ background: colors.sidebar, borderColor: colors.border }}>
        {/* Logo */}
        <div className="p-5 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.accent }}>
              <Warehouse className="w-5 h-5" style={{ color: colors.bg }} />
            </div>
            <div>
              <div className="font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>Warehouse OS</div>
              <div className="text-sm text-gray-400">{user?.name || 'Gulf Cold Chain Co.'}</div>
            </div>
          </div>
          <div className="mt-3">
            <span className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit" style={{ background: 'rgba(56,189,248,0.15)', color: colors.accent, border: '1px solid rgba(56,189,248,0.3)' }}>
              <Shield className="w-3 h-3" /> KYB Verified 3PL
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6">
          {sidebarSections.map((section, idx) => (
            <div key={idx}>
              <div className="text-xs font-medium text-gray-500 uppercase mb-2 px-3">{section.title}</div>
              <div className="space-y-1">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.route) {
                          navigate(item.route);
                        } else {
                          setActiveSection(item.id);
                        }
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: isActive ? 'rgba(56,189,248,0.08)' : 'transparent',
                        color: isActive ? colors.accent : colors.silver,
                        borderLeft: isActive ? `3px solid ${colors.accent}` : '3px solid transparent'
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: colors.accent, color: colors.bg }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-1" style={{ borderColor: colors.border }}>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 transition-all">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="p-6 lg:p-8">
          {renderSection()}
        </div>
      </main>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-xl border" style={{ background: colors.card, borderColor: colors.border }}>
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
              <h3 className="text-lg font-bold text-white">Send Quote to {showQuoteModal.fromName}</h3>
              <button onClick={() => setShowQuoteModal(null)} className="p-1 rounded hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-4 rounded-lg" style={{ background: colors.bg }}>
                <div className="text-sm text-gray-400 mb-2">Request Details</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Product: <span className="text-white">{showQuoteModal.product}</span></div>
                  <div>Pallets: <span className="text-white">{showQuoteModal.pallets}</span></div>
                  <div>Zone: <span className="text-white">{showQuoteModal.zone}</span></div>
                  <div>Duration: <span className="text-white">{showQuoteModal.durationDays} days</span></div>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Price per pallet per day ($)</label>
                <input type="number" placeholder="0.00" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Handling fee ($)</label>
                <input type="number" placeholder="0.00" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Payment terms</label>
                <select className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}>
                  <option>50% advance, 50% on delivery</option>
                  <option>30% advance, 70% on delivery</option>
                  <option>Full payment in advance</option>
                  <option>Net 30</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Special conditions</label>
                <textarea placeholder="Any additional terms..." rows={3} className="w-full px-4 py-2 rounded-lg border outline-none resize-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
              </div>
            </div>
            <div className="p-5 border-t flex gap-3" style={{ borderColor: colors.border }}>
              <button onClick={() => setShowQuoteModal(null)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-white/5" style={{ borderColor: colors.border, color: colors.silver }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Quote sent successfully!');
                  setShowQuoteModal(null);
                }}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: colors.accent, color: colors.bg }}
              >
                <Send className="w-4 h-4" /> Send Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Inventory Modal */}
      {showAddInventory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-xl border" style={{ background: colors.card, borderColor: colors.border }}>
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
              <h3 className="text-lg font-bold text-white">Add New Client Stock</h3>
              <button onClick={() => setShowAddInventory(false)} className="p-1 rounded hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Client Name</label>
                <input type="text" placeholder="Enter client name" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Product Name</label>
                <input type="text" placeholder="Enter product name" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Number of Pallets</label>
                  <input type="number" placeholder="0" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Zone</label>
                  <select className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}>
                    <option>Frozen</option>
                    <option>Chilled</option>
                    <option>Ambient</option>
                    <option>Controlled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Entry Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Expected Exit Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
                </div>
              </div>
            </div>
            <div className="p-5 border-t flex gap-3" style={{ borderColor: colors.border }}>
              <button onClick={() => setShowAddInventory(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-white/5" style={{ borderColor: colors.border, color: colors.silver }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Stock added successfully!');
                  setShowAddInventory(false);
                }}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                style={{ background: colors.accent, color: colors.bg }}
              >
                Save to Inventory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Listing Modal */}
      {showAddListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-xl border" style={{ background: colors.card, borderColor: colors.border }}>
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
              <h3 className="text-lg font-bold text-white">Add New Availability Listing</h3>
              <button onClick={() => setShowAddListing(false)} className="p-1 rounded hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Zone</label>
                  <select className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}>
                    <option>Frozen</option>
                    <option>Chilled</option>
                    <option>Ambient</option>
                    <option>Controlled</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Available Pallets</label>
                  <input type="number" placeholder="0" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Price per Day ($)</label>
                  <input type="number" placeholder="0.00" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Price per Month ($)</label>
                  <input type="number" placeholder="0.00" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Available From</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Available Until</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Minimum Booking (pallets)</label>
                <input type="number" placeholder="0" className="w-full px-4 py-2 rounded-lg border outline-none" style={{ background: colors.bg, borderColor: colors.border, color: 'white' }} />
              </div>
            </div>
            <div className="p-5 border-t flex gap-3" style={{ borderColor: colors.border }}>
              <button onClick={() => setShowAddListing(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-white/5" style={{ borderColor: colors.border, color: colors.silver }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Listing published successfully!');
                  setShowAddListing(false);
                }}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                style={{ background: colors.accent, color: colors.bg }}
              >
                Publish Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreePLDashboard;
