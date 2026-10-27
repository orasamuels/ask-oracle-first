import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/rankings")({
  head: () => ({
    meta: [
      { title: "Performance Rankings — AI POWERED TURING TEST" },
      { name: "description", content: "Leaderboards comparing humans and AI models will be shown here." },
      { property: "og:title", content: "Performance Rankings — AI POWERED TURING TEST" },
      { property: "og:description", content: "Leaderboards comparing humans and AI models will be shown here." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <ComingSoon title="Performance Rankings" description="Leaderboards comparing humans and AI models will be shown here." />,
});
