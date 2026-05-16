import React from 'react';
import { Icon, Avatar, SevTag, StatusPill } from './ui.jsx';
import { INV, FIVE_WHYS, ICAM_FACTORS, TIMELINE, EVIDENCE, ACTIONS, SIGNOFF, FW_PROBLEM, FW_VERIFY_META } from '../data/index.js';

// Investigation workspace — tabs: Overview, Timeline, 5 Whys, ICAM, Evidence, Actions, Report

export const InvHeader = ({ tab, setTab, onBack, analysis, setAnalysis }) => {
  const tabs = [
    { k: "overview", l: "Overview" },
    { k: "evidence", l: "Evidence", n: EVIDENCE.length },
    { k: "interviews", l: "Interviews", n: 3 },
    { k: "timeline", l: "Timeline", n: TIMELINE.reduce((a, d) => a + d.events.length, 0) },
    { k: "fivewhys", l: "5 Whys", n: FIVE_WHYS.length, gate: "fivewhys" },
    { k: "icam", l: "ICAM analysis", n: ICAM_FACTORS.length, gate: "icam" },
    { k: "hfat", l: "miniHFAT", n: 4, gate: "hfat" },
    { k: "actions", l: "Corrective actions", n: ACTIONS.length },
    { k: "report", l: "Report & sign-off" },
  ];
  return (
    <>
      <div className="inv-header">
        <div className="inv-header-top">
          <button className="btn ghost" onClick={onBack} style={{ padding: "5px 8px" }}>← All investigations</button>
          <SevTag level={INV.severity}/>
          <StatusPill status={INV.status}/>
          <span className="chip"><Icon name="pin" size={11}/>{INV.phase}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button className="btn ghost"><Icon name="users" size={13}/>Team</button>
            <button className="btn ghost"><Icon name="download" size={13}/>Export</button>
            <button className="btn"><Icon name="check" size={13}/>Request sign-off</button>
          </div>
        </div>
        <div>
          <div className="inv-id">{INV.id} · reported {INV.datetime}</div>
          <div className="inv-title">{INV.title}</div>
        </div>
        <div className="inv-meta">
          <div className="inv-meta-item">
            <span className="inv-meta-label">Asset</span>
            <span className="inv-meta-value">{INV.platform}</span>
          </div>
          <div className="inv-meta-item">
            <span className="inv-meta-label">Location</span>
            <span className="inv-meta-value">{INV.location}</span>
          </div>
          <div className="inv-meta-item">
            <span className="inv-meta-label">Reported by</span>
            <span className="inv-meta-value">{INV.reported_by}</span>
          </div>
          <div className="inv-meta-item">
            <span className="inv-meta-label">Facilitator</span>
            <span className="inv-meta-value">{INV.lead}</span>
          </div>
          <div className="inv-meta-item">
            <span className="inv-meta-label">Regulator</span>
            <span className="inv-meta-value">{INV.regulator}</span>
          </div>
        </div>
      </div>
      <InvestigationProgress tab={tab} setTab={setTab} analysis={analysis} setAnalysis={setAnalysis}/>
    </>
  );
};

// --- Overview stat detail
export const STAT_DETAILS = {
  "Contributing factors": {
    sub: "11 identified · grouped by ICAM category",
    accent: "var(--accent)",
    sections: [
      { head: "Organisational factors (4)", items: [
        ["Competency tracking", "Expiries managed in spreadsheet outside the work-order system; scheduler had no automated block on out-of-date qualifications.", "high"],
        ["Restart-window pressure", "Production targets for restart not explicitly bounded by safety constraints in the PTW process.", "high"],
        ["Procedure design", "Torque-pattern diagram on page 3 of work pack does not match actual flange (10 vs. 12 studs).", "medium"],
        ["Shift planning", "4th consecutive night shift permitted without fatigue-risk review.", "medium"],
      ]},
      { head: "Task / environment (3)", items: [
        ["Time on shift", "Crew was 14 hours into a 12-hour planned shift at time of execution.", "high"],
        ["Independent verification", "Torque sign-off was retrospective; no live witness check at the joint.", "high"],
        ["Lighting at flange", "Local lighting on V-3201 west bay logged as 'adequate' but below current standard.", "low"],
      ]},
      { head: "Individual / team (2)", items: [
        ["Single-pass torque", "Bolt-up performed in one pass rather than the procedure-required three-pass cross pattern.", "high"],
        ["Diagnosis lag", "Initial DCS drift attributed to instrument fault; correct diagnosis took 4 additional minutes.", "medium"],
      ]},
      { head: "Absent / failed defences (2)", items: [
        ["Competency-to-task barrier", "PTW issued without a current controlled-bolting competency on file.", "high"],
        ["Pre-startup leak test", "5-minute static hold used in place of procedure-specified 30-minute hold at operating pressure.", "high"],
      ]},
    ],
    footer: "Source: ICAM cascade · last updated by M. Ruiz · Apr 18, 14:02",
  },
  "Barriers that failed": {
    sub: "2 of 6 · bowtie analysis",
    accent: "var(--sev-high)",
    sections: [
      { head: "Failed barriers", items: [
        ["Competency-to-task verification", "Permit-to-work issued without confirming current controlled-bolting competency. Spreadsheet-based tracking allowed expired qualification (11 months since refresher) to go unflagged.", "high"],
        ["Torque verification & leak test", "Three-pass cross-pattern torque procedure replaced with single pass; pre-startup leak test shortened to 5 minutes vs. 30-minute requirement at operating pressure.", "high"],
      ]},
      { head: "Why they failed", items: [
        ["Detection gap", "No automated block in WO system to prevent assignment of expired competencies.", "medium"],
        ["Verification gap", "Procedure does not require independent witness at torque step; supervisor signature applied retrospectively.", "medium"],
        ["Time-pressure influence", "Restart-window targets created push to close work order before shift handover, compressing leak-test window.", "high"],
      ]},
    ],
    footer: "Bowtie reference: BT-V3201-2024-R3 · attached as evidence DC-04",
  },
  "Barriers that held": {
    sub: "ESD-2 + muster · 4 of 6 barriers performed",
    accent: "oklch(0.55 0.10 155)",
    sections: [
      { head: "Held as designed", items: [
        ["ESD-2 emergency shutdown", "Triggered correctly at 03:47 when gas detection threshold reached 60% LEL. Isolated separator within 4 seconds. Logic trace SE-02 attached.", "low"],
        ["Gas detection (PH-02)", "Detected hydrocarbon release within 11 seconds of onset. Voting logic 2-out-of-3 functioned as specified.", "low"],
        ["Muster & POB accountability", "Full muster achieved in 7 minutes 22 seconds (target: 8 minutes). All 47 POB accounted for at primary station.", "low"],
        ["Ignition prevention", "Hot work permits in adjacent area suspended within 90 seconds of alarm; no ignition source within hazard zone.", "low"],
      ]},
    ],
    footer: "Performance against barrier targets logged in HSE-MS · barrier health dashboard updated Apr 17",
  },
  "Corrective actions": {
    sub: "7 proposed · 2 in review · 5 awaiting prioritisation",
    accent: "var(--accent)",
    sections: [
      { head: "In review (2)", items: [
        ["CA-01 · Integrate competency tracking with WO system", "Owner: L&D + IT · Due: Q3 · Status: scoping", "medium"],
        ["CA-02 · Mandatory independent torque verification on hydrocarbon flanges", "Owner: Maintenance lead · Due: 30 days · Status: procedure draft", "high"],
      ]},
      { head: "Awaiting prioritisation (5)", items: [
        ["CA-03 · Restart-window risk-review gate in PTW", "Owner: Operations · Effort: medium", "medium"],
        ["CA-04 · Update V-3201 work pack — torque-pattern diagram", "Owner: Engineering · Effort: low", "low"],
        ["CA-05 · Fatigue-risk review for 4th consecutive night shift", "Owner: HR + Operations · Effort: medium", "medium"],
        ["CA-06 · Pre-startup leak-test hold-time auto-check (DCS)", "Owner: Controls · Effort: high", "high"],
        ["CA-07 · Local lighting upgrade · V-3201 west bay", "Owner: Facilities · Effort: low", "low"],
      ]},
    ],
    footer: "Actions register synced with corporate HSE tracker · review meeting Apr 24",
  },
};

export const StatDrawer = ({ statKey, onClose }) => {
  if (!statKey) return null;
  const d = STAT_DETAILS[statKey];
  const lvlColor = { high: "var(--sev-high)", medium: "var(--sev-medium)", low: "oklch(0.55 0.10 155)" };
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,15,0.35)", zIndex: 300,
      backdropFilter: "blur(2px)", display: "flex", justifyContent: "flex-end",
      animation: "fadeIn 0.18s ease-out",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 520, maxWidth: "92vw", height: "100%", background: "var(--bg-elev)",
        borderLeft: "1px solid var(--border)", boxShadow: "-12px 0 40px rgba(10,10,15,0.18)",
        display: "flex", flexDirection: "column", animation: "slideInRight 0.24s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ padding: "18px 22px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 4, alignSelf: "stretch", background: d.accent, borderRadius: 2 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 4 }}>Investigation overview</div>
            <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.015em" }}>{statKey}</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 3 }}>{d.sub}</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--ink-2)" }}>
            <Icon name="x" size={14}/>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px 20px" }}>
          {d.sections.map((sec, si) => (
            <div key={si} style={{ marginBottom: si === d.sections.length - 1 ? 0 : 22 }}>
              <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 10 }}>{sec.head}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sec.items.map(([title, body, lvl], i) => (
                  <div key={i} style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg)", borderLeft: `3px solid ${lvlColor[lvl]}` }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.005em", flex: 1 }}>{title}</div>
                      <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: lvlColor[lvl], padding: "2px 6px", borderRadius: 3, background: `color-mix(in oklch, ${lvlColor[lvl]} 12%, transparent)` }}>{lvl}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>{body}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 22px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--ink-3)", fontStyle: "italic" }}>
          {d.footer}
        </div>
      </div>
    </div>
  );
};

