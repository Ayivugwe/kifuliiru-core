/**
 * English conjugation engine (rule-based).
 */

import { PERSON_MAPPING, TENSE_MAPPING, type Person, type Tense } from "./conjugation-paradigm.js";

const PRESENT_THIRD_IRREGULAR: Record<string, string> = {
  be: 'is',
  have: 'has',
  do: 'does',
  go: 'goes',
  say: 'says',
}

export class EnglishConjugationEngine {
  normalizeLemma(raw: string): string {
    return raw.trim().replace(/^to\s+/i, '').trim().toLowerCase()
  }

  conjugate(
    lemma: string,
    tense: Tense,
    person: Person,
    negative: boolean = false,
    interrogative: boolean = false
  ): string {
    const verb = this.normalizeLemma(lemma)
    if (!verb) return ''

    if (verb === 'be') {
      return this.conjugateBe(tense, person, negative, interrogative)
    }

    const mappedTense = TENSE_MAPPING[tense].english

    switch (mappedTense) {
      case 'present':
        return this.conjugatePresent(verb, person, negative, interrogative)
      case 'present_continuous':
        return this.conjugatePresentContinuous(verb, person, negative, interrogative)
      case 'past':
        return this.conjugatePast(verb, person, negative, interrogative)
      case 'past_perfect':
        return this.conjugatePastPerfect(verb, person, negative, interrogative)
      case 'past_continuous':
        return this.conjugatePastContinuous(verb, person, negative, interrogative)
      case 'future':
        return this.conjugateFuture(verb, person, negative, interrogative)
      case 'conditional':
        return this.conjugateConditional(verb, person, negative, interrogative)
      case 'subjunctive':
        return this.conjugateSubjunctive(verb, person, negative, interrogative)
      case 'imperative':
        return this.conjugateImperative(verb, person, negative, interrogative)
      case 'gerund':
        return this.conjugateGerundPhrase(verb, person)
      default:
        return `${PERSON_MAPPING[person].english} ${verb}`
    }
  }

  private conjugateBe(
    tense: Tense,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const mappedTense = TENSE_MAPPING[tense].english
    const pronoun = PERSON_MAPPING[person].english

    if (mappedTense === 'imperative') {
      return this.conjugateImperative('be', person, negative, interrogative)
    }

    if (mappedTense === 'gerund') {
      return `${pronoun} being`
    }

    const presentForms: Record<Person, string> = {
      '1sg': 'am',
      '2sg': 'are',
      '3sg': 'is',
      '1pl': 'are',
      '2pl': 'are',
      '3pl': 'are',
    }

    const pastForms: Record<Person, string> = {
      '1sg': 'was',
      '2sg': 'were',
      '3sg': 'was',
      '1pl': 'were',
      '2pl': 'were',
      '3pl': 'were',
    }

    if (mappedTense === 'present' || mappedTense === 'subjunctive') {
      const form = presentForms[person]
      if (interrogative) {
        const aux = person === '1sg' ? 'Am' : person === '3sg' ? 'Is' : 'Are'
        const qPronoun = person === '1sg' ? 'I' : pronoun
        if (negative) return `${aux} ${qPronoun} not?`
        return `${aux} ${qPronoun}?`
      }
      if (negative) {
        const neg =
          person === '1sg' ? 'am not' : person === '3sg' ? "isn't" : "aren't"
        return `${pronoun} ${neg}`
      }
      return `${pronoun} ${form}`
    }

    if (mappedTense === 'past') {
      const form = pastForms[person]
      if (interrogative) {
        const aux = person === '1sg' || person === '3sg' ? 'Was' : 'Were'
        if (negative) return `${aux} ${pronoun} not?`
        return `${aux} ${pronoun}?`
      }
      if (negative) {
        const neg = person === '1sg' || person === '3sg' ? "wasn't" : "weren't"
        return `${pronoun} ${neg}`
      }
      return `${pronoun} ${form}`
    }

    if (mappedTense === 'present_continuous' || mappedTense === 'past_continuous') {
      const aux =
        mappedTense === 'present_continuous'
          ? person === '1sg'
            ? 'am'
            : person === '3sg'
              ? 'is'
              : 'are'
          : person === '1sg' || person === '3sg'
            ? 'was'
            : 'were'
      if (interrogative) return `${pronoun} ${aux} being?`
      if (negative) return `${pronoun} ${aux} not being`
      return `${pronoun} ${aux} being`
    }

    if (mappedTense === 'past_perfect') {
      if (interrogative) return `${pronoun} had been?`
      if (negative) return `${pronoun} hadn't been`
      return `${pronoun} had been`
    }

    if (mappedTense === 'future') {
      if (interrogative) return `${pronoun} will be?`
      if (negative) return `${pronoun} won't be`
      return `${pronoun} will be`
    }

    if (mappedTense === 'conditional') {
      if (interrogative) return `${pronoun} would be?`
      if (negative) return `${pronoun} wouldn't be`
      return `${pronoun} would be`
    }

    return `${pronoun} ${presentForms[person]}`
  }

