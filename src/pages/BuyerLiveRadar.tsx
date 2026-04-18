import { useNavigate } from 'react-router-dom';
import { Radio } from 'lucide-react';

const BuyerLiveRadar = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0F1E] p-10 font-sans">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        <h1 className="text-[28px] font-bold text-gray-50 m-0">
          Live Radar
        </h1>
      </div>
      <p className="text-slate-400 mb-8">
        Companies currently broadcasting live.
        Click to join their session.
      </p>
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
        <p className="text-amber-400 text-base font-semibold">
          4 companies live right now
        </p>
        <p className="text-slate-500 text-sm mt-2">
          Go to Expo Hall to browse and
          join live sessions
        </p>
        <button
          onClick={() => navigate('/live-expo')}
          className="mt-4 bg-teal-700 text-white border-none px-5 py-3 rounded-xl cursor-pointer text-sm font-semibold hover:bg-teal-600 transition-colors"
        >
          Browse Live Companies →
        </button>
      </div>
    </div>
  );
};

export default BuyerLiveRadar;
