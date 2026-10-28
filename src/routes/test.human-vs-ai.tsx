import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useReducer, useState } from "react";
import { z } from "zod";
import { AlertTriangle, ArrowRight, Check, Clock, LayoutDashboard, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/SiteLayout";
import { CATEGORIES } from "@/lib/test-setup";
import { QUESTIONS } from "@/lib/question-bank";
import {
  QUESTIONS_PER_ROUND,
  SECONDS_PER_QUESTION,
  currentQuestion,
  percent,
  quizReducer,
  scoreOf,
  startQuiz,
  type AnswerRecord,
  type QuizAction,
  type QuizState,
} from "@/lib/quiz-engine";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  category: z.enum(CATEGORIES).optional().catch(undefined),
  rounds: z.coerce.number().int().min(1).max(3).optional().catch(undefined),
});

export const Route = createFileRoute("/test/human-vs-ai")({
  validateSearch: searchSchema,
  beforeLoad: ({ search }) => {
    if (!search.category || !search.rounds)
      throw redirect({ to: "/take-a-test", search: { mode: "human-vs-ai", category: search.category, rounds: search.rounds } });
  },
  head: () => ({
    meta: [
      { title: "Human vs AI Test — AI POWERED TURING TEST" },
      { name: "description", content: "Answer timed multiple-choice questions across rounds and review your results." },
      { property: "og:title", content: "Human vs AI Test — AI POWERED TURING TEST" },
      { property: "og:description", content: "Answer timed multiple-choice questions across rounds and review your results." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HumanVsAiPage,
});

type ActInput = QuizAction extends infer A ? (A extends QuizAction ? Omit<A, "now"> : never) : never;

const STORAGE_KEY = "hva-test-state";
const byId = new Map(QUESTIONS.map((q) => [q.id, q]));

function HumanVsAiPage() {
  const { category, rounds } = Route.useSearch() as { category: QuizState["category"]; rounds: number };
  const [initial, setInitial] = useState<QuizState | null>(null);

  // Restore an in-progress test after a refresh (client only), otherwise start fresh.
  useEffect(() => {
    let restored: QuizState | null = null;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as QuizState) : null;
      if (parsed && parsed.category === category && parsed.rounds.length === rounds && parsed.phase !== "finished") restored = parsed;
    } catch {
      /* ignore corrupt storage */
    }
    setInitial(restored ?? startQuiz(category, rounds, Date.now()));
  }, [category, rounds]);

  if (!initial) return <Container className="py-20 text-muted-foreground">Preparing your test…</Container>;
  return <Quiz key={`${category}-${rounds}`} initial={initial} />;
}

function Quiz({ initial }: { initial: QuizState }) {
  const [s, dispatch] = useReducer(quizReducer, initial);
  const navigate = useNavigate();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (s.phase === "finished") sessionStorage.removeItem(STORAGE_KEY);
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }, [s]);

  // Countdown: tick while answering; dispatch timeout once the deadline passes.
  useEffect(() => {
    if (s.phase !== "question") return;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t >= s.deadline) dispatch({ type: "timeout", now: t });
    };
    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [s.phase, s.deadline]);

  // Warn before leaving mid-test.
  useEffect(() => {
    if (s.phase === "finished") return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [s.phase]);

  const act = (a: ActInput) => dispatch({ ...a, now: Date.now() } as QuizAction);
  const restart = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    navigate({ to: "/take-a-test", search: { mode: "human-vs-ai" } });
  };

  return (
    <Container className="py-10 sm:py-14">
      <p className="mx-auto mb-6 flex max-w-3xl items-start gap-2 rounded-lg border border-accent/40 bg-accent/10 p-3 text-sm text-accent">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        The AI opponent is not connected yet. You're answering on your own — no AI answers or comparisons are being made.
      </p>
      <div className="mx-auto max-w-3xl">
        {(s.phase === "question" || s.phase === "locked") && <QuestionView s={s} now={now} act={act} />}
        {s.phase === "round-end" && <RoundEnd s={s} onNext={() => act({ type: "next-round" })} />}
        {s.phase === "finished" && <Final s={s} onRestart={restart} />}
      </div>
    </Container>
  );
}

