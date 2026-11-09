import type { Lang } from './config'
import { KB_IDS } from '@/content/knowledge'

// Fixed spoken lines. DRAFT wording: have a native speaker review before the demo.
export const LINES: Record<Lang, { refusal: string; confirm: string; emergency: string; noSpeech: string }> = {
  'hi-IN': {
    refusal: 'मुझे इसका पक्का जवाब नहीं पता। कृपया अपने सुपरवाइज़र से पूछिए।',
    confirm: 'काम शुरू करने से पहले अपने सुपरवाइज़र से ज़रूर पूछ लीजिए।',
    emergency: 'आपातकालीन संदेश सुपरवाइज़र को भेज दिया गया है। मदद के लिए एक, एक, दो पर फ़ोन कीजिए।',
    noSpeech: 'मुझे आवाज़ सुनाई नहीं दी। कृपया फिर से बोलिए।',
  },
  'ta-IN': {
    refusal: 'இதற்கு எனக்கு உறுதியான பதில் தெரியவில்லை. தயவுசெய்து உங்கள் மேற்பார்வையாளரிடம் கேளுங்கள்.',
    confirm: 'வேலையைத் தொடங்கும் முன் உங்கள் மேற்பார்வையாளரிடம் உறுதிசெய்து கொள்ளுங்கள்.',
    emergency: 'அவசர செய்தி மேற்பார்வையாளருக்கு அனுப்பப்பட்டது. உதவிக்கு ஒன்று, ஒன்று, இரண்டு எண்ணை அழைக்கவும்.',
    noSpeech: 'எனக்கு குரல் கேட்கவில்லை. தயவுசெய்து மீண்டும் பேசுங்கள்.',
  },
}

// Checked on the transcript before the LLM call so help is never delayed by it.
// DRAFT list: extend with the words workers really use (Bhojpuri/Hinglish) after testing on real clips.
const EMERGENCY_WORDS = [
  'bachao', 'bachaao', 'aag', 'fire', 'accident', 'emergency', 'help me',
  'बचाओ', 'आग', 'दुर्घटना', 'हादसा', 'एक्सीडेंट', 'इमरजेंसी',
  'காப்பாற்றுங்கள்', 'தீ', 'விபத்து', 'அவசரம்',
]
export const isEmergency = (transcript: string) => {
  const t = transcript.toLowerCase()
  return EMERGENCY_WORDS.some((w) => t.includes(w))
}

type Out = { intent: string; answer: string; source_ids: string[]; high_risk: boolean }

/** Ask-mode guard: only a grounded answer (at least one real passage id) is spoken; otherwise refuse. */
export function guardAnswer(out: Out, lang: Lang): { text: string; refused: boolean } {
  const grounded = out.source_ids.some((id) => KB_IDS.has(id)) && out.answer.trim() !== ''
  if (out.intent !== 'question' || !grounded) return { text: LINES[lang].refusal, refused: true }
  return { text: out.high_risk ? `${out.answer} ${LINES[lang].confirm}` : out.answer, refused: false }
}
