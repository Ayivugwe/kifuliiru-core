/**
 * Number + noun agreement (ported from Lab numbers-nouns-agreement page logic).
 * Agreement *rules* rows may still be loaded from the app DB; this module is the algorithm.
 */
import {
  detectNounGroup,
  isLikelyPlural,
  singularToPlural,
} from "../noun-pluralizer.js";

export interface NumberNounPhrase {
  noun: string;
  number: number;
  phrase: string;
}
export function getNounClassPrefix(noun: string, number?: number): string {
  const nounLower = noun.toLowerCase()
  
  // For number 1, use singular prefix; for numbers 2-5, 7, use plural prefix
  // Numbers 6, 8, 9, 10 are invariable (no prefix change)
  
  // Detect if noun is plural or singular
  const isPlural = isLikelyPlural(nounLower)
  const group = detectNounGroup(nounLower)
  
  // If noun starts with a vowel, remove it first for prefix extraction
  const vowels = ['a', 'e', 'i', 'o', 'u']
  let cleanedNoun = nounLower
  const startsWithVowel = vowels.includes(nounLower[0])
  if (startsWithVowel) {
    cleanedNoun = nounLower.substring(1)
  }
  
  // Use pluralizer logic to determine prefix
  if (group) {
    // For numbers 2-5, 7, we need plural prefix
    // For number 1, we need singular prefix
    const needsPluralPrefix = number !== undefined && number !== 1 && [2, 3, 4, 5, 7].includes(number)
    
    if (needsPluralPrefix && !isPlural) {
      // Convert singular to plural to get the plural prefix
      const pluralForm = singularToPlural(nounLower)
      if (pluralForm) {
        // Extract prefix from plural form
        const pluralGroup = detectNounGroup(pluralForm)
        if (pluralGroup && pluralGroup.pluralPrefixes.length > 0) {
          const pluralPrefix = pluralGroup.pluralPrefixes[0]
          // Extract the agreement prefix (first 1-2 chars)
          if (pluralPrefix.startsWith('aba')) {
            return 'ba'
          }
          if (pluralPrefix.startsWith('ba')) {
            return 'ba'
          }
          if (pluralPrefix.startsWith('imi')) {
            return 'mi'
          }
          if (pluralPrefix.startsWith('mi')) {
            return 'mi'
          }
          if (pluralPrefix.startsWith('ibi')) {
            return 'bi'
          }
          if (pluralPrefix.startsWith('bi')) {
            return 'bi'
          }
          if (pluralPrefix.startsWith('utu')) {
            return 'tu'
          }
          if (pluralPrefix.startsWith('tu')) {
            return 'tu'
          }
          return pluralPrefix.substring(0, 2)
        }
      }
    }
    
    // Extract prefix based on noun group
    if (group.group === 1) {
      // People: mu- (singular) -> ba- (plural)
      if (isPlural || (number !== undefined && number !== 1 && [2, 3, 4, 5, 7].includes(number))) {
        return 'ba'
      }
      // Singular: check if it's umu-, mu-, or mw-
      if (nounLower.startsWith('umu') || cleanedNoun.startsWith('muu')) {
        return 'mu'
      }
      if (nounLower.startsWith('mu') || cleanedNoun.startsWith('mu')) {
        return 'mu'
      }
      if (nounLower.startsWith('mw') || cleanedNoun.startsWith('mw')) {
        return 'mu' // mw- also uses mu- prefix for agreement
      }
      return 'mu'
    }
    
    if (group.group === 2) {
      // Trees/Things: mu- (singular) -> mi- (plural)
      if (isPlural || (number !== undefined && number !== 1 && [2, 3, 4, 5, 7].includes(number))) {
        return 'mi'
      }
      return 'mu'
    }
    
    if (group.group === 4) {
      // Tools: ki- (singular) -> bi- (plural)
      if (isPlural || (number !== undefined && number !== 1 && [2, 3, 4, 5, 7].includes(number))) {
        return 'bi'
      }
      return 'ki'
    }
    
    if (group.group === 5) {
      // Small things: ka- (singular) -> tu- (plural)
      if (isPlural || (number !== undefined && number !== 1 && [2, 3, 4, 5, 7].includes(number))) {
        return 'tu'
      }
      return 'ka'
    }
    
    if (group.group === 6) {
      // Animals: often same form, use 'ng' prefix
      return 'ng'
    }
  }
  
  // Fallback: extract prefix manually if group detection fails
  // If noun starts with a vowel, remove it first
  if (startsWithVowel) {
    // Check patterns in cleaned noun
    if (cleanedNoun.startsWith('nga') || cleanedNoun.startsWith('mbe')) {
      return 'ng'
    }
    if (cleanedNoun.startsWith('muu')) {
      return 'mu'
    }
    if (cleanedNoun.startsWith('mu')) {
      return 'mu'
    }
    if (cleanedNoun.startsWith('baa')) {
      return 'ba'
    }
    if (cleanedNoun.startsWith('ba')) {
      return 'ba'
    }
    if (cleanedNoun.startsWith('kab')) {
      return 'ka'
    }
    if (cleanedNoun.startsWith('ka')) {
      return 'ka'
    }
    if (cleanedNoun.startsWith('tub')) {
      return 'tu'
    }
    if (cleanedNoun.startsWith('tu')) {
      return 'tu'
    }
    if (cleanedNoun.startsWith('kib')) {
      return 'ki'
    }
    if (cleanedNoun.startsWith('ki')) {
      return 'ki'
    }
    if (cleanedNoun.startsWith('bib')) {
      return 'bi'
    }
    if (cleanedNoun.startsWith('bi')) {
      return 'bi'
    }
    
    // Default: extract first 2 characters
    if (cleanedNoun.length >= 2) {
      return cleanedNoun.substring(0, 2)
    }
    if (cleanedNoun.length >= 1) {
      return cleanedNoun.substring(0, 1)
    }
  }
  
  // For nouns that don't start with vowel
  if (!startsWithVowel) {
    if (nounLower.startsWith('nga') || nounLower.startsWith('mbe')) {
      return 'ng'
    }
    if (nounLower.startsWith('muu') || nounLower.startsWith('mu ')) {
      return 'mu'
    }
    if (nounLower.startsWith('baa') || nounLower.startsWith('ba ')) {
      return 'ba'
    }
    if (nounLower.startsWith('kab') || nounLower.startsWith('ka ')) {
      return 'ka'
    }
    if (nounLower.startsWith('tub') || nounLower.startsWith('tu ')) {
      return 'tu'
    }
    if (nounLower.startsWith('kib') || nounLower.startsWith('ki ')) {
      return 'ki'
    }
    if (nounLower.startsWith('bib') || nounLower.startsWith('bi ')) {
      return 'bi'
    }
    
    if (nounLower.length >= 2) {
      return nounLower.substring(0, 2)
    }
    return nounLower.substring(0, 1)
  }
  
  // Final fallback
  if (nounLower.length >= 2) {
    return nounLower.substring(0, 2)
  }
  return nounLower.substring(0, 1)
}

// Generate number + noun combination based on rules
export function generateNumberNoun(noun: string, number: number): string {
  // Numbers that don't change (6, 8, 9, 10)
  if ([6, 8, 9, 10].includes(number)) {
    return `${noun} ${getNumberWordForAgreement(number)}`
  }
  
  // Numbers 10+ and multiples of 10: plural noun + number
  if (number >= 10 && number % 10 === 0) {
    return `${noun} ${getNumberWordForAgreement(number)}`
  }
  
  // Agreement rules for 1-5, 7
  const prefix = getNounClassPrefix(noun, number)
  
  switch (number) {
    case 1:
      return `${noun} ${prefix}guma`
    case 2:
      return `${noun} ${prefix}biri`
    case 3:
      return `${noun} ${prefix}shatu`
    case 4:
      return `${noun} ${prefix}na`
    case 5:
      return `${noun} ${prefix}taanu`
    case 7:
      return `${noun} ${prefix}liinda`
    default:
      return `${noun} ${getNumberWordForAgreement(number)}`
  }
}

// Get number word in Kifuliiru
export function getNumberWordForAgreement(num: number): string {
  const numbers: Record<number, string> = {
    0: 'zeero',
    1: 'imwe',
    2: 'ibiri',
    3: 'ishatu',
    4: 'ina',
    5: 'itaanu',
    6: 'ndatu',
    7: 'munaana', // Note: user said 7 is "ziliinda" but this might be the base word
    8: 'munaana',
    9: 'mweenda',
    10: 'ikumi'
  }
  return numbers[num] || String(num)
}
export function buildNumberNounPhrase(noun: string, number: number): NumberNounPhrase {
  return { noun, number, phrase: generateNumberNoun(noun, number) };
}
