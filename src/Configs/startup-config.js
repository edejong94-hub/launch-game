// STARTUP GAME CONFIGURATION
// The original Launch Game for general startup simulation
// Steve Blank scope: Customer Discovery + Customer Validation only (first 2 years)

export const STARTUP_CONFIG = {
  gameMode: "startup",
  gameTitle: "Launch Game",
  gameDescription: "From idea to market — discover your customers, validate your solution.",

  // Round themes map to Steve Blank's Customer Development (steps 1 & 2 only)
  roundThemes: {
    1: { name: "Customer Discovery", description: "Get out of the building. Understand the problem. Who has it? Don't pitch yet." },
    2: { name: "Customer Discovery", description: "Refine your insight. Are you talking to the right people? Dig deeper." },
    3: { name: "Customer Validation", description: "Start pitching. Does anyone want to pay? Get real commitment." },
    4: { name: "Customer Validation", description: "Strengthen your case. Funding, structure, partners. Prove there's a market." },
  },

  gameInfo: {
    startingCapital: 10000,
    totalRounds: 4,
  },

  phases: {
    phase1: {
      name: "Idea & Validation",
      hoursRequired: 5000,
      customerValidationRequired: 2,
      minimumInterviews: 2,
    },
    phase2: {
      name: "Growth & Scale",
      hoursRequired: 10000,
    },
  },

  legalForms: {
    bv: {
      name: "BV",
      shortDescription: "Separate legal entity, founders on payroll, attractive for larger investors.",
      salaryPerFounderHalfYear: 12000,
      bankTrustBonus: 2,
      investorAppealBonus: 2,
    },
    vof: {
      name: "VOF",
      shortDescription: "Shared responsibility, no mandatory salaries, slightly less interesting for bigger players.",
      salaryPerFounderHalfYear: 0,
      bankTrustBonus: 0,
      investorAppealBonus: -1,
    },
    ez: {
      name: "EZ",
      shortDescription: "Single founder structure, flexible and suitable for smaller loans.",
      salaryPerFounderHalfYear: 0,
      bankTrustBonus: 1,
      investorAppealBonus: 0,
    },
  },

  // Activity sections for grouped display
  activitySections: [
    {
      id: "discovery",
      title: "Discovery & Validation",
      description: "Talk to (potential) customers and validate your idea before building.",
      activities: ["customerInterviews", "customerValidation", "pivot"],
    },
    {
      id: "experts",
      title: "Expert Meetings",
      description: "Meet experts to unlock new options and get professional advice.",
      activities: ["technicalCoach", "businessDeveloper", "legalAdvisor", "investorMeeting", "bankMeeting", "patentConsult", "subsidyAdvisor", "incubatorMeeting"],
    },
    {
      id: "market",
      title: "Market & Sales",
      description: "Build awareness and reach your target customers.",
      activities: ["marketing", "marketAnalysisDIY", "marketAnalysisOutsourced"],
    },
    {
      id: "operations",
      title: "Operations & Building",
      description: "Build your product and grow your team.",
      activities: ["productDevelopment", "seniorTechnicalPartner"],
    },
    {
      id: "ip",
      title: "Intellectual Property",
      description: "Protect your innovations. Requires patent expert meeting first.",
      activities: ["knowHowProtection", "patentOutsourced"],
    },
  ],

  activities: {
    // === DISCOVERY & VALIDATION ===
    customerInterviews: {
      name: "Customer Interviews",
      costTime: 32,
      costMoney: 0,
      category: "discovery",
      description: "Simulate talking to potential customers. Ask about their life and problems — not your solution. How would you do this conversation in real life?",
    },
    customerValidation: {
      name: "Customer Validation",
      costTime: 48,
      costMoney: 0,
      category: "discovery",
      description: "Get real commitment from customers — letter of intent, pre-order, or pilot agreement. Requires 2 customer interviews first. Only meaningful after understanding their problem.",
      requiresInterviews: 2,
    },
    pivot: {
      name: "Pivot",
      costTime: 32,
      costMoney: 0,
      category: "discovery",
      description: "Change direction based on what customers told you. A pivot is not failure — it's using evidence. Costs more time each round.",
      extraTimePerRound: 32,
    },

    // === EXPERT MEETINGS ===
    technicalCoach: {
      name: "Technical Coach",
      costTime: 32,
      costMoney: 0,
      category: "experts",
      description: "Your Technical Coach introduces the technology your startup is built around. Understand what you're working with, what's possible, and what protects it. Can later become a Senior Technical Partner.",
      unlocks: ["seniorTechnicalPartner", "patentConsult"],
    },
    businessDeveloper: {
      name: "Business Developer",
      costTime: 48,
      costMoney: 0,
      category: "experts",
      description: "Learn how to have real customer conversations. The Business Developer teaches you Customer Discovery (Steve Blank) — who your early adopters are, how to ask questions without pitching, and how to spot the difference between real interest and polite lies. Unlocks deeper market thinking.",
      networkBonus: 1,
      unlocks: ["seniorTechnicalPartner"],
    },
    legalAdvisor: {
      name: "Legal Advisor",
      costTime: 48,
      costMoney: 0,
      category: "experts",
      description: "Choose the right legal structure for your startup. Affects salary obligations, investor appeal, and bank trust. Visit before raising funding for the best terms.",
      unlocks: ["legalForm"],
    },
    investorMeeting: {
      name: "Investor Meeting",
      costTime: 32,
      costMoney: 0,
      category: "experts",
      description: "Pitch to investors and discuss equity funding. You can meet them at any time — but your readiness sheet will show exactly where you stand. Investors follow traction.",
      unlocks: ["investorFunding"],
    },
    bankMeeting: {
      name: "Bank Meeting",
      costTime: 32,
      costMoney: 0,
      category: "experts",
      description: "Discuss loans and credit facilities. Best terms require a legal structure in place. You can go without one — the bank will tell you what they need to see.",
      unlocks: ["loanApplication", "raboInnovatielening"],
    },
    loanApplication: {
      name: "Loan Application",
      costTime: 16,
      costMoney: 0,
      category: "experts",
      description: "Apply for a business loan. Requires a bank meeting first.",
      requiresActivity: "bankMeeting",
    },
    raboInnovatielening: {
      name: "Rabo Innovatie Lening",
      costTime: 24,
      costMoney: 0,
      category: "experts",
      description: "Apply for the Rabobank Innovation Loan — a special facility for innovative startups. Requires BV legal form and bank meeting.",
      requiresActivity: "bankMeeting",
      requirements: {
        legalForm: ["bv"],
      },
    },
    patentConsult: {
      name: "IP / Patent Expert",
      costTime: 32,
      costMoney: 0,
      category: "experts",
      description: "Understand how to protect the technology your startup is built on. IP protection increases investor confidence and can be a competitive moat.",
      unlocks: ["knowHowProtection", "patentOutsourced"],
    },
    subsidyAdvisor: {
      name: "Subsidy & Grant Advisor",
      costTime: 32,
      costMoney: 0,
      category: "experts",
      description: "Explore public funding paths — WBSO, innovation grants, regional schemes. Often works hand-in-hand with the incubator.",
      unlocks: ["subsidyApplication"],
    },
    incubatorMeeting: {
      name: "Incubator / Accelerator",
      costTime: 32,
      costMoney: 0,
      category: "experts",
      description: "Join an incubator program for office space, mentoring, and warm introductions to investors and grant advisors. A hub that connects multiple parts of your startup journey.",
      unlocks: ["incubatorOffice"],
    },

    // === MARKET & SALES ===
    marketing: {
      name: "Marketing & Awareness",
      costTime: 48,
      costMoney: 2000,
      category: "market",
      description: "Run campaigns to build brand awareness and generate leads. Most effective after validating who your early adopters actually are.",
      marketingBonus: 1,
    },
    marketAnalysisDIY: {
      name: "Market Analysis (DIY)",
      costTime: 160,
      costMoney: 0,
      category: "market",
      description: "Research your market yourself. Who are the early adopters? Where is the mainstream? Understand the chasm between the two. Takes time but builds real insight.",
    },
    marketAnalysisOutsourced: {
      name: "Market Analysis (Outsourced)",
      costTime: 8,
      costMoney: 10000,
      category: "market",
      description: "Hire experts to analyze your market quickly. Faster, but you learn less about your customers in the process.",
    },

    // === OPERATIONS & BUILDING ===
    productDevelopment: {
      name: "Product Development",
      costTime: 80,
      costMoney: 0,
      category: "operations",
      description: "Build and improve your product. Most valuable when you know what customers actually need — discovery first, building second.",
      developmentBonus: 1,
    },
    seniorTechnicalPartner: {
      name: "Senior Technical Partner",
      costTime: 32,
      costMoney: 0,
      category: "operations",
      description: "Your Technical Coach steps up as a Senior Technical Partner — contributing deeper expertise, potentially as a co-founder or key advisor. Requires the Technical Coach meeting and at least Round 3.",
      requiresActivity: "technicalCoach",
      requiresRound: 3,
    },

    // === INTELLECTUAL PROPERTY ===
    knowHowProtection: {
      name: "Know-How Protection",
      costTime: 32,
      costMoney: 2500,
      category: "ip",
      description: "Trade secrets, NDAs, and documentation. Faster and cheaper than a patent. Can upgrade to full patent later.",
      salesGradeBonus: 1,
      requiresActivity: "patentConsult",
      canUpgradeToPatent: true,
    },
    patentOutsourced: {
      name: "Patent Filing (Professional)",
      costTime: 8,
      costMoney: 10000,
      category: "ip",
      description: "Hire a patent attorney for full IP protection on your technology. Significantly boosts investor confidence.",
      salesGradeBonus: 2,
      requiresActivity: "patentConsult",
    },

    // === LAUNCHING CUSTOMER (Phase 2 only) ===
    launchingCustomer: {
      name: "Launching Customer Deal",
      costTime: 48,
      costMoney: 0,
      category: "experts",
      description: "Your first real customer is ready to buy. Close the deal — this is the moment your startup becomes a real business.",
      requiresPhase: 2,
    },
  },

  gameEvents: {
    seniorHint: {
      trigger: "roundStart",
      round: 3,
      title: "A familiar voice...",
      message: "Your Technical Coach reaches out: 'Your team has come a long way. I've been thinking — there might be a way I can contribute more deeply to what you're building. Let's talk.'",
      severity: "info",
      tips: ["Check your Technical Coach for new options this round."],
    },
    phase2Reached: {
      trigger: "metric",
      metric: "canEnterPhase2",
      comparison: "above",
      threshold: 0,
      title: "Phase 2: Growth & Scale",
      message: "Your Business Developer has exciting news: 'I've found someone who wants to be your launching customer. They've seen your validation work and they're serious. This could be your first real deal.'",
      severity: "success",
      tips: ["A new expert has appeared: Launching Customer", "Talk to your Business Developer about next steps"],
    },
  },

  companyOffice: {
    attic: {
      name: "Attic / Home",
      cost: 300,
      productivity: 0.9,
      description: "Cheap but limited space.",
    },
    businessCenter: {
      name: "Business Center",
      cost: 2500,
      productivity: 1.0,
      description: "Professional space, flexible terms.",
    },
    incubator: {
      name: "Incubator",
      cost: 1800,
      productivity: 1.1,
      description: "Startup-friendly with mentoring. Requires incubator meeting first.",
      requiresActivity: "incubatorMeeting",
    },
  },

  payroll: {
    juniorSalaryPerHalfYear: 25000,
    seniorSalaryPerHalfYear: 75000,
  },

  labels: {
    progressMetric: "Development Hours",
    progressUnit: "h",
    phaseGateTitle: "Phase 2 Readiness",
  },

  // ============================================
  // END GAME SCORING — STARTUP EDITION
  // Steve Blank Customer Development focus
  // ============================================
  endGameScoring: {
    categories: [
      {
        id: "traction",
        name: "Customer Traction",
        icon: "🎯",
        maxPoints: 30,
        metrics: [
          { id: "interviews", name: "Customer Interviews", weight: 15, target: 5, description: "Talk to real humans. It's not optional." },
          { id: "validations", name: "Customer Validations", weight: 15, target: 2, description: "LOIs, pre-orders, pilot agreements" },
        ],
      },
      {
        id: "financial",
        name: "Financial Health",
        icon: "💰",
        maxPoints: 25,
        metrics: [
          { id: "cash", name: "Cash Position", weight: 15, target: 30000, description: "Runway buys you time to figure things out" },
          { id: "revenue", name: "Revenue Generated", weight: 10, target: 10000, description: "Paying customers beat grant committees" },
        ],
      },
      {
        id: "team",
        name: "Team & Structure",
        icon: "👥",
        maxPoints: 20,
        metrics: [
          { id: "equity", name: "Founder Equity", weight: 10, target: 60, description: "Keep enough skin in the game" },
          { id: "legalForm", name: "Legal Structure", weight: 5, target: 1, description: "Proper entity = credibility" },
          { id: "employees", name: "Team Growth", weight: 5, target: 1, description: "You can't do everything alone" },
        ],
      },
      {
        id: "product",
        name: "Product & IP",
        icon: "🔧",
        maxPoints: 15,
        metrics: [
          { id: "productDev", name: "Product Built", weight: 8, target: 1, description: "You shipped something" },
          { id: "ipProtection", name: "IP Protected", weight: 7, target: 1, description: "Protect what you built" },
        ],
      },
      {
        id: "bonuses",
        name: "Achievement Bonuses",
        icon: "🏆",
        maxPoints: 10,
        bonuses: [
          // === POSITIVE ===
          {
            id: 'customerWhisperer',
            name: '🗣️ Customer Whisperer',
            points: 3,
            condition: 'manyInterviews',
            description: '5+ customer interviews conducted',
            type: 'positive',
          },
          {
            id: 'validationVictory',
            name: '📋 Signed, Sealed, Validated',
            points: 3,
            condition: 'hasValidation',
            description: 'Secured 2+ real customer commitments',
            type: 'positive',
          },
          {
            id: 'firstEuro',
            name: '💶 First Euro Club',
            points: 2,
            condition: 'hasRevenue',
            description: 'Generated actual paying revenue',
            type: 'positive',
          },
          {
            id: 'launchingCustomer',
            name: '🎉 First Real Deal',
            points: 3,
            condition: 'closedLaunchingCustomer',
            description: 'Closed a launching customer deal',
            type: 'positive',
          },
          {
            id: 'grantGrabber',
            name: '🏆 Free Money Club',
            points: 2,
            condition: 'hasGrant',
            description: 'Secured non-dilutive funding',
            type: 'positive',
          },
          {
            id: 'incubatorCrew',
            name: '🚀 Incubator Crew',
            points: 2,
            condition: 'inIncubator',
            description: 'Joined an incubator or accelerator',
            type: 'positive',
          },
          {
            id: 'dreamTeam',
            name: '🧠 Dream Team',
            points: 2,
            condition: 'balancedTeam',
            description: 'Mixed technical and business skills on the team',
            type: 'positive',
          },
          {
            id: 'ipSmart',
            name: '🛡️ IP On Lock',
            points: 2,
            condition: 'hasIP',
            description: 'Protected your intellectual property',
            type: 'positive',
          },
          {
            id: 'frugalFounder',
            name: '💰 Frugal Founder',
            points: 1,
            condition: 'neverNegative',
            description: 'Never ran out of money',
            type: 'positive',
          },
          {
            id: 'pivotPro',
            name: '🔄 Pivot Pro',
            points: 1,
            condition: 'pivotedOnce',
            description: 'Pivoted exactly once based on customer evidence',
            type: 'positive',
          },

          // === NEGATIVE (The Roasts) ===
          {
            id: 'zeroInterviews',
            name: '🙈 Heard of Customers?',
            points: -3,
            condition: 'zeroInterviews',
            description: 'Zero customer interviews',
            type: 'negative',
            roast: "You built a solution. For a problem. That you invented. Bold.",
          },
          {
            id: 'buildFirst',
            name: '🔨 Builder, Not Talker',
            points: -2,
            condition: 'builtWithoutTalking',
            description: 'Built the product before talking to customers',
            type: 'negative',
            roast: "Hope you enjoy building things nobody asked for.",
          },
          {
            id: 'noValidation',
            name: '🎲 YOLO Startup',
            points: -3,
            condition: 'noValidation',
            description: 'Zero customer validations',
            type: 'negative',
            roast: "Bold strategy. Let's see if it pays off. (It won't.)",
          },
          {
            id: 'burnedOut',
            name: '🔥 Burned Alive',
            points: -2,
            condition: 'wentBankrupt',
            description: 'Ran out of money completely',
            type: 'negative',
            roast: "Have you considered a salaried position?",
          },
          {
            id: 'pivotAddict',
            name: '🌀 Pivotception',
            points: -2,
            condition: 'tooManyPivots',
            description: 'Pivoted 3+ times',
            type: 'negative',
            roast: "Maybe the real startup was the pivots we made along the way.",
          },
          {
            id: 'equityGiveaway',
            name: '🎁 Equity Santa',
            points: -2,
            condition: 'tooMuchDilution',
            description: 'Gave away more than 50% equity',
            type: 'negative',
            roast: "Congratulations, you work for your investors now.",
          },
          {
            id: 'soloShow',
            name: '🎭 The Lone Founder',
            points: -1,
            condition: 'noHires',
            description: 'Never hired or partnered with anyone',
            type: 'negative',
            roast: "Delegation exists. Look it up.",
          },
          {
            id: 'allNerds',
            name: '🤓 Zero Sales DNA',
            points: -1,
            condition: 'allTechnicalTeam',
            description: 'Team has zero business or market skills',
            type: 'negative',
            roast: "Amazing product. Absolutely no clue how to sell it.",
          },
          {
            id: 'noIPAtAll',
            name: '💨 Open Source By Default',
            points: -1,
            condition: 'noIPAtAll',
            description: 'No IP protection whatsoever',
            type: 'negative',
            roast: "Your competitors said thanks for the free R&D.",
          },
          {
            id: 'grantDependent',
            name: '🍼 Grant Baby',
            points: -1,
            condition: 'onlyGrantFunding',
            description: 'Only funding is grants, no revenue or investment',
            type: 'negative',
            roast: "Grants aren't a revenue model. Ask any grant committee.",
          },
          {
            id: 'islandMode',
            name: '🏝️ Island Mode',
            points: -2,
            condition: 'noExpertMeetings',
            description: 'Met fewer than 2 experts the entire game',
            type: 'negative',
            roast: "You don't know what you don't know. And that's a lot.",
          },
        ],
      },
    ],

    achievementConditions: {
      // Positive conditions
      manyInterviews: (data) => (data.interviewCount || 0) >= 5,
      hasValidation: (data) => (data.validationCount || 0) >= 2,
      hasRevenue: (data) => (data.totalRevenue || data.funding?.revenue || 0) > 0,
      closedLaunchingCustomer: (data) => data.completedActivities?.includes('launchingCustomer'),
      hasGrant: (data) => data.completedActivities?.some(a =>
        ['subsidyApplication', 'subsidyAdvisor', 'grantTakeoff', 'grantWBSO', 'grantRegional'].includes(a)
      ),
      inIncubator: (data) => data.completedActivities?.includes('incubatorMeeting'),
      balancedTeam: (data) => {
        const profiles = [...(data.teamProfiles || []), ...(data.hiredProfiles || [])];
        const types = new Set(profiles.map(p => {
          if (['scientist', 'product'].includes(p)) return 'technical';
          if (['business', 'market'].includes(p)) return 'commercial';
          return 'operations';
        }));
        return types.size >= 2;
      },
      hasIP: (data) => data.completedActivities?.some(a =>
        ['knowHowProtection', 'patentOutsourced', 'patentFiling'].includes(a)
      ),
      neverNegative: (data) => !data.wentNegative,
      pivotedOnce: (data) => (data.pivotCount || 0) === 1,

      // Negative conditions
      zeroInterviews: (data) => (data.interviewCount || 0) === 0,
      builtWithoutTalking: (data) =>
        data.completedActivities?.includes('productDevelopment') &&
        (data.interviewCount || 0) < 2,
      noValidation: (data) => (data.validationCount || 0) === 0,
      wentBankrupt: (data) => (data.cash || 0) < -10000,
      tooManyPivots: (data) => (data.pivotCount || 0) >= 3,
      tooMuchDilution: (data) => (data.investorEquity || 0) > 50,
      noHires: (data) => (data.employees || 0) === 0 &&
        !data.completedActivities?.includes('seniorTechnicalPartner'),
      allTechnicalTeam: (data) => {
        const profiles = data.teamProfiles || [];
        return profiles.length > 0 && profiles.every(p => ['scientist', 'product'].includes(p));
      },
      noIPAtAll: (data) => !data.completedActivities?.some(a =>
        ['knowHowProtection', 'patentOutsourced', 'patentFiling', 'patentConsult'].includes(a)
      ),
      onlyGrantFunding: (data) => {
        const hasGrant = data.completedActivities?.some(a =>
          ['subsidyApplication', 'subsidyAdvisor'].includes(a)
        );
        const hasInvestment = (data.totalInvestment || 0) > 0;
        const hasRevenue = (data.totalRevenue || data.funding?.revenue || 0) > 0;
        return hasGrant && !hasInvestment && !hasRevenue;
      },
      noExpertMeetings: (data) => {
        const expertActivities = [
          'technicalCoach', 'businessDeveloper', 'legalAdvisor',
          'investorMeeting', 'bankMeeting', 'patentConsult',
          'subsidyAdvisor', 'incubatorMeeting',
        ];
        const expertCount = expertActivities.filter(a =>
          data.completedActivities?.includes(a)
        ).length;
        return expertCount < 2;
      },
    },

    rankings: {
      excellent: { min: 80, label: "🌟 Startup Champion", color: "#22c55e", description: "Ready for your first funding round!" },
      strong: { min: 65, label: "💪 Strong Founder", color: "#3b82f6", description: "You're building something real" },
      good: { min: 50, label: "👍 On Track", color: "#f59e0b", description: "Solid customer development work" },
      developing: { min: 35, label: "📈 Learning Founder", color: "#f97316", description: "More validation needed" },
      struggling: { min: 0, label: "⚠️ Back to Basics", color: "#ef4444", description: "Start by talking to customers" },
    },
  },
};

