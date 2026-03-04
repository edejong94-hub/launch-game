import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronUp,
  ChevronDown
} from "react-feather";


// End game scoring configuration
const SCORING_CONFIG = {
  categories: [
    {
      id: "financial",
      name: "Financial Health",
      icon: "💰",
      maxPoints: 25,
      metrics: [
        { id: "cash", name: "Cash Position", weight: 15, target: 50000, unit: "€" },
        { id: "revenue", name: "Revenue Generated", weight: 10, target: 20000, unit: "€" },
      ],
    },
    {
      id: "technology",
      name: "Technology Progress",
      icon: "🔬",
      maxPoints: 25,
      metrics: [
        { id: "trl", name: "TRL Level", weight: 20, target: 7, unit: "" },
        { id: "patents", name: "IP Protection", weight: 5, target: 1, unit: " patents" },
      ],
    },
    {
      id: "market",
      name: "Market Validation",
      icon: "🎯",
      maxPoints: 25,
      metrics: [
        { id: "validations", name: "Customer Validations", weight: 15, target: 2, unit: "" },
        { id: "interviews", name: "Customer Interviews", weight: 10, target: 6, unit: "" },
      ],
    },
    {
      id: "team",
      name: "Team & Structure",
      icon: "👥",
      maxPoints: 15,
      metrics: [
        { id: "equity", name: "Founder Equity", weight: 10, target: 60, unit: "%" },
        { id: "legalForm", name: "Legal Structure", weight: 5, target: 1, unit: "" },
      ],
    },
  ],
  bonuses: [
    { id: "grantWinner", name: "Grant Secured", points: 3, icon: "📋" },
    { id: "incubator", name: "Incubator Accepted", points: 2, icon: "🏢" },
    { id: "balancedTeam", name: "Balanced Team", points: 2, icon: "⚖️" },
    { id: "goodLicence", name: "Fair Licence Deal", points: 2, icon: "📝" },
    { id: "noBankruptcy", name: "Never Went Negative", points: 1, icon: "💪" },
  ],
  rankings: {
    excellent: { min: 80, label: "🌟 Excellent", color: "#22c55e", description: "Ready for Series A!" },
    strong: { min: 65, label: "💪 Strong", color: "#3b82f6", description: "On track for success" },
    good: { min: 50, label: "👍 Good", color: "#f59e0b", description: "Solid foundation" },
    developing: { min: 35, label: "📈 Developing", color: "#f97316", description: "More work needed" },
    struggling: { min: 0, label: "⚠️ Struggling", color: "#ef4444", description: "Major challenges ahead" },
  },
};

// Calculate score for a single metric
const calculateMetricScore = (value, target, weight) => {
  const ratio = Math.min(1, value / target);
  return ratio * weight;
};

// Evaluate achievements based on config conditions
const evaluateAchievements = (teamData, config) => {
  const achievements = [];
  const bonuses = config.endGameScoring?.bonuses || [];
  const conditions = config.endGameScoring?.achievementConditions || {};

  bonuses.forEach(bonus => {
    const conditionFn = conditions[bonus.condition];
    if (conditionFn && conditionFn(teamData)) {
      achievements.push(bonus);
    }
  });

  // Sort: positive first, then negative, by absolute points
  achievements.sort((a, b) => {
    if (a.points >= 0 && b.points < 0) return -1;
    if (a.points < 0 && b.points >= 0) return 1;
    return Math.abs(b.points) - Math.abs(a.points);
  });

  return achievements;
};

// Get ranking based on total score
const getRanking = (score) => {
  const { rankings } = SCORING_CONFIG;
  if (score >= rankings.excellent.min) return rankings.excellent;
  if (score >= rankings.strong.min) return rankings.strong;
  if (score >= rankings.good.min) return rankings.good;
  if (score >= rankings.developing.min) return rankings.developing;
  return rankings.struggling;
};

