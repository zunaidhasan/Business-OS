import { resetDemoData } from "@/lib/seed";
import { ok } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/** Regenerates the full demo dataset (used by Settings → Reset demo data). */
export async function POST() {
  const result = await resetDemoData();
  revalidatePath("/dashboard", "layout");
  revalidatePath("/", "page");
  return ok({ ok: true, ...result });
}
