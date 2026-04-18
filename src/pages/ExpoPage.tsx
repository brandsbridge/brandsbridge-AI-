import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Calendar, Clock, Users, DollarSign, Video, MessageSquare,
  X, Check, ChevronRight, Filter, Search, Globe, Ship,
  MapPin, Star, AlertCircle, Zap, Building2, UsersRound,
  DoorOpen, Target, CheckCircle
} from 'lucide-react';
import { expoRooms, logisticsCompanies, walkinBuyers, preRegisteredBuyers, ExpoRoom } from '../data/mockData';
import { expoPackages, upcomingExpo } from '../data/expoData';
import toast from 'react-hot-toast';

// Country list for quick join
const COUNTRIES = [
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman', 'Bahrain',
  'Turkey', 'Egypt', 'Morocco', 'Germany', 'UK', 'USA', 'India', 'China',
  'Brazil', 'Indonesia', 'Malaysia', 'Thailand', 'Vietnam', 'South Africa'
];

// Product categories
const CATEGORIES = ['All Categories', 'Confectionery', 'Dairy', 'Beverages', 'Snacks', 'FMCG'];

// Interest chips
const INTEREST_CHIPS = ['Dairy', 'Chocolate', 'Snacks', 'Beverages', 'FMCG', 'Confectionery', 'Organic'];

// Live stats
const INITIAL_STATS = {
  companies: 47,
  rooms: 124,
  buyers: 312,
  dealValue: 2400000,
  deals: 47
};

