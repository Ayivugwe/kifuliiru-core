/**
 * Shared paradigm slots (tense × person) used so English, French, Kiswahili, and Kifuliiru
 * conjugation engines can refer to the same grid cell when building parallel tables.
 */

export type Tense =
  | 'present'
  | 'present_habitual'
  | 'present_continuous'
  | 'past'
  | 'past_continuous'
  | 'future'
  | 'futur_proche'
  | 'passe_p1'
  | 'passe_p2'
  | 'passe_p3'
  | 'conditional'
  | 'subjunctive'
  | 'imperative'
  | 'gerondif'

export type Person = '1sg' | '2sg' | '3sg' | '1pl' | '2pl' | '3pl'

/** Map each paradigm tense to the category each language engine uses for that slot */
export const TENSE_MAPPING = {
  present: {
    english: 'present',
    french: 'present',
    kiswahili: 'present',
  },
  present_habitual: {
    english: 'present',
    french: 'present',
    kiswahili: 'present_habitual',
  },
  present_continuous: {
    english: 'present_continuous',
    french: 'present',
    kiswahili: 'present_continuous',
  },
  past: {
    english: 'past',
    french: 'passe_compose',
    kiswahili: 'past',
  },
  past_continuous: {
    english: 'past_continuous',
    french: 'imparfait',
    kiswahili: 'past_continuous',
  },
  future: {
    english: 'future',
    french: 'futur_simple',
    kiswahili: 'future',
  },
  futur_proche: {
    english: 'future',
    french: 'futur_proche',
    kiswahili: 'future',
  },
  passe_p1: {
    english: 'past',
    french: 'passe_compose',
    kiswahili: 'past',
  },
  passe_p2: {
    english: 'past_perfect',
    french: 'plus_que_parfait',
    kiswahili: 'past',
  },
  passe_p3: {
    english: 'past',
    french: 'passe_simple',
    kiswahili: 'past',
  },
  conditional: {
    english: 'conditional',
    french: 'conditionnel',
    kiswahili: 'conditional',
  },
  subjunctive: {
    english: 'subjunctive',
    french: 'subjonctif',
    kiswahili: 'subjunctive',
  },
  imperative: {
    english: 'imperative',
    french: 'imperatif',
    kiswahili: 'imperative',
  },
  gerondif: {
    english: 'gerund',
    french: 'gerondif',
    kiswahili: 'gerund',
  },
} as const

export const PERSON_MAPPING = {
  '1sg': { english: 'I', french: 'je', kiswahili: 'mimi' },
  '2sg': { english: 'you', french: 'tu', kiswahili: 'wewe' },
  '3sg': { english: 'he/she', french: 'il/elle', kiswahili: 'yeye' },
  '1pl': { english: 'we', french: 'nous', kiswahili: 'sisi' },
  '2pl': { english: 'you all', french: 'vous', kiswahili: 'ninyi' },
  '3pl': { english: 'they', french: 'ils/elles', kiswahili: 'wao' },
} as const
