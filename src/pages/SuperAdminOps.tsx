import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Users,
  DollarSign,
  Server,
  Video,
  Clock,
  Eye,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Zap,
  TrendingUp,
  TrendingDown,
  Signal,
  RefreshCw,
  Building2,
  Flag,
  Play,
  Pause,
  Ban,
  Bell,
  Sparkles,
  BarChart3,
  Globe,
  Shield,
  Radio,
  X,
  Loader2,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ============================================
// DATA TYPES
// ============================================

interface LiveSession {
  id: string;
  companyName: string;
  companyLogo: string;
  flag: string;
  category: string;
  startedAt: Date;
  duration: number; // in seconds
  dealsClosed: number;
  queueLength: number;
  avgWaitTime: number;
  revenue: number;
  status: 'live' | 'paused';
  salesReps: number;
  avgDealValue: number;
}

interface BroadcastRequest {
  id: string;
  companyName: string;
  flag: string;
  category: string;
  requestedDate: string;
  requestedTime: string;
  duration: number; // in minutes
  packageType: 'standard' | 'vip' | 'sponsored';
  status: 'pending' | 'approved' | 'rejected';
  contactEmail: string;
  notes: string;
}

interface AIAlert {
  id: string;
  type: 'warning' | 'critical' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: Date;
  actionRequired: boolean;
  affectedSession?: string;
}

// ============================================
// SAMPLE DATA
// ============================================

const liveSessions: LiveSession[] = [
  {
    id: '1',
    companyName: 'Qatar National I&E',
    companyLogo: 'Q',
    flag: '🇶🇦',
    category: 'FMCG & Confectionery',
    startedAt: new Date(Date.now() - 3600000 * 2),
    duration: 7200,
    dealsClosed: 6,
    queueLength: 18,
    avgWaitTime: 6,
    revenue: 18500,
    status: 'live',
    salesReps: 2,
    avgDealValue: 45000
  },
  {
    id: '2',
    companyName: 'Baladna Food Industries',
    companyLogo: 'B',
    flag: '🇶🇦',
    category: 'Dairy & Beverages',
    startedAt: new Date(Date.now() - 3600000 * 1.5),
    duration: 5400,
    dealsClosed: 9,
    queueLength: 28,
    avgWaitTime: 8,
    revenue: 24000,
    status: 'live',
    salesReps: 3,
    avgDealValue: 52000
  },
  {
    id: '3',
    companyName: 'Almarai Company',
    companyLogo: 'A',
    flag: '🇸🇦',
    category: 'Dairy & Bakery',
    startedAt: new Date(Date.now() - 3600000 * 3),
    duration: 10800,
    dealsClosed: 12,
    queueLength: 35,
    avgWaitTime: 20,
    revenue: 31200,
    status: 'live',
    salesReps: 4,
    avgDealValue: 48000
  },
  {
    id: '4',
    companyName: 'Al Ain Farms',
    companyLogo: 'A',
    flag: '🇦🇪',
    category: 'Dairy & Fresh Food',
    startedAt: new Date(Date.now() - 3600000 * 0.5),
    duration: 1800,
    dealsClosed: 5,
    queueLength: 14,
    avgWaitTime: 4,
    revenue: 12800,
    status: 'live',
    salesReps: 2,
    avgDealValue: 55000
  }
];