const ExpoPage = () => {
  const navigate = useNavigate();
  const { expoId } = useParams();
  const [showQuickJoin, setShowQuickJoin] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState<ExpoRoom | null>(null);
  const [joinName, setJoinName] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogistics, setShowLogistics] = useState(false);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [expoLive, setExpoLive] = useState(true); // For demo, always live

  // Quick Join Form State
  const [quickJoinForm, setQuickJoinForm] = useState({
    name: '',
    company: '',
    whatsapp: '',
    email: '',
    country: '',
    interests: [] as string[]
  });

  // Simulated live stats update
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        buyers: prev.buyers + Math.floor(Math.random() * 3),
        dealValue: prev.dealValue + Math.floor(Math.random() * 50000)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Format currency
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  // Group rooms by company
  const roomsByCompany = expoRooms.reduce((acc, room) => {
    const key = room.companyId;
    if (!acc[key]) {
      acc[key] = {
        company: { name: room.companyName, flag: room.companyFlag },
        rooms: []
      };
    }
    acc[key].rooms.push(room);
    return acc;
  }, {} as Record<string, { company: { name: string; flag: string }; rooms: ExpoRoom[] }>);

  // Filter companies
  const filteredCompanies = Object.values(roomsByCompany).filter(({ company }) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All Categories' ||
      company.name.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesSearch && (filterCategory === 'All Categories' || matchesCategory);
  });

  // Handle quick join submit
  const handleQuickJoinSubmit = () => {
    if (!quickJoinForm.name || !quickJoinForm.company || !quickJoinForm.whatsapp || !quickJoinForm.email || !quickJoinForm.country) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Add to walkin buyers (in real app, this would be an API call)
    const newBuyer = {
      id: `wb-${Date.now()}`,
      ...quickJoinForm,
      joinedDate: new Date().toISOString().split('T')[0],
      expoId: expoId || 'expo-may-2025',
      status: 'active' as const,
      source: 'quick_join' as const
    };

    toast.success(`Welcome ${quickJoinForm.name}! Check WhatsApp for room links.`);
    setShowQuickJoin(false);
    setQuickJoinForm({ name: '', company: '', whatsapp: '', email: '', country: '', interests: [] });
  };

  // Handle join room
  const handleJoinRoom = (room: ExpoRoom) => {
    if (!joinName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    toast.success(`Joining ${room.sellerName}'s room...`);
    setShowJoinRoom(null);
    setJoinName('');
    navigate('/live-deal-room');
  };

  // Get room status color
  const getRoomStatusColor = (room: ExpoRoom) => {
    if (room.status === 'available' || room.status === 'live') return 'bg-emerald-500';
    if (room.waitingCount <= 3) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Get room status text
  const getRoomStatusText = (room: ExpoRoom) => {
    if (room.status === 'available' || room.status === 'live') return 'Available Now';
    if (room.status === 'busy') return 'Busy';
    if (room.status === 'full') return 'Full';
    return `${room.waitingCount} waiting`;
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#0A0F1E] via-slate-900 to-[#0A0F1E] border-b border-slate-800/50 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)',
            backgroundSize: '48px 48px',
            animation: 'pulse 3s ease-in-out infinite'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
            {/* Left - Content */}
            <div className="flex-1">
              {/* Live Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-full mb-6">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 font-semibold">LIVE NOW</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                Brands Bridge Live Expo
              </h1>
              <p className="text-xl text-[#D4AF37] font-medium mb-6">May 29, 2025</p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Building2 className="w-4 h-4" />
                    Companies Live
                  </div>
                  <div className="text-2xl font-bold text-white">{stats.companies}</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <DoorOpen className="w-4 h-4" />
                    Active Rooms
                  </div>
                  <div className="text-2xl font-bold text-white">{stats.rooms}</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <UsersRound className="w-4 h-4" />
                    Buyers Inside
                  </div>
                  <div className="text-2xl font-bold text-white">{stats.buyers}</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    Deals Today
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.dealValue)}</div>
                </div>
              </div>

              {/* Time Remaining */}
              <div className="flex items-center gap-4 mb-8">
                <Clock className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">Expo closes in:</span>
                <span className="text-white font-mono font-bold">04:32:15</span>
              </div>

              {/* Entry Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
                >
                  <Ticket className="w-5 h-5" />
                  Enter as Registered Buyer
                  <ChevronRight className="w-5 h-5" />
                </button>
                <p className="text-slate-400 text-sm lg:absolute lg:left-8">Sign in to your account</p>

                <button
                  onClick={() => setShowQuickJoin(true)}
                  className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Quick Join — No Account Needed
                  <ChevronRight className="w-5 h-5" />
                </button>
                <p className="text-slate-400 text-sm lg:absolute lg:left-8">Just need WhatsApp + Email</p>
              </div>

              {/* Free Guarantees */}
              <div className="flex flex-wrap gap-6 mt-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Always free for buyers
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Instant access
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Exhibition Hall */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live Exhibition Hall
            </h2>
            <p className="text-slate-400 mb-6">Click any room to join a 1-on-1 meeting with the export team</p>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-3 mb-6">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterCategory === cat
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => setShowLogistics(!showLogistics)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  showLogistics
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white'
                }`}
              >
                <Ship className="w-4 h-4" />
                Show Logistics Zone
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            {/* Company Cards */}
            {!showLogistics ? (
              <div className="space-y-6">
                {filteredCompanies.map(({ company, rooms }, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                    {/* Company Header */}
                    <div className="p-6 border-b border-slate-700/50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
                            {company.flag}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              {company.name}
                              <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded text-blue-400 text-xs font-medium">
                                KYB VERIFIED
                              </span>
                            </h3>
                            <p className="text-slate-400 text-sm">Premium Qatari FMCG — Direct from Doha</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                              <span>Category: FMCG | Dairy | Beverages</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-amber-400 text-sm font-medium">🏷️ Expo-Day Special</div>
                          <div className="text-white">10% discount on orders today</div>
                        </div>
                      </div>
                    </div>

                    {/* Available Rooms */}
                    <div className="p-6">
                      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                        Available Rooms:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rooms.map(room => (
                          <div key={room.id} className="bg-slate-700/50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 ${getRoomStatusColor(room)} rounded-full`} />
                                <span className="text-white font-medium">{room.accessCode}</span>
                              </div>
                              <span className={`text-xs ${
                                room.status === 'available' || room.status === 'live' ? 'text-emerald-400' : 'text-amber-400'
                              }`}>
                                {getRoomStatusText(room)}
                              </span>
                            </div>
                            <div className="mb-3">
                              <p className="text-white font-medium">{room.sellerName}</p>
                              <p className="text-slate-400 text-sm">{room.sellerTitle} | {room.sellerLanguages.join(' ')}</p>
                              <p className="text-slate-500 text-xs mt-1">Products: {room.products.join(', ')}</p>
                            </div>
                            <button
                              onClick={() => setShowJoinRoom(room)}
                              className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                                room.status === 'available' || room.status === 'live'
                                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                              }`}
                            >
                              {room.status === 'available' || room.status === 'live' ? 'Join Room →' : `Join Queue (${room.waitingCount}) →`}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-4 flex gap-3">
                      <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm hover:bg-slate-600/50 transition-colors flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Virtual Booth
                      </button>
                      <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm hover:bg-slate-600/50 transition-colors flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Full Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Logistics Zone */
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Ship className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-bold text-white">Logistics Zone</h3>
                  </div>
                  <p className="text-slate-300">Get freight quotes from verified forwarders — today only</p>
                </div>

                {logisticsCompanies.map(log => (
                  <div key={log.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{log.flag}</span>
                        <div>
                          <h4 className="text-white font-semibold">{log.name}</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {log.routes.map((route, i) => (
                              <span key={i} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">{route}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-medium">{log.specialRate}</div>
                        <div className="text-slate-400 text-sm">{log.status === 'available' ? 'Available' : 'Busy'}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">
                        Containers: {log.containerTypes.join(', ')}
                      </div>
                      <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                        Request Freight Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right - Stats Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-24 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 font-semibold">LIVE</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Rooms</span>
                  <span className="text-white font-medium">{stats.rooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Buyers Inside</span>
                  <span className="text-white font-medium">{stats.buyers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deals Closed</span>
                  <span className="text-emerald-400 font-medium">{INITIAL_STATS.deals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deal Value</span>
                  <span className="text-emerald-400 font-medium">{formatCurrency(stats.dealValue)}</span>
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Top Categories Today
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Dairy</span>
                    <span className="text-amber-400">38%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Confectionery</span>
                    <span className="text-amber-400">28%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Beverages</span>
                    <span className="text-amber-400">19%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '19%' }} />
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Other</span>
                    <span className="text-amber-400">15%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm hover:bg-slate-600/50 transition-colors">
                View Full Analytics →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Join Modal */}
      {showQuickJoin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-[#D4AF37]/30 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#D4AF37]/20 to-amber-500/10 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-sm font-semibold">Quick Join</span>
                </div>
                <h2 className="text-xl font-bold text-white">Join the Expo</h2>
                <p className="text-slate-400 text-sm">No account needed. Join in 30 seconds.</p>
              </div>
              <button onClick={() => setShowQuickJoin(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Your Name *</label>
                <input
                  type="text"
                  value={quickJoinForm.name}
                  onChange={(e) => setQuickJoinForm({...quickJoinForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={quickJoinForm.company}
                  onChange={(e) => setQuickJoinForm({...quickJoinForm, company: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">WhatsApp Number *</label>
                <input
                  type="tel"
                  value={quickJoinForm.whatsapp}
                  onChange={(e) => setQuickJoinForm({...quickJoinForm, whatsapp: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="+971 55 123 4567"
                />
                <p className="text-xs text-slate-500 mt-1">We'll send you room links</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={quickJoinForm.email}
                  onChange={(e) => setQuickJoinForm({...quickJoinForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="you@company.com"
                />
                <p className="text-xs text-slate-500 mt-1">For expo reminders & updates</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Country *</label>
                <select
                  value={quickJoinForm.country}
                  onChange={(e) => setQuickJoinForm({...quickJoinForm, country: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">What are you looking for?</label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_CHIPS.map(chip => (
                    <button
                      key={chip}
                      onClick={() => {
                        const newInterests = quickJoinForm.interests.includes(chip)
                          ? quickJoinForm.interests.filter(i => i !== chip)
                          : [...quickJoinForm.interests, chip];
                        setQuickJoinForm({...quickJoinForm, interests: newInterests});
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        quickJoinForm.interests.includes(chip)
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="agree" className="mt-1 rounded border-slate-500" />
                <label htmlFor="agree" className="text-sm text-slate-400">
                  I agree to receive WhatsApp messages about this expo
                </label>
              </div>
              <button
                onClick={handleQuickJoinSubmit}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Enter Expo Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinRoom && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Join {showJoinRoom.sellerName}'s Room</h3>
              <p className="text-slate-400">Enter your name to join the video meeting</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">Your Name</label>
              <input
                type="text"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinRoom(null)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleJoinRoom(showJoinRoom)}
                className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
              >
                Join Now →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Missing icon
const Ticket = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
    <path d="M13 5v2"/>
    <path d="M13 17v2"/>
    <path d="M13 11v2"/>
  </svg>
);

export default ExpoPage;
