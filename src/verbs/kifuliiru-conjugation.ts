/**
 * Kifuliiru verb conjugation engine (primary).
 * English, French, and Kiswahili use separate modules under `./conjugation/` plus shared paradigm types:
 * `conjugation-paradigm.ts`, `english-conjugation-engine.ts`, `french-conjugation-engine.ts`, `kiswahili-conjugation-engine.ts`.
 *
 * Import all engines and `Tense` / `Person` from `@/lib/core/conjugation` (this file re-exports them).
 */

import type { VerbData } from "../types/index.js";
import type { Person, Tense } from "./conjugation/conjugation-paradigm.js";
import { englishConjugationEngine } from "./conjugation/english-conjugation-engine.js";
import { frenchConjugationEngine } from "./conjugation/french-conjugation-engine.js";
import { kiswahiliConjugationEngine } from "./conjugation/kiswahili-conjugation-engine.js";

export interface ConjugationResult {
  tense: string
  person: string
  kifuliiru: string
  english: string
  kiswahili: string
  francais: string
  pattern: string
  irregular: boolean
}

export interface ConjugationTable {
  verb: string
  english: string
  root: string
  conjugations: {
    [person: string]: ConjugationResult
  }
}

export class KifuliiruConjugationEngine {
  private personalPronouns = {
    '1sg': { kifuliiru: 'Nyehe', english: 'I', prefix: 'Na' },
    '2sg': { kifuliiru: 'Wehe', english: 'You', prefix: 'Wa' },
    '3sg': { kifuliiru: 'Yehe', english: 'He/She', prefix: 'A' },
    '1pl': { kifuliiru: 'Twehe', english: 'We', prefix: 'Twa' },
    '2pl': { kifuliiru: 'Mwehe', english: 'You all', prefix: 'Mwa' },
    '3pl': { kifuliiru: 'Bohe', english: 'They', prefix: 'Ba' }
  }

  private getSubjectPrefix(person: string, tenseType: string = 'regular'): string {
    const prefixes = {
      regular: {
        '1sg': 'Na', '2sg': 'Wa', '3sg': 'A',
        '1pl': 'Twa', '2pl': 'Mwa', '3pl': 'Ba'
      },
      habitual: {
        '1sg': 'Ni', '2sg': 'U', '3sg': 'A',
        '1pl': 'Tu', '2pl': 'Mu', '3pl': 'Ba'
      }
    }
    return prefixes[tenseType as keyof typeof prefixes][person as keyof typeof prefixes.regular]
  }

  /**
   * Extract root from infinitive verb
   */
  private extractRoot(infinitive: string): string {
    // Remove Uku- prefix if present
    let root = infinitive.toLowerCase()
    if (root.startsWith('uku')) {
      root = root.substring(3)
    }
    
    // Remove final -a to get true root
    if (root.endsWith('a')) {
      root = root.substring(0, root.length - 1)
    }
    
    return root
  }

  /**
   * Apply subjunctive transformation to root
   */
  private applySubjunctive(root: string): string {
    const lastChar = root[root.length - 1]
    
    // If root ends in consonant, add double vowel + e
    if (['d', 'l', 'k', 'j'].includes(lastChar)) {
      return root + 'e'
    }
    
    // For other consonants, add -e
    return root + 'e'
  }

  /**
   * Apply imperative transformation to root
   */
  private applyImperative(root: string): string {
    return root + 'a'
  }

