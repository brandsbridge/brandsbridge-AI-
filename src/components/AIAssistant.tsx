import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, X, Minus, Send, ChevronDown } from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface Message {
  id: string;
  type: 'ai' | 'user';
  text: string;
  timestamp: Date;
  quickReplies?: string[];
  actionButton?: { label: string; action: string };
}

interface QuickReply {
  label: string;
  action: string;
}

// ============================================
// CONTEXT MESSAGES BY PAGE
// ============================================
const getContextMessage = (path: string, userName: string): { greeting: string; quickReplies: QuickReply[] } => {
  const pathLower = path.toLowerCase();

  if (pathLower === '/' || pathLower === '') {
    return {
      greeting: "👋 Welcome to Brands Bridge AI!\nI can help you find suppliers, understand our platform, or get started. What brings you here today?",
      quickReplies: [
        { label: "I'm a Supplier", action: "supplier" },
        { label: "I'm a Buyer", action: "buyer" },
        { label: "Tell me more", action: "more" },
        { label: "Pricing?", action: "pricing" }
      ]
    };
  }

  if (pathLower.includes('login')) {
    return {
      greeting: "Need help signing in?\nUse our demo accounts to explore:\n• Supplier Demo\n• Buyer Demo\n• Admin Demo",
      quickReplies: [
        { label: "Supplier Demo", action: "login supplier" },
        { label: "Buyer Demo", action: "login buyer" },
        { label: "Admin Demo", action: "login admin" }
      ]
    };
  }

  if (pathLower.includes('companies') || pathLower.includes('expo')) {
    return {
      greeting: "🔍 Looking for something specific?\nTell me what products you need and I'll find the best matches for you.",
      quickReplies: [
        { label: "Chocolate suppliers", action: "chocolate" },
        { label: "Dairy products", action: "dairy" },
        { label: "Halal certified", action: "halal" },
        { label: "GCC region", action: "gcc" }
      ]
    };
  }

  if (pathLower.includes('supplier')) {
    return {
      greeting: `Good morning! 🌟\nYou have 3 hot leads today.\nWant me to draft follow-up emails?`,
      quickReplies: [
        { label: "Draft follow-ups", action: "draft emails" },
        { label: "Check my pipeline", action: "pipeline" },
        { label: "Market prices", action: "prices" },
        { label: "Go Live tips", action: "live tips" }
      ]
    };
  }

  if (pathLower.includes('buyer')) {
    return {
      greeting: `Hi ${userName}! 👋\n2 new quotes arrived for your RFQs.\nWant me to compare them for you?`,
      quickReplies: [
        { label: "Compare quotes", action: "compare" },
        { label: "Find new suppliers", action: "suppliers" },
        { label: "Track shipments", action: "tracking" },
        { label: "My budget status", action: "budget" }
      ]
    };
  }

  if (pathLower.includes('crm')) {
    return {
      greeting: "📊 Your pipeline looks healthy!\nAlmarai has a 95% closing probability.\nShould I prepare a proforma invoice?",
      quickReplies: [
        { label: "Prepare invoice", action: "invoice" },
        { label: "Schedule follow-up", action: "schedule" },
        { label: "Analyze pipeline", action: "analyze" },
        { label: "Add new lead", action: "new lead" }
      ]
    };
  }

  if (pathLower.includes('pricing')) {
    return {
      greeting: "💡 Not sure which plan fits you?\nTell me about your business and I'll recommend the right plan.",
      quickReplies: [
        { label: "I export products", action: "export" },
        { label: "I import products", action: "import" },
        { label: "Small company", action: "small" },
        { label: "Large enterprise", action: "enterprise" }
      ]
    };
  }

  if (pathLower.includes('live') || pathLower.includes('deal')) {
    return {
      greeting: "🔴 Ready to connect with buyers face-to-face?\nLet me help you set up your live session!",
      quickReplies: [
        { label: "Start Live Session", action: "start live" },
        { label: "How does it work?", action: "how live" },
        { label: "Tips for success", action: "tips" }
      ]
    };
  }

  if (pathLower.includes('logistics') || pathLower.includes('freight')) {
    return {
      greeting: "🚢 Looking for shipping solutions?\nI can help you get quotes from verified freight forwarders.",
      quickReplies: [
        { label: "Get shipping quotes", action: "shipping" },
        { label: "Track shipment", action: "track" },
        { label: "Container types", action: "containers" }
      ]
    };
  }

  return {
    greeting: "Hello! 👋 I'm your Brands Bridge trade assistant. How can I help you today?",
    quickReplies: [
      { label: "Find suppliers", action: "suppliers" },
      { label: "Pricing info", action: "pricing" },
      { label: "Go Live", action: "live" },
      { label: "Shipping help", action: "shipping" }
    ]
  };
};

