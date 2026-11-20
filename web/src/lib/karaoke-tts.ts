// ============================================================================
// NATIVA • MOTOR DE AUDIO TTS CON RESALTADO KARAOKE EN TIEMPO REAL
// Usa la Web Speech API con sincronización fonética por palabra y fallback de ritmo.
// Asocia fonética nativa y grafía textual (Input Comprensible SLA).
// ============================================================================

export interface KaraokeWordPosition {
  paragraphIndex: number;
  wordIndex: number;
  word: string;
}

export type KaraokeCallback = (pos: KaraokeWordPosition | null) => void;
export type AccentPreference = 'uk' | 'us' | 'au';

export function getBestVoiceForAccent(accent: AccentPreference = 'uk'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetPrefix = accent === 'uk' ? 'en-gb' : accent === 'au' ? 'en-au' : 'en-us';

  // 1. Filtrar voces por el locale del acento
  const matching = voices.filter(v => {
    const l = (v.lang || '').toLowerCase().replace('_', '-');
    return l.startsWith(targetPrefix);
  });

  // 2. Priorizar voces de alta fidelidad (Natural, Google, Neural, Microsoft, Samantha, Libby, Ryan)
  const qualityVoice = matching.find(v =>
    /natural|neural|premium|google|libby|ryan|guy|jenny|natasha|karen|samantha|oliver/i.test(v.name)
  );

  if (qualityVoice) return qualityVoice;
  if (matching.length > 0) return matching[0];

  // 3. Fallback a cualquier voz en inglés de alta calidad
  const fallbackEnglish = voices.find(v => v.lang.toLowerCase().startsWith('en') && /natural|neural|google/i.test(v.name));
  return fallbackEnglish || voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0] || null;
}

export function testAccentVoice(accent: AccentPreference): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const phrase = accent === 'uk'
    ? 'Good morning! This is British English at Nativa Learning Systems.'
    : accent === 'au'
    ? 'G\'day! This is Australian English at Nativa Learning Systems.'
    : 'Hello! This is American English at Nativa Learning Systems.';

  const utterance = new SpeechSynthesisUtterance(phrase);
  const voice = getBestVoiceForAccent(accent);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

class KaraokeTTSController {
  private utterance: SpeechSynthesisUtterance | null = null;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private currentParagraph: number = 0;
  private paragraphs: string[] = [];
  private onWordCallback: KaraokeCallback | null = null;
  private onEndCallback: (() => void) | null = null;
  private timerId: any = null;
  private speechRate: number = 0.95;
  private speechLang: string = 'en-US';
  private accent: AccentPreference = 'uk';

  public get active(): boolean {
    return this.isPlaying;
  }

  public get paused(): boolean {
    return this.isPaused;
  }

  public play(
    paragraphs: string[],
    options?: {
      rate?: number;
      lang?: string;
      accent?: AccentPreference;
      onWord?: KaraokeCallback;
      onEnd?: () => void;
      startParagraphIndex?: number;
    }
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported on this browser.');
      return;
    }

    this.stop();

    this.paragraphs = paragraphs;
    this.speechRate = options?.rate || 0.95;
    this.accent = options?.accent || 'uk';
    this.speechLang = options?.lang || (this.accent === 'uk' ? 'en-GB' : this.accent === 'au' ? 'en-AU' : 'en-US');
    this.onWordCallback = options?.onWord || null;
    this.onEndCallback = options?.onEnd || null;
    this.currentParagraph = options?.startParagraphIndex || 0;
    this.isPlaying = true;
    this.isPaused = false;

    this.speakNextParagraph();
  }

  private speakNextParagraph(): void {
    if (!this.isPlaying || this.currentParagraph >= this.paragraphs.length) {
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const pText = this.paragraphs[this.currentParagraph];
    if (!pText || !pText.trim()) {
      this.currentParagraph++;
      this.speakNextParagraph();
      return;
    }

    // Dividir en palabras preservando índices
    const words = pText.split(/\s+/).filter(Boolean);
    const pIndex = this.currentParagraph;

    // Calcular offsets de inicio de cada palabra en el párrafo
    const wordOffsets: { start: number; end: number; word: string; index: number }[] = [];
    let searchPos = 0;
    words.forEach((w, idx) => {
      const start = pText.indexOf(w, searchPos);
      const end = start + w.length;
      wordOffsets.push({ start, end, word: w, index: idx });
      searchPos = end;
    });

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(pText);
    utterance.lang = this.speechLang;
    utterance.rate = this.speechRate;
    utterance.pitch = 1.0;

    // Asignar voz nativa de alta fidelidad según el acento preferido
    const voice = getBestVoiceForAccent(this.accent);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    this.utterance = utterance;

    let fallbackWordIdx = 0;
    let hasReceivedBoundary = false;

    // Sincronización precisa con onboundary nativo
    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      hasReceivedBoundary = true;
      if (event.name === 'word' || event.charIndex !== undefined) {
        const charIdx = event.charIndex;
        // Buscar qué palabra corresponde a este charIndex
        const matched = wordOffsets.find(w => charIdx >= w.start && charIdx <= w.end) 
          || wordOffsets.find(w => Math.abs(charIdx - w.start) <= 2)
          || wordOffsets[fallbackWordIdx];

        if (matched && this.onWordCallback && this.isPlaying) {
          fallbackWordIdx = matched.index;
          this.onWordCallback({
            paragraphIndex: pIndex,
            wordIndex: matched.index,
            word: matched.word
          });
        }
      }
    };

    // Temporizador de respaldo (Fallback rítmico según WPM) si onboundary no es soportado por el motor del navegador
    const avgWordDurationMs = Math.max(220, Math.round((60000 / (145 * this.speechRate))));
    this.timerId = setInterval(() => {
      if (!this.isPlaying || this.isPaused) return;
      if (!hasReceivedBoundary) {
        if (fallbackWordIdx < words.length) {
          if (this.onWordCallback) {
            this.onWordCallback({
              paragraphIndex: pIndex,
              wordIndex: fallbackWordIdx,
              word: words[fallbackWordIdx]
            });
          }
          fallbackWordIdx++;
        }
      }
    }, avgWordDurationMs);

    utterance.onend = () => {
      if (this.timerId) clearInterval(this.timerId);
      if (this.onWordCallback) this.onWordCallback(null);
      this.currentParagraph++;
      // Pequeña pausa natural zen entre párrafos (350ms)
      setTimeout(() => {
        if (this.isPlaying && !this.isPaused) {
          this.speakNextParagraph();
        }
      }, 350);
    };

    utterance.onerror = (e) => {
      if (this.timerId) clearInterval(this.timerId);
      if (this.onWordCallback) this.onWordCallback(null);
      console.warn('SpeechSynthesis error:', e);
      this.currentParagraph++;
      if (this.isPlaying && !this.isPaused) {
        this.speakNextParagraph();
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  public pause(): void {
    if (!this.isPlaying) return;
    this.isPaused = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (!this.isPlaying) return;
    this.isPaused = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public stop(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentParagraph = 0;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.onWordCallback) {
      this.onWordCallback(null);
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const karaokeTTS = new KaraokeTTSController();
