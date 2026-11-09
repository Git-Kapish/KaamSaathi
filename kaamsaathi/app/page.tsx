'use client'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { LANGS, type Lang } from '@/lib/config'
import { MAX_RECORD_MS, playMp3, startRecording } from '@/lib/audio'
import type { AvatarState } from '@/components/Avatar3D'

const Avatar3D = dynamic(() => import('@/components/Avatar3D'), { ssr: false })

type Mode = 'ask' | 'translate' | 'report'
type Line = { who: 'worker' | 'assistant'; text: string; lang: Lang }
type Report = { report_type: string; occurred_at: string | null; location: string | null; people_involved: string[]; description: string; severity: string }

// DRAFT UI strings: have a native speaker review.
// 'en' shows English labels everywhere; set to 'native' to show Hindi/Tamil labels (the field-worker UI). Spoken replies stay Hindi/Tamil either way.
const UI: 'en' | 'native' = 'en'
const NAME: Record<Lang, string> = { 'hi-IN': 'Hindi', 'ta-IN': 'Tamil' }

const T: Record<string, Record<string, string>> = {
  en: {
    consentTitle: 'Your voice', consentBody: 'This app listens to your voice to answer questions and prepare reports. Nothing is saved without your permission. Do you agree?',
    agree: 'Yes, I agree', decline: 'No', ask: 'Ask', translate: 'Talk', report: 'Report',
    hold: 'Hold to speak', listening: 'Listening…', thinking: 'Thinking…', speaking: 'Speaking…',
    error: 'Service unavailable right now. Please ask your supervisor.', emergency: 'Emergency: call 112',
    noSpeech: "I didn't hear anything. Please speak again.",
    prototype: 'Prototype: always confirm safety decisions with your supervisor.',
  },
  'hi-IN': {
    consentTitle: 'आपकी आवाज़', consentBody: 'यह ऐप आपकी आवाज़ सुनकर जवाब देता है और रिपोर्ट बनाता है। आपकी अनुमति के बिना कुछ भी सेव नहीं होगा। क्या आप सहमत हैं?',
    agree: 'हाँ, सहमत', decline: 'नहीं', ask: 'पूछो', translate: 'बात करो', report: 'रिपोर्ट',
    hold: 'दबाकर बोलिए', listening: 'सुन रहा हूँ…', thinking: 'सोच रहा हूँ…', speaking: 'बोल रहा हूँ…',
    error: 'अभी सेवा उपलब्ध नहीं है। कृपया अपने सुपरवाइज़र से पूछिए।', emergency: 'आपातकाल: 112 पर फ़ोन कीजिए',
    prototype: 'प्रोटोटाइप: सुरक्षा के फ़ैसले सुपरवाइज़र से पूछकर ही लें।',
  },
  'ta-IN': {
    consentTitle: 'உங்கள் குரல்', consentBody: 'இந்த ஆப் உங்கள் குரலைக் கேட்டு பதில் சொல்லி, அறிக்கை தயாரிக்கும். உங்கள் அனுமதி இல்லாமல் எதுவும் சேமிக்கப்படாது. சம்மதமா?',
    agree: 'ஆம், சம்மதம்', decline: 'வேண்டாம்', ask: 'கேள்', translate: 'பேசு', report: 'அறிக்கை',
    hold: 'அழுத்திப் பேசுங்கள்', listening: 'கேட்கிறேன்…', thinking: 'யோசிக்கிறேன்…', speaking: 'பேசுகிறேன்…',
    error: 'இப்போது சேவை இல்லை. உங்கள் மேற்பார்வையாளரிடம் கேளுங்கள்.', emergency: 'அவசரம்: 112 ஐ அழைக்கவும்',
    prototype: 'முன்மாதிரி: பாதுகாப்பு முடிவுகளை மேற்பார்வையாளரிடம் கேட்டே எடுங்கள்.',
  },
}
const other = (l: Lang): Lang => (l === 'hi-IN' ? 'ta-IN' : 'hi-IN')

// Module-level so it keeps its identity across renders: a button defined inside Home would remount mid-press and lose the pointer-up.
function MicButton(p: { label: string; listening: boolean; disabled: boolean; onDown: () => void; onUp: () => void }) {
  return (
    <button
      onPointerDown={p.onDown}
      onPointerUp={p.onUp}
      onPointerCancel={p.onUp}
      onContextMenu={(e) => e.preventDefault()}
      disabled={p.disabled}
      style={{ touchAction: 'none' }}
      className={`flex h-24 flex-1 select-none flex-col items-center justify-center rounded-3xl text-xl font-semibold text-white disabled:opacity-50 ${p.listening ? 'bg-red-600' : 'bg-blue-600'}`}
    >
      <span className="text-4xl">🎤</span>
      {p.label}
    </button>
  )
}

