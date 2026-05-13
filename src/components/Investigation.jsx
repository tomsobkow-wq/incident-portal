import { useState, useRef, Fragment } from 'react';
import { Icon, Avatar, AiSparkle, SevTag, StatusPill, Field } from './ui.jsx';
import {
  INV, FW_PROBLEM, FW_VERIFY_META, FIVE_WHYS_INIT,
  ICAM_FACTORS_INIT, TIMELINE_INIT, EVIDENCE_INIT, ACTIONS_INIT,
  SIGNOFF, HFAT_DATA
} from '../data/index.js';

// ── Local constants ────────────────────────────────────────────────────────────

const STAT_DETAILS = {
  evidence: {
    title: 'Evidence Items',
    icon: 'link',
    items: EVIDENCE_INIT.map(e => ({ label: e.title, sub: e.type, tag: e.status }))
  },
  timeline: {
    title: 'Timeline Events',
    icon: 'clock',
    items: TIMELINE_INIT.map(e => ({ label: e.title, sub: e.time }))
  },
  whys: {
    title: '5 Whys Steps',
    icon: 'branch',
    items: FIVE_WHYS_INIT.map((w, i) => ({ label: `Why ${i + 1}`, sub: w.text }))
  },
  factors: {
    title: 'ICAM Factors',
    icon: 'shield',
    items: ICAM_FACTORS_INIT.map(f => ({ label: f.text, sub: f.col }))
  },
  actions: {
    title: 'Corrective Actions',
    icon: 'check',
    items: ACTIONS_INIT.map(a => ({ label: a.title, sub: a.owner, tag: a.status }))
  },
};

const PEEPO_COLS = ['People', 'Environment', 'Equipment', 'Procedures', 'Organisation'];

const PEEPO_INIT = {
  People:       { pass1: '', pass2: '' },
  Environment:  { pass1: '', pass2: '' },
  Equipment:    { pass1: '', pass2: '' },
  Procedures:   { pass1: '', pass2: '' },
  Organisation: { pass1: '', pass2: '' },
};

const PEEPO_QUESTIONS_INIT = [
  { id: 'pq1', col: 'People',       q: 'Were all personnel adequately trained and competent?',          a: '', evidence: '' },
  { id: 'pq2', col: 'People',       q: 'Was fatigue or shift length a contributing factor?',            a: '', evidence: '' },
  { id: 'pq3', col: 'Environment',  q: 'Did environmental conditions affect task performance?',         a: '', evidence: '' },
  { id: 'pq4', col: 'Environment',  q: 'Was workplace lighting or noise a factor?',                     a: '', evidence: '' },
  { id: 'pq5', col: 'Equipment',    q: 'Was equipment fit for purpose and maintained?',                 a: '', evidence: '' },
  { id: 'pq6', col: 'Equipment',    q: 'Were there any equipment alarms or warnings present?',          a: '', evidence: '' },
  { id: 'pq7', col: 'Procedures',   q: 'Were current, correct procedures available at point of use?',  a: '', evidence: '' },
  { id: 'pq8', col: 'Procedures',   q: 'Were procedures followed as written?',                          a: '', evidence: '' },
  { id: 'pq9', col: 'Organisation', q: 'Was there adequate supervision for the task?',                  a: '', evidence: '' },
  { id:'pq10', col: 'Organisation', q: 'Did organisational pressures influence decision-making?',       a: '', evidence: '' },
];

const TIMELINE_AI_PROPOSALS = [
  { id: 'tai1', time: '06:15', title: 'Pre-job safety meeting', desc: 'Routine toolbox talk recorded in permit.', type: 'Procedure' },
  { id: 'tai2', time: '07:40', title: 'Valve alignment check skipped', desc: 'Inferred from permit deviation note.', type: 'Human Factor' },
];

const FW_AI_PROPOSALS = [
  { id: 'fw-ai1', text: 'Pressure relief valve set-point was not verified before operations commenced', verified: false },
  { id: 'fw-ai2', text: 'Standing instructions for high-pressure zones were not communicated at shift handover', verified: false },
];

const ICAM_AI_PROPOSALS = [
  { id: 'ia1', col: 'Absent / Failed Defences',        text: 'Pressure relief valve not tested prior to operation' },
  { id: 'ia2', col: 'Individual / Team Actions',        text: 'Operator proceeded without secondary verification' },
  { id: 'ia3', col: 'Task / Environment Conditions',    text: 'Condensate accumulation obscured gauge reading' },
  { id: 'ia4', col: 'Organisational Factors',           text: 'Maintenance backlog reduced available safety checks' },
];

const HFAT_AI_PROPOSALS = [
  { id: 'ha1', stage: 'Action Error', text: 'Operator applied incorrect torque due to mislabelled tool' },
  { id: 'ha2', stage: 'PSC',         text: 'High workload from concurrent tasks reduced attention' },
];

const HOC_LEVELS = [
  { id: 'hoc1', label: 'Elimination',        icon: 'shield', color: 'var(--clr-sev-critical)' },
  { id: 'hoc2', label: 'Substitution',        icon: 'arrow',  color: 'var(--clr-sev-high)' },
  { id: 'hoc3', label: 'Engineering Control', icon: 'pin',    color: 'var(--clr-sev-med)' },
  { id: 'hoc4', label: 'Administrative',      icon: 'edit',   color: 'var(--clr-sev-low)' },
  { id: 'hoc5', label: 'PPE',                 icon: 'off',    color: 'var(--clr-text-3)' },
];

const HOC_PROPOSALS = [
  { id: 'hp1', level: 'Engineering Control', title: 'Install automated pressure interlock',  owner: 'Engineering', due: '2025-10-01' },
  { id: 'hp2', level: 'Administrative',      title: 'Revise pre-operation checklist',        owner: 'HSE Lead',    due: '2025-09-15' },
  { id: 'hp3', level: 'Administrative',      title: 'Update shift handover procedure',       owner: 'Ops Manager', due: '2025-09-20' },
];

const COG_RULES = [
  'Avoid leading questions',
  'One question at a time',
  'Use open-ended phrasing',
  'Allow silence — do not fill pauses',
  'Avoid jargon or technical shorthand',
  'Do not suggest answers or interpretations',
  'Confirm understanding before moving on',
];

const INTERVIEWS = [
  { id: 'iv1', name: 'James Whitfield', role: 'Operator A', date: '2025-07-12', status: 'Completed', statementId: 'stmt-01', questions: [] },
  { id: 'iv2', name: 'Sara Okonkwo',   role: 'Shift Supervisor', date: '2025-07-13', status: 'Completed', statementId: 'stmt-02', questions: [] },
  { id: 'iv3', name: 'Ben Trattner',   role: 'Maintenance Tech', date: '', status: 'Scheduled', statementId: null, questions: [] },
];

// ── Utility functions ──────────────────────────────────────────────────────────

function evidenceSufficiency(evidence, timeline, whys, factors) {
  const issues = [];
  if (evidence.filter(e => e.status === 'Verified').length < 3) issues.push('Fewer than 3 verified evidence items');
  if (timeline.length < 4) issues.push('Timeline has fewer than 4 events');
  if (whys.filter(w => w.verified === 'Verified').length < 3) issues.push('Fewer than 3 verified 5 Whys steps');
  if (factors.length < 2) issues.push('Fewer than 2 ICAM factors identified');
  return issues;
}

