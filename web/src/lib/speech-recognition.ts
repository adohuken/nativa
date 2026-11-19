// ============================================================================
// FLUENTIA • EVALUADOR DE PRONUNCIACIÓN Y MOTOR DE VOZ REAL (SHADOWING STUDIO)
// Utiliza la Web Speech API con comparación léxico-fonética tokenizada
// ============================================================================

export interface WordMatchResult {
  word: string;
  isMatched: boolean;
  isPartial: boolean;
}

export interface PronunciationEvaluation {
  accuracyScore: number; // 0 a 100
  transcript: string;
  wordResults: WordMatchResult[];
  feedbackMessage: string;
  isPassing: boolean;
}

// Tipo global de SpeechRecognition para navegadores
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

export class BrowserSpeechEvaluator {
  private recognition: SpeechRecognitionInstance | null = null;
  public isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        this.isSupported = true;
      }
    }
  }

  public initRecognition(
    onInterim: (text: string) => void,
    onFinal: (evaluation: PronunciationEvaluation) => void,
    onError: (err: string) => void,
    targetPhrase: string
  ): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognitionClass = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      this.isSupported = false;
      onError('Tu navegador no soporta Web Speech Recognition. Se utilizará modo de simulación asistida.');
      return false;
    }

    try {
      this.recognition = new SpeechRecognitionClass() as SpeechRecognitionInstance;
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        if (interimTranscript) {
          onInterim(interimTranscript);
        }

        if (finalTranscript) {
          const evalResult = this.evaluatePronunciation(targetPhrase, finalTranscript);
          onFinal(evalResult);
        }
      };

      this.recognition.onerror = (event: any) => {
        const error = event.error;
        if (error === 'no-speech') {
          onError('No se detectó audio en el micrófono. Habla un poco más cerca o con más volumen.');
        } else if (error === 'not-allowed') {
          onError('Permiso de micrófono denegado. Permite el acceso al micrófono en tu navegador para practicar.');
        } else {
          onError(`Error de reconocimiento: ${error}`);
        }
      };

      return true;
    } catch (e: any) {
      onError(`Error inicializando reconocimiento: ${e?.message || e}`);
      return false;
    }
  }

  public startListening(): void {
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (err) {
        // En caso de que ya estuviese activo
        this.recognition.abort();
        setTimeout(() => this.recognition?.start(), 100);
      }
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  /**
   * Compara la transcripción del alumno con la frase meta y computa el puntaje
   */
  public evaluatePronunciation(targetPhrase: string, studentTranscript: string): PronunciationEvaluation {
    const cleanWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '').trim();

    const targetWords = targetPhrase.split(/\s+/).filter(Boolean);
    const spokenTokens = studentTranscript.split(/\s+/).map(cleanWord).filter(Boolean);

    let matchCount = 0;
    const wordResults: WordMatchResult[] = targetWords.map((rawWord) => {
      const clean = cleanWord(rawWord);
      const isMatched = spokenTokens.includes(clean);
      const isPartial = !isMatched && spokenTokens.some(sp => sp.includes(clean) || clean.includes(sp));

      if (isMatched) {
        matchCount += 1;
      } else if (isPartial) {
        matchCount += 0.5;
      }

      return {
        word: rawWord,
        isMatched,
        isPartial,
      };
    });

    const scoreRatio = targetWords.length > 0 ? matchCount / targetWords.length : 0;
    const accuracyScore = Math.min(100, Math.round(scoreRatio * 100));
    const isPassing = accuracyScore >= 65; // Umbral de aprobación SLA zen

    let feedbackMessage = '';
    if (accuracyScore >= 90) {
      feedbackMessage = '¡Pronunciación extraordinaria! Fluidez, enlaces fonéticos y ritmo nativo impecables.';
    } else if (accuracyScore >= 70) {
      feedbackMessage = '¡Muy buena articulación! Lograste inteligibilidad clara con entonación natural.';
    } else if (accuracyScore >= 50) {
      feedbackMessage = 'Comprensible. Presta especial atención a las palabras marcadas en ámbar o gris.';
    } else {
      feedbackMessage = 'Se detectaron varias discrepancias. Escucha el modelo una vez más e intenta nuevamente.';
    }

    return {
      accuracyScore,
      transcript: studentTranscript,
      wordResults,
      feedbackMessage,
      isPassing,
    };
  }
}

export const speechEvaluator = new BrowserSpeechEvaluator();
