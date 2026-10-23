import Link from "next/link";
import { AreaTrend, DonutChart, FunnelChart, RankBars, Sparkline } from "@/components/charts";
import { Badge, Card, PageHeader, ProgressBar, Stat } from "@/components/ui";
import { getDashboard, getLeadsBoard, getDealsBoard, getKycBoard, getTasksBoard } from "@/lib/queries";
import { compactCurrency, currency, num } from "@/lib/format";

export const dynamic = "force-dynamic";

const KIND_ICON: Record<string, string> = {
  lead: "🎯",
  deal: "💰",
  kyc: "🛡️",
  task: "⚙️",
  invoice: "🧾",
};

export default async function DashboardPage() {
  const [d, leads, deals, kyc, tasks] = await Promise.all([
    getDashboard(),
    getLeadsBoard(),
    getDealsBoard(),
    getKycBoard(),
    getTasksBoard(),
  ]);

  const spark = d.months.map((m) => m.value);

  const boards = [
    {
      href: "/dashboard/leads",
      title: "Lead Board",
      icon: "🎯",
      tone: "sky" as const,
      items: leads,
      columns: ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"],
      open: leads.filter((i) => !["won", "lost"].includes(i.stage)).length,
      value: leads.filter((i) => !["won", "lost"].includes(i.stage)).reduce((s, i) => s + (i.value ?? 0), 0),
    },
    {
      href: "/dashboard/sales",
      title: "Sales Board",
      icon: "💰",
      tone: "emerald" as const,
      items: deals,
      columns: ["discovery", "proposal", "negotiation", "contract", "won", "lost"],
      open: deals.filter((i) => !["won", "lost"].includes(i.stage)).length,
      value: deals.filter((i) => !["won", "lost"].includes(i.stage)).reduce((s, i) => s + (i.value ?? 0), 0),
    },
    {
      href: "/dashboard/kyc",
      title: "KYC Board",
      icon: "🛡️",
      tone: "amber" as const,
      items: kyc,
      columns: ["submitted", "review", "info", "verified", "rejected"],
      open: kyc.filter((i) => ["submitted", "review", "info"].includes(i.stage)).length,
      value: 0,
    },
    {
      href: "/dashboard/operations",
      title: "Operation Board",
      icon: "⚙️",
      tone: "violet" as const,
      items: tasks,
      columns: ["backlog", "todo", "progress", "review", "done"],
      open: tasks.filter((i) => i.stage !== "done").length,
      value: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Company cockpit"
        title={`Good ${new Date().getHours() < 12 ? "morning" : "afternoon"}, Arjun 👋`}
        description="Every department, one operating system. Here is how Northwind Industries is performing today."
        actions={
          <>
            <span className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 sm:inline">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
            <Link
              href="/dashboard/reports"
              className="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              View reports
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Revenue collected</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-2xl font-semibold tracking-tight text-slate-900">{compactCurrency(d.kpis.collected)}</p>
            <Sparkline values={spark} tone="#10b981" />
          </div>
          <p className="mt-1 text-xs font-medium text-emerald-600">
            {d.kpis.invoices} invoices · {compactCurrency(d.kpis.outstanding)} outstanding
          </p>
        </Card>
        <Stat
          label="Sales pipeline"
          value={compactCurrency(d.kpis.pipelineValue)}
          delta={`${compactCurrency(d.kpis.forecastValue)} weighted forecast`}
          icon="💰"
          tone="emerald"
        />
        <Stat
          label="Leads in play"
          value={String(d.kpis.openLeads)}
          delta={`${d.kpis.leads} total · ${d.kpis.conversion}% conversion`}
          icon="🎯"
          tone="sky"
        />
        <Stat
          label="KYC awaiting review"
          value={String(d.kpis.kycPending)}
          delta={`${d.kpis.kycVerified} of ${d.kpis.kycTotal} verified`}
          icon="🛡️"
          tone="amber"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Revenue collected</h2>
              <p className="text-sm text-slate-500">Paid invoices across the last 6 months</p>
            </div>
            <Badge tone="emerald">+18.4% vs prior period</Badge>
          </div>
          <div className="mt-4">
            <AreaTrend data={d.months} tone="#4f46e5" toneId="rev" formatValue={(v) => compactCurrency(v)} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Lead sources</h2>
          <p className="text-sm text-slate-500">Where enquiries originate</p>
          <div className="mt-4">
            <DonutChart
              data={d.sources}
              centerLabel="leads"
              centerValue={String(d.kpis.leads)}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Conversion funnel</h2>
          <p className="text-sm text-slate-500">Lead journey this quarter</p>
          <div className="mt-4">
            <FunnelChart stages={d.funnel} />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Team leaderboard</h2>
              <p className="text-sm text-slate-500">Closed-won value by owner</p>
            </div>
            <Link href="/dashboard/team" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
              View team →
            </Link>
          </div>
          <div className="mt-5">
            <RankBars rows={d.leaderboard} formatValue={(v) => compactCurrency(v)} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Recent activity</h2>
          <p className="text-sm text-slate-500">Across every module</p>
          <ol className="mt-4 space-y-3.5">
            {d.recent.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-xs"
                  title={a.actor}
                >
                  {KIND_ICON[a.kind] ?? "•"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">{a.actor}</span> {a.text}
                  </p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Module snapshot</h2>
          <span className="text-xs text-slate-500">Live counts from each board</span>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {boards.map((b) => (
            <Link key={b.href} href={b.href} className="group">
              <Card className="h-full p-5 transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-base">{b.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{b.title}</p>
                    <p className="text-xs text-slate-500">{b.open} open · {b.items.length} total</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {b.columns.map((c) => {
                    const count = b.items.filter((i) => i.stage === c).length;
                    const total = b.items.length || 1;
                    return (
                      <div key={c} className="flex items-center gap-2">
                        <span className="w-20 shrink-0 truncate text-[11px] capitalize text-slate-500">{c}</span>
                        <ProgressBar value={(count / total) * 100} tone={b.tone} className="h-1.5" />
                        <span className="w-5 shrink-0 text-right text-[11px] font-semibold text-slate-700">{count}</span>
                      </div>
                    );
                  })}
                </div>
                {b.value > 0 ? (
                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    {currency(b.value)} <span className="font-normal text-slate-400">open value</span>
                  </p>
                ) : (
                  <p className="mt-4 text-xs text-slate-400">{num(b.items.length)} records tracked</p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