// --- Overview tab
export const OverviewTab = () => {
  const [openStat, setOpenStat] = React.useState(null);
  const [summary, setSummary] = React.useState(INV.summary);
  const [editSummary, setEditSummary] = React.useState(false);
  const [draft, setDraft] = React.useState(summary);
  const openEdit = () => { setDraft(summary); setEditSummary(true); };
  return (
  <React.Fragment>
  <StatDrawer statKey={openStat} onClose={() => setOpenStat(null)}/>
  {editSummary && (
    <div onClick={() => setEditSummary(false)} style={{ position: "fixed", inset: 0, background: "rgba(10,10,15,0.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 640, maxWidth: "100%", background: "var(--bg-elev)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, marginBottom: 4 }}>Edit event summary</div>
            <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.012em" }}>{INV.id} · {INV.title}</div>
          </div>
          <button onClick={() => setEditSummary(false)} style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "transparent", cursor: "pointer", display: "grid", placeItems: "center" }}><Icon name="close" size={14}/></button>
        </div>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500 }}>Summary</label>
          <textarea autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} rows={8} style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, fontFamily: "inherit", lineHeight: 1.55, color: "var(--ink-1)", background: "var(--bg)", resize: "vertical" }} placeholder="Briefly describe what happened, where, when, and the immediate consequence."/>
          <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Tip: keep it factual and observable — avoid causes or judgements (those belong in 5 Whys / ICAM).</div>
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn ghost" onClick={() => setEditSummary(false)}>Cancel</button>
          <button className="btn primary" onClick={() => { setSummary(draft.trim() || summary); setEditSummary(false); }}>Save summary</button>
        </div>
      </div>
    </div>
  )}
  <div className="inv-body view-enter" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <button onClick={openEdit} className="card stat-box" style={{ padding: "18px 22px", textAlign: "left", cursor: "pointer", background: "var(--bg-elev)", border: "1px solid var(--border)", width: "100%", font: "inherit", color: "inherit" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500 }}>Event summary</div>
          <span style={{ fontSize: 10.5, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4 }}><Icon name="edit" size={11}/>Click to edit</span>
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-2)", letterSpacing: "-0.005em", whiteSpace: "pre-wrap" }}>
          {summary}
        </div>
      </button>

      <div className="card">
        <div className="panel-header">
          <div className="panel-title">Preliminary root cause</div>
          <div className="panel-sub">derived from 5 Whys · reviewed by team</div>
          <div className="panel-actions"><span className="chip"><span className="dot" style={{ background: "var(--accent)" }}/>Draft · pending team review</span></div>
        </div>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ padding: "14px 16px", background: "var(--accent-soft)", border: "1px solid color-mix(in oklch, var(--accent) 25%, var(--border))", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "var(--accent-ink)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Root cause</div>
            <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.005em", lineHeight: 1.45 }}>
              Competency expiries are tracked outside the work order system, and restart-window time pressure is not explicitly governed by the PTW process — together these allowed an under-qualified technician to execute bolting without independent verification.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              ["Contributing factors", "11 identified"],
              ["Barriers that failed", "2 of 6"],
              ["Barriers that held", "ESD-2, muster"],
              ["Corrective actions", "7 proposed · 2 in review"],
            ].map(([k, v]) => (
              <button
                key={k}
                onClick={() => setOpenStat(k)}
                className="stat-box"
                style={{ padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, background: "transparent", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4, position: "relative", transition: "all 0.15s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", flex: 1 }}>{k}</div>
                  <Icon name="arrow" size={11}/>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card">
        <div className="panel-header">
          <div className="panel-title">Investigation team</div>
        </div>
        <div style={{ padding: "10px 18px 14px" }}>
          {[
            ["MR", "Maya Ruiz", "Facilitator"],
            ["ES", "Elena Sato", "HSE SME"],
            ["DC", "David Cho", "Operations SME"],
            ["JP", "J. Park", "Maintenance SME"],
            ["PN", "Priya Nair", "Process engineering"],
          ].map(([i, n, r]) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <Avatar initials={i} size={28}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{n}</div>
                <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{r}</div>
              </div>
              <Icon name="more" size={14}/>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="panel-header">
          <div className="panel-title">Key dates</div>
        </div>
        <div style={{ padding: "12px 18px 16px" }}>
          {[
            ["Incident", "Apr 12 · 03:47"],
            ["Regulator notified", "Apr 12 · 04:21"],
            ["Team convened", "Apr 13 · 09:00"],
            ["ICAM classification", "Apr 17 · complete"],
            ["Draft report", "Apr 22 · scheduled"],
            ["Final sign-off", "Apr 28 · target"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", fontSize: 12.5, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ color: "var(--ink-3)", flex: 1 }}>{k}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="panel-header">
          <div className="panel-title">Linked incidents</div>
          <div className="panel-sub">precedents</div>
        </div>
        <div style={{ padding: "12px 18px 16px" }}>
          {[
            ["INC-2024-1123", "Train A flange weep", "8 Nov 2024"],
            ["INC-2023-0487", "Bolting non-conformance", "14 May 2023"],
          ].map(([id, t, d]) => (
            <div key={id} style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{id}</div>
              <div style={{ fontSize: 12.5, fontWeight: 500, marginTop: 2 }}>{t}</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  </React.Fragment>
  );
};

export const InvestigationProgress = ({ tab, setTab, analysis, setAnalysis }) => {
  const phases = [
    { k: "overview", l: "Overview", done: true, meta: "Apr 12" },
    { k: "evidence", l: "Evidence", done: true, meta: `${EVIDENCE.length} items`, n: EVIDENCE.length },
    { k: "interviews", l: "Interviews", done: false, meta: "3 scheduled", n: 3 },
    { k: "timeline", l: "Timeline", done: true, meta: `${TIMELINE.reduce((a,d)=>a+d.events.length,0)} events`, n: TIMELINE.reduce((a,d)=>a+d.events.length,0) },
    { k: "fivewhys", l: "5 Whys", done: true, meta: "Apr 16", gate: "fivewhys", n: FIVE_WHYS.length, group: "analysis" },
    { k: "icam", l: "ICAM", done: true, meta: "Apr 17", gate: "icam", n: ICAM_FACTORS.length, group: "analysis" },
    { k: "hfat", l: "miniHFAT", done: false, meta: "draft", gate: "hfat", n: 4, group: "analysis" },
    { k: "actions", l: "Corrective actions", done: false, meta: "in progress", n: ACTIONS.length },
    { k: "report", l: "Report & sign-off", done: false, meta: "Apr 22 target" },
  ];
  const toggleGate = (e, gate) => {
    e.stopPropagation();
    setAnalysis(prev => ({ ...prev, [gate]: !prev[gate] }));
  };
  return (
    <div className="phase-nav" style={{ display: "flex", alignItems: "stretch", gap: 4, padding: "14px 28px 0" }}>
      {(() => {
        const out = [];
        let i = 0;
        while (i < phases.length) {
          const p = phases[i];
          if (p.group === "analysis") {
            const grp = [];
            while (i < phases.length && phases[i].group === "analysis") { grp.push(phases[i]); i++; }
            out.push(
              <div key="analysis-group" style={{
                display: "flex", flex: grp.length, gap: 4, padding: "6px 6px 4px",
                border: "1px dashed color-mix(in oklch, var(--accent) 45%, var(--border))",
                background: "color-mix(in oklch, var(--accent) 5%, transparent)",
                borderRadius: 10, position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: -8, left: 12, padding: "1px 8px", fontSize: 9.5, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-ink)",
                  background: "var(--bg-elev)", border: "1px solid color-mix(in oklch, var(--accent) 45%, var(--border))",
                  borderRadius: 4,
                }}>Analysis methods · toggle on/off</div>
                {grp.map(p => {
                  const inactive = analysis && !analysis[p.gate];
                  const isActive = tab === p.k;
                  return (
                    <button
                      key={p.k}
                      onClick={() => setTab(p.k)}
                      title={inactive ? `${p.l} is off — toggle the switch to activate.` : p.l}
                      style={{
                        flex: 1, textAlign: "left", background: isActive ? "var(--bg-elev)" : "transparent",
                        border: `1px solid ${isActive ? "color-mix(in oklch, var(--accent) 45%, var(--border))" : "transparent"}`,
                        borderRadius: 7, padding: "8px 10px 10px", cursor: "pointer", color: "inherit", font: "inherit",
                        transition: "all 0.15s", position: "relative",
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--bg-elev)"; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{
                        height: 4, borderRadius: 2,
                        background: isActive ? "var(--accent)" : (inactive ? "var(--bg-sunken)" : (p.done ? "var(--ink)" : "var(--bg-sunken)")),
                        marginBottom: 8, opacity: inactive ? 0.4 : 1,
                      }}/>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, letterSpacing: "-0.005em", opacity: inactive ? 0.5 : 1 }}>
                        {isActive && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}/>}
                        {!isActive && p.done && !inactive && <Icon name="check" size={12}/>}
                        <span style={{ flex: 1 }}>{p.l}</span>
                        {p.n != null && <span style={{ fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{p.n}</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 3, gap: 8 }}>
                        <div style={{ fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)", opacity: inactive ? 0.6 : 1 }}>{inactive ? "off" : p.meta}</div>
                        <span
                          role="switch"
                          aria-checked={!inactive}
                          onClick={(e) => toggleGate(e, p.gate)}
                          style={{
                            width: 26, height: 14, borderRadius: 8, padding: 1, flex: "none",
                            background: inactive ? "var(--bg-sunken)" : "var(--accent)",
                            border: "1px solid var(--border)", cursor: "pointer", display: "flex",
                            justifyContent: inactive ? "flex-start" : "flex-end", transition: "all 0.15s",
                          }}
                        >
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.25)" }}/>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          } else {
            const isActive = tab === p.k;
            out.push(
              <button
                key={p.k}
                onClick={() => setTab(p.k)}
                title={p.l}
                style={{
                  flex: 1, textAlign: "left", background: isActive ? "var(--bg-elev)" : "transparent",
                  border: `1px solid ${isActive ? "color-mix(in oklch, var(--accent) 35%, var(--border))" : "transparent"}`,
                  borderRadius: 8, padding: "8px 10px 10px", cursor: "pointer", color: "inherit", font: "inherit",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--bg-elev)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{
                  height: 4, borderRadius: 2,
                  background: isActive ? "var(--accent)" : (p.done ? "var(--ink)" : "var(--bg-sunken)"),
                  marginBottom: 8,
                }}/>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, letterSpacing: "-0.005em" }}>
                  {isActive && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}/>}
                  {!isActive && p.done && <Icon name="check" size={12}/>}
                  <span style={{ flex: 1 }}>{p.l}</span>
                  {p.n != null && <span style={{ fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{p.n}</span>}
                </div>
                <div style={{ fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)", marginTop: 3 }}>{p.meta}</div>
              </button>
            );
            i++;
          }
        }
        return out;
      })()}
    </div>
  );
};

// --- Timeline tab
export const AIProposalsModal = ({ context, evidenceItems, proposals, onApply, onClose, summary, applyLabel }) => {
  const [stage, setStage] = React.useState("review"); // review -> analyzing -> results
  const [evSel, setEvSel] = React.useState(() => new Set(evidenceItems.map(e => e.id)));
  const [propSel, setPropSel] = React.useState(new Set());
  const [results, setResults] = React.useState([]);
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const startAnalyse = () => {
    setStage("analyzing");
    setTimeout(() => {
      setResults(proposals);
      setPropSel(new Set(proposals.map((_, i) => i)));
      setStage("results");
    }, 1400);
  };
  const toggleEv = (id) => setEvSel(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleProp = (i) => setPropSel(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const apply = () => onApply(results.filter((_, i) => propSel.has(i)));
  const confColor = (c) => c >= 0.85 ? "oklch(0.55 0.12 155)" : c >= 0.70 ? "var(--sev-medium)" : "var(--sev-high)";
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,15,0.5)", zIndex: 300,
      display: "grid", placeItems: "center", backdropFilter: "blur(3px)", animation: "fadeIn 0.18s ease-out",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 760, maxWidth: "94vw", maxHeight: "92vh", background: "var(--bg-elev)",
        border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 24px 60px rgba(10,10,15,0.3)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent-ink)", display: "grid", placeItems: "center", flex: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 4 }}>AI · facilitator-verified · {context}</div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Create from evidence</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 3 }}>{summary}</div>
          </div>
          <button type="button" onClick={onClose} style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--ink-2)" }}>
            <Icon name="x" size={14}/>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
          {stage === "review" && (
            <div>
              <div style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 12, padding: "10px 12px", background: "var(--bg-sunken)", borderRadius: 8 }}>
                <strong>Select evidence</strong> to cross-reference. AI proposals are advisory — every item must be reviewed before acceptance.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {evidenceItems.map(e => (
                  <label key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 7, background: evSel.has(e.id) ? "var(--bg)" : "var(--bg-sunken)", cursor: "pointer" }}>
                    <input type="checkbox" checked={evSel.has(e.id)} onChange={() => toggleEv(e.id)} style={{ accentColor: "var(--accent)" }}/>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", minWidth: 60 }}>{e.id}</span>
                    <span style={{ fontSize: 12.5, flex: 1 }}>{e.title}</span>
                    <span className="chip" style={{ fontSize: 10 }}>{e.type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {stage === "analyzing" && (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 18px", background: "var(--bg-sunken)", borderRadius: 10 }}>
                <div style={{ width: 14, height: 14, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}/>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Cross-referencing {evSel.size} evidence items…</div>
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          {stage === "results" && (
            <div>
              <div style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 12 }}>{results.length} proposal{results.length !== 1 ? "s" : ""} · review and accept</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {results.map((r, i) => (
                  <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 8, background: propSel.has(i) ? "var(--bg)" : "var(--bg-sunken)", cursor: "pointer", borderLeft: `3px solid ${confColor(r.confidence)}` }}>
                    <input type="checkbox" checked={propSel.has(i)} onChange={() => toggleProp(i)} style={{ accentColor: "var(--accent)", marginTop: 2 }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.005em", flex: 1 }}>{r.title}</div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: confColor(r.confidence), padding: "2px 6px", borderRadius: 3, background: `color-mix(in oklch, ${confColor(r.confidence)} 12%, transparent)` }}>{Math.round(r.confidence * 100)}% conf</span>
                      </div>
                      {r.detail && <div style={{ fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.45, marginBottom: 4 }}>{r.detail}</div>}
                      <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Source: {r.source}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "12px 22px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, background: "var(--bg-sunken)" }}>
          <span style={{ fontSize: 11, color: "var(--ink-3)", fontStyle: "italic" }}>Lead investigator remains accountable for accepted items.</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose} className="btn ghost">Cancel</button>
            {stage === "review" && <button type="button" onClick={startAnalyse} className="btn primary" disabled={evSel.size === 0}>Analyse {evSel.size} item{evSel.size !== 1 ? "s" : ""}</button>}
            {stage === "results" && <button type="button" onClick={apply} className="btn primary" disabled={propSel.size === 0}>{applyLabel || `Add ${propSel.size}`}</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Evidence sufficiency check (gates AI auto-analysis per method)
const evidenceSufficiency = (method, items) => {
  const types = new Set(items.map(e => e.type));
  const has = (t) => types.has(t);
  const count = (t) => items.filter(e => e.type === t).length;
  if (method === "fivewhys") {
    // Need a starting anchor + at least 2 distinct evidence types to chain why → why
    const ok = items.length >= 3 && types.size >= 2;
    return {
      ok,
      method: "5 Whys",
      need: [
        { label: "≥ 3 evidence items", got: items.length, target: 3, met: items.length >= 3 },
        { label: "≥ 2 distinct evidence types", got: types.size, target: 2, met: types.size >= 2 },
      ],
      missing: [
        !has("Document") && "no procedural document — cannot anchor a procedural-cause chain",
        !has("Witness") && "no witness statement — cannot infer human-action chain",
      ].filter(Boolean),
    };
  }
  if (method === "icam") {
    // ICAM is systemic — needs evidence across at least 3 of 4 type categories
    const ok = types.size >= 3 && items.length >= 4;
    return {
      ok,
      method: "ICAM",
      need: [
        { label: "≥ 4 evidence items", got: items.length, target: 4, met: items.length >= 4 },
        { label: "evidence across ≥ 3 types", got: types.size, target: 3, met: types.size >= 3 },
      ],
      missing: [
        !has("Sensor") && "no sensor / system trace — cannot evaluate Absent or Failed Defences",
        !has("Document") && "no procedure or work-pack — cannot evaluate Task Conditions",
        !has("Witness") && "no witness statement — cannot evaluate Individual Actions",
      ].filter(Boolean),
    };
  }
  if (method === "hfat") {
    // HFAT centres on human behaviour — needs witness + procedural anchor
    const ok = count("Witness") >= 1 && count("Document") >= 1;
    return {
      ok,
      method: "miniHFAT",
      need: [
        { label: "≥ 1 witness statement", got: count("Witness"), target: 1, met: count("Witness") >= 1 },
        { label: "≥ 1 procedure / work-pack", got: count("Document"), target: 1, met: count("Document") >= 1 },
      ],
      missing: [
        count("Witness") < 1 && "without a witness statement the action error and cognitive stage cannot be characterised",
        count("Document") < 1 && "without procedural reference, performance-shaping conditions are speculative",
      ].filter(Boolean),
    };
  }
  return { ok: true };
};

export const InsufficientEvidenceModal = ({ check, onClose, onGoToEvidence }) => {
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,15,0.5)", zIndex: 300,
      display: "grid", placeItems: "center", backdropFilter: "blur(3px)", animation: "fadeIn 0.18s ease-out",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 520, maxWidth: "92vw", background: "var(--bg-elev)",
        border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 24px 60px rgba(10,10,15,0.3)",
        overflow: "hidden", borderTop: "3px solid var(--sev-medium)",
      }}>
        <div style={{ padding: "20px 22px 14px", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "color-mix(in oklch, var(--sev-medium) 14%, transparent)", color: "var(--sev-medium)", display: "grid", placeItems: "center", flex: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--sev-medium)", fontWeight: 700, marginBottom: 4 }}>Auto-analysis blocked</div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Not enough evidence for {check.method} auto-analysis</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.5 }}>
              The system will not generate {check.method} content until the evidence base meets the minimum thresholds. This guards against fabricated or low-confidence findings.
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--ink-2)" }}>
            <Icon name="x" size={14}/>
          </button>
        </div>
        <div style={{ padding: "0 22px 14px" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 8 }}>Threshold check</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            {check.need.map((n, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--bg-sunken)", borderRadius: 6, border: "1px solid var(--border)" }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", display: "grid", placeItems: "center", background: n.met ? "oklch(0.55 0.12 155)" : "var(--sev-medium)", color: "white", flex: "none" }}>
                  {n.met ? <Icon name="check" size={10}/> : <span style={{ fontSize: 10, fontWeight: 700 }}>!</span>}
                </span>
                <span style={{ fontSize: 12.5, flex: 1 }}>{n.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: n.met ? "var(--ink-2)" : "var(--sev-medium)", fontWeight: 600 }}>{n.got} / {n.target}</span>
              </div>
            ))}
          </div>
          {check.missing.length > 0 && (
            <div style={{ padding: "10px 12px", background: "color-mix(in oklch, var(--sev-medium) 7%, transparent)", border: "1px solid color-mix(in oklch, var(--sev-medium) 30%, transparent)", borderRadius: 6, marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-2)", marginBottom: 6 }}>Why the analysis cannot proceed:</div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
                {check.missing.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          )}
        </div>
        <div style={{ padding: "12px 22px", borderTop: "1px solid var(--border)", background: "var(--bg-sunken)", display: "flex", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--ink-3)", fontStyle: "italic", alignSelf: "center" }}>Manual entry remains available.</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose} className="btn ghost">Dismiss</button>
            <button type="button" onClick={onGoToEvidence} className="btn primary">Go to Evidence tab</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TIMELINE_AI_PROPOSALS = [
  { title: "Hydraulic torque report logged", detail: "Single-pass sequence recorded, no verifier signature", confidence: 0.92, source: "DC-01 · WO-84221 closeout", day: "11 April 2026", t: "23:12", kind: "evidence", sub: "Single-pass sequence · no verifier signature" },
  { title: "Pre-startup leak test logged complete", detail: "5-minute static hold rather than 30-minute requirement", confidence: 0.81, source: "DCS export + WO-84221", day: "12 April 2026", t: "02:08", kind: "warning", sub: "Hold time below procedure spec" },
  { title: "Operator queries CG-B-114 trend with CCR", detail: "Inferred from witness statement", confidence: 0.68, source: "WI-02 · Supervisor T. Harlow", day: "12 April 2026", t: "03:43", kind: "action", sub: "Trend flagged; not yet alarmed" },
];

// proxy for AIEvidenceModal previously referenced
export const AIEvidenceModal = ({ onClose, onApply }) => (
  <AIProposalsModal
    context="timeline reconstruction"
    summary="Cross-reference timestamps across photos, sensors, and witness statements to propose missing timeline events."
    evidenceItems={EVIDENCE}
    proposals={TIMELINE_AI_PROPOSALS}
    onClose={onClose}
    onApply={(items) => onApply(items.map(i => ({ day: i.day, t: i.t, kind: i.kind, title: i.title, sub: i.sub })))}
    applyLabel={"Add to timeline"}
  />
);

// --- Timeline tab
export const TimelineTab = () => {
  const [tlFilter, setTlFilter] = React.useState("all");
  const [days, setDays] = React.useState(TIMELINE);
  const [showAdd, setShowAdd] = React.useState(false);
  const [showAI, setShowAI] = React.useState(false);
  const [editing, setEditing] = React.useState(null); // {dayIdx, evIdx}
  const [drag, setDrag] = React.useState(null); // {dayIdx, evIdx}
  const [dragOver, setDragOver] = React.useState(null); // {dayIdx, evIdx, pos: 'before'|'after'}
  const [shiftNotice, setShiftNotice] = React.useState(null);
  React.useEffect(() => {
    if (!shiftNotice) return;
    const t = setTimeout(() => setShiftNotice(null), 6000);
    return () => clearTimeout(t);
  }, [shiftNotice]);
  const filterMap = {
    all: () => true,
    barriers: e => e.kind === "warning" || e.kind === "trigger",
    actions: e => e.kind === "action",
    evidence: e => e.kind === "evidence",
  };
  const filterFn = filterMap[tlFilter];
  const total = days.reduce((a, d) => a + d.events.length, 0);
  const shown = days.reduce((a, d) => a + d.events.filter(filterFn).length, 0);
  const addEvent = (ev) => {
    setDays(prev => {
      const idx = prev.findIndex(d => d.day === ev.day);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], events: [...copy[idx].events, { t: ev.t, kind: ev.kind, title: ev.title, sub: ev.sub }].sort((a,b) => a.t.localeCompare(b.t)) };
        return copy;
      }
      return [...prev, { day: ev.day, events: [{ t: ev.t, kind: ev.kind, title: ev.title, sub: ev.sub }] }];
    });
    setShowAdd(false);
  };
  const updateEvent = (dayIdx, evIdx, patch) => {
    setDays(prev => {
      const copy = prev.map(d => ({ ...d, events: [...d.events] }));
      copy[dayIdx].events[evIdx] = { ...copy[dayIdx].events[evIdx], ...patch };
      return copy;
    });
  };
  const deleteEvent = (dayIdx, evIdx) => {
    setDays(prev => {
      const copy = prev.map(d => ({ ...d, events: [...d.events] }));
      copy[dayIdx].events.splice(evIdx, 1);
      return copy;
    });
  };
  const sortDay = (dayIdx) => {
    setDays(prev => {
      const copy = prev.map(d => ({ ...d, events: [...d.events] }));
      copy[dayIdx].events.sort((a,b) => a.t.localeCompare(b.t));
      return copy;
    });
  };
  const onDragStart = (dayIdx, evIdx) => (e) => {
    setDrag({ dayIdx, evIdx });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${dayIdx}:${evIdx}`);
  };
  const onDragOver = (dayIdx, evIdx) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientY - rect.top) < rect.height / 2 ? "before" : "after";
    setDragOver({ dayIdx, evIdx, pos });
  };
  const onDrop = (dayIdx, evIdx) => (e) => {
    e.preventDefault();
    if (!drag) return;
    const src = drag, target = dragOver || { dayIdx, evIdx, pos: "after" };
    let timeShifted = null; // {id, oldT, newT, day}
    setDays(prev => {
      const copy = prev.map(d => ({ ...d, events: [...d.events] }));
      const [moved] = copy[src.dayIdx].events.splice(src.evIdx, 1);
      const oldT = moved.t;
      let tDay = target.dayIdx, tIdx = target.evIdx;
      if (src.dayIdx === tDay && src.evIdx < tIdx) tIdx -= 1;
      if (target.pos === "after") tIdx += 1;
      // derive a new time that fits between neighbors
      const dayEvents = copy[tDay].events;
      const before = dayEvents[tIdx - 1]?.t;
      const after = dayEvents[tIdx]?.t;
      const midTime = (a, b) => {
        const toMin = (s) => { const [h,m] = s.split(":").map(Number); return h*60+m; };
        const fmt = (n) => `${String(Math.floor(n/60)).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`;
        if (a && b) return fmt(Math.round((toMin(a)+toMin(b))/2));
        if (a) return fmt(toMin(a)+1);
        if (b) return fmt(Math.max(0,toMin(b)-1));
        return moved.t;
      };
      const newT = midTime(before, after);
      const movedClone = { ...moved, t: newT };
      copy[tDay].events.splice(tIdx, 0, movedClone);
      if (newT !== oldT) {
        timeShifted = { title: moved.title, oldT, newT, day: copy[tDay].day };
      }
      return copy;
    });
    if (timeShifted) setShiftNotice({ ...timeShifted, ts: Date.now() });
    setDrag(null);
    setDragOver(null);
  };
  const onDragEnd = () => { setDrag(null); setDragOver(null); };
  const filters = [["all","All events"],["barriers","Barriers"],["actions","Actions"],["evidence","Evidence"]];
  return (
  <div className="inv-body view-enter">
    <div style={{ display: "flex", marginBottom: 18, alignItems: "center", gap: 10 }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Timeline of events</h3>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
          Drag any event to reorder · <span className="mono">{shown} of {total} events</span>
        </div>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
        <div className="seg">
          {filters.map(([k,l]) => (
            <button key={k} className={tlFilter === k ? "active" : ""} onClick={() => setTlFilter(k)}>{l}</button>
          ))}
        </div>
        <button className="btn ghost" onClick={() => setShowAdd(true)}><Icon name="plus" size={13}/>Add event</button>
        <ExportMenu days={days}/>
        <button className="btn primary" onClick={() => setShowAI(true)} style={{ background: "var(--accent)", borderColor: "var(--accent)", color: "white" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="4"/></svg>
          Create from evidence
        </button>
      </div>
    </div>
    <div className="tl-wrap">
      {shown === 0 && (
        <div style={{ padding: 32, textAlign: "center", color: "var(--ink-3)", border: "1px dashed var(--border)", borderRadius: 10 }}>
          No events match this filter.
        </div>
      )}
      {days.map((day, dayIdx) => {
        const visibleEvents = day.events.map((e, i) => ({ e, i })).filter(({ e }) => filterFn(e));
        if (!visibleEvents.length) return null;
        return (
        <React.Fragment key={day.day}>
          <div className="tl-day">{day.day}</div>
          {visibleEvents.map(({ e, i: evIdx }) => {
            const isDragging = drag && drag.dayIdx === dayIdx && drag.evIdx === evIdx;
            const isOver = dragOver && dragOver.dayIdx === dayIdx && dragOver.evIdx === evIdx;
            return (
            <div key={evIdx} className="tl-row" data-kind={e.kind}
              draggable
              onDragStart={onDragStart(dayIdx, evIdx)}
              onDragOver={onDragOver(dayIdx, evIdx)}
              onDrop={onDrop(dayIdx, evIdx)}
              onDragEnd={onDragEnd}
              style={{
                opacity: isDragging ? 0.4 : 1,
                cursor: "grab",
                borderTop: isOver && dragOver.pos === "before" ? "2px solid var(--accent)" : "2px solid transparent",
                borderBottom: isOver && dragOver.pos === "after" ? "2px solid var(--accent)" : "2px solid transparent",
              }}>
              <input
                className="tl-time tl-time-input"
                value={e.t}
                onChange={ev => updateEvent(dayIdx, evIdx, { t: ev.target.value })}
                onBlur={() => sortDay(dayIdx)}
                onMouseDown={ev => ev.stopPropagation()}
                onClick={ev => ev.stopPropagation()}
                draggable={false}
                onDragStart={ev => ev.preventDefault()}
              />
              <div className="tl-dot"/>
              <div
                className="tl-event tl-event-clickable"
                onClick={() => setEditing({ dayIdx, evIdx })}
                style={e.root ? { boxShadow: "0 0 0 3px color-mix(in oklch, var(--sev-critical) 15%, transparent)", borderColor: "var(--sev-critical)" } : {}}
              >
                <div className="tl-event-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "var(--ink-4)", cursor: "grab", fontSize: 12, lineHeight: 1, flex: "none" }} title="Drag to reorder">⋮⋮</span>
                  <span style={{ flex: 1 }}>{e.title}</span>
                  <span className="tl-edit-hint">
                    <Icon name="edit" size={11}/>
                  </span>
                </div>
                <div className="tl-event-sub">
                  <span style={{ flex: 1 }}>{e.sub}</span>
                  <span style={{ marginLeft: "auto" }}>
                    <span className="chip" data-kind={e.kind} style={{ textTransform: "capitalize", fontSize: 10.5 }}>{e.kind}</span>
                  </span>
                </div>
              </div>
            </div>
            );
          })}
        </React.Fragment>
        );
      })}
    </div>
    {showAdd && <AddTimelineModal onClose={() => setShowAdd(false)} onAdd={addEvent} days={days}/>}
    {editing && (() => {
      const ev = days[editing.dayIdx]?.events[editing.evIdx];
      if (!ev) return null;
      return (
        <AddTimelineModal
          onClose={() => setEditing(null)}
          days={days}
          initial={{ ...ev, day: days[editing.dayIdx].day }}
          onUpdate={(patch) => {
            // remove from old position, insert into new day, re-sort
            setDays(prev => {
              const copy = prev.map(d => ({ ...d, events: [...d.events] }));
              copy[editing.dayIdx].events.splice(editing.evIdx, 1);
              const targetIdx = copy.findIndex(d => d.day === patch.day);
              if (targetIdx >= 0) {
                copy[targetIdx].events = [...copy[targetIdx].events, patch].sort((a,b) => a.t.localeCompare(b.t));
              } else {
                copy.push({ day: patch.day, events: [patch] });
              }
              return copy;
            });
            setEditing(null);
          }}
          onDelete={() => {
            setDays(prev => {
              const copy = prev.map(d => ({ ...d, events: [...d.events] }));
              copy[editing.dayIdx].events.splice(editing.evIdx, 1);
              return copy;
            });
            setEditing(null);
          }}
        />
      );
    })()}
    {showAI && <AIEvidenceModal onClose={() => setShowAI(false)} onApply={(events) => {
      setDays(prev => {
        const copy = prev.map(d => ({ ...d, events: [...d.events] }));
        events.forEach(ev => {
          const idx = copy.findIndex(d => d.day === ev.day);
          if (idx >= 0) copy[idx].events = [...copy[idx].events, ev].sort((a,b) => a.t.localeCompare(b.t));
          else copy.push({ day: ev.day, events: [ev] });
        });
        return copy;
      });
      setShowAI(false);
    }}/>}
    {shiftNotice && (
      <div style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
        background: "var(--bg-elev)", border: "1px solid var(--accent)",
        boxShadow: "var(--shadow-lg)", borderRadius: 10, padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12, zIndex: 250,
        maxWidth: 520,
      }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--accent-soft)", color: "var(--accent-ink)", display: "grid", placeItems: "center", flex: "none" }}>
          <Icon name="clock" size={15}/>
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.45 }}>
          <div style={{ fontWeight: 600, color: "var(--accent-ink)", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 10.5 }}>
            Time changed — verify against evidence
          </div>
          <div style={{ marginTop: 2 }}>
            <strong>{shiftNotice.title}</strong> moved from <span className="mono" style={{ textDecoration: "line-through", color: "var(--ink-3)" }}>{shiftNotice.oldT}</span> → <span className="mono" style={{ color: "var(--accent-ink)", fontWeight: 600 }}>{shiftNotice.newT}</span>
          </div>
          <div style={{ color: "var(--ink-3)", fontSize: 11, marginTop: 3 }}>
            Reordering events alters the causal sequence. Confirm the new timestamp matches DCS logs or witness statements.
          </div>
        </div>
        <button className="btn ghost" style={{ padding: "4px 8px" }} onClick={() => setShiftNotice(null)}>Dismiss</button>
      </div>
    )}
  </div>
  );
};

export const ExportMenu = ({ days }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const KIND_COLORS = {
    action: { bg: "#EAF1FB", fg: "#1E4FA5", dot: "#2A6FDB", label: "Action" },
    warning: { bg: "#FBF1DC", fg: "#8A5A00", dot: "#C68A12", label: "Warning" },
    evidence: { bg: "#ECECEE", fg: "#1A1A1F", dot: "#1A1A1F", label: "Evidence" },
    critical: { bg: "#FBE4E1", fg: "#9C2A1A", dot: "#C53A26", label: "Critical" },
  };

  const escHtml = (s) => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));

  const buildTimelineHtml = ({ pageStyle }) => {
    const rows = [];
    days.forEach(day => {
      rows.push(`
        <tr><td colspan="4" class="day-row">${escHtml(day.day)}</td></tr>
      `);
      day.events.forEach(e => {
        const k = KIND_COLORS[e.kind] || KIND_COLORS.action;
        rows.push(`
          <tr class="${e.root ? "root-row" : ""}">
            <td class="t-time">${escHtml(e.t)}</td>
            <td class="t-kind">
              <span class="kind-pill" style="background:${k.bg};color:${k.fg};">
                <span class="kind-dot" style="background:${k.dot};"></span>${k.label}
              </span>
            </td>
            <td class="t-title">
              ${escHtml(e.title)}${e.root ? ' <span class="root-tag">ROOT EVENT</span>' : ""}
            </td>
            <td class="t-sub">${escHtml(e.sub || "")}</td>
          </tr>
        `);
      });
    });

    return `
      <style>
        ${pageStyle}
        body { font-family: Calibri, "Segoe UI", Arial, sans-serif; color: #1A1A1F; }
        h1 { font-size: 22pt; margin: 0 0 4pt 0; letter-spacing: -0.01em; }
        h2 { font-size: 11pt; margin: 0 0 18pt 0; color: #5A5A66; font-weight: normal; }
        .meta-grid { width: 100%; border-collapse: collapse; margin-bottom: 18pt; font-size: 10pt; }
        .meta-grid td { padding: 4pt 10pt 4pt 0; vertical-align: top; }
        .meta-grid .label { color: #8A8A94; text-transform: uppercase; letter-spacing: 0.06em; font-size: 8.5pt; width: 100pt; }
        .meta-grid .val { color: #1A1A1F; font-weight: 500; }
        table.timeline { width: 100%; border-collapse: collapse; margin-top: 8pt; }
        table.timeline th { background: #1A1A1F; color: #FFFFFF; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.08em; text-align: left; padding: 8pt 10pt; font-weight: 600; }
        table.timeline td { padding: 9pt 10pt; border-bottom: 1px solid #E5E5EA; vertical-align: top; font-size: 10pt; }
        table.timeline .day-row { background: #F4F4F7; color: #5A5A66; font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; padding: 8pt 10pt; border-top: 2px solid #1A1A1F; }
        table.timeline .t-time { font-family: "Consolas", "Courier New", monospace; font-size: 10pt; color: #5A5A66; white-space: nowrap; width: 60pt; }
        table.timeline .t-kind { width: 90pt; }
        table.timeline .t-title { font-weight: 500; color: #1A1A1F; }
        table.timeline .t-sub { color: #5A5A66; font-size: 9.5pt; }
        .kind-pill { display: inline-block; padding: 2pt 8pt; border-radius: 10pt; font-size: 8.5pt; font-weight: 600; white-space: nowrap; }
        .kind-dot { display: inline-block; width: 6pt; height: 6pt; border-radius: 50%; margin-right: 4pt; vertical-align: middle; }
        .root-row { background: #FFF8F6; }
        .root-row .t-title { color: #9C2A1A; }
        .root-tag { display: inline-block; background: #C53A26; color: #FFFFFF; padding: 1pt 6pt; border-radius: 3pt; font-size: 7.5pt; font-weight: 700; letter-spacing: 0.08em; margin-left: 6pt; vertical-align: middle; }
        .footer { margin-top: 22pt; padding-top: 10pt; border-top: 1px solid #E5E5EA; color: #8A8A94; font-size: 8.5pt; }
        .legend { display: block; margin-top: 4pt; }
        .legend .kind-pill { margin-right: 6pt; }
      </style>
      <h1>Timeline of events</h1>
      <h2>Investigation ${escHtml(INV.id)} · ${escHtml(INV.title)}</h2>
      <table class="meta-grid">
        <tr>
          <td class="label">Facility</td><td class="val">${escHtml(INV.facility || "—")}</td>
          <td class="label">Severity</td><td class="val">${escHtml(INV.severity || "—")}</td>
        </tr>
        <tr>
          <td class="label">Lead investigator</td><td class="val">${escHtml(INV.lead || "—")}</td>
          <td class="label">Reported</td><td class="val">${escHtml(INV.reported || "—")}</td>
        </tr>
        <tr>
          <td class="label">Total events</td><td class="val">${days.reduce((a,d)=>a+d.events.length,0)}</td>
          <td class="label">Exported</td><td class="val">${new Date().toLocaleString()}</td>
        </tr>
      </table>
      <table class="timeline">
        <thead>
          <tr>
            <th style="width:60pt;">Time</th>
            <th style="width:90pt;">Kind</th>
            <th>Event</th>
            <th>Source / detail</th>
          </tr>
        </thead>
        <tbody>${rows.join("")}</tbody>
      </table>
      <div class="footer">
        <strong>Legend:</strong>
        <span class="legend">
          ${Object.entries(KIND_COLORS).map(([k,v]) => `<span class="kind-pill" style="background:${v.bg};color:${v.fg};"><span class="kind-dot" style="background:${v.dot};"></span>${v.label}</span>`).join("")}
        </span>
        <div style="margin-top:8pt;">Generated from the Incident Investigation Portal · This document is part of investigation record ${escHtml(INV.id)} and must be retained per company records-management policy.</div>
      </div>
    `;
  };

  const download = (filename, content, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
  };

  const exportWord = () => {
    const body = buildTimelineHtml({ pageStyle: "@page { size: A4 landscape; margin: 1.6cm 1.8cm; }" });
    const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Timeline ${INV.id}</title><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]--></head><body>${body}</body></html>`;
    download(`Timeline_${INV.id}.doc`, html, "application/msword");
    setOpen(false);
  };

  const exportExcel = () => {
    const body = buildTimelineHtml({ pageStyle: "" });
    const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Timeline ${INV.id}</title><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Timeline</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>${body}</body></html>`;
    download(`Timeline_${INV.id}.xls`, html, "application/vnd.ms-excel");
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="btn ghost" onClick={() => setOpen(o => !o)}>
        <Icon name="download" size={13}/>Export
        <span style={{ fontSize: 9, color: "var(--ink-4)", marginLeft: 2 }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 100,
          background: "var(--bg-elev)", border: "1px solid var(--border)",
          borderRadius: 8, boxShadow: "var(--shadow-lg)", padding: 4, minWidth: 220,
        }}>
          <button className="exp-item" onClick={exportExcel}>
            <span className="exp-icon" style={{ background: "#1F7A3D", color: "white" }}>X</span>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 500 }}>Export to Excel</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-3)" }}>.xls · styled table per day</div>
            </div>
          </button>
          <button className="exp-item" onClick={exportWord}>
            <span className="exp-icon" style={{ background: "#1F4DA5", color: "white" }}>W</span>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 500 }}>Export to Word</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-3)" }}>.doc · A4 landscape report</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export const AddTimelineModal = ({ onClose, onAdd, onUpdate, onDelete, days, initial }) => {
  const editing = !!initial;
  const [day, setDay] = React.useState(initial?.day || days[days.length - 1]?.day || "");
  const [t, setT] = React.useState(initial?.t || "");
  const [kind, setKind] = React.useState(initial?.kind || "action");
  const [title, setTitle] = React.useState(initial?.title || "");
  const [sub, setSub] = React.useState(initial?.sub || "");
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !t.trim() || !day.trim()) return;
    const payload = { day, t: t.trim(), kind, title: title.trim(), sub: sub.trim() };
    if (editing) onUpdate(payload); else onAdd(payload);
  };
  const kinds = [["action","Action"],["warning","Warning"],["evidence","Evidence"],["critical","Critical"]];
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,15,0.45)", zIndex: 300,
      display: "grid", placeItems: "center", backdropFilter: "blur(2px)",
    }}>
      <form onClick={e => e.stopPropagation()} onSubmit={submit} style={{
        width: 460, background: "var(--bg-elev)", border: "1px solid var(--border)",
        borderRadius: 12, boxShadow: "var(--shadow-lg)", padding: 22,
      }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{editing ? "Edit timeline event" : "Add timeline event"}</div>
          <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-4)" }}>{INV.id}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, marginBottom: 6 }}>Kind</div>
            <div className="seg" style={{ width: "100%" }}>
              {kinds.map(([k,l]) => (
                <button key={k} type="button" className={kind === k ? "active" : ""}
                  onClick={() => setKind(k)} style={{ flex: 1 }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
            <Field label="Day" v={day} set={setDay} placeholder="12 April 2026"/>
            <Field label="Time" v={t} set={setT} placeholder="03:47"/>
          </div>
          <Field label="Title" v={title} set={setTitle} placeholder="Short event description"/>
          <Field label="Detail" v={sub} set={setSub} placeholder="Source / context"/>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 18, alignItems: "center" }}>
          {editing && (
            <button type="button" className="btn ghost" onClick={onDelete} style={{ color: "var(--sev-high)" }}>
              <Icon name="x" size={13}/>Delete event
            </button>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary"><Icon name="check" size={13}/>{editing ? "Save changes" : "Add event"}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

// --- 5 Whys tab
export const FiveWhysEditModal = ({ initial, onSave, onDelete, onClose }) => {
  const [draft, setDraft] = React.useState(initial || { n: 0, q: "", a: "", evidence: [], indent: 0, root: false, category: "" });
  const [evDraft, setEvDraft] = React.useState("");
  const isNew = !initial;
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const submit = (e) => { e.preventDefault(); if (!draft.q.trim() || !draft.a.trim()) return; onSave(draft); };
  const addEv = () => { if (!evDraft.trim()) return; setDraft(d => ({ ...d, evidence: [...(d.evidence || []), evDraft.trim()] })); setEvDraft(""); };
  const removeEv = (i) => setDraft(d => ({ ...d, evidence: d.evidence.filter((_, j) => j !== i) }));
  const categories = ["", "Absent / Failed Defence", "Individual / Team Action", "Task / Environment Condition", "Organisational Factor"];
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,15,0.45)", zIndex: 300,
      display: "grid", placeItems: "center", backdropFilter: "blur(2px)", animation: "fadeIn 0.18s ease-out",
    }}>
      <form onClick={e => e.stopPropagation()} onSubmit={submit} style={{
        width: 600, maxWidth: "92vw", maxHeight: "90vh", background: "var(--bg-elev)",
        border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 24px 60px rgba(10,10,15,0.25)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 4, alignSelf: "stretch", background: draft.root ? "var(--accent)" : "var(--ink-3)", borderRadius: 2 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 4 }}>{isNew ? "Add" : "Edit"} 5-Whys step</div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Why {draft.n || "—"} · {draft.root ? "Root cause" : "Contributing answer"}</div>
          </div>
          <button type="button" onClick={onClose} style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--ink-2)" }}>
            <Icon name="x" size={14}/>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Question</span>
            <textarea value={draft.q} onChange={e => setDraft(d => ({ ...d, q: e.target.value }))} autoFocus rows={2}
              style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit", resize: "vertical", lineHeight: 1.45 }}
              placeholder="e.g. Why did the flange leak?"/>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Answer</span>
            <textarea value={draft.a} onChange={e => setDraft(d => ({ ...d, a: e.target.value }))} rows={3}
              style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit", resize: "vertical", lineHeight: 1.5 }}
              placeholder="The supporting fact or finding that answers the question"/>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Step number</span>
              <input type="number" min="1" value={draft.n || ""} onChange={e => setDraft(d => ({ ...d, n: parseInt(e.target.value) || 0, indent: Math.max(0, (parseInt(e.target.value) || 1) - 1) }))}
                style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit" }}/>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>ICAM category</span>
              <select value={draft.category || ""} onChange={e => setDraft(d => ({ ...d, category: e.target.value }))}
                style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit" }}>
                {categories.map(c => <option key={c} value={c}>{c || "— none —"}</option>)}
              </select>
            </label>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Supporting evidence</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(draft.evidence || []).map((ev, i) => (
                <span key={i} className="fw-ev" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Icon name="link" size={11}/>{ev}
                  <button type="button" onClick={() => removeEv(i)} style={{ background: "none", border: "none", color: "var(--ink-3)", cursor: "pointer", padding: 0, display: "inline-flex" }}><Icon name="x" size={11}/></button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              <input type="text" value={evDraft} onChange={e => setEvDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addEv(); } }}
                placeholder="e.g. PHOTO-01 · flange"
                style={{ flex: 1, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12.5, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit" }}/>
              <button type="button" onClick={addEv} className="btn ghost"><Icon name="plus" size={12}/>Add</button>
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-2)", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg-sunken)", cursor: "pointer" }}>
            <input type="checkbox" checked={!!draft.root} onChange={e => setDraft(d => ({ ...d, root: e.target.checked }))} style={{ accentColor: "var(--accent)" }}/>
            <div>
              <div style={{ fontWeight: 500 }}>Mark as root cause</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Highlights the step in the cascade and propagates to the executive summary.</div>
            </div>
          </label>
        </div>
        <div style={{ padding: "12px 22px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          {!isNew && (
            <button type="button" onClick={() => onDelete(draft.n)} className="btn ghost" style={{ color: "var(--sev-high)" }}>
              <Icon name="x" size={13}/>Delete step
            </button>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose} className="btn ghost">Cancel</button>
            <button type="submit" className="btn primary">{isNew ? "Add step" : "Save changes"}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const FW_AI_PROPOSALS = [
  { title: "Why 4 — Schedule pressure not flagged in PTW", detail: "PTW Standard 4.2 has no explicit clause for restart windows; risk review was not triggered.", confidence: 0.84, source: "DC-01 · WI-02" },
  { title: "Why 5 — Restart-window KPI rewards speed over assurance", detail: "Operations KPI structure incentivises early return-to-service; identified as latent organisational factor.", confidence: 0.71, source: "DC-02 · WI-02" },
];

export const FiveWhysTab = ({ onGoToEvidence }) => {
  const [whys, setWhys] = React.useState(FIVE_WHYS);
  const [editing, setEditing] = React.useState(null);
  const [showAI, setShowAI] = React.useState(false);
  const [warn, setWarn] = React.useState(null);
  const tryAI = () => {
    const c = evidenceSufficiency("fivewhys", EVIDENCE);
    if (!c.ok) { setWarn(c); return; }
    setShowAI(true);
  };
  const handleSave = (draft) => {
    setWhys(prev => {
      const exists = prev.find(w => w.n === draft.n);
      const next = exists ? prev.map(w => w.n === draft.n ? draft : w) : [...prev, draft];
      return next.sort((a, b) => a.n - b.n);
    });
    setEditing(null);
  };
  const handleDelete = (n) => { setWhys(prev => prev.filter(w => w.n !== n)); setEditing(null); };
  const nextN = (whys.reduce((m, w) => Math.max(m, w.n), 0)) + 1;
  return (
    <div className="inv-body view-enter">
      {editing && (
        <FiveWhysEditModal initial={editing.why} onSave={handleSave} onDelete={handleDelete} onClose={() => setEditing(null)}/>
      )}
      {warn && <InsufficientEvidenceModal check={warn} onClose={() => setWarn(null)} onGoToEvidence={() => { setWarn(null); onGoToEvidence && onGoToEvidence(); }}/>}
      {showAI && (
        <AIProposalsModal
          context="5 Whys cascade"
          summary="Propose additional whys by chaining timeline events, witness statements and procedural references."
          evidenceItems={EVIDENCE}
          proposals={FW_AI_PROPOSALS}
          onClose={() => setShowAI(false)}
          onApply={(items) => {
            setWhys(prev => {
              let n = prev.reduce((m, w) => Math.max(m, w.n), 0);
              const adds = items.map(i => ({ n: ++n, q: "AI-proposed", a: i.title, evidence: [i.source.split(" · ")[0]], indent: n - 1, root: false, category: "" }));
              return [...prev, ...adds];
            });
            setShowAI(false);
          }}
          applyLabel="Add to cascade"
        />
      )}
      <div style={{ display: "flex", marginBottom: 18, alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>5 Whys analysis</h3>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
            Cascade from event to underlying cause · each answer is linked to supporting evidence
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button className="btn primary" onClick={tryAI} style={{ background: "var(--accent)", borderColor: "var(--accent)", color: "white" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>
            Auto-cascade
          </button>
          <button className="btn ghost"><Icon name="link" size={13}/>Link to ICAM</button>
          <button className="btn" onClick={() => setEditing({ why: { n: nextN, q: "", a: "", evidence: [], indent: nextN - 1, root: false, category: "" } })}><Icon name="plus" size={13}/>Add why</button>
        </div>
      </div>
      <div style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg-elev)", marginBottom: 22, borderLeft: "3px solid var(--accent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-ink)", fontWeight: 700 }}>Step 1 · Problem statement</span>
          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>specific · observable · evidence-anchored</span>
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.5, marginBottom: 10 }}>{FW_PROBLEM.statement}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 11.5, color: "var(--ink-2)" }}>
          <div><span style={{ color: "var(--ink-3)" }}>Observed:</span> {FW_PROBLEM.observed}</div>
          <div><span style={{ color: "var(--ink-3)" }}>Scope:</span> {FW_PROBLEM.scope}</div>
          <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "var(--ink-3)" }}>Out of scope:</span> {FW_PROBLEM.excluded}</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
          {FW_PROBLEM.evidence.map(id => (
            <span key={id} className="fw-ev" style={{ background: "var(--bg-sunken)" }}><Icon name="link" size={11}/>{id}</span>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 700, marginBottom: 10 }}>Step 2 · Cascade — ask Why against each answer until a root cause is reached</div>
      <div className="fw-wrap">
        {whys.map(w => {
          const v = FW_VERIFY_META[w.verification || "unverified"];
          return (
          <div key={w.n} className="fw-step">
            <div className="fw-step-idx">
              <div>why</div>
              <div className="n">{w.n}</div>
            </div>
            <div className={`fw-step-body fw-edit-card ${w.root ? "fw-root" : ""}`} onClick={() => setEditing({ why: w })} style={{ "--indent": w.indent, cursor: "pointer", position: "relative" }}>
              <span className="fw-edit-pencil" aria-hidden style={{ position: "absolute", top: 10, right: 12, opacity: 0, transition: "opacity 120ms", color: "var(--ink-3)", display: "inline-flex" }}><Icon name="edit" size={12}/></span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="fw-q" style={{ flex: 1 }}>Why {w.n} · {w.root ? "Root cause confirmed" : "Contributing answer"}</div>
                <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: v.color, padding: "2px 7px", borderRadius: 3, background: `color-mix(in oklch, ${v.color} 12%, transparent)` }}>{v.label}</span>
              </div>
              <div className="fw-a">{w.a}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 6, fontStyle: "italic" }}>
                Q: {w.q}
              </div>
              {w.evidence && w.evidence.length > 0 && (
                <div className="fw-evidence">
                  {w.evidence.map((ev, i) => (
                    <span key={i} className="fw-ev"><Icon name="link" size={11}/>{ev}</span>
                  ))}
                </div>
              )}
              {w.category && (
                <div className="fw-cat">
                  <span className="fw-cat-dot"/>Maps to ICAM · <strong style={{ color: "var(--ink)" }}>{w.category}</strong>
                </div>
              )}
            </div>
          </div>
        );})}
      </div>
      {whys.some(w => w.root) && (
        <div style={{ marginTop: 18, padding: "14px 18px", border: "1px solid var(--accent)", borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", color: "white", display: "grid", placeItems: "center", flex: "none" }}><Icon name="check" size={14}/></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-ink)", fontWeight: 700 }}>Step 3 · Root cause reached — stop here</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 2 }}>Cascade terminates when the answer points to a system, policy, or decision that, if changed, would prevent recurrence. Further whys would chase symptoms.</div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- miniHFAT tab
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

export const HFAT_AI_PROPOSALS = [
  { title: "Cognitive stage · Diagnosis (Partial)", detail: "Operator initially attributed DCS drift to instrument fault rather than physical leak.", confidence: 0.83, source: "WI-02 · SE-01" },
  { title: "Performance-shaping · Workload (high)", detail: "Crew working into 14th hour of a 12-hour planned shift; supported by witness statements + roster.", confidence: 0.89, source: "WI-01 · DC-02" },
  { title: "Recovery opportunity · leak-test hold time", detail: "5-minute static hold instead of 30-minute spec.", confidence: 0.76, source: "DC-01 · SE-02" },
];

export const HfatTab = ({ onGoToEvidence }) => {
  const [showAI, setShowAI] = React.useState(false);
  const [warn, setWarn] = React.useState(null);
  const tryAI = () => {
    const c = evidenceSufficiency("hfat", EVIDENCE);
    if (!c.ok) { setWarn(c); return; }
    setShowAI(true);
  };
  const d = HFAT_DATA;
  const lvlColor = { high: "var(--sev-high)", medium: "var(--sev-medium)", low: "oklch(0.55 0.10 155)" };
  const findColor = { Adequate: "oklch(0.55 0.10 155)", Partial: "var(--sev-medium)", Inadequate: "var(--sev-high)" };
  return (
    <div className="inv-body view-enter">
      <div style={{ display: "flex", marginBottom: 18, alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>miniHFAT · human factors analysis</h3>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
            Action error · recovery · cognition · performance-shaping conditions
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {warn && <InsufficientEvidenceModal check={warn} onClose={() => setWarn(null)} onGoToEvidence={() => { setWarn(null); onGoToEvidence && onGoToEvidence(); }}/>}
          {showAI && (
            <AIProposalsModal
              context="miniHFAT human-factors analysis"
              summary="Cross-reference witness statements and procedure refs to characterise action error, recovery, cognitive stage and performance-shaping conditions."
              evidenceItems={EVIDENCE}
              proposals={HFAT_AI_PROPOSALS}
              onClose={() => setShowAI(false)}
              onApply={() => setShowAI(false)}
              applyLabel="Add findings"
            />
          )}
          <button className="btn primary" onClick={tryAI} style={{ background: "var(--accent)", borderColor: "var(--accent)", color: "white" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>
            Generate findings
          </button>
          <button className="btn ghost"><Icon name="link" size={13}/>Link to ICAM</button>
          <button className="btn"><Icon name="plus" size={13}/>Add finding</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg-elev)" }}>
          <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 6 }}>① Action error</div>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: "var(--sev-high)" }}>{d.actionError.type}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 10 }}>{d.actionError.desc}</div>
          <div style={{ display: "flex", gap: 16, fontSize: 11.5 }}>
            <div><span style={{ color: "var(--ink-3)" }}>Actor:</span> <strong>{d.actionError.actor}</strong></div>
            <div><span style={{ color: "var(--ink-3)" }}>Class:</span> <strong>{d.actionError.classification}</strong></div>
          </div>
        </div>
        <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg-elev)" }}>
          <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 6 }}>② Error recovery</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 10 }}>{d.recovery.opportunity}</div>
          <div style={{ fontSize: 11.5, padding: "6px 10px", background: "var(--bg-sunken)", borderRadius: 5, marginBottom: 4 }}>
            <span style={{ color: "var(--ink-3)" }}>Barrier:</span> {d.recovery.barrier}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--sev-high)", fontWeight: 500 }}>↳ {d.recovery.outcome}</div>
        </div>
      </div>

      <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg-elev)", marginBottom: 14 }}>
        <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 10 }}>③ Cognitive stage breakdown</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {d.cognition.map(c => (
            <div key={c.stage} style={{ padding: 12, background: "var(--bg-sunken)", borderRadius: 8, borderTop: `3px solid ${findColor[c.finding]}` }}>
              <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{c.stage}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: findColor[c.finding], margin: "3px 0 6px" }}>{c.finding}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.45 }}>{c.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg-elev)" }}>
        <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 10 }}>④ Performance-shaping conditions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {d.conditions.map(c => (
            <div key={c.cat} style={{ display: "grid", gridTemplateColumns: "180px 70px 1fr", gap: 12, alignItems: "center", padding: "8px 10px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12.5, fontWeight: 500 }}>{c.cat}</div>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: lvlColor[c.level], padding: "2px 7px", borderRadius: 3, background: `color-mix(in oklch, ${lvlColor[c.level]} 12%, transparent)`, textAlign: "center" }}>{c.level}</span>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.45 }}>{c.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- ICAM tab
export const IcamFactorModal = ({ initial, kind, onSave, onDelete, onClose }) => {
  const [draft, setDraft] = React.useState(initial || { id: "", title: "", rating: "contributor", kind, root: false, notes: "" });
  const isNew = !initial;
  const ratingOptions = {
    defence: ["barrier held", "weakened", "absent", "failed", "major"],
    action: ["error", "violation", "slip", "lapse"],
    condition: ["contributor", "performance shaping", "latent"],
    org: ["root", "underlying", "systemic", "latent"],
  };
  const kindLabels = { defence: "Absent / Failed Defence", action: "Individual / Team Action", condition: "Task / Environment Condition", org: "Organisational Factor" };
  const kindAccent = { defence: "var(--sev-critical)", action: "var(--sev-high)", condition: "var(--status-progress)", org: "var(--status-review)" };
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const submit = (e) => { e.preventDefault(); if (!draft.title.trim()) return; onSave(draft); };
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,15,0.45)", zIndex: 300,
      display: "grid", placeItems: "center", backdropFilter: "blur(2px)", animation: "fadeIn 0.18s ease-out",
    }}>
      <form onClick={e => e.stopPropagation()} onSubmit={submit} style={{
        width: 560, maxWidth: "92vw", maxHeight: "90vh", background: "var(--bg-elev)",
        border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 24px 60px rgba(10,10,15,0.25)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 4, alignSelf: "stretch", background: kindAccent[draft.kind], borderRadius: 2 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 4 }}>{isNew ? "Add" : "Edit"} ICAM factor</div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{kindLabels[draft.kind]}</div>
            {!isNew && <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3, fontFamily: "var(--font-mono)" }}>{draft.id}</div>}
          </div>
          <button type="button" onClick={onClose} style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--ink-2)" }}>
            <Icon name="x" size={14}/>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Factor description</span>
            <textarea
              value={draft.title}
              onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
              autoFocus
              rows={2}
              style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit", resize: "vertical", lineHeight: 1.45 }}
              placeholder="e.g. Independent torque verification not performed after bolting"
            />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Category</span>
              <select
                value={draft.kind}
                onChange={e => setDraft(d => ({ ...d, kind: e.target.value, rating: ratingOptions[e.target.value][0] }))}
                style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit" }}>
                {Object.entries(kindLabels).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Rating</span>
              <select
                value={draft.rating}
                onChange={e => setDraft(d => ({ ...d, rating: e.target.value }))}
                style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit", textTransform: "capitalize" }}>
                {ratingOptions[draft.kind].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
          </div>
          <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Analysis notes <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--ink-3)" }}>· optional</span></span>
            <textarea
              value={draft.notes || ""}
              onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
              rows={4}
              style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit", resize: "vertical", lineHeight: 1.5 }}
              placeholder="Evidence references, reasoning, links to 5 Whys cascade…"
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-2)", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg-sunken)", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={!!draft.root}
              onChange={e => setDraft(d => ({ ...d, root: e.target.checked }))}
              style={{ accentColor: "var(--accent)" }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>Mark as root cause</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Highlights the factor in the cascade and links it to the executive summary.</div>
            </div>
          </label>
        </div>
        <div style={{ padding: "12px 22px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          {!isNew && (
            <button type="button" onClick={() => onDelete(draft.id)} className="btn ghost" style={{ color: "var(--sev-high)" }}>
              <Icon name="x" size={13}/>Delete
            </button>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose} className="btn ghost">Cancel</button>
            <button type="submit" className="btn primary">{isNew ? "Add factor" : "Save changes"}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const ICAM_AI_PROPOSALS = [
  { title: "AFD-04 · DCS pre-startup leak-test interlock absent", detail: "No interlock prevents return-to-service if hold time < spec. Maps to Absent / Failed Defences.", confidence: 0.88, source: "SE-02 · DC-01", kind: "defence" },
  { title: "IA-03 · Single-pass torque execution", detail: "Action-error inferred from witness + WO closeout report.", confidence: 0.93, source: "WI-01 · DC-01", kind: "action" },
  { title: "TC-04 · Procedure diagram mismatch (10 vs 12 studs)", detail: "Work pack figure does not match flange in field.", confidence: 0.79, source: "DC-01 · PH-02", kind: "condition" },
  { title: "OF-04 · Restart-window KPI rewards speed", detail: "Latent organisational pressure surfaced via two witness accounts.", confidence: 0.66, source: "WI-01 · WI-02", kind: "org" },
];

export const PEEPO_QUESTIONS_INIT = [
  // People
  { id: "P-Q1", col: "p", q: "Who was directly involved in the torque-up of flange F-12 — names, roles, certifications?", a: "J. Park (mechanical technician, certified flange-management Level 2) executed the torque. T. Harlow (on-shift supervisor) authorised the PTW restart. No second flange-management certified person on shift.", evidence: ["WI-01", "WI-02", "DOC-02"] },
  { id: "P-Q2", col: "p", q: "Was an independent verifier present and competent for the torque verification step?", a: "No. Verifier signature was added retrospectively by T. Harlow without witnessing the torque sequence.", evidence: ["WI-02", "DOC-04"] },
  { id: "P-Q3", col: "p", q: "What were the fatigue / shift-handover conditions of the people involved?", a: "", evidence: [] },
  { id: "P-Q4", col: "p", q: "Who made the decision to compress the maintenance window? On what authority?", a: "", evidence: [] },
  // Environment
  { id: "E1-Q1", col: "e1", q: "What were the lighting, weather and noise conditions on C-Deck during the torque-up?", a: "Pre-dawn task (04:30–05:50). Temporary lighting only, gusting 18 kt SE, intermittent rain. Noise from adjacent flare line ~88 dB.", evidence: ["DOC-05", "PH-04"] },
  { id: "E1-Q2", col: "e1", q: "Were there any concurrent operations on adjacent decks that could have affected the work?", a: "", evidence: [] },
  { id: "E1-Q3", col: "e1", q: "Was the LEL detector field correctly configured for the work zone?", a: "Yes — LEL-04 in service, last bump-tested 9 days prior; calibration in date.", evidence: ["SEN-01", "DOC-07"] },
  // Equipment
  { id: "E2-Q1", col: "e2", q: "Was the correct torque tool used and was it within calibration?", a: "Hydraulic torque wrench HTW-118 used. Calibration certificate expired 11 days prior to job.", evidence: ["PH-03", "DOC-06"] },
  { id: "E2-Q2", col: "e2", q: "Were the studs and gaskets the correct grade and from a qualified supplier?", a: "B7 studs and spiral-wound gasket per spec. Material certs verified.", evidence: ["DOC-08"] },
  { id: "E2-Q3", col: "e2", q: "What was the historical maintenance / failure record for flange F-12?", a: "", evidence: [] },
  // Procedures
  { id: "P2-Q1", col: "p2", q: "Was the flange-management procedure (FM-PRC-04) the latest revision and accessible at the worksite?", a: "Latest revision (Rev 7, Feb 2026) — but printed copy in toolbox was Rev 6, missing the independent-verification clause added in Rev 7.", evidence: ["DOC-04", "PH-05"] },
  { id: "P2-Q2", col: "p2", q: "Did the work pack include a step-by-step torque sequence and verification sign-off?", a: "Yes, sequence specified. Verification sign-off line was on the work pack but not completed at the joint.", evidence: ["DOC-02", "DOC-04"] },
  { id: "P2-Q3", col: "p2", q: "Was the PTW restart criteria for the joint clearly defined and applied?", a: "", evidence: [] },
  // Organisation
  { id: "O-Q1", col: "o", q: "What schedule or commercial pressure was the team operating under?", a: "06:00 production restart target communicated by ops manager the previous day. Crew described 'standard practice' to compress final checks to meet restart.", evidence: ["WI-02", "DOC-09"] },
  { id: "O-Q2", col: "o", q: "When was the flange-management procedure last refresher-trained, and who attended?", a: "Last refresher Nov 2024 — 6/9 of current shift attended. J. Park attended; T. Harlow had not refreshed since 2022.", evidence: ["DOC-10"] },
  { id: "O-Q3", col: "o", q: "Have similar incidents or near-misses been reported and tracked at this asset?", a: "", evidence: [] },
  { id: "O-Q4", col: "o", q: "Is independent torque verification audited as a routine assurance check?", a: "", evidence: [] },
];

export const PEEPO_INIT = {
  "PH-01": { p: false, e1: true, e2: true, p2: false, o: false },
  "PH-02": { p: false, e1: false, e2: true, p2: true, o: false },
  "SE-01": { p: false, e1: true, e2: true, p2: false, o: false },
  "DC-01": { p: false, e1: false, e2: false, p2: true, o: false },
  "WI-01": { p: true, e1: false, e2: false, p2: true, o: false },
  "WI-02": { p: true, e1: false, e2: false, p2: true, o: true },
  "SE-02": { p: false, e1: false, e2: true, p2: false, o: false },
  "DC-02": { p: true, e1: false, e2: false, p2: false, o: true },
};

export const PEEPO_COLS = [
  { k: "p",  letter: "P", title: "People",       sub: "Crew, supervisors, witnesses, decision-makers involved." },
  { k: "e1", letter: "E", title: "Environment",  sub: "Physical & operating conditions — weather, lighting, noise, hazards." },
  { k: "e2", letter: "E", title: "Equipment",    sub: "Plant, tools, instrumentation, PPE involved in the event." },
  { k: "p2", letter: "P", title: "Procedures",   sub: "Work packs, permits, standards, training records relied upon." },
  { k: "o",  letter: "O", title: "Organisation", sub: "Management systems, culture, scheduling, accountabilities." },
];

export const PeepoChart = ({ items, mapping, setMapping, onGoToEvidence }) => {
  const counts = {};
  PEEPO_COLS.forEach(c => counts[c.k] = items.filter(i => mapping[i.id] && mapping[i.id][c.k]).length);
  const totalAssigned = items.filter(i => mapping[i.id] && Object.values(mapping[i.id]).some(Boolean)).length;
  const toggle = (id, k) => setMapping(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [k]: !((prev[id] || {})[k]) }}));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent-ink)", display: "grid", placeItems: "center", flex: "none", fontWeight: 600, letterSpacing: "0.04em" }}>PEEPO</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.005em" }}>Categorise evidence — People, Environment, Equipment, Procedures, Organisation</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>Tick every category an evidence item touches. Items often span multiple categories. {totalAssigned}/{items.length} items mapped.</div>
        </div>
        <button className="btn ghost" onClick={onGoToEvidence}><Icon name="arrow" size={12}/>Open Evidence</button>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 1.3fr) repeat(5, 1fr)", borderBottom: "1px solid var(--border)", background: "var(--bg-sunken)" }}>
          <div style={{ padding: "12px 16px", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Evidence item</div>
          {PEEPO_COLS.map(c => (
            <div key={c.k} style={{ padding: "10px 12px", borderLeft: "1px solid var(--border)", textAlign: "center" }} title={c.sub}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent-ink)", letterSpacing: "-0.01em" }}>{c.letter}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, marginTop: 1 }}>{c.title}</div>
              <div style={{ fontSize: 10, color: "var(--ink-3)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{counts[c.k]}</div>
            </div>
          ))}
        </div>
        {items.map((it, idx) => (
          <div key={it.id} style={{ display: "grid", gridTemplateColumns: "minmax(240px, 1.3fr) repeat(5, 1fr)", borderBottom: idx === items.length - 1 ? "none" : "1px solid var(--border)", alignItems: "center" }}>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{it.id}</span>
                <span className="chip" style={{ fontSize: 10, padding: "1px 6px" }}>{it.type}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.005em" }}>{it.title}</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{it.by} · <span className="mono">{it.when}</span></div>
            </div>
            {PEEPO_COLS.map(c => {
              const on = !!(mapping[it.id] && mapping[it.id][c.k]);
              return (
                <div key={c.k} style={{ padding: "12px", borderLeft: "1px solid var(--border)", display: "grid", placeItems: "center", height: "100%" }}>
                  <button
                    onClick={() => toggle(it.id, c.k)}
                    aria-pressed={on}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      border: `1px solid ${on ? "var(--accent)" : "var(--border)"}`,
                      background: on ? "var(--accent)" : "transparent",
                      color: on ? "white" : "var(--ink-3)",
                      cursor: "pointer", display: "grid", placeItems: "center", transition: "all 0.12s",
                    }}
                    title={`${c.title}: ${on ? "mapped" : "not mapped"}`}
                  >
                    {on ? <Icon name="check" size={14}/> : <span style={{ fontSize: 11 }}>–</span>}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: "14px 18px" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, marginBottom: 10 }}>PEEPO summary · evidence per category</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {PEEPO_COLS.map(c => {
            const ids = items.filter(i => mapping[i.id] && mapping[i.id][c.k]).map(i => i.id);
            return (
              <div key={c.k} style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{c.letter} · {c.title}</div>
                  <div style={{ fontSize: 11, color: ids.length === 0 ? "var(--sev-high)" : "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{ids.length}</div>
                </div>
                <div style={{ fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)", lineHeight: 1.5, minHeight: 30 }}>
                  {ids.length === 0 ? <span style={{ color: "var(--sev-high)" }}>no evidence — gap</span> : ids.join(", ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const PeepoQuestions = ({ questions, setQuestions, onGoToEvidence }) => {
  const [active, setActive] = React.useState("p");
  const [editing, setEditing] = React.useState(null); // question | "new" | null
  const total = questions.length;
  const answered = questions.filter(q => q.a && q.a.trim()).length;
  const byCol = (k) => questions.filter(q => q.col === k);
  const colMeta = (k) => {
    const list = byCol(k);
    const ans = list.filter(q => q.a && q.a.trim()).length;
    return { total: list.length, answered: ans };
  };
  const remove = (id) => setQuestions(prev => prev.filter(q => q.id !== id));
  const save = (draft) => {
    setQuestions(prev => {
      const exists = prev.find(q => q.id === draft.id);
      if (exists) return prev.map(q => q.id === draft.id ? draft : q);
      const colCount = prev.filter(q => q.col === draft.col).length;
      const prefix = { p: "P", e1: "E1", e2: "E2", p2: "P2", o: "O" }[draft.col];
      return [...prev, { ...draft, id: `${prefix}-Q${colCount + 1}` }];
    });
    setEditing(null);
  };
  const activeCol = PEEPO_COLS.find(c => c.k === active);
  const list = byCol(active);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {editing && <PeepoQuestionModal initial={editing === "new" ? { col: active } : editing} onSave={save} onClose={() => setEditing(null)} onDelete={editing !== "new" ? remove : null}/>}
      <div className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent-ink)", display: "grid", placeItems: "center", flex: "none", fontWeight: 600, letterSpacing: "0.04em" }}>PEEPO</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.005em" }}>Lines of inquiry — brainstorm questions, then answer with evidence</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>
            <strong style={{ color: "var(--ink-2)" }}>Pass 1</strong> — write the questions you need answered to understand the event. <strong style={{ color: "var(--ink-2)" }}>Pass 2</strong> — return and answer each one with data.
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: answered === total ? "oklch(0.5 0.13 155)" : "var(--ink-1)", fontFamily: "var(--font-mono)" }}>{answered}/{total}</div>
          <div style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Answered</div>
        </div>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderBottom: "1px solid var(--border)", background: "var(--bg-sunken)" }}>
          {PEEPO_COLS.map(c => {
            const m = colMeta(c.k);
            const pct = m.total === 0 ? 0 : Math.round((m.answered / m.total) * 100);
            const on = active === c.k;
            const dim = !on;
            return (
              <button key={c.k} onClick={() => setActive(c.k)}
                aria-pressed={on}
                style={{
                  padding: "12px 14px", borderLeft: c.k === "p" ? "none" : "1px solid var(--border)",
                  borderBottom: on ? "2px solid var(--accent)" : "2px solid transparent",
                  background: on ? "var(--bg-elev)" : "var(--bg-sunken)",
                  cursor: "pointer", textAlign: "left", font: "inherit",
                  color: dim ? "var(--ink-4)" : "inherit",
                  opacity: dim ? 0.45 : 1,
                  filter: dim ? "saturate(0.2)" : "none",
                  transition: "opacity 160ms ease, filter 160ms ease, background 160ms ease, color 160ms ease",
                  display: "flex", flexDirection: "column", gap: 4,
                }}
                onMouseEnter={(e) => { if (dim) { e.currentTarget.style.opacity = 0.75; e.currentTarget.style.filter = "saturate(0.6)"; } }}
                onMouseLeave={(e) => { if (dim) { e.currentTarget.style.opacity = 0.45; e.currentTarget.style.filter = "saturate(0.2)"; } }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: on ? "var(--accent-ink)" : "var(--ink-4)", letterSpacing: "-0.01em" }}>{c.letter}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.title}</div>
                  <div style={{ marginLeft: "auto", fontSize: 10.5, color: "var(--ink-4)", fontFamily: "var(--font-mono)" }}>{m.answered}/{m.total}</div>
                </div>
                <div style={{ height: 3, background: "var(--bg)", borderRadius: 2, overflow: "hidden", marginTop: 2 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: on ? (pct === 100 ? "oklch(0.55 0.13 155)" : "var(--accent)") : "var(--ink-4)", transition: "width 200ms" }}/>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ padding: "16px 18px 6px", display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.005em" }}>{activeCol.title} — lines of inquiry</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{activeCol.sub}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button className="btn ghost" onClick={onGoToEvidence}><Icon name="arrow" size={11}/>Evidence</button>
            <button className="btn" onClick={() => setEditing("new")}><Icon name="plus" size={12}/>Add question</button>
          </div>
        </div>
        <div style={{ padding: "8px 18px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
          {list.length === 0 && (
            <div style={{ padding: 18, border: "1px dashed var(--border)", borderRadius: 8, background: "var(--bg-sunken)", textAlign: "center", fontSize: 12, color: "var(--ink-3)" }}>
              No lines of inquiry yet for {activeCol.title}. <button onClick={() => setEditing("new")} style={{ font: "inherit", color: "var(--accent-ink)", background: "transparent", border: 0, cursor: "pointer", textDecoration: "underline", padding: 0 }}>Add the first one</button>.
            </div>
          )}
          {list.map((q, i) => {
            const answered = q.a && q.a.trim();
            return (
              <button key={q.id} onClick={() => setEditing(q)} className="icam-edit-card"
                style={{ textAlign: "left", padding: 14, border: "1px solid var(--border)", borderRadius: 8, background: answered ? "var(--bg-elev)" : "color-mix(in oklch, var(--sev-med) 4%, var(--bg))", cursor: "pointer", font: "inherit", color: "inherit", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{q.id}</span>
                  {answered
                    ? <span className="chip" style={{ fontSize: 10, padding: "1px 7px", color: "oklch(0.45 0.14 155)", borderColor: "color-mix(in oklch, oklch(0.55 0.12 155) 40%, transparent)", background: "color-mix(in oklch, oklch(0.55 0.12 155) 8%, transparent)" }}>✓ Answered</span>
                    : <span className="chip" style={{ fontSize: 10, padding: "1px 7px", color: "var(--sev-high-ink)", borderColor: "color-mix(in oklch, var(--sev-med) 40%, transparent)", background: "color-mix(in oklch, var(--sev-med) 8%, transparent)" }}>Pass 2 — needs answer</span>}
                  <span className="icam-edit-pencil" aria-hidden style={{ marginLeft: "auto", opacity: 0, transition: "opacity 120ms", color: "var(--ink-3)", display: "inline-flex" }}><Icon name="edit" size={11}/></span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.45, color: "var(--ink-1)" }}>Q. {q.q}</div>
                {answered && (
                  <div style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--ink-2)", padding: "10px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6 }}>
                    <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-3)", fontWeight: 600, marginRight: 6 }}>A.</span>
                    {q.a}
                  </div>
                )}
                {q.evidence && q.evidence.length > 0 && (
                  <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                    <Icon name="link" size={10} style={{ color: "var(--ink-4)" }}/>
                    <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-4)", fontWeight: 600, marginRight: 4 }}>Evidence</span>
                    {q.evidence.map(eid => <span key={eid} className="chip mono" style={{ fontSize: 10, padding: "1px 6px" }}>{eid}</span>)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const PeepoQuestionModal = ({ initial, onSave, onClose, onDelete }) => {
  const isNew = !initial.id;
  const [d, setD] = React.useState({ id: "", col: "p", q: "", a: "", evidence: [], ...initial });
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));
  const colName = PEEPO_COLS.find(c => c.k === d.col);
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(10,10,15,0.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 680, maxWidth: "100%", maxHeight: "92vh", background: "var(--bg-elev)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, marginBottom: 4 }}>{isNew ? "New line of inquiry" : `Edit ${d.id}`}</div>
            <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.012em" }}>{colName.letter} · {colName.title}</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "transparent", cursor: "pointer", display: "grid", placeItems: "center" }}><Icon name="close" size={14}/></button>
        </div>
        <div style={{ padding: "18px 22px", overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, display: "block", marginBottom: 6 }}>PEEPO category</label>
            <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--bg-sunken)", border: "1px solid var(--border)", borderRadius: 6, width: "fit-content" }}>
              {PEEPO_COLS.map(c => (
                <button key={c.k} onClick={() => set("col", c.k)} style={{
                  padding: "5px 10px", border: "1px solid " + (d.col === c.k ? "var(--border)" : "transparent"),
                  borderRadius: 4, background: d.col === c.k ? "var(--bg-elev)" : "transparent",
                  cursor: "pointer", font: "inherit", fontSize: 11.5, color: "var(--ink-2)",
                }}>{c.letter} · {c.title}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, display: "block", marginBottom: 6 }}>Pass 1 — Question</label>
            <textarea value={d.q} onChange={(e) => set("q", e.target.value)} rows={3}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13.5, fontFamily: "inherit", lineHeight: 1.5, color: "var(--ink-1)", background: "var(--bg)", resize: "vertical" }}
              placeholder="What do you need to find out? e.g. Was the correct torque tool used and within calibration?"/>
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>Frame as a clear question. Pass 1 is brainstorming — questions don't have to be answered yet.</div>
          </div>
          <div>
            <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, display: "block", marginBottom: 6 }}>Pass 2 — Answer (with data)</label>
            <textarea value={d.a} onChange={(e) => set("a", e.target.value)} rows={4}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, fontFamily: "inherit", lineHeight: 1.5, color: "var(--ink-1)", background: "var(--bg)", resize: "vertical" }}
              placeholder="Answer based on evidence. Leave blank during Pass 1 — return after evidence collection."/>
          </div>
          <div>
            <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, display: "block", marginBottom: 6 }}>Linked evidence IDs (comma separated)</label>
            <input value={(d.evidence || []).join(", ")} onChange={(e) => set("evidence", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
              placeholder="e.g. WI-01, DOC-04, SEN-01"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--ink-1)", background: "var(--bg)" }}/>
          </div>
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", gap: 8 }}>
          {!isNew && onDelete
            ? <button className="btn ghost" onClick={() => { onDelete(d.id); onClose(); }} style={{ color: "var(--sev-high)" }}><Icon name="close" size={12}/>Delete</button>
            : <span/>}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={() => onSave(d)} disabled={!d.q.trim()}>{isNew ? "Add question" : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const IcamTab = ({ onGoToEvidence }) => {
  const [step, setStep] = React.useState("peepo"); // peepo | factors
  const [questions, setQuestions] = React.useState(PEEPO_QUESTIONS_INIT);
  const [factors, setFactors] = React.useState(ICAM_FACTORS);
  const [editing, setEditing] = React.useState(null); // {factor, kind} | null
  const cols = [
    { k: "defence", kicker: "AFD", title: "Absent / Failed Defences", sub: "Barriers that should have prevented or mitigated the event." },
    { k: "action", kicker: "IA", title: "Individual / Team Actions", sub: "Errors or violations made by people at the sharp end." },
    { k: "condition", kicker: "TC", title: "Task / Environment Conditions", sub: "Local conditions that shaped performance." },
    { k: "org", kicker: "OF", title: "Organisational Factors", sub: "Latent conditions — management decisions & systems." },
  ];
  const prefixFor = { defence: "AFD", action: "IA", condition: "TC", org: "OF" };
  const handleSave = (draft) => {
    setFactors(prev => {
      const exists = prev.find(f => f.id === draft.id);
      if (exists) return prev.map(f => f.id === draft.id ? draft : f);
      // new
      const prefix = prefixFor[draft.kind];
      const nextN = prev.filter(f => f.id.startsWith(prefix)).length + 1;
      const id = `${prefix}-${String(nextN).padStart(2, "0")}`;
      return [...prev, { ...draft, id }];
    });
    setEditing(null);
  };
  const handleDelete = (id) => {
    setFactors(prev => prev.filter(f => f.id !== id));
    setEditing(null);
  };
  const [showAI, setShowAI] = React.useState(false);
  const [warn, setWarn] = React.useState(null);
  const tryAI = () => {
    const c = evidenceSufficiency("icam", EVIDENCE);
    if (!c.ok) { setWarn(c); return; }
    setShowAI(true);
  };
  const rootCount = factors.filter(f => f.root).length;
  return (
    <div className="inv-body view-enter">
      <div style={{ display: "flex", gap: 6, marginBottom: 16, padding: 4, background: "var(--bg-sunken)", border: "1px solid var(--border)", borderRadius: 8, alignSelf: "flex-start", width: "fit-content" }}>
        {[
          { k: "peepo", l: "1. PEEPO chart", n: `${questions.filter(q => q.a && q.a.trim()).length}/${questions.length}`, warn: questions.some(q => !q.a || !q.a.trim()) },
          { k: "factors", l: "2. Contributing factors", n: factors.length },
        ].map(s => {
          const on = step === s.k;
          return (
            <button key={s.k} onClick={() => setStep(s.k)} style={{
              padding: "7px 14px", border: "1px solid " + (on ? "var(--border)" : "transparent"),
              borderRadius: 6, background: on ? "var(--bg-elev)" : "transparent", cursor: "pointer",
              font: "inherit", fontSize: 12, fontWeight: 500, color: on ? "var(--ink-1)" : "var(--ink-2)",
              display: "inline-flex", alignItems: "center", gap: 7,
            }}>
              {s.l}
              <span style={{ fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{s.n}</span>
              {s.warn && <span title="PEEPO gaps detected" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--sev-high)" }}/>}
            </button>
          );
        })}
      </div>
      {step === "peepo" && (
        <PeepoQuestions questions={questions} setQuestions={setQuestions} onGoToEvidence={onGoToEvidence}/>
      )}
      {step === "factors" && (
        <React.Fragment>
      {editing && (
        <IcamFactorModal
          initial={editing.factor}
          kind={editing.kind || (editing.factor && editing.factor.kind)}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditing(null)}
        />
      )}
      {warn && <InsufficientEvidenceModal check={warn} onClose={() => setWarn(null)} onGoToEvidence={() => { setWarn(null); onGoToEvidence && onGoToEvidence(); }}/>}
      {showAI && (
        <AIProposalsModal
          context="ICAM contributing factors"
          summary="Map evidence across Absent/Failed Defences, Individual Actions, Task Conditions and Organisational Factors."
          evidenceItems={EVIDENCE}
          proposals={ICAM_AI_PROPOSALS}
          onClose={() => setShowAI(false)}
          onApply={(items) => {
            const prefixFor = { defence: "AFD", action: "IA", condition: "TC", org: "OF" };
            setFactors(prev => {
              const next = [...prev];
              for (const it of items) {
                const prefix = prefixFor[it.kind] || "OF";
                const n = next.filter(f => f.id.startsWith(prefix)).length + 1;
                const id = `${prefix}-${String(n).padStart(2, "0")}`;
                next.push({ id, title: it.title.replace(/^[A-Z]+-\d+ · /, ""), kind: it.kind, rating: "contributor", root: false, notes: it.detail });
              }
              return next;
            });
            setShowAI(false);
          }}
          applyLabel="Add factors"
        />
      )}
      <div style={{ display: "flex", marginBottom: 18, alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>ICAM contributing factors</h3>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
            Incident Cause Analysis Method · {factors.length} factors · {rootCount} classified as root cause{rootCount !== 1 ? "s" : ""}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button className="btn primary" onClick={tryAI} style={{ background: "var(--accent)", borderColor: "var(--accent)", color: "white" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>
            Generate factors
          </button>
          <button className="btn ghost"><Icon name="shield" size={13}/>Barrier view</button>
          <button className="btn" onClick={() => setEditing({ factor: null, kind: "defence" })}><Icon name="plus" size={13}/>Add factor</button>
        </div>
      </div>
      <div className="icam">
        {cols.map(c => {
          const items = factors.filter(f => f.kind === c.k);
          return (
            <div key={c.k} className="icam-col" data-kind={c.k}>
              <div className="icam-col-head">
                <div className="icam-col-kicker">{c.kicker} · {items.length} factor{items.length !== 1 ? "s" : ""}</div>
                <div className="icam-col-title">{c.title}</div>
                <div className="icam-col-sub">{c.sub}</div>
              </div>
              <div className="icam-col-body">
                {items.map(f => (
                  <div
                    key={f.id}
                    className="fact-card icam-edit-card"
                    data-kind={f.kind}
                    onClick={() => setEditing({ factor: f })}
                    style={f.root ? { boxShadow: "0 0 0 2px var(--accent-soft)", borderColor: "var(--accent)", cursor: "pointer" } : { cursor: "pointer" }}>
                    <div className="fact-card-head">
                      <span className="fact-card-id">{f.id}</span>
                      {f.root && <span className="chip" style={{ fontSize: 10, padding: "1px 6px", background: "var(--accent-soft)", color: "var(--accent-ink)", borderColor: "transparent" }}>Root</span>}
                      <span className="icam-edit-pencil" aria-hidden style={{ marginLeft: "auto", opacity: 0, transition: "opacity 120ms", color: "var(--ink-3)", display: "inline-flex" }}><Icon name="edit" size={11}/></span>
                    </div>
                    <div className="fact-card-title">{f.title}</div>
                    <div className="fact-card-foot">
                      <span className="chip" style={{ textTransform: "capitalize", fontSize: 10 }}>{f.rating}</span>
                    </div>
                  </div>
                ))}
                <button className="btn ghost" onClick={() => setEditing({ factor: null, kind: c.k })} style={{ justifyContent: "center", fontSize: 11.5, color: "var(--ink-3)" }}>
                  <Icon name="plus" size={11}/>Add {c.kicker}
                </button>
              </div>
            </div>
          );
        })}
      </div>
        </React.Fragment>
      )}
    </div>
  );
};
export const EvidenceTab = () => {  const typeIcon = { Photo: "photo", Document: "doc", Witness: "mic", Sensor: "sensor" };
  const [evFilter, setEvFilter] = React.useState("all");
  const [items, setItems] = React.useState(EVIDENCE);
  const [showAdd, setShowAdd] = React.useState(false);
  const [showGaps, setShowGaps] = React.useState(false);
  const evFilters = [
    ["all", "All"], ["Photo", "Photos"], ["Document", "Documents"],
    ["Witness", "Written statements"], ["Sensor", "Sensor"],
  ];
  const filtered = items.filter(e => evFilter === "all" || e.type === evFilter);
  const addItem = (item) => {
    const prefixMap = { Photo: "PH", Document: "DC", Witness: "WI", Sensor: "SE" };
    const prefix = prefixMap[item.type];
    const nextN = items.filter(i => i.id.startsWith(prefix)).length + 1;
    const id = `${prefix}-${String(nextN).padStart(2, "0")}`;
    const now = new Date();
    const when = `${now.toLocaleString("en", { month: "short" })} ${now.getDate()} · ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    setItems(prev => [{ id, ...item, when }, ...prev]);
    setShowAdd(false);
  };
  return (
    <div className="inv-body view-enter">
      <div style={{ display: "flex", marginBottom: 18, alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Evidence & written statements</h3>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
            {filtered.length} of {EVIDENCE.length} items · chain of custody maintained · <span className="mono">last updated Apr 17 · 14:22</span>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <div className="seg">
            {evFilters.map(([k, l]) => (
              <button key={k} className={evFilter === k ? "active" : ""} onClick={() => setEvFilter(k)}>{l}</button>
            ))}
          </div>
          <button className="btn ghost" onClick={() => setShowGaps(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="4"/></svg>
            Check for gaps
          </button>
          <button className="btn" onClick={() => setShowAdd(true)}><Icon name="plus" size={13}/>Add evidence</button>
        </div>
      </div>
      <div className="ev-grid">
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: 32, textAlign: "center", color: "var(--ink-3)", border: "1px dashed var(--border)", borderRadius: 10 }}>
            No items in this category.
          </div>
        )}
        {filtered.map(e => (
          <div key={e.id} className="ev-card">
            <div className="ev-thumb">
              <Icon name={typeIcon[e.type]} size={26}/>
              <span style={{ marginLeft: 8 }}>{e.type.toUpperCase()}</span>
            </div>
            <div className="ev-body">
              <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>{e.id}</div>
              <div className="ev-title">{e.title}</div>
              <div className="ev-meta">
                <span>{e.by}</span><span>·</span><span>{e.when}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAdd && <AddEvidenceModal onClose={() => setShowAdd(false)} onAdd={addItem}/>}
      {showGaps && <EvidenceGapsModal onClose={() => setShowGaps(false)} items={items}/>}
    </div>
  );
};

export const EvidenceGapsModal = ({ onClose, items }) => {
  const [stage, setStage] = React.useState("analyzing");
  const [findings, setFindings] = React.useState([]);
  React.useEffect(() => {
    const t = setTimeout(() => {
      const has = (type) => items.some(i => i.type === type);
      const out = [];
      // Cross-reference timeline ↔ evidence
      out.push({
        sev: "high",
        title: "No DCS sensor trace covering 03:39–03:47",
        rationale: "Timeline lists CG-B-114 baseline drift at 03:39 and Tier-1 alarm at 03:47, but only one sensor export (SE-01) is attached for that window. Suggest pulling raw 1-second trend data for CG-B-114, PT-3201A, and ESD-2 valve position.",
        suggested: "Request DCS historian export · 03:30 → 03:55 · 1s resolution",
        cite: "Timeline 12 Apr 03:39, 03:47",
      });
      out.push({
        sev: "high",
        title: "Witness statement missing from outside operator",
        rationale: "POB roster shows P. Whelan was on the C-Deck walkround during the release. Only J. Park (panel) and T. Harlow (supervisor) statements are recorded. Whelan's vantage point likely captured first visible signs of weep.",
        suggested: "Schedule recorded interview · P. Whelan · within 48h",
        cite: "Crosscheck: WI-01, WI-02 vs. POB",
      });
      out.push({
        sev: "medium",
        title: "Photo coverage of flange area is single-angle",
        rationale: "PH-02 documents stud tensioning marks but only from the north side. Inspection-grade photography typically requires 4-quadrant coverage of the suspect joint plus a reference scale.",
        suggested: "Re-photograph V-3201 inlet flange · 4 quadrants + scale ruler",
        cite: "PH-02",
      });
      if (!has("Document") || items.filter(i => i.type === "Document").length < 2) {
        out.push({
          sev: "medium",
          title: "Maintenance work pack referenced but not attached",
          rationale: "Timeline references work order WO-84221 (gasket replacement, 11 Apr 21:30). Pack is mentioned in DC-01 but the actual signed work pack, MOC documents, and post-job test records are not in evidence.",
          suggested: "Attach WO-84221 work pack, signed permit, and torque sheets",
          cite: "DC-01, Timeline 11 Apr 21:30",
        });
      }
      out.push({
        sev: "low",
        title: "No environmental / dispersion modelling evidence",
        rationale: "For a hydrocarbon release on C-Deck, the typical record includes wind/weather log at time of event and a CFD or hand-calc dispersion estimate. Neither is present.",
        suggested: "Attach met-station extract and dispersion estimate",
        cite: "Severity tier — high",
      });
      out.push({
        sev: "low",
        title: "Chain-of-custody signature missing on 1 item",
        rationale: "SE-02 (ESD-2 valve trace) was added without a custody-handoff signature. While the system records the uploader, formal sign-off is required for evidence to be admissible to the regulator.",
        suggested: "Counter-sign SE-02 chain of custody",
        cite: "SE-02",
      });
      setFindings(out);
      setStage("results");
    }, 1600);
    return () => clearTimeout(t);
  }, [items]);

  const sevColor = (s) => s === "high" ? "var(--sev-high)" : s === "medium" ? "var(--sev-medium)" : "oklch(0.55 0.10 220)";
  const sevBg = (s) => s === "high" ? "color-mix(in oklch, var(--sev-high) 10%, transparent)" : s === "medium" ? "color-mix(in oklch, var(--sev-medium) 10%, transparent)" : "var(--bg-sunken)";
  const counts = findings.reduce((a,f) => ({...a, [f.sev]: (a[f.sev]||0)+1}), {});

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,15,0.5)", zIndex: 300,
      display: "grid", placeItems: "center", backdropFilter: "blur(3px)",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 640, maxHeight: "85vh", overflow: "auto",
        background: "var(--bg-elev)", border: "1px solid var(--border)",
        borderRadius: 12, boxShadow: "var(--shadow-lg)", padding: 22,
      }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14, gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent-ink)", display: "grid", placeItems: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="4"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Evidence gap analysis</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>AI-assisted · cross-references timeline, witnesses, sensors, and regulatory checklist</div>
          </div>
          <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-4)" }}>{INV.id}</div>
        </div>

        {stage === "analyzing" && (
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 18px", background: "var(--bg-sunken)", borderRadius: 10 }}>
              <div style={{ width: 14, height: 14, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}/>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Analyzing evidence completeness…</div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 14, fontFamily: "var(--font-mono)" }}>
              Cross-referencing {items.length} items against timeline · regulatory checklist · POB roster…
            </div>
          </div>
        )}

        {stage === "results" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {["high","medium","low"].map(s => (
                <div key={s} style={{
                  flex: 1, padding: "10px 12px", borderRadius: 8,
                  background: sevBg(s), border: `1px solid ${sevColor(s)}33`,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 600, color: sevColor(s), letterSpacing: "-0.02em" }}>{counts[s] || 0}</div>
                  <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>{s} priority</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, marginBottom: 8 }}>
              Identified gaps · {findings.length}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {findings.map((f, i) => (
                <div key={i} style={{
                  padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 8,
                  borderLeft: `3px solid ${sevColor(f.sev)}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: sevColor(f.sev), padding: "2px 7px", background: sevBg(f.sev), borderRadius: 3 }}>{f.sev}</span>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{f.title}</div>
                    <span style={{ marginLeft: "auto", fontSize: 10.5, color: "var(--ink-4)", fontFamily: "var(--font-mono)" }}>{f.cite}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 6 }}>{f.rationale}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "var(--bg-sunken)", borderRadius: 5, fontSize: 11.5 }}>
                    <Icon name="arrow" size={11}/>
                    <span style={{ color: "var(--ink-2)", flex: 1 }}><strong>Suggested action:</strong> {f.suggested}</span>
                    <button className="btn ghost" style={{ fontSize: 10.5, padding: "2px 8px" }}>Add to actions</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "10px 12px", background: "var(--accent-soft)", border: "1px solid color-mix(in oklch, var(--accent) 25%, transparent)", borderRadius: 8, fontSize: 11.5, color: "var(--accent-ink)", marginBottom: 14, lineHeight: 1.5 }}>
              <strong>Note:</strong> Gap analysis is advisory — a finding being absent does not certify completeness. The investigation lead remains accountable for evidence sufficiency under the regulatory standard in force.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn ghost" onClick={onClose}>Close</button>
              <button className="btn primary"><Icon name="download" size={13}/>Export gap report</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const AddEvidenceModal = ({ onClose, onAdd }) => {
  const [type, setType] = React.useState("Photo");
  const [title, setTitle] = React.useState("");
  const [by, setBy] = React.useState("");
  const [tag, setTag] = React.useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !by.trim()) return;
    onAdd({ type, title: title.trim(), by: by.trim(), tag: tag.trim() || "general" });
  };
  const types = ["Photo", "Document", "Witness", "Sensor"];
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,15,0.45)", zIndex: 300,
      display: "grid", placeItems: "center", backdropFilter: "blur(2px)",
    }}>
      <form onClick={e => e.stopPropagation()} onSubmit={submit} style={{
        width: 460, background: "var(--bg-elev)", border: "1px solid var(--border)",
        borderRadius: 12, boxShadow: "var(--shadow-lg)", padding: 22,
      }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Add evidence</div>
          <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-4)" }}>{INV.id}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, marginBottom: 6 }}>Type</div>
            <div className="seg" style={{ width: "100%" }}>
              {types.map(t => (
                <button key={t} type="button" className={type === t ? "active" : ""}
                  onClick={() => setType(t)} style={{ flex: 1 }}>{t}</button>
              ))}
            </div>
          </div>
          <Field label="Title" v={title} set={setTitle} placeholder={type === "Witness" ? "Statement — name & role" : "Short description"} />
          <Field label="Source / collected by" v={by} set={setBy} placeholder="Name or system"/>
          <Field label="Tag" v={tag} set={setTag} placeholder="e.g. flange, witness, gas-detection"/>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary"><Icon name="check" size={13}/>Add to evidence</button>
        </div>
      </form>
    </div>
  );
};

export const Field = ({ label, v, set, placeholder }) => (
  <label style={{ display: "block" }}>
    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, marginBottom: 6 }}>{label}</div>
    <input value={v} onChange={e => set(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", padding: "8px 10px", borderRadius: 7,
        border: "1px solid var(--border)", background: "var(--bg)",
        color: "var(--ink)", fontSize: 13, outline: "none",
      }}
      onFocus={e => e.target.style.borderColor = "var(--accent)"}
      onBlur={e => e.target.style.borderColor = "var(--border)"}
    />
  </label>
);

// --- Actions tab
export const HOC_LEVELS = [
  { k: "elimination", l: "Elimination", n: 1, color: "oklch(0.50 0.13 155)", desc: "Physically remove the hazard." },
  { k: "substitution", l: "Substitution", n: 2, color: "oklch(0.55 0.13 175)", desc: "Replace the hazard with something safer." },
  { k: "engineering", l: "Engineering", n: 3, color: "oklch(0.58 0.13 220)", desc: "Isolate people from the hazard." },
  { k: "admin", l: "Administrative", n: 4, color: "oklch(0.62 0.13 70)", desc: "Change the way people work — procedure, training, scheduling." },
  { k: "ppe", l: "PPE", n: 5, color: "oklch(0.55 0.16 30)", desc: "Protect the worker with personal protective equipment." },
];

export const HOC_PROPOSALS = [
  // Most-effective first
  { hoc: "elimination", title: "Decommission redundant tie-in flange on V-3201 — replace with welded spool", linkedFactor: "AFD-01", priority: "high", owner: "PN", ownerName: "P. Nair · Process eng.", due: "Q3 (capex)", rationale: "Eliminates the bolted-joint failure mode that drove this release entirely." },
  { hoc: "substitution", title: "Replace torque-only stud tensioning with hydraulic stretch tooling on hydrocarbon flanges ≥6\"", linkedFactor: "IA-01", priority: "high", owner: "JP", ownerName: "J. Park · Maintenance", due: "Aug 30", rationale: "Hydraulic tensioning removes the single-pass / multi-pass procedural variable that produced the uneven preload." },
  { hoc: "engineering", title: "Add automated work-order block when assigned technician's competency is expired", linkedFactor: "OF-01", priority: "high", owner: "HW", ownerName: "H. Wren · Maintenance Systems", due: "Jun 20", rationale: "System-enforced barrier against reoccurrence — removes reliance on scheduler vigilance." },
  { hoc: "engineering", title: "DCS interlock — pre-startup leak test must hold ≥30 min at op-pressure before train can be unblocked", linkedFactor: "AFD-01", priority: "high", owner: "PN", ownerName: "P. Nair · Process eng.", due: "Jul 15", rationale: "Hard interlock makes the shortened static hold technically impossible." },
  { hoc: "engineering", title: "Update work pack WO-84221 — flange-specific torque-pattern diagram, generated from CAD", linkedFactor: "TC-03", priority: "medium", owner: "JP", ownerName: "J. Park · Maintenance", due: "May 10", rationale: "Removes the procedure/asset mismatch that contributed to the wrong stud count being applied." },
  { hoc: "admin", title: "Add explicit schedule-pressure clause to PTW Standard 4.2 — restart windows require independent risk review", linkedFactor: "OF-02", priority: "high", owner: "ES", ownerName: "E. Sato · HSE", due: "May 12", rationale: "Procedural barrier — ranks below engineering controls but addresses the latent organisational driver." },
  { hoc: "admin", title: "Mandate independent witness verification on hydrocarbon-flange torque steps", linkedFactor: "IA-02", priority: "high", owner: "MR", ownerName: "M. Ruiz · HSE", due: "May 20", rationale: "Procedural double-check pending engineering controls (hydraulic tensioning) coming online." },
  { hoc: "admin", title: "Controlled-bolting refresher — all mech techs · 4-hr classroom + practical", linkedFactor: "OF-03", priority: "medium", owner: "LD", ownerName: "L. Díaz · L&D", due: "Jun 15", rationale: "Training refresh aligned with refreshed procedure and tooling." },
  { hoc: "admin", title: "Fatigue-risk review for any 4th-consecutive-night assignment", linkedFactor: "TC-02", priority: "medium", owner: "DC", ownerName: "D. Cho · Operations", due: "Jun 30", rationale: "Administrative shift-planning rule to address the contributing fatigue condition." },
  { hoc: "ppe", title: "Issue intrinsically-safe personal gas monitors to all bolting crews", linkedFactor: "AFD-03", priority: "low", owner: "ES", ownerName: "E. Sato · HSE", due: "Jul 30", rationale: "Last line of defence — does not prevent release, but improves early personal warning. Lowest in the hierarchy." },
];

export const HocGenerateModal = ({ existing, onApply, onClose }) => {
  const [selected, setSelected] = React.useState(() => new Set(HOC_PROPOSALS.map((_, i) => i)));
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const toggle = (i) => setSelected(prev => {
    const n = new Set(prev);
    n.has(i) ? n.delete(i) : n.add(i);
    return n;
  });
  const apply = () => {
    const additions = HOC_PROPOSALS.filter((_, i) => selected.has(i));
    onApply(additions);
  };
  const byHoc = {};
  HOC_PROPOSALS.forEach((p, i) => {
    byHoc[p.hoc] = byHoc[p.hoc] || [];
    byHoc[p.hoc].push({ p, i });
  });
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,15,0.5)", zIndex: 300,
      display: "grid", placeItems: "center", backdropFilter: "blur(3px)", animation: "fadeIn 0.18s ease-out",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 820, maxWidth: "94vw", maxHeight: "92vh", background: "var(--bg-elev)",
        border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 24px 60px rgba(10,10,15,0.3)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent-ink)", display: "grid", placeItems: "center", flex: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 4 }}>AI-generated · facilitator review required</div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Generate corrective actions</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 3 }}>Proposals derived from ICAM cascade · ranked by Hierarchy of Control (most effective first)</div>
          </div>
          <button type="button" onClick={onClose} style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--ink-2)" }}>
            <Icon name="x" size={14}/>
          </button>
        </div>

        <div style={{ padding: "10px 22px", borderBottom: "1px solid var(--border)", background: "var(--bg-sunken)", display: "flex", alignItems: "center", gap: 10, fontSize: 11.5, color: "var(--ink-2)" }}>
          <Icon name="shield" size={13}/>
          <span><strong>Hierarchy of Control</strong> — proposals favour engineering and elimination over administrative / PPE. Lower-ranked items only fill gaps the higher levels cannot close.</span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
          {HOC_LEVELS.map(level => {
            const items = byHoc[level.k] || [];
            if (items.length === 0) return null;
            return (
              <div key={level.k} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: `color-mix(in oklch, ${level.color} 18%, transparent)`, color: level.color, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }}>{level.n}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "-0.005em" }}>{level.l}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", flex: 1 }}>{level.desc}</div>
                  <span style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{items.length} proposal{items.length !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {items.map(({ p, i }) => (
                    <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, background: selected.has(i) ? "var(--bg)" : "var(--bg-sunken)", cursor: "pointer", borderLeft: `3px solid ${level.color}` }}>
                      <input type="checkbox" checked={selected.has(i)} onChange={() => toggle(i)} style={{ accentColor: "var(--accent)", marginTop: 2, flex: "none" }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.005em", lineHeight: 1.4, marginBottom: 4 }}>{p.title}</div>
                        <div style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.45, marginBottom: 6 }}>{p.rationale}</div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 10.5, color: "var(--ink-3)" }}>
                          <span><Icon name="link" size={10}/> {p.linkedFactor}</span>
                          <span>· Owner: <strong style={{ color: "var(--ink-2)" }}>{p.ownerName}</strong></span>
                          <span>· Due: <strong style={{ color: "var(--ink-2)" }}>{p.due}</strong></span>
                          <span>· Priority: <strong style={{ color: "var(--ink-2)", textTransform: "capitalize" }}>{p.priority}</strong></span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "12px 22px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, background: "var(--bg-sunken)" }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-3)", fontStyle: "italic" }}>Each proposal is editable after it lands in the backlog. Lead investigator remains accountable.</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose} className="btn ghost">Cancel</button>
            <button type="button" onClick={apply} className="btn primary" disabled={selected.size === 0} style={{ opacity: selected.size === 0 ? 0.5 : 1 }}>
              <Icon name="plus" size={13}/>Add {selected.size} action{selected.size !== 1 ? "s" : ""} to backlog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ActionEditModal = ({ initial, onSave, onDelete, onClose }) => {
  const [draft, setDraft] = React.useState(initial || {
    id: "", title: "", owner: "MR", ownerName: "M. Ruiz · HSE", due: "", priority: "medium", col: "open", notes: "", linkedFactor: "",
  });
  const isNew = !initial;
  const owners = [
    ["MR", "M. Ruiz · HSE"],
    ["ES", "E. Sato · HSE"],
    ["DC", "D. Cho · Operations"],
    ["JP", "J. Park · Maintenance"],
    ["PN", "P. Nair · Process eng."],
    ["HW", "H. Wren · Maintenance Systems"],
    ["LD", "L. Díaz · L&D"],
    ["KA", "K. Adebayo · Asset GM"],
  ];
  const cols = [["open", "Open"], ["progress", "In progress"], ["review", "In review"], ["done", "Complete"]];
  const priorities = ["high", "medium", "low"];
  const prioColor = { high: "var(--sev-critical)", medium: "var(--sev-medium)", low: "var(--status-closed)" };
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const submit = (e) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.due.trim()) return;
    const owner = owners.find(o => o[0] === draft.owner);
    onSave({ ...draft, ownerName: owner ? owner[1] : draft.ownerName });
  };
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,15,0.45)", zIndex: 300,
      display: "grid", placeItems: "center", backdropFilter: "blur(2px)", animation: "fadeIn 0.18s ease-out",
    }}>
      <form onClick={e => e.stopPropagation()} onSubmit={submit} style={{
        width: 580, maxWidth: "92vw", maxHeight: "90vh", background: "var(--bg-elev)",
        border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 24px 60px rgba(10,10,15,0.25)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 4, alignSelf: "stretch", background: prioColor[draft.priority], borderRadius: 2 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 4 }}>{isNew ? "New" : "Edit"} corrective action</div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{isNew ? "Add to backlog" : draft.id}</div>
          </div>
          <button type="button" onClick={onClose} style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--ink-2)" }}>
            <Icon name="x" size={14}/>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Action title</span>
            <textarea
              value={draft.title}
              onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
              autoFocus
              rows={2}
              style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit", resize: "vertical", lineHeight: 1.45 }}
              placeholder="e.g. Integrate competency register with SAP work-order scheduler"
            />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Owner</span>
              <select
                value={draft.owner}
                onChange={e => setDraft(d => ({ ...d, owner: e.target.value }))}
                style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit" }}>
                {owners.map(([i, n]) => <option key={i} value={i}>{n}</option>)}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Due date</span>
              <input
                type="text"
                value={draft.due}
                onChange={e => setDraft(d => ({ ...d, due: e.target.value }))}
                placeholder="e.g. May 30"
                style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit" }}
              />
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Priority</span>
              <div className="seg" style={{ width: "100%" }}>
                {priorities.map(p => (
                  <button key={p} type="button" className={draft.priority === p ? "active" : ""}
                    onClick={() => setDraft(d => ({ ...d, priority: p }))} style={{ flex: 1, textTransform: "capitalize" }}>{p}</button>
                ))}
              </div>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Status</span>
              <select
                value={draft.col}
                onChange={e => setDraft(d => ({ ...d, col: e.target.value }))}
                style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit" }}>
                {cols.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
          </div>
          <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Linked factor <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--ink-3)" }}>· optional</span></span>
            <input
              type="text"
              value={draft.linkedFactor || ""}
              onChange={e => setDraft(d => ({ ...d, linkedFactor: e.target.value }))}
              placeholder="e.g. OF-01, AFD-02"
              style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600 }}>Notes <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--ink-3)" }}>· optional</span></span>
            <textarea
              value={draft.notes || ""}
              onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
              rows={3}
              style={{ padding: "9px 11px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--bg)", color: "var(--ink)", fontFamily: "inherit", resize: "vertical", lineHeight: 1.5 }}
              placeholder="Scope, dependencies, success measure…"
            />
          </label>
        </div>
        <div style={{ padding: "12px 22px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          {!isNew && (
            <button type="button" onClick={() => onDelete(draft.id)} className="btn ghost" style={{ color: "var(--sev-high)" }}>
              <Icon name="x" size={13}/>Delete
            </button>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose} className="btn ghost">Cancel</button>
            <button type="submit" className="btn primary">{isNew ? "Add action" : "Save changes"}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const ActionsTab = () => {
  const [actions, setActions] = React.useState(ACTIONS);
  const [editing, setEditing] = React.useState(null);
  const [showGenerate, setShowGenerate] = React.useState(false);
  const cols = [
    { k: "open", l: "Open" },
    { k: "progress", l: "In progress" },
    { k: "review", l: "In review" },
    { k: "done", l: "Complete" },
  ];
  const prioDot = { high: "var(--sev-critical)", medium: "var(--sev-medium)", low: "var(--status-closed)" };
  const handleSave = (draft) => {
    setActions(prev => {
      const exists = prev.find(a => a.id === draft.id);
      if (exists) return prev.map(a => a.id === draft.id ? draft : a);
      const nextN = prev.length + 1;
      return [...prev, { ...draft, id: `CA-${String(nextN).padStart(2, "0")}` }];
    });
    setEditing(null);
  };
  const handleDelete = (id) => {
    setActions(prev => prev.filter(a => a.id !== id));
    setEditing(null);
  };
  const handleGenerate = (additions) => {
    setActions(prev => {
      const baseN = prev.length;
      const next = additions.map((a, i) => ({
        ...a,
        id: `CA-${String(baseN + i + 1).padStart(2, "0")}`,
        col: "open",
      }));
      return [...prev, ...next];
    });
    setShowGenerate(false);
  };
  return (
    <div className="inv-body view-enter">
      {editing && (
        <ActionEditModal
          initial={editing.action}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditing(null)}
        />
      )}
      {showGenerate && (
        <HocGenerateModal existing={actions} onApply={handleGenerate} onClose={() => setShowGenerate(false)}/>
      )}
      <div style={{ display: "flex", marginBottom: 18, alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Corrective actions</h3>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
            Derived from root & contributing factors · owned · time-bound · {actions.length} total
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button className="btn primary" onClick={() => setShowGenerate(true)} style={{ background: "var(--accent)", borderColor: "var(--accent)", color: "white" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>
            Generate actions
          </button>
          <button className="btn ghost"><Icon name="filter" size={13}/>Filter</button>
          <button className="btn" onClick={() => setEditing({ action: null })}><Icon name="plus" size={13}/>New action</button>
        </div>
      </div>
      <div className="act-board">
        {cols.map(c => {
          const items = actions.filter(a => a.col === c.k);
          return (
            <div key={c.k} className="act-col">
              <div className="act-col-head">
                {c.l}<span className="act-col-count">{items.length}</span>
              </div>
              {items.map(a => (
                <div
                  key={a.id}
                  className="act-card act-card-edit"
                  onClick={() => setEditing({ action: a })}
                  style={{ cursor: "pointer" }}>
                  <div className="act-card-id" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ flex: 1 }}>{a.id}</span>
                    <span className="act-card-pencil" aria-hidden style={{ opacity: 0, transition: "opacity 120ms", color: "var(--ink-3)", display: "inline-flex" }}><Icon name="edit" size={11}/></span>
                  </div>
                  <div className="act-card-title">{a.title}</div>
                  <div className="act-card-meta">
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: prioDot[a.priority] }}/>
                    <span style={{ textTransform: "capitalize" }}>{a.priority}</span>
                    <span style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
                      <Avatar initials={a.owner} size={18}/>
                      <span>{a.due}</span>
                    </span>
                  </div>
                </div>
              ))}
              <button
                className="btn ghost"
                onClick={() => setEditing({ action: { id: "", title: "", owner: "MR", ownerName: "M. Ruiz · HSE", due: "", priority: "medium", col: c.k, notes: "", linkedFactor: "" } })}
                style={{ justifyContent: "center", fontSize: 11.5, color: "var(--ink-3)" }}>
                <Icon name="plus" size={11}/>Add to {c.l.toLowerCase()}
              </button>
              {items.length === 0 && (
                <div style={{ fontSize: 11, color: "var(--ink-4)", padding: 4, textAlign: "center" }}>None yet</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Report tab
export const ReportTab = () => {
  const statusColor = { signed: "oklch(0.55 0.12 155)", review: "var(--status-progress)", pending: "var(--ink-4)" };
  const statusLabel = { signed: "Signed", review: "Reviewing", pending: "Pending" };
  return (
    <div className="inv-body view-enter">
      <div style={{ display: "flex", marginBottom: 18, alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Investigation report</h3>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
            Draft · last edited 2h ago · 3 of 5 sign-offs required before distribution
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button className="btn ghost"><Icon name="download" size={13}/>PDF</button>
          <button className="btn primary"><Icon name="check" size={13}/>Submit for sign-off</button>
        </div>
      </div>
      <div className="report-grid">
        <div className="report-doc">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>CONFIDENTIAL · NORTHGATE ENERGY</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{INV.id}</div>
          </div>
          <h1>{INV.title}</h1>
          <div style={{ color: "var(--ink-3)", fontSize: 12.5 }}>Incident investigation report · ICAM methodology · draft v3</div>

          <h2>1. Event details</h2>
          <dl className="dl">
            <dt>Date / time</dt><dd>12 April 2026 · 03:47 local (UTC−5)</dd>
            <dt>Asset</dt><dd>Northgate Alpha — Production Train B</dd>
            <dt>Location</dt><dd>C-Deck · Separator V-3201 inlet flange</dd>
            <dt>Classification</dt><dd>Process safety — Tier 1 PSE (API RP 754)</dd>
            <dt>Injuries</dt><dd>None</dd>
            <dt>Release</dt><dd>~13.8 kg hydrocarbon gas over 6 minutes</dd>
          </dl>

          <h2>2. Summary</h2>
          <p>{INV.summary}</p>

          <h2>3. Root cause</h2>
          <p>Competency expiries are tracked in a spreadsheet separate from the work-order system, so the scheduler assigned a technician without a current controlled-bolting competency. Combined with restart-window time pressure not explicitly governed by the permit-to-work process, the independent torque verification step was omitted.</p>

          <h2>4. Barriers</h2>
          <p style={{ color: "var(--ink-3)", fontStyle: "italic" }}>Bowtie analysis attached · 6 barriers assessed · 2 failed (competency-to-task, torque verification) · 4 held (ESD-2, gas detection, muster, PTW isolation).</p>

          <h2>5. Corrective actions</h2>
          <p style={{ color: "var(--ink-3)", fontStyle: "italic" }}>7 actions proposed — see Actions tab. Highest-leverage action (CA-01) targets integration of the competency register with SAP scheduling.</p>
        </div>
        <div>
          <div className="signoff-card">
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, marginBottom: 4 }}>Sign-off chain</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 10 }}>Ordered approvals · blocking</div>
            {SIGNOFF.map(s => (
              <div key={s.init} className="signoff-item">
                <Avatar initials={s.init} size={32}/>
                <div>
                  <div className="signoff-name">{s.name}</div>
                  <div className="signoff-role">{s.role}</div>
                </div>
                <div className="signoff-status" style={{ color: statusColor[s.status] }}>
                  {s.status === "signed" && <Icon name="check" size={12}/>}
                  {s.status === "review" && <Icon name="clock" size={12}/>}
                  <span>{statusLabel[s.status]}</span>
                  {s.when && <span style={{ color: "var(--ink-4)", marginLeft: 4, fontFamily: "var(--font-mono)", fontSize: 10.5 }}>{s.when}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="signoff-card" style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, marginBottom: 6 }}>Distribution</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.6 }}>
              <div>• Asset GM · Northgate Alpha</div>
              <div>• VP HSE Upstream</div>
              <div>• BSEE (statutory)</div>
              <div>• Central lessons-learned library</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InvestigationView = ({ onBack }) => {
  const [tab, setTab] = React.useState("overview");
  const [analysis, setAnalysis] = React.useState({ fivewhys: true, icam: true, hfat: false });
  const activate = (k) => setAnalysis(a => ({ ...a, [k]: true }));
  const tabs = {
    overview: <OverviewTab/>,
    timeline: <TimelineTab/>,
    fivewhys: analysis.fivewhys ? <FiveWhysTab onGoToEvidence={() => setTab("evidence")}/> : <AnalysisDisabled method="5 Whys" desc="Cascade from event to underlying cause through five iterative questions. Best for linear, single-thread causal chains." onActivate={() => activate("fivewhys")}/>,
    icam: analysis.icam ? <IcamTab onGoToEvidence={() => setTab("evidence")}/> : <AnalysisDisabled method="ICAM analysis" desc="Map contributing factors across absent defences, individual actions, task conditions, and organisational factors. Best for systemic / multi-factor incidents." onActivate={() => activate("icam")}/>,
    hfat: analysis.hfat ? <HfatTab onGoToEvidence={() => setTab("evidence")}/> : <AnalysisDisabled method="miniHFAT" desc="Mini Human Factors Analysis Tool — examine the action error, error-recovery opportunities, the cognitive stage where it broke down, and the underlying performance-shaping conditions. Best when human behaviour is central to the event." onActivate={() => activate("hfat")}/>,
    evidence: <EvidenceTab/>,
    interviews: <InterviewsTab onGoToEvidence={() => setTab("evidence")}/>,
    actions: <ActionsTab/>,
    report: <ReportTab/>,
  };
  return (
    <div>
      <InvHeader tab={tab} setTab={setTab} onBack={onBack} analysis={analysis} setAnalysis={setAnalysis}/>
      {tabs[tab]}
    </div>
  );
};

// --- Interviews tab
export const INTERVIEWS = [
  {
    id: "INT-01", name: "J. Park", role: "Mechanical technician (executor)", status: "complete",
    when: "Apr 13 · 09:30", duration: "52 min", interviewer: "M. Ruiz",
    location: "Onshore office · R-204", method: "In person",
    statementId: "WI-01", topics: ["Torque sequence", "Tooling used", "Verification step", "Fatigue / shift"],
    notes: "Confirmed single-pass execution. Believed verifier signature would be added by supervisor on closeout. Reported felt rushed by 06:00 restart target.",
  },
  {
    id: "INT-02", name: "T. Harlow", role: "On-shift supervisor", status: "complete",
    when: "Apr 13 · 14:00", duration: "47 min", interviewer: "M. Ruiz",
    location: "Onshore office · R-204", method: "In person",
    statementId: "WI-02", topics: ["Independent torque verification", "PTW restart criteria", "Crew composition"],
    notes: "Skipped independent verification at the joint; signed off retrospectively. Raised the restart-window pressure as 'standard practice'.",
  },
  {
    id: "INT-03", name: "P. Whelan", role: "Outside operator (C-Deck walkround)", status: "scheduled",
    when: "Apr 18 · 10:00", duration: "—", interviewer: "M. Ruiz",
    location: "Teams call", method: "Remote",
    statementId: null, topics: ["Walkround timing", "What was seen / smelt", "Comms with CCR"],
    notes: "Identified by gap analysis — was on C-Deck during initial leak. Statement not yet recorded.",
  },
  {
    id: "INT-04", name: "R. Okafor", role: "Control room operator", status: "in-progress",
    when: "Apr 17 · 16:00", duration: "in progress", interviewer: "E. Sato",
    location: "CCR · Northgate B", method: "In person",
    statementId: null, topics: ["DCS alarm response", "ESD-2 activation", "Notification sequence"],
    notes: "Statement being drafted. Prelim: described 30s gap between low-LEL alarm and shutdown decision.",
  },
];

export const InterviewsTab = ({ onGoToEvidence }) => {
  const [items, setItems] = React.useState(INTERVIEWS);
  const [editing, setEditing] = React.useState(null);
  const [filter, setFilter] = React.useState("all");
  const filters = [["all", "All"], ["scheduled", "Scheduled"], ["in-progress", "In progress"], ["complete", "Complete"]];
  const counts = { all: items.length, scheduled: items.filter(i => i.status === "scheduled").length, "in-progress": items.filter(i => i.status === "in-progress").length, complete: items.filter(i => i.status === "complete").length };
  const shown = items.filter(i => filter === "all" || i.status === filter);
  const statusStyle = (s) => s === "complete"
    ? { bg: "color-mix(in oklch, oklch(0.55 0.12 155) 14%, transparent)", fg: "oklch(0.45 0.14 155)", label: "Complete" }
    : s === "in-progress"
      ? { bg: "var(--accent-soft)", fg: "var(--accent-ink)", label: "In progress" }
      : { bg: "var(--bg-sunken)", fg: "var(--ink-3)", label: "Scheduled" };
  const save = (draft) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === draft.id);
      if (exists) return prev.map(i => i.id === draft.id ? draft : i);
      const nextN = prev.length + 1;
      return [...prev, { ...draft, id: `INT-${String(nextN).padStart(2, "0")}` }];
    });
    setEditing(null);
  };
  const remove = (id) => { setItems(prev => prev.filter(i => i.id !== id)); setEditing(null); };
  return (
    <div className="inv-body view-enter">
      {editing && <InterviewModal initial={editing.item} onSave={save} onDelete={remove} onClose={() => setEditing(null)}/>}
      <div style={{ display: "flex", marginBottom: 18, alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Interviews</h3>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
            {counts.complete} complete · {counts["in-progress"]} in progress · {counts.scheduled} scheduled · written statements feed back to <button onClick={onGoToEvidence} style={{ font: "inherit", color: "var(--accent-ink)", background: "transparent", border: 0, padding: 0, cursor: "pointer", textDecoration: "underline" }}>Evidence</button>.
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <div className="seg">
            {filters.map(([k, l]) => (
              <button key={k} className={`seg-btn ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>
                {l} <span className="n">{counts[k]}</span>
              </button>
            ))}
          </div>
          <button className="btn" onClick={() => setEditing({ item: null })}><Icon name="plus" size={13}/>Schedule interview</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 12 }}>
        {shown.map(it => {
          const s = statusStyle(it.status);
          return (
            <button key={it.id} className="card icam-edit-card" onClick={() => setEditing({ item: it })}
              style={{ padding: 16, textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 10, font: "inherit", color: "inherit", background: "var(--bg-elev)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{it.id}</span>
                <span className="chip" style={{ fontSize: 10, padding: "1px 7px", background: s.bg, color: s.fg, borderColor: "transparent", fontWeight: 600 }}>{s.label}</span>
                {it.statementId && <span className="chip" style={{ fontSize: 10, padding: "1px 7px" }}><Icon name="doc" size={10}/>{it.statementId}</span>}
                <span className="icam-edit-pencil" aria-hidden style={{ marginLeft: "auto", opacity: 0, transition: "opacity 120ms", color: "var(--ink-3)", display: "inline-flex" }}><Icon name="edit" size={11}/></span>
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.005em" }}>{it.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{it.role}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11, color: "var(--ink-3)" }}>
                <div><span style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 9.5, color: "var(--ink-4)", display: "block" }}>When</span><span className="mono" style={{ color: "var(--ink-2)" }}>{it.when}</span></div>
                <div><span style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 9.5, color: "var(--ink-4)", display: "block" }}>Duration</span><span className="mono" style={{ color: "var(--ink-2)" }}>{it.duration}</span></div>
                <div><span style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 9.5, color: "var(--ink-4)", display: "block" }}>Interviewer</span><span style={{ color: "var(--ink-2)" }}>{it.interviewer}</span></div>
                <div><span style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 9.5, color: "var(--ink-4)", display: "block" }}>Method</span><span style={{ color: "var(--ink-2)" }}>{it.method}</span></div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {it.topics.map(t => <span key={t} className="chip" style={{ fontSize: 10, padding: "1px 7px" }}>{t}</span>)}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5, padding: "10px 12px", background: "var(--bg)", borderRadius: 6, border: "1px solid var(--border)" }}>{it.notes}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Cognitive interviewing technique checks. Each rule returns null if the question passes,
// or an object {flag, fix} if it should be flagged.
export const COG_RULES = [
  { id: "leading", flag: "Leading", fix: "Ask without implying the answer (e.g. drop \u2018wasn\u2019t\u2019, \u2018didn\u2019t\u2019, \u2018don\u2019t you think\u2019).",
    test: (q) => /\b(wasn'?t|weren'?t|didn'?t|don'?t you think|isn'?t it|surely|obviously|of course)\b/i.test(q) },
  { id: "closed", flag: "Closed (yes/no)", fix: "Open it up \u2014 try \u2018Tell me about\u2026\u2019, \u2018Walk me through\u2026\u2019, \u2018What happened next?\u2019.",
    test: (q) => /^\s*(did|do|does|was|were|is|are|had|have|has|could|would|should|will|can|may|might)\b/i.test(q.trim()) },
  { id: "double", flag: "Double-barrelled", fix: "Split into two questions \u2014 one idea per question.",
    test: (q) => /\b(and|or)\b.*\?/i.test(q) && q.split(/\b(and|or)\b/i).length > 3 },
  { id: "why", flag: "Starts with \u2018Why\u2019", fix: "\u2018Why\u2019 puts people on the defensive. Try \u2018What led to\u2026\u2019, \u2018What were you thinking when\u2026\u2019.",
    test: (q) => /^\s*why\b/i.test(q.trim()) },
  { id: "jargon", flag: "Heavy acronym / jargon", fix: "Replace or define acronyms \u2014 the interviewee may interpret them differently.",
    test: (q) => (q.match(/\b[A-Z]{3,}\b/g) || []).length >= 2 },
  { id: "long", flag: "Too long", fix: "Trim to one clear ask. Long questions prompt partial answers.",
    test: (q) => q.split(/\s+/).filter(Boolean).length > 28 },
  { id: "memory", flag: "Vague time anchor", fix: "Anchor in the timeline \u2014 \u2018When you arrived at C-Deck\u2019, \u2018Before the alarm sounded\u2019.",
    test: (q) => !/\b(when|before|after|during|while|at the time|just before|just after|once)\b/i.test(q) && q.split(/\s+/).length > 10 },
];
const cogReview = (q) => COG_RULES.filter(r => r.test(q));

const generateQuestionsFromEvidence = (interviewee) => {
  // Mock AI generator. Returns evidence-grounded, open, anchored questions following
  // Cognitive Interviewing principles (free recall \u2192 context reinstatement \u2192 specific probes).
  const role = (interviewee.role || "").toLowerCase();
  const isExecutor = /technician|operator|fitter|mechanic|executor/.test(role) && !/control room|ccr/.test(role);
  const isSupervisor = /supervisor|lead|foreman/.test(role);
  const isCCR = /control room|ccr|board operator/.test(role);
  const base = [
    { phase: "Free recall", text: "Walk me through everything you remember about that shift, from the start of your handover until you left the platform. Take your time \u2014 I won\u2019t interrupt.", source: "Cognitive Interview \u00b7 free recall stage" },
    { phase: "Context reinstatement", text: "Before we go into specifics, picture yourself back at the worksite that morning. What could you see, hear, and smell at the time?", source: "Cognitive Interview \u00b7 mental reinstatement" },
  ];
  const evidenceGrounded = [
    { phase: "Specific probe", text: "When you arrived at the joint, what did you observe about its condition before any work started?", source: "EV-PH-02 (joint photo, pre-work)" },
    { phase: "Specific probe", text: "Walk me through the torque sequence as you carried it out that day \u2014 step by step, including any tool changes.", source: "WI-01, EV-DOC-04 (procedure)" },
    { phase: "Specific probe", text: "At what point did you expect a second person to verify the torque, and what did you understand was supposed to happen if they were not present?", source: "EV-DOC-04 \u00a73.2" },
    { phase: "Specific probe", text: "Describe what was happening around you in the half hour before the alarm \u2014 who was on the deck, what comms you had with the CCR, and how you were feeling physically.", source: "EV-SEN-01 (LEL trace)" },
    { phase: "Reverse order", text: "Now tell me the same sequence again, but starting from the moment the alarm sounded and working backwards. Sometimes we remember things in a different order.", source: "Cognitive Interview \u00b7 reverse order recall" },
    { phase: "Change perspective", text: "If you imagine yourself standing where the outside operator was, what do you think they would have seen at the joint?", source: "Cognitive Interview \u00b7 change-of-perspective" },
  ];
  const supervisor = [
    { phase: "Specific probe", text: "What was your understanding of the restart criteria for that PTW, and where were you when you signed it off?", source: "EV-DOC-02 (PTW), WI-02" },
    { phase: "Specific probe", text: "Tell me about the verification step in the torque procedure as you applied it on this job \u2014 walk me through what you did.", source: "EV-DOC-04 \u00a73.2, WI-02" },
  ];
  const ccr = [
    { phase: "Specific probe", text: "Talk me through the alarm sequence on your DCS from the first low-LEL annunciation to ESD-2 \u2014 what you saw, what you decided, and what you said.", source: "EV-SEN-01 (LEL trace), EV-LOG-03 (DCS event log)" },
    { phase: "Specific probe", text: "Describe how the decision to activate ESD-2 was made \u2014 who was involved and what information you had at the time.", source: "EV-LOG-03" },
  ];
  const closing = [
    { phase: "Catch-all", text: "Is there anything I haven\u2019t asked you about that you think is important for me to understand?", source: "Cognitive Interview \u00b7 open close" },
    { phase: "Catch-all", text: "If we wanted to make sure this couldn\u2019t happen again, what would you change?", source: "Forward-looking probe" },
  ];
  return [
    ...base,
    ...evidenceGrounded.slice(0, isExecutor ? 6 : 3),
    ...(isSupervisor ? supervisor : []),
    ...(isCCR ? ccr : []),
    ...closing,
  ].map((q, i) => ({ id: `Q${i + 1}`, ...q, kept: true }));
};

// --- Standalone HTML for the "Use in interview" pop-out console
const buildInterviewConsoleHTML = (payload) => {
  const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const { meta, questions } = payload;
  const targetId = meta.id;
  const qJSON = JSON.stringify(questions);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Interview console · ${esc(meta.name)}</title>
<style>
  :root { --bg:#faf9f7; --bg-elev:#ffffff; --bg-sunken:#f2f0eb; --ink-1:#1a1a1a; --ink-2:#3a3a3a; --ink-3:#6a6a6a; --ink-4:#9a9a9a; --border:#e2dfd8; --accent:oklch(0.55 0.13 250); --accent-soft:oklch(0.94 0.04 250); --accent-ink:oklch(0.42 0.16 250); --rec:oklch(0.55 0.18 25); }
  * { box-sizing: border-box; }
  html, body { margin:0; height:100%; background:var(--bg); color:var(--ink-1); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size:14px; }
  body { display:grid; grid-template-rows:auto 1fr auto; height:100vh; }
  header { padding:14px 20px; border-bottom:1px solid var(--border); background:var(--bg-elev); display:flex; align-items:center; gap:18px; }
  header .who { flex:1; min-width:0; }
  header .who .name { font-size:15px; font-weight:600; letter-spacing:-0.01em; }
  header .who .role { font-size:11.5px; color:var(--ink-3); margin-top:2px; }
  header .meta { font-size:10.5px; color:var(--ink-3); display:flex; gap:14px; }
  header .meta b { color:var(--ink-2); font-weight:600; text-transform:uppercase; letter-spacing:0.07em; font-size:9.5px; display:block; }
  .timer { display:flex; align-items:center; gap:8px; padding:6px 12px; border:1px solid var(--border); border-radius:20px; background:var(--bg); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size:13px; font-weight:600; }
  .timer .dot { width:8px; height:8px; border-radius:50%; background:var(--ink-4); }
  .timer.recording .dot { background:var(--rec); animation:pulse 1.4s infinite; }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
  main { display:grid; grid-template-columns: 320px 1fr; min-height:0; }
  .qlist { border-right:1px solid var(--border); overflow:auto; background:var(--bg-sunken); }
  .qlist .item { padding:12px 14px; border-bottom:1px solid var(--border); cursor:pointer; display:flex; gap:10px; align-items:flex-start; }
  .qlist .item:hover { background:color-mix(in oklch, var(--accent-soft) 35%, transparent); }
  .qlist .item.on { background:var(--bg-elev); border-left:3px solid var(--accent); padding-left:11px; }
  .qlist .item.answered .num { color:oklch(0.5 0.13 155); }
  .qlist .item.answered .num::before { content:"✓ "; }
  .qlist .num { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size:11px; color:var(--ink-4); min-width:24px; }
  .qlist .qt { font-size:12px; color:var(--ink-2); line-height:1.4; flex:1; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
  .panel { display:flex; flex-direction:column; overflow:hidden; }
  .panel .scroll { overflow:auto; padding:28px 36px 80px; }
  .crumb { font-size:10.5px; text-transform:uppercase; letter-spacing:0.08em; color:var(--ink-3); display:flex; gap:8px; align-items:center; margin-bottom:12px; }
  .crumb .pill { padding:2px 8px; border-radius:10px; background:var(--accent-soft); color:var(--accent-ink); font-weight:600; }
  .qtext { font-size:22px; line-height:1.35; letter-spacing:-0.01em; font-weight:600; color:var(--ink-1); margin:0 0 6px; max-width:760px; }
  .source { font-size:11px; color:var(--ink-4); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; margin-bottom:18px; }
  .ans-label { font-size:10.5px; text-transform:uppercase; letter-spacing:0.08em; color:var(--ink-3); font-weight:600; margin-bottom:6px; display:flex; align-items:center; gap:8px; }
  .ans-label .auto { font-weight:500; color:var(--ink-4); text-transform:none; letter-spacing:0; font-size:11px; }
  textarea.ans { width:100%; min-height:280px; padding:14px 16px; border:1px solid var(--border); border-radius:8px; font-size:14.5px; line-height:1.55; font-family:inherit; color:var(--ink-1); background:var(--bg-elev); resize:vertical; }
  textarea.ans:focus { outline:2px solid var(--accent); outline-offset:-1px; border-color:var(--accent); }
  .followup { margin-top:18px; padding:12px 14px; background:var(--bg-sunken); border:1px solid var(--border); border-radius:8px; font-size:12px; color:var(--ink-2); }
  .followup b { display:block; font-size:10px; text-transform:uppercase; letter-spacing:0.08em; color:var(--ink-3); margin-bottom:6px; font-weight:600; }
  footer { border-top:1px solid var(--border); padding:12px 20px; display:flex; align-items:center; gap:10px; background:var(--bg-elev); }
  .progress { flex:1; height:6px; background:var(--bg-sunken); border-radius:3px; overflow:hidden; }
  .progress > div { height:100%; background:var(--accent); transition:width 200ms; }
  .pcount { font-size:11.5px; color:var(--ink-3); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
  button { font:inherit; cursor:pointer; }
  .btn { padding:7px 12px; border:1px solid var(--border); border-radius:6px; background:var(--bg); color:var(--ink-1); font-size:12.5px; display:inline-flex; align-items:center; gap:6px; }
  .btn:hover { background:var(--bg-sunken); }
  .btn.primary { background:var(--accent); color:white; border-color:var(--accent); }
  .btn.primary:hover { filter:brightness(1.05); }
  .btn.ghost { background:transparent; }
  .nav { display:flex; gap:6px; }
  .kbd { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size:10.5px; padding:1px 5px; border:1px solid var(--border); border-radius:3px; background:var(--bg); color:var(--ink-3); }
</style></head>
<body>
  <header>
    <div class="who">
      <div class="name">${esc(meta.name)}</div>
      <div class="role">${esc(meta.role)}</div>
    </div>
    <div class="meta">
      <div><b>When</b>${esc(meta.when)}</div>
      <div><b>Interviewer</b>${esc(meta.interviewer)}</div>
      <div><b>Method</b>${esc(meta.method)}</div>
      <div><b>Location</b>${esc(meta.location)}</div>
    </div>
    <div class="timer" id="timer"><span class="dot"></span><span id="time">00:00</span></div>
    <button class="btn" id="startBtn">Start</button>
  </header>
  <main>
    <aside class="qlist" id="qlist"></aside>
    <section class="panel">
      <div class="scroll">
        <div class="crumb">
          <span class="pill" id="qphase">—</span>
          <span id="qpos">Question 1 of ${questions.length}</span>
          <span style="margin-left:auto; color:var(--ink-4);"><span class="kbd">↑</span>/<span class="kbd">↓</span> nav · <span class="kbd">⌘S</span> save back</span>
        </div>
        <h1 class="qtext" id="qtext">—</h1>
        <div class="source" id="qsource">—</div>
        <div class="ans-label">Response <span class="auto" id="autosave">· autosaved locally</span></div>
        <textarea class="ans" id="ans" placeholder="Type the interviewee's response here… (autosaves to this window)"></textarea>
        <div class="followup">
          <b>Reminders</b>
          Listen first. Don't interrupt free recall. If they go quiet, count to five before prompting. After their answer, ask: <i>"What else do you remember about that?"</i> Capture exact words where possible.
        </div>
      </div>
      <footer>
        <div class="nav">
          <button class="btn" id="prev">← Previous</button>
          <button class="btn" id="next">Next →</button>
        </div>
        <div class="progress"><div id="bar" style="width:0%"></div></div>
        <div class="pcount" id="pcount">0 / ${questions.length} answered</div>
        <button class="btn ghost" id="copyBtn">Copy all</button>
        <button class="btn primary" id="saveBtn">Save to interview notes</button>
      </footer>
    </section>
  </main>
<script>
(function(){
  const TARGET_ID = ${JSON.stringify(targetId)};
  const QS = ${qJSON};
  const STORAGE_KEY = "interview-console-" + TARGET_ID;
  const state = { i: 0, answers: {} };
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); state.answers = saved.answers || {}; } catch(e){}
  const $ = (id) => document.getElementById(id);
  const esc = (s) => (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: state.answers })); }
  function renderList(){
    const list = $("qlist"); list.innerHTML = "";
    QS.forEach((q, i) => {
      const a = (state.answers[i] || "").trim();
      const div = document.createElement("div");
      div.className = "item" + (i === state.i ? " on" : "") + (a ? " answered" : "");
      div.innerHTML = '<div class="num">' + String(i+1).padStart(2,"0") + '</div><div class="qt">' + esc(q.text) + '</div>';
      div.onclick = () => { state.i = i; render(); };
      list.appendChild(div);
    });
  }
  function render(){
    const q = QS[state.i];
    $("qphase").textContent = q.phase || "Question";
    $("qpos").textContent = "Question " + (state.i + 1) + " of " + QS.length;
    $("qtext").textContent = q.text;
    $("qsource").textContent = "Source: " + (q.source || "—") + " · " + (q.origin || "");
    $("ans").value = state.answers[state.i] || "";
    const answered = QS.filter((_, i) => (state.answers[i] || "").trim()).length;
    $("pcount").textContent = answered + " / " + QS.length + " answered";
    $("bar").style.width = (answered / QS.length * 100) + "%";
    renderList();
    $("ans").focus();
  }
  $("ans").addEventListener("input", (e) => {
    state.answers[state.i] = e.target.value;
    persist();
    const answered = QS.filter((_, i) => (state.answers[i] || "").trim()).length;
    $("pcount").textContent = answered + " / " + QS.length + " answered";
    $("bar").style.width = (answered / QS.length * 100) + "%";
    // update sidebar tick
    const items = document.querySelectorAll("#qlist .item");
    if (items[state.i]) items[state.i].classList.toggle("answered", !!(e.target.value || "").trim());
  });
  $("prev").onclick = () => { if (state.i > 0) { state.i--; render(); } };
  $("next").onclick = () => { if (state.i < QS.length - 1) { state.i++; render(); } };
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "TEXTAREA" && !e.metaKey && !e.ctrlKey) return;
    if (e.key === "ArrowDown") { e.preventDefault(); if (state.i < QS.length-1) { state.i++; render(); } }
    if (e.key === "ArrowUp") { e.preventDefault(); if (state.i > 0) { state.i--; render(); } }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") { e.preventDefault(); saveBack(); }
  });

  // Timer
  let t0 = null, tick = null;
  function fmt(s){ const m = Math.floor(s/60), r = s%60; return String(m).padStart(2,"0") + ":" + String(r).padStart(2,"0"); }
  $("startBtn").onclick = () => {
    if (!t0) {
      t0 = Date.now();
      $("timer").classList.add("recording");
      $("startBtn").textContent = "Stop";
      tick = setInterval(() => { $("time").textContent = fmt(Math.floor((Date.now() - t0)/1000)); }, 500);
    } else {
      clearInterval(tick); tick = null; t0 = null;
      $("timer").classList.remove("recording");
      $("startBtn").textContent = "Start";
    }
  };

  function buildNotesBlock(){
    const lines = ["--- Interview console capture · " + new Date().toLocaleString() + " ---"];
    QS.forEach((q, i) => {
      const a = (state.answers[i] || "").trim();
      if (!a) return;
      lines.push("");
      lines.push("Q" + String(i+1).padStart(2,"0") + " [" + (q.phase || "") + "] " + q.text);
      lines.push("A: " + a);
    });
    return lines.join("\\n");
  }
  $("copyBtn").onclick = async () => {
    try { await navigator.clipboard.writeText(buildNotesBlock()); $("copyBtn").textContent = "Copied ✓"; setTimeout(() => $("copyBtn").textContent = "Copy all", 1500); }
    catch(e){ alert("Copy failed — select & copy manually from the textarea."); }
  };
  function saveBack(){
    const notes = buildNotesBlock();
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ kind: "interview-console-save", targetId: TARGET_ID, notes }, "*");
      $("saveBtn").textContent = "Saved to notes ✓";
      setTimeout(() => $("saveBtn").textContent = "Save to interview notes", 1800);
    } else {
      alert("The interview record window is no longer open — use Copy all to paste manually.");
    }
  }
  $("saveBtn").onclick = saveBack;

  window.addEventListener("beforeunload", (e) => {
    const answered = QS.filter((_, i) => (state.answers[i] || "").trim()).length;
    if (answered > 0) { e.preventDefault(); e.returnValue = ""; }
  });

  render();
})();
<\/script>
</body></html>`;
};

export const InterviewModal = ({ initial, onSave, onDelete, onClose }) => {
  const isNew = !initial;
  const [d, setD] = React.useState(initial || {
    id: "", name: "", role: "", status: "scheduled",
    when: "", duration: "—", interviewer: "", location: "", method: "In person",
    statementId: null, topics: [], notes: "",
    questions: [], manualQuestions: [],
  });
  const [qTab, setQTab] = React.useState("generated");
  const [generating, setGenerating] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const generated = d.questions || [];
  const manual = d.manualQuestions || [];
  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setD(p => ({ ...p, questions: generateQuestionsFromEvidence(p) }));
      setGenerating(false);
    }, 1100);
  };
  const removeGenerated = (id) => setD(p => ({ ...p, questions: p.questions.filter(q => q.id !== id) }));
  const addManual = () => {
    if (!draft.trim()) return;
    const id = `M${manual.length + 1}`;
    setD(p => ({ ...p, manualQuestions: [...(p.manualQuestions || []), { id, text: draft.trim(), reviewed: false }] }));
    setDraft("");
  };
  const updateManual = (id, text) => setD(p => ({ ...p, manualQuestions: p.manualQuestions.map(q => q.id === id ? { ...q, text } : q) }));
  const removeManual = (id) => setD(p => ({ ...p, manualQuestions: p.manualQuestions.filter(q => q.id !== id) }));
  const promoteGenerated = (q) => {
    setD(p => ({ ...p, manualQuestions: [...(p.manualQuestions || []), { id: `M${(p.manualQuestions || []).length + 1}`, text: q.text, reviewed: true }] }));
  };
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));

  // --- Build the final, ordered question list (generated first, then manual)
  const buildFinalQuestions = () => {
    const gen = (d.questions || []).map((q, i) => ({ idx: i + 1, text: q.text, phase: q.phase, source: q.source, origin: "Generated" }));
    const manStart = gen.length;
    const man = (d.manualQuestions || []).map((q, i) => ({ idx: manStart + i + 1, text: q.text, phase: "Manual", source: "Investigator-written", origin: "Manual" }));
    return [...gen, ...man];
  };

  // --- Export to Word (.doc — HTML with Word XML header; Word opens cleanly)
  const exportToWord = () => {
    const qs = buildFinalQuestions();
    if (qs.length === 0) { alert("No questions to export yet."); return; }
    const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const fname = `Interview-${(d.id || "draft")}-${(d.name || "interview").replace(/[^a-z0-9]+/gi, "_")}.doc`;
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const lineRows = (n) => Array.from({ length: n }, () => `<p class="line">&nbsp;</p>`).join("");
    const questionsHTML = qs.map(q => `
      <div class="q">
        <table class="qhead" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td class="qnum">${String(q.idx).padStart(2, "0")}</td>
            <td class="qphase">${esc(q.phase)} &middot; <i>${esc(q.origin)}</i></td>
          </tr>
        </table>
        <p class="qtext">${esc(q.text)}</p>
        <p class="qmeta">Source: ${esc(q.source)}</p>
        <p class="anslabel">Response</p>
        ${lineRows(10)}
        <p class="followup">Follow-ups / evidence to verify:</p>
        ${lineRows(3)}
      </div>
    `).join("");
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Interview ${esc(d.id || "")}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
<style>
@page { size: A4; margin: 2.2cm 2cm; }
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1a1a1a; }
h1 { font-size: 18pt; margin: 0 0 4pt 0; letter-spacing: -0.01em; }
h2 { font-size: 11pt; color: #444; margin: 0 0 18pt 0; font-weight: normal; }
table.meta { width: 100%; border-collapse: collapse; margin-bottom: 18pt; }
table.meta td { padding: 4pt 6pt; border: 0.5pt solid #cccccc; font-size: 10pt; vertical-align: top; }
table.meta td.lbl { width: 110pt; background: #f3f3f3; color: #555; text-transform: uppercase; letter-spacing: 0.06em; font-size: 8.5pt; }
.intro { font-size: 9.5pt; color: #555; border-left: 2pt solid #888; padding-left: 8pt; margin: 14pt 0 18pt; line-height: 1.4; }
.q { page-break-inside: avoid; margin-bottom: 18pt; padding-bottom: 8pt; border-bottom: 0.5pt solid #cccccc; }
.qhead { margin-bottom: 4pt; }
.qnum { width: 38pt; font-family: Consolas, "Courier New", monospace; font-size: 10pt; color: #888; font-weight: bold; }
.qphase { font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.08em; color: #777; }
p.qtext { font-size: 12pt; font-weight: bold; margin: 2pt 0 4pt; line-height: 1.35; }
p.qmeta { font-size: 8.5pt; color: #888; margin: 0 0 8pt; font-style: italic; }
p.anslabel, p.followup { font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.07em; color: #666; margin: 6pt 0 4pt; font-weight: bold; }
p.line { border-bottom: 0.5pt solid #999; margin: 0 0 14pt; height: 14pt; line-height: 14pt; }
p.followup { margin-top: 10pt; }
.foot { margin-top: 16pt; font-size: 8.5pt; color: #888; border-top: 0.5pt solid #ccc; padding-top: 6pt; }
</style></head>
<body>
<h1>Interview record</h1>
<h2>${esc(d.name || "—")} &middot; ${esc(d.role || "—")}</h2>
<table class="meta">
  <tr><td class="lbl">Interview&nbsp;ID</td><td>${esc(d.id || "draft")}</td><td class="lbl">When</td><td>${esc(d.when || "—")}</td></tr>
  <tr><td class="lbl">Interviewer</td><td>${esc(d.interviewer || "—")}</td><td class="lbl">Duration</td><td>${esc(d.duration || "—")}</td></tr>
  <tr><td class="lbl">Method</td><td>${esc(d.method || "—")}</td><td class="lbl">Location</td><td>${esc(d.location || "—")}</td></tr>
  <tr><td class="lbl">Topics</td><td colspan="3">${esc((d.topics || []).join(", ") || "—")}</td></tr>
  <tr><td class="lbl">Exported</td><td colspan="3">${esc(today)} &middot; ${qs.length} question${qs.length === 1 ? "" : "s"}</td></tr>
</table>
<div class="intro">
  Introduction: thank the interviewee, confirm consent, explain purpose (fact-finding &mdash; not blame), state confidentiality and record-keeping, and offer breaks. Begin with free recall before specific probes.
</div>
${questionsHTML}
<div class="foot">Confidential &middot; investigation record &middot; generated from the Incident Investigation Portal</div>
</body></html>`;
    const blob = new Blob(["\ufeff" + html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fname;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
  };

  // --- Open live interview console in a new window
  const openInterviewConsole = () => {
    const qs = buildFinalQuestions();
    if (qs.length === 0) { alert("No questions to use yet — generate or write some first."); return; }
    const w = window.open("", `interview-${d.id || "draft"}`, "width=1180,height=820,menubar=no,toolbar=no,location=no,status=no");
    if (!w) { alert("Pop-up blocked. Allow pop-ups for this page and try again."); return; }
    const payload = {
      meta: {
        id: d.id || "draft", name: d.name || "—", role: d.role || "—",
        when: d.when || "—", interviewer: d.interviewer || "—",
        location: d.location || "—", method: d.method || "—",
      },
      questions: qs,
    };
    const html = buildInterviewConsoleHTML(payload);
    w.document.open(); w.document.write(html); w.document.close();
    // Listen for "save back to notes" message
    const handler = (ev) => {
      if (!ev.data || ev.data.kind !== "interview-console-save") return;
      if (ev.data.targetId !== (d.id || "draft")) return;
      const notesBlock = ev.data.notes;
      setD(p => ({ ...p, notes: (p.notes ? p.notes + "\n\n" : "") + notesBlock }));
    };
    window.addEventListener("message", handler);
    // Cleanup if console closes
    const poll = setInterval(() => {
      if (w.closed) { window.removeEventListener("message", handler); clearInterval(poll); }
    }, 1000);
  };

  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(10,10,15,0.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 760, maxWidth: "100%", maxHeight: "92vh", background: "var(--bg-elev)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, marginBottom: 4 }}>{isNew ? "Schedule interview" : `Edit interview · ${d.id}`}</div>
            <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.012em" }}>{d.name || "New interview"}</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "transparent", cursor: "pointer", display: "grid", placeItems: "center" }}><Icon name="close" size={14}/></button>
        </div>
        <div style={{ padding: "18px 22px", overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Name" v={d.name} set={(v) => set("name", v)} placeholder="Full name"/>
            <Field label="Role" v={d.role} set={(v) => set("role", v)} placeholder="Job title / role on shift"/>
          </div>
          <div>
            <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, display: "block", marginBottom: 6 }}>Status</label>
            <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--bg-sunken)", border: "1px solid var(--border)", borderRadius: 6, width: "fit-content" }}>
              {["scheduled", "in-progress", "complete"].map(s => (
                <button key={s} onClick={() => set("status", s)} style={{
                  padding: "5px 12px", border: "1px solid " + (d.status === s ? "var(--border)" : "transparent"),
                  borderRadius: 4, background: d.status === s ? "var(--bg-elev)" : "transparent",
                  cursor: "pointer", font: "inherit", fontSize: 11.5, color: "var(--ink-2)", textTransform: "capitalize",
                }}>{s.replace("-", " ")}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="When" v={d.when} set={(v) => set("when", v)} placeholder="Apr 18 · 10:00"/>
            <Field label="Duration" v={d.duration} set={(v) => set("duration", v)} placeholder="45 min"/>
            <Field label="Interviewer" v={d.interviewer} set={(v) => set("interviewer", v)} placeholder="Name"/>
            <Field label="Method" v={d.method} set={(v) => set("method", v)} placeholder="In person / Remote"/>
          </div>
          <Field label="Location" v={d.location} set={(v) => set("location", v)} placeholder="Room, site, or platform"/>
          <Field label="Topics (comma separated)" v={d.topics.join(", ")} set={(v) => set("topics", v.split(",").map(s => s.trim()).filter(Boolean))} placeholder="Sequence of events, decisions taken, fatigue, comms"/>
          <Field label="Linked written statement (Evidence ID)" v={d.statementId || ""} set={(v) => set("statementId", v.trim() || null)} placeholder="e.g. WI-03 — leave blank if not yet recorded"/>
          <div>
            <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 500, display: "block", marginBottom: 6 }}>Notes</label>
            <textarea value={d.notes} onChange={(e) => set("notes", e.target.value)} rows={4}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, fontFamily: "inherit", lineHeight: 1.5, color: "var(--ink-1)", background: "var(--bg)", resize: "vertical" }}
              placeholder="Key points, decisions taken, follow-ups"/>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.005em" }}>Interview questions</div>
                <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>Generate from evidence, or write your own — manual questions are checked against cognitive interviewing technique.</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 4, padding: 3, background: "var(--bg-sunken)", border: "1px solid var(--border)", borderRadius: 6 }}>
                <button onClick={() => setQTab("generated")} style={{ padding: "5px 10px", border: "1px solid " + (qTab === "generated" ? "var(--border)" : "transparent"), borderRadius: 4, background: qTab === "generated" ? "var(--bg-elev)" : "transparent", cursor: "pointer", font: "inherit", fontSize: 11, color: "var(--ink-2)" }}>Generated <span style={{ color: "var(--ink-4)", marginLeft: 3 }}>{generated.length}</span></button>
                <button onClick={() => setQTab("manual")} style={{ padding: "5px 10px", border: "1px solid " + (qTab === "manual" ? "var(--border)" : "transparent"), borderRadius: 4, background: qTab === "manual" ? "var(--bg-elev)" : "transparent", cursor: "pointer", font: "inherit", fontSize: 11, color: "var(--ink-2)" }}>Manual <span style={{ color: "var(--ink-4)", marginLeft: 3 }}>{manual.length}</span></button>
              </div>
            </div>
            {(generated.length + manual.length) > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", marginBottom: 12, border: "1px solid var(--border)", borderRadius: 8, background: "color-mix(in oklch, var(--accent-soft) 35%, var(--bg-sunken))" }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg-elev)", border: "1px solid var(--border)", display: "grid", placeItems: "center", color: "var(--accent-ink)", flex: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-1)", letterSpacing: "-0.005em" }}>Ready to run the interview</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 1 }}>Take the final list of {generated.length + manual.length} question{(generated.length + manual.length) === 1 ? "" : "s"} into the field — print, or capture answers live in a side window.</div>
                </div>
                <button className="btn ghost" onClick={exportToWord} title="Download as .doc with space to write or type each answer"
                  style={{ fontSize: 11.5, padding: "6px 10px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export to Word
                </button>
                <button className="btn primary" onClick={openInterviewConsole} title="Open a side window to record answers live during the interview"
                  style={{ background: "var(--accent)", borderColor: "var(--accent)", color: "white", fontSize: 11.5, padding: "6px 10px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Use in interview
                </button>
              </div>
            )}
            {qTab === "generated" && (
              <div>
                {generated.length === 0 && (
                  <div style={{ padding: 18, border: "1px dashed var(--border)", borderRadius: 8, background: "var(--bg-sunken)", textAlign: "center" }}>
                    <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 4, fontWeight: 500 }}>No generated questions yet</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginBottom: 12 }}>Pulls from evidence (photos, sensors, statements, procedures) and the interviewee's role. Uses cognitive-interviewing structure: free recall → context reinstatement → specific probes → reverse order → change of perspective.</div>
                    <button className="btn primary" onClick={generate} disabled={generating} style={{ background: "var(--accent)", borderColor: "var(--accent)", color: "white" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"/><path d="M5 17l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/><path d="M18 16l.7 2.1L21 19l-2.3.9L18 22l-.7-2.1L15 19l2.3-.9L18 16z"/></svg>
                      {generating ? "Analysing evidence…" : "Generate from evidence"}
                    </button>
                  </div>
                )}
                {generated.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{generated.length} question{generated.length === 1 ? "" : "s"} · grounded in evidence and interviewee role</div>
                      <button className="btn ghost" onClick={generate} disabled={generating} style={{ marginLeft: "auto", fontSize: 11, padding: "4px 9px" }}>{generating ? "Regenerating…" : "Regenerate"}</button>
                    </div>
                    {generated.map((q, i) => {
                      const phaseColor = q.phase === "Free recall" ? "oklch(0.55 0.13 250)"
                        : q.phase === "Context reinstatement" ? "oklch(0.55 0.13 200)"
                        : q.phase === "Specific probe" ? "var(--accent-ink)"
                        : q.phase === "Reverse order" ? "oklch(0.5 0.13 290)"
                        : q.phase === "Change perspective" ? "oklch(0.5 0.14 330)"
                        : "var(--ink-3)";
                      return (
                        <div key={q.id} style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{String(i + 1).padStart(2, "0")}</span>
                            <span className="chip" style={{ fontSize: 10, padding: "1px 7px", color: phaseColor, borderColor: "color-mix(in oklch, " + phaseColor + " 40%, transparent)" }}>{q.phase}</span>
                            <span style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                              <button onClick={() => promoteGenerated(q)} title="Copy to manual list" className="btn ghost" style={{ fontSize: 10.5, padding: "3px 8px" }}>Copy to manual</button>
                              <button onClick={() => removeGenerated(q.id)} title="Remove" style={{ width: 22, height: 22, border: "1px solid var(--border)", borderRadius: 4, background: "transparent", cursor: "pointer", color: "var(--ink-3)", display: "grid", placeItems: "center" }}><Icon name="close" size={11}/></button>
                            </span>
                          </div>
                          <div style={{ fontSize: 13, color: "var(--ink-1)", lineHeight: 1.5, marginBottom: 6 }}>{q.text}</div>
                          <div style={{ fontSize: 10.5, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 4 }}>
                            <Icon name="link" size={10}/><span style={{ fontFamily: "var(--font-mono)" }}>{q.source}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {qTab === "manual" && (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                  {manual.length === 0 && (
                    <div style={{ padding: 14, border: "1px dashed var(--border)", borderRadius: 8, background: "var(--bg-sunken)", fontSize: 11.5, color: "var(--ink-3)", textAlign: "center" }}>
                      Write a question and we'll check it against cognitive-interviewing technique (avoid leading, closed, why-starting, double-barrelled, jargon-heavy questions).
                    </div>
                  )}
                  {manual.map((q, i) => {
                    const flags = cogReview(q.text);
                    const passes = flags.length === 0;
                    return (
                      <div key={q.id} style={{ padding: 12, border: "1px solid " + (passes ? "var(--border)" : "color-mix(in oklch, var(--sev-med) 40%, transparent)"), borderRadius: 8, background: passes ? "var(--bg)" : "color-mix(in oklch, var(--sev-med) 6%, var(--bg))" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{String(i + 1).padStart(2, "0")}</span>
                          {passes
                            ? <span className="chip" style={{ fontSize: 10, padding: "1px 7px", color: "oklch(0.45 0.14 155)", borderColor: "color-mix(in oklch, oklch(0.55 0.12 155) 40%, transparent)", background: "color-mix(in oklch, oklch(0.55 0.12 155) 8%, transparent)" }}>✓ Passes cognitive checks</span>
                            : <span className="chip" style={{ fontSize: 10, padding: "1px 7px", color: "var(--sev-high-ink)", borderColor: "color-mix(in oklch, var(--sev-high) 40%, transparent)", background: "color-mix(in oklch, var(--sev-high) 8%, transparent)" }}>! {flags.length} issue{flags.length === 1 ? "" : "s"}</span>}
                          <button onClick={() => removeManual(q.id)} title="Remove" style={{ marginLeft: "auto", width: 22, height: 22, border: "1px solid var(--border)", borderRadius: 4, background: "transparent", cursor: "pointer", color: "var(--ink-3)", display: "grid", placeItems: "center" }}><Icon name="close" size={11}/></button>
                        </div>
                        <textarea value={q.text} onChange={(e) => updateManual(q.id, e.target.value)} rows={2}
                          style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12.5, fontFamily: "inherit", lineHeight: 1.5, color: "var(--ink-1)", background: "var(--bg-elev)", resize: "vertical" }}/>
                        {flags.length > 0 && (
                          <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 6, background: "color-mix(in oklch, var(--sev-med) 8%, transparent)", border: "1px solid color-mix(in oklch, var(--sev-med) 25%, transparent)" }}>
                            {flags.map(f => (
                              <div key={f.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 0", fontSize: 11.5 }}>
                                <span style={{ minWidth: 110, color: "var(--sev-high-ink)", fontWeight: 600 }}>{f.flag}</span>
                                <span style={{ color: "var(--ink-2)", lineHeight: 1.5 }}>{f.fix}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2}
                    onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); addManual(); } }}
                    placeholder="Write a question… ⌘/Ctrl + Enter to add"
                    style={{ flex: 1, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12.5, fontFamily: "inherit", lineHeight: 1.5, color: "var(--ink-1)", background: "var(--bg)", resize: "vertical" }}/>
                  <button className="btn primary" onClick={addManual} disabled={!draft.trim()}><Icon name="plus" size={12}/>Add</button>
                </div>
                {draft.trim().length > 0 && (() => {
                  const flags = cogReview(draft);
                  if (flags.length === 0) return null;
                  return (
                    <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 6, background: "color-mix(in oklch, var(--sev-med) 8%, transparent)", border: "1px solid color-mix(in oklch, var(--sev-med) 25%, transparent)", fontSize: 11.5 }}>
                      <div style={{ color: "var(--sev-high-ink)", fontWeight: 600, marginBottom: 4 }}>Cognitive review · {flags.length} issue{flags.length === 1 ? "" : "s"}</div>
                      {flags.map(f => (
                        <div key={f.id} style={{ display: "flex", gap: 8, padding: "2px 0" }}>
                          <span style={{ minWidth: 110, color: "var(--sev-high-ink)" }}>{f.flag}</span>
                          <span style={{ color: "var(--ink-2)" }}>{f.fix}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", gap: 8 }}>
          {!isNew
            ? <button className="btn ghost" onClick={() => onDelete(d.id)} style={{ color: "var(--sev-high)" }}><Icon name="close" size={12}/>Delete</button>
            : <span/>}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={() => onSave(d)} disabled={!d.name.trim()}>{isNew ? "Schedule interview" : "Save changes"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AnalysisDisabled = ({ method, desc, onActivate }) => (
  <div className="inv-body view-enter">
    <div style={{
      maxWidth: 540, margin: "60px auto", padding: 28,
      border: "1px dashed var(--border)", borderRadius: 12,
      background: "var(--bg-sunken)", textAlign: "center",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, margin: "0 auto 14px",
        background: "var(--bg-elev)", border: "1px solid var(--border)",
        display: "grid", placeItems: "center", color: "var(--ink-3)",
      }}>
        <Icon name="off" size={18}/>
      </div>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 4 }}>
        Method disabled
      </div>
      <h3 style={{ margin: "0 0 8px 0", fontSize: 18, letterSpacing: "-0.01em" }}>{method} is not part of this investigation</h3>
      <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, marginBottom: 18 }}>
        {desc}
      </div>
      <button className="btn primary" onClick={onActivate}>
        <Icon name="check" size={13}/>Activate {method}
      </button>
      <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 12 }}>
        You can switch methods on or off at any time from the header — both can run in parallel.
      </div>
    </div>
  </div>
);

export const AnalysisMethodPicker = ({ analysis, setAnalysis }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const activeCount = (analysis.fivewhys ? 1 : 0) + (analysis.icam ? 1 : 0) + (analysis.hfat ? 1 : 0);
  const labels = [analysis.fivewhys && "5 Whys", analysis.icam && "ICAM", analysis.hfat && "miniHFAT"].filter(Boolean);
  const summary = activeCount === 0 ? "None selected" : activeCount === 3 ? "All methods" : labels.join(" + ");
  const methods = [
    { k: "fivewhys", l: "5 Whys", desc: "Linear root-cause cascade" },
    { k: "icam", l: "ICAM analysis", desc: "Systemic contributing factors" },
    { k: "hfat", l: "miniHFAT", desc: "Human factors — action error, recovery, cognition, conditions" },
  ];
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="btn ghost" onClick={() => setOpen(o => !o)}>
        <Icon name="branch" size={13}/>
        Analysis: <strong style={{ marginLeft: 4, fontWeight: 600 }}>{summary}</strong>
        <span style={{ fontSize: 9, color: "var(--ink-4)", marginLeft: 4 }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 100,
          background: "var(--bg-elev)", border: "1px solid var(--border)",
          borderRadius: 8, boxShadow: "var(--shadow-lg)", padding: 8, minWidth: 280,
        }}>
          <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", fontWeight: 600, padding: "4px 8px 8px" }}>
            Active analysis methods
          </div>
          {methods.map(m => (
            <label key={m.k} className="exp-item" style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={!!analysis[m.k]}
                onChange={() => setAnalysis(a => ({ ...a, [m.k]: !a[m.k] }))}
                style={{ flex: "none" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{m.l}</div>
                <div style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{m.desc}</div>
              </div>
            </label>
          ))}
          <div style={{ fontSize: 10.5, color: "var(--ink-4)", padding: "8px 8px 4px", lineHeight: 1.4, borderTop: "1px solid var(--border)", marginTop: 6 }}>
            Disabled methods stay greyed-out in the tab bar — open the tab to activate.
          </div>
        </div>
      )}
    </div>
  );
};

