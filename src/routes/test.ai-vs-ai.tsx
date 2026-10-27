import { createFileRoute, redirect } from "@tanstack/react-router";

// Old link target: forwards to the shared setup screen with this mode chosen.
export const Route = createFileRoute("/test/ai-vs-ai")({
  beforeLoad: () => {
    throw redirect({ to: "/take-a-test", search: { mode: "ai-vs-ai" } });
  },
});
