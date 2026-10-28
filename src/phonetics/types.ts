/** KP / KPG phonetic unit after tokenization */
export type KpUnit = {
  source: string
  practical: string
  ipa: string
  vowel: boolean
  long: boolean
  status: 'verified' | 'candidate'
}

export type KpRuleStatus = 'verified' | 'review'

/** Documented pronunciation rules (metadata; engine logic lives in kp-rules + kpg-engine). */
export type KpDocumentedRule = {
  id: string
  name: string
  mapping: string
  meaning: string
  status: KpRuleStatus
}

export type KpgGenerateResult = {
  text: string
  practical: string
  ipa: string
  syllables: string
  units: KpUnit[]
}
