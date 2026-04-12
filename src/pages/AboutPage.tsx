import { Link } from 'react-router-dom';
import { Globe, Building2, Target, Users, Award, CheckCircle, TrendingUp, Clock, DollarSign, Shield } from 'lucide-react';
import BackButton from '../components/BackButton';
import Breadcrumb from '../components/Breadcrumb';

const AboutPage = () => {
  const stats = [
    { label: 'Companies Listed', value: '2,450+', icon: Building2 },
    { label: 'Countries Covered', value: '85+', icon: Globe },
    { label: 'Trade Volume', value: '$124M+', icon: DollarSign },
    { label: 'Deals Closed', value: '15,000+', icon: TrendingUp },
  ];

  const values = [
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'We connect businesses across continents, making international trade accessible to companies of all sizes.'
    },
    {
      icon: Shield,
      title: 'Trust & Verification',
      description: 'Every company in our directory is KYB verified. We maintain high standards to ensure trustworthy connections.'
    },
    {
      icon: Users,
      title: 'Partnership First',
      description: 'We believe in building long-term relationships between buyers and sellers, not just one-time transactions.'
    },
    {
      icon: Target,
      title: 'AI-Powered',
      description: 'Our AI-powered platform continuously evolves to provide the best matching and discovery experience.'
    },
  ];

  const milestones = [
    { year: '2023', title: 'Platform Launch', desc: 'Brands Bridge AI officially launched with 200 founding members' },
    { year: '2024 Q1', title: 'KYB Verification', desc: 'Introduced comprehensive Know Your Business verification system' },
    { year: '2024 Q2', title: 'Live Deal Room', desc: 'Launched real-time negotiation platform for trade deals' },
    { year: '2024 Q3', title: 'AI Sourcing Agent', desc: 'Released AI-powered supplier matching and sourcing assistant' },
    { year: '2024 Q4', title: 'Logistics Integration', desc: 'Added freight forwarding marketplace and shipment tracking' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#050D1A' }}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#071120] via-[#0B5E75]/20 to-[#071120] text-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb items={[
              { label: 'Home', to: '/' },
              { label: 'About Us' }
            ]} />
            <BackButton label="Back to Home" to="/" />
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '48px', letterSpacing: '-1.5px', marginBottom: '24px' }} className="text-white">
              Replacing Trade Exhibitions with{' '}
              <span style={{ color: '#D4AF37' }}>Intelligent Connections</span>
            </h1>
            <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '20px', color: '#94A3B8', lineHeight: 1.6 }}>
              Brands Bridge AI is building the future of B2B food and FMCG trade.
              We are making global business connections accessible, efficient, and affordable for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem We Solve */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-6">
                <Clock className="w-4 h-4" />
                The Problem
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Trade exhibitions are broken</h2>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                International trade has been dominated by expensive exhibitions, countless flights, and inefficient networking.
                Companies spend thousands on booths and travel, yet struggle to find the right partners.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">$50,000+ Average Exhibition Cost</div>
                    <div className="text-sm text-slate-400">Booth, travel, hotels, and staff for just ONE event</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">3-5 Days Per Exhibition</div>
                    <div className="text-sm text-slate-400">Time away from operations, limited results</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Low-Quality Leads</div>
                    <div className="text-sm text-slate-400">Most contacts never convert to real business</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#0B5E75]/20 to-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-3xl p-8 lg:p-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-6">
                <CheckCircle className="w-4 h-4" />
                Our Solution
              </div>
              <blockquote className="text-xl text-white italic mb-8">
                "We believe every FMCG company, regardless of size, deserves access to global markets.
                Technology should remove barriers, not create them."
              </blockquote>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>90% cost savings vs. traditional trade shows</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>24/7 access to global suppliers and buyers</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>AI-powered matching for precise results</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Secure escrow payment protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              The principles that guide everything we do at Brands Bridge AI
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-[#0A0F1E] border border-slate-800 rounded-2xl p-6 text-center hover:border-[#D4AF37]/30 transition-colors">
                <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-slate-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-slate-400">Building the future of trade, one milestone at a time</p>
          </div>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-10 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                    <span className="text-[#D4AF37] font-bold text-sm">{milestone.year}</span>
                  </div>
                </div>
                <div className="flex-1 bg-[#111827] border border-slate-800 rounded-xl p-4">
                  <h3 className="font-semibold text-white mb-1">{milestone.title}</h3>
                  <p className="text-sm text-slate-400">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#D4AF37]/10 to-amber-500/5 border-y border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Join the Platform?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            List your company today and start connecting with international buyers and suppliers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
            >
              List Your Company
            </Link>
            <Link
              to="/companies"
              className="px-8 py-4 bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
            >
              Browse Companies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;