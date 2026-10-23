import { db } from "@/db";
import { organizations } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function getOrgId(): Promise<number> {
  const rows = await db.select({ id: organizations.id }).from(organizations).limit(1);
  if (!rows[0]) throw new Error("No organisation found — run the demo seed first.");
  return rows[0].id;
}

export function badRequest(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function ok<T>(data: T, status = 200) {
  return Response.json(data, { status });
}

export function refreshBoard() {
  revalidatePath("/dashboard", "layout");
}

export const str = (v: unknown, fallback = "") => (typeof v === "string" ? v.trim() : fallback);
export const intVal = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : fallback;
};
