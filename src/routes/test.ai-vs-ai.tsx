import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

const d = "Submit prompts to two AI models and judge which response is better. This test arrives in a later phase.";
export const Route = createFileRoute("/test/ai-vs-ai")({
  head: () => ({
    meta: [
      { title: "AI vs AI Test — AI POWERED TURING TEST" },
      { name: "description", content: d },
      { property: "og:title", content: "AI vs AI Test — AI POWERED TURING TEST" },
      { property: "og:description", content: d },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <ComingSoon title="AI vs AI Test" description={d} />,
});
