import { useState, useRef, useEffect } from 'react';
import { X, ArrowLeft, MapPin, Calendar, Users, Globe, Package, Play, Factory, Grid3X3, Map, Star, CheckCircle, Phone, Mail, MessageCircle, Video, ExternalLink, Share2, Heart, Download, Clock, ChevronRight, Compass } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Company } from '../data/mockData';

interface VirtualBoothModalProps {
  company: Company;
  onClose: () => void;
}

type TabType = 'video' | 'factory' | 'products' | 'overview';

const VirtualBoothModal = ({ company, onClose }: VirtualBoothModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0 });
  const [startPos, setStartPos] = useState({ x: 0 });
  const [showDragHint, setShowDragHint] = useState(true);
  const [compassAngle, setCompassAngle] = useState(0);

  // Hotspots for factory tour
  const hotspots = [
    { id: 1, x: 30, y: 40, label: 'Production Line', desc: 'State-of-the-art automated production facility', icon: '🏭' },
    { id: 2, x: 60, y: 25, label: 'Quality Control Lab', desc: 'ISO certified laboratory for product testing', icon: '🔬' },
    { id: 3, x: 75, y: 60, label: 'Packaging Area', desc: 'Modern packaging with halal tracking', icon: '📦' },
    { id: 4, x: 45, y: 70, label: 'Cold Storage', desc: 'Temperature-controlled storage facility', icon: '❄️' },
  ];
  const [activeHotspot, setActiveHotspot] = useState<typeof hotspots[0] | null>(null);

  // Handle drag for factory tour
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x });
    setShowDragHint(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - startPos.x;
    setPosition({ x: Math.max(-300, Math.min(300, newX)) });
    setCompassAngle(newX / 10);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const tabs = [
    { id: 'video' as TabType, label: 'Company Video', icon: Play },
    { id: 'factory' as TabType, label: 'Factory Tour', icon: Factory },
    { id: 'products' as TabType, label: 'Products', icon: Grid3X3 },
    { id: 'overview' as TabType, label: 'Overview', icon: Map },
  ];

  const handleRequestSample = (productName: string) => {
    toast.success(`Sample request sent! ${company.name} will contact you within 24 hours.`);
  };

  const handleAddToRFQ = (productName: string) => {
    toast.success(`Added "${productName}" to your RFQ! View in Procurement Hub.`);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050D1A] animate-slideUp">
      {/* Header */}
      <header className="h-[60px] bg-[#050D1A] border-b border-[#162438] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <img src={company.logo} alt={company.name} className="w-8 h-8 rounded-lg object-cover" />
          <div>
            <h2 className="text-white font-semibold flex items-center gap-2">
              {company.name}
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full flex items-center gap-1">
                🥽 Virtual Booth
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {company.city}, {company.country} {company.countryFlag}
          </span>
          <button className="px-3 py-1.5 border border-[#D4AF37] text-[#D4AF37] rounded-lg text-sm hover:bg-[#D4AF37]/10 transition-colors">
            Book Real Visit
          </button>
          <button className="px-3 py-1.5 bg-[#0B6E8C] text-white rounded-lg text-sm hover:bg-[#0B6E8C]/80 transition-colors flex items-center gap-1">
            <Video className="w-4 h-4" />
            Request Meeting
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="h-[calc(100vh-60px)] grid grid-cols-[1fr_380px]">
        {/* Left Side */}
        <div className="flex flex-col overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex gap-1 p-4 border-b border-[#162438]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* VIDEO TAB */}
            {activeTab === 'video' && (
              <div className="animate-fadeIn">
                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${company.videoId || 'kU6FGkSBmvE'}?autoplay=0&rel=0&modestbranding=1`}
                    title={`${company.name} - Company Introduction`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-xl"
                  />
                </div>
                <div className="bg-[#0C1829] rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-1">{company.name} — Company & Products Overview</h3>
                  <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                    <span>Duration: 4:32</span>
                    <span>•</span>
                    <span>12,450 views</span>
                    <span>•</span>
                    <span>March 2025</span>
                  </div>
                  <details className="group">
                    <summary className="cursor-pointer text-gray-400 text-sm flex items-center gap-2 hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                      View description
                    </summary>
                    <p className="mt-2 text-gray-400 text-sm pl-6">
                      Learn about our manufacturing capabilities, product range, quality certifications, and export services.
                      We have been serving the GCC market for over {new Date().getFullYear() - company.yearEstablished} years with premium food products.
                    </p>
                  </details>
                </div>
              </div>
            )}

            {/* FACTORY TOUR TAB */}
            {activeTab === 'factory' && (
              <div className="animate-fadeIn">
                <div className="mb-4">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    🏭 360° Factory Tour
                  </h3>
                  <p className="text-gray-400 text-sm">Click and drag to explore the facility</p>
                </div>

                <div
                  className="relative aspect-[16/9] bg-[#0C1829] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {/* Factory Image with pan */}
                  <div
                    className="absolute inset-0 transition-transform duration-75"
                    style={{ transform: `translateX(${position.x}px)` }}
                  >
                    <img
                      src={company.factoryImage || 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1200'}
                      alt="Factory Tour"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>

                  {/* Compass */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#D4AF37]" style={{ transform: `rotate(${-compassAngle}deg)` }} />
                    <span className="text-white text-sm font-mono">
                      {compassAngle > 10 ? 'E' : compassAngle < -10 ? 'W' : 'N'}{Math.abs(compassAngle).toFixed(0)}°
                    </span>
                  </div>

                  {/* Drag Hint */}
                  {showDragHint && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2 animate-bounce">👆</div>
                        <p className="text-white font-medium">Click and drag to look around</p>
                      </div>
                    </div>
                  )}

                  {/* Hotspots */}
                  {hotspots.map((spot) => (
                    <div
                      key={spot.id}
                      className="absolute group"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    >
                      <div className="relative">
                        <div className="w-6 h-6 bg-white/80 rounded-full animate-pulse flex items-center justify-center text-sm cursor-pointer">
                          {spot.icon}
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {spot.label}
                        </div>
                      </div>
                      {activeHotspot?.id === spot.id && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-[#0C1829] border border-[#162438] rounded-xl p-4 shadow-xl z-10">
                          <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
                            <span>{spot.icon}</span> {spot.label}
                          </h4>
                          <p className="text-gray-400 text-sm">{spot.desc}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Hotspot List */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {hotspots.map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => setActiveHotspot(activeHotspot?.id === spot.id ? null : spot)}
                      className={`p-3 bg-[#0C1829] rounded-lg text-left transition-all ${
                        activeHotspot?.id === spot.id ? 'border border-purple-500/50' : 'border border-[#162438]'
                      }`}
                    >
                      <div className="text-lg mb-1">{spot.icon}</div>
                      <div className="text-white text-sm font-medium">{spot.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="animate-fadeIn">
                <div className="mb-4">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    📦 Product Catalog
                  </h3>
                  <p className="text-gray-400 text-sm">Click any product to see full details</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.products?.map((product) => (
                    <div key={product.id} className="bg-[#0C1829] rounded-xl overflow-hidden border border-[#162438] hover:border-[#D4AF37]/50 transition-all">
                      <img src={product.image} alt={product.name} className="w-full h-36 object-cover" />
                      <div className="p-4">
                        <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">{product.name}</h4>
                        <div className="text-[#D4AF37] font-semibold text-sm mb-1">{product.priceRange}</div>
                        <div className="text-gray-500 text-xs mb-2">{product.unit}</div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.certifications.map((cert) => (
                            <span key={cert} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                              {cert}
                            </span>
                          ))}
                        </div>
                        <div className="text-gray-400 text-xs mb-3">
                          MOQ: {product.moq} • {product.leadTime}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRequestSample(product.name)}
                            className="flex-1 py-2 bg-[#D4AF37] text-[#050D1A] rounded-lg text-xs font-semibold hover:bg-[#D4AF37]/90 transition-colors"
                          >
                            Request Sample
                          </button>
                          <button
                            onClick={() => handleAddToRFQ(product.name)}
                            className="flex-1 py-2 bg-white/10 text-white rounded-lg text-xs font-medium hover:bg-white/20 transition-colors"
                          >
                            Add to RFQ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="animate-fadeIn space-y-6">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                    🗺️ Company at a Glance
                  </h3>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#0C1829] rounded-xl p-4 text-center border border-[#162438]">
                      <Calendar className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                      <div className="text-white font-bold text-xl">{company.yearEstablished}</div>
                      <div className="text-gray-400 text-xs">Est. Year</div>
                    </div>
                    <div className="bg-[#0C1829] rounded-xl p-4 text-center border border-[#162438]">
                      <Users className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                      <div className="text-white font-bold text-xl">{company.employees}</div>
                      <div className="text-gray-400 text-xs">Employees</div>
                    </div>
                    <div className="bg-[#0C1829] rounded-xl p-4 text-center border border-[#162438]">
                      <Globe className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                      <div className="text-white font-bold text-xl">{company.exportCountries?.length || 5}+</div>
                      <div className="text-gray-400 text-xs">Countries</div>
                    </div>
                    <div className="bg-[#0C1829] rounded-xl p-4 text-center border border-[#162438]">
                      <Package className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                      <div className="text-white font-bold text-xl">{company.monthlyContainers || '50+'}</div>
                      <div className="text-gray-400 text-xs">Containers/Month</div>
                    </div>
                  </div>
                </div>

                {/* Location Map */}
                <div className="bg-[#0C1829] rounded-xl overflow-hidden border border-[#162438]">
                  <div className="relative h-48">
                    <img
                      src={`https://source.unsplash.com/800x400/?${company.city?.toLowerCase() || 'city'},architecture`}
                      alt={company.city}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C1829] to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#D4AF37]" />
                          {company.city}, {company.country} {company.countryFlag}
                        </div>
                        <div className="text-gray-400 text-sm">Manufacturing Hub</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-[#0C1829] rounded-xl p-4 border border-[#162438]">
                  <h4 className="text-white font-semibold mb-4">Company Milestones</h4>
                  <div className="space-y-3">
                    {company.milestones?.map((milestone, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 text-[#D4AF37] font-semibold">{milestone.year}</div>
                        <div className="flex-1 h-px bg-[#162438]" />
                        <div className="flex-1 text-gray-300 text-sm">{milestone.event}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export Markets */}
                <div className="bg-[#0C1829] rounded-xl p-4 border border-[#162438]">
                  <h4 className="text-white font-semibold mb-4">Export Markets</h4>
                  <div className="flex flex-wrap gap-2">
                    {company.exportCountries?.map((country) => (
                      <span key={country} className="px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg text-sm">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Panel */}
        <div className="bg-[#0C1829] border-l border-[#162438] p-4 overflow-y-auto space-y-4">
          {/* Live Status */}
          {company.isLive ? (
            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent rounded-xl p-4 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-semibold">LIVE NOW</span>
              </div>
              <p className="text-gray-400 text-sm mb-3">Export Team Online</p>
              <p className="text-gray-500 text-xs mb-3 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Avg response: 2 min
              </p>
              <button className="w-full py-2 bg-emerald-500 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                <Video className="w-4 h-4" /> Join Live Session →
              </button>
            </div>
          ) : (
            <div className="bg-[#050D1A] rounded-xl p-4 border border-[#162438]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                <span className="text-gray-400 font-medium">Available for calls</span>
              </div>
              <p className="text-gray-500 text-sm mb-3">Response: within 24h</p>
              <button className="w-full py-2 bg-[#0B6E8C] text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                <Video className="w-4 h-4" /> Book Video Call →
              </button>
            </div>
          )}

          {/* Quick Contact */}
          <div className="bg-[#050D1A] rounded-xl p-4 border border-[#162438]">
            <h4 className="text-white font-semibold mb-3">Connect with Export Team</h4>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {company.contactPerson?.name?.[0] || company.exportManager?.name?.[0] || 'E'}
              </div>
              <div>
                <div className="text-white font-medium">{company.contactPerson?.name || company.exportManager?.name}</div>
                <div className="text-gray-400 text-sm">{company.contactPerson?.title || 'Export Manager'}</div>
                <div className="flex gap-1 mt-1">
                  {company.contactPerson?.languages?.map((lang) => (
                    <span key={lang} className="text-xs">{lang}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <a href={`https://wa.me/${company.whatsapp?.replace(/[^0-9]/g, '')}`} className="w-full py-2.5 bg-[#25D366] text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a href={`mailto:${company.email}`} className="w-full py-2.5 bg-[#0B6E8C] text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Send Email
              </a>
              <button className="w-full py-2.5 border border-[#D4AF37] text-[#D4AF37] rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> Book Meeting
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-[#050D1A] rounded-xl p-4 border border-[#162438]">
            <h4 className="text-white font-semibold mb-3">Trust & Verification</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle className="w-4 h-4" /> KYB Verified Company
              </div>
              {company.certifications?.map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4" /> {cert}
                </div>
              ))}
              {company.rating && (
                <div className="flex items-center gap-2 text-amber-400 text-sm">
                  <Star className="w-4 h-4 fill-current" /> {company.rating}/5 ({company.reviewCount} reviews)
                </div>
              )}
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <Package className="w-4 h-4" /> {company.exportCount || 50}+ successful exports
              </div>
              <div className="flex items-center gap-2 text-purple-400 text-sm">
                <CheckCircle className="w-4 h-4" /> Escrow Protected
              </div>
            </div>
          </div>

          {/* Active Cargo */}
          {company.activeCargo && (
            <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-xl p-4 border border-[#D4AF37]/30">
              <h4 className="text-[#D4AF37] font-semibold mb-3 flex items-center gap-2">
                🚢 Cargo Available Now
              </h4>
              <div className="bg-[#050D1A] rounded-lg p-3 mb-3">
                <div className="text-white text-sm font-medium">{company.activeCargo.product}</div>
                <div className="text-gray-400 text-xs mt-1">
                  {company.activeCargo.containerType} • {company.activeCargo.route}
                </div>
                <div className="text-[#D4AF37] font-bold mt-2">
                  from ${company.activeCargo.price.toLocaleString()}
                </div>
              </div>
              <button className="w-full py-2 bg-[#D4AF37] text-[#050D1A] rounded-lg font-semibold text-sm">
                Reserve →
              </button>
            </div>
          )}

          {/* Share & Save */}
          <div className="bg-[#050D1A] rounded-xl p-4 border border-[#162438]">
            <h4 className="text-white font-semibold mb-3">Actions</h4>
            <div className="space-y-2">
              <button className="w-full py-2 bg-white/5 text-white rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                <Heart className="w-4 h-4" /> Save Company
              </button>
              <button className="w-full py-2 bg-white/5 text-white rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                <Share2 className="w-4 h-4" /> Share Profile
              </button>
              <button className="w-full py-2 bg-white/5 text-white rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                <Download className="w-4 h-4" /> Download Catalog PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease forwards; }
      `}</style>
    </div>
  );
};

export default VirtualBoothModal;
