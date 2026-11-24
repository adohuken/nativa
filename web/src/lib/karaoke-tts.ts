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

  // Variables de estado de pausa y posición exacta (sin pérdida de progreso)
  private pausedCharIndex: number = 0;
  private currentWordIndex: number = 0;
  private lastWordPos: KaraokeWordPosition | null = null;
  private currentParagraphText: string = '';
  private currentWordOffsets: { start: number; end: number; word: string; index: number }[] = [];
  private resumeWatchdogId: any = null;

  public get active(): boolean {
    return this.isPlaying;
  }

  public get paused(): boolean {
    return this.isPaused;
  }

  public get wordPosition(): KaraokeWordPosition | null {
    return this.lastWordPos;
  }

  public get pausedChar(): number {
    return this.pausedCharIndex;
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

    // Si ya está pausado con los mismos párrafos, reanudar en vez de reiniciar
    if (this.isPaused && this.paragraphs === paragraphs) {
      this.resume();
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
    this.pausedCharIndex = 0;
    this.currentWordIndex = 0;
    this.lastWordPos = null;
    this.isPlaying = true;
    this.isPaused = false;

    this.speakParagraph(this.currentParagraph, 0);
  }

  private speakParagraph(pIndex: number, fromCharIndex: number = 0): void {
    if (!this.isPlaying || pIndex >= this.paragraphs.length) {
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const pText = this.paragraphs[pIndex];
    if (!pText || !pText.trim()) {
      this.currentParagraph = pIndex + 1;
      this.pausedCharIndex = 0;
      this.speakParagraph(this.currentParagraph, 0);
      return;
    }

    this.currentParagraph = pIndex;
    this.currentParagraphText = pText;

    // Dividir en palabras preservando índices globales del párrafo
    const words = pText.split(/\s+/).filter(Boolean);
    const wordOffsets: { start: number; end: number; word: string; index: number }[] = [];
    let searchPos = 0;
    words.forEach((w, idx) => {
      const start = pText.indexOf(w, searchPos);
      const end = start + w.length;
      wordOffsets.push({ start, end, word: w, index: idx });
      searchPos = end;
    });
    this.currentWordOffsets = wordOffsets;

    const safeFromChar = Math.max(0, Math.min(fromCharIndex, pText.length));
    this.pausedCharIndex = safeFromChar;

    // Si estamos reanudando desde un carácter avanzado, hablar solo el fragmento restante
    const textToSpeak = safeFromChar > 0 ? pText.slice(safeFromChar) : pText;
    if (!textToSpeak.trim()) {
      this.currentParagraph = pIndex + 1;
      this.pausedCharIndex = 0;
      this.speakParagraph(this.currentParagraph, 0);
      return;
    }

    // Cancelar cualquier utterance previo antes de lanzar el nuevo fragmento
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = this.speechLang;
    utterance.rate = this.speechRate;
    utterance.pitch = 1.0;

    const voice = getBestVoiceForAccent(this.accent);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    this.utterance = utterance;

    // Localizar palabra inicial al comenzar o reanudar
    let matchedWordIdx = wordOffsets.findIndex(w => w.start >= safeFromChar || (w.start <= safeFromChar && w.end >= safeFromChar));
    if (matchedWordIdx < 0) matchedWordIdx = 0;
    this.currentWordIndex = matchedWordIdx;

    if (this.onWordCallback && wordOffsets[matchedWordIdx]) {
      this.lastWordPos = {
        paragraphIndex: pIndex,
        wordIndex: matchedWordIdx,
        word: wordOffsets[matchedWordIdx].word
      };
      this.onWordCallback(this.lastWordPos);
    }

    let hasReceivedBoundary = false;

    // Sincronización precisa con onboundary nativo
    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (!this.isPlaying || this.isPaused) return;
      hasReceivedBoundary = true;
      if (event.name === 'word' || event.charIndex !== undefined) {
        const relCharIdx = event.charIndex !== undefined ? event.charIndex : 0;
        const absCharIdx = safeFromChar + relCharIdx;
        this.pausedCharIndex = absCharIdx;

        const matched = wordOffsets.find(w => absCharIdx >= w.start && absCharIdx <= w.end)
          || wordOffsets.find(w => Math.abs(absCharIdx - w.start) <= 2)
          || wordOffsets[matchedWordIdx];

        if (matched && this.onWordCallback && this.isPlaying && !this.isPaused) {
          matchedWordIdx = matched.index;
          this.currentWordIndex = matched.index;
          this.lastWordPos = {
            paragraphIndex: pIndex,
            wordIndex: matched.index,
            word: matched.word
          };
          this.onWordCallback(this.lastWordPos);
        }
      }
    };

    // Temporizador de respaldo si onboundary no es emitido por el motor del navegador
    if (this.timerId) clearInterval(this.timerId);
    const avgWordDurationMs = Math.max(220, Math.round((60000 / (145 * this.speechRate))));
    this.timerId = setInterval(() => {
      if (!this.isPlaying || this.isPaused) return;
      if (!hasReceivedBoundary) {
        if (matchedWordIdx < words.length) {
          this.currentWordIndex = matchedWordIdx;
          this.lastWordPos = {
            paragraphIndex: pIndex,
            wordIndex: matchedWordIdx,
            word: words[matchedWordIdx]
          };
          if (this.onWordCallback) {
            this.onWordCallback(this.lastWordPos);
          }
          if (wordOffsets[matchedWordIdx]) {
            this.pausedCharIndex = wordOffsets[matchedWordIdx].start;
          }
          matchedWordIdx++;
        }
      }
    }, avgWordDurationMs);

    utterance.onend = () => {
      // Si el utterance terminó debido a una pausa del navegador, no saltar de párrafo
      if (this.isPaused) return;
      if (this.timerId) clearInterval(this.timerId);
      this.pausedCharIndex = 0;
      this.currentWordIndex = 0;
      this.currentParagraph = pIndex + 1;
      setTimeout(() => {
        if (this.isPlaying && !this.isPaused) {
          this.speakParagraph(this.currentParagraph, 0);
        }
      }, 350);
    };

    utterance.onerror = (e) => {
      // No interpretar como error la interrupción voluntaria durante la pausa
      if (this.isPaused || (e as any)?.error === 'interrupted') return;
      if (this.timerId) clearInterval(this.timerId);
      console.warn('SpeechSynthesis error:', e);
      this.pausedCharIndex = 0;
      this.currentWordIndex = 0;
      this.currentParagraph = pIndex + 1;
      if (this.isPlaying && !this.isPaused) {
        this.speakParagraph(this.currentParagraph, 0);
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  public pause(): void {
    if (!this.isPlaying || this.isPaused) return;
    this.isPaused = true;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.resumeWatchdogId) {
      clearTimeout(this.resumeWatchdogId);
      this.resumeWatchdogId = null;
    }
    // Cancelar la síntesis para evitar que Chromium quede colgado en silencio con pause()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public resume(): void {
    if (!this.isPlaying || !this.isPaused) return;
    this.isPaused = false;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    // Reanudar inmediatamente hablando el fragmento restante desde la posición guardada
    this.speakRemainingInCurrentParagraph();
  }

  private speakRemainingInCurrentParagraph(): void {
    if (!this.isPlaying || this.isPaused) return;
    const pText = this.paragraphs[this.currentParagraph];
    if (!pText) {
      this.currentParagraph++;
      this.speakParagraph(this.currentParagraph, 0);
      return;
    }
    const fromChar = Math.max(0, Math.min(this.pausedCharIndex, pText.length));
    this.speakParagraph(this.currentParagraph, fromChar);
  }

  public stop(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentParagraph = 0;
    this.pausedCharIndex = 0;
    this.currentWordIndex = 0;
    this.lastWordPos = null;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.resumeWatchdogId) {
      clearTimeout(this.resumeWatchdogId);
      this.resumeWatchdogId = null;
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
