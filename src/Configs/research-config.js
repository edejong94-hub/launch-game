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
// EMPLOYMENT STATUS OPTIONS
// The core university dilemma mechanic
// ============================================
employmentStatus: {
  university: {
    id: 'university',
    name: 'University Employee',
    icon: '🏛️',
    hoursPerRound: 200,
    founderSalaryCost: 0,
    description: 'Still employed at university with teaching/research obligations',
    benefits: ['Lab access', 'Grant eligible (NWO)', 'Job security', 'University resources'],
    drawbacks: ['Limited time (200 hrs)', 'TTO oversight', 'Teaching obligations'],
    labAccess: true,
    grantEligible: true,
    investorModifier: 0, // Neutral in rounds 1-2
    investorModifierLate: -1, // Negative after round 2
  },
  parttime: {
    id: 'parttime',
    name: 'Part-time (Negotiated)',
    icon: '⚖️',
    hoursPerRound: 600,
    founderSalaryCost: 6000,
    description: 'Reduced university role, negotiated arrangement',
    benefits: ['Lab access', 'Grant eligible', 'More time (600 hrs)'],
    drawbacks: ['€6,000/founder salary cost', 'Complex arrangement'],
    labAccess: true,
    grantEligible: true,
    investorModifier: 0,
    requiresActivity: 'universityExit',
  },
  fulltime: {
    id: 'fulltime',
    name: 'Full-time Founder',
    icon: '🚀',
    hoursPerRound: 800,
    founderSalaryCost: 12000,
    description: 'Left university, full focus on startup',
    benefits: ['Full time (800 hrs)', 'Independence', 'Investor confidence'],
    drawbacks: ['€12,000/founder salary', 'No lab access', 'No academic grants', 'No safety net'],
    labAccess: false,
    grantEligible: false,
    investorModifier: 1, // Positive - shows commitment
    requiresActivity: 'universityExit',
  },
},

// ============================================
// FOUNDER HOURS SCALE - Diminishing Returns
// Coordination overhead reduces efficiency with larger teams
// ============================================
founderHoursScale: {
  // Multiplier for each founder position (1st, 2nd, 3rd, etc.)
  // Represents diminishing returns due to coordination overhead
  multipliers: [1.0, 0.9, 0.7, 0.5, 0.3],

  // Base hours per employment status (for 1st founder)
  baseHours: {
    university: 200,
    parttime: 600,
    fulltime: 800,
  },

  // Pre-calculated team totals for reference:
  // University: 2=380, 3=520, 4=620, 5=680
  // Part-time:  2=1140, 3=1560, 4=1860, 5=2040
  // Full-time:  2=1520, 3=2080, 4=2480, 5=2720
},

// ============================================
// STICKER SYSTEM - Expert Meeting Capacity
// Physical stickers represent slots for expert meetings
// ============================================
stickerSystem: {
  university: {
    allowance: 3,
    label: "3 expert meeting slots",
    reasoning: "Limited availability due to teaching/research commitments"
  },
  parttime: {
    allowance: 4,
    label: "4 expert meeting slots",
    reasoning: "More flexible schedule, but still part-time at university"
  },
  fulltime: {
    allowance: 5,
    label: "5 expert meeting slots",
    reasoning: "Full availability for external meetings and negotiations"
  },
  costLevels: {
    heavy: {
      cost: 2,
      label: "2 stickers",
      description: "Intensive expert activities requiring significant external engagement",
      color: "#dc2626"
    },
    standard: {
      cost: 1,
      label: "1 sticker",
      description: "Standard expert meetings and consultations",
      color: "#f59e0b"
    },
    internal: {
      cost: 0,
      label: "0 stickers",
      description: "Internal work that doesn't require external expert meetings",
      color: "#10b981"
    }
  }
},

// ============================================
// INTERRUPT CARDS - University Employees Only
// Physical cards that can reduce activity time
// ============================================
interruptCards: {
  university: {
    cardsPerRound: 2,
    effect: "Reduce any activity by 20 hours",
    description: "Use academic connections to speed up processes",
    reminder: "University employees: You get 2 interrupt cards this round!"
  },
  parttime: {
    cardsPerRound: 0,
    description: "No interrupt cards - reduced university access"
  },
  fulltime: {
    cardsPerRound: 0,
    description: "No interrupt cards - no university affiliation"
  }
},

// Activities that require lab access get discounts
labAccessDiscounts: {
  prototypeDevelopment: { withLab: 2500, withoutLab: 5000 },
  patentSearch: { withLab: 1000, withoutLab: 2000 },
},

