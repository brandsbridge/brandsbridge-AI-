import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, FileText, Video,
  Megaphone, Ship, Settings, ChevronLeft, ChevronRight,
  Package2, Home, LogOut, Globe, Bell, ChevronDown, Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type SubMenu = 'pipeline' | 'leads' | 'companies' | 'inventory' | 'finance' | 'export-docs' | 'search-boost' | 'email-catalog' | 'cargo' | null;

interface SupplierSidebarProps {
  activePage?: string;
}

const SupplierSidebar = ({ activePage = 'overview' }: SupplierSidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<SubMenu>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const toggleSubmenu = (sub: SubMenu) => {
    setExpandedSubmenu(expandedSubmenu === sub ? null : sub);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // Settings Modal Handler
  const handleSaveSettings = () => {
    setShowSettingsModal(false);
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/supplier/dashboard' },
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
        { id: 'search-boost', label: 'Search Boost', path: '/supplier/dashboard' },
        { id: 'email-catalog', label: 'Email Catalog', path: '/supplier/dashboard' },
      ]
    },
    { id: 'logistics', label: 'Logistics', icon: Ship, path: '/logistics' },
    {
      id: 'cargo', label: 'Cargo Auction', icon: Flame,
      children: [
        { id: 'cargo-listings', label: 'My Listings', path: '/supplier/cargo-auction' },
        { id: 'cargo-create', label: 'Create New Listing', path: '/supplier/cargo-auction/new' },
        { id: 'cargo-reservations', label: 'Active Reservations', path: '/supplier/cargo-auction/reservations' },
        { id: 'cargo-performance', label: 'Performance', path: '/supplier/cargo-auction/stats' },
      ]
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
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
              {/* Check if this item or its children are active */}
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.id as SubMenu)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      activePage === item.id ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
                        let navigatePath = child.path || '/';
                        if (item.id === 'crm') {
                          navigatePath = '/crm';
                        } else if (item.id === 'crb') {
                          navigatePath = '/crb-hub';
                        } else if (item.id === 'campaigns') {
                          navigatePath = '/supplier/dashboard';
                        } else if (item.id === 'cargo') {
                          navigatePath = child.path || '/supplier/cargo-auction';
                        }

                        return (
                          <button
                            key={child.id}
                            onClick={() => navigate(navigatePath)}
                            className={`w-full text-left block px-3 py-2 text-sm rounded-lg transition-colors ${
                              activePage === child.id
                                ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
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
                    activePage === item.id ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="flex-1 font-medium">{item.label}</span>}
                </button>
              ) : (
                <Link
                  to={item.path || '#'}
                  onClick={() => {}}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    activePage === item.id ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-slate-400 hover:text-white hover:bg-slate-800'
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

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Company Name</label>
                <input
                  type="text"
                  defaultValue={user?.company || 'OZMO Export Team'}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Contact Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || 'supplier@brandsbridge.ai'}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
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
    </>
  );
};

export default SupplierSidebar;