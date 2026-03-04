import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import './LiveDashboard.css';

// Get gameId from URL
const getGameId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('gameId') || 'demo-game';
};

// Get game mode from URL
const getGameMode = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('mode') || 'startup';
};

// ============================================
// TEAM CARD COMPONENT
// ============================================
const TeamCard = ({ team, rank, isResearchMode, showDetails }) => {
  const progress = team.progress || {};
  const cash = progress.cash || team.cash || 0;
  const trl = progress.currentTRL || team.trl || 3;
  const interviews = progress.interviewsTotal || team.interviewCount || 0;
  const validations = progress.validationsTotal || team.validationCount || 0;
  const investorAppeal = progress.investorAppeal || 2;
  const founderEquity = 100 - (progress.investorEquity || team.investorEquity || 0);

  // Determine card style based on rank
  const getRankStyle = () => {
    if (rank === 1) return 'team-card gold';
    if (rank === 2) return 'team-card silver';
    if (rank === 3) return 'team-card bronze';
    return 'team-card';
  };

  const getRankBadge = () => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className={getRankStyle()}>
      <div className="team-card-header">
        <div className="team-rank">{getRankBadge()}</div>
        <div className="team-info">
          <h3 className="team-name">{team.teamName || 'Unnamed Team'}</h3>
          <p className="team-idea">{team.startupIdea?.productIdea || 'No product defined'}</p>
        </div>
        <div className="team-round">
          Round {team.currentRound || team.round || 1}
        </div>
      </div>

      <div className="team-stats">
        <div className={`stat-box ${cash < 0 ? 'danger' : cash > 50000 ? 'success' : ''}`}>
          <span className="stat-icon">💰</span>
          <span className="stat-value">€{cash.toLocaleString()}</span>
          <span className="stat-label">Cash</span>
        </div>

        {isResearchMode ? (
          <div className={`stat-box ${trl >= 7 ? 'success' : trl >= 5 ? 'warning' : ''}`}>
            <span className="stat-icon">🔬</span>
            <span className="stat-value">TRL {trl}</span>
            <span className="stat-label">Tech Level</span>
          </div>
        ) : (
          <div className="stat-box">
            <span className="stat-icon">⏱️</span>
            <span className="stat-value">{progress.developmentHours || 0}h</span>
            <span className="stat-label">Dev Hours</span>
          </div>
        )}

        <div className={`stat-box ${validations >= 2 ? 'success' : ''}`}>
          <span className="stat-icon">✓</span>
          <span className="stat-value">{validations}</span>
          <span className="stat-label">Validations</span>
        </div>

        <div className={`stat-box ${investorAppeal >= 4 ? 'success' : investorAppeal <= 2 ? 'warning' : ''}`}>
          <span className="stat-icon">📈</span>
          <span className="stat-value">{investorAppeal}/5</span>
          <span className="stat-label">Appeal</span>
        </div>
      </div>

      {showDetails && (
        <div className="team-details">
          <div className="detail-row">
            <span>🎯 Interviews:</span>
            <span>{interviews}</span>
          </div>
          <div className="detail-row">
            <span>👥 Founder Equity:</span>
            <span>{founderEquity}%</span>
          </div>
          <div className="detail-row">
            <span>🏢 Office:</span>
            <span>{team.office || 'None'}</span>
          </div>
          {team.licenceAgreement && (
            <div className="detail-row">
              <span>📜 Licence:</span>
              <span>{team.licenceAgreement}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// LEADERBOARD COMPONENT
// ============================================
const Leaderboard = ({ teams, isResearchMode }) => {
  // Calculate score for ranking
  const calculateScore = (team) => {
    const progress = team.progress || {};
    const cash = progress.cash || team.cash || 0;
    const trl = progress.currentTRL || team.trl || 3;
    const validations = progress.validationsTotal || team.validationCount || 0;
    const interviews = progress.interviewsTotal || team.interviewCount || 0;
    const investorAppeal = progress.investorAppeal || 2;
    const founderEquity = 100 - (progress.investorEquity || team.investorEquity || 0);

    // Weighted scoring
    let score = 0;

    // Cash component (max ~25 points)
    score += Math.min(25, Math.max(0, cash / 4000));

    // TRL/Development component (max ~25 points)
    if (isResearchMode) {
      score += (trl - 3) * 4; // 0-24 points for TRL 3-9
    } else {
      score += Math.min(25, (progress.developmentHours || 0) / 40);
    }

    // Validation component (max ~25 points)
    score += validations * 10;
    score += interviews * 2;

    // Investor Appeal (max ~15 points)
    score += investorAppeal * 3;

    // Equity retention bonus (max ~10 points)
    score += founderEquity / 10;

    return Math.round(score);
  };

  // Sort teams by score
  const rankedTeams = [...teams]
    .map(team => ({ ...team, score: calculateScore(team) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>🏆 Leaderboard</h2>
        <p className="leaderboard-subtitle">Real-time rankings based on performance</p>
      </div>

      <div className="leaderboard-table">
        <div className="leaderboard-row header">
          <span className="col-rank">Rank</span>
          <span className="col-team">Team</span>
          <span className="col-round">Round</span>
          <span className="col-cash">Cash</span>
          <span className="col-trl">{isResearchMode ? 'TRL' : 'Dev'}</span>
          <span className="col-valid">Valid.</span>
          <span className="col-score">Score</span>
        </div>

        {rankedTeams.map((team, index) => {
          const progress = team.progress || {};
          const cash = progress.cash || team.cash || 0;
          const trl = progress.currentTRL || team.trl || 3;
          const validations = progress.validationsTotal || team.validationCount || 0;

          return (
            <div
              key={team.oderId || index}
              className={`leaderboard-row ${index < 3 ? `top-${index + 1}` : ''}`}
            >
              <span className="col-rank">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </span>
              <span className="col-team">
                <strong>{team.teamName || 'Unnamed'}</strong>
                <small>{team.startupIdea?.technique || ''}</small>
              </span>
              <span className="col-round">{team.currentRound || team.round || 1}</span>
              <span className={`col-cash ${cash < 0 ? 'negative' : ''}`}>
                €{cash.toLocaleString()}
              </span>
              <span className="col-trl">
                {isResearchMode ? trl : `${progress.developmentHours || 0}h`}
              </span>
              <span className="col-valid">{validations}</span>
              <span className="col-score">{team.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// GAME STATS OVERVIEW
// ============================================
const GameStatsOverview = ({ teams, currentRound, isResearchMode }) => {
  const stats = {
    totalTeams: teams.length,
    avgCash: 0,
    avgTRL: 0,
    totalValidations: 0,
    totalInterviews: 0,
    teamsInRed: 0,
    highestCash: 0,
    lowestCash: Infinity,
  };

  teams.forEach(team => {
    const progress = team.progress || {};
    const cash = progress.cash || team.cash || 0;
    const trl = progress.currentTRL || team.trl || 3;
    const validations = progress.validationsTotal || team.validationCount || 0;
    const interviews = progress.interviewsTotal || team.interviewCount || 0;

    stats.avgCash += cash;
    stats.avgTRL += trl;
    stats.totalValidations += validations;
    stats.totalInterviews += interviews;
    if (cash < 0) stats.teamsInRed++;
    if (cash > stats.highestCash) stats.highestCash = cash;
    if (cash < stats.lowestCash) stats.lowestCash = cash;
  });

  if (teams.length > 0) {
    stats.avgCash = Math.round(stats.avgCash / teams.length);
    stats.avgTRL = (stats.avgTRL / teams.length).toFixed(1);
  }

  if (stats.lowestCash === Infinity) stats.lowestCash = 0;

  return (
    <div className="game-stats-overview">
      <div className="overview-stat">
        <span className="overview-icon">👥</span>
        <span className="overview-value">{stats.totalTeams}</span>
        <span className="overview-label">Teams Playing</span>
      </div>

      <div className="overview-stat">
        <span className="overview-icon">��</span>
        <span className="overview-value">€{stats.avgCash.toLocaleString()}</span>
        <span className="overview-label">Avg Cash</span>
      </div>

      {isResearchMode && (
        <div className="overview-stat">
          <span className="overview-icon">🔬</span>
          <span className="overview-value">{stats.avgTRL}</span>
          <span className="overview-label">Avg TRL</span>
        </div>
      )}

      <div className="overview-stat">
        <span className="overview-icon">✓</span>
        <span className="overview-value">{stats.totalValidations}</span>
        <span className="overview-label">Total Validations</span>
      </div>

      <div className="overview-stat">
        <span className="overview-icon">🎯</span>
        <span className="overview-value">{stats.totalInterviews}</span>
        <span className="overview-label">Total Interviews</span>
      </div>

      <div className="overview-stat warning">
        <span className="overview-icon">⚠️</span>
        <span className="overview-value">{stats.teamsInRed}</span>
        <span className="overview-label">Teams in Red</span>
      </div>
    </div>
  );
};

// ============================================
// ACTIVITY TICKER
// ============================================
const ActivityTicker = ({ recentActivities }) => {
  if (!recentActivities || recentActivities.length === 0) {
    return null;
  }

  return (
    <div className="activity-ticker">
      <div className="ticker-label">📢 Recent Activity</div>
      <div className="ticker-content">
        {recentActivities.map((activity, index) => (
          <span key={index} className="ticker-item">
            <strong>{activity.teamName}</strong> {activity.action}
            {index < recentActivities.length - 1 && <span className="ticker-separator">•</span>}
          </span>
        ))}
      </div>
    </div>
  );
};

// ============================================
// ROUND PROGRESS INDICATOR
// ============================================
const RoundProgress = ({ teams, totalRounds }) => {
  const roundCounts = {};
  for (let i = 1; i <= totalRounds; i++) {
    roundCounts[i] = 0;
  }

  teams.forEach(team => {
    const round = team.currentRound || team.round || 1;
    if (roundCounts[round] !== undefined) {
      roundCounts[round]++;
    }
  });

  return (
    <div className="round-progress">
      <h3>Round Progress</h3>
      <div className="round-bars">
        {Object.entries(roundCounts).map(([round, count]) => (
          <div key={round} className="round-bar-container">
            <div className="round-bar-label">R{round}</div>
            <div className="round-bar">
              <div
                className="round-bar-fill"
                style={{
                  height: `${teams.length > 0 ? (count / teams.length) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="round-bar-count">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN LIVE DASHBOARD COMPONENT
// ============================================
const LiveDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'leaderboard', 'mixed'
  const [showDetails, setShowDetails] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const gameId = getGameId();
  const isResearchMode = getGameMode() === 'research';
  const totalRounds = 4;

  // Subscribe to team updates - single unified listener
  useEffect(() => {
    const teamsRef = collection(db, 'games', gameId, 'teams');
    // Note: Add .limit(100) if you expect more than 100 teams for performance
    const q = query(teamsRef, orderBy('lastUpdated', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsData = [];
      const activities = [];

      snapshot.docChanges().forEach(change => {
        if (change.type === 'modified' || change.type === 'added') {
          const data = change.doc.data();
          // Validate data structure before using
          if (data?.teamName && typeof data.teamName === 'string') {
            activities.push({
              teamName: data.teamName,
              action: change.type === 'added' ? 'joined the game' : `submitted Round ${data.currentRound || 1}`,
              timestamp: new Date(),
            });
          }
        }
      });

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        // Validate data structure before adding to teams
        if (data?.teamName && typeof data.teamName === 'string') {
          teamsData.push({
            id: doc.id,
            ...data,
          });
        }
      });

      setTeams(teamsData);
      setLastUpdate(new Date());
      setLoading(false);

      if (activities.length > 0) {
        setRecentActivities(prev => [...activities, ...prev].slice(0, 5));
      }
    }, (error) => {
      console.error('Error listening to teams:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gameId]);

  if (loading) {
    return (
      <div className="live-dashboard loading">
        <div className="loading-spinner" />
        <p>Connecting to game...</p>
      </div>
    );
  }

  // Calculate ranking for grid view
  const calculateScore = (team) => {
    const progress = team.progress || {};
    const cash = progress.cash || team.cash || 0;
    const trl = progress.currentTRL || team.trl || 3;
    const validations = progress.validationsTotal || team.validationCount || 0;
    const investorAppeal = progress.investorAppeal || 2;
    const founderEquity = 100 - (progress.investorEquity || team.investorEquity || 0);

    let score = 0;
    score += Math.min(25, Math.max(0, cash / 4000));
    if (isResearchMode) {
      score += (trl - 3) * 4;
    } else {
      score += Math.min(25, (progress.developmentHours || 0) / 40);
    }
    score += validations * 10;
    score += investorAppeal * 3;
    score += founderEquity / 10;

    return Math.round(score);
  };

  const rankedTeams = [...teams]
    .map(team => ({ ...team, score: calculateScore(team) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="live-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-brand">
          <h1>🚀 {isResearchMode ? 'Research Spin-off' : 'Launch'} Game</h1>
          <p className="game-id">Game: {gameId}</p>
        </div>

        <div className="header-controls">
          <div className="view-toggle">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={viewMode === 'leaderboard' ? 'active' : ''}
              onClick={() => setViewMode('leaderboard')}
            >
              Leaderboard
            </button>
            <button
              className={viewMode === 'mixed' ? 'active' : ''}
              onClick={() => setViewMode('mixed')}
            >
              Mixed
            </button>
          </div>

          <label className="details-toggle">
            <input
              type="checkbox"
              checked={showDetails}
              onChange={(e) => setShowDetails(e.target.checked)}
            />
            Show Details
          </label>
        </div>

        <div className="header-status">
          <span className="live-indicator">
            <span className="pulse" />
            LIVE
          </span>
          <span className="last-update">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </header>

      {/* Activity Ticker */}
      <ActivityTicker recentActivities={recentActivities} />

      {/* Game Stats Overview */}
      <GameStatsOverview
        teams={teams}
        currentRound={Math.max(...teams.map(t => t.currentRound || 1), 1)}
        isResearchMode={isResearchMode}
      />

      {/* Main Content */}
      <main className="dashboard-content">
        {viewMode === 'grid' && (
          <div className="teams-grid">
            {rankedTeams.map((team, index) => (
              <TeamCard
                key={team.id || index}
                team={team}
                rank={index + 1}
                isResearchMode={isResearchMode}
                showDetails={showDetails}
              />
            ))}

            {teams.length === 0 && (
              <div className="no-teams">
                <p>👀 Waiting for teams to join...</p>
                <p className="hint">Teams will appear here as they start playing.</p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'leaderboard' && (
          <Leaderboard teams={teams} isResearchMode={isResearchMode} />
        )}

        {viewMode === 'mixed' && (
          <div className="mixed-view">
            <div className="mixed-left">
              <Leaderboard teams={teams} isResearchMode={isResearchMode} />
            </div>
            <div className="mixed-right">
              <RoundProgress teams={teams} totalRounds={totalRounds} />

              {/* Top 3 Highlight */}
              <div className="top-three">
                <h3>🏆 Top Performers</h3>
                {rankedTeams.slice(0, 3).map((team, index) => (
                  <TeamCard
                    key={team.id || index}
                    team={team}
                    rank={index + 1}
                    isResearchMode={isResearchMode}
                    showDetails={false}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Founded • {isResearchMode ? 'Research Edition' : 'Startup Edition'} • {teams.length} teams active</p>
      </footer>
    </div>
  );
};

export default LiveDashboard;
