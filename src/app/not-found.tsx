import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-5 text-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Corevo Business OS</p>
        <h1 className="mt-4 text-6xl font-bold tracking-tight text-white">404</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-slate-400">
          This page does not exist. The boards you are looking for are one click away.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Back to website
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Open the demo
          </Link>
        </div>
      </div>
    </div>
  );
}
