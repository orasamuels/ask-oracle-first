import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — AI POWERED TURING TEST" },
      { name: "description", content: "Your account and preferences will live here once sign-in is added." },
      { property: "og:title", content: "Profile — AI POWERED TURING TEST" },
      { property: "og:description", content: "Your account and preferences will live here once sign-in is added." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <ComingSoon title="Profile" description="Your account and preferences will live here once sign-in is added." />,
});
