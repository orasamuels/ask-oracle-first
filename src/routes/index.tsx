import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Brain, Cpu, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/SiteLayout";
import { FeatureCard } from "@/components/common/FeatureCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI POWERED TURING TEST — Human vs Machine Evaluation" },
      {
        name: "description",
        content: "A platform that evaluates and compares human and AI performance across knowledge, reasoning, language and problem-solving.",
      },
      { property: "og:title", content: "AI POWERED TURING TEST" },
      {
        property: "og:description",
        content: "Evaluate and compare human and AI performance across reasoning, language and problem-solving.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const MODES = [
  {
    icon: Brain,
    title: "Human vs AI",
    description: "Go head-to-head with an AI model on the same set of challenges and see who scores higher.",
  },
  {
    icon: Cpu,
    title: "AI vs AI",
    description: "Pit different AI models against each other to compare accuracy, reasoning and speed.",
  },
  {
    icon: Users,
    title: "Human vs Human",
    description: "Challenge another person under identical conditions and compare results fairly.",
  },
];

const DOMAINS = ["Knowledge", "Reasoning", "Language", "Problem-solving"];

function HomePage() {
  return (
    <>
      <section>
        <Container className="pt-20 pb-16 text-center sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur">
            <Bot className="h-3.5 w-3.5 text-primary" /> Human & machine intelligence evaluation
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Can you tell who's thinking — <span className="text-gradient-brand">human or machine?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            AI POWERED TURING TEST evaluates and compares human and AI performance on structured
            tests, so you can measure exactly where people and models excel.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg">
              <Link to="/dashboard">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/rankings">View Rankings</Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {DOMAINS.map((d) => (
              <span key={d} className="rounded-md border border-border bg-secondary/50 px-3 py-1 font-mono text-xs text-muted-foreground">
                {d}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="pb-24">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Testing modes</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Three ways to compete</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {MODES.map((m) => (
              <FeatureCard key={m.title} {...m} badge="Preview" />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
