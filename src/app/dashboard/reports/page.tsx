import { BarSeries, DonutChart, RankBars } from "@/components/charts";
import { Badge, Card, PageHeader, ProgressBar, Stat } from "@/components/ui";
import { getDashboard, getInvoices, getKycBoard, getTasksBoard, getDealsBoard } from "@/lib/queries";
import { compactCurrency, currency } from "@/lib/format";

export const dynamic = "force-dynamic";

const INVOICE_TONE = {
  paid: "emerald",
  sent: "indigo",
  overdue: "rose",
  draft: "slate",
} as const;

export default async function ReportsPage() {
  const [d, invoices, kyc, tasks, deals] = await Promise.all([
    getDashboard(),
    getInvoices(),
    getKycBoard(),
    getTasksBoard(),
    getDealsBoard(),
  ]);

  const kycStatusColors: Record<string, string> = {
    submitted: "#0ea5e9",
    review: "#6366f1",
    info: "#f59e0b",
    verified: "#10b981",
    rejected: "#f43f5e",
  };
  const kycStatusCounts = new Map<string, number>();
  kyc.forEach((k) => kycStatusCounts.set(k.stage, (kycStatusCounts.get(k.stage) ?? 0) + 1));
  const kycDonut = [...kycStatusCounts.entries()].map(([label, value]) => ({
    label: label.charAt(0).toUpperCase() + label.slice(1),
    value,
    color: kycStatusColors[label] ?? "#94a3b8",
  }));

  const priorityCounts = ["urgent", "high", "medium", "low"].map((p) => ({
    label: p.charAt(0).toUpperCase() + p.slice(1),
    value: tasks.filter((t) => t.badge?.label === p).length,
  }));

  const stageValue = ["discovery", "proposal", "negotiation", "contract", "won", "lost"].map((s) => ({
    label: s === "won" ? "Won" : s === "lost" ? "Lost" : s.charAt(0).toUpperCase() + s.slice(1),
    value: deals.filter((x) => x.stage === s).reduce((sum, x) => sum + (x.value ?? 0), 0),
  }));

  const done = tasks.filter((t) => t.stage === "done").length;
  const completionRate = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const avgDeal = deals.length ? Math.round(deals.reduce((s, x) => s + (x.value ?? 0), 0) / deals.length) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Reports"
        description="Board-level insight for leadership: revenue, conversion, compliance and operational throughput in one place."
        actions={
          <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white text-xs font-medium">
            {["7 days", "30 days", "Quarter", "YTD"].map((p, i) => (
              <span
                key={p}
                className={`px-3 py-2 ${i === 2 ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {p}
              </span>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total revenue" value={compactCurrency(d.kpis.collected)} delta={`${d.kpis.invoices} invoices`} icon="🧾" tone="emerald" />
        <Stat label="Avg deal size" value={currency(avgDeal)} delta={`${deals.length} deals tracked`} icon="💼" tone="indigo" />
        <Stat label="Win rate" value={`${d.kpis.winRate}%`} delta="Closed won vs lost" icon="🎯" tone="sky" />
        <Stat label="Task completion" value={`${completionRate}%`} delta={`${done} of ${tasks.length} done`} icon="✅" tone="violet" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Revenue by month</h2>
          <p className="text-sm text-slate-500">Collected from paid invoices</p>
          <div className="mt-4">
            <BarSeries data={d.months} tone="#6366f1" highlightLast formatValue={(v) => compactCurrency(v)} />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Deal value by stage</h2>
          <p className="text-sm text-slate-500">Where the revenue sits in the pipeline</p>
          <div className="mt-4">
            <RankBars rows={stageValue} tone="#10b981" formatValue={(v) => compactCurrency(v)} />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">KYC portfolio</h2>
          <p className="text-sm text-slate-500">Verification status distribution</p>
          <div className="mt-4">
            <DonutChart data={kycDonut} centerLabel="cases" centerValue={String(kyc.length)} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Operations load</h2>
          <p className="text-sm text-slate-500">Open tasks by priority</p>
          <div className="mt-4">
            <RankBars
              rows={priorityCounts}
              tone="#8b5cf6"
              formatValue={(v) => `${v} tasks`}
            />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Invoice aging</h2>
          <p className="text-sm text-slate-500">Outstanding balance by status</p>
          <ul className="mt-4 space-y-3">
            {(["overdue", "sent", "draft", "paid"] as const).map((s) => {
              const rows = invoices.filter((i) => i.status === s);
              const total = rows.reduce((sum, i) => sum + i.amount, 0);
              return (
                <li key={s} className="flex items-center gap-3">
                  <Badge tone={INVOICE_TONE[s]}>{s}</Badge>
                  <span className="text-xs text-slate-500">{rows.length} invoices</span>
                  <span className="ml-auto text-sm font-semibold text-slate-900">{compactCurrency(total)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Total receivables</p>
            <p className="text-lg font-semibold text-slate-900">{currency(d.kpis.outstanding)}</p>
            <ProgressBar value={72} tone="rose" className="mt-2" />
            <p className="mt-1.5 text-[11px] text-slate-400">72% collected within terms</p>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Recent invoices</h2>
            <p className="text-sm text-slate-500">Latest billing activity</p>
          </div>
          <span className="text-xs text-slate-400">{invoices.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-2.5 font-medium">Invoice</th>
                <th className="px-5 py-2.5 font-medium">Client</th>
                <th className="px-5 py-2.5 font-medium">Issued</th>
                <th className="px-5 py-2.5 font-medium">Due</th>
                <th className="px-5 py-2.5 text-right font-medium">Amount</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 8).map((inv) => (
                <tr key={inv.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium text-slate-900">{inv.number}</td>
                  <td className="px-5 py-3 text-slate-600">{inv.client}</td>
                  <td className="px-5 py-3 text-slate-500">{inv.issuedAt}</td>
                  <td className="px-5 py-3 text-slate-500">{inv.dueAt}</td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900">{currency(inv.amount)}</td>
                  <td className="px-5 py-3">
                    <Badge tone={INVOICE_TONE[inv.status as keyof typeof INVOICE_TONE] ?? "slate"}>{inv.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-semibold text-slate-900">Compliance audit log</h2>
        <p className="text-sm text-slate-500">Most recent KYC decisions (demo data)</p>
        <ul className="mt-4 divide-y divide-slate-100">
          {kyc.slice(0, 6).map((k) => (
            <li key={k.id} className="flex flex-wrap items-center gap-3 py-3">
              <Badge tone={k.badge?.tone ?? "slate"}>{k.badge?.label}</Badge>
              <span className="text-sm font-medium text-slate-800">{k.title}</span>
              <span className="text-xs text-slate-400">{k.subtitle}</span>
              <span className="ml-auto text-xs text-slate-500">{k.meta?.[2]?.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-slate-400">
          Full audit trail with reviewer identity, timestamps and document hashes is included in production deployments.
        </p>
      </Card>
    </div>
  );
}
