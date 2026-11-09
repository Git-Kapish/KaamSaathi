// Trade terms: fed to Prisma as `keyterms` (speech bias) and to the translation prompt.
// Starter list; the supervisor/admin should extend it with the site's real vocabulary.
export const GLOSSARY: { en: string; hi: string; ta: string }[] = [
  { en: 'helmet', hi: 'हेलमेट', ta: 'தலைக்கவசம்' },
  { en: 'harness', hi: 'हार्नेस', ta: 'ஹார்னஸ்' },
  { en: 'scaffolding', hi: 'मचान', ta: 'சாரம்' },
  { en: 'grinder', hi: 'ग्राइंडर', ta: 'கிரைண்டர்' },
  { en: 'crane', hi: 'क्रेन', ta: 'கிரேன்' },
  { en: 'supervisor', hi: 'सुपरवाइज़र', ta: 'மேற்பார்வையாளர்' },
]

export const keyterms = (lang: 'hi-IN' | 'ta-IN') => GLOSSARY.map((g) => (lang === 'hi-IN' ? g.hi : g.ta))
