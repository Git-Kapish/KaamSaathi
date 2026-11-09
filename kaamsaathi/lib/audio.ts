// Browser-only audio helpers: record a WAV clip, play an mp3 through one shared analyser (drives lip-sync).
import { encodeWav } from './wav'

let ctx: AudioContext | null = null
let analyser: AnalyserNode | null = null

const getCtx = () => (ctx ??= new AudioContext())

/** The lip-sync reads this each frame. Null until the first playback. */
export const peekAnalyser = () => analyser

export const MAX_RECORD_MS = 15_000 // keeps clips well under Prisma's 30 s REST limit and Vercel's body limit

export async function startRecording() {
  const c = getCtx()
  await c.resume() // must happen inside the user gesture (mic press) to unlock audio on Android
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
  })
  const src = c.createMediaStreamSource(stream)
  // shortcut: ScriptProcessor is deprecated but works on every target browser; move to AudioWorklet if it breaks on a phone.
  const proc = c.createScriptProcessor(4096, 1, 1)
  const chunks: Float32Array[] = []
  proc.onaudioprocess = (e) => chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)))
  src.connect(proc)
  proc.connect(c.destination) // output buffer stays silent; some browsers only run the node when connected

  return {
    stop(): Blob {
      proc.disconnect()
      src.disconnect()
      stream.getTracks().forEach((t) => t.stop())
      const all = new Float32Array(chunks.reduce((n, a) => n + a.length, 0))
      let o = 0
      for (const a of chunks) { all.set(a, o); o += a.length }
      return new Blob([encodeWav(all, c.sampleRate) as BlobPart], { type: 'audio/wav' })
    },
  }
}

export async function playMp3(base64: string): Promise<void> {
  const c = getCtx()
  await c.resume()
  if (!analyser) {
    analyser = c.createAnalyser()
    analyser.fftSize = 512
    analyser.connect(c.destination)
  }
  const bytes = Uint8Array.from(atob(base64), (ch) => ch.charCodeAt(0))
  const buffer = await c.decodeAudioData(bytes.buffer)
  const source = c.createBufferSource()
  source.buffer = buffer
  source.connect(analyser)
  await new Promise<void>((done) => {
    source.onended = () => done()
    source.start()
  })
}
