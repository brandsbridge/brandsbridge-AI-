import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Warehouse, Shield, Package, MapPin, Calendar, Sparkles,
  CheckCircle, Globe, FileText, Send, X, Plus, ChevronRight,
  Snowflake, Droplets, Sun, FlaskConical, Truck, Building2,
  Award, Star, Clock, ArrowLeft, Eye
} from 'lucide-react';

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

const countries = [
  { name: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'Qatar', flag: '🇶🇦' },
  { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'Kuwait', flag: '🇰🇼' },
  { name: 'Bahrain', flag: '🇧🇭' },
  { name: 'Oman', flag: '🇴🇲' },
  { name: 'Egypt', flag: '🇪🇬' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Singapore', flag: '🇸🇬' }
];

const ThreePLProfilePage = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    companyName: 'Gulf Cold Chain Co.',
    tagline: 'Premium cold storage solutions across the GCC',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    city: 'Dubai',
    yearEstablished: 2015,
    warehouseCount: 2,
    totalCapacity: 2000,
    services: ['Frozen Storage', 'Chilled Storage', 'Ambient Storage'],
    certifications: ['ISO 22000', 'Halal Certified Storage'],
    about: 'Leading provider of temperature-controlled storage solutions in the GCC region.',
    contactPerson: 'Ahmed Al Mansoori',
    contactTitle: 'Business Development Manager',
    whatsapp: '+971501234567',
    email: 'business@gulfcoldchain.ae',
    languages: ['English', 'Arabic'],
    showPricing: true,
    pricing: {
      frozen: 2.5,
      chilled: 3.0,
      ambient: 1.8,
      minBooking: 20
    }
  });

  const [newLanguage, setNewLanguage] = useState('');

  const allServices = [
    'Frozen Storage (-25°C to -15°C)',
    'Chilled Storage (0°C to 8°C)',
    'Ambient Storage (15°C to 25°C)',
    'Controlled Atmosphere',
    'Hazmat Storage',
    'Bonded Warehouse',
    'Cross-Docking',
    'Pick & Pack',
    'Inventory Management',
    'Last-Mile Delivery',
    'Customs Clearance'
  ];

  const allCertifications = [
    'ISO 9001',
    'ISO 22000',
    'HACCP',
    'Halal Certified Storage',
    'GDP (Good Distribution Practice)',
    'FIATA Member',
    'Customs Bonded'
  ];

  const handleCountryChange = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    setFormData(prev => ({
      ...prev,
      country: countryName,
      countryFlag: country?.flag || '🏳️'
    }));
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const toggleCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const addLanguage = () => {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang)
    }));
  };

  const generateTagline = () => {
    const taglines = [
      'Your trusted cold chain partner in the GCC',
      'Precision temperature control for global trade',
      'Keeping your products safe from origin to destination',
      'Advanced cold storage for modern supply chains',
      'Temperature-controlled excellence across the Gulf'
    ];
    const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];
    setFormData(prev => ({ ...prev, tagline: randomTagline }));
    toast.success('Tagline generated with AI!');
  };

  const improveAbout = () => {
    const improved = `Gulf Cold Chain Co. is a premier provider of comprehensive temperature-controlled storage solutions, serving the GCC's dynamic FMCG and food distribution industry since 2015. With state-of-the-art facilities in Dubai Industrial City, we offer ${formData.services.length}+ specialized storage solutions. Our commitment to quality is backed by ${formData.certifications.join(', ')} certifications, ensuring the highest standards of food safety and supply chain integrity.`;
    setFormData(prev => ({ ...prev, about: improved }));
    toast.success('About section improved with AI!');
  };

  const calculateCompleteness = () => {
    let score = 0;
    const items = [
      formData.companyName,
      formData.tagline,
      formData.country,
      formData.city,
      formData.yearEstablished > 1900,
      formData.services.length > 0,
      formData.certifications.length > 0,
      formData.about.length > 50,
      formData.contactPerson,
      formData.whatsapp,
      formData.email
    ];
    items.forEach(item => {
      if (typeof item === 'boolean' && item) score += 9;
      else if (typeof item === 'number' && item > 0) score += 9;
      else if (typeof item === 'string' && item.length > 0) score += 9;
    });
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  const handlePublish = () => {
    toast.success('Profile live! Your 3PL profile is now visible in the Expo Hall.');
    navigate('/3pl/dashboard');
  };

  const getZoneIcon = (service: string) => {
    if (service.includes('Frozen')) return <Snowflake className="w-4 h-4" />;
    if (service.includes('Chilled')) return <Droplets className="w-4 h-4" />;
    if (service.includes('Ambient')) return <Sun className="w-4 h-4" />;
    return <FlaskConical className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen" style={{ background: colors.bg }}>
      {/* Header */}
      <div className="border-b" style={{ background: colors.sidebar, borderColor: colors.border }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/3pl/dashboard')}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">My Public Profile</h1>
                <p className="text-sm text-gray-400">Build your 3PL company presence on Brands Bridge AI</p>
              </div>
            </div>
            <button
              onClick={handlePublish}
              className="px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all hover:opacity-90"
              style={{ background: colors.accent, color: colors.bg }}
            >
              <Globe className="w-4 h-4" />
              Publish Profile
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left - Edit Form (60%) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Info */}
            <div className="rounded-xl border p-6" style={{ background: colors.card, borderColor: colors.border }}>
              <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Company Name *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                    style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Logo</label>
                  <div
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-opacity-80 transition-all"
                    style={{ borderColor: colors.border }}
                  >
                    <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ background: colors.accent }}>
                      <Warehouse className="w-8 h-8" style={{ color: colors.bg }} />
                    </div>
                    <p className="text-sm text-gray-400">Drag & drop your logo or</p>
                    <button className="text-sm font-medium mt-1" style={{ color: colors.accent }}>Browse Files</button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-gray-400">Tagline</label>
                    <button
                      onClick={generateTagline}
                      className="text-xs flex items-center gap-1 px-2 py-1 rounded"
                      style={{ background: 'rgba(212,175,55,0.15)', color: colors.gold }}
                    >
                      <Sparkles className="w-3 h-3" /> Generate with AI
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={e => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    maxLength={80}
                    className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                    style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">{formData.tagline.length}/80</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Country *</label>
                    <select
                      value={formData.country}
                      onChange={e => handleCountryChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    >
                      {countries.map(c => (
                        <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Year Established</label>
                    <input
                      type="number"
                      value={formData.yearEstablished}
                      onChange={e => setFormData(prev => ({ ...prev, yearEstablished: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Warehouses</label>
                    <input
                      type="number"
                      value={formData.warehouseCount}
                      onChange={e => setFormData(prev => ({ ...prev, warehouseCount: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Total Capacity</label>
                    <input
                      type="number"
                      value={formData.totalCapacity}
                      onChange={e => setFormData(prev => ({ ...prev, totalCapacity: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div className="rounded-xl border p-6" style={{ background: colors.card, borderColor: colors.border }}>
              <h2 className="text-lg font-semibold text-white mb-4">Services Offered</h2>
              <div className="grid grid-cols-2 gap-3">
                {allServices.map(service => (
                  <label
                    key={service}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                    style={{
                      background: formData.services.includes(service) ? 'rgba(56,189,248,0.1)' : 'transparent',
                      borderColor: formData.services.includes(service) ? colors.accent : colors.border
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => toggleService(service)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: colors.accent }}
                    />
                    <span className="text-sm" style={{ color: formData.services.includes(service) ? 'white' : colors.silver }}>
                      {service}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="rounded-xl border p-6" style={{ background: colors.card, borderColor: colors.border }}>
              <h2 className="text-lg font-semibold text-white mb-4">Certifications</h2>
              <div className="grid grid-cols-2 gap-3">
                {allCertifications.map(cert => (
                  <label
                    key={cert}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                    style={{
                      background: formData.certifications.includes(cert) ? 'rgba(212,175,55,0.1)' : 'transparent',
                      borderColor: formData.certifications.includes(cert) ? colors.gold : colors.border
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.certifications.includes(cert)}
                      onChange={() => toggleCertification(cert)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: colors.gold }}
                    />
                    <Award className="w-4 h-4" style={{ color: formData.certifications.includes(cert) ? colors.gold : colors.silver }} />
                    <span className="text-sm" style={{ color: formData.certifications.includes(cert) ? 'white' : colors.silver }}>
                      {cert}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="rounded-xl border p-6" style={{ background: colors.card, borderColor: colors.border }}>
              <h2 className="text-lg font-semibold text-white mb-4">Pricing (Optional)</h2>
              <p className="text-sm text-gray-400 mb-4">Show indicative rates to attract suppliers searching for storage</p>

              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <div
                  className="w-10 h-6 rounded-full p-1 transition-all"
                  style={{ background: formData.showPricing ? colors.accent : colors.border }}
                  onClick={() => setFormData(prev => ({ ...prev, showPricing: !prev.showPricing }))}
                >
                  <div
                    className="w-4 h-4 rounded-full bg-white transition-all"
                    style={{ transform: formData.showPricing ? 'translateX(16px)' : 'translateX(0)' }}
                  />
                </div>
                <span className="text-sm text-gray-300">Show pricing publicly</span>
              </label>

              {formData.showPricing && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Frozen ($/pallet/day)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.pricing.frozen}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, frozen: parseFloat(e.target.value) }
                      }))}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Chilled ($/pallet/day)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.pricing.chilled}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, chilled: parseFloat(e.target.value) }
                      }))}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Ambient ($/pallet/day)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.pricing.ambient}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, ambient: parseFloat(e.target.value) }
                      }))}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Min booking</label>
                    <input
                      type="number"
                      value={formData.pricing.minBooking}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, minBooking: parseInt(e.target.value) }
                      }))}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* About */}
            <div className="rounded-xl border p-6" style={{ background: colors.card, borderColor: colors.border }}>
              <h2 className="text-lg font-semibold text-white mb-4">About</h2>
              <div className="relative">
                <textarea
                  value={formData.about}
                  onChange={e => setFormData(prev => ({ ...prev, about: e.target.value }))}
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all resize-none"
                  style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                />
                <button
                  onClick={improveAbout}
                  className="absolute top-2 right-2 text-xs flex items-center gap-1 px-2 py-1 rounded"
                  style={{ background: 'rgba(212,175,55,0.15)', color: colors.gold }}
                >
                  <Sparkles className="w-3 h-3" /> Improve with AI
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">{formData.about.length}/500</div>
            </div>

            {/* Contact */}
            <div className="rounded-xl border p-6" style={{ background: colors.card, borderColor: colors.border }}>
              <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Contact Person *</label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={e => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Title</label>
                    <input
                      type="text"
                      value={formData.contactTitle}
                      onChange={e => setFormData(prev => ({ ...prev, contactTitle: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">WhatsApp *</label>
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Languages</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.languages.map(lang => (
                      <span
                        key={lang}
                        className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        style={{ background: 'rgba(56,189,248,0.15)', color: colors.accent }}
                      >
                        {lang}
                        <button onClick={() => removeLanguage(lang)} className="hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={e => setNewLanguage(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addLanguage()}
                      placeholder="Add language..."
                      className="flex-1 px-4 py-2 rounded-lg border outline-none transition-all"
                      style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
                    />
                    <button
                      onClick={addLanguage}
                      className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
                      style={{ background: colors.border, color: 'white' }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Live Preview (40%) */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              {/* Profile Completeness */}
              <div className="rounded-xl border p-5 mb-6" style={{ background: colors.card, borderColor: colors.border }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Profile Completeness</span>
                  <span className="text-lg font-bold" style={{ color: completeness >= 80 ? colors.success : colors.warning }}>
                    {completeness}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: colors.border }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${completeness}%`, background: completeness >= 80 ? colors.success : colors.warning }}
                  />
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Company name', done: !!formData.companyName },
                    { label: 'Tagline', done: formData.tagline.length > 10 },
                    { label: 'Location', done: !!formData.city && !!formData.country },
                    { label: 'Services', done: formData.services.length > 0 },
                    { label: 'Certifications', done: formData.certifications.length > 0 },
                    { label: 'Contact info', done: !!formData.whatsapp && !!formData.email }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" style={{ color: item.done ? colors.success : colors.border }} />
                      <span style={{ color: item.done ? colors.silver : colors.border }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div className="rounded-xl border p-5" style={{ background: colors.card, borderColor: colors.border }}>
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Live Preview</span>
                </div>

                {/* Profile Card */}
                <div className="rounded-xl border overflow-hidden" style={{ background: colors.bg, borderColor: colors.border }}>
                  {/* Header */}
                  <div className="p-4 border-b" style={{ borderColor: colors.border }}>
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: colors.accent }}>
                        {formData.companyName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white">{formData.companyName}</h3>
                          <span className="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1" style={{ background: 'rgba(56,189,248,0.15)', color: colors.accent }}>
                            <Shield className="w-3 h-3" /> KYB Verified
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5">{formData.countryFlag} {formData.city}, {formData.country}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mt-3">{formData.tagline}</p>
                  </div>

                  {/* Stats */}
                  <div className="p-4 border-b" style={{ borderColor: colors.border }}>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{formData.totalCapacity.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Total Pallets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: colors.success }}>
                          {(formData.totalCapacity - 760).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">Available</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{formData.warehouseCount}</div>
                        <div className="text-xs text-gray-400">Warehouses</div>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="p-4 border-b" style={{ borderColor: colors.border }}>
                    <div className="flex flex-wrap gap-2">
                      {formData.services.map(service => (
                        <span
                          key={service}
                          className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                          style={{
                            background: service.includes('Frozen') ? 'rgba(56,189,248,0.15)' :
                              service.includes('Chilled') ? 'rgba(6,182,212,0.15)' :
                                'rgba(251,191,36,0.15)',
                            color: service.includes('Frozen') ? '#38BDF8' :
                              service.includes('Chilled') ? '#06B6D4' :
                                '#FBBF24'
                          }}
                        >
                          {getZoneIcon(service)}
                          {service.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="p-4 border-b" style={{ borderColor: colors.border }}>
                    <div className="flex flex-wrap gap-2">
                      {formData.certifications.map(cert => (
                        <span
                          key={cert}
                          className="px-2 py-1 rounded text-xs"
                          style={{ background: 'rgba(212,175,55,0.15)', color: colors.gold }}
                        >
                          <Award className="w-3 h-3 inline mr-1" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Reliability */}
                  <div className="p-4 border-b" style={{ borderColor: colors.border }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">AI Reliability Score</span>
                      <span className="text-lg font-bold flex items-center gap-1" style={{ color: colors.success }}>
                        <Star className="w-4 h-4" style={{ fill: colors.success }} />
                        96%
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 flex gap-2">
                    <button
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                      style={{ background: colors.accent, color: colors.bg }}
                    >
                      Request Quote
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-white/5"
                      style={{ borderColor: colors.border, color: colors.silver }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreePLProfilePage;
