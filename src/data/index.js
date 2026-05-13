// Sample incident portfolio — offshore oil & gas

export const INCIDENTS = [
  {
    id: "INC-2026-0417",
    title: "Hydrocarbon release — C-Deck, Separator V-3201",
    sub: "Flange weep during startup; gas detectors triggered tier-1 alarm",
    platform: "Northgate Alpha",
    severity: "critical",
    status: "progress",
    lead: { initials: "MR", name: "Maya Ruiz" },
    team: ["MR", "JT", "DC"],
    progress: 0.62,
    phase: "ICAM analysis",
    opened: "Apr 14",
    due: "Apr 28",
  },
  {
    id: "INC-2026-0412",
    title: "Crane load drop — Port pedestal",
    sub: "Container slung load fell 1.4m during backload ops",
    platform: "Northgate Alpha",
    severity: "high",
    status: "progress",
    lead: { initials: "DC", name: "David Cho" },
    team: ["DC", "ES"],
    progress: 0.44,
    phase: "5 Whys",
    opened: "Apr 09",
    due: "Apr 23",
  },
  {
    id: "INC-2026-0408",
    title: "Slip injury — Galley passageway",
    sub: "Catering crew slipped on unmarked wet floor, LTI",
    platform: "Westbrook Bravo",
    severity: "medium",
    status: "review",
    lead: { initials: "JT", name: "Juno Tan" },
    team: ["JT", "KA"],
    progress: 0.88,
    phase: "Sign-off",
    opened: "Apr 04",
    due: "Apr 18",
  },
  {
    id: "INC-2026-0401",
    title: "Near-miss — Unauthorized hot-work in P-67",
    sub: "Grinding observed in area without active PTW; no ignition",
    platform: "Southstar Charlie",
    severity: "high",
    status: "open",
    lead: { initials: "ES", name: "Elena Sato" },
    team: ["ES", "MR", "PN"],
    progress: 0.18,
    phase: "Evidence",
    opened: "Mar 30",
    due: "Apr 20",
  },
  {
    id: "INC-2026-0393",
    title: "H2S detector drift — Well bay 4",
    sub: "Two fixed detectors reading 8% off calibration baseline",
    platform: "Northgate Alpha",
    severity: "medium",
    status: "progress",
    lead: { initials: "PN", name: "Priya Nair" },
    team: ["PN", "DC"],
    progress: 0.31,
    phase: "Timeline",
    opened: "Mar 26",
    due: "Apr 16",
  },
  {
    id: "INC-2026-0387",
    title: "Permit-to-work non-conformance",
    sub: "Isolation certificate expired before work completion",
    platform: "Westbrook Bravo",
    severity: "low",
    status: "closed",
    lead: { initials: "KA", name: "Kian Adebayo" },
    team: ["KA", "JT"],
    progress: 1.0,
    phase: "Closed",
    opened: "Mar 18",
    due: "Apr 01",
  },
  {
    id: "INC-2026-0375",
    title: "Dropped object — Derrick monkeyboard",
    sub: "2.1kg hand tool fell 38m to drill floor; no injury",
    platform: "Southstar Charlie",
    severity: "high",
    status: "review",
    lead: { initials: "MR", name: "Maya Ruiz" },
    team: ["MR", "ES"],
    progress: 0.91,
    phase: "Sign-off",
    opened: "Mar 12",
    due: "Mar 30",
  },
];

export const ACTIVITY = [
  { who: "Maya Ruiz", init: "MR", action: "added a contributing factor", target: "ORG-03 · PM program gaps", when: "12m", inc: "INC-2026-0417" },
  { who: "David Cho", init: "DC", action: "attached witness statement", target: "WIT-04 · Roustabout A", when: "1h", inc: "INC-2026-0412" },
  { who: "Juno Tan", init: "JT", action: "closed corrective action", target: "CA-08 · Signage protocol", when: "3h", inc: "INC-2026-0408" },
  { who: "Elena Sato", init: "ES", action: "requested sign-off", target: "from HSE Manager", when: "5h", inc: "INC-2026-0401" },
  { who: "Priya Nair", init: "PN", action: "reconstructed timeline", target: "13 events, 4 evidentiary", when: "Yesterday", inc: "INC-2026-0393" },
];

export const FACTOR_TRENDS = [
  { cat: "Absent/Failed Defences", n: 18, kind: "defence" },
  { cat: "Individual/Team Actions", n: 24, kind: "action" },
  { cat: "Task/Environment", n: 31, kind: "condition" },
  { cat: "Organisational Factors", n: 22, kind: "org" },
];

