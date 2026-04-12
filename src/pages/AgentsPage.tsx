import { useState } from 'react';
import { Bot, ShoppingCart, Store, Sparkles, TrendingUp, MessageSquare, Users, BarChart3, Bell, CheckCircle, Clock, ArrowRight, Zap } from 'lucide-react';
import { agentDefinitions, platformStats } from '../data/mockData';
import AgentChat from '../components/AgentChat';
import type { AgentType } from '../data/mockData';

export default function AgentsPage() {
  const [activeAgent, setActiveAgent] = useState<AgentType | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const agentIcons = {
    buyer: ShoppingCart,
    seller: Store,
    matchmaker: Sparkles,
    'market-watch': TrendingUp
  };

  const agentStats = {
    buyer: { conversations: 2340, satisfaction: '94%' },
    seller: { inquiries: 890, quotations: 456 },
    matchmaker: { matches: 890, successRate: '78%' },
    'market-watch': { alerts: 1234, auctions: 45 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-ivory to-luxury-cream">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand via-luxury-chocolate to-brand py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-luxury-gold rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-luxury-gold rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-gold/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-luxury-gold" />
              <span className="text-sm font-medium text-luxury-gold">AI-Powered Trade Assistants</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Meet Your <span className="text-gold-gradient">AI Trade Team</span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Four intelligent agents working 24/7 to find suppliers, manage inquiries,
              create perfect matches, and monitor markets. Like having a full trade
              department that never sleeps.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold">{platformStats.agentConversations.toLocaleString()}+</div>
                <div className="text-sm text-white/60">Conversations Handled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold">{platformStats.matchesMade}+</div>
                <div className="text-sm text-white/60">Successful Matches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold">8</div>
                <div className="text-sm text-white/60">Languages Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold">24/7</div>
                <div className="text-sm text-white/60">Always Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-20 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {Object.entries(agentDefinitions).map(([key, agent]) => {
              const AgentIcon = agentIcons[key as AgentType];
              const stats = agentStats[key as AgentType];
              const isActive = activeAgent === key;

              return (
                <div
                  key={agent.id}
                  className={`glass-card p-8 transition-all duration-300 ${
                    isActive ? 'ring-2 ring-luxury-gold shadow-gold' : 'hover:shadow-gold'
                  }`}
                >
                  {/* Agent Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: agent.color }}
                    >
                      <AgentIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-bold text-brand">{agent.name}</h3>
                      <p className="text-sm text-brand/60">{agent.title}</p>
                    </div>
                    <div className="status-online" />
                  </div>

                  {/* Description */}
                  <p className="text-brand/70 mb-6">{agent.description}</p>

                  {/* Capabilities */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-brand mb-3">Capabilities</h4>
                    <div className="space-y-2">
                      {agent.capabilities.slice(0, 4).map((cap) => (
                        <div key={cap.id} className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${cap.phase === 'mvp' ? 'text-emerald-500' : 'text-brand/30'}`} />
                          <span className={`text-sm ${cap.phase === 'mvp' ? 'text-brand' : 'text-brand/50'}`}>
                            {cap.name}
                          </span>
                          {cap.phase === 'advanced' && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-luxury-gold/20 text-luxury-gold rounded">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-6 p-4 bg-luxury-cream/50 rounded-xl">
                    {Object.entries(stats).map(([statKey, value]) => (
                      <div key={statKey} className="text-center flex-1">
                        <div className="text-lg font-bold text-brand">{value}</div>
                        <div className="text-xs text-brand/50 capitalize">{statKey.replace(/([A-Z])/g, ' $1')}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      setActiveAgent(key as AgentType);
                      setIsMinimized(false);
                    }}
                    className="w-full btn-gold flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat with {agent.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Phase Comparison */}
      <section className="section-brown">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Platform Roadmap
            </h2>
            <p className="text-lg text-white/70">
              See what's available now and what's coming next
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Phase 1 - MVP */}
            <div className="glass-card-dark p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Phase 1 — MVP</h3>
                  <p className="text-sm text-white/60">Available Now</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  'Smart supplier search & filtering',
                  'Professional inquiry messaging',
                  'Meeting scheduling with suppliers',
                  'Inquiry management for sellers',
                  'Instant quotation generation',
                  'Multi-language auto-response',
                  'Buyer-seller matching',
                  'Real-time commodity prices',
                  'Price alerts & notifications',
                  'Cargo auction monitoring'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phase 2 - Advanced */}
            <div className="glass-card-dark p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-luxury-gold flex items-center justify-center">
                  <Clock className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Phase 2 — Advanced</h3>
                  <p className="text-sm text-white/60">Coming Q2 2024</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  'AI-powered price negotiation',
                  'Supplier comparison reports',
                  'Product availability alerts',
                  'Lead scoring & prioritization',
                  'Automated follow-up sequences',
                  'Performance analytics dashboard',
                  'Compatibility scoring algorithm',
                  'Self-learning match improvement',
                  'AI price trend forecasting',
                  'Regional arbitrage detection',
                  'Weekly market intelligence reports'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-white/50">
                    <Clock className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand mb-4">
              How Our AI Agents Work
            </h2>
            <p className="text-lg text-brand/70">
              Your intelligent trade assistants, working like real employees
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: MessageSquare,
                title: 'Natural Conversation',
                description: 'Just type what you need in your language. Our agents understand context and intent.'
              },
              {
                icon: Users,
                title: 'Human-Like Responses',
                description: 'Agents respond like real trade professionals, not robots. No technical jargon.'
              },
              {
                icon: BarChart3,
                title: 'Data-Driven Actions',
                description: 'Every recommendation is backed by real data from 2,450+ verified companies.'
              },
              {
                icon: Bell,
                title: 'Proactive Alerts',
                description: 'Get notified about opportunities without asking. Agents work in the background.'
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-luxury-gold to-luxury-bronze flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-brand mb-2">{item.title}</h3>
                <p className="text-sm text-brand/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-luxury-gold via-luxury-bronze to-luxury-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand mb-4">
            Ready to Meet Your AI Trade Team?
          </h2>
          <p className="text-lg text-brand/80 mb-8 max-w-2xl mx-auto">
            Start a conversation with any agent now. It's free to try and takes just seconds to see the power of AI-assisted trade.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => { setActiveAgent('buyer'); setIsMinimized(false); }}
              className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Find Suppliers
            </button>
            <button
              onClick={() => { setActiveAgent('seller'); setIsMinimized(false); }}
              className="px-6 py-3 bg-white text-brand font-semibold rounded-xl hover:bg-luxury-ivory transition-colors flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              Manage Inquiries
            </button>
          </div>
        </div>
      </section>

      {/* Agent Chat Modal */}
      {activeAgent && (
        <AgentChat
          agentType={activeAgent}
          isOpen={true}
          onClose={() => setActiveAgent(null)}
          isMinimized={isMinimized}
          onToggleMinimize={() => setIsMinimized(!isMinimized)}
        />
      )}
    </div>
  );
}
