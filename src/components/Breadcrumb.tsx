import { useNavigate } from 'react-router-dom';

const Breadcrumb = ({
  items
}: {
  items: { label: string; to?: string }[]
}) => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '24px',
      fontSize: '13px',
      fontFamily: 'Inter, sans-serif'
    }}>
      {items.map((item, index) => (
        <span key={index} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {index > 0 && (
            <span style={{
              color: '#475569'
            }}>›</span>
          )}
          {item.to ? (
            <span
              onClick={() =>
                navigate(item.to!)}
              style={{
                color: '#94A3B8',
                cursor: 'pointer',
                transition: '0.2s'
              }}
              onMouseEnter={e =>
                e.currentTarget.style
                  .color = '#D4AF37'}
              onMouseLeave={e =>
                e.currentTarget.style
                  .color = '#94A3B8'}
            >
              {item.label}
            </span>
          ) : (
            <span style={{
              color: '#F8FAFC',
              fontWeight: '500'
            }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