// Grants that require university affiliation
academicOnlyGrants: ['grantTakeoff'], // NWO Take-off requires university
  // ============================================
  // EXPERT ROLES & CONTRACT REQUIREMENTS
  // Each expert requires physical documentation
  // ============================================
  expertRoles: {
    tto: {
      id: "tto",
      name: "TTO Officer",
      icon: "🏛️",
      description: "IP licensing, university negotiations, lab access",
      keyTension: "Takes equity/royalties, controls IP, can be slow",
      activities: ["ttoDiscussion", "ttoNegotiation", "licenceNegotiation", "labNegotiation", "universityExit"],
      contracts: [
        { id: "ttoMeeting", name: "TTO Meeting Notes", description: "Record of initial TTO discussion" },
        { id: "licenceAgreement", name: "Licence Agreement", description: "Signed university licence terms" },
      ],
    },
    patent: {
      id: "patent",
      name: "Patent Attorney",
      icon: "⚖️",
      description: "Patent filing, freedom to operate analysis",
      keyTension: "Costs money, takes time, but protects tech",
      activities: ["patentSearch", "patentFiling", "knowHowProtection"],
      contracts: [
        { id: "patentStrategy", name: "Patent Strategy Form", description: "Filing strategy and claims outline" },
        { id: "ftoReport", name: "FTO Report", description: "Freedom to operate analysis results" },
      ],
    },
    investor: {
      id: "investor",
      name: "VC / Investor",
      icon: "💰",
      description: "Large funding (€100K+), strategic advice",
      keyTension: "Wants significant equity, board seats, exit",
      activities: ["investorMeeting", "investorNegotiation"],
      contracts: [
        { id: "pitchDeck", name: "Pitch Deck Feedback", description: "Investor feedback on pitch" },
        { id: "termSheet", name: "Term Sheet", description: "Investment terms and conditions" },
      ],
    },
    grant: {
      id: "grant",
      name: "Grant Advisor",
      icon: "📋",
      description: "NWO, WBSO, EU Horizon funding",
      keyTension: "No equity loss, but slow and restrictive",
      activities: ["grantTakeoff", "grantWBSO", "grantRegional"],
      contracts: [
        { id: "grantApplication", name: "Grant Application", description: "Completed grant application form" },
        { id: "grantBudget", name: "Grant Budget", description: "Detailed budget breakdown" },
      ],
    },
    incubator: {
      id: "incubator",
      name: "Incubator",
      icon: "🏢",
      description: "Workspace, mentoring, network, small funding",
      keyTension: "Takes some equity, requires application",
      activities: ["incubatorApplication"],
      contracts: [
        { id: "incubatorApp", name: "Incubator Application", description: "Program application form" },
        { id: "incubatorTerms", name: "Incubator Terms", description: "Program terms and equity" },
      ],
    },
    bank: {
      id: "bank",
      name: "Bank / Loan Officer",
      icon: "🏦",
      description: "Debt financing, working capital",
      keyTension: "No equity loss, requires collateral/guarantees",
      activities: ["bankMeeting", "loanApplication", "raboInnovatielening"],
      contracts: [
        { id: "loanApplication", name: "Loan Application", description: "Business plan for bank" },
        { id: "loanAgreement", name: "Loan Agreement", description: "Signed loan terms" },
      ],
    },
    industry: {
      id: "industry",
      name: "Industry Partner",
      icon: "🏭",
      description: "Domain expertise, pilots, co-development",
      keyTension: "May want exclusive tech rights",
      activities: ["industryExploration", "pilotProject"],
      contracts: [
        { id: "ndaAgreement", name: "NDA Agreement", description: "Confidentiality agreement" },
        { id: "pilotAgreement", name: "Pilot Agreement", description: "Pilot project terms" },
      ],
    },
    customer: {
      id: "customer",
      name: "Business Developer",
      icon: "🎯",
      description: "Customer discovery, market validation, LOIs",
      keyTension: "Building without validation is the #1 startup killer",
      sessionNote: "Played by a business developer — no domain expertise needed. They guide the conversation and offer contracts based on evidence quality.",
      activities: ["customerInterviews", "customerValidation"],
      contracts: [
        { id: "interviewLog", name: "Interview Log", description: "Given after first meeting — team fills it in after doing real interviews" },
        { id: "loi", name: "Letter of Intent (LOI)", description: "Customer commitment — only after 2+ quality interviews" },
        { id: "pilotAgreementCustomer", name: "Pilot Agreement (Customer)", description: "Real customer test — advanced, Round 3–4 only" },
      ],
    },
  },

  // ============================================
  // GAME EVENTS / POPUPS
  // Dramatic moments to make the game more engaging
  // ============================================
  gameEvents: {
    // Round-based events
    round1Start: {
      trigger: "roundStart",
      round: 1,
      title: "🚀 Welcome to the Spin-off Journey!",
      message: "You've discovered something amazing in your research. Now comes the hard part: turning science into a business. The university owns your IP - you'll need to negotiate with the TTO. Your first priority should be customer discovery.",
      tips: [
        "Talk to the TTO Officer before filing any patents",
        "Start customer interviews immediately - don't build in isolation",
        "You have limited time as a university employee",
      ],
    },
    round2Warning: {
      trigger: "roundStart",
      round: 2,
      title: "⏰ Six Months Have Passed",
      message: "Time flies when you're building a startup. Have you validated your idea with real customers? Do you have a TTO agreement? Investors will start asking tough questions.",
      tips: [
        "You should have at least 2 customer interviews by now",
        "Start thinking about funding - grants take 6+ months",
        "Your runway is burning - check your cash position",
      ],
    },
    round3Pressure: {
      trigger: "roundStart",
      round: 3,
      title: "🔥 The Pressure Builds",
      message: "Year 1.5 into your journey. Your university position is getting harder to balance. Investors are asking about traction. Some teams are pulling ahead.",
      tips: [
        "Do you need to leave the university?",
        "Customer validation is crucial now",
        "Consider if your team has the right skills",
      ],
    },
    round4Final: {
      trigger: "roundStart",
      round: 4,
      title: "🎯 Final Stretch",
      message: "Last 6 months! This is where everything comes together - or falls apart. Make your final moves count.",
      tips: [
        "Close any pending deals",
        "Maximize your score metrics",
        "Prepare for final presentations",
      ],
    },

    // Expert-triggered events
    ttoFirstMeeting: {
      trigger: "activity",
      activity: "ttoDiscussion",
      title: "🏛️ First TTO Meeting",
      message: "You've met with the Technology Transfer Office. They explained that the university owns all IP created using university resources. Now you need to negotiate a licence agreement.",
      severity: "info",
      consequences: [
        "IP activities are now unlocked",
        "You can start licence negotiations",
        "The TTO will want royalties or equity",
      ],
    },
    investorFirstMeeting: {
      trigger: "activity",
      activity: "investorMeeting",
      title: "💰 Investor Interest!",
      message: "An investor has shown interest in your company! They see potential but have tough questions about your team, market, and IP position.",
      severity: "success",
      consequences: [
        "Term sheet negotiations are now possible",
        "Be prepared to give up 15-30% equity",
        "They'll want board seats and control provisions",
      ],
    },
    grantApproved: {
      trigger: "activity",
      activity: "grantTakeoff",
      title: "🎉 Grant Application Submitted!",
      message: "You've submitted your NWO Take-off application. These grants are very competitive (20-30% success rate) but provide non-dilutive funding.",
      severity: "info",
      consequences: [
        "Results take 3-6 months",
        "If successful: €40-250k with no equity loss",
        "Grant money has spending restrictions",
      ],
    },
    bankMeetingEvent: {
      trigger: "activity",
      activity: "bankMeeting",
      title: "🏦 Bank Meeting",
      message: "The bank is interested in your business but has concerns. Deep tech startups are risky for traditional lenders. They want to see revenue or strong collateral.",
      severity: "warning",
      consequences: [
        "Banks typically want personal guarantees",
        "Interest rates for startups are high (8-15%)",
        "No equity loss, but debt must be repaid",
      ],
    },
    customerValidationSuccess: {
      trigger: "activity",
      activity: "customerValidation",
      title: "🎯 Customer Validation Achieved!",
      message: "A customer has signed a Letter of Intent! The Business Developer confirmed your interviews were solid enough to earn real commitment. This is a major milestone.",
      severity: "success",
      consequences: [
        "Investor appeal significantly increased",
        "You can now pursue pilot projects with the Industry Partner",
        "Use this evidence in grant applications",
      ],
    },
    patentFiled: {
      trigger: "activity",
      activity: "patentFiling",
      title: "⚖️ Patent Application Filed",
      message: "Your patent attorney has filed the application. You now have 'patent pending' status. Full protection takes 2-4 years, but you can show investors you're protecting the IP.",
      severity: "success",
      consequences: [
        "Investor appeal +2",
        "'Patent pending' can be used in marketing",
        "Watch for infringement from competitors",
      ],
    },
    incubatorAccepted: {
      trigger: "activity",
      activity: "incubatorApplication",
      title: "🏢 Incubator Accepted!",
      message: "Congratulations — you've been accepted into the incubator program! You now have access to office space, mentoring, and a warm investor network. Investors see this as external validation of your startup.",
      severity: "success",
      consequences: [
        "+1 Investor Appeal (external validation)",
        "Incubator office space now available",
        "Expect to give 2-8% equity in exchange",
        "Mentoring and warm investor introductions included",
      ],
    },
    pilotProjectStart: {
      trigger: "activity",
      activity: "pilotProject",
      title: "🏭 Pilot Project Launched!",
      message: "You've started a real-world pilot with an industry partner! This is a huge step - if successful, it proves your technology works outside the lab.",
      severity: "success",
      consequences: [
        "TRL +2 (major advancement)",
        "Strong proof point for investors",
        "Revenue potential if pilot converts",
      ],
    },
    loanApproved: {
      trigger: "activity",
      activity: "loanApplication",
      title: "🏦 Loan Application Submitted",
      message: "You've applied for bank financing. Remember: debt must be repaid regardless of company success. Make sure you can handle the payments.",
      severity: "warning",
      consequences: [
        "No equity dilution",
        "Interest payments start immediately",
        "Personal guarantees may be required",
      ],
    },
    raboInnovatieLeningApproved: {
      trigger: "activity",
      activity: "raboInnovatielening",
      title: "🏦 Rabo Innovatielening Approved!",
      message: "Rabobank has approved your innovation loan! You have access to €25k-€200k at 10% interest. The first 2 years are interest-only with no repayment required - this gives you breathing room to develop your technology.",
      severity: "success",
      consequences: [
        "No collateral required",
        "First 2 years: interest-only payments",
        "Subordinated loan (doesn't scare off investors)",
        "No equity dilution",
        "Must focus on innovation/sustainability/digitalization",
      ],
    },

    // Warning events
    lowCashWarning: {
      trigger: "metric",
      metric: "cash",
      threshold: 5000,
      comparison: "below",
      title: "⚠️ Cash Running Low!",
      message: "Your bank account is nearly empty. You need funding soon or you'll have to shut down operations.",
      severity: "danger",
      tips: [
        "Talk to the bank about a bridge loan",
        "Accelerate grant applications",
        "Consider investor funding despite dilution",
      ],
    },
    equityDilutionWarning: {
      trigger: "metric",
      metric: "founderEquity",
      threshold: 50,
      comparison: "below",
      title: "⚠️ Significant Dilution!",
      message: "Founders now own less than 50% of the company. You're losing control. Future investors will dilute you further.",
      severity: "warning",
      tips: [
        "Be very careful with future equity deals",
        "Consider debt financing instead",
        "Negotiate anti-dilution protections",
      ],
    },
    noCustomerValidation: {
      trigger: "roundEnd",
      round: 2,
      condition: "validations < 1",
      title: "🎯 No Customer Validation Yet!",
      message: "You've been building for a year without proving anyone will pay for this. This is the #1 reason deep tech startups fail.",
      severity: "danger",
      tips: [
        "Stop development and talk to customers",
        "Get a Letter of Intent before round 3",
        "Investors will reject you without validation",
      ],
    },
  },
