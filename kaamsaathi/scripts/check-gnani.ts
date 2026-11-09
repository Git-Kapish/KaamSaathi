// Step 0: confirm the Gnani key works and compare Timbre voices by ear.
// Run: node --env-file=.env.local scripts/check-gnani.ts [path/to/clip.wav]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { speak, transcribe } from '../lib/gnani.ts'

const samples = [
  { lang: 'hi-IN', text: 'नमस्ते, मैं काम साथी हूँ। काम शुरू करने से पहले हेलमेट पहनना ज़रूरी है।' },
  { lang: 'ta-IN', text: 'வணக்கம், நான் காம் சாத்தி. வேலை தொடங்கும் முன் தலைக்கவசம் அணிவது அவசியம்.' },
]
const voices = [
  { model: 'timbre-v2.5', name: 'Nalini', langs: ['hi-IN'] },
  { model: 'timbre-v2.5', name: 'Asmita', langs: ['ta-IN'] },
  { model: 'timbre-v3.0', name: 'Chetana', langs: ['hi-IN', 'ta-IN'] },
  { model: 'timbre-v3.0', name: 'Avinash', langs: ['hi-IN', 'ta-IN'] },
]

mkdirSync('tmp-audio', { recursive: true })
for (const v of voices) {
  for (const s of samples.filter((s) => v.langs.includes(s.lang))) {
    const t0 = Date.now()
    const mp3 = await speak(s.text, s.lang, { model: v.model, name: v.name })
    const file = `tmp-audio/${s.lang}-${v.model}-${v.name}.mp3`
    writeFileSync(file, mp3)
    console.log(`TTS ok ${file} (${mp3.length} bytes, ${Date.now() - t0} ms)`)
  }
}

const clip = process.argv[2]
if (clip) {
  const t0 = Date.now()
  const r = await transcribe(new Blob([readFileSync(clip)], { type: 'audio/wav' }), 'hi-IN,ta-IN')
  console.log(`STT ok (${Date.now() - t0} ms):`, r)
} else {
  console.log('Pass a WAV clip as an argument to test Prisma STT too.')
}
