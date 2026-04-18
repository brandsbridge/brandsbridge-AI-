import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Save, Eye, Video, Building2, Globe, Users, Award, MapPin, Mail, Phone,
  Plus, X, Check, ChevronRight, Sparkles, Upload, Image, Flag, Calendar,
  Package, Truck, FileText, Shield, MessageCircle, Star, Clock, AlertCircle,
  CheckCircle, Loader2, RefreshCw
} from 'lucide-react';
import { companies, Company } from '../data/mockData';

// Sample user company (in real app, this would come from auth context)
const sampleUserCompany = companies[0];

// Country options with flags
const countries = [
  { name: 'Qatar', flag: '🇶🇦' }, { name: 'UAE', flag: '🇦🇪' }, { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'Kuwait', flag: '🇰🇼' }, { name: 'Bahrain', flag: '🇧🇭' }, { name: 'Oman', flag: '🇴🇲' },
  { name: 'Turkey', flag: '🇹🇷' }, { name: 'Germany', flag: '🇩🇪' }, { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'UK', flag: '🇬🇧' }, { name: 'France', flag: '🇫🇷' }, { name: 'Spain', flag: '🇪🇸' },
  { name: 'Italy', flag: '🇮🇹' }, { name: 'USA', flag: '🇺🇸' }, { name: 'Canada', flag: '🇨🇦' },
  { name: 'India', flag: '🇮🇳' }, { name: 'China', flag: '🇨🇳' }, { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Malaysia', flag: '🇲🇾' }, { name: 'Thailand', flag: '🇹🇭' }, { name: 'Vietnam', flag: '🇻🇳' },
  { name: 'Brazil', flag: '🇧🇷' }, { name: 'Argentina', flag: '🇦🇷' }, { name: 'South Africa', flag: '🇿🇦' },
  { name: 'Egypt', flag: '🇪🇬' }, { name: 'Morocco', flag: '🇲🇦' }, { name: 'Nigeria', flag: '🇳🇬' },
];

const categories = [
  'Confectionery & Chocolate', 'Dairy Products', 'Beverages', 'Snacks & Chips',
  'Canned Foods', 'Bakery Products', 'Frozen Foods', 'Cosmetics & Personal Care',
  'Detergents & Household', 'Ingredients & Raw Materials', 'FMCG', 'Organic Foods'
];

const certifications = [
  'Halal', 'ISO 22000', 'FSSC 22000', 'BRC Grade A', 'IFS', 'Kosher',
  'HACCP', 'Organic', 'FDA', 'ISO 9001'
];

const languages = ['Arabic', 'English', 'Turkish', 'French', 'German', 'Spanish', 'Chinese'];

const regions = ['GCC', 'Europe', 'Africa', 'Asia', 'Americas', 'Oceania'];

const SupplierProfileEditor = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    companyName: sampleUserCompany.name,
    tagline: '',
    logo: sampleUserCompany.logo,
    yearEstablished: sampleUserCompany.yearEstablished,
    employees: '501-1000',
    businessType: sampleUserCompany.businessType,
    website: sampleUserCompany.website,
    country: sampleUserCompany.country,
    city: sampleUserCompany.city,
    // About
    description: sampleUserCompany.description,
    // Products
    selectedCategories: sampleUserCompany.categories,
    moq: '$20K-$100K',
    exportCapacity: '10-50 containers/month',
    incoterms: ['FOB', 'CIF'],
    // Certifications
    selectedCertifications: sampleUserCompany.certifications,
    otherCertification: '',
    // Export Markets
    exportMarkets: { GCC: ['Qatar', 'UAE', 'Saudi Arabia'], Europe: ['Germany', 'UK'] },
    // Contact
    exportManager: {
      name: sampleUserCompany.exportManager.name,
      title: 'Export Manager',
      email: sampleUserCompany.exportManager.email,
      whatsapp: sampleUserCompany.exportManager.whatsapp,
      languages: ['Arabic', 'English'],
      photo: ''
    },
    salesManager: {
      name: sampleUserCompany.salesManager.name,
      title: 'Sales Manager',
      email: sampleUserCompany.salesManager.email,
      whatsapp: '+97444123457',
      languages: ['English'],
      photo: ''
    },
    teamMembers: [] as any[],
    // Media
    gallery: sampleUserCompany.gallery,
    youtubeUrl: '',
    youtubeId: '',
    // Virtual Booth
    virtualBoothEnabled: true,
    showFactoryTour: true,
    showProducts: true,
    showVideo: true,
    factoryImage: '',
    virtualProducts: sampleUserCompany.products || [],
    // Visibility
    showOnExpo: true,
    acceptInquiries: true,
    showContact: true,
    availableForLiveDeal: true,
    showInVirtualBooth: true,
    showPricing: false,
    profileStatus: 'active' as 'active' | 'private' | 'pending'
  });

  // UI State
  const [previewTab, setPreviewTab] = useState<'card' | 'full' | 'booth'>('card');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isGeneratingTagline, setIsGeneratingTagline] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  // Refs for scrolling
  const sectionRefs = {
    basic: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    products: useRef<HTMLDivElement>(null),
    certifications: useRef<HTMLDivElement>(null),
    markets: useRef<HTMLDivElement>(null),
    contacts: useRef<HTMLDivElement>(null),
    media: useRef<HTMLDivElement>(null),
    virtualBooth: useRef<HTMLDivElement>(null),
    visibility: useRef<HTMLDivElement>(null),
  };

  // Calculate profile completeness
  const calculateCompleteness = () => {
    let score = 0;
    const checks = [
      { pass: !!formData.companyName, points: 5 },
      { pass: !!formData.logo, points: 10 },
      { pass: formData.description.length > 50, points: 15 },
      { pass: formData.selectedCategories.length > 0, points: 10 },
      { pass: formData.selectedCertifications.length > 0, points: 10 },
      { pass: Object.keys(formData.exportMarkets).length > 0, points: 10 },
      { pass: !!formData.exportManager.name && !!formData.exportManager.email, points: 15 },
      { pass: formData.gallery.length > 0, points: 10 },
      { pass: formData.virtualBoothEnabled, points: 10 },
      { pass: !!formData.youtubeId, points: 5 },
    ];
    checks.forEach(c => { if (c.pass) score += c.points; });
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();
  const completenessColor = completeness < 30 ? '#EF4444' : completeness < 70 ? '#F59E0B' : '#10B981';

  // Missing items for AI suggestions
  const getMissingItems = () => {
    const items = [];
    if (!formData.logo) items.push({ field: 'logo', text: 'Add your logo — profiles with logos get 5x more clicks' });
    if (formData.selectedCertifications.length === 0) items.push({ field: 'certifications', text: 'No certifications — Halal & ISO increase inquiries by 340%' });
    if (!formData.youtubeId) items.push({ field: 'video', text: 'Add a company video — increases trust significantly' });
    if (Object.keys(formData.exportMarkets).length === 0) items.push({ field: 'markets', text: 'Set your export markets to reach more buyers' });
    return items;
  };

  const missingItems = getMissingItems();

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.companyName) {
        setLastSaved(new Date());
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [formData]);

  // Handle tagline AI generation
  const handleGenerateTagline = () => {
    setIsGeneratingTagline(true);
    setTimeout(() => {
      const taglines = [
        'Premium Quality, Global Reach — Your Trusted FMCG Partner',
        'From Local Excellence to International Markets',
        'Delivering Tradition, Exporting Quality',
        'Where GCC Manufacturing Meets Global Standards',
        'Crafting Excellence Since [Year] — Exported Worldwide'
      ];
      setFormData(prev => ({ ...prev, tagline: taglines[Math.floor(Math.random() * taglines.length)] }));
      setIsGeneratingTagline(false);
      toast.success('AI generated tagline!');
    }, 1500);
  };

  // Handle description AI improvement
  const handleImproveDescription = () => {
    setIsGeneratingDescription(true);
    setTimeout(() => {
      const improved = `${formData.companyName} is a leading ${formData.businessType} based in ${formData.city}, ${formData.country}. With ${formData.employees} employees and established in ${formData.yearEstablished}, we specialize in ${formData.selectedCategories.slice(0, 3).join(', ')}. Our products are certified with ${formData.selectedCertifications.slice(0, 2).join(' and ')}, ensuring the highest quality standards for international markets. We export to ${Object.values(formData.exportMarkets).flat().slice(0, 5).join(', ')} and beyond, serving distributors and retailers across the GCC and globally. Our commitment to quality, competitive pricing, and reliable delivery makes us the preferred partner for businesses seeking trusted FMCG suppliers.`;
      setFormData(prev => ({ ...prev, description: improved }));
      setIsGeneratingDescription(false);
      toast.success('Description improved!');
    }, 2000);
  };

  // Save draft
  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
      toast.success('Draft saved successfully!');
    }, 1000);
  };

  // Publish
  const handlePublish = () => {
    setShowPublishModal(false);
    toast.success('Profile published! Buyers can now find you.');
    navigate('/supplier/dashboard');
  };

  // Scroll to section
  const scrollToSection = (section: string) => {
    setActiveSection(section);
    sectionRefs[section as keyof typeof sectionRefs]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'about', label: 'About', icon: FileText },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'markets', label: 'Export Markets', icon: Globe },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'media', label: 'Media Gallery', icon: Image },
    { id: 'virtualBooth', label: 'Virtual Booth', icon: Video },
    { id: 'visibility', label: 'Visibility', icon: Eye },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #020817 0%, #0A0F1E 100%)' }}>
      {/* Header */}
      <div className="bg-[#0A0F1E]/80 backdrop-blur-xl border-b border-[#1E2D45] sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/supplier/dashboard')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-white rotate-180" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Profile Editor</h1>
                <p className="text-sm text-slate-400">Customize how buyers see your company</p>
              </div>
            </div>

            {/* Save Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                {lastSaved ? `Last saved: ${Math.floor((Date.now() - lastSaved.getTime()) / 60000)} min ago` : 'Not saved yet'}
              </div>
              <button onClick={handleSaveDraft} disabled={isSaving} className="px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Draft
              </button>
              <button onClick={() => setShowPublishModal(true)} className="px-4 py-2 bg-[#D4AF37] text-[#050D1A] rounded-lg font-semibold hover:bg-[#D4AF37]/90 transition-colors flex items-center gap-2">
                Publish Changes <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr,420px] gap-8">
          {/* LEFT — Editor */}
          <div className="space-y-6">
            {/* Section Navigation */}
            <div className="flex flex-wrap gap-2 p-2 bg-slate-800/50 rounded-xl">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                    activeSection === section.id ? 'bg-[#D4AF37] text-[#050D1A]' : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </div>

            {/* SECTION 1 — Basic Info */}
            <div ref={sectionRefs.basic} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#D4AF37]" />
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Tagline</label>
                    <span className="text-xs text-slate-500">{formData.tagline.length}/100</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={e => setFormData(prev => ({ ...prev, tagline: e.target.value.slice(0, 100) }))}
                      className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="A short memorable phrase..."
                      maxLength={100}
                    />
                    <button
                      onClick={handleGenerateTagline}
                      disabled={isGeneratingTagline}
                      className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      {isGeneratingTagline ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      AI
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Company Logo</label>
                  <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-6 text-center hover:border-[#D4AF37]/50 transition-colors cursor-pointer">
                    {formData.logo ? (
                      <div className="flex items-center justify-center gap-4">
                        <img src={formData.logo} alt="Logo" className="w-16 h-16 rounded-xl object-cover" />
                        <button onClick={() => setFormData(prev => ({ ...prev, logo: '' }))} className="text-red-400 text-sm hover:text-red-300">Remove</button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm">Drag & drop or click to upload</p>
                        <p className="text-slate-500 text-xs mt-1">PNG, JPG up to 2MB</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Year Established</label>
                    <input
                      type="number"
                      value={formData.yearEstablished}
                      onChange={e => setFormData(prev => ({ ...prev, yearEstablished: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      min={1900}
                      max={2024}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Employees</label>
                    <select
                      value={formData.employees}
                      onChange={e => setFormData(prev => ({ ...prev, employees: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option>1-10</option>
                      <option>11-50</option>
                      <option>51-200</option>
                      <option>201-500</option>
                      <option>501-1000</option>
                      <option>1000+</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Business Type</label>
                    <select
                      value={formData.businessType}
                      onChange={e => setFormData(prev => ({ ...prev, businessType: e.target.value as any }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option>Manufacturer</option>
                      <option>Exporter</option>
                      <option>Distributor</option>
                      <option>Importer</option>
                      <option>Agent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
                    <select
                      value={formData.country}
                      onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      {countries.map(c => (
                        <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2 — About */}
            <div ref={sectionRefs.about} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                About Company
              </h2>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Company Description</label>
                  <span className="text-xs text-slate-500">{formData.description.length}/1000</span>
                </div>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value.slice(0, 1000) }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] min-h-[150px] resize-y"
                  placeholder="Describe your company, products, capabilities, and what makes you unique..."
                />
                <button
                  onClick={handleImproveDescription}
                  disabled={isGeneratingDescription}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  {isGeneratingDescription ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Improve with AI
                </button>
              </div>
            </div>

            {/* SECTION 3 — Products */}
            <div ref={sectionRefs.products} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#D4AF37]" />
                Products & Categories
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">Product Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        selectedCategories: prev.selectedCategories.includes(cat)
                          ? prev.selectedCategories.filter(c => c !== cat)
                          : [...prev.selectedCategories, cat]
                      }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        formData.selectedCategories.includes(cat)
                          ? 'bg-[#D4AF37] text-[#050D1A]'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                      }`}
                    >
                      {formData.selectedCategories.includes(cat) && <Check className="w-3 h-3 inline mr-1" />}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Minimum Order (MOQ)</label>
                  <select
                    value={formData.moq}
                    onChange={e => setFormData(prev => ({ ...prev, moq: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option>Under $5K</option>
                    <option>$5K-$20K</option>
                    <option>$20K-$100K</option>
                    <option>$100K+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Export Capacity</label>
                  <select
                    value={formData.exportCapacity}
                    onChange={e => setFormData(prev => ({ ...prev, exportCapacity: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option>Under 10 containers/month</option>
                    <option>10-50 containers/month</option>
                    <option>50-100 containers/month</option>
                    <option>100+ containers/month</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">Incoterms</label>
                <div className="flex flex-wrap gap-2">
                  {['FOB', 'CIF', 'EXW', 'DDP', 'CFR'].map(term => (
                    <button
                      key={term}
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        incoterms: prev.incoterms.includes(term)
                          ? prev.incoterms.filter(t => t !== term)
                          : [...prev.incoterms, term]
                      }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        formData.incoterms.includes(term)
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 4 — Certifications */}
            <div ref={sectionRefs.certifications} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                Certifications
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {certifications.map(cert => (
                  <label key={cert} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.selectedCertifications.includes(cert)}
                      onChange={() => setFormData(prev => ({
                        ...prev,
                        selectedCertifications: prev.selectedCertifications.includes(cert)
                          ? prev.selectedCertifications.filter(c => c !== cert)
                          : [...prev.selectedCertifications, cert]
                      }))}
                      className="w-5 h-5 rounded bg-slate-600 border-slate-500 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-white text-sm">{cert}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Other Certification</label>
                <input
                  type="text"
                  value={formData.otherCertification}
                  onChange={e => setFormData(prev => ({ ...prev, otherCertification: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Enter other certification"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Upload Certificates (optional)</label>
                <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-6 text-center hover:border-[#D4AF37]/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Upload PDF certificates</p>
                  <p className="text-slate-500 text-xs mt-1">PDF up to 5MB each</p>
                </div>
              </div>
            </div>

            {/* SECTION 5 — Export Markets */}
            <div ref={sectionRefs.markets} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#D4AF37]" />
                Export Markets
              </h2>

              {regions.map(region => {
                const regionCountries = countries.filter(c => {
                  if (region === 'GCC') return ['Qatar', 'UAE', 'Saudi Arabia', 'Kuwait', 'Bahrain', 'Oman'].includes(c.name);
                  if (region === 'Europe') return ['Germany', 'UK', 'France', 'Spain', 'Italy', 'Netherlands'].includes(c.name);
                  if (region === 'Africa') return ['Egypt', 'Morocco', 'Nigeria', 'South Africa'].includes(c.name);
                  if (region === 'Asia') return ['India', 'China', 'Indonesia', 'Malaysia', 'Thailand', 'Vietnam'].includes(c.name);
                  if (region === 'Americas') return ['USA', 'Canada', 'Brazil', 'Argentina'].includes(c.name);
                  return false;
                });

                const selectedInRegion = formData.exportMarkets[region] || [];

                return (
                  <div key={region} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-medium">{region}</span>
                      <select
                        onChange={e => {
                          if (e.target.value) {
                            setFormData(prev => ({
                              ...prev,
                              exportMarkets: {
                                ...prev.exportMarkets,
                                [region]: [...(prev.exportMarkets[region] || []), e.target.value]
                              }
                            }));
                            e.target.value = '';
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      >
                        <option value="">+ Add country</option>
                        {regionCountries.map(c => (
                          <option key={c.name} value={c.name} disabled={selectedInRegion.includes(c.name)}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedInRegion.map(country => (
                        <span key={country} className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm">
                          {countries.find(c => c.name === country)?.flag} {country}
                          <button onClick={() => setFormData(prev => ({
                            ...prev,
                            exportMarkets: {
                              ...prev.exportMarkets,
                              [region]: prev.exportMarkets[region].filter(c => c !== country)
                            }
                          }))} className="hover:text-red-400 ml-1">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SECTION 6 — Contacts */}
            <div ref={sectionRefs.contacts} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D4AF37]" />
                Contact & Team
              </h2>

              {/* Export Manager */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-4">Export Manager</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.exportManager.name}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        exportManager: { ...prev.exportManager, name: e.target.value }
                      }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Job Title *</label>
                    <input
                      type="text"
                      value={formData.exportManager.title}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        exportManager: { ...prev.exportManager, title: e.target.value }
                      }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.exportManager.email}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        exportManager: { ...prev.exportManager, email: e.target.value }
                      }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">WhatsApp *</label>
                    <input
                      type="text"
                      value={formData.exportManager.whatsapp}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        exportManager: { ...prev.exportManager, whatsapp: e.target.value }
                      }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="+974..."
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          exportManager: {
                            ...prev.exportManager,
                            languages: prev.exportManager.languages.includes(lang)
                              ? prev.exportManager.languages.filter(l => l !== lang)
                              : [...prev.exportManager.languages, lang]
                          }
                        }))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          formData.exportManager.languages.includes(lang)
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sales Manager */}
              <div className="mb-6 pt-6 border-t border-slate-700/50">
                <h3 className="text-white font-medium mb-4">Sales Manager</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.salesManager.name}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        salesManager: { ...prev.salesManager, name: e.target.value }
                      }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.salesManager.email}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        salesManager: { ...prev.salesManager, email: e.target.value }
                      }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">
                <Plus className="w-4 h-4" />
                Add Team Member
              </button>
            </div>

            {/* SECTION 7 — Media Gallery */}
            <div ref={sectionRefs.media} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Image className="w-5 h-5 text-[#D4AF37]" />
                Media Gallery
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Product Images (max 10)</label>
                <div className="grid grid-cols-4 gap-3">
                  {formData.gallery.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          gallery: prev.gallery.filter((_, i) => i !== idx)
                        }))}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {formData.gallery.length < 10 && (
                    <div className="aspect-square border-2 border-dashed border-slate-600/50 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#D4AF37]/50 transition-colors">
                      <Plus className="w-6 h-6 text-slate-500" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Company Introduction Video</label>
                <input
                  type="text"
                  value={formData.youtubeUrl}
                  onChange={e => {
                    const url = e.target.value;
                    setFormData(prev => ({ ...prev, youtubeUrl: url }));
                    // Extract video ID
                    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
                    if (match) {
                      setFormData(prev => ({ ...prev, youtubeId: match[1] }));
                    }
                  }}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Paste YouTube URL (e.g., https://youtube.com/watch?v=...)"
                />
                {formData.youtubeId && (
                  <div className="mt-2 flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Video ID: {formData.youtubeId}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 8 — Virtual Booth */}
            <div ref={sectionRefs.virtualBooth} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Video className="w-5 h-5 text-[#D4AF37]" />
                Virtual Booth Settings
              </h2>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl cursor-pointer">
                  <div>
                    <div className="text-white font-medium">Enable Virtual Booth</div>
                    <div className="text-slate-400 text-sm">Allow buyers to visit your booth virtually</div>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, virtualBoothEnabled: !prev.virtualBoothEnabled }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.virtualBoothEnabled ? 'bg-emerald-500' : 'bg-slate-600'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.virtualBoothEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </label>

                {formData.virtualBoothEnabled && (
                  <>
                    <label className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showFactoryTour}
                        onChange={() => setFormData(prev => ({ ...prev, showFactoryTour: !prev.showFactoryTour }))}
                        className="w-5 h-5 rounded bg-slate-600 border-slate-500 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-white">Show Factory Tour tab</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showProducts}
                        onChange={() => setFormData(prev => ({ ...prev, showProducts: !prev.showProducts }))}
                        className="w-5 h-5 rounded bg-slate-600 border-slate-500 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-white">Show Products tab</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showVideo}
                        onChange={() => setFormData(prev => ({ ...prev, showVideo: !prev.showVideo }))}
                        className="w-5 h-5 rounded bg-slate-600 border-slate-500 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-white">Show Company Video tab</span>
                    </label>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Factory Tour Image URL</label>
                      <input
                        type="url"
                        value={formData.factoryImage}
                        onChange={e => setFormData(prev => ({ ...prev, factoryImage: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="Paste panoramic factory image URL"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Products for Virtual Booth (up to 6)</label>
                      <p className="text-slate-500 text-xs mb-3">These products appear in your Virtual Booth products tab</p>

                      <div className="space-y-3">
                        {formData.virtualProducts.slice(0, 6).map((product, idx) => (
                          <div key={idx} className="p-4 bg-slate-700/30 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white text-sm font-medium">{product.name}</span>
                              <button
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  virtualProducts: prev.virtualProducts.filter((_, i) => i !== idx)
                                }))}
                                className="text-red-400 hover:text-red-300"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-slate-400 text-xs">
                              {product.priceRange} | MOQ: {product.moq}
                            </div>
                          </div>
                        ))}
                        {formData.virtualProducts.length < 6 && (
                          <button className="w-full py-3 border-2 border-dashed border-slate-600/50 rounded-xl text-slate-400 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Product
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SECTION 9 — Visibility */}
            <div ref={sectionRefs.visibility} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#D4AF37]" />
                Visibility Settings
              </h2>

              <div className="space-y-3">
                {[
                  { key: 'showOnExpo', label: 'Show on Expo Hall', desc: 'Visible to all buyers browsing' },
                  { key: 'acceptInquiries', label: 'Accept buyer inquiries', desc: 'Receive inquiry notifications' },
                  { key: 'showContact', label: 'Show contact information', desc: 'Display email and WhatsApp' },
                  { key: 'availableForLiveDeal', label: 'Available for Live Deal Room', desc: 'Join live video negotiations' },
                  { key: 'showInVirtualBooth', label: 'Show in Virtual Booth listings', desc: 'Appear in VR Expo tab' },
                  { key: 'showPricing', label: 'Show pricing information', desc: 'Display MOQ and price ranges' },
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl cursor-pointer">
                    <div>
                      <div className="text-white font-medium">{item.label}</div>
                      <div className="text-slate-400 text-sm">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof formData] }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${formData[item.key as keyof typeof formData] ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData[item.key as keyof typeof formData] ? 'left-7' : 'left-1'}`} />
                    </button>
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">Profile Status</label>
                <div className="space-y-2">
                  {[
                    { value: 'active', label: 'Active', desc: 'Visible to all buyers' },
                    { value: 'private', label: 'Private', desc: 'Hidden from search' },
                    { value: 'pending', label: 'Pending Verification', desc: 'Awaiting KYB verification' },
                  ].map(option => (
                    <label key={option.value} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
                      formData.profileStatus === option.value ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/50' : 'bg-slate-700/30 hover:bg-slate-700/50'
                    }`}>
                      <input
                        type="radio"
                        name="profileStatus"
                        value={option.value}
                        checked={formData.profileStatus === option.value}
                        onChange={() => setFormData(prev => ({ ...prev, profileStatus: option.value as any }))}
                        className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <div>
                        <div className="text-white font-medium">{option.label}</div>
                        <div className="text-slate-400 text-sm">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Live Preview */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Preview Tabs */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">Live Preview</h3>
                  <p className="text-slate-400 text-xs">How buyers see your profile</p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {[
                  { id: 'card' as const, label: 'Card' },
                  { id: 'full' as const, label: 'Full' },
                  { id: 'booth' as const, label: 'Booth' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setPreviewTab(tab.id)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      previewTab === tab.id ? 'bg-[#D4AF37] text-[#050D1A]' : 'bg-slate-700/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Profile Completeness */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Profile Completeness</span>
                  <span className="text-white font-bold">{completeness}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${completeness}%`, background: completenessColor }}
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 mb-4">
                {[
                  { pass: true, text: 'Company name' },
                  { pass: !!formData.logo, text: 'Logo uploaded' },
                  { pass: formData.description.length > 50, text: 'Description added' },
                  { pass: formData.selectedCategories.length > 0, text: 'Categories selected' },
                  { pass: formData.selectedCertifications.length > 0, text: 'Certifications added' },
                  { pass: Object.keys(formData.exportMarkets).length > 0, text: 'Export markets set' },
                  { pass: !!formData.exportManager.name, text: 'Contact info added' },
                  { pass: formData.gallery.length > 0, text: 'Photos uploaded' },
                  { pass: formData.virtualBoothEnabled, text: 'Virtual Booth enabled' },
                  { pass: !!formData.youtubeId, text: 'Video added' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {item.pass ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                    <span className={item.pass ? 'text-emerald-400' : 'text-slate-400'}>
                      {item.pass ? item.text : item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* AI Suggestions */}
              <div className="space-y-2">
                <h4 className="text-white text-sm font-medium">AI Suggestions</h4>
                {missingItems.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-amber-200 text-xs flex-1">{item.text}</p>
                    </div>
                    <button
                      onClick={() => scrollToSection(item.field)}
                      className="mt-2 text-amber-400 text-xs font-medium hover:text-amber-300 flex items-center gap-1"
                    >
                      Fix Now <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {missingItems.length === 0 && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs">
                      <CheckCircle className="w-4 h-4" />
                      Profile looks great! All key items are complete.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Preview */}
            {previewTab === 'card' && (
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4">
                <h4 className="text-white text-sm font-medium mb-3">Card Preview</h4>
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 p-4">
                  <div className="flex items-start gap-3 mb-4">
                    {formData.logo ? (
                      <img src={formData.logo} alt="" className="w-14 h-14 rounded-xl object-cover" />
                    ) : (
                      <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-slate-500" />
                      </div>
                    )}
                    <div>
                      <h5 className="text-white font-semibold">{formData.companyName || 'Company Name'}</h5>
                      <p className="text-slate-400 text-sm">{countries.find(c => c.name === formData.country)?.flag} {formData.city}, {formData.country}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                        formData.businessType === 'Manufacturer' ? 'bg-blue-500/20 text-blue-400' :
                        formData.businessType === 'Exporter' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {formData.businessType}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {formData.selectedCategories.slice(0, 3).map(cat => (
                      <span key={cat} className="px-2 py-0.5 bg-slate-700/50 text-slate-300 rounded text-xs">{cat}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {formData.selectedCertifications.slice(0, 2).map(cert => (
                      <span key={cert} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs">{cert}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button className="py-2 bg-blue-500/20 text-blue-400 rounded-lg font-medium">Send Inquiry</button>
                    <button className="py-2 bg-amber-500/20 text-amber-400 rounded-lg font-medium">Request Quote</button>
                    <button className="py-2 bg-purple-500/20 text-purple-400 rounded-lg font-medium">Book Meeting</button>
                    <button className="py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium">Virtual Booth</button>
                  </div>
                </div>
              </div>
            )}

            {previewTab === 'full' && (
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4">
                <h4 className="text-white text-sm font-medium mb-3">Full Profile Preview</h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-slate-400 mb-1">About</div>
                    <p className="text-white line-clamp-3">{formData.description || 'No description yet...'}</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-slate-400 mb-1">Export Markets</div>
                    <p className="text-white">
                      {Object.values(formData.exportMarkets).flat().length > 0
                        ? Object.values(formData.exportMarkets).flat().join(', ')
                        : 'No markets selected'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-slate-400 mb-1">Contact</div>
                    <p className="text-white">{formData.exportManager.name || 'No contact'}</p>
                    <p className="text-slate-400">{formData.exportManager.email || ''}</p>
                  </div>
                </div>
              </div>
            )}

            {previewTab === 'booth' && (
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4">
                <h4 className="text-white text-sm font-medium mb-3">Virtual Booth Preview</h4>
                <div className="relative aspect-video bg-slate-700 rounded-lg overflow-hidden mb-3">
                  <img src={formData.factoryImage || 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600'} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                    <span className="text-white font-medium text-sm">🏭 Factory Tour</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    {formData.showVideo && <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">📹 Video</span>}
                    {formData.showFactoryTour && <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">🏭 Tour</span>}
                    {formData.showProducts && <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">📦 Products</span>}
                  </div>
                  <p className="text-slate-400 text-xs">
                    {formData.virtualProducts.length} products displayed
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Publish Your Profile</h3>
              <p className="text-slate-400">Your profile will be visible to buyers on Brands Bridge AI.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
              >
                Continue Editing
              </button>
              <button
                onClick={handlePublish}
                className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierProfileEditor;
