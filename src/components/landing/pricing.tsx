"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/format";

const PLANS = [
  {
    name: "Starter",
    monthly: 49,
    tagline: "For small teams putting their first process in place",
    features: ["Up to 5 users", "Lead + Sales boards", "Basic reports", "Email support"],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Growth",
    monthly: 149,
    tagline: "The full operating system for scaling companies",
    features: [
      "Unlimited users",
      "All 6 boards incl. KYC & Operations",
      "Advanced reports & funnels",
      "Automations & integrations",
      "Priority support",
    ],
    cta: "Book a demo",
    highlight: true,
  },
  {
    name: "Scale",
    monthly: 399,
    tagline: "For multi-entity businesses with compliance needs",
    features: [
      "Everything in Growth",
      "Custom roles & permissions",
      "Audit exports & SSO",
      "Dedicated success manager",
      "99.9% uptime SLA",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "We replaced three spreadsheets and a WhatsApp group with Corevo. Lead response time dropped from days to minutes, and for the first time sales and operations look at the same numbers.",
    name: "Priya Nair",
    role: "VP Revenue, Northwind Industries",
    initials: "PN",
    color: "bg-indigo-500",
  },
  {
    quote:
      "The KYC board alone paid for the subscription. Onboarding used to take a week of email ping-pong — now it is a two-day, fully auditable queue.",
    name: "Ananya Iyer",
    role: "Compliance Officer",
    initials: "AI",
    color: "bg-amber-500",
  },
  {
    quote:
      "My ops team finally has a single board for every commitment. Nothing gets lost, and I can see capacity before I promise a date to a customer.",
    name: "Tom Baker",
    role: "Operations Lead",
    initials: "TB",
    color: "bg-violet-500",
  },
];

const FAQS = [
  {
    q: "How long does implementation take?",
    a: "Most teams are live the same day. We import your existing leads and deals from a spreadsheet, configure your stages, and train your team in a single 60-minute session.",
  },
  {
    q: "Can we start with just one or two boards?",
    a: "Yes. Every module is independent — start with the Lead Board or Sales Board and switch on KYC and Operations whenever you are ready. Your data model already connects them.",
  },
  {
    q: "Is our data secure and portable?",
    a: "Data is encrypted in transit and at rest, with role-based access on every board and a complete audit trail. You can export everything — boards, documents and activity history — at any time.",
  },
  {
    q: "Does it work on mobile?",
    a: "Every board is fully responsive and touch-friendly, so field teams can update leads, tasks and KYC cases from a phone without a laptop.",
  },
  {
    q: "What does the pilot include?",
    a: "A 14-day pilot with your own data, a named implementation contact, and a go/no-go review at the end. If it does not move your numbers, you walk away — no cost.",
  },
  {
    q: "Can it integrate with our existing tools?",
    a: "Corevo connects to Slack, Google Workspace, WhatsApp Business, accounting tools and 4,000+ apps through Zapier, plus a REST API and webhooks on Growth and Scale plans.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="flex-1 text-base font-medium text-slate-900">{q}</span>
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-500 transition",
            open && "rotate-45 border-indigo-300 bg-indigo-50 text-indigo-600",
          )}
        >
          +
        </span>
      </button>
      {open ? <p className="pb-5 pr-10 text-sm leading-relaxed text-slate-600">{a}</p> : null}
    </div>
  );
}

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Priced per company, not per headache
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Unlimited records on every plan. Switch modules on as you grow — no migration, no re-implementation.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                !annual ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                annual ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900",
              )}
            >
              Annual <span className="ml-1 text-xs text-emerald-400">−20%</span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => {
            const price = annual ? Math.round(p.monthly * 0.8) : p.monthly;
            return (
              <div
                key={p.name}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-white p-7 shadow-sm transition",
                  p.highlight
                    ? "border-indigo-300 shadow-xl shadow-indigo-100 lg:-translate-y-2"
                    : "border-slate-200 hover:shadow-lg",
                )}
              >
                {p.highlight ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white shadow">
                    Most popular
                  </span>
                ) : null}
                <h3 className="text-lg font-semibold text-slate-900">{p.name}</h3>
                <p className="mt-1 min-h-[40px] text-sm text-slate-500">{p.tagline}</p>
                <p className="mt-5 flex items-end gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">${price}</span>
                  <span className="pb-1 text-sm text-slate-500">/month</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {annual ? `billed annually · $${price * 12}/yr` : "billed monthly · cancel anytime"}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-emerald-100 text-[10px] text-emerald-700">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={cn(
                    "mt-7 rounded-xl px-4 py-3 text-center text-sm font-semibold transition",
                    p.highlight
                      ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                      : "border border-slate-200 text-slate-800 hover:bg-slate-50",
                  )}
                >
                  {p.cta}
                </Link>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          All plans include unlimited records, SSL, daily backups and the full REST API.
        </p>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Proof</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Teams that switched, stayed
          </h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
              <div className="flex gap-0.5 text-amber-400" aria-label="5 out of 5">
                {"★★★★★"}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-full ${t.color} text-xs font-bold text-white`}>
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Questions buyers ask us
          </h2>
        </div>
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-2 shadow-sm">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section id="demo" className="bg-white pb-24 pt-4">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-indigo-600/30 blur-[100px]" />
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-violet-600/25 blur-[100px]" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to see Corevo with your own numbers?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Book a 30-minute walkthrough. We will load a sample of your leads, deals and customers into the boards
              live on the call — you keep the workspace either way.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
              >
                Explore the live demo
              </Link>
              <a
                href="#pricing"
                className="rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Compare plans
              </a>
            </div>
            <p className="mt-5 text-xs text-slate-400">
              Average go-live: 1 day · No credit card · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const FOOTER_COLS = [
  {
    title: "Product",
    links: [
      { label: "Lead Board", href: "/dashboard/leads" },
      { label: "Sales Board", href: "/dashboard/sales" },
      { label: "KYC Board", href: "/dashboard/kyc" },
      { label: "Operation Board", href: "/dashboard/operations" },
      { label: "Reports", href: "/dashboard/reports" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Customers", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Live demo", href: "/dashboard" },
      { label: "Implementation guide", href: "#" },
      { label: "API docs", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
      { label: "DPA", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white">
                C
              </span>
              <span className="text-base font-bold tracking-tight text-slate-900">Corevo</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              The business operating system for teams that outgrew spreadsheets. Leads, sales, compliance and
              operations — one cockpit.
            </p>
            <p className="mt-4 text-xs text-slate-400">hello@corevo.io · +1 (555) 010-2030</p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-900">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-500 transition hover:text-slate-900">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Corevo Technologies. All rights reserved.</p>
          <p className="ml-auto text-xs text-slate-400">Demo environment · data resets on request</p>
        </div>
      </div>
    </footer>
  );
}
