# Launch Game – Student App Overview (Startup Mode)

> **Scope**: This document covers the startup mode student experience only. Research mode is a separate configuration and is not documented here.

---

## 1. What the App Is

**Launch Game** is a web-based startup simulation game built with React and Firebase. Students play in teams of 1–6 founders, making strategic decisions across **4 rounds** (each representing 6 months). The goal is to grow a startup from idea to launch, managing limited time, money, and resources.

The startup mode is selected via the URL parameter `?mode=startup` (this is also the default when no mode is specified).

---

## 2. Student Flow

### Pre-Game Setup
Students fill in a registration form before the game begins:
- **Team name**
- **Number of founders** (1–6, default: 4)
- **Startup idea fields**: Technology, Product Idea, Problem, Market Segment

### Each Round (1–4)
1. **Select activities** — choose what the team works on this round
2. **Choose office** — affects round cost and context
3. **Choose legal structure** — once unlocked, affects salary costs and investor appeal
4. **Enter funding & revenue** — record income, loans, equity given up
5. **Review round summary** — see hours used, money spent, remaining cash
6. **Submit the round** — data saved to Firebase, awaiting facilitator approval

### Report Screen (after facilitator approves)
- Phase progress bar (Phase 1: cumulative hours toward 5,000h gate)
- Phase 2 readiness gate (all 3 criteria shown)
- Customer validation count
- Cash position
- Investor appeal score (0–5)

### End Game (after Round 4)
- Facilitator releases final scores
- **EndGameScoreBreakdown** modal shows:
  - Total score (0–100)
  - Ranking tier
  - Category breakdowns with progress bars
  - Achievement bonuses (positive and negative)

---

## 3. Game Mechanics

### Hours System
Each founder contributes hours per round, with **diminishing returns** for larger teams.

**Employment status** in startup mode is fixed at `startup` (no university affiliation):
| Status | Base hours/round | Salary |
|--------|-----------------|--------|
| Startup | 800 | €0 |

**Founder multipliers** (applied cumulatively):
| Founder # | Multiplier |
|-----------|-----------|
| 1st | 1.0 |
| 2nd | 0.9 |
| 3rd | 0.7 |
| 4th | 0.5 |
| 5th | 0.3 |

Example: 4 founders = 800 × (1.0 + 0.9 + 0.7 + 0.5) = **2,480 hours/round**

Additional hours can be gained by hiring junior employees (+40 hours per junior hired).

**Development hours accumulate across rounds.** Each round's remaining hours (available − spent) are added to a cumulative `totalDevelopmentHours` counter. Phase gates check this total — not a single round's output.

### Phase Gates
The game has two progression phases based on **cumulative** development hours and customer traction:

**Phase 1: Idea & Validation**
- Requires: **5,000 cumulative development hours**
- Requires: 1+ customer validation
- Requires: 4+ customer interviews

**Phase 2: Growth & Scale**
- Requires: 10,000 cumulative development hours
- Unlocks: Launching Customer activity
- Phase promotion happens automatically when clicking "Continue to Round N"

> With efficient play (high activity mix, 4 founders), Phase 1 can be reached in ~2.5 rounds.

### Cash Tracking
- **Starting capital**: €10,000
- Cash is reduced each round by:
  - Activity costs (varies by activity)
  - Office rent (€300–€2,500/round)
  - Legal form salary costs (if BV chosen: €12,000/founder/round)
  - Loan interest (loan amount × interest % / 2 for half-year)
- Cash is increased by:
  - Revenue (entered manually)
  - Subsidies (entered manually)
  - Investment (entered manually)
  - Bank loans (entered manually)

Warning is shown if cash goes negative.

### Investor Appeal (0–5 scale)
Affected by:
- **Legal form**: BV +2, EZ 0, VOF –1
- **Negative cash position**: penalty applied
- **Investment/equity decisions**

Displayed in the report screen each round.

