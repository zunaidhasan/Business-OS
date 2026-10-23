import { db } from "@/db";
import { desc, sql } from "drizzle-orm";
import {
  activities,
  deals,
  invoices,
  kycCases,
  kycDocuments,
  leads,
  tasks,
  users,
} from "@/db/schema";
import { shortDate, timeAgo } from "@/lib/format";
import type { Tone } from "@/components/ui";

/* ------------------------------------------------------------------ */
/*  Shared board types                                                 */
/* ------------------------------------------------------------------ */

export type BoardColumn = { id: string; label: string; tone: string; hint: string };

export type BoardItem = {
  id: number;
  stage: string;
  title: string;
  subtitle?: string;
  value?: number;
  badge?: { label: string; tone: Tone };
  meta?: Array<{ label: string }>;
  tags?: string[];
  initials?: string;
  color?: string;
  progress?: number;
  details?: Array<{ label: string; value: string }>;
  activities?: Array<{ id: number; text: string; time: string }>;
};

export type Point = { label: string; value: number };

type ActivityRow = {
  id: number;
  kind: string;
  target: string;
  action: string;
  actorId: number | null;
  createdAt: Date;
};

async function getActivities(): Promise<ActivityRow[]> {
  const rows = await db
    .select({
      id: activities.id,
      kind: activities.kind,
      target: activities.target,
      action: activities.action,
      actorId: activities.actorId,
      createdAt: activities.createdAt,
    })
    .from(activities)
    .orderBy(desc(activities.createdAt))
    .limit(120);
  return rows;
}

function itemActivities(rows: ActivityRow[], kind: string, needle: string, fallback: Array<{ text: string; time: string }>) {
  const matched = rows
    .filter((r) => r.kind === kind && needle && r.target.toLowerCase().includes(needle.toLowerCase()))
    .slice(0, 4)
    .map((r) => ({ id: r.id, text: r.action, time: timeAgo(r.createdAt) }));
  const base = fallback.map((f, i) => ({ id: -i - 1, ...f }));
  return [...matched, ...base].slice(0, 5);
}

/* ------------------------------- Leads ------------------------------- */

export const LEAD_COLUMNS: BoardColumn[] = [
  { id: "new", label: "New", tone: "#0ea5e9", hint: "Inbound & captured" },
  { id: "contacted", label: "Contacted", tone: "#6366f1", hint: "First touch done" },
  { id: "qualified", label: "Qualified", tone: "#8b5cf6", hint: "Budget & need confirmed" },
  { id: "proposal", label: "Proposal", tone: "#f59e0b", hint: "Quote shared" },
  { id: "negotiation", label: "Negotiation", tone: "#ec4899", hint: "Terms in review" },
  { id: "won", label: "Won", tone: "#10b981", hint: "Converted" },
  { id: "lost", label: "Lost", tone: "#f43f5e", hint: "Disqualified" },
];

const SOURCE_TONE: Record<string, Tone> = {
  Website: "sky",
  LinkedIn: "indigo",
  Referral: "emerald",
  "Cold Call": "amber",
  "Trade Show": "violet",
  Webinar: "rose",
  Partner: "slate",
};

export async function getLeadsBoard(): Promise<BoardItem[]> {
  const [rows, acts, userRows] = await Promise.all([
    db.query.leads.findMany({ with: { owner: true }, orderBy: desc(leads.updatedAt) }),
    getActivities(),
    db.select().from(users),
  ]);
  const userMap = new Map(userRows.map((u) => [u.id, u]));
  return rows.map((l) => {
    const owner = l.owner ? userMap.get(l.owner.id) ?? null : null;
    return {
      id: l.id,
      stage: l.stage,
      title: l.name,
      subtitle: l.company,
      value: l.value,
      badge: { label: l.source, tone: SOURCE_TONE[l.source] ?? "slate" },
      meta: [
        { label: `Score ${l.score}` },
        ...(owner ? [{ label: `Owner ${owner.name.split(" ")[0]}` }] : []),
        { label: `Updated ${timeAgo(l.updatedAt)}` },
      ],
      initials: owner ? owner.name : undefined,
      color: owner?.color,
      progress: l.score,
      details: [
        { label: "Email", value: l.email },
        { label: "Phone", value: l.phone || "—" },
        { label: "Company", value: l.company },
        { label: "Source", value: l.source },
        { label: "Estimated value", value: `$${l.value.toLocaleString("en-US")}` },
        { label: "Lead score", value: `${l.score}/100` },
        { label: "Owner", value: owner?.name ?? "Unassigned" },
        { label: "Created", value: shortDate(l.createdAt) },
      ],
      activities: itemActivities(acts, "lead", l.company, [
        { text: `Lead captured from ${l.source}`, time: timeAgo(l.createdAt) },
        { text: l.notes || "Follow-up scheduled", time: timeAgo(l.updatedAt) },
      ]),
    };
  });
}

