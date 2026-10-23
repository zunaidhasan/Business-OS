import { Avatar, Badge, Card, PageHeader, ProgressBar, Stat } from "@/components/ui";
import { getDashboard, getTeam } from "@/lib/queries";
import { compactCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_TONE = {
  active: "emerald",
  away: "amber",
  offline: "slate",
} as const;

export default async function TeamPage() {
  const [team, d] = await Promise.all([getTeam(), getDashboard()]);

  const workloadMap = new Map(d.workload.map((w) => [w.user.id, w]));
  const maxLoad = Math.max(1, ...d.workload.map((w) => w.openTasks + w.openDeals * 2));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Organisation"
        title="Team"
        description="Roles, capacity and live workload for everyone operating the system. Seat-based licensing keeps this simple."
        actions={
          <button className="rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500">
            + Invite member
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Members" value={String(team.length)} delta="Unlimited on Growth" icon="👥" tone="indigo" />
        <Stat label="Active now" value={String(team.filter((u) => u.status === "active").length)} delta="Across 4 departments" icon="🟢" tone="emerald" />
        <Stat label="Open tasks" value={String(d.kpis.tasksOpen)} delta="Assigned to the team" icon="⚙️" tone="violet" />
        <Stat label="Closed won" value={compactCurrency(d.kpis.wonValue)} delta="Team total" icon="🏆" tone="sky" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {team.map((u) => {
          const w = workloadMap.get(u.id);
          const load = (w?.openTasks ?? 0) + (w?.openDeals ?? 0) * 2;
          return (
            <Card key={u.id} className="p-5">
              <div className="flex items-start gap-3">
                <Avatar name={u.name} color={u.color} size={44} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{u.name}</p>
                  <p className="truncate text-xs text-slate-500">{u.role}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Badge tone={STATUS_TONE[u.status as keyof typeof STATUS_TONE] ?? "slate"}>{u.status}</Badge>
                    <span className="text-[11px] text-slate-400">{u.department}</span>
                  </div>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-slate-50 py-2">
                  <dt className="text-[10px] uppercase text-slate-400">Leads</dt>
                  <dd className="text-sm font-semibold text-slate-900">{w?.leads ?? 0}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 py-2">
                  <dt className="text-[10px] uppercase text-slate-400">Deals</dt>
                  <dd className="text-sm font-semibold text-slate-900">{w?.openDeals ?? 0}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 py-2">
                  <dt className="text-[10px] uppercase text-slate-400">Tasks</dt>
                  <dd className="text-sm font-semibold text-slate-900">{w?.openTasks ?? 0}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Capacity used</span>
                  <span>{Math.min(100, Math.round((load / maxLoad) * 100))}%</span>
                </div>
                <ProgressBar
                  value={(load / maxLoad) * 100}
                  tone={load / maxLoad > 0.75 ? "rose" : load / maxLoad > 0.5 ? "amber" : "emerald"}
                  className="mt-1.5"
                />
              </div>
              <p className="mt-3 truncate text-[11px] text-slate-400">{u.email}</p>
            </Card>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Permissions matrix</h2>
          <p className="text-sm text-slate-500">Role-based access control, ready to configure per department</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-2.5 font-medium">Role</th>
                <th className="px-5 py-2.5 font-medium">Leads</th>
                <th className="px-5 py-2.5 font-medium">Sales</th>
                <th className="px-5 py-2.5 font-medium">KYC</th>
                <th className="px-5 py-2.5 font-medium">Operations</th>
                <th className="px-5 py-2.5 font-medium">Finance</th>
                <th className="px-5 py-2.5 font-medium">Settings</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Administrator", "full", "full", "full", "full", "full", "full"],
                ["VP Revenue", "full", "full", "read", "read", "read", "none"],
                ["Sales Manager", "full", "full", "none", "none", "none", "none"],
                ["Account Executive", "own", "own", "none", "none", "none", "none"],
                ["Compliance Officer", "read", "read", "full", "none", "none", "none"],
                ["Operations Lead", "none", "read", "none", "full", "none", "none"],
                ["Finance Manager", "none", "read", "read", "read", "full", "none"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium text-slate-900">{row[0]}</td>
                  {row.slice(1).map((cell, i) => (
                    <td key={i} className="px-5 py-3">
                      <Badge
                        tone={cell === "full" ? "emerald" : cell === "own" ? "indigo" : cell === "read" ? "sky" : "slate"}
                      >
                        {cell}
                      </Badge>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
