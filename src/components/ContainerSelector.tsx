import { Package, Snowflake } from 'lucide-react';

interface ContainerSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ContainerSelector = ({ value, onChange, className = '' }: ContainerSelectorProps) => {
  const options = [
    {
      id: '20ft',
      name: '20ft Standard',
      capacity: '28 CBM | 21.7 MT',
      icon: Package
    },
    {
      id: '40ft',
      name: '40ft Standard',
      capacity: '58 CBM | 26.7 MT',
      icon: Package
    },
    {
      id: '40ft-hc',
      name: '40ft High Cube',
      capacity: '67 CBM | 26.7 MT',
      icon: Package
    },
    {
      id: 'reefer',
      name: '40ft Reefer',
      capacity: '67 CBM | Controlled temp',
      icon: Snowflake
    }
  ];

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {options.map(opt => {
        const Icon = opt.icon;
        const isSelected = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`p-4 rounded-xl text-left transition-all ${
              isSelected
                ? 'border-2 border-[#D4AF37] bg-[#D4AF37]/10'
                : 'border border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
            <div className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
              {opt.name}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {opt.capacity}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ContainerSelector;
