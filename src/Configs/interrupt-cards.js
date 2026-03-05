// Interrupt Cards — University & Part-time founders only
// Drawn from a physical deck; players find card number and select in UI

export const INTERRUPT_CARDS = [

  // ── LOSE 25 HOURS (#01–10) ──────────────────────────────────────────────
  {
    id: '01', name: 'Student Office Hours',
    description: "It's exam season. Every student suddenly has 'urgent questions' about material from week 2.",
    hours: -25, money: 0, trl: 0,
  },
  {
    id: '02', name: 'Email Avalanche',
    description: "You were offline for one day. 47 emails marked 'urgent'. None of them are. But you still have to read them all.",
    hours: -25, money: 0, trl: 0,
  },
  {
    id: '03', name: 'IT System Update',
    description: "The university changed the HR system. Again. Please re-enter all your details. Again.",
    hours: -25, money: 0, trl: 0,
  },
  {
    id: '04', name: 'Fire Drill',
    description: "Mandatory evacuation drill. Right in the middle of your most productive hour. Everyone to the parking lot!",
    hours: -25, money: 0, trl: 0,
  },
  {
    id: '05', name: 'Printer Emergency',
    description: "The department printer is jammed. You're the only one under 50. Guess who has to fix it?",
    hours: -25, money: 0, trl: 0,
  },
  {
    id: '06', name: 'Coffee Machine Politics',
    description: "Someone used the last coffee pod and didn't refill. Department-wide email thread ensues. You're cc'd.",
    hours: -25, money: 0, trl: 0,
  },
  {
    id: '07', name: 'Parking Permit Renewal',
    description: "Your parking permit expired. Spend the morning in line at the admin building. Bring a book.",
    hours: -25, money: 0, trl: 0,
  },
  {
    id: '08', name: 'Building Maintenance',
    description: "They're fixing the heating. Your office is freezing. You relocate to the library. Productivity drops.",
    hours: -25, money: 0, trl: 0,
  },
  {
    id: '09', name: 'Seminar Attendance',
    description: "A visiting speaker you've never heard of. Mandatory attendance for all junior faculty. Free lunch though.",
    hours: -25, money: 0, trl: 0,
  },
  {
    id: '10', name: 'Ethics Form Revision',
    description: "Your ethics approval needs 'minor revisions'. Three pages of bureaucratic clarifications.",
    hours: -25, money: 0, trl: 0,
  },

  // ── LOSE 50 HOURS (#11–25) ──────────────────────────────────────────────
  {
    id: '11', name: 'Teaching Emergency',
    description: "A colleague is sick and you need to cover their lecture. Today. Hope you remember thermodynamics!",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '12', name: 'PhD Student Crisis',
    description: "Your PhD student's experiment failed spectacularly. Again. Time for an emergency meeting.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '13', name: 'Peer Review Request',
    description: "A journal needs you to review a 47-page paper. Deadline: Friday. It's in a field you barely know.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '14', name: 'Master Thesis Supervision',
    description: "Three students want you to supervise their thesis. You can't say no. The department is watching.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '15', name: 'Lab Safety Training',
    description: "Annual mandatory safety training. Yes, you know not to drink the chemicals. Yes, you still have to attend.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '16', name: 'Faculty Retreat',
    description: "Two-day 'team building' at a conference center. Trust falls and strategy sessions. Non-negotiable.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '17', name: 'Grant Report Due',
    description: "Your funding agency wants a progress report. 20 pages of justifying why you spent €47 on pipette tips.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '18', name: 'Course Redesign',
    description: "The curriculum committee wants your course 'updated for the digital age'. Add more videos, they say.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '19', name: 'Bachelor Project Grading',
    description: "12 bachelor projects to grade. Each one 40 pages of varying quality. Due by Monday.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '20', name: 'External Examiner',
    description: "You're assigned as external examiner for a PhD defense. In another city. Travel time not included.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '21', name: 'Research Data Management',
    description: "New university policy: all your data needs to be in the institutional repository. With metadata.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '22', name: 'Teaching Evaluation Feedback',
    description: "Your course evaluations are in. Now you have to write a 'reflection document' on the feedback.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '23', name: 'Collaboration Meeting',
    description: "A professor from another department wants to 'explore synergies'. Two hours of vague discussion.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '24', name: 'Lab Inventory',
    description: "Annual lab inventory. Count every beaker, label every chemical. Finance is asking questions.",
    hours: -50, money: 0, trl: 0,
  },
  {
    id: '25', name: 'Reference Letters',
    description: "Four students need reference letters. This week. For different programs. Each requires customization.",
    hours: -50, money: 0, trl: 0,
  },

  // ── LOSE 75 HOURS (#26–35) ──────────────────────────────────────────────
  {
    id: '26', name: 'Grant Deadline',
    description: "The department needs your input on a grant proposal. Due tomorrow. Your name is already on it.",
    hours: -75, money: 0, trl: 0,
  },
  {
    id: '27', name: 'Conference Organization',
    description: "You volunteered to help organize a workshop. 'Help' means 'do most of the work'.",
    hours: -75, money: 0, trl: 0,
  },
  {
    id: '28', name: 'New Course Preparation',
    description: "You've been assigned a new course. Topic: something you did your PhD on. 10 years ago.",
    hours: -75, money: 0, trl: 0,
  },
  {
    id: '29', name: 'PhD Committee Meeting',
    description: "You're on three PhD committees. They all scheduled their annual meetings this month.",
    hours: -75, money: 0, trl: 0,
  },
  {
    id: '30', name: 'Research Proposal',
    description: "A funding call perfectly matches your research. Deadline: two weeks. Proposal: 25 pages.",
    hours: -75, money: 0, trl: 0,
  },
  {
    id: '31', name: 'Department Strategic Planning',
    description: "The dean wants a '5-year research vision' from every group. With KPIs. And a SWOT analysis.",
    hours: -75, money: 0, trl: 0,
  },
  {
    id: '32', name: 'Visiting Researcher',
    description: "A researcher from abroad is visiting for a week. You're their host. Tours, dinners, meetings.",
    hours: -75, money: 0, trl: 0,
  },
  {
    id: '33', name: 'Media Interview',
    description: "Your research made the news! Now you have to explain quantum physics to a journalist. In simple terms.",
    hours: -75, money: 0, trl: 0,
  },
  {
    id: '34', name: 'Industry Workshop',
    description: "The university wants you to present at an industry day. Create a poster. Prepare a pitch. Network.",
    hours: -75, money: 0, trl: 0,
  },
  {
    id: '35', name: 'Sabbatical Planning',
    description: "Your sabbatical application is due. Write a 10-page research plan. Find a host institution. Get approvals.",
    hours: -75, money: 0, trl: 0,
  },

  // ── LOSE 100 HOURS (#36–40) ─────────────────────────────────────────────
  {
    id: '36', name: 'Conference Paper Deadline',
    description: "You totally forgot about that conference submission. It's due in 48 hours. Time to write!",
    hours: -100, money: 0, trl: 0,
  },
  {
    id: '37', name: 'Major Grant Application',
    description: "An ERC Starting Grant is calling your name. 100 hours of writing for a 10% success rate. Worth it?",
    hours: -100, money: 0, trl: 0,
  },
  {
    id: '38', name: 'Tenure Review Preparation',
    description: "Your tenure review is coming up. Update your CV, portfolio, teaching statement, research vision...",
    hours: -100, money: 0, trl: 0,
  },
  {
    id: '39', name: 'Journal Revision',
    description: "Reviewer 2 wants 'major revisions'. 47 comments. Most of them contradicting Reviewer 1.",
    hours: -100, money: 0, trl: 0,
  },
  {
    id: '40', name: 'Accreditation Documentation',
    description: "Program accreditation requires documentation of all your courses. Learning outcomes, assessment matrices, alignment tables.",
    hours: -100, money: 0, trl: 0,
  },

  // ── COMBINED TIME & MONEY LOSS (#41–45) ─────────────────────────────────
  {
    id: '41', name: 'Committee Meeting',
    description: "You're on the curriculum committee. Three hours of discussing font sizes in the syllabus. Mandatory.",
    hours: -75, money: 0, trl: 0,
  },
  {
    id: '42', name: 'Department Politics',
    description: "Two senior professors are feuding again. As the youngest staff member, you get to 'mediate'. Stress-eating ensues.",
    hours: -50, money: -500, trl: 0,
  },
  {
    id: '43', name: "Dean's Emergency Meeting",
    description: "The dean called an all-hands meeting. No agenda provided. Three hours of your life you won't get back.",
    hours: -75, money: 0, trl: 0,
  },
  {
    id: '44', name: 'Unexpected Teaching',
    description: "A guest lecturer cancelled last minute. You're teaching their slot. In 30 minutes. Prep time gone!",
    hours: -100, money: 0, trl: 0,
  },
  {
    id: '45', name: 'PhD Defense Conflict',
    description: "You completely forgot you're on a PhD committee today. The defense takes all day. And there's a dinner.",
    hours: -75, money: -100, trl: 0,
  },

  // ── MONEY LOSS ONLY (#46–50) ────────────────────────────────────────────
  {
    id: '46', name: 'Lab Equipment Breakdown',
    description: "The mass spectrometer is making weird noises again. You're the only one who knows how to fix it.",
    hours: 0, money: -1500, trl: 0,
  },
  {
    id: '47', name: 'Chemical Spill',
    description: "Someone knocked over the expensive reagents. Cleanup costs and replacement. Insurance doesn't cover stupidity.",
    hours: 0, money: -1000, trl: 0,
  },
  {
    id: '48', name: 'Conference Registration',
    description: "That conference you submitted to? It's in Hawaii. Registration fee not covered by department.",
    hours: 0, money: -800, trl: 0,
  },
  {
    id: '49', name: 'Software License',
    description: "The free trial of that essential software ended. Personal license required.",
    hours: 0, money: -500, trl: 0,
  },
  {
    id: '50', name: 'Lab Supplies',
    description: "The department budget is frozen. But your experiment needs specific supplies. Now. Personal credit card time.",
    hours: 0, money: -600, trl: 0,
  },

  // ── POSITIVE CARDS (#51–55) ─────────────────────────────────────────────
  {
    id: '51', name: 'Paper Accepted!',
    description: "Your paper got accepted in a top journal! First round, no revisions. The reviewers loved it!",
    hours: 0, money: 2000, trl: 0,
  },
  {
    id: '52', name: 'PhD Breakthrough',
    description: "Your PhD student finally cracked the problem! Their experiment worked perfectly.",
    hours: 0, money: 0, trl: 1,
  },
  {
    id: '53', name: 'Networking Gold',
    description: "You sat next to a program manager at a conference dinner. They love your research. New opportunities incoming!",
    hours: 0, money: 0, trl: 0, freeExpert: true,
  },
  {
    id: '54', name: 'Teaching Award',
    description: "You won the faculty teaching award! Recognition, a small bonus, and slightly less teaching next semester.",
    hours: 25, money: 1000, trl: 0,
  },
  {
    id: '55', name: 'Grant Leftover',
    description: "An old project has unspent budget that needs to be used before year-end. Your lab could use it...",
    hours: 0, money: 2000, trl: 0,
  },
];

// Group labels for optgroups in the dropdown
export const INTERRUPT_CARD_GROUPS = [
  { label: 'Lose 25 hrs (#01–10)',        ids: ['01','02','03','04','05','06','07','08','09','10'] },
  { label: 'Lose 50 hrs (#11–25)',        ids: ['11','12','13','14','15','16','17','18','19','20','21','22','23','24','25'] },
  { label: 'Lose 75 hrs (#26–35)',        ids: ['26','27','28','29','30','31','32','33','34','35'] },
  { label: 'Lose 100 hrs (#36–40)',       ids: ['36','37','38','39','40'] },
  { label: 'Time + Money Loss (#41–45)', ids: ['41','42','43','44','45'] },
  { label: 'Money Loss (#46–50)',         ids: ['46','47','48','49','50'] },
  { label: 'Lucky Cards (#51–55)',        ids: ['51','52','53','54','55'] },
];