  private conjugatePresent(
    verb: string,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const pronoun = PERSON_MAPPING[person].english
    const conjugatedVerb =
      person === '3sg' ? this.getThirdPersonSingular(verb) : verb

    if (interrogative) {
      if (person === '3sg') return `${pronoun} does ${verb}?`
      return `${pronoun} do ${verb}?`
    }

    if (negative) {
      const aux = person === '3sg' ? "doesn't" : "don't"
      return `${pronoun} ${aux} ${verb}`
    }

    return `${pronoun} ${conjugatedVerb}`
  }

  private conjugatePresentContinuous(
    verb: string,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const pronoun = PERSON_MAPPING[person].english
    const aux = person === '3sg' ? 'is' : person === '1sg' ? 'am' : 'are'
    const gerund = this.toGerund(verb)
    if (interrogative) return `${pronoun} ${aux} ${gerund}?`
    if (negative) return `${pronoun} ${aux} not ${gerund}`
    return `${pronoun} ${aux} ${gerund}`
  }

  private conjugatePast(
    verb: string,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const pronoun = PERSON_MAPPING[person].english
    const pastForm = this.getPastForm(verb)
    if (interrogative) return `${pronoun} did ${verb}?`
    if (negative) return `${pronoun} didn't ${verb}`
    return `${pronoun} ${pastForm}`
  }

  private conjugatePastPerfect(
    verb: string,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const pronoun = PERSON_MAPPING[person].english
    const pastParticiple = this.getPastParticiple(verb)
    if (interrogative) return `${pronoun} had ${pastParticiple}?`
    if (negative) return `${pronoun} hadn't ${pastParticiple}`
    return `${pronoun} had ${pastParticiple}`
  }

  private conjugatePastContinuous(
    verb: string,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const pronoun = PERSON_MAPPING[person].english
    const aux = person === '1sg' || person === '3sg' ? 'was' : 'were'
    const gerund = this.toGerund(verb)
    if (interrogative) return `${pronoun} ${aux} ${gerund}?`
    if (negative) return `${pronoun} ${aux} not ${gerund}`
    return `${pronoun} ${aux} ${gerund}`
  }

  private conjugateFuture(
    verb: string,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const pronoun = PERSON_MAPPING[person].english
    if (interrogative) return `${pronoun} will ${verb}?`
    if (negative) return `${pronoun} won't ${verb}`
    return `${pronoun} will ${verb}`
  }

  private conjugateConditional(
    verb: string,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const pronoun = PERSON_MAPPING[person].english
    if (interrogative) return `${pronoun} would ${verb}?`
    if (negative) return `${pronoun} wouldn't ${verb}`
    return `${pronoun} would ${verb}`
  }

  private conjugateSubjunctive(
    verb: string,
    person: Person,
    negative: boolean,
    interrogative: boolean
  ): string {
    const pronoun = PERSON_MAPPING[person].english
    if (interrogative) return `${pronoun} ${verb}?`
    if (negative) return `${pronoun} not ${verb}`
    return `${pronoun} ${verb}`
  }

