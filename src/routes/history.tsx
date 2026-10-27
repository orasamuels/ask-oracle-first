import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Test History — AI POWERED TURING TEST" },
      { name: "description", content: "A record of every test you've completed will be listed here." },
      { property: "og:title", content: "Test History — AI POWERED TURING TEST" },
      { property: "og:description", content: "A record of every test you've completed will be listed here." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <ComingSoon title="Test History" description="A record of every test you've completed will be listed here." />,
});
