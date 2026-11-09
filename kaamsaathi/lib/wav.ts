// Mono Float32 samples -> 16-bit PCM WAV at 16 kHz (Prisma does not list webm, so the browser sends WAV).
export function encodeWav(input: Float32Array, inRate: number, outRate = 16000): Uint8Array {
  const ratio = inRate / outRate
  const n = Math.floor(input.length / ratio)
  const buf = new ArrayBuffer(44 + n * 2)
  const v = new DataView(buf)
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)))

  str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); str(8, 'WAVE'); str(12, 'fmt ')
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true) // PCM, mono
  v.setUint32(24, outRate, true); v.setUint32(28, outRate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true)
  str(36, 'data'); v.setUint32(40, n * 2, true)

  for (let i = 0; i < n; i++) {
    // box-average the source samples that fall into this output sample (cheap anti-alias)
    const start = Math.floor(i * ratio)
    const end = Math.max(start + 1, Math.min(input.length, Math.floor((i + 1) * ratio)))
    let sum = 0
    for (let j = start; j < end; j++) sum += input[j]
    const s = Math.max(-1, Math.min(1, sum / (end - start)))
    v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return new Uint8Array(buf)
}