// ============================================
// AI RESPONSE GENERATOR
// ============================================
const generateAIResponse = (userMessage: string): { text: string; quickReplies?: QuickReply[]; actionButton?: { label: string; action: string } } => {
  const msg = userMessage.toLowerCase();

  // Supplier/Manufacturer keywords
  if (msg.includes('supplier') || msg.includes('manufacturer') || msg.includes('factory')) {
    return {
      text: "I found several verified suppliers on our platform! Here are top options:\n\n🏭 OZMO Confectionery (Turkey)\n   Chocolate & Wafers | 97% Reliability\n\n🏭 Almarai Company (Saudi Arabia)\n   Dairy Products | 98% Reliability\n\n🏭 German Foods GmbH (Germany)\n   Premium FMCG | 95% Reliability\n\nWant to contact any of these directly?",
      actionButton: { label: "View All Suppliers →", action: "view suppliers" },
      quickReplies: [
        { label: "OZMO Confectionery", action: "contact ozmo" },
        { label: "Almarai Company", action: "contact almarai" },
        { label: "More options", action: "more suppliers" }
      ]
    };
  }

  // Pricing keywords
  if (msg.includes('price') || msg.includes('pricing') || msg.includes('cost') || msg.includes('plan') || msg.includes('how much')) {
    return {
      text: "Our pricing plans:\n\n🆓 Starter — Free\n   Basic listing + 5 leads/month\n\n🚀 Growth — $199/month\n   Full CRM + AI Tools + Live Rooms\n\n💎 Enterprise — $499/month\n   Everything + dedicated support\n\nBuyers always access FREE! 🎉",
      actionButton: { label: "See Full Pricing →", action: "pricing" },
      quickReplies: [
        { label: "Compare plans", action: "compare plans" },
        { label: "Start free", action: "free trial" }
      ]
    };
  }

  // Live/Deal Room keywords
  if (msg.includes('live') || msg.includes('deal room') || msg.includes('meeting') || msg.includes('video')) {
    return {
      text: "🔴 Live Deal Rooms let you meet buyers face-to-face virtually!\n\n✓ Real-time video negotiation\n✓ AI-powered buyer matching\n✓ Instant quote generation\n✓ Smart buyer queue management\n\nReady to go live?",
      actionButton: { label: "Start Live Session →", action: "start live" },
      quickReplies: [
        { label: "How it works", action: "how live" },
        { label: "Tips for success", action: "live tips" }
      ]
    };
  }

  // Shipping/Logistics keywords
  if (msg.includes('shipping') || msg.includes('logistics') || msg.includes('freight') || msg.includes('delivery') || msg.includes('transport')) {
    return {
      text: "🚢 Our Logistics Hub connects you with 200+ verified freight forwarders!\n\nGet quotes for:\n• 20ft containers\n• 40ft containers\n• Refrigerated (Reefer)\n• Air freight\n\nAll shipments protected by Escrow!",
      actionButton: { label: "View Logistics Hub →", action: "logistics" },
      quickReplies: [
        { label: "Get a quote", action: "get quote" },
        { label: "Track shipment", action: "track" }
      ]
    };
  }

  // Halal/Certification keywords
  if (msg.includes('halal') || msg.includes('certification') || msg.includes('certificate') || msg.includes('certified') || msg.includes('iso')) {
    return {
      text: "✅ All verified suppliers on our platform can provide:\n\n• Halal Certification\n• ISO 22000\n• FSSC 22000\n• BRC Grade A\n• Organic Certificates\n\nFilter by certification in Expo Hall!",
      actionButton: { label: "Go to Expo Hall →", action: "companies" },
      quickReplies: [
        { label: "Find Halal suppliers", action: "halal" },
        { label: "View all certs", action: "certifications" }
      ]
    };
  }

  // Greeting keywords
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('greetings')) {
    return {
      text: "Hello! 👋 Great to have you here.\nI'm your FMCG trade expert.\n\nI can help you:\n🔍 Find verified suppliers\n💰 Compare pricing plans\n🚢 Arrange logistics\n🔴 Start a Live Deal Room\n📊 Understand your analytics\n\nWhat would you like to explore?",
      quickReplies: [
        { label: "Find suppliers", action: "suppliers" },
        { label: "View pricing", action: "pricing" },
        { label: "Shipping help", action: "shipping" }
      ]
    };
  }

  // Help keywords
  if (msg.includes('help') || msg.includes('support') || msg.includes('assist')) {
    return {
      text: "I'm here to help! Here's what I can assist with:\n\nFor Suppliers:\n→ Managing leads & pipeline\n→ Going Live with buyers\n→ Running email campaigns\n\nFor Buyers:\n→ Finding verified suppliers\n→ Submitting RFQs\n→ Tracking shipments\n\nWhat do you need?",
      quickReplies: [
        { label: "Supplier help", action: "supplier help" },
        { label: "Buyer help", action: "buyer help" },
        { label: "Contact support", action: "contact" }
      ]
    };
  }

  // Contact keywords
  if (msg.includes('contact') || msg.includes('email') || msg.includes('whatsapp') || msg.includes('call')) {
    return {
      text: "You can reach us through:\n\n📧 Email: info@brandsbridge.net\n💬 WhatsApp: +974 XXXX XXXX\n\nOur team is available 24/7 to assist you!",
      actionButton: { label: "Contact Support →", action: "contact" }
    };
  }

  // Buyer related
  if (msg.includes('buyer') || msg.includes('import') || msg.includes('procurement')) {
    return {
      text: "As a buyer, you get FREE access to:\n\n✓ Browse 1000+ verified suppliers\n✓ AI-powered supplier matching\n✓ Submit RFQs\n✓ Compare quotes\n✓ Track shipments\n✓ Negotiate in Live Deal Rooms\n\nHow can I help you find what you need?",
      actionButton: { label: "Browse Suppliers →", action: "companies" },
      quickReplies: [
        { label: "Submit RFQ", action: "rfq" },
        { label: "Find specific product", action: "find" }
      ]
    };
  }

  // Dashboard related
  if (msg.includes('dashboard') || msg.includes('analytics') || msg.includes('report')) {
    return {
      text: "📊 Your dashboard shows:\n\n• Total Pipeline Value\n• Active Leads\n• Conversion Rate\n• AI Predicted Revenue\n\nWould you like me to analyze your performance or help with specific metrics?",
      quickReplies: [
        { label: "Pipeline analysis", action: "analyze pipeline" },
        { label: "Revenue forecast", action: "forecast" }
      ]
    };
  }

  // Default fallback
  return {
    text: "That's a great question! 🤔\n\nI can help you navigate to the right section or connect you with our team for detailed assistance.\n\nWhat would you like to explore?",
    quickReplies: [
      { label: "Browse suppliers", action: "suppliers" },
      { label: "View pricing", action: "pricing" },
      { label: "Contact support", action: "contact" }
    ]
  };
};