  /**
   * Negate a conjugated form
   * Converts: Na- → Nda-, Wa- → Uta-, A- → Ata-, Twa- → Tuta-, Mwa- → Muta-, Ba- → Bata-
   */
  private negate(affirmative: string, person: string): string {
    // Handle continuous forms first (e.g., "Ngweti ngalya" → "Ndagweti ngalya")
    if (affirmative.includes('gweti') || affirmative.includes('gweeti')) {
      // Continuous tense negative transformation
      const continuousPrefixMap: Record<string, { from: RegExp, to: string }> = {
        '1sg': { from: /^Ngweti/, to: 'Ndagweti' },
        '2sg': { from: /^Ugweti/, to: 'Utagweti' },
        '3sg': { from: /^Agweti/, to: 'Atagweti' },
        '1pl': { from: /^Tugweti/, to: 'Tutagweti' },
        '2pl': { from: /^Mugweti/, to: 'Mutagweti' },
        '3pl': { from: /^Bagweti/, to: 'Batagweti' }
      }
      const mapping = continuousPrefixMap[person]
      if (mapping) {
        return affirmative.replace(mapping.from, mapping.to)
      }
    }

    // Regular tense negative transformation
    const prefixMap: Record<string, { from: RegExp, to: string }> = {
      '1sg': { from: /^Na/, to: 'Nda' },
      '2sg': { from: /^Wa/, to: 'Uta' },
      '3sg': { from: /^A/, to: 'Ata' }, // A- prefix transforms to Ata-
      '1pl': { from: /^Twa/, to: 'Tuta' },
      '2pl': { from: /^Mwa/, to: 'Muta' },
      '3pl': { from: /^Ba/, to: 'Bata' }
    }

    const mapping = prefixMap[person]
    if (mapping) {
      return affirmative.replace(mapping.from, mapping.to)
    }

    // Fallback: return as is if no mapping found
    return affirmative
  }

  /**
   * Make a form interrogative by adding "Ka " prefix and "?" question mark
   * If the form starts with a personal pronoun (Nyehe, Wehe, Yehe, Twehe, Mwehe, Bohe),
   * Ka comes before the pronoun: "Ka nyehe nalya?" not "Nyehe ka nalya?"
   */
  private makeInterrogative(form: string): string {
    if (!form || form.trim() === '') return ''
    
    // List of personal pronouns that can appear at the start of a form
    const personalPronouns = ['Nyehe', 'Wehe', 'Yehe', 'Twehe', 'Mwehe', 'Bohe']
    
    // Check if form starts with a personal pronoun
    const trimmedForm = form.trim()
    for (const pronoun of personalPronouns) {
      if (trimmedForm.startsWith(pronoun + ' ')) {
        // Form starts with pronoun: "Nyehe nalya" -> "Ka nyehe nalya?"
        return `Ka ${trimmedForm}?`
      }
    }
    
    // No pronoun at start, add Ka before the entire form
    return `Ka ${trimmedForm}?`
  }

  /**
   * Conjugate a verb for present tense
   */
  private conjugatePresent(verb: VerbData, person: string, negative: boolean = false, interrogative: boolean = false): ConjugationResult {
    const root = this.extractRoot(verb.verbKifuliiru)
    const prefix = this.getSubjectPrefix(person, 'regular')
    let form = `${prefix}${root}a`
    form = negative ? this.negate(form, person) : form
    form = interrogative ? this.makeInterrogative(form) : form
    
    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    let englishTranslation = interrogative
      ? `${pronoun.english} ${verb.english}?`
      : negative 
      ? `${pronoun.english} don't ${verb.english}`
      : `${pronoun.english} ${verb.english}`

    return {
      tense: 'present',
      person,
      kifuliiru: form,
      english: englishTranslation,
      kiswahili: '',
      francais: '',
      pattern: `${prefix}[root]a`,
      irregular: false
    }
  }

  /**
   * Conjugate a verb for past tense
   */
  private conjugatePast(verb: VerbData, person: string, negative: boolean = false, interrogative: boolean = false): ConjugationResult {
    // Match Python imparfait: prefixes + space + root + a
    const root = this.extractRoot(verb.verbKifuliiru)
    const prefixes: Record<string, string> = {
      '1sg': 'Nalikizi', '2sg': 'Walikizi', '3sg': 'Alikizi',
      '1pl': 'Twalikizi', '2pl': 'Mwalikizi', '3pl': 'Balikizi'
    }
    let form = `${prefixes[person]} ${root}a`
    // For past tense, negative is applied to the prefix part
    if (negative) {
      const negPrefix = this.negate(prefixes[person], person)
      form = `${negPrefix} ${root}a`
    }
    form = interrogative ? this.makeInterrogative(form) : form
    
    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    let englishTranslation = interrogative
      ? `${pronoun.english} used to ${verb.english}?`
      : negative 
      ? `${pronoun.english} was not ${verb.english}ing`
      : `${pronoun.english} used to ${verb.english}`

    return {
      tense: 'past',
      person,
      kifuliiru: form,
      english: englishTranslation,
      kiswahili: '',
      francais: '',
      pattern: `[imparfait_prefix] [root]a`,
      irregular: false
    }
  }

