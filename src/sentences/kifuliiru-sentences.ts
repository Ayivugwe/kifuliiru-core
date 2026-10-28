/**
 * Kifuliiru Sentence Generator
 * Dynamic sentence generation using proper grammar patterns and conjugation
 * Integrates with existing pronouns, conjugator, verbs, and nouns systems
 */

import type { VerbData } from "../types/index.js";
import type {
  SentenceLexicon,
  VerbSemanticRules,
} from "../types/sentence-lexicon.js";
import { kifuliiruConjugationEngine } from "../verbs/kifuliiru-conjugation.js";
import type { KifuliiruVerbs } from "../verbs/kifuliiru-verbs.js";

export interface SentenceGeneratorOptions {
  verbs: KifuliiruVerbs;
  lexicon: SentenceLexicon;
  semanticRules?: VerbSemanticRules;
  templates?: SentenceTemplate[];
  categoryContexts?: Record<string, string>;
}

function pickRandom<T>(items: T[], label: string): T {
  if (items.length === 0) {
    throw new Error(
      `${label} is empty — load lexicon or verbs in the host app before generating sentences.`,
    );
  }
  return items[Math.floor(Math.random() * items.length)] as T;
}

export type SentenceTier = "result" | "product";

export interface SentenceData {
  kifuliiru: string;
  english: string;
  french: string;
  kiswahili: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  context: string;
  grammar_notes?: string;
  pattern?: string;
  components?: any;
  /** `product` = semantically validated; `result` = raw combinatorial output */
  tier?: SentenceTier;
  semanticallyValid?: boolean;
}

export interface SentenceTemplate {
  kifuliiru: string
  english: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  variables: string[]
}

export class KifuliiruSentenceGenerator {
  private verbsSystem: KifuliiruVerbs;
  private lexicon: SentenceLexicon;
  private semanticRules: VerbSemanticRules;
  private sentenceTemplates: SentenceTemplate[];
  private categoryContexts: Record<string, string>;

  private readonly SEMANTIC_CATEGORIES = {
    HUMAN: "human",
    ANIMAL: "animal",
    OBJECT: "object",
    FOOD: "food",
    LIQUID: "liquid",
    ANIMATE: "animate",
    INANIMATE: "inanimate",
    LIVING: "living",
    NON_LIVING: "non_living",
    LARGE: "large",
    SMALL: "small",
    MEDIUM: "medium",
    YOUNG: "young",
    ADULT: "adult",
    MALE: "male",
    FEMALE: "female",
    CONCRETE: "concrete",
    ABSTRACT: "abstract",
    PHYSICAL: "physical",
    MENTAL: "mental",
  } as const;

  private readonly sentencePatterns = [
    'conjugated_verb',
    'pronoun_conjugated_verb',
    'conjugated_verb_object',
    'conjugated_verb_adjective',
    'conjugated_verb_adverb',
    'conjugated_verb_place',
    'conjugated_verb_time',
  ]

  constructor(options: SentenceGeneratorOptions) {
    this.verbsSystem = options.verbs;
    this.lexicon = options.lexicon;
    this.semanticRules = options.semanticRules ?? {};
    this.sentenceTemplates = options.templates ?? [];
    this.categoryContexts = options.categoryContexts ?? {};
  }

  private validateSemanticCompatibility(
    verb: string,
    subject: { semantic: string[] },
    object?: { semantic: string[] },
    adjective?: { appliesTo?: string[] },
  ): boolean {
    const verbKey = verb.toLowerCase();
    const verbRules = this.semanticRules[verbKey];
    if (!verbRules) return true;

    if (verbRules.requires) {
      const ok = verbRules.requires.some((req) => subject.semantic.includes(req));
      if (!ok) return false;
    }

    if (object && verbRules.objects) {
      const ok = verbRules.objects.some((t) => object.semantic.includes(t));
      if (!ok) return false;
    }

    if (adjective?.appliesTo) {
      const ok = adjective.appliesTo.some((t) => subject.semantic.includes(t));
      if (!ok) return false;
    }

    return true;
  }

  /**
   * Generate sentences based on category and difficulty using dynamic patterns
   */
  generateSentences(
    categories: string[], 
    difficulties: string[], 
    count: number
  ): SentenceData[] {
    const sentences: SentenceData[] = []
    
    // Generate dynamic sentences based on patterns
    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
      
      let sentence: SentenceData
      const pattern = Math.random()
      
      if (pattern < 0.4) {
        sentence = this.generateSimpleSentence(category, difficulty)
      } else if (pattern < 0.6) {
        sentence = this.generateComplexSentence(category, difficulty)
      } else if (pattern < 0.8) {
        sentence = this.generateQuestionSentence(category, difficulty)
      } else {
        sentence = this.generateNegativeSentence(category, difficulty)
      }
      
      sentences.push(sentence)
    }

    return sentences
  }

  /**
   * Create a sentence from a template
   */
  private createSentenceFromTemplate(template: SentenceTemplate): SentenceData {
    return {
      kifuliiru: template.kifuliiru,
      english: template.english,
      french: this.generateFrenchTranslation(template),
      kiswahili: this.generateKiswahiliTranslation(template),
      category: template.category,
      difficulty: template.difficulty,
      context: this.categoryContexts[template.category as keyof typeof this.categoryContexts] || 'General conversation',
      grammar_notes: this.generateGrammarNotes(template)
    }
  }

  /**
   * Generate a simple sentence dynamically using patterns with STRICT semantic validation
   */
  private generateSimpleSentence(category: string, difficulty: string): SentenceData {
    const pattern = this.sentencePatterns[Math.floor(Math.random() * this.sentencePatterns.length)]
    
    // Generate semantically compatible components with retry logic
    let person, verbData, conjugatedVerb, noun, adjective, adverb, place, time
    let attempts = 0;
    const maxAttempts = 10;
    let semanticallyValid = false;

    do {
      person = this.getRandomPerson()
      verbData = this.getRandomVerb()
      conjugatedVerb = this.conjugateVerb(verbData, person)
      
      // Get additional components based on pattern
      if (pattern === 'conjugated_verb_object') {
        noun = this.getRandomNoun()
      }
      if (pattern === 'conjugated_verb_adjective') {
        adjective = this.getRandomAdjective()
      }
      if (pattern === 'conjugated_verb_adverb') {
        adverb = this.getRandomAdverb()
      }
      if (pattern === 'conjugated_verb_place') {
        place = this.getRandomPlaceAdverb()
      }
      if (pattern === 'conjugated_verb_time') {
        time = this.getRandomTimeAdverb()
      }
      
      // Validate semantic compatibility
      const isValid = this.validateSemanticCompatibility(
        verbData.verbKifuliiru, 
        person, 
        noun, 
        adjective
      )
      
      if (isValid) {
        semanticallyValid = true;
        break;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        console.warn(`⚠️ Max attempts reached for semantic validation, using fallback`)
        break
      }
    } while (attempts < maxAttempts)
    
    const sentenceParts = {
      subject: person.kifuliiru,
      verb: conjugatedVerb,
      english_subject: person.english,
      english_verb: verbData.english
    }
    
    let kifuliiru = ''
    let english = ''
    
    switch (pattern) {
      case 'conjugated_verb':
        // Just the conjugated verb - complete sentence
        kifuliiru = sentenceParts.verb
        english = sentenceParts.english_verb
        break
        
      case 'pronoun_conjugated_verb':
        // Pronoun + conjugated verb
        kifuliiru = `${sentenceParts.subject} ${sentenceParts.verb}`
        english = `${sentenceParts.english_subject} ${sentenceParts.english_verb}`
        break
        
      case 'conjugated_verb_object':
        kifuliiru = `${sentenceParts.verb} ${noun?.kifuliiru || ''}`
        english = `${sentenceParts.english_verb} ${noun?.english || ''}`
        break
        
      case 'conjugated_verb_adjective':
        kifuliiru = `${sentenceParts.verb} ${adjective?.kifuliiru || ''}`
        english = `${sentenceParts.english_verb} ${adjective?.english || ''}`
        break
        
      case 'conjugated_verb_adverb':
        kifuliiru = `${sentenceParts.verb} ${adverb?.kifuliiru || ''}`
        english = `${sentenceParts.english_verb} ${adverb?.english || ''}`
        break
        
      case 'conjugated_verb_place':
        kifuliiru = `${sentenceParts.verb} ${place?.kifuliiru || ''}`
        english = `${sentenceParts.english_verb} ${place?.english || ''}`
        break
        
      case 'conjugated_verb_time':
        kifuliiru = `${sentenceParts.verb} ${time?.kifuliiru || ''}`
        english = `${sentenceParts.english_verb} ${time?.english || ''}`
        break
        
      default:
        // Fallback to just conjugated verb
        kifuliiru = sentenceParts.verb
        english = sentenceParts.english_verb
    }
    
    return {
      kifuliiru,
      english,
      french: this.translateToFrench(english),
      kiswahili: this.translateToKiswahili(english),
      category,
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      context: this.categoryContexts[category as keyof typeof this.categoryContexts] || 'General conversation',
      grammar_notes: `Simple sentence with ${person.kifuliiru} (${person.english}) and verb ${verbData.verbKifuliiru} (${verbData.english})`,
      pattern,
      components: sentenceParts,
      tier: semanticallyValid ? "product" : "result",
      semanticallyValid,
    };
  }

  /**
   * Generate a complex sentence with multiple elements
   */
  private generateComplexSentence(category: string, difficulty: string): SentenceData {
    const person = this.getRandomPerson()
    const verbData = this.getRandomVerb()
    const conjugatedVerb = this.conjugateVerb(verbData, person)
    
    // Add object
    const noun = this.getRandomNoun()
    
    // Add adjective
    const adjective = this.getRandomAdjective()
    
    // Add adverb
    const adverb = this.getRandomAdverb()
    
    const kifuliiru = `${person.kifuliiru} ${conjugatedVerb} ${noun.kifuliiru} ${adjective.kifuliiru} ${adverb.kifuliiru}`
    const english = `${person.english} ${verbData.english} ${noun.english} ${adjective.english} ${adverb.english}`
    
    return {
      kifuliiru,
      english,
      french: this.translateToFrench(english),
      kiswahili: this.translateToKiswahili(english),
      category,
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      context: this.categoryContexts[category as keyof typeof this.categoryContexts] || 'General conversation',
      grammar_notes: `Complex sentence with subject, verb, object, adjective, and adverb`,
      pattern: 'complex',
      components: {
        subject: person,
        verb: conjugatedVerb,
        object: noun,
        adjective: adjective,
        adverb: adverb
      }
    }
  }

  /**
   * Generate a question sentence
   */
  private generateQuestionSentence(category: string, difficulty: string): SentenceData {
    const questionWordKeys = Object.keys(this.lexicon.questionWords);
    const questionWordKey = pickRandom(questionWordKeys, "Question words");
    const questionWord = this.lexicon.questionWords[questionWordKey]!;
    
    const person = this.getRandomPerson()
    const verbData = this.getRandomVerb()
    const conjugatedVerb = this.conjugateVerb(verbData, person)
    
    const kifuliiru = `${questionWord.kifuliiru} ${person.kifuliiru} ${conjugatedVerb}?`
    const english = `${questionWord.english} does ${person.english} ${verbData.english}?`
    
    return {
      kifuliiru,
      english,
      french: this.translateToFrench(english),
      kiswahili: this.translateToKiswahili(english),
      category,
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      context: this.categoryContexts[category as keyof typeof this.categoryContexts] || 'General conversation',
      grammar_notes: `Question sentence with ${questionWord.kifuliiru} (${questionWord.english})`,
      pattern: 'question',
      components: {
        question_word: questionWord,
        subject: person,
        verb: conjugatedVerb
      }
    }
  }

  /**
   * Generate a negative sentence
   */
  private generateNegativeSentence(category: string, difficulty: string): SentenceData {
    const person = this.getRandomPerson()
    const verbData = this.getRandomVerb()
    const conjugatedVerb = this.conjugateVerb(verbData, person, 'present', true) // negative = true
    
    const kifuliiru = `${person.kifuliiru} ${conjugatedVerb}`
    const english = `${person.english} don't ${verbData.english}`
    
    return {
      kifuliiru,
      english,
      french: this.translateToFrench(english),
      kiswahili: this.translateToKiswahili(english),
      category,
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      context: this.categoryContexts[category as keyof typeof this.categoryContexts] || 'General conversation',
      grammar_notes: `Negative sentence with ${person.kifuliiru} (${person.english})`,
      pattern: 'negative',
      components: {
        subject: person,
        verb: conjugatedVerb
      }
    }
  }

  /**
   * Get a random person using the conjugation engine's pronouns with semantic data
   */
  private getRandomPerson() {
    const personKeys = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl']
    const personKey = personKeys[Math.floor(Math.random() * personKeys.length)]
    
    // Use the same pronouns as the conjugation engine with semantic data
    const personalPronouns = {
      '1sg': { 
        kifuliiru: 'Nyehe', 
        english: 'I', 
        prefix: 'Na',
        semantic: [this.SEMANTIC_CATEGORIES.HUMAN, this.SEMANTIC_CATEGORIES.ANIMATE, this.SEMANTIC_CATEGORIES.LIVING, this.SEMANTIC_CATEGORIES.ADULT]
      },
      '2sg': { 
        kifuliiru: 'Wehe', 
        english: 'You', 
        prefix: 'Wa',
        semantic: [this.SEMANTIC_CATEGORIES.HUMAN, this.SEMANTIC_CATEGORIES.ANIMATE, this.SEMANTIC_CATEGORIES.LIVING, this.SEMANTIC_CATEGORIES.ADULT]
      },
      '3sg': { 
        kifuliiru: 'Yehe', 
        english: 'He/She', 
        prefix: 'A',
        semantic: [this.SEMANTIC_CATEGORIES.HUMAN, this.SEMANTIC_CATEGORIES.ANIMATE, this.SEMANTIC_CATEGORIES.LIVING, this.SEMANTIC_CATEGORIES.ADULT]
      },
      '1pl': { 
        kifuliiru: 'Twehe', 
        english: 'We', 
        prefix: 'Twa',
        semantic: [this.SEMANTIC_CATEGORIES.HUMAN, this.SEMANTIC_CATEGORIES.ANIMATE, this.SEMANTIC_CATEGORIES.LIVING, this.SEMANTIC_CATEGORIES.ADULT]
      },
      '2pl': { 
        kifuliiru: 'Mwehe', 
        english: 'You all', 
        prefix: 'Mwa',
        semantic: [this.SEMANTIC_CATEGORIES.HUMAN, this.SEMANTIC_CATEGORIES.ANIMATE, this.SEMANTIC_CATEGORIES.LIVING, this.SEMANTIC_CATEGORIES.ADULT]
      },
      '3pl': { 
        kifuliiru: 'Bohe', 
        english: 'They', 
        prefix: 'Ba',
        semantic: [this.SEMANTIC_CATEGORIES.HUMAN, this.SEMANTIC_CATEGORIES.ANIMATE, this.SEMANTIC_CATEGORIES.LIVING, this.SEMANTIC_CATEGORIES.ADULT]
      }
    }
    
    const pronoun = personalPronouns[personKey as keyof typeof personalPronouns]
    return {
      key: personKey,
      kifuliiru: pronoun.kifuliiru,
      english: pronoun.english,
      prefix: pronoun.prefix,
      semantic: pronoun.semantic
    }
  }

  /**
   * Get a random verb from the verbs database
   */
  private getRandomVerb(): VerbData {
    const verbs = this.verbsSystem.generateVerbData();
    return pickRandom(verbs, "Verbs");
  }

  private getRandomAdjective() {
    const adjKeys = Object.keys(this.lexicon.adjectives);
    const adjKey = pickRandom(adjKeys, "Adjectives");
    return this.lexicon.adjectives[adjKey]!;
  }

  private getRandomAdverb() {
    const advKeys = Object.keys(this.lexicon.adverbs);
    const advKey = pickRandom(advKeys, "Adverbs");
    return this.lexicon.adverbs[advKey]!;
  }

  private getRandomPlaceAdverb() {
    const placeKeys = Object.keys(this.lexicon.placeAdverbs);
    const placeKey = pickRandom(placeKeys, "Place adverbs");
    return this.lexicon.placeAdverbs[placeKey]!;
  }

  private getRandomTimeAdverb() {
    const timeKeys = Object.keys(this.lexicon.timeAdverbs);
    const timeKey = pickRandom(timeKeys, "Time adverbs");
    return this.lexicon.timeAdverbs[timeKey]!;
  }

  /**
   * Extract root from verb (remove 'Uku' prefix)
   */
  private extractRoot(verb: string): string {
    if (verb.startsWith('Uku')) {
      return verb.slice(3)
    }
    return verb
  }

  /**
   * Conjugate a verb using the existing conjugation engine
   */
  private conjugateVerb(verb: VerbData, person: any, tense: string = 'present', negative: boolean = false): string {
    try {
      const conjugationResult = kifuliiruConjugationEngine.conjugateVerb(verb, tense, person.key, negative)
      console.log(`Conjugating ${verb.verbKifuliiru} for ${person.key}: ${conjugationResult.kifuliiru}`)
      return conjugationResult.kifuliiru
    } catch (error) {
      console.error('Conjugation error:', error)
      // Fallback to simple conjugation
      const root = this.extractRoot(verb.verbKifuliiru)
      return `${person.prefix}${root}a`
    }
  }

  /**
   * Get a random noun with semantic data
   */
  private getRandomNoun() {
    const allNouns = Object.values(this.lexicon.nouns).flatMap((category) =>
      Object.entries(category).map(([kifuliiru, data]) => ({
        kifuliiru,
        english: data.english,
        semantic: data.semantic,
      })),
    );
    return pickRandom(allNouns, "Nouns");
  }
  private translateToFrench(english: string): string {
    // Simple French translations - in a real app, you'd use a translation service
    const translations: { [key: string]: string } = {
      'I go': 'Je vais',
      'You work': 'Vous travaillez',
      'He eats': 'Il mange',
      'We sleep': 'Nous dormons',
      'They run': 'Ils courent'
    }
    return translations[english] || `[FR] ${english}`
  }

  /**
   * Translate to Kiswahili (simplified)
   */
  private translateToKiswahili(english: string): string {
    // Simple Kiswahili translations - in a real app, you'd use a translation service
    const translations: { [key: string]: string } = {
      'I go': 'Ninaenda',
      'You work': 'Unafanya kazi',
      'He eats': 'Anakula',
      'We sleep': 'Tunalala',
      'They run': 'Wanakimbia'
    }
    return translations[english] || `[SW] ${english}`
  }

  /**
   * Generate French translation
   */
  private generateFrenchTranslation(template: SentenceTemplate): string {
    const translations: { [key: string]: string } = {
      'Nyehe nagenda.': 'Je vais.',
      'Wehe wakola.': 'Tu travailles.',
      'Yehe alya.': 'Il/Elle mange.',
      'Twehe twanywa.': 'Nous buvons.',
      'Mwehe mwija.': 'Vous venez.',
      'Bohe bagaluka.': 'Ils/Elles retournent.'
    }
    
    return translations[template.kifuliiru] || `[Traduction française: ${template.english}]`
  }

  /**
   * Generate Kiswahili translation
   */
  private generateKiswahiliTranslation(template: SentenceTemplate): string {
    const translations: { [key: string]: string } = {
      'Nyehe nagenda.': 'Ninaenda.',
      'Wehe wakola.': 'Unafanya kazi.',
      'Yehe alya.': 'Anakula.',
      'Twehe twanywa.': 'Tunakunywa.',
      'Mwehe mwija.': 'Mnakuja.',
      'Bohe bagaluka.': 'Wanarudi.'
    }
    
    return translations[template.kifuliiru] || `[Tafsiri ya Kiswahili: ${template.english}]`
  }

  /**
   * Generate grammar notes for a sentence
   */
  private generateGrammarNotes(template: SentenceTemplate): string {
    const notes: { [key: string]: string } = {
      'Nyehe nagenda.': 'First person singular with "na-" prefix',
      'Wehe wakola.': 'Second person singular with "wa-" prefix',
      'Yehe alya.': 'Third person singular with "a-" prefix',
      'Twehe twanywa.': 'First person plural with "twa-" prefix',
      'Mwehe mwija.': 'Second person plural with "mwa-" prefix',
      'Bohe bagaluka.': 'Third person plural with "ba-" prefix'
    }
    
    return notes[template.kifuliiru] || 'Standard Kifuliiru grammar patterns'
  }

  /**
   * Get available categories
   */
  getAvailableCategories(): Array<{ id: string; name: string; description: string }> {
    return [
      { id: 'greetings', name: 'Greetings', description: 'Basic greetings and introductions' },
      { id: 'family', name: 'Family', description: 'Family members and relationships' },
      { id: 'daily_life', name: 'Daily Life', description: 'Everyday activities and routines' },
      { id: 'food', name: 'Food', description: 'Eating, cooking, and food-related topics' },
      { id: 'weather', name: 'Weather', description: 'Weather conditions and seasons' },
      { id: 'education', name: 'Education', description: 'School, learning, and studying' },
      { id: 'work', name: 'Work', description: 'Job responsibilities and workplace' },
      { id: 'health', name: 'Health', description: 'Health, symptoms, and medical topics' },
      { id: 'emotions', name: 'Emotions', description: 'Feelings and emotional expressions' },
      { id: 'travel', name: 'Travel', description: 'Directions, transportation, and travel' },
      { id: 'shopping', name: 'Shopping', description: 'Buying and selling activities' }
    ]
  }

  /**
   * Get available difficulties
   */
  getAvailableDifficulties(): Array<{ id: string; name: string; description: string }> {
    return [
      { id: 'beginner', name: 'Beginner', description: 'Simple, common phrases' },
      { id: 'intermediate', name: 'Intermediate', description: 'More complex structures' },
      { id: 'advanced', name: 'Advanced', description: 'Sophisticated expressions' }
    ]
  }

  /**
   * Get sentence statistics
   */
  getSentenceStatistics(): { total: number; byCategory: { [key: string]: number }; byDifficulty: { [key: string]: number } } {
    const byCategory: { [key: string]: number } = {}
    const byDifficulty: { [key: string]: number } = {}

    this.sentenceTemplates.forEach(template => {
      byCategory[template.category] = (byCategory[template.category] || 0) + 1
      byDifficulty[template.difficulty] = (byDifficulty[template.difficulty] || 0) + 1
    })

    return {
      total: this.sentenceTemplates.length,
      byCategory,
      byDifficulty
    }
  }
}
