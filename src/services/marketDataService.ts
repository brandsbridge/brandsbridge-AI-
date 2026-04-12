// Market Data Service - Real-time Commodity Price Simulation
// Simulates live market data feed for global food commodities

export interface CommodityData {
  id: string;
  name: string;
  symbol: string;
  category: 'grains' | 'sugar' | 'oils' | 'dairy' | 'meat' | 'other';
  unit: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
  region: string;
  exchange: string;
}

export interface PriceAlert {
  id: string;
  commodityId: string;
  commodityName: string;
  targetPrice: number;
  direction: 'above' | 'below';
  isTriggered: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

export interface MarketInsight {
  id: string;
  title: string;
  summary: string;
  commodities: string[];
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
  source: string;
}

// Base commodity prices (realistic market values in USD)
const baseCommodities: Omit<CommodityData, 'change' | 'changePercent' | 'trend' | 'lastUpdated'>[] = [
  { id: 'wheat', name: 'Wheat', symbol: 'WHEAT', category: 'grains', unit: 'MT', currentPrice: 265, previousPrice: 262, high24h: 268, low24h: 260, volume: '125K', region: 'Global', exchange: 'CBOT' },
  { id: 'corn', name: 'Corn', symbol: 'CORN', category: 'grains', unit: 'MT', currentPrice: 198, previousPrice: 195, high24h: 202, low24h: 194, volume: '180K', region: 'Global', exchange: 'CBOT' },
  { id: 'rice', name: 'Rice', symbol: 'RICE', category: 'grains', unit: 'MT', currentPrice: 425, previousPrice: 420, high24h: 430, low24h: 418, volume: '45K', region: 'Asia', exchange: 'CBOT' },
  { id: 'sugar-raw', name: 'Raw Sugar', symbol: 'SUGAR', category: 'sugar', unit: 'MT', currentPrice: 628, previousPrice: 615, high24h: 635, low24h: 612, volume: '95K', region: 'Global', exchange: 'ICE' },
  { id: 'sugar-white', name: 'White Sugar', symbol: 'WSUGAR', category: 'sugar', unit: 'MT', currentPrice: 715, previousPrice: 708, high24h: 720, low24h: 705, volume: '62K', region: 'Europe', exchange: 'ICE' },
  { id: 'palm-oil', name: 'Palm Oil', symbol: 'PALM', category: 'oils', unit: 'MT', currentPrice: 895, previousPrice: 888, high24h: 905, low24h: 882, volume: '78K', region: 'Malaysia', exchange: 'BMD' },
  { id: 'soybean-oil', name: 'Soybean Oil', symbol: 'SOYOIL', category: 'oils', unit: 'MT', currentPrice: 1045, previousPrice: 1062, high24h: 1070, low24h: 1038, volume: '55K', region: 'USA', exchange: 'CBOT' },
  { id: 'sunflower-oil', name: 'Sunflower Oil', symbol: 'SUNOIL', category: 'oils', unit: 'MT', currentPrice: 1120, previousPrice: 1095, high24h: 1135, low24h: 1090, volume: '42K', region: 'Ukraine/EU', exchange: 'MATIF' },
  { id: 'olive-oil', name: 'Olive Oil', symbol: 'OLIVE', category: 'oils', unit: 'MT', currentPrice: 8450, previousPrice: 8200, high24h: 8520, low24h: 8180, volume: '12K', region: 'Spain', exchange: 'MFAO' },
  { id: 'cocoa', name: 'Cocoa', symbol: 'COCOA', category: 'other', unit: 'MT', currentPrice: 8925, previousPrice: 8780, high24h: 9050, low24h: 8750, volume: '35K', region: 'West Africa', exchange: 'ICE' },
  { id: 'coffee', name: 'Coffee Arabica', symbol: 'COFFEE', category: 'other', unit: 'MT', currentPrice: 4850, previousPrice: 4780, high24h: 4920, low24h: 4750, volume: '48K', region: 'Brazil', exchange: 'ICE' },
  { id: 'milk-powder', name: 'Milk Powder (WMP)', symbol: 'WMP', category: 'dairy', unit: 'MT', currentPrice: 3250, previousPrice: 3280, high24h: 3295, low24h: 3220, volume: '8K', region: 'New Zealand', exchange: 'GDT' },
  { id: 'butter', name: 'Butter', symbol: 'BUTTER', category: 'dairy', unit: 'MT', currentPrice: 6850, previousPrice: 6920, high24h: 6950, low24h: 6800, volume: '5K', region: 'Europe', exchange: 'EEX' },
  { id: 'cheese', name: 'Cheddar Cheese', symbol: 'CHEESE', category: 'dairy', unit: 'MT', currentPrice: 4150, previousPrice: 4100, high24h: 4180, low24h: 4080, volume: '6K', region: 'USA', exchange: 'CME' },
];

// Simulate real-time price fluctuations
function simulatePriceChange(basePrice: number, volatility: number = 0.02): number {
  const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
  return Math.round((basePrice + change) * 100) / 100;
}

// Get live commodity prices with simulated fluctuations
export function getLiveCommodityPrices(): CommodityData[] {
  return baseCommodities.map(commodity => {
    const currentPrice = simulatePriceChange(commodity.currentPrice, 0.015);
    const change = currentPrice - commodity.previousPrice;
    const changePercent = (change / commodity.previousPrice) * 100;

    return {
      ...commodity,
      currentPrice,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      trend: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable',
      lastUpdated: new Date()
    };
  });
}

// Get commodity by ID
export function getCommodityById(id: string): CommodityData | undefined {
  const prices = getLiveCommodityPrices();
  return prices.find(c => c.id === id);
}

// Get commodities by category
export function getCommoditiesByCategory(category: CommodityData['category']): CommodityData[] {
  return getLiveCommodityPrices().filter(c => c.category === category);
}

// Price alerts storage (in-memory for demo, would be database in production)
let priceAlerts: PriceAlert[] = [];

// Create price alert
export function createPriceAlert(commodityId: string, targetPrice: number, direction: 'above' | 'below'): PriceAlert {
  const commodity = getCommodityById(commodityId);
  const alert: PriceAlert = {
    id: `alert-${Date.now()}`,
    commodityId,
    commodityName: commodity?.name || commodityId,
    targetPrice,
    direction,
    isTriggered: false,
    createdAt: new Date()
  };
  priceAlerts.push(alert);
  return alert;
}

// Check and trigger alerts
export function checkPriceAlerts(): PriceAlert[] {
  const prices = getLiveCommodityPrices();
  const triggeredAlerts: PriceAlert[] = [];

  priceAlerts.forEach(alert => {
    if (alert.isTriggered) return;

    const commodity = prices.find(c => c.id === alert.commodityId);
    if (!commodity) return;

    const shouldTrigger =
      (alert.direction === 'above' && commodity.currentPrice >= alert.targetPrice) ||
      (alert.direction === 'below' && commodity.currentPrice <= alert.targetPrice);

    if (shouldTrigger) {
      alert.isTriggered = true;
      alert.triggeredAt = new Date();
      triggeredAlerts.push(alert);
    }
  });

  return triggeredAlerts;
}

// Get active alerts
export function getActiveAlerts(): PriceAlert[] {
  return priceAlerts.filter(a => !a.isTriggered);
}

// Generate market insights based on current prices
export function generateMarketInsights(): MarketInsight[] {
  const prices = getLiveCommodityPrices();
  const insights: MarketInsight[] = [];

  // Find biggest movers
  const sortedByChange = [...prices].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  const topMover = sortedByChange[0];

  if (Math.abs(topMover.changePercent) > 1.5) {
    insights.push({
      id: `insight-${Date.now()}-1`,
      title: `${topMover.name} ${topMover.changePercent > 0 ? 'Surges' : 'Drops'} ${Math.abs(topMover.changePercent).toFixed(1)}%`,
      summary: `${topMover.name} prices ${topMover.changePercent > 0 ? 'increased' : 'decreased'} significantly today, reaching $${topMover.currentPrice}/${topMover.unit}. ${topMover.changePercent > 0 ? 'Strong demand from importers driving prices up.' : 'Increased supply putting pressure on prices.'}`,
      commodities: [topMover.name],
      impact: topMover.changePercent > 0 ? 'positive' : 'negative',
      timestamp: new Date(),
      source: 'Brands Bridge Market Analysis'
    });
  }

  // Oil market analysis
  const oilPrices = prices.filter(p => p.category === 'oils');
  const avgOilChange = oilPrices.reduce((sum, p) => sum + p.changePercent, 0) / oilPrices.length;
  if (Math.abs(avgOilChange) > 1) {
    insights.push({
      id: `insight-${Date.now()}-2`,
      title: `Edible Oils Market ${avgOilChange > 0 ? 'Rally' : 'Correction'}`,
      summary: `The edible oils sector shows a ${avgOilChange > 0 ? 'bullish' : 'bearish'} trend with an average ${avgOilChange > 0 ? 'gain' : 'loss'} of ${Math.abs(avgOilChange).toFixed(1)}%. ${avgOilChange > 0 ? 'Consider locking in prices for upcoming orders.' : 'Good opportunity for buyers to negotiate better rates.'}`,
      commodities: oilPrices.map(o => o.name),
      impact: avgOilChange > 0 ? 'positive' : 'negative',
      timestamp: new Date(),
      source: 'Brands Bridge Market Analysis'
    });
  }

  // Sugar market insight
  const sugarPrices = prices.filter(p => p.category === 'sugar');
  const avgSugarChange = sugarPrices.reduce((sum, p) => sum + p.changePercent, 0) / sugarPrices.length;
  insights.push({
    id: `insight-${Date.now()}-3`,
    title: 'Global Sugar Market Update',
    summary: `Sugar prices ${avgSugarChange > 0 ? 'firmed' : 'softened'} with Raw Sugar at $${prices.find(p => p.id === 'sugar-raw')?.currentPrice}/MT. ${avgSugarChange > 0 ? 'El Nino concerns affecting Brazilian output.' : 'Indian exports adding to global supply.'}`,
    commodities: ['Raw Sugar', 'White Sugar'],
    impact: avgSugarChange > 0 ? 'positive' : 'negative',
    timestamp: new Date(),
    source: 'International Sugar Organization'
  });

  return insights;
}

// Format market data for chat display
export function formatMarketUpdate(): string {
  const prices = getLiveCommodityPrices();
  const topGainers = [...prices].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const topLosers = [...prices].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);

