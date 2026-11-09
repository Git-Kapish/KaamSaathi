import { expect, test } from 'vitest'
import { guardAnswer, isEmergency, LINES } from './guardrails'

const base = { intent: 'question', answer: 'हेलमेट पहनिए।', source_ids: ['P1'], high_risk: false }

test('grounded answer passes through', () => {
  expect(guardAnswer(base, 'hi-IN')).toEqual({ text: 'हेलमेट पहनिए।', refused: false })
})

test('no passage id, invented id, empty answer or wrong intent all refuse', () => {
  for (const bad of [{ source_ids: [] }, { source_ids: ['P99'] }, { answer: '  ' }, { intent: 'unknown' }]) {
    expect(guardAnswer({ ...base, ...bad }, 'hi-IN')).toEqual({ text: LINES['hi-IN'].refusal, refused: true })
  }
})

test('high-risk answer gets the supervisor-confirm line', () => {
  const r = guardAnswer({ ...base, high_risk: true }, 'ta-IN')
  expect(r.text.endsWith(LINES['ta-IN'].confirm)).toBe(true)
})

test('emergency words in Hindi, Tamil and Latin script are caught', () => {
  expect(['मुझे बचाओ', 'Fire in block B', 'விபத்து நடந்தது'].every(isEmergency)).toBe(true)
  expect(isEmergency('helmet kahan hai')).toBe(false)
})
