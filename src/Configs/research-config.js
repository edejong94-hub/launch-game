// RESEARCH SPIN-OFF GAME CONFIGURATION
// For researchers commercializing university research

export const RESEARCH_CONFIG = {
  gameMode: "research",
  gameTitle: "Research Spin-off Game",
  gameDescription: "Navigate the path from lab to market",

  gameInfo: {
    startingCapital: 5000,
    totalRounds: 4,
    startingTRL: 3,
    startingEquity: 100,
  },

  // ============================================
  // TEAM PROFILE OPTIONS
  // Used for diverse team mechanic - each founder picks a profile
  // ============================================
  founderProfiles: {
    scientist: {
      id: "scientist",
      name: "Deep Tech Scientist",
      icon: "🔬",
      description: "Expert in the core technology. Strong on R&D, weak on business.",
      strengths: ["trl", "patents"],
      weaknesses: ["customers", "fundraising"],
    },
    product: {
      id: "product",
      name: "Product & Design",
      icon: "🎨",
      description: "Turns research into usable products. Good at user experience.",
      strengths: ["productDevelopment", "customers"],
      weaknesses: ["fundraising", "legal"],
    },
    business: {
      id: "business",
      name: "Business & Sales",
      icon: "💼",
      description: "Knows how to sell and close deals. Strong on revenue.",
      strengths: ["customers", "fundraising", "partnerships"],
      weaknesses: ["trl", "patents"],
    },
    operations: {
      id: "operations",
      name: "Operations & Finance",
      icon: "📊",
      description: "Keeps the company running. Good with money and processes.",
      strengths: ["cashManagement", "legal", "hiring"],
      weaknesses: ["customers", "trl"],
    },
    market: {
      id: "market",
      name: "Market Expert",
      icon: "🎯",
      description: "Deep knowledge of the target industry and customers.",
      strengths: ["customers", "partnerships", "marketing"],
      weaknesses: ["trl", "patents"],
    },
  },

  // ============================================
  // LICENCE AGREEMENT OPTIONS
  // Different deal structures with the university TTO
  // Teaching: revenue vs profit, early payments, high percentages
  // ============================================
  licenceOptions: {
    balanced: {
      id: "balanced",
      name: "Balanced Deal",
      description: "3% royalty on profit, payments start when revenue > €100k/year",
      royaltyBase: "profit",
      royaltyPercent: 3,
      paymentsStartCondition: "revenue > 100000",
      paymentsStartRound: null,
      investorAppealModifier: 0,
      cashFlowImpact: "low",
      explanation: "This is a fair deal. Investors will accept it and you have room to grow. You only pay when profitable.",
    },
    revenueHeavy: {
      id: "revenueHeavy", 
      name: "Revenue-Based Royalty",
      description: "5% royalty on revenue from day one",
      royaltyBase: "revenue",
      royaltyPercent: 5,
      paymentsStartCondition: "immediately",
      paymentsStartRound: 1,
      investorAppealModifier: -2,
      cashFlowImpact: "high",
      explanation: "⚠️ Warning: Revenue-based royalties hurt more than profit-based! You pay 5% of every euro earned, even when losing money. This can kill early-stage companies.",
    },
    highPercentage: {
      id: "highPercentage",
      name: "High Royalty Deal",
      description: "8% royalty on profit, university wants quick returns",
      royaltyBase: "profit",
      royaltyPercent: 8,
      paymentsStartCondition: "revenue > 50000",
      paymentsStartRound: null,
      investorAppealModifier: -1,
      cashFlowImpact: "medium",
      explanation: "8% is quite high for a university licence. This will significantly reduce your margins and make scaling harder. Investors may push back.",
    },
    earlyPayments: {
      id: "earlyPayments",
      name: "Early Fixed Payments",
      description: "2% royalty on profit + €5000/year from round 2",
      royaltyBase: "profit",
      royaltyPercent: 2,
      fixedPaymentPerRound: 5000,
      paymentsStartRound: 2,
      investorAppealModifier: -1,
      cashFlowImpact: "medium",
      explanation: "⚠️ Fixed payments before you have revenue can drain your runway. The €5000/round starts in round 2 regardless of your revenue!",
    },
    equity: {
      id: "equity",
      name: "University Takes Equity",
      description: "No royalties, but university gets 10% equity",
      royaltyBase: "none",
      royaltyPercent: 0,
      equityToUniversity: 10,
      investorAppealModifier: -1,
      cashFlowImpact: "none",
      explanation: "No cash impact now, but you give up 10% ownership forever. This dilutes founders and all future investors. Some VCs dislike universities on the cap table.",
    },
  },

  // ============================================
  // TEAM DIVERSITY EVENT
  // Triggers in round 2 to teach about balanced teams
  // ============================================
  teamDiversityEvent: {
    triggerRound: 2,
    title: "Team Composition Check",
    description: "As you grow, you realize your team might be missing key skills...",
    
    allTechnical: {
      severity: "warning",
      title: "🔬 Your team is very technical!",
      message: "All founders have technical backgrounds. This is extremely common in research spin-offs - but it's also why many fail. Without business skills, you may struggle with customer development, fundraising, and commercial negotiations.",
      recommendation: "Strongly consider hiring someone with business/sales experience before your next funding round.",
    },
    missingCustomer: {
      severity: "warning", 
      title: "🎯 No customer expert on the team",
      message: "Your team doesn't have anyone focused on customers and market. Research shows this is one of the top reasons deep-tech startups fail - they build amazing technology that nobody wants to buy.",
      recommendation: "Add someone who deeply understands your target customers.",
    },
    missingOperations: {
      severity: "info",
      title: "📊 Operations gap identified",
      message: "Your team could benefit from someone handling finance, legal, and operations. As you grow, administrative burden increases quickly.",
      recommendation: "Consider a part-time CFO or operations advisor as you scale.",
    },
    wellBalanced: {
      severity: "success",
      title: "✅ Great team composition!",
      message: "Your founding team has a good mix of technical, business, and operational skills. This diversity gives you a strong foundation - research shows balanced teams have higher success rates.",
      recommendation: "Keep building on your strengths and hire to fill gaps as you scale!",
    },
  },

  // ============================================
  // PHASES
  // ============================================
  phases: {
    phase1: {
      name: "University Phase",
      hoursRequired: 4000,
      trlRequired: 5,
      customerValidationRequired: 1,
      minimumInterviews: 2,
      description: "Still employed at university, limited time, TTO negotiations",
    },
    phase2: {
      name: "Spin-off Phase",
      hoursRequired: 12000,
      trlRequired: 7,
      description: "Building the company, seeking funding, scaling",
    },
  },

  // ============================================
  // EMPLOYMENT STATUS
  // Affects available hours per round
  // ============================================
  employmentStatus: {
    university: {
      name: "University Employee",
      hoursPerRound: 500,
      description: "Limited time due to teaching & research obligations",
      labAccess: true,
      grantEligible: true,
    },
    fulltime: {
      name: "Full-time Founder",
      hoursPerRound: 1000,
      description: "Left university, full focus on startup",
      labAccess: false,
      grantEligible: false,
    },
    parttime: {
      name: "Part-time (negotiated)",
      hoursPerRound: 750,
      description: "Reduced university role, negotiated arrangement",
      labAccess: true,
      grantEligible: true,
    },
  },

  // ============================================
  // TRL LEVELS
  // ============================================
  trlLevels: {
    1: "Basic principles observed",
    2: "Technology concept formulated",
    3: "Experimental proof of concept",
    4: "Technology validated in lab",
    5: "Technology validated in relevant environment",
    6: "Technology demonstrated in relevant environment",
    7: "System prototype demonstration",
    8: "System complete and qualified",
    9: "System proven in operational environment",
  },

  // ============================================
  // LEGAL FORMS
  // ============================================
  legalForms: {
    bv: {
      name: "BV",
      shortDescription: "Required for most investors. Founders on payroll, formal structure.",
      salaryPerFounderHalfYear: 12000,
      bankTrustBonus: 2,
      investorAppealBonus: 2,
    },
    holding: {
      name: "Personal Holding + BV",
      shortDescription: "Tax efficient structure. Your holding owns shares in the BV.",
      salaryPerFounderHalfYear: 12000,
      bankTrustBonus: 2,
      investorAppealBonus: 2,
      setupCost: 2500,
    },
    none: {
      name: "No Legal Entity Yet",
      shortDescription: "Still exploring. Cannot take investment or sign major contracts.",
      salaryPerFounderHalfYear: 0,
      bankTrustBonus: 0,
      investorAppealBonus: -2,
    },
  },

  // ============================================
  // ACTIVITY SECTIONS FOR GROUPED DISPLAY
  // ============================================
  activitySections: [
    {
      id: "discovery",
      title: "Customer Discovery",
      description: "Validate that someone will pay for your technology.",
      activities: ["customerInterviews", "customerValidation", "industryExploration"],
    },
    {
      id: "tto",
      title: "University & TTO",
      description: "Negotiate IP rights and your relationship with the university.",
      activities: ["ttoDiscussion", "ttoNegotiation", "licenceNegotiation", "labNegotiation", "universityExit"],
    },
    {
      id: "ip",
      title: "Intellectual Property",
      description: "Protect your innovations. Meet TTO first.",
      activities: ["patentSearch", "patentFiling", "patentDIY"],
    },
    {
      id: "funding",
      title: "Funding & Grants",
      description: "Secure money to grow. Different options have different trade-offs.",
      activities: ["grantTakeoff", "grantWBSO", "grantRegional", "investorMeeting", "investorNegotiation"],
    },
    {
      id: "team",
      title: "Team & Hiring",
      description: "Build a diverse team with complementary skills.",
      activities: ["cofounderAgreement", "hireBusinessPerson", "hireMarketExpert", "hireOperations", "networking"],
    },
    {
      id: "development",
      title: "Product Development",
      description: "Advance your technology towards market readiness.",
      activities: ["prototypeDevelopment", "pilotProject", "incubatorApplication"],
    },
  ],

  // ============================================
  // ACTIVITIES
  // ============================================
  activities: {
    // === CUSTOMER DISCOVERY ===
    customerInterviews: {
      name: "Customer Discovery Interviews",
      costTime: 40,
      costMoney: 0,
      category: "discovery",
      description: "Talk to potential customers. Essential for validation.",
    },
    customerValidation: {
      name: "Customer Validation (LOI/Pilot)",
      costTime: 60,
      costMoney: 0,
      category: "discovery",
      description: "Get letter of intent or pilot agreement.",
      requiresInterviews: 2,
    },
    industryExploration: {
      name: "Industry Partner Exploration",
      costTime: 40,
      costMoney: 1000,
      category: "discovery",
      description: "Identify potential industry partners or licensees.",
    },

    // === UNIVERSITY & TTO ===
    ttoDiscussion: {
      name: "TTO: Initial Discussion",
      costTime: 60,
      costMoney: 0,
      category: "tto",
      description: "Required first step. Discuss IP ownership with Tech Transfer Office.",
      unlocks: ["ttoNegotiation", "licenceNegotiation", "patentSearch", "patentFiling", "patentDIY", "legalForm"],
    },
    ttoNegotiation: {
      name: "TTO: Terms Negotiation",
      costTime: 60,
      costMoney: 0,
      category: "tto",
      description: "Negotiate specific terms with the TTO.",
      requiresActivity: "ttoDiscussion",
    },
    licenceNegotiation: {
      name: "Licence Agreement",
      costTime: 80,
      costMoney: 2000,
      category: "tto",
      description: "Finalize the licence agreement with the university.",
      requiresActivity: "ttoDiscussion",
      unlocks: ["licenceChoice"],
    },
    labNegotiation: {
      name: "Lab Access Negotiation",
      costTime: 40,
      costMoney: 0,
      category: "tto",
      description: "Negotiate continued use of university facilities after spinning off.",
    },
    universityExit: {
      name: "University Exit Discussion",
      costTime: 60,
      costMoney: 0,
      category: "tto",
      description: "Negotiate leaving terms, transition plan, ongoing relationships.",
    },

    // === INTELLECTUAL PROPERTY ===
    patentSearch: {
      name: "Patent: Freedom to Operate",
      costTime: 40,
      costMoney: 2000,
      category: "ip",
      description: "Check if your technology infringes existing patents.",
      requiresActivity: "ttoDiscussion",
    },
    patentFiling: {
      name: "Patent: Professional Filing",
      costTime: 100,
      costMoney: 15000,
      category: "ip",
      description: "Hire attorney for proper IP protection. Stronger claims.",
      investorAppealBonus: 2,
      requiresActivity: "ttoDiscussion",
    },
    patentDIY: {
      name: "Patent: DIY Filing",
      costTime: 150,
      costMoney: 2000,
      category: "ip",
      description: "Cheaper but risky. May have weak claims that don't hold up.",
      investorAppealBonus: 1,
      requiresActivity: "ttoDiscussion",
    },

    // === FUNDING & GRANTS ===
    grantTakeoff: {
      name: "NWO Take-off Application",
      costTime: 80,
      costMoney: 0,
      category: "funding",
      description: "€40-250k, no equity loss. Very competitive, 3-6 month process.",
    },
    grantWBSO: {
      name: "WBSO Registration",
      costTime: 40,
      costMoney: 0,
      category: "funding",
      description: "Tax credit on R&D costs. ~€20k/year benefit. Relatively easy.",
    },
    grantRegional: {
      name: "Regional Fund (ROM/MIT)",
      costTime: 60,
      costMoney: 0,
      category: "funding",
      description: "€50-150k, may take small equity stake (0-8%).",
    },
    investorMeeting: {
      name: "Investor Meeting",
      costTime: 40,
      costMoney: 0,
      category: "funding",
      description: "Pitch to VCs or angels. Build relationships.",
      unlocks: ["investorNegotiation"],
    },
    investorNegotiation: {
      name: "Term Sheet Negotiation",
      costTime: 60,
      costMoney: 5000,
      category: "funding",
      description: "Negotiate investment terms. Lawyer costs included.",
      requiresActivity: "investorMeeting",
    },

    // === TEAM & HIRING ===
    // These activities help fix team imbalance identified in round 2 event
    cofounderAgreement: {
      name: "Co-founder Agreement",
      costTime: 40,
      costMoney: 2000,
      category: "team",
      description: "Equity split, vesting, roles. Essential before investment.",
    },
    hireBusinessPerson: {
      name: "Hire: Business/Sales Expert",
      costTime: 60,
      costMoney: 0,
      category: "team",
      description: "Add business skills to your team. Helps with customers and fundraising.",
      addsProfile: "business",
      salaryOngoing: true,
    },
    hireMarketExpert: {
      name: "Hire: Market Expert",
      costTime: 60,
      costMoney: 0,
      category: "team",
      description: "Add market knowledge. Helps with customer development.",
      addsProfile: "market",
      salaryOngoing: true,
    },
    hireOperations: {
      name: "Hire: Operations/Finance",
      costTime: 60,
      costMoney: 0,
      category: "team",
      description: "Add operational expertise. Helps with scaling.",
      addsProfile: "operations",
      salaryOngoing: true,
    },
    networking: {
      name: "Conference / Demo Day",
      costTime: 60,
      costMoney: 1000,
      category: "team",
      description: "Build network, visibility, find partners and advisors.",
      networkBonus: 1,
    },

    // === PRODUCT DEVELOPMENT ===
    prototypeDevelopment: {
      name: "Prototype Development",
      costTime: 120,
      costMoney: 5000,
      category: "development",
      description: "Build working prototype. Increases TRL by 1.",
      trlBonus: 1,
    },
    pilotProject: {
      name: "Pilot Project",
      costTime: 100,
      costMoney: 10000,
      category: "development",
      description: "Real-world test with customer. Big TRL jump (+2).",
      trlBonus: 2,
      requiresActivity: "customerValidation",
    },
    incubatorApplication: {
      name: "Incubator Application",
      costTime: 40,
      costMoney: 0,
      category: "development",
      description: "Apply for startup program. Unlocks incubator office space.",
      unlocks: ["incubatorOffice"],
    },
  },

  // ============================================
  // COMPANY OFFICE OPTIONS
  // ============================================
  companyOffice: {
    university: {
      name: "University Office",
      cost: 0,
      productivity: 0.9,
      description: "Free but limited. Must maintain university relationship.",
    },
    incubator: {
      name: "Incubator Space",
      cost: 800,
      productivity: 1.1,
      description: "Startup-friendly with mentoring. Requires incubator application.",
      requiresActivity: "incubatorApplication",
    },
    sciencepark: {
      name: "Science Park Office",
      cost: 2000,
      productivity: 1.0,
      description: "Professional space near university, good for credibility.",
    },
    commercial: {
      name: "Commercial Office",
      cost: 3000,
      productivity: 1.0,
      description: "Full independence, professional image for customers.",
    },
  },

  // ============================================
  // PAYROLL
  // ============================================
  payroll: {
    juniorSalaryPerHalfYear: 25000,
    seniorSalaryPerHalfYear: 75000,
    phdSalaryPerHalfYear: 20000,
  },

  // ============================================
  // WARNING THRESHOLDS
  // ============================================
  warnings: {
    equityDanger: 25,
    equityWarning: 40,
    trlStuck: 2,
    cashDanger: 0,
    cashWarning: 5000,
    interviewsRequired: 2,
    interviewsRequiredByRound: 3,
  },

  // ============================================
  // UI LABELS
  // ============================================
  labels: {
    progressMetric: "TRL Level",
    progressUnit: "",
    phaseGateTitle: "Spin-off Readiness",
    equityLabel: "Founder Equity",
    fundingLabel: "Funding & Grants",
  },
};

export default RESEARCH_CONFIG;