function QuestionView({ s, now, act }: { s: QuizState; now: number; act: (a: ActInput) => void }) {
  const q = currentQuestion(s);
  const rec = s.phase === "locked" ? s.answers[s.round]![s.index] : undefined;
  const secs = Math.max(0, Math.ceil((s.deadline - now) / 1000));
  const isLast = s.index + 1 === s.rounds[s.round]!.length;
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span>Round {s.round + 1} of {s.rounds.length}</span>
        <span>Question {s.index + 1} of {QUESTIONS_PER_ROUND}</span>
        <span className={cn("flex items-center gap-1.5 text-sm", !rec && secs <= 5 ? "text-destructive" : "text-primary")} aria-live="polite">
          <Clock className="h-4 w-4" /> {rec ? "Locked" : `${secs}s`}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-gradient-brand transition-[width] duration-200" style={{ width: `${rec ? 0 : (secs / SECONDS_PER_QUESTION) * 100}%` }} />
      </div>
      <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-primary">{s.category}</p>
      <h1 className="mt-2 text-xl font-semibold sm:text-2xl">{q.prompt}</h1>
      <div className="mt-6 grid gap-3">
        {q.options.map((o, i) => {
          const isCorrect = rec && i === q.answer;
          const isWrongPick = rec && rec.choice === i && !rec.correct;
          return (
            <button
              key={i}
              type="button"
              disabled={!!rec}
              onClick={() => act({ type: "answer", choice: i })}
              className={cn(
                "flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors disabled:cursor-default",
                isCorrect ? "border-primary bg-primary/15" : isWrongPick ? "border-destructive bg-destructive/10" : "border-border bg-secondary/40 hover:border-primary/40",
              )}
            >
              <span><span className="mr-3 font-mono text-muted-foreground">{String.fromCharCode(65 + i)}</span>{o}</span>
              {isCorrect && <Check className="h-4 w-4 text-primary" />}
              {isWrongPick && <X className="h-4 w-4 text-destructive" />}
            </button>
          );
        })}
      </div>
      {rec && (
        <div className="mt-6 space-y-4">
          <p className={cn("text-sm font-medium", rec.correct ? "text-primary" : "text-destructive")}>
            {rec.correct ? "Correct!" : rec.choice === null ? "Time's up — counted as incorrect." : "Incorrect."}
            {q.explanation && <span className="ml-1 font-normal text-muted-foreground">{q.explanation}</span>}
          </p>
          <Button variant="brand" onClick={() => act({ type: "next" })}>
            {isLast ? "Finish round" : "Next question"} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function Review({ records }: { records: AnswerRecord[] }) {
  return (
    <ol className="space-y-3">
      {records.map((r, i) => {
        const q = byId.get(r.questionId)!;
        return (
          <li key={i} className="rounded-xl border border-border bg-secondary/30 p-4">
            <p className="flex items-start gap-2 font-medium">
              {r.correct ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />}
              <span>{i + 1}. {q.prompt}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your answer: <span className={r.correct ? "text-primary" : "text-destructive"}>{r.choice === null ? "No answer (time ran out)" : q.options[r.choice]}</span>
            </p>
            {!r.correct && <p className="text-sm text-muted-foreground">Correct answer: <span className="text-foreground">{q.options[q.answer]}</span></p>}
            {q.explanation && <p className="mt-1 text-sm text-muted-foreground">{q.explanation}</p>}
          </li>
        );
      })}
    </ol>
  );
}

function RoundEnd({ s, onNext }: { s: QuizState; onNext: () => void }) {
  const sc = scoreOf(s.answers[s.round]!);
  const [show, setShow] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur sm:p-8">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Round {s.round + 1} of {s.rounds.length} complete</p>
      <h1 className="mt-2 text-3xl font-bold">You scored {sc.correct} / {sc.total}</h1>
      <p className="mt-2 text-muted-foreground">{sc.incorrect} incorrect · {sc.unanswered} unanswered</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="brand" onClick={onNext}>Start round {s.round + 2} <ArrowRight className="ml-1 h-4 w-4" /></Button>
        <Button variant="outline" onClick={() => setShow((v) => !v)}>{show ? "Hide answers" : "Review answers"}</Button>
      </div>
      {show && <div className="mt-6"><Review records={s.answers[s.round]!} /></div>}
    </div>
  );
}

function Final({ s, onRestart }: { s: QuizState; onRestart: () => void }) {
  const all = scoreOf(s.answers.flat());
  const stats: [string, string | number][] = [
    ["Correct", all.correct],
    ["Incorrect", all.incorrect],
    ["Unanswered", all.unanswered],
    ["Overall", `${percent(all.correct, all.total)}%`],
  ];
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Test complete · {s.category}</p>
        <h1 className="mt-2 text-3xl font-bold">Your results</h1>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border bg-secondary/30 p-4">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{k}</p>
              <p className="mt-1 text-2xl font-bold">{v}</p>
            </div>
          ))}
        </div>
        {s.rounds.length > 1 && (
          <ul className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {s.answers.map((r, i) => <li key={i}>Round {i + 1}: {scoreOf(r).correct}/{r.length}</li>)}
          </ul>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="brand"><Link to="/dashboard"><LayoutDashboard className="mr-1 h-4 w-4" /> Back to Dashboard</Link></Button>
          <Button variant="outline" onClick={onRestart}><RotateCcw className="mr-1 h-4 w-4" /> Start another test</Button>
        </div>
      </div>
      {s.answers.map((r, i) => (
        <section key={i}>
          <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Round {i + 1} answers</h2>
          <Review records={r} />
        </section>
      ))}
    </div>
  );
}
