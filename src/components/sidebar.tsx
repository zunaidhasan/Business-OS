"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/format";

export const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊", hint: "Company pulse" },
  { href: "/dashboard/leads", label: "Lead Board", icon: "🎯", hint: "Acquisition" },
  { href: "/dashboard/sales", label: "Sales Board", icon: "💰", hint: "Pipeline" },
  { href: "/dashboard/kyc", label: "KYC Board", icon: "🛡️", hint: "Compliance" },
  { href: "/dashboard/operations", label: "Operation Board", icon: "⚙️", hint: "Execution" },
] as const;

export const NAV_SECONDARY = [
  { href: "/dashboard/reports", label: "Reports", icon: "📈", hint: "Analytics" },
  { href: "/dashboard/team", label: "Team", icon: "👥", hint: "People" },
  { href: "/dashboard/settings", label: "Settings", icon: "🔧", hint: "Configuration" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-slate-950 px-4 py-5 text-slate-300 lg:flex">
      <Link href="/" className="flex items-center gap-2.5 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white">
          C
        </span>
        <span>
          <span className="block text-sm font-bold leading-tight text-white">Corevo</span>
          <span className="block text-[11px] leading-tight text-slate-400">Business OS</span>
        </span>
      </Link>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
        <p className="text-[11px] uppercase tracking-wide text-slate-400">Organisation</p>
        <p className="truncate text-sm font-semibold text-white">Northwind Industries</p>
        <p className="text-[11px] text-emerald-400">● Growth plan · live demo</p>
      </div>

      <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
        <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Workspace</p>
        {[...NAV, ...NAV_SECONDARY].map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition",
                active ? "bg-indigo-500/15 text-white ring-1 ring-indigo-400/30" : "hover:bg-white/5 hover:text-white",
              )}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {active ? <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-2">
        <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 p-3 ring-1 ring-white/10">
          <p className="text-xs font-semibold text-white">Invite your team</p>
          <p className="mt-0.5 text-[11px] text-slate-300">Unlimited seats on the Growth plan.</p>
          <Link
            href="/dashboard/team"
            className="mt-2 inline-block rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-white/20"
          >
            Manage members
          </Link>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          ← Back to website
        </Link>
        <div className="flex items-center gap-2.5 rounded-xl px-1.5 py-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
            AR
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">Arjun Rao</p>
            <p className="truncate text-[11px] text-slate-400">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1.5 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
      {[...NAV, ...NAV_SECONDARY].map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
              active ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200" : "text-slate-600 hover:bg-slate-100",
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
