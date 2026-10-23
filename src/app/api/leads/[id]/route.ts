import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LEAD_STAGES } from "@/db/schema";
import { badRequest, ok, refreshBoard, str } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isFinite(leadId)) return badRequest("Invalid id");

  const body = (await req.json()) as Record<string, unknown>;
  const stage = str(body.stage);
  if (!LEAD_STAGES.includes(stage as (typeof LEAD_STAGES)[number])) {
    return badRequest(`stage must be one of ${LEAD_STAGES.join(", ")}`);
  }

  const [row] = await db
    .update(leads)
    .set({ stage, updatedAt: new Date() })
    .where(eq(leads.id, leadId))
    .returning({ id: leads.id, stage: leads.stage });

  if (!row) return badRequest("Lead not found", 404);
  refreshBoard();
  return ok(row);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isFinite(leadId)) return badRequest("Invalid id");
  await db.delete(leads).where(eq(leads.id, leadId));
  refreshBoard();
  return ok({ deleted: leadId });
}
