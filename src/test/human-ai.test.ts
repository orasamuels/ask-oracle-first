import { describe, it, expect, vi } from 'vitest';
import { createStoredQuiz, publicQuiz, transition, getGeminiAnswer } from '@/lib/human-ai.server';
import { currentQuestion } from '@/lib/quiz-engine';
import { participantScore, roundWinner } from '@/lib/human-ai-view';

describe('private Human vs AI rules', () => {
  it('allows exactly 1, 2 or 3 ten-question rounds with a 15-second deadline', () => {
    for (const n of [1, 2, 3]) {
      const s = createStoredQuiz('Physics', n, 1000);
      expect(s.quiz.rounds).toHaveLength(n);
      s.quiz.rounds.forEach(r => expect(r).toHaveLength(10));
      expect(s.quiz.deadline).toBe(16000);
    }
  });
  it('never returns answer keys, correctness or review while a round is active', () => {
    let s = createStoredQuiz('Physics', 1, 0);
    s = transition(s, 'answer', currentQuestion(s.quiz).answer, 100);
    const view = publicQuiz('id', 1, s);
    expect(view.question).not.toHaveProperty('answer');
    expect(view.question).not.toHaveProperty('explanation');
    expect(view).not.toHaveProperty('correct');
    expect(view.results).toEqual([]);
    expect(view.overall).toBeNull();
  });
  it('locks one answer and treats submissions after 15 seconds as unanswered', () => {
    let s = createStoredQuiz('Physics', 1, 0);
    s = transition(s, 'answer', 0, 15001);
    s = transition(s, 'answer', 1, 15002);
    expect(s.quiz.answers[0]).toHaveLength(1);
    expect(s.quiz.answers[0]?.[0]?.choice).toBeNull();
  });
  it('uses the same answer key for both participants and reveals completed rounds only', () => {
    let s = createStoredQuiz('Physics', 2, 0);
    for (let i = 0; i < 10; i++) {
      const q = currentQuestion(s.quiz);
      s = transition(s, 'answer', q.answer, s.quiz.deadline - 1);
      s.ai[`0:${i}`] = { status: 'success', choice: q.answer, error: null };
      s = transition(s, 'next', undefined, 20000 * (i + 1));
    }
    const v = publicQuiz('id', 1, s);
    expect(v.results).toHaveLength(1);
    expect(v.results[0]?.human.correct).toBe(10);
    expect(v.results[0]?.ai.correct).toBe(10);
    expect(v.results[0]?.winner).toBe('Tie');
    expect(v.results[0]?.review).toHaveLength(10);
    s = transition(s, 'next-round', undefined, 300000);
    expect(s.quiz.deadline).toBe(315000);
    expect(publicQuiz('id', 2, s).results).toHaveLength(1);
  });
  it('does not invent winners or count failed AI calls as genuine answers', () => {
    const human = participantScore([{ choice: 0, answer: 0 }]);
    const ai = participantScore([{ choice: null, answer: 0, error: 'Rate limited' }]);
    expect(ai).toMatchObject({ correct: 0, incorrect: 0, unanswered: 0, failed: 1 });
    expect(roundWinner(human, ai)).toBe('Comparison unavailable — AI requests failed');
  });
  it('missing credentials produce a failed result, not a fake answer', async () => {
    const spy = vi.spyOn(globalThis, 'fetch');
    const answer = await getGeminiAnswer({ prompt: 'Q', options: ['a', 'b', 'c', 'd'] }, 'model', undefined);
    expect(answer.status).toBe('failed'); expect(answer.choice).toBeNull(); expect(spy).not.toHaveBeenCalled(); spy.mockRestore();
  });
});