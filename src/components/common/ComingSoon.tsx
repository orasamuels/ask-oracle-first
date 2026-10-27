import { Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/SiteLayout";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card/60 p-10 text-center backdrop-blur">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-secondary text-accent">
          <Construction className="h-6 w-6" />
        </span>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Coming in a later phase
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <Button asChild variant="outline" className="mt-8">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </Container>
  );
}
