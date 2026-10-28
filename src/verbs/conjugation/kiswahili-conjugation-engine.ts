/**
 * Kiswahili conjugation engine (rule-based, Bantu-style markers).
 */

import { PERSON_MAPPING, TENSE_MAPPING, type Person, type Tense } from "./conjugation-paradigm.js";

/** Subjunctive / irregular stems keyed by infinitive */
const SUBJUNCTIVE_STEM: Record<string, string> = {
  kwenda: 'ende',
  kula: 'le',
  kuwa: 'we',
  kusema: 'seme',
  kufanya: 'fanye',
  kuja: 'je',
  kuchukua: 'chukue',
}

const HABITUAL_THIRD_ONLY = true

export class KiswahiliConjugationEngine {
  normalizeLemma(raw: string): string {
    return raw.trim().toLowerCase()
  }

  /** Strip ku-/kw- prefix to obtain the verb stem (typically ending in -a). */
  infinitiveStem(infinitive: string): string {
    const v = this.normalizeLemma(infinitive)
    if (v.startsWith('kw')) return v.slice(2)
    if (v.startsWith('ku')) return v.slice(2)
    return v
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

    const mappedTense = TENSE_MAPPING[tense].kiswahili
    const pronoun = PERSON_MAPPING[person].kiswahili

    if (mappedTense === 'imperative') {
      const form = this.conjugateImperative(infinitive, person, negative)
      if (!form) return ''
      if (interrogative) return `${form}?`
      return form
    }

    if (mappedTense === 'gerund') {
      const form = this.conjugateGerund(infinitive, person, negative)
      if (interrogative) return `${form}?`
      return form
    }

    const form = negative
      ? this.conjugateNegative(infinitive, mappedTense, person)
      : this.conjugateAffirmative(infinitive, mappedTense, person)

    if (interrogative) return `${pronoun} ${form}?`
    return `${pronoun} ${form}`
  }

  private conjugateAffirmative(
    infinitive: string,
    mappedTense: string,
    person: Person
  ): string {
    const baseVerb = this.infinitiveStem(infinitive)

    const personPrefixes: Record<Person, string> = {
      '1sg': 'ni',
      '2sg': 'u',
      '3sg': 'a',
      '1pl': 'tu',
      '2pl': 'm',
      '3pl': 'wa',
    }

    const tenseMarkers: Record<string, string> = {
      present: 'na',
      present_habitual: 'hu',
      present_continuous: 'na',
      past: 'li',
      past_continuous: 'li',
      future: 'ta',
      conditional: 'nge',
      subjunctive: '',
    }

    if (mappedTense === 'present_habitual' && HABITUAL_THIRD_ONLY && person === '3sg') {
      return `hu${baseVerb}`
    }

    if (mappedTense === 'present_continuous') {
      const prefix = personPrefixes[person]
      return `${prefix}na ${infinitive}`
    }

    if (mappedTense === 'subjunctive') {
      const prefix = personPrefixes[person]
      const subStem = SUBJUNCTIVE_STEM[infinitive] ?? this.toSubjunctiveStem(baseVerb)
      return `${prefix}${subStem}`
    }

    if (mappedTense === 'conditional') {
      if (person === '1sg') return `ninge${baseVerb}`
      if (person === '2sg') return `unge${baseVerb}`
      if (person === '3sg') return `ange${baseVerb}`
      if (person === '1pl') return `tunge${baseVerb}`
      if (person === '2pl') return `mngewe${baseVerb}`
      return `wange${baseVerb}`
    }

    const personPrefix = personPrefixes[person]
    const tenseMarker = tenseMarkers[mappedTense] ?? ''
    return `${personPrefix}${tenseMarker}${baseVerb}`
  }

  private conjugateNegative(
    infinitive: string,
    mappedTense: string,
    person: Person
  ): string {
    const baseVerb = this.infinitiveStem(infinitive)

    const negativePrefixes: Record<Person, string> = {
      '1sg': 'si',
      '2sg': 'hu',
      '3sg': 'ha',
      '1pl': 'hatu',
      '2pl': 'ham',
      '3pl': 'hawa',
    }

    const negPrefix = negativePrefixes[person]

    if (mappedTense === 'imperative') {
      return this.conjugateImperative(infinitive, person, true)
    }

    if (mappedTense === 'present' || mappedTense === 'present_continuous') {
      const verbWithoutA = baseVerb.endsWith('a') ? baseVerb.slice(0, -1) : baseVerb
      return `${negPrefix}${verbWithoutA}i`
    }

    if (mappedTense === 'past' || mappedTense === 'past_continuous') {
      return `${negPrefix}ku${baseVerb}`
    }

    if (mappedTense === 'future') {
      return `${negPrefix}ta${baseVerb}`
    }

    if (mappedTense === 'conditional') {
      if (person === '1sg') return `singewe${baseVerb}`
      if (person === '2sg') return `hungewe${baseVerb}`
      if (person === '3sg') return `hangewe${baseVerb}`
      if (person === '1pl') return `hatingewe${baseVerb}`
      if (person === '2pl') return `hamngewe${baseVerb}`
      return `hawange${baseVerb}`
    }

    if (mappedTense === 'subjunctive') {
      const verbWithoutA = baseVerb.endsWith('a') ? baseVerb.slice(0, -1) : baseVerb
      return `${negPrefix}${verbWithoutA}i`
    }

    return `${negPrefix}${baseVerb}`
  }

  private toSubjunctiveStem(stem: string): string {
    if (stem.endsWith('a')) return stem.slice(0, -1) + 'e'
    return stem + 'e'
  }

  private conjugateImperative(
    infinitive: string,
    person: Person,
    negative: boolean
  ): string {
    const baseVerb = this.infinitiveStem(infinitive)
    const stemWithoutA = baseVerb.endsWith('a') ? baseVerb.slice(0, -1) : baseVerb

    if (negative) {
      switch (person) {
        case '2sg':
          return `us${stemWithoutA}e`
        case '2pl':
          return `ms${stemWithoutA}e`
        case '1pl':
          return `tusi${stemWithoutA}e`
        default:
          return ''
      }
    }

    switch (person) {
      case '2sg':
        return baseVerb
      case '2pl':
        return `${stemWithoutA}eni`
      case '1pl':
        return `${stemWithoutA}eni`
      default:
        return ''
    }
  }

  private conjugateGerund(infinitive: string, person: Person, negative: boolean): string {
    const pronoun = PERSON_MAPPING[person].kiswahili
    if (negative) return `${pronoun} bila ${infinitive}`
    return `${pronoun} ${infinitive}`
  }
}

export const kiswahiliConjugationEngine = new KiswahiliConjugationEngine()
