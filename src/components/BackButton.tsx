import { useNavigate } from 'react-router-dom';

const BackButton = ({
  label = 'Back',
  to = '/'
}: {
  label?: string;
  to?: string;
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid #162438',
        borderRadius: '10px',
        color: '#94A3B8',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: '500',
        padding: '8px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '24px'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = '#D4AF37';
        e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)';
        e.currentTarget.style.background = 'rgba(212,175,55,0.06)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = '#94A3B8';
        e.currentTarget.style.borderColor = '#162438';
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
      }}
    >
      ← {label}
    </button>
  );
};

export default BackButton;
