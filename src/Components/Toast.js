import React, { useState, useEffect } from 'react';

/**
 * Toast notification component for non-blocking error/success messages
 */
const Toast = ({ message, type = 'error', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'error':
      default:
        return '❌';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      case 'error':
      default:
        return '#ef4444';
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      style={{
        ...styles.container,
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translateY(-20px)' : 'translateY(0)',
      }}
    >
      <div style={{ ...styles.toast, borderLeftColor: getColor() }}>
        <span style={styles.icon} aria-hidden="true">{getIcon()}</span>
        <span style={styles.message}>{message}</span>
        <button onClick={handleClose} style={styles.closeButton} aria-label="Close notification">
          ×
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    transition: 'all 0.3s ease',
  },
  toast: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '16px',
    minWidth: '300px',
    maxWidth: '500px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderLeft: '4px solid',
  },
  icon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  message: {
    flex: 1,
    fontSize: '14px',
    color: '#1f2937',
    lineHeight: '1.5',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
};

/**
 * Toast Manager Hook
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'error', duration = 5000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return {
    showToast,
    ToastContainer,
    success: (msg, duration) => showToast(msg, 'success', duration),
    error: (msg, duration) => showToast(msg, 'error', duration),
    warning: (msg, duration) => showToast(msg, 'warning', duration),
    info: (msg, duration) => showToast(msg, 'info', duration),
  };
};

export default Toast;
