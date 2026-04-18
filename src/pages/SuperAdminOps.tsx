import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Users, DollarSign, Server, Video, Clock, Eye, XCircle,
  CheckCircle2, AlertTriangle, Calendar, ChevronRight, ChevronLeft,
  Zap, TrendingUp, TrendingDown, Signal, RefreshCw, Building2, Flag,
  Play, Pause, Ban, Bell, Sparkles, BarChart3, Globe, Shield, Radio,
  X, Loader2, LogOut, Home, Upload, Search, Filter, Plus, Trash2,
  Edit, Mail, Send, Download, Settings, EyeOff, Check, AlertCircle,
  Package, TrendingDownIcon, Megaphone, Ship, CreditCard, FileText,
  PieChart, MessageSquare, Image, Cpu, Database, HardDrive, Wifi,
  WifiOff, CheckCircle, XCircle as XCircleSolid, ArrowRight, ArrowDown, ShoppingCart, Rocket, UserPlus, CheckSquare,
  DoorOpen, Save, Heart, TrendingUpIcon, UsersRound, DollarSignIcon, ActivityIcon, CheckCircle2Icon, AlertTriangleIcon, Target, ArrowDownRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { companies, walkinBuyers, preRegisteredBuyers } from '../data/mockData';
import { FEATURE_FLAGS, LAUNCH_EVENTS, isFeatureVisible, updateFeatureStatus, type Feature, type FeatureStatus, type LaunchEvent } from '../data/featureFlags';
import { expoApplications, expoHistory, shippingExpoApplications, upcomingExpo, expoPackages, formatExpoDate, availableRoutes, containerTypes, ExpoApplication, ShippingExpoApplication } from '../data/expoData';
import toast from 'react-hot-toast';

// ============================================
// TYPES
// ============================================

type SidebarSection = 'overview' | 'companies' | 'upload' | 'unclaimed' | 'verified' | 'profiles' |
  'buyers' | 'suppliers' | 'shipping' | 'all-users' | 'suspended' |
  'live-rooms' | 'cargo' | 'market' | 'virtual-booths' | 'email-campaigns' | 'ad-campaigns' |
  'feature-lab' | 'launch-events' | 'deploy' | 'settings' | 'notifications' |
  'revenue' | 'analytics' | 'market-intel' |
  'security' | 'activity-logs' | 'system-health' |
  'monthly-expo' | 'walkin-buyers';

interface PlatformAlert {
  id: string;
  type: 'warning' | 'critical' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: Date;
}

interface ActivityLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  details: string;
  ip: string;
}

interface FeatureFlag {
  id: string;
  name: string;
  status: 'live' | 'testing' | 'beta' | 'planned' | 'disabled';
  visibleTo: string;
  lastUpdated: string;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'warning' | 'offline';
  latency?: string;
}

// ============================================
// SAMPLE DATA
// ============================================

const unclaimedCompanies = companies.filter(c => c.status === 'unclaimed');

const sampleBuyers = [
  { id: '1', name: 'Ahmed Al Rashid', company: 'Al Meera', country: '🇶🇦 Qatar', rfqs: 4, lastActive: 'Today', spend: '$116,250', status: 'Active' },
  { id: '2', name: 'Mohammed Hassan', company: 'Lulu', country: '🇦🇪 UAE', rfqs: 2, lastActive: 'Yesterday', spend: '$45,000', status: 'Active' },
  { id: '3', name: 'Sarah Johnson', company: 'Carrefour', country: '🇫🇷 France', rfqs: 8, lastActive: '2 days ago', spend: '$234,500', status: 'Active' },
  { id: '4', name: 'John Smith', company: 'Tesco', country: '🇬🇧 UK', rfqs: 3, lastActive: '1 week ago', spend: '$89,000', status: 'Inactive' },
];

const sampleSuppliers = [
  { id: '1', name: 'Almarai Company', country: '🇸🇦 Saudi Arabia', plan: 'Expo', leads: 45, revenue: '$4,988', sessions: 12, status: 'Active' },
  { id: '2', name: 'Baladna Foods', country: '🇶🇦 Qatar', plan: 'Enterprise', leads: 32, revenue: '$3,500', sessions: 8, status: 'Active' },
  { id: '3', name: 'Al Ain Farms', country: '🇦🇪 UAE', plan: 'Premium', leads: 18, revenue: '$2,100', sessions: 5, status: 'Active' },
  { id: '4', name: 'Americana Foods', country: '🇦🇪 UAE', plan: 'Expo', leads: 28, revenue: '$3,200', sessions: 7, status: 'Active' },
];

const sampleShippingCompanies = [
  { id: '1', name: 'Maersk Line', country: '🇩🇰 Denmark', routes: 'Global', activeBids: 24, shipments: 156, reliability: '98%', status: 'Active' },
  { id: '2', name: 'Gulf Navigation', country: '🇦🇪 UAE', routes: 'GCC', activeBids: 18, shipments: 89, reliability: '95%', status: 'Active' },
  { id: '3', name: 'Al Mawarid Shipping', country: '🇸🇦 Saudi Arabia', routes: 'MENA', activeBids: 12, shipments: 45, reliability: '92%', status: 'Active' },
];

const sampleActivityLogs: ActivityLog[] = [
  { id: '1', timestamp: new Date(Date.now() - 300000), user: 'admin@brandsbridge.ai', action: 'Uploaded 247 companies', details: 'Bulk CSV', ip: '192.168.1.1' },
  { id: '2', timestamp: new Date(Date.now() - 900000), user: 'supplier@almarai.com', action: 'Updated company profile', details: 'Al Marai Company', ip: '192.168.1.2' },
  { id: '3', timestamp: new Date(Date.now() - 1800000), user: 'buyer@lulu.com', action: 'Sent RFQ', details: 'To: Baladna Foods', ip: '192.168.1.3' },
  { id: '4', timestamp: new Date(Date.now() - 3600000), user: 'admin@brandsbridge.ai', action: 'Approved broadcast', details: 'Americana Foods', ip: '192.168.1.1' },
  { id: '5', timestamp: new Date(Date.now() - 7200000), user: 'supplier@baladna.com', action: 'Started live session', details: 'Dairy products showcase', ip: '192.168.1.4' },
];

const featureFlags: FeatureFlag[] = [
  { id: '1', name: 'Virtual Booth', status: 'live', visibleTo: 'All Users', lastUpdated: 'Jan 28, 2024' },
  { id: '2', name: 'VR Expo', status: 'testing', visibleTo: 'Admin Only', lastUpdated: 'Jan 30, 2024' },
  { id: '3', name: 'AI Matchmaking v2', status: 'beta', visibleTo: 'Beta Users Only', lastUpdated: 'Feb 1, 2024' },
  { id: '4', name: 'Arabic Language', status: 'planned', visibleTo: 'Not live yet', lastUpdated: 'Feb 5, 2024' },
  { id: '5', name: 'Stripe Payments', status: 'planned', visibleTo: 'Not live yet', lastUpdated: 'Feb 10, 2024' },
  { id: '6', name: 'Mobile App', status: 'planned', visibleTo: 'Not live yet', lastUpdated: 'Feb 12, 2024' },
];

const serviceStatuses: ServiceStatus[] = [
  { name: 'Platform', status: 'online', latency: '45ms' },
  { name: 'Database', status: 'online', latency: '12ms' },
  { name: 'AI Engine', status: 'online', latency: '230ms' },
  { name: 'Email Service', status: 'online', latency: '89ms' },
  { name: 'Video Streaming', status: 'online', latency: '156ms' },
  { name: 'Payment Gateway', status: 'warning', latency: 'N/A' },
];

const recentActivity = [
  { id: '1', type: 'company', text: 'New company claimed: Al Jazeera Food', time: '2 min ago', icon: Building2, color: 'emerald' },
  { id: '2', type: 'user', text: 'New buyer registered: Ahmed Al Rashid', time: '15 min ago', icon: Users, color: 'blue' },
  { id: '3', type: 'session', text: 'Live session ended: Baladna Foods', time: '1 hour ago', icon: Video, color: 'amber' },
  { id: '4', type: 'cargo', text: 'New cargo reserved: $28,500', time: '2 hours ago', icon: Package, color: 'purple' },
  { id: '5', type: 'email', text: 'Claim email sent: Gulf Sweets Factory', time: '3 hours ago', icon: Mail, color: 'slate' },
];

const platformAlerts: PlatformAlert[] = [
  { id: '1', type: 'warning', title: 'High Queue Wait Time', description: 'Almarai queue is moving too slow (avg 20 mins wait). Consider adding a second sales rep.', timestamp: new Date(Date.now() - 300000) },
  { id: '2', type: 'critical', title: 'Video Quality Degradation', description: 'Americana Foods experiencing video latency issues.', timestamp: new Date(Date.now() - 600000) },
  { id: '3', type: 'success', title: 'Peak Performance', description: 'All servers operating at optimal capacity. Zero downtime in the last 24 hours.', timestamp: new Date(Date.now() - 900000) },
  { id: '4', type: 'info', title: 'New VIP Request', description: 'Gulf Food Industries submitted VIP broadcast request.', timestamp: new Date(Date.now() - 1200000) },
];

// ========== PLATFORM PULSE DATA ==========
const liveTickerItems = [
  { icon: '🔴', text: 'Ahmed from UAE just joined' },
  { icon: '💰', text: '$28K deal closed: OZMO → Al Meera' },
  { icon: '📧', text: 'Claim email opened by Gulf Sweets' },
  { icon: '🎯', text: 'New VIP signup: Baladna Food' },
  { icon: '📦', text: 'Shipment delivered: Jeddah Port' },
];

const liveMetrics = [
  { id: 'online', label: 'Users Online', value: 47, sub: 'right now', pulseColor: 'emerald' },
  { id: 'sessions', label: 'Active Sessions', value: 12, sub: 'live deal rooms', pulseColor: 'red' },
  { id: 'deals', label: "Today's Deals", value: 8, sub: '$186K total value', pulseColor: 'emerald' },
  { id: 'signups', label: "Today's Signups", value: 14, sub: '+3 in last hour', pulseColor: 'blue' },
  { id: 'health', label: 'Platform Health', value: '99.8%', sub: 'All systems operational', pulseColor: 'emerald' },
];