### Pivot Mechanic
Available after completing a pivot activity. Cost **escalates each round**:
- Round 1: 32 hours + €0
- Round 2: 64 hours + €0
- Round 3: 96 hours + €0
- Round 4: 128 hours + €0

Students select a reason from 7 options via the **PivotReasonSelector** modal.

---

## 4. Activities by Expert Category

### Team (no expert needed)
| Activity | Hours | Cost | Prerequisites | Effect |
|----------|-------|------|--------------|--------|
| Product Development | 80h | €0 | — | +1 development bonus |
| Pivot | 32h (+32/round) | €0 | 2+ interviews, Round 2+ | Resets product direction |
| Marketing & Awareness | 48h | €2,000 | — | +1 marketing bonus |
| Market Analysis (DIY) | 160h | €0 | — | Market research insight |
| Market Analysis (Outsourced) | 8h | €10,000 | — | Market research insight |

### Technical Coach
| Activity | Hours | Cost | Prerequisites | Effect |
|----------|-------|------|--------------|--------|
| Technical Coach | 32h | €0 | — | Introduces the technology; unlocks IP and Senior Technical Partner |
| Senior Technical Partner | 32h | €0 | Technical Coach done + **Round 3+** | TC steps up as deeper partner; **hidden before Round 3** |

### Business Developer
| Activity | Hours | Cost | Prerequisites | Effect |
|----------|-------|------|--------------|--------|
| Business Developer | 48h | €0 | — | Customer Discovery training; +1 network bonus |
| Customer Interviews | 32h | €0 | — | +1 interview count |
| Customer Validation | 48h | €0 | 3+ interviews done | +1 validation |
| Launching Customer Deal | 48h | €0 | **Phase 2 only** | First real paying customer; **hidden in Phase 1** |

### Legal Advisor
| Activity | Hours | Cost | Prerequisites | Effect |
|----------|-------|------|--------------|--------|
| Legal Advisor | 48h | €0 | — | Unlocks legal form selection |

### IP / Patent Expert
| Activity | Hours | Cost | Prerequisites | Effect |
|----------|-------|------|--------------|--------|
| Patent Expert Consultation | 32h | €0 | — | Unlocks IP activities |
| Know-How Protection | 32h | €2,500 | Patent Expert Consultation | +1 sales grade bonus |
| Patent Filing (Professional) | 8h | €10,000 | Patent Expert Consultation | +2 sales grade bonus |

### Investor / VC
| Activity | Hours | Cost | Prerequisites | Effect |
|----------|-------|------|--------------|--------|
| Investor Meeting | 32h | €0 | — | Unlocks investor funding |

### Bank
| Activity | Hours | Cost | Prerequisites | Effect |
|----------|-------|------|--------------|--------|
| Bank Meeting | 32h | €0 | — | Unlocks Loan Application and Rabo Innovatie Lening |
| Loan Application | 16h | €0 | Bank Meeting | Apply for a standard business loan |
| Rabo Innovatie Lening | 24h | €0 | Bank Meeting + BV legal form | Rabobank innovation loan for innovative startups |

### Subsidy & Grant Advisor
| Activity | Hours | Cost | Prerequisites | Effect |
|----------|-------|------|--------------|--------|
| Subsidy Advisor | 32h | €0 | — | Unlocks subsidy application |

### Incubator / Accelerator
| Activity | Hours | Cost | Prerequisites | Effect |
|----------|-------|------|--------------|--------|
| Incubator Meeting | 32h | €0 | — | Unlocks incubator office option |

---

## 5. Legal Forms

Unlocked after completing the **Legal Advisor** meeting.

| Legal Form | Salary/Founder/Round | Bank Trust | Investor Appeal | Notes |
|-----------|---------------------|------------|----------------|-------|
| **BV** | €12,000 | +2 | +2 | Separate legal entity; most attractive to larger investors |
| **VOF** | €0 | 0 | –1 | Shared responsibility; less attractive to investors |
| **EZ** | €0 | +1 | 0 | Single-founder structure; flexible |

