/**
 * French conjugation engine using `french-verbs` + `french-verbs-lefff`.
 */

import { PERSON_MAPPING, TENSE_MAPPING, type Person, type Tense } from "./conjugation-paradigm.js";

type FrenchVerbsModule = {
  getConjugation: (
    verbsList: unknown,
    verb: string,
    tense: string,
    person: number,
    composedTenseOptions?: { aux?: 'AVOIR' | 'ETRE'; agreeGender?: 'M' | 'F'; agreeNumber?: 'S' | 'P' },
    pronominal?: boolean,
    negativeAdverb?: string,
    modifierAdverb?: string,
    voice?: 'Act' | 'Pass'
  ) => string
  getAux: (verb: string, aux?: 'AVOIR' | 'ETRE', pronominal?: boolean) => 'AVOIR' | 'ETRE'
  isComposedTense: (tense: string) => boolean
}

const PERSON_INDEX: Record<Person, number> = {
  '1sg': 0,
  '2sg': 1,
  '3sg': 2,
  '1pl': 3,
  '2pl': 4,
  '3pl': 5,
}

/** Imperatif: tu=1, nous=3, vous=4 */
const IMPERATIVE_PERSON_INDEX: Partial<Record<Person, number>> = {
  '2sg': 1,
  '1pl': 3,
  '2pl': 4,
}

type ParadigmFrenchKey = (typeof TENSE_MAPPING)[Tense]['french']

const FRENCH_VERB_TENSE: Partial<Record<ParadigmFrenchKey, string>> = {
  present: 'PRESENT',
  passe_compose: 'PASSE_COMPOSE',
  imparfait: 'IMPARFAIT',
  plus_que_parfait: 'PLUS_QUE_PARFAIT',
  passe_simple: 'PASSE_SIMPLE',
  futur_simple: 'FUTUR',
  conditionnel: 'CONDITIONNEL_PRESENT',
  subjonctif: 'SUBJONCTIF_PRESENT',
  imperatif: 'IMPERATIF_PRESENT',
}

let frenchVerbsModule: FrenchVerbsModule | null = null
let lefffDictionary: unknown | null = null

function loadFrenchVerbs(): FrenchVerbsModule | null {
  if (frenchVerbsModule) return frenchVerbsModule
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    frenchVerbsModule = require('french-verbs') as FrenchVerbsModule
    return frenchVerbsModule
  } catch {
    return null
  }
}

function loadLefff(): unknown | null {
  if (lefffDictionary) return lefffDictionary
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    lefffDictionary = require('french-verbs-lefff/dist/conjugations.json')
    return lefffDictionary
  } catch {
    return null
  }
}

function normalizeInfinitive(raw: string): string {
  let v = raw.trim().toLowerCase()
  if (v.startsWith('se ')) return v
  if (v.startsWith("s'")) return `se ${v.slice(2)}`
  return v
}

function isPronominal(infinitive: string): boolean {
  return infinitive.startsWith('se ') || infinitive.includes("s'")
}

export class FrenchConjugationEngine {
  normalizeLemma(raw: string): string {
    return normalizeInfinitive(raw)
  }

