import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ------------------------------------------------------------------ */
/*  Corevo — Business Operating System : schema                        */
/* ------------------------------------------------------------------ */

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  plan: text("plan").notNull().default("Growth"),
  industry: text("industry").notNull().default("Technology"),
  currency: text("currency").notNull().default("$"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull().default("Sales"),
  color: text("color").notNull().default("#6366f1"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ----------------------------- Leads ------------------------------ */

export const LEAD_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    orgId: integer("org_id").references(() => organizations.id),
    name: text("name").notNull(),
    company: text("company").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull().default(""),
    source: text("source").notNull().default("Website"),
    stage: text("stage").notNull().default("new"),
    value: integer("value").notNull().default(0),
    score: integer("score").notNull().default(50),
    ownerId: integer("owner_id").references(() => users.id),
    notes: text("notes").notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    stageIdx: index("leads_stage_idx").on(t.stage),
  }),
);

/* ----------------------------- Sales ------------------------------ */

export const DEAL_STAGES = [
  "discovery",
  "proposal",
  "negotiation",
  "contract",
  "won",
  "lost",
] as const;

export const deals = pgTable(
  "deals",
  {
    id: serial("id").primaryKey(),
    orgId: integer("org_id").references(() => organizations.id),
    title: text("title").notNull(),
    company: text("company").notNull(),
    contact: text("contact").notNull().default(""),
    stage: text("stage").notNull().default("discovery"),
    value: integer("value").notNull().default(0),
    probability: integer("probability").notNull().default(50),
    ownerId: integer("owner_id").references(() => users.id),
    closeDate: text("close_date").notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    stageIdx: index("deals_stage_idx").on(t.stage),
  }),
);

/* ------------------------------ KYC ------------------------------- */

export const KYC_STATUSES = [
  "submitted",
  "review",
  "info",
  "verified",
  "rejected",
] as const;

export const kycCases = pgTable(
  "kyc_cases",
  {
    id: serial("id").primaryKey(),
    orgId: integer("org_id").references(() => organizations.id),
    applicant: text("applicant").notNull(),
    company: text("company").notNull(),
    entityType: text("entity_type").notNull().default("Business"),
    status: text("status").notNull().default("submitted"),
    risk: text("risk").notNull().default("low"),
    country: text("country").notNull().default("United States"),
    reviewerId: integer("reviewer_id").references(() => users.id),
    submittedAt: timestamp("submitted_at").notNull().defaultNow(),
    notes: text("notes").notNull().default(""),
  },
  (t) => ({
    statusIdx: index("kyc_status_idx").on(t.status),
  }),
);

export const kycDocuments = pgTable("kyc_documents", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => kycCases.id, { onDelete: "cascade" }),
  docType: text("doc_type").notNull(),
  fileName: text("file_name").notNull().default(""),
  status: text("status").notNull().default("pending"),
});

/* --------------------------- Operations --------------------------- */

export const TASK_STATUSES = [
  "backlog",
  "todo",
  "progress",
  "review",
  "done",
] as const;

export const tasks = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    orgId: integer("org_id").references(() => organizations.id),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    status: text("status").notNull().default("backlog"),
    priority: text("priority").notNull().default("medium"),
    assigneeId: integer("assignee_id").references(() => users.id),
    dueDate: text("due_date").notNull().default(""),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    progress: integer("progress").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    statusIdx: index("tasks_status_idx").on(t.status),
  }),
);

/* ---------------------------- Finance ----------------------------- */

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id),
  number: text("number").notNull(),
  client: text("client").notNull(),
  amount: integer("amount").notNull().default(0),
  status: text("status").notNull().default("draft"),
  issuedAt: text("issued_at").notNull().default(""),
  dueAt: text("due_at").notNull().default(""),
});

/* --------------------------- Activity feed ------------------------ */

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id),
  actorId: integer("actor_id").references(() => users.id),
  action: text("action").notNull(),
  target: text("target").notNull().default(""),
  kind: text("kind").notNull().default("lead"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ---------------------------- Relations --------------------------- */

export const usersRelations = relations(users, ({ many }) => ({
  leads: many(leads),
  deals: many(deals),
  tasks: many(tasks),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  owner: one(users, { fields: [leads.ownerId], references: [users.id] }),
}));

export const dealsRelations = relations(deals, ({ one }) => ({
  owner: one(users, { fields: [deals.ownerId], references: [users.id] }),
}));

export const kycCasesRelations = relations(kycCases, ({ one, many }) => ({
  reviewer: one(users, { fields: [kycCases.reviewerId], references: [users.id] }),
  documents: many(kycDocuments),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  assignee: one(users, { fields: [tasks.assigneeId], references: [users.id] }),
}));

/* ----------------------------- Types ------------------------------ */

export type Organization = typeof organizations.$inferSelect;
export type User = typeof users.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Deal = typeof deals.$inferSelect;
export type KycCase = typeof kycCases.$inferSelect;
export type KycDocument = typeof kycDocuments.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Activity = typeof activities.$inferSelect;
