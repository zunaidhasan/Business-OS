import type { ReactNode } from "react";
import Link from "next/link";
import { MobileNav, Sidebar } from "@/components/sidebar";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  void ensureSeeded();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 hidden items-center gap-3 border-b border-slate-200 bg-white/85 px-6 py-3 backdrop-blur lg:flex">
          <div className="relative w-full max-w-md">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Search leads, deals, KYC cases, tasks…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 xl:inline">
              ● All systems operational
            </span>
            <button className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" strokeLinecap="round" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" strokeLinecap="round" />
              </svg>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <Link
              href="/"
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              View website
            </Link>
          </div>
        </header>
        <MobileNav />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
