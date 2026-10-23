import { db } from "@/db";
import { deals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DEAL_STAGES } from "@/db/schema";
import { badRequest, ok, refreshBoard, str } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dealId = Number(id);
  if (!Number.isFinite(dealId)) return badRequest("Invalid id");

  const body = (await req.json()) as Record<string, unknown>;
  const stage = str(body.stage);
  if (!DEAL_STAGES.includes(stage as (typeof DEAL_STAGES)[number])) {
    return badRequest(`stage must be one of ${DEAL_STAGES.join(", ")}`);
  }

  const [row] = await db
    .update(deals)
    .set({ stage })
    .where(eq(deals.id, dealId))
    .returning({ id: deals.id, stage: deals.stage });

  if (!row) return badRequest("Deal not found", 404);
  refreshBoard();
  return ok(row);
}