// University-specific events
teachingConflict: {
  trigger: 'roundStart',
  round: 2,
  condition: 'employmentStatus === "university"',
  title: '📚 Teaching Load Conflict',
  message: 'Your department head reminds you of your teaching obligations. This semester requires significant time for courses and student supervision.',
  severity: 'warning',
  choices: [
    {
      id: 'accept',
      label: 'Accept teaching duties',
      effect: 'hours: -100',
      description: 'Lose 100 hours this round',
    },
    {
      id: 'negotiate',
      label: 'Negotiate reduction',
      effect: 'cash: -2000',
      description: 'Pay €2,000 for course buyout',
    },
    {
      id: 'refuse',
      label: 'Refuse (risky)',
      effect: 'event: forceExit',
      description: 'May be forced to leave university',
    },
  ],
},

careerCrossroads: {
  trigger: 'roundStart',
  round: 3,
  condition: 'employmentStatus === "university"',
  title: '🎓 Career Crossroads',
  message: 'Your tenure review is approaching. The committee has noticed your "entrepreneurial distractions." You need to make a choice about your career path.',
  severity: 'danger',
  choices: [
    {
      id: 'focusTenure',
      label: 'Focus on tenure',
      effect: 'hours: -200',
      description: 'Prioritize academic career (-200 hrs/round)',
    },
    {
      id: 'leaveForStartup',
      label: 'Leave for startup',
      effect: 'status: fulltime',
      description: 'Commit fully to entrepreneurship',
    },
    {
      id: 'tryBoth',
      label: 'Try to do both',
      effect: 'risk: tenure',
      description: '30% chance of failing tenure AND reduced time',
    },
  ],
},

investorCommitmentQuestion: {
  trigger: 'activity',
  activity: 'investorMeeting',
  condition: 'currentRound >= 3 && employmentStatus === "university"',
  title: '💰 Investor Questions Your Commitment',
  message: '"You\'re still at the university? Most founders we back are full-time by now. How committed are you really to this venture?"',
  severity: 'warning',
  consequences: [
    'Investor Appeal -1 while at university',
    'Some investors may pass',
    'Consider your timing',
  ],
},

noSafetyNet: {
  trigger: 'statusChange',
  newStatus: 'fulltime',
  title: '💼 The Leap of Faith',
  message: 'You\'ve left your stable university position. There\'s no safety net now. Your personal runway depends on the startup\'s success.',
  severity: 'info',
  tips: [
    'Budget for founder salaries (€12,000/founder/round)',
    'You can no longer apply for NWO Take-off grants',
    'But investors will see your commitment (+1 Appeal)',
  ],
},

lowRunwayWarning: {
  trigger: 'metric',
  metric: 'cash',
  threshold: 15000,
  comparison: 'below',
  condition: 'employmentStatus === "fulltime"',
  title: '⚠️ Running Low on Runway',
  message: 'Your cash is running low and you need €12,000/founder each round to live. Consider your options carefully.',
  severity: 'danger',
  tips: [
    'Accelerate fundraising efforts',
    'Consider a bridge loan from the bank',
    'Could reduce founder salaries temporarily',
  ],
},
  // ============================================
  // TEAM PROFILE OPTIONS
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
  // END GAME SCORING BREAKDOWN
  // Shown after round 4
  // ============================================
  endGameScoring: {
    categories: [
      {
        id: "financial",
        name: "Financial Health",
        icon: "💰",
        maxPoints: 25,
        metrics: [
          { id: "cash", name: "Cash Position", weight: 15, target: 50000, description: "More cash = more runway" },
          { id: "revenue", name: "Revenue Generated", weight: 10, target: 20000, description: "Paying customers prove value" },
        ],
      },
      {
        id: "technology",
        name: "Technology Progress",
        icon: "🔬",
        maxPoints: 25,
        metrics: [
          { id: "trl", name: "TRL Level", weight: 20, target: 7, description: "How close to market-ready" },
          { id: "patents", name: "IP Protection", weight: 5, target: 1, description: "Patents protect your innovation" },
        ],
      },
      {
        id: "market",
        name: "Market Validation",
        icon: "🎯",
        maxPoints: 25,
        metrics: [
          { id: "validations", name: "Customer Validations", weight: 15, target: 2, description: "LOIs and pilot agreements" },
          { id: "interviews", name: "Customer Interviews", weight: 10, target: 6, description: "Understanding your market" },
        ],
      },
      {
        id: "team",
        name: "Team & Structure",
        icon: "👥",
        maxPoints: 15,
        metrics: [
          { id: "equity", name: "Founder Equity", weight: 10, target: 60, description: "Maintain ownership control" },
          { id: "legalForm", name: "Legal Structure", weight: 5, target: 1, description: "BV established" },
        ],
      },
      {
        id: "bonuses",
        name: "Achievement Bonuses",
        icon: "🏆",
        maxPoints: 10,
        bonuses: [
          // === POSITIVE ACHIEVEMENTS ===
          {
            id: 'grantWinner',
            name: '🏆 Grant Winner',
            points: 3,
            condition: 'hasGrant',
            description: 'Secured non-dilutive funding',
            type: 'positive',
          },
          {
            id: 'incubator',
            name: '🏢 Incubator Star',
            points: 2,
            condition: 'inIncubator',
            description: 'Accepted into an incubator program',
            type: 'positive',
          },
          {
            id: 'balancedTeam',
            name: '👥 Dream Team',
            points: 2,
            condition: 'balancedTeam',
            description: 'Built a team with diverse skills',
            type: 'positive',
          },
          {
            id: 'goodLicence',
            name: '📜 Smart Negotiator',
            points: 2,
            condition: 'goodLicence',
            description: 'Negotiated a fair licence deal',
            type: 'positive',
          },
          {
            id: 'noBankruptcy',
            name: '💰 Financially Prudent',
            points: 1,
            condition: 'neverNegative',
            description: 'Never went into the red',
            type: 'positive',
          },
          {
            id: 'customerChampion',
            name: '🎯 Customer Champion',
            points: 2,
            condition: 'manyInterviews',
            description: '6+ customer interviews conducted',
            type: 'positive',
          },
          {
            id: 'ipProtected',
            name: '🛡️ IP Fortress',
            points: 2,
            condition: 'hasPatent',
            description: 'Filed a patent application',
            type: 'positive',
          },
          {
            id: 'secretKeeper',
            name: '🤫 Secret Keeper',
            points: 1,
            condition: 'hasKnowHow',
            description: 'Protected IP with know-how',
            type: 'positive',
          },
          {
            id: 'speedRunner',
            name: '🚀 Speed Runner',
            points: 2,
            condition: 'leftUniversityEarly',
            description: 'Committed full-time by round 2',
            type: 'positive',
          },

          // === NEGATIVE ACHIEVEMENTS (The Harsh Ones!) ===
          {
            id: 'bankruptBaby',
            name: '💸 Bankrupt Baby',
            points: -3,
            condition: 'wentBankrupt',
            description: 'Ran out of money completely',
            type: 'negative',
            roast: "Maybe try a lemonade stand first?",
          },
          {
            id: 'professorForever',
            name: '👴 Professor Forever',
            points: -2,
            condition: 'neverLeftUniversity',
            description: 'Still at university in round 4',
            type: 'negative',
            roast: "Your startup is just a really expensive hobby.",
          },
          {
            id: 'whatCustomers',
            name: '🙈 What Customers?',
            points: -3,
            condition: 'noCustomerValidation',
            description: 'Zero customer validations',
            type: 'negative',
            roast: "Building something nobody asked for. Classic.",
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
            id: 'patentWho',
            name: '📋 Patent? What Patent?',
            points: -2,
            condition: 'noIPProtection',
            description: 'No IP protection at all after 4 rounds',
            type: 'negative',
            roast: "Hope your competitors send a thank-you card.",
          },
          {
            id: 'ttoIgnorer',
            name: '🏛️ TTO Ghosted',
            points: -2,
            condition: 'noTTOMeeting',
            description: 'Never even talked to the TTO',
            type: 'negative',
            roast: "The university lawyers will be in touch.",
          },
          {
            id: 'terribleDeal',
            name: '🤡 Terrible Negotiator',
            points: -2,
            condition: 'badLicence',
            description: 'Accepted a revenue-based royalty',
            type: 'negative',
            roast: "The TTO is still laughing about this one.",
          },
          {
            id: 'allNerds',
            name: '🤓 All Nerds No Sales',
            points: -1,
            condition: 'allTechnicalTeam',
            description: 'Team has zero business skills',
            type: 'negative',
            roast: "Amazing tech that nobody knows how to sell.",
          },
          {
            id: 'meetingAvoider',
            name: '😰 Meeting Avoider',
            points: -1,
            condition: 'fewExpertMeetings',
            description: 'Used less than half your stickers',
            type: 'negative',
            roast: "The experts were lonely. Thanks.",
          },
          {
            id: 'speedBurn',
            name: '🔥 Speed Burn',
            points: -2,
            condition: 'burnedTooFast',
            description: 'Spent more than €80k in one round',
            type: 'negative',
            roast: "Money goes brrrrr... and then it's gone.",
          },
          {
            id: 'loanShark',
            name: '🦈 Loan Shark Victim',
            points: -1,
            condition: 'highInterestLoan',
            description: 'Accepted a loan with 10%+ interest',
            type: 'negative',
            roast: "The bank sends their regards. And invoices.",
          },
          {
            id: 'pivotKing',
            name: '🔄 Pivot Addict',
            points: -1,
            condition: 'tooManyPivots',
            description: 'Pivoted 3+ times',
            type: 'negative',
            roast: "At this point, you're just spinning in circles.",
          },
          {
            id: 'oneManShow',
            name: '🎭 One Person Show',
            points: -1,
            condition: 'noHires',
            description: 'Never hired anyone',
            type: 'negative',
            roast: "Delegation is not a weakness, promise.",
          },
          {
            id: 'grantDependent',
            name: '🍼 Grant Baby',
            points: -1,
            condition: 'onlyGrantFunding',
            description: 'Only funding is grants, no revenue or investment',
            type: 'negative',
            roast: "Grants aren't a business model, sweetie.",
          },
          {
            id: 'trlStuck',
            name: '🐌 Lab Rat',
            points: -2,
            condition: 'lowTRL',
            description: 'Still at TRL 4 or below',
            type: 'negative',
            roast: "Your technology will be ready... eventually... maybe...",
          },
          {
            id: 'interviewAllergic',
            name: '🤧 Interview Allergic',
            points: -2,
            condition: 'fewInterviews',
            description: 'Less than 3 customer interviews',
            type: 'negative',
            roast: "Talking to customers is scary, we get it.",
          },
        ],
      },
    ],

    // Achievement condition evaluation
    achievementConditions: {
      hasGrant: (data) => data.completedActivities?.some(a => ['grantTakeoff', 'grantWBSO', 'grantRegional'].includes(a)),
      inIncubator: (data) => data.completedActivities?.includes('incubatorApplication'),
      balancedTeam: (data) => {
        const profiles = [...(data.teamProfiles || []), ...(data.hiredProfiles || [])];
        const types = new Set(profiles.map(p => {
          if (['scientist', 'product'].includes(p)) return 'technical';
          if (['business', 'market'].includes(p)) return 'commercial';
          return 'operations';
        }));
        return types.size >= 2;
      },
      goodLicence: (data) => data.licenceAgreement === 'balanced',
      neverNegative: (data) => !data.wentNegative,
      manyInterviews: (data) => (data.interviewCount || 0) >= 6,
      hasPatent: (data) => data.completedActivities?.some(a => ['patentFiling'].includes(a)),
      hasKnowHow: (data) => {
        const hasKnowHowOnly = data.completedActivities?.includes('knowHowProtection');
        const hasPatent = data.completedActivities?.some(a => ['patentFiling'].includes(a));
        return hasKnowHowOnly && !hasPatent; // Only award if they have know-how but NOT patent
      },
      leftUniversityEarly: (data) => data.leftUniversityRound && data.leftUniversityRound <= 2,

      // Negative conditions
      wentBankrupt: (data) => (data.cash || 0) < -10000,
      neverLeftUniversity: (data) => data.employmentStatus === 'university',
      noCustomerValidation: (data) => (data.validationCount || 0) === 0,
      tooMuchDilution: (data) => (data.investorEquity || 0) > 50,
      noIPProtection: (data) => !data.completedActivities?.some(a => ['patentFiling', 'knowHowProtection'].includes(a)),
      noTTOMeeting: (data) => !data.completedActivities?.includes('ttoDiscussion'),
      badLicence: (data) => data.licenceAgreement === 'revenueHeavy',
      allTechnicalTeam: (data) => {
        const profiles = data.teamProfiles || [];
        return profiles.length > 0 && profiles.every(p => ['scientist', 'product'].includes(p));
      },
      fewExpertMeetings: (data) => (data.totalStickersUsed || 0) < 6,
      burnedTooFast: (data) => (data.maxSpendInRound || 0) > 80000,
      highInterestLoan: (data) => (data.loanInterest || 0) >= 10,
      tooManyPivots: (data) => (data.pivotCount || 0) >= 3,
      noHires: (data) => (data.employees || 0) === 0,
      onlyGrantFunding: (data) => {
        const hasGrant = data.completedActivities?.some(a => ['grantTakeoff', 'grantWBSO', 'grantRegional'].includes(a));
        const hasInvestment = (data.totalInvestment || 0) > 0;
        const hasRevenue = (data.totalRevenue || 0) > 0;
        return hasGrant && !hasInvestment && !hasRevenue;
      },
      lowTRL: (data) => (data.trl || 3) <= 4,
      fewInterviews: (data) => (data.interviewCount || 0) < 3,
    },
    rankings: {
      excellent: { min: 80, label: "🌟 Excellent", description: "Ready for Series A!" },
      strong: { min: 65, label: "💪 Strong", description: "On track for success" },
      good: { min: 50, label: "👍 Good", description: "Solid foundation" },
      developing: { min: 35, label: "📈 Developing", description: "More work needed" },
      struggling: { min: 0, label: "⚠️ Struggling", description: "Major challenges ahead" },
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
      expert: "customer",
      activities: ["customerInterviews", "customerValidation", "industryExploration"],
    },
    {
      id: "tto",
      title: "University & TTO",
      description: "Negotiate IP rights and your relationship with the university.",
      expert: "tto",
      activities: ["ttoDiscussion", "ttoNegotiation", "licenceNegotiation", "labNegotiation", "universityExit"],
    },
    {
      id: "ip",
      title: "Intellectual Property",
      description: "Protect your innovations. Meet TTO first.",
      expert: "patent",
      activities: ["patentSearch", "patentFiling", "knowHowProtection"],
    },
    {
      id: "funding",
      title: "Funding & Grants",
      description: "Secure money to grow. Different options have different trade-offs.",
      expert: "grant",
      activities: ["grantTakeoff", "grantWBSO", "grantRegional", "investorMeeting", "investorNegotiation"],
    },
    {
      id: "banking",
      title: "Bank & Loans",
      description: "Debt financing - no equity loss but must be repaid.",
      expert: "bank",
      activities: ["bankMeeting", "loanApplication", "raboInnovatielening"],
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
    {
      id: "strategy",
      title: "Strategy",
      description: "Major business decisions that reshape your direction.",
      activities: ["pivot"],
    },
  ],

  // ============================================
  // ACTIVITIES
  // ============================================
  activities: {
    // === CUSTOMER DISCOVERY ===
    customerInterviews: {
      name: "Customer Discovery Interviews",
      costTime: 48,
      costMoney: 0,
      category: "discovery",
      description: "Talk to real potential customers. Requires Interview Log from Business Developer.",
      requiresContract: "interviewLog",
      expert: "customer",
      hint: "Visit the Business Developer first — they will give you the Interview Log and help you define who to talk to.",
    },
    customerValidation: {
      name: "Customer Validation (LOI)",
      costTime: 72,
      costMoney: 0,
      category: "discovery",
      description: "Get a Letter of Intent from a real customer. Requires 2+ interviews. Business Developer confirms evidence quality.",
      requiresInterviews: 2,
      requiresContract: "loi",
      expert: "customer",
      triggersEvent: "customerValidationSuccess",
      hint: "The Business Developer will only give an LOI after 2+ solid interviews. Come with evidence, not enthusiasm.",
    },
    industryExploration: {
      name: "Industry Partner Exploration",
      costTime: 48,
      costMoney: 1000,
      stickerCost: 1,
      category: "discovery",
      description: "Identify potential industry partners or licensees.",
      requiresContract: "ndaAgreement",
      expert: "industry",
    },

    // === UNIVERSITY & TTO ===
    ttoDiscussion: {
      name: "TTO: Initial Discussion",
      costTime: 72,
      costMoney: 0,
      stickerCost: 1,
      category: "tto",
      description: "Required first step. Discuss IP ownership with Tech Transfer Office.",
      unlocks: ["ttoNegotiation", "licenceNegotiation", "patentSearch", "patentFiling", "knowHowProtection", "legalForm"],
      requiresContract: "ttoMeeting",
      expert: "tto",
      triggersEvent: "ttoFirstMeeting",
    },
    ttoNegotiation: {
      name: "TTO: Terms Negotiation",
      costTime: 72,
      costMoney: 0,
      stickerCost: 1,
      category: "tto",
      description: "Negotiate specific terms with the TTO.",
      requiresActivity: "ttoDiscussion",
      expert: "tto",
    },
    licenceNegotiation: {
      name: "Licence Agreement",
      costTime: 96,
      costMoney: 2000,
      stickerCost: 2,
      category: "tto",
      description: "Finalize the licence agreement with the university.",
      requiresActivity: "ttoDiscussion",
      unlocks: ["licenceChoice"],
      requiresContract: "licenceAgreement",
      expert: "tto",
    },
    labNegotiation: {
      name: "Lab Access Negotiation",
      costTime: 48,
      costMoney: 0,
      stickerCost: 1,
      category: "tto",
      description: "Negotiate continued use of university facilities after spinning off.",
      expert: "tto",
    },
    universityExit: {
      name: "University Exit Discussion",
      costTime: 72,
      costMoney: 0,
      stickerCost: 1,
      category: "tto",
      description: "Negotiate leaving terms, transition plan, ongoing relationships.",
      expert: "tto",
    },

    // === INTELLECTUAL PROPERTY ===
    patentSearch: {
      name: "Patent: Freedom to Operate",
      costTime: 48,
      costMoney: 2000,
      stickerCost: 1,
      category: "ip",
      description: "Check if your technology infringes existing patents.",
      requiresActivity: "ttoDiscussion",
      requiresContract: "ftoReport",
      expert: "patent",
    },
    patentFiling: {
      name: "Patent: Professional Filing",
      costTime: 120,
      costMoney: 15000,
      stickerCost: 2,
      category: "ip",
      description: "Hire attorney for proper IP protection. Stronger claims.",
      investorAppealBonus: 2,
      requiresActivity: "ttoDiscussion",
      requiresContract: "patentStrategy",
      expert: "patent",
      triggersEvent: "patentFiled",
    },
    knowHowProtection: {
      name: "Know-How Protection",
      costTime: 48,
      costMoney: 2500,
      stickerCost: 1,
      category: "ip",
      description: "Trade secrets, NDAs, and documentation. Quick and cheaper than patent.",
      investorAppealBonus: 1,
      trlBonus: 1,
      requiresActivity: "ttoDiscussion",
      expert: "patent",
      canUpgradeToPatent: true,
      risks: ["Can be reverse-engineered", "No legal exclusivity"],
    },

    // === FUNDING & GRANTS ===
    grantTakeoff: {
      name: "NWO Take-off Application",
      costTime: 96,
      costMoney: 0,
      stickerCost: 2,
      category: "funding",
      description: "€40-250k, no equity loss. Very competitive, 3-6 month process.",
      requiresContract: "grantApplication",
      expert: "grant",
      triggersEvent: "grantApproved",
    },
    grantWBSO: {
      name: "WBSO Registration",
      costTime: 48,
      costMoney: 0,
      stickerCost: 1,
      category: "funding",
      description: "Tax credit on R&D costs. ~€20k/year benefit. Relatively easy.",
      requiresContract: "grantApplication",
      expert: "grant",
    },
    grantRegional: {
      name: "Regional Fund (ROM/MIT)",
      costTime: 72,
      costMoney: 0,
      stickerCost: 1,
      category: "funding",
      description: "€50-150k, may take small equity stake (0-8%).",
      requiresContract: "grantApplication",
      expert: "grant",
    },
    investorMeeting: {
      name: "Investor Meeting",
      costTime: 48,
      costMoney: 0,
      stickerCost: 1,
      category: "funding",
      description: "Pitch to VCs or angels. Build relationships.",
      unlocks: ["investorNegotiation"],
      requiresContract: "pitchDeck",
      expert: "investor",
      triggersEvent: "investorFirstMeeting",
    },
    investorNegotiation: {
      name: "Term Sheet Negotiation",
      costTime: 72,
      costMoney: 5000,
      stickerCost: 2,
      category: "funding",
      description: "Negotiate investment terms. Lawyer costs included.",
      requiresActivity: "investorMeeting",
      requiresContract: "termSheet",
      expert: "investor",
    },

    // === BANK & LOANS (NEW) ===
    bankMeeting: {
      name: "Bank: Initial Meeting",
      costTime: 48,
      costMoney: 0,
      stickerCost: 1,
      category: "banking",
      description: "Discuss financing options with the bank. They want to see your business plan.",
      unlocks: ["loanApplication", "raboInnovatielening"],
      requiresContract: "loanApplication",
      expert: "bank",
      triggersEvent: "bankMeetingEvent",
    },
    loanApplication: {
      name: "Loan Application",
      costTime: 72,
      costMoney: 500,
      stickerCost: 1,
      category: "banking",
      description: "Apply for bank financing. Application fee included.",
      requiresActivity: "bankMeeting",
      requiresContract: "loanAgreement",
      expert: "bank",
      triggersEvent: "loanApproved",
    },
    raboInnovatielening: {
      name: "Rabo Innovatielening",
      costTime: 96,
      costMoney: 1000,
      stickerCost: 2,
      category: "banking",
      description: "Innovation loan from Rabobank (€25k-€200k at 10% interest). No collateral required.",
      requiresActivity: "bankMeeting",
      requiresContract: "loanAgreement",
      expert: "bank",
      partner: "rabobank",
      triggersEvent: "raboInnovatieLeningApproved",
      loanDetails: {
        minAmount: 25000,
        maxAmount: 200000,
        interestRate: 10,
        duration: 7,
        gracePeriod: 2,
        requiresCollateral: false,
        requiresPitch: true,
      },
      requirements: {
        legalForm: ['bv', 'holding'],
        minFounders: 2,
        employmentStatus: ['parttime', 'fulltime'],
      },
      benefits: [
        'No collateral required',
        'First 2 years no repayment',
        'Designed for pre-revenue startups',
        'Subordinated loan (investor-friendly)'
      ],
      restrictions: [
        'Must be a BV (not sole proprietor)',
        'Need at least 2 founders',
        'Must have left university (at least part-time)',
        'Focus on innovation/sustainability/digitalization'
      ]
    },

    // === TEAM & HIRING ===
    cofounderAgreement: {
      name: "Co-founder Agreement",
      costTime: 80,
      costMoney: 2000,
      stickerCost: 0,
      category: "team",
      description: "Equity split, vesting, roles. +1 Investor Appeal. Required before investor negotiation.",
      investorAppealBonus: 1,
      requiredFor: ["investorNegotiation"],
    },
    hireBusinessPerson: {
      name: "Hire: Business/Sales Expert",
      costTime: 40,
      costMoney: 0,
      stickerCost: 0,
      category: "team",
      description: "Add business skills. +1 Investor Appeal. Customer activities 20% faster. €25k/round salary.",
      addsProfile: "business",
      salaryOngoing: true,
      investorAppealBonus: 1,
      activityTimeModifier: {
        activities: ["customerInterviews", "customerValidation", "industryExploration"],
        modifier: 0.8,
      },
    },
    hireMarketExpert: {
      name: "Hire: Market Expert",
      costTime: 40,
      costMoney: 0,
      stickerCost: 0,
      category: "team",
      description: "Add market knowledge. Doubles customer interview output. €25k/round salary.",
      addsProfile: "market",
      salaryOngoing: true,
      interviewMultiplier: 2,
    },
    hireOperations: {
      name: "Hire: Operations/Finance",
      costTime: 40,
      costMoney: 0,
      stickerCost: 0,
      category: "team",
      description: "Add operational expertise. Saves €2k/round on activity costs. €25k/round salary.",
      addsProfile: "operations",
      salaryOngoing: true,
      activityCostReduction: 2000,
    },
    networking: {
      name: "Conference / Demo Day",
      costTime: 100,
      costMoney: 1000,
      stickerCost: 0,
      category: "team",
      description: "Build network. Investor meetings cost 24 hrs less this round.",
      nextActivityDiscount: { activity: "investorMeeting", hours: 24 },
    },

    // === PRODUCT DEVELOPMENT ===
    prototypeDevelopment: {
      name: "Prototype Development",
      costTime: 250,
      costMoney: 5000,
      stickerCost: 0,
      category: "development",
      description: "Build working prototype. Increases TRL by 1.",
      trlBonus: 1,
    },
    pilotProject: {
      name: "Pilot Project",
      costTime: 120,
      costMoney: 10000,
      stickerCost: 2,
      category: "development",
      description: "Real-world test with customer. Big TRL jump (+2).",
      trlBonus: 2,
      requiresActivity: "customerValidation",
      requiresContract: "pilotAgreement",
      expert: "industry",
      triggersEvent: "pilotProjectStart",
    },
    incubatorApplication: {
      name: "Incubator Application",
      costTime: 48,
      costMoney: 0,
      stickerCost: 1,
      category: "development",
      description: "Apply for startup program. +1 Investor Appeal. Unlocks incubator office space.",
      investorAppealBonus: 1,
      unlocks: ["incubatorOffice"],
      requiresContract: "incubatorApp",
      expert: "incubator",
      triggersEvent: "incubatorAccepted",
      oneTimeOnly: true,
    },

    // === STRATEGY & PIVOTING ===
    pivot: {
      name: "🔄 Pivot Business Direction",
      stickerCost: 0,  // Internal decision, no expert needed
      costTime: 350,   // Very time intensive - rebuilding your approach!
      costMoney: 5000, // Some costs for new materials, prototypes, etc.
      category: 'strategy',
      description: "Major change in business direction based on market feedback",

      // Pivot effects
      effects: {
        trlReduction: 1,           // Lose 1 TRL level (new direction needs validation)
        interviewsReset: false,     // Keep your interview count (you learned from them!)
        validationsReset: true,     // Lose validations (they were for old direction)
        prototypeReset: true,       // Prototype needs rework
      },

      // Requirements
      requires: {
        minInterviews: 2,          // Must have done customer discovery first
        minRound: 2,               // Can't pivot in round 1
      },

      // Unlocks
      unlocks: [],

      // Warning shown before confirming
      warning: "⚠️ Pivoting will reset your customer validations and reduce TRL by 1. Your interview insights remain. Are you sure?",

      // Learning moment
      learningMoment: "Pivoting based on customer feedback is smart. Pivoting without customer feedback is just guessing.",
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