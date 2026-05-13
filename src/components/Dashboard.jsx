import { useState, Fragment } from 'react';
import { Icon, Avatar, Sparkline, SevTag, StatusPill, AssigneeStack } from './ui.jsx';
import { INCIDENTS, ACTIVITY, FACTOR_TRENDS, HEATMAP, SPARK } from '../data/index.js';

export const Sidebar = ({ route, setRoute }) => {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: "dashboard", count: null },
    { key: "investigations", label: "Investigations", icon: "folder", count: 12 },
    { key: "intake", label: "Intake queue", icon: "alert", count: 3 },
    { key: "actions", label: "Corrective actions", icon: "checklist", count: 28 },
    { key: "analytics", label: "Analytics", icon: "chart", count: null },
  ];
  const lib = [
    { key: "evidence", label: "Evidence library", icon: "evidence" },
    { key: "templates", label: "Templates & methods", icon: "clipboard" },
    { key: "reports", label: "Reports archive", icon: "report" },
    { key: "team", label: "Team", icon: "users" },
  ];
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-brand-mark">N</div>
        <div>
          <div className="sb-brand-title">Northgate HSE</div>
          <div className="sb-brand-sub">incident.portal · v4.2</div>
        </div>
      </div>
      <div className="sb-group">
        <div className="sb-group-title">Workspace</div>
        {items.map(it => (
          <div key={it.key}
            className={`sb-item ${route === it.key || (it.key === "investigations" && route === "investigation") ? "active" : ""}`}
            onClick={() => setRoute(it.key)}>
            <Icon name={it.icon}/>
            <span>{it.label}</span>
            {it.count != null && <span className="count">{it.count}</span>}
          </div>
        ))}
      </div>
      <div className="sb-group">
        <div className="sb-group-title">Library</div>
        {lib.map(it => (
          <div key={it.key} className="sb-item" onClick={() => setRoute(it.key)}>
            <Icon name={it.icon}/>
            <span>{it.label}</span>
          </div>
        ))}
      </div>
      <div className="sb-footer">
        <Avatar initials="MR" size={30}/>
        <div>
          <div className="sb-footer-name">Maya Ruiz</div>
          <div className="sb-footer-sub">Lead facilitator</div>
        </div>
      </div>
    </aside>
  );
};

export const TopBar = ({ crumbs, actions }) => (
  <div className="topbar">
    <div className="crumbs">
      {crumbs.map((c, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {i > 0 && <span className="sep">/</span>}
          <span className={i === crumbs.length - 1 ? "cur" : ""}>{c}</span>
        </span>
      ))}
    </div>
    <div className="topbar-search">
      <Icon name="search" size={14}/>
      <span>Search incidents, evidence, people…</span>
      <div style={{ marginLeft: "auto" }}><kbd>⌘K</kbd></div>
    </div>
    {actions}
    <button className="icon-btn" title="Notifications"><Icon name="bell" size={15}/></button>
  </div>
);

const KpiCard = ({ label, num, delta, deltaDir, sparkData, sparkColor }) => (
  <div className="kpi">
    <div className="kpi-label">{label}</div>
    <div className="kpi-value">
      <span className="kpi-num">{num}</span>
      {delta && <span className={`kpi-delta ${deltaDir}`}>{delta}</span>}
    </div>
    {sparkData && <div className="kpi-spark"><Sparkline data={sparkData} color={sparkColor}/></div>}
  </div>
);