  /**
   * Conjugate a verb for future tense
   */
  private conjugateFuture(verb: VerbData, person: string, negative: boolean = false, interrogative: boolean = false): ConjugationResult {
    // Match Python futur_simple: Nali/Wali/... + subjunctive(root)
    const root = this.extractRoot(verb.verbKifuliiru)
    const prefixes: Record<string, string> = {
      '1sg': 'Nali', '2sg': 'Wali', '3sg': 'Ali',
      '1pl': 'Twali', '2pl': 'Mwali', '3pl': 'Bali'
    }
    const subjRoot = this.applySubjunctive(root)
    let form = `${prefixes[person]}${subjRoot}`
    form = negative ? this.negate(form, person) : form
    form = interrogative ? this.makeInterrogative(form) : form
    
    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    let englishTranslation = interrogative
      ? `${pronoun.english} will ${verb.english}?`
      : negative 
      ? `${pronoun.english} won't ${verb.english}`
      : `${pronoun.english} will ${verb.english}`

    return {
      tense: 'future',
      person,
      kifuliiru: form,
      english: englishTranslation,
      kiswahili: '',
      francais: '',
      pattern: `[future_prefix][subjunctive_root]`,
      irregular: false
    }
  }

  /**
   * Conjugate a verb for present habitual tense
   */
  private conjugatePresentHabitual(verb: VerbData, person: string, negative: boolean = false, interrogative: boolean = false): ConjugationResult {
    const root = this.extractRoot(verb.verbKifuliiru)
    const prefix = this.getSubjectPrefix(person, 'habitual')
    let form = `${prefix}mu${root}a`
    form = negative ? this.negate(form, person) : form
    form = interrogative ? this.makeInterrogative(form) : form
    
    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    let englishTranslation = interrogative
      ? `${pronoun.english} usually ${verb.english}?`
      : negative 
      ? `${pronoun.english} don't usually ${verb.english}`
      : `${pronoun.english} usually ${verb.english}`

    return {
      tense: 'present_habitual',
      person,
      kifuliiru: form,
      english: englishTranslation,
      kiswahili: `${pronoun.english} ${verb.kiswahili}`,
      francais: `${pronoun.english} ${verb.french}`,
      pattern: `${prefix}mu[root]a`,
      irregular: false
    }
  }

  /**
   * Conjugate a verb for present continuous tense
   */
  private conjugatePresentContinuous(verb: VerbData, person: string, negative: boolean = false, interrogative: boolean = false): ConjugationResult {
    const root = this.extractRoot(verb.verbKifuliiru)
    const continuousPrefixes = {
      '1sg': 'Ngweti nga', '2sg': 'Ugweti uga', '3sg': 'Agweti aga',
      '1pl': 'Tugweti tuga', '2pl': 'Mugweti muga', '3pl': 'Bagweti baga'
    }
    
    const prefix = continuousPrefixes[person as keyof typeof continuousPrefixes]
    let form = `${prefix}${root}a`
    form = negative ? this.negate(form, person) : form
    form = interrogative ? this.makeInterrogative(form) : form
    
    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    let englishTranslation = interrogative
      ? `${pronoun.english} am ${verb.english}ing?`
      : negative 
      ? `${pronoun.english} am not ${verb.english}ing`
      : `${pronoun.english} am ${verb.english}ing`

    return {
      tense: 'present_continuous',
      person,
      kifuliiru: form,
      english: englishTranslation,
      kiswahili: `${pronoun.english} ${verb.kiswahili}`,
      francais: `${pronoun.english} ${verb.french}`,
      pattern: `[continuous_prefix] [root]a`,
      irregular: false
    }
  }

  /**
   * Conjugate a verb for past continuous tense
   */
  private conjugatePastContinuous(verb: VerbData, person: string, negative: boolean = false, interrogative: boolean = false): ConjugationResult {
    const root = this.extractRoot(verb.verbKifuliiru)
    const continuousPrefixes = {
      '1sg': 'Njuba mu', '2sg': 'Ushuba mu', '3sg': 'Ashuba mu',
      '1pl': 'Tushuba mu', '2pl': 'Mushuba mu', '3pl': 'Bashuba mu'
    }
    
    const prefix = continuousPrefixes[person as keyof typeof continuousPrefixes]
    let form = `${prefix}${root}a`
    form = negative ? this.negate(form, person) : form
    form = interrogative ? this.makeInterrogative(form) : form
    
    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    let englishTranslation = interrogative
      ? `${pronoun.english} was ${verb.english}ing?`
      : negative 
      ? `${pronoun.english} was not ${verb.english}ing`
      : `${pronoun.english} was ${verb.english}ing`

    return {
      tense: 'past_continuous',
      person,
      kifuliiru: form,
      english: englishTranslation,
      kiswahili: '',
      francais: '',
      pattern: `[continuous_prefix][root]a`,
      irregular: false
    }
  }

