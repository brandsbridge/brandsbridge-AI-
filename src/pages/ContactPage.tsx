import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Send, Clock, Globe, MapPin, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import BackButton from '../components/BackButton';
import Breadcrumb from '../components/Breadcrumb';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'General inquiries and support',
      value: 'info@brandsbridge.net',
      link: 'mailto:info@brandsbridge.net'
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      description: 'Quick responses for urgent matters',
      value: '+974 XXXX XXXX',
      link: 'https://wa.me/97400000000'
    },
    {
      icon: MapPin,
      title: 'Office',
      description: 'Qatar Financial Centre',
      value: 'Doha, Qatar 🇶🇦',
      link: null
    },
    {
      icon: Clock,
      title: 'Response Time',
      description: 'We aim to respond within',
      value: '2 hours',
      link: null
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Message Sent!</h1>
          <p className="text-slate-400 mb-8">
            Thank you for reaching out. Our team will respond within 2 hours during business hours.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#050D1A' }}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#071120] via-[#0B5E75]/20 to-[#071120] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: 'Home', to: '/' },
            { label: 'Contact' }
          ]} />
          <BackButton label="Back to Home" to="/" />
          <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '48px', letterSpacing: '-1.5px', marginBottom: '16px' }} className="text-white">
            Get in Touch
          </h1>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '20px', color: '#94A3B8', maxWidth: '600px' }}>
            Have questions about listing your company or finding suppliers? Our team is here to help you succeed in global trade.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            {contactMethods.map((method, idx) => (
              <div key={idx} className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <method.icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{method.title}</h3>
                    <p className="text-sm text-slate-500 mb-2">{method.description}</p>
                    {method.link ? (
                      <a href={method.link} className="text-[#D4AF37] font-medium hover:underline">
                        {method.value}
                      </a>
                    ) : (
                      <span className="text-white font-medium">{method.value}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Global Platform */}
            <div className="bg-gradient-to-r from-[#0B5E75]/20 to-transparent border border-[#0B5E75]/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="text-lg font-semibold text-white">Global Operations</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Brands Bridge AI serves companies from 85+ countries. We operate fully online to provide 24/7 access to our services from anywhere in the world.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-2">Send us a Message</h2>
              <p className="text-slate-400 mb-8">
                Fill out the form below and our team will get back to you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'general', label: 'General Inquiry' },
                      { value: 'seller', label: 'List My Company' },
                      { value: 'buyer', label: 'Find Suppliers' },
                      { value: 'support', label: 'Technical Support' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: option.value })}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          formData.type === option.value
                            ? 'bg-[#D4AF37] text-[#0A0F1E]'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                {/* Company & Subject Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                      placeholder="Your Company Ltd."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all resize-none"
                    placeholder="Please describe how we can assist you..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;