import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

const d = "Answer questions and compare your performance against an AI model. This test arrives in a later phase.";
export const Route = createFileRoute("/test/human-vs-ai")({
  head: () => ({
    meta: [
      { title: "Human vs AI Test — AI POWERED TURING TEST" },
      { name: "description", content: d },
      { property: "og:title", content: "Human vs AI Test — AI POWERED TURING TEST" },
      { property: "og:description", content: d },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <ComingSoon title="Human vs AI Test" description={d} />,
});
