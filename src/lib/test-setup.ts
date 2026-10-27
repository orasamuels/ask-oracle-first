import { z } from "zod";

export const CATEGORIES = [
  "English",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "Geography",
  "Economics",
  "Current Affairs and Verified Historical Knowledge",
  "Logical Reasoning",
  "General Knowledge",
] as const;

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const ROUND_OPTIONS = [1, 2, 3] as const;

export type TestMode = "human-vs-ai" | "ai-vs-ai" | "human-vs-human";

export const MODES: { id: TestMode; title: string; description: string }[] = [
  { id: "human-vs-ai", title: "Human vs AI Test", description: "Answer questions and compare your performance against an AI model." },
  { id: "ai-vs-ai", title: "AI vs AI Test", description: "Submit prompts to two AI models, compare their responses, and judge which is better." },
  { id: "human-vs-human", title: "Human vs Human Test", description: "Challenge another person to a timed knowledge and reasoning test." },
];

/** Placeholder model slots. None are connected yet — labelled as such in the UI. */
export const AI_MODELS = [
  { id: "gemini-2.5-pro", label: "Google Gemini 2.5 Pro" },
  { id: "gemini-2.5-flash", label: "Google Gemini 2.5 Flash" },
  { id: "gpt-5", label: "OpenAI GPT-5" },
  { id: "gpt-5-mini", label: "OpenAI GPT-5 Mini" },
] as const;
export const AI_MODELS_CONNECTED = false;

export const setupSearchSchema = z.object({
  mode: z.enum(["human-vs-ai", "ai-vs-ai", "human-vs-human"]).optional().catch(undefined),
  category: z.enum(CATEGORIES).optional().catch(undefined),
  difficulty: z.enum(DIFFICULTIES).optional().catch(undefined),
  rounds: z.coerce.number().int().min(1).max(3).optional().catch(undefined),
  modelA: z.string().optional().catch(undefined),
  modelB: z.string().optional().catch(undefined),
});
export type SetupSearch = z.infer<typeof setupSearchSchema>;

const modelIds: string[] = AI_MODELS.map((m) => m.id);

/** Returns a list of validation messages; empty means the setup is complete. */
export function validateSetup(s: SetupSearch): string[] {
  const errors: string[] = [];
  if (!s.mode) return ["Choose a testing mode."];
  if (s.mode !== "ai-vs-ai" && !s.category) errors.push("Choose a category.");
  if (s.mode === "human-vs-ai" && !s.difficulty) errors.push("Choose a difficulty.");
  if (s.mode === "ai-vs-ai") {
    if (!s.modelA || !modelIds.includes(s.modelA)) errors.push("Choose the first AI model.");
    if (!s.modelB || !modelIds.includes(s.modelB)) errors.push("Choose the second AI model.");
    if (s.modelA && s.modelA === s.modelB) errors.push("The two AI models must be different.");
  }
  if (!s.rounds) errors.push("Choose the number of rounds.");
  return errors;
}

export const modelLabel = (id?: string) => AI_MODELS.find((m) => m.id === id)?.label ?? "—";
export const modeTitle = (id?: TestMode) => MODES.find((m) => m.id === id)?.title ?? "—";