// ========== GROWTH INTELLIGENCE DATA ==========
const growthInsights = [
  {
    id: 1,
    type: 'fire',
    title: 'Expo Performance',
    description: 'Your Monthly Expo is performing 25% better than industry average trade shows. Consider raising prices next month.',
    action: 'View Data',
    color: 'amber'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Supplier Churn Alert',
    description: "Supplier churn rate is increasing — 3 suppliers canceled this month. Main reason cited: 'Not enough buyer inquiries'",
    action: 'Take Action',
    color: 'red'
  },
  {
    id: 3,
    type: 'lightbulb',
    title: 'Geographic Opportunity',
    description: '30% of your buyer signups come from Qatar. Consider launching a "Qatar Focus" monthly expo to retain them.',
    action: 'Plan Expo',
    color: 'blue'
  },
  {
    id: 4,
    type: 'target',
    title: 'Conversion Optimization',
    description: 'Companies that claim within 48 hours of email are 5x more likely to become paying customers. Send claim reminders faster.',
    action: 'Automate Reminders',
    color: 'teal'
  },
];

// ========== USER JOURNEY DATA ==========
const userJourneyFunnel = [
  { step: 'Visitors', count: 15420, percentage: 100 },
  { step: 'Signups', count: 3547, percentage: 23 },
  { step: 'First Activity', count: 639, percentage: 18 },
  { step: 'Sent Inquiry', count: 217, percentage: 34 },
  { step: 'Closed Deal', count: 61, percentage: 28 },
  { step: 'Paying Customer', count: 44, percentage: 72 },
];

const userJourneyInsight = {
  biggestDrop: 'Step 2 → Step 3',
  problem: '70% of signups don\'t do anything after creating account.',
  fix: 'Welcome video + guided tour for first-time users.',
  action: 'Implement Fix'
};

// ========== REVENUE DATA ==========
const revenueData = [
  { source: 'Supplier Subscriptions', amount: 18500, percentage: 45, color: '#D4AF37' },
  { source: 'Monthly Expo Tickets', amount: 11500, percentage: 28, color: '#0EA5E9' },
  { source: 'Shipping Subscriptions', amount: 4900, percentage: 12, color: '#10B981' },
  { source: '3PL Subscriptions', amount: 3300, percentage: 8, color: '#8B5CF6' },
  { source: 'Cargo Auction Fees', amount: 1600, percentage: 4, color: '#F59E0B' },
  { source: 'Other Services', amount: 1200, percentage: 3, color: '#6B7280' },
];

const revenueInsight = {
  totalMRR: 41000,
  forecastMRR: 100000,
  monthsToGoal: 8,
  bottleneck: 'Supplier subscriptions growing slower than expected.',
  fix: 'Launch supplier referral program with 30% commission.',
  action: 'Launch Referral'
};

// ========== CUSTOMER HEALTH DATA ==========
const customerHealth = [
  { status: 'healthy', label: 'Healthy', count: 34, color: 'emerald', description: 'Active daily, closing deals, high engagement' },
  { status: 'at_risk', label: 'At Risk', count: 8, color: 'amber', description: 'Login dropped, no inquiries last 14 days' },
  { status: 'critical', label: 'Critical', count: 2, color: 'red', description: 'No activity 30+ days, about to churn' },
];

// ============================================
// HELPER COMPONENTS
// ============================================

