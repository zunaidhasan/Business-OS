export type Point = { label: string; value: number };

/* ----------------------------- Area trend ---------------------------- */

export function AreaTrend({
  data,
  height = 220,
  tone = "#6366f1",
  toneId = "a",
  formatValue = (v: number) => String(v),
}: {
  data: Point[];
  height?: number;
  tone?: string;
  toneId?: string;
  formatValue?: (v: number) => string;
}) {
  const w = 640;
  const h = height;
  const padX = 34;
  const padY = 26;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = 0;
  const stepX = (w - padX * 2) / Math.max(1, data.length - 1);
  const pts = data.map((d, i) => {
    const x = padX + i * stepX;
    const y = padY + (1 - (d.value - min) / (max - min)) * (h - padY * 2);
    return { x, y, ...d };
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${h - padY} L${pts[0].x.toFixed(1)},${h - padY} Z`;
  const gridLines = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} role="img">
      <defs>
        <linearGradient id={`grad-${toneId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.28" />
          <stop offset="100%" stopColor={tone} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {gridLines.map((g) => {
        const y = padY + g * (h - padY * 2);
        return (
          <g key={g}>
            <line x1={padX} x2={w - padX} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
            <text x={4} y={y + 4} fontSize="10" fill="#94a3b8">
              {formatValue(Math.round(max * (1 - g)))}
            </text>
          </g>
        );
      })}
      <path d={area} fill={`url(#grad-${toneId})`} />
      <path d={line} fill="none" stroke={tone} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="white" stroke={tone} strokeWidth="2" />
          <text x={p.x} y={h - 6} fontSize="10" fill="#94a3b8" textAnchor="middle">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------ Bar series --------------------------- */

export function BarSeries({
  data,
  height = 220,
  tone = "#6366f1",
  formatValue = (v: number) => String(v),
  highlightLast = false,
}: {
  data: Point[];
  height?: number;
  tone?: string;
  formatValue?: (v: number) => string;
  highlightLast?: boolean;
}) {
  const w = 640;
  const h = height;
  const padX = 20;
  const padY = 24;
  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX = (w - padX * 2) / data.length;
  const barW = Math.min(46, stepX * 0.55);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} role="img">
      {[0.5, 1].map((g) => {
        const y = padY + (1 - g) * (h - padY * 2 - 18);
        return <line key={g} x1={padX} x2={w - padX} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />;
      })}
      {data.map((d, i) => {
        const barH = Math.max(3, (d.value / max) * (h - padY * 2 - 18));
        const x = padX + i * stepX + (stepX - barW) / 2;
        const y = h - 18 - barH;
        const isLast = highlightLast && i === data.length - 1;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={barH} rx="6" fill={isLast ? "#4f46e5" : tone} opacity={isLast ? 1 : 0.85} />
            <text x={x + barW / 2} y={y - 6} fontSize="10" fill="#64748b" textAnchor="middle">
              {formatValue(d.value)}
            </text>
            <text x={x + barW / 2} y={h - 4} fontSize="10" fill="#94a3b8" textAnchor="middle">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------- Donut ------------------------------ */

export function DonutChart({
  data,
  size = 190,
  centerLabel,
  centerValue,
}: {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 62;
  const c = 2 * Math.PI * r;

  const segments = data.reduce<Array<(typeof data)[number] & { len: number; offset: number }>>(
    (acc, d) => {
      const len = (d.value / total) * c;
      const offset = acc.reduce((s, x) => s + x.len, 0);
      acc.push({ ...d, len, offset });
      return acc;
    },
    [],
  );

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 160 160" className="shrink-0">
        <g transform="rotate(-90 80 80)">
          {segments.map((d) => (
            <circle
              key={d.label}
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="20"
              strokeDasharray={`${d.len} ${c - d.len}`}
              strokeDashoffset={-d.offset}
              strokeLinecap="butt"
            />
          ))}
        </g>
        <text x="80" y="76" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0f172a">
          {centerValue ?? total}
        </text>
        <text x="80" y="94" textAnchor="middle" fontSize="9" fill="#94a3b8">
          {centerLabel ?? "total"}
        </text>
      </svg>
      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-slate-600">{d.label}</span>
            <span className="ml-auto font-semibold text-slate-900">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------- Funnel ----------------------------- */

export function FunnelChart({
  stages,
  tone = "#6366f1",
}: {
  stages: Array<{ label: string; value: number }>;
  tone?: string;
}) {
  const max = Math.max(...stages.map((s) => s.value), 1);
  return (
    <div className="space-y-3">
      {stages.map((s, i) => {
        const prev = i === 0 ? null : stages[i - 1].value;
        const conv = prev ? Math.round((s.value / prev) * 100) : null;
        return (
          <div key={s.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-slate-700">{s.label}</span>
              <span className="text-slate-500">
                <span className="font-semibold text-slate-900">{s.value}</span>
                {conv !== null ? <span className="ml-2 text-xs text-slate-400">{conv}% conversion</span> : null}
              </span>
            </div>
            <div className="mt-1.5 h-7 w-full overflow-hidden rounded-lg bg-slate-100">
              <div
                className="flex h-full items-center rounded-lg px-3 text-xs font-semibold text-white transition-all"
                style={{ width: `${Math.max(6, (s.value / max) * 100)}%`, backgroundColor: tone, opacity: 1 - i * 0.12 }}
              >
                {Math.round((s.value / max) * 100)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ Sparkline ---------------------------- */

export function Sparkline({
  values,
  tone = "#10b981",
  width = 90,
  height = 30,
}: {
  values: number[];
  tone?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const step = width / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => {
    const x = i * step;
    const y = height - 2 - ((v - min) / (max - min || 1)) * (height - 6);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline points={pts.join(" ")} fill="none" stroke={tone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={pts[pts.length - 1].split(",")[1]} r="2.5" fill={tone} />
    </svg>
  );
}

/* ----------------------------- Leader bars --------------------------- */

export function RankBars({
  rows,
  tone = "#6366f1",
  formatValue = (v: number) => String(v),
}: {
  rows: Array<{ label: string; value: number; sub?: string }>;
  tone?: string;
  formatValue?: (v: number) => string;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-4">
      {rows.map((r) => (
        <li key={r.label} className="flex items-center gap-3">
          <div className="w-36 shrink-0">
            <p className="truncate text-sm font-medium text-slate-800">{r.label}</p>
            {r.sub ? <p className="truncate text-xs text-slate-400">{r.sub}</p> : null}
          </div>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full" style={{ width: `${(r.value / max) * 100}%`, backgroundColor: tone }} />
          </div>
          <span className="w-16 shrink-0 text-right text-sm font-semibold text-slate-900">
            {formatValue(r.value)}
          </span>
        </li>
      ))}
    </ul>
  );
}
