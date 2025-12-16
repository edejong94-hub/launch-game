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
        <div className="summary-icon">📊</div>
        <div className="summary-content">
          <h4>How to use this information</h4>
          <ul>
            <li><strong>Stickers</strong> are physical tokens you place on activities that require expert meetings</li>
            <li><strong>Hours</strong> represent your team's total work capacity - track this digitally in the app</li>
            <li>Both constraints are real - plan carefully to maximize your progress each round</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResourceTracker;
