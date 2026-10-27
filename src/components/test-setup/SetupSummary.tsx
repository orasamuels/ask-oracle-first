import { modeTitle, modelLabel, type SetupSearch } from "@/lib/test-setup";

export function SetupSummary({ s }: { s: SetupSearch }) {
  const rows: [string, string][] = [["Mode", modeTitle(s.mode)]];
  if (s.mode === "ai-vs-ai") {
    rows.push(["First AI model", modelLabel(s.modelA)], ["Second AI model", modelLabel(s.modelB)]);
    rows.push(["Rounds", s.rounds ? `${s.rounds} (${s.rounds} prompt${s.rounds > 1 ? "s" : ""})` : "—"]);
  } else {
    rows.push(["Category", s.category ?? "—"]);
    rows.push(["Rounds", s.rounds ? `${s.rounds} (${s.rounds * 10} questions)` : "—"]);
  }
  return (
    <dl className="divide-y divide-border rounded-xl border border-border bg-secondary/30">
      {rows.map(([k, v]) => (
        <div key={k} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:justify-between">
          <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
          <dd className="text-sm font-medium sm:text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
