import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie, getRequestUrl, setResponseHeader } from '@tanstack/react-start/server';
import { z } from 'zod';
import { CATEGORIES } from './test-setup';
import type { Json } from '@/integrations/supabase/types';

async function ownerHash() {
  let token = getCookie('human-ai-owner');
  if (!token) {
    token = crypto.randomUUID() + crypto.randomUUID();
    const secure = getRequestUrl().protocol === 'https:';
    setCookie('human-ai-owner', token, { httpOnly: true, secure, sameSite: secure ? 'none' : 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
  }
  setResponseHeader('Cache-Control', 'no-store');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}
export const openHumanAi = createServerFn({ method: 'POST' })
  .inputValidator((input) => z.object({ category: z.enum(CATEGORIES), rounds: z.number().int().min(1).max(3), fresh: z.boolean().optional() }).parse(input))
  .handler(async ({ data }) => {
    const owner = await ownerHash();
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { createStoredQuiz, publicQuiz } = await import('./human-ai.server');
    const { data: rows, error } = await supabaseAdmin.from('human_ai_sessions').select('*').eq('owner_hash', owner).order('created_at', { ascending: false }).limit(30);
    if (error) throw new Error('Could not load your saved test. Please try again.');
    const previous = !data.fresh ? rows?.find(row => { const s = row.state as unknown as import('./human-ai.server').StoredQuiz; return s.quiz.category === data.category && s.quiz.rounds.length === data.rounds; }) : undefined;
    if (previous) return publicQuiz(previous.id, previous.version, previous.state as unknown as import('./human-ai.server').StoredQuiz);
    const state = createStoredQuiz(data.category, data.rounds, Date.now());
    const { data: row, error: saveError } = await supabaseAdmin.from('human_ai_sessions').insert({ owner_hash: owner, state: state as unknown as Json }).select().single();
    if (saveError || !row) throw new Error('Could not save the new test. The test has not started.');
    return publicQuiz(row.id, row.version, state);
  });

export const updateHumanAi = createServerFn({ method: 'POST' })
  .inputValidator((input) => z.object({ id: z.string().uuid(), version: z.number().int().min(0), type: z.enum(['answer', 'timeout', 'next', 'next-round', 'resume']), choice: z.number().int().min(0).max(3).optional() }).parse(input))
  .handler(async ({ data }) => {
    const owner = await ownerHash();
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { transition, publicQuiz, questionKey, getGeminiAnswer } = await import('./human-ai.server');
    const { currentQuestion } = await import('./quiz-engine');
    const { data: row, error } = await supabaseAdmin.from('human_ai_sessions').select('*').eq('id', data.id).eq('owner_hash', owner).single();
    if (error || !row) throw new Error('This test is unavailable in this browser session.');
    let state = row.state as unknown as import('./human-ai.server').StoredQuiz;
    if (data.version !== row.version) return publicQuiz(row.id, row.version, state);
    if (data.type === 'resume') {
      const ai = state.ai[questionKey(state.quiz)];
      if (ai?.status === 'pending' && Date.now() > state.quiz.deadline + 30000) ai.status = 'failed', ai.error = 'AI request was interrupted. No answer was generated.';
      else return publicQuiz(row.id, row.version, state);
    } else state = transition(state, data.type, data.choice, Date.now());
    const qkey = questionKey(state.quiz);
    const shouldCall = state.quiz.phase === 'locked' && !state.ai[qkey];
    if (shouldCall) state.ai[qkey] = { choice: null, status: 'pending', error: null };
    const { data: saved, error: saveError } = await supabaseAdmin.from('human_ai_sessions').update({ state: state as unknown as Json, version: row.version + 1 }).eq('id', row.id).eq('owner_hash', owner).eq('version', row.version).select().maybeSingle();
    if (saveError) throw new Error('Could not save your answer. Please retry.');
    if (!saved) throw new Error('The test changed in another tab. Refresh to restore it.');
    if (!shouldCall) return publicQuiz(row.id, saved.version, state);
    const question = currentQuestion(state.quiz);
    state.ai[qkey] = await getGeminiAnswer({ prompt: question.prompt, options: question.options }, state.model, process.env['GEMINI_API_KEY']);
    const { data: completed, error: completeError } = await supabaseAdmin.from('human_ai_sessions').update({ state: state as unknown as Json, version: saved.version + 1 }).eq('id', row.id).eq('owner_hash', owner).eq('version', saved.version).select().maybeSingle();
    if (completeError || !completed) throw new Error('Your answer was saved, but the AI result could not be saved. Refresh to recover.');
    return publicQuiz(row.id, completed.version, state);
  });