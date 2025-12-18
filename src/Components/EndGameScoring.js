import React, { useState, useEffect } from 'react';
import { calculateTeamScore, rankTeams, getPerformanceCategory, scoringConfig } from '../Configs/scoring-configs';
import './EndGameScoring.css';

const EndGameScoring = ({ team, allTeams, mode, onClose, onExportReport }) => {
  const [scoreData, setScoreData] = useState(null);
  const [rankedTeams, setRankedTeams] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedTab, setSelectedTab] = useState('summary');

  useEffect(() => {
    if (team) {
      const data = calculateTeamScore(team, mode);
      setScoreData(data);
    }

    if (allTeams && allTeams.length > 0) {
      const ranked = rankTeams(allTeams, mode);
      setRankedTeams(ranked);
    }
  }, [team, allTeams, mode]);

  if (!scoreData) return null;

  const performance = getPerformanceCategory(scoreData.totalScore);
  const teamRank = rankedTeams.find(t => t.id === team.id)?.rank || 0;
  const config = scoringConfig[mode];

  const renderSummaryTab = () => (
    <div className="summary-tab">
      <div className="final-score-hero">
        <div className="rank-badge">
          {teamRank > 0 && (
            <>
              <div className="rank-number">#{teamRank}</div>
              <div className="rank-label">of {rankedTeams.length} teams</div>
            </>
          )}
        </div>
        
        <div className="score-circle" style={{ borderColor: performance.color }}>
          <div className="score-value" style={{ color: performance.color }}>
            {scoreData.totalScore}
          </div>
          <div className="score-label">Final Score</div>
        </div>

        <div className="performance-rating" style={{ background: performance.color }}>
          <div className="rating-level">{performance.level}</div>
          <div className="rating-desc">{performance.description}</div>
        </div>
      </div>

      <div className="score-composition">
        <h3>Score Composition</h3>
        <div className="composition-chart">
          <div className="composition-bar">
            <div
              className="base-score-segment"
              style={{ width: `${(scoreData.baseScore / (scoreData.totalScore || 1)) * 100}%` }}
              title={`Base Score: ${scoreData.baseScore}`}
            >
              <span>Base: {scoreData.baseScore}</span>
            </div>
            {scoreData.bonusPoints > 0 && (
              <div
                className="bonus-score-segment"
                style={{ width: `${(scoreData.bonusPoints / (scoreData.totalScore || 1)) * 100}%` }}
                title={`Bonus Points: ${scoreData.bonusPoints}`}
              >
                <span>Bonus: +{scoreData.bonusPoints}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {scoreData.earnedBonuses?.length > 0 && (
        <div className="achievements-section">
          <h3>🏆 Achievements Unlocked</h3>
          <div className="achievement-grid">
            {scoreData.earnedBonuses.map((bonus, index) => (
              <div key={index} className="achievement-card">
                <div className="achievement-icon">✓</div>
                <div className="achievement-content">
                  <div className="achievement-name">{bonus.name}</div>
                  <div className="achievement-desc">{bonus.description}</div>
                  <div className="achievement-points">+{bonus.points} points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="key-highlights">
        <h3>Key Highlights</h3>
        <div className="highlights-grid">
          <div className="highlight-card">
            <div className="highlight-icon">💰</div>
            <div className="highlight-label">Cash Position</div>
            <div className="highlight-value">${(team.cash || 0).toLocaleString()}</div>
          </div>
          
          {mode === 'startup' ? (
            <>
              <div className="highlight-card">
                <div className="highlight-icon">🔧</div>
                <div className="highlight-label">Development</div>
                <div className="highlight-value">{team.developmentHours || 0} hrs</div>
              </div>
              <div className="highlight-card">
                <div className="highlight-icon">👥</div>
                <div className="highlight-label">Customers</div>
                <div className="highlight-value">{team.customersAcquired || 0}</div>
              </div>
            </>
          ) : (
            <>
              <div className="highlight-card">
                <div className="highlight-icon">🔬</div>
                <div className="highlight-label">Technology Level</div>
                <div className="highlight-value">TRL {team.trl || 1}</div>
              </div>
              <div className="highlight-card">
                <div className="highlight-icon">📜</div>
                <div className="highlight-label">Patents</div>
                <div className="highlight-value">{team.patents || 0}</div>
              </div>
            </>
          )}
          
          <div className="highlight-card">
            <div className="highlight-icon">📊</div>
            <div className="highlight-label">Equity Retained</div>
            <div className="highlight-value">{team.equityRetained || 100}%</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetricsTab = () => (
    <div className="metrics-tab">
      <h3>Detailed Metric Analysis</h3>
      
      <div className="metric-cards">
        {Object.entries(scoreData.metricScores || {}).map(([id, metric]) => {
          const percentile = rankedTeams.length > 0 ? 
            calculatePercentile(team, id, rankedTeams) : 50;
          
          return (
            <div key={id} className="detailed-metric-card">
              <div className="metric-header">
                <div>
                  <div className="metric-title">{metric.name}</div>
                  <div className="metric-subtitle">{metric.actualValue}</div>
                </div>
                <div className="metric-weight-badge">
                  {Math.round(metric.weight * 100)}% weight
                </div>
              </div>

              <div className="metric-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${metric.rawValue}%` }}
                  ></div>
                </div>
                <div className="progress-label">
                  <span>Score: {Math.round(metric.rawValue)}/100</span>
                  <span>Contribution: {Math.round(metric.weightedScore)} pts</span>
                </div>
              </div>

              {rankedTeams.length > 1 && (
                <div className="metric-comparison">
                  <div className="percentile-indicator">
                    <span>Better than {percentile}% of teams</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="metric-radar-section">
        <h3>Performance Profile</h3>
        <div className="radar-chart-placeholder">
          <svg viewBox="0 0 200 200" className="radar-svg">
            {/* Draw pentagon background */}
            <polygon
              points="100,20 180,70 155,160 45,160 20,70"
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="1"
            />
            <polygon
              points="100,60 140,85 125,140 75,140 60,85"
              fill="white"
              stroke="#d1d5db"
              strokeWidth="1"
            />
            
            {/* Draw actual performance */}
            {Object.entries(scoreData.metricScores).slice(0, 5).map(([id, metric], index) => {
              const angle = (index * 72 - 90) * Math.PI / 180;
              const radius = (metric.rawValue / 100) * 80;
              const x = 100 + radius * Math.cos(angle);
              const y = 100 + radius * Math.sin(angle);
              return <circle key={id} cx={x} cy={y} r="4" fill="#667eea" />;
            })}
            
            {/* Labels */}
            {Object.entries(scoreData.metricScores).slice(0, 5).map(([id, metric], index) => {
              const angle = (index * 72 - 90) * Math.PI / 180;
              const labelRadius = 95;
              const x = 100 + labelRadius * Math.cos(angle);
              const y = 100 + labelRadius * Math.sin(angle);
              return (
                <text 
                  key={`label-${id}`}
                  x={x} 
                  y={y} 
                  textAnchor="middle"
                  fontSize="10"
                  fill="#374151"
                >
                  {metric.name.split(' ')[0]}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );

  const renderComparisonTab = () => {
    if (rankedTeams.length <= 1) {
      return (
        <div className="comparison-tab">
          <p className="no-comparison">Not enough teams to show comparison.</p>
        </div>
      );
    }

    return (
      <div className="comparison-tab">
        <h3>Team Rankings</h3>
        <div className="rankings-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Score</th>
                <th>Performance</th>
                <th>Key Strengths</th>
              </tr>
            </thead>
            <tbody>
              {rankedTeams.map((rankedTeam) => {
                const isCurrentTeam = rankedTeam.id === team.id;
                const teamPerf = getPerformanceCategory(rankedTeam.scoreData?.totalScore || 0);
                const topMetrics = getTopMetrics(rankedTeam.scoreData?.metricScores);
                
                return (
                  <tr key={rankedTeam.id} className={isCurrentTeam ? 'current-team' : ''}>
                    <td className="rank-cell">
                      <div className={`rank-indicator rank-${rankedTeam.rank}`}>
                        {rankedTeam.rank}
                      </div>
                    </td>
                    <td className="team-name">
                      {rankedTeam.teamName}
                      {isCurrentTeam && <span className="you-badge">YOU</span>}
                    </td>
                    <td className="score-cell">
                      <strong>{rankedTeam.scoreData?.totalScore || 0}</strong>
                    </td>
                    <td>
                      <div 
                        className="performance-pill"
                        style={{ backgroundColor: teamPerf.color }}
                      >
                        {teamPerf.level}
                      </div>
                    </td>
                    <td className="strengths-cell">
                      {topMetrics.join(', ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="score-distribution">
          <h3>Score Distribution</h3>
          <div className="distribution-chart">
            {rankedTeams.map((rankedTeam, index) => {
              const isCurrentTeam = rankedTeam.id === team.id;
              const score = rankedTeam.scoreData?.totalScore || 0;
              const maxScore = Math.max(...rankedTeams.map(t => t.scoreData?.totalScore || 0));
              const barWidth = (score / maxScore) * 100;
              
              return (
                <div 
                  key={rankedTeam.id} 
                  className={`distribution-bar ${isCurrentTeam ? 'current' : ''}`}
                >
                  <div className="bar-label">{rankedTeam.teamName}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">{score}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="endgame-scoring-overlay">
      <div className="endgame-scoring-modal">
        <div className="endgame-header">
          <div>
            <h2>🎉 Game Complete!</h2>
            <p>Here's how you performed</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="tab-navigation">
          <button 
            className={selectedTab === 'summary' ? 'active' : ''}
            onClick={() => setSelectedTab('summary')}
          >
            Summary
          </button>
          <button 
            className={selectedTab === 'metrics' ? 'active' : ''}
            onClick={() => setSelectedTab('metrics')}
          >
            Detailed Metrics
          </button>
          {rankedTeams.length > 1 && (
            <button 
              className={selectedTab === 'comparison' ? 'active' : ''}
              onClick={() => setSelectedTab('comparison')}
            >
              Rankings
            </button>
          )}
        </div>

        <div className="tab-content">
          {selectedTab === 'summary' && renderSummaryTab()}
          {selectedTab === 'metrics' && renderMetricsTab()}
          {selectedTab === 'comparison' && renderComparisonTab()}
        </div>

        <div className="endgame-actions">
          <button className="secondary-btn" onClick={onExportReport}>
            📄 Export Report
          </button>
          <button className="primary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate percentile
function calculatePercentile(team, metricId, rankedTeams) {
  const teamScore = team.scoreData?.metricScores[metricId]?.rawValue || 0;
  const scores = rankedTeams.map(t => t.scoreData?.metricScores[metricId]?.rawValue || 0);
  const lowerScores = scores.filter(s => s < teamScore).length;
  return Math.round((lowerScores / scores.length) * 100);
}

// Helper function to get top performing metrics
function getTopMetrics(metricScores) {
  if (!metricScores) return [];
  
  const metrics = Object.entries(metricScores)
    .sort((a, b) => b[1].rawValue - a[1].rawValue)
    .slice(0, 2)
    .map(([id, metric]) => metric.name);
  
  return metrics;
}

export default EndGameScoring;