const broadcastRequests: BroadcastRequest[] = [
  {
    id: '1',
    companyName: 'Americana Foods',
    flag: '🇦🇪',
    category: 'Frozen Foods',
    requestedDate: '2024-12-20',
    requestedTime: '14:00 - 16:00',
    duration: 120,
    packageType: 'vip',
    status: 'pending',
    contactEmail: 'export@americana-food.com',
    notes: 'Requesting premium slot'
  },
  {
    id: '2',
    companyName: 'Gulf Food Industries',
    flag: '🇰🇼',
    category: 'Confectionery',
    requestedDate: '2024-12-21',
    requestedTime: '10:00 - 12:00',
    duration: 120,
    packageType: 'standard',
    status: 'pending',
    contactEmail: 'export@gfi.com.kw',
    notes: 'Standard broadcast request'
  },
  {
    id: '3',
    companyName: 'Savola Group',
    flag: '🇸🇦',
    category: 'Oils & Fats',
    requestedDate: '2024-12-22',
    requestedTime: '09:00 - 11:00',
    duration: 90,
    packageType: 'sponsored',
    status: 'pending',
    contactEmail: 'export@savola.com',
    notes: 'Sponsored slot with extra promotional push'
  },
  {
    id: '4',
    companyName: 'National Food Industries',
    flag: '🇦🇪',
    category: 'Asian Snacks',
    requestedDate: '2024-12-23',
    requestedTime: '15:00 - 17:00',
    duration: 120,
    packageType: 'vip',
    status: 'pending',
    contactEmail: 'global@koreansnacks.kr',
    notes: 'VIP with translator requested'
  }
];

const aiAlerts: AIAlert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'High Queue Wait Time',
    description: 'Euro Arcade queue is moving too slow (avg 20 mins wait). Consider adding a second sales rep.',
    timestamp: new Date(Date.now() - 300000),
    actionRequired: true,
    affectedSession: 'Euro Arcade'
  },
  {
    id: '2',
    type: 'critical',
    title: 'Video Quality Degradation',
    description: 'OZMO Foods experiencing video latency issues. Bandwidth throttling detected on their connection.',
    timestamp: new Date(Date.now() - 600000),
    actionRequired: true,
    affectedSession: 'OZMO Foods'
  },
  {
    id: '3',
    type: 'success',
    title: 'Peak Performance',
    description: 'All servers operating at optimal capacity. Zero downtime in the last 24 hours.',
    timestamp: new Date(Date.now() - 900000),
    actionRequired: false
  },
  {
    id: '4',
    type: 'info',
    title: 'New VIP Request',
    description: 'Nature Valley Foods submitted VIP broadcast request for Dec 20th. Premium package includes homepage promotion.',
    timestamp: new Date(Date.now() - 1200000),
    actionRequired: true
  },
  {
    id: '5',
    type: 'warning',
    title: 'Revenue Spike Detected',
    description: 'Almarai exceeded daily revenue target by 45%. High-value deals being closed in dairy category.',
    timestamp: new Date(Date.now() - 1800000),
    actionRequired: false,
    affectedSession: 'Almarai'
  }
];

// ============================================
// HELPER COMPONENTS
// ============================================

