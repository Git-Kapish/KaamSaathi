import { generateText, Output } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { kbText } from '@/content/knowledge'
import { GLOSSARY } from '@/content/glossary'
import type { Lang } from './config'

export type Mode = 'ask' | 'translate' | 'report'

export const TurnSchema = z.object({
  intent: z.enum(['question', 'report', 'emergency', 'unknown']),
  answer: z.string().describe('The text to speak back, in the requested output language.'),
  source_ids: z.array(z.string()).describe('Passage ids the answer is based on. Empty if none.'),
  high_risk: z.boolean(),
  report: z
    .object({
      report_type: z.enum(['injury', 'near_miss', 'unpaid_wages', 'harassment', 'other']),
      occurred_at: z.string().nullable().describe('ISO 8601 datetime or null if not stated'),
      location: z.string().nullable(),
      people_involved: z.array(z.string()),
      description: z.string(),
      severity: z.enum(['low', 'medium', 'high', 'emergency']),
    })
    .nullable(),
})
export type TurnOutput = z.infer<typeof TurnSchema>

const NAME: Record<Lang, string> = { 'hi-IN': 'Hindi (Devanagari script)', 'ta-IN': 'Tamil (Tamil script)' }

const RULES = `Style: simple spoken words, no markdown, write numbers as words, at most 5 steps, each step under 15 words.`

function prompts(mode: Mode, lang: Lang, target?: Lang) {
  if (mode === 'ask') {
    return `You are KaamSaathi, a spoken safety assistant for construction workers. Reply in ${NAME[lang]}.
Answer ONLY from the PASSAGES below. If they do not answer the question, set intent "question", source_ids [] and answer "".
Set high_risk true for electrical, height, chemicals or heavy machinery topics.
Never give medical, legal or immigration advice and never invent numbers, rules or procedures: use source_ids [] for those.
If the worker wants to report an injury, unpaid wages or harassment, set intent "report". If it is a life-threatening emergency, set intent "emergency".
${RULES}
report must be null.

PASSAGES:
${kbText()}`
  }
  if (mode === 'translate') {
    const dst = target ?? lang
    const glossary = GLOSSARY.map((g) => `${g.en} = ${g.hi} (Hindi) = ${g.ta} (Tamil)`).join('\n')
    return `Translate the worker or supervisor's sentence from ${NAME[lang]} into ${NAME[dst]}. Put only the translation in "answer".
Keep the meaning exact; do not add or remove instructions. Use this trade glossary for tool and gear names:
${glossary}
Set intent "unknown", source_ids [], high_risk false, report null.`
  }
  return `You help a worker file a report. Today is ${new Date().toISOString().slice(0, 10)}.
Extract the report fields from what the worker said (language: ${NAME[lang]}). Use null for anything not stated; never guess.
severity "emergency" only for life-threatening situations.
Put a short read-back of the report in "answer", in ${NAME[lang]}, ending with a question asking the worker to say yes if it is correct.
Set intent "report", source_ids [], high_risk false. ${RULES}`
}

export async function reason(opts: { mode: Mode; transcript: string; lang: Lang; target?: Lang }) {
  const { output } = await generateText({
    model: google(process.env.LLM_MODEL ?? 'gemini-2.5-flash'),
    output: Output.object({ schema: TurnSchema }),
    system: prompts(opts.mode, opts.lang, opts.target),
    prompt: opts.transcript,
    temperature: 0.2,
    abortSignal: AbortSignal.timeout(15_000),
  })
  return output
}