  conjugate(
    lemma: string,
    tense: Tense,
    person: Person,
    negative: boolean = false,
    interrogative: boolean = false
  ): string {
    const infinitive = this.normalizeLemma(lemma)
    if (!infinitive) return ''

    const mappedKey = TENSE_MAPPING[tense].french

    if (mappedKey === 'futur_proche') {
      return this.conjugateFuturProche(infinitive, person, negative, interrogative)
    }

    if (mappedKey === 'gerondif') {
      return this.conjugateGerondif(infinitive, person, negative, interrogative)
    }

    if (mappedKey === 'imperatif') {
      return this.conjugateImperative(infinitive, person, negative, interrogative)
    }

    const fv = loadFrenchVerbs()
    const lefff = loadLefff()
    if (!fv || !lefff) {
      return this.fallback(infinitive, person, negative, interrogative)
    }

    const frenchTense = FRENCH_VERB_TENSE[mappedKey]
    if (!frenchTense) {
      return this.fallback(infinitive, person, negative, interrogative)
    }

    const personIndex = PERSON_INDEX[person]
    const pronominal = isPronominal(infinitive)
    const negativeAdverb = negative ? 'pas' : undefined

    const composedOpts: { aux?: 'AVOIR' | 'ETRE' } = {}
    if (fv.isComposedTense(frenchTense)) {
      composedOpts.aux = fv.getAux(infinitive, undefined, pronominal)
    }

    try {
      const conjugated = fv.getConjugation(
        lefff,
        infinitive,
        frenchTense,
        personIndex,
        composedOpts,
        pronominal,
        negativeAdverb,
        undefined,
        'Act'
      )

      const pronoun = PERSON_MAPPING[person].french
      if (interrogative) {
        return `${pronoun} ${conjugated} ?`
      }
      return `${pronoun} ${conjugated}`
    } catch {
      return this.fallback(infinitive, person, negative, interrogative)
    }
  }

  private conjugateFuturProche(
    infinitive: string,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const fv = loadFrenchVerbs()
    const lefff = loadLefff()
    const pronoun = PERSON_MAPPING[person].french
    const personIndex = PERSON_INDEX[person]

    if (!fv || !lefff) {
      return `${pronoun} vais ${infinitive}`
    }

    try {
      const allerForm = fv.getConjugation(
        lefff,
        'aller',
        'PRESENT',
        personIndex,
        {},
        false,
        negative ? 'pas' : undefined,
        undefined,
        'Act'
      )
      const phrase = negative ? `${allerForm} ${infinitive}` : `${allerForm} ${infinitive}`
      if (interrogative) return `${pronoun} ${phrase} ?`
      return `${pronoun} ${phrase}`
    } catch {
      return `${pronoun} vais ${infinitive}`
    }
  }

  private conjugateGerondif(
    infinitive: string,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const fv = loadFrenchVerbs()
    const lefff = loadLefff()
    const pronoun = PERSON_MAPPING[person].french

    if (!fv || !lefff) {
      const stem = infinitive.replace(/^(se\s+)?/, '')
      return `${pronoun} en ${stem}ant`
    }

    try {
      const participle = fv.getConjugation(
        lefff,
        infinitive,
        'PARTICIPE_PRESENT',
        0,
        {},
        isPronominal(infinitive),
        undefined,
        undefined,
        'Act'
      )
      const phrase = negative ? `ne pas en ${participle}` : `en ${participle}`
      if (interrogative) return `${pronoun} ${phrase} ?`
      return `${pronoun} ${phrase}`
    } catch {
      return `${pronoun} en ${infinitive}`
    }
  }

  private conjugateImperative(
    infinitive: string,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const imperativeIndex = IMPERATIVE_PERSON_INDEX[person]
    if (imperativeIndex === undefined) return ''

    const fv = loadFrenchVerbs()
    const lefff = loadLefff()
    if (!fv || !lefff) {
      return negative ? `ne ${infinitive} pas` : infinitive
    }

    try {
      const form = fv.getConjugation(
        lefff,
        infinitive,
        'IMPERATIF_PRESENT',
        imperativeIndex,
        {},
        isPronominal(infinitive),
        negative ? 'pas' : undefined,
        undefined,
        'Act'
      )
      if (interrogative) return `${form} ?`
      return form
    } catch {
      return negative ? `ne ${infinitive} pas` : infinitive
    }
  }

  /** Last resort — infinitive with pronoun (never a mangled stem). */
  private fallback(
    infinitive: string,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const pronoun = PERSON_MAPPING[person].french
    let phrase = infinitive
    if (negative) phrase = `ne ${phrase} pas`
    if (interrogative) return `${pronoun} ${phrase} ?`
    return `${pronoun} ${phrase}`
  }
}

export const frenchConjugationEngine = new FrenchConjugationEngine()
