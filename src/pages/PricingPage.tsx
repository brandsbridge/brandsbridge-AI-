import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Globe, Users, BarChart3, Video, Bot, Shield, Zap, Star, Crown, Ship } from 'lucide-react';
import BackButton from '../components/BackButton';
import Breadcrumb from '../components/Breadcrumb';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Starter',
      price: 0,
      icon: Globe,
      color: 'from-slate-500 to-slate-600',
      description: 'Perfect for getting started with Brands Bridge',
      features: [
        'Company profile listing',
        '5 leads/month',
        'Basic analytics',
        'Email inquiry form',
        'Access to Expo Hall',
        'Standard search visibility',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Growth',
      price: billingCycle === 'monthly' ? 199 : 159,
      icon: Star,
      color: 'from-[#D4AF37] to-amber-500',
      description: 'For growing businesses serious about trade',
      features: [
        'Everything in Starter',
        'Sales CRM (up to 50 leads)',
        'CRB Hub (inventory + invoicing)',
        'Email campaigns (1,000/mo)',
        'Live Deal Room (5 sessions/mo)',
        'AI Sourcing Agent',
        'Priority support',
        'Featured listings',
        'Export document management',
      ],
      cta: 'Start 14-Day Trial',
      popular: true,
      badge: 'Most Popular',
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 499 : 399,
      icon: Crown,
      color: 'from-purple-500 to-pink-600',
      description: 'Full platform access with premium support',
      features: [
        'Everything in Growth',
        'Unlimited leads & CRM',
        'Full ERP (CRB Hub)',
        'Unlimited email campaigns',
        'Unlimited live sessions',
        'Priority verification (KYB)',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
        'White-label options',
        'Advanced analytics',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const shippingPlans = [
    {
      name: 'Basic Listing',
      price: 0,
      icon: Ship,
      description: 'For independent freight forwarders',
      features: [
        'Company profile',
        'Route listings',
        'Basic search visibility',
        'Quote request notifications',
        'Standard support',
      ],
      cta: 'List for Free',
    },
    {
      name: 'Featured Carrier',
      price: 149,
      icon: Star,
      description: 'For established logistics companies',
      features: [
        'Everything in Basic',
        'Priority search placement',
        'Verified badge',
        'Escrow protection access',
        'Analytics dashboard',
        'Email support',
        'Up to 20 active shipments',
      ],
      cta: 'Get Featured',
      popular: true,
    },
    {
      name: 'Premium Partner',
      price: 299,
      icon: Crown,
      description: 'For major shipping lines and 3PLs',
      features: [
        'Everything in Featured',
        'Top search placement',
        'KYB Verified Partner badge',
        'Full escrow integration',
        'Advanced analytics',
        'API access',
        'Unlimited shipments',
        'Dedicated support',
        'Maersk/MSC partnership perks',
      ],
      cta: 'Become a Partner',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#050D1A' }}>
      {/* Header */}
      <header className="border-b border-[#162438]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={[
            { label: 'Home', to: '/' },
            { label: 'Pricing' }
          ]} />
          <BackButton label="Back to Home" to="/" />
          <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '48px', letterSpacing: '-1.5px', marginBottom: '16px' }} className="text-white">
            Simple, Transparent Pricing
          </h1>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '20px', color: '#94A3B8', maxWidth: '600px' }}>
            Choose the plan that fits your business. All plans include access to the Expo Hall and core features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-[#D4AF37] text-[#0A0F1E]'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-[#D4AF37] text-[#0A0F1E]'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Annual
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Save 20%</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Pricing */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">For Manufacturers & Buyers</h2>
            <p className="text-slate-400">Complete trade management solution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-[#111827] rounded-2xl border overflow-hidden ${
                  plan.popular ? 'border-[#D4AF37]/50 ring-2 ring-[#D4AF37]/30' : 'border-slate-800'
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A0F1E] text-center py-2 text-sm font-bold">
                    {plan.badge}
                  </div>
                )}

                <div className={`p-8 ${plan.badge ? 'pt-14' : ''}`}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}>
                    <plan.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-slate-400 ml-2">/{billingCycle === 'annual' ? 'mo (billed annually)' : 'month'}</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`block w-full py-3 text-center font-semibold rounded-xl transition-colors ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] hover:shadow-lg hover:shadow-[#D4AF37]/30'
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Pricing */}
      <section className="py-16 px-6 bg-[#0F1520]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Ship className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">For Freight & Logistics Providers</h2>
            <p className="text-slate-400">Connect with shippers worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-[#111827] rounded-2xl border overflow-hidden ${
                  plan.popular ? 'border-emerald-500/50 ring-2 ring-emerald-500/30' : 'border-slate-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center py-2 text-sm font-bold">
                    Recommended
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? 'pt-14' : ''}`}>
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                    <plan.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && <span className="text-slate-400 ml-2">/month</span>}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`block w-full py-3 text-center font-semibold rounded-xl transition-colors ${
                      plan.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/30'
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                q: 'Can I switch plans at any time?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the billing.',
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'Yes! The Growth plan includes a 14-day free trial with full access to all features. No credit card required.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, bank transfers, and for Enterprise plans, we can invoice your company directly.',
              },
              {
                q: 'How does the KYB verification work?',
                a: 'Our Know Your Business (KYB) verification includes company registration checks, trade license validation, and reference checks from existing trade partners.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#D4AF37]/10 to-amber-500/5 border-y border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your trade business?</h2>
          <p className="text-xl text-slate-400 mb-8">Join 2,450+ companies already trading smarter on Brands Bridge AI</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;