export default function Home() {
  const [lang, setLang] = useState<Lang | null>(null)
  const [consent, setConsent] = useState<'granted' | 'declined' | null>(null) // not persisted yet: Supabase step
  const [mode, setMode] = useState<Mode>('ask')
  const [state, setState] = useState<AvatarState>('idle')
  const [lines, setLines] = useState<Line[]>([])
  const [report, setReport] = useState<Report | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const [timings, setTimings] = useState<Record<string, number> | null>(null)
  const rec = useRef<Awaited<ReturnType<typeof startRecording>> | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (!lang) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-slate-50 p-4">
        <h1 className="text-3xl font-bold">KaamSaathi</h1>
        {(Object.keys(LANGS) as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} className="h-20 w-full max-w-sm rounded-2xl bg-blue-600 text-3xl font-semibold text-white active:bg-blue-800">
            {LANGS[l].label} · {NAME[l]}
          </button>
        ))}
      </main>
    )
  }
  const t = UI === 'en' ? T.en : T[lang]

  if (!consent) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-slate-50 p-6 text-center">
        <h1 className="text-3xl font-bold">🎙️ {t.consentTitle}</h1>
        <p className="max-w-md text-xl leading-relaxed">{t.consentBody}</p>
        <button onClick={() => setConsent('granted')} className="h-16 w-full max-w-sm rounded-2xl bg-green-600 text-2xl font-semibold text-white">{t.agree}</button>
        <button onClick={() => setConsent('declined')} className="h-16 w-full max-w-sm rounded-2xl bg-slate-300 text-2xl font-semibold">{t.decline}</button>
      </main>
    )
  }

  async function send(blob: Blob, spokenLang: Lang, target: Lang) {
    setState('thinking')
    setBanner(null)
    try {
      const body = new FormData()
      body.append('audio', blob, 'clip.wav')
      body.append('mode', mode)
      body.append('lang', spokenLang)
      body.append('target', target)
      const res = await fetch('/api/turn', { method: 'POST', body })
      if (!res.ok) throw new Error(String(res.status))
      const j = await res.json()
      setTimings(j.timings)
      if (j.noSpeech) { setBanner(t.noSpeech ?? j.reply_text); setState('idle'); return }
      setLines((p) => [...p, { who: 'worker', text: j.transcript, lang: spokenLang }, { who: 'assistant', text: j.reply_text, lang: j.reply_lang }])
      setReport(j.report ?? null)
      if (j.emergency) setBanner(t.emergency)
      setState('speaking')
      await playMp3(j.audio_b64)
    } catch (e) {
      console.error(e)
      setBanner(t.error)
    } finally {
      setState('idle')
    }
  }

  async function press(spokenLang: Lang, target: Lang) {
    if (state !== 'idle') return
    try {
      rec.current = await startRecording()
      setState('listening')
      timer.current = setTimeout(() => release(spokenLang, target), MAX_RECORD_MS)
    } catch {
      setBanner(t.error) // mic permission denied or no HTTPS
    }
  }
  function release(spokenLang: Lang, target: Lang) {
    if (!rec.current) return
    if (timer.current) clearTimeout(timer.current)
    const blob = rec.current.stop()
    rec.current = null
    void send(blob, spokenLang, target)
  }

  const mic = (spoken: Lang, target: Lang, label: string) => (
    <MicButton
      key={spoken}
      label={label}
      listening={state === 'listening'}
      disabled={state === 'thinking' || state === 'speaking'}
      // these run only from pointer events, never during render (lint cannot see through the prop)
      // eslint-disable-next-line react-hooks/refs
      onDown={() => press(spoken, target)}
      // eslint-disable-next-line react-hooks/refs
      onUp={() => release(spoken, target)}
    />
  )

  const status = state === 'idle' ? '' : t[state]
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-3 bg-slate-50 p-3">
      <div className="h-64 overflow-hidden rounded-3xl bg-slate-200">
        <Avatar3D state={state} />
      </div>
      <p className="h-6 text-center text-lg font-medium">{status}</p>
      {banner && <p className="rounded-xl bg-red-100 p-3 text-center text-lg font-semibold text-red-800">{banner}</p>}

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {lines.slice(-6).map((l, i) => (
          <p key={i} className={`rounded-2xl p-3 text-lg ${l.who === 'worker' ? 'self-end bg-blue-100' : 'self-start bg-white'}`}>{l.text}</p>
        ))}
        {mode === 'report' && report && (
          <dl className="rounded-2xl bg-amber-50 p-3 text-base">
            {Object.entries(report).map(([k, v]) => (
              <div key={k} className="flex gap-2"><dt className="font-semibold">{k}:</dt><dd>{Array.isArray(v) ? v.join(', ') : String(v ?? '—')}</dd></div>
            ))}
          </dl>
        )}
      </div>

      <div className="flex gap-2">
        {mode === 'translate' ? (
          <>
            {mic(lang, other(lang), UI === 'en' ? NAME[lang] : LANGS[lang].label)}
            {mic(other(lang), lang, UI === 'en' ? NAME[other(lang)] : LANGS[other(lang)].label)}
          </>
        ) : (
          mic(lang, lang, t.hold)
        )}
      </div>
      <div className="flex gap-2">
        {(['ask', 'translate', 'report'] as Mode[]).map((m) => (
          <button key={m} onClick={() => { setMode(m); setReport(null) }} className={`h-14 flex-1 rounded-2xl text-lg font-semibold ${mode === m ? 'bg-slate-800 text-white' : 'bg-slate-200'}`}>
            {t[m]}
          </button>
        ))}
      </div>
      <p className="text-center text-sm text-slate-600">{t.prototype}</p>
      {timings && <p className="text-center text-xs text-slate-500">{Object.entries(timings).map(([k, v]) => `${k} ${v}`).join(' · ')}</p>}
    </main>
  )
}
