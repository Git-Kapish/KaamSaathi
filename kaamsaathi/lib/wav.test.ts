import { expect, test } from 'vitest'
import { encodeWav } from './wav'

test('downsamples 48 kHz to a valid 16 kHz mono 16-bit WAV', () => {
  const wav = encodeWav(new Float32Array(48000).fill(0.5), 48000) // 1 s
  const v = new DataView(wav.buffer)
  const tag = (o: number) => String.fromCharCode(...wav.slice(o, o + 4))
  expect([tag(0), tag(8), tag(36)]).toEqual(['RIFF', 'WAVE', 'data'])
  expect(v.getUint32(24, true)).toBe(16000) // sample rate
  expect(v.getUint32(40, true)).toBe(16000 * 2) // data bytes
  expect(wav.length).toBe(44 + 32000)
  expect(v.getInt16(44, true)).toBeGreaterThan(16000) // 0.5 -> about 16383
})
