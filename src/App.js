import GameEventPopup, { checkEventTrigger } from './Components/Gameeventpopup';
import EndGameScoreBreakdown from './Components/EndGameScoreBreakdown';
import ResourceTracker from './Components/ResourceTracker';
import PivotReasonSelector from './Components/PivotReasonSelector';
import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  AlertCircle,
  Users,
  Beaker,
  Target,
  Briefcase,
  PieChart,
  Lock,
  Unlock,
} from "lucide-react";
import { db } from "./firebase";
import foundedLogo from "./logo.svg";  
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

// Import configurations
import { STARTUP_CONFIG } from "./Configs/startup-config";
import { RESEARCH_CONFIG } from "./Configs/research-config";

// Determine which config to use based on URL parameter
const getGameConfig = () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") || "startup";
  return mode === "research" ? RESEARCH_CONFIG : STARTUP_CONFIG;
};

const GAME_CONFIG = getGameConfig();
const isResearchMode = GAME_CONFIG.gameMode === "research";

// Get gameId from URL
const getGameId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("gameId") || "demo-game";
};

// ============================================
// SESSION STORAGE HELPERS
// ============================================
const SESSION_KEY = `launchGame_${getGameId()}`;

const saveSession = (data) => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save session:", err);
  }
};

const loadSession = () => {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error("Failed to load session:", err);
    return null;
  }
};

const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("oderId");
  } catch (err) {
    console.error("Failed to clear session:", err);
  }
};

// ============================================
// ============================================
// SHELL COMPONENT – header with Founded branding
// ============================================
const Shell = ({ children, currentRound, teamName, onReset }) => (
  <div className="app-container">
    <header className="app-header">
      <div className="header-content">
        <div className="brand">
          <div className="brand-logo-wrap">
            <img
              src={foundedLogo}
              alt="Founded"
              className="brand-logo"
            />
          </div>
          <div className="brand-text">
            <p className="subtitle">
              {isResearchMode ? "From lab to market" : "Launch Game"}
            </p>
            <h1>
              {isResearchMode ? "Research edition" : "Startup edition"}
            </h1>
          </div>
        </div>

        <div className="header-meta">
          {teamName && (
            <div className="team-indicator">
              <p className="label">Team</p>
              <p className="value">{teamName}</p>
            </div>
          )}
          <div className="round-indicator">
            <p className="label">Current round</p>
            <p className="value">
              {currentRound === 0 ? "Start" : `Round ${currentRound}`}
            </p>
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="reset-button"
              title="Start fresh and clear all progress"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </header>

    <main className="main-content">{children}</main>
  </div>
);


// ============================================
// GAME ENGINE - Calculate progress and validate activities
// ============================================
const calculateProgress = (teamData, config) => {
  let totalTimeSpent = 0;
  let totalMoneySpent = 0;
  let salesGrade = 0;
  let networkFactor = 0;
  let marketingBonus = 0;
  let trlBonus = 0;

  let customerValidationScore = 0;
  const juniorsOnTeam = teamData.employees || 0;
  let bankTrust = 2;
  let investorAppeal = 2;

  // --- INTERVIEWS & VALIDATION ---
  let interviewsThisRound = 0;
  let validationsThisRound = 0;

  if (teamData.activities?.customerInterviews) {
    interviewsThisRound = 1 + juniorsOnTeam * 0.5;
  }

  if (teamData.activities?.customerValidation) {
    customerValidationScore = 3;
    validationsThisRound = 1;
  }

  const previousInterviewCount = teamData.interviewCount || 0;
  const previousValidationCount = teamData.validationCount || 0;

  const interviewsTotal = previousInterviewCount + interviewsThisRound;
  const validationsTotal = previousValidationCount + validationsThisRound;

  // --- OFFICE COSTS ---
  if (teamData.office && config.companyOffice[teamData.office]) {
    const office = config.companyOffice[teamData.office];
    totalMoneySpent += office.cost;
  }

  // --- LEGAL FORM: salaries + trust modifiers ---
  if (teamData.legalForm && config.legalForms[teamData.legalForm]) {
    const form = config.legalForms[teamData.legalForm];
    const foundersCount = teamData.founders || (isResearchMode ? 2 : 4);

    if (form.salaryPerFounderHalfYear && form.salaryPerFounderHalfYear > 0) {
      totalMoneySpent += foundersCount * form.salaryPerFounderHalfYear;
    }

    bankTrust += form.bankTrustBonus || 0;
    investorAppeal += form.investorAppealBonus || 0;
  }

  // --- LICENCE AGREEMENT IMPACT (Research mode) ---
  if (isResearchMode && teamData.licenceAgreement) {
    const licence = config.licenceOptions[teamData.licenceAgreement];
    if (licence) {
      investorAppeal += licence.investorAppealModifier || 0;

      // Fixed payments from licence
      if (
        licence.fixedPaymentPerRound &&
        teamData.round >= (licence.paymentsStartRound || 1)
      ) {
        totalMoneySpent += licence.fixedPaymentPerRound;
      }

      // Revenue-based royalty calculation (simplified)
      const revenue = Number(teamData.funding?.revenue || 0);
      if (revenue > 0 && licence.royaltyPercent > 0) {
        if (licence.royaltyBase === "revenue") {
          totalMoneySpent += revenue * (licence.royaltyPercent / 100);
        }
        // Profit-based royalties would be handled differently
      }
    }
  }

  // --- TEAM COMPOSITION BONUS (Research mode) ---
  if (isResearchMode && teamData.teamProfiles) {
    const profiles = teamData.teamProfiles;
    const uniqueTypes = new Set(
      profiles.map((p) => {
        if (p === "scientist" || p === "product") return "technical";
        if (p === "business" || p === "market") return "commercial";
        return "operations";
      })
    );

    if (uniqueTypes.size >= 2) {
      investorAppeal += 1;
    }
    if (uniqueTypes.size >= 3) {
      investorAppeal += 1;
    }
  }

  // --- PAYROLL FOR EXTRA HIRES ---
  const employees = teamData.employees || 0;
  const hasSenior = !!teamData.hasSenior;

  let totalSalaryCost = 0;

  // --- FOUNDER SALARY (based on employment status) ---
  const empStatus = teamData.employmentStatus || 'university';
  const foundersCount = teamData.founders || (isResearchMode ? 3 : 4);
  const founderSalaryCost = getFounderSalaryCost(empStatus, foundersCount);
  totalSalaryCost += founderSalaryCost;

  if (config.payroll) {
    if (employees > 0) {
      totalSalaryCost +=
        employees * (config.payroll.juniorSalaryPerHalfYear || 0);
    }
    if (hasSenior) {
      totalSalaryCost += config.payroll.seniorSalaryPerHalfYear || 0;
    }
  }
  totalMoneySpent += totalSalaryCost;

  // --- FUNDING ---
  const funding = teamData.funding || {};
  const revenue = Number(funding.revenue || 0);
  const subsidy = Number(funding.subsidy || 0);
  const subsidyFee = Number(funding.subsidyFee || 0);
  const investment = Number(funding.investment || 0);
  const loan = Number(funding.loan || 0);
  const loanInterest = Number(funding.loanInterest || 0);

  const interestPayment = loan * (loanInterest / 100);
  totalMoneySpent += subsidyFee + interestPayment;

  // --- HIRING TIME FOR JUNIORS ---
  const juniorHiresThisRound = teamData.juniorHiresThisRound || 0;
  if (juniorHiresThisRound > 0) {
    totalTimeSpent += juniorHiresThisRound * 40;
  }

  // --- ACTIVITIES ---
  Object.entries(teamData.activities || {}).forEach(([key, value]) => {
    if (!value) return;

    const activity = config.activities[key];
    if (!activity) return;

    let timeCost = activity.costTime || 0;

    if (key === "pivot" && activity.extraTimePerRound) {
      const round = teamData.round || 1;
      timeCost += (round - 1) * activity.extraTimePerRound;
    }

    if (key === "subsidy" && (teamData.subsidyCount || 0) >= 1) {
      timeCost *= 2;
    }
    if (key === "investorMeeting" && (teamData.investorCount || 0) >= 1) {
      timeCost += 20;
    }

    totalTimeSpent += timeCost;
    totalMoneySpent += activity.costMoney || 0;
    salesGrade += activity.salesGradeBonus || 0;
    networkFactor += activity.networkBonus || 0;
    marketingBonus += activity.marketingBonus || 0;
    trlBonus += activity.trlBonus || 0;
    investorAppeal += activity.investorAppealBonus || 0;
  });

  // --- EMPLOYMENT STATUS INVESTOR MODIFIER ---
  const employmentModifier = getEmploymentInvestorModifier(
    teamData.employmentStatus || 'university',
    teamData.round || 1
  );
  investorAppeal += employmentModifier;

  // --- PRODUCTIVITY & HOURS ---
  const productivityMultiplier =
    teamData.office && config.companyOffice[teamData.office]
      ? config.companyOffice[teamData.office].productivity
      : 1.0;

  const baseHours = (teamData.founders || (isResearchMode ? 2 : 4)) * 500;
  const availableHours = baseHours * productivityMultiplier;
  const developmentHours = availableHours - totalTimeSpent;

  // --- TRL CALCULATION (Research mode) ---
  const currentTRL = Math.min(9, (teamData.trl || 3) + trlBonus);

  // --- PHASE PROGRESS ---
  const currentPhase = teamData.phase || 1;
  let phaseProgress;
  let canEnterPhase2;

  if (isResearchMode) {
    phaseProgress =
      currentPhase === 1
        ? (currentTRL / config.phases.phase1.trlRequired) * 100
        : (currentTRL / config.phases.phase2.trlRequired) * 100;

    canEnterPhase2 =
      currentTRL >= config.phases.phase1.trlRequired &&
      interviewsTotal >= 2 &&
      validationsTotal >= 1;
  } else {
    phaseProgress =
      currentPhase === 1
        ? (developmentHours / config.phases.phase1.hoursRequired) * 100
        : (developmentHours / config.phases.phase2.hoursRequired) * 100;

    canEnterPhase2 =
      developmentHours >= config.phases.phase1.hoursRequired &&
      interviewsTotal >= 4 &&
      validationsTotal >= 1;
  }

  // --- CASH ---
  const startingCash = teamData.cash || config.gameInfo.startingCapital;
  const cash =
    startingCash - totalMoneySpent + revenue + subsidy + investment + loan;

  return {
    cash,
    totalTimeSpent,
    totalMoneySpent,
    totalSalaryCost,
    developmentHours,
    phaseProgress: Math.min(phaseProgress, 100),
    salesGrade,
    networkFactor,
    marketingBonus,
    customerValidationScore,
    customerInterviews: interviewsThisRound,
    interviewsTotal,
    validationsTotal,
    phase: currentPhase,
    canEnterPhase2,
    bankTrust,
    investorAppeal,
    employees,
    hasSenior,
    investorEquity: (teamData.investorEquity || 0) + Number(funding.investorEquity || 0),
    currentTRL,
    trlBonus,
    founderSalaryCost,
    employmentStatus: teamData.employmentStatus || 'university',
    maxHoursAvailable: getAvailableHours(teamData.employmentStatus || 'university', teamData.founders || 3),
    hoursOverLimit: totalTimeSpent > getAvailableHours(teamData.employmentStatus || 'university', teamData.founders || 3),
    employmentModifier,
    hasLabAccess: hasLabAccess(teamData.employmentStatus || 'university'),
  };
};

