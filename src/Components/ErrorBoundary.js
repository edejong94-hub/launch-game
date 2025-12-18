import React from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔴 ErrorBoundary caught an error:', error, errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to external error tracking service if configured
    // Example: Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Optionally reload the page for a fresh start
    if (this.state.errorCount > 2) {
      window.location.reload();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <span style={styles.icon}>⚠️</span>
            </div>

            <h1 style={styles.title}>Oops! Something went wrong</h1>

            <p style={styles.message}>
              The game encountered an unexpected error. Don't worry, your progress has been saved locally.
            </p>

            {this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details (for debugging)</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={styles.actions}>
              <button onClick={this.handleReset} style={styles.primaryButton}>
                Try Again
              </button>
              <button onClick={this.handleReload} style={styles.secondaryButton}>
                Reload Page
              </button>
            </div>

            {this.state.errorCount > 2 && (
              <p style={styles.warning}>
                ⚠️ Multiple errors detected. Reloading is recommended.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: '20px',
  },
  icon: {
    fontSize: '64px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '16px',
  },
  message: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  details: {
    marginTop: '20px',
    marginBottom: '20px',
    textAlign: 'left',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px',
  },
  summary: {
    cursor: 'pointer',
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: '8px',
  },
  errorText: {
    fontSize: '12px',
    color: '#ef4444',
    overflow: 'auto',
    maxHeight: '200px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '24px',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  warning: {
    marginTop: '20px',
    color: '#dc2626',
    fontSize: '14px',
    fontWeight: '600',
  },
};

export default ErrorBoundary;