export const HEATMAP = [
  [0, 1, 2, 2, 3],
  [1, 2, 3, 3, 4],
  [0, 2, 3, 4, 4],
  [0, 1, 2, 3, 3],
  [0, 0, 1, 2, 2],
];

export const SPARK = [4, 3, 5, 2, 4, 6, 3, 5, 4, 7, 3, 4];

// ================ INVESTIGATION: INC-2026-0417 ================
export const INV = {
  id: "INC-2026-0417",
  title: "Hydrocarbon release — C-Deck, Separator V-3201",
  severity: "critical",
  status: "progress",
  phase: "ICAM analysis",
  platform: "Northgate Alpha — offshore production platform",
  location: "C-Deck / Production train B / Separator V-3201 inlet flange",
  datetime: "12 April 2026 · 03:47 local (UTC−5)",
  reported_by: "Night-shift Production Tech — R. Okafor",
  lead: "Maya Ruiz, Investigation Facilitator",
  team: "5 members · offshore + onshore",
  regulator: "BSEE notification sent · 04:21",
  summary:
    "During controlled restart of Train B following a planned maintenance outage, a 12-inch flange on the inlet of separator V-3201 began weeping gas. Fixed gas detectors CG-B-112 and CG-B-114 reached 40% LEL, triggering a Tier-1 alarm and automatic ESD-2 on Train B. No injuries. Train B remained down for 41 hours.",
};

export const FW_PROBLEM = {
  statement: "At 03:47 on 12 Apr 2026, the 12-inch inlet flange on V-3201 released hydrocarbon gas (~2.3 kg/min for 6 minutes) into the process module before ESD-2 isolated the train.",
  observed: "Loss of containment · DCS gas detection · ESD-2 activation",
  evidence: ["PH-01", "SE-01", "DC-01"],
  scope: "V-3201 separator train, Northgate platform — bolted-flange integrity",
  excluded: "Pipework upstream of V-3101 (separate work pack, no activity in window)",
};

export const FW_VERIFY_META = {
  verified:   { label: "Verified",   color: "oklch(0.55 0.12 155)", desc: "Supported by direct evidence" },
  unverified: { label: "Unverified", color: "var(--sev-medium)",    desc: "Plausible but evidence pending" },
  hypothesis: { label: "Hypothesis", color: "var(--ink-3)",         desc: "No supporting evidence yet" },
};

export const FIVE_WHYS_INIT = [
  {
    n: 1,
    q: "Why did the hydrocarbon release occur?",
    a: "The 12-inch inlet flange on V-3201 lost containment because the bolted-flange joint failed to seal under operating pressure.",
    evidence: ["PH-01 · flange", "SE-01 · CG-B-112"],
    indent: 0,
    verification: "verified",
  },
  {
    n: 2,
    q: "Why did the flange joint fail to seal?",
    a: "Three of the twelve flange studs were tensioned below specification (measured 31–44% of target), producing uneven preload across the joint.",
    evidence: ["FIELD · hydraulic torque report", "PH-02 · stud marks"],
    indent: 1,
    verification: "verified",
  },
  {
    n: 3,
    q: "Why were the studs under-tensioned?",
    a: "The hydraulic torque procedure was executed in a single pass rather than the required four-pass star pattern, and final torque was not independently verified.",
    evidence: ["DC-01 · WO-84221 closeout", "WI-01 · J. Park"],
    indent: 2,
    verification: "verified",
  },
  {
    n: 4,
    q: "Why was the procedure not followed?",
    a: "The assigned mechanical technician had not completed the controlled-bolting competency refresh that lapsed in Q4 2025, and the on-shift supervisor skipped the independent torque verification to meet restart window.",
    evidence: ["DC-02 · competency matrix", "WI-02 · Supervisor T. Harlow"],
    indent: 3,
    verification: "verified",
  },
  {
    n: 5,
    q: "Why did these gaps exist?",
    a: "Competency expiries are tracked in a spreadsheet separate from the work order system, so the scheduler assigned the technician without a block; restart time pressure is not explicitly governed by the permit-to-work process.",
    evidence: ["SYSTEM · competency tracker", "DOC · PTW standard 4.2"],
    indent: 4,
    verification: "verified",
    root: true,
    category: "Organisational Factors",
  },
];