const IncidentTable = ({ onOpen }) => {
  const [filter, setFilter] = useState("all");
  const filtered = INCIDENTS.filter(i => {
    if (filter === "all") return true;
    if (filter === "active") return i.status !== "closed";
    if (filter === "mine") return i.lead.initials === "MR";
    if (filter === "critical") return i.severity === "critical" || i.severity === "high";
    return true;
  });
  return (
    <div className="card">
      <div className="panel-header">
        <div className="panel-title">Active investigations</div>
        <div className="panel-sub">{filtered.length} of {INCIDENTS.length}</div>
        <div className="panel-actions">
          <div className="seg">
            {[["all","All"],["active","Active"],["mine","Assigned to me"],["critical","Critical & High"]].map(([k, l]) =>
              <button key={k} className={filter === k ? "active" : ""} onClick={() => setFilter(k)}>{l}</button>
            )}
          </div>
          <button className="btn ghost"><Icon name="filter" size={13}/>Filter</button>
        </div>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: 140 }}>ID</th>
            <th>Incident</th>
            <th>Severity</th>
            <th>Phase</th>
            <th>Progress</th>
            <th>Team</th>
            <th style={{ width: 90 }}>Due</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(inc => (
            <tr key={inc.id} onClick={() => onOpen(inc)}>
              <td>
                <div className="id">{inc.id}</div>
                <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 3 }}>{inc.platform}</div>
              </td>
              <td>
                <div className="title-cell">
                  {inc.title}
                  <div className="sub">{inc.sub}</div>
                </div>
              </td>
              <td><SevTag level={inc.severity}/></td>
              <td>
                <StatusPill status={inc.status}/>
                <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{inc.phase}</div>
              </td>
              <td>
                <div className="progress"><span style={{ width: `${inc.progress * 100}%` }}/></div>
                <div className="progress-label">{Math.round(inc.progress * 100)}%</div>
              </td>
              <td><AssigneeStack members={inc.team}/></td>
              <td>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{inc.due}</div>
                <div style={{ fontSize: 11, color: "var(--ink-3)" }}>opened {inc.opened}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FactorMix = () => {
  const max = Math.max(...FACTOR_TRENDS.map(f => f.n));
  const kindColor = { defence: "var(--sev-critical)", action: "var(--sev-high)", condition: "var(--status-progress)", org: "var(--status-review)" };
  return (
    <div className="side-panel-body">
      <div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        ICAM factor mix · last 90d
      </div>
      {FACTOR_TRENDS.map(f => (
        <div className="factor-bar" key={f.cat}>
          <div className="lbl">{f.cat}</div>
          <div className="bar"><span style={{ width: `${(f.n / max) * 100}%`, background: kindColor[f.kind] }}/></div>
          <div className="num">{f.n}</div>
        </div>
      ))}
    </div>
  );
};

const Heatmap = () => {
  const labels = ["1 Minor", "2", "3", "4", "5 Severe"];
  const yLabels = ["Almost certain", "Likely", "Possible", "Unlikely", "Rare"];
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Risk heatmap</div>
        <div className="panel-sub">consequence × likelihood</div>
      </div>
      <div className="heatmap">
        <div/>
        {labels.map(l => <div key={l} className="col-label">{l}</div>)}
        {HEATMAP.map((row, ri) => (
          <Fragment key={ri}>
            <div className="row-label">{yLabels[ri]}</div>
            {row.map((v, ci) => (
              <div key={ci} className="cell" data-v={v}>{v || ""}</div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

const ActivityFeed = () => (
  <div className="side-panel-body">
    <div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
      Recent activity
    </div>
    <div className="activity">
      {ACTIVITY.map((a, i) => (
        <div className="act-item" key={i}>
          <Avatar initials={a.init} size={22}/>
          <div>
            <div><span className="who">{a.who}</span> <span style={{ color: "var(--ink-3)" }}>{a.action}</span></div>
            <div style={{ marginTop: 2 }}>{a.target}</div>
            <div className="when">{a.when} · {a.inc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const Dashboard = ({ onOpen }) => (
  <div className="content view-enter">
    <div style={{ display: "flex", alignItems: "baseline", marginBottom: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>Investigations overview</h1>
        <div style={{ color: "var(--ink-3)", fontSize: 13, marginTop: 4 }}>
          Northgate Energy · Upstream operations · <span className="mono">quarter to date</span>
        </div>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        <button className="btn ghost"><Icon name="download" size={13}/>Export</button>
        <button className="btn primary"><Icon name="plus" size={13}/>New investigation</button>
      </div>
    </div>

    <div className="kpis">
      <KpiCard label="Open investigations" num="12" delta="+3 this week" deltaDir="up" sparkData={SPARK}/>
      <KpiCard label="Avg. time to close" num="14d" delta="−2d vs. Q1" deltaDir="down" sparkData={[18,17,16,16,15,15,14,14,15,14,13,14]}/>
      <KpiCard label="Actions overdue" num="4" delta="2 critical" deltaDir="up" sparkData={[2,3,3,4,5,4,5,3,4,4,4,4]} sparkColor="var(--sev-high)"/>
      <KpiCard label="TRIR (rolling 12m)" num="0.41" delta="−0.06 YoY" deltaDir="down" sparkData={[0.48,0.47,0.46,0.45,0.44,0.44,0.43,0.42,0.42,0.41,0.41,0.41]}/>
    </div>

    <div className="dash-grid">
      <IncidentTable onOpen={onOpen}/>
      <div className="card" style={{ display: "flex", flexDirection: "column" }}>
        <FactorMix/>
        <ActivityFeed/>
      </div>
    </div>

    <div className="card" style={{ marginBottom: 28 }}>
      <Heatmap/>
    </div>
  </div>
);
