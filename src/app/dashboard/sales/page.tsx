import { Board, type FieldConfig } from "@/components/board";
import { PageHeader, Stat } from "@/components/ui";
import { getDealsBoard, DEAL_COLUMNS } from "@/lib/queries";
import { compactCurrency, currency } from "@/lib/format";

export const dynamic = "force-dynamic";

const fields: FieldConfig[] = [
  { name: "title", label: "Deal title", type: "text", required: true, placeholder: "Enterprise License — Globex" },
  { name: "company", label: "Company", type: "text", required: true, placeholder: "Globex Corporation" },
  { name: "contact", label: "Primary contact", type: "text", placeholder: "David Chen" },
  { name: "value", label: "Deal value ($)", type: "number", placeholder: "120000" },
  { name: "probability", label: "Win probability (%)", type: "number", placeholder: "60" },
  { name: "closeDate", label: "Expected close", type: "date" },
  {
    name: "stage",
    label: "Stage",
    type: "select",
    options: ["discovery", "proposal", "negotiation", "contract"],
  },
];

export default async function SalesPage() {
  const items = await getDealsBoard();

  const open = items.filter((i) => !["won", "lost"].includes(i.stage));
  const won = items.filter((i) => i.stage === "won");
  const lost = items.filter((i) => i.stage === "lost");
  const pipeline = open.reduce((s, i) => s + (i.value ?? 0), 0);
  const forecast = open.reduce((s, i) => s + ((i.value ?? 0) * (i.progress ?? 0)) / 100, 0);
  const wonValue = won.reduce((s, i) => s + (i.value ?? 0), 0);
  const winRate = won.length + lost.length ? Math.round((won.length / (won.length + lost.length)) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Module 02 · Revenue"
        title="Sales Board"
        description="A live view of every opportunity, weighted forecast and close date. Sales managers can rebalance the pipeline in seconds."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Open pipeline" value={compactCurrency(pipeline)} delta={`${open.length} active deals`} icon="💰" tone="emerald" />
        <Stat label="Weighted forecast" value={compactCurrency(forecast)} delta="Probability adjusted" icon="📈" tone="indigo" />
        <Stat label="Closed won" value={currency(wonValue)} delta={`${won.length} deals booked`} icon="🏆" tone="sky" />
        <Stat label="Win rate" value={`${winRate}%`} delta="Won vs lost" icon="🎯" tone="amber" />
      </div>

      <Board
        resource="deals"
        label="Deals"
        columns={DEAL_COLUMNS}
        items={items}
        fields={fields}
        accent="#10b981"
        emptyHint="Opportunities created from won leads land in Discovery."
      />
    </div>
  );
}
