import Link from "next/link";
import { Sparkline } from "@/components/charts";

const LOGOS = [
  "Northwind",
  "Globex",
  "Initech",
  "Hooli",
  "Vandelay",
  "Stark",
  "Massive Dynamic",
  "Oceanic",
];

const HERO_STATS = [
  { value: "3.2×", label: "faster lead response" },
  { value: "41%", label: "higher win rate" },
  { value: "68%", label: "less admin work" },
  { value: "100%", label: "audit coverage" },
];

function MockWindow() {
  const columns = [
    {
      name: "New",
      color: "bg-sky-400",
      cards: [
        { title: "Priya Nair", sub: "Globex Corp", value: "$24K", tag: "Website" },
        { title: "David Chen", sub: "Initech", value: "$12K", tag: "Referral" },
      ],
    },
    {
      name: "Qualified",
      color: "bg-indigo-400",
      cards: [
        { title: "Maria Garcia", sub: "Hooli", value: "$68K", tag: "LinkedIn" },
        { title: "Tom Baker", sub: "Vandelay Ind.", value: "$31K", tag: "Webinar" },
      ],
    },
    {
      name: "Proposal",
      color: "bg-amber-400",
      cards: [
        { title: "Sarah Collins", sub: "Stark Ind.", value: "$120K", tag: "Trade Show" },
      ],
    },
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500/25 via-violet-500/20 to-sky-400/20 blur-3xl" />
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-indigo-950/50">
        {/* window chrome */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-slate-950/60 px-4 py-3">
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </span>
          <span className="rounded-md bg-white/5 px-3 py-1 text-[11px] text-slate-400">app.corevo.io/dashboard</span>
          <span className="ml-auto hidden rounded-md bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300 sm:block">
            ● live data
          </span>
        </div>

        <div className="grid grid-cols-5">
          {/* mini sidebar */}
          <div className="hidden border-r border-white/10 p-3 sm:block">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-indigo-500 text-[10px] font-black text-white">C</span>
              <span className="text-[11px] font-bold text-white">Corevo</span>
            </div>
            {[
              { icon: "📊", label: "Dashboard", active: true },
              { icon: "🎯", label: "Leads" },
              { icon: "💰", label: "Sales" },
              { icon: "🛡️", label: "KYC" },
              { icon: "⚙️", label: "Operations" },
            ].map((i) => (
              <div
                key={i.label}
                className={`mb-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] ${
                  i.active ? "bg-indigo-500/20 text-white" : "text-slate-400"
                }`}
              >
                <span>{i.icon}</span>
                {i.label}
              </div>
            ))}
          </div>

          {/* main */}
          <div className="col-span-5 p-4 sm:col-span-4">
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "Pipeline", value: "$1.42M", tone: "text-emerald-300", spark: [4, 6, 5, 8, 7, 10, 12] },
                { label: "Open leads", value: "38", tone: "text-sky-300", spark: [8, 7, 9, 6, 10, 11, 9] },
                { label: "KYC pending", value: "14", tone: "text-amber-300", spark: [12, 9, 10, 7, 6, 5, 4] },
              ].map((k) => (
                <div key={k.label} className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                  <p className="text-[10px] text-slate-400">{k.label}</p>
                  <div className="mt-0.5 flex items-end justify-between gap-1">
                    <span className={`text-base font-bold ${k.tone}`}>{k.value}</span>
                    <Sparkline values={k.spark} tone="currentColor" width={44} height={18} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {columns.map((col) => (
                <div key={col.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${col.color}`} />
                    <span className="text-[10px] font-semibold text-slate-300">{col.name}</span>
                  </div>
                  <div className="space-y-1.5">
                    {col.cards.map((c) => (
                      <div key={c.title} className="rounded-lg bg-white p-2 shadow-sm">
                        <p className="truncate text-[10px] font-semibold text-slate-900">{c.title}</p>
                        <p className="truncate text-[9px] text-slate-500">{c.sub}</p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="rounded bg-slate-100 px-1 py-0.5 text-[8px] text-slate-500">{c.tag}</span>
                          <span className="text-[9px] font-bold text-slate-900">{c.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* floating badges */}
      <div className="absolute -right-4 top-24 hidden rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur md:block">
        <p className="text-[10px] text-slate-400">Deal moved to</p>
        <p className="text-xs font-semibold text-white">Closed Won 🎉</p>
      </div>
      <div className="absolute -left-6 bottom-10 hidden rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur md:block">
        <p className="text-[10px] text-slate-400">KYC verified</p>
        <p className="text-xs font-semibold text-white">2 minutes ago ✅</p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pb-20 pt-10 sm:pt-16">
      {/* background mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-indigo-600/25 blur-[130px]" />
        <div className="absolute right-0 top-10 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-sky-500/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-200">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              New · The Business Operating System
            </span>
            <h1 className="mt-5 text-[clamp(2.4rem,5.2vw,3.9rem)] font-bold leading-[1.05] tracking-tight text-white">
              Run your entire business
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">
                {" "}
                from one cockpit.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              Corevo unifies your <strong className="font-semibold text-white">lead board</strong>,{" "}
              <strong className="font-semibold text-white">sales pipeline</strong>,{" "}
              <strong className="font-semibold text-white">KYC compliance</strong> and{" "}
              <strong className="font-semibold text-white">daily operations</strong> into a single system of record —
              so nothing falls between the cracks again.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-950/40 transition hover:bg-slate-100"
              >
                Explore the live demo
                <span className="transition group-hover:translate-x-0.5">→</span>
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                See what&apos;s inside
              </a>
            </div>
            <p className="mt-5 text-xs text-slate-400">
              No credit card · 14-day pilot with your own data · Live in a single day
            </p>

            <dl className="mt-9 grid max-w-lg grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              {HERO_STATS.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-bold text-white">{s.value}</dt>
                  <dd className="text-[11px] leading-tight text-slate-400">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <MockWindow />
        </div>

        {/* logo strip */}
        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Trusted by operators at
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {LOGOS.map((l) => (
              <span key={l} className="text-sm font-semibold tracking-wide text-slate-500/80">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
