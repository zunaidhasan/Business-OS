"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/format";

const LINKS = [
  { href: "#modules", label: "Modules" },
  { href: "#workflow", label: "Workflow" },
  { href: "#platform", label: "Platform" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors",
        scrolled ? "border-b border-white/10 bg-slate-950/85 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white shadow-lg shadow-indigo-900/40">
            C
          </span>
          <span className="text-base font-bold tracking-tight text-white">
            Corevo<span className="ml-1.5 text-xs font-medium text-slate-400">Business OS</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-white"
          >
            Client login
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-white"
          >
            Live demo
          </Link>
          <a
            href="#demo"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
          >
            Book a demo
          </a>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          className="ml-auto rounded-lg p-2 text-slate-200 transition hover:bg-white/10 lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/95 px-5 pb-5 pt-3 lg:hidden">
          <div className="grid gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="mt-3 grid gap-2">
            <Link
              href="/login"
              className="rounded-xl border border-white/15 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Client login
            </Link>
            <a
              href="#demo"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-900"
            >
              Book a demo
            </a>
            <Link
              href="/dashboard"
              className="rounded-xl px-4 py-2 text-center text-xs font-semibold text-indigo-200"
            >
              or explore the live demo →
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