  /**
   * Conjugate a verb for subjunctive tense
   */
  private conjugateSubjunctive(verb: VerbData, person: string, negative: boolean = false, interrogative: boolean = false): ConjugationResult {
    const root = this.extractRoot(verb.verbKifuliiru)
    const prefix = this.getSubjectPrefix(person, 'habitual')
    const subjunctiveRoot = this.applySubjunctive(root)
    let form = `${prefix}${subjunctiveRoot}`
    form = negative ? this.negate(form, person) : form
    form = interrogative ? this.makeInterrogative(form) : form
    
    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    let englishTranslation = interrogative
      ? `${pronoun.english} may ${verb.english}?`
      : negative 
      ? `${pronoun.english} may not ${verb.english}`
      : `${pronoun.english} may ${verb.english}`

    return {
      tense: 'subjunctive',
      person,
      kifuliiru: form,
      english: englishTranslation,
      kiswahili: '',
      francais: '',
      pattern: `${prefix}[subjunctive_root]`,
      irregular: false
    }
  }

  /**
   * Conjugate a verb for imperative tense
   * Imperative: no personal pronoun, only root form
   * 2sg: root + "a"
   * 2pl: root + "i"
   * Note: Imperative has no interrogative form
   */
  private conjugateImperative(verb: VerbData, person: string, negative: boolean = false, interrogative: boolean = false): ConjugationResult {
    // Imperative has no interrogative form
    if (interrogative) {
      return {
        tense: 'imperative',
        person,
        kifuliiru: '',
        english: '',
        kiswahili: '',
        francais: '',
        pattern: 'N/A',
        irregular: false
      }
    }

    if (person === '1sg' || person === '3sg' || person === '1pl' || person === '3pl') {
      // Imperative only has 2nd person (2sg and 2pl)
      return {
        tense: 'imperative',
        person,
        kifuliiru: '',
        english: '',
        kiswahili: '',
        francais: '',
        pattern: 'N/A',
        irregular: false
      }
    }

    const root = this.extractRoot(verb.verbKifuliiru)
    
    let form = ''
    
    if (negative) {
      // Negative imperative: prefix + root + "e"
      // 2sg: uta + root + e
      // 2pl: muta + root + e
      if (person === '2sg') {
        form = `uta${root}e`
      } else if (person === '2pl') {
        form = `muta${root}e`
      }
    } else {
      // Affirmative imperative: no prefix, only root + ending
      // 2sg: root + "a"
      // 2pl: root + "i"
      if (person === '2sg') {
        form = `${root}a`
      } else if (person === '2pl') {
        form = `${root}i`
      } else {
        // Should not reach here, but fallback
        form = `${root}a`
      }
      
      // Capitalize first letter for affirmative
      form = form.charAt(0).toUpperCase() + form.slice(1)
    }
    
    // No personal pronoun in imperative - just the verb form
    let englishTranslation = negative 
      ? `Don't ${verb.english}`
      : `${verb.english}!`

    return {
      tense: 'imperative',
      person,
      kifuliiru: form,
      english: englishTranslation,
      kiswahili: '',
      francais: '',
      pattern: negative 
        ? (person === '2sg' ? 'uta[root]e' : 'muta[root]e')
        : (person === '2sg' ? '[root]a' : '[root]i'),
      irregular: false
    }
  }

