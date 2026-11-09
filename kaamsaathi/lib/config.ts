export type Lang = 'hi-IN' | 'ta-IN'

export const LANGS: Record<Lang, { label: string; voice: { model: string; name: string } }> = {
  // Voices are the docs' Hindi/Tamil v2.5 picks; confirm by listening in step 0 and override here.
  'hi-IN': { label: 'हिन्दी', voice: { model: 'timbre-v2.5', name: 'Nalini' } },
  'ta-IN': { label: 'தமிழ்', voice: { model: 'timbre-v2.5', name: 'Asmita' } },
}

export const isLang = (v: unknown): v is Lang => typeof v === 'string' && v in LANGS
