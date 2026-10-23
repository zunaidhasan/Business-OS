import { Board, type FieldConfig } from "@/components/board";
import { PageHeader, Stat } from "@/components/ui";
import { getTasksBoard, TASK_COLUMNS, getTeam } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function OperationsPage() {
  const [items, team] = await Promise.all([getTasksBoard(), getTeam()]);

  const fields: FieldConfig[] = [
    { name: "title", label: "Task title", type: "text", required: true, placeholder: "Client onboarding checklist" },
    { name: "description", label: "Description", type: "textarea", half: false, placeholder: "What needs to happen?" },
    {
      name: "priority",
      label: "Priority",
      type: "select",
      options: ["low", "medium", "high", "urgent"],
    },
    {
      name: "assignee",
      label: "Assignee",
      type: "select",
      options: team.map((u) => u.name),
    },
    { name: "dueDate", label: "Due date", type: "date" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["backlog", "todo", "progress", "review"],
    },
  ];

  const done = items.filter((i) => i.stage === "done");
  const active = items.filter((i) => ["todo", "progress", "review"].includes(i.stage));
  const review = items.filter((i) => i.stage === "review");
  const today = new Date().toISOString().slice(0, 10);
  const overdue = items.filter((i) => i.stage !== "done" && (i.details ?? []).some((d) => d.label === "Due date" && d.value < today && d.value !== "—"));
  const completion = items.length ? Math.round((done.length / items.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Module 04 · Execution"
        title="Operation Board"
        description="Turn strategy into daily execution. Assign owners, set priorities, and keep every commitment visible until it ships."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active tasks" value={String(active.length)} delta={`${items.length} on the board`} icon="⚙️" tone="violet" />
        <Stat label="In review" value={String(review.length)} delta="Awaiting sign-off" icon="🔍" tone="amber" />
        <Stat label="Completed" value={String(done.length)} delta={`${completion}% completion`} icon="✅" tone="emerald" />
        <Stat label="Overdue" value={String(overdue.length)} delta="Past due date" icon="⏰" tone="rose" />
      </div>

      <Board
        resource="tasks"
        label="Tasks"
        columns={TASK_COLUMNS}
        items={items}
        fields={fields}
        accent="#8b5cf6"
        emptyHint="Recurring operations and project tasks appear here."
      />
    </div>
  );
}
