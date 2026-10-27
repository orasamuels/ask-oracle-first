import { describe, expect, it } from "vitest";
import { CATEGORIES, validateSetup } from "@/lib/test-setup";

describe("test setup rules", () => {
  it("has twelve categories", () => expect(CATEGORIES).toHaveLength(12));
  it("human vs AI needs category, difficulty and rounds", () => {
    expect(validateSetup({ mode: "human-vs-ai", category: "Physics", rounds: 2 })).toContain("Choose a difficulty.");
    expect(validateSetup({ mode: "human-vs-ai", category: "Physics", difficulty: "Hard", rounds: 2 })).toEqual([]);
  });
  it("human vs human needs category and rounds only", () => {
    expect(validateSetup({ mode: "human-vs-human", category: "History", rounds: 1 })).toEqual([]);
  });
  it("AI vs AI rejects the same model twice", () => {
    expect(validateSetup({ mode: "ai-vs-ai", modelA: "gpt-5", modelB: "gpt-5", rounds: 1 })).toContain("The two AI models must be different.");
    expect(validateSetup({ mode: "ai-vs-ai", modelA: "gpt-5", modelB: "gemini-2.5-pro", rounds: 1 })).toEqual([]);
  });
});