function cogReview(questions) {
  const flags = [];
  const leadingPhrases = ['did you', 'wasn\'t it', 'surely', 'you must have', 'obviously'];
  questions.forEach((q, i) => {
    const lower = q.text?.toLowerCase() || '';
    if (leadingPhrases.some(p => lower.includes(p))) flags.push({ index: i, rule: 'Avoid leading questions' });
    if ((lower.match(/\?/g) || []).length > 1) flags.push({ index: i, rule: 'One question at a time' });
    if (lower.startsWith('did ') || lower.startsWith('was ') || lower.startsWith('were ')) {
      flags.push({ index: i, rule: 'Use open-ended phrasing' });
    }
  });
  return flags;
}

function generateQuestionsFromEvidence(evidence) {
  return evidence.slice(0, 3).map((e, i) => ({
    id: `gen-${i}`,
    text: `Can you describe what you observed regarding "${e.title}"?`,
    source: 'AI',
  }));
}

// ── InvHeader ─────────────────────────────────────────────────────────────────

function InvHeader({ inc, onBack, activeTab, setActiveTab }) {
  const tabs = ['Overview', 'Timeline', '5 Whys', 'ICAM', 'HFAT', 'PEEPO', 'Evidence', 'Actions', 'Interviews', 'Report'];
  return (
    <div className="inv-header-wrap">
      <div className="inv-header-top">
        <button className="btn ghost" onClick={onBack}>
          <Icon name="arrow" style={{ transform: 'rotate(180deg)' }} /> All Incidents
        </button>
        <div className="inv-header-title">
          <SevTag level={inc.severity} />
          <h2>{inc.title}</h2>
          <StatusPill status={inc.status} />
        </div>
        <div className="inv-header-meta">
          <span><Icon name="clock" /> {inc.opened}</span>
          <span><Icon name="pin" /> {inc.platform}</span>
        </div>
      </div>
      <div className="inv-tabs">
        {tabs.map(t => (
          <button
            key={t}
            className={`inv-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >{t}</button>
        ))}
      </div>
    </div>
  );
}

// ── StatDrawer ────────────────────────────────────────────────────────────────

function StatDrawer({ statKey, onClose }) {
  const d = STAT_DETAILS[statKey];
  if (!d) return null;
  return (
    <div className="stat-drawer">
      <div className="stat-drawer-header">
        <Icon name={d.icon} /> <strong>{d.title}</strong>
        <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
      </div>
      <ul className="stat-drawer-list">
        {d.items.map((item, i) => (
          <li key={i} className="stat-drawer-item">
            <span className="stat-drawer-label">{item.label}</span>
            <span className="text-muted stat-drawer-sub">{item.sub}</span>
            {item.tag && <span className="pill pill-sm">{item.tag}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── OverviewTab ───────────────────────────────────────────────────────────────

function OverviewTab({ inc }) {
  const [drawerKey, setDrawerKey] = useState(null);
  const [editDesc, setEditDesc] = useState(false);
  const [desc, setDesc] = useState(inc.sub || 'High-pressure gas release during routine valve maintenance. Trigger event identified as over-pressurisation of the manifold due to a blocked condensate drain. No injuries reported; facility evacuated as precaution.');

  const stats = [
    { key: 'evidence', label: 'Evidence Items',       value: EVIDENCE_INIT.length },
    { key: 'timeline', label: 'Timeline Events',      value: TIMELINE_INIT.length },
    { key: 'whys',     label: '5 Whys Steps',         value: FIVE_WHYS_INIT.length },
    { key: 'factors',  label: 'ICAM Factors',         value: ICAM_FACTORS_INIT.length },
    { key: 'actions',  label: 'Corrective Actions',   value: ACTIONS_INIT.length },
  ];

  return (
    <div className="tab-body">
      <div className="overview-grid">
        <section className="card overview-desc">
          <div className="card-header">
            <h3>Incident Description</h3>
            <button className="btn-ghost" onClick={() => setEditDesc(v => !v)}>
              <Icon name="edit" /> {editDesc ? 'Save' : 'Edit'}
            </button>
          </div>
          {editDesc
            ? <textarea className="field-input" rows={5} value={desc} onChange={e => setDesc(e.target.value)} />
            : <p className="overview-desc-text">{desc}</p>
          }
        </section>

        <section className="card overview-signoff">
          <div className="card-header"><h3>Sign-off Status</h3></div>
          <ul className="signoff-list">
            {SIGNOFF.map(s => (
              <li key={s.role} className="signoff-item">
                <Avatar initials={s.init} size={28} />
                <div>
                  <div className="signoff-name">{s.name}</div>
                  <div className="text-muted">{s.role}</div>
                </div>
                <StatusPill status={s.status === 'signed' ? 'complete' : s.status} />
              </li>
            ))}
          </ul>
        </section>

        <section className="card overview-stats">
          <div className="card-header"><h3>Investigation Progress</h3></div>
          <div className="stat-grid">
            {stats.map(s => (
              <button key={s.key} className={`stat-tile ${drawerKey === s.key ? 'active' : ''}`} onClick={() => setDrawerKey(drawerKey === s.key ? null : s.key)}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </button>
            ))}
          </div>
          {drawerKey && <StatDrawer statKey={drawerKey} onClose={() => setDrawerKey(null)} />}
        </section>

        <section className="card overview-meta">
          <div className="card-header"><h3>Incident Details</h3></div>
          <dl className="meta-dl">
            <dt>Severity</dt>        <dd><SevTag level={inc.severity} /></dd>
            <dt>Opened</dt>          <dd>{inc.opened}</dd>
            <dt>Platform</dt>        <dd>{inc.platform}</dd>
            <dt>Lead Investigator</dt><dd>{inc.lead?.name}</dd>
            <dt>Phase</dt>           <dd>{inc.phase}</dd>
            <dt>Status</dt>          <dd><StatusPill status={inc.status} /></dd>
            <dt>Report Due</dt>      <dd>{inc.due}</dd>
          </dl>
        </section>
      </div>
    </div>
  );
}

// ── InvestigationProgress (phase nav) ─────────────────────────────────────────

function InvestigationProgress({ activeTab, setActiveTab, analysisMethod, setAnalysisMethod }) {
  const phases = [
    { label: 'Data Collection', tabs: ['Timeline', 'Evidence'], icon: 'clock' },
    { label: 'Analysis',        tabs: ['5 Whys', 'ICAM', 'HFAT', 'PEEPO'], icon: 'branch' },
    { label: 'Interviews',      tabs: ['Interviews'], icon: 'interviews' },
    { label: 'Actions',         tabs: ['Actions'], icon: 'check' },
    { label: 'Report',          tabs: ['Report'], icon: 'download' },
  ];

  const methods = ['5 Whys', 'ICAM', 'HFAT', 'PEEPO'];

  return (
    <aside className="inv-progress">
      <h4 className="inv-progress-title">Investigation Phases</h4>
      {phases.map(ph => {
        const isActive = ph.tabs.includes(activeTab);
        return (
          <button key={ph.label} className={`phase-card ${isActive ? 'active' : ''}`} onClick={() => setActiveTab(ph.tabs[0])}>
            <Icon name={ph.icon} />
            <span>{ph.label}</span>
          </button>
        );
      })}
      <div className="method-toggle-group">
        <h4 className="inv-progress-title">Analysis Method</h4>
        {methods.map(m => (
          <label key={m} className="method-toggle">
            <input
              type="checkbox"
              checked={analysisMethod.includes(m)}
              onChange={() => setAnalysisMethod(prev =>
                prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
              )}
            />
            <span>{m}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}

// ── AIProposalsModal ──────────────────────────────────────────────────────────

function AIProposalsModal({ title, proposals, onAccept, onClose, renderItem }) {
  const [stage, setStage] = useState('review'); // review | analyzing | results
  const [selected, setSelected] = useState(proposals.map(p => p.id));

  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleAnalyze = () => {
    setStage('analyzing');
    setTimeout(() => setStage('results'), 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <AiSparkle /> <h3>{title}</h3>
          <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
        </div>

        {stage === 'review' && (
          <>
            <div className="modal-body">
              <p className="text-muted mb-3">Review AI-suggested items. Deselect any you want to exclude.</p>
              <ul className="proposal-list">
                {proposals.map(p => (
                  <li key={p.id} className={`proposal-item ${selected.includes(p.id) ? 'selected' : ''}`} onClick={() => toggle(p.id)}>
                    <input type="checkbox" checked={selected.includes(p.id)} readOnly />
                    <div>{renderItem(p)}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAnalyze}>
                <AiSparkle /> Analyze Selected
              </button>
            </div>
          </>
        )}

        {stage === 'analyzing' && (
          <div className="modal-body modal-center">
            <div className="ai-spinner" />
            <p className="text-muted mt-3">Analyzing evidence…</p>
          </div>
        )}

        {stage === 'results' && (
          <>
            <div className="modal-body">
              <p className="text-muted mb-3">Analysis complete. Accept proposals to add them.</p>
              <ul className="proposal-list">
                {proposals.filter(p => selected.includes(p.id)).map(p => (
                  <li key={p.id} className="proposal-item selected">
                    {renderItem(p)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { onAccept(proposals.filter(p => selected.includes(p.id))); onClose(); }}>
                Accept &amp; Add
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── InsufficientEvidenceModal ─────────────────────────────────────────────────

function InsufficientEvidenceModal({ issues, onClose, onProceed }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <Icon name="shield" className="text-warning" /> <h3>Evidence Gaps Detected</h3>
          <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="modal-body">
          <p className="text-muted mb-3">Before running AI analysis, the following gaps should be addressed:</p>
          <ul className="gap-list">
            {issues.map((iss, i) => <li key={i} className="gap-item"><Icon name="off" className="text-danger" /> {iss}</li>)}
          </ul>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Go Back</button>
          <button className="btn btn-warning" onClick={onProceed}>Proceed Anyway</button>
        </div>
      </div>
    </div>
  );
}

// ── AIEvidenceModal (timeline) ────────────────────────────────────────────────

function AIEvidenceModal({ onClose }) {
  const [stage, setStage] = useState('analyzing');
  setTimeout(() => { if (stage === 'analyzing') setStage('results'); }, 1800);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <AiSparkle /> <h3>AI Timeline Analysis</h3>
          <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
        </div>
        {stage === 'analyzing'
          ? <div className="modal-body modal-center"><div className="ai-spinner" /><p className="text-muted mt-3">Analyzing evidence…</p></div>
          : (
            <>
              <div className="modal-body">
                <p className="text-muted mb-3">Proposed timeline additions from evidence analysis:</p>
                <ul className="proposal-list">
                  {TIMELINE_AI_PROPOSALS.map(p => (
                    <li key={p.id} className="proposal-item selected">
                      <strong>{p.time}</strong> — {p.title}
                      <p className="text-muted">{p.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={onClose}>Dismiss</button>
                <button className="btn btn-primary" onClick={onClose}>Add to Timeline</button>
              </div>
            </>
          )
        }
      </div>
    </div>
  );
}

// ── TimelineTab ───────────────────────────────────────────────────────────────

function AddTimelineModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ time: '', title: '', desc: '', type: 'Action', source: 'Manual' });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Timeline Event</h3>
          <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="modal-body">
          <Field label="Time" v={form.time} set={set('time')} placeholder="e.g. 08:45" />
          <Field label="Event Title" v={form.title} set={set('title')} placeholder="Brief description" />
          <Field label="Details" v={form.desc} set={set('desc')} rows={3} />
          <Field label="Type" v={form.type} set={set('type')} type="select" options={['Action', 'Observation', 'Decision', 'Procedure', 'Human Factor']} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onAdd({ ...form, id: Date.now().toString() }); onClose(); }}>Add Event</button>
        </div>
      </div>
    </div>
  );
}

function ExportMenu({ onClose }) {
  const downloadHtml = (content, filename) => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportWord = () => {
    const html = `<html><body><h1>Timeline Export</h1><p>Generated ${new Date().toLocaleString()}</p></body></html>`;
    downloadHtml(html, 'timeline.doc');
    onClose();
  };

  const exportExcel = () => {
    const csv = 'Time,Title,Type,Source\n' + TIMELINE_INIT.map(e => `${e.time},"${e.title}",${e.type},${e.source}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'timeline.csv'; a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="dropdown-menu export-menu">
      <button className="dropdown-item" onClick={exportWord}><Icon name="download" /> Export as Word</button>
      <button className="dropdown-item" onClick={exportExcel}><Icon name="download" /> Export as Excel / CSV</button>
    </div>
  );
}

function TimelineTab({ evidence }) {
  const flattened = TIMELINE_INIT.flatMap(d => (d.events || []).map(e => ({ ...e, day: d.day, time: e.t || e.time, type: e.kind || e.type || 'Action', source: e.sub || e.source || '', desc: e.sub || e.desc || '' })));
  const [events, setEvents] = useState(flattened);
  const [showAdd, setShowAdd] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showInsuff, setShowInsuff] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [shiftToast, setShiftToast] = useState(false);

  const addEvent = ev => {
    setEvents(prev => [...prev, ev].sort((a, b) => (a.time || '').localeCompare(b.time || '')));
  };

  const handleAI = () => {
    const issues = evidenceSufficiency(evidence, events, [], []);
    if (issues.length > 0) setShowInsuff(true);
    else setShowAI(true);
  };

  const handleDragStart = i => setDragIdx(i);
  const handleDrop = j => {
    if (dragIdx === null || dragIdx === j) return;
    const updated = [...events];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(j, 0, moved);
    setEvents(updated);
    setDragIdx(null);
    setShiftToast(true);
    setTimeout(() => setShiftToast(false), 3000);
  };

  const typeColors = { Action: 'var(--clr-accent)', Observation: 'var(--clr-sev-low)', Decision: 'var(--clr-sev-med)', Procedure: 'var(--clr-sev-high)', 'Human Factor': 'var(--clr-sev-critical)' };

  return (
    <div className="tab-body">
      {shiftToast && (
        <div className="toast toast-warning">
          <Icon name="clock" /> Time-ordering may have changed — verify timestamps after reordering.
        </div>
      )}
      <div className="tab-toolbar">
        <h3>Incident Timeline</h3>
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={() => setShowAdd(true)}><Icon name="plus" /> Add Event</button>
          <button className="btn btn-ai" onClick={handleAI}><AiSparkle /> AI Suggest</button>
          <div className="dropdown-wrap">
            <button className="btn btn-ghost" onClick={() => setShowExport(v => !v)}><Icon name="download" /> Export</button>
            {showExport && <ExportMenu onClose={() => setShowExport(false)} />}
          </div>
        </div>
      </div>

      <div className="timeline-track">
        {events.map((ev, i) => (
          <div
            key={ev.id}
            className={`timeline-event ${dragIdx === i ? 'dragging' : ''}`}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(i)}
          >
            <div className="timeline-dot" style={{ background: typeColors[ev.type] || 'var(--clr-accent)' }} />
            <div className="timeline-content">
              <div className="timeline-time">{ev.time}</div>
              <div className="timeline-title">{ev.title}</div>
              {ev.desc && <div className="timeline-desc text-muted">{ev.desc}</div>}
              <div className="timeline-meta">
                <span className="pill pill-sm">{ev.type}</span>
                <span className="text-muted">{ev.source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && <AddTimelineModal onAdd={addEvent} onClose={() => setShowAdd(false)} />}
      {showInsuff && <InsufficientEvidenceModal issues={evidenceSufficiency(evidence, events, [], [])} onClose={() => setShowInsuff(false)} onProceed={() => { setShowInsuff(false); setShowAI(true); }} />}
      {showAI && <AIEvidenceModal onClose={() => setShowAI(false)} />}
    </div>
  );
}

// ── FiveWhysTab ───────────────────────────────────────────────────────────────

function FiveWhysEditModal({ step, onSave, onClose }) {
  const [text, setText] = useState(step.text);
  const [verified, setVerified] = useState(step.verified);
  const [evidence, setEvidence] = useState(step.evidence || '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Why Step</h3>
          <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="modal-body">
          <Field label="Why Statement" v={text} set={setText} rows={3} />
          <Field label="Verification Status" v={verified} set={setVerified} type="select" options={['Verified', 'Unverified', 'Hypothesis']} />
          <Field label="Supporting Evidence" v={evidence} set={setEvidence} placeholder="Reference evidence items…" />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSave({ ...step, text, verified, evidence }); onClose(); }}>Save</button>
        </div>
      </div>
    </div>
  );
}

function FiveWhysTab({ evidence, timeline }) {
  const [whys, setWhys] = useState(FIVE_WHYS_INIT);
  const [problem, setProblem] = useState(FW_PROBLEM?.statement || '');
  const [editStep, setEditStep] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [showInsuff, setShowInsuff] = useState(false);
  const [rootConfirmed, setRootConfirmed] = useState(false);

  const verifyMeta = FW_VERIFY_META;

  const updateWhy = updated => setWhys(prev => prev.map(w => w.id === updated.id ? updated : w));

  const handleAI = () => {
    const issues = evidenceSufficiency(evidence, timeline, whys, []);
    if (issues.length > 0) setShowInsuff(true);
    else setShowAI(true);
  };

  const acceptProposals = proposals => {
    const newWhys = proposals.map((p, i) => ({
      id: `fw-new-${i}`, text: p.text, verified: 'Hypothesis', evidence: ''
    }));
    setWhys(prev => [...prev, ...newWhys]);
  };

  const badgeClass = v => v === 'Verified' ? 'badge-verified' : v === 'Hypothesis' ? 'badge-hypothesis' : 'badge-unverified';

  return (
    <div className="tab-body">
      <div className="tab-toolbar">
        <h3>5 Whys Analysis</h3>
        <button className="btn btn-ai" onClick={handleAI}><AiSparkle /> AI Suggest</button>
      </div>

      <div className="card fw-problem">
        <label className="field-label">Problem Statement</label>
        <Field v={problem} set={setProblem} rows={2} />
      </div>

      <div className="fw-chain">
        {whys.map((w, i) => {
          const verLabel = w.verification ? w.verification.charAt(0).toUpperCase() + w.verification.slice(1) : (w.verified || 'Unverified');
          const evList = Array.isArray(w.evidence) ? w.evidence.join(', ') : w.evidence;
          return (
            <div key={w.id || w.n || i} className="fw-step">
              <div className="fw-step-num">Why {w.n || (i + 1)} — {w.q || w.text}</div>
              <div className="fw-step-body card">
                <p>{w.a || w.text}</p>
                <div className="fw-step-footer">
                  <span className={`badge ${badgeClass(verLabel)}`}>{verLabel}</span>
                  {evList && <span className="text-muted">→ {evList}</span>}
                  <button className="btn-ghost ml-auto" onClick={() => setEditStep(w)}><Icon name="edit" /></button>
                </div>
              </div>
              {i < whys.length - 1 && <div className="fw-arrow"><Icon name="arrow" style={{ transform: 'rotate(90deg)' }} /></div>}
            </div>
          );
        })}
      </div>

      {verifyMeta && (
        <div className="card fw-verify-meta">
          <h4>Verification Summary</h4>
          <p className="text-muted">{Object.values(verifyMeta).map(v => v.desc).join(' · ')}</p>
          <label className="method-toggle fw-confirm">
            <input type="checkbox" checked={rootConfirmed} onChange={e => setRootConfirmed(e.target.checked)} />
            <span>Root cause confirmed and documented</span>
          </label>
        </div>
      )}

      {editStep && <FiveWhysEditModal step={editStep} onSave={updateWhy} onClose={() => setEditStep(null)} />}
      {showInsuff && (
        <InsufficientEvidenceModal
          issues={evidenceSufficiency(evidence, timeline, whys, [])}
          onClose={() => setShowInsuff(false)}
          onProceed={() => { setShowInsuff(false); setShowAI(true); }}
        />
      )}
      {showAI && (
        <AIProposalsModal
          title="AI 5 Whys Suggestions"
          proposals={FW_AI_PROPOSALS}
          onAccept={acceptProposals}
          onClose={() => setShowAI(false)}
          renderItem={p => <span>{p.text}</span>}
        />
      )}
    </div>
  );
}

// ── HfatTab ───────────────────────────────────────────────────────────────────

function HfatTab({ evidence, timeline }) {
  const [showAI, setShowAI] = useState(false);
  const [showInsuff, setShowInsuff] = useState(false);

  const handleAI = () => {
    const issues = evidenceSufficiency(evidence, timeline, [], []);
    if (issues.length > 0) setShowInsuff(true);
    else setShowAI(true);
  };

  const levelColor = l => ({ high: 'var(--clr-sev-critical)', medium: 'var(--clr-sev-med)', low: 'var(--clr-sev-low)' }[l] || 'var(--clr-text-3)');

  return (
    <div className="tab-body">
      <div className="tab-toolbar">
        <h3>miniHFAT Analysis</h3>
        <button className="btn btn-ai" onClick={handleAI}><AiSparkle /> AI Suggest</button>
      </div>

      <div className="card hfat-section">
        <div className="hfat-section-header" style={{ borderLeftColor: 'var(--clr-sev-critical)' }}>
          <h4>Action Error</h4>
        </div>
        <div className="hfat-items">
          <div className="hfat-item"><span className="hfat-item-label">Type</span><span>{HFAT_DATA.actionError.type}</span></div>
          <div className="hfat-item"><span className="hfat-item-label">Actor</span><span>{HFAT_DATA.actionError.actor}</span></div>
          <div className="hfat-item"><span className="hfat-item-label">Classification</span><span>{HFAT_DATA.actionError.classification}</span></div>
          <div className="hfat-item"><span className="hfat-item-label">Description</span><span className="text-muted">{HFAT_DATA.actionError.desc}</span></div>
        </div>
      </div>

      <div className="card hfat-section">
        <div className="hfat-section-header" style={{ borderLeftColor: 'var(--clr-sev-high)' }}>
          <h4>Error Recovery</h4>
        </div>
        <div className="hfat-items">
          <div className="hfat-item"><span className="hfat-item-label">Opportunity</span><span className="text-muted">{HFAT_DATA.recovery.opportunity}</span></div>
          <div className="hfat-item"><span className="hfat-item-label">Barrier</span><span className="text-muted">{HFAT_DATA.recovery.barrier}</span></div>
          <div className="hfat-item"><span className="hfat-item-label">Outcome</span><span className="text-muted">{HFAT_DATA.recovery.outcome}</span></div>
        </div>
      </div>

      <div className="card hfat-section">
        <div className="hfat-section-header" style={{ borderLeftColor: 'var(--clr-sev-med)' }}>
          <h4>Cognitive Stage</h4>
        </div>
        <div className="hfat-items">
          {HFAT_DATA.cognition.map(c => (
            <div key={c.stage} className="hfat-item">
              <span className="hfat-item-label">{c.stage}</span>
              <span className={`badge ${c.finding === 'Adequate' ? 'badge-verified' : c.finding === 'Inadequate' ? 'badge-unverified' : 'badge-hypothesis'}`}>{c.finding}</span>
              <span className="text-muted">{c.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card hfat-section">
        <div className="hfat-section-header" style={{ borderLeftColor: 'var(--clr-accent)' }}>
          <h4>Performance-Shaping Conditions</h4>
        </div>
        <div className="hfat-items">
          {HFAT_DATA.conditions.map(c => (
            <div key={c.cat} className="hfat-item">
              <span className="hfat-item-label">{c.cat}</span>
              <span className="badge" style={{ background: levelColor(c.level), color: '#fff' }}>{c.level}</span>
              <span className="text-muted">{c.note}</span>
            </div>
          ))}
        </div>
      </div>

      {showInsuff && (
        <InsufficientEvidenceModal
          issues={evidenceSufficiency(evidence, timeline, [], [])}
          onClose={() => setShowInsuff(false)}
          onProceed={() => { setShowInsuff(false); setShowAI(true); }}
        />
      )}
      {showAI && (
        <AIProposalsModal
          title="AI miniHFAT Suggestions"
          proposals={HFAT_AI_PROPOSALS}
          onAccept={() => {}}
          onClose={() => setShowAI(false)}
          renderItem={p => <span><strong>{p.stage}:</strong> {p.text}</span>}
        />
      )}
    </div>
  );
}

// ── ICAM Tab ──────────────────────────────────────────────────────────────────

function IcamFactorModal({ factor, onSave, onClose }) {
  const [text, setText] = useState(factor ? factor.text : '');
  const [col, setCol] = useState(factor ? factor.col : 'Absent / Failed Defences');
  const [evidence, setEvidence] = useState(factor ? factor.evidence || '' : '');
  const cols = ['Absent / Failed Defences', 'Individual / Team Actions', 'Task / Environment Conditions', 'Organisational Factors'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{factor ? 'Edit Factor' : 'Add ICAM Factor'}</h3>
          <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="modal-body">
          <Field label="Category" v={col} set={setCol} type="select" options={cols} />
          <Field label="Factor Description" v={text} set={setText} rows={3} />
          <Field label="Linked Evidence" v={evidence} set={setEvidence} placeholder="Reference evidence items…" />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSave({ id: factor?.id || Date.now().toString(), text, col, evidence }); onClose(); }}>
            {factor ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

const ICAM_COLS = ['Absent / Failed Defences', 'Individual / Team Actions', 'Task / Environment Conditions', 'Organisational Factors'];

function PeepoChart({ peepo, setPeepo }) {
  const activeCol = PEEPO_COLS[0];
  return (
    <div className="peepo-chart">
      {PEEPO_COLS.map(col => (
        <div key={col} className="peepo-col">
          <div className="peepo-col-header">{col}</div>
          <div className="peepo-pass">
            <label className="field-label">Pass 1 — What happened?</label>
            <textarea
              className="field-input"
              rows={3}
              value={peepo[col]?.pass1 || ''}
              onChange={e => setPeepo(prev => ({ ...prev, [col]: { ...prev[col], pass1: e.target.value } }))}
            />
          </div>
          <div className="peepo-pass">
            <label className="field-label">Pass 2 — Why?</label>
            <textarea
              className="field-input"
              rows={3}
              value={peepo[col]?.pass2 || ''}
              onChange={e => setPeepo(prev => ({ ...prev, [col]: { ...prev[col], pass2: e.target.value } }))}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PeepoQuestionModal({ question, onSave, onClose }) {
  const [a, setA] = useState(question.a || '');
  const [evidence, setEvidence] = useState(question.evidence || '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Answer Question</h3>
          <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="modal-body">
          <p className="field-label">{question.q}</p>
          <Field label="Answer" v={a} set={setA} rows={4} />
          <Field label="Evidence Reference" v={evidence} set={setEvidence} placeholder="Link to evidence items…" />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSave({ ...question, a, evidence }); onClose(); }}>Save Answer</button>
        </div>
      </div>
    </div>
  );
}

function PeepoQuestions({ questions, setQuestions }) {
  const [activeCol, setActiveCol] = useState('People');
  const [editQ, setEditQ] = useState(null);

  const saveQ = updated => setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q));

  return (
    <div className="peepo-questions">
      <div className="peepo-q-tabs">
        {PEEPO_COLS.map(col => (
          <button key={col} className={`peepo-q-tab ${activeCol === col ? 'active' : ''}`} onClick={() => setActiveCol(col)}>
            {col}
            <span className="peepo-q-count">
              {questions.filter(q => q.col === col && q.a).length}/{questions.filter(q => q.col === col).length}
            </span>
          </button>
        ))}
      </div>
      <ul className="peepo-q-list">
        {questions.filter(q => q.col === activeCol).map(q => (
          <li key={q.id} className={`peepo-q-item ${q.a ? 'answered' : ''}`} onClick={() => setEditQ(q)}>
            <Icon name={q.a ? 'check' : 'plus'} className={q.a ? 'text-success' : 'text-muted'} />
            <span className="peepo-q-text">{q.q}</span>
            {q.a && <span className="text-muted peepo-q-answer">{q.a.slice(0, 60)}…</span>}
          </li>
        ))}
      </ul>
      {editQ && <PeepoQuestionModal question={editQ} onSave={saveQ} onClose={() => setEditQ(null)} />}
    </div>
  );
}

function IcamTab({ evidence, timeline, whys }) {
  const [factors, setFactors] = useState(ICAM_FACTORS_INIT);
  const [peepo, setPeepo] = useState(PEEPO_INIT);
  const [peepoQuestions, setPeepoQuestions] = useState(PEEPO_QUESTIONS_INIT);
  const [editFactor, setEditFactor] = useState(null);
  const [addingFactor, setAddingFactor] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showInsuff, setShowInsuff] = useState(false);
  const [peepoView, setPeepoView] = useState('chart'); // chart | questions

  const handleAI = () => {
    const issues = evidenceSufficiency(evidence, timeline, whys, factors);
    if (issues.length > 0) setShowInsuff(true);
    else setShowAI(true);
  };

  const acceptFactors = proposals => {
    setFactors(prev => [...prev, ...proposals.map(p => ({ id: p.id, text: p.text, col: p.col, evidence: '' }))]);
  };

  const saveFactor = f => setFactors(prev =>
    prev.some(x => x.id === f.id) ? prev.map(x => x.id === f.id ? f : x) : [...prev, f]
  );

  const deleteFactor = id => setFactors(prev => prev.filter(f => f.id !== id));

  return (
    <div className="tab-body">
      <div className="tab-toolbar">
        <h3>ICAM Analysis</h3>
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={() => setAddingFactor(true)}><Icon name="plus" /> Add Factor</button>
          <button className="btn btn-ai" onClick={handleAI}><AiSparkle /> AI Suggest</button>
        </div>
      </div>

      <div className="icam-grid">
        {ICAM_COLS.map((col, idx) => {
          const kindMap = ['defence', 'action', 'condition', 'org'];
          const kindFor = kindMap[idx];
          const colFactors = factors.filter(f => (f.col === col) || (f.kind === kindFor));
          return (
            <div key={col} className="icam-col card">
              <div className="icam-col-header"><h4>{col}</h4></div>
              <ul className="icam-factor-list">
                {colFactors.map(f => (
                  <li key={f.id} className="icam-factor-item">
                    <span>{f.text || f.title}</span>
                    <div className="icam-factor-actions">
                      <button className="btn-ghost" onClick={() => setEditFactor(f)}><Icon name="edit" /></button>
                      <button className="btn-ghost text-danger" onClick={() => deleteFactor(f.id)}><Icon name="x" /></button>
                    </div>
                  </li>
                ))}
                {colFactors.length === 0 && (
                  <li className="icam-factor-empty text-muted">No factors added</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="tab-toolbar mt-6">
        <h3>PEEPO Chart</h3>
        <div className="btn-row">
          <button className={`btn btn-ghost ${peepoView === 'chart' ? 'active' : ''}`} onClick={() => setPeepoView('chart')}>Chart View</button>
          <button className={`btn btn-ghost ${peepoView === 'questions' ? 'active' : ''}`} onClick={() => setPeepoView('questions')}>Q&amp;A View</button>
        </div>
      </div>

      {peepoView === 'chart'
        ? <PeepoChart peepo={peepo} setPeepo={setPeepo} />
        : <PeepoQuestions questions={peepoQuestions} setQuestions={setPeepoQuestions} />
      }

      {(editFactor || addingFactor) && (
        <IcamFactorModal
          factor={editFactor}
          onSave={saveFactor}
          onClose={() => { setEditFactor(null); setAddingFactor(false); }}
        />
      )}
      {showInsuff && (
        <InsufficientEvidenceModal
          issues={evidenceSufficiency(evidence, timeline, whys, factors)}
          onClose={() => setShowInsuff(false)}
          onProceed={() => { setShowInsuff(false); setShowAI(true); }}
        />
      )}
      {showAI && (
        <AIProposalsModal
          title="AI ICAM Suggestions"
          proposals={ICAM_AI_PROPOSALS}
          onAccept={acceptFactors}
          onClose={() => setShowAI(false)}
          renderItem={p => <span><strong>{p.col}:</strong> {p.text}</span>}
        />
      )}
    </div>
  );
}

// ── EvidenceTab ───────────────────────────────────────────────────────────────

function AddEvidenceModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ title: '', type: 'Document', status: 'Pending', desc: '' });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Evidence</h3>
          <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="modal-body">
          <Field label="Title" v={form.title} set={set('title')} placeholder="Evidence item name" />
          <Field label="Type" v={form.type} set={set('type')} type="select" options={['Document', 'Photo', 'Video', 'Statement', 'Record', 'Physical']} />
          <Field label="Status" v={form.status} set={set('status')} type="select" options={['Pending', 'Verified', 'Disputed']} />
          <Field label="Description" v={form.desc} set={set('desc')} rows={3} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onAdd({ ...form, id: Date.now().toString() }); onClose(); }}>Add Evidence</button>
        </div>
      </div>
    </div>
  );
}

function EvidenceGapsModal({ evidence, onClose }) {
  const gaps = [
    'No witness statement linked to equipment failure event',
    'Maintenance records not yet verified',
    'CCTV footage period not covered',
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <AiSparkle /> <h3>Evidence Gap Analysis</h3>
          <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="modal-body">
          <p className="text-muted mb-3">AI-identified gaps in current evidence collection:</p>
          <ul className="gap-list">
            {gaps.map((g, i) => (
              <li key={i} className="gap-item">
                <Icon name="off" className="text-warning" /> {g}
              </li>
            ))}
          </ul>
          <div className="evidence-summary mt-4">
            <div className="evidence-stat"><strong>{evidence.filter(e => e.status === 'Verified').length}</strong><span>Verified</span></div>
            <div className="evidence-stat"><strong>{evidence.filter(e => e.status === 'Pending').length}</strong><span>Pending</span></div>
            <div className="evidence-stat"><strong>{evidence.filter(e => e.status === 'Disputed').length}</strong><span>Disputed</span></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function EvidenceTab() {
  const [evidence, setEvidence] = useState(EVIDENCE_INIT);
  const [showAdd, setShowAdd] = useState(false);
  const [showGaps, setShowGaps] = useState(false);
  const [filter, setFilter] = useState('All');

  const statusOptions = ['All', 'Verified', 'Pending', 'Disputed'];
  const filtered = filter === 'All' ? evidence : evidence.filter(e => e.status === filter);

  const addEvidence = ev => setEvidence(prev => [...prev, ev]);

  return (
    <div className="tab-body">
      <div className="tab-toolbar">
        <h3>Evidence Register</h3>
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={() => setShowAdd(true)}><Icon name="plus" /> Add Evidence</button>
          <button className="btn btn-ai" onClick={() => setShowGaps(true)}><AiSparkle /> Gap Analysis</button>
        </div>
      </div>

      <div className="filter-row">
        {statusOptions.map(s => (
          <button key={s} className={`filter-chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      <div className="evidence-grid">
        {filtered.map(ev => (
          <div key={ev.id} className="card evidence-card">
            <div className="evidence-card-header">
              <Icon name="link" />
              <strong>{ev.title}</strong>
              {ev.status && <StatusPill status={ev.status} />}
            </div>
            <div className="evidence-card-meta">
              <span className="pill pill-sm">{ev.type}</span>
              {(ev.when || ev.date) && <span className="text-muted">{ev.when || ev.date}</span>}
              {ev.by && <span className="text-muted">by {ev.by}</span>}
            </div>
            {ev.desc && <p className="text-muted evidence-desc">{ev.desc}</p>}
          </div>
        ))}
      </div>

      {showAdd && <AddEvidenceModal onAdd={addEvidence} onClose={() => setShowAdd(false)} />}
      {showGaps && <EvidenceGapsModal evidence={evidence} onClose={() => setShowGaps(false)} />}
    </div>
  );
}

// ── ActionsTab ────────────────────────────────────────────────────────────────

function HocGenerateModal({ onAdd, onClose }) {
  const [selected, setSelected] = useState([]);
  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <AiSparkle /> <h3>Hierarchy of Control — Generate Actions</h3>
          <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="modal-body">
          <div className="hoc-levels">
            {HOC_LEVELS.map(lvl => (
              <div key={lvl.id} className="hoc-level" style={{ borderLeftColor: lvl.color }}>
                <Icon name={lvl.icon} style={{ color: lvl.color }} />
                <strong>{lvl.label}</strong>
              </div>
            ))}
          </div>
          <p className="text-muted mt-3 mb-3">AI-proposed corrective actions:</p>
          <ul className="proposal-list">
            {HOC_PROPOSALS.map(p => (
              <li key={p.id} className={`proposal-item ${selected.includes(p.id) ? 'selected' : ''}`} onClick={() => toggle(p.id)}>
                <input type="checkbox" checked={selected.includes(p.id)} readOnly />
                <div>
                  <div><span className="pill pill-sm">{p.level}</span> {p.title}</div>
                  <div className="text-muted">Owner: {p.owner} · Due: {p.due}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            onAdd(HOC_PROPOSALS.filter(p => selected.includes(p.id)).map(p => ({ ...p, id: Date.now().toString() + p.id, status: 'Open' })));
            onClose();
          }}>Add Selected Actions</button>
        </div>
      </div>
    </div>
  );
}

function ActionEditModal({ action, onSave, onClose }) {
  const [form, setForm] = useState(action || { title: '', owner: '', due: '', status: 'Open', level: 'Administrative', desc: '' });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{action ? 'Edit Action' : 'New Action'}</h3>
          <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="modal-body">
          <Field label="Action Title" v={form.title} set={set('title')} />
          <Field label="Owner" v={form.owner} set={set('owner')} />
          <Field label="Due Date" v={form.due} set={set('due')} type="date" />
          <Field label="Control Level" v={form.level} set={set('level')} type="select" options={HOC_LEVELS.map(l => l.label)} />
          <Field label="Status" v={form.status} set={set('status')} type="select" options={['Open', 'In Progress', 'Completed', 'Overdue']} />
          <Field label="Description" v={form.desc} set={set('desc')} rows={3} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSave({ ...form, id: form.id || Date.now().toString() }); onClose(); }}>
            {action ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionsTab() {
  const [actions, setActions] = useState(ACTIONS_INIT);
  const [editAction, setEditAction] = useState(null);
  const [addingAction, setAddingAction] = useState(false);
  const [showHoc, setShowHoc] = useState(false);

  const saveAction = a => setActions(prev =>
    prev.some(x => x.id === a.id) ? prev.map(x => x.id === a.id ? a : x) : [...prev, a]
  );
  const addActions = newActions => setActions(prev => [...prev, ...newActions]);

  const statusColor = s => ({ Open: 'var(--clr-sev-med)', 'In Progress': 'var(--clr-accent)', Completed: 'var(--clr-sev-low)', Overdue: 'var(--clr-sev-critical)' }[s] || 'var(--clr-text-3)');

  return (
    <div className="tab-body">
      <div className="tab-toolbar">
        <h3>Corrective Actions</h3>
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={() => setAddingAction(true)}><Icon name="plus" /> New Action</button>
          <button className="btn btn-ai" onClick={() => setShowHoc(true)}><AiSparkle /> HOC Generate</button>
        </div>
      </div>

      <div className="actions-list">
        {actions.map(a => {
          const status = a.status || a.col || 'open';
          return (
          <div key={a.id} className="card action-card">
            <div className="action-card-header">
              <div className="action-status-dot" style={{ background: statusColor(status) }} />
              <strong>{a.title}</strong>
              <StatusPill status={status} />
              <button className="btn-ghost ml-auto" onClick={() => setEditAction(a)}><Icon name="edit" /></button>
            </div>
            <div className="action-card-meta">
              <span className="text-muted"><Icon name="pin" /> {a.ownerName || a.owner}</span>
              <span className="text-muted"><Icon name="clock" /> {a.due}</span>
              {(a.level || a.priority) && <span className="pill pill-sm">{a.level || a.priority}</span>}
            </div>
            {a.desc && <p className="text-muted">{a.desc}</p>}
          </div>
          );
        })}
      </div>

      {(editAction || addingAction) && (
        <ActionEditModal
          action={editAction}
          onSave={saveAction}
          onClose={() => { setEditAction(null); setAddingAction(false); }}
        />
      )}
      {showHoc && <HocGenerateModal onAdd={addActions} onClose={() => setShowHoc(false)} />}
    </div>
  );
}

// ── ReportTab ─────────────────────────────────────────────────────────────────

function ReportTab({ inc }) {
  const sections = [
    { id: 'executive', label: 'Executive Summary', complete: true },
    { id: 'timeline',  label: 'Incident Timeline',  complete: true },
    { id: 'analysis',  label: 'Root Cause Analysis', complete: false },
    { id: 'actions',   label: 'Corrective Actions',  complete: false },
    { id: 'signoff',   label: 'Sign-off & Approval', complete: false },
  ];

  const downloadReport = () => {
    const html = `<html><body><h1>Incident Investigation Report</h1><h2>${inc.title}</h2><p>Date: ${inc.date}</p><p>Location: ${inc.location}</p><p>Lead: ${inc.lead}</p></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `report-${inc.id}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tab-body">
      <div className="tab-toolbar">
        <h3>Investigation Report</h3>
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={downloadReport}><Icon name="download" /> Export Report</button>
        </div>
      </div>

      <div className="report-sections">
        {sections.map(s => (
          <div key={s.id} className={`card report-section ${s.complete ? 'complete' : ''}`}>
            <div className="report-section-header">
              <Icon name={s.complete ? 'check' : 'edit'} className={s.complete ? 'text-success' : 'text-muted'} />
              <strong>{s.label}</strong>
              {s.complete
                ? <span className="badge badge-verified">Complete</span>
                : <span className="badge badge-unverified">Pending</span>
              }
            </div>
          </div>
        ))}
      </div>

      <div className="card report-preview">
        <div className="card-header"><h3>Report Preview</h3></div>
        <div className="report-body">
          <h2>{inc.title}</h2>
          <p><strong>Date:</strong> {inc.date} | <strong>Location:</strong> {inc.location} | <strong>Lead:</strong> {inc.lead}</p>
          <h3>Executive Summary</h3>
          <p>A high-pressure gas release occurred during routine valve maintenance operations. The incident was triggered by over-pressurisation of the manifold due to a blocked condensate drain. No personnel injuries were reported. The facility was evacuated as a precautionary measure pending investigation.</p>
          <h3>Root Causes</h3>
          <p><em>Root cause analysis in progress — complete ICAM and 5 Whys sections to populate.</em></p>
        </div>
      </div>
    </div>
  );
}

// ── InterviewsTab ─────────────────────────────────────────────────────────────

function InterviewModal({ interview, evidence, onClose }) {
  const [questions, setQuestions] = useState(interview.questions || []);
  const [newQ, setNewQ] = useState('');
  const [showCogFlags, setShowCogFlags] = useState(false);
  const [stage, setStage] = useState('questions'); // questions | review | generating | generated

  const cogFlags = cogReview(questions);

  const addQ = () => {
    if (!newQ.trim()) return;
    setQuestions(prev => [...prev, { id: Date.now().toString(), text: newQ, source: 'Manual', answer: '' }]);
    setNewQ('');
  };

  const generateFromEvidence = () => {
    setStage('generating');
    setTimeout(() => {
      setQuestions(prev => [...prev, ...generateQuestionsFromEvidence(evidence)]);
      setStage('generated');
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-xl" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{interview.name}</h3>
            <span className="text-muted">{interview.role}</span>
          </div>
          <button className="btn-ghost ml-auto" onClick={onClose}><Icon name="x" /></button>
        </div>

        <div className="modal-body">
          <div className="cog-rules-bar">
            <span className="text-muted">Cognitive Interview Rules</span>
            <button className="btn-ghost" onClick={() => setShowCogFlags(v => !v)}>
              {showCogFlags ? 'Hide' : 'Show'} ({cogFlags.length} flags)
            </button>
          </div>

          {showCogFlags && (
            <div className="cog-rules-panel">
              {COG_RULES.map((r, i) => (
                <div key={i} className={`cog-rule ${cogFlags.some(f => f.rule === r) ? 'flagged' : ''}`}>
                  <Icon name={cogFlags.some(f => f.rule === r) ? 'off' : 'check'} />
                  {r}
                </div>
              ))}
            </div>
          )}

          <div className="interview-questions">
            {stage === 'generating' && (
              <div className="modal-center py-4"><div className="ai-spinner" /><p className="text-muted mt-2">Generating questions…</p></div>
            )}

            {stage !== 'generating' && questions.map((q, i) => (
              <div key={q.id} className="interview-q-item">
                <div className="interview-q-num">{i + 1}</div>
                <div className="interview-q-body">
                  <p className={cogFlags.some(f => f.index === i) ? 'text-warning' : ''}>{q.text}</p>
                  {cogFlags.filter(f => f.index === i).map(f => (
                    <span key={f.rule} className="cog-flag-badge"><Icon name="off" /> {f.rule}</span>
                  ))}
                  {q.source === 'AI' && <span className="pill pill-sm ai-pill">AI</span>}
                </div>
              </div>
            ))}

            {questions.length === 0 && stage !== 'generating' && (
              <p className="text-muted text-center py-4">No questions yet. Add manually or generate from evidence.</p>
            )}
          </div>

          <div className="interview-add-q">
            <input
              className="field-input"
              value={newQ}
              onChange={e => setNewQ(e.target.value)}
              placeholder="Type a question…"
              onKeyDown={e => e.key === 'Enter' && addQ()}
            />
            <button className="btn btn-ghost" onClick={addQ}><Icon name="plus" /></button>
            <button className="btn btn-ai" onClick={generateFromEvidence}><AiSparkle /> From Evidence</button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={onClose}>Save &amp; Close</button>
        </div>
      </div>
    </div>
  );
}

function InterviewsTab({ evidence }) {
  const [interviews, setInterviews] = useState(INTERVIEWS);
  const [activeInterview, setActiveInterview] = useState(null);

  return (
    <div className="tab-body">
      <div className="tab-toolbar">
        <h3>Witness Interviews</h3>
      </div>

      <div className="interviews-grid">
        {interviews.map(iv => (
          <div key={iv.id} className="card interview-card">
            <div className="interview-card-header">
              <Avatar initials={iv.name.split(' ').map(n => n[0]).join('').slice(0, 2)} size={36} />
              <div>
                <div className="interview-name">{iv.name}</div>
                <div className="text-muted">{iv.role}</div>
              </div>
              <StatusPill status={iv.status} />
            </div>
            <div className="interview-card-meta">
              {iv.date && <span className="text-muted"><Icon name="clock" /> {iv.date}</span>}
              <span className="text-muted">{iv.questions?.length || 0} questions</span>
            </div>
            <div className="interview-card-footer">
              <button className="btn btn-ghost" onClick={() => setActiveInterview(iv)}>
                <Icon name="interviews" /> Open Interview
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeInterview && (
        <InterviewModal
          interview={activeInterview}
          evidence={evidence}
          onClose={() => setActiveInterview(null)}
        />
      )}
    </div>
  );
}

// ── AnalysisDisabled / AnalysisMethodPicker ───────────────────────────────────

function AnalysisDisabled({ method }) {
  return (
    <div className="tab-body analysis-disabled">
      <div className="analysis-disabled-inner">
        <Icon name="off" className="analysis-disabled-icon" />
        <h3>{method} is disabled</h3>
        <p className="text-muted">Enable this analysis method in the Investigation Phases panel to use it.</p>
      </div>
    </div>
  );
}

// ── InvestigationView (root export) ──────────────────────────────────────────

export function InvestigationView({ inc, onBack }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [analysisMethod, setAnalysisMethod] = useState(['5 Whys', 'ICAM', 'HFAT', 'PEEPO']);
  const [evidence] = useState(EVIDENCE_INIT);
  const [timeline] = useState(TIMELINE_INIT);
  const [whys] = useState(FIVE_WHYS_INIT);

  const methodTabs = ['5 Whys', 'ICAM', 'HFAT', 'PEEPO'];

  const renderTab = () => {
    if (methodTabs.includes(activeTab) && !analysisMethod.includes(activeTab)) {
      return <AnalysisDisabled method={activeTab} />;
    }

    switch (activeTab) {
      case 'Overview':    return <OverviewTab inc={inc} />;
      case 'Timeline':    return <TimelineTab evidence={evidence} />;
      case '5 Whys':      return <FiveWhysTab evidence={evidence} timeline={timeline} />;
      case 'ICAM':        return <IcamTab evidence={evidence} timeline={timeline} whys={whys} />;
      case 'HFAT':        return <HfatTab evidence={evidence} timeline={timeline} />;
      case 'PEEPO':       return <IcamTab evidence={evidence} timeline={timeline} whys={whys} />;
      case 'Evidence':    return <EvidenceTab />;
      case 'Actions':     return <ActionsTab />;
      case 'Interviews':  return <InterviewsTab evidence={evidence} />;
      case 'Report':      return <ReportTab inc={inc} />;
      default:            return null;
    }
  };

  return (
    <div className="inv-layout view-enter">
      <InvHeader inc={inc} onBack={onBack} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="inv-body-wrap">
        <InvestigationProgress
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          analysisMethod={analysisMethod}
          setAnalysisMethod={setAnalysisMethod}
        />
        <main className="inv-main">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
