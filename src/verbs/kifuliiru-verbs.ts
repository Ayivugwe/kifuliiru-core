/**
 * Kifuliiru Verbs System - TypeScript Migration
 * Converted from Python with full functionality preserved
 */

import type { ConjugationData, VerbData } from "../types/index.js";

export class KifuliiruVerb {
  verbKifuliiru: string
  english: string
  kiswahili: string
  french: string
  descriptionKifuliiru: string
  descriptionEnglish: string
  descriptionKiswahili: string
  descriptionFrench: string
  isIrregular: boolean
  canTakeDirectObject: boolean
  requiresObject: boolean
  verbClass: string
  root: string
  semanticCategory: string

  constructor(
    verbKifuliiru: string,
    english: string = "",
    kiswahili: string = "",
    french: string = "",
    descriptionKifuliiru: string = "",
    descriptionEnglish: string = "",
    descriptionKiswahili: string = "",
    descriptionFrench: string = "",
    isIrregular: boolean = false,
    canTakeDirectObject: boolean = true,
    requiresObject: boolean = false,
    verbClass: string = "",
    root: string = "",
    semanticCategory: string = ""
  ) {
    this.verbKifuliiru = verbKifuliiru
    this.english = english
    this.kiswahili = kiswahili
    this.french = french
    this.descriptionKifuliiru = descriptionKifuliiru
    this.descriptionEnglish = descriptionEnglish
    this.descriptionKiswahili = descriptionKiswahili
    this.descriptionFrench = descriptionFrench
    this.isIrregular = isIrregular
    this.canTakeDirectObject = canTakeDirectObject
    this.requiresObject = requiresObject
    this.verbClass = verbClass
    this.root = root
    this.semanticCategory = semanticCategory
  }
}

export class KifuliiruVerbs {
  private verbs: KifuliiruVerb[] = []
  private personalPronouns = {
    kifuliiru: ['Nyehe', 'Wehe', 'Yehe', 'Twehe', 'Mwehe', 'Bohe'],
    english: ['I', 'You', 'He/She', 'We', 'You all', 'They'],
    kiswahili: ['Mimi', 'Wewe', 'Yeye', 'Sisi', 'Ninyi', 'Wao'],
    french: ['Je', 'Tu', 'Il/Elle', 'Nous', 'Vous', 'Ils/Elles']
  }

  private presentTensePatterns = {
    regular: {
      'nyehe': 'n',      // I
      'wehe': 'o',       // You
      'yehe': 'a',       // He/She
      'twehe': 'tu',     // We
      'mwehe': 'mu',     // You all
      'bohe': 'ba'       // They
    }
  }

  constructor(initialVerbs: KifuliiruVerb[] = []) {
    this.verbs = [...initialVerbs];
  }

  /** Replace the in-memory verb list (from app DB, JSON, etc.). */
  setVerbs(verbs: KifuliiruVerb[]): void {
    this.verbs = [...verbs];
  }

  getAllVerbs(): KifuliiruVerb[] {
    return this.verbs;
  }

  findVerb(verbKifuliiru: string): KifuliiruVerb | undefined {
    return this.verbs.find((verb) => verb.verbKifuliiru === verbKifuliiru);
  }

  getVerbsByCategory(category: string): KifuliiruVerb[] {
    return this.verbs.filter(verb => verb.semanticCategory === category)
  }

  getVerbByKifuliiru(verbKifuliiru: string): KifuliiruVerb | undefined {
    return this.verbs.find(verb => verb.verbKifuliiru === verbKifuliiru)
  }

  // Helper method to generate verb data
  generateVerbData(): VerbData[] {
    return this.verbs.map(verb => {
      // Ensure root is set before generating conjugations
      if (!verb.root) {
        let root = verb.verbKifuliiru
        if (verb.verbKifuliiru.startsWith('Uku')) {
          root = verb.verbKifuliiru.slice(3)
        } else if (verb.verbKifuliiru.startsWith('Ku')) {
          root = verb.verbKifuliiru.slice(2)
        }
        verb.root = root
      }
      
      // Generate all present tense conjugations
      const presentConjugations = this.generateAllPresentConjugations(verb)
      
      return {
        verbKifuliiru: verb.verbKifuliiru,
        english: verb.english,
        french: verb.french,
        kiswahili: verb.kiswahili,
        root: verb.root,
        semanticCategory: verb.semanticCategory,
        isIrregular: verb.isIrregular,
        canTakeDirectObject: verb.canTakeDirectObject,
        requiresObject: verb.requiresObject,
        verbClass: verb.verbClass,
        conjugations: {
          present: presentConjugations[0], // First conjugation as representative
          // Store all conjugations in a custom property for easy access
          allPresent: presentConjugations
        } as any,
        metadata: {
          frequency: Math.floor(Math.random() * 100), // Placeholder
          difficulty: verb.isIrregular ? 'advanced' : 'beginner',
          usage: []
        }
      }
    })
  }

  private generateAllPresentConjugations(verb: KifuliiruVerb): any[] {
    const conjugations: any[] = []
    
    for (let i = 0; i < this.personalPronouns.kifuliiru.length; i++) {
      const pronoun = this.personalPronouns.kifuliiru[i]
      const englishPronoun = this.personalPronouns.english[i]
      
      conjugations.push({
        person: `${i + 1}${i === 0 || i === 3 ? 'sg' : 'pl'}`,
        kifuliiru: `${this.presentTensePatterns.regular[pronoun.toLowerCase() as keyof typeof this.presentTensePatterns.regular]}${verb.root}a`,
        english: `${englishPronoun} ${verb.english}`
      })
    }
    
    return conjugations
  }
}

// Export singleton instance
export const kifuliiruVerbs = new KifuliiruVerbs()
