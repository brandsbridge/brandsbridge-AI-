import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Globe, ChevronDown, User, Settings, CreditCard, LogOut } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isDemo } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleToast = (message: string) => {
    toast.success(message);
    setDropdownOpen(false);
  };

  const supplierNav: { label: string; path: string; badge?: string }[] = [
    { label: 'Expo Hall', path: '/companies' },
    { label: 'Sales CRM', path: '/crm' },
    { label: 'CRB Hub', path: '/crb-hub' },
    { label: 'Live Deal Room', path: '/live-deal-room', badge: 'LIVE' },
    { label: 'Logistics', path: '/logistics' },
  ];

  const buyerNav: { label: string; path: string; badge?: string }[] = [
    { label: 'Expo Hall', path: '/companies' },
    { label: 'Procurement Hub', path: '/buyer/dashboard' },
    { label: 'Live Radar', path: '/live-deal-room', badge: 'LIVE' },
    { label: 'Market Prices', path: '/market' },
  ];

  const adminNav: { label: string; path: string; badge?: string }[] = [
    { label: 'Super Admin', path: '/super-admin' },
    { label: 'Platform', path: '/' },
    { label: 'Revenue', path: '/' },
  ];

  const getNavigation = () => {
    if (!user) return [];
    switch (user.role) {
      case 'supplier': return supplierNav;
      case 'buyer': return buyerNav;
      case 'admin': return adminNav;
      default: return [];
    }
  };

  return (
    <>
      {/* Fixed Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: '68px',
        background: scrolled ? 'rgba(5,13,26,0.99)' : 'rgba(5,13,26,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #162438',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        {/* Gold line at very top */}
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
          width: '100%'
        }} />

        {/* Content wrapper */}
        <div style={{
          background: 'transparent',
          padding: '0 24px',
          height: 'calc(100% - 2px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0A0F1E',
            fontWeight: 'bold',
            fontSize: '16px',
            fontFamily: 'Syne, sans-serif'
          }}>BB</div>
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
            color: '#F8FAFC'
          }}>
            Brands <span style={{ color: '#D4AF37' }}>Bridge</span>
            <span style={{
              background: 'linear-gradient(135deg, #0B6E8C, #0EA5C9)',
              color: 'white',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              marginLeft: '6px',
              fontWeight: 600
            }}>AI</span>
          </span>
        </div>

        {/* Navigation Links */}
        {user && (
          <div style={{ display: 'flex', gap: '4px' }}>
            {getNavigation().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (item.path === '/') handleToast('This feature is being finalized. Coming in the next update!');
                  setActiveLink(item.path);
                }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  color: activeLink === item.path ? '#D4AF37' : '#94A3B8',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (activeLink !== item.path) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.color = '#F8FAFC';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeLink !== item.path) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#94A3B8';
                  }
                }}
              >
                {item.label}
                {item.badge && (
                  <span style={{
                    padding: '2px 8px',
                    background: '#EF4444',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    borderRadius: '100px',
                    animation: 'live-pulse 1.5s ease-in-out infinite'
                  }}>
                    {item.badge}
                  </span>
                )}
                {activeLink === item.path && (
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    height: '2px',
                    background: '#D4AF37',
                    borderRadius: '1px'
                  }} />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Public Navigation */}
        {!user && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <Link to="/companies"
              onClick={() => setActiveLink('/companies')}
              style={{
                position: 'relative',
                padding: '8px 16px',
                color: activeLink === '/companies' ? '#D4AF37' : '#94A3B8',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeLink !== '/companies') {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.color = '#F8FAFC';
                }
              }}
              onMouseLeave={(e) => {
                if (activeLink !== '/companies') {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#94A3B8';
                }
              }}
            >
              Expo Hall
              {activeLink === '/companies' && (
                <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '2px', background: '#D4AF37' }} />
              )}
            </Link>
            <Link to="/how-it-works"
              onClick={() => setActiveLink('/how-it-works')}
              style={{
                position: 'relative',
                padding: '8px 16px',
                color: activeLink === '/how-it-works' ? '#D4AF37' : '#94A3B8',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeLink !== '/how-it-works') {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.color = '#F8FAFC';
                }
              }}
              onMouseLeave={(e) => {
                if (activeLink !== '/how-it-works') {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#94A3B8';
                }
              }}
            >
              How It Works
              {activeLink === '/how-it-works' && (
                <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '2px', background: '#D4AF37' }} />
              )}
            </Link>
            <Link to="/pricing"
              onClick={() => setActiveLink('/pricing')}
              style={{
                position: 'relative',
                padding: '8px 16px',
                color: activeLink === '/pricing' ? '#D4AF37' : '#94A3B8',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeLink !== '/pricing') {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.color = '#F8FAFC';
                }
              }}
              onMouseLeave={(e) => {
                if (activeLink !== '/pricing') {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#94A3B8';
                }
              }}
            >
              Pricing
              {activeLink === '/pricing' && (
                <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '2px', background: '#D4AF37' }} />
              )}
            </Link>
            <Link to="/market"
              onClick={() => setActiveLink('/market')}
              style={{
                position: 'relative',
                padding: '8px 16px',
                color: activeLink === '/market' ? '#D4AF37' : '#94A3B8',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeLink !== '/market') {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.color = '#F8FAFC';
                }
              }}
              onMouseLeave={(e) => {
                if (activeLink !== '/market') {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#94A3B8';
                }
              }}
            >
              Market Prices
              {activeLink === '/market' && (
                <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '2px', background: '#D4AF37' }} />
              )}
            </Link>
            {/* VR Experience Link */}
            <Link to="/vr-experience"
              onClick={() => setActiveLink('/vr-experience')}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                color: '#22D3EE',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                background: 'rgba(34, 211, 238, 0.1)',
                border: '1px solid rgba(34, 211, 238, 0.3)'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(34, 211, 238, 0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(34, 211, 238, 0.1)';
              }}
            >
              🥽 VR 2027
            </Link>
            {/* Live Expo Link */}
            <Link to="/live-expo"
              onClick={() => setActiveLink('/live-expo')}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: 'rgba(239,68,68,0.2)',
                border: '1px solid rgba(239,68,68,0.4)',
                color: '#EF4444',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)';
              }}
            >
              <span style={{
                width: '6px',
                height: '6px',
                background: '#EF4444',
                borderRadius: '50%',
                animation: 'live-pulse 1.5s ease-in-out infinite'
              }} />
              LIVE NOW
            </Link>
          </div>
        )}

        {/* Auth / User Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isDemo && (
            <div style={{
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#F59E0B',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              lineHeight: 1.4,
            }}>
              🧪 DEMO MODE
            </div>
          )}
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 12px',
                  background: dropdownOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: '1px solid #1E2D45',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0A0F1E',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  fontFamily: 'Syne, sans-serif'
                }}>
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span style={{ color: '#F8FAFC', fontSize: '14px', fontWeight: 500 }}>
                  {user.company || user.name || 'User'}
                </span>
                <ChevronDown style={{ width: '16px', height: '16px', color: '#94A3B8', transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  minWidth: '220px',
                  zIndex: 1001
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #1E2D45', marginBottom: '8px' }}>
                    <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
                    <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '2px' }}>{user.email}</div>
                  </div>

                  {(() => {
                    const role = user?.role;
                    const profilePath = role === 'supplier' ? '/supplier/profile-editor'
                      : role === '3pl' ? '/3pl/profile'
                      : role === 'buyer' ? '/buyer/settings'
                      : null;
                    const settingsPath = role === 'buyer' ? '/buyer/settings'
                      : role === 'supplier' ? '/supplier/profile-editor'
                      : role === '3pl' ? '/3pl/profile'
                      : role === 'admin' ? '/super-admin'
                      : null;
                    return [
                      { icon: User, label: 'My Profile', action: () => profilePath ? navigate(profilePath) : handleToast('Sign in to view your profile') },
                      { icon: Settings, label: 'Settings', action: () => settingsPath ? navigate(settingsPath) : handleToast('Sign in to access settings') },
                      { icon: CreditCard, label: 'Billing', action: () => handleToast('Billing portal opens in your role workspace. Contact billing@brandsbridge.ai for invoices.') },
                    ];
                  })().map((item, i) => (
                    <button
                      key={i}
                      onClick={item.action}
                      className="dropdown-item"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        background: 'transparent',
                        border: 'none',
                        color: '#F8FAFC',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      <item.icon style={{ width: '16px', height: '16px' }} />
                      {item.label}
                    </button>
                  ))}

                  <div style={{ borderTop: '1px solid #1E2D45', marginTop: '8px', paddingTop: '8px' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#EF4444',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.1)'}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      <LogOut style={{ width: '16px', height: '16px' }} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login"
                style={{
                  padding: '8px 16px',
                  color: '#94A3B8',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#94A3B8';
                }}
              >
                Login
              </Link>
              <Link to="/register"
                className="btn-gold"
                style={{
                  padding: '10px 20px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Join Free
                <span style={{ marginLeft: '4px' }}>→</span>
              </Link>
            </>
          )}
        </div>
        </div>
      </header>
    </>
  );
};

export default Header;
