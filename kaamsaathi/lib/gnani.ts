// Gnani Prisma (STT) and Timbre (TTS) REST clients. Server-only: never import from client components.
const BASE = 'https://api.vachana.ai'

function headers(extra: Record<string, string> = {}) {
  const key = process.env.GNANI_API_KEY
  if (!key) throw new Error('GNANI_API_KEY is not set')
  return { 'X-API-Key-ID': key, ...extra }
}

// shortcut: one 10 s timeout and no retry, add backoff on 429 if the demo hits rate limits.
const TIMEOUT_MS = 10_000

export async function transcribe(wav: Blob, languageCodes: string, keyterms: string[] = []) {
  const form = new FormData()
  form.append('audio_file', wav, 'clip.wav')
  form.append('model', 'prisma-v3.0')
  form.append('language_code', languageCodes) // e.g. "hi-IN" or "hi-IN,ta-IN" (hints, not locks)
  form.append('format', process.env.GNANI_STT_FORMAT ?? 'transcribe')
  if (keyterms.length) form.append('keyterms', JSON.stringify(keyterms.slice(0, 200)))

  const res = await fetch(`${BASE}/stt/v3`, {
    method: 'POST',
    headers: headers(),
    body: form,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.success === false) {
    throw new Error(`Prisma STT failed (${res.status}): ${JSON.stringify(json).slice(0, 300)}`)
  }
  // An empty transcript means no speech, which is not an error.
  return { text: (json.transcript ?? '') as string, language: json.detected_language_code as string | undefined }
}

export async function speak(text: string, language: string, voice: { model: string; name: string }) {
  const res = await fetch(`${BASE}/api/v1/tts/inference`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      text,
      model: voice.model,
      voice: voice.name,
      language,
      speed: 1.0,
      audio_config: { container: 'mp3', bitrate: '64k' },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`Timbre TTS failed (${res.status}): ${(await res.text()).slice(0, 300)}`)
  return Buffer.from(await res.arrayBuffer()) // raw mp3 bytes, not JSON
}
