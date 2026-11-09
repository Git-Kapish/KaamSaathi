// SAMPLE construction-site safety knowledge base for the prototype.
// Generic wording only: a qualified safety officer must review and replace it with the employer's real manual before any pilot.
export type Passage = { id: string; text: string }

export const PASSAGES: Passage[] = [
  { id: 'P1', text: 'Helmet: wear a safety helmet at all times on site. Fasten the chin strap. If the helmet is cracked or has been hit hard, ask the supervisor for a new one.' },
  { id: 'P2', text: 'Other protective gear: wear safety shoes with a hard toe cap on site. Wear gloves when handling sharp or rough material. Wear goggles when cutting, grinding or drilling.' },
  { id: 'P3', text: 'Working at height (high risk): wear a full-body harness. Clip the lanyard to the marked anchor point. Check straps and buckles before every use. Do not start until the supervisor has checked your harness and anchor point.' },
  { id: 'P4', text: 'Ladders (high risk): place the ladder on firm, level ground. Keep three points of contact: two hands and one foot, or two feet and one hand. Do not carry heavy loads while climbing. Ask the supervisor before using a ladder for a new task.' },
  { id: 'P5', text: 'Electricity (high risk): never touch hanging wires or open panels. Only authorised electricians may work on electrical equipment. Keep water away from electrical tools. If a cable is damaged, switch off if it is safe to do so, keep away, and tell the supervisor.' },
  { id: 'P6', text: 'Cutting and grinding machine (high risk): wear goggles and gloves. Check that the guard is in place and never remove it. Unplug the machine before changing the disc. Keep other people away from the sparks.' },
  { id: 'P7', text: 'Heavy machines (high risk): stay out of the swing area of cranes and excavators. Never walk behind a reversing vehicle. Wait for the signal person before crossing a machine path.' },
  { id: 'P8', text: 'Exits and fire or alarm: green signs show the exits. When the alarm sounds, leave your tools, go to the assembly point shown on the site map at the gate, and wait for the supervisor to count everyone.' },
  { id: 'P9', text: 'Injury: tell the supervisor straight away, even for a small injury. The first aid box is in the site office. Do not hide an injury.' },
  { id: 'P10', text: 'Daily routine: attend the safety talk at the start of every shift. Tell the supervisor about anything unsafe you see.' },
  { id: 'P11', text: 'Contacts: for any emergency call one one two. The site supervisor can be reached from the site office.' },
]

export const KB_IDS = new Set(PASSAGES.map((p) => p.id))
export const kbText = () => PASSAGES.map((p) => `[${p.id}] ${p.text}`).join('\n')
