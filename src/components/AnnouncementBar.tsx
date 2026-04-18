import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import VRWaitlistModal from './VRWaitlistModal';

interface AnnouncementBarProps {
  onDismiss?: () => void;
}

const AnnouncementBar = ({ onDismiss }: AnnouncementBarProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  useEffect(() => {
    // Check localStorage for previous dismissal
    const dismissed = localStorage.getItem('vrAnnouncementDismissed');
    const dismissedTime = localStorage.getItem('vrAnnouncementDismissedTime');

    if (dismissed === 'true' && dismissedTime) {
      const hoursSinceDismiss = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
      if (hoursSinceDismiss < 24) {
        setIsVisible(false);
        return;
      }
    }

    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('vrAnnouncementDismissed', 'true');
    localStorage.setItem('vrAnnouncementDismissedTime', Date.now().toString());
    if (onDismiss) onDismiss();
  };

  const handleJoinWaitlist = () => {
    setShowWaitlistModal(true);
  };

  const scrollToVRSection = () => {
    const vrSection = document.getElementById('vr-section');
    if (vrSection) {
      vrSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleJoinWaitlist();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="h-11 flex items-center justify-center relative"
        style={{
          background: 'linear-gradient(90deg, #071120, #1E1B4B, #312E81, #1E1B4B, #071120)',
          borderBottom: '1px solid rgba(123, 97, 255, 0.2)'
        }}
      >
        <div className="flex items-center gap-4 text-white text-sm">
          <span>🎮</span>
          <span className="font-medium">
            Brands Bridge VR — Our 2027 Vision
          </span>
          <span style={{ color: '#A78BFA' }}>·</span>
          <span className="hidden sm:inline" style={{ color: '#D4AF37' }}>
            Join 500+ companies on waitlist
          </span>
          <button
            onClick={scrollToVRSection}
            className="font-semibold hover:underline underline-offset-2 transition-colors"
            style={{ color: '#67E8F9' }}
          >
            →
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 p-1 rounded transition-colors hover:bg-white/10"
          aria-label="Dismiss announcement"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Waitlist Modal */}
      <VRWaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </>
  );
};

export default AnnouncementBar;