const KPICard = ({ icon: Icon, label, value, subtext, trend, trendUp, color }: any) => (
  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/50 transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
    {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const getStyle = () => {
    switch (status) {
      case 'claimed':
      case 'Active':
      case 'online':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'unclaimed':
      case 'Pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Suspended':
      case 'Inactive':
      case 'offline':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStyle()}`}>
      {status === 'claimed' ? '✓ Claimed' : status === 'unclaimed' ? '⚠️ Unclaimed' : status}
    </span>
  );
};

const SectionHeader = ({ title, subtitle, action }: any) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const SearchBar = ({ placeholder, value, onChange }: any) => (
  <div className="relative">
    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
    />
  </div>
);

const FilterSelect = ({ options, value, onChange }: any) => (
  <select
    value={value}
    onChange={onChange}
    className="px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
  >
    {options.map((opt: string) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);

const ActionButton = ({ icon: Icon, label, onClick, variant = 'default' }: any) => {
  const variants = {
    default: 'bg-slate-700/50 hover:bg-slate-700 text-slate-300 border-slate-600/50',
    primary: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900',
    teal: 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 border border-teal-500/30',
    outline: 'bg-transparent hover:bg-slate-800/50 text-slate-300 border border-slate-700/50',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30',
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border ${variants[variant as keyof typeof variants]}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700/50 rounded-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ============================================
// SECTION COMPONENTS
// ============================================

const DashboardHome = () => {
  const [tickerOffset, setTickerOffset] = useState(0);
  const [pulseValues, setPulseValues] = useState({
    online: 47,
    sessions: 12,
    deals: 8,
    signups: 14,
    health: '99.8%'
  });

  // Live ticker animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset(prev => prev - 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Pulse values update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseValues(prev => ({
        online: prev.online + Math.floor(Math.random() * 3) - 1,
        sessions: Math.max(1, prev.sessions + Math.floor(Math.random() * 3) - 1),
        deals: prev.deals + (Math.random() > 0.7 ? 1 : 0),
        signups: prev.signups + (Math.random() > 0.8 ? 1 : 0),
        health: '99.8%'
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-6">
      {/* ========== PLATFORM PULSE ========== */}
      <div className="bg-gradient-to-r from-red-500/10 via-slate-900 to-red-500/10 border border-red-500/20 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-bold">💓 Platform Pulse — LIVE</span>
            </div>
            <span className="text-slate-400 text-sm">Real-time platform heartbeat</span>
          </div>
          <span className="text-slate-500 text-xs">Updating every 10 seconds</span>
        </div>

        {/* Live Ticker */}
        <div className="h-10 bg-slate-900/50 overflow-hidden relative">
          <div
            className="absolute whitespace-nowrap flex items-center gap-8 text-sm"
            style={{ transform: `translateX(${tickerOffset}px)` }}
          >
            {[...liveTickerItems, ...liveTickerItems, ...liveTickerItems].map((item, idx) => (
              <span key={idx} className="flex items-center gap-2 text-slate-300">
                <span>{item.icon}</span>
                <span>{item.text}</span>
                <span className="text-slate-600 mx-2">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-5 divide-x divide-slate-800">
          {liveMetrics.map((metric) => (
            <div key={metric.id} className="px-4 py-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  metric.pulseColor === 'emerald' ? 'bg-emerald-400' :
                  metric.pulseColor === 'red' ? 'bg-red-400' :
                  'bg-blue-400'
                }`}></div>
                <span className="text-2xl font-bold text-white">{pulseValues[metric.id as keyof typeof pulseValues]}</span>
              </div>
              <div className="text-white text-sm font-medium">{metric.label}</div>
              <div className="text-slate-500 text-xs">{metric.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== GROWTH INTELLIGENCE ========== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📈 Growth Intelligence
          </h2>
          <button className="px-3 py-1.5 bg-slate-800 text-slate-400 text-sm rounded-lg hover:bg-slate-700 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Insights
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {growthInsights.map((insight) => (
            <div
              key={insight.id}
              className={`rounded-xl p-5 border ${
                insight.color === 'amber' ? 'bg-amber-500/5 border-amber-500/20' :
                insight.color === 'red' ? 'bg-red-500/5 border-red-500/20' :
                insight.color === 'blue' ? 'bg-blue-500/5 border-blue-500/20' :
                'bg-teal-500/5 border-teal-500/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">
                  {insight.type === 'fire' ? '🔥' :
                   insight.type === 'warning' ? '⚠️' :
                   insight.type === 'lightbulb' ? '💡' : '🎯'}
                </span>
                <span className={`font-semibold text-sm uppercase ${
                  insight.color === 'amber' ? 'text-amber-400' :
                  insight.color === 'red' ? 'text-red-400' :
                  insight.color === 'blue' ? 'text-blue-400' :
                  'text-teal-400'
                }`}>
                  {insight.title}
                </span>
              </div>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">{insight.description}</p>
              <button className={`px-3 py-2 text-sm font-medium rounded-lg w-full ${
                insight.color === 'amber' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' :
                insight.color === 'red' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                insight.color === 'blue' ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' :
                'bg-teal-500/20 text-teal-400 hover:bg-teal-500/30'
              }`}>
                {insight.action} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========== USER JOURNEY + REVENUE (2 columns) ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Journey Tracker */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            👤 User Journey Analytics
          </h3>

          {/* Funnel */}
          <div className="space-y-2">
            {userJourneyFunnel.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 bg-gradient-to-r from-emerald-500/20 to-transparent border border-emerald-500/30 rounded-lg flex items-center px-4"
                    style={{ width: `${step.percentage}%` }}
                  >
                    <span className="text-white font-medium">{step.step}</span>
                    <span className="ml-auto text-emerald-400 font-bold">{step.count.toLocaleString()}</span>
                  </div>
                </div>
                {index < userJourneyFunnel.length - 1 && (
                  <div className="flex items-center gap-2 py-1 pl-4">
                    <ArrowDownRight className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-500 text-xs">{userJourneyFunnel[index + 1].percentage}% conversion</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* AI Recommendation */}
          <div className="mt-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium mb-1">
                  Biggest drop-off: <span className="text-amber-400">{userJourneyInsight.biggestDrop}</span>
                </p>
                <p className="text-slate-400 text-xs mb-2">{userJourneyInsight.problem}</p>
                <p className="text-slate-300 text-xs mb-3">Suggested fix: {userJourneyInsight.fix}</p>
                <button className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-lg hover:bg-purple-500/30">
                  {userJourneyInsight.action} →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            💰 Revenue by Source
          </h3>

          {/* Donut Chart (CSS-based) */}
          <div className="flex items-center gap-6 mb-4">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
                {revenueData.reduce((acc, item, index) => {
                  const strokeLength = item.percentage * 3.6;
                  const offset = revenueData.slice(0, index).reduce((sum, d) => sum + d.percentage * 3.6, 0);
                  acc.push(
                    <circle
                      key={item.source}
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="4"
                      strokeDasharray={`${strokeLength} ${360 - strokeLength}`}
                      strokeDashoffset={-offset}
                    />
                  );
                  return acc;
                }, [] as any)}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">${(revenueInsight.totalMRR / 1000).toFixed(0)}K</span>
                <span className="text-xs text-slate-400">MRR</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 grid grid-cols-2 gap-2">
              {revenueData.map((item) => (
                <div key={item.source} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-300 text-xs truncate">{item.source.split(' ')[0]}</span>
                  <span className="text-white text-xs font-medium ml-auto">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Forecast */}
          <div className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium mb-1">
                  ${(revenueInsight.forecastMRR / 1000).toFixed(0)}K MRR in {revenueInsight.monthsToGoal} months
                </p>
                <p className="text-slate-400 text-xs mb-2">Bottleneck: {revenueInsight.bottleneck}</p>
                <p className="text-slate-300 text-xs mb-3">Fix: {revenueInsight.fix}</p>
                <button className="px-3 py-1.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-lg hover:bg-amber-500/30">
                  {revenueInsight.action} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== CUSTOMER SUCCESS SCORECARD ========== */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          ❤️ Customer Health
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {customerHealth.map((segment) => (
            <div
              key={segment.status}
              className={`rounded-xl p-5 border cursor-pointer hover:scale-[1.02] transition-all ${
                segment.color === 'emerald' ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40' :
                segment.color === 'amber' ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40' :
                'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
              }`}
              onClick={() => toast.success(`Viewing ${segment.count} ${segment.label} customers`)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-2xl ${
                  segment.color === 'emerald' ? '🟢' : segment.color === 'amber' ? '🟡' : '🔴'
                }`}></span>
                <span className={`text-3xl font-bold ${
                  segment.color === 'emerald' ? 'text-emerald-400' :
                  segment.color === 'amber' ? 'text-amber-400' :
                  'text-red-400'
                }`}>
                  {segment.count}
                </span>
              </div>
              <p className={`font-semibold mb-1 ${
                segment.color === 'emerald' ? 'text-emerald-400' :
                segment.color === 'amber' ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {segment.label}
              </p>
              <p className="text-slate-400 text-xs mb-3">{segment.description}</p>
              {segment.status !== 'healthy' && (
                <button className={`px-3 py-1.5 text-xs font-medium rounded-lg w-full ${
                  segment.color === 'amber'
                    ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}>
                  {segment.status === 'at_risk' ? 'Send Campaign →' : 'Personal Outreach →'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ========== EXISTING CONTENT (Quick Actions + Activity + Alerts) ========== */}
      {/* Quick Actions */}
      <div className="flex gap-3">
        <ActionButton icon={Upload} label="Upload Companies" onClick={() => toast.success('Navigate to Upload section')} variant="teal" />
        <ActionButton icon={Plus} label="Add New User" onClick={() => toast.success('Opening Add User modal')} variant="default" />
        <ActionButton icon={Cpu} label="Test New Feature" onClick={() => toast.success('Navigate to Feature Lab')} variant="default" />
        <ActionButton icon={BarChart3} label="Generate Report" onClick={() => toast.success('Opening report modal')} variant="primary" />
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Platform Activity (Last 24h)
          </h3>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  item.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                  item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  item.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                  item.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{item.text}</p>
                  <p className="text-slate-500 text-xs mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2">
            View All Activity <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* System Alerts */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            AI System Alerts
          </h3>
          <div className="space-y-3">
            {platformAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${
                alert.type === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                alert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                'bg-blue-500/10 border-blue-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">{alert.title}</span>
                  <span className="text-slate-500 text-xs">{
                    Math.floor((Date.now() - alert.timestamp.getTime()) / 60000) < 60
                      ? `${Math.floor((Date.now() - alert.timestamp.getTime()) / 60000)}m ago`
                      : `${Math.floor((Date.now() - alert.timestamp.getTime()) / 3600000)}h ago`
                  }</span>
                </div>
                <p className="text-slate-400 text-xs mt-1">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AllCompaniesSection = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <SectionHeader title="All Companies" subtitle="Manage all companies on the platform" />

      {/* Stats */}
      <div className="flex gap-6 text-sm">
        <span className="text-slate-400">Total: <span className="text-white font-semibold">{companies.length}</span></span>
        <span className="text-emerald-400">Claimed: <span className="font-semibold">{companies.filter(c => c.status === 'claimed').length}</span></span>
        <span className="text-amber-400">Unclaimed: <span className="font-semibold">{companies.filter(c => c.status === 'unclaimed').length}</span></span>
        <span className="text-blue-400">Pending: <span className="font-semibold">2</span></span>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px]">
          <SearchBar placeholder="Search companies..." value={search} onChange={(e: any) => setSearch(e.target.value)} />
        </div>
        <FilterSelect options={['All', 'Claimed', 'Unclaimed']} value={statusFilter} onChange={(e: any) => setStatusFilter(e.target.value)} />
        <FilterSelect options={['All Countries', 'Qatar', 'UAE', 'Saudi Arabia']} value="All Countries" onChange={() => {}} />
        <FilterSelect options={['All Categories', 'FMCG', 'Dairy']} value="All Categories" onChange={() => {}} />
        <FilterSelect options={['All Plans', 'Free', 'Premium', 'Expo']} value="All Plans" onChange={() => {}} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <ActionButton icon={Plus} label="Add Single Company" onClick={() => toast.success('Opening add form')} variant="teal" />
        <ActionButton icon={Upload} label="Bulk Upload CSV" onClick={() => toast.success('Navigate to upload section')} variant="outline" />
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Country</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Plan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Views</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Inquiries</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredCompanies.slice(0, 10).map((company, idx) => (
              <tr key={company.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-4 py-3 text-slate-400 text-sm">{idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={company.logo} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-700" />
                    <span className="text-white font-medium">{company.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm">{company.countryFlag} {company.country}</td>
                <td className="px-4 py-3 text-slate-400 text-sm">{company.categories[0]}</td>
                <td className="px-4 py-3"><StatusBadge status={company.status || 'claimed'} /></td>
                <td className="px-4 py-3 text-slate-400 text-sm">{company.subscriptionPlan}</td>
                <td className="px-4 py-3 text-slate-400 text-sm">{company.profileViews || 0}</td>
                <td className="px-4 py-3 text-slate-400 text-sm">{company.pendingInquiries || 0}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white" title="Send Email">
                      <Mail className="w-4 h-4" />
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
};

const UploadCompaniesSection = () => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [formData, setFormData] = useState({
    name: '', country: 'Qatar', city: '', businessType: 'Manufacturer', category: 'FMCG',
    email: '', phone: '', website: '', employees: '51-200', yearEstablished: '2020', description: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    setShowSuccess(true);
    toast.success(`${formData.name} added to platform!`);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Upload Companies" subtitle="Add companies to the platform" />

      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
        <div>
          <p className="text-white font-medium">Companies added here are NOT notified.</p>
          <p className="text-amber-300/80 text-sm">They appear as unclaimed profiles until they claim them.</p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('single')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${mode === 'single' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800/50 text-slate-300'}`}
        >
          Single Company
        </button>
        <button
          onClick={() => setMode('bulk')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${mode === 'bulk' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800/50 text-slate-300'}`}
        >
          CSV Bulk Upload
        </button>
      </div>

      {mode === 'single' ? (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                >
                  <option>Qatar</option>
                  <option>UAE</option>
                  <option>Saudi Arabia</option>
                  <option>Kuwait</option>
                  <option>Oman</option>
                  <option>Bahrain</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Business Type *</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                >
                  <option>Manufacturer</option>
                  <option>Exporter</option>
                  <option>Importer</option>
                  <option>Distributor</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Business Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Website URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Number of Employees</label>
                <select
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                >
                  <option>1-10</option>
                  <option>11-50</option>
                  <option>51-200</option>
                  <option>201-500</option>
                  <option>500+</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm text-slate-400 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
            />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <ActionButton icon={Plus} label="Add to Platform" onClick={handleSubmit} variant="teal" />
            {showSuccess && (
              <span className="text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Company added successfully!
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          {/* Drop Zone */}
          <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-12 text-center hover:border-amber-500/50 transition-colors">
            <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Drop CSV or Excel file here</p>
            <p className="text-slate-400 text-sm mb-4">Supports: .csv .xlsx .xls | Max size: 10MB</p>
            <ActionButton icon={Download} label="Download CSV Template" onClick={() => toast.success('Downloading template...')} variant="outline" />
          </div>
        </div>
      )}
    </div>
  );
};

const UnclaimedProfilesSection = () => {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const sortedUnclaimed = [...unclaimedCompanies].sort((a, b) => (b.pendingInquiries || 0) - (a.pendingInquiries || 0));

  return (
    <div className="space-y-6">
      <SectionHeader title="Unclaimed Profiles" subtitle="Priority companies needing attention" />

      {/* Stats */}
      <div className="flex gap-6 text-sm">
        <span className="text-amber-400">⚠️ {unclaimedCompanies.length} unclaimed</span>
        <span className="text-slate-400">👁 {unclaimedCompanies.reduce((sum, c) => sum + (c.profileViews || 0), 0)} total views</span>
        <span className="text-slate-400">💬 {unclaimedCompanies.reduce((sum, c) => sum + (c.pendingInquiries || 0), 0)} pending inquiries</span>
      </div>

      {/* Send All Button */}
      <ActionButton icon={Mail} label="Send All Claim Emails" onClick={() => toast.success('5 claim emails sent!')} variant="primary" />

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Country</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Views</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Inquiries</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {sortedUnclaimed.map((company) => (
              <tr key={company.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={company.logo} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-700" />
                    <span className="text-white font-medium">{company.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm">{company.countryFlag} {company.country}</td>
                <td className="px-4 py-3 text-slate-400 text-sm">{company.profileViews || 0}</td>
                <td className="px-4 py-3 text-amber-400 font-semibold text-sm">{company.pendingInquiries || 0}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${company.email ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-400'}`}>
                    {company.email ? 'Sent ✓' : 'Not Sent'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedEmail(company); setShowEmailModal(true); }}
                      className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-600 rounded text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Email Modal */}
      <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} title="Send Claim Invitation">
        {selectedEmail && (
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">To:</div>
              <div className="text-white font-medium">{selectedEmail.name}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Subject:</div>
              <div className="text-white">Your company profile is live on Brands Bridge AI</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-sm text-slate-300">
              <p className="mb-2">Dear {selectedEmail.name},</p>
              <p className="mb-2">Good news — your company is already listed on Brands Bridge AI, the global FMCG trade platform.</p>
              <p className="mb-2">In the last 30 days:</p>
              <ul className="list-disc pl-4 mb-2">
                <li>👁 {selectedEmail.profileViews || 0} buyers viewed your page</li>
                <li>💬 {selectedEmail.pendingInquiries || 0} inquiries are waiting</li>
              </ul>
              <p className="mb-2">Claim your FREE profile to:</p>
              <ul className="list-disc pl-4 mb-2">
                <li>✓ Edit your information</li>
                <li>✓ Respond to buyer inquiries</li>
                <li>✓ Access CRM & trade tools</li>
                <li>✓ Enable Virtual Booth</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { toast.success('Email sent!'); setShowEmailModal(false); }}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-xl"
              >
                Send Now →
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-6 py-3 bg-slate-700 text-white rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const BuyersSection = () => (
  <div className="space-y-6">
    <SectionHeader title="Buyer Management" subtitle="Manage all buyer accounts" />

    <div className="flex gap-6 text-sm">
      <span className="text-slate-400">Total Buyers: <span className="text-white font-semibold">28</span></span>
      <span className="text-emerald-400">Active: <span className="font-semibold">24</span></span>
      <span className="text-slate-400">Inactive: <span className="font-semibold">4</span></span>
    </div>

    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Country</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">RFQs Sent</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Last Active</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Total Spend</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {sampleBuyers.map((buyer) => (
            <tr key={buyer.id} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-4 py-3 text-slate-400 text-sm">{buyer.id}</td>
              <td className="px-4 py-3 text-white font-medium">{buyer.name}</td>
              <td className="px-4 py-3 text-slate-300 text-sm">{buyer.company}</td>
              <td className="px-4 py-3 text-slate-400 text-sm">{buyer.country}</td>
              <td className="px-4 py-3 text-slate-400 text-sm">{buyer.rfqs} RFQs</td>
              <td className="px-4 py-3 text-slate-400 text-sm">{buyer.lastActive}</td>
              <td className="px-4 py-3 text-emerald-400 font-semibold text-sm">{buyer.spend}</td>
              <td className="px-4 py-3"><StatusBadge status={buyer.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white"><Ban className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SuppliersSection = () => (
  <div className="space-y-6">
    <SectionHeader title="Supplier Management" subtitle="Manage all supplier accounts" />

    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Country</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Plan</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Leads</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Revenue</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Sessions</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {sampleSuppliers.map((supplier) => (
            <tr key={supplier.id} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-4 py-3 text-slate-400 text-sm">{supplier.id}</td>
              <td className="px-4 py-3 text-white font-medium">{supplier.name}</td>
              <td className="px-4 py-3 text-slate-400 text-sm">{supplier.country}</td>
              <td className="px-4 py-3 text-amber-400 text-sm">{supplier.plan}</td>
              <td className="px-4 py-3 text-slate-400 text-sm">{supplier.leads}</td>
              <td className="px-4 py-3 text-emerald-400 font-semibold text-sm">${supplier.revenue}</td>
              <td className="px-4 py-3 text-slate-400 text-sm">{supplier.sessions}</td>
              <td className="px-4 py-3"><StatusBadge status={supplier.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-slate-600 rounded text-teal-400 hover:text-teal-300" title="View as Supplier"><Shield className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-slate-600 rounded text-amber-400 hover:text-amber-300" title="Upgrade Plan"><TrendingUp className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ShippingSection = () => (
  <div className="space-y-6">
    <SectionHeader title="Shipping Companies" subtitle="Manage freight and logistics partners"
      action={<ActionButton icon={Plus} label="Add Shipping Company" onClick={() => toast.success('Opening add form')} variant="teal" />} />

    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Country</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Routes</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Active Bids</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Shipments</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Reliability</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {sampleShippingCompanies.map((company) => (
            <tr key={company.id} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-4 py-3 text-slate-400 text-sm">{company.id}</td>
              <td className="px-4 py-3 text-white font-medium">{company.name}</td>
              <td className="px-4 py-3 text-slate-400 text-sm">{company.country}</td>
              <td className="px-4 py-3 text-slate-300 text-sm">{company.routes}</td>
              <td className="px-4 py-3 text-slate-400 text-sm">{company.activeBids}</td>
              <td className="px-4 py-3 text-slate-400 text-sm">{company.shipments}</td>
              <td className="px-4 py-3 text-emerald-400 font-semibold text-sm">{company.reliability}</td>
              <td className="px-4 py-3"><StatusBadge status={company.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const FeatureLabSection = () => {
  const [features, setFeatures] = useState(FEATURE_FLAGS);
  const [deployModal, setDeployModal] = useState<{ open: boolean; feature: Feature | null }>({ open: false, feature: null });
  const [selectedStatus, setSelectedStatus] = useState<FeatureStatus>('admin_only');
  const [betaUsers, setBetaUsers] = useState<string>('');

  const toggleFeature = (id: string) => {
    toast.success('Feature status toggled');
  };

  const handleDeploy = (feature: Feature) => {
    setDeployModal({ open: true, feature });
    setSelectedStatus(feature.status);
    setBetaUsers(feature.visibleTo.join(', '));
  };

  const confirmDeploy = () => {
    if (deployModal.feature) {
      updateFeatureStatus(
        deployModal.feature.id,
        selectedStatus,
        betaUsers.split(',').map(e => e.trim()).filter(Boolean)
      );
      setFeatures([...FEATURE_FLAGS]);
      toast.success(`"${deployModal.feature.name}" deployed to ${selectedStatus.replace('_', ' ')}!`);
      setDeployModal({ open: false, feature: null });
    }
  };

  // Group features by status
  const disabledFeatures = features.filter(f => f.status === 'disabled');
  const adminOnlyFeatures = features.filter(f => f.status === 'admin_only');
  const betaFeatures = features.filter(f => f.status === 'beta');
  const liveFeatures = features.filter(f => ['public', 'all_users', 'suppliers', 'buyers', 'shipping'].includes(f.status));

  const getStatusBadge = (status: FeatureStatus) => {
    const badges: Record<FeatureStatus, { color: string; label: string }> = {
      admin_only: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Admin Only' },
      beta: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Beta Testing' },
      suppliers: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Suppliers' },
      buyers: { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', label: 'Buyers' },
      shipping: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Shipping' },
      all_users: { color: 'bg-teal-500/20 text-teal-400 border-teal-500/30', label: 'All Users' },
      public: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Public' },
      disabled: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Disabled' }
    };
    return badges[status] || badges.disabled;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Feature Testing Lab</h2>
          <p className="text-slate-400">Control feature visibility for different user groups</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2">
            <span className="text-slate-400 text-sm">Total Features: </span>
            <span className="text-white font-bold">{features.length}</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-sm">Live: </span>
            <span className="text-white font-bold">{liveFeatures.length}</span>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-2">
            <span className="text-purple-400 text-sm">Testing: </span>
            <span className="text-white font-bold">{adminOnlyFeatures.length + betaFeatures.length}</span>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
            <span className="text-red-400 text-sm">Future: </span>
            <span className="text-white font-bold">{disabledFeatures.length}</span>
          </div>
        </div>
      </div>

      {/* GROUP 1: Disabled / Future */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 bg-red-500/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔴</span>
            <div>
              <h3 className="text-white font-semibold">Disabled / Future Features</h3>
              <p className="text-slate-400 text-sm">Features planned but not yet started</p>
            </div>
            <span className="ml-auto bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">{disabledFeatures.length}</span>
          </div>
        </div>
        <div className="divide-y divide-slate-700/30">
          {disabledFeatures.map((feature) => (
            <div key={feature.id} className="p-4 flex items-center justify-between hover:bg-slate-700/20">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <div className="text-white font-medium">{feature.name}</div>
                  <div className="text-slate-400 text-sm">{feature.description}</div>
                  {feature.notes && (
                    <div className="text-slate-500 text-xs mt-1 max-w-md">{feature.notes}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-sm">Build: Not started</span>
                <button
                  onClick={() => toast.success(`Contact MiniMax Agent to build: ${feature.name}`)}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg flex items-center gap-2 transition-colors"
                >
                  🔨 Build This Feature
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GROUP 2: Admin Testing */}
      <div className="bg-slate-800/30 border border-purple-500/30 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 bg-purple-500/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧪</span>
            <div>
              <h3 className="text-white font-semibold">Admin Testing</h3>
              <p className="text-slate-400 text-sm">Only you can see these features</p>
            </div>
            <span className="ml-auto bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">{adminOnlyFeatures.length}</span>
          </div>
        </div>
        <div className="divide-y divide-slate-700/30">
          {adminOnlyFeatures.map((feature) => (
            <div key={feature.id} className="p-4 hover:bg-slate-700/20">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <div className="text-white font-medium flex items-center gap-2">
                      {feature.name}
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">Only you can see this</span>
                    </div>
                    <div className="text-slate-400 text-sm">{feature.description}</div>
                    {feature.notes && (
                      <div className="text-slate-500 text-xs mt-2 max-w-lg">{feature.notes}</div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>Built: {feature.buildDate || 'N/A'}</span>
                      <span>Plan: {feature.plan}</span>
                      {feature.isMonetized && <span className="text-amber-400">Monetized</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeploy(feature)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold rounded-lg flex items-center gap-2 transition-all"
                    >
                      <Rocket className="w-4 h-4" /> Deploy Feature
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GROUP 3: Beta Testing */}
      {betaFeatures.length > 0 && (
        <div className="bg-slate-800/30 border border-blue-500/30 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 bg-blue-500/5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <h3 className="text-white font-semibold">Beta Testing</h3>
                <p className="text-slate-400 text-sm">Features being tested by selected users</p>
              </div>
              <span className="ml-auto bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">{betaFeatures.length}</span>
            </div>
          </div>
          <div className="divide-y divide-slate-700/30">
            {betaFeatures.map((feature) => (
              <div key={feature.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <div className="text-white font-medium">{feature.name}</div>
                      <div className="text-slate-400 text-sm">{feature.description}</div>
                      <div className="text-blue-400 text-xs mt-1">
                        Beta users: {feature.visibleTo.length > 0 ? feature.visibleTo.join(', ') : 'None specified'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { updateFeatureStatus(feature.id, 'all_users'); setFeatures([...FEATURE_FLAGS]); toast.success('Expanded to all users'); }}
                      className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors"
                    >
                      Expand to All Users
                    </button>
                    <button
                      onClick={() => { updateFeatureStatus(feature.id, 'admin_only'); setFeatures([...FEATURE_FLAGS]); toast.success('Pulled back to admin only'); }}
                      className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors"
                    >
                      Pull Back
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GROUP 4: Live Features */}
      <div className="bg-slate-800/30 border border-emerald-500/30 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="text-white font-semibold">Live Features</h3>
              <p className="text-slate-400 text-sm">Features deployed to users</p>
            </div>
            <span className="ml-auto bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm">{liveFeatures.length}</span>
          </div>
        </div>
        <div className="divide-y divide-slate-700/30">
          {liveFeatures.map((feature) => {
            const badge = getStatusBadge(feature.status);
            return (
              <div key={feature.id} className="p-4 flex items-center justify-between hover:bg-slate-700/20">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <div className="text-white font-medium flex items-center gap-2">
                      {feature.name}
                      <span className={`px-2 py-0.5 rounded text-xs border ${badge.color}`}>{badge.label}</span>
                    </div>
                    <div className="text-slate-400 text-sm">{feature.description}</div>
                    {feature.usageStats && (
                      <div className="flex gap-4 mt-1 text-xs text-slate-500">
                        <span>Views: {feature.usageStats.views.toLocaleString()}</span>
                        <span>Active Users: {feature.usageStats.activeUsers}</span>
                        <span>Conversions: {feature.usageStats.conversions}</span>
                      </div>
                    )}
                    <div className="text-emerald-400 text-xs mt-1">Deployed: {feature.deployDate || 'N/A'}</div>
                  </div>
                </div>
                <button
                  onClick={() => { updateFeatureStatus(feature.id, 'disabled'); setFeatures([...FEATURE_FLAGS]); toast.error(`${feature.name} disabled`); }}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <ArrowDown className="w-4 h-4" /> Roll Back
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deploy Modal */}
      {deployModal.open && deployModal.feature && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700/50 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Deploy "{deployModal.feature.name}"</h3>
                <p className="text-slate-400 text-sm">Current status: {deployModal.feature.status.replace('_', ' ')}</p>
              </div>
              <button onClick={() => setDeployModal({ open: false, feature: null })} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select new status:</label>
                <div className="space-y-2">
                  {[
                    { value: 'admin_only', label: 'Keep Admin Only' },
                    { value: 'beta', label: 'Deploy to Beta Users' },
                    { value: 'suppliers', label: 'Deploy to All Suppliers' },
                    { value: 'buyers', label: 'Deploy to All Buyers' },
                    { value: 'shipping', label: 'Deploy to All Shipping Companies' },
                    { value: 'all_users', label: 'Deploy to ALL Users' },
                    { value: 'public', label: 'Make it Public (non-logged visitors)' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-700/50">
                      <input
                        type="radio"
                        name="deploy-status"
                        value={option.value}
                        checked={selectedStatus === option.value}
                        onChange={() => setSelectedStatus(option.value as FeatureStatus)}
                        className="w-4 h-4 text-amber-500"
                      />
                      <span className="text-white">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedStatus === 'beta' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Beta user emails (comma separated):</label>
                  <input
                    type="text"
                    value={betaUsers}
                    onChange={(e) => setBetaUsers(e.target.value)}
                    placeholder="user1@example.com, user2@example.com"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-700/50">
                <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Mail className="w-4 h-4" />
                  Notify users about this feature?
                </label>
                <textarea
                  placeholder="Optional announcement message..."
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none h-20"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={confirmDeploy}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Rocket className="w-4 h-4" /> Confirm Deploy
              </button>
              <button
                onClick={() => setDeployModal({ open: false, feature: null })}
                className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Monthly Expo Section
const MonthlyExpoSection = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'applications' | 'live' | 'analytics' | 'history'>('upcoming');
  const [applications, setApplications] = useState<ExpoApplication[]>(expoApplications);
  const [selectedApp, setSelectedApp] = useState<ExpoApplication | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingApps] = useState<ShippingExpoApplication[]>(shippingExpoApplications);
  const [selectedShipping, setSelectedShipping] = useState<ShippingExpoApplication | null>(null);
  const [expoLive, setExpoLive] = useState(false);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Expo', icon: Calendar },
    { id: 'applications', label: 'Applications', icon: Users },
    { id: 'live', label: 'Live Expo', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: Clock }
  ];

  const pendingApps = applications.filter(a => a.status === 'pending');
  const approvedApps = applications.filter(a => a.status === 'approved');
  const pendingShipping = shippingApps.filter(a => a.status === 'pending');
  const approvedShipping = shippingApps.filter(a => a.status === 'approved');

  const handleApprove = (app: ExpoApplication) => {
    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'approved' as const, approvedDate: new Date().toISOString().split('T')[0] } : a));
    setShowApproveModal(false);
    setSelectedApp(null);
  };

  const handleReject = (app: ExpoApplication) => {
    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'rejected' as const } : a));
    setShowRejectModal(false);
    setSelectedApp(null);
  };

  const totalRevenue = approvedApps.reduce((sum, app) => sum + app.payment, 0) + approvedShipping.reduce((sum, app) => sum + app.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Monthly Live Expo</h2>
          <p className="text-slate-400">Manage your virtual trade exhibition events</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${expoLive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-300'}`}>
            {expoLive ? 'EXPO LIVE' : 'STANDBY'}
          </span>
          <ActionButton
            icon={expoLive ? Pause : Play}
            label={expoLive ? 'End Expo' : 'Start Expo'}
            onClick={() => setExpoLive(!expoLive)}
            variant={expoLive ? 'danger' : 'primary'}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === 'applications' && pendingApps.length > 0 && (
              <span className="bg-amber-500 text-black text-xs px-1.5 py-0.5 rounded-full font-bold">{pendingApps.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Registered Companies</span>
                <Building2 className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-white">{upcomingExpo.registeredCompanies}</div>
              <div className="text-slate-500 text-sm">of {upcomingExpo.maxCompanies} max</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Confirmed Buyers</span>
                <Users className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-white">{upcomingExpo.confirmedBuyers}</div>
              <div className="text-slate-500 text-sm">pre-registered</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Rooms Booked</span>
                <DoorOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-white">{upcomingExpo.totalRoomsBooked}</div>
              <div className="text-slate-500 text-sm">of {upcomingExpo.maxRooms} available</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Expected Revenue</span>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-white">${totalRevenue}</div>
              <div className="text-slate-500 text-sm">confirmed earnings</div>
            </div>
          </div>

          {/* Expo Settings */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Expo Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Event Name</label>
                <input
                  type="text"
                  defaultValue={upcomingExpo.name}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Date</label>
                <input
                  type="date"
                  defaultValue={upcomingExpo.date}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Time (GST)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    defaultValue={upcomingExpo.startTime}
                    className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50"
                  />
                  <span className="text-slate-500">to</span>
                  <input
                    type="time"
                    defaultValue={upcomingExpo.endTime}
                    className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Registration Deadline</label>
                <input
                  type="date"
                  defaultValue={upcomingExpo.registrationDeadline}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <ActionButton icon={Save} label="Save Settings" onClick={() => {}} variant="primary" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-700/50 transition-all text-left group">
              <Mail className="w-8 h-8 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-semibold mb-1">Send Reminder Emails</h4>
              <p className="text-slate-400 text-sm">Notify all registered companies about upcoming expo</p>
            </button>
            <button className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-700/50 transition-all text-left group">
              <UserPlus className="w-8 h-8 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-semibold mb-1">Recruit More Buyers</h4>
              <p className="text-slate-400 text-sm">Invite additional buyers to the expo</p>
            </button>
            <button className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-700/50 transition-all text-left group">
              <FileText className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-semibold mb-1">Export Reports</h4>
              <p className="text-slate-400 text-sm">Download expo registration data</p>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-6">
          {/* Application Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{applications.length}</div>
              <div className="text-slate-400 text-sm">Total Applications</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-amber-400">{pendingApps.length}</div>
              <div className="text-slate-400 text-sm">Pending Review</div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-400">{approvedApps.length}</div>
              <div className="text-slate-400 text-sm">Approved</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-400">{applications.filter(a => a.status === 'rejected').length}</div>
              <div className="text-slate-400 text-sm">Rejected</div>
            </div>
          </div>

          {/* Pending Applications */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Pending Applications ({pendingApps.length})</h3>
            {pendingApps.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
                <CheckSquare className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-white font-medium">All caught up!</p>
                <p className="text-slate-400 text-sm">No pending applications to review</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingApps.map(app => (
                  <div key={app.id} className="bg-slate-800/50 border border-amber-500/30 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{app.flag}</span>
                        <div>
                          <h4 className="text-white font-semibold">{app.companyName}</h4>
                          <p className="text-slate-400 text-sm">{app.country}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.package === 'enterprise' ? 'bg-purple-500/20 text-purple-400' :
                        app.package === 'squad' ? 'bg-amber-500/20 text-amber-400' :
                        app.package === 'team' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {app.package.charAt(0).toUpperCase() + app.package.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-300">{app.sellers.length} seller(s) registered</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-slate-500" />
                        <span className="text-emerald-400">${app.payment} {app.paymentStatus}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-300">Applied: {app.submittedDate}</span>
                      </div>
                    </div>

                    {app.expoHeadline && (
                      <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                        <p className="text-amber-400 text-sm italic">"{app.expoHeadline}"</p>
                      </div>
                    )}

                    {app.message && (
                      <p className="text-slate-400 text-sm mb-4">{app.message}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedApp(app); setShowApproveModal(true); }}
                        className="flex-1 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => { setSelectedApp(app); setShowRejectModal(true); }}
                        className="flex-1 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Applications */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Approved Applications ({approvedApps.length})</h3>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Package</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Sellers</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Approved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {approvedApps.map(app => (
                    <tr key={app.id} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{app.flag}</span>
                          <span className="text-white font-medium">{app.companyName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-300 capitalize">{app.package}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-300">{app.sellers.length}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-emerald-400 font-medium">${app.payment}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-400 text-sm">{app.approvedDate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipping Applications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Shipping Partners ({shippingApps.length})</h3>
              <button
                onClick={() => setShowShippingModal(true)}
                className="text-amber-400 text-sm hover:text-amber-300"
              >
                + Add Shipping Partner
              </button>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Routes</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Containers</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {shippingApps.map(app => (
                    <tr key={app.id} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{app.flag}</span>
                          <span className="text-white font-medium">{app.companyName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {app.routes.slice(0, 2).map((route, i) => (
                            <span key={i} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">{route}</span>
                          ))}
                          {app.routes.length > 2 && <span className="text-slate-400 text-xs">+{app.routes.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-300">{app.containerTypes.length} types</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                          app.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'live' && (
        <div className="space-y-6">
          {!expoLive ? (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <Zap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Expo Not Active</h3>
              <p className="text-slate-400 mb-6">The expo is currently in standby mode. Start the expo to access live controls.</p>
              <ActionButton icon={Play} label="Start Expo" onClick={() => setExpoLive(true)} variant="primary" />
            </div>
          ) : (
            <>
              {/* Live Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-400 text-sm">Active Rooms</span>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold text-white">24</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 text-sm">Active Buyers</span>
                  </div>
                  <div className="text-3xl font-bold text-white">156</div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-400 text-sm">Meetings in Progress</span>
                  </div>
                  <div className="text-3xl font-bold text-white">38</div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 text-sm">Deals Closed Today</span>
                  </div>
                  <div className="text-3xl font-bold text-white">12</div>
                </div>
              </div>

              {/* Active Rooms */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Live Deal Rooms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          <span className="text-white font-medium">Room {String.fromCharCode(65 + i)}-{String(i + 1).padStart(2, '0')}</span>
                        </div>
                        <span className="text-xs text-emerald-400">LIVE</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-300 text-sm">{['OZMO Confectionery', 'Al Meera', 'Baladna', 'Al Jazeera', 'Gulf Foods', 'Desert Trade'][i]}</p>
                          <p className="text-slate-500 text-xs">{[3, 2, 4, 1, 3, 2][i]} buyers in queue</p>
                        </div>
                        <button className="text-amber-400 text-sm hover:text-amber-300">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Controls */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Emergency Controls
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg font-medium hover:bg-red-500/30 transition-colors">
                    Pause All Rooms
                  </button>
                  <button className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg font-medium hover:bg-red-500/30 transition-colors">
                    Broadcast Alert
                  </button>
                  <button
                    onClick={() => setExpoLive(false)}
                    className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
                  >
                    End Expo
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="text-slate-400 text-sm mb-2">Total Revenue</div>
              <div className="text-3xl font-bold text-emerald-400">${expoHistory.reduce((sum, e) => sum + e.revenue, 0)}</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="text-slate-400 text-sm mb-2">Total Deals</div>
              <div className="text-3xl font-bold text-white">{expoHistory.reduce((sum, e) => sum + e.deals, 0)}</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="text-slate-400 text-sm mb-2">Est. Deal Value</div>
              <div className="text-3xl font-bold text-amber-400">${(expoHistory.reduce((sum, e) => sum + e.estimatedValue, 0) / 1000000).toFixed(1)}M</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="text-slate-400 text-sm mb-2">Avg. Deals/Expo</div>
              <div className="text-3xl font-bold text-white">{Math.round(expoHistory.reduce((sum, e) => sum + e.deals, 0) / expoHistory.length)}</div>
            </div>
          </div>

          {/* Top Companies */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Performing Companies</h3>
            <div className="space-y-3">
              {[
                { name: 'Baladna Food Industries', deals: 8, value: 520000, flag: '🇶🇦' },
                { name: 'Al Meera Consumer Goods', deals: 6, value: 380000, flag: '🇶🇦' },
                { name: 'OZMO Confectionery', deals: 5, value: 290000, flag: '🇹🇷' },
                { name: 'Gulf Foods LLC', deals: 4, value: 210000, flag: '🇦🇪' },
                { name: 'Desert Spices Co.', deals: 3, value: 180000, flag: '🇸🇦' }
              ].map((company, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{company.flag}</span>
                    <div>
                      <p className="text-white font-medium">{company.name}</p>
                      <p className="text-slate-400 text-sm">{company.deals} deals</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-semibold">${(company.value / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Interest by Category</h3>
            <div className="space-y-4">
              {[
                { category: 'Dairy & Beverages', percentage: 78 },
                { category: 'FMCG General', percentage: 65 },
                { category: 'Confectionery', percentage: 52 },
                { category: 'Snacks & Biscuits', percentage: 48 },
                { category: 'Organic / Natural', percentage: 35 }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 text-sm">{item.category}</span>
                    <span className="text-amber-400 text-sm">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Expo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Companies</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Buyers</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Deals</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Est. Value</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {expoHistory.map(expo => (
                  <tr key={expo.id} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">{expo.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-300">{expo.date}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-300">{expo.companies}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-300">{expo.buyers}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-emerald-400 font-medium">{expo.deals}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-emerald-400">${expo.revenue}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-amber-400">${(expo.estimatedValue / 1000).toFixed(0)}K</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-amber-400 text-sm hover:text-amber-300">View Report</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export Historical Data */}
          <div className="flex justify-end">
            <ActionButton icon={Download} label="Export All Data" onClick={() => {}} variant="secondary" />
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Approve Application</h3>
              <p className="text-slate-400">Approve {selectedApp.companyName} ({selectedApp.flag}) for the upcoming expo?</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Package:</span>
                  <span className="text-white capitalize">{selectedApp.package}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-400">Payment:</span>
                  <span className="text-emerald-400">${selectedApp.payment}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-400">Sellers:</span>
                  <span className="text-white">{selectedApp.sellers.length}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowApproveModal(false); setSelectedApp(null); }}
                className="flex-1 px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(selectedApp)}
                className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Reject Application</h3>
              <p className="text-slate-400">Are you sure you want to reject {selectedApp.companyName}?</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">Reason (optional)</label>
              <textarea
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 resize-none"
                rows={3}
                placeholder="Provide a reason for rejection..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowRejectModal(false); setSelectedApp(null); }}
                className="flex-1 px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedApp)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Shipping Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Add Shipping Partner</h3>
              <button onClick={() => setShowShippingModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
                <input
                  type="text"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Routes</label>
                <div className="flex flex-wrap gap-2">
                  {availableRoutes.map((route, i) => (
                    <label key={i} className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-600/50">
                      <input type="checkbox" className="rounded border-slate-500" />
                      <span className="text-slate-300 text-sm">{route}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Container Types</label>
                <div className="flex flex-wrap gap-2">
                  {containerTypes.map((type, i) => (
                    <label key={i} className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-600/50">
                      <input type="checkbox" className="rounded border-slate-500" />
                      <span className="text-slate-300 text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowShippingModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowShippingModal(false)}
                className="flex-1 px-4 py-2.5 bg-amber-500 text-black rounded-lg hover:bg-amber-600 transition-colors font-medium"
              >
                Add Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Walk-in Buyer Management Section
const WalkinBuyerSection = () => {
  const [walkins, setWalkins] = useState(walkinBuyers);
  const [preRegs, setPreRegs] = useState(preRegisteredBuyers);
  const [activeTab, setActiveTab] = useState<'walkins' | 'pre-registered'>('walkins');
  const [search, setSearch] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  const tabs = [
    { id: 'walkins', label: 'Walk-in Buyers', icon: UserPlus, count: walkins.length },
    { id: 'pre-registered', label: 'Pre-Registered', icon: Users, count: preRegs.length }
  ];

  const filteredWalkins = walkins.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.company.toLowerCase().includes(search.toLowerCase()) ||
    w.country.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPreRegs = preRegs.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.company.toLowerCase().includes(search.toLowerCase()) ||
    p.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckIn = (buyer: any) => {
    setWalkins(prev => prev.map(w => w.id === buyer.id ? {
      ...w,
      checkedIn: true,
      checkInTime: new Date().toISOString()
    } : w));
    setShowCheckInModal(false);
    setSelectedBuyer(null);
    toast.success(`${buyer.name} checked in successfully!`);
  };

  const handleCheckOut = (buyer: any) => {
    setWalkins(prev => prev.map(w => w.id === buyer.id ? {
      ...w,
      checkedIn: false,
      checkInTime: undefined
    } : w));
    toast.success(`${buyer.name} checked out`);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      attended: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'no-show': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return `px-2.5 py-1 rounded-lg text-xs font-semibold border ${styles[status] || styles.pending}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Buyer Management</h2>
          <p className="text-slate-400">Manage walk-in and pre-registered buyers</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xl font-bold text-emerald-400">{walkins.filter(w => w.checkedIn).length}</div>
              <div className="text-xs text-slate-400">Checked In</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xl font-bold text-amber-400">{walkins.filter(w => !w.checkedIn).length}</div>
              <div className="text-xs text-slate-400">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === tab.id ? 'bg-purple-500/40 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, company, or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* Walk-in Buyers Table */}
      {activeTab === 'walkins' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Buyer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Products</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Target Markets</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Meetings</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredWalkins.map(buyer => (
                <tr key={buyer.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {buyer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{buyer.name}</div>
                        <div className="text-slate-400 text-sm">{buyer.countryFlag} {buyer.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-white">{buyer.company}</div>
                    <div className="text-slate-500 text-xs">{buyer.email}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {buyer.products.slice(0, 2).map((product, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded">
                          {product}
                        </span>
                      ))}
                      {buyer.products.length > 2 && (
                        <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded">
                          +{buyer.products.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {buyer.targetCountries.map((country, i) => (
                        <span key={i} className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">
                          {country}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      buyer.checkedIn
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-600/50 text-slate-400 border-slate-600/50'
                    }`}>
                      {buyer.checkedIn ? 'Checked In' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-center">
                      <div className="text-white font-medium">{buyer.meetingsHeld}</div>
                      <div className="text-slate-500 text-xs">meetings</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {buyer.checkedIn ? (
                        <>
                          <button
                            onClick={() => toast.success(`Opening chat with ${buyer.name}`)}
                            className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-colors"
                            title="Message"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCheckOut(buyer)}
                            className="p-2 hover:bg-amber-500/20 rounded-lg text-amber-400 transition-colors"
                            title="Check Out"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedBuyer(buyer);
                            setShowCheckInModal(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium transition-colors"
                        >
                          Check In
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedBuyer(buyer);
                          toast.success(`Viewing ${buyer.name}'s profile`);
                        }}
                        className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredWalkins.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No walk-in buyers found
            </div>
          )}
        </div>
      )}

      {/* Pre-Registered Buyers Table */}
      {activeTab === 'pre-registered' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Buyer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Interests</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Target Markets</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Meetings</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredPreRegs.map(buyer => (
                <tr key={buyer.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                        {buyer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{buyer.name}</div>
                        <div className="text-slate-400 text-sm">{buyer.countryFlag} {buyer.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {buyer.productInterests.slice(0, 2).map((interest, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                          {interest}
                        </span>
                      ))}
                      {buyer.productInterests.length > 2 && (
                        <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded">
                          +{buyer.productInterests.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {buyer.targetCountries.map((country, i) => (
                        <span key={i} className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">
                          {country}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={getStatusBadge(buyer.status)}>
                      {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-center">
                      <div className="text-white font-medium">{buyer.meetingsCompleted}/{buyer.meetingsScheduled}</div>
                      <div className="text-slate-500 text-xs">completed</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toast.success(`Sending reminder to ${buyer.name}`)}
                        className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-colors"
                        title="Send Reminder"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toast.success(`Viewing ${buyer.name}'s profile`)}
                        className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPreRegs.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No pre-registered buyers found
            </div>
          )}
        </div>
      )}

      {/* Check-In Confirmation Modal */}
      {showCheckInModal && selectedBuyer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700/50 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Confirm Check-In</h3>
              <button onClick={() => { setShowCheckInModal(false); setSelectedBuyer(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedBuyer.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold">{selectedBuyer.name}</div>
                  <div className="text-slate-400 text-sm">{selectedBuyer.company}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Email:</span>
                  <div className="text-white">{selectedBuyer.email}</div>
                </div>
                <div>
                  <span className="text-slate-500">WhatsApp:</span>
                  <div className="text-white">{selectedBuyer.whatsapp}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowCheckInModal(false); setSelectedBuyer(null); }}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCheckIn(selectedBuyer)}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
              >
                Confirm Check-In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Launch Events Section
const LaunchEventsSection = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState(LAUNCH_EVENTS);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      recruiting: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      completed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status] || colors.planning;
  };

  const getFeatureName = (featureId: string) => {
    const feature = FEATURE_FLAGS.find(f => f.id === featureId);
    return feature ? `${feature.icon} ${feature.name}` : featureId;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Launch Events</h2>
          <p className="text-slate-400">Manage feature launch events and beta testing campaigns</p>
        </div>
        <ActionButton
          icon={Plus}
          label="Create Launch Event"
          onClick={() => setShowCreateModal(true)}
          variant="primary"
        />
      </div>

      {/* Events Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Event</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Feature</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Target Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Invitations</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-4 py-4">
                  <div className="text-white font-medium">{event.name}</div>
                  <div className="text-slate-400 text-sm">{event.description}</div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-white">{getFeatureName(event.featuredFeature)}</span>
                </td>
                <td className="px-4 py-4 text-slate-300">{event.targetDate}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Invited: </span>
                      <span className="text-white font-medium">{event.invitedCompanies.length}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400">Accepted: </span>
                      <span className="text-white font-medium">{event.acceptedCount}</span>
                    </div>
                    <div>
                      <span className="text-amber-400">Pending: </span>
                      <span className="text-white font-medium">{event.pendingCount}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toast.success(`Reminder sent for: ${event.name}`)}
                      className="p-1.5 hover:bg-blue-500/20 rounded text-blue-400 hover:text-blue-300"
                      title="Send Reminder"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Incentive Templates */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Incentive Templates</h3>
        <p className="text-slate-400 text-sm mb-4">Quick templates for launch event incentives:</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '💰', title: 'Free Trial', desc: '3 months free Growth plan' },
            { icon: '⭐', title: 'Featured Listing', desc: '6 months featured booth' },
            { icon: '🎯', title: 'Early Access', desc: 'First access + co-marketing' }
          ].map((template, i) => (
            <div key={i} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
              <span className="text-2xl">{template.icon}</span>
              <div className="text-white font-medium mt-2">{template.title}</div>
              <div className="text-slate-400 text-sm">{template.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700/50 rounded-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Create Launch Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Event Name</label>
                <input
                  type="text"
                  placeholder="e.g., VR Expo Beta Launch"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Featured Feature</label>
                <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500">
                  <option value="">Select a feature...</option>
                  {FEATURE_FLAGS.filter(f => f.status === 'disabled' || f.status === 'admin_only').map(f => (
                    <option key={f.id} value={f.id}>{f.icon} {f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  placeholder="Describe the launch event..."
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Incentive Offered</label>
                <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500">
                  <option value="">Select incentive...</option>
                  <option value="3months">3 months free Growth plan</option>
                  <option value="6featured">6 months featured listing</option>
                  <option value="earlyaccess">Early access + co-marketing</option>
                  <option value="custom">Custom incentive...</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowCreateModal(false); toast.success('Launch event created!'); }}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" /> Create Event
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PlatformSettingsSection = () => {
  const [pricing, setPricing] = useState({ growth: 199, enterprise: 499, shippingFeatured: 149 });
  const [notifications, setNotifications] = useState({
    welcomeEmails: true,
    claimEmails: true,
    weeklyReports: true,
    alertAdmin: true
  });

  return (
    <div className="space-y-6">
      <SectionHeader title="⚙️ Platform Settings" subtitle="Configure global platform settings" />

      {/* Pricing Settings */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-amber-400" />
          Pricing Settings
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="text-slate-400 text-sm mb-2">Starter</div>
            <div className="text-white font-bold text-xl">Free</div>
            <div className="text-slate-500 text-xs">(locked)</div>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="text-slate-400 text-sm mb-2">Growth</div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-xl">${pricing.growth}</span>
              <span className="text-slate-400 text-sm">/mo</span>
            </div>
            <input
              type="number"
              value={pricing.growth}
              onChange={(e) => setPricing({ ...pricing, growth: parseInt(e.target.value) || 0 })}
              className="w-full mt-2 px-3 py-1.5 bg-slate-600/50 rounded text-white text-sm"
            />
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="text-slate-400 text-sm mb-2">Enterprise</div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-xl">${pricing.enterprise}</span>
              <span className="text-slate-400 text-sm">/mo</span>
            </div>
            <input
              type="number"
              value={pricing.enterprise}
              onChange={(e) => setPricing({ ...pricing, enterprise: parseInt(e.target.value) || 0 })}
              className="w-full mt-2 px-3 py-1.5 bg-slate-600/50 rounded text-white text-sm"
            />
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="text-slate-400 text-sm mb-2">Shipping Featured</div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-xl">${pricing.shippingFeatured}</span>
              <span className="text-slate-400 text-sm">/mo</span>
            </div>
            <input
              type="number"
              value={pricing.shippingFeatured}
              onChange={(e) => setPricing({ ...pricing, shippingFeatured: parseInt(e.target.value) || 0 })}
              className="w-full mt-2 px-3 py-1.5 bg-slate-600/50 rounded text-white text-sm"
            />
          </div>
        </div>
        <ActionButton icon={Check} label="Save Pricing Changes" onClick={() => toast.success('Pricing updated!')} variant="teal" />
      </div>

      {/* Notification Settings */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          Notification Settings
        </h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-slate-300">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-emerald-500' : 'bg-slate-600'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-red-400" />
          Maintenance Mode
        </h3>
        <ActionButton icon={AlertTriangle} label="Enable Maintenance Mode" onClick={() => toast.success('Maintenance mode enabled')} variant="danger" />
      </div>
    </div>
  );
};

const RevenueDashboardSection = () => (
  <div className="space-y-6">
    <SectionHeader title="💰 Revenue & Financial Overview" subtitle="Platform financial metrics" />

    {/* KPIs */}
    <div className="grid grid-cols-4 gap-4">
      <KPICard icon={DollarSign} label="Total MRR" value="$4,850" subtext="Monthly recurring" trend="+12%" trendUp={true} color="bg-emerald-500/20 text-emerald-400" />
      <KPICard icon={TrendingUp} label="Total ARR" value="$58,200" subtext="Annual recurring" trendUp={true} color="bg-blue-500/20 text-blue-400" />
      <KPICard icon={Calendar} label="This Month" value="$41,250" subtext="January 2024" trend="+32%" trendUp={true} color="bg-amber-500/20 text-amber-400" />
      <KPICard icon={Users} label="Active Subscriptions" value={12} subtext="Paid accounts" trendUp={true} color="bg-purple-500/20 text-purple-400" />
    </div>

    {/* Subscription Table */}
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-700/50">
        <h3 className="text-white font-semibold">Active Subscriptions</h3>
      </div>
      <table className="w-full">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Plan</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Next Billing</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          <tr className="hover:bg-slate-700/30">
            <td className="px-4 py-3 text-white font-medium">Al Meera</td>
            <td className="px-4 py-3 text-amber-400">Growth</td>
            <td className="px-4 py-3 text-emerald-400 font-semibold">$199/mo</td>
            <td className="px-4 py-3 text-slate-400 text-sm">Feb 1, 2024</td>
            <td className="px-4 py-3"><StatusBadge status="Active" /></td>
          </tr>
          <tr className="hover:bg-slate-700/30">
            <td className="px-4 py-3 text-white font-medium">Baladna</td>
            <td className="px-4 py-3 text-amber-400">Enterprise</td>
            <td className="px-4 py-3 text-emerald-400 font-semibold">$499/mo</td>
            <td className="px-4 py-3 text-slate-400 text-sm">Feb 5, 2024</td>
            <td className="px-4 py-3"><StatusBadge status="Active" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const ActivityLogsSection = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-white">Activity Logs</h2>
        <p className="text-slate-400 text-sm">Full audit trail of all platform actions</p>
      </div>
      <button onClick={() => toast.success('Downloading logs...')} className="flex items-center gap-2 px-4 py-2 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-lg transition-colors">
        <Download className="w-4 h-4" />
        Download CSV
      </button>
    </div>

    {/* Filters */}
    <div className="flex flex-wrap items-center gap-4">
      <SearchBar placeholder="Search logs..." value="" onChange={() => {}} />
      <FilterSelect options={['All Activity', 'Company Updates', 'User Logins', 'RFQs']} value="All Activity" onChange={() => {}} />
      <FilterSelect options={['All Users', 'Admin', 'Suppliers', 'Buyers']} value="All Users" onChange={() => {}} />
    </div>

    {/* Logs Table */}
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Timestamp</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">User</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Action</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Details</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">IP Address</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {sampleActivityLogs.map((log) => (
            <tr key={log.id} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-4 py-3 text-slate-400 text-sm">
                {log.timestamp.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-blue-400 text-sm">{log.user}</td>
              <td className="px-4 py-3 text-white text-sm">{log.action}</td>
              <td className="px-4 py-3 text-slate-400 text-sm">{log.details}</td>
              <td className="px-4 py-3 text-slate-500 text-sm">{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SystemHealthSection = () => (
  <div className="space-y-6">
    <SectionHeader title="🛠️ System Health" subtitle="Real-time platform status" />

    {/* Services Status */}
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">Services Status</h3>
      <div className="grid grid-cols-3 gap-4">
        {serviceStatuses.map((service) => (
          <div key={service.name} className="bg-slate-700/50 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                service.status === 'online' ? 'bg-emerald-500' :
                service.status === 'warning' ? 'bg-amber-500' :
                'bg-red-500'
              }`} />
              <span className="text-white">{service.name}</span>
            </div>
            <span className="text-slate-400 text-sm">{service.latency}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Performance Metrics */}
    <div className="grid grid-cols-4 gap-4">
      <KPICard icon={Clock} label="Response Time" value="245ms" subtext="Average latency" trendDown={false} color="bg-blue-500/20 text-blue-400" />
      <KPICard icon={Signal} label="Uptime" value="99.8%" subtext="Last 30 days" trendUp={true} color="bg-emerald-500/20 text-emerald-400" />
      <KPICard icon={Users} label="Active Sessions" value={12} subtext="Current users" trendUp={true} color="bg-purple-500/20 text-purple-400" />
      <KPICard icon={HardDrive} label="Bandwidth" value="45%" subtext="Capacity used" trendUp={true} color="bg-amber-500/20 text-amber-400" />
    </div>
  </div>
);

// ============================================
// LIVE ROOMS SECTION (Keep Existing)
// ============================================

const LiveRoomsSection = () => (
  <div className="space-y-6">
    <SectionHeader title="🔴 Live Deal Rooms" subtitle="Monitor active broadcasting sessions" />

    {/* Quick Stats */}
    <div className="grid grid-cols-4 gap-4">
      <KPICard icon={Radio} label="Active Sessions" value={4} subtext="Currently live" trendUp={true} color="bg-emerald-500/20 text-emerald-400" />
      <KPICard icon={Users} label="Buyers in Queues" value={77} subtext="Total waiting" trendUp={true} color="bg-amber-500/20 text-amber-400" />
      <KPICard icon={DollarSign} label="Session Revenue" value="$86,500" subtext="Combined total" trendUp={true} color="bg-purple-500/20 text-purple-400" />
      <KPICard icon={CheckCircle2} label="Deals Closed" value={27} subtext="Today" trendUp={true} color="bg-blue-500/20 text-blue-400" />
    </div>

    {/* Sessions Grid */}
    <div className="grid grid-cols-2 gap-4">
      {[
        { name: 'Qatar National I&E', flag: '🇶🇦', duration: '2h 15m', revenue: '$18,500', deals: 6, queue: 18 },
        { name: 'Baladna Food Industries', flag: '🇶🇦', duration: '1h 45m', revenue: '$24,000', deals: 9, queue: 28 },
        { name: 'Almarai Company', flag: '🇸🇦', duration: '3h 20m', revenue: '$31,200', deals: 12, queue: 35 },
        { name: 'Al Ain Farms', flag: '🇦🇪', duration: '35m', revenue: '$12,800', deals: 5, queue: 14 },
      ].map((session, idx) => (
        <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold">
                {session.name[0]}
              </div>
              <div>
                <h4 className="text-white font-semibold">{session.name}</h4>
                <span className="text-lg">{session.flag}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 text-xs font-semibold">LIVE</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-700/30 p-2 rounded">
              <div className="text-slate-400 text-xs">Duration</div>
              <div className="text-white font-semibold">{session.duration}</div>
            </div>
            <div className="bg-slate-700/30 p-2 rounded">
              <div className="text-slate-400 text-xs">Revenue</div>
              <div className="text-emerald-400 font-semibold">${session.revenue}</div>
            </div>
            <div className="bg-slate-700/30 p-2 rounded">
              <div className="text-slate-400 text-xs">Deals</div>
              <div className="text-white font-semibold">{session.deals}</div>
            </div>
            <div className="bg-slate-700/30 p-2 rounded">
              <div className="text-slate-400 text-xs">Queue</div>
              <div className="text-amber-400 font-semibold">{session.queue} waiting</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 text-sm">
              <Eye className="w-4 h-4 inline mr-1" /> Spectate
            </button>
            <button className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 text-sm">
              <XCircle className="w-4 h-4 inline mr-1" /> Force End
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Global Controls */}
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-slate-400 text-sm">Global Controls:</span>
        <ActionButton icon={Pause} label="Pause All Sessions" onClick={() => toast.success('All sessions paused')} variant="danger" />
        <ActionButton icon={MessageSquare} label="Platform Announcement" onClick={() => toast.success('Opening announcement modal')} variant="outline" />
      </div>
      <span className="text-slate-500 text-sm">Last updated: {new Date().toLocaleTimeString()}</span>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function SuperAdminOps() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SidebarSection>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const sidebarSections: { id: SidebarSection; label: string; icon: any; section?: string }[] = [
    { id: 'overview', label: 'Dashboard Home', icon: Home, section: 'Overview' },
    { id: 'companies', label: 'All Companies', icon: Building2, section: 'Companies' },
    { id: 'upload', label: 'Upload Companies', icon: Upload, section: 'Companies' },
    { id: 'unclaimed', label: 'Unclaimed Profiles', icon: AlertTriangle, section: 'Companies' },
    { id: 'verified', label: 'Verified Companies', icon: CheckCircle2, section: 'Companies' },
    { id: 'profiles', label: 'Company Profiles', icon: Eye, section: 'Companies' },
    { id: 'buyers', label: 'Buyers', icon: ShoppingCart, section: 'Users' },
    { id: 'suppliers', label: 'Suppliers', icon: Package, section: 'Users' },
    { id: 'shipping', label: 'Shipping Companies', icon: Ship, section: 'Users' },
    { id: 'all-users', label: 'All Users', icon: Users, section: 'Users' },
    { id: 'suspended', label: 'Suspended Users', icon: Ban, section: 'Users' },
    { id: 'live-rooms', label: 'Live Deal Rooms', icon: Video, section: 'Platform' },
    { id: 'cargo', label: 'Cargo Auctions', icon: Package, section: 'Platform' },
    { id: 'market', label: 'Market Prices', icon: BarChart3, section: 'Platform' },
    { id: 'virtual-booths', label: 'Virtual Booths', icon: Eye, section: 'Platform' },
    { id: 'email-campaigns', label: 'Email Campaigns', icon: Mail, section: 'Platform' },
    { id: 'ad-campaigns', label: 'Ad Campaigns', icon: Megaphone, section: 'Platform' },
    { id: 'monthly-expo', label: 'Monthly Expo', icon: Calendar, section: 'Platform' },
    { id: 'walkin-buyers', label: 'Buyer Management', icon: Users, section: 'Platform' },
    { id: 'feature-lab', label: 'Feature Testing Lab', icon: Cpu, section: 'Features' },
    { id: 'launch-events', label: 'Launch Events', icon: Sparkles, section: 'Features' },
    { id: 'deploy', label: 'Deploy to Live', icon: Rocket, section: 'Features' },
    { id: 'settings', label: 'Platform Settings', icon: Settings, section: 'Features' },
    { id: 'notifications', label: 'Notifications', icon: Bell, section: 'Features' },
    { id: 'revenue', label: 'Revenue Dashboard', icon: DollarSign, section: 'Analytics' },
    { id: 'analytics', label: 'Growth Analytics', icon: TrendingUp, section: 'Analytics' },
    { id: 'market-intel', label: 'Market Intelligence', icon: Globe, section: 'Analytics' },
    { id: 'security', label: 'Security & Access', icon: Shield, section: 'System' },
    { id: 'activity-logs', label: 'Activity Logs', icon: FileText, section: 'System' },
    { id: 'system-health', label: 'System Health', icon: Activity, section: 'System' },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <DashboardHome />;
      case 'companies': return <AllCompaniesSection />;
      case 'upload': return <UploadCompaniesSection />;
      case 'unclaimed': return <UnclaimedProfilesSection />;
      case 'buyers': return <BuyersSection />;
      case 'suppliers': return <SuppliersSection />;
      case 'shipping': return <ShippingSection />;
      case 'live-rooms': return <LiveRoomsSection />;
      case 'monthly-expo': return <MonthlyExpoSection />;
      case 'walkin-buyers': return <WalkinBuyerSection />;
      case 'feature-lab': return <FeatureLabSection />;
      case 'launch-events': return <LaunchEventsSection />;
      case 'settings': return <PlatformSettingsSection />;
      case 'revenue': return <RevenueDashboardSection />;
      case 'activity-logs': return <ActivityLogsSection />;
      case 'system-health': return <SystemHealthSection />;
      default: return <DashboardHome />;
    }
  };

  // Group sections by section header
  const groupedSections = sidebarSections.reduce((acc, item) => {
    if (!acc[item.section!]) acc[item.section!] = [];
    acc[item.section!].push(item);
    return acc;
  }, {} as Record<string, typeof sidebarSections>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* ============================================ */}
      {/* LEFT SIDEBAR */}
      {/* ============================================ */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-56'} bg-[#020817] border-r border-[#162438] flex flex-col transition-all duration-300`}>
        {/* Gold Accent Line */}
        <div className="h-1 bg-gradient-to-r from-[#D4AF37] via-[#F5D67A] to-[#D4AF37]" />

        {/* Logo */}
        <div className="p-4 border-b border-[#162438]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#020817]" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="text-xs text-[#D4AF37] font-semibold">Brands Bridge AI</div>
                <div className="text-[10px] text-slate-500">Control Center</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {Object.entries(groupedSections).map(([section, items]) => (
            <div key={section} className="mb-4">
              {!sidebarCollapsed && (
                <div className="px-4 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {section}
                </div>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-400'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-2 border-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-4 border-t border-[#162438] text-slate-500 hover:text-white transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="w-5 h-5 mx-auto" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="h-15 bg-[#020817] border-b border-[#162438] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-white font-bold text-lg">Super Admin Control Center</h1>
            <span className="text-[#D4AF37] text-sm">Brands Bridge AI</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <SearchBar placeholder="Search companies, users, deals..." value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* System Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 text-xs font-semibold">All Systems Online</span>
            </div>

            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">3</span>
            </button>

            <ActionButton icon={RefreshCw} label="Refresh" onClick={() => toast.success('Data refreshed')} variant="outline" />
            <ActionButton icon={BarChart3} label="Generate Report" onClick={() => toast.success('Opening report modal')} variant="primary" />

            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-full flex items-center justify-center text-[#020817] font-bold text-sm">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="text-sm">
                <div className="text-white font-medium">{user?.name || 'Admin'}</div>
                <div className="text-slate-500 text-xs">Super Admin</div>
              </div>
            </div>

            <button onClick={handleLogout} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
