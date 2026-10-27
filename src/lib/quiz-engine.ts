import { questionsFor, type Question } from "./question-bank";

export const QUESTIONS_PER_ROUND = 10;
export const SECONDS_PER_QUESTION = 15;

export interface AnswerRecord {
  questionId: string;
  /** Chosen option index, or null when time ran out. */
  choice: number | null;
  correct: boolean;
}

export interface QuizState {
  category: Question["category"];
  rounds: Question[][];
  answers: AnswerRecord[][];
  round: number;
  index: number;
  /** "question": answering; "locked": answer shown; "round-end": round review; "finished": final results. */
  phase: "question" | "locked" | "round-end" | "finished";
  /** Epoch ms when the current question's time runs out. */
  deadline: number;
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Builds rounds of exactly 10 questions; questions only repeat once the category's pool is used up. */
export function buildRounds(category: Question["category"], roundCount: number, rand: () => number = Math.random): Question[][] {
  const pool = questionsFor(category);
  if (pool.length === 0) throw new Error(`No questions for ${category}`);
  const needed = roundCount * QUESTIONS_PER_ROUND;
  const ordered: Question[] = [];
  while (ordered.length < needed) ordered.push(...shuffle(pool, rand));
  return Array.from({ length: roundCount }, (_, r) => ordered.slice(r * QUESTIONS_PER_ROUND, (r + 1) * QUESTIONS_PER_ROUND));
}

export function startQuiz(category: Question["category"], roundCount: number, now: number, rand?: () => number): QuizState {
  const rounds = buildRounds(category, roundCount, rand);
  return { category, rounds, answers: rounds.map(() => []), round: 0, index: 0, phase: "question", deadline: now + SECONDS_PER_QUESTION * 1000 };
}

export const currentQuestion = (s: QuizState) => s.rounds[s.round]![s.index]!;

export type QuizAction =
  | { type: "answer"; choice: number; now: number }
  | { type: "timeout"; now: number }
  | { type: "next"; now: number }
  | { type: "next-round"; now: number };

function lock(s: QuizState, choice: number | null): QuizState {
  // Only one answer per question can ever be recorded.
  if (s.phase !== "question" || s.answers[s.round]!.length !== s.index) return s;
  const q = currentQuestion(s);
  const rec: AnswerRecord = { questionId: q.id, choice, correct: choice === q.answer };
  const answers = s.answers.map((a, i) => (i === s.round ? [...a, rec] : a));
  return { ...s, answers, phase: "locked" };
}

export function quizReducer(s: QuizState, a: QuizAction): QuizState {
  switch (a.type) {
    case "answer":
      // Answers arriving after the deadline count as unanswered.
      return lock(s, a.now <= s.deadline ? a.choice : null);
    case "timeout":
      return a.now >= s.deadline ? lock(s, null) : s;
    case "next": {
      if (s.phase !== "locked") return s;
      if (s.index + 1 < s.rounds[s.round]!.length)
        return { ...s, index: s.index + 1, phase: "question", deadline: a.now + SECONDS_PER_QUESTION * 1000 };
      return { ...s, phase: s.round + 1 < s.rounds.length ? "round-end" : "finished" };
    }
    case "next-round":
      if (s.phase !== "round-end") return s;
      return { ...s, round: s.round + 1, index: 0, phase: "question", deadline: a.now + SECONDS_PER_QUESTION * 1000 };
  }
}

export function scoreOf(records: AnswerRecord[]) {
  const correct = records.filter((r) => r.correct).length;
  const unanswered = records.filter((r) => r.choice === null).length;
  return { correct, unanswered, incorrect: records.length - correct - unanswered, total: records.length };
}

export const percent = (correct: number, total: number) => (total === 0 ? 0 : Math.round((correct / total) * 100));
