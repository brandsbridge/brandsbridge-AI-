import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Package, Building2, Truck, ChevronRight, Check } from 'lucide-react';
import BackButton from '../components/BackButton';
import Breadcrumb from '../components/Breadcrumb';

const steps = [
  { num: 1, title: 'Create Profile', desc: 'Register and set up your company profile with certifications and capabilities' },
  { num: 2, title: 'Get Verified', desc: 'Complete KYB verification to build trust with trading partners' },
  { num: 3, title: 'Connect & Source', desc: 'Browse the Expo Hall, use AI sourcing, and send RFQs to suppliers' },
  { num: 4, title: 'Negotiate & Close', desc: 'Use the Live Deal Room for real-time negotiation with multiple parties' },
  { num: 5, title: 'Ship & Track', desc: 'Book logistics through the platform and track shipments in real-time' },
];

const supplierSteps = [
  { num: 1, title: 'Register Profile', desc: 'Create your company listing with product catalog and capabilities' },
  { num: 2, title: 'KYB Verification', desc: 'Submit trade license and business documents for verification' },
  { num: 3, title: 'Receive Inquiries', desc: 'Get RFQs from buyers worldwide through the Expo Hall' },
  { num: 4, title: 'Live Deal Room', desc: 'Participate in real-time bidding and negotiation sessions' },
  { num: 5, title: 'Fulfill & Get Paid', desc: 'Ship goods and receive payment through our secure escrow system' },
];

const buyerSteps = [
  { num: 1, title: 'Join Free', desc: 'Create account and browse the global supplier directory' },
  { num: 2, title: 'AI Sourcing', desc: 'Use AI assistant to find the best suppliers for your needs' },
  { num: 3, title: 'Send RFQs', desc: 'Create detailed requests and receive competitive quotes' },
  { num: 4, title: 'Compare & Negotiate', desc: 'Use Live Deal Room to negotiate best prices and terms' },
  { num: 5, title: 'Track Delivery', desc: 'Monitor shipments and manage all trade documents' },
];

const freightSteps = [
  { num: 1, title: 'List Your Services', desc: 'Create carrier profile with routes, rates, and certifications' },
  { num: 2, title: 'Get Verified', desc: 'Complete carrier verification for trust badge' },
  { num: 3, title: 'Receive Requests', desc: 'Get freight requests from verified shippers' },
  { num: 4, title: 'Submit Quotes', desc: 'Bid on routes with competitive pricing' },
  { num: 5, title: 'Transport & Confirm', desc: 'Book cargo, track deliveries, and get paid' },
];

const HowItWorksPage = () => {
  const [activeTab, setActiveTab] = useState<'supplier' | 'buyer' | 'freight'>('supplier');

  const currentSteps = activeTab === 'supplier' ? supplierSteps : activeTab === 'buyer' ? buyerSteps : freightSteps;

  const tabs = [
    { id: 'supplier', label: 'For Suppliers', icon: Package, color: 'from-amber-500 to-orange-600' },
    { id: 'buyer', label: 'For Buyers', icon: Building2, color: 'from-blue-500 to-cyan-600' },
    { id: 'freight', label: 'For Freight', icon: Truck, color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#050D1A' }}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#071120] via-[#0B5E75]/20 to-[#071120] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: 'Home', to: '/' },
            { label: 'How It Works' }
          ]} />
          <BackButton label="Back to Home" to="/" />
          <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '48px', letterSpacing: '-1.5px', marginBottom: '16px' }} className="text-white">
            How Brands Bridge AI Works
          </h1>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '20px', color: '#94A3B8', maxWidth: '600px' }}>
            Your complete digital trade operating system. From first inquiry to final delivery.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-[#0A0F1E]/95 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white`
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-800 hidden md:block" />

            <div className="space-y-8">
              {currentSteps.map((step, index) => (
                <div key={step.num} className="relative">
                  {/* Step Number */}
                  <div className={`absolute left-0 md:left-8 -translate-x-1/2 md:translate-x-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${
                    activeTab === 'supplier' ? 'from-amber-500 to-orange-600' :
                    activeTab === 'buyer' ? 'from-blue-500 to-cyan-600' :
                    'from-emerald-500 to-teal-600'
                  } flex items-center justify-center text-2xl font-bold text-white shadow-lg z-10`}>
                    {step.num}
                  </div>

                  {/* Content */}
                  <div className={`ml-20 md:ml-28 bg-[#111827] border border-slate-800 rounded-2xl p-6 ${
                    index === 0 ? 'md:mt-8' : ''
                  }`}>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#D4AF37]/10 to-amber-500/5 border-y border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start trading smarter?</h2>
          <p className="text-xl text-slate-400 mb-8">Join thousands of companies already using Brands Bridge AI</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;