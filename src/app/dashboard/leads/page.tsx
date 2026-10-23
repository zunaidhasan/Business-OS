import { Board, type FieldConfig } from "@/components/board";
import { PageHeader, Stat } from "@/components/ui";
import { getLeadsBoard, LEAD_COLUMNS } from "@/lib/queries";
import { compactCurrency, currency } from "@/lib/format";

export const dynamic = "force-dynamic";

const fields: FieldConfig[] = [
  { name: "name", label: "Contact name", type: "text", required: true, placeholder: "Priya Nair" },
  { name: "company", label: "Company", type: "text", required: true, placeholder: "Globex Corporation" },
  { name: "email", label: "Email", type: "text", placeholder: "name@company.com" },
  { name: "phone", label: "Phone", type: "text", placeholder: "+1 (555) 000-0000" },
  {
    name: "source",
    label: "Source",
    type: "select",
    options: ["Website", "LinkedIn", "Referral", "Cold Call", "Trade Show", "Webinar", "Partner"],
  },
  { name: "value", label: "Estimated value ($)", type: "number", placeholder: "25000" },
];

export default async function LeadsPage() {
  const items = await getLeadsBoard();

  const open = items.filter((i) => !["won", "lost"].includes(i.stage));
  const won = items.filter((i) => i.stage === "won");
  const openValue = open.reduce((s, i) => s + (i.value ?? 0), 0);
  const wonValue = won.reduce((s, i) => s + (i.value ?? 0), 0);
  const conversion = items.length ? Math.round((won.length / items.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Module 01 · Acquisition"
        title="Lead Board"
        description="Capture every enquiry, score it, and move it through qualification. Drag a card to the next stage — everything saves instantly."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Leads in play" value={String(open.length)} delta={`${items.length} total captured`} icon="🎯" tone="sky" />
        <Stat label="Open pipeline" value={compactCurrency(openValue)} delta="Estimated value" icon="📥" tone="indigo" />
        <Stat label="Won this quarter" value={currency(wonValue)} delta={`${won.length} leads converted`} icon="🏆" tone="emerald" />
        <Stat label="Conversion rate" value={`${conversion}%`} delta="Lead → customer" icon="⚡" tone="amber" />
      </div>

      <Board
        resource="leads"
        label="Leads"
        columns={LEAD_COLUMNS}
        items={items}
        fields={fields}
        accent="#0ea5e9"
        emptyHint="New leads appear here the moment a form is submitted."
      />
    </div>
  );
}
