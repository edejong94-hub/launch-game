import React from 'react';
import './HourTracker.css';
import { RESEARCH_CONFIG } from '../Configs/research-config';

const FOUNDER_MULTIPLIERS = [1.0, 0.9, 0.7, 0.5, 0.3];

const getTeamHours = (employmentStatus, founderCount) => {
  const scale = RESEARCH_CONFIG.founderHoursScale;
  const base = scale.baseHours[employmentStatus] || 200;
  let total = 0;
  for (let i = 0; i < Math.min(founderCount, 5); i++) {
    total += base * FOUNDER_MULTIPLIERS[i];
  }
  return Math.round(total);
};

const HourTracker = ({ employmentStatus, founderCount, hoursUsed }) => {
  const statusConfig = RESEARCH_CONFIG.employmentStatus[employmentStatus];

  if (!statusConfig) return null;

  const totalAvailable = getTeamHours(employmentStatus, founderCount);
  const hoursRemaining = totalAvailable - hoursUsed;
  const percentUsed = Math.min((hoursUsed / totalAvailable) * 100, 100);
  const isOverbudget = hoursUsed > totalAvailable;
  const isNearLimit = percentUsed > 80 && !isOverbudget;
  const showDiminishing = founderCount > 1;

  const base = RESEARCH_CONFIG.founderHoursScale.baseHours[employmentStatus] || 200;
  const founderBreakdown = Array.from({ length: Math.min(founderCount, 5) }, (_, i) => ({
    index: i + 1,
    hours: Math.round(base * FOUNDER_MULTIPLIERS[i]),
    pct: Math.round(FOUNDER_MULTIPLIERS[i] * 100),
  }));

  return (
    <div className="hour-tracker">
      <div className="hour-header">
        <h3>Work Hours Budget</h3>
        <div className="hour-summary">
          <span className={`hour-count ${isOverbudget ? 'over' : isNearLimit ? 'warning' : ''}`}>
            {hoursUsed} / {totalAvailable} hours
          </span>
        </div>
      </div>

      <div className="hour-progress-bar">
        <div
          className={`hour-progress-fill ${isOverbudget ? 'overflow' : isNearLimit ? 'warning' : ''}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
        {isOverbudget && (
          <div
            className="hour-overflow-indicator"
            style={{ width: `${Math.min(((hoursUsed - totalAvailable) / totalAvailable) * 100, 100)}%` }}
          />
        )}
      </div>

      <div className="hour-stats">
        <div className="hour-stat">
          <span className="hour-stat-label">Available</span>
          <span className="hour-stat-value">{totalAvailable}h</span>
          <span className="hour-stat-detail">{founderCount} founder{founderCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="hour-stat">
          <span className="hour-stat-label">Used</span>
          <span className="hour-stat-value">{hoursUsed}h</span>
          <span className="hour-stat-detail">{percentUsed.toFixed(0)}% of budget</span>
        </div>
        <div className="hour-stat">
          <span className="hour-stat-label">{isOverbudget ? 'Over by' : 'Remaining'}</span>
          <span className={`hour-stat-value ${isOverbudget ? 'negative' : 'positive'}`}>
            {isOverbudget ? `+${Math.abs(hoursRemaining)}h` : `${hoursRemaining}h`}
          </span>
          <span className="hour-stat-detail">
            {isOverbudget ? 'Overcommitted!' : `${((hoursRemaining / totalAvailable) * 100).toFixed(0)}% left`}
          </span>
        </div>
      </div>

      {isOverbudget && (
        <div className="hour-warning-box">
          <div className="warning-icon">⚠️</div>
          <div className="warning-text">
            <strong>Overcommitted!</strong> You've scheduled more hours than available this round.
            This may reduce quality or require overtime.
          </div>
        </div>
      )}

      {isNearLimit && !isOverbudget && (
        <div className="hour-caution-box">
          <div className="caution-icon">💡</div>
          <div className="caution-text">
            <strong>Approaching limit</strong> - You're using {percentUsed.toFixed(0)}% of available hours.
          </div>
        </div>
      )}

      {showDiminishing && (
        <div className="hour-diminishing">
          <div className="hour-diminishing-title">Coordination overhead</div>
          <div className="hour-diminishing-rows">
            {founderBreakdown.map(({ index, hours, pct }) => (
              <div key={index} className="hour-diminishing-row">
                <span className="hour-diminishing-label">Founder {index}</span>
                <span className="hour-diminishing-bar-wrap">
                  <span
                    className="hour-diminishing-bar"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="hour-diminishing-value">{hours}h{index > 1 ? ` (${pct}%)` : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="hour-info">
        <p className="hour-info-text">
          <strong>Employment Status:</strong> {statusConfig.name} ({statusConfig.icon})
        </p>
        <p className="hour-info-detail">
          Hours represent your team's total work capacity this round. Larger teams have coordination overhead that reduces per-founder efficiency.
        </p>
      </div>
    </div>
  );
};

export default HourTracker;
