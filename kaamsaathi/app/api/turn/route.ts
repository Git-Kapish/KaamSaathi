import { LANGS, isLang } from '@/lib/config'
import { speak, transcribe } from '@/lib/gnani'
import { guardAnswer, isEmergency, LINES } from '@/lib/guardrails'
import { reason, type Mode } from '@/lib/llm'
import { keyterms } from '@/content/glossary'

export const maxDuration = 30 // check the limit allowed on your Vercel plan

const MODES: Mode[] = ['ask', 'translate', 'report']

export async function POST(req: Request) {
  const form = await req.formData()
  const audio = form.get('audio')
  const mode = String(form.get('mode') ?? 'ask') as Mode
  const lang = form.get('lang')
  const targetRaw = form.get('target') ?? lang
  if (!(audio instanceof Blob) || !MODES.includes(mode) || !isLang(lang) || !isLang(targetRaw)) {
    return Response.json({ error: 'bad request' }, { status: 400 })
  }
  const timings: Record<string, number> = {}
  const time = async <T,>(k: string, fn: () => Promise<T>) => {
    const t0 = Date.now()
    try { return await fn() } finally { timings[`${k}_ms`] = Date.now() - t0 }
  }

  try {
    const stt = await time('stt', () => transcribe(audio, lang, keyterms(lang)))
    if (!stt.text.trim()) return Response.json({ transcript: '', noSpeech: true, reply_text: LINES[lang].noSpeech, timings })

    let replyText: string
    let replyLang = lang
    let refused = false
    let intent = 'unknown'
    let report = null
    const emergency = isEmergency(stt.text)

    if (emergency) {
      replyText = LINES[lang].emergency
      intent = 'emergency'
    } else {
      const out = await time('llm', () => reason({ mode, transcript: stt.text, lang, target: targetRaw }))
      intent = out.intent
      if (mode === 'ask') ({ text: replyText, refused } = guardAnswer(out, lang))
      else { replyText = out.answer; report = out.report }
      if (mode === 'translate') replyLang = targetRaw
      if (out.intent === 'emergency') { replyText = LINES[lang].emergency; intent = 'emergency' }
    }

    const mp3 = await time('tts', () => speak(replyText, replyLang, LANGS[replyLang].voice))
    return Response.json({
      transcript: stt.text,
      detected_lang: stt.language,
      intent,
      emergency: intent === 'emergency',
      refused,
      reply_text: replyText,
      reply_lang: replyLang,
      report,
      audio_b64: mp3.toString('base64'),
      timings,
    })
  } catch (e) {
    console.error('turn failed', e)
    // Fail soft: the client shows a banner and plays its own fallback line.
    return Response.json({ error: 'service_unavailable', timings }, { status: 502 })
  }
}
