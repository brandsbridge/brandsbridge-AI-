// Currency formatter utility
export const formatCurrency = (val: any): string => {
  const num = Number(val);
  if (isNaN(num)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

// Number formatter
export const formatNumber = (val: any): string => {
  const num = Number(val);
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

// Percentage formatter
export const formatPercent = (val: any): string => {
  const num = Number(val);
  if (isNaN(num)) return '0%';
  return `${num.toFixed(1)}%`;
};

// Safe value getter with default
export const safeValue = <T>(value: T | null | undefined, defaultValue: T): T => {
  if (value === null || value === undefined) return defaultValue;
  return value;
};
