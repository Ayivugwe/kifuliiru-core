/**
 * Kifuliiru Noun Pluralizer Utility
 * Converts singular nouns to plural based on noun groups
 * Based on Kifuliiru Noun Groups classification system
 */

export interface NounGroup {
  group: number
  name: string
  singularPrefixes: string[]
  pluralPrefixes: string[]
  description: string
  examples: Array<{ singular: string; plural: string }>
}

export const NOUN_GROUPS: NounGroup[] = [
  {
    group: 1,
    name: 'People (Mu/Ba)',
    singularPrefixes: ['umu', 'mw', 'mu', 'na'],
    pluralPrefixes: ['aba', 'ba'],
    description: 'People - Mu/Ba. Note: na- prefix means origin/pertaining to (e.g., nakatanda = person from Katanda)',
    examples: [
      { singular: 'umuundu', plural: 'abaandu' },
      { singular: 'mwana', plural: 'bana' },
      { singular: 'mushosi', plural: 'bashosi' },
      { singular: 'mukazi', plural: 'bakazi' },
      { singular: 'nakatanda', plural: 'banakatanda' },
    ],
  },
  {
    group: 2,
    name: 'Trees/Natural Phenomena (Mu/Mi)',
    singularPrefixes: ['umu', 'mu'],
    pluralPrefixes: ['imi', 'mi'],
    description: 'Trees, plants, body parts (some), natural objects, things (not people)',
    examples: [
      { singular: 'umulya', plural: 'imilya' },
      { singular: 'umukira', plural: 'imikira' },
      { singular: 'mushaano', plural: 'mishaano' },
    ],
  },
  {
    group: 3,
    name: 'Fruits/Paired Items (I/Li/Ma)',
    singularPrefixes: ['i', 'iri', 'li', 'igi', 'irigi', 'ligi'],
    pluralPrefixes: ['ama'],
    description: 'Fruits, paired body parts, some natural phenomena',
    examples: [
      { singular: 'igi', plural: 'amagi' },
      { singular: 'irigi', plural: 'amagi' },
      { singular: 'ligi', plural: 'amagi' },
      { singular: 'izina', plural: 'amazina' },
    ],
  },
  {
    group: 4,
    name: 'Artifacts/Tools (Ki/Bi)',
    singularPrefixes: ['iki', 'ki'],
    pluralPrefixes: ['ibi', 'bi'],
    description: 'Tools, artifacts, manufactured objects, abstract concepts',
    examples: [
      { singular: 'ikiti', plural: 'ibiti' },
      { singular: 'ikitabo', plural: 'ibitabo' },
      { singular: 'ikintu', plural: 'ibintu' },
      { singular: 'kihugo', plural: 'bihugo' },
      { singular: 'kinamishwa', plural: 'binamishwa' },
    ],
  },
  {
    group: 5,
    name: 'Small Things/Diminutives (Ka/Tu)',
    singularPrefixes: ['aka', 'ka', 'ihi', 'kya'],
    pluralPrefixes: ['utu', 'tu', 'ubu', 'bya'],
    description: 'Small things, diminutives, some animals. Note: kya- is used for children/young of animals (e.g., kyanagoko = young chicken, kyanakulube = young pigs)',
    examples: [
      { singular: 'akabwa', plural: 'utubwa' },
      { singular: 'kaaya', plural: 'utwaya' },
      { singular: 'ihiindu', plural: 'utuundu' },
      { singular: 'ihiindu', plural: 'ububiindu' },
      { singular: 'ihinyuni', plural: 'ubunyuni' },
      { singular: 'kyanabuzi', plural: 'byanabuzi' },
      { singular: 'kyanagoko', plural: 'byanagoko' },
      { singular: 'kyanakulube', plural: 'byanakulube' },
    ],
  },
  {
    group: 6,
    name: 'Animals/Loanwords (N/In)',
    singularPrefixes: ['n', 'in', 'ng', 'mb', 'nd'],
    pluralPrefixes: ['n', 'in', 'ng', 'mb', 'nd'],
    description: 'Animals, some loanwords, certain natural objects (often same form)',
    examples: [
      { singular: 'ngavu', plural: 'ngavu' },
      { singular: 'mbene', plural: 'mbene' },
      { singular: 'ndare', plural: 'ndare' },
      { singular: 'ngoko', plural: 'ngoko' },
      { singular: 'ingoona', plural: 'ingoona' },
    ],
  },
  {
    group: 7,
    name: 'Long Items (Lu/N)',
    singularPrefixes: ['ulu', 'lu'],
    pluralPrefixes: ['n', 'in'],
    description: 'Long thin objects, some geographic features',
    examples: [
      { singular: 'uluhaze', plural: 'mbaze' },
      { singular: 'lubako', plural: 'mbako' },
      { singular: 'lwiiji', plural: 'nyiiji' },
    ],
  },
]

