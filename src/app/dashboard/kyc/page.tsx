import { Board, type FieldConfig } from "@/components/board";
import { PageHeader, Stat } from "@/components/ui";
import { getKycBoard, KYC_COLUMNS } from "@/lib/queries";

export const dynamic = "force-dynamic";

const fields: FieldConfig[] = [
  { name: "applicant", label: "Applicant name", type: "text", required: true, placeholder: "Maria Garcia" },
  { name: "company", label: "Entity name", type: "text", required: true, placeholder: "Globex Corporation" },
  {
    name: "entityType",
    label: "Entity type",
    type: "select",
    options: ["Individual", "Business", "Partnership"],
  },
  { name: "country", label: "Country", type: "text", placeholder: "United States" },
  {
    name: "risk",
    label: "Risk rating",
    type: "select",
    options: ["low", "medium", "high"],
  },
];

export default async function KycPage() {
  const items = await getKycBoard();

  const pending = items.filter((i) => ["submitted", "review", "info"].includes(i.stage));
  const verified = items.filter((i) => i.stage === "verified");
  const rejected = items.filter((i) => i.stage === "rejected");
  const highRisk = items.filter((i) => i.badge?.label.includes("high"));
  const approvalRate = verified.length + rejected.length
    ? Math.round((verified.length / (verified.length + rejected.length)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Module 03 · Compliance"
        title="KYC Board"
        description="Onboard customers with confidence. Every application, document and risk rating lives in one auditable queue."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Awaiting review" value={String(pending.length)} delta={`${items.length} total cases`} icon="🛡️" tone="amber" />
        <Stat label="Verified" value={String(verified.length)} delta="Cleared to transact" icon="✅" tone="emerald" />
        <Stat label="High risk" value={String(highRisk.length)} delta="Manual escalation" icon="⚠️" tone="rose" />
        <Stat label="Approval rate" value={`${approvalRate}%`} delta="Verified vs rejected" icon="📊" tone="indigo" />
      </div>

      <Board
        resource="kyc"
        label="KYC cases"
        columns={KYC_COLUMNS}
        items={items}
        fields={fields}
        accent="#f59e0b"
        emptyHint="New onboarding applications queue up here automatically."
      />
    </div>
  );
}
