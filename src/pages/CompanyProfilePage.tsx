import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  BadgeCheck,
  MapPin,
  Globe,
  Mail,
  DollarSign,
  Phone,
  Calendar,
  Users,
  Building2,
  ExternalLink,
  MessageCircle,
  FileText,
  Video,
  Share2,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Shield,
  Star,
  Send,
  X,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { companies, Company } from '../data/mockData';
import MeetingRequestModal from '../components/MeetingRequestModal';
import EmailInquiryModal from '../components/EmailInquiryModal';
import BackButton from '../components/BackButton';
import Breadcrumb from '../components/Breadcrumb';
import VirtualBoothModal from '../components/VirtualBoothModal';

const CompanyProfilePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const company = companies.find(c => c.slug === slug || c.name.toLowerCase().replace(/\s+/g, '-') === slug);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [showVirtualBooth, setShowVirtualBooth] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'products' | 'certifications'>('about');

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-slate-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Company Not Found</h1>
          <p className="text-slate-400 mb-6">
            The company profile you're looking for doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => navigate('/companies')}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Expo Hall
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #050D1A 0%, #071120 100%)' }}>
      {/* Header */}
      <div className="bg-[#071120]/80 backdrop-blur-xl border-b border-[#162438] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb items={[
              { label: 'Home', to: '/' },
              { label: 'Expo Hall', to: '/companies' },
              { label: company.name }
            ]} />
            <BackButton label="Back to Expo Hall" to="/companies" />
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Company Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800/50 to-slate-900 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Company Info */}
            <div className="flex items-start gap-4 lg:gap-6">
              <div className="relative">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-20 h-20 lg:w-28 lg:h-28 rounded-2xl object-cover bg-white shadow-lg border-2 border-slate-700"
                />
                {company.verified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
                    <BadgeCheck className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">{company.name}</h1>
                  {company.verified && (
                    <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold">
                      KYB VERIFIED
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    company.subscriptionPlan === 'Expo' ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 border border-amber-500/30' :
                    company.subscriptionPlan === 'Premium' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    'bg-slate-700/50 text-slate-400'
                  }`}>
                    {company.subscriptionPlan}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-slate-400 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{company.countryFlag}</span>
                    <span>{company.city}, {company.country}</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                    company.businessType === 'Manufacturer' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    company.businessType === 'Exporter' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    company.businessType === 'Distributor' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    'bg-slate-700/50 text-slate-400'
                  }`}>
                    {company.businessType}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-white font-medium">4.8</span>
                    <span className="text-slate-500">(125 reviews)</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.categories.map((cat, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-700/50 border border-slate-600/30 text-slate-300 rounded-lg text-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Reliability Score */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-4 lg:min-w-[200px]">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-1">97%</div>
                <div className="text-xs text-emerald-400/70 mb-3">AI Reliability Score</div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full" style={{ width: '97%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-slate-800/50 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-slate-400">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium">{company.employees}</span>
                <span className="text-slate-500">employees</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium">Est. {company.yearEstablished}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-medium">{company.exportCountries.length}</span>
                <span className="text-slate-500">export markets</span>
              </div>
              {company.minOrderValue && (
                <div className="flex items-center gap-2 text-slate-400">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-medium">MOQ {company.minOrderValue}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors font-medium text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Unclaimed Profile Banner */}
      {company.status === 'unclaimed' && (
        <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-b border-amber-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">This profile hasn't been claimed by the company yet</div>
                  <div className="text-amber-300/80 text-sm">Contact information may be incomplete. Are you from {company.name}?</div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/claim/${company.slug}`)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:from-[#D4AF37]/90 hover:to-[#B8962E]/90 transition-all flex items-center gap-2"
              >
                Claim This Profile
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Virtual Booth Button - Prominent */}
            <button
              onClick={() => setShowVirtualBooth(true)}
              style={{
                background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                padding: '20px 24px',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(124, 58, 237, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.3)';
              }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '32px' }}>🥽</span>
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    background: '#D4AF37',
                    color: '#050D1A',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    fontFamily: 'Inter'
                  }}>NEW</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontFamily: 'Inter' }}>
                    Visit this company virtually from your screen
                  </span>
                </div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '18px', fontFamily: 'Inter' }}>
                  Enter Virtual Booth →
                </div>
              </div>
            </button>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="group relative p-5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl text-left overflow-hidden transition-all hover:from-blue-500/30 hover:to-blue-600/30 hover:border-blue-500/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Send className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Send Inquiry</div>
                    <div className="text-slate-400 text-sm">Get response in 24h</div>
                  </div>
                </div>
              </button>

              <button className="group relative p-5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-2xl text-left overflow-hidden transition-all hover:from-amber-500/30 hover:to-amber-600/30 hover:border-amber-500/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                    <FileText className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Request Quote</div>
                    <div className="text-slate-400 text-sm">RFQ with pricing</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsMeetingModalOpen(true)}
                className="group relative p-5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl text-left overflow-hidden transition-all hover:from-purple-500/30 hover:to-purple-600/30 hover:border-purple-500/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Video className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Book Meeting</div>
                    <div className="text-slate-400 text-sm">30-min consultation</div>
                  </div>
                </div>
              </button>

              <button className="group relative p-5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-2xl text-left overflow-hidden transition-all hover:from-emerald-500/30 hover:to-emerald-600/30 hover:border-emerald-500/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <Phone className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Call Export Manager</div>
                    <div className="text-slate-400 text-sm">Direct contact</div>
                  </div>
                </div>
              </button>
            </div>

            {/* About Section */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                About Company
              </h2>
              <p className="text-slate-300 leading-relaxed">{company.description}</p>
            </section>

            {/* Gallery Section */}
            {company.gallery.length > 0 && (
              <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Product Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {company.gallery.map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`${company.name} product ${idx + 1}`}
                      className="w-full aspect-square object-cover rounded-xl border border-slate-700/50"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Export Markets Section */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Export Markets
              </h2>
              <div className="flex flex-wrap gap-2">
                {company.exportCountries.map((country, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-slate-700/50 border border-slate-600/30 text-slate-300 rounded-lg text-sm font-medium"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </section>

            {/* Certifications Section */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                Certifications
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {company.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-emerald-300 font-medium text-sm">{cert}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Trade Information */}
            {(company.paymentTerms || company.shippingPorts || company.leadTime) && (
              <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Trade Information
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {company.paymentTerms && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <div className="text-blue-400 text-sm font-medium mb-2">Payment Terms</div>
                      <div className="text-slate-300 text-sm">{company.paymentTerms.join(', ')}</div>
                    </div>
                  )}
                  {company.shippingPorts && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="text-emerald-400 text-sm font-medium mb-2">Shipping Ports</div>
                      <div className="text-slate-300 text-sm">{company.shippingPorts.join(', ')}</div>
                    </div>
                  )}
                  {company.leadTime && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <div className="text-amber-400 text-sm font-medium mb-2">Lead Time</div>
                      <div className="text-slate-300 text-sm">{company.leadTime}</div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Contact & Details */}
          <div className="space-y-6">
            {/* Company Details Card */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Company Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-400">Business Type</div>
                    <div className="text-white font-medium">{company.businessType}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-400">Year Established</div>
                    <div className="text-white font-medium">{company.yearEstablished}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-400">Employees</div>
                    <div className="text-white font-medium">{company.employees}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-400">Location</div>
                    <div className="text-white font-medium">{company.city}, {company.country}</div>
                  </div>
                </div>
                {company.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-400">Website</div>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 font-medium hover:text-blue-300 flex items-center gap-1"
                      >
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Export Manager Contact */}
            <section className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Export Manager</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 font-bold text-lg">
                    {company.exportManager.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{company.exportManager.name}</div>
                    <div className="text-blue-400/70 text-sm">Export Manager</div>
                  </div>
                </div>
                <a
                  href={`mailto:${company.exportManager.email}`}
                  className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors"
                >
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div className="text-blue-300 text-sm truncate">{company.exportManager.email}</div>
                </a>
                <a
                  href={`https://wa.me/${company.exportManager.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  <div className="text-green-300 text-sm">WhatsApp Direct</div>
                </a>
              </div>
            </section>

            {/* Sales Manager Contact */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Sales Manager</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-lg">
                    {company.salesManager.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{company.salesManager.name}</div>
                    <div className="text-slate-400 text-sm">Sales Manager</div>
                  </div>
                </div>
                <a
                  href={`mailto:${company.salesManager.email}`}
                  className="flex items-center gap-3 p-3 bg-slate-700/50 border border-slate-600/30 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div className="text-slate-300 text-sm truncate">{company.salesManager.email}</div>
                </a>
              </div>
            </section>

            {/* Trust Badge */}
            <section className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-lg font-semibold text-white">Verified Company</div>
              </div>
              <p className="text-sm text-slate-400">
                This company has been verified by Brands Bridge AI. Contact information and business details have been confirmed.
              </p>
            </section>

            {/* Back Button */}
            <button
              onClick={() => navigate('/companies')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 border border-slate-600/30 text-slate-300 font-medium rounded-xl hover:bg-slate-700 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Expo Hall
            </button>
          </div>
        </div>
      </div>

      {/* Meeting Request Modal */}
      {company && (
        <MeetingRequestModal
          company={company}
          isOpen={isMeetingModalOpen}
          onClose={() => setIsMeetingModalOpen(false)}
        />
      )}

      {/* Email Inquiry Modal */}
      {company && (
        <EmailInquiryModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          companyId={company.id}
          companyName={company.name}
          companyEmail={company.internationalSalesEmail || company.email}
        />
      )}

      {/* Virtual Booth Modal */}
      {company && showVirtualBooth && (
        <VirtualBoothModal
          company={company}
          onClose={() => setShowVirtualBooth(false)}
        />
      )}
    </div>
  );
};

export default CompanyProfilePage;