  /**
   * Conjugate a verb for gérondif (Mu + infinitive)
   */
  private conjugateGerondif(verb: VerbData, person: string, negative: boolean = false, interrogative: boolean = false): ConjugationResult {
    // Avoid repeating the initial 'U-' from the infinitive after 'Mu '
    // Examples: 'Ukuenda' -> 'Mu kuenda'
    const infinitive = verb.verbKifuliiru
    let afterMu = infinitive
    if (/^uku/i.test(infinitive)) {
      // Drop only the initial 'U', keep 'ku...'
      afterMu = infinitive.replace(/^u/i, '')
    } else if (/^u/i.test(infinitive)) {
      // If infinitive starts with single 'U', drop it entirely
      afterMu = infinitive.replace(/^u/i, '')
    }
    let form = `Mu ${afterMu}`
    form = interrogative ? this.makeInterrogative(form) : form

    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    let englishTranslation = interrogative
      ? `${pronoun.english} while ${verb.english}?`
      : `${pronoun.english} while ${verb.english}`

    return {
      tense: 'gerondif',
      person,
      kifuliiru: form,
      english: englishTranslation,
      kiswahili: '',
      francais: '',
      pattern: 'Mu [infinitive without initial U-]',
      irregular: false
    }
  }

  /**
   * Overlay English / French / Kiswahili surfaces using each language's conjugation engine.
   */
  private attachSiblingEngineForms(
    result: ConjugationResult,
    verb: VerbData,
    tense: string,
    person: string,
    negative: boolean,
    interrogative: boolean
  ): ConjugationResult {
    try {
      const t = tense as Tense
      const p = person as Person
      let english = result.english || ''
      let francais = result.francais || ''
      let kiswahili = result.kiswahili || ''

      if (verb.english?.trim()) {
        try {
          english = englishConjugationEngine.conjugate(
            verb.english,
            t,
            p,
            negative,
            interrogative
          )
        } catch (e) {
          console.warn('English conjugation engine failed:', e, {
            verb: verb.english,
            tense,
            person,
          })
        }
      }

      if (verb.french?.trim()) {
        try {
          francais = frenchConjugationEngine.conjugate(
            verb.french,
            t,
            p,
            negative,
            interrogative
          )
        } catch (e) {
          console.warn('French conjugation engine failed:', e, {
            verb: verb.french,
            tense,
            person,
          })
        }
      }

      if (verb.kiswahili?.trim()) {
        try {
          kiswahili = kiswahiliConjugationEngine.conjugate(
            verb.kiswahili,
            t,
            p,
            negative,
            interrogative
          )
        } catch (e) {
          console.warn('Kiswahili conjugation engine failed:', e, {
            verb: verb.kiswahili,
            tense,
            person,
          })
        }
      }

      return {
        ...result,
        english,
        francais,
        kiswahili,
      }
    } catch (error) {
      console.warn('Sibling conjugation engines failed:', error)
      return result
    }
  }

  /**
   * Conjugate a verb for a specific tense and person
   */
  conjugateVerb(verb: VerbData, tense: string, person: string, negative: boolean = false, interrogative: boolean = false): ConjugationResult {
    let result: ConjugationResult
    
    switch (tense) {
      case 'present':
        result = this.conjugatePresent(verb, person, negative, interrogative)
        break
      case 'present_habitual':
        result = this.conjugatePresentHabitual(verb, person, negative, interrogative)
        break
      case 'present_continuous':
        result = this.conjugatePresentContinuous(verb, person, negative, interrogative)
        break
      case 'past':
        result = this.conjugatePast(verb, person, negative, interrogative)
        break
      case 'past_continuous':
        result = this.conjugatePastContinuous(verb, person, negative, interrogative)
        break
      case 'future':
        result = this.conjugateFuture(verb, person, negative, interrogative)
        break
      case 'conditional':
        result = this.conjugateConditional(verb, person, negative, interrogative)
        break
      case 'subjunctive':
        result = this.conjugateSubjunctive(verb, person, negative, interrogative)
        break
      case 'imperative':
        result = this.conjugateImperative(verb, person, negative, interrogative)
        break
      case 'gerondif':
        result = this.conjugateGerondif(verb, person, negative, interrogative)
        break
      case 'futur_proche':
        result = this.conjugateFuturProche(verb, person, negative, interrogative)
        break
      case 'passe_p1':
        result = this.conjugatePasseP1(verb, person, negative, interrogative)
        break
      case 'passe_p2':
        result = this.conjugatePasseP2(verb, person, negative, interrogative)
        break
      case 'passe_p3':
        result = this.conjugatePasseP3(verb, person, negative, interrogative)
        break
      default:
        throw new Error(`Unsupported tense: ${tense}`)
    }
    
    return this.attachSiblingEngineForms(result, verb, tense, person, negative, interrogative)
  }