export const ICAM_FACTORS_INIT = [
  { id: "AFD-01", kind: "defence", title: "Independent torque verification not performed after bolting", rating: "major" },
  { id: "AFD-02", kind: "defence", title: "Competency-to-task control gap at work assignment", rating: "major" },
  { id: "AFD-03", kind: "defence", title: "Gas detection & ESD-2 functioned as designed", rating: "barrier held" },
  { id: "IA-01", kind: "action", title: "Single-pass torque rather than four-pass star sequence", rating: "error" },
  { id: "IA-02", kind: "action", title: "Supervisor omitted torque verification sign-off", rating: "violation" },
  { id: "IA-03", kind: "action", title: "Technician did not self-challenge assignment scope", rating: "error" },
  { id: "TC-01", kind: "condition", title: "Restart schedule pressure (41-hour production target)", rating: "contributor" },
  { id: "TC-02", kind: "condition", title: "Night-shift handover coincided with bolting task", rating: "contributor" },
  { id: "TC-03", kind: "condition", title: "Work pack referenced outdated torque sequence figure", rating: "contributor" },
  { id: "OF-01", kind: "org", title: "Competency data not integrated with work order scheduling", rating: "root", root: true },
  { id: "OF-02", kind: "org", title: "No explicit schedule-pressure control in PTW standard", rating: "root", root: true },
  { id: "OF-03", kind: "org", title: "Controlled-bolting refresh cadence last reviewed 2022", rating: "underlying" },
];

export const TIMELINE_INIT = [
  { day: "11 April 2026", events: [
    { id: "e1", t: "14:00", kind: "action", title: "Train B scheduled maintenance outage begins", sub: "Planned 12-hour window" },
    { id: "e2", t: "21:30", kind: "action", title: "V-3201 inlet flange broken & gasket replaced", sub: "Work pack WO-84221 · Mech tech J. Park" },
    { id: "e3", t: "23:12", kind: "evidence", title: "Hydraulic torque report logged", sub: "Single-pass sequence recorded · no verifier signature" },
  ]},
  { day: "12 April 2026", events: [
    { id: "e4", t: "02:15", kind: "action", title: "Restart sequence initiated for Train B", sub: "Supervisor T. Harlow · inlet valve cracked open" },
    { id: "e5", t: "03:41", kind: "warning", title: "CG-B-114 reads 12% LEL, trends upward", sub: "DCS trend; no alarm threshold reached yet" },
    { id: "e6", t: "03:46", kind: "warning", title: "CG-B-112 reads 28% LEL", sub: "Operator notices trend, calls CCR" },
    { id: "e7", t: "03:47", kind: "trigger", title: "Hydrocarbon release · Tier-1 gas alarm", sub: "40% LEL · ESD-2 auto-initiates", root: true },
    { id: "e8", t: "03:50", kind: "action", title: "Muster called, POB accounted in 9 min", sub: "All 74 personnel mustered" },
    { id: "e9", t: "03:53", kind: "action", title: "Release stops as train depressures", sub: "Duration: 6 min · est. 13.8 kg release" },
    { id: "e10", t: "04:21", kind: "action", title: "BSEE initial notification submitted", sub: "Regulator acknowledgement received 04:38" },
    { id: "e11", t: "07:10", kind: "evidence", title: "Field photos & witness statements collected", sub: "3 witnesses on deck at time of event" },
  ]},
];

export const EVIDENCE_INIT = [
  { id: "PH-01", title: "Flange assembly — wide", type: "Photo", by: "R. Okafor", when: "04:14", tag: "flange" },
  { id: "PH-02", title: "Stud tensioning marks", type: "Photo", by: "Field", when: "07:30", tag: "flange" },
  { id: "SE-01", title: "CG-B-112 LEL trend", type: "Sensor", by: "DCS export", when: "04:02", tag: "gas-detection" },
  { id: "DC-01", title: "Work pack WO-84221", type: "Document", by: "Maintenance", when: "Apr 11", tag: "procedure" },
  { id: "WI-01", title: "Statement — J. Park (Mech tech)", type: "Witness", by: "Interviewed MR", when: "Apr 13", tag: "witness" },
  { id: "WI-02", title: "Statement — T. Harlow (Supervisor)", type: "Witness", by: "Interviewed MR", when: "Apr 13", tag: "witness" },
  { id: "SE-02", title: "ESD-2 logic trace", type: "Sensor", by: "Safety sys", when: "Apr 12", tag: "barriers" },
  { id: "DC-02", title: "Competency matrix export", type: "Document", by: "L&D", when: "Apr 14", tag: "competency" },
];