/* ------------------------------- Deals ------------------------------- */

export const DEAL_COLUMNS: BoardColumn[] = [
  { id: "discovery", label: "Discovery", tone: "#0ea5e9", hint: "Qualifying needs" },
  { id: "proposal", label: "Proposal Sent", tone: "#6366f1", hint: "Awaiting feedback" },
  { id: "negotiation", label: "Negotiation", tone: "#f59e0b", hint: "Commercial terms" },
  { id: "contract", label: "Contract", tone: "#8b5cf6", hint: "Legal & signature" },
  { id: "won", label: "Closed Won", tone: "#10b981", hint: "Booked revenue" },
  { id: "lost", label: "Closed Lost", tone: "#f43f5e", hint: "Lost opportunity" },
];

export async function getDealsBoard(): Promise<BoardItem[]> {
  const [rows, acts, userRows] = await Promise.all([
    db.query.deals.findMany({ with: { owner: true }, orderBy: desc(deals.createdAt) }),
    getActivities(),
    db.select().from(users),
  ]);
  const userMap = new Map(userRows.map((u) => [u.id, u]));
  return rows.map((d) => {
    const owner = d.owner ? userMap.get(d.owner.id) ?? null : null;
    return {
      id: d.id,
      stage: d.stage,
      title: d.title,
      subtitle: d.company,
      value: d.value,
      badge: { label: `${d.probability}% likely`, tone: d.probability >= 70 ? "emerald" : d.probability >= 40 ? "amber" : "slate" },
      meta: [
        { label: `Close ${d.closeDate || "TBD"}` },
        ...(owner ? [{ label: owner.name }] : []),
      ],
      initials: owner?.name,
      color: owner?.color,
      progress: d.probability,
      details: [
        { label: "Company", value: d.company },
        { label: "Primary contact", value: d.contact || "—" },
        { label: "Deal value", value: `$${d.value.toLocaleString("en-US")}` },
        { label: "Win probability", value: `${d.probability}%` },
        { label: "Expected close", value: d.closeDate || "TBD" },
        { label: "Owner", value: owner?.name ?? "Unassigned" },
      ],
      activities: itemActivities(acts, "deal", d.title, [
        { text: `Deal created for ${d.company}`, time: timeAgo(d.createdAt) },
        { text: `Probability set to ${d.probability}%`, time: timeAgo(d.createdAt) },
      ]),
    };
  });
}

/* -------------------------------- KYC -------------------------------- */

export const KYC_COLUMNS: BoardColumn[] = [
  { id: "submitted", label: "Submitted", tone: "#0ea5e9", hint: "New applications" },
  { id: "review", label: "In Review", tone: "#6366f1", hint: "Compliance checking" },
  { id: "info", label: "Info Requested", tone: "#f59e0b", hint: "Waiting on applicant" },
  { id: "verified", label: "Verified", tone: "#10b981", hint: "Approved" },
  { id: "rejected", label: "Rejected", tone: "#f43f5e", hint: "Declined" },
];

const RISK_TONE: Record<string, Tone> = { low: "emerald", medium: "amber", high: "rose" };

export async function getKycBoard(): Promise<BoardItem[]> {
  const [cases, docs, acts, userRows] = await Promise.all([
    db.query.kycCases.findMany({ with: { reviewer: true }, orderBy: desc(kycCases.submittedAt) }),
    db.select().from(kycDocuments),
    getActivities(),
    db.select().from(users),
  ]);
  const userMap = new Map(userRows.map((u) => [u.id, u]));
  const docsByCase = new Map<number, typeof docs>();
  for (const d of docs) {
    if (d.caseId == null) continue;
    const list = docsByCase.get(d.caseId) ?? [];
    list.push(d);
    docsByCase.set(d.caseId, list);
  }
  return cases.map((c) => {
    const reviewer = c.reviewer ? userMap.get(c.reviewer.id) ?? null : null;
    const caseDocs = docsByCase.get(c.id) ?? [];
    const verifiedDocs = caseDocs.filter((d) => d.status === "verified").length;
    return {
      id: c.id,
      stage: c.status,
      title: c.applicant,
      subtitle: `${c.company} · ${c.entityType}`,
      badge: { label: `${c.risk} risk`, tone: RISK_TONE[c.risk] ?? "slate" },
      meta: [
        { label: c.country },
        { label: `${verifiedDocs}/${caseDocs.length} docs` },
        { label: `Submitted ${timeAgo(c.submittedAt)}` },
      ],
      initials: reviewer?.name,
      color: reviewer?.color,
      progress: caseDocs.length ? Math.round((verifiedDocs / caseDocs.length) * 100) : 0,
      details: [
        { label: "Applicant", value: c.applicant },
        { label: "Entity", value: `${c.entityType} — ${c.company}` },
        { label: "Country", value: c.country },
        { label: "Risk rating", value: c.risk.toUpperCase() },
        { label: "Documents", value: `${verifiedDocs} of ${caseDocs.length} verified` },
        { label: "Reviewer", value: reviewer?.name ?? "Unassigned" },
        { label: "Submitted", value: shortDate(c.submittedAt) },
        { label: "Notes", value: c.notes },
      ],
      activities: itemActivities(acts, "kyc", c.company, [
        { text: `Application submitted from ${c.country}`, time: timeAgo(c.submittedAt) },
        { text: c.notes, time: timeAgo(c.submittedAt) },
      ]),
    };
  });
}

