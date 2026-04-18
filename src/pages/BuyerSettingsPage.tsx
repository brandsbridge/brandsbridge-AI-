import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Bell, CreditCard, Shield, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Tab = 'account' | 'notifications' | 'payments' | 'security';

const BuyerSettingsPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('account');

  const [account, setAccount] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: '',
    country: 'Qatar',
  });

  const [notifications, setNotifications] = useState({
    emailQuotes: true,
    emailShipments: true,
    emailMarketing: false,
    smsUrgent: true,
    pushDigest: true,
  });

  const [payments, setPayments] = useState({
    defaultCurrency: 'USD',
    paymentTerms: 'NET-30',
    invoicePrefix: 'BB-INV-',
  });

  const [security, setSecurity] = useState({
    mfa: false,
    sessionTimeout: '60',
    loginAlerts: true,
  });

  const handleSave = () => toast.success('Settings saved successfully');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'account', label: 'Account Info', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link to="/buyer/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Buyer Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Buyer Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account, preferences and security.</p>
        </div>

        <div className="grid grid-cols-[220px_1fr] gap-6">
          <aside className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 h-fit">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </aside>

          <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            {tab === 'account' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Account Info</h2>
                <Field label="Full Name" value={account.name} onChange={(v) => setAccount({ ...account, name: v })} />
                <Field label="Email" value={account.email} onChange={(v) => setAccount({ ...account, email: v })} type="email" />
                <Field label="Company" value={account.company} onChange={(v) => setAccount({ ...account, company: v })} />
                <Field label="Phone" value={account.phone} onChange={(v) => setAccount({ ...account, phone: v })} placeholder="+974 5555 0123" />
                <Select label="Country" value={account.country} onChange={(v) => setAccount({ ...account, country: v })} options={['Qatar', 'UAE', 'Saudi Arabia', 'Kuwait', 'Bahrain', 'Oman']} />
              </div>
            )}

            {tab === 'notifications' && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
                <Toggle label="Email — Quote updates" checked={notifications.emailQuotes} onChange={(v) => setNotifications({ ...notifications, emailQuotes: v })} />
                <Toggle label="Email — Shipment tracking" checked={notifications.emailShipments} onChange={(v) => setNotifications({ ...notifications, emailShipments: v })} />
                <Toggle label="Email — Product announcements" checked={notifications.emailMarketing} onChange={(v) => setNotifications({ ...notifications, emailMarketing: v })} />
                <Toggle label="SMS — Urgent alerts only" checked={notifications.smsUrgent} onChange={(v) => setNotifications({ ...notifications, smsUrgent: v })} />
                <Toggle label="Push — Daily digest" checked={notifications.pushDigest} onChange={(v) => setNotifications({ ...notifications, pushDigest: v })} />
              </div>
            )}

            {tab === 'payments' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
                <Select label="Default Currency" value={payments.defaultCurrency} onChange={(v) => setPayments({ ...payments, defaultCurrency: v })} options={['USD', 'EUR', 'AED', 'SAR', 'QAR']} />
                <Select label="Payment Terms" value={payments.paymentTerms} onChange={(v) => setPayments({ ...payments, paymentTerms: v })} options={['Prepay', 'NET-15', 'NET-30', 'NET-60', 'NET-90']} />
                <Field label="Invoice Prefix" value={payments.invoicePrefix} onChange={(v) => setPayments({ ...payments, invoicePrefix: v })} />
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Saved Cards</h3>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>•••• •••• •••• 4242 — Expires 04/28</span>
                    <button onClick={() => toast.success('Card removed')} className="text-red-400 hover:text-red-300">Remove</button>
                  </div>
                </div>
                <button onClick={() => toast.success('Opening add-card flow')} className="text-sm text-blue-400 hover:text-blue-300">+ Add Payment Method</button>
              </div>
            )}

            {tab === 'security' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Security Settings</h2>
                <Toggle label="Two-Factor Authentication (MFA)" checked={security.mfa} onChange={(v) => setSecurity({ ...security, mfa: v })} />
                <Select label="Session Timeout (minutes)" value={security.sessionTimeout} onChange={(v) => setSecurity({ ...security, sessionTimeout: v })} options={['15', '30', '60', '120', '240']} />
                <Toggle label="Email me on new logins" checked={security.loginAlerts} onChange={(v) => setSecurity({ ...security, loginAlerts: v })} />
                <div className="flex gap-3 pt-2">
                  <button onClick={() => toast.success('Password reset email sent')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm">Change Password</button>
                  <button onClick={() => toast.success('All other sessions signed out')} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm border border-red-500/30">Sign Out All Other Sessions</button>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-8 pt-6 border-t border-slate-800">
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 rounded-lg font-semibold">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
  <div>
    <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
    />
  </div>
);

const Select = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <div>
    <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-white">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-slate-700'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  </div>
);

export default BuyerSettingsPage;
