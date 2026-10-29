import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { Clock, ArrowRight, AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/SiteLayout';
import { CATEGORIES } from '@/lib/test-setup';
import { openHumanAi, updateHumanAi } from '@/lib/human-ai.functions';
import type { HumanAiView, RoundResult, ParticipantScore } from '@/lib/human-ai-view';

export const Route = createFileRoute('/test/human-vs-ai')({
  validateSearch: z.object({ category: z.enum(CATEGORIES).optional().catch(undefined), rounds: z.coerce.number().int().min(1).max(3).optional().catch(undefined) }),
  beforeLoad: ({ search }) => { if (!search.category || !search.rounds) throw redirect({ to: '/take-a-test', search: { mode: 'human-vs-ai', ...search } }); },
  head: () => ({ meta: [
    { title: 'Human vs AI Test — AI POWERED TURING TEST' },
    { name: 'description', content: 'Compete against an AI opponent on timed questions and review saved round results.' },
    { property: 'og:title', content: 'Human vs AI Test — AI POWERED TURING TEST' },
    { property: 'og:description', content: 'Timed questions, private saved progress and human versus AI round results.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: HumanVsAiPage,
});
function HumanVsAiPage() {
  const { category, rounds } = Route.useSearch();
  const open = useServerFn(openHumanAi);
  const update = useServerFn(updateHumanAi);
  const [s, setS] = useState<HumanAiView | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(0);
  const load = async (fresh = false) => {
    if (!category || !rounds) return;
    setBusy(true); setError('');
    try { setS(await open({ data: { category, rounds, fresh } })); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not open this test.'); }
    finally { setBusy(false); }
  };
  useEffect(() => { void load(); }, [category, rounds]);
  const act = async (type: 'answer' | 'timeout' | 'next' | 'next-round' | 'resume', choice?: number) => {
    if (!s || busy) return;
    setBusy(true); setError('');
    try { setS(await update({ data: { id: s.id, version: s.version, type, ...(choice === undefined ? {} : { choice }) } })); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not save this action.'); }
    finally { setBusy(false); }
  };
  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 200);
    setNow(Date.now());
    return () => window.clearInterval(tick);
  }, []);
  useEffect(() => {
    if (s?.phase === 'question' && now >= s.deadline && !busy && !error) void act('timeout');
    if (s?.aiStatus === 'pending' && now > s.deadline + 30000 && !busy && !error) void act('resume');
  }, [now, s, busy, error]);
  useEffect(() => {
    if (!s || s.phase === 'finished') return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [s?.phase]);
  const seconds = s ? Math.max(0, Math.ceil((s.deadline - now) / 1000)) : 15;
  return <Container className="py-10 sm:py-14"><div className="mx-auto max-w-3xl">
    <p className="mb-6 flex items-start gap-2 rounded-lg border border-accent/40 bg-accent/10 p-3 text-sm text-accent"><AlertTriangle className="h-4 w-4 shrink-0" />The AI opponent is not connected yet. Genuine Gemini requests have not been verified. Failed requests will not count as AI answers.</p>
    {error && <div role="alert" className="mb-5 text-destructive"><p>{error}</p><Button variant="outline" onClick={() => load()}>Reload saved test</Button></div>}
    {!s && <p className="text-muted-foreground">{busy ? 'Preparing your saved test…' : 'Test unavailable.'}</p>}
    {s && <>
      {(s.phase === 'question' || s.phase === 'locked') && s.question && <div className="rounded-lg border border-border bg-card/60 p-6 sm:p-8">
        <div className="flex flex-wrap justify-between gap-3 font-mono text-xs text-muted-foreground"><span>Round {s.round + 1} of {s.roundCount}</span><span>Question {s.index + 1} of 10</span><span className="flex items-center gap-2"><Clock className="h-4 w-4" />{s.phase === 'locked' ? 'Locked' : `${seconds}s`}</span></div>
        <p className="mt-6 text-sm text-primary">{s.category}</p><h1 className="mt-2 text-xl font-semibold sm:text-2xl">{s.question.prompt}</h1>
        <div className="mt-6 grid gap-3">{s.question.options.map((option, i) => <Button key={i} variant="outline" className="h-auto min-h-12 justify-start whitespace-normal py-3 text-left" disabled={busy || s.phase === 'locked' || seconds === 0} onClick={() => act('answer', i)}><span className="font-mono text-muted-foreground">{String.fromCharCode(65 + i)}</span>{option}</Button>)}</div>
        {busy && <p role="status" className="mt-5 text-muted-foreground">Saving answer and requesting the AI opponent…</p>}
        {s.phase === 'locked' && <div className="mt-5 space-y-3"><p>{s.choice === null ? 'No human answer recorded.' : 'Your answer is locked.'}</p><p className="text-sm text-muted-foreground">AI: {s.aiStatus === 'success' ? 'Genuine response recorded. Revealed after this round.' : s.aiStatus === 'pending' ? 'Request in progress…' : 'Request failed.'}</p>{s.aiError && <p role="alert" className="text-sm text-destructive">{s.aiError}</p>}<Button variant="brand" disabled={busy || s.aiStatus === 'pending'} onClick={() => act('next')}>{s.index === 9 ? 'Finish round' : 'Next question'}<ArrowRight /></Button></div>}
      </div>}
      {s.phase === 'round-end' && <><h1 className="mb-5 text-3xl font-bold">Round {s.round + 1} complete</h1><Results result={s.results[s.round]} /><Button className="my-6" variant="brand" disabled={busy} onClick={() => act('next-round')}>Start round {s.round + 2}<ArrowRight /></Button></>}
      {s.phase === 'finished' && <><h1 className="mb-5 text-3xl font-bold">Your results</h1><p className="mb-5 text-sm text-muted-foreground">Saved to Turing Test Database · AI model: {s.model}</p>{s.overall && <Results result={s.overall} summaryOnly />}{s.results.map((r, i) => <section key={i} className="mt-8"><h2 className="mb-4 text-xl font-bold">Round {i + 1}</h2><Results result={r} /></section>)}<div className="mt-8 flex flex-wrap gap-3"><Button asChild variant="brand"><Link to="/dashboard">Back to Dashboard</Link></Button><Button variant="outline" disabled={busy} onClick={() => load(true)}><RotateCcw />Start another test</Button></div></>}
    </>}
  </div></Container>;
}
function Score({ label, score }: { label: string; score: ParticipantScore }) {
  return <div><h3 className="font-semibold">{label}</h3><p className="mt-2 text-2xl font-bold">{score.correct}/{score.total} · {score.percent}%</p><p className="mt-2 text-sm text-muted-foreground">{score.correct} correct · {score.incorrect} incorrect · {score.unanswered} unanswered{score.failed > 0 && ` · ${score.failed} AI failures`}</p></div>;
}
function Results({ result, summaryOnly = false }: { result: RoundResult | undefined; summaryOnly?: boolean }) {
  if (!result) return null;
  return <><div className="grid gap-6 border-y border-border py-6 sm:grid-cols-2"><Score label="Human" score={result.human} /><Score label="AI opponent" score={result.ai} /></div><p className="my-5 font-semibold">{result.winner}</p>{!summaryOnly && <ol className="space-y-3">{result.review.map((q, i) => <li key={i} className="rounded-lg border border-border bg-secondary/30 p-4"><p className="font-medium">{i + 1}. {q.prompt}</p><p className="mt-2 text-sm">Human: {q.human === null ? 'Unanswered' : q.options[q.human]}</p><p className="text-sm">AI: {q.aiError ?? (q.ai === null ? 'Unanswered' : q.options[q.ai])}</p><p className="mt-2 text-sm text-primary">Correct answer: {q.options[q.answer]}</p>{q.explanation && <p className="mt-1 text-sm text-muted-foreground">{q.explanation}</p>}</li>)}</ol>}</>;
}
