// Interrupt Cards — University & Part-time founders only
// Drawn from a physical deck; players find card number and select in UI

export const INTERRUPT_CARDS = [
  // Teaching & Supervision (#01-10)
  { id: '01', name: 'Bachelor Thesis Supervision', hours: -40, money: 0,     trl: 0 },
  { id: '02', name: 'Master Thesis Committee',     hours: -50, money: 0,     trl: 0 },
  { id: '03', name: 'Guest Lecture Request',        hours: -25, money: 0,     trl: 0 },
  { id: '04', name: 'Course Redesign Required',     hours: -60, money: 0,     trl: 0 },
  { id: '05', name: 'Exam Grading Pile',            hours: -35, money: 0,     trl: 0 },
  { id: '06', name: 'Student Complaints',           hours: -30, money: -500,  trl: 0 },
  { id: '07', name: 'Teaching Award Nomination',    hours: 0,   money: 1000,  trl: 0 },
  { id: '08', name: 'Popular Professor',            hours: -25, money: 0,     trl: 0 },
  { id: '09', name: 'PhD Defense Committee',        hours: -40, money: 0,     trl: 0 },
  { id: '10', name: 'Accreditation Visit',          hours: -50, money: 0,     trl: 0 },

  // Research & Academic (#11-20)
  { id: '11', name: 'Paper Revision Deadline',      hours: -45, money: 0,     trl: 0 },
  { id: '12', name: 'Conference Presentation',      hours: -35, money: -800,  trl: 0 },
  { id: '13', name: 'Grant Report Due',             hours: -40, money: 0,     trl: 0 },
  { id: '14', name: 'Peer Review Request',          hours: -25, money: 0,     trl: 0 },
  { id: '15', name: 'Lab Equipment Breakdown',      hours: 0,   money: -1500, trl: 0 },
  { id: '16', name: 'Research Collaboration',       hours: 0,   money: 0,     trl: 1 },
  { id: '17', name: 'Unexpected Citation',          hours: 0,   money: 500,   trl: 0 },
  { id: '18', name: 'Journal Editor Duties',        hours: -30, money: 0,     trl: 0 },
  { id: '19', name: 'Failed Experiment',            hours: -50, money: 0,     trl: 0 },
  { id: '20', name: 'Breakthrough Discovery',       hours: -30, money: 0,     trl: 1 },

  // Administrative & Meetings (#21-30)
  { id: '21', name: 'Faculty Meeting Marathon',     hours: -25, money: 0,     trl: 0 },
  { id: '22', name: 'Committee Assignment',         hours: -35, money: 0,     trl: 0 },
  { id: '23', name: 'Budget Review Required',       hours: -30, money: 0,     trl: 0 },
  { id: '24', name: 'HR Paperwork',                 hours: -20, money: 0,     trl: 0 },
  { id: '25', name: 'Strategy Day',                 hours: -40, money: 0,     trl: 0 },
  { id: '26', name: 'Compliance Training',          hours: -25, money: 0,     trl: 0 },
  { id: '27', name: 'IT System Migration',          hours: -30, money: 0,     trl: 0 },
  { id: '28', name: 'Annual Performance Review',    hours: -25, money: 0,     trl: 0 },
  { id: '29', name: 'Department Restructuring',     hours: -40, money: 0,     trl: 0 },
  { id: '30', name: 'Workspace Relocation',         hours: -35, money: -500,  trl: 0 },

  // University Politics (#31-40)
  { id: '31', name: "Dean's Special Request",       hours: -45, money: 0,     trl: 0 },
  { id: '32', name: 'Interdepartmental Conflict',   hours: -30, money: 0,     trl: 0 },
  { id: '33', name: 'Policy Change Consultation',   hours: -25, money: 0,     trl: 0 },
  { id: '34', name: 'Union Negotiations',           hours: -20, money: 0,     trl: 0 },
  { id: '35', name: 'Media Interview Request',      hours: -15, money: 500,   trl: 0 },
  { id: '36', name: 'Alumni Event',                 hours: -25, money: 0,     trl: 0 },
  { id: '37', name: 'Funding Politics',             hours: -35, money: 0,     trl: 0 },
  { id: '38', name: 'Colleague Sabbatical Cover',   hours: -60, money: 0,     trl: 0 },
  { id: '39', name: 'New Professor Onboarding',     hours: -30, money: 0,     trl: 0 },
  { id: '40', name: 'Department Head Pressure',     hours: -40, money: 0,     trl: 0 },

  // Personal & Life Events (#41-50)
  { id: '41', name: 'Family Emergency',             hours: -50, money: 0,     trl: 0 },
  { id: '42', name: 'Sick Days',                    hours: -40, money: 0,     trl: 0 },
  { id: '43', name: 'Childcare Crisis',             hours: -35, money: 0,     trl: 0 },
  { id: '44', name: 'Home Repairs',                 hours: -25, money: -1000, trl: 0 },
  { id: '45', name: 'Car Breakdown',                hours: 0,   money: -800,  trl: 0 },
  { id: '46', name: 'Vacation (Mandatory)',          hours: -60, money: 0,     trl: 0 },
  { id: '47', name: 'Wedding/Funeral',              hours: -30, money: 0,     trl: 0 },
  { id: '48', name: 'Jury Duty',                    hours: -40, money: 0,     trl: 0 },
  { id: '49', name: 'Moving House',                 hours: -45, money: -500,  trl: 0 },
  { id: '50', name: 'Health Checkup',               hours: -20, money: 0,     trl: 0 },

  // Lucky Cards (#51-55)
  { id: '51', name: 'Research Assistant Help',      hours: 30,  money: 0,     trl: 0 },
  { id: '52', name: 'Conference Cancelled',         hours: 40,  money: 0,     trl: 0 },
  { id: '53', name: 'Grant Approved Early',         hours: 0,   money: 2000,  trl: 0 },
  { id: '54', name: 'Industry Contact',             hours: 0,   money: 0,     trl: 0, freeExpert: true },
  { id: '55', name: 'Efficient Semester',           hours: 50,  money: 0,     trl: 0 },
];

// Group labels for optgroups in the dropdown
export const INTERRUPT_CARD_GROUPS = [
  { label: 'Teaching & Supervision (#01-10)', ids: ['01','02','03','04','05','06','07','08','09','10'] },
  { label: 'Research & Academic (#11-20)',    ids: ['11','12','13','14','15','16','17','18','19','20'] },
  { label: 'Administrative (#21-30)',         ids: ['21','22','23','24','25','26','27','28','29','30'] },
  { label: 'University Politics (#31-40)',    ids: ['31','32','33','34','35','36','37','38','39','40'] },
  { label: 'Personal & Life (#41-50)',        ids: ['41','42','43','44','45','46','47','48','49','50'] },
  { label: 'Lucky Cards (#51-55)',            ids: ['51','52','53','54','55'] },
];
