/**
 * Kifuliiru Grammar Elements Database
 * Migrated from Python implementation with comprehensive grammar system
 */

export interface GrammarElement {
  kifuliiru: string
  english: string
  notes?: string
  usage?: string
  example?: string
}

export interface GrammarCategory {
  [key: string]: GrammarElement | { [key: string]: GrammarElement }
}

export interface GrammarData {
  category: string
  subcategory: string
  elements: GrammarElement[]
  total: number
}

export class KifuliiruGrammar {
  private pronouns: GrammarCategory
  private possessives: GrammarCategory
  private demonstratives: GrammarCategory
  private conjunctions: GrammarCategory
  private questionWords: GrammarCategory
  private prepositions: GrammarCategory
  private adverbs: GrammarCategory
  private adjectives: GrammarCategory
  private numbers: GrammarCategory

  constructor() {
    this.pronouns = this.loadPronouns()
    this.possessives = this.loadPossessives()
    this.demonstratives = this.loadDemonstratives()
    this.conjunctions = this.loadConjunctions()
    this.questionWords = this.loadQuestionWords()
    this.prepositions = this.loadPrepositions()
    this.adverbs = this.loadAdverbs()
    this.adjectives = this.loadAdjectives()
    this.numbers = this.loadNumbers()
  }

  private loadPronouns(): GrammarCategory {
    return {
      subject: {
        "I": { kifuliiru: "Ndi", english: "I", notes: "First person singular" },
        "You (singular)": { kifuliiru: "Oli", english: "You", notes: "Second person singular" },
        "He/She": { kifuliiru: "Ali", english: "He/She", notes: "Third person singular" },
        "We": { kifuliiru: "Tuli", english: "We", notes: "First person plural" },
        "You (plural)": { kifuliiru: "Muli", english: "You all", notes: "Second person plural" },
        "They": { kifuliiru: "Bali", english: "They", notes: "Third person plural" }
      },
      object: {
        "Me": { kifuliiru: "nyehe", english: "Me", notes: "First person singular object" },
        "You (singular)": { kifuliiru: "wehe", english: "You", notes: "Second person singular object" },
        "Him/Her": { kifuliiru: "yehe", english: "Him/Her", notes: "Third person singular object" },
        "Us": { kifuliiru: "twehe", english: "Us", notes: "First person plural object" },
        "You (plural)": { kifuliiru: "mwehe", english: "You all", notes: "Second person plural object" },
        "Them": { kifuliiru: "bohe", english: "Them", notes: "Third person plural object" }
      }
    }
  }

  private loadPossessives(): GrammarCategory {
    return {
      endings: {
        "My": { kifuliiru: "-ani", english: "My", notes: "First person singular possessive" },
        "Your (singular)": { kifuliiru: "-awe", english: "Your", notes: "Second person singular possessive" },
        "His/Her": { kifuliiru: "-age", english: "His/Her", notes: "Third person singular possessive" },
        "Our": { kifuliiru: "-itu", english: "Our", notes: "First person plural possessive" },
        "Your (plural)": { kifuliiru: "-inyu", english: "Your", notes: "Second person plural possessive" },
        "Their": { kifuliiru: "-abo", english: "Their", notes: "Third person plural possessive" }
      },
      examples: {
        "nyumba": {
          kifuliiru: "Nyumba",
          english: "House",
          notes: "N- class noun",
          usage: "Prefix: y",
          example: "Nyumba yani (my house), Nyumba yawe (your house)"
        },
        "mutukari": {
          kifuliiru: "Mutukari",
          english: "Car",
          notes: "MU- class noun",
          usage: "Prefix: gw",
          example: "Mutukari gwani (my car), Mutukari gwawe (your car)"
        },
        "ikiti": {
          kifuliiru: "Ikiti",
          english: "Tree",
          notes: "KI- class noun",
          usage: "Prefix: ky",
          example: "Ikiti kyani (my tree), Ikiti kyawe (your tree)"
        },
        "umuundu": {
          kifuliiru: "Umuundu",
          english: "Person",
          notes: "BA- class noun",
          usage: "Prefix: w",
          example: "Umuundu wani (my person), Umuundu wawe (your person)"
        }
      }
    }
  }

