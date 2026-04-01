# Launch Game – Change Log

All notable changes to the startup student app are documented here.
Each entry includes a date, description of what changed, and why.

---

## 2026-04-01 – Expert Restructure, Cumulative Hours & Phase System Rework

### Expert categories restructured (App.js)
- **Customer category removed** — `customerInterviews` and `customerValidation` moved under **Business Developer** (they are coached by the BD, not standalone)
- **Senior Technical Partner moved** from the Team category to **Technical Coach** — reflects the relationship: STP is an evolution of the TC role
- **Senior Technical Partner hidden before Round 3** — completely invisible until round 3 starts; replaced by a cryptic in-game popup ("A familiar voice...") at the start of Round 3
- **Launching Customer** added as a new activity under Business Developer — only visible and selectable in Phase 2

### New Bank activities (startup-config.js + App.js)
- **Loan Application** — unlocked after Bank Meeting
- **Rabo Innovatie Lening (RIL)** — Rabobank innovation loan; requires Bank Meeting and BV legal form

### Phase system reworked
- **Development hours are now cumulative** across rounds — each round's remaining hours are added to a running `totalDevelopmentHours` total in teamData; phase gate checks this cumulative figure
- **Phase 1 gate raised to 5,000h** (was 4,000h) — still reachable in ~2.5 rounds if the team plays efficiently
- **Phase 2 gate set to 10,000h** (was 12,000h)
- Phase promotion happens automatically when "Continue to Round N" is clicked if the Phase 1 gate criteria are met

### Employment status — university removed from startup mode
- Added `startup` as a proper employment type in `BASE_HOURS` (800h/round, no salary, +1 investor modifier)
- All startup-mode defaults now use `'startup'` instead of `'university'` — university status no longer applies to startup teams
- Employment Status selector UI remains research-mode only

### Game events added to startup-config.js
- **`seniorHint`** — fires at start of Round 3: cryptic message from the Technical Coach hinting they could contribute more
- **`phase2Reached`** — fires at start of the first round after Phase 2 is unlocked: Business Developer announces a Launching Customer opportunity

---

## 2026-03-25 – Startup Edition Complete UI Redesign

### Light theme overhaul (index.css)
- **Scoped all dark `!important` overrides to `.research-mode` only** — these were forcing dark colors on the startup edition
- **Warm neutral palette**: background `#f5f5f0`, borders `#e8e5de`, cards `#ffffff` — a warm, modern dashboard feel distinct from the dark research mode
- **All card types styled**: `.stat-card`, `.section-card`, `.activity-card`, `.office-card` get clean white backgrounds with subtle shadows
- **Stat card status**: left-border color accents (green/red/yellow) instead of full-border glow
- **Section headers**: clean white with subtle bottom border, no gradient backgrounds
- **Section titles**: solid `#111827` text instead of gradient-clip accent text
- **Form inputs**: white background, warm borders, orange focus ring
- **Buttons**: orange gradient with white text, soft shadow
- **Activity/office selected states**: orange-tinted backgrounds with no glow animation
- **Scrollbar**: light track and warm thumb colors
- **Header**: clean white with subtle shadow, no thick orange border bar

### Inline style mode-awareness (App.js)
- All ~20 hardcoded dark inline styles (`#0a0a0a`, `#0f0f0f`, `#020617`, etc.) now branch on `isResearchMode`
- Startup mode gets `#ffffff` card backgrounds, `#e8e5de` borders, `#111827` text
- Activity labels, dropdown categories, hiring section, locked legal form — all mode-aware
- Accent colors: `#c1fe00` (lime) for research, `#f97316` (orange) for startup throughout
- Phase gate progress text uses orange accents for startup mode

### Readiness Sheet → Startup Snapshot overlay
- **Removed** the inline readiness sheet section with red/yellow/green dot indicators
- **Added floating button** "📋 Startup Snapshot" (bottom-right corner) — always visible during gameplay
- **Overlay modal** opens on click: clean card with neutral fact rows (Cash, Team, Interviews, Validations, Legal form, IP, Office, Revenue, Equity)
- **No judgement colors** — just facts. Students show the card to experts; experts respond based on what they see
- Click backdrop or × to close
- CSS animations for smooth open/close

---

## 2026-03-25 – Expert Rework & Startup Edition Visual Identity

### Expert roster overhaul (startup-config.js)
- **Added Technical Coach** — introduces the technology the startup is built around; can later become Senior Technical Partner (Round 3+)
- **Added Business Developer** (replaces Networking Event) — teaches Customer Discovery (Steve Blank), customer conversation skills (Mom Test framework), and market adoption thinking; unlocks senior technical partner
- **Renamed KVK Consult → Legal Advisor** — clearer, less Dutch-specific
- **Renamed Hire Senior Advisor → Senior Technical Partner** — now requires Technical Coach meeting + Round 3
- Added `roundThemes` to map rounds to Steve Blank's Customer Discovery (rounds 1–2) and Customer Validation (rounds 3–4) phases
- Updated all activity descriptions to reflect Steve Blank / startup framework language
- IP/Patent activities now reflect that IP protects the technology brought by the Technical Coach

### App.js updates
- **Interrupt cards gated to research mode only** — startup edition no longer shows interrupt card UI
- Updated `EXPERT_CATEGORIES` to include all startup-specific experts (Technical Coach, Business Developer, Legal Advisor, IP/Patent Expert, Subsidy & Grant Advisor, Incubator/Accelerator) and their activities
- `businessDeveloper` activity now correctly unlocks `seniorTechnicalPartner` (alongside legacy `networking` → `hireSenior` for research mode)
- `legalAdvisor` activity now correctly unlocks legal form selection (alongside legacy `kvkConsult` and `ttoDiscussion`)
- Updated legal form lock hint text: "Visit the Legal Advisor to unlock legal form options."
- Shell component now receives `gameMode` prop and applies `startup-mode` / `research-mode` CSS class to root container

### CSS — Startup Edition visual identity (index.css)
- Added `.startup-mode` CSS class overrides: light background (#f8fafc), dark text (#111827), orange accent (#f97316)
- Research edition keeps existing dark theme unchanged
- Startup edition header: white background with orange bottom border (3px)
- `body:has(.startup-mode)` background overrides to light cream

### Readiness Sheet (App.js)
- Added **Readiness Sheet** section visible in startup mode only
- Shows investor readiness (interviews, validations, legal form, IP, cash) and bank readiness (legal form, cash, interviews, revenue) with green/yellow/red indicators
- Educational note: "you can still meet these experts at any time" — no hard gates
- Only visible during active round gameplay, not in research mode

## 2026-03-25 – Initial Documentation

- Created `STUDENT_APP_OVERVIEW.md` documenting the full current state of the startup mode student app (mechanics, activities, scoring, components, file references)