---

## 6. Office Types

| Office | Cost/Round | Productivity | Notes |
|--------|-----------|-------------|-------|
| **Attic / Home** | €300 | 0.9× | Cheap but limited; default option |
| **Business Center** | €2,500 | 1.0× | Professional space, flexible |
| **Incubator** | €1,800 | 1.1× | Requires Incubator Meeting activity first |

> Productivity multiplier affects context/narrative but does not directly adjust hour calculations in the current implementation.

---

## 7. Scoring (End Game)

The final score is out of **100 points**, calculated across 4 categories plus bonuses.

### Score Categories
| Category | Max Points | Key Metrics |
|----------|-----------|-------------|
| Financial Health | 25 | Cash position (target €50K), revenue (target €20K) |
| Technology Progress | 25 | IP protection filed (binary) |
| Market Validation | 25 | Validations (target 2+), interviews (target 6+) |
| Team & Structure | 15 | Equity retained (target 60%+), legal structure established |
| Achievement Bonuses | 10 | Conditions-based (see below) |

### Ranking Tiers
| Score | Tier |
|-------|------|
| < 30 | Struggling |
| 30–50 | Developing |
| 50–70 | Good |
| 70–85 | Strong |
| 85–100 | Excellent |

### Example Positive Achievements
- Grant winner, Incubator acceptance, Smart negotiator, Financially prudent, Customer champion, IP fortress, Speed runner

### Example Negative Achievements
- Bankrupt, No customers, Equity giveaway, No IP, Bad negotiator, Speed burn

---

## 8. Components Used in Startup Mode

### Active in Startup Mode
| Component | File | Purpose |
|-----------|------|---------|
| App.js (main) | [src/App.js](src/App.js) | Game controller, state, round logic |
| ExpertActivitySelector | embedded in App.js | Activity tile selection UI |
| Office selection cards | embedded in App.js | Office type picker |
| Legal structure cards | embedded in App.js | Legal form picker (post-KVK) |
| Funding & Revenue section | embedded in App.js | Revenue/loan/investment inputs |
| PivotReasonSelector | [src/Components/PivotReasonSelector.js](src/Components/PivotReasonSelector.js) | Pivot reason modal |
| EndGameScoreBreakdown | [src/Components/EndGameScoreBreakdown.js](src/Components/EndGameScoreBreakdown.js) | Final score display |
| GameEventPopup | [src/Components/Gameeventpopup.js](src/Components/Gameeventpopup.js) | In-game event notifications |
| Toast | [src/Components/Toast.js](src/Components/Toast.js) | Short status notifications |
| ErrorBoundary | [src/Components/ErrorBoundary.js](src/Components/ErrorBoundary.js) | Crash recovery UI |

### Research-Only (NOT used in startup mode)
- HourTracker, StickerAllowance, InterruptCardRow, ResourceTracker
- TRL progress display, EmploymentStatus selector
- ProfileSelection, TeamDiversityEvent, LicenceSelection

---

## 9. Key File References

| File | Purpose |
|------|---------|
| [src/Configs/startup-config.js](src/Configs/startup-config.js) | All startup game mechanics, activities, scoring rules |
| [src/App.js](src/App.js) | Main game engine — state, round logic, UI rendering |
| [src/firebase.js](src/firebase.js) | Firebase initialization |
| [src/index.js](src/index.js) | React routing (/, /live, /dashboard) |
| [src/Components/EndGameScoreBreakdown.js](src/Components/EndGameScoreBreakdown.js) | Final score modal |
| [src/Components/PivotReasonSelector.js](src/Components/PivotReasonSelector.js) | Pivot decision modal |
| [src/Components/Gameeventpopup.js](src/Components/Gameeventpopup.js) | Event popup system |
| [src/utils/errorHandling.js](src/utils/errorHandling.js) | Error utilities, Firebase error messages, retry logic |
