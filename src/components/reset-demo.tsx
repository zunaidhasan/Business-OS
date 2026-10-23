"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResetDemoButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function reset() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; leads?: number; deals?: number };
      if (!res.ok || !data.ok) throw new Error("failed");
      setMsg(`Demo data regenerated — ${data.leads} leads, ${data.deals} deals.`);
      router.refresh();
    } catch {
      setMsg("Reset failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => void reset()}
        disabled={busy}
        className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 disabled:opacity-60"
      >
        {busy ? "Resetting…" : "Reset demo data"}
      </button>
      {msg ? <p className="mt-2 text-xs font-medium text-emerald-600">{msg}</p> : null}
    </div>
  );
}
