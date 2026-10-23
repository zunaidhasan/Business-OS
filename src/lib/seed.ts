import { db } from "@/db";
import { sql } from "drizzle-orm";
import {
  activities,
  deals,
  invoices,
  kycCases,
  kycDocuments,
  leads,
  organizations,
  tasks,
  users,
} from "@/db/schema";

/* ------------------------------------------------------------------ */
/*  Deterministic demo data generator for the Corevo mockup            */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260214);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

const COMPANIES = [
  "Northwind Industries", "Globex Corporation", "Initech", "Umbrella Technologies",
  "Soylent Corp", "Hooli", "Vandelay Industries", "Stark Industries",
  "Wayne Enterprises", "Acme Corp", "Cyberdyne Systems", "Tyrell Corp",
  "Wonka Industries", "Pied Piper", "Aviato", "Massive Dynamic",
  "Oceanic Airlines", "Duff Corporation", "Bluth Company", "Sterling Cooper",
  "Prestige Worldwide", "Gekko & Co", "Virtucon", "Wernham Hogg",
] as const;

const FIRST = [
  "Priya", "Rahul", "Sarah", "David", "Maria", "James", "Ananya", "Tom",
  "Elena", "Marcus", "Sofia", "Arjun", "Lisa", "Omar", "Nina", "Victor",
  "Chloe", "Kenji", "Fatima", "Lucas",
] as const;

const LAST = [
  "Nair", "Mehta", "Collins", "Chen", "Garcia", "Wilson", "Iyer", "Baker",
  "Rossi", "Brown", "Petrov", "Kumar", "Miller", "Hassan", "Schmidt", "Hughes",
  "Dubois", "Tanaka", "Ali", "Silva",
] as const;

const SOURCES = ["Website", "LinkedIn", "Referral", "Cold Call", "Trade Show", "Webinar", "Partner"] as const;

const TEAM = [
  { name: "Priya Nair", email: "priya@corevo.io", role: "VP Revenue", department: "Sales", color: "#6366f1", status: "active" },
  { name: "Rahul Mehta", email: "rahul@corevo.io", role: "Sales Manager", department: "Sales", color: "#0ea5e9", status: "active" },
  { name: "Sarah Collins", email: "sarah@corevo.io", role: "Account Executive", department: "Sales", color: "#10b981", status: "active" },
  { name: "David Chen", email: "david@corevo.io", role: "Sales Development Rep", department: "Sales", color: "#f59e0b", status: "active" },
  { name: "Ananya Iyer", email: "ananya@corevo.io", role: "Compliance Officer", department: "Risk", color: "#8b5cf6", status: "active" },
  { name: "Tom Baker", email: "tom@corevo.io", role: "Operations Lead", department: "Operations", color: "#ec4899", status: "active" },
  { name: "Maria Garcia", email: "maria@corevo.io", role: "Operations Analyst", department: "Operations", color: "#14b8a6", status: "away" },
  { name: "James Wilson", email: "james@corevo.io", role: "Finance Manager", department: "Finance", color: "#f43f5e", status: "active" },
] as const;

const LEAD_NOTES = [
  "Requested a demo of the operations module after the webinar.",
  "Comparing us with two competitors; budget approved for Q2.",
  "Referred by an existing customer — high intent.",
  "Asked about SSO and audit logs for their security team.",
  "Wants pricing for 40+ seats with annual billing.",
  "No response after two follow-ups; try again next week.",
  "Interested in the KYC automation workflow specifically.",
];

const DEAL_TITLES = [
  "Enterprise License", "Annual Retainer", "Platform Onboarding",
  "Support Upgrade", "Custom Integration", "Pilot Program", "Multi-year Contract",
];

const KYC_DOC_TYPES = [
  "Government ID", "Proof of Address", "Bank Statement",
  "Tax Registration", "Incorporation Certificate", "Directors List",
] as const;

const TASK_TITLES = [
  "Client onboarding checklist", "Quarterly compliance audit", "Vendor contract renewal",
  "Prepare board deck", "Payroll reconciliation", "Customer health review",
  "Security access review", "Update SOP documentation", "Invoice dispute follow-up",
  "Migrate CRM records", "Launch email campaign", "Warehouse stock audit",
  "Renew insurance policy", "Hiring pipeline review", "Facilities maintenance",
  "Integrate accounting export", "Data backup verification", "Training session",
] as const;

const TASK_TAGS = ["onboarding", "compliance", "finance", "support", "internal", "growth"] as const;

const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "Singapore", "India",
  "Australia", "Canada", "United Arab Emirates", "Netherlands", "Brazil",
] as const;

const INVOICE_CLIENTS = [
  "Globex Corporation", "Initech", "Hooli", "Vandelay Industries", "Stark Industries",
  "Wayne Enterprises", "Acme Corp", "Massive Dynamic", "Oceanic Airlines", "Prestige Worldwide",
  "Gekko & Co", "Virtucon", "Wernham Hogg", "Duff Corporation",
] as const;

