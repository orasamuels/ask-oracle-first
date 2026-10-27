import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/take-a-test")({
  head: () => ({
    meta: [
      { title: "Take a Test — AI POWERED TURING TEST" },
      { name: "description", content: "Choose a mode and start a test. Testing will be available in the next phase." },
      { property: "og:title", content: "Take a Test — AI POWERED TURING TEST" },
      { property: "og:description", content: "Choose a mode and start a test. Testing will be available in the next phase." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <ComingSoon title="Take a Test" description="Choose a mode and start a test. Testing will be available in the next phase." />,
});
