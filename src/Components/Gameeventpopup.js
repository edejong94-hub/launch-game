import React, { useState, useEffect } from 'react';

const GameEventPopup = ({ event, onDismiss, onAction }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const getSeverityColors = (severity) => {
    switch (severity) {
      case 'success':
        return { bg: '#052e16', border: '#22c55e', text: '#22c55e', glow: 'rgba(34, 197, 94, 0.3)' };
      case 'warning':
        return { bg: '#451a03', border: '#f59e0b', text: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' };
      case 'danger':
        return { bg: '#450a0a', border: '#ef4444', text: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' };
      case 'info':
      default:
        return { bg: '#1e1b4b', border: '#6366f1', text: '#a5b4fc', glow: 'rgba(99, 102, 241, 0.3)' };
    }
  };

  const colors = getSeverityColors(event.severity);

  return (
    <div 
      className={`event-overlay ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}
      onClick={handleDismiss}
    >
      <div 
        className="event-popup"
        style={{ 
          borderColor: colors.border,
          boxShadow: `0 0 60px ${colors.glow}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated background */}
        <div className="event-bg-effect" style={{ background: colors.bg }} />
        
        {/* Content */}
        <div className="event-content">
          {/* Title */}
          <h2 className="event-title" style={{ color: colors.text }}>
            {event.title}
          </h2>

          {/* Message */}
          <p className="event-message">
            {event.message}
          </p>

          {/* Tips or Consequences */}
          {event.tips && event.tips.length > 0 && (
            <div className="event-tips">
              <h4>💡 Tips</h4>
              <ul>
                {event.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {event.consequences && event.consequences.length > 0 && (
            <div className="event-consequences">
              <h4>📋 What this means</h4>
              <ul>
                {event.consequences.map((consequence, index) => (
                  <li key={index}>{consequence}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="event-actions">
            {event.actions ? (
              event.actions.map((action, index) => (
                <button
                  key={index}
                  className={`event-btn ${action.primary ? 'primary' : 'secondary'}`}
                  style={action.primary ? { backgroundColor: colors.border } : {}}
                  onClick={() => {
                    if (action.handler) onAction(action.handler);
                    handleDismiss();
                  }}
                >
                  {action.label}
                </button>
              ))
            ) : (
              <button
                className="event-btn primary"
                style={{ backgroundColor: colors.border }}
                onClick={handleDismiss}
              >
                {event.severity === 'success' ? 'Excellent!' : 
                 event.severity === 'warning' ? 'I understand' :
                 event.severity === 'danger' ? 'Got it!' : 'Continue'}
              </button>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="event-decoration top-left" style={{ backgroundColor: colors.border }} />
        <div className="event-decoration top-right" style={{ backgroundColor: colors.border }} />
        <div className="event-decoration bottom-left" style={{ backgroundColor: colors.border }} />
        <div className="event-decoration bottom-right" style={{ backgroundColor: colors.border }} />
      </div>

      <style>{`
        .event-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.3s ease;
          padding: 1rem;
        }

        .event-overlay.visible {
          opacity: 1;
        }

        .event-overlay.exiting {
          opacity: 0;
        }

        .event-popup {
          position: relative;
          max-width: 500px;
          width: 100%;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 20px;
          border: 2px solid;
          overflow: hidden;
          transform: scale(0.9) translateY(20px);
          transition: transform 0.3s ease;
        }

        .event-overlay.visible .event-popup {
          transform: scale(1) translateY(0);
        }

        .event-overlay.exiting .event-popup {
          transform: scale(0.9) translateY(20px);
        }

        .event-bg-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 120px;
          opacity: 0.5;
        }

        .event-content {
          position: relative;
          padding: 2rem;
          z-index: 1;
        }

        .event-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          text-align: center;
        }

        .event-message {
          color: #e2e8f0;
          font-size: 1rem;
          line-height: 1.6;
          text-align: center;
          margin: 0 0 1.5rem 0;
        }

        .event-tips,
        .event-consequences {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .event-tips h4,
        .event-consequences h4 {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .event-tips ul,
        .event-consequences ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .event-tips li,
        .event-consequences li {
          padding: 0.375rem 0;
          padding-left: 1.25rem;
          position: relative;
          color: #cbd5e1;
          font-size: 0.9375rem;
        }

        .event-tips li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: #6366f1;
        }

        .event-consequences li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #f59e0b;
        }

        .event-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .event-btn {
          padding: 0.75rem 2rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          border: none;
        }

        .event-btn.primary {
          color: white;
        }

        .event-btn.primary:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        .event-btn.secondary {
          background: rgba(100, 116, 139, 0.3);
          color: #94a3b8;
          border: 1px solid rgba(100, 116, 139, 0.3);
        }

        .event-btn.secondary:hover {
          background: rgba(100, 116, 139, 0.4);
          color: #e2e8f0;
        }

        .event-decoration {
          position: absolute;
          width: 40px;
          height: 40px;
          opacity: 0.3;
        }

        .event-decoration.top-left {
          top: -20px;
          left: -20px;
          border-radius: 50%;
        }

        .event-decoration.top-right {
          top: -20px;
          right: -20px;
          border-radius: 50%;
        }

        .event-decoration.bottom-left {
          bottom: -20px;
          left: -20px;
          border-radius: 50%;
        }

        .event-decoration.bottom-right {
          bottom: -20px;
          right: -20px;
          border-radius: 50%;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        .event-decoration {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Helper function to check if an event should trigger
export const checkEventTrigger = (eventConfig, context) => {
  const { trigger, round, activity, metric, threshold, comparison, condition } = eventConfig;

  switch (trigger) {
    case 'roundStart':
      return context.currentRound === round && context.isRoundStart;
    
    case 'roundEnd':
      if (context.currentRound !== round) return false;
      if (condition) {
        // Parse simple conditions like "validations < 1"
        const match = condition.match(/(\w+)\s*([<>=]+)\s*(\d+)/);
        if (match) {
          const [, field, op, value] = match;
          const actualValue = context[field] || 0;
          const targetValue = parseInt(value);
          if (op === '<' && actualValue >= targetValue) return false;
          if (op === '>' && actualValue <= targetValue) return false;
          if (op === '=' && actualValue !== targetValue) return false;
        }
      }
      return true;
    
    case 'activity':
      return context.completedActivity === activity;
    
    case 'metric':
      const value = context[metric] || 0;
      if (comparison === 'below') return value < threshold;
      if (comparison === 'above') return value > threshold;
      return false;
    
    default:
      return false;
  }
};

export default GameEventPopup;