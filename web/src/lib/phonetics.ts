// ============================================================================
// FLUENTIA • MOTOR DE PRONUNCIACIÓN FIGURADA EN ESPAÑOL ("CÓMO SE LEE")
// Convierte texto en inglés y transcripciones IPA en fonética intuitiva en español
// para que cualquier estudiante sepa exactamente cómo articularlo sin tecnicismos
// ============================================================================

const DICTIONARY: Record<string, string> = {
  // Saludos y Cortesía
  hello: 'jelóu',
  hi: 'jai',
  welcome: 'uélkam',
  to: 'tu',
  london: 'Lóndon',
  good: 'gud',
  morning: 'mórning',
  afternoon: 'áfter-nun',
  evening: 'ív-ning',
  night: 'náit',
  please: 'plis',
  thank: 'zenk',
  thanks: 'zenks',
  you: 'iu',
  'thank you': 'zenk iu',
  welcome_back: 'uélkam bak',

  // Pronombres y Verbo To Be
  i: 'ai',
  'i am': 'ai am',
  "i'm": 'aim',
  you_re: 'iur',
  "you're": 'iur',
  he: 'ji',
  "he's": 'jis',
  she: 'shi',
  "she's": 'shis',
  it: 'it',
  "it's": 'its',
  we: 'ui',
  "we're": 'uier',
  they: 'dei',
  "they're": 'deir',
  am: 'am',
  is: 'is',
  are: 'ar',
  was: 'uas',
  were: 'uer',
  be: 'bi',
  been: 'bin',
  being: 'bíing',

  // Palabras comunes de conversación
  yes: 'yes',
  no: 'nóu',
  from: 'from',
  david: 'Déivid',
  nicaragua: 'Nikarágua',
  very: 'véri',
  excited: 'eksáited',
  here: 'jíar',
  there: 'der',
  for: 'for',
  the: 'de',
  workshop: 'uórk-shop',
  wonderful: 'uónderful',
  thirty: 'zérti',
  years: 'íars',
  old: 'óuld',
  'years old': 'íars óuld',
  or: 'or',
  twenty: 'tuénti',
  five: 'fáiv',
  'twenty-five': 'tuénti-fáiv',
  colleague: 'kólig',
  my: 'mai',
  your: 'iur',
  his: 'jis',
  her: 'jer',
  our: 'áuar',
  their: 'deir',
  perfect: 'pérfekt',
  this: 'dis',
  that: 'dat',
  these: 'diis',
  those: 'dous',
  access: 'ákses',
  badge: 'badch',
  and: 'and',
  room: 'rum',
  four: 'for',
  'four-b': 'for-bi',
  much: 'mach',
  'so much': 'so mach',
  second: 'sékond',
  floor: 'flor',
  on: 'on',
  in: 'in',
  at: 'at',
  ready: 'rédi',
  have: 'jav',
  has: 'jas',
  had: 'jad',
  do: 'du',
  does: 'das',
  did: 'did',
  can: 'kan',
  could: 'kud',
  would: 'uud',
  should: 'shud',
  will: 'uil',
  must: 'mast',
  say: 'sei',
  says: 'ses',
  said: 'sed',
  go: 'góu',
  goes: 'góus',
  went: 'uent',
  come: 'kam',
  see: 'si',
  saw: 'so',
  look: 'luk',
  know: 'nóu',
  think: 'zink',
  take: 'teik',
  make: 'meik',
  get: 'guet',
  give: 'guiv',
  help: 'jelp',
  need: 'niid',
  want: 'uont',
  like: 'láik',
  love: 'lov',
  study: 'stádi',
  work: 'uork',
  learn: 'lern',
  speak: 'spiik',
  listen: 'lísen',
  read: 'riid',
  write: 'ráit',
  understand: 'ander-stánd',
  people: 'pípol',
  student: 'stiúdent',
  professor: 'proféser',
  university: 'iuni-vérsiti',
  campus: 'kámpas',
  library: 'láibrari',
  book: 'buk',
  class: 'klas',
  course: 'kors',
  time: 'táim',
  day: 'déi',
  week: 'uiik',
  today: 'tudéi',
  tomorrow: 'tumórou',
  yesterday: 'iéstardei',
  now: 'náu',
  always: 'ólueis',
  often: 'ófen',
  never: 'néver',
  sometimes: 'sámtaims',
  where: 'uer',
  what: 'uat',
  when: 'uen',
  who: 'ju',
  why: 'uai',
  how: 'jau',
  which: 'uich',
  about: 'abáut',
  with: 'uid',
  without: 'uid-áut',
  because: 'bikós',
  but: 'bat',
  so: 'sóu',
  if: 'if',
  then: 'den',
  all: 'ol',
  any: 'éni',
  some: 'sam',
  every: 'évri',
  first: 'ferst',
  last: 'last',
  new: 'niú',
  great: 'gréit',
  big: 'big',
  small: 'smol',
  fast: 'fast',
  slow: 'slóu',
  easy: 'ísi',
  hard: 'jard',
};

// Transforma fonética IPA pura a lectura aproximada en español
export function ipaToSpanishPhonetic(ipa: string): string {
  if (!ipa) return '';
  let res = ipa
    .replace(/^\/|\/$/g, '') // Quitar barras
    .replace(/[ˈˌ]/g, '')     // Quitar marcas de acento técnico
    .replace(/dʒ/g, 'dch')
    .replace(/tʃ/g, 'ch')
    .replace(/θ/g, 'z')
    .replace(/ð/g, 'd')
    .replace(/ʃ/g, 'sh')
    .replace(/ʒ/g, 'zh')
    .replace(/ŋ/g, 'ng')
    .replace(/j/g, 'y')
    .replace(/w/g, 'u')
    .replace(/aɪ/g, 'ai')
    .replace(/eɪ/g, 'ei')
    .replace(/ɔɪ/g, 'oi')
    .replace(/aʊ/g, 'au')
    .replace(/oʊ|əʊ/g, 'ou')
    .replace(/iː|ɪ/g, 'i')
    .replace(/uː|ʊ/g, 'u')
    .replace(/e|ɛ/g, 'e')
    .replace(/æ/g, 'a')
    .replace(/ɑː|ɒ|ɔː/g, 'o')
    .replace(/ʌ|ə/g, 'a')
    .replace(/ɜː|ɜr/g, 'er')
    .replace(/ː/g, '');

  return res.trim();
}

// Obtiene la pronunciación figurada amigable para hispanohablantes ("cómo se lee")
export function getFigurativePronunciation(enText: string, ipa?: string): string {
  if (!enText) return '';

  // Limpiar signos al principio y final para procesar palabras
  const cleanPunctuation = (w: string) => w.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '');

  const words = enText.split(/\s+/);
  const translatedWords = words.map(rawWord => {
    // Manejar palabras compuestas con guion (ej. twenty-five)
    if (rawWord.includes('-')) {
      const parts = rawWord.split('-');
      const translatedParts = parts.map(p => {
        const c = cleanPunctuation(p).toLowerCase();
        return DICTIONARY[c] || c;
      });
      return translatedParts.join('-');
    }

    const clean = cleanPunctuation(rawWord).toLowerCase();
    if (!clean) return rawWord;

    // 1. Coincidencia directa en diccionario
    if (DICTIONARY[clean]) {
      const trans = DICTIONARY[clean];
      // Preservar mayúscula si la original la tenía
      const isCap = rawWord[0] === rawWord[0].toUpperCase() && rawWord[0] !== rawWord[0].toLowerCase();
      const formatted = isCap ? trans.charAt(0).toUpperCase() + trans.slice(1) : trans;
      // Re-adjuntar puntuación
      const pre = rawWord.match(/^[^\w\s]+/)?.[0] || '';
      const post = rawWord.match(/[^\w\s]+$/)?.[0] || '';
      return pre + formatted + post;
    }

    // 2. Si no está en el diccionario y hay IPA disponible para toda la frase
    return null;
  });

  // Si todas o casi todas las palabras se resolvieron con el diccionario:
  const resolvedCount = translatedWords.filter(w => w !== null).length;
  if (resolvedCount >= Math.ceil(words.length * 0.75)) {
    return translatedWords.map((w, idx) => w || words[idx]).join(' ');
  }

  // 3. Fallback: Si hay IPA, convertirla a español legible
  if (ipa) {
    const fromIpa = ipaToSpanishPhonetic(ipa);
    if (fromIpa) return fromIpa;
  }

  // 4. Fallback final: Devolver palabras con reglas fonéticas básicas en español
  return words.map(w => {
    const c = cleanPunctuation(w).toLowerCase();
    return DICTIONARY[c] || c;
  }).join(' ');
}