/* ----------------------------- Operations ---------------------------- */

export const TASK_COLUMNS: BoardColumn[] = [
  { id: "backlog", label: "Backlog", tone: "#94a3b8", hint: "Not scheduled" },
  { id: "todo", label: "To Do", tone: "#0ea5e9", hint: "Ready to start" },
  { id: "progress", label: "In Progress", tone: "#6366f1", hint: "Being worked on" },
  { id: "review", label: "In Review", tone: "#f59e0b", hint: "Needs sign-off" },
  { id: "done", label: "Done", tone: "#10b981", hint: "Completed" },
];

const PRIORITY_TONE: Record<string, Tone> = {
  urgent: "rose",
  high: "amber",
  medium: "indigo",
  low: "slate",
};

export async function getTasksBoard(): Promise<BoardItem[]> {
  const [rows, acts, userRows] = await Promise.all([
    db.query.tasks.findMany({ with: { assignee: true }, orderBy: desc(tasks.createdAt) }),
    getActivities(),
    db.select().from(users),
  ]);
  const userMap = new Map(userRows.map((u) => [u.id, u]));
  return rows.map((t) => {
    const assignee = t.assignee ? userMap.get(t.assignee.id) ?? null : null;
    return {
      id: t.id,
      stage: t.status,
      title: t.title,
      subtitle: t.description,
      badge: { label: t.priority, tone: PRIORITY_TONE[t.priority] ?? "slate" },
      meta: [
        { label: t.dueDate ? `Due ${t.dueDate}` : "No due date" },
        ...(assignee ? [{ label: assignee.name }] : [{ label: "Unassigned" }]),
      ],
      tags: t.tags,
      initials: assignee?.name,
      color: assignee?.color,
      progress: t.progress,
      details: [
        { label: "Task", value: t.title },
        { label: "Description", value: t.description || "—" },
        { label: "Priority", value: t.priority.toUpperCase() },
        { label: "Progress", value: `${t.progress}%` },
        { label: "Due date", value: t.dueDate || "—" },
        { label: "Assignee", value: assignee?.name ?? "Unassigned" },
        { label: "Tags", value: t.tags.join(", ") || "—" },
        { label: "Created", value: shortDate(t.createdAt) },
      ],
      activities: itemActivities(acts, "task", t.title, [
        { text: "Task added to the board", time: timeAgo(t.createdAt) },
        { text: `Progress updated to ${t.progress}%`, time: timeAgo(t.createdAt) },
      ]),
    };
  });
}

/* ------------------------------ Dashboard ---------------------------- */

