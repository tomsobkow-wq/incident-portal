// Shared UI primitives — icons, chips, sparklines

export const Icon = ({ name, size = 16, ...rest }) => {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    folder: <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h9a1.5 1.5 0 0 1 1.5 1.5v9.5A1.5 1.5 0 0 1 20 19.5H4.5A1.5 1.5 0 0 1 3 18z"/>,
    chart: <><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15v-5"/><path d="M12 15V8"/><path d="M16 15v-3"/></>,
    alert: <><path d="M12 3l10 17H2z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></>,
    clipboard: <><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 10h6M9 14h6M9 18h4"/></>,
    evidence: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15l5-5 4 4 4-4 5 5"/><circle cx="9" cy="10" r="1.3"/></>,
    timeline: <><circle cx="6" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><path d="M6 9v6"/><path d="M9 7h11M9 17h11"/></>,
    checklist: <><path d="M4 6l2 2 3-3"/><path d="M4 13l2 2 3-3"/><path d="M4 20l2 2 3-3"/><path d="M12 7h9M12 14h9M12 21h9"/></>,
    report: <><path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v6h6"/><path d="M9 14h7M9 17h7"/></>,
    users: <><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M15 20c0-2 1.8-4 4-4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.65 1.65 0 0 0-1.8-.3 1.65 1.65 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.65 1.65 0 0 0-1-1.5 1.65 1.65 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.65 1.65 0 0 0 .3-1.8 1.65 1.65 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.65 1.65 0 0 0 1.8.3H9A1.65 1.65 0 0 0 10 3.1V3a2 2 0 0 1 4 0v.1a1.65 1.65 0 0 0 1 1.5 1.65 1.65 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.65 1.65 0 0 0-.3 1.8V9a1.65 1.65 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.65 1.65 0 0 0-1.5 1z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></>,
    bell: <><path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16z"/><path d="M10 20a2 2 0 0 0 4 0"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    edit: <><path d="M4 20h4l11-11-4-4L4 16z"/><path d="M14 6l4 4"/></>,
    x: <><path d="M6 6l12 12M18 6L6 18"/></>,
    branch: <><circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 7v10M6 12c0 3 3 5 6 5h2"/></>,
    off: <><circle cx="12" cy="12" r="9"/><path d="M5 5l14 14"/></>,
    filter: <path d="M3 5h18l-7 8v6l-4 1v-7z"/>,
    download: <><path d="M12 4v11"/><path d="M7 11l5 5 5-5"/><path d="M5 19h14"/></>,
    arrow: <><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></>,
    photo: <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M3 17l5-5 5 5 3-3 5 5"/></>,
    doc: <><path d="M7 3h8l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 19v3"/></>,
    sensor: <><circle cx="12" cy="12" r="3"/><path d="M3 12a9 9 0 0 1 18 0M6 12a6 6 0 0 1 12 0"/></>,
    check: <path d="M4 12l5 5L20 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    more: <><circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/></>,
    link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></>,
    pin: <><path d="M12 22v-6"/><path d="M8 16l4-2 4 2-1-9a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3z"/></>,
    trending: <><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
    shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>,
  };
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {paths[name]}
    </svg>
  );
};

export const Avatar = ({ initials, size }) => {
  const hashes = { MR: 20, JT: 140, DC: 220, ES: 300, PN: 40, KA: 190, HW: 260, LD: 100, RG: 350, JP: 80, TH: 160 };
  const h = hashes[initials] ?? 40;
  const s = size ?? 28;
  return (
    <div className="avatar" style={{
      width: s, height: s, fontSize: s * 0.38,
      background: `linear-gradient(135deg, oklch(0.72 0.10 ${h}), oklch(0.52 0.14 ${(h + 40) % 360}))`,
    }}>{initials}</div>
  );
};

export const Sparkline = ({ data, height = 32, color }) => {
  const w = 120, h = height;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, h - ((v - min) / range) * (h - 6) - 3]);
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  const c = color || "var(--ink)";
  return (
    <svg className="spark" width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={area} fill={c} opacity="0.08"/>
      <path d={d} stroke={c} strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.2" fill={c}/>
    </svg>
  );
};

export const SevTag = ({ level }) => (
  <span className={`sev-tag sev-${level}`}>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
);

export const StatusPill = ({ status }) => {
  const labels = { open: "Open", progress: "In progress", review: "In review", closed: "Closed", draft: "Draft" };
  return (
    <span className={`status ${status}`}>
      <span className="dot"></span>{labels[status]}
    </span>
  );
};

export const AssigneeStack = ({ members }) => (
  <div className="assignees">
    {members.map((m, i) => <Avatar key={i} initials={m} size={22}/>)}
  </div>
);