  private conjugateFuturProche(verb: VerbData, person: string, negative = false, interrogative = false): ConjugationResult {
    const root = this.extractRoot(verb.verbKifuliiru)
    const ga: Record<string, string> = {
      '1sg': 'nga', '2sg': 'uga', '3sg': 'aga',
      '1pl': 'tuga', '2pl': 'muga', '3pl': 'baga'
    }
    let form: string
    if (negative) {
      const negPrefix = person === '1sg' ? 'Nda' : ({ '2sg': 'Uta', '3sg': 'Ata', '1pl': 'Tuta', '2pl': 'Muta', '3pl': 'Bata' } as any)[person]
      form = `${negPrefix}ziba ${ga[person]}${root}a`
    } else {
      form = `Ngola ${ga[person]}${root}a`
    }
    form = interrogative ? this.makeInterrogative(form) : form
    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    let english = interrogative 
      ? `${pronoun.english} is going to ${verb.english}?`
      : negative 
      ? `${pronoun.english} is not going to ${verb.english}` 
      : `${pronoun.english} is going to ${verb.english}`
    return { tense: 'futur_proche', person, kifuliiru: form, english, kiswahili: '', francais: '', pattern: negative ? `[NEG]ziba ${ga[person]}[root]a` : `Ngola ${ga[person]}[root]a`, irregular: false }
  }

  private conjugatePasseP1(verb: VerbData, person: string, negative = false, interrogative = false): ConjugationResult {
    const root = this.extractRoot(verb.verbKifuliiru)
    const prefixes: Record<string, string> = {
      '1sg': 'Na', '2sg': 'Wa', '3sg': 'A',
      '1pl': 'Twa', '2pl': 'Mwa', '3pl': 'Ba'
    }
    if (negative) {
      // Python delegates to P2 for negative
      return this.conjugatePasseP2(verb, person, true, interrogative)
    }
    let form = `${prefixes[person]}${root}a`
    form = interrogative ? this.makeInterrogative(form) : form
    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    let english = interrogative
      ? `${pronoun.english} ${verb.english} (recent past)?`
      : `${pronoun.english} ${verb.english} (recent past)`
    return { tense: 'passe_p1', person, kifuliiru: form, english, kiswahili: '', francais: '', pattern: `${prefixes[person]}[root]a`, irregular: false }
  }

  private conjugatePasseP2(verb: VerbData, person: string, negative = false, interrogative = false): ConjugationResult {
    const root = this.extractRoot(verb.verbKifuliiru)
    const prefixes: Record<string, string> = {
      '1sg': 'Naka', '2sg': 'Waka', '3sg': 'Aka',
      '1pl': 'Twaka', '2pl': 'Mwaka', '3pl': 'Baka'
    }
    let form = `${prefixes[person]}${root}a`
    form = negative ? this.negate(form, person) : form
    form = interrogative ? this.makeInterrogative(form) : form
    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    // Passe P2 = Past Perfect (Plus-que-parfait in French: "avait dit")
    let english = interrogative
      ? `${pronoun.english} had ${verb.english}?`
      : negative 
      ? `${pronoun.english} had not ${verb.english}` 
      : `${pronoun.english} had ${verb.english}`
    return { tense: 'passe_p2', person, kifuliiru: form, english, kiswahili: '', francais: '', pattern: `${prefixes[person]}[root]a`, irregular: false }
  }

  private conjugatePasseP3(verb: VerbData, person: string, negative = false, interrogative = false): ConjugationResult {
    const root = this.extractRoot(verb.verbKifuliiru)
    const prefixes: Record<string, string> = {
      '1sg': 'Nali', '2sg': 'Wali', '3sg': 'Ali',
      '1pl': 'Twali', '2pl': 'Mwali', '3pl': 'Bali'
    }
    let form = `${prefixes[person]}${root}a`
    // For past P3, apply negative to prefix
    if (negative) {
      const negPrefix = this.negate(prefixes[person], person)
      form = `${negPrefix}${root}a`
    }
    form = interrogative ? this.makeInterrogative(form) : form
    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    // Passe P3 = Passé Simple (Simple Past) in French - used in sequential contexts
    // Example: "Nalideta kwo x,Y" = "I went there to say X,Y"
    let english = interrogative
      ? `${pronoun.english} ${verb.english} (simple past)?`
      : negative 
      ? `${pronoun.english} did not ${verb.english}` 
      : `${pronoun.english} ${verb.english} (simple past)`
    return { tense: 'passe_p3', person, kifuliiru: form, english, kiswahili: '', francais: '', pattern: `${prefixes[person]}[root]a`, irregular: false }
  }