export const calculateStartupScore = (teamData = {}, progress = {}) => {
  const config = STARTUP_CONFIG.endGameScoring;

  const completedActivities = teamData.completedActivities || [];

  const values = {
    interviews: progress.interviewsTotal || teamData.interviewCount || 0,
    validations: progress.validationsTotal || teamData.validationCount || 0,
    cash: progress.cash || teamData.cash || 0,
    revenue: teamData.totalRevenue || teamData.funding?.revenue || 0,
    equity: Math.max(0, 100 - (progress.investorEquity || teamData.investorEquity || 0)),
    legalForm: teamData.legalForm && teamData.legalForm !== 'none' ? 1 : 0,
    employees: (teamData.employees || 0) > 0 || completedActivities.includes('seniorTechnicalPartner') ? 1 : 0,
    productDev: completedActivities.includes('productDevelopment') ? 1 : 0,
    ipProtection: completedActivities.some(a =>
      ['knowHowProtection', 'patentOutsourced', 'patentFiling'].includes(a)
    ) ? 1 : 0,
  };

  const metricCategories = config.categories.filter(c => c.metrics);
  const categoryScores = metricCategories.map(category => {
    const metricScores = category.metrics.map(metric => {
      const value = values[metric.id] || 0;
      const ratio = Math.min(1, value / metric.target);
      const score = ratio * metric.weight;
      return { ...metric, value, score, percentage: Math.min(100, ratio * 100) };
    });
    const categoryTotal = metricScores.reduce((sum, m) => sum + m.score, 0);
    return { ...category, metrics: metricScores, score: categoryTotal };
  });

  const baseScore = categoryScores.reduce((sum, c) => sum + c.score, 0);

  const bonusCategory = config.categories.find(c => c.bonuses);
  const achievementConditions = config.achievementConditions || {};
  const achievements = [];

  if (bonusCategory) {
    const conditionData = {
      ...teamData,
      cash: values.cash,
      validationCount: values.validations,
      interviewCount: values.interviews,
    };
    bonusCategory.bonuses.forEach(bonus => {
      const conditionFn = achievementConditions[bonus.condition];
      if (conditionFn && conditionFn(conditionData)) {
        achievements.push(bonus);
      }
    });
  }

  achievements.sort((a, b) => {
    if (a.points >= 0 && b.points < 0) return -1;
    if (a.points < 0 && b.points >= 0) return 1;
    return Math.abs(b.points) - Math.abs(a.points);
  });

  const bonusPoints = achievements.reduce((sum, a) => sum + a.points, 0);
  const totalScore = Math.round(baseScore + bonusPoints);

  const { rankings } = config;
  let ranking;
  if (totalScore >= rankings.excellent.min) ranking = rankings.excellent;
  else if (totalScore >= rankings.strong.min) ranking = rankings.strong;
  else if (totalScore >= rankings.good.min) ranking = rankings.good;
  else if (totalScore >= rankings.developing.min) ranking = rankings.developing;
  else ranking = rankings.struggling;

  return {
    totalScore,
    baseScore,
    bonusPoints,
    categoryScores,
    achievements,
    values,
    ranking,
  };
};

export default STARTUP_CONFIG;