const EndGameScoreBreakdown = ({ teamData, progress, config }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Extract values from team data
  const values = {
    cash: progress?.cash || 0,
    revenue: teamData?.funding?.revenue || 0,
    trl: progress?.currentTRL || teamData?.trl || 3,
    patents: teamData?.completedActivities?.filter(a =>
      ['patentFiling', 'knowHowProtection'].includes(a)
    ).length || 0,
    validations: progress?.validationsTotal || 0,
    interviews: progress?.interviewsTotal || 0,
    equity: 100 - (progress?.investorEquity || 0) - (teamData?.licenceAgreement === 'equity' ? 10 : 0),
    legalForm: teamData?.legalForm && teamData?.legalForm !== 'none' ? 1 : 0,
  };

  // Calculate category scores
  const categoryScores = SCORING_CONFIG.categories.map(category => {
    const metricScores = category.metrics.map(metric => {
      const value = values[metric.id] || 0;
      const score = calculateMetricScore(value, metric.target, metric.weight);
      return {
        ...metric,
        value,
        score,
        percentage: Math.min(100, (value / metric.target) * 100),
      };
    });

    const categoryTotal = metricScores.reduce((sum, m) => sum + m.score, 0);

    return {
      ...category,
      metrics: metricScores,
      score: categoryTotal,
    };
  });

  // Evaluate achievements from config
  const achievements = evaluateAchievements(teamData, config);
  const positiveAchievements = achievements.filter(a => a.points >= 0);
  const negativeAchievements = achievements.filter(a => a.points < 0);
  const bonusPoints = achievements.reduce((sum, a) => sum + a.points, 0);

  // Calculate total
  const baseScore = categoryScores.reduce((sum, c) => sum + c.score, 0);
  const totalScore = Math.round(baseScore + bonusPoints);
  const ranking = getRanking(totalScore);

  // Animate score on mount
  const currentRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const duration = 2000;
    const steps = 60;
    const increment = totalScore / steps;
    currentRef.current = 0;
    let detailsTimeout = null;

    const timer = setInterval(() => {
      currentRef.current += increment;
      if (currentRef.current >= totalScore) {
        if (isMountedRef.current) {
          setAnimatedScore(totalScore);
          detailsTimeout = setTimeout(() => {
            if (isMountedRef.current) setShowDetails(true);
          }, 500);
        }
        clearInterval(timer);
      } else {
        if (isMountedRef.current) {
          setAnimatedScore(Math.round(currentRef.current));
        }
      }
    }, duration / steps);

    return () => {
      isMountedRef.current = false;
      clearInterval(timer);
      if (detailsTimeout) clearTimeout(detailsTimeout);
    };
  }, [totalScore]);

  return (
    <div className="end-game-score">
      {/* Main Score Display */}
      <div className="score-hero" style={{ borderColor: ranking.color }}>
        <div className="score-label">Final Score</div>
        <div className="score-number" style={{ color: ranking.color }}>
          {animatedScore}
        </div>
        <div className="score-max">/ 100 points</div>
        <div className="ranking-badge" style={{ backgroundColor: ranking.color }}>
          {ranking.label}
        </div>
        <div className="ranking-desc">{ranking.description}</div>
      </div>

      {/* Score Breakdown */}
      {showDetails && (
        <div className="score-breakdown animate-in">
          <h3>📊 Score Breakdown</h3>
          
          {/* Categories */}
          <div className="categories-list">
            {categoryScores.map(category => (
              <div key={category.id} className="category-card">
                <div 
                  className="category-header"
                  onClick={() => setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <div className="category-score">
                    <span className="score-value">{Math.round(category.score)}</span>
                    <span className="score-max">/{category.maxPoints}</span>
                  </div>
                  <div className="expand-icon">
                    {expandedCategory === category.id ? 
                      <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="category-progress">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(category.score / category.maxPoints) * 100}%`,
                      backgroundColor: category.score >= category.maxPoints * 0.8 ? '#22c55e' :
                                       category.score >= category.maxPoints * 0.5 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>

                {/* Expanded metrics */}
                {expandedCategory === category.id && (
                  <div className="metrics-detail">
                    {category.metrics.map(metric => (
                      <div key={metric.id} className="metric-row">
                        <span className="metric-name">{metric.name}</span>
                        <span className="metric-value">
                          {metric.unit === '€' ? `€${metric.value.toLocaleString()}` :
                           metric.unit === '%' ? `${metric.value}%` :
                           `${metric.value}${metric.unit}`}
                        </span>
                        <div className="metric-progress">
                          <div 
                            className="metric-fill"
                            style={{ width: `${metric.percentage}%` }}
                          />
                        </div>
                        <span className="metric-score">+{Math.round(metric.score)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="achievements-section">
            <div className="achievements-header">
              <h4>🏆 Achievements</h4>
              <span className={`achievements-total ${bonusPoints < 0 ? 'negative' : ''}`}>
                {bonusPoints >= 0 ? '+' : ''}{bonusPoints} pts
              </span>
            </div>

            {/* Positive achievements */}
            {positiveAchievements.length > 0 && (
              <div className="achievements-group positive">
                <div className="achievements-group-title">🌟 Accomplishments</div>
                <div className="achievements-list">
                  {positiveAchievements.map(achievement => (
                    <div key={achievement.id} className="achievement-item positive">
                      <div className="achievement-main">
                        <span className="achievement-name">{achievement.name}</span>
                        <span className="achievement-points">+{achievement.points}</span>
                      </div>
                      <p className="achievement-description">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Negative achievements */}
            {negativeAchievements.length > 0 && (
              <div className="achievements-group negative">
                <div className="achievements-group-title">💀 Room for Improvement</div>
                <div className="achievements-list">
                  {negativeAchievements.map(achievement => (
                    <div key={achievement.id} className="achievement-item negative">
                      <div className="achievement-main">
                        <span className="achievement-name">{achievement.name}</span>
                        <span className="achievement-points">{achievement.points}</span>
                      </div>
                      <p className="achievement-description">{achievement.description}</p>
                      {achievement.roast && (
                        <p className="achievement-roast">"{achievement.roast}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No achievements at all */}
            {achievements.length === 0 && (
              <div className="no-achievements">
                <span>🤷</span>
                <p>No special achievements... just average, we guess.</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="score-summary">
            <div className="summary-row">
              <span>Base Score</span>
              <span>{Math.round(baseScore)} points</span>
            </div>
            <div className="summary-row">
              <span>Bonus Points</span>
              <span>+{bonusPoints} points</span>
            </div>
            <div className="summary-row total">
              <span>Final Score</span>
              <span style={{ color: ranking.color }}>{totalScore} points</span>
            </div>
          </div>

          {/* Pivot History */}
          {teamData.pivotHistory && teamData.pivotHistory.length > 0 && (
            <div className="pivot-history-section">
              <h3 className="pivot-history-title">
                🔄 Pivot Journey ({teamData.pivotHistory.length} pivot{teamData.pivotHistory.length > 1 ? 's' : ''})
              </h3>
              <div className="pivot-timeline">
                {teamData.pivotHistory.map((pivot, index) => (
                  <div key={index} className="pivot-entry">
                    <div className="pivot-entry-header">
                      <span className="pivot-round">Round {pivot.round}</span>
                      <span className="pivot-reason">{pivot.reasonLabel}</span>
                    </div>
                    {pivot.customNote && (
                      <p className="pivot-note-text">"{pivot.customNote}"</p>
                    )}
                    <div className="pivot-impact">
                      TRL: {pivot.previousTRL} → {Math.max(3, pivot.previousTRL - 1)} |
                      Lost {pivot.lostValidations} validation(s)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className="feedback-section" style={{ borderColor: ranking.color }}>
            <h4>💡 Key Takeaways</h4>
            <ul>
              {values.validations === 0 && (
                <li className="feedback-warning">
                  No customer validation! This is the #1 reason startups fail.
                </li>
              )}
              {values.equity < 50 && (
                <li className="feedback-warning">
                  High dilution ({100 - values.equity}% given away). Be careful with future rounds.
                </li>
              )}
              {values.trl >= 7 && (
                <li className="feedback-success">
                  Great TRL progress! Your technology is market-ready.
                </li>
              )}
              {values.cash > 30000 && (
                <li className="feedback-success">
                  Healthy cash position. Good runway for growth.
                </li>
              )}
              {positiveAchievements.length >= 3 && (
                <li className="feedback-success">
                  Multiple bonuses achieved! Well-rounded execution.
                </li>
              )}
              {values.interviews >= 6 && (
                <li className="feedback-success">
                  Strong customer discovery. You understand your market.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// CSS styles (inline for now, can be moved to separate file)
const styles = `
.end-game-score {
  padding: 1.5rem;
}

.score-hero {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 16px;
  border: 3px solid;
  margin-bottom: 2rem;
}

.score-label {
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.score-number {
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.score-max {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.ranking-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.ranking-desc {
  color: #94a3b8;
  font-size: 0.9375rem;
}

.score-breakdown {
  animation: fadeIn 0.5s ease;
}

.score-breakdown h3 {
  font-size: 1.25rem;
  color: #f1f5f9;
  margin: 0 0 1rem 0;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.category-card {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  overflow: hidden;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.category-header:hover {
  background: rgba(99, 102, 241, 0.1);
}

.category-icon {
  font-size: 1.5rem;
}

.category-name {
  flex: 1;
  font-weight: 600;
  color: #e2e8f0;
}

.category-score {
  font-weight: 700;
}

.category-score .score-value {
  color: #f1f5f9;
  font-size: 1.125rem;
}

.category-score .score-max {
  color: #64748b;
  font-size: 0.875rem;
}

.expand-icon {
  color: #64748b;
}

.category-progress {
  height: 4px;
  background: rgba(99, 102, 241, 0.2);
}

.progress-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.metrics-detail {
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border-top: 1px solid rgba(99, 102, 241, 0.1);
}

.metric-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.metric-name {
  flex: 0 0 140px;
  font-size: 0.875rem;
  color: #94a3b8;
}

.metric-value {
  flex: 0 0 80px;
  font-size: 0.875rem;
  color: #e2e8f0;
  font-weight: 500;
}

.metric-progress {
  flex: 1;
  height: 6px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background: #6366f1;
  border-radius: 3px;
}

.metric-score {
  flex: 0 0 40px;
  text-align: right;
  font-size: 0.875rem;
  color: #22c55e;
  font-weight: 600;
}

.achievements-section {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.achievements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.achievements-header h4 {
  margin: 0;
  color: #f1f5f9;
  font-size: 1rem;
}

.achievements-total {
  font-size: 1.125rem;
  font-weight: 700;
  color: #22c55e;
}

.achievements-total.negative {
  color: #ef4444;
}

.achievements-group {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
}

.achievements-group.positive {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.achievements-group.negative {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.achievements-group-title {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.achievements-group.positive .achievements-group-title {
  color: #4ade80;
}

.achievements-group.negative .achievements-group-title {
  color: #f87171;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.achievement-item {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 0.875rem 1rem;
  border-left: 4px solid;
}

.achievement-item.positive {
  border-left-color: #22c55e;
}

.achievement-item.negative {
  border-left-color: #ef4444;
  animation: shakeIn 0.5s ease-out;
}

.achievement-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.achievement-name {
  font-weight: 700;
  font-size: 0.9375rem;
  color: #f5f5f5;
}

.achievement-points {
  font-weight: 800;
  font-size: 1rem;
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
}

.achievement-item.positive .achievement-points {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.15);
}

.achievement-item.negative .achievement-points {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
}

.achievement-description {
  font-size: 0.8125rem;
  color: #a3a3a3;
  margin: 0;
}

.achievement-roast {
  font-size: 0.8125rem;
  font-style: italic;
  color: #fbbf24;
  margin: 0.5rem 0 0 0;
  padding: 0.5rem 0.75rem;
  background: rgba(251, 191, 36, 0.1);
  border-radius: 6px;
  border-left: 2px solid #fbbf24;
}

.no-achievements {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.no-achievements span {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.no-achievements p {
  margin: 0;
  font-size: 0.9375rem;
}

@keyframes shakeIn {
  0% { transform: translateX(-10px); opacity: 0; }
  25% { transform: translateX(5px); }
  50% { transform: translateX(-3px); }
  75% { transform: translateX(2px); }
  100% { transform: translateX(0); opacity: 1; }
}

.score-summary {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #94a3b8;
  font-size: 0.9375rem;
}

.summary-row.total {
  border-top: 1px solid rgba(99, 102, 241, 0.2);
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #f1f5f9;
}

.feedback-section {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  padding: 1rem;
  border-left: 4px solid;
}

.feedback-section h4 {
  margin: 0 0 0.75rem 0;
  color: #f1f5f9;
  font-size: 1rem;
}

.feedback-section ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.feedback-section li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  font-size: 0.9375rem;
}

.feedback-section li::before {
  position: absolute;
  left: 0;
}

.feedback-warning {
  color: #f59e0b;
}

.feedback-warning::before {
  content: "⚠️";
}

.feedback-success {
  color: #22c55e;
}

.feedback-success::before {
  content: "✅";
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeIn 0.5s ease;
}

.pivot-history-section {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
}

.pivot-history-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fbbf24;
  margin: 0 0 1rem 0;
}

.pivot-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pivot-entry {
  background: rgba(0, 0, 0, 0.2);
  border-left: 3px solid #f59e0b;
  border-radius: 0 8px 8px 0;
  padding: 0.875rem;
}

.pivot-entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.pivot-round {
  font-size: 0.75rem;
  font-weight: 600;
  color: #a3a3a3;
  text-transform: uppercase;
}

.pivot-reason {
  font-size: 0.875rem;
  font-weight: 600;
  color: #f5f5f5;
}

.pivot-note-text {
  font-size: 0.8125rem;
  font-style: italic;
  color: #a3a3a3;
  margin: 0 0 0.5rem 0;
}

.pivot-impact {
  font-size: 0.75rem;
  color: #f87171;
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default EndGameScoreBreakdown;