export const ACTIONS_INIT = [
  { id: "CA-01", title: "Integrate competency register with SAP work-order scheduler", owner: "HW", ownerName: "H. Wren · Maintenance Systems", due: "May 30", priority: "high", col: "progress" },
  { id: "CA-02", title: "Add explicit schedule-pressure clause to PTW Standard 4.2", owner: "ES", ownerName: "E. Sato · HSE", due: "May 12", priority: "high", col: "review" },
  { id: "CA-03", title: "Controlled-bolting competency refresher — all mech techs", owner: "LD", ownerName: "L. Díaz · L&D", due: "Jun 15", priority: "medium", col: "progress" },
  { id: "CA-04", title: "Revise work pack WO-84221 torque sequence figure", owner: "JP", ownerName: "J. Park · Maintenance", due: "Apr 30", priority: "medium", col: "open" },
  { id: "CA-05", title: "Independent-verification gate for all tensioning >50% spec", owner: "MR", ownerName: "M. Ruiz · HSE", due: "May 20", priority: "high", col: "open" },
  { id: "CA-06", title: "Fleet-wide review of restart-window KPIs vs. safety controls", owner: "DC", ownerName: "D. Cho · Ops", due: "Jul 01", priority: "medium", col: "open" },
  { id: "CA-07", title: "Quarterly integrity of gas-detection calibration — verified", owner: "PN", ownerName: "P. Nair · Instr.", due: "Apr 18", priority: "low", col: "done" },
];

export const SIGNOFF = [
  { init: "MR", name: "Maya Ruiz", role: "Investigation Lead", status: "signed", when: "Apr 19" },
  { init: "ES", name: "Elena Sato", role: "HSE Manager", status: "signed", when: "Apr 19" },
  { init: "DC", name: "David Cho", role: "Operations Manager — Northgate", status: "review", when: "pending" },
  { init: "KA", name: "Kian Adebayo", role: "Asset GM", status: "pending", when: "" },
  { init: "RG", name: "Rhea Gomes", role: "VP HSE (Regional)", status: "pending", when: "" },
];

export const INTERVIEWS_INIT = [
  { id: "INT-01", status: "complete", interviewee: "J. Park", role: "Mechanical Technician", when: "13 Apr · 10:00", duration: "45 min", interviewer: "Maya Ruiz", method: "In-person", location: "Onshore office A", linkedStatement: "WI-01", topics: ["torque procedure", "work pack", "competency"], notes: "Cooperative; confirmed single-pass error unintentional. Work pack torque diagram described as confusing." },
  { id: "INT-02", status: "complete", interviewee: "T. Harlow", role: "Shift Supervisor", when: "13 Apr · 14:00", duration: "60 min", interviewer: "Maya Ruiz", method: "In-person", location: "Onshore office A", linkedStatement: "WI-02", topics: ["restart window", "PTW", "verification sign-off"], notes: "Acknowledged retrospective sign-off. Cited schedule pressure from operations." },
  { id: "INT-03", status: "progress", interviewee: "R. Okafor", role: "Production Technician", when: "15 Apr · 09:30", duration: "30 min", interviewer: "David Cho", method: "Video call", location: "Remote", linkedStatement: "", topics: ["initial detection", "CCR communication", "ESD trigger"], notes: "" },
  { id: "INT-04", status: "scheduled", interviewee: "P. Whelan", role: "Operations Lead", when: "18 Apr · 11:00", duration: "45 min", interviewer: "Elena Sato", method: "Video call", location: "Remote", linkedStatement: "", topics: ["restart KPIs", "production targets", "PTW policy"], notes: "" },
];

export const PEEPO_QUESTIONS_INIT = {
  People: [
    { id: "P1", q: "Did the technician have current controlled-bolting competency?", a: "Competency lapsed Q4 2025; refresher not completed before job assignment.", evidence: ["DC-02"], answered: true },
    { id: "P2", q: "Was the supervisor qualified to perform the independent torque verification?", a: "Supervisor held supervisory-level competency; verification was procedurally required but omitted.", evidence: ["WI-02"], answered: true },
    { id: "P3", q: "What was the crew's shift length and fatigue state at the time of the task?", a: "", evidence: [], answered: false },
    { id: "P4", q: "Were there any communications breakdowns between day and night crews at handover?", a: "", evidence: [], answered: false },
  ],
  Environment: [
    { id: "E1", q: "What were the lighting and environmental conditions during flange make-up?", a: "Night shift, artificial lighting. No adverse weather reported.", evidence: ["WI-01"], answered: true },
    { id: "E2", q: "Was there sufficient physical space to perform the four-pass torque sequence?", a: "", evidence: [], answered: false },
  ],
  Equipment: [
    { id: "Eq1", q: "Was the hydraulic torque tool calibrated and in date?", a: "Tool calibration was current per maintenance records.", evidence: ["DC-01"], answered: true },
    { id: "Eq2", q: "Were the flange studs and gasket to specification?", a: "Material certs confirmed. Gasket replaced with correct spec part.", evidence: ["DC-01", "PH-01"], answered: true },
    { id: "Eq3", q: "Did gas detection equipment (CG-B-112, CG-B-114) perform as intended?", a: "Both detectors alarmed at 40% LEL and triggered ESD-2 as designed.", evidence: ["SE-01", "SE-02"], answered: true },
  ],
  Procedures: [
    { id: "Pr1", q: "Was the work pack WO-84221 torque sequence diagram clear and accurate?", a: "Diagram showed 10-stud pattern on a 12-stud flange. Diagram was small and low contrast.", evidence: ["DC-01", "PH-02"], answered: true },
    { id: "Pr2", q: "Does the PTW standard address restart schedule pressure explicitly?", a: "PTW Standard 4.2 reviewed — no explicit schedule-pressure clause found.", evidence: ["DC-01"], answered: true },
    { id: "Pr3", q: "Was the independent torque verification step mandatory in the work pack?", a: "", evidence: [], answered: false },
  ],
  Organisation: [
    { id: "O1", q: "Is the competency tracking system integrated with the work-order scheduler?", a: "Competency data lives in a separate spreadsheet with no integration into SAP.", evidence: ["DC-02"], answered: true },
    { id: "O2", q: "What are the production KPIs governing restart windows?", a: "", evidence: [], answered: false },
    { id: "O3", q: "When was the controlled-bolting competency standard last reviewed?", a: "Competency standard last reviewed 2022.", evidence: ["DC-02"], answered: true },
  ],
};

export const HFAT_DATA = {
  actionError: {
    type: "Slip / lapse — single-pass torque",
    desc: "Stud tensioning on V-3201 inlet flange completed in a single pass rather than the procedure-required three-pass cross pattern. The error was unintentional but produced uneven preload across the joint.",
    actor: "Technician — maintenance crew B",
    classification: "Skill-based · execution",
  },
  recovery: {
    opportunity: "Pre-startup leak test on V-3201 was logged as completed but used a 5-minute static hold rather than the procedure-specified 30-minute hold at operating pressure.",
    barrier: "Time pressure to return separator to service before shift handover",
    outcome: "Recovery opportunity missed — release detected 6 hours later in production",
  },
  cognition: [
    { stage: "Detection", finding: "Adequate", note: "Operator detected DCS drift within 8 minutes of onset." },
    { stage: "Diagnosis", finding: "Partial", note: "Drift initially attributed to instrument fault rather than physical leak; correct diagnosis took 4 additional minutes." },
    { stage: "Decision", finding: "Adequate", note: "ESD-2 trigger was correctly initiated once diagnosis was confirmed." },
    { stage: "Action", finding: "Inadequate", note: "Original maintenance action — single-pass torque — bypassed required cognitive checkpoint at procedure step 7.4." },
  ],
  conditions: [
    { cat: "Workload & time pressure", level: "high", note: "Crew working into 14th hour of a 12-hour planned shift; handover deadline created push to close work order." },
    { cat: "Procedure usability", level: "medium", note: "Torque-pattern diagram on page 3 of the work pack is small, low-contrast, and does not match the actual flange stud count (10 vs. 12)." },
    { cat: "Communication & supervision", level: "medium", note: "No independent verification of torque pattern before sign-off — supervisor signature was retrospective." },
    { cat: "Training & competence", level: "low", note: "Technician held current competency for flange make-up; refresher 11 months prior." },
    { cat: "Equipment & tools", level: "low", note: "Calibrated torque wrench in date; readout legible." },
    { cat: "Fatigue & shift", level: "high", note: "End of 4th consecutive night shift; sleep diary indicates < 6h prior rest." },
  ],
};
