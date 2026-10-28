/**
 * Kifuliiru Phonetics Generator (KPG) — applies KP rules to written Kifuliiru.
 * Lexicon / validation queue remain in Lab DB (not migrated from phonetics dashboard UI).
 */

import {
  getTokenPatterns,
  LONG_VOWELS,
  SINGLE_GRAPHEME_IPA,
  type GraphemeRule,
} from "./kp-rules.js";
import type { KpUnit, KpgGenerateResult } from "./types.js";

export type { KpUnit, KpgGenerateResult } from "./types.js";
export {
  KP_DOCUMENTED_RULES,
  ONSET_RULE_SUMMARY,
} from "./kp-rules.js";

/** Kifuliiru soft b; also inside clusters (bw → bhw, mb → mbh). */
export function practicalForSource(source: string): string {
  if (source === 'b') return 'bh'
  if (source.startsWith('b')) return `bh${source.slice(1)}`
  if (source.endsWith('b') && source.length > 1) {
    return `${source.slice(0, -1)}bh`
  }
  return source
}

function matchPattern(
  word: string,
  index: number
): (GraphemeRule & { vowel?: boolean; long?: boolean }) | null {
  for (const pattern of getTokenPatterns()) {
    if (!word.startsWith(pattern.source, index)) continue

    if (LONG_VOWELS[pattern.source]) {
      return {
        ...pattern,
        vowel: true,
        long: true,
      }
    }

    return {
      ...pattern,
      vowel: false,
      long: false,
    }
  }

  return null
}

export function tokenize(word: string): KpUnit[] {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  let i = 0
  const out: KpUnit[] = []

  while (i < w.length) {
    const matched = matchPattern(w, i)
    if (matched) {
      out.push({
        source: matched.source,
        practical: matched.vowel
          ? matched.source
          : practicalForSource(matched.source),
        ipa: matched.ipa,
        vowel: Boolean(matched.vowel),
        long: Boolean(matched.long),
        status: matched.status,
      })
      i += matched.source.length
      continue
    }

    const c = w[i]
    if (c === 'b') {
      out.push({
        source: 'b',
        practical: 'bh',
        ipa: 'β̞',
        vowel: false,
        long: false,
        status: 'verified',
      })
      i += 1
      continue
    }

    out.push({
      source: c,
      practical: c,
      ipa: SINGLE_GRAPHEME_IPA[c] ?? '?',
      vowel: 'aeiou'.includes(c),
      long: false,
      status: c === 'j' ? 'verified' : 'candidate',
    })
    i += 1
  }

  return out
}

/** Syllabify using KP units; each multigraph stays one onset block. */
export function syllabify(u: KpUnit[]): KpUnit[][] {
  if (!u.length) return []
  const r: KpUnit[][] = []
  let cur: KpUnit[] = []

  for (let i = 0; i < u.length; i++) {
    cur.push(u[i])
    if (u[i].vowel) {
      let j = i + 1
      const cs: KpUnit[] = []
      while (j < u.length && !u[j].vowel) {
        cs.push(u[j])
        j++
      }
      if (j < u.length) {
        if (cs.length > 1) {
          const keep = cs.slice(0, -1)
          cur.push(...keep)
          i += keep.length
        }
        r.push(cur)
        cur = []
      }
    }
  }

  if (cur.length) r.push(cur)
  return r
}

export function generateKpg(text: string): KpgGenerateResult {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const units: KpUnit[] = []
  const practical: string[] = []
  const ipa: string[] = []
  const syllables: string[] = []

  for (const word of words) {
    const u = tokenize(word)
    units.push(...u)
    const s = syllabify(u)
    practical.push(s.map((x) => x.map((v) => v.practical).join('')).join('.'))
    ipa.push(s.map((x) => x.map((v) => v.ipa).join('')).join(''))
    syllables.push(s.map((x) => x.map((v) => v.source).join('')).join(' · '))
  }

  return {
    text,
    practical: practical.join(' '),
    ipa: ipa.join(' '),
    syllables: syllables.join(' | '),
    units,
  }
}

/** @deprecated Alias for generateKpg — matches legacy phonetics dashboard `generate()`. */
export const generate = generateKpg
