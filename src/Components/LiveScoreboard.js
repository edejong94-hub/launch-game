import React, { useState, useEffect } from 'react';
import { calculateTeamScore, getPerformanceCategory } from '../Configs/scoring-configs';
import './LiveScoreboard.css';

const LiveScoreboard = ({ team, mode, isMinimized = false, onToggle }) => {
  const [scoreData, setScoreData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (team) {
      const data = calculateTeamScore(team, mode);
      setScoreData(data);
    }
  }, [team, mode]);

  if (!scoreData) return null;

  const performance = getPerformanceCategory(scoreData.totalScore);

  if (isMinimized) {
    return (
      <div className="live-scoreboard minimized" onClick={onToggle}>
        <div className="mini-score" style={{ color: performance.color }}>
          <span className="mini-label">Score</span>
          <span className="mini-value">{scoreData.totalScore}</span>
        </div>
        <div className="mini-indicator" style={{ background: performance.color }}></div>
      </div>
    );
  }

  return (
    <div className="live-scoreboard expanded">
      <div className="scoreboard-header">
        <div className="scoreboard-title">
          <span className="title-icon">📊</span>
          <span>Current Score</span>
        </div>
        <button className="minimize-btn" onClick={onToggle}>−</button>
      </div>

      <div className="scoreboard-body">
        <div className="current-score-display">
          <div className="score-main" style={{ color: performance.color }}>
            {scoreData.totalScore}
          </div>
          <div className="score-status" style={{ background: performance.color }}>
            {performance.level}
          </div>
        </div>

        <div className="score-components">
          <div className="component-item">
            <span className="component-label">Base Score</span>
            <span className="component-value">{scoreData.baseScore}</span>
          </div>
          {scoreData.bonusPoints > 0 && (
            <div className="component-item bonus">
              <span className="component-label">Bonuses</span>
              <span className="component-value">+{scoreData.bonusPoints}</span>
            </div>
          )}
        </div>

        <button 
          className="details-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '▼ Less' : '▶ More Details'}
        </button>

        {showDetails && (
          <div className="scoreboard-details">
            <div className="metrics-list">
              {Object.entries(scoreData.metricScores).map(([id, metric]) => (
                <div key={id} className="metric-item">
                  <div className="metric-info">
                    <span className="metric-name">{metric.name}</span>
                    <span className="metric-actual">{metric.actualValue}</span>
                  </div>
                  <div className="metric-bar-mini">
                    <div 
                      className="metric-bar-mini-fill"
                      style={{ width: `${metric.rawValue}%` }}
                    ></div>
                  </div>
                  <span className="metric-points">
                    {Math.round(metric.weightedScore)}
                  </span>
                </div>
              ))}
            </div>

            {scoreData.earnedBonuses.length > 0 && (
              <div className="bonuses-list">
                <div className="bonuses-header">Active Bonuses</div>
                {scoreData.earnedBonuses.map((bonus, index) => (
                  <div key={index} className="bonus-item-mini">
                    <span className="bonus-icon">✓</span>
                    <span className="bonus-name-mini">{bonus.name}</span>
                    <span className="bonus-points-mini">+{bonus.points}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveScoreboard;