// Interrupt Cards — University & Part-time founders only
// Drawn from a physical deck; selected in the UI at round submission

export const INTERRUPT_CARDS = {
  noCard: { id: 'noCard', title: 'No card', effect: {} },

  // -25 hours (10 cards)
  studentOfficeHours:     { id: 'studentOfficeHours',     title: 'Student Office Hours',     effect: { hours: -25 }, category: 'time_minor' },
  emailAvalanche:         { id: 'emailAvalanche',         title: 'Email Avalanche',           effect: { hours: -25 }, category: 'time_minor' },
  itSystemUpdate:         { id: 'itSystemUpdate',         title: 'IT System Update',          effect: { hours: -25 }, category: 'time_minor' },
  fireDrill:              { id: 'fireDrill',              title: 'Fire Drill',                effect: { hours: -25 }, category: 'time_minor' },
  printerEmergency:       { id: 'printerEmergency',       title: 'Printer Emergency',         effect: { hours: -25 }, category: 'time_minor' },
  coffeeMachinePolitics:  { id: 'coffeeMachinePolitics',  title: 'Coffee Machine Politics',   effect: { hours: -25 }, category: 'time_minor' },
  parkingPermit:          { id: 'parkingPermit',          title: 'Parking Permit Renewal',    effect: { hours: -25 }, category: 'time_minor' },
  buildingMaintenance:    { id: 'buildingMaintenance',    title: 'Building Maintenance',      effect: { hours: -25 }, category: 'time_minor' },
  seminarAttendance:      { id: 'seminarAttendance',      title: 'Seminar Attendance',        effect: { hours: -25 }, category: 'time_minor' },
  ethicsFormRevision:     { id: 'ethicsFormRevision',     title: 'Ethics Form Revision',      effect: { hours: -25 }, category: 'time_minor' },

  // -50 hours (16 cards)
  teachingEmergency:          { id: 'teachingEmergency',          title: 'Teaching Emergency',            effect: { hours: -50 }, category: 'time_medium' },
  phdStudentCrisis:           { id: 'phdStudentCrisis',           title: 'PhD Student Crisis',            effect: { hours: -50 }, category: 'time_medium' },
  peerReviewRequest:          { id: 'peerReviewRequest',          title: 'Peer Review Request',           effect: { hours: -50 }, category: 'time_medium' },
  masterThesisSupervision:    { id: 'masterThesisSupervision',    title: 'Master Thesis Supervision',     effect: { hours: -50 }, category: 'time_medium' },
  labSafetyTraining:          { id: 'labSafetyTraining',          title: 'Lab Safety Training',           effect: { hours: -50 }, category: 'time_medium' },
  facultyRetreat:             { id: 'facultyRetreat',             title: 'Faculty Retreat',               effect: { hours: -50 }, category: 'time_medium' },
  grantReportDue:             { id: 'grantReportDue',             title: 'Grant Report Due',              effect: { hours: -50 }, category: 'time_medium' },
  courseRedesign:             { id: 'courseRedesign',             title: 'Course Redesign',               effect: { hours: -50 }, category: 'time_medium' },
  bachelorProjectGrading:     { id: 'bachelorProjectGrading',     title: 'Bachelor Project Grading',      effect: { hours: -50 }, category: 'time_medium' },
  externalExaminer:           { id: 'externalExaminer',           title: 'External Examiner',             effect: { hours: -50 }, category: 'time_medium' },
  researchDataManagement:     { id: 'researchDataManagement',     title: 'Research Data Management',      effect: { hours: -50 }, category: 'time_medium' },
  teachingEvaluationFeedback: { id: 'teachingEvaluationFeedback', title: 'Teaching Evaluation Feedback',  effect: { hours: -50 }, category: 'time_medium' },
  collaborationMeeting:       { id: 'collaborationMeeting',       title: 'Collaboration Meeting',         effect: { hours: -50 }, category: 'time_medium' },
  labInventory:               { id: 'labInventory',               title: 'Lab Inventory',                 effect: { hours: -50 }, category: 'time_medium' },
  referenceLetters:           { id: 'referenceLetters',           title: 'Reference Letters',             effect: { hours: -50 }, category: 'time_medium' },
  departmentPolitics:         { id: 'departmentPolitics',         title: 'Department Politics',           effect: { hours: -50, money: -500 }, category: 'time_money_combo' },

  // -75 hours (13 cards)
  grantDeadline:              { id: 'grantDeadline',              title: 'Grant Deadline',                effect: { hours: -75 }, category: 'time_major' },
  conferenceOrganization:     { id: 'conferenceOrganization',     title: 'Conference Organization',       effect: { hours: -75 }, category: 'time_major' },
  newCoursePreparation:       { id: 'newCoursePreparation',       title: 'New Course Preparation',        effect: { hours: -75 }, category: 'time_major' },
  phdCommitteeMeeting:        { id: 'phdCommitteeMeeting',        title: 'PhD Committee Meeting',         effect: { hours: -75 }, category: 'time_major' },
  researchProposal:           { id: 'researchProposal',           title: 'Research Proposal',             effect: { hours: -75 }, category: 'time_major' },
  departmentStrategicPlanning:{ id: 'departmentStrategicPlanning',title: 'Department Strategic Planning', effect: { hours: -75 }, category: 'time_major' },
  visitingResearcher:         { id: 'visitingResearcher',         title: 'Visiting Researcher',           effect: { hours: -75 }, category: 'time_major' },
  mediaInterview:             { id: 'mediaInterview',             title: 'Media Interview',               effect: { hours: -75 }, category: 'time_major' },
  industryWorkshop:           { id: 'industryWorkshop',           title: 'Industry Workshop',             effect: { hours: -75 }, category: 'time_major' },
  sabbaticalPlanning:         { id: 'sabbaticalPlanning',         title: 'Sabbatical Planning',           effect: { hours: -75 }, category: 'time_major' },
  committeeMeeting:           { id: 'committeeMeeting',           title: 'Committee Meeting',             effect: { hours: -75 }, category: 'time_major' },
  deansEmergencyMeeting:      { id: 'deansEmergencyMeeting',      title: "Dean's Emergency Meeting",      effect: { hours: -75 }, category: 'time_major' },
  phdDefenseConflict:         { id: 'phdDefenseConflict',         title: 'PhD Defense Conflict',          effect: { hours: -75, money: -100 }, category: 'time_money_combo' },

  // -100 hours (6 cards)
  conferencePaperDeadline:    { id: 'conferencePaperDeadline',    title: 'Conference Paper Deadline',     effect: { hours: -100 }, category: 'time_catastrophic' },
  majorGrantApplication:      { id: 'majorGrantApplication',      title: 'Major Grant Application',       effect: { hours: -100 }, category: 'time_catastrophic' },
  tenureReviewPreparation:    { id: 'tenureReviewPreparation',    title: 'Tenure Review Preparation',     effect: { hours: -100 }, category: 'time_catastrophic' },
  journalRevision:            { id: 'journalRevision',            title: 'Journal Revision',              effect: { hours: -100 }, category: 'time_catastrophic' },
  accreditationDocumentation: { id: 'accreditationDocumentation', title: 'Accreditation Documentation',   effect: { hours: -100 }, category: 'time_catastrophic' },
  unexpectedTeaching:         { id: 'unexpectedTeaching',         title: 'Unexpected Teaching',           effect: { hours: -100 }, category: 'time_catastrophic' },

  // Money loss (5 cards)
  labEquipmentBreakdown: { id: 'labEquipmentBreakdown', title: 'Lab Equipment Breakdown', effect: { money: -1500 }, category: 'money' },
  chemicalSpill:         { id: 'chemicalSpill',         title: 'Chemical Spill',          effect: { money: -1000 }, category: 'money' },
  conferenceRegistration:{ id: 'conferenceRegistration',title: 'Conference Registration', effect: { money: -800  }, category: 'money' },
  softwareLicense:       { id: 'softwareLicense',       title: 'Software License',        effect: { money: -500  }, category: 'money' },
  labSupplies:           { id: 'labSupplies',           title: 'Lab Supplies',            effect: { money: -600  }, category: 'money' },

  // Positive (5 cards)
  paperAccepted:    { id: 'paperAccepted',    title: 'Paper Accepted!',    effect: { money: 2000 },            isPositive: true },
  phdBreakthrough:  { id: 'phdBreakthrough',  title: 'PhD Breakthrough',   effect: { trl: 1 },                 isPositive: true },
  networkingGold:   { id: 'networkingGold',   title: 'Networking Gold',    effect: { freeExpertMeeting: true }, isPositive: true },
  teachingAward:    { id: 'teachingAward',    title: 'Teaching Award',     effect: { money: 1000, hours: 25 }, isPositive: true },
  grantLeftover:    { id: 'grantLeftover',    title: 'Grant Leftover',     effect: { money: 3000 },            isPositive: true },
};
