import { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2, Bot, User, Calendar, FileText, TrendingUp, Search, Bell, Shield } from 'lucide-react';
import { agentDefinitions, AgentType, AgentMessage, companies } from '../data/mockData';
import { matchBuyerToSuppliers, formatMatchResults, parseUserQuery } from '../services/matchmakingService';
import {
  formatMarketUpdate,
  formatInsightsForChat,
  parseMarketQuery,
  createPriceAlert,
  getCommodityById,
  getLiveCommodityPrices,
  getActiveAlerts
} from '../services/marketDataService';

interface AgentChatProps {
  agentType: AgentType;
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

// Detect user language from browser
const detectLanguage = (): string => {
  const lang = navigator.language.split('-')[0];
  const supported = ['en', 'ar', 'tr', 'es', 'fr', 'de', 'zh', 'ru'];
  return supported.includes(lang) ? lang : 'en';
};

export default function AgentChat({ agentType, isOpen, onClose, isMinimized, onToggleMinimize }: AgentChatProps) {
  const agent = agentDefinitions[agentType];
  const userLang = detectLanguage();
  const greeting = agent.greeting[userLang as keyof typeof agent.greeting] || agent.greeting.en;

  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: '1',
      role: 'agent',
      content: greeting,
      timestamp: new Date().toISOString(),
      agentType
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Intelligent response generation based on agent type
  const generateResponse = (userMessage: string): { content: string; metadata?: AgentMessage['metadata'] } => {
    const lowerMessage = userMessage.toLowerCase();

    // ========== BUYER AGENT - Uses Matchmaking Service ==========
    if (agentType === 'buyer') {
      // Check for trusted/verified filter
      const wantsTrusted = lowerMessage.includes('trusted') || lowerMessage.includes('verified') || lowerMessage.includes('reliable');

      // Schedule meeting request
      if (lowerMessage.includes('schedule') || lowerMessage.includes('meeting') || lowerMessage.includes('call')) {
        return {
          content: `I'll arrange a video meeting for you. Please confirm:\n\n📅 Date: Next Tuesday, 2:00 PM (your local time)\n🎥 Type: Video Call via Google Meet\n👤 Attendee: Export Manager\n\nShall I send the meeting invitation now?`,
          metadata: { meetingScheduled: true }
        };
      }

      // Send inquiry request
      if (lowerMessage.includes('inquiry') || lowerMessage.includes('message') || lowerMessage.includes('contact')) {
        return {
          content: `I'll draft a professional inquiry message for you:\n\n---\n*Subject: Product Inquiry - [Your Company]*\n\nDear Export Team,\n\nWe are interested in your products for distribution in [target market]. Could you please provide:\n\n• Product catalog & price list\n• MOQ and payment terms\n• Lead time for orders\n\nLooking forward to your response.\n\n---\n\nShall I send this to the supplier?`
        };
      }

      // Use matchmaking service for supplier search
      const { requirements, matches } = matchBuyerToSuppliers(userMessage);

      if (matches.length > 0) {
        const trustedMatches = wantsTrusted ? matches.filter(m => m.company.verified) : matches;
        if (trustedMatches.length > 0) {
          return {
            content: formatMatchResults(trustedMatches),
            metadata: { companies: trustedMatches.map(m => m.company.slug) }
          };
        } else if (wantsTrusted) {
          return {
            content: `I found suppliers matching your criteria, but none are currently verified as "Trusted" in our system.\n\nWould you like me to:\n• Show all available suppliers anyway?\n• Narrow down by other filters (country, certification)?`
          };
        }
      }

      // Default buyer response
      return {
        content: `I can help you find suppliers for any FMCG product. Just tell me:\n\n1. **What product** are you looking for?\n2. **Which country** do you want to source from?\n3. **Any certifications** needed? (Halal, Organic, BRC)\n4. Want only **Trusted/Verified** suppliers?\n\nI'll search our database of 2,450+ verified companies and show you the best matches.`
      };
    }

    // ========== SELLER AGENT ==========
    if (agentType === 'seller') {
      if (lowerMessage.includes('inquiry') || lowerMessage.includes('inquiries')) {
        return {
          content: `You have **3 new inquiries** today:\n\n🔴 **HIGH PRIORITY** - Gulf Trading Co. (UAE)\n   Looking for: Chocolate wafers, 2 containers/month\n   Budget: $25,000/container\n   Match Score: **92%**\n\n🟡 **MEDIUM** - Premium Foods UK\n   Looking for: Dairy products for retail\n   Match Score: **78%**\n\n🟢 **LOW** - General inquiry from Brazil\n   Match Score: **65%**\n\nWould you like me to draft a quotation for the UAE inquiry?`,
          metadata: { companies: ['gulf-trading'] }
        };
      }
      if (lowerMessage.includes('quotation') || lowerMessage.includes('quote')) {
        return {
          content: `I've prepared a quotation:\n\n📄 **Quotation #QT-2024-0156**\n\nProduct: Chocolate Wafer Bars 750g\nQuantity: 1 x 40ft Container (1,200 cases)\nUnit Price: $21.50/case\nTotal: $25,800 CIF Dubai\nPayment: LC at Sight\nValidity: 15 days\n\nShall I send this to Gulf Trading Co.?`,
          metadata: { quotationGenerated: true }
        };
      }
      return {
        content: `As your virtual export manager, I can:\n\n• View and prioritize buyer inquiries (with AI scoring)\n• Create professional quotations instantly\n• Generate proforma invoices\n• Schedule meetings with buyers\n• Respond to buyers in their language\n\nWhat would you like me to help with?`
      };
    }

    // ========== MATCHMAKER AGENT - Full Compatibility Scoring ==========
    if (agentType === 'matchmaker') {
      // Parse the query for matching requirements
      const { requirements, matches } = matchBuyerToSuppliers(userMessage);

      if (matches.length > 0) {
        let response = `🔄 **Compatibility Analysis Complete**\n\nBased on your requirements, I've identified **${matches.length} potential matches**:\n\n`;

        matches.forEach((match, index) => {
          const scoreEmoji = match.score >= 85 ? '✅' : match.score >= 70 ? '🟡' : '🟠';
          response += `${scoreEmoji} **${match.score}% Match** - ${match.company.name}\n`;
          response += `   📍 ${match.company.country} | ${match.company.businessType}\n`;
          response += `   📊 Score Breakdown:\n`;
          response += `      • Product Match: ${match.matchDetails.productMatch}/40\n`;
          response += `      • Location: ${match.matchDetails.locationMatch}/30\n`;
          response += `      • Certifications: ${match.matchDetails.certificationMatch}/20\n`;
          response += `      • Trust Bonus: ${match.matchDetails.trustBonus}/10\n`;
          if (match.company.verified) {
            response += `   ✅ **Verified Supplier**\n`;
          }
          response += `\n`;
        });

        response += `Would you like me to:\n• Initiate introductions with any of these companies?\n• Refine the search with additional criteria?`;

        return {
          content: response,
          metadata: { companies: matches.map(m => m.company.slug) }
        };
      }

      // No search query - show general matchmaker capabilities
      if (lowerMessage.includes('how') || lowerMessage.includes('help') || lowerMessage.includes('what')) {
        return {
          content: `🔄 **Matchmaking Engine**\n\nI analyze compatibility between buyers and suppliers using:\n\n📊 **Scoring Factors:**\n• **Product Match** (40%) - Category, keywords, specialization\n• **Location** (30%) - Source country, export destinations\n• **Certifications** (20%) - Required vs available certs\n• **Trust Score** (10%) - Verification, subscription level\n\n**Try asking:**\n• "Find chocolate suppliers from Turkey with Halal certification"\n• "Match me with trusted dairy exporters to GCC"\n• "Who can supply organic snacks to Europe?"`
        };
      }

      return {
        content: `🔄 **Ready to Match**\n\nTell me what you're looking for and I'll calculate compatibility scores:\n\n• **Product type** (chocolate, dairy, beverages...)\n• **Source country** (Turkey, UAE, Germany...)\n• **Certifications** (Halal, Organic, BRC...)\n• **Trusted only?** (verified suppliers)\n\nI'll analyze our database and show you the best matches with detailed scoring.`
      };
    }

    // ========== MARKET WATCH AGENT - Live Prices & Alerts ==========
    if (agentType === 'market-watch') {
      const marketCommand = parseMarketQuery(userMessage);

      // Price alert creation
      if (marketCommand.command === 'create_alert') {
        if (marketCommand.params.commodity && marketCommand.params.price) {
          const commodity = getCommodityById(marketCommand.params.commodity);
          if (commodity) {
            const targetPrice = parseFloat(marketCommand.params.price);
            const alert = createPriceAlert(
              marketCommand.params.commodity,
              targetPrice,
              marketCommand.params.direction as 'above' | 'below'
            );
            return {
              content: `✅ **Price Alert Created**\n\n🔔 **${commodity.name}**\nTarget: $${targetPrice}/${commodity.unit}\nDirection: ${alert.direction === 'above' ? 'When price goes ABOVE' : 'When price drops BELOW'}\n\nCurrent Price: $${commodity.currentPrice}/${commodity.unit}\n\nI'll notify you when this target is reached!`,
              metadata: { priceAlert: true }
            };
          }
        }
        // Help user set alert
        return {
          content: `🔔 **Set a Price Alert**\n\nTo create an alert, tell me:\n• **Commodity**: Wheat, Sugar, Olive Oil, etc.\n• **Target Price**: e.g., $700\n• **Direction**: Above or Below\n\n**Example:** "Alert me when Sugar goes above $650"\n\nAvailable commodities:\n• Grains: Wheat, Corn, Rice\n• Sugar: Raw Sugar, White Sugar\n• Oils: Palm Oil, Olive Oil, Sunflower Oil\n• Dairy: Milk Powder, Butter, Cheese`,
          metadata: { priceAlert: true }
        };
      }

      // Get specific commodity price
      if (marketCommand.command === 'get_price' && marketCommand.params.commodities) {
        const commodityIds = marketCommand.params.commodities.split(',');
        const prices = commodityIds.map(id => getCommodityById(id)).filter(Boolean);

        if (prices.length > 0) {
          let response = `📊 **Live Prices**\n\n`;
          prices.forEach(p => {
            if (p) {
              const emoji = p.changePercent >= 0 ? '🟢' : '🔴';
              response += `${emoji} **${p.name}**\n`;
              response += `   Price: $${p.currentPrice}/${p.unit}\n`;
              response += `   Change: ${p.changePercent >= 0 ? '+' : ''}${p.changePercent.toFixed(2)}%\n`;
              response += `   24h Range: $${p.low24h} - $${p.high24h}\n`;
              response += `   Exchange: ${p.exchange} | Region: ${p.region}\n\n`;
            }
          });
          return { content: response, metadata: { priceAlert: true } };
        }
      }

      // Market insights
      if (marketCommand.command === 'insights') {
        return {
          content: formatInsightsForChat(),
          metadata: { priceAlert: true }
        };
      }

      // Show active alerts
      if (lowerMessage.includes('my alert') || lowerMessage.includes('active alert')) {
        const alerts = getActiveAlerts();
        if (alerts.length > 0) {
          let response = `🔔 **Your Active Alerts**\n\n`;
          alerts.forEach(alert => {
            response += `• **${alert.commodityName}**: ${alert.direction} $${alert.targetPrice}\n`;
          });
          return { content: response };
        }
        return { content: `You don't have any active price alerts. Would you like me to set one up?` };
      }

      // Auction info
      if (lowerMessage.includes('auction')) {
        return {
          content: `🚢 **Active Cargo Auctions**\n\n1. **OZMO Chocolate Wafers** - Mersin, Turkey\n   Price: $27,200 CIF Dubai\n   Quantity: 1 x 40ft Container\n   Expires: 2 days\n\n2. **Almarai UHT Milk** - Jeddah, Saudi Arabia\n   Price: $46,500 CIF Amman\n   Quantity: 1 x 40ft Reefer\n   Expires: 4 days\n\n3. **German Organic Cookies** - Hamburg\n   Price: $32,800 CIF Shanghai\n   Quantity: 1 x 20ft Container\n   Expires: 6 days\n\nInterested in reserving any container?`
        };
      }

      // Default: Show market overview
      return {
        content: formatMarketUpdate() + `\n\n**What I can do:**\n• 📊 Show live commodity prices\n• 🔔 Set price alerts\n• 📈 Provide market insights\n• 🚢 Track cargo auctions\n\n**Try asking:**\n• "What's the price of olive oil?"\n• "Alert me when sugar drops below $600"\n• "Show market insights"`,
        metadata: { priceAlert: true }
      };
    }

    return {
      content: `I understand you're asking about "${userMessage}". Let me help you with that. Could you provide more details about what you're looking for?`
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate agent thinking time
    setTimeout(() => {
      const response = generateResponse(input);
      const agentMessage: AgentMessage = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: response.content,
        timestamp: new Date().toISOString(),
        agentType,
        metadata: response.metadata
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  const quickActions = {
    buyer: [
      { icon: Search, label: 'Find Suppliers', action: 'Find chocolate suppliers from Turkey with Halal certification' },
      { icon: Shield, label: 'Trusted Only', action: 'Find trusted verified dairy suppliers' },
      { icon: Calendar, label: 'Schedule Meeting', action: 'Schedule a meeting with a supplier' }
    ],
    seller: [
      { icon: FileText, label: 'View Inquiries', action: 'Show me new buyer inquiries' },
      { icon: FileText, label: 'Create Quote', action: 'Create a quotation for the latest inquiry' },
      { icon: Calendar, label: 'Follow-ups', action: 'Show pending follow-ups' }
    ],
    matchmaker: [
      { icon: Search, label: 'Find Matches', action: 'Find confectionery exporters to Middle East' },
      { icon: Shield, label: 'Verified Only', action: 'Match me with trusted organic food suppliers' },
      { icon: TrendingUp, label: 'How It Works', action: 'How does the matchmaking scoring work?' }
    ],
    'market-watch': [
      { icon: TrendingUp, label: 'Live Prices', action: 'Show current commodity prices' },
      { icon: Bell, label: 'Set Alert', action: 'Set a price alert for sugar' },
      { icon: FileText, label: 'Insights', action: 'Show me market insights and trends' }
    ]
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-luxury-gold/20 overflow-hidden transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand to-luxury-chocolate cursor-pointer"
        onClick={onToggleMinimize}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: agent.color }}
          >
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
            <p className="text-xs text-white/70">{agent.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="status-online" />
          <button
            onClick={(e) => { e.stopPropagation(); onToggleMinimize?.(); }}
            className="text-white/70 hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-luxury-ivory to-luxury-cream">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-luxury-gold' : 'bg-brand'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-agent'}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-brand">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="chat-bubble-agent">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-luxury-gold/10 bg-white/50">
              <p className="text-xs text-brand/50 mb-2">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                {quickActions[agentType].map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(action.action);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-luxury-cream hover:bg-luxury-gold/20 rounded-full text-xs font-medium text-brand transition-colors"
                  >
                    <action.icon className="w-3 h-3" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-luxury-gold/10 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="input-luxury flex-1 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="btn-gold w-10 h-10 flex items-center justify-center rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