// Check if an activity is unlocked based on prerequisites
const isActivityUnlocked = (activityKey, activity, teamData, config) => {
  // Special handling for pivot
  if (activityKey === 'pivot') {
    const minInterviews = activity.requires?.minInterviews || 2;
    const minRound = activity.requires?.minRound || 2;

    const currentInterviews = (teamData.interviewCount || 0);
    const currentRound = (teamData.round || 1);

    if (currentRound < minRound) {
      return {
        unlocked: false,
        reason: `Available from round ${minRound}`,
      };
    }

    if (currentInterviews < minInterviews) {
      return {
        unlocked: false,
        reason: `Requires ${minInterviews}+ customer interviews first`,
      };
    }

    // Check if already pivoted this round - prevent multiple pivots per round
    const lastPivotRound = teamData.lastPivotRound || teamData.pivotHistory?.[teamData.pivotHistory.length - 1]?.round;
    if (lastPivotRound === currentRound) {
      return {
        unlocked: false,
        reason: 'Already pivoted this round',
      };
    }

    return { unlocked: true };
  }

  // Check grant eligibility based on employment status
  if (isResearchMode && !isGrantEligible(teamData.employmentStatus || 'university', activityKey)) {
    return {
      unlocked: false,
      reason: '🏛️ Requires university affiliation (you left!)',
    };
  }

  if (activity.requiresActivity) {
    const requiredActivities = Array.isArray(activity.requiresActivity)
      ? activity.requiresActivity
      : [activity.requiresActivity];

    const hasRequired = requiredActivities.some(
      (req) =>
        teamData.completedActivities?.includes(req) || teamData.activities?.[req]
    );

    if (!hasRequired) {
      return {
        unlocked: false,
        reason:
          `Requires: ${
            config.activities[requiredActivities[0]]?.name || requiredActivities[0]
          }`,
      };
    }
  }

  if (activity.requiresInterviews) {
    const totalInterviews =
      (teamData.interviewCount || 0) +
      (teamData.activities?.customerInterviews ? 1 : 0);
    if (totalInterviews < activity.requiresInterviews) {
      return {
        unlocked: false,
        reason: `Requires ${activity.requiresInterviews} customer interviews first`,
      };
    }
  }

  if (activity.requiresRound && (teamData.round || 1) < activity.requiresRound) {
    return {
      unlocked: false,
      reason: `Available from round ${activity.requiresRound}`,
    };
  }

  return { unlocked: true };
};

// Check if office is available
const isOfficeAvailable = (officeKey, officeOption, teamData) => {
  if (officeOption.requiresActivity) {
    const hasRequired =
      teamData.completedActivities?.includes(officeOption.requiresActivity) ||
      teamData.activities?.[officeOption.requiresActivity];
    if (!hasRequired) {
      return {
        available: false,
        reason: `Requires: ${
          GAME_CONFIG.activities[officeOption.requiresActivity]?.name ||
          officeOption.requiresActivity
        }`,
      };
    }
  }
  return { available: true };
};

// ============================================
// EMPLOYMENT STATUS HELPERS (University Dilemma)
// ============================================
const getAvailableHours = (status, founderCount) => {
  const baseHours = {
    university: 500,
    parttime: 750,
    fulltime: 1000,
  }[status] || 500;
  return baseHours * founderCount;
};

const getFounderSalaryCost = (status, founderCount) => {
  const costPerFounder = {
    university: 0,
    parttime: 6000,
    fulltime: 12000,
  }[status] || 0;
  return costPerFounder * founderCount;
};

const hasLabAccess = (status) => {
  return status === 'university' || status === 'parttime';
};

const isGrantEligible = (status, activityId) => {
  const academicOnlyGrants = ['grantTakeoff'];
  if (!academicOnlyGrants.includes(activityId)) return true;
  return status !== 'fulltime';
};

const getEmploymentInvestorModifier = (status, round) => {
  if (status === 'fulltime') return 1;
  if (status === 'parttime') return 0;
  if (status === 'university' && round >= 3) return -1;
  return 0;
};

const employmentStatusConfig = {
  university: {
    id: 'university',
    name: 'University Employee',
    icon: '🏛️',
    hoursPerFounder: 500,
    salaryPerFounder: 0,
    features: ['Lab access (cheaper R&D)', 'NWO grants eligible', 'Job security'],
    drawbacks: ['Only 500 hrs/founder', 'Teaching duties', 'TTO oversight'],
  },
  parttime: {
    id: 'parttime',
    name: 'Part-time (Negotiated)',
    icon: '⚖️',
    hoursPerFounder: 750,
    salaryPerFounder: 6000,
    features: ['Lab access', 'NWO grants eligible', '750 hrs/founder'],
    drawbacks: ['€6,000/founder salary cost'],
    requiresActivity: 'universityExit',
  },
  fulltime: {
    id: 'fulltime',
    name: 'Full-time Founder',
    icon: '🚀',
    hoursPerFounder: 1000,
    salaryPerFounder: 12000,
    features: ['1000 hrs/founder', 'Investor Appeal +1', 'Full independence'],
    drawbacks: ['€12,000/founder salary', 'No lab access', 'No NWO grants'],
    requiresActivity: 'universityExit',
  },
};

// ============================================
// LAYOUT HELPERS
// ============================================
const SectionCard = ({ title, description, children, icon }) => (
  <section className="section-card">
    <div className="section-header">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {icon}
        <h2 className="section-title">{title}</h2>
      </div>
      {description && <p className="section-description">{description}</p>}
    </div>
    <div className="section-content">{children}</div>
  </section>
);

const StatTile = ({ label, value, sub, tone = "default" }) => {
  let toneClass = "stat-card";
  if (tone === "success") toneClass += " success";
  if (tone === "danger") toneClass += " danger";
  if (tone === "warning") toneClass += " warning";

  // Check if value contains currency symbol
  const isMoney = typeof value === 'string' && value.includes('€');
  const valueStyle = isMoney ? { color: '#22c55e', fontWeight: '800' } : {};

  return (
    <div className={toneClass}>
      <p className="stat-label">{label}</p>
      <p className="stat-value" style={valueStyle}>{value}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  );
};

