import { db } from "@/db";
import { kycCases } from "@/db/schema";
import { getOrgId, ok, refreshBoard, str } from "@/lib/api";

export const dynamic = "force-dynamic";

const STATUSES = ["submitted", "review", "info"];
const RISKS = ["low", "medium", "high"];
const ENTITIES = ["Individual", "Business", "Partnership"];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const applicant = str(body.applicant);
    const company = str(body.company);
    if (!applicant || !company) {
      return Response.json({ error: "Applicant and entity name are required" }, { status: 400 });
    }
    const orgId = await getOrgId();
    const [row] = await db
      .insert(kycCases)
      .values({
        orgId,
        applicant,
        company,
        entityType: ENTITIES.includes(str(body.entityType)) ? str(body.entityType) : "Business",
        status: STATUSES.includes(str(body.status)) ? str(body.status) : "submitted",
        risk: RISKS.includes(str(body.risk)) ? str(body.risk) : "low",
        country: str(body.country) || "United States",
        notes: str(body.notes) || "Awaiting document collection.",
      })
      .returning({ id: kycCases.id });
    refreshBoard();
    return ok(row, 201);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