  let response = `📊 **Live Market Update** (${new Date().toLocaleTimeString()})\n\n`;

  response += `**Top Gainers:**\n`;
  topGainers.forEach(c => {
    response += `🟢 **${c.name}** +${c.changePercent.toFixed(1)}% ($${c.currentPrice}/${c.unit})\n`;
  });

  response += `\n**Top Decliners:**\n`;
  topLosers.forEach(c => {
    const emoji = c.changePercent < 0 ? '🔴' : '⚪';
    response += `${emoji} **${c.name}** ${c.changePercent.toFixed(1)}% ($${c.currentPrice}/${c.unit})\n`;
  });

  return response;
}

// Format insights for chat
export function formatInsightsForChat(): string {
  const insights = generateMarketInsights();

  let response = `📈 **Market Insights**\n\n`;

  insights.slice(0, 3).forEach((insight, index) => {
    const emoji = insight.impact === 'positive' ? '📗' : insight.impact === 'negative' ? '📕' : '📘';
    response += `${emoji} **${insight.title}**\n`;
    response += `${insight.summary}\n\n`;
  });

  response += `Would you like me to set up price alerts for any of these commodities?`;

  return response;
}

// Parse user query for market commands
export function parseMarketQuery(query: string): { command: string; params: Record<string, string> } {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('alert') || lowerQuery.includes('notify')) {
    // Extract commodity and price from query
    const commodities = baseCommodities.filter(c =>
      lowerQuery.includes(c.name.toLowerCase()) || lowerQuery.includes(c.symbol.toLowerCase())
    );
    const priceMatch = query.match(/\$?(\d+(?:\.\d+)?)/);

    return {
      command: 'create_alert',
      params: {
        commodity: commodities[0]?.id || '',
        price: priceMatch?.[1] || '',
        direction: lowerQuery.includes('below') || lowerQuery.includes('drop') ? 'below' : 'above'
      }
    };
  }

  if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('rate')) {
    const commodities = baseCommodities.filter(c =>
      lowerQuery.includes(c.name.toLowerCase()) || lowerQuery.includes(c.symbol.toLowerCase())
    );
    return {
      command: 'get_price',
      params: { commodities: commodities.map(c => c.id).join(',') }
    };
  }

  if (lowerQuery.includes('insight') || lowerQuery.includes('trend') || lowerQuery.includes('analysis')) {
    return { command: 'insights', params: {} };
  }

  return { command: 'overview', params: {} };
}