  private loadDemonstratives(): GrammarCategory {
    return {
      this_singular: {
        "kino": { kifuliiru: "kino", english: "this", notes: "KI- class" },
        "uno": { kifuliiru: "uno", english: "this", notes: "U-/MU- class" },
        "ino": { kifuliiru: "ino", english: "this", notes: "I-/N- class" }
      },
      that_singular: {
        "ulya": { kifuliiru: "ulya", english: "that", notes: "U-/MU- class" },
        "ilya": { kifuliiru: "ilya", english: "that", notes: "I-/N- class" },
        "kalya": { kifuliiru: "kalya", english: "that", notes: "KA- class" }
      },
      these_plural: {
        "bino": { kifuliiru: "bino", english: "these", notes: "BI- class" },
        "bano": { kifuliiru: "bano", english: "these", notes: "BA- class" },
        "tuko": { kifuliiru: "tuko", english: "these", notes: "TU- class" }
      }
    }
  }

  private loadConjunctions(): GrammarCategory {
    return {
      basic: {
        "And": { kifuliiru: "na", english: "and", notes: "Basic conjunction" },
        "And (before vowel)": { kifuliiru: "n'", english: "and", notes: "Before vowel sound" },
        "But": { kifuliiru: "haliko", english: "but", notes: "Contrast" },
        "Or": { kifuliiru: "kandi li", english: "or", notes: "Alternative" }
      },
      causal: {
        "Because": { kifuliiru: "higulu", english: "because", notes: "Reason" },
        "So": { kifuliiru: "ahogo", english: "so", notes: "Consequence" }
      },
      conditional_temporal: {
        "If": { kifuliiru: "li", english: "if", notes: "Condition" },
        "When": { kifuliiru: "kyanya kiki / lihi", english: "when", notes: "Time" },
        "While": { kifuliiru: "mu kyanya", english: "while", notes: "Duration" },
        "After": { kifuliiru: "inyuma", english: "after", notes: "Sequence" },
        "Before": { kifuliiru: "imbere", english: "before", notes: "Sequence" }
      }
    }
  }

  private loadQuestionWords(): GrammarCategory {
    return {
      basic: {
        "Who?": { kifuliiru: "nyandi / nandi", english: "who?", notes: "Person question" },
        "What?": { kifuliiru: "biki", english: "what?", notes: "Object question" },
        "Where?": { kifuliiru: "hayi", english: "where?", notes: "Location question" },
        "When?": { kifuliiru: "lihi", english: "when?", notes: "Time question" },
        "Why?": { kifuliiru: "kubenge biki", english: "why?", notes: "Reason question" },
        "How?": { kifuliiru: "kuti", english: "how?", notes: "Manner question" }
      },
      specific: {
        "Which? (objects)": { kifuliiru: "kihi", english: "which?", notes: "Object selection" },
        "Whose?": { kifuliiru: "imwa nyandi", english: "whose?", notes: "Possession" },
        "How many?": { kifuliiru: "binga / banga / zinga", english: "how many?", notes: "Quantity" }
      }
    }
  }

  private loadPrepositions(): GrammarCategory {
    return {
      location: {
        "In": { kifuliiru: "mu", english: "in", notes: "Inside location" },
        "On": { kifuliiru: "ku", english: "on", notes: "Surface location" },
        "To": { kifuliiru: "i", english: "to", notes: "Direction" },
        "From": { kifuliiru: "kishaga ku", english: "from", notes: "Origin" }
      },
      manner_association: {
        "With": { kifuliiru: "kuguma", english: "with", notes: "Accompaniment" },
        "Without": { kifuliiru: "buzira", english: "without", notes: "Absence" },
        "By": { kifuliiru: "na", english: "by", notes: "Means" }
      },
      relative_position: {
        "Above": { kifuliiru: "higulu lye / halugulu lye", english: "above", notes: "Higher position" },
        "Below": { kifuliiru: "hidako lye", english: "below", notes: "Lower position" },
        "Between": { kifuliiru: "mu kati", english: "between", notes: "Middle position" }
      }
    }
  }

