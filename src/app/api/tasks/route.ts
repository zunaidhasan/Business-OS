import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrgId, ok, refreshBoard, str } from "@/lib/api";

export const dynamic = "force-dynamic";

const STATUSES = ["backlog", "todo", "progress", "review"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const title = str(body.title);
    if (!title) {
      return Response.json({ error: "Task title is required" }, { status: 400 });
    }
    const orgId = await getOrgId();

    const assigneeName = str(body.assignee);
    let assigneeId: number | null = null;
    if (assigneeName) {
      const match = await db.select({ id: users.id }).from(users).where(eq(users.name, assigneeName)).limit(1);
      assigneeId = match[0]?.id ?? null;
    }

    const [row] = await db
      .insert(tasks)
      .values({
        orgId,
        title,
        description: str(body.description),
        status: STATUSES.includes(str(body.status)) ? str(body.status) : "todo",
        priority: PRIORITIES.includes(str(body.priority)) ? str(body.priority) : "medium",
        assigneeId,
        dueDate: str(body.dueDate),
        tags: typeof body.tags === "string" && body.tags ? body.tags.split(",").map((t) => t.trim()) : [],
        progress: 0,
      })
      .returning({ id: tasks.id });
    refreshBoard();
    return ok(row, 201);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
