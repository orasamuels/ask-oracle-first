import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/SiteLayout";
import { SetupSummary } from "@/components/test-setup/SetupSummary";
import { setupSearchSchema, validateSetup } from "@/lib/test-setup";

export const Route = createFileRoute("/setup-summary")({
  validateSearch: setupSearchSchema,
  beforeLoad: ({ search }) => {
    if (validateSetup(search).length > 0) throw redirect({ to: "/take-a-test", search });
  },
  head: () => ({
    meta: [
      { title: "Test Setup Summary — AI POWERED TURING TEST" },
      { name: "description", content: "Review your chosen test configuration before the test begins." },
      { property: "og:title", content: "Test Setup Summary — AI POWERED TURING TEST" },
      { property: "og:description", content: "Review your chosen test configuration before the test begins." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SummaryPage,
});

function SummaryPage() {
  const s = Route.useSearch();
  return (
    <Container className="py-14 sm:py-20">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card/60 p-8 backdrop-blur">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary"><CheckCircle2 className="h-6 w-6" /></span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">Your test is set up</h1>
        <p className="mt-2 text-muted-foreground">The test itself will be available in a later phase. Here's what you chose:</p>
        <div className="mt-6"><SetupSummary s={s} /></div>
        <Button asChild variant="outline" className="mt-8">
          <Link to="/take-a-test" search={s}><ArrowLeft className="mr-1 h-4 w-4" /> Back to setup</Link>
        </Button>
      </div>
    </Container>
  );
}