  private loadAdverbs(): GrammarCategory {
    return {
      time: {
        "now": { kifuliiru: "bwobuno", english: "now", notes: "Invariable" },
        "later": { kifuliiru: "kindi kyanya", english: "later", notes: "Invariable" },
        "soon": { kifuliiru: "vuba", english: "soon", notes: "Invariable" },
        "yesterday": { kifuliiru: "bigingo", english: "yesterday", notes: "Invariable" },
        "tomorrow": { kifuliiru: "kusheezi", english: "tomorrow", notes: "Invariable" },
        "today": { kifuliiru: "zeene", english: "today", notes: "Invariable" },
        "always": { kifuliiru: "siku zooshi", english: "always", notes: "Literally 'all days'" },
        "never": { kifuliiru: "ihibi", english: "never", notes: "Invariable" },
        "sometimes": { kifuliiru: "liguma liguma", english: "sometimes", notes: "Reduplication pattern" }
      },
      manner: {
        "slowly": { kifuliiru: "bwijabwija", english: "slowly", notes: "Can also mean 'quietly'" },
        "quickly": { kifuliiru: "vuba", english: "quickly", notes: "Same as 'soon'" },
        "carefully": { kifuliiru: "mu kuguma", english: "carefully", notes: "With care" }
      },
      degree: {
        "very": { kifuliiru: "sana", english: "very", notes: "Intensifier" },
        "too": { kifuliiru: "kindi", english: "too", notes: "Excessive" },
        "enough": { kifuliiru: "bwoba", english: "enough", notes: "Sufficient" }
      },
      place: {
        "here": { kifuliiru: "hano", english: "here", notes: "This location" },
        "there": { kifuliiru: "haho", english: "there", notes: "That location" },
        "everywhere": { kifuliiru: "hose", english: "everywhere", notes: "All places" }
      }
    }
  }

  private loadAdjectives(): GrammarCategory {
    return {
      size: {
        "big": {
          kifuliiru: "munini",
          english: "big",
          notes: "Size adjective",
          usage: "Agrees with noun class"
        },
        "small": {
          kifuliiru: "munini",
          english: "small",
          notes: "Size adjective",
          usage: "Agrees with noun class"
        }
      },
      quality: {
        "good": {
          kifuliiru: "mwiza",
          english: "good",
          notes: "Quality adjective",
          usage: "Agrees with noun class"
        },
        "bad": {
          kifuliiru: "mubi",
          english: "bad",
          notes: "Quality adjective",
          usage: "Agrees with noun class"
        },
        "beautiful": {
          kifuliiru: "mwiza",
          english: "beautiful",
          notes: "Aesthetic quality",
          usage: "Same as 'good'"
        }
      },
      colors: {
        "red": { kifuliiru: "umutuku", english: "red", notes: "Color" },
        "blue": { kifuliiru: "ubururu", english: "blue", notes: "Color" },
        "green": { kifuliiru: "icyatsi", english: "green", notes: "Color" },
        "white": { kifuliiru: "umweru", english: "white", notes: "Color" },
        "black": { kifuliiru: "umukara", english: "black", notes: "Color" }
      }
    }
  }

  private loadNumbers(): GrammarCategory {
    return {
      basic: {
        "one": { kifuliiru: "rimwe", english: "one", notes: "Cardinal number" },
        "two": { kifuliiru: "kabiri", english: "two", notes: "Cardinal number" },
        "three": { kifuliiru: "gatatu", english: "three", notes: "Cardinal number" },
        "four": { kifuliiru: "kane", english: "four", notes: "Cardinal number" },
        "five": { kifuliiru: "gatanu", english: "five", notes: "Cardinal number" }
      },
      ordinal: {
        "first": { kifuliiru: "wa mbere", english: "first", notes: "Ordinal number" },
        "second": { kifuliiru: "wa kabiri", english: "second", notes: "Ordinal number" },
        "third": { kifuliiru: "wa gatatu", english: "third", notes: "Ordinal number" }
      }
    }
  }

  /**
   * Get all grammar categories
   */
  getAvailableCategories(): Array<{ id: string; name: string; description: string }> {
    return [
      { id: 'pronouns', name: 'Pronouns', description: 'Subject and object pronouns' },
      { id: 'possessives', name: 'Possessives', description: 'Possessive forms and patterns' },
      { id: 'demonstratives', name: 'Demonstratives', description: 'This, that, these, those' },
      { id: 'conjunctions', name: 'Conjunctions', description: 'Connecting words and phrases' },
      { id: 'question_words', name: 'Question Words', description: 'Interrogative words' },
      { id: 'prepositions', name: 'Prepositions', description: 'Location and relationship words' },
      { id: 'adverbs', name: 'Adverbs', description: 'Time, manner, degree, and place modifiers' },
      { id: 'adjectives', name: 'Adjectives', description: 'Descriptive words and qualities' },
      { id: 'numbers', name: 'Numbers', description: 'Cardinal and ordinal numbers' }
    ]
  }

  /**
   * Get grammar data for specific categories
   */
  generateGrammarData(categories: string[]): GrammarData[] {
    const results: GrammarData[] = []

    for (const category of categories) {
      const categoryData = this.getCategoryData(category)
      if (categoryData) {
        results.push(categoryData)
      }
    }

    return results
  }

  /**
   * Get data for a specific category
   */
  private getCategoryData(category: string): GrammarData | null {
    let data: GrammarCategory
    let subcategories: string[] = []

    switch (category) {
      case 'pronouns':
        data = this.pronouns
        subcategories = ['subject', 'object']
        break
      case 'possessives':
        data = this.possessives
        subcategories = ['endings', 'examples']
        break
      case 'demonstratives':
        data = this.demonstratives
        subcategories = ['this_singular', 'that_singular', 'these_plural']
        break
      case 'conjunctions':
        data = this.conjunctions
        subcategories = ['basic', 'causal', 'conditional_temporal']
        break
      case 'question_words':
        data = this.questionWords
        subcategories = ['basic', 'specific']
        break
      case 'prepositions':
        data = this.prepositions
        subcategories = ['location', 'manner_association', 'relative_position']
        break
      case 'adverbs':
        data = this.adverbs
        subcategories = ['time', 'manner', 'degree', 'place']
        break
      case 'adjectives':
        data = this.adjectives
        subcategories = ['size', 'quality', 'colors']
        break
      case 'numbers':
        data = this.numbers
        subcategories = ['basic', 'ordinal']
        break
      default:
        return null
    }

    const elements: GrammarElement[] = []
    let total = 0

    for (const subcategory of subcategories) {
      const subData = data[subcategory]
      if (subData && typeof subData === 'object') {
        Object.entries(subData).forEach(([key, value]) => {
          if (typeof value === 'object' && 'kifuliiru' in value) {
            elements.push({
              kifuliiru: value.kifuliiru,
              english: value.english,
              notes: value.notes,
              usage: value.usage,
              example: value.example
            })
            total++
          }
        })
      }
    }

    return {
      category,
      subcategory: subcategories.join(', '),
      elements,
      total
    }
  }

  /**
   * Get statistics for all grammar categories
   */
  getGrammarStatistics(): { [key: string]: number } {
    const stats: { [key: string]: number } = {}
    
    this.getAvailableCategories().forEach(cat => {
      const data = this.getCategoryData(cat.id)
      stats[cat.id] = data ? data.total : 0
    })

    return stats
  }
}

// Export singleton instance
export const grammarEngine = new KifuliiruGrammar()
