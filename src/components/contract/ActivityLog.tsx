import React, { useEffect, useState, useRef } from 'react';
import { ContractEvent } from '../../contexts/ContractContext';

interface ActivityLogProps {
  events: ContractEvent[];
  currentPartyId: string;
  isLive?: boolean;
  showFilters?: boolean;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({
  events,
  currentPartyId,
  isLive = true,
  showFilters = true
}) => {
  const [newEventId, setNewEventId] = useState<string | null>(null);
  const [filterByParty, setFilterByParty] = useState<string>('all');
  const [filterByType, setFilterByType] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Highlight new events
  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[events.length - 1];
      setNewEventId(latestEvent.id);
      const timer = setTimeout(() => setNewEventId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [events]);

  // Auto-scroll to top (newest) when new events arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events, autoScroll]);

  const getEventIcon = (type: ContractEvent['type']) => {
    switch (type) {
      case 'created':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'viewed':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        );
      case 'edited':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case 'signed':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'status_change':
        return (
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
        );
      case 'message':
        return (
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case 'finalized':
        return (
          <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getEventColor = (type: ContractEvent['type']) => {
    switch (type) {
      case 'created': return 'border-blue-500';
      case 'viewed': return 'border-purple-500';
      case 'edited': return 'border-amber-500';
      case 'signed': return 'border-emerald-500';
      case 'status_change': return 'border-cyan-500';
      case 'message': return 'border-[#D4AF37]';
      case 'finalized': return 'border-pink-500';
      default: return 'border-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    // Format with timezone
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getPartyBadge = (partyId: string) => {
    const colors: Record<string, string> = {
      'buyer-001': 'bg-purple-500/20 text-purple-400',
      'supplier-001': 'bg-emerald-500/20 text-emerald-400',
      'logistics-001': 'bg-orange-500/20 text-orange-400',
      'System': 'bg-gray-500/20 text-gray-400'
    };
    return colors[partyId] || 'bg-gray-500/20 text-gray-400';
  };

  const getPartyLabel = (partyId: string) => {
    if (partyId === 'System') return 'System';
    if (partyId === currentPartyId) return 'You';
    if (partyId === 'buyer-001') return 'Buyer';
    if (partyId === 'supplier-001') return 'Supplier';
    if (partyId === 'logistics-001') return 'Logistics';
    return partyId;
  };

  const getPartyName = (partyId: string) => {
    const names: Record<string, string> = {
      'buyer-001': 'Ahmed Al Rashid',
      'supplier-001': 'Mehmet Yilmaz',
      'logistics-001': 'Sarah Khan',
      'System': 'System'
    };
    return names[partyId] || partyId;
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    if (filterByParty !== 'all' && event.party !== filterByParty && !(filterByParty === 'you' && event.party === currentPartyId)) {
      return false;
    }
    if (filterByType !== 'all' && event.type !== filterByType) {
      return false;
    }
    return true;
  }).slice().reverse();

  const eventTypes = ['all', 'created', 'viewed', 'edited', 'signed', 'status_change', 'message', 'finalized'];

  return (
    <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#1E293B]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Activity Timeline
          </h3>

          {/* Live Indicator */}
          {isLive && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-xs text-emerald-400 font-medium">Live</span>
            </div>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex gap-2">
            <select
              value={filterByParty}
              onChange={(e) => setFilterByParty(e.target.value)}
              className="flex-1 px-2 py-1.5 bg-[#050B18] border border-[#1E293B] rounded-lg text-xs text-gray-300 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Parties</option>
              <option value="you">You</option>
              <option value="buyer-001">Buyer</option>
              <option value="supplier-001">Supplier</option>
              <option value="logistics-001">Logistics</option>
              <option value="System">System</option>
            </select>
            <select
              value={filterByType}
              onChange={(e) => setFilterByType(e.target.value)}
              className="flex-1 px-2 py-1.5 bg-[#050B18] border border-[#1E293B] rounded-lg text-xs text-gray-300 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Types</option>
              <option value="created">Created</option>
              <option value="viewed">Viewed</option>
              <option value="edited">Edited</option>
              <option value="signed">Signed</option>
              <option value="status_change">Status</option>
              <option value="finalized">Finalized</option>
              <option value="message">Messages</option>
            </select>
          </div>
        )}
      </div>

      {/* Events List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4"
        onScroll={(e) => {
          const { scrollTop } = e.currentTarget;
          setAutoScroll(scrollTop < 50);
        }}
      >
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37] via-[#1E293B] to-transparent" />

          {/* Events */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#1E293B] flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No events match your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`relative flex gap-3 transition-all duration-500 ${
                    newEventId === event.id ? 'animate-pulse' : ''
                  }`}
                >
                  {/* Event Dot */}
                  <div className={`relative z-10 ${getEventColor(event.type)} border-2 rounded-full bg-[#0C1628] p-0.5`}>
                    {getEventIcon(event.type)}
                  </div>

                  {/* Event Content */}
                  <div className={`flex-1 min-w-0 pb-4 ${
                    index === 0 && newEventId === event.id ? 'bg-[#D4AF37]/5 -mx-2 px-2 py-2 rounded-lg' : ''
                  }`}>
                    <p className={`text-sm ${
                      event.party === currentPartyId ? 'text-[#D4AF37] font-medium' : 'text-gray-300'
                    }`}>
                      {event.message}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPartyBadge(event.party)}`}>
                        {getPartyLabel(event.party)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(event.timestamp)}
                      </span>

                      {index === 0 && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                          Latest
                        </span>
                      )}
                    </div>

                    {/* IP Address (simulated) */}
                    {event.type === 'signed' && (
                      <p className="text-xs text-gray-600 mt-1">
                        IP: 192.168.1.{Math.floor(Math.random() * 255)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-[#1E293B] bg-[#050B18]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {filteredEvents.length} of {events.length} events
            </span>
            {filterByParty !== 'all' || filterByType !== 'all' ? (
              <button
                onClick={() => { setFilterByParty('all'); setFilterByType('all'); }}
                className="text-xs text-[#D4AF37] hover:text-[#B8860B] transition-colors"
              >
                Clear filters
              </button>
            ) : null}
          </div>
          <button
            onClick={() => {
              setAutoScroll(!autoScroll);
              if (!autoScroll && scrollRef.current) {
                scrollRef.current.scrollTop = 0;
              }
            }}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              autoScroll
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {autoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};
