import { db } from "@/db";
import { deals } from "@/db/schema";
import { getOrgId, intVal, ok, refreshBoard, str } from "@/lib/api";

export const dynamic = "force-dynamic";

const STAGES = ["discovery", "proposal", "negotiation", "contract"];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const title = str(body.title);
    const company = str(body.company);
    if (!title || !company) {
      return Response.json({ error: "Deal title and company are required" }, { status: 400 });
    }
    const orgId = await getOrgId();
    const [row] = await db
      .insert(deals)
      .values({
        orgId,
        title,
        company,
        contact: str(body.contact),
        stage: STAGES.includes(str(body.stage)) ? str(body.stage) : "discovery",
        value: intVal(body.value, 25000),
        probability: Math.min(100, Math.max(0, intVal(body.probability, 50))),
        closeDate: str(body.closeDate),
      })
      .returning({ id: deals.id });
    refreshBoard();
    return ok(row, 201);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
