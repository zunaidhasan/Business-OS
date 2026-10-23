import Link from "next/link";

export const MODULES = [
  {
    icon: "🎯",
    name: "Lead Board",
    tag: "Module 01",
    accent: "sky",
    desc: "Capture every enquiry from web forms, campaigns, referrals and calls — then score, assign and qualify without spreadsheets.",
    points: ["Auto-capture & dedupe", "Lead scoring", "Owner assignment"],
    href: "/dashboard/leads",
  },
  {
    icon: "💰",
    name: "Sales Board",
    tag: "Module 02",
    accent: "emerald",
    desc: "A live pipeline with weighted forecasting, close dates and win probability so leadership always knows the real number.",
    points: ["Weighted forecast", "Stage analytics", "Close-date tracking"],
    href: "/dashboard/sales",
  },
  {
    icon: "🛡️",
    name: "KYC Board",
    tag: "Module 03",
    accent: "amber",
    desc: "Onboard customers with confidence: document collection, risk rating and an auditable verification queue.",
    points: ["Document checks", "Risk ratings", "Full audit trail"],
    href: "/dashboard/kyc",
  },
  {
    icon: "⚙️",
    name: "Operation Board",
    tag: "Module 04",
    accent: "violet",
    desc: "Turn commitments into execution. Assign owners, priorities and due dates, and keep every deliverable visible.",
    points: ["Task boards & SLAs", "Workload view", "Review workflow"],
    href: "/dashboard/operations",
  },
  {
    icon: "🧾",
    name: "Finance & Invoices",
    tag: "Module 05",
    accent: "rose",
    desc: "Bill from the deal, track payments and ageing, and keep receivables honest without a separate accounting tool.",
    points: ["Invoice lifecycle", "Payment tracking", "Ageing reports"],
    href: "/dashboard/reports",
  },
  {
    icon: "📈",
    name: "Reports & Analytics",
    tag: "Module 06",
    accent: "indigo",
    desc: "Conversion funnels, team leaderboards and module-level KPIs — the numbers boards actually ask for.",
    points: ["Funnel analytics", "Team leaderboards", "Scheduled exports"],
    href: "/dashboard/reports",
  },
] as const;

const ACCENTS: Record<string, string> = {
  sky: "group-hover:border-sky-300 group-hover:bg-sky-50",
  emerald: "group-hover:border-emerald-300 group-hover:bg-emerald-50",
  amber: "group-hover:border-amber-300 group-hover:bg-amber-50",
  violet: "group-hover:border-violet-300 group-hover:bg-violet-50",
  rose: "group-hover:border-rose-300 group-hover:bg-rose-50",
  indigo: "group-hover:border-indigo-300 group-hover:bg-indigo-50",
};

export function Modules() {
  return (
    <section id="modules" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">The modules</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Six boards. One source of truth.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Each module works beautifully on its own — and they share the same customer, the same activity feed and the
            same permissions. Switch one on today, roll out the rest when you&apos;re ready.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <Link
              key={m.name}
              href={m.href}
              className={`group rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 ${ACCENTS[m.accent]}`}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-2xl transition group-hover:scale-110">
                  {m.icon}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                  {m.tag}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{m.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.desc}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {m.points.map((p) => (
                  <li
                    key={p}
                    className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 transition group-hover:bg-white"
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                Open board <span className="transition group-hover:translate-x-0.5">→</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const FLOW = [
  { icon: "🎯", title: "Lead captured", desc: "Form, call, campaign or referral lands on the Lead Board", tone: "sky" },
  { icon: "💰", title: "Sales qualified", desc: "Owner qualifies, quotes and tracks the deal to close", tone: "emerald" },
  { icon: "🛡️", title: "KYC verified", desc: "Documents and risk checks complete before onboarding", tone: "amber" },
  { icon: "⚙️", title: "Operations delivered", desc: "Onboarding tasks, SLAs and reviews assigned to teams", tone: "violet" },
  { icon: "🧾", title: "Invoice paid", desc: "Billing raised from the deal and tracked to payment", tone: "rose" },
] as const;

const FLOW_TONE: Record<string, string> = {
  sky: "from-sky-500 to-sky-400",
  emerald: "from-emerald-500 to-emerald-400",
  amber: "from-amber-500 to-amber-400",
  violet: "from-violet-500 to-violet-400",
  rose: "from-rose-500 to-rose-400",
};

export function Workflow() {
  return (
    <section id="workflow" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">The workflow</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            A customer journey that never loses context
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Most businesses leak revenue between departments. Corevo hands the customer from board to board with the
            full history attached — automatically.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-5">
          {FLOW.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${FLOW_TONE[step.tone]} text-xl text-white shadow-md`}
                >
                  {step.icon}
                </span>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Step {i + 1}</p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.desc}</p>
              </div>
              {i < FLOW.length - 1 ? (
                <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-lg text-slate-300 md:block">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl bg-slate-900 px-6 py-6 sm:px-10">
          <div className="flex flex-wrap items-center gap-6">
            <p className="text-sm font-semibold text-white">The result</p>
            <p className="max-w-3xl text-sm text-slate-300">
              One customer record, one activity feed, one set of permissions. Sales stops re-asking questions, ops stops
              chasing briefs, and compliance stops being a bottleneck.
            </p>
            <Link
              href="/dashboard"
              className="ml-auto rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              See it live →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Platform() {
  return (
    <section id="platform" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">The platform</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built for operators, not spectators
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Boards respond instantly. Drag a card, drop it in the next column, and the change is saved, logged and
              reflected in every report — no refresh, no double entry.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                {
                  icon: "🖱️",
                  title: "Drag-and-drop everything",
                  desc: "Every board is keyboard accessible and works on touch — no training required.",
                },
                {
                  icon: "🧠",
                  title: "Smart defaults",
                  desc: "Scoring, ageing and priority are calculated for you the moment a record is created.",
                },
                {
                  icon: "🔐",
                  title: "Role-based access",
                  desc: "Per-board permissions, so reps see their pipeline and auditors see the trail.",
                },
                {
                  icon: "📤",
                  title: "Your data, portable",
                  desc: "Full CSV/API export on every board. No lock-in, ever.",
                },
              ].map((f) => (
                <li key={f.title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-lg">
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{f.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Activity feed</p>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  live
                </span>
              </div>
              <ul className="mt-4 space-y-3.5">
                {[
                  { icon: "🎯", text: "Priya Nair moved a lead to Qualified", time: "2m" },
                  { icon: "💰", text: "Rahul Mehta closed a $120K deal", time: "14m" },
                  { icon: "🛡️", text: "Ananya Iyer verified Globex KYC", time: "38m" },
                  { icon: "⚙️", text: "Tom Baker completed onboarding checklist", time: "1h" },
                  { icon: "🧾", text: "Invoice INV-2026-014 marked paid", time: "3h" },
                ].map((a) => (
                  <li key={a.text} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm">
                      {a.icon}
                    </span>
                    <p className="min-w-0 flex-1 truncate text-sm text-slate-700">{a.text}</p>
                    <span className="shrink-0 text-[11px] text-slate-400">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Boards", value: "6" },
                { label: "Roles", value: "7" },
                { label: "Uptime", value: "99.9%" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                  <p className="text-lg font-bold text-slate-900">{s.value}</p>
                  <p className="text-[11px] text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
