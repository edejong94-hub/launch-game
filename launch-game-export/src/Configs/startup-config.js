// STARTUP GAME CONFIGURATION
// The original Launch Game for general startup simulation

export const STARTUP_CONFIG = {
  gameMode: "startup",
  gameTitle: "Startup Launch Game",
  gameDescription: "Build your startup from idea to market",

  gameInfo: {
    startingCapital: 10000,
    totalRounds: 4,
  },

  phases: {
    phase1: {
      name: "Idea & Validation",
      hoursRequired: 4000,
      customerValidationRequired: 3,
      minimumInterviews: 3,
    },
    phase2: {
      name: "Growth & Scale",
      hoursRequired: 12000,
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
      description: "Talk to customers and validate your idea before building.",
      activities: ["customerInterviews", "customerValidation", "pivot"],
    },
    {
      id: "experts",
      title: "Expert Meetings",
      description: "Meet experts to unlock new options and get professional advice.",
      activities: ["kvkConsult", "investorMeeting", "bankMeeting", "patentConsult", "subsidyAdvisor", "incubatorMeeting", "networking"],
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
      activities: ["productDevelopment", "hireSenior"],
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
      description: "Talk to potential customers to understand their problems.",
    },
    customerValidation: {
      name: "Customer Validation",
      costTime: 48,
      costMoney: 0,
      category: "discovery",
      description: "Get commitment from customers (LOI, pre-order, pilot).",
      requiresInterviews: 3,
    },
    pivot: {
      name: "Pivot Product",
      costTime: 32,
      costMoney: 0,
      category: "discovery",
      description: "Change direction based on customer feedback.",
      extraTimePerRound: 32,
    },

    // === EXPERT MEETINGS ===
    kvkConsult: {
      name: "KVK: Legal Form Consultation",
      costTime: 48,
      costMoney: 0,
      category: "experts",
      description: "Meet the KVK expert to choose your legal structure.",
      unlocks: ["legalForm"],
    },
    investorMeeting: {
      name: "Investor Meeting",
      costTime: 32,
      costMoney: 0,
      category: "experts",
      description: "Pitch to investors and discuss funding terms.",
      unlocks: ["investorFunding"],
    },
    bankMeeting: {
      name: "Bank Meeting",
      costTime: 32,
      costMoney: 0,
      category: "experts",
      description: "Discuss loans and credit facilities with the bank.",
      unlocks: ["bankLoan"],
    },
    patentConsult: {
      name: "Patent Expert Consultation",
      costTime: 32,
      costMoney: 0,
      category: "experts",
      description: "Get advice on protecting your intellectual property.",
      unlocks: ["knowHowProtection", "patentOutsourced"],
    },
    subsidyAdvisor: {
      name: "Subsidy Advisor",
      costTime: 32,
      costMoney: 0,
      category: "experts",
      description: "Learn about available grants and subsidies.",
      unlocks: ["subsidyApplication"],
    },
    incubatorMeeting: {
      name: "Incubator Meeting",
      costTime: 32,
      costMoney: 0,
      category: "experts",
      description: "Discuss joining an incubator program and getting office space.",
      unlocks: ["incubatorOffice"],
    },
    networking: {
      name: "Networking Event",
      costTime: 48,
      costMoney: 0,
      category: "experts",
      description: "Build connections and find potential partners or advisors.",
      networkBonus: 1,
      unlocks: ["hireSenior"],
    },

    // === MARKET & SALES ===
    marketing: {
      name: "Marketing & Awareness",
      costTime: 48,
      costMoney: 2000,
      category: "market",
      description: "Run campaigns to build brand awareness and generate leads.",
      marketingBonus: 1,
    },
    marketAnalysisDIY: {
      name: "Market Analysis (DIY)",
      costTime: 160,
      costMoney: 0,
      category: "market",
      description: "Research your market yourself. Takes time but saves money.",
    },
    marketAnalysisOutsourced: {
      name: "Market Analysis (Outsourced)",
      costTime: 8,
      costMoney: 10000,
      category: "market",
      description: "Hire experts to analyze your market quickly.",
    },

    // === OPERATIONS & BUILDING ===
    productDevelopment: {
      name: "Product Development",
      costTime: 80,
      costMoney: 0,
      category: "operations",
      description: "Focus time on building and improving your product.",
      developmentBonus: 1,
    },
    hireSenior: {
      name: "Hire Senior Advisor",
      costTime: 32,
      costMoney: 0,
      category: "operations",
      description: "Bring experienced talent onto your team.",
      requiresActivity: "networking",
      requiresRound: 3,
    },

    // === INTELLECTUAL PROPERTY ===
    knowHowProtection: {
      name: "Know-How Protection",
      costTime: 32,
      costMoney: 2500,
      category: "ip",
      description: "Trade secrets, NDAs, and documentation. Quick and cheaper than patent.",
      salesGradeBonus: 1,
      requiresActivity: "patentConsult",
      canUpgradeToPatent: true,
    },
    patentOutsourced: {
      name: "Patent Filing (Professional)",
      costTime: 8,
      costMoney: 10000,
      category: "ip",
      description: "Hire a patent attorney for proper protection.",
      salesGradeBonus: 2,
      requiresActivity: "patentConsult",
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
};

export default STARTUP_CONFIG;