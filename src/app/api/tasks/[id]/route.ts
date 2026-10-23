import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TASK_STATUSES } from "@/db/schema";
import { badRequest, ok, refreshBoard, str, intVal } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const taskId = Number(id);
  if (!Number.isFinite(taskId)) return badRequest("Invalid id");

  const body = (await req.json()) as Record<string, unknown>;
  const status = str(body.stage) || str(body.status);
  if (!TASK_STATUSES.includes(status as (typeof TASK_STATUSES)[number])) {
    return badRequest(`status must be one of ${TASK_STATUSES.join(", ")}`);
  }

  const progress = status === "done" ? 100 : intVal(body.progress, -1);

  const [row] = await db
    .update(tasks)
    .set(progress >= 0 ? { status, progress } : { status })
    .where(eq(tasks.id, taskId))
    .returning({ id: tasks.id, status: tasks.status });

  if (!row) return badRequest("Task not found", 404);
  refreshBoard();
  return ok(row);
}