// ============================================
// RESEARCH MODE: PROFILE SELECTION COMPONENT
// ============================================
const ProfileSelection = ({ config, selectedProfiles, onProfilesChange, founderCount }) => {
  const profiles = config.founderProfiles;

  const handleProfileSelect = (index, profileId) => {
    const newProfiles = [...selectedProfiles];
    newProfiles[index] = profileId;
    onProfilesChange(newProfiles);
  };

  return (
    <SectionCard
      title="Founder Profiles"
      description="Each founder chooses their profile. Different combinations affect your team's strengths."
      icon={<Users size={20} />}
    >
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {Array.from({ length: founderCount }, (_, index) => index).map((index) => (
          <div
            key={index}
            style={{
              padding: "1.25rem",
              background: "linear-gradient(145deg, #0a0a0a, #141414)",
              borderRadius: "16px",
              border: "1px solid #262626",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                marginBottom: "1rem",
                color: "#e5e5e5",
                fontSize: "1.05rem",
                letterSpacing: "-0.01em"
              }}
            >
              Founder {index + 1}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "0.5rem",
              }}
            >
              {Object.entries(profiles).map(([id, profile]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleProfileSelect(index, id)}
                  style={{
                    padding: "1rem",
                    borderRadius: "12px",
                    border:
                      selectedProfiles[index] === id
                        ? "2px solid #c1fe00"
                        : "1px solid #262626",
                    background:
                      selectedProfiles[index] === id
                        ? "linear-gradient(145deg, rgba(193, 254, 0, 0.15), rgba(193, 254, 0, 0.05))"
                        : "linear-gradient(145deg, #050505, #0b0b0b)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    boxShadow: selectedProfiles[index] === id
                      ? "0 0 20px rgba(193, 254, 0, 0.3)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedProfiles[index] !== id) {
                      e.currentTarget.style.borderColor = "#404040";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedProfiles[index] !== id) {
                      e.currentTarget.style.borderColor = "#262626";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  <span
                    style={{
                      fontSize: "2rem",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {profile.icon}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: selectedProfiles[index] === id ? "#e5e5e5" : "#a3a3a3",
                      display: "block",
                      lineHeight: "1.3"
                    }}
                  >
                    {profile.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedProfiles.filter((p) => p).length === founderCount && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1.25rem",
            background: "linear-gradient(145deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))",
            borderRadius: "12px",
            border: "1px solid rgba(34, 197, 94, 0.3)",
          }}
        >
          <p
            style={{
              fontWeight: 700,
              color: "#22c55e",
              marginBottom: "0.75rem",
              fontSize: "0.95rem",
            }}
          >
            ✓ Team Composition Complete
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {selectedProfiles.map((profileId, i) => {
              const profile = profiles[profileId];
              return profile ? (
                <span
                  key={i}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "linear-gradient(145deg, #0a0a0a, #141414)",
                    border: "1px solid #262626",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    color: "#e5e5e5",
                    fontWeight: 500,
                  }}
                >
                  {profile.icon} {profile.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </SectionCard>
  );
};

// ============================================
// RESEARCH MODE: LICENCE SELECTION COMPONENT
// ============================================
const LicenceSelection = ({
  config,
  selectedLicence,
  onLicenceChange,
  isUnlocked,
}) => {
  const licences = config.licenceOptions;

  if (!isUnlocked) {
    return (
      <SectionCard
        title="University Licence Agreement"
        description="You need to meet with the TTO and complete licence negotiation first."
        icon={<Lock size={20} />}
      >
        <div
          style={{
            padding: "3rem 2rem",
            textAlign: "center",
            background: "linear-gradient(145deg, #0a0a0a, #141414)",
            borderRadius: "16px",
            border: "1px solid #262626",
            color: "#a3a3a3",
          }}
        >
          <Lock size={40} style={{
            margin: "0 auto 1.5rem",
            opacity: 0.6,
            color: "#737373",
            display: 'block'
          }} />
          <p style={{
            fontSize: "0.95rem",
            lineHeight: "1.6",
            maxWidth: "400px",
            margin: "0 auto"
          }}>
            Complete <strong style={{ color: "#c1fe00" }}>"TTO: Initial Discussion"</strong> and <strong style={{ color: "#c1fe00" }}>"Licence Agreement"</strong> activities to unlock this section.
          </p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="University Licence Agreement"
      description="Choose your licence terms with the university. This affects your cash flow and investor appeal."
      icon={<Briefcase size={20} />}
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        {Object.entries(licences).map(([id, licence]) => {
          const isSelected = selectedLicence === id;
          const impactColor =
            licence.cashFlowImpact === "high"
              ? "#ef4444"
              : licence.cashFlowImpact === "medium"
              ? "#f59e0b"
              : "#22c55e";

          return (
            <button
              key={id}
              type="button"
              onClick={() => onLicenceChange(id)}
              style={{
                padding: "1rem",
                borderRadius: "12px",
                border: isSelected
                  ? "2px solid #7c3aed"
                  : "1px solid #e2e8f0",
                backgroundColor: isSelected ? "#f3e8ff" : "white",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: 600, color: "#334155" }}>
                  {licence.name}
                </span>
                <span
                  style={{
                    padding: "0.125rem 0.5rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    backgroundColor: impactColor + "20",
                    color: impactColor,
                    fontWeight: 500,
                  }}
                >
                  {licence.cashFlowImpact === "high"
                    ? "High impact"
                    : licence.cashFlowImpact === "medium"
                    ? "Medium impact"
                    : licence.cashFlowImpact === "none"
                    ? "No cash impact"
                    : "Low impact"}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#64748b",
                  marginBottom: "0.5rem",
                }}
              >
                {licence.description}
              </p>
              {isSelected && (
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "#7c3aed",
                    fontStyle: "italic",
                    marginTop: "0.5rem",
                    padding: "0.5rem",
                    backgroundColor: "#faf5ff",
                    borderRadius: "6px",
                  }}
                >
                  💡 {licence.explanation}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
};

// ============================================
// RESEARCH MODE: TEAM DIVERSITY EVENT COMPONENT
// ============================================
const TeamDiversityEvent = ({
  config,
  teamProfiles,
  hiredProfiles,
  onDismiss,
  onHire,
}) => {
  const event = config.teamDiversityEvent;
  const profiles = config.founderProfiles;

  const allProfiles = [...(teamProfiles || []), ...(hiredProfiles || [])];
  const technicalCount = allProfiles.filter(
    (p) => p === "scientist" || p === "product"
  ).length;
  const businessCount = allProfiles.filter(
    (p) => p === "business" || p === "market"
  ).length;
  const operationsCount = allProfiles.filter((p) => p === "operations").length;

  let eventType = "wellBalanced";
  if (technicalCount >= 2 && businessCount === 0) {
    eventType = "allTechnical";
  } else if (businessCount === 0 && technicalCount > 0) {
    eventType = "missingCustomer";
  } else if (operationsCount === 0 && allProfiles.length >= 2) {
    eventType = "missingOperations";
  }

  const eventData = event[eventType];
  const severityColors = {
    warning: { bg: "#fef3c7", border: "#fcd34d", text: "#92400e" },
    info: { bg: "#e0f2fe", border: "#7dd3fc", text: "#075985" },
    success: { bg: "#dcfce7", border: "#86efac", text: "#166534" },
  };
  const colors = severityColors[eventData.severity];

  const missingProfiles = [];
  if (businessCount === 0) missingProfiles.push("business");
  if (!allProfiles.includes("market")) missingProfiles.push("market");
  if (operationsCount === 0) missingProfiles.push("operations");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: colors.bg,
            borderBottom: `1px solid ${colors.border}`,
            borderRadius: "16px 16px 0 0",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: colors.text,
              marginBottom: "0.5rem",
            }}
          >
            {eventData.title}
          </h2>
          <p style={{ color: colors.text, opacity: 0.9 }}>
            {eventData.message}
          </p>
        </div>

        <div style={{ padding: "1.5rem" }}>
          <p
            style={{
              fontWeight: 600,
              marginBottom: "0.75rem",
              color: "#334155",
            }}
          >
            💡 {eventData.recommendation}
          </p>

          {missingProfiles.length > 0 && eventType !== "wellBalanced" && (
            <>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#64748b",
                  marginBottom: "1rem",
                }}
              >
                Consider hiring one of these profiles:
              </p>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {missingProfiles.map((profileId) => {
                  const profile = profiles[profileId];
                  const alreadyHired = hiredProfiles?.includes(profileId);
                  return (
                    <button
                      key={profileId}
                      onClick={() => !alreadyHired && onHire(profileId)}
                      disabled={alreadyHired}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        backgroundColor: alreadyHired ? "#f1f5f9" : "white",
                        cursor: alreadyHired ? "default" : "pointer",
                        opacity: alreadyHired ? 0.6 : 1,
                        textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>{profile.icon}</span>
                      <div>
                        <span
                          style={{ fontWeight: 500, color: "#334155" }}
                        >
                          {profile.name}
                        </span>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            color: "#64748b",
                          }}
                        >
                          {alreadyHired
                            ? "Already hired"
                            : "Click to hire (costs 60h + salary)"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <button
            onClick={onDismiss}
            style={{
              width: "100%",
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#7c3aed",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {eventType === "wellBalanced"
              ? "Great, continue!"
              : "I understand, continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// GROUPED ACTIVITIES COMPONENT
// ============================================
const GroupedActivities = ({
  config,
  activities,
  onToggle,
  teamData,
  juniorHires,
  onJuniorHiresChange,
}) => {
  const sections = config.activitySections || [];

  const getSectionIcon = (sectionId) => {
    const icons = {
      discovery: <Target size={18} />,
      experts: <Users size={18} />,
      market: <PieChart size={18} />,
      operations: <Briefcase size={18} />,
      ip: <Lock size={18} />,
      tto: <Briefcase size={18} />,
      funding: <PieChart size={18} />,
      team: <Users size={18} />,
      development: <Beaker size={18} />,
      strategy: <Target size={18} />,
    };
    return icons[sectionId] || null;
  };

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <SectionCard
        title="Hiring"
        description="Grow your team. New hires cost time to onboard and add to payroll."
        icon={<Users size={20} />}
      >
        <div className="activity-card" style={{ marginBottom: 0 }}>
          <div className="activity-content">
            <p className="activity-name">Hire Team Members</p>
            <div className="activity-cost">
              <span>40 h per hire</span>
              <span>+ ongoing salary</span>
            </div>
            <p className="activity-requirement">
              New hires will be on your payroll from next round.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <label className="form-label mb-0">Number this round</label>
              <input
                type="number"
                min="0"
                max="5"
                className="form-input"
                style={{ maxWidth: "100px" }}
                value={juniorHires}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onJuniorHiresChange(
                    Number.isNaN(val) ? 0 : Math.max(0, val)
                  );
                }}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {sections.map((section) => {
        const sectionActivities = section.activities
          .filter((key) => config.activities[key])
          .map((key) => ({ key, ...config.activities[key] }));

        if (sectionActivities.length === 0) return null;

        return (
          <SectionCard
            key={section.id}
            title={section.title}
            description={section.description}
            icon={getSectionIcon(section.id)}
          >
            <div className="activities-grid">
              {sectionActivities.map(({ key, ...activity }) => {
                const checked = activities[key] || false;
                const unlockStatus = isActivityUnlocked(
                  key,
                  activity,
                  teamData,
                  config
                );
                const isLocked = !unlockStatus.unlocked;
                const isCompletedOneTime = activity.oneTimeOnly && (teamData.completedActivities?.includes(key) || false);
                const cannotUncheck = activity.oneTimeOnly && checked;
                const isPivot = key === 'pivot';

                return (
                  <label
                    key={key}
                    className={
                      "activity-card" +
                      (checked && !isLocked ? " checked" : "") +
                      (isLocked ? " opacity-60" : "") +
                      (isCompletedOneTime ? " opacity-75" : "") +
                      (isPivot ? " pivot-activity" : "")
                    }
                    style={{
                      cursor: isLocked || cannotUncheck ? "not-allowed" : "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked && !isLocked}
                      disabled={isLocked || cannotUncheck}
                      onChange={() => {
                        if (!isLocked && !cannotUncheck) {
                          onToggle(key);
                        }
                      }}
                      className="activity-checkbox"
                    />
                    <div className="activity-content">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {isLocked ? (
                          <Lock size={14} />
                        ) : (
                          <Unlock size={14} style={{ opacity: 0.3 }} />
                        )}
                        <p className="activity-name">{activity.name}</p>
                      </div>
                      <div className="activity-cost">
                        <span>{activity.costTime} h</span>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>€{activity.costMoney.toLocaleString()}</span>
                        {activity.stickerCost !== undefined && activity.stickerCost > 0 && (
                          <span
                            className={`sticker-badge ${
                              activity.stickerCost === 2 ? 'heavy-activity' : 'standard-activity'
                            }`}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: activity.stickerCost === 2 ? 'rgba(220, 38, 38, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: activity.stickerCost === 2 ? '#fca5a5' : '#fbbf24',
                              border: `1px solid ${activity.stickerCost === 2 ? 'rgba(220, 38, 38, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                            }}
                          >
                            {'•'.repeat(activity.stickerCost)} sticker{activity.stickerCost !== 1 ? 's' : ''}
                          </span>
                        )}
                        {activity.stickerCost === 0 && (
                          <span className="hours-only-badge">
                            ⏱️ hours only
                          </span>
                        )}
                      </div>
                      {activity.description && (
                        <p
                          className="activity-requirement"
                          style={{ opacity: 0.8 }}
                        >
                          {activity.description}
                        </p>
                      )}
                      {isLocked && (
                        <p
                          className="activity-requirement"
                          style={{ color: "#dc2626" }}
                        >
                          🔒 {unlockStatus.reason}
                        </p>
                      )}
                      {activity.oneTimeOnly && checked && (
                        <p
                          className="activity-requirement"
                          style={{ color: "#22c55e", fontWeight: 600 }}
                        >
                          ✓ One-time activity completed
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
};

// ============================================
// LOADING SCREEN
// ============================================
const LoadingScreen = () => (
  <Shell currentRound={0}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "4px solid #262626",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "1rem",
        }}
      />
      <p style={{ color: "#9ca3af" }}>Loading your game session…</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </Shell>
);


// ============================================
// EMPLOYMENT STATUS SELECTOR COMPONENT
// ============================================
const EmploymentStatusSelector = ({
  currentStatus,
  onStatusChange,
  completedActivities = [],
  currentRound,
  founders,
  cash,
  hoursUsed,
}) => {
  const statuses = Object.values(employmentStatusConfig);

  const canSelectStatus = (status) => {
    if (!status.requiresActivity) return true;
    return completedActivities.includes(status.requiresActivity);
  };

  const canAffordStatus = (status) => {
    const cost = status.salaryPerFounder * founders;
    return cash >= cost || status.salaryPerFounder === 0;
  };

  const maxHours = getAvailableHours(currentStatus, founders);
  const isOverHours = hoursUsed > maxHours;
  const percentage = Math.min(100, (hoursUsed / maxHours) * 100);

  return (
    <SectionCard
      title="University Employment Status"
      description="Your employment status affects available time, costs, and opportunities."
      icon={<Briefcase size={20} />}
    >
      {/* Hours Meter */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '10px',
        padding: '1rem',
        marginBottom: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          color: '#94a3b8',
        }}>
          <span>⏱️ Hours Used This Round</span>
          <span style={{ color: isOverHours ? '#ef4444' : '#e2e8f0', fontWeight: isOverHours ? 700 : 400 }}>
            {hoursUsed} / {maxHours} hours
          </span>
        </div>
        <div style={{
          height: '10px',
          background: 'rgba(99, 102, 241, 0.2)',
          borderRadius: '5px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(100, percentage)}%`,
            background: isOverHours ? 'linear-gradient(90deg, #ef4444, #dc2626)' :
                       percentage > 80 ? 'linear-gradient(90deg, #f59e0b, #eab308)' :
                       'linear-gradient(90deg, #6366f1, #8b5cf6)',
            borderRadius: '5px',
            transition: 'width 0.3s ease',
          }} />
        </div>
        {isOverHours && (
          <p style={{
            margin: '0.75rem 0 0 0',
            padding: '0.75rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            fontSize: '0.8125rem',
          }}>
            ⚠️ You're exceeding available hours! Consider changing employment status or removing activities.
          </p>
        )}
      </div>

      {/* Status Options */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        {statuses.map(status => {
          const isSelected = currentStatus === status.id;
          const canSelect = canSelectStatus(status) && canAffordStatus(status);
          const salaryTotal = status.salaryPerFounder * founders;

          return (
            <button
              key={status.id}
              type="button"
              onClick={() => canSelect && onStatusChange(status.id)}
              disabled={!canSelect}
              style={{
                padding: '1rem',
                borderRadius: '12px',
                border: isSelected ? '2px solid #7c3aed' : '2px solid rgba(99, 102, 241, 0.2)',
                background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                cursor: canSelect ? 'pointer' : 'not-allowed',
                opacity: canSelect ? 1 : 0.5,
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{status.icon}</span>
                <span style={{ fontWeight: 600, color: '#e2e8f0', flex: 1 }}>{status.name}</span>
                {isSelected && (
                  <span style={{
                    background: '#22c55e',
                    color: 'white',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}>✓</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', borderTop: '1px solid rgba(99, 102, 241, 0.1)', borderBottom: '1px solid rgba(99, 102, 241, 0.1)', padding: '0.5rem 0' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24' }}>
                    {'•'.repeat(RESEARCH_CONFIG.stickerSystem[status.id]?.allowance || 0)}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase' }}>stickers</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>{status.hoursPerFounder * founders}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase' }}>hrs/round</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>
                    {salaryTotal > 0 ? `€${salaryTotal.toLocaleString()}` : 'Free'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase' }}>salary</div>
                </div>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                {status.features.map((f, i) => (
                  <div key={i} style={{ fontSize: '0.75rem', color: '#4ade80', marginBottom: '0.25rem' }}>✅ {f}</div>
                ))}
              </div>

              <div>
                {status.drawbacks.map((d, i) => (
                  <div key={i} style={{ fontSize: '0.75rem', color: '#fbbf24', marginBottom: '0.25rem' }}>⚠️ {d}</div>
                ))}
              </div>

              {status.requiresActivity && !completedActivities.includes(status.requiresActivity) && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: '#f87171',
                  textAlign: 'center',
                }}>
                  🔒 Complete "University Exit Discussion" first
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Late university warning */}
      {currentStatus === 'university' && currentRound >= 3 && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '10px',
          color: '#fbbf24',
          fontSize: '0.875rem',
        }}>
          ⚠️ <strong>Investor Concern:</strong> You're still at the university in Round {currentRound}.
          Some investors may question your commitment. Consider transitioning to full-time. (Investor Appeal -1)
        </div>
      )}
    </SectionCard>
  );
};

// ============================================
// MAIN TEAM GAME FORM COMPONENT
// ============================================
const TeamGameForm = ({ config, initialData, onReset }) => {
  const [teamName, setTeamName] = useState(initialData?.teamName || "");
  const [founders, setFounders] = useState(initialData?.founders || (isResearchMode ? 3 : 4));
  const [office, setOffice] = useState(initialData?.office || (isResearchMode ? "university" : "attic"));
  const [legalForm, setLegalForm] = useState(initialData?.legalForm || null);
  const [activities, setActivities] = useState({});
  const [currentRound, setCurrentRound] = useState(initialData?.currentRound || 1);
  const [juniorHires, setJuniorHires] = useState(0);
  const [showReport, setShowReport] = useState(initialData?.showReport || false);
  const [formError, setFormError] = useState("");
  const [ideaConfirmed, setIdeaConfirmed] = useState(initialData?.ideaConfirmed || false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [shownEvents, setShownEvents] = useState(new Set(initialData?.shownEvents || []));
  const [showEndGameScore, setShowEndGameScore] = useState(false);
  const totalRounds = config.gameInfo.totalRounds;
const startingCapital = config.gameInfo.startingCapital;
 
  // Research mode specific state
  const [teamProfiles, setTeamProfiles] = useState(initialData?.teamProfiles || ["", "", ""]);
  const [licenceAgreement, setLicenceAgreement] = useState(initialData?.licenceAgreement || null);
  const [hiredProfiles, setHiredProfiles] = useState(initialData?.hiredProfiles || []);
  const [showDiversityEvent, setShowDiversityEvent] = useState(false);
  const [diversityEventSeen, setDiversityEventSeen] = useState(initialData?.diversityEventSeen || false);
  const [employmentStatus, setEmploymentStatus] = useState(initialData?.employmentStatus || initialData?.teamData?.employmentStatus || 'university');

  // Pivot state
  const [showPivotModal, setShowPivotModal] = useState(false);
  const [pivotHistory, setPivotHistory] = useState(initialData?.pivotHistory || []);

  const [startupIdea, setStartupIdea] = useState(initialData?.startupIdea || {
    technique: "",
    productIdea: "",
    problem: "",
    segment: "",
  });

  const [funding, setFunding] = useState({
    revenue: "",
    subsidy: "",
    subsidyFee: "",
    investment: "",
    investorEquity: "",
    loan: "",
    loanInterest: "",
  });

  const [teamData, setTeamData] = useState(initialData?.teamData || {
  cash: config.gameInfo.startingCapital,
  phase: 1,
  employees: 0,
  hasSenior: false,
  seniorUnlocked: false,
  completedActivities: [],
  trl: config.gameInfo.startingTRL || 3,
  investorEquity: 0,  // Track cumulative equity given away
});
// ============================================
  // EVENT SYSTEM - Check and trigger events
  // ============================================
  const checkAndTriggerEvents = useCallback(
  (context) => {
    console.log("checkAndTriggerEvents called with:", context);
    console.log("config.gameEvents:", config.gameEvents);
    if (!config?.gameEvents) return;

    for (const [eventId, eventConfig] of Object.entries(config.gameEvents)) {
      if (shownEvents.has(eventId)) continue;

      if (checkEventTrigger(eventConfig, context)) {
        setActiveEvent({ id: eventId, ...eventConfig });
        setShownEvents((prev) => new Set([...prev, eventId]));
        break;
      }
    }
  },
  [config.gameEvents, shownEvents]
);
  const licenceUnlocked =
    teamData.completedActivities?.includes("licenceNegotiation") ||
    activities.licenceNegotiation;

  const progress = calculateProgress(
    {
      ...teamData,
      office,
      activities,
      founders,
      round: currentRound,
      legalForm,
      juniorHiresThisRound: juniorHires,
      funding,
      teamProfiles,
      licenceAgreement,
      hiredProfiles,
      employmentStatus,
    },
    config
  );

  // Save session whenever important state changes
useEffect(() => {
    if (teamName) {
      saveSession({
        teamName,
        founders,
        office,
        legalForm,
        currentRound,
        showReport,
        ideaConfirmed,
        teamProfiles,
        licenceAgreement,
        hiredProfiles,
        diversityEventSeen,
        startupIdea,
        teamData,
        shownEvents: Array.from(shownEvents),
        employmentStatus,
      });
    }
}, [
  teamName,
  founders,
  office,
  legalForm,
  currentRound,
  showReport,
  ideaConfirmed,
  teamProfiles,
  licenceAgreement,
  hiredProfiles,
  diversityEventSeen,
  startupIdea,
  teamData,
  shownEvents,
  employmentStatus,
]);
// Check for round-start events
useEffect(() => {
  if (currentRound > 0 && ideaConfirmed && !showReport) {
    checkAndTriggerEvents({
      currentRound,
      isRoundStart: true,
      validations: teamData?.validationCount || 0,
      interviews: teamData?.interviewCount || 0,
      cash: teamData?.cash || startingCapital,
      founderEquity: 100 - (progress?.investorEquity || 0),
    });
  }
}, [
  currentRound,
  ideaConfirmed,
  showReport,
  teamData,
  progress,
  checkAndTriggerEvents,
  shownEvents,
  startingCapital     // REQUIRED
]);

// Check for end game score display - wait for facilitator release
useEffect(() => {
// Only listen when game is complete and showing report
if (currentRound === totalRounds && showReport) {
const gameId = getGameId();
  // Listen for facilitator to release scores
  const unsubscribe = onSnapshot(
    doc(db, "games", gameId, "settings", "game"),
    (docSnap) => {
      if (docSnap.exists() && docSnap.data().scoresReleased) {
        setShowEndGameScore(true);
      }
    },
    (error) => {
      console.error("Error listening for score release:", error);
    }
  );
  
  return () => unsubscribe();
}
}, [currentRound, showReport, totalRounds]);
  useEffect(() => {
    if (
      isResearchMode &&
      currentRound === 2 &&
      !diversityEventSeen &&
      ideaConfirmed &&
      !showReport
    ) {
      setShowDiversityEvent(true);
    }
}, [
  currentRound,
  diversityEventSeen,
  ideaConfirmed,
  showReport,
]);

  const handleActivityToggle = (activityKey) => {
    // Special handling for pivot
    if (activityKey === 'pivot') {
      // Show confirmation modal instead of just toggling
      if (!activities[activityKey]) {
        setShowPivotModal(true);
      } else {
        // Deselecting pivot - just toggle off
        setActivities(prev => ({
          ...prev,
          [activityKey]: false,
        }));
      }
      return;
    }

    setActivities((prev) => {
      const newActivities = {
        ...prev,
        [activityKey]: !prev[activityKey],
      };

      // Check for activity-triggered events when activity is enabled
      if (newActivities[activityKey]) {
        const activity = config.activities[activityKey];
        if (activity?.triggersEvent && config.gameEvents) {
          const eventConfig = config.gameEvents[activity.triggersEvent];
          if (eventConfig && !shownEvents.has(activity.triggersEvent)) {
            // Delay slightly so the checkbox updates first
            setTimeout(() => {
              setActiveEvent({ id: activity.triggersEvent, ...eventConfig });
              setShownEvents(prev => new Set([...prev, activity.triggersEvent]));
            }, 300);
          }
        }
      }

      return newActivities;
    });
  };

  const handlePivotConfirm = (pivotData) => {
    // Record the pivot
    const newPivotRecord = {
      round: currentRound,
      ...pivotData,
      timestamp: new Date().toISOString(),
    };

    setPivotHistory(prev => [...prev, newPivotRecord]);

    // Select the pivot activity
    setActivities(prev => ({
      ...prev,
      pivot: true,
    }));

    setShowPivotModal(false);
  };

  const handlePivotCancel = () => {
    setShowPivotModal(false);
  };

  const handleHireProfile = (profileId) => {
    if (!hiredProfiles.includes(profileId)) {
      setHiredProfiles((prev) => [...prev, profileId]);
    }
  };

  const handleSubmit = () => {
    if (!teamName) {
      setFormError("Fill in your team name first.");
      return;
    }

    setFormError("");

    const newCompletedActivities = [...(teamData.completedActivities || [])];
    Object.keys(activities).forEach((key) => {
      if (activities[key] && !newCompletedActivities.includes(key)) {
        newCompletedActivities.push(key);
      }
    });

    let employees = teamData.employees || 0;
    let hasSenior = teamData.hasSenior || false;
    let seniorUnlocked = teamData.seniorUnlocked || false;

    if (activities.networking && currentRound >= 3) {
      seniorUnlocked = true;
    }

    if (juniorHires > 0) {
      employees += juniorHires;
    }

    if (hiredProfiles.length > (teamData.hiredProfiles?.length || 0)) {
      employees +=
        hiredProfiles.length - (teamData.hiredProfiles?.length || 0);
    }

    if (activities.hireSenior && seniorUnlocked) {
      hasSenior = true;
    }
    const previousInvestorEquity = teamData.investorEquity || 0;
    const newEquityThisRound = Number(funding.investorEquity || 0);
    const totalInvestorEquity = previousInvestorEquity + newEquityThisRound;

    // Calculate stickers used this round
    const stickersUsedThisRound = Object.keys(activities).reduce((sum, activityKey) => {
      if (activities[activityKey]) {
        const activity = config.activities?.[activityKey];
        return sum + (activity?.stickerCost || 0);
      }
      return sum;
    }, 0);

    // Calculate total spending this round for achievement tracking
    const spendingThisRound = progress.totalMoneySpent || 0;

    // Apply pivot effects if pivot was selected
    let adjustedTRL = progress.currentTRL;
    let adjustedValidations = progress.validationsTotal;

    if (activities.pivot) {
      // Reduce TRL by 1 (minimum 3)
      adjustedTRL = Math.max(3, progress.currentTRL - 1);
      // Reset validations to 0
      adjustedValidations = 0;
      console.log(`Pivot: TRL reduced from ${progress.currentTRL} to ${adjustedTRL}, validations reset to 0`);
    }

    const newTeamData = {
  ...teamData,
  teamName,
  founders,
  employmentStatus,
  office,
  activities,
  round: currentRound,
  cash: progress.cash,
  startupIdea,
  legalForm,
  employees,
  hasSenior,
  seniorUnlocked,
  juniorHiresThisRound: juniorHires,
  funding: {
    ...funding,
    investorEquity: newEquityThisRound,  // Keep this round's input
  },
  investorEquity: totalInvestorEquity,  // Cumulative total at top level
  interviewCount: progress.interviewsTotal,
  validationCount: adjustedValidations,
  completedActivities: newCompletedActivities,
  trl: adjustedTRL,
  pivotHistory: [...(teamData.pivotHistory || []), ...pivotHistory],
  lastPivotRound: activities.pivot ? currentRound : teamData.lastPivotRound,

  // Achievement tracking fields
  wentNegative: (teamData.wentNegative || false) || progress.cash < 0,
  leftUniversityRound: teamData.leftUniversityRound ||
    (employmentStatus !== 'university' && teamData.employmentStatus === 'university' ? currentRound : null),
  totalStickersUsed: (teamData.totalStickersUsed || 0) + stickersUsedThisRound,
  maxSpendInRound: Math.max(teamData.maxSpendInRound || 0, spendingThisRound),
  pivotCount: (teamData.pivotCount || 0) + (activities.pivot ? 1 : 0),
  totalInvestment: (teamData.totalInvestment || 0) + Number(funding.investment || 0),
  totalRevenue: (teamData.totalRevenue || 0) + Number(funding.revenue || 0),
  loanInterest: Math.max(teamData.loanInterest || 0, Number(funding.loanInterest || 0)),
};

    if (isResearchMode) {
      newTeamData.teamProfiles = teamProfiles;
      newTeamData.licenceAgreement = licenceAgreement;
      newTeamData.hiredProfiles = hiredProfiles;
    }

    setTeamData(newTeamData);
    setShowReport(true);

    const gameId = getGameId();
    let oderId = localStorage.getItem("oderId");
    if (!oderId) {
      oderId = crypto.randomUUID();
      localStorage.setItem("oderId", oderId);
    }

    const roundData = {
      ...newTeamData,
      oderId,
      gameId,
      gameMode: config.gameMode,
      round: currentRound,
      submittedAt: serverTimestamp(),
      progress: calculateProgress(
        {
          ...newTeamData,
          office,
          activities,
          founders,
          round: currentRound,
          legalForm,
          juniorHiresThisRound: juniorHires,
          funding,
        },
        config
      ),
    };

    console.log("🔥 Attempting to save round data to Firestore:", {
      gameId,
      oderId,
      round: currentRound,
      path: `games/${gameId}/teams/${oderId}/rounds/${currentRound}`
    });

    setDoc(
      doc(db, "games", gameId, "teams", oderId, "rounds", String(currentRound)),
      roundData
    )
      .then(() => console.log("✅ Round data saved successfully"))
      .catch((err) => {
        console.error("❌ Firebase round save error:", err);
        console.error("Error code:", err.code);
        console.error("Error message:", err.message);
      });

    const teamDocData = {
      oderId,
      teamName: newTeamData.teamName,
      startupIdea: newTeamData.startupIdea,
      currentRound,
      gameMode: config.gameMode,
      lastUpdated: serverTimestamp(),
    };

    if (isResearchMode) {
      teamDocData.teamProfiles = newTeamData.teamProfiles || null;
      teamDocData.licenceAgreement = newTeamData.licenceAgreement || null;
    }

    console.log("🔥 Attempting to save team data to Firestore:", {
      gameId,
      oderId,
      path: `games/${gameId}/teams/${oderId}`,
      teamData: teamDocData
    });

    setDoc(doc(db, "games", gameId, "teams", oderId), teamDocData, {
      merge: true,
    })
      .then(() => console.log("✅ Team data saved successfully"))
      .catch((err) => {
        console.error("❌ Firebase team save error:", err);
        console.error("Error code:", err.code);
        console.error("Error message:", err.message);
      });
  };

  const startNextRound = async () => {
    const gameId = getGameId();
    const oderId = localStorage.getItem("oderId");

    if (oderId && gameId) {
      try {
        const reviewRef = doc(
          db,
          "games",
          gameId,
          "teams",
          oderId,
          "reviews",
          String(currentRound)
        );
        const reviewSnap = await getDoc(reviewRef);

        if (!reviewSnap.exists() || !reviewSnap.data().approved) {
          setFormError(
            "Please wait for facilitator approval before continuing to the next round."
          );
          return;
        }
      } catch (err) {
        console.error("Error checking approval:", err);
      }
    }

    setCurrentRound((prev) => prev + 1);
    setActivities({});
    setJuniorHires(0);
    setFunding({
      revenue: "",
      subsidy: "",
      subsidyFee: "",
      investment: "",
      investorEquity: "",
      loan: "",
      loanInterest: "",
    });
    setFormError("");
    setShowReport(false);
  };

  // ============================================
  // PRE-GAME SCREEN
  // ============================================
  if (!ideaConfirmed && currentRound === 1) {
    const profilesComplete =
      !isResearchMode || teamProfiles.every((p) => p !== "");
    const canStart =
      startupIdea.technique.trim() !== "" &&
      startupIdea.productIdea.trim() !== "" &&
      teamName.trim() !== "" &&
      founders > 0 &&
      profilesComplete;

    return (
      <Shell currentRound={0} onReset={onReset}>
        <SectionCard
          title="Team Information"
          description="Fill this in before the game starts."
        >
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Team name</label>
              <input
                type="text"
                className="form-input"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Purple Rockets"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Number of founders</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <button
                  type="button"
                  onClick={() => setFounders(Math.max(1, founders - 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    background: founders <= 1 ? '#f1f5f9' : 'white',
                    color: founders <= 1 ? '#94a3b8' : '#334155',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    cursor: founders <= 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  disabled={founders <= 1}
                  onMouseEnter={(e) => {
                    if (founders > 1) {
                      e.target.style.borderColor = '#6366f1';
                      e.target.style.background = '#f0f0ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (founders > 1) {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = 'white';
                    }
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="6"
                  value={founders}
                  onChange={(e) =>
                    setFounders(parseInt(e.target.value, 10) || 1)
                  }
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setFounders(Math.min(6, founders + 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    background: founders >= 6 ? '#f1f5f9' : 'white',
                    color: founders >= 6 ? '#94a3b8' : '#334155',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    cursor: founders >= 6 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  disabled={founders >= 6}
                  onMouseEnter={(e) => {
                    if (founders < 6) {
                      e.target.style.borderColor = '#6366f1';
                      e.target.style.background = '#f0f0ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (founders < 6) {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = 'white';
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </SectionCard>

        {isResearchMode && (
          <ProfileSelection
            config={config}
            selectedProfiles={teamProfiles}
            onProfilesChange={setTeamProfiles}
            founderCount={founders}
          />
        )}

        <SectionCard
          title={isResearchMode ? "Research Technology" : "Startup Idea"}
          description={
            isResearchMode
              ? "Describe the technology you're commercializing."
              : "Describe the technique you received and your initial idea."
          }
        >
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                {isResearchMode ? "Core Technology" : "Given technique"}
              </label>
              <input
                type="text"
                className="form-input"
                value={startupIdea.technique}
                onChange={(e) =>
                  setStartupIdea((prev) => ({
                    ...prev,
                    technique: e.target.value,
                  }))
                }
                placeholder={
                  isResearchMode
                    ? "e.g. CRISPR gene editing"
                    : "Short name of the technique"
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Product / Application</label>
              <input
                type="text"
                className="form-input"
                value={startupIdea.productIdea}
                onChange={(e) =>
                  setStartupIdea((prev) => ({
                    ...prev,
                    productIdea: e.target.value,
                  }))
                }
                placeholder="What are you building with this?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Customer problem</label>
              <input
                type="text"
                className="form-input"
                value={startupIdea.problem}
                onChange={(e) =>
                  setStartupIdea((prev) => ({
                    ...prev,
                    problem: e.target.value,
                  }))
                }
                placeholder="Which problem are you solving?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Target market</label>
              <input
                type="text"
                className="form-input"
                value={startupIdea.segment}
                onChange={(e) =>
                  setStartupIdea((prev) => ({
                    ...prev,
                    segment: e.target.value,
                  }))
                }
                placeholder="e.g. B2B: Pharmaceutical companies"
              />
            </div>
          </div>
        </SectionCard>

        {!canStart && (
          <div className="alert alert-warning" style={{ marginBottom: "1rem" }}>
            <div className="alert-content">
              <p className="alert-title">Almost there</p>
              <p className="alert-message">
                Fill in all required fields
                {isResearchMode
                  ? " and select all founder profiles"
                  : ""}{" "}
                before starting.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 pb-10">
          <button
            onClick={() => setIdeaConfirmed(true)}
            disabled={!canStart}
            className="btn btn-primary"
          >
            Start the game
          </button>
        </div>
      </Shell>
    );
  }

  // ============================================
  // REPORT SCREEN
  // ============================================
  if (showReport) {
    return (
      <Shell currentRound={currentRound} teamName={teamName} onReset={onReset}>
        {/* End Game Score Breakdown Modal */}
        {showEndGameScore && currentRound === config.gameInfo.totalRounds && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              backdropFilter: "blur(10px)",
              zIndex: 9999,
              overflowY: "auto",
              padding: "2rem",
            }}
          >
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <EndGameScoreBreakdown
                teamData={teamData}
                progress={progress}
                config={config}
              />
              <button
                onClick={() => setShowEndGameScore(false)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "1rem",
                  marginTop: "1rem",
                  background: "#7c3aed",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close Score Breakdown
              </button>
            </div>
          </div>
        )}
        <SectionCard
          title="Progress Report"
          description={`${teamName} - Round ${currentRound}`}
        >
          <div className="stats-grid">
            <StatTile
              label="Cash"
              value={`€${progress.cash.toLocaleString()}`}
              sub="After all expenses"
              tone={progress.cash < 0 ? "danger" : "success"}
            />
            {isResearchMode ? (
              <StatTile
                label="TRL Level"
                value={progress.currentTRL}
                sub={config.trlLevels[progress.currentTRL]}
                tone="default"
              />
            ) : (
              <StatTile
                label="Development hours"
                value={`${progress.developmentHours} h`}
                sub={`Phase ${progress.phase} progress ${progress.phaseProgress.toFixed(
                  1
                )}%`}
                tone="default"
              />
            )}
            <StatTile
              label="Investor Appeal"
              value={`${progress.investorAppeal}/5`}
              sub="How attractive to investors"
              tone={
                progress.investorAppeal >= 4
                  ? "success"
                  : progress.investorAppeal <= 2
                  ? "warning"
                  : "default"
              }
            />
            <StatTile
              label="Customer Validation"
              value={progress.validationsTotal}
              sub={`${progress.interviewsTotal} interviews done`}
              tone="default"
            />
          </div>

          <div className="summary-grid" style={{ marginTop: "2rem" }}>
            <div className="summary-item">
              <p className="summary-label">Costs this round</p>
              <p className="summary-value" style={{ color: '#22c55e', fontWeight: '800' }}>
                €{progress.totalMoneySpent.toLocaleString()}
              </p>
              {progress.totalSalaryCost > 0 && (
                <p className="summary-hint" style={{ color: '#22c55e', fontWeight: '600' }}>
                  Including €{progress.totalSalaryCost.toLocaleString()} salaries
                </p>
              )}
            </div>
            <div className="summary-item">
              <p className="summary-label">Time invested</p>
              <p className="summary-value">{progress.totalTimeSpent} hours</p>
              <p className="summary-hint">From activities and hiring</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Legal form</p>
              <p className="summary-value">
                {teamData.legalForm
                  ? config.legalForms[teamData.legalForm].name
                  : "Not chosen"}
              </p>
            </div>
          </div>

          {isResearchMode && teamData.licenceAgreement && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                backgroundColor: "#f3e8ff",
                borderRadius: "12px",
                border: "1px solid #c4b5fd",
              }}
            >
              <p
                className="summary-label"
                style={{ color: "#7c3aed" }}
              >
                University Licence
              </p>
              <p className="summary-value">
                {config.licenceOptions[teamData.licenceAgreement].name}
              </p>
              <p className="summary-hint">
                {config.licenceOptions[teamData.licenceAgreement].description}
              </p>
            </div>
          )}

          {progress.phase === 1 && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                borderRadius: "16px",
                border: "2px solid",
                borderColor: progress.canEnterPhase2 ? "#22c55e" : "#f97316",
                background: progress.canEnterPhase2
                  ? "linear-gradient(145deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))"
                  : "linear-gradient(145deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.05))",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                {progress.canEnterPhase2 ? (
                  <CheckCircle size={24} color="#22c55e" />
                ) : (
                  <AlertCircle size={24} color="#f97316" />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: progress.canEnterPhase2 ? "#22c55e" : "#f97316",
                    marginBottom: "0.75rem"
                  }}>
                    {config.labels.phaseGateTitle}
                  </p>
                  <ul
                    style={{
                      marginTop: "0.75rem",
                      listStyle: "none",
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem"
                    }}
                  >
                    {isResearchMode ? (
                      <>
                        <li style={{
                          color: "#e5e5e5",
                          fontSize: "0.95rem",
                          fontWeight: 500
                        }}>
                          TRL: <strong style={{ color: "#c1fe00" }}>{progress.currentTRL}/{config.phases.phase1.trlRequired}</strong>
                        </li>
                        <li style={{
                          color: "#e5e5e5",
                          fontSize: "0.95rem",
                          fontWeight: 500
                        }}>
                          Validations: <strong style={{ color: "#c1fe00" }}>{progress.validationsTotal}/1</strong>
                        </li>
                        <li style={{
                          color: "#e5e5e5",
                          fontSize: "0.95rem",
                          fontWeight: 500
                        }}>
                          Interviews: <strong style={{ color: "#c1fe00" }}>{progress.interviewsTotal}/2</strong>
                        </li>
                      </>
                    ) : (
                      <>
                        <li style={{
                          color: "#e5e5e5",
                          fontSize: "0.95rem",
                          fontWeight: 500
                        }}>
                          Development: <strong style={{ color: "#c1fe00" }}>{progress.developmentHours}/{config.phases.phase1.hoursRequired}h</strong>
                        </li>
                        <li style={{
                          color: "#e5e5e5",
                          fontSize: "0.95rem",
                          fontWeight: 500
                        }}>
                          Validations: <strong style={{ color: "#c1fe00" }}>{progress.validationsTotal}/1</strong>
                        </li>
                        <li style={{
                          color: "#e5e5e5",
                          fontSize: "0.95rem",
                          fontWeight: 500
                        }}>
                          Interviews: <strong style={{ color: "#c1fe00" }}>{progress.interviewsTotal}/4</strong>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {progress.cash < 0 && (
            <div className="alert alert-warning" style={{ marginTop: "1.5rem" }}>
              <div className="alert-content">
                <p className="alert-title">⚠️ Cash flow alert</p>
                <p className="alert-message">
                  You are below zero. Talk to the{" "}
                  {isResearchMode ? "funding" : "bank"} expert!
                </p>
              </div>
            </div>
          )}

          <div className="pt-4">
            {currentRound < config.gameInfo.totalRounds ? (
              <button
                onClick={startNextRound}
                className="btn btn-primary btn-full"
              >
                Continue to round {currentRound + 1}
              </button>
      ) : (
          <div className="text-center" style={{ padding: "1rem 0" }}>
            <p className="summary-label">🎉 Game complete!</p>
            {showEndGameScore ? (
              <>
                <p className="summary-hint">
                  Final scores are available!
                </p>
                <button
                  onClick={() => setShowEndGameScore(true)}
                  className="btn btn-primary"
                  style={{ marginTop: "1rem" }}
                >
                  View Score Breakdown
                </button>
              </>
            ) : (
              <div style={{ marginTop: "1rem" }}>
                <div style={{
                  display: "inline-block",
                  width: "24px",
                  height: "24px",
                  border: "3px solid #e2e8f0",
                  borderTopColor: "#7c3aed",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "0.75rem"
                }} />
                <p className="summary-hint">
                  ⏳ Waiting for facilitator to release final scores...
                </p>
                <p className="summary-hint" style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.7 }}>
                  Your score breakdown will appear automatically when released.
                </p>
              </div>
            )}
          </div>
        )}

            {formError && (
              <div
                className="alert alert-warning"
                style={{ marginTop: "1rem" }}
              >
                <div className="alert-content">
                  <p className="alert-title">Not yet approved</p>
                  <p className="alert-message">{formError}</p>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      </Shell>
    );
  }

  // ============================================
  // MAIN GAME FORM
  // ============================================
  return (
    <Shell currentRound={currentRound} teamName={teamName} onReset={onReset}>
      {activeEvent && (
        <GameEventPopup
          event={activeEvent}
          onDismiss={() => setActiveEvent(null)}
          onAction={(handler) => {
            console.log('Event action:', handler);
          }}
        />
      )}

      {showDiversityEvent && isResearchMode && (
        <TeamDiversityEvent
          config={config}
          teamProfiles={teamProfiles}
          hiredProfiles={hiredProfiles}
          onDismiss={() => {
            setShowDiversityEvent(false);
            setDiversityEventSeen(true);
          }}
          onHire={handleHireProfile}
        />
      )}

      {/* Pivot Confirmation Modal */}
      {showPivotModal && (
        <PivotReasonSelector
          onConfirm={handlePivotConfirm}
          onCancel={handlePivotCancel}
          currentTRL={teamData.trl || 3}
          validationCount={teamData.validationCount || 0}
        />
      )}

      <div className="stats-grid">
        <StatTile
          label="Cash Available"
          value={`€${progress.cash.toLocaleString()}`}
          sub={progress.cash < 0 ? "⚠️ Negative!" : "After expenses"}
          tone={progress.cash < 0 ? "danger" : "success"}
        />
        <StatTile
          label="Time This Round"
          value={`${progress.totalTimeSpent} h`}
          sub="From activities"
          tone={
            progress.totalTimeSpent > founders * 500 ? "warning" : "default"
          }
        />
        {isResearchMode && (
          <StatTile
            label="TRL Level"
            value={progress.currentTRL}
            sub={
              (config.trlLevels[progress.currentTRL] || "")
                .substring(0, 30) + "..."
            }
            tone="default"
          />
        )}
        <StatTile
          label="Money Spent"
          value={`€${progress.totalMoneySpent.toLocaleString()}`}
          sub="This round"
          tone="default"
        />
      </div>

      {/* Resource Tracker (Research mode only) */}
      {isResearchMode && (
        <ResourceTracker
          employmentStatus={employmentStatus}
          founderCount={founders}
          hoursUsed={progress.totalTimeSpent}
        />
      )}

      {/* Employment Status (Research mode only) */}
      {isResearchMode && (
        <EmploymentStatusSelector
          currentStatus={employmentStatus}
          onStatusChange={setEmploymentStatus}
          completedActivities={teamData.completedActivities || []}
          currentRound={currentRound}
          founders={founders}
          cash={progress.cash}
          hoursUsed={progress.totalTimeSpent}
        />
      )}

      {/* Office selection */}
      <SectionCard
        title="Office / Workspace"
        description="Where does your team work? Some options require meeting experts first."
      >
        <div className="office-grid">
          {Object.entries(config.companyOffice).map(
            ([key, officeOption]) => {
              const selected = office === key;
              const availability = isOfficeAvailable(
                key,
                officeOption,
                teamData
              );
              const isLocked = !availability.available;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => !isLocked && setOffice(key)}
                  disabled={isLocked}
                  className={
                    "office-card hover-lift text-left" +
                    (selected ? " selected" : "")
                  }
                  style={{
                    opacity: isLocked ? 0.6 : 1,
                    cursor: isLocked ? "not-allowed" : "pointer",
                    borderColor: selected ? "#7c3aed" : undefined,
                  }}
                >
                  <div className="office-header">
                    <div className="office-name">
                      {isLocked && (
                        <Lock
                          size={14}
                          style={{ marginRight: "0.5rem" }}
                        />
                      )}
                      {officeOption.name}
                    </div>
                    <span className="office-badge" style={{
                      color: '#22c55e',
                      fontWeight: '700'
                    }}>
                      €{officeOption.cost}/round
                    </span>
                  </div>
                  {officeOption.description && (
                    <p className="text-sm text-slate-600 mb-2">
                      {officeOption.description}
                    </p>
                  )}
                  {isLocked && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#dc2626",
                        marginTop: "0.5rem",
                      }}
                    >
                      🔒 {availability.reason}
                    </p>
                  )}
                </button>
              );
            }
          )}
        </div>
      </SectionCard>

      {/* Legal form selection */}
      <SectionCard
        title="Legal Structure"
        description={
          isResearchMode
            ? "You need to meet with TTO first to discuss legal options."
            : "Visit the KVK expert to unlock legal form options."
        }
      >
        {activities.kvkConsult ||
        activities.ttoDiscussion ||
        teamData.completedActivities?.includes("kvkConsult") ||
        teamData.completedActivities?.includes("ttoDiscussion") ? (
          <div className="office-grid">
            {Object.entries(config.legalForms).map(([key, form]) => {
              const selected = legalForm === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLegalForm(key)}
                  className={
                    "office-card hover-lift text-left" +
                    (selected ? " selected" : "")
                  }
                >
                  <div className="office-header">
                    <div className="office-name">{form.name}</div>
                    <span className="office-badge">
                      {selected ? "Selected" : "Select"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    {form.shortDescription}
                  </p>
                  {form.salaryPerFounderHalfYear > 0 && (
                    <span className="office-feature negative">
                      €
                      {form.salaryPerFounderHalfYear.toLocaleString()}
                      /founder salary
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: "3rem 2rem",
              textAlign: "center",
              background: "linear-gradient(145deg, #0a0a0a, #141414)",
              borderRadius: "16px",
              border: "1px solid #262626",
              color: "#a3a3a3",
            }}
          >
            <Lock
              size={40}
              style={{
                margin: "0 auto 1.5rem",
                opacity: 0.6,
                color: "#737373",
                display: 'block'
              }}
            />
            <p style={{
              fontSize: "0.95rem",
              lineHeight: "1.6",
              marginBottom: "1rem"
            }}>
              Meet the <strong style={{ color: "#c1fe00" }}>{isResearchMode ? "TTO" : "KVK"} expert</strong> first to unlock this section.
            </p>
            <div style={{
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #262626"
            }}>
              <p style={{
                fontSize: "0.875rem",
                color: "#737373",
                marginBottom: "0.5rem"
              }}>
                Current:
              </p>
              <p style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: legalForm ? "#e5e5e5" : "#525252"
              }}>
                {legalForm
                  ? config.legalForms[legalForm].name
                  : "None"}
              </p>
            </div>
          </div>
        )}
      </SectionCard>

      {isResearchMode && (
        <LicenceSelection
          config={config}
          selectedLicence={licenceAgreement}
          onLicenceChange={setLicenceAgreement}
          isUnlocked={licenceUnlocked}
        />
      )}

      <GroupedActivities
        config={config}
        activities={activities}
        onToggle={handleActivityToggle}
        teamData={teamData}
        juniorHires={juniorHires}
        onJuniorHiresChange={setJuniorHires}
      />

      <SectionCard
        title="Funding & Revenue"
        description="Fill in only if you actually closed a deal this round."
      >
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Revenue this round</label>
            <input
              type="number"
              className="form-input"
              value={funding.revenue}
              onChange={(e) =>
                setFunding((prev) => ({
                  ...prev,
                  revenue: e.target.value,
                }))
              }
              placeholder="€"
              min="0"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              {isResearchMode ? "Grant received" : "Subsidy received"}
            </label>
            <input
              type="number"
              className="form-input"
              value={funding.subsidy}
              onChange={(e) =>
                setFunding((prev) => ({
                  ...prev,
                  subsidy: e.target.value,
                }))
              }
              placeholder="€"
              min="0"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Investment received</label>
            <input
              type="number"
              className="form-input"
              value={funding.investment}
              onChange={(e) =>
                setFunding((prev) => ({
                  ...prev,
                  investment: e.target.value,
                }))
              }
              placeholder="€"
              min="0"
            />
          </div>
          <div className="form-group">
  <label className="form-label">Equity given this round (%)</label>
  <input
    type="number"
    className="form-input"
    value={funding.investorEquity}
    onChange={(e) =>
      setFunding((prev) => ({
        ...prev,
        investorEquity: e.target.value,
      }))
    }
    placeholder="%"
    min="0"
    max={100 - (teamData.investorEquity || 0)}
  />
  {(teamData.investorEquity > 0 || Number(funding.investorEquity) > 0) && (
    <p style={{ 
      fontSize: '0.75rem', 
      color: '#64748b', 
      marginTop: '0.25rem' 
    }}>
      {teamData.investorEquity > 0 && (
        <span>Previously given: {teamData.investorEquity}% · </span>
      )}
      Total: {(teamData.investorEquity || 0) + Number(funding.investorEquity || 0)}% · 
      Founders retain: {100 - (teamData.investorEquity || 0) - Number(funding.investorEquity || 0)}%
    </p>
  )}
</div>
         <div className="form-group">
            <label className="form-label">Bank loan</label>
            <input
              type="number"
              className="form-input"
              value={funding.loan}
              onChange={(e) =>
                setFunding((prev) => ({
                  ...prev,
                  loan: e.target.value,
                }))
              }
              placeholder="€"
              min="0"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Loan interest (%)</label>
            <input
              type="number"
              className="form-input"
              value={funding.loanInterest}
              onChange={(e) =>
                setFunding((prev) => ({
                  ...prev,
                  loanInterest: e.target.value,
                }))
              }
              placeholder="%"
              min="0"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Round Summary"
        description="Review before submitting."
      >
        <div className="summary-grid">
          <div className="summary-item">
            <p className="summary-label">Time spent</p>
            <p className="summary-value">{progress.totalTimeSpent} h</p>
          </div>
          <div className="summary-item">
            <p className="summary-label">Money spent</p>
            <p className="summary-value">
              €{progress.totalMoneySpent.toLocaleString()}
            </p>
          </div>
          <div className="summary-item">
            <p className="summary-label">Cash after round</p>
            <p
              className="summary-value"
              style={{
                color: progress.cash < 0 ? "#dc2626" : "#16a34a",
              }}
            >
              €{progress.cash.toLocaleString()}
            </p>
          </div>
        </div>
      </SectionCard>

      {formError && (
        <div className="alert alert-warning" style={{ marginBottom: "1rem" }}>
          <div className="alert-content">
            <p className="alert-title">Error</p>
            <p className="alert-message">{formError}</p>
          </div>
        </div>
      )}

      <div className="pt-4 pb-10">
        <button onClick={handleSubmit} className="btn btn-primary btn-full">
          Submit Round {currentRound}
        </button>
      </div>
    </Shell>
  );
};

// ============================================
// MAIN APP EXPORT WITH SESSION RESTORE
// ============================================
export default function LaunchGame() {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      // First check localStorage
      const savedSession = loadSession();
      
      if (savedSession && savedSession.teamName) {
        // We have a local session, use it
        setInitialData(savedSession);
        setLoading(false);
        return;
      }

      // Check if we have an oderId but no local session (might have been cleared)
      const oderId = localStorage.getItem("oderId");
      const gameId = getGameId();

      if (oderId && gameId) {
        try {
          // Try to restore from Firebase
          const teamDoc = await getDoc(doc(db, "games", gameId, "teams", oderId));
          
          if (teamDoc.exists()) {
            const data = teamDoc.data();
            const currentRound = data.currentRound || 1;
            
            // Get the latest round data
            const roundDoc = await getDoc(
              doc(db, "games", gameId, "teams", oderId, "rounds", String(currentRound))
            );
            
            if (roundDoc.exists()) {
              const roundData = roundDoc.data();
              
              // Restore full session from Firebase
              const restoredData = {
                teamName: data.teamName,
                founders: roundData.founders || (isResearchMode ? 3 : 4),
                office: roundData.office,
                legalForm: roundData.legalForm,
                currentRound: currentRound,
                showReport: true, // They submitted, so show report
                ideaConfirmed: true,
                teamProfiles: data.teamProfiles || ["", "", ""],
                licenceAgreement: data.licenceAgreement,
                hiredProfiles: roundData.hiredProfiles || [],
                diversityEventSeen: currentRound >= 2,
                startupIdea: data.startupIdea || roundData.startupIdea,
                teamData: {
                  cash: roundData.progress?.cash || roundData.cash || GAME_CONFIG.gameInfo.startingCapital,
                  phase: roundData.phase || 1,
                  employees: roundData.employees || 0,
                  hasSenior: roundData.hasSenior || false,
                  seniorUnlocked: roundData.seniorUnlocked || false,
                  completedActivities: roundData.completedActivities || [],
                  trl: roundData.trl || roundData.progress?.currentTRL || 3,
                  interviewCount: roundData.interviewCount || roundData.progress?.interviewsTotal || 0,
                  validationCount: roundData.validationCount || roundData.progress?.validationsTotal || 0,
                },
              };
              
              setInitialData(restoredData);
              saveSession(restoredData); // Save to localStorage for faster future loads
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error("Error restoring from Firebase:", err);
        }
      }

      // No session found, start fresh
      setLoading(false);
    };

    restoreSession();
  }, []);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to start over? All progress will be lost.")) {
      clearSession();
      window.location.reload();
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return <TeamGameForm config={GAME_CONFIG} initialData={initialData} onReset={handleReset} />;
}