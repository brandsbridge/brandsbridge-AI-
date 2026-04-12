import { useState } from 'react';
import {
  Globe,
  Shield,
  Building2,
  User,
  LogOut,
  DollarSign,
  Users,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Play,
  Phone,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  MessageSquare,
  Send,
  Zap,
  FileText,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Check,
  Star,
  Flag,
  Crown,
  ChevronRight,
  Radio,
  BarChart3,
  Activity,
  Server
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

type Role = 'none' | 'superadmin' | 'seller' | 'buyer';

interface BuyerQueueItem {
  id: string;
  name: string;
  company: string;
  country: string;
  flag: string;
  matchScore: number;
  matchLabel: string;
  waitingTime: number;
  status: 'waiting' | 'in_call' | 'completed';
  isVIP?: boolean;
}

interface LiveSession {
  id: string;
  companyName: string;
  flag: string;
  category: string;
  duration: number;
  queueLength: number;
  dealsClosed: number;
  revenue: number;
  status: 'live' | 'ended';
}

interface BroadcastRequest {
  id: string;
  companyName: string;
  flag: string;
  category: string;
  requestedDate: string;
  requestedTime: string;
  packageType: 'standard' | 'vip' | 'sponsored';
  status: 'pending' | 'approved' | 'rejected';
}

interface QuoteData {
  product: string;
  quantity: string;
  price: string;
}

interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'system';
  message: string;
  quote?: QuoteData;
}

// ============================================
// MOCK DATA
// ============================================

const liveSessions: LiveSession[] = [
  { id: '1', companyName: 'Almarai', flag: '🇸🇦', category: 'Dairy & Poultry', duration: 45, queueLength: 15, dealsClosed: 8, revenue: 12500, status: 'live' },
  { id: '2', companyName: 'OZMO Foods', flag: '🇹🇷', category: 'Confectionery', duration: 32, queueLength: 12, dealsClosed: 5, revenue: 8200, status: 'live' },
  { id: '3', companyName: 'Gulf Dates', flag: '🇦🇪', category: 'Dried Fruits', duration: 18, queueLength: 8, dealsClosed: 3, revenue: 4500, status: 'live' },
  { id: '4', companyName: 'Euro Snacks', flag: '🇩🇪', category: 'Snacks', duration: 55, queueLength: 7, dealsClosed: 6, revenue: 7800, status: 'live' },
];

const broadcastRequests: BroadcastRequest[] = [
  { id: '1', companyName: 'Nestle', flag: '🇨🇭', category: 'Multiple Categories', requestedDate: 'Thursday', requestedTime: '10:00 AM', packageType: 'vip', status: 'pending' },
  { id: '2', companyName: 'Ferrero', flag: '🇮🇹', category: 'Confectionery', requestedDate: 'Friday', requestedTime: '2:00 PM', packageType: 'sponsored', status: 'pending' },
  { id: '3', companyName: 'Danone', flag: '🇫🇷', category: 'Dairy', requestedDate: 'Saturday', requestedTime: '11:00 AM', packageType: 'standard', status: 'pending' },
];

const sellerQueue: BuyerQueueItem[] = [
  { id: '1', name: 'Ahmed Al Rashid', company: 'Al Othaim Markets', country: 'Saudi Arabia', flag: '🇸🇦', matchScore: 95, matchLabel: 'High Volume Buyer', waitingTime: 5, status: 'waiting', isVIP: true },
  { id: '2', name: 'Sarah Chen', company: 'Carrefour UAE', country: 'UAE', flag: '🇦🇪', matchScore: 88, matchLabel: 'Retail Chain', waitingTime: 8, status: 'waiting' },
  { id: '3', name: 'Mohammed Khan', company: 'Lulu Group', country: 'India', flag: '🇮🇳', matchScore: 82, matchLabel: 'Hypermarket', waitingTime: 12, status: 'waiting' },
];

// ============================================
// HELPER COMPONENTS
// ============================================

const PulsingDot = ({ color = 'emerald' }: { color?: string }) => (
  <span className="relative flex h-3 w-3">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}></span>
    <span className={`relative inline-flex rounded-full h-3 w-3 bg-${color}-500`}></span>
  </span>
);

const StatCard = ({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: string; trend?: string; color: string }) => (
  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
    <div className="flex items-start justify-between mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && <span className="text-emerald-400 text-xs font-medium">{trend}</span>}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
  </div>
);

