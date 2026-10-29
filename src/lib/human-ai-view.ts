export interface ParticipantScore { correct: number; incorrect: number; unanswered: number; failed: number; total: number; percent: number }
export interface ReviewItem { prompt: string; options: string[]; answer: number; explanation: string | null; human: number | null; ai: number | null; aiError: string | null }
export interface RoundResult { human: ParticipantScore; ai: ParticipantScore; winner: string; review: ReviewItem[] }
export interface HumanAiView {
  id: string; version: number; category: string; roundCount: number; round: number; index: number;
  phase: 'question' | 'locked' | 'round-end' | 'finished'; deadline: number;
  question: { id: string; prompt: string; options: string[] } | null;
  choice: number | null; aiStatus: string; aiError: string | null; model: string;
  results: RoundResult[]; overall: RoundResult | null;
}
export function participantScore(answers: { choice: number | null; answer: number; error?: string | null }[]): ParticipantScore {
  const failed = answers.filter(a => a.error).length;
  const correct = answers.filter(a => !a.error && a.choice === a.answer).length;
  const unanswered = answers.filter(a => !a.error && a.choice === null).length;
  return { correct, incorrect: answers.length - correct - unanswered - failed, unanswered, failed, total: answers.length, percent: answers.length ? Math.round(correct / answers.length * 100) : 0 };
}
export function roundWinner(human: ParticipantScore, ai: ParticipantScore) {
  if (ai.failed) return 'Comparison unavailable — AI requests failed';
  return human.correct === ai.correct ? 'Tie' : human.correct > ai.correct ? 'Human wins' : 'AI wins';
}