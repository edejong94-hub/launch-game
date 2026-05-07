import React, { useState, useEffect } from 'react';
import { calculateResearchScore } from '../Configs/research-config';
import { calculateStartupScore } from '../Configs/startup-config';
import './RoundScoring.css';

const RoundScoring = ({ team, mode, currentRound, onClose }) => {
  const [scoreData, setScoreData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('entering');

  useEffect(() => {
    if (team) {
      const calcScore = mode === 'startup' ? calculateStartupScore : calculateResearchScore;
      const data = calcScore(team, team.progress || {});
      setScoreData(data);

      const timer = setTimeout(() => setAnimationPhase('showing'), 100);
      return () => clearTimeout(timer);
    }
  }, [team, mode]);

  if (!scoreData) return null;

  const { ranking } = scoreData;
  const allMetrics = scoreData.categoryScores.flatMap(c => c.metrics);
  const positiveAchievements = scoreData.achievements.filter(a => a.points > 0);

  return (
    <div className={`round-scoring-overlay ${animationPhase}`}>
      <div className="round-scoring-modal">
        <div className="scoring-header">
          <h2>Round {currentRound} Complete!</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="score-display">
          <div className="main-score" style={{ borderColor: ranking.color }}>
            <div className="score-label">Your Score</div>
            <div className="score-value" style={{ color: ranking.color }}>
              {scoreData.totalScore}
            </div>
            <div className="score-breakdown">
              <span>Base: {Math.round(scoreData.baseScore)}</span>
              {scoreData.bonusPoints !== 0 && (
                <span className="bonus">
                  {scoreData.bonusPoints > 0 ? '+' : ''}{scoreData.bonusPoints} bonus
                </span>
              )}
            </div>
          </div>

          <div className="performance-badge" style={{ backgroundColor: ranking.color }}>
            <div className="performance-level">{ranking.label}</div>
            <div className="performance-desc">{ranking.description}</div>
          </div>
        </div>

        {positiveAchievements.length > 0 && (
          <div className="bonuses-section">
            <h3>🎉 Bonuses Earned This Round</h3>
            <div className="bonus-list">
              {positiveAchievements.map((bonus, index) => (
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
            {allMetrics.slice(0, 4).map((metric) => (
              <div key={metric.id} className="metric-card">
                <div className="metric-name">{metric.name}</div>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-score">
                  <div className="metric-bar">
                    <div
                      className="metric-bar-fill"
                      style={{ width: `${metric.percentage}%` }}
                    ></div>
                  </div>
                  <span>{Math.round(metric.percentage)}/100</span>
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
                  <th>Progress</th>
                  <th>Max pts</th>
                  <th>Earned</th>
                </tr>
              </thead>
              <tbody>
                {allMetrics.map((metric) => (
                  <tr key={metric.id}>
                    <td>{metric.name}</td>
                    <td>{metric.value}</td>
                    <td>{Math.round(metric.percentage)}/100</td>
                    <td>{metric.weight}</td>
                    <td className="contribution">{Math.round(metric.score)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4"><strong>Total Base Score</strong></td>
                  <td><strong>{Math.round(scoreData.baseScore)}</strong></td>
                </tr>
                {scoreData.bonusPoints !== 0 && (
                  <tr>
                    <td colSpan="4"><strong>Bonus Points</strong></td>
                    <td>
                      <strong className="bonus">
                        {scoreData.bonusPoints > 0 ? '+' : ''}{scoreData.bonusPoints}
                      </strong>
                    </td>
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
