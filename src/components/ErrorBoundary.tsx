import React, { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State {
  hasError: boolean;
  error: any;
  errorInfo: any;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: any, info: any) {
    this.setState({ error, errorInfo: info });
    console.error('CRASH:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#0A0F1E',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#D4AF37', fontSize: '24px' }}>
            Something went wrong
          </h2>
          <pre style={{
            color: '#EF4444',
            marginTop: '16px',
            background: '#111827',
            padding: '16px',
            borderRadius: '8px',
            maxWidth: '900px',
            width: '100%',
            overflow: 'auto',
            textAlign: 'left',
            fontSize: '11px',
            whiteSpace: 'pre-wrap',
            maxHeight: '400px'
          }}>
            {'ERROR: '}
            {this.state.error?.toString()}
            {'\n\n'}
            {'STACK:\n'}
            {this.state.error?.stack}
            {'\n\n'}
            {'COMPONENT STACK:\n'}
            {this.state.errorInfo?.componentStack}
          </pre>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                background: '#0B5E75',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Home
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                background: '#374151',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
