import { useState } from 'react';
import { FileText, Download, Eye } from 'lucide-react';

interface Document {
  id: number;
  icon: string;
  title: string;
  from: string;
  date: string;
  amount: string | null;
  status: string;
  statusColor: string;
}

const BuyerDocumentsPage = () => {
  const [documents] = useState<Document[]>([
    {
      id: 1,
      icon: '🧾',
      title: 'Commercial Invoice',
      from: 'Al Meera Consumer Goods',
      date: 'Jan 25, 2025',
      amount: '$60,000',
      status: 'Approved',
      statusColor: '#10B981'
    },
    {
      id: 2,
      icon: '🚢',
      title: 'Bill of Lading',
      from: 'Apex Global Logistics',
      date: 'Jan 26, 2025',
      amount: null,
      status: 'For Information',
      statusColor: '#94A3B8'
    },
    {
      id: 3,
      icon: '📋',
      title: 'Proforma Invoice',
      from: 'OZMO Confectionery',
      date: 'Jan 28, 2025',
      amount: '$2,800',
      status: 'Awaiting Review',
      statusColor: '#F59E0B'
    },
    {
      id: 4,
      icon: '🤝',
      title: 'Sales Contract',
      from: 'Baladna Food Industries',
      date: 'Jan 29, 2025',
      amount: '$186,000',
      status: 'Awaiting Signature',
      statusColor: '#3B82F6'
    }
  ]);

  return (
    <div className="min-h-screen bg-[#0A0F1E] p-10 font-sans">
      <h1 className="text-[28px] font-bold text-gray-50 mb-2">
        My Documents
      </h1>
      <p className="text-slate-400 mb-8">
        Contracts, invoices and shipping
        documents from your suppliers.
      </p>
      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="text-[28px]">{doc.icon}</span>
              <div>
                <div className="text-gray-50 font-semibold text-base">
                  {doc.title}
                </div>
                <div className="text-slate-400 text-sm mt-0.5">
                  From: {doc.from}
                </div>
                <div className="text-slate-500 text-xs mt-0.5">
                  {doc.date}
                  {doc.amount && ` • ${doc.amount}`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-sm font-medium"
                style={{ color: doc.statusColor }}
              >
                {doc.status}
              </span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                <Eye className="w-4 h-4" />
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerDocumentsPage;
