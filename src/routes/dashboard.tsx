import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI POWERED TURING TEST" },
      { name: "description", content: "Your overview of tests, scores and progress will appear here." },
      { property: "og:title", content: "Dashboard — AI POWERED TURING TEST" },
      { property: "og:description", content: "Your overview of tests, scores and progress will appear here." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <ComingSoon title="Dashboard" description="Your overview of tests, scores and progress will appear here." />,
});