/**
 * Detects which noun group a word belongs to based on its prefix
 * @param word - The word to analyze
 * @param wordType - Optional: 'people' or 'things' to disambiguate mu- prefix
 */
export function detectNounGroup(word: string, wordType?: 'people' | 'things'): NounGroup | null {
  if (!word || typeof word !== 'string') return null

  const normalizedWord = word.trim().toLowerCase()

  // Check each group, matching longest prefixes first
  let bestMatch: { group: NounGroup; prefix: string } | null = null

  for (const group of NOUN_GROUPS) {
    for (const prefix of group.singularPrefixes) {
      if (normalizedWord.startsWith(prefix)) {
        // If we have a wordType hint and the word starts with 'mu' (not 'umu' or 'mw')
        if (wordType && prefix === 'mu' && normalizedWord.startsWith('mu') && !normalizedWord.startsWith('umu') && !normalizedWord.startsWith('mw')) {
          // If wordType is 'people', prefer Group 1
          // If wordType is 'things', prefer Group 2
          if (wordType === 'people' && group.group === 1) {
            bestMatch = { group, prefix }
            break
          } else if (wordType === 'things' && group.group === 2) {
            bestMatch = { group, prefix }
            break
          }
          // Skip if wordType doesn't match
          continue
        }
        
        // Keep track of the longest matching prefix
        if (!bestMatch || prefix.length > bestMatch.prefix.length) {
          bestMatch = { group, prefix }
        }
      }
    }
  }

  return bestMatch ? bestMatch.group : null
}

/**
 * Extracts the root word by removing the prefix
 */
function extractRoot(word: string, prefix: string): string {
  const normalizedWord = word.trim().toLowerCase()
  if (normalizedWord.startsWith(prefix)) {
    return normalizedWord.substring(prefix.length)
  }
  return normalizedWord
}

/**
 * Converts a singular noun to its plural form
 * @param singular - The singular form of the noun
 * @param wordType - Optional: 'people' or 'things' to disambiguate mu- prefix
 * @returns The plural form, or null if conversion is not possible
 */
export function singularToPlural(singular: string, wordType?: 'people' | 'things'): string | null {
  if (!singular || typeof singular !== 'string') return null

  const normalizedSingular = singular.trim().toLowerCase()
  const group = detectNounGroup(normalizedSingular, wordType)

  if (!group) {
    return null
  }

  // Handle Group 6 (Animals/Loanwords) - often same form
  if (group.group === 6) {
    // For Group 6, the plural is often the same as singular
    // But we can try to detect if it needs transformation
    // For now, return the same form
    return normalizedSingular
  }

  // Find the matching singular prefix (longest match first)
  let matchedPrefix = ''
  let root = ''
  let longestMatch = ''

  for (const prefix of group.singularPrefixes) {
    if (normalizedSingular.startsWith(prefix) && prefix.length > longestMatch.length) {
      longestMatch = prefix
    }
  }

  if (longestMatch) {
    matchedPrefix = longestMatch
    root = extractRoot(normalizedSingular, longestMatch)
  }

  if (!matchedPrefix) {
    return null
  }

  // Get the corresponding plural prefix
  // For groups with multiple plural prefixes, use the first one
  const pluralPrefix = group.pluralPrefixes[0]

  // Special handling for Group 3 (Fruits/Paired Items)
  if (group.group === 3) {
    // Handle special cases like "igi" -> "amagi"
    if (normalizedSingular === 'igi' || normalizedSingular === 'irigi' || normalizedSingular === 'ligi') {
      return 'amagi'
    }
    // For other Group 3 words, use ama- prefix
    return `${pluralPrefix}${root}`
  }

  // Special handling for Group 5 (Small Things)
  if (group.group === 5) {
    // Handle "kaaya" -> "utwaya" (special case)
    if (normalizedSingular === 'kaaya') {
      return 'utwaya'
    }
    // Handle "ihi" prefix cases
    if (matchedPrefix === 'ihi') {
      // Ihiindu -> Utuundu or Ububiindu
      if (normalizedSingular === 'ihiindu') {
        // Return primary form Utuundu
        return 'utuundu'
      }
      // Ihinyuni -> Ubunyuni
      if (normalizedSingular === 'ihinyuni') {
        return 'ubunyuni'
      }
      // For other "ihi" words, convert to "ubu" form
      return `ubu${root}`
    }
    // Handle "kya" prefix cases -> "bya"
    // kya- is used for children/young of animals (e.g., kyanagoko = young chicken, kyanakulube = young pigs)
    if (matchedPrefix === 'kya') {
      // Kyanabuzi -> Byanabuzi
      if (normalizedSingular === 'kyanabuzi') {
        return 'byanabuzi'
      }
      // Kyanagoko -> Byanagoko (young chicken/chickens)
      if (normalizedSingular === 'kyanagoko') {
        return 'byanagoko'
      }
      // Kyanakulube -> Byanakulube (young pig/pigs)
      if (normalizedSingular === 'kyanakulube') {
        return 'byanakulube'
      }
      // For other "kya" words, convert to "bya" form
      return `bya${root}`
    }
    // For other Group 5 words (aka/ka prefixes)
    return `${pluralPrefix}${root}`
  }

  // Special handling for Group 7 (Long Items)
  if (group.group === 7) {
    // Special case: uluhaze -> mbaze
    if (normalizedSingular === 'uluhaze') {
      return 'mbaze'
    }
    // Special case: lubako -> mbako
    if (normalizedSingular === 'lubako') {
      return 'mbako'
    }
    // Special case: lwiiji -> nyiiji
    if (normalizedSingular === 'lwiiji') {
      return 'nyiiji'
    }
    // For other Group 7 words, plural prefix is n- or in-
    // Remove ulu- or lu- and add n-
    return `n${root}`
  }

  // Special handling for Group 1 "mw" -> "b" cases
  if (group.group === 1 && matchedPrefix === 'mw') {
    // "mwana" -> "bana" (mw -> b directly)
    return `b${root}`
  }

  // Special handling for Group 1 "na" -> "ba" cases (origin/pertaining to)
  // na- prefix means origin/pertaining to, plural becomes ba- + na- + root
  if (group.group === 1 && matchedPrefix === 'na') {
    // "nakatanda" -> "banakatanda" (na -> ba + na, keeping the na- prefix)
    return `ban${root}`
  }

  // Special handling for Group 2 "mu" -> "mi" cases (for things, not people)
  if (group.group === 2 && matchedPrefix === 'mu') {
    // "mushaano" -> "mishaano" (mu -> mi for things)
    return `mi${root}`
  }

  // Default: replace singular prefix with plural prefix
  return `${pluralPrefix}${root}`
}

/**
 * Converts a plural noun to its singular form (reverse operation)
 * @param plural - The plural form of the noun
 * @param wordType - Optional: 'people' or 'things' to disambiguate ba-/mi- prefixes
 * @returns The singular form, or null if conversion is not possible
 */
export function pluralToSingular(plural: string, wordType?: 'people' | 'things'): string | null {
  if (!plural || typeof plural !== 'string') return null

  const normalizedPlural = plural.trim().toLowerCase()

  // Find the group by checking plural prefixes (longest match first)
  let bestMatch: { group: NounGroup; prefix: string } | null = null

  for (const group of NOUN_GROUPS) {
    for (const prefix of group.pluralPrefixes) {
      if (normalizedPlural.startsWith(prefix)) {
        // If we have a wordType hint and the word starts with 'ba' or 'mi'
        if (wordType && (prefix === 'ba' || prefix === 'mi')) {
          // If wordType is 'people', prefer Group 1 (ba-)
          // If wordType is 'things', prefer Group 2 (mi-)
          if (wordType === 'people' && group.group === 1 && prefix === 'ba') {
            bestMatch = { group, prefix }
            break
          } else if (wordType === 'things' && group.group === 2 && prefix === 'mi') {
            bestMatch = { group, prefix }
            break
          }
          // Skip if wordType doesn't match
          continue
        }
        
        if (!bestMatch || prefix.length > bestMatch.prefix.length) {
          bestMatch = { group, prefix }
        }
      }
    }
  }

  if (bestMatch) {
    const { group, prefix } = bestMatch
    const root = extractRoot(normalizedPlural, prefix)
    const singularPrefix = group.singularPrefixes[0]

    // Handle Group 6 (same form)
    if (group.group === 6) {
      return normalizedPlural
    }

    // Handle Group 3 special case
    if (group.group === 3 && normalizedPlural === 'amagi') {
      return 'igi' // Default to 'igi' form
    }

    // Handle Group 5 special cases
    if (group.group === 5) {
      // Handle utwaya -> kaaya
      if (normalizedPlural === 'utwaya') {
        return 'kaaya'
      }
      // Handle "utu" or "ubu" prefix cases (from "ihi" singular)
      if (prefix === 'utu' || prefix === 'ubu') {
        // Utuundu -> Ihiindu
        if (normalizedPlural === 'utuundu') {
          return 'ihiindu'
        }
        // Ububiindu -> Ihiindu (alternative plural)
        if (normalizedPlural === 'ububiindu') {
          return 'ihiindu'
        }
        // Ubunyuni -> Ihinyuni
        if (normalizedPlural === 'ubunyuni') {
          return 'ihinyuni'
        }
        // For other "utu"/"ubu" words from "ihi", convert to "ihi" form
        return `ihi${root}`
      }
      // Handle "bya" prefix cases (from "kya" singular)
      // bya- is the plural of kya- (used for children/young of animals)
      if (prefix === 'bya') {
        // Byanabuzi -> Kyanabuzi
        if (normalizedPlural === 'byanabuzi') {
          return 'kyanabuzi'
        }
        // Byanagoko -> Kyanagoko (young chickens -> young chicken)
        if (normalizedPlural === 'byanagoko') {
          return 'kyanagoko'
        }
        // Byanakulube -> Kyanakulube (young pigs -> young pig)
        if (normalizedPlural === 'byanakulube') {
          return 'kyanakulube'
        }
        // For other "bya" words, convert to "kya" form
        return `kya${root}`
      }
      // For other Group 5 words (from aka/ka), use default conversion
      return `${singularPrefix}${root}`
    }

    // Handle Group 7 special cases (Long Items)
    if (group.group === 7) {
      // Special case: mbaze -> uluhaze
      if (normalizedPlural === 'mbaze') {
        return 'uluhaze'
      }
      // Special case: mbako -> lubako
      if (normalizedPlural === 'mbako') {
        return 'lubako'
      }
      // Special case: nyiiji -> lwiiji
      if (normalizedPlural === 'nyiiji') {
        return 'lwiiji'
      }
      // For other Group 7 words, remove n- prefix and add ulu- or lu-
      // Default to lu- for simplicity
      return `lu${root}`
    }

    // Handle Group 1 "b" -> "mw" cases (reverse of mw -> b)
    if (group.group === 1 && prefix === 'b' && root.startsWith('a') && root.length > 1) {
      // Try to convert "bana" -> "mwana" (b -> mw)
      // This is a heuristic - if root starts with vowel and is short, might be mw- form
      return `mw${root}`
    }

    // Handle Group 1 "ban" -> "na" cases (reverse of na -> ban)
    // Special case: banakatanda -> nakatanda
    if (normalizedPlural === 'banakatanda') {
      return 'nakatanda'
    }
    // If plural starts with "ba" and root starts with "na", it might be from "na-" prefix
    if (group.group === 1 && prefix === 'ba' && root.startsWith('na') && root.length > 2) {
      // "banakatanda" -> "nakatanda" (ban -> na, removing the ba- prefix)
      // The root already starts with "na-", so return it as-is
      return root
    }

    // Handle Group 2 "mi" -> "mu" cases (reverse of mu -> mi for things)
    if (group.group === 2 && prefix === 'mi') {
      // "mishaano" -> "mushaano" (mi -> mu for things)
      return `mu${root}`
    }

    return `${singularPrefix}${root}`
  }

  return null
}

/**
 * Gets information about a noun group
 */
export function getNounGroupInfo(groupNumber: number): NounGroup | null {
  return NOUN_GROUPS.find(g => g.group === groupNumber) || null
}

/**
 * Gets all noun groups
 */
export function getAllNounGroups(): NounGroup[] {
  return NOUN_GROUPS
}

/**
 * Detects if a word is likely plural by checking if it starts with plural prefixes
 * @param word - The word to check
 * @param wordType - Optional: 'people' or 'things' to disambiguate ba-/mi- prefixes
 * @returns true if the word appears to be plural, false otherwise
 */
export function isLikelyPlural(word: string, wordType?: 'people' | 'things'): boolean {
  if (!word || typeof word !== 'string') return false

  const normalizedWord = word.trim().toLowerCase()

  // Check each group's plural prefixes
  for (const group of NOUN_GROUPS) {
    for (const prefix of group.pluralPrefixes) {
      if (normalizedWord.startsWith(prefix)) {
        // If we have a wordType hint and the word starts with 'ba' or 'mi'
        if (wordType && (prefix === 'ba' || prefix === 'mi')) {
          // If wordType is 'people', prefer Group 1 (ba-)
          // If wordType is 'things', prefer Group 2 (mi-)
          if (wordType === 'people' && group.group === 1 && prefix === 'ba') {
            return true
          } else if (wordType === 'things' && group.group === 2 && prefix === 'mi') {
            return true
          }
          // Skip if wordType doesn't match
          continue
        }
        // Found a plural prefix match
        return true
      }
    }
  }

  return false
}