const MatchBadge = ({ score }: { score: number }) => {
  const color = score >= 90 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                score >= 80 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                'bg-amber-500/20 text-amber-400 border-amber-500/30';
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${color}`}>
      {score}% Match
    </span>
  );
};

// ============================================
// LOGIN GATEWAY
// ============================================

const LoginGateway = ({ onLogin }: { onLogin: (role: Role) => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
    <div className="w-full max-w-4xl">
      {/* Logo & Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/30 mb-6">
          <Globe className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Brands Bridge <span className="text-amber-400">AI</span>
        </h1>
        <p className="text-slate-400 text-lg">Global B2B Food & FMCG Trade Platform</p>
      </div>

      {/* Login Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Super Admin */}
        <button
          onClick={() => onLogin('superadmin')}
          className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Super Admin</h3>
          <p className="text-slate-400 text-sm mb-4">Khaled (Platform Owner)</p>
          <div className="space-y-2 text-left bg-slate-900/50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Revenue:</span>
              <span className="text-amber-400 font-semibold">$1.2M MRR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Exhibitors:</span>
              <span className="text-white font-semibold">2,450</span>
            </div>
          </div>
          <div className="mt-4 text-amber-400 text-sm font-medium group-hover:underline">
            Access Command Center →
          </div>
        </button>

        {/* Seller */}
        <button
          onClick={() => onLogin('seller')}
          className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Seller Portal</h3>
          <p className="text-slate-400 text-sm mb-4">OZMO Confectionery</p>
          <div className="space-y-2 text-left bg-slate-900/50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Active Queue:</span>
              <span className="text-emerald-400 font-semibold">2 Buyers</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Top Match:</span>
              <span className="text-white font-semibold">95%</span>
            </div>
          </div>
          <div className="mt-4 text-emerald-400 text-sm font-medium group-hover:underline">
            Enter Deal Room →
          </div>
        </button>

        {/* Buyer */}
        <button
          onClick={() => onLogin('buyer')}
          className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Buyer Portal</h3>
          <p className="text-slate-400 text-sm mb-4">Ahmed (Al Othaim)</p>
          <div className="space-y-2 text-left bg-slate-900/50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Country:</span>
              <span className="text-white font-semibold">Saudi Arabia</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Role:</span>
              <span className="text-blue-400 font-semibold">Purchasing Mgr</span>
            </div>
          </div>
          <div className="mt-4 text-blue-400 text-sm font-medium group-hover:underline">
            Enter Expo Hall →
          </div>
        </button>
      </div>

      {/* Platform Stats */}
      <div className="mt-12 grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-amber-400">2,450+</div>
          <div className="text-slate-400 text-sm">Exhibitors</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-400">180+</div>
          <div className="text-slate-400 text-sm">Countries</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">$2.4B</div>
          <div className="text-slate-400 text-sm">Trade Volume</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-400">24/7</div>
          <div className="text-slate-400 text-sm">AI Support</div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// SUPER ADMIN PORTAL
// ============================================

const SuperAdminPortal = ({ onLogout }: { onLogout: () => void }) => {
  const [sessions, setSessions] = useState(liveSessions);
  const [requests, setRequests] = useState(broadcastRequests);

  const handleForceEnd = (sessionId: string) => {
    if (confirm('Are you sure you want to force end this session?')) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold">Super Admin Portal</h1>
                <p className="text-slate-400 text-sm">Welcome, Khaled</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <PulsingDot color="emerald" />
              <span className="text-emerald-400 text-xs font-semibold">SYSTEM ONLINE</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg border border-slate-700/50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard icon={DollarSign} label="Total Revenue" value="$124,500" trend="+12%" color="bg-emerald-500/20 text-emerald-400" />
          <StatCard icon={Video} label="Active Live Rooms" value="4" trend="+2" color="bg-amber-500/20 text-amber-400" />
          <StatCard icon={Users} label="Waiting Buyers" value="42" trend="+18%" color="bg-blue-500/20 text-blue-400" />
          <StatCard icon={Activity} label="System Health" value="98%" trend="Optimal" color="bg-purple-500/20 text-purple-400" />
        </div>

        {/* Tables */}
        <div className="grid grid-cols-2 gap-6">
          {/* Live Sessions */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border-b border-slate-700/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-white font-bold">Live Sessions Monitor</h2>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {sessions.length} Active
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {sessions.map((session) => (
                <div key={session.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                        {session.companyName[0]}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          {session.companyName}
                          <span>{session.flag}</span>
                        </h4>
                        <p className="text-slate-400 text-sm">{session.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PulsingDot color="emerald" />
                      <span className="text-emerald-400 text-xs font-semibold">LIVE</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="bg-slate-800/50 rounded p-2 text-center">
                      <div className="text-white font-semibold text-sm">{session.duration}m</div>
                      <div className="text-slate-500 text-xs">Duration</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2 text-center">
                      <div className="text-amber-400 font-semibold text-sm">{session.queueLength}</div>
                      <div className="text-slate-500 text-xs">Queue</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2 text-center">
                      <div className="text-emerald-400 font-semibold text-sm">{session.dealsClosed}</div>
                      <div className="text-slate-500 text-xs">Deals</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2 text-center">
                      <div className="text-white font-semibold text-sm">${(session.revenue / 1000).toFixed(1)}K</div>
                      <div className="text-slate-500 text-xs">Revenue</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleForceEnd(session.id)}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg font-medium transition-all border border-red-500/30"
                  >
                    <XCircle className="w-4 h-4" />
                    Force End Session
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Broadcast Approvals */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-b border-slate-700/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <h2 className="text-white font-bold">Broadcast Approvals</h2>
                </div>
                <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {requests.length} Pending
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {requests.map((request) => (
                <div key={request.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-xl">
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
                  <div className="flex items-center gap-4 mb-3 text-sm text-slate-400">
                    <span>{request.requestedDate}</span>
                    <span>{request.requestedTime}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-2 rounded-lg font-medium transition-all border border-emerald-500/30"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg font-medium transition-all border border-red-500/30"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                  <p className="text-slate-400">All caught up!</p>
                  <p className="text-slate-500 text-sm">No pending approvals</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Alerts */}
        <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h2 className="text-white font-bold">AI System Alerts</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-semibold text-sm">High Wait Time</span>
              </div>
              <p className="text-slate-300 text-sm">Euro Arcade queue avg 20 mins. Consider adding sales rep.</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold text-sm">Peak Performance</span>
              </div>
              <p className="text-slate-300 text-sm">All servers operating at optimal capacity. Zero downtime.</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-semibold text-sm">Revenue Spike</span>
              </div>
              <p className="text-slate-300 text-sm">Almarai exceeded daily target by 45%. High-value deals closing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SELLER PORTAL
// ============================================

const SellerPortal = ({ onLogout }: { onLogout: () => void }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [queue, setQueue] = useState(sellerQueue);
  const [currentBuyer, setCurrentBuyer] = useState<BuyerQueueItem>({
    id: 'current',
    name: 'Ahmed Al Rashid',
    company: 'Al Othaim Markets',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    matchScore: 95,
    matchLabel: 'High Volume Buyer',
    waitingTime: 0,
    status: 'in_call'
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'buyer', message: 'Hello! We are very interested in your premium chocolate wafers.' },
    { id: '2', sender: 'seller', message: 'Welcome! Thank you for joining. I will send you our catalog.' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showQuoteWidget, setShowQuoteWidget] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);

  const handleAdmit = (buyer: BuyerQueueItem) => {
    setCurrentBuyer(buyer);
    setQueue(prev => prev.filter(b => b.id !== buyer.id));
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'system', message: `Meeting started with ${buyer.name}` }]);
  };

  const handleDecline = (buyerId: string) => {
    setQueue(prev => prev.filter(b => b.id !== buyerId));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'seller', message: newMessage }]);
    setNewMessage('');
  };

  const handleSendQuote = () => {
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'seller',
      message: 'QUOTE_SENT',
      quote: { product: 'Chocolate Wafers', quantity: '5 Containers', price: '$22,000 CIF' }
    }]);
    setQuoteSent(true);
    setShowQuoteWidget(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold">Live Deal Room Center</h1>
                <p className="text-slate-400 text-sm">Welcome, OZMO Export Team</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
              <PulsingDot color="red" />
              <span className="text-red-400 text-xs font-semibold">LIVE NOW</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg border border-slate-700/50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left: Video & Chat */}
        <div className="flex-1 flex flex-col p-4 gap-4">
          {/* Video Section */}
          <div className="flex-1 bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <span className="text-lg">{currentBuyer.flag}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      {currentBuyer.name}
                      <MatchBadge score={currentBuyer.matchScore} />
                    </h3>
                    <p className="text-slate-400 text-sm">{currentBuyer.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Radio className="w-4 h-4" />
                  <span className="text-sm font-medium">In Call</span>
                </div>
              </div>

              <div className="flex-1 relative bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-white text-xl font-semibold">{currentBuyer.name}</h3>
                  <p className="text-slate-400">{currentBuyer.flag} {currentBuyer.country}</p>
                </div>

                <div className="absolute bottom-4 right-4 w-48 h-32 bg-gradient-to-br from-amber-900/50 to-amber-800/50 rounded-lg border-2 border-amber-500/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">O</span>
                    </div>
                    <span className="text-amber-300 text-xs font-medium">You (Host)</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-sm px-4 py-3 rounded-full border border-slate-700/50">
                  <button onClick={() => setIsMicOn(!isMicOn)} className={`p-3 rounded-full transition-all ${isMicOn ? 'bg-slate-700 text-white' : 'bg-red-500/20 text-red-400'}`}>
                    {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setIsVideoOn(!isVideoOn)} className={`p-3 rounded-full transition-all ${isVideoOn ? 'bg-slate-700 text-white' : 'bg-red-500/20 text-red-400'}`}>
                    {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>
                  <button className="p-3 rounded-full bg-slate-700 text-white">
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="h-72 flex gap-4">
            <div className="flex-1 bg-slate-800/30 rounded-xl border border-slate-700/50 flex flex-col">
              <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-white font-semibold">Live Negotiation</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'seller' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                    {msg.sender === 'system' ? (
                      <div className="bg-slate-700/30 text-slate-400 text-xs px-4 py-2 rounded-full">{msg.message}</div>
                    ) : (
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'seller' ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white' : 'bg-slate-700/80 text-white'}`}>
                        {msg.quote ? (
                          <div>
                            <p className="text-sm mb-2 opacity-90">Quote Sent:</p>
                            <div className="bg-black/20 rounded-lg p-3 space-y-1">
                              <div className="flex justify-between text-xs"><span>Product:</span><span className="font-semibold">{msg.quote.product}</span></div>
                              <div className="flex justify-between text-xs"><span>Quantity:</span><span className="font-semibold">{msg.quote.quantity}</span></div>
                              <div className="flex justify-between text-xs"><span>Price:</span><span className="font-semibold text-emerald-300">{msg.quote.price}</span></div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm">{msg.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-700/50 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
                />
                <button onClick={() => setShowQuoteWidget(!showQuoteWidget)} className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg border border-amber-500/30">
                  <Zap className="w-5 h-5" />
                </button>
                <button onClick={handleSendMessage} className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg font-semibold">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quote Widget */}
            {showQuoteWidget && (
              <div className="w-80 bg-slate-800/50 rounded-xl border border-amber-500/30 p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Instant Quote Generator
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Product</label>
                    <input type="text" defaultValue="Chocolate Wafers" className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Quantity</label>
                      <input type="text" defaultValue="5 Containers" className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Price</label>
                      <input type="text" defaultValue="$22,000 CIF" className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm" />
                    </div>
                  </div>
                  <button onClick={handleSendQuote} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Quote
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Smart Queue */}
        <div className="w-96 bg-slate-900/50 border-l border-slate-800/50 flex flex-col">
          <div className="px-4 py-4 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/80 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h2 className="text-white font-bold">Buyer Queue</h2>
              </div>
              <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-semibold">{queue.length} Waiting</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {queue.map((buyer) => (
              <div key={buyer.id} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl">{buyer.flag}</div>
                    <div>
                      <h4 className="text-white font-semibold">{buyer.name}</h4>
                      <p className="text-slate-400 text-sm">{buyer.company}</p>
                    </div>
                  </div>
                  <MatchBadge score={buyer.matchScore} />
                </div>
                <div className="space-y-1 mb-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-400"><Clock className="w-3 h-3" /> Waiting {buyer.waitingTime} mins</div>
                  <div className="flex items-center gap-2 text-slate-400"><Star className="w-3 h-3 text-amber-400" /> {buyer.matchLabel}</div>
                  {buyer.isVIP && <div className="text-amber-400 font-medium text-xs">VIP BUYER</div>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAdmit(buyer)} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-2 rounded-lg font-medium flex items-center justify-center gap-2 border border-emerald-500/30">
                    <Check className="w-4 h-4" /> Admit
                  </button>
                  <button onClick={() => handleDecline(buyer.id)} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg font-medium flex items-center justify-center gap-2 border border-red-500/30">
                    <X className="w-4 h-4" /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Sent Toast */}
      {quoteSent && (
        <div className="fixed bottom-6 right-6 bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Quote Sent Successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// BUYER PORTAL
// ============================================

const BuyerPortal = ({ onLogout }: { onLogout: () => void }) => {
  const [inQueue, setInQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState(2);

  const liveExhibitors = [
    { name: 'OZMO Confectionery', flag: '🇹🇷', category: 'Confectionery', match: 95, deals: 5 },
    { name: 'Almarai', flag: '🇸🇦', category: 'Dairy', match: 88, deals: 8 },
    { name: 'Gulf Dates Co.', flag: '🇦🇪', category: 'Dried Fruits', match: 82, deals: 3 },
  ];

  const handleJoinQueue = () => {
    setInQueue(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold">Digital Expo Hall</h1>
                <p className="text-slate-400 text-sm">Welcome, Ahmed | Buying for Saudi Arabia</p>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg border border-slate-700/50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Live Now Banner */}
        <div className="bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent border border-red-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <PulsingDot color="red" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span></span>
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">LIVE NOW: OZMO Confectionery</h2>
                <p className="text-slate-400">Taking 1-on-1 meetings with buyers</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-400">{liveExhibitors[0].match}%</div>
                <div className="text-slate-400 text-sm">Match Score</div>
              </div>
              <button
                onClick={handleJoinQueue}
                disabled={inQueue}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  inQueue
                    ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                }`}
              >
                {inQueue ? 'In Queue...' : 'Join Queue'}
              </button>
            </div>
          </div>
        </div>

        {/* Queue Modal */}
        {inQueue && (
          <div className="bg-slate-800/50 border border-amber-500/30 rounded-2xl p-6 mb-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">You are #{queuePosition} in line</h3>
              <p className="text-slate-400 mb-4">Waiting for OZMO Sales Team to admit you...</p>
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <PulsingDot color="amber" />
                <span className="font-medium">Estimated wait: ~{queuePosition * 5} minutes</span>
              </div>
              <button onClick={() => setInQueue(false)} className="mt-4 text-red-400 hover:text-red-300 text-sm">
                Leave Queue
              </button>
            </div>
          </div>
        )}

        {/* Live Exhibitors */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/10 to-transparent border-b border-slate-700/50 p-4">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-400" />
              <h2 className="text-white font-bold">Live Exhibitors</h2>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold ml-2">
                {liveExhibitors.length} Available
              </span>
            </div>
          </div>
          <div className="p-4 grid grid-cols-3 gap-4">
            {liveExhibitors.map((exhibitor, index) => (
              <div key={index} className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                    {exhibitor.name[0]}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      {exhibitor.name}
                      <span>{exhibitor.flag}</span>
                    </h4>
                    <p className="text-slate-400 text-sm">{exhibitor.category}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-amber-400 font-semibold">{exhibitor.match}%</div>
                    <div className="text-slate-500 text-xs">Match</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-emerald-400 font-semibold">{exhibitor.deals}</div>
                    <div className="text-slate-500 text-xs">Deals</div>
                  </div>
                </div>
                <button
                  onClick={() => index === 0 && !inQueue && handleJoinQueue()}
                  disabled={inQueue}
                  className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                    index === 0
                      ? inQueue
                        ? 'bg-slate-700/50 text-slate-400'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-white'
                      : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {index === 0 ? (inQueue ? 'Already in Queue' : 'Join Meeting') : 'Offline'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended For You */}
        <div className="mt-6">
          <h3 className="text-white font-bold mb-4">Recommended For You</h3>
          <div className="grid grid-cols-4 gap-4">
            {['Premium Dates', 'Organic Honey', 'Arabic Coffee', 'Dried Fruits'].map((item, index) => (
              <div key={index} className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 text-center">
                <div className="text-2xl mb-2">
                  {['🌴', '🍯', '☕', '🍇'][index]}
                </div>
                <p className="text-white text-sm font-medium">{item}</p>
                <p className="text-slate-400 text-xs mt-1">{[12, 8, 15, 6][index]} exhibitors</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

export default function MultiRoleApp() {
  const [activeRole, setActiveRole] = useState<Role>('none');

  const handleLogin = (role: Role) => {
    setActiveRole(role);
  };

  const handleLogout = () => {
    setActiveRole('none');
  };

  // Render based on role
  if (activeRole === 'none') {
    return <LoginGateway onLogin={handleLogin} />;
  }

  if (activeRole === 'superadmin') {
    return <SuperAdminPortal onLogout={handleLogout} />;
  }

  if (activeRole === 'seller') {
    return <SellerPortal onLogout={handleLogout} />;
  }

  if (activeRole === 'buyer') {
    return <BuyerPortal onLogout={handleLogout} />;
  }

  return null;
}