export async function getDashboard() {
  const [leadRows, dealRows, kycRows, taskRows, invoiceRows, teamRows, acts] = await Promise.all([
    db.select().from(leads),
    db.select().from(deals),
    db.select().from(kycCases),
    db.select().from(tasks),
    db.select().from(invoices),
    db.select().from(users),
    getActivities(),
  ]);

  const openLeads = leadRows.filter((l) => !["won", "lost"].includes(l.stage));
  const openDeals = dealRows.filter((d) => !["won", "lost"].includes(d.stage));
  const wonDeals = dealRows.filter((d) => d.stage === "won");
  const pipelineValue = openDeals.reduce((s, d) => s + d.value, 0);
  const forecastValue = openDeals.reduce((s, d) => s + (d.value * d.probability) / 100, 0);
  const wonValue = wonDeals.reduce((s, d) => s + d.value, 0);
  const kycPending = kycRows.filter((k) => ["submitted", "review", "info"].includes(k.status)).length;
  const kycVerified = kycRows.filter((k) => k.status === "verified").length;
  const tasksOpen = taskRows.filter((t) => t.status !== "done").length;
  const tasksDone = taskRows.filter((t) => t.status === "done").length;
  const overdue = taskRows.filter((t) => t.status !== "done" && t.dueDate && t.dueDate < new Date().toISOString().slice(0, 10));
  const paidInvoices = invoiceRows.filter((i) => i.status === "paid");
  const collected = paidInvoices.reduce((s, i) => s + i.amount, 0);
  const outstanding = invoiceRows.filter((i) => ["sent", "overdue"].includes(i.status)).reduce((s, i) => s + i.amount, 0);
  const winRate = dealRows.length ? Math.round((wonDeals.length / dealRows.length) * 100) : 0;
  const conversion = leadRows.length ? Math.round((leadRows.filter((l) => l.stage === "won").length / leadRows.length) * 100) : 0;

  /* revenue by month (paid invoices, last 6 months) */
  const months: Point[] = [];
  const base = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);
    const value = paidInvoices
      .filter((inv) => inv.issuedAt.startsWith(key))
      .reduce((s, inv) => s + inv.amount, 0);
    months.push({ label: d.toLocaleDateString("en-US", { month: "short" }), value });
  }
  const collectedTotal = months.reduce((s, m) => s + m.value, 0);
  if (collectedTotal === 0) {
    // keep the chart meaningful even before invoices exist
    months.forEach((m, i) => (m.value = 42000 + i * 9000 + ((i * 37) % 11) * 1200));
  }

  /* lead sources */
  const sourceMap = new Map<string, number>();
  leadRows.forEach((l) => sourceMap.set(l.source, (sourceMap.get(l.source) ?? 0) + 1));
  const sourceColors = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
  const sources = [...sourceMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({ label, value, color: sourceColors[i % sourceColors.length] }));

  /* funnel */
  const stageCount = (s: string) => leadRows.filter((l) => l.stage === s).length;
  const funnel = [
    { label: "Captured", value: leadRows.length },
    { label: "Contacted", value: stageCount("contacted") + stageCount("qualified") + stageCount("proposal") + stageCount("negotiation") + stageCount("won") },
    { label: "Qualified", value: stageCount("qualified") + stageCount("proposal") + stageCount("negotiation") + stageCount("won") },
    { label: "Proposal", value: stageCount("proposal") + stageCount("negotiation") + stageCount("won") },
    { label: "Won", value: stageCount("won") },
  ];

  /* team leaderboard — won deal value per owner */
  const ownerMap = new Map(teamRows.map((u) => [u.id, u]));
  const board = new Map<number, number>();
  wonDeals.forEach((d) => {
    if (d.ownerId) board.set(d.ownerId, (board.get(d.ownerId) ?? 0) + d.value);
  });
  const leaderboard = [...board.entries()]
    .map(([id, value]) => ({ label: ownerMap.get(id)?.name ?? "Unassigned", sub: ownerMap.get(id)?.role, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const workload = teamRows.map((u) => ({
    user: u,
    openTasks: taskRows.filter((t) => t.assigneeId === u.id && t.status !== "done").length,
    openDeals: openDeals.filter((d) => d.ownerId === u.id).length,
    leads: leadRows.filter((l) => l.ownerId === u.id).length,
  }));

  const recent = acts.slice(0, 8).map((a) => ({
    id: a.id,
    text: a.action,
    actor: ownerMap.get(a.actorId ?? -1)?.name ?? "System",
    color: ownerMap.get(a.actorId ?? -1)?.color ?? "#94a3b8",
    time: timeAgo(a.createdAt),
    kind: a.kind,
  }));

  return {
    kpis: {
      leads: leadRows.length,
      openLeads: openLeads.length,
      pipelineValue,
      forecastValue,
      wonValue,
      winRate,
      conversion,
      kycPending,
      kycVerified,
      kycTotal: kycRows.length,
      tasksOpen,
      tasksDone,
      overdue: overdue.length,
      collected,
      outstanding,
      invoices: invoiceRows.length,
    },
    months,
    sources,
    funnel,
    leaderboard,
    workload,
    recent,
  };
}

export async function getTeam() {
  return db.select().from(users).orderBy(users.id);
}

export async function getInvoices() {
  return db.select().from(invoices).orderBy(desc(invoices.id));
}

export async function getRecentActivities(limit = 12) {  const rows = await db
    .select({
      id: activities.id,
      action: activities.action,
      kind: activities.kind,
      createdAt: activities.createdAt,
      actor: users.name,
      color: users.color,
    })
    .from(activities)
    .leftJoin(users, sql`${activities.actorId} = ${users.id}`)
    .orderBy(desc(activities.createdAt))
    .limit(limit);
  return rows.map((r) => ({ ...r, time: timeAgo(r.createdAt) }));
}