  private conjugateImperative(
    verb: string,
    person: Person,
    negative: boolean,
    _interrogative: boolean
  ): string {
    if (negative) {
      if (person === '1pl') return `let's not ${verb}`
      if (person === '2sg' || person === '2pl') return `don't ${verb}`
      return ''
    }

    switch (person) {
      case '2sg':
        return verb
      case '2pl':
        return verb
      case '1pl':
        return `let's ${verb}`
      default:
        return ''
    }
  }

  private conjugateGerundPhrase(verb: string, person: Person): string {
    const pronoun = PERSON_MAPPING[person].english
    return `${pronoun} ${this.toGerund(verb)}`
  }

  private toGerund(verb: string): string {
    if (verb.endsWith('ie')) return verb.slice(0, -2) + 'ying'
    if (verb.endsWith('e') && verb.length > 2 && !verb.endsWith('ee')) {
      return verb.slice(0, -1) + 'ing'
    }
    const lastChar = verb[verb.length - 1]
    const penult = verb[verb.length - 2]
    if (
      verb.length >= 2 &&
      !['a', 'e', 'i', 'o', 'u'].includes(penult) &&
      ['b', 'd', 'g', 'm', 'n', 'p', 'r', 't'].includes(lastChar) &&
      verb.length <= 5
    ) {
      return verb + lastChar + 'ing'
    }
    return verb + 'ing'
  }

  private getThirdPersonSingular(verb: string): string {
    if (PRESENT_THIRD_IRREGULAR[verb]) return PRESENT_THIRD_IRREGULAR[verb]
    if (verb.endsWith('o') || verb.endsWith('s') || verb.endsWith('x') || verb.endsWith('z')) {
      return verb + 'es'
    }
    if (verb.endsWith('sh') || verb.endsWith('ch')) {
      return verb + 'es'
    }
    if (verb.endsWith('y') && verb.length > 1 && !'aeiou'.includes(verb[verb.length - 2])) {
      return verb.slice(0, -1) + 'ies'
    }
    return verb + 's'
  }

  private getPastForm(verb: string): string {
    const irregulars: Record<string, string> = {
      be: 'was',
      go: 'went',
      eat: 'ate',
      come: 'came',
      see: 'saw',
      do: 'did',
      have: 'had',
      make: 'made',
      take: 'took',
      get: 'got',
      say: 'said',
      know: 'knew',
      think: 'thought',
      give: 'gave',
      find: 'found',
    }

    if (irregulars[verb]) return irregulars[verb]

    if (verb.endsWith('e')) return verb + 'd'
    if (verb.endsWith('y') && verb.length > 1 && !'aeiou'.includes(verb[verb.length - 2])) {
      return verb.slice(0, -1) + 'ied'
    }
    const lastChar = verb[verb.length - 1]
    if (
      verb.length >= 2 &&
      !['a', 'e', 'i', 'o', 'u'].includes(verb[verb.length - 2]) &&
      ['b', 'd', 'g', 'm', 'n', 'p', 'r', 't'].includes(lastChar) &&
      verb.length <= 5
    ) {
      return verb + lastChar + 'ed'
    }
    return verb + 'ed'
  }

  private getPastParticiple(verb: string): string {
    const irregulars: Record<string, string> = {
      be: 'been',
      go: 'gone',
      eat: 'eaten',
      come: 'come',
      see: 'seen',
      do: 'done',
      have: 'had',
      make: 'made',
      take: 'taken',
      get: 'gotten',
      say: 'said',
      know: 'known',
      think: 'thought',
      give: 'given',
      find: 'found',
    }

    if (irregulars[verb]) return irregulars[verb]

    if (verb.endsWith('e')) return verb + 'd'
    if (verb.endsWith('y') && verb.length > 1 && !'aeiou'.includes(verb[verb.length - 2])) {
      return verb.slice(0, -1) + 'ied'
    }
    const lastChar = verb[verb.length - 1]
    if (
      verb.length >= 2 &&
      !['a', 'e', 'i', 'o', 'u'].includes(verb[verb.length - 2]) &&
      ['b', 'd', 'g', 'm', 'n', 'p', 'r', 't'].includes(lastChar) &&
      verb.length <= 5
    ) {
      return verb + lastChar + 'ed'
    }
    return verb + 'ed'
  }
}

export const englishConjugationEngine = new EnglishConjugationEngine()
