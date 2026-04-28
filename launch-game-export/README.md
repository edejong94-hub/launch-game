Launch Game
A hybrid serious game simulating the entrepreneurship journey — from university research to funded startup.
Built for the Faculty of Science & Engineering at the University of Groningen, the Launch Game combines a real-time digital platform with face-to-face expert role-player interactions. Teams of students make strategic decisions across four rounds, managing time, money, legal structures, IP, and investor relations — all under realistic pressure.
The game has been played live with over 100 students and runs as two distinct editions on the same platform.

Two Editions
Research Edition
Simulates the journey from university researcher to spin-off founder. Teams navigate TTO negotiations, IP licensing, employment decisions, and the transition from academic to entrepreneur. Uses TRL (Technology Readiness Level) as the primary progress metric.
Startup Edition
Simulates two years of early-stage startup development using Steve Blank's Customer Development methodology. Teams move through customer discovery, validation, funding, legal structuring, and hiring — with investor appeal and equity retention as key outcomes.
Both editions run on the same platform with configuration-driven rules, making them independently playable or runnable in parallel.

How It Works
The game is a physical-digital hybrid:

Digital platform — Teams log activities, track resources (time, money, equity), and unlock progress milestones in real time via a React/Firebase web app
Physical expert sessions — Each round, teams visit expert role-players (investor, patent attorney, grant advisor, bank officer, etc.) who issue physical contracts that unlock digital progress
Facilitator dashboard — A separate facilitator app provides live team overview, round control, scoring, and analytics

This coupling between physical interactions and digital outcomes is central to the game's learning design. Expert sessions cannot be bypassed digitally.

Architecture
The platform is designed to be config-driven and edition-agnostic, making it well-suited for adaptation to different educational contexts, countries, and institutional settings.
LayerTechnologyFrontendReact 19 (SPA)BackendFirebase Firestore (real-time sync)HostingNetlifyGame logicConfig files (research-config.js, startup-config.js)ScoringCentralised scoring engine, decoupled from UIPDF reportsClient-side generation via jsPDF (offline-first)
Game rules, activity costs, expert definitions, legal structures, scoring weights, and phase gates are all defined as data in configuration files — not hardcoded in components. Adapting the game to a new country or institutional context is primarily a configuration task, not a rebuild.

Expert Roles
Each edition features a set of expert role-players who interact with student teams during physical sessions. Experts are supported by structured briefing sheets covering their role, available contracts, connections to other experts, and role-playing guidelines.
Research Edition experts: TTO Officer, Patent Attorney, VC Investor, Grant Advisor, Industry Partner, Customer Expert, Incubator Manager, Bank/Loan Officer
Startup Edition experts: Business Developer, Technical Coach, IP Expert, Investor, Grant Advisor, Rabo Bank, Legal Advisor, Launching Customer, Incubator Manager
Expert roles are designed to be playable by people without domain expertise through structured session formats and decision trees.

Internationalisation
The game currently reflects the Dutch entrepreneurship ecosystem (BV/VOF/EZ legal structures, WBSO/NWO grants, Rabobank Innovatielening). The config-driven architecture makes systematic adaptation to other countries straightforward:

Legal structures → replace with local equivalents (GmbH, Ltd, LLC, etc.)
Funding instruments → replace with local grants and loan products
Expert roles → adapt briefing packs for local institutional context
UI copy → all labels defined in config, no hardcoded strings in components


Project Status

✅ Live and fully playable (both editions)
✅ Tested with 100+ students at the University of Groningen
✅ Facilitator app deployed separately with real-time dashboard
✅ PDF score reports generated client-side per team
🔄 Analytics dashboard in development (multi-game comparison, group-level analysis)
