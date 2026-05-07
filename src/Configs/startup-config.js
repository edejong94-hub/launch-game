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
      description: "Get real commitment from customers — letter of intent, pre-order, or pilot agreement. Only meaningful after understanding their problem.",
      requiresInterviews: 3,
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
};

export default STARTUP_CONFIG;