// ============================================
// PROACTIVE MESSAGES BY PAGE
// ============================================
const getProactiveMessage = (path: string): string | null => {
  const pathLower = path.toLowerCase();

  if (pathLower === '/' || pathLower === '') {
    return "👋 Need help getting started?";
  }
  if (pathLower.includes('companies')) {
    return "🔍 Tell me what you're looking for!";
  }
  if (pathLower.includes('pricing')) {
    return "💡 Not sure which plan? I can help!";
  }
  if (pathLower.includes('supplier')) {
    return "⚡ You have 3 urgent tasks today!";
  }
  if (pathLower.includes('buyer')) {
    return "📬 You have 2 new quotes!";
  }

  return null;
};

// ============================================
// MAIN COMPONENT
// ============================================
const AIAssistant = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showProactive, setShowProactive] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  // Initialize with context-aware greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const context = getContextMessage(location.pathname, user?.name?.split(' ')[0] || 'there');
      const initialMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        text: context.greeting,
        timestamp: new Date(),
        quickReplies: context.quickReplies.map(qr => qr.label)
      };
      setMessages([initialMessage]);
    }
  }, [isOpen, location.pathname, user, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Proactive suggestion timer
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        const proactive = getProactiveMessage(location.pathname);
        if (proactive) {
          setShowProactive(true);
          setHasNotification(true);
          // Auto-hide after 8 seconds
          setTimeout(() => {
            setShowProactive(false);
          }, 8000);
        }
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    } else {
      setShowProactive(false);
    }
  }, [location.pathname, isOpen]);

  // Handle sending message
  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setHasNotification(false);

    // Simulate AI typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = generateAIResponse(inputValue);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: response.text,
        timestamp: new Date(),
        quickReplies: response.quickReplies?.map(qr => qr.label),
        actionButton: response.actionButton
      };
      setMessages(prev => [...prev, aiMsg]);
      setHasNotification(true);
    }, 800); // 0.8 second typing delay
  };

  // Handle quick reply
  const handleQuickReply = (reply: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: reply,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setHasNotification(false);

    // Simulate AI typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = generateAIResponse(reply);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: response.text,
        timestamp: new Date(),
        quickReplies: response.quickReplies?.map(qr => qr.label),
        actionButton: response.actionButton
      };
      setMessages(prev => [...prev, aiMsg]);
      setHasNotification(true);
    }, 800);
  };

  // Handle action button click
  const handleAction = (action: string) => {
    const actionLower = action.toLowerCase();

    if (actionLower.includes('supplier') || actionLower.includes('ozmo') || actionLower.includes('almarai')) {
      navigate('/companies');
    } else if (actionLower.includes('pricing')) {
      navigate('/pricing');
    } else if (actionLower.includes('live') || actionLower.includes('start live')) {
      navigate('/live-deal-room');
    } else if (actionLower.includes('logistics') || actionLower.includes('shipping') || actionLower.includes('freight')) {
      navigate('/logistics');
    } else if (actionLower.includes('crm')) {
      navigate('/crm');
    } else if (actionLower.includes('contact')) {
      navigate('/contact');
    } else if (actionLower.includes('login')) {
      navigate('/login');
    } else if (actionLower.includes('buyer')) {
      navigate('/buyer/dashboard');
    } else if (actionLower.includes('supplier')) {
      navigate('/supplier/dashboard');
    }

    setIsOpen(false);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <>
      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(11,94,117,0.7); }
          70% { box-shadow: 0 0 0 12px rgba(11,94,117,0); }
          100% { box-shadow: 0 0 0 0 rgba(11,94,117,0); }
        }
        @keyframes bounce-dots {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        .bounce-dot {
          animation: bounce-dots 1.4s infinite ease-in-out both;
        }
        .bounce-dot:nth-child(1) { animation-delay: 0s; }
        .bounce-dot:nth-child(2) { animation-delay: 0.2s; }
        .bounce-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      {/* Proactive Suggestion Bubble */}
      {showProactive && !isOpen && (
        <div
          className="fixed bottom-24 right-6 z-[9998] animate-in slide-in-from-bottom-2 fade-in duration-300"
          style={{ maxWidth: '220px' }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 relative border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setShowProactive(false)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-slate-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-slate-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="text-sm text-slate-700 dark:text-slate-200 font-medium">
              {getProactiveMessage(location.pathname)}
            </div>
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 transform rotate-45" />
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && !isMinimized && (
        <div
          className="fixed bottom-24 right-6 z-[9999] w-[380px] h-[520px] bg-[#111827] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#1F2937] animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0B5E75] to-[#0d6e87] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#0B5E75] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">Brands Bridge AI</span>
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    Online
                  </span>
                </div>
                <div className="text-xs text-teal-200">Your FMCG Trade Expert</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#111827]">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-in fade-in duration-200">
                {msg.type === 'ai' ? (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B5E75] to-[#D4AF37] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-[#1F2937] rounded-tl-xl rounded-tr-xl rounded-br-xl p-3 text-sm text-[#F9FAFB] whitespace-pre-line">
                        {msg.text}
                      </div>
                      {msg.actionButton && (
                        <button
                          onClick={() => handleAction(msg.actionButton!.action)}
                          className="mt-2 w-full py-2 px-3 bg-gradient-to-r from-[#0B5E75] to-[#0d6e87] text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          {msg.actionButton.label}
                        </button>
                      )}
                      {msg.quickReplies && msg.quickReplies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {msg.quickReplies.map((reply, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuickReply(reply)}
                              className="px-3 py-1.5 border border-[#374151] text-[#9CA3AF] text-xs rounded-lg hover:border-[#0B5E75] hover:text-white transition-all"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-slate-500 mt-1">{formatTime(msg.timestamp)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="max-w-[80%]">
                      <div className="bg-[#0B5E75] rounded-tl-xl rounded-tr-xl rounded-bl-xl p-3 text-sm text-white">
                        {msg.text}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 text-right">{formatTime(msg.timestamp)}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B5E75] to-[#D4AF37] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#1F2937] rounded-tl-xl rounded-tr-xl rounded-br-xl p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full bounce-dot" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full bounce-dot" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full bounce-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#1F2937] bg-[#0A0F1E]">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about trade..."
                className="flex-1 px-4 py-2.5 bg-[#1F2937] border border-[#374151] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0B5E75] transition-colors"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2.5 bg-[#0B5E75] hover:bg-[#0d6e87] text-white rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center text-xs text-slate-500 mt-2">
              Powered by <span className="text-[#D4AF37]">Brands Bridge AI Core</span>
            </div>
          </div>
        </div>
      )}

      {/* Minimized State */}
      {isOpen && isMinimized && (
        <div
          className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-[#0B5E75] to-[#D4AF37] rounded-xl px-4 py-2 shadow-lg cursor-pointer hover:shadow-xl transition-all"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">AI Assistant</span>
            <ChevronDown className="w-4 h-4 text-white rotate-180" />
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          {/* Notification badge */}
          {hasNotification && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#0B5E75] to-[#D4AF37] flex items-center justify-center shadow-lg hover:shadow-xl transition-all animate-pulse-glow group"
            title="Ask Brands Bridge AI"
          >
            <Sparkles className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