const MetricCard = ({ icon: Icon, label, value, subtext, trend, trendUp, color }: {
  icon: any;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  trendUp?: boolean;
  color: string;
}) => (
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

const LiveSessionCard = ({ session, onSpectate, onForceEnd }: {
  session: LiveSession;
  onSpectate: () => void;
  onForceEnd: () => void;
}) => {
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 hover:border-emerald-500/30 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/20">
            {session.companyLogo}
          </div>
          <div>
            <h4 className="text-white font-semibold flex items-center gap-2">
              {session.companyName}
              <span className="text-lg">{session.flag}</span>
            </h4>
            <p className="text-slate-400 text-sm">{session.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 text-xs font-semibold">LIVE</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Clock className="w-3 h-3" />
            Duration
          </div>
          <div className="text-white font-semibold">{formatDuration(session.duration)}</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <DollarSign className="w-3 h-3" />
            Revenue
          </div>
          <div className="text-emerald-400 font-semibold">${session.revenue.toLocaleString()}</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <CheckCircle2 className="w-3 h-3" />
            Deals Closed
          </div>
          <div className="text-white font-semibold">{session.dealsClosed}</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Users className="w-3 h-3" />
            Queue
          </div>
          <div className="text-amber-400 font-semibold">{session.queueLength} waiting</div>
        </div>
      </div>

      {/* Mini Sparkline Indicator */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-slate-700/20 rounded-lg">
        <Signal className="w-4 h-4 text-slate-400" />
        <div className="flex-1 h-2 bg-slate-600/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '85%' }}></div>
        </div>
        <span className="text-xs text-emerald-400 font-medium">85%</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onSpectate}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded-lg font-medium transition-all border border-blue-500/30"
        >
          <Eye className="w-4 h-4" />
          Spectate
        </button>
        <button
          onClick={onForceEnd}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg font-medium transition-all border border-red-500/30"
        >
          <XCircle className="w-4 h-4" />
          Force End
        </button>
      </div>
    </div>
  );
};

const RequestCard = ({ request, onApprove, onReject }: {
  request: BroadcastRequest;
  onApprove: () => void;
  onReject: () => void;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<'approve' | 'reject' | null>(null);

  const handleApprove = () => {
    setIsAnimating(true);
    setAnimationType('approve');
    setTimeout(() => {
      onApprove();
      setIsAnimating(false);
      setAnimationType(null);
    }, 600);
  };

  const handleReject = () => {
    setIsAnimating(true);
    setAnimationType('reject');
    setTimeout(() => {
      onReject();
      setIsAnimating(false);
      setAnimationType(null);
    }, 600);
  };

  return (
    <div
      className={`bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 transition-all duration-500 ${
        isAnimating
          ? animationType === 'approve'
            ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 transform translate-x-4 opacity-0'
            : 'border-red-500 shadow-lg shadow-red-500/20 transform -translate-x-4 opacity-0'
          : 'hover:border-slate-600/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-semibold">
            {request.flag}
          </div>
          <div>
            <h4 className="text-white font-semibold">{request.companyName}</h4>
            <p className="text-slate-400 text-sm">{request.category}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          request.packageType === 'vip' ? 'bg-amber-500/20 text-amber-400' :
          request.packageType === 'sponsored' ? 'bg-purple-500/20 text-purple-400' :
          'bg-slate-500/20 text-slate-400'
        }`}>
          {request.packageType.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300">{request.requestedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300">{request.requestedTime}</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-4 italic">{request.notes}</p>

      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={isAnimating}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-2 rounded-lg font-medium transition-all border border-emerald-500/30 disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          Approve
        </button>
        <button
          onClick={handleReject}
          disabled={isAnimating}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg font-medium transition-all border border-red-500/30 disabled:opacity-50"
        >
          <Ban className="w-4 h-4" />
          Reject
        </button>
      </div>
    </div>
  );
};

const AlertItem = ({ alert, onTakeAction }: { alert: AIAlert; onTakeAction: (alert: AIAlert) => void }) => {
  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical': return { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertTriangle, iconColor: 'text-red-400' };
      case 'warning': return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle, iconColor: 'text-amber-400' };
      case 'success': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle2, iconColor: 'text-emerald-400' };
      default: return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Bell, iconColor: 'text-blue-400' };
    }
  };

  const style = getAlertStyle(alert.type);
  const Icon = style.icon;

  const timeAgo = (date: Date) => {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 flex items-start gap-3`}>
      <Icon className={`w-5 h-5 ${style.iconColor} mt-0.5 flex-shrink-0`} />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-white font-semibold text-sm">{alert.title}</h4>
          <span className="text-xs text-slate-500">{timeAgo(alert.timestamp)}</span>
        </div>
        <p className="text-slate-400 text-sm">{alert.description}</p>
        {alert.actionRequired && (
          <button
            onClick={() => onTakeAction(alert)}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Take Action <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function SuperAdminOps() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(liveSessions);
  const [requests, setRequests] = useState(broadcastRequests);
  const [alerts, setAlerts] = useState(aiAlerts);
  const [activeTab, setActiveTab] = useState<'live' | 'requests' | 'alerts'>('live');
  const [serverHealth, setServerHealth] = useState(98);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSpectateModal, setShowSpectateModal] = useState(false);
  const [spectateCompany, setSpectateCompany] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showConfirmEndModal, setShowConfirmEndModal] = useState(false);
  const [sessionToEnd, setSessionToEnd] = useState('');
  const [showAlertActionModal, setShowAlertActionModal] = useState(false);
  const [alertAction, setAlertAction] = useState<AIAlert | null>(null);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [allSessionsPaused, setAllSessionsPaused] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Helper function for currency formatting
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  // Calculate totals
  const totalActiveRooms = sessions.length;
  const totalBuyersInQueues = sessions.reduce((sum, s) => sum + s.queueLength, 0);
  const totalRevenueToday = sessions.reduce((sum, s) => sum + s.revenue, 0) + 1250; // Including fixed amount
  const totalDealsClosed = sessions.reduce((sum, s) => sum + s.dealsClosed, 0);

  // Simulate server health fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setServerHealth(prev => {
        const change = (Math.random() - 0.5) * 2;
        return Math.min(100, Math.max(95, prev + change));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
      toast.success('Data refreshed successfully!');
    }, 1000);
  };

  // Handle Generate Report
  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  // Handle Spectate
  const handleSpectate = (companyName: string) => {
    setSpectateCompany(companyName);
    setShowSpectateModal(true);
  };

  // Handle Force End Confirmation
  const handleForceEndClick = (companyName: string) => {
    setSessionToEnd(companyName);
    setShowConfirmEndModal(true);
  };

  const handleConfirmForceEnd = () => {
    setSessions(prev => prev.filter(s => s.companyName !== sessionToEnd));
    setAlerts(prev => [...prev, {
      id: Date.now().toString(),
      type: 'warning',
      title: 'Session Force Ended',
      description: `${sessionToEnd}'s live session was terminated by admin.`,
      timestamp: new Date(),
      actionRequired: false
    }]);
    toast.success(`${sessionToEnd}'s session has been ended`);
    setShowConfirmEndModal(false);
    setSessionToEnd('');
  };

  // Handle Approve
  const handleApprove = (request: BroadcastRequest) => {
    setRequests(prev => prev.filter(r => r.id !== request.id));
    setAlerts(prev => [...prev, {
      id: Date.now().toString(),
      type: 'success',
      title: 'Broadcast Approved',
      description: `${request.companyName}'s live broadcast has been approved and published to homepage.`,
      timestamp: new Date(),
      actionRequired: false
    }]);
    toast.success(`Session approved and scheduled for ${request.companyName}!`);
  };

  // Handle Reject
  const handleReject = (request: BroadcastRequest) => {
    setRequests(prev => prev.filter(r => r.id !== request.id));
    setAlerts(prev => [...prev, {
      id: Date.now().toString(),
      type: 'info',
      title: 'Broadcast Rejected',
      description: `${request.companyName}'s live broadcast request was rejected. Contact: ${request.contactEmail}`,
      timestamp: new Date(),
      actionRequired: false
    }]);
    toast.success(`Request rejected for ${request.companyName}`);
  };

  // Handle Take Action
  const handleTakeAction = (alert: AIAlert) => {
    setAlertAction(alert);
    setShowAlertActionModal(true);
  };

  const handleSendNotification = () => {
    if (alertAction?.affectedSession) {
      toast.success(`Notification sent to ${alertAction.affectedSession}!`);
    } else {
      toast.success('Action completed!');
    }
    setShowAlertActionModal(false);
    setAlertAction(null);
  };

  // Handle Pause All Sessions
  const handlePauseAll = () => {
    if (confirm('Are you sure you want to pause all ' + sessions.length + ' live sessions?')) {
      setAllSessionsPaused(true);
      toast.success('All sessions have been paused');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* ============================================ */}
      {/* PERSISTENT TOP HEADER */}
      {/* ============================================ */}
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
        <div className="text-sm font-medium text-white">Admin Command Center</div>

        {/* Right: Bell, User, Logout */}
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors relative">
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <span className="text-sm text-white font-medium">{user?.name || 'Admin'}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-bold text-xl">Super Admin Operations</h1>
                  <p className="text-slate-400 text-sm">Live Deal Room Command Center</p>
                </div>
              </div>

              {/* Connection Status */}
              <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 text-xs font-semibold">SYSTEM ONLINE</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg border border-slate-700/50 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={handleGenerateReport}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg font-semibold transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* TOP METRICS BAR */}
      {/* ============================================ */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-5 gap-4">
          {/* Active Live Rooms */}
          <MetricCard
            icon={Radio}
            label="Active Live Rooms"
            value={totalActiveRooms}
            subtext="exhibitors broadcasting"
            trend="+2"
            trendUp={true}
            color="bg-emerald-500/20 text-emerald-400"
          />

          {/* Total Buyers in Queues */}
          <MetricCard
            icon={Users}
            label="Buyers in Queues"
            value={totalBuyersInQueues}
            subtext="across all rooms"
            trend="+18%"
            trendUp={true}
            color="bg-amber-500/20 text-amber-400"
          />

          {/* Live Revenue Today */}
          <MetricCard
            icon={DollarSign}
            label="Live Revenue Today"
            value={formatCurrency(totalRevenueToday)}
            subtext="VIP + Sponsored"
            trend="+32%"
            trendUp={true}
            color="bg-purple-500/20 text-purple-400"
          />

          {/* Deals Closed */}
          <MetricCard
            icon={CheckCircle2}
            label="Deals Closed Today"
            value={totalDealsClosed}
            subtext="across platform"
            trend="+5"
            trendUp={true}
            color="bg-blue-500/20 text-blue-400"
          />

          {/* Server Health */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/20">
                <Server className="w-5 h-5 text-emerald-400" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${Math.round(serverHealth) >= 98 ? 'text-emerald-400' : 'text-amber-400'}`}>
                <Signal className="w-3 h-3" />
                {Math.round(serverHealth) >= 98 ? 'OPTIMAL' : 'DEGRADED'}
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{Math.round(serverHealth)}%</div>
            <div className="text-sm text-slate-400">Server Health</div>
            <div className="mt-2 h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  Math.round(serverHealth) >= 98 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                  Math.round(serverHealth) >= 95 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                  'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                style={{ width: `${Math.round(serverHealth)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="px-6 pb-6">
        <div className="flex gap-6">
          {/* ============================================ */}
          {/* LEFT: LIVE SESSIONS */}
          {/* ============================================ */}
          <div className="flex-1">
            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-white font-bold text-lg">Currently Live Exhibitors</h2>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold">
                    {sessions.length} Active
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400">Total Queue: <span className="text-amber-400 font-semibold">{totalBuyersInQueues}</span></span>
                  <span className="text-slate-400">Avg Wait: <span className="text-white font-semibold">9.5 min</span></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {sessions.map((session) => (
                <LiveSessionCard
                  key={session.id}
                  session={session}
                  onSpectate={() => handleSpectate(session.companyName)}
                  onForceEnd={() => handleForceEndClick(session.companyName)}
                />
              ))}

              {sessions.length === 0 && (
                <div className="col-span-2 bg-slate-800/50 rounded-xl border border-slate-700/50 p-12 text-center">
                  <Video className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No active live sessions</p>
                </div>
              )}
            </div>
          </div>

          {/* ============================================ */}
          {/* RIGHT: REQUESTS & ALERTS */}
          {/* ============================================ */}
          <div className="w-96 flex flex-col gap-6">
            {/* Pending Requests */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-b border-slate-700/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <h2 className="text-white font-bold">Pending Requests</h2>
                  </div>
                  <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-semibold">
                    {requests.length}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                {requests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onApprove={() => handleApprove(request)}
                    onReject={() => handleReject(request)}
                  />
                ))}

                {requests.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="text-slate-400">All caught up!</p>
                    <p className="text-slate-500 text-sm">No pending requests</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                Platform Performance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Avg Session Duration</span>
                  <span className="text-white font-semibold">2.3 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Conversion Rate</span>
                  <span className="text-emerald-400 font-semibold">34.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Avg Deal Value</span>
                  <span className="text-amber-400 font-semibold">$38,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Customer Satisfaction</span>
                  <span className="text-emerald-400 font-semibold">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* AI SYSTEM ALERTS */}
        {/* ============================================ */}
        <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-white font-bold text-lg">AI System Alerts</h2>
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {alerts.filter(a => a.actionRequired).length} Require Action
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Zap className="w-4 h-4 text-amber-400" />
                AI Moderator Active
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className={`grid gap-4 ${showAllAlerts ? 'grid-cols-3' : 'grid-cols-3'}`}>
              {(showAllAlerts ? alerts : alerts.slice(0, 3)).map((alert) => (
                <AlertItem key={alert.id} alert={alert} onTakeAction={handleTakeAction} />
              ))}
            </div>

            {alerts.length > 3 && (
              <button
                onClick={() => setShowAllAlerts(!showAllAlerts)}
                className="mt-4 w-full py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 rounded-lg border border-slate-700/50 transition-all flex items-center justify-center gap-2"
              >
                {showAllAlerts ? 'Show Less' : `View All ${alerts.length} Alerts`}
                <ChevronRight className={`w-4 h-4 ${showAllAlerts ? 'rotate-90' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* ============================================ */}
        {/* GLOBAL CONTROLS */}
        {/* ============================================ */}
        <div className="mt-6 bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-400" />
                <span className="text-white font-semibold">Global Controls</span>
              </div>
              <div className="h-8 w-px bg-slate-700"></div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">Emergency Broadcast:</span>
                <button
                  onClick={handlePauseAll}
                  className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 text-sm font-medium transition-all"
                >
                  {allSessionsPaused ? 'PAUSED' : 'Pause All Sessions'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500 text-sm">Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MODALS */}
      {/* ============================================ */}

      {/* Spectate Modal */}
      {showSpectateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Spectating: {spectateCompany}</h3>
              <button onClick={() => setShowSpectateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-400 text-sm">Queue Count</div>
                  <div className="text-white font-bold text-xl">23</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Deals Closed</div>
                  <div className="text-emerald-400 font-bold text-xl">8</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Revenue</div>
                  <div className="text-[#D4AF37] font-bold text-xl">$12,500</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Avg Wait</div>
                  <div className="text-amber-400 font-bold text-xl">6 min</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSpectateModal(false)}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
            >
              Leave Spectator Mode
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Platform Report</h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <div className="text-sm text-slate-400 mb-4">Report Period: Last 30 Days</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-300">Total Revenue</span>
                  <span className="text-[#D4AF37] font-bold">$847,500</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-300">Active Users</span>
                  <span className="text-white font-bold">2,450</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-300">Deals Closed</span>
                  <span className="text-emerald-400 font-bold">156</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-300">Live Sessions</span>
                  <span className="text-blue-400 font-bold">{sessions.length}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                toast.success('Report generated successfully!');
                setShowReportModal(false);
              }}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
            >
              Download Report
            </button>
          </div>
        </div>
      )}

      {/* Confirm End Session Modal */}
      {showConfirmEndModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Confirm End Session</h3>
              <button onClick={() => setShowConfirmEndModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-300 mb-6">
              Are you sure you want to force end <span className="text-white font-semibold">{sessionToEnd}</span>'s live session? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmEndModal(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmForceEnd}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all"
              >
                Confirm End
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Action Modal */}
      {showAlertActionModal && alertAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Take Action</h3>
              <button onClick={() => setShowAlertActionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <div className="text-white font-medium mb-2">{alertAction.title}</div>
              <div className="text-slate-400 text-sm">{alertAction.description}</div>
            </div>
            {alertAction.affectedSession && (
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">Notify {alertAction.affectedSession}</label>
                <input
                  type="text"
                  placeholder="Add notification message..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            )}
            <button
              onClick={handleSendNotification}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
            >
              Send Notification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
