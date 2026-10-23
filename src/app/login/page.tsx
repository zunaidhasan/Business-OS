"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setBusy(true);
        router.push("/dashboard");
      }}
      className="mt-8 space-y-4"
    >
      <label className="block">
        <span className="text-xs font-medium text-slate-300">Work email</span>
        <input
          type="email"
          required
          defaultValue="arjun@northwind.com"
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
          placeholder="you@company.com"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-slate-300">Password</span>
        <input
          type="password"
          required
          defaultValue="demo-password"
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
          placeholder="••••••••"
        />
      </label>
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-slate-400">
          <input type="checkbox" defaultChecked className="h-3.5 w-3.5 rounded border-white/20 bg-white/10" />
          Keep me signed in
        </label>
        <a href="#" className="font-medium text-indigo-300 hover:text-indigo-200">
          Forgot password?
        </a>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100 disabled:opacity-70"
      >
        {busy ? "Signing in…" : "Sign in to Corevo"}
      </button>
      <p className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3.5 py-2.5 text-center text-[11px] text-indigo-200">
        Demo environment — any email and password will sign you in.
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-5 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-violet-600/25 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link href="/" className="mx-auto flex w-fit items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white">
            C
          </span>
          <span className="text-base font-bold tracking-tight text-white">Corevo</span>
        </Link>

        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/70 p-7 shadow-2xl backdrop-blur-xl">
          <h1 className="text-xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to your business operating system.</p>
          <LoginForm />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold text-white">New to Corevo?</p>
          <p className="mt-1 text-xs text-slate-400">
            Explore the full demo workspace with sample leads, deals, KYC cases and operations — no signup needed.
          </p>
          <Link
            href="/dashboard"
            className="mt-3 inline-block rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            Open the demo →
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
