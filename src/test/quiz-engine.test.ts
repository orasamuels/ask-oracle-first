import { describe, expect, it } from "vitest";
import { CATEGORIES } from "@/lib/test-setup";
import { QUESTIONS, questionsFor } from "@/lib/question-bank";
import { buildRounds, currentQuestion, quizReducer, scoreOf, startQuiz } from "@/lib/quiz-engine";

describe("question bank", () => {
  it("every category has at least 10 questions with a valid answer key", () => {
    for (const c of CATEGORIES) expect(questionsFor(c).length).toBeGreaterThanOrEqual(10);
    for (const q of QUESTIONS) {
      expect(q.options).toHaveLength(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(4);
    }
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
  });
});

describe("quiz engine", () => {
  it("each round has exactly 10 questions with no repeats inside a round", () => {
    const r = buildRounds("Physics", 3);
    expect(r).toHaveLength(3);
    for (const round of r) {
      expect(round).toHaveLength(10);
      expect(new Set(round.map((q) => q.id)).size).toBe(10);
    }
  });

  it("gives 15 seconds per question and timeout counts as unanswered", () => {
    let s = startQuiz("History", 1, 0);
    expect(s.deadline).toBe(15000);
    s = quizReducer(s, { type: "timeout", now: 14999 });
    expect(s.phase).toBe("question");
    s = quizReducer(s, { type: "timeout", now: 15000 });
    expect(s.answers[0]).toEqual([expect.objectContaining({ choice: null, correct: false })]);
  });

  it("an answer cannot be changed or scored twice", () => {
    let s = startQuiz("History", 1, 0);
    const q = currentQuestion(s);
    s = quizReducer(s, { type: "answer", choice: q.answer, now: 1000 });
    s = quizReducer(s, { type: "answer", choice: (q.answer + 1) % 4, now: 1100 });
    s = quizReducer(s, { type: "timeout", now: 20000 });
    expect(s.answers[0]).toHaveLength(1);
    expect(scoreOf(s.answers[0]!).correct).toBe(1);
  });

  it("resets the timer for each question and separates round scores", () => {
    let s = startQuiz("Biology", 2, 0);
    for (let i = 0; i < 10; i++) {
      s = quizReducer(s, { type: "answer", choice: currentQuestion(s).answer, now: s.deadline - 1 });
      s = quizReducer(s, { type: "next", now: 100000 * (i + 1) });
      if (i < 9) expect(s.deadline).toBe(100000 * (i + 1) + 15000);
    }
    expect(s.phase).toBe("round-end");
    s = quizReducer(s, { type: "next-round", now: 5 });
    expect(s.round).toBe(1);
    for (let i = 0; i < 10; i++) {
      s = quizReducer(s, { type: "timeout", now: s.deadline });
      s = quizReducer(s, { type: "next", now: s.deadline });
    }
    expect(s.phase).toBe("finished");
    expect(scoreOf(s.answers[0]!).correct).toBe(10);
    expect(scoreOf(s.answers[1]!).unanswered).toBe(10);
    expect(scoreOf(s.answers.flat())).toEqual({ correct: 10, incorrect: 0, unanswered: 10, total: 20 });
  });
});
