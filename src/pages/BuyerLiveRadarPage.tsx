import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Zap } from 'lucide-react';

const BuyerLiveRadarPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <div className="bg-[#111827] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-400" />
                Live Cargo Radar
              </h1>
              <p className="text-slate-400 text-sm">Real-time freight opportunities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Live Radar Coming Soon</h2>
          <p className="text-slate-400 mb-4">
            Real-time freight requests from buyers will appear here. Carriers can view and bid on opportunities instantly.
          </p>
          <div className="bg-slate-800/50 rounded-xl p-4 inline-block">
            <p className="text-sm text-slate-300">
              Feature includes: Live request alerts, competitive bidding, instant quotes, and real-time tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerLiveRadarPage;