import tables from '../data/gen3-char-tables.json';

/** PKHeX `StringConverter3.TerminatorByte` as decoded char (stops read). */
const TERMINATOR = '\u00FF';
const QUOTE_LEFT_BYTE = 0xb1;
const QUOTE_RIGHT_BYTE = 0xb2;

const G3_EN: string[] = tables.G3_EN;
const G3_JP: string[] = tables.G3_JP;

/** PKHeX `LanguageID` values used for Gen 3 quote display. */
function getQuoteLeft(language: number): string {
  switch (language) {
    case 3:
      return '«';
    case 5:
      return '„';
    case 2:
    case 4:
    case 7:
      return '\u201c';
    default:
      return '\u300e';
  }
}

function getQuoteRight(language: number): string {
  switch (language) {
    case 3:
      return '»';
    case 5:
      return '\u201c';
    case 2:
    case 4:
    case 7:
      return '\u201d';
    default:
      return '\u300f';
  }
}

/**
 * Decode Gen 3 in-save nickname / OT string (PKHeX `StringConverter3.GetString`).
 * `language` is the PKM language byte (e.g. 1 = Japanese, 2 = English).
 */
export function readGen3EncodedString(data: Uint8Array, offset: number, maxBytes: number, language: number): string {
  const jp = language === 1;
  const table = jp ? G3_JP : G3_EN;
  const chars: string[] = [];
  for (let i = 0; i < maxBytes; i++) {
    const pos = offset + i;
    if (pos >= data.length) break;
    const value = data[pos]!;
    if (value === 0xff) break;
    let c: string;
    if (value === QUOTE_LEFT_BYTE) c = getQuoteLeft(language);
    else if (value === QUOTE_RIGHT_BYTE) c = getQuoteRight(language);
    else c = table[value] ?? TERMINATOR;
    if (c === TERMINATOR) break;
    chars.push(c);
  }
  return chars.join('');
}
