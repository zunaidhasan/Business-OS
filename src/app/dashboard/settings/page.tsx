import { Badge, Card, PageHeader } from "@/components/ui";
import { ResetDemoButton } from "@/components/reset-demo";

export const dynamic = "force-dynamic";

const TABS = ["Organisation", "Modules", "Notifications", "Integrations", "Billing"] as const;

const MODULES = [
  { name: "Lead Board", desc: "Capture, score and qualify inbound enquiries", on: true, icon: "🎯" },
  { name: "Sales Board", desc: "Pipeline, forecast and deal execution", on: true, icon: "💰" },
  { name: "KYC Board", desc: "Onboarding, document checks and risk rating", on: true, icon: "🛡️" },
  { name: "Operation Board", desc: "Tasks, SLAs and cross-team execution", on: true, icon: "⚙️" },
  { name: "Invoices & receivables", desc: "Billing, payment tracking and ageing", on: true, icon: "🧾" },
  { name: "Advanced analytics", desc: "Custom dashboards and scheduled exports", on: false, icon: "📊" },
] as const;

const INTEGRATIONS = [
  { name: "Slack", desc: "Board notifications in channels", connected: true, icon: "💬" },
  { name: "Google Workspace", desc: "SSO and calendar sync", connected: true, icon: "📅" },
  { name: "QuickBooks", desc: "Two-way invoice sync", connected: false, icon: "📗" },
  { name: "Zapier", desc: "4,000+ app automations", connected: false, icon: "⚡" },
  { name: "WhatsApp Business", desc: "Lead follow-ups from the board", connected: true, icon: "📱" },
] as const;

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${on ? "bg-indigo-600" : "bg-slate-200"}`}
    >
      <span
        className={`absolute h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
      />
    </span>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Everything an administrator needs to shape the operating system around the business."
      />

      <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5">
        {TABS.map((t, i) => (
          <span
            key={t}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium ${i === 0 ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">Organisation profile</h2>
          <p className="text-sm text-slate-500">This appears across boards, invoices and reports</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Legal name", value: "Northwind Industries" },
              { label: "Trading name", value: "Northwind" },
              { label: "Industry", value: "Manufacturing & Distribution" },
              { label: "Base currency", value: "USD ($)" },
              { label: "Timezone", value: "UTC−05:00 · Eastern" },
              { label: "Fiscal year start", value: "January" },
            ].map((f) => (
              <label key={f.label} className="block">
                <span className="text-xs font-medium text-slate-600">{f.label}</span>
                <input
                  defaultValue={f.value}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            ))}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              Discard
            </button>
            <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500">
              Save changes
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Plan &amp; usage</h2>
          <p className="text-sm text-slate-500">Growth · billed annually</p>
          <div className="mt-4 space-y-3.5">
            {[
              { label: "Seats used", value: "8 / unlimited" },
              { label: "Records stored", value: "1,482" },
              { label: "Automations run", value: "3,204 this month" },
              { label: "API calls", value: "48,910" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{r.label}</span>
                <span className="font-semibold text-slate-900">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 p-4 text-white">
            <p className="text-sm font-semibold">Upgrade to Scale</p>
            <p className="mt-1 text-xs text-indigo-100">
              Advanced analytics, custom roles and a dedicated success manager.
            </p>
            <button className="mt-3 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700">
              Compare plans
            </button>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Modules</h2>
          <p className="text-sm text-slate-500">Switch a board on or off for the whole organisation</p>
          <ul className="mt-4 divide-y divide-slate-100">
            {MODULES.map((m) => (
              <li key={m.name} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-base">{m.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{m.name}</p>
                  <p className="truncate text-xs text-slate-500">{m.desc}</p>
                </div>
                <span className="ml-auto">
                  <Toggle on={m.on} />
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-base font-semibold text-slate-900">Integrations</h2>
            <p className="text-sm text-slate-500">Connect the tools your teams already use</p>
            <ul className="mt-4 space-y-2.5">
              {INTEGRATIONS.map((it) => (
                <li key={it.name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-sm">{it.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{it.name}</p>
                    <p className="truncate text-xs text-slate-500">{it.desc}</p>
                  </div>
                  <span className="ml-auto">
                    {it.connected ? <Badge tone="emerald">Connected</Badge> : <Badge tone="slate">Connect</Badge>}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-rose-200 bg-rose-50/50 p-5">
            <h2 className="text-base font-semibold text-rose-900">Demo controls</h2>
            <p className="mt-1 text-sm text-rose-700">
              This sandbox ships with a full sample dataset. Regenerate it at any time to show the client a fresh
              environment — boards, KPIs and reports all rebuild automatically.
            </p>
            <div className="mt-4">
              <ResetDemoButton />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