  // Conditional irregulars mapping (doc-based)
  private conditionalIrregulars: Record<string, { base: string, third?: string }> = {
    'ukugenda': { base: 'genziri', third: 'ngeziri' },
    'ukukola': { base: 'koziri' },
    'ukushata': { base: 'shatiri' },
    'ukunywa': { base: 'nywiri' },
    'ukusalira': { base: 'saliri' },
    'ukulya': { base: 'liri' },
    'ukuzaata': { base: 'zaatiri' },
    'ukuzamuuka': { base: 'zamuusiri' },
    'ukuyija': { base: 'yijiri' },
    'ukugaluka': { base: 'galusiri' }
  }

  private conjugateConditional(verb: VerbData, person: string, negative: boolean = false, interrogative: boolean = false): ConjugationResult {
    const root = this.extractRoot(verb.verbKifuliiru)
    const prefix = this.getSubjectPrefix(person, 'regular')
    const key = verb.verbKifuliiru.toLowerCase()
    const irr = this.conditionalIrregulars[key]
    let base: string | undefined
    if (irr) {
      base = person === '3sg' && irr.third ? irr.third : irr.base
    }
    const stem = base ? base : `${root}a`
    let form = `${prefix}nga${stem}`
    form = negative ? this.negate(form, person) : form
    form = interrogative ? this.makeInterrogative(form) : form

    const pronoun = this.personalPronouns[person as keyof typeof this.personalPronouns]
    let englishTranslation = interrogative
      ? `${pronoun.english} would ${verb.english}?`
      : negative 
      ? `${pronoun.english} wouldn't ${verb.english}`
      : `${pronoun.english} would ${verb.english}`

    return {
      tense: 'conditional',
      person,
      kifuliiru: form,
      english: englishTranslation,
      kiswahili: '',
      francais: '',
      pattern: `${prefix}nga [stem]`,
      irregular: !!irr
    }
  }

  /**
   * Generate complete conjugation table for a verb
   */
  generateConjugationTable(verb: VerbData, tenses: string[]): ConjugationTable {
    const root = this.extractRoot(verb.verbKifuliiru)
    const conjugations: { [person: string]: ConjugationResult } = {}

    const persons = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl']

    for (const tense of tenses) {
      for (const person of persons) {
        if (tense === 'imperative' && person === '1sg') {
          continue // Skip first person imperative
        }
        
        const key = `${tense}_${person}`
        conjugations[key] = this.conjugateVerb(verb, tense, person)
      }
    }

    return {
      verb: verb.verbKifuliiru,
      english: verb.english,
      root,
      conjugations
    }
  }

  /**
   * Get all available tenses
   */
  getAvailableTenses(): string[] {
    return [
      'present',
      'present_habitual',
      'present_continuous',
      'past',
      'past_continuous',
      'future',
      'conditional',
      'subjunctive',
      'imperative',
      'gerondif',
      'futur_proche',
      'passe_p1',
      'passe_p2',
      'passe_p3'
    ]
  }

  /**
   * Get all available persons
   */
  getAvailablePersons(): string[] {
    return ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl']
  }
}

// Singleton — same pattern as englishConjugationEngine, frenchConjugationEngine, kiswahiliConjugationEngine
export const kifuliiruConjugationEngine = new KifuliiruConjugationEngine()

/** Shared paradigm keys for all four conjugation engines */
export type { Person, Tense } from "./conjugation/conjugation-paradigm.js";
export { PERSON_MAPPING, TENSE_MAPPING } from "./conjugation/conjugation-paradigm.js";

export { EnglishConjugationEngine, englishConjugationEngine } from "./conjugation/english-conjugation-engine.js";
export { FrenchConjugationEngine, frenchConjugationEngine } from "./conjugation/french-conjugation-engine.js";
export { KiswahiliConjugationEngine, kiswahiliConjugationEngine } from "./conjugation/kiswahili-conjugation-engine.js";