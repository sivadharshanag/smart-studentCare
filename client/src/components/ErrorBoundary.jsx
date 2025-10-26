import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>⚠️ Something went wrong</h1>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '30px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            maxWidth: '800px',
            textAlign: 'left'
          }}>
            <h2>Error Details:</h2>
            <pre style={{ 
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '15px',
              borderRadius: '10px',
              overflow: 'auto',
              fontSize: '0.9rem',
              marginBottom: '20px'
            }}>
              {this.state.error && this.state.error.toString()}
            </pre>
            
            <h3>Stack Trace:</h3>
            <pre style={{ 
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '15px',
              borderRadius: '10px',
              overflow: 'auto',
              fontSize: '0.8rem',
              maxHeight: '300px'
            }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>

          <div style={{ marginTop: '30px' }}>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid white',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '1rem',
                cursor: 'pointer',
                marginRight: '15px'
              }}
            >
              🔄 Reload Page
            </button>
            
            <button 
              onClick={() => window.location.href = '/home'}
              style={{
                background: 'white',
                color: '#dc3545',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🏠 Go Home
            </button>
          </div>

          <div style={{
            marginTop: '30px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3>🛠️ Troubleshooting Tips:</h3>
            <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
              <li>Check browser console for additional error details</li>
              <li>Ensure all dependencies are properly installed</li>
              <li>Try refreshing the page or clearing browser cache</li>
              <li>Check network connection for external resources</li>
            </ul>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
