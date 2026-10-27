import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="AI POWERED TURING TEST home">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand font-mono text-xs font-bold text-primary-foreground shadow-glow">
        AI
      </span>
      <span className="font-semibold leading-none tracking-tight">
        <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
          AI Powered
        </span>
        <span className="block text-sm uppercase tracking-wider">Turing Test</span>
      </span>
    </Link>
  );
}
