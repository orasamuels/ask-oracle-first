import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Brain, Cpu, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/SiteLayout";
import { FeatureCard } from "@/components/common/FeatureCard";
import { OptionGroup } from "@/components/test-setup/OptionGroup";
import { CategorySelector } from "@/components/test-setup/CategorySelector";
import { SetupSummary } from "@/components/test-setup/SetupSummary";
import {
  AI_MODELS,
  AI_MODELS_CONNECTED,
  DIFFICULTIES,
  MODES,
  ROUND_OPTIONS,
  modeTitle,
  setupSearchSchema,
  validateSetup,
  type SetupSearch,
} from "@/lib/test-setup";

export const Route = createFileRoute("/take-a-test")({
  validateSearch: setupSearchSchema,
  head: () => ({
    meta: [
      { title: "Take a Test — AI POWERED TURING TEST" },
      { name: "description", content: "Choose a testing mode, pick a category and rounds, and set up your Turing test." },
      { property: "og:title", content: "Take a Test — AI POWERED TURING TEST" },
      { property: "og:description", content: "Choose a testing mode, pick a category and rounds, and set up your Turing test." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TakeATestPage,
});

const ICONS = { "human-vs-ai": Brain, "ai-vs-ai": Cpu, "human-vs-human": Users } as const;

function TakeATestPage() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/take-a-test" });
  const [errors, setErrors] = useState<string[]>([]);
  const update = (patch: Partial<SetupSearch>) => {
    setErrors([]);
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
  };

  if (!s.mode) {
    return (
      <Container className="py-14 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Step 1 of 2</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Choose a testing mode</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {MODES.map((m) => (
            <FeatureCard
              key={m.id}
              icon={ICONS[m.id]}
              title={m.title}
              description={m.description}
              footer={
                <Button variant="outline" className="w-full" onClick={() => navigate({ search: (prev) => ({ ...prev, mode: m.id }) })}>
                  Select <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              }
            />
          ))}
        </div>
      </Container>
    );
  }

  const onContinue = () => {
    const errs = validateSetup(s);
    setErrors(errs);
    if (errs.length === 0) navigate({ to: "/setup-summary", search: s });
  };

  const usedOtherModel = (other?: string) =>
    AI_MODELS.map((m) => ({ value: m.id as string, label: m.label, disabled: m.id === other, hint: AI_MODELS_CONNECTED ? undefined : "Not connected yet" }));

  return (
    <Container className="py-14 sm:py-20">
      <Button variant="ghost" size="sm" onClick={() => navigate({ search: (prev) => ({ ...prev, mode: undefined }) })}>
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to modes
      </Button>
      <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-primary">Step 2 of 2</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{modeTitle(s.mode)} setup</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {s.mode === "human-vs-ai" && "Each round will contain ten questions."}
        {s.mode === "human-vs-human" &&
          "Each round will contain ten questions. The finished mode will let you challenge other users online — that part isn't built yet."}
        {s.mode === "ai-vs-ai" && "Each round is one prompt you write, answered by both models."}
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur sm:p-8">
          {s.mode === "ai-vs-ai" ? (
            <>
              {!AI_MODELS_CONNECTED && (
                <p className="rounded-lg border border-accent/40 bg-accent/10 p-3 text-sm text-accent">
                  No AI models are connected yet. You can choose models now, but no answers will be generated until they are.
                </p>
              )}
              <OptionGroup label="First AI model" columns="grid-cols-1 sm:grid-cols-2" options={usedOtherModel(s.modelB)} value={s.modelA} onChange={(v) => update({ modelA: v })} />
              <OptionGroup label="Second AI model" columns="grid-cols-1 sm:grid-cols-2" options={usedOtherModel(s.modelA)} value={s.modelB} onChange={(v) => update({ modelB: v })} />
            </>
          ) : (
            <CategorySelector value={s.category} onChange={(c) => update({ category: c })} />
          )}
          {s.mode === "human-vs-ai" && (
            <OptionGroup label="Difficulty" options={DIFFICULTIES.map((d) => ({ value: d, label: d }))} value={s.difficulty} onChange={(d) => update({ difficulty: d })} />
          )}
          <OptionGroup
            label="Rounds"
            options={ROUND_OPTIONS.map((r) => ({ value: r, label: `${r} round${r > 1 ? "s" : ""}` }))}
            value={s.rounds}
            onChange={(r) => update({ rounds: Number(r) })}
          />
        </div>

        <aside className="space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Summary</h2>
          <SetupSummary s={s} />
          {errors.length > 0 && (
            <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {errors.map((e) => (
                <p key={e} className="flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" /> {e}</p>
              ))}
            </div>
          )}
          <Button variant="brand" size="lg" className="w-full" onClick={onContinue}>
            Continue <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button asChild variant="ghost" className="w-full"><Link to="/dashboard">Back to Dashboard</Link></Button>
        </aside>
      </div>
    </Container>
  );
}
