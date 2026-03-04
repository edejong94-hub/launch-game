import React from 'react';
import './ResourceTracker.css';
import StickerAllowance from './StickerAllowance';
import HourTracker from './HourTracker';

const ResourceTracker = ({ employmentStatus, founderCount, hoursUsed }) => {
  return (
    <div className="resource-tracker">
      <div className="resource-tracker-header">
        <h2>Resource Planning</h2>
        <p className="resource-tracker-subtitle">
          Track your team's capacity for expert meetings (stickers) and work hours this round
        </p>
      </div>

      <div className="resource-tracker-grid">
        <div className="resource-section">
          <StickerAllowance employmentStatus={employmentStatus} />
        </div>
        <div className="resource-section">
          <HourTracker
            employmentStatus={employmentStatus}
            founderCount={founderCount}
            hoursUsed={hoursUsed}
          />
        </div>
      </div>

      <div className="resource-tracker-summary">
        <div className="summary-card">
          <div className="summary-header">
            <span className="summary-icon">🎫</span>
            <strong>Stickers</strong>
          </div>
          <p className="summary-description">
            Limit your <strong>expert meetings</strong>.
            Place on signup poster to claim slots.
          </p>
          <div className="summary-detail">
            Intensive activities = 2 stickers<br/>
            Standard meetings = 1 sticker
          </div>
        </div>

        <div className="summary-divider">
          <span>+</span>
        </div>

        <div className="summary-card">
          <div className="summary-header">
            <span className="summary-icon">⏱️</span>
            <strong>Hours</strong>
          </div>
          <p className="summary-description">
            Limit your <strong>total work</strong>.
            All activities cost hours.
          </p>
          <div className="summary-detail">
            Internal work only needs hours<br/>
            (prototyping, hiring, agreements)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceTracker;
