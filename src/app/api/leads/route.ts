import { db } from "@/db";
import { leads } from "@/db/schema";
import { LEAD_STAGES } from "@/db/schema";
import { getOrgId, intVal, ok, refreshBoard, str } from "@/lib/api";

export const dynamic = "force-dynamic";

const SOURCES = ["Website", "LinkedIn", "Referral", "Cold Call", "Trade Show", "Webinar", "Partner"];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const name = str(body.name);
    const company = str(body.company);
    if (!name || !company) {
      return Response.json({ error: "Contact name and company are required" }, { status: 400 });
    }
    const orgId = await getOrgId();
    const [row] = await db
      .insert(leads)
      .values({
        orgId,
        name,
        company,
        email: str(body.email) || `${name.split(" ")[0].toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, "")}.com`,
        phone: str(body.phone),
        source: SOURCES.includes(str(body.source)) ? str(body.source) : "Website",
        stage: "new",
        value: intVal(body.value, 10000),
        score: intVal(body.score, 50),
        notes: str(body.notes),
      })
      .returning({ id: leads.id });
    refreshBoard();
    return ok(row, 201);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

export { LEAD_STAGES };
