import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Cpu, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/SiteLayout";
import { FeatureCard } from "@/components/common/FeatureCard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI POWERED TURING TEST" },
      { name: "description", content: "Choose a testing mode to evaluate and compare human and AI performance." },
      { property: "og:title", content: "Dashboard — AI POWERED TURING TEST" },
      { property: "og:description", content: "Choose a testing mode to evaluate and compare human and AI performance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

const MODES = [
  {
    icon: Brain,
    title: "Human vs AI Test",
    description: "Answer questions and compare your performance against an AI model.",
    to: "/test/human-vs-ai",
    mode: "human-vs-ai",
    cta: "Start Human vs AI",
  },
  {
    icon: Cpu,
    title: "AI vs AI Test",
    description: "Submit prompts to two AI models, compare their responses, and evaluate which response is better.",
    to: "/test/ai-vs-ai",
    mode: "ai-vs-ai",
    cta: "Start AI vs AI",
  },
  {
    icon: Users,
    title: "Human vs Human Test",
    description: "Challenge another person to a timed knowledge and reasoning test.",
    to: "/test/human-vs-human",
    mode: "human-vs-human",
    cta: "Start Human vs Human",
  },
] as const;

function DashboardPage() {
  return (
    <Container className="py-14 sm:py-20">
      <section className="rounded-2xl border border-border bg-card/60 p-8 backdrop-blur sm:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Dashboard</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
          Welcome to the <span className="text-gradient-brand">Turing Test</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground sm:text-lg">
          Evaluate and compare human and AI performance across knowledge, reasoning, language and
          problem-solving. Pick a mode below to begin.
        </p>
        <Button asChild variant="brand" size="lg" className="mt-8">
          <Link to="/take-a-test">
            Take a Test <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </section>

      <section className="mt-14">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Testing modes</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Choose how to compete</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {MODES.map((m) => (
            <FeatureCard
              key={m.to}
              icon={m.icon}
              title={m.title}
              description={m.description}
              footer={
                <Button asChild variant="outline" className="w-full">
                  <Link to="/take-a-test" search={{ mode: m.mode }}>
                    {m.cta} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              }
            />
          ))}
        </div>
      </section>
    </Container>
  );
}