const day = 86400000;
const now = Date.now();
const daysFromNow = (n: number) => new Date(now + n * day).toISOString();
const isoDate = (n: number) => daysFromNow(n).slice(0, 10);

/** Wipe and regenerate the full demo dataset. */
export async function resetDemoData() {
  await db.delete(activities);
  await db.delete(invoices);
  await db.delete(kycDocuments);
  await db.delete(kycCases);
  await db.delete(tasks);
  await db.delete(deals);
  await db.delete(leads);
  await db.delete(users);
  await db.delete(organizations);

  const [org] = await db
    .insert(organizations)
    .values({
      name: "Northwind Industries",
      plan: "Growth",
      industry: "Manufacturing & Distribution",
      currency: "$",
    })
    .returning({ id: organizations.id });

  const teamRows = TEAM.map((m) => ({ ...m, orgId: org.id }));
  const insertedUsers = await db.insert(users).values(teamRows).returning({ id: users.id });
  const userIds = insertedUsers.map((u) => u.id);
  const salesIds = userIds.slice(0, 4);
  const riskIds = [userIds[4]];
  const opsIds = userIds.slice(5, 7);
  const financeIds = [userIds[7]];

  /* ------------------------------ leads ------------------------------ */
  const stageWeights: Array<[string, number]> = [
    ["new", 10], ["contacted", 8], ["qualified", 7], ["proposal", 5],
    ["negotiation", 4], ["won", 5], ["lost", 3],
  ];
  const weighted = stageWeights.flatMap(([s, w]) => Array<string>(w).fill(s));
  const leadRows = Array.from({ length: 44 }).map(() => {
    const first = pick(FIRST);
    const last = pick(LAST);
    const company = pick(COMPANIES);
    const slug = company.toLowerCase().replace(/[^a-z]+/g, "").slice(0, 12);
    return {
      orgId: org.id,
      name: `${first} ${last}`,
      company,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${slug}.com`,
      phone: `+1 (${int(200, 989)}) ${int(200, 989)}-${int(1000, 9999)}`,
      source: pick(SOURCES),
      stage: pick(weighted),
      value: int(3, 120) * 1000,
      score: int(15, 98),
      ownerId: pick(salesIds),
      notes: pick(LEAD_NOTES),
      createdAt: new Date(now - int(0, 60) * day),
      updatedAt: new Date(now - int(0, 12) * day),
    };
  });
  const insertedLeads = await db.insert(leads).values(leadRows).returning({ id: leads.id });

  /* ------------------------------ deals ------------------------------ */
  const dealWeights: Array<[string, number]> = [
    ["discovery", 6], ["proposal", 6], ["negotiation", 5],
    ["contract", 3], ["won", 4], ["lost", 2],
  ];
  const dealWeighted = dealWeights.flatMap(([s, w]) => Array<string>(w).fill(s));
  const dealRows = Array.from({ length: 26 }).map((_, i) => {
    const stage = pick(dealWeighted);
    const company = pick(COMPANIES);
    const contact = `${pick(FIRST)} ${pick(LAST)}`;
    return {
      orgId: org.id,
      title: `${pick(DEAL_TITLES)} — ${company}`,
      company,
      contact,
      stage,
      value: int(18, 480) * 1000,
      probability: stage === "won" ? 100 : stage === "lost" ? 0 : int(20, 85),
      ownerId: pick(salesIds),
      closeDate: isoDate(int(-20, 70)),
      createdAt: new Date(now - int(5, 120) * day),
    };
  });
  const insertedDeals = await db.insert(deals).values(dealRows).returning({ id: deals.id });

  /* ------------------------------- kyc ------------------------------- */
  const kycWeights: Array<[string, number]> = [
    ["submitted", 6], ["review", 5], ["info", 3], ["verified", 3], ["rejected", 1],
  ];
  const kycWeighted = kycWeights.flatMap(([s, w]) => Array<string>(w).fill(s));
  const kycRows = Array.from({ length: 18 }).map(() => {
    const first = pick(FIRST);
    const last = pick(LAST);
    const company = pick(COMPANIES);
    return {
      orgId: org.id,
      applicant: `${first} ${last}`,
      company,
      entityType: pick(["Individual", "Business", "Partnership"] as const),
      status: pick(kycWeighted),
      risk: pick(["low", "low", "medium", "high"] as const),
      country: pick(COUNTRIES),
      reviewerId: pick(riskIds),
      notes: pick([
        "All documents legible; address matches records.",
        "Awaiting notarised bank statement from applicant.",
        "Sanctions screening returned a possible match — escalated.",
        "Tax ID verified against government registry.",
        "Duplicate submission detected; merged with existing profile.",
      ]),
      submittedAt: new Date(now - int(0, 30) * day),
    };
  });
  const insertedKyc = await db.insert(kycCases).values(kycRows).returning({ id: kycCases.id });

  const docRows = insertedKyc.flatMap((c) =>
    Array.from({ length: int(2, 4) }).map(() => ({
      caseId: c.id,
      docType: pick(KYC_DOC_TYPES),
      fileName: `${pick(KYC_DOC_TYPES).toLowerCase().replace(/ /g, "-")}-${int(1000, 9999)}.pdf`,
      status: pick(["verified", "verified", "pending", "rejected"] as const),
    })),
  );
  await db.insert(kycDocuments).values(docRows);

  /* ----------------------------- operations -------------------------- */
  const taskWeights: Array<[string, number]> = [
    ["backlog", 7], ["todo", 7], ["progress", 6], ["review", 4], ["done", 10],
  ];
  const taskWeighted = taskWeights.flatMap(([s, w]) => Array<string>(w).fill(s));
  const taskRows = Array.from({ length: 34 }).map((_, i) => {
    const status = pick(taskWeighted);
    const company = pick(COMPANIES);
    return {
      orgId: org.id,
      title: i % 3 === 0 ? `${pick(TASK_TITLES)} — ${company}` : pick(TASK_TITLES),
      description: pick([
        "Follow the standard operating procedure and log the outcome in the audit trail.",
        "Coordinate with the account owner before making any external commitment.",
        "Blocked on vendor response — escalate if not resolved in 48 hours.",
        "Recurring task; last cycle completed without exceptions.",
        "Requires sign-off from the compliance officer before closing.",
      ]),
      status,
      priority: pick(["low", "medium", "medium", "high", "urgent"] as const),
      assigneeId: pick(opsIds),
      dueDate: isoDate(int(-10, 45)),
      tags: [pick(TASK_TAGS), pick(TASK_TAGS)].filter((v, idx, a) => a.indexOf(v) === idx),
      progress: status === "done" ? 100 : status === "review" ? int(70, 95) : status === "progress" ? int(30, 80) : int(0, 25),
      createdAt: new Date(now - int(1, 60) * day),
    };
  });
  await db.insert(tasks).values(taskRows);

  /* ------------------------------ finance ---------------------------- */
  const invoiceRows = INVOICE_CLIENTS.map((client, i) => {
    const status = pick(["paid", "paid", "paid", "sent", "overdue", "draft"] as const);
    return {
      orgId: org.id,
      number: `INV-2026-${String(i + 1).padStart(3, "0")}`,
      client,
      amount: int(4, 95) * 1000,
      status,
      issuedAt: isoDate(-int(5, 80)),
      dueAt: isoDate(int(-25, 40)),
    };
  });
  await db.insert(invoices).values(invoiceRows);

  /* ----------------------------- activity ---------------------------- */
  const activityTemplates: Array<{ kind: string; action: (t: string) => string }> = [
    { kind: "lead", action: (t) => `moved lead “${t}” to Qualified` },
    { kind: "lead", action: (t) => `added a new lead from ${t}` },
    { kind: "deal", action: (t) => `updated deal value on “${t}”` },
    { kind: "deal", action: (t) => `marked “${t}” as Closed Won` },
    { kind: "kyc", action: (t) => `approved KYC verification for ${t}` },
    { kind: "kyc", action: (t) => `requested additional documents from ${t}` },
    { kind: "task", action: (t) => `completed task “${t}”` },
    { kind: "task", action: (t) => `reassigned “${t}” to Operations` },
    { kind: "invoice", action: (t) => `sent invoice ${t} to the client` },
    { kind: "invoice", action: (t) => `recorded payment for ${t}` },
  ];
  const activityRows = Array.from({ length: 30 }).map(() => {
    const tpl = pick(activityTemplates);
    const target = tpl.kind === "lead" ? pick(COMPANIES)
      : tpl.kind === "deal" ? pick(DEAL_TITLES)
      : tpl.kind === "kyc" ? pick(COMPANIES)
      : tpl.kind === "task" ? pick(TASK_TITLES)
      : `INV-2026-${String(int(1, 14)).padStart(3, "0")}`;
    return {
      orgId: org.id,
      actorId: pick(userIds),
      action: tpl.action(target),
      target,
      kind: tpl.kind,
      createdAt: new Date(now - int(0, 72) * 3600 * 1000),
    };
  });
  await db.insert(activities).values(activityRows);

  return {
    leads: insertedLeads.length,
    deals: insertedDeals.length,
    kyc: insertedKyc.length,
    users: insertedUsers.length,
  };
}

/** Seed the database on first run so the demo always has data. */
export async function ensureSeeded() {
  try {
    const rows = await db.select({ n: sql<number>`count(*)::int` }).from(organizations);
    if (!rows[0] || rows[0].n === 0) {
      await resetDemoData();
    }
  } catch {
    /* database not ready yet — ignore, pages render empty states */
  }
}
