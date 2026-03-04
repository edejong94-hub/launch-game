import React, { useState, useEffect } from 'react';
import { calculateTeamScore, getPerformanceCategory } from '../Configs/scoring-configs';
import './RoundScoring.css';

const RoundScoring = ({ team, mode, currentRound, onClose }) => {
  const [scoreData, setScoreData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('entering');

  useEffect(() => {
    if (team) {
      const data = calculateTeamScore(team, mode);
      setScoreData(data);

      // Trigger animation
      const timer = setTimeout(() => setAnimationPhase('showing'), 100);

      return () => clearTimeout(timer);
    }
  }, [team, mode]);

  if (!scoreData) return null;

  const performance = getPerformanceCategory(scoreData.totalScore);

  return (
    <div className={`round-scoring-overlay ${animationPhase}`}>
      <div className="round-scoring-modal">
        <div className="scoring-header">
          <h2>Round {currentRound} Complete!</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="score-display">
          <div className="main-score" style={{ borderColor: performance.color }}>
            <div className="score-label">Your Score</div>
            <div className="score-value" style={{ color: performance.color }}>
              {scoreData.totalScore}
            </div>
            <div className="score-breakdown">
              <span>Base: {scoreData.baseScore}</span>
              {scoreData.bonusPoints > 0 && (
                <span className="bonus">+{scoreData.bonusPoints} bonus</span>
              )}
            </div>
          </div>

          <div className="performance-badge" style={{ backgroundColor: performance.color }}>
            <div className="performance-level">{performance.level}</div>
            <div className="performance-desc">{performance.description}</div>
          </div>
        </div>

        {scoreData.earnedBonuses?.length > 0 && (
          <div className="bonuses-section">
            <h3>🎉 Bonuses Earned This Round</h3>
            <div className="bonus-list">
              {scoreData.earnedBonuses.map((bonus, index) => (
                <div key={index} className="bonus-item">
                  <div className="bonus-name">{bonus.name}</div>
                  <div className="bonus-points">+{bonus.points}</div>
                  <div className="bonus-desc">{bonus.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="metrics-preview">
          <h3>Key Metrics</h3>
          <div className="metrics-grid">
            {Object.entries(scoreData.metricScores).slice(0, 4).map(([id, metric]) => (
              <div key={id} className="metric-card">
                <div className="metric-name">{metric.name}</div>
                <div className="metric-value">{metric.actualValue}</div>
                <div className="metric-score">
                  <div className="metric-bar">
                    <div 
                      className="metric-bar-fill" 
                      style={{ width: `${metric.rawValue}%` }}
                    ></div>
                  </div>
                  <span>{Math.round(metric.rawValue)}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="details-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '▼ Hide Details' : '▶ Show Full Breakdown'}
        </button>

        {showDetails && (
          <div className="detailed-metrics">
            <h3>Complete Score Breakdown</h3>
            <table className="metrics-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Score</th>
                  <th>Weight</th>
                  <th>Contribution</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(scoreData.metricScores).map(([id, metric]) => (
                  <tr key={id}>
                    <td>{metric.name}</td>
                    <td>{metric.actualValue}</td>
                    <td>{Math.round(metric.rawValue)}/100</td>
                    <td>{Math.round(metric.weight * 100)}%</td>
                    <td className="contribution">
                      {Math.round(metric.weightedScore)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4"><strong>Total Base Score</strong></td>
                  <td><strong>{scoreData.baseScore}</strong></td>
                </tr>
                {scoreData.bonusPoints > 0 && (
                  <tr>
                    <td colSpan="4"><strong>Bonus Points</strong></td>
                    <td><strong className="bonus">+{scoreData.bonusPoints}</strong></td>
                  </tr>
                )}
                <tr className="final-row">
                  <td colSpan="4"><strong>Final Score</strong></td>
                  <td><strong>{scoreData.totalScore}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="action-buttons">
          <button className="primary-btn" onClick={onClose}>
            Continue to Next Round
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoundScoring;