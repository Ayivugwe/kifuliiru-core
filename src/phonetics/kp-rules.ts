/**
 * Kifuliiru Phonetics (KP) — grapheme rules and documented rule registry.
 * Migrated from kifuliiru-phonetics-dashboard/lib/kp.ts (lexicon stays in Lab DB).
 */

import type { KpDocumentedRule, KpUnit } from "./types.js";

export type GraphemeRule = {
  source: string
  ipa: string
  status: KpUnit['status']
}

export const LONG_VOWELS: Record<string, string> = {
  aa: 'aː',
  ee: 'eː',
  ii: 'iː',
  oo: 'oː',
  uu: 'uː',
}

/** Swahili-style consonant digraphs (one segment, not split). */
export const SWAHILI_DIGRAPHS: Record<string, GraphemeRule> = {
  ny: { source: 'ny', ipa: 'ɲ', status: 'verified' },
  sh: { source: 'sh', ipa: 'ʃ', status: 'verified' },
  ch: { source: 'ch', ipa: 'tʃ', status: 'verified' },
  dh: { source: 'dh', ipa: 'ð', status: 'candidate' },
  gh: { source: 'gh', ipa: 'ɣ', status: 'candidate' },
  kh: { source: 'kh', ipa: 'x', status: 'candidate' },
  th: { source: 'th', ipa: 'θ', status: 'candidate' },
}

export const SINGLE_GRAPHEME_IPA: Record<string, string> = {
  a: 'a',
  e: 'e',
  i: 'i',
  o: 'o',
  u: 'u',
  d: 'd',
  f: 'f',
  g: 'g',
  h: 'h',
  k: 'k',
  l: 'l',
  m: 'm',
  n: 'n',
  p: 'p',
  r: 'r',
  s: 's',
  t: 't',
  v: 'v',
  w: 'w',
  y: 'j',
  z: 'z',
  j: 'ʒ',
}

export const PRENASALIZED_IPA: Record<string, string> = {
  ng: 'ŋɡ',
  nj: 'ndʒ',
  nk: 'ŋk',
  nch: 'ntʃ',
  nsh: 'nʃ',
  mch: 'mtʃ',
  msh: 'mʃ',
}

/** For rules UI / docs — grouped onset families (Swahili baseline). */
export const ONSET_RULE_SUMMARY = {
  prenasalizedN:
    'nb nc nd nf ng nh nj nk nl nm np nr ns nt nv nw nx nz nch nsh …',
  prenasalizedM:
    'mb mf mv mp mt ms mk mg mn ml mr mz mj my mw md mch msh …',
  glide: 'consonant + w/y (bw, lw, kw, …) when not already a prenasalized onset',
  swahiliDigraphs: 'ny sh ch (+ dh gh kh th as loan orthography)',
} as const

/** Human-readable rule list (formerly phonetics dashboard /rules page). */
export const KP_DOCUMENTED_RULES: KpDocumentedRule[] = [
  {
    id: 'double-vowels',
    name: 'Double vowels',
    mapping: 'aa · ee · ii · oo · uu',
    meaning: 'One continued vowel, not two',
    status: 'verified',
  },
  {
    id: 'soft-b',
    name: 'Soft b',
    mapping: 'b → bh → [β̞]',
    meaning: 'Soft wherever b occurs (incl. mb → mbh)',
    status: 'verified',
  },
  {
    id: 'soft-j',
    name: 'Soft j',
    mapping: 'j → [ʒ]',
    meaning: 'Like j in French “jour”',
    status: 'verified',
  },
  {
    id: 'prenasalized-n',
    name: 'Prenasalized n- (Bantu / Swahili)',
    mapping: 'nd · ng · nj · nk · ns · nt · …',
    meaning: `One syllable onset — ${ONSET_RULE_SUMMARY.prenasalizedN}`,
    status: 'verified',
  },
  {
    id: 'prenasalized-m',
    name: 'Prenasalized m- (Bantu / Swahili)',
    mapping: 'mb · mp · mv · mt · …',
    meaning: `One syllable onset — ${ONSET_RULE_SUMMARY.prenasalizedM}`,
    status: 'verified',
  },
  {
    id: 'glide-onsets',
    name: 'Glide onsets',
    mapping: 'bw · lw · kw · … + w/y',
    meaning: ONSET_RULE_SUMMARY.glide,
    status: 'verified',
  },
  {
    id: 'swahili-digraphs',
    name: 'Swahili digraphs',
    mapping: 'ny · sh · ch',
    meaning: ONSET_RULE_SUMMARY.swahiliDigraphs,
    status: 'verified',
  },
  {
    id: 'loan-digraphs',
    name: 'dh / gh / kh / th',
    mapping: 'Arabic-loan orthography in Swahili',
    meaning: 'Candidate IPA',
    status: 'review',
  },
  {
    id: 'velar-nasal-alone',
    name: 'Velar nasal alone',
    mapping: "ng′ (future)",
    meaning: "Swahili ng'ombe — not split from prenasalized ng-",
    status: 'review',
  },
]

export function ipaForPrenasalized(source: string): string {
  if (PRENASALIZED_IPA[source]) return PRENASALIZED_IPA[source]
  return source
}

export function buildPrenasalizedOnsets(): Record<string, GraphemeRule> {
  const out: Record<string, GraphemeRule> = {}
  const nasalStops = 'bdfghjklmnpqrstvwxyz'

  const nSecond = nasalStops.replace('y', '')
  for (const c of nSecond) {
    const source = `n${c}`
    if (source === 'ny') continue
    out[source] = {
      source,
      ipa: ipaForPrenasalized(source),
      status: 'verified',
    }
  }

  for (const c of nasalStops) {
    if (c === 'y') continue
    const source = `m${c}`
    out[source] = {
      source,
      ipa: ipaForPrenasalized(source),
      status: 'verified',
    }
  }

  for (const key of Object.keys(PRENASALIZED_IPA)) {
    out[key] = {
      source: key,
      ipa: PRENASALIZED_IPA[key],
      status: 'verified',
    }
  }

  return out
}

export const PRENASALIZED_ONSETS = buildPrenasalizedOnsets()

function ipaForGlideOnset(source: string): string {
  const consonant = source[0]
  const glide = source[1]
  const base = consonant === 'b' ? 'β̞' : (SINGLE_GRAPHEME_IPA[consonant] ?? consonant)
  return glide === 'w' ? `${base}ʷ` : `${base}j`
}

export function buildGlideOnsets(): Record<string, GraphemeRule> {
  const out: Record<string, GraphemeRule> = {}
  const consonants = 'bdfghjklmnpqrstvwxyz'.replace(/[wy]/g, '')

  for (const c of consonants) {
    for (const glide of ['w', 'y'] as const) {
      const source = `${c}${glide}`
      if (PRENASALIZED_ONSETS[source]) continue
      if (SWAHILI_DIGRAPHS[source]) continue
      out[source] = {
        source,
        ipa: ipaForGlideOnset(source),
        status: 'verified',
      }
    }
  }

  return out
}

export const GLIDE_ONSETS = buildGlideOnsets()

let tokenPatterns: GraphemeRule[] | null = null

export function getTokenPatterns(): GraphemeRule[] {
  if (tokenPatterns) return tokenPatterns

  const seen = new Set<string>()
  const patterns: GraphemeRule[] = []

  const add = (rule: GraphemeRule) => {
    if (seen.has(rule.source)) return
    seen.add(rule.source)
    patterns.push(rule)
  }

  for (const [source, ipa] of Object.entries(LONG_VOWELS)) {
    add({ source, ipa, status: 'verified' })
  }

  for (const rule of Object.values(PRENASALIZED_ONSETS)) add(rule)
  for (const rule of Object.values(SWAHILI_DIGRAPHS)) add(rule)
  for (const rule of Object.values(GLIDE_ONSETS)) add(rule)

  patterns.sort((a, b) => b.source.length - a.source.length)
  tokenPatterns = patterns
  return patterns
}
