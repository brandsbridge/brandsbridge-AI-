import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: '#0A0F1E',
      borderTop: '1px solid #1F2937',
      padding: '40px 24px 24px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Simple Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* Brand */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0A0F1E',
                fontWeight: 'bold',
                fontSize: '12px'
              }}>BB</div>
              <span style={{ color: '#F9FAFB', fontWeight: '700', fontSize: '16px' }}>
                Brands Bridge <span style={{ color: '#D4AF37' }}>AI</span>
              </span>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
              The Global FMCG Trade Operating System.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ color: '#F9FAFB', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Companies', 'Categories', 'Market', 'Pricing'].map(item => (
                <li key={item} style={{ marginBottom: '8px' }}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    style={{ color: '#6B7280', fontSize: '14px', textDecoration: 'none' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Companies */}
          <div>
            <h4 style={{ color: '#F9FAFB', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>For Companies</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Supplier Registration', 'Buyer Access', 'Freight Provider'].map(item => (
                <li key={item} style={{ marginBottom: '8px' }}>
                  <Link
                    to="/register"
                    style={{ color: '#6B7280', fontSize: '14px', textDecoration: 'none' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: '#F9FAFB', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { name: 'About', path: '/about' },
                { name: 'How It Works', path: '/how-it-works' },
                { name: 'Contact', path: '/contact' }
              ].map(item => (
                <li key={item.name} style={{ marginBottom: '8px' }}>
                  <Link
                    to={item.path}
                    style={{ color: '#6B7280', fontSize: '14px', textDecoration: 'none' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1F2937',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>
            © {currentYear} Brands Bridge AI. All rights reserved. Qatar
          </p>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>
            info@brandsbridge.net
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
