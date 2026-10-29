import { currentQuestion, quizReducer, startQuiz, type QuizState } from './quiz-engine';
import { participantScore, roundWinner, type HumanAiView, type RoundResult, type ReviewItem } from './human-ai-view';
export interface AiAnswer { choice: number | null; status: 'pending' | 'success' | 'failed'; error: string | null }
export interface StoredQuiz { quiz: QuizState; ai: Record<string, AiAnswer>; model: string }
export const questionKey = (q: QuizState) => `${q.round}:${q.index}`;
export function createStoredQuiz(category: QuizState['category'], rounds: number, now: number): StoredQuiz {
  return { quiz: startQuiz(category, rounds, now), ai: {}, model: 'gemini-3.8-flash' };
}
export function publicQuiz(id: string, version: number, state: StoredQuiz): HumanAiView {
  const s = state.quiz;
  const results: RoundResult[] = [];
  for (let r = 0; r < s.rounds.length; r++) {
    const completed = s.phase === 'finished' || r < s.round || (s.phase === 'round-end' && r === s.round);
    if (!completed) break;
    const questions = s.rounds[r] ?? [];
    const records = s.answers[r] ?? [];
    const review: ReviewItem[] = questions.map((q, i) => ({ prompt: q.prompt, options: [...q.options], answer: q.answer, explanation: q.explanation ?? null, human: records[i]?.choice ?? null, ai: state.ai[`${r}:${i}`]?.choice ?? null, aiError: state.ai[`${r}:${i}`]?.error ?? 'AI answer unavailable' }));
    // A genuine successful answer has no error.
    review.forEach((item, i) => { if (state.ai[`${r}:${i}`]?.status === 'success') item.aiError = null; });
    const human = participantScore(review.map(q => ({ choice: q.human, answer: q.answer })));
    const ai = participantScore(review.map(q => ({ choice: q.ai, answer: q.answer, error: q.aiError })));
    results.push({ human, ai, winner: roundWinner(human, ai), review });
  }
  const all = results.flatMap(r => r.review);
  const human = participantScore(all.map(q => ({ choice: q.human, answer: q.answer })));
  const ai = participantScore(all.map(q => ({ choice: q.ai, answer: q.answer, error: q.aiError })));
  const q = s.phase === 'question' || s.phase === 'locked' ? currentQuestion(s) : null;
  const a = state.ai[questionKey(s)];
  return { id, version, category: s.category, roundCount: s.rounds.length, round: s.round, index: s.index, phase: s.phase, deadline: s.deadline,
    question: q ? { id: q.id, prompt: q.prompt, options: [...q.options] } : null,
    choice: s.answers[s.round]?.[s.index]?.choice ?? null, aiStatus: a?.status ?? 'waiting', aiError: a?.error ?? null,
    model: state.model, results, overall: s.phase === 'finished' ? { human, ai, winner: roundWinner(human, ai), review: all } : null };
}
export function transition(state: StoredQuiz, type: 'answer' | 'timeout' | 'next' | 'next-round', choice: number | undefined, now: number): StoredQuiz {
  const q = state.quiz;
  if (type === 'answer' && (choice === undefined || !Number.isInteger(choice) || choice < 0 || choice > 3)) throw new Error('Invalid answer option.');
  if ((type === 'next' || type === 'next-round') && state.ai[questionKey(q)]?.status === 'pending') throw new Error('The AI request is still running.');
  const next = type === 'answer' ? quizReducer(q, { type, choice: choice ?? 0, now }) : quizReducer(q, { type, now });
  return { ...state, quiz: next };
}
export async function getGeminiAnswer(question: { prompt: string; options: string[] }, model: string, key: string | undefined): Promise<AiAnswer> {
  if (!key) return { choice: null, status: 'failed', error: 'Gemini is not configured on the app server. No AI answer was generated.' };
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': key }, signal: AbortSignal.timeout(20000),
      body: JSON.stringify({ contents: [{ parts: [{ text: `Answer this multiple-choice question. Return only one letter A, B, C, or D.\n${question.prompt}\n${question.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join('\n')}` }] }], generationConfig: { maxOutputTokens: 128 } }),
    });
    if (!response.ok) return { choice: null, status: 'failed', error: response.status === 429 ? 'Gemini rate limit reached. This question has no AI answer.' : `Gemini request failed (${response.status}). This question has no AI answer.` };
    const body = await response.json() as { candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[] };
    const text = body.candidates?.[0]?.content?.parts?.filter(p => !p.thought).map(p => p.text ?? '').join('').trim() ?? '';
    const match = /^([ABCD])[.\s]*$/i.exec(text);
    if (!match?.[1]) return { choice: null, status: 'failed', error: 'Gemini did not return a valid answer option. No AI score was invented.' };
    return { choice: match[1].toUpperCase().charCodeAt(0) - 65, status: 'success', error: null };
  } catch {
    return { choice: null, status: 'failed', error: 'Gemini request timed out or could not connect. No AI answer was generated.' };
  }
}