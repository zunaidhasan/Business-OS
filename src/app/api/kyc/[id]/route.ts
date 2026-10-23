import { db } from "@/db";
import { kycCases } from "@/db/schema";
import { eq } from "drizzle-orm";
import { KYC_STATUSES } from "@/db/schema";
import { badRequest, ok, refreshBoard, str } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseId = Number(id);
  if (!Number.isFinite(caseId)) return badRequest("Invalid id");

  const body = (await req.json()) as Record<string, unknown>;
  const status = str(body.stage) || str(body.status);
  if (!KYC_STATUSES.includes(status as (typeof KYC_STATUSES)[number])) {
    return badRequest(`status must be one of ${KYC_STATUSES.join(", ")}`);
  }

  const [row] = await db
    .update(kycCases)
    .set({ status })
    .where(eq(kycCases.id, caseId))
    .returning({ id: kycCases.id, status: kycCases.status });

  if (!row) return badRequest("KYC case not found", 404);
  refreshBoard();
  return ok(row);
}
