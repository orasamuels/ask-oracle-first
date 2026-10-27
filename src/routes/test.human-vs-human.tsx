import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

const d = "Challenge another person to a timed knowledge and reasoning test. This test arrives in a later phase.";
export const Route = createFileRoute("/test/human-vs-human")({
  head: () => ({
    meta: [
      { title: "Human vs Human Test — AI POWERED TURING TEST" },
      { name: "description", content: d },
      { property: "og:title", content: "Human vs Human Test — AI POWERED TURING TEST" },
      { property: "og:description", content: d },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <ComingSoon title="Human vs Human Test" description={d} />,
});
