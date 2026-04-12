import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Download, Truck, Send, Bot,
  FileText, Settings, ChevronLeft, ChevronRight,
  Ship, MapPin, Clock, DollarSign, TrendingUp, AlertCircle, Package,
  Bell, LogOut, Home, Globe, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FreightDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('overview');
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [bidForm, setBidForm] = useState({
    fobPrice: '',
    cifPrice: '',
    transitDays: '',
    validUntil: '',
    notes: ''
  });

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/logistics' },
    { id: 'requests', label: 'New Requests', icon: Download, badge: '3', path: '/logistics' },
    { id: 'shipments', label: 'Active Shipments', icon: Truck, path: '/logistics' },
    { id: 'quotes', label: 'Quotes Submitted', icon: Send, path: '/logistics' },
    { id: 'ai-optimizer', label: 'AI Cargo Optimizer', icon: Bot, path: '/logistics' },
    { id: 'documents', label: 'Documents', icon: FileText, path: '/crb-hub' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  const kpis = [
    { label: 'New Freight Requests', value: '3', icon: Download, color: 'text-amber-400', urgent: true },
    { label: 'Active Shipments', value: '8', icon: Truck, color: 'text-blue-400' },
    { label: 'Monthly Revenue', value: 45200, icon: DollarSign, color: 'text-emerald-400' },
    { label: 'AI Reliability Score', value: '97%', icon: TrendingUp, color: 'text-purple-400', badge: 'AI' },
  ];

  const pendingRequests = [
    {
      company: 'Golden Dates Co.',
      route: 'Istanbul → Dubai',
      container: '40ft HC',
      cargo: 'Food Products',
      deadline: 'Dec 15, 2024',
      value: 'Est. $8,500'
    },
    {
      company: 'Medina Foods',
      route: 'Jeddah → Mumbai',
      container: '20ft',
      cargo: 'Spices & Seasonings',
      deadline: 'Dec 20, 2024',
      value: 'Est. $4,200'
    },
    {
      company: 'Gulf Trading Co.',
      route: 'Sharjah → Singapore',
      container: '40ft RF',
      cargo: 'Frozen Snacks',
      deadline: 'Dec 18, 2024',
      value: 'Est. $12,000'
    },
  ];

  const activeShipments = [
    { id: 'SHP-001', route: 'Shanghai → Dubai', status: 'In Transit', eta: 'Dec 10', value: 18500 },
    { id: 'SHP-002', route: 'Mumbai → Riyadh', status: 'Customs', eta: 'Dec 8', value: 9200 },
    { id: 'SHP-003', route: 'Santos → Jeddah', status: 'In Transit', eta: 'Dec 15', value: 24600 },
  ];

  const handleSubmitBid = (request: any) => {
    setSelectedRequest(request);
    setShowBidModal(true);
  };

  const handleConfirmBid = () => {
    if (!bidForm.fobPrice || !bidForm.cifPrice || !bidForm.transitDays) {
      toast.error('Please fill in required fields');
      return;
    }
    toast.success('Quote submitted successfully!');
    setShowBidModal(false);
    setBidForm({ fobPrice: '', cifPrice: '', transitDays: '', validUntil: '', notes: '' });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-[#111827] border-r border-slate-800 flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Ship className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Freight Hub</span>
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
                activeMenu === item.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-amber-500 text-[#0A0F1E] text-xs font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
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
                Logged in as {user?.email || 'freight@demo.com'}
              </div>
            </div>
          )}
          {!collapsed && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-xs font-medium text-emerald-400">Verified Carrier</span>
              </div>
              <div className="text-sm text-white font-medium">Apex Global Logistics</div>
              <div className="text-xs text-slate-400">Partnered with Maersk & MSC</div>
            </div>
          )}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">{user?.name?.charAt(0) || 'F'}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user?.name || 'Freight'}</div>
                <div className="text-xs text-slate-400">Shipping Account</div>
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
          <div className="text-sm font-medium text-white">Freight Hub</div>

          {/* Right: Bell, User, Logout */}
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors relative">
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <span className="text-sm text-white font-medium">{user?.name || 'Freight'}</span>
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
              <h1 className="text-xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0] || 'Captain'}</h1>
              <p className="text-slate-400">3 new freight requests need your attention</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documents
              </button>
              <Link
                to="/logistics"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
              >
                <Ship className="w-5 h-5" />
                Logistics Hub
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map((kpi, index) => (
              <div key={index} className={`bg-[#111827] border rounded-xl p-5 ${kpi.urgent ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-800'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center ${kpi.color}`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  {kpi.badge && (
                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs font-medium rounded">
                      {kpi.badge}
                    </span>
                  )}
                </div>
                <div className={`text-2xl font-bold ${kpi.urgent ? 'text-amber-400' : 'text-white'} mb-1`}>
                  {kpi.value}
                </div>
                <div className="text-sm text-slate-400">{kpi.label}</div>
                {kpi.urgent && (
                  <div className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Action needed
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - New Requests (2/3) */}
            <div className="lg:col-span-2">
              <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Download className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">New Freight Requests</h2>
                      <p className="text-sm text-slate-400">Review and submit your best quotes</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full">
                    3 Pending
                  </span>
                </div>
                <div className="p-0">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr className="text-left text-xs text-slate-400 uppercase">
                        <th className="px-6 py-3 font-medium">Company</th>
                        <th className="px-4 py-3 font-medium">Route</th>
                        <th className="px-4 py-3 font-medium">Container</th>
                        <th className="px-4 py-3 font-medium">Cargo</th>
                        <th className="px-4 py-3 font-medium">Deadline</th>
                        <th className="px-4 py-3 font-medium">Est. Value</th>
                        <th className="px-6 py-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {pendingRequests.map((request, index) => (
                        <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{request.company}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <MapPin className="w-4 h-4 text-slate-500" />
                              {request.route}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-slate-800 text-slate-300 text-sm rounded">
                              {request.container}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-400">{request.cargo}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-sm text-slate-400">
                              <Clock className="w-4 h-4" />
                              {request.deadline}
                            </div>
                          </td>
                          <td className="px-4 py-4 font-medium text-emerald-400">{request.value}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleSubmitBid(request)}
                              className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                            >
                              Submit Bid
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right - Quick Actions (1/3) */}
            <div className="space-y-6">
              {/* AI Cargo Optimizer */}
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Bot className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">AI Cargo Optimizer</h3>
                    <p className="text-xs text-slate-400">Powered by AI</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-4">
                  Optimize your container space and maximize revenue with AI-powered recommendations.
                </p>
                <button className="w-full py-3 bg-purple-500 text-white font-medium rounded-xl hover:bg-purple-600 transition-colors">
                  Optimize Routes
                </button>
              </div>

              {/* Active Shipments */}
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Active Shipments</h3>
                <div className="space-y-3">
                  {activeShipments.map((shipment) => (
                    <div key={shipment.id} className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{shipment.id}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          shipment.status === 'In Transit' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {shipment.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mb-1">{shipment.route}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">ETA: {shipment.eta}</span>
                        <span className="text-sm font-medium text-emerald-400">{formatCurrency(shipment.value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/logistics"
                  className="block mt-4 py-2 text-center text-sm text-slate-400 hover:text-white transition-colors"
                >
                  View All Shipments →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Bid Modal */}
      {showBidModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Submit Freight Quote</h3>
              <button onClick={() => setShowBidModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Request Info */}
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Ship className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{selectedRequest.company}</h4>
                  <p className="text-sm text-slate-400">{selectedRequest.route} • {selectedRequest.container}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Price (FOB) *</label>
                <input
                  type="number"
                  value={bidForm.fobPrice}
                  onChange={(e) => setBidForm({...bidForm, fobPrice: e.target.value})}
                  placeholder="8500"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Price (CIF) *</label>
                <input
                  type="number"
                  value={bidForm.cifPrice}
                  onChange={(e) => setBidForm({...bidForm, cifPrice: e.target.value})}
                  placeholder="9200"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Transit Time (days) *</label>
                <input
                  type="number"
                  value={bidForm.transitDays}
                  onChange={(e) => setBidForm({...bidForm, transitDays: e.target.value})}
                  placeholder="14"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Valid Until</label>
                <input
                  type="date"
                  value={bidForm.validUntil}
                  onChange={(e) => setBidForm({...bidForm, validUntil: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Special Notes</label>
                <textarea
                  value={bidForm.notes}
                  onChange={(e) => setBidForm({...bidForm, notes: e.target.value})}
                  placeholder="Any special conditions or requirements..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>
              <button
                onClick={handleConfirmBid}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                Submit Quote →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreightDashboard;