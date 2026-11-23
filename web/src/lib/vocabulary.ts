// ============================================================================
// FLUENTIA / NATIVA • MÓDULO DE VOCABULARIO DIARIO (DAILY DROP) Y RETO SEMANAL
// Filosofía Krashen SLA: Input comprensible contextualizado y producción guiada
// ============================================================================

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  definition: string;
  example_sentence: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  topic: string;
}

export interface UserVocabularyItem {
  id: string;
  user_id: string;
  word: string;
  definition: string;
  example_sentence: string;
  date_added: string;
  week_number: number;
  is_mastered: boolean;
}

// Banco Curado Inicial Krashen i+1 con oraciones micro-contextuales
export const CURATED_VOCABULARY_BANK: VocabularyWord[] = [
  // A1 • Fundamentos
  {
    id: 'voc-a1-01',
    level: 'A1',
    word: 'Breakfast',
    phonetic: '/ˈbrek.fəst/',
    definition: 'La primera comida del día tomada por la mañana',
    example_sentence: 'I always have warm coffee and bread for breakfast.',
    topic: 'Daily Routine'
  },
  {
    id: 'voc-a1-02',
    level: 'A1',
    word: 'Library',
    phonetic: '/ˈlaɪ.brər.i/',
    definition: 'Lugar tranquilo donde se guardan libros y se puede estudiar',
    example_sentence: 'Students read quietly in the university library every afternoon.',
    topic: 'Campus Life'
  },
  {
    id: 'voc-a1-03',
    level: 'A1',
    word: 'Schedule',
    phonetic: '/ˈskedʒ.uːl/',
    definition: 'Horario o lista de actividades organizadas por horas',
    example_sentence: 'My class schedule starts at eight in the morning.',
    topic: 'University'
  },
  {
    id: 'voc-a1-04',
    level: 'A1',
    word: 'Colleague',
    phonetic: '/ˈkɒl.iːɡ/',
    definition: 'Compañero de trabajo o de profesión',
    example_sentence: 'My colleague helped me finish the project report.',
    topic: 'Workplace'
  },
  {
    id: 'voc-a1-05',
    level: 'A1',
    word: 'Commute',
    phonetic: '/kəˈmjuːt/',
    definition: 'El viaje regular que se hace de la casa al trabajo o universidad',
    example_sentence: 'Her daily commute by metro takes thirty minutes.',
    topic: 'Transportation'
  },
  {
    id: 'voc-a1-06',
    level: 'A1',
    word: 'Polite',
    phonetic: '/pəˈlaɪt/',
    definition: 'Educado, respetuoso y cortés con los demás',
    example_sentence: 'The barista was very polite when taking our order.',
    topic: 'Social'
  },

  // A2 • Comunicación Cotidiana
  {
    id: 'voc-a2-01',
    level: 'A2',
    word: 'Deadline',
    phonetic: '/ˈded.laɪn/',
    definition: 'Fecha o momento límite en que algo debe estar terminado',
    example_sentence: 'We must submit our research paper before the Friday deadline.',
    topic: 'Academic'
  },
  {
    id: 'voc-a2-02',
    level: 'A2',
    word: 'Improve',
    phonetic: '/ɪmˈpruːv/',
    definition: 'Hacer que algo sea mejor o aumentar su calidad',
    example_sentence: 'Daily English immersion helps you improve your natural fluency.',
    topic: 'Learning'
  },
  {
    id: 'voc-a2-03',
    level: 'A2',
    word: 'Feedback',
    phonetic: '/ˈfiːd.bæk/',
    definition: 'Comentarios u orientación constructiva sobre tu desempeño',
    example_sentence: 'The professor provided valuable feedback on my essay.',
    topic: 'Academic'
  },
  {
    id: 'voc-a2-04',
    level: 'A2',
    word: 'Appointment',
    phonetic: '/əˈpɔɪnt.mənt/',
    definition: 'Cita acordada con anticipación para una reunión o consulta',
    example_sentence: 'I scheduled an appointment with the academic counselor.',
    topic: 'Services'
  },
  {
    id: 'voc-a2-05',
    level: 'A2',
    word: 'Luggage',
    phonetic: '/ˈlʌɡ.ɪdʒ/',
    definition: 'Equipaje o maletas para viajar',
    example_sentence: 'Please keep your luggage with you at the airport terminal.',
    topic: 'Travel'
  },
  {
    id: 'voc-a2-06',
    level: 'A2',
    word: 'Feature',
    phonetic: '/ˈfiː.tʃər/',
    definition: 'Característica distintiva o función especial de un sistema',
    example_sentence: 'The new mobile app includes an offline audio feature.',
    topic: 'Technology'
  },

  // B1 • Independencia & BPO
  {
    id: 'voc-b1-01',
    level: 'B1',
    word: 'Resolution',
    phonetic: '/ˌrez.əˈluː.ʃən/',
    definition: 'Solución formal a un problema o discrepancia',
    example_sentence: 'Our customer support goal is first-call resolution with empathy.',
    topic: 'Customer Service'
  },
  {
    id: 'voc-b1-02',
    level: 'B1',
    word: 'Escalate',
    phonetic: '/ˈes.kə.leɪt/',
    definition: 'Transferir un problema a un nivel superior o gerente',
    example_sentence: 'If the system error persists, we must escalate the case to engineering.',
    topic: 'BPO / Tech'
  },
  {
    id: 'voc-b1-03',
    level: 'B1',
    word: 'Discrepancy',
    phonetic: '/dɪˈskrep.ən.si/',
    definition: 'Falta de acuerdo o diferencia entre dos cifras o relatos',
    example_sentence: 'Marcus detected a minor discrepancy in the monthly invoice.',
    topic: 'Finance'
  },
  {
    id: 'voc-b1-04',
    level: 'B1',
    word: 'Rapport',
    phonetic: '/ræpˈɔːr/',
    definition: 'Relación de confianza y entendimiento mutuo entre personas',
    example_sentence: 'Building rapport with clients creates long-lasting loyalty.',
    topic: 'Communication'
  },
  {
    id: 'voc-b1-05',
    level: 'B1',
    word: 'Inquiry',
    phonetic: '/ˈɪŋ.kwə.ri/',
    definition: 'Consulta formal o solicitud de información',
    example_sentence: 'We received an urgent inquiry regarding software security.',
    topic: 'Business'
  },
  {
    id: 'voc-b1-06',
    level: 'B1',
    word: 'Acknowledge',
    phonetic: '/əkˈnɒl.ɪdʒ/',
    definition: 'Reconocer o validar formalmente lo que otra persona expresa',
    example_sentence: 'Always acknowledge the customer frustration before explaining policy.',
    topic: 'Customer Support'
  },

  // B2 • Discurso Académico y Profesional
  {
    id: 'voc-b2-01',
    level: 'B2',
    word: 'Paramount',
    phonetic: '/ˈpær.ə.maʊnt/',
    definition: 'De suma importancia, supremo o primordial',
    example_sentence: 'Data privacy is paramount when deploying cloud architecture.',
    topic: 'Strategy'
  },
  {
    id: 'voc-b2-02',
    level: 'B2',
    word: 'Feasible',
    phonetic: '/ˈfiː.zə.bəl/',
    definition: 'Factible, viable y realizable de manera práctica',
    example_sentence: 'The committee concluded that the project timeline was completely feasible.',
    topic: 'Management'
  },
  {
    id: 'voc-b2-03',
    level: 'B2',
    word: 'Leverage',
    phonetic: '/ˈlev.ər.ɪdʒ/',
    definition: 'Aprovechar al máximo una ventaja o recurso disponible',
    example_sentence: 'Nativa leverages natural speech recognition to accelerate fluency.',
    topic: 'Innovation'
  },
  {
    id: 'voc-b2-04',
    level: 'B2',
    word: 'Compelling',
    phonetic: '/kəmˈpel.ɪŋ/',
    definition: 'Convincente, persuasivo y que atrae fuertemente la atención',
    example_sentence: 'She delivered a compelling argument during the Oxford-style debate.',
    topic: 'Debate'
  },
  {
    id: 'voc-b2-05',
    level: 'B2',
    word: 'Nuance',
    phonetic: '/ˈnjuː.ɑːns/',
    definition: 'Matiz sutil en significado, tono o expresión',
    example_sentence: 'Advanced speakers understand the cultural nuance behind humor.',
    topic: 'Linguistics'
  },

  // C1 • Fluidez Avanzada & EAP
  {
    id: 'voc-c1-01',
    level: 'C1',
    word: 'Eloquent',
    phonetic: '/ˈel.ə.kwənt/',
    definition: 'Que se expresa con soltura, gracia y persuasión elegante',
    example_sentence: 'His eloquent presentation captivated the international audience.',
    topic: 'Public Speaking'
  },
  {
    id: 'voc-c1-02',
    level: 'C1',
    word: 'Meticulous',
    phonetic: '/məˈtɪk.jə.ləs/',
    definition: 'Muy preciso, detallista y cuidadoso en cada elemento',
    example_sentence: 'The research methodology required meticulous statistical cross-checking.',
    topic: 'Research'
  },
  {
    id: 'voc-c1-03',
    level: 'C1',
    word: 'Juxtapose',
    phonetic: '/ˌdʒʌk.stəˈpəʊz/',
    definition: 'Colocar dos elementos juntos para contrastar sus diferencias',
    example_sentence: 'The author juxtaposed modern tech culture with classical philosophy.',
    topic: 'Critical Thinking'
  },
  {
    id: 'voc-c1-04',
    level: 'C1',
    word: 'Resilience',
    phonetic: '/rɪˈzɪl.jəns/',
    definition: 'Capacidad de sobreponerse a crisis o fallos adaptándose con fuerza',
    example_sentence: 'Distributed software systems require architectural resilience under load.',
    topic: 'Architecture'
  },

  // C2 • Maestría Doctoral y Diplomática
  {
    id: 'voc-c2-01',
    level: 'C2',
    word: 'Perspicacious',
    phonetic: '/ˌpɜː.spɪˈkeɪ.ʃəs/',
    definition: 'De agudo entendimiento, capaz de ver lo que otros pasan por alto',
    example_sentence: 'Her perspicacious analysis exposed flaws in the treaty negotiation.',
    topic: 'Diplomacy'
  },
  {
    id: 'voc-c2-02',
    level: 'C2',
    word: 'Quintessential',
    phonetic: '/ˌkwɪn.tɪˈsen.ʃəl/',
    definition: 'El ejemplo perfecto o la representación más pura de algo',
    example_sentence: 'This paper is the quintessential demonstration of academic rigor.',
    topic: 'Doctoral'
  },
  {
    id: 'voc-c2-03',
    level: 'C2',
    word: 'Ephemeral',
    phonetic: '/ɪˈfem.ər.əl/',
    definition: 'Que dura muy poco tiempo, fugaz o pasajero',
    example_sentence: 'Online trends are ephemeral, but core communicative fluency lasts forever.',
    topic: 'Philosophy'
  }
];

const LOCAL_STORAGE_VOCAB_KEY = 'nativa_user_vocabulary';
const CLAIMED_DROPS_KEY = 'nativa_claimed_daily_drops';

export class VocabularyService {
  /**
   * Obtiene 3 palabras deterministas del banco según el día y el nivel del alumno.
   */
  public static getDailyWords(level: string = 'A1', dateStr?: string): VocabularyWord[] {
    const today = dateStr || new Date().toISOString().split('T')[0];
    const targetLevel = (level || 'A1').toUpperCase().trim();
    
    // Filtrar por nivel o niveles cercanos
    let candidates = CURATED_VOCABULARY_BANK.filter(w => w.level === targetLevel);
    if (candidates.length < 3) {
      candidates = CURATED_VOCABULARY_BANK;
    }

    // Hash numérico determinista de la fecha para que el drop sea el mismo todo el día
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = (hash << 5) - hash + today.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    const result: VocabularyWord[] = [];
    const usedIndices = new Set<number>();

    for (let i = 0; i < 3 && i < candidates.length; i++) {
      let idx = (seed + i * 7) % candidates.length;
      while (usedIndices.has(idx)) {
        idx = (idx + 1) % candidates.length;
      }
      usedIndices.add(idx);
      result.push(candidates[idx]);
    }

    return result;
  }

  /**
   * Verifica si el usuario ya reclamó el cofre de palabras hoy.
   */
  public static hasClaimedToday(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const today = new Date().toISOString().split('T')[0];
      const claimed = JSON.parse(localStorage.getItem(CLAIMED_DROPS_KEY) || '[]');
      return Array.isArray(claimed) && claimed.includes(today);
    } catch {
      return false;
    }
  }

  /**
   * Reclama las 3 palabras de hoy:
   * 1. Las guarda en Supabase (tabla user_vocabulary).
   * 2. Las guarda en localStorage.
   * 3. Las suma a las frases SRS para repasar en la vista de repaso.
   * 4. Otorga +15 XP.
   */
  public static async claimDailyDrop(
    words: VocabularyWord[],
    userId?: string
  ): Promise<{ success: boolean; xpAwarded: number }> {
    if (typeof window === 'undefined' || words.length === 0) {
      return { success: false, xpAwarded: 0 };
    }

    const today = new Date().toISOString().split('T')[0];
    const currentWeek = this.getCurrentWeekNumber();

    // 1. Marcar fecha como reclamada
    try {
      const claimed = JSON.parse(localStorage.getItem(CLAIMED_DROPS_KEY) || '[]');
      if (!claimed.includes(today)) {
        claimed.push(today);
        localStorage.setItem(CLAIMED_DROPS_KEY, JSON.stringify(claimed));
      }
    } catch {}

    // 2. Guardar en localStorage
    let currentVocab: UserVocabularyItem[] = [];
    try {
      currentVocab = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VOCAB_KEY) || '[]');
    } catch {}

    const newItems: UserVocabularyItem[] = words.map(w => ({
      id: `uv-${w.id}-${Date.now()}`,
      user_id: userId || 'local_user',
      word: w.word,
      definition: w.definition,
      example_sentence: w.example_sentence,
      date_added: today,
      week_number: currentWeek,
      is_mastered: false
    }));

    // Evitar duplicados de la misma palabra en la misma semana
    for (const newItem of newItems) {
      const exists = currentVocab.some(v => v.word.toLowerCase() === newItem.word.toLowerCase());
      if (!exists) {
        currentVocab.push(newItem);
      }
    }
    localStorage.setItem(LOCAL_STORAGE_VOCAB_KEY, JSON.stringify(currentVocab));

    // 3. Sumar al mazo SRS como Starred Phrases para que aparezcan en el repaso
    try {
      const { AppStorage } = await import('@/lib/storage');
      for (const w of words) {
        AppStorage.toggleStarredPhrase({
          id: `srs-drop-${w.id}`,
          en: w.word,
          es: `${w.definition} (Ej: ${w.example_sentence})`,
          phonetic: w.phonetic,
          context: w.example_sentence,
          lessonId: 'daily-drop',
          level: w.level
        });
      }

      // Sumar +15 XP
      AppStorage.addXp(15);
      AppStorage.triggerAutoSync();
    } catch (err) {
      console.warn('Error sincronizando vocabulario con SRS/Storage:', err);
    }

    // 4. Sincronizar en Supabase si hay sesión
    if (userId) {
      try {
        const { getSupabaseClient, isSupabaseConfigured } = await import('@/lib/supabase');
        const client = getSupabaseClient();
        if (client && isSupabaseConfigured) {
          const rowsToInsert = words.map(w => ({
            user_id: userId,
            word: w.word,
            definition: w.definition,
            example_sentence: w.example_sentence,
            date_added: today,
            week_number: currentWeek,
            is_mastered: false
          }));

          await client.from('user_vocabulary').insert(rowsToInsert);
        }
      } catch (dbErr) {
        console.warn('Supabase user_vocabulary insert error:', dbErr);
      }
    }

    return { success: true, xpAwarded: 15 };
  }

  /**
   * Obtiene las palabras aprendidas por el alumno durante la semana actual.
   */
  public static async getWeeklyVocabulary(userId?: string): Promise<UserVocabularyItem[]> {
    const currentWeek = this.getCurrentWeekNumber();

    // 1. Intentar desde Supabase
    if (userId && typeof window !== 'undefined') {
      try {
        const { getSupabaseClient, isSupabaseConfigured } = await import('@/lib/supabase');
        const client = getSupabaseClient();
        if (client && isSupabaseConfigured) {
          const { data } = await client
            .from('user_vocabulary')
            .select('*')
            .eq('user_id', userId)
            .eq('week_number', currentWeek);

          if (data && data.length > 0) {
            return data;
          }
        }
      } catch {}
    }

    // 2. Fallback a localStorage
    if (typeof window !== 'undefined') {
      try {
        const localList: UserVocabularyItem[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VOCAB_KEY) || '[]');
        return localList.filter(v => v.week_number === currentWeek);
      } catch {}
    }

    // 3. Fallback demostrativo si es nuevo usuario
    return CURATED_VOCABULARY_BANK.slice(0, 5).map(w => ({
      id: w.id,
      user_id: userId || 'local_user',
      word: w.word,
      definition: w.definition,
      example_sentence: w.example_sentence,
      date_added: new Date().toISOString().split('T')[0],
      week_number: currentWeek,
      is_mastered: false
    }));
  }

  /**
   * Evalúa el texto del reto semanal usando el evaluador de IA o heurística pedagógica.
   */
  public static async evaluateWeeklyChallenge(
    essay: string,
    targetWords: string[],
    userId?: string
  ): Promise<{
    passed: boolean;
    score: number;
    feedback: string;
    usedWords: string[];
    corrections?: string;
  }> {
    const text = essay.trim();
    const wordsInText = text.toLowerCase().split(/\s+/).filter(Boolean);
    const wordCount = wordsInText.length;

    // Detectar qué palabras objetivo fueron usadas
    const usedWords = targetWords.filter(tw => {
      const regex = new RegExp(`\\b${tw.toLowerCase()}`, 'i');
      return regex.test(text);
    });

    if (wordCount < 40) {
      return {
        passed: false,
        score: 40,
        feedback: `Tu texto tiene ${wordCount} palabras. El reto requiere un mínimo de 50 palabras para evaluar coherencia contextual y flujo narrativo.`,
        usedWords
      };
    }

    // Intentar evaluación en tiempo real a través del proxy de IA
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/ai/proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'chat',
            systemPrompt: `You are a supportive, SLA Krashen-aligned English teacher evaluating a weekly writing challenge.
The student had to write a paragraph (min 50 words) integrating these target words: [${targetWords.join(', ')}].
Return a JSON object with:
{
  "passed": boolean (true if coherent and uses at least 3 of the target words naturally),
  "score": number between 60 and 100,
  "feedback": "Encouraging Spanish feedback paragraph highlighting good communicative points",
  "corrections": "1-2 brief suggestions in Spanish for natural syntax"
}`,
            messages: [{ role: 'user', content: `Student text:\n"${text}"` }]
          }),
          signal: AbortSignal.timeout(10000)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.text) {
            try {
              const cleaned = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleaned);
              
              if (parsed.passed) {
                // Otorgar +100 XP por superar el reto semanal
                const { AppStorage } = await import('@/lib/storage');
                AppStorage.addXp(100);
                AppStorage.triggerAutoSync();
                this.markWordsAsMastered(usedWords, userId);
              }

              return {
                passed: Boolean(parsed.passed),
                score: parsed.score || 85,
                feedback: parsed.feedback || '¡Excelente integración contextual de las palabras aprendidas esta semana!',
                usedWords,
                corrections: parsed.corrections
              };
            } catch {}
          }
        }
      }
    } catch (aiErr) {
      console.warn('Evaluación por IA en fallback:', aiErr);
    }

    // Evaluación pedagógica local de respaldo
    const usedCount = usedWords.length;
    const passed = usedCount >= Math.min(3, targetWords.length) && wordCount >= 50;
    const score = passed ? Math.min(100, 75 + (usedCount * 5)) : 55;

    if (passed) {
      try {
        const { AppStorage } = await import('@/lib/storage');
        AppStorage.addXp(100);
        AppStorage.triggerAutoSync();
        this.markWordsAsMastered(usedWords, userId);
      } catch {}
    }

    return {
      passed,
      score,
      feedback: passed
        ? `¡Gran trabajo comunicativo! Lograste integrar con naturalidad ${usedCount} de las palabras de la semana en un texto de ${wordCount} palabras sin traducir mentalmente.`
        : `Lograste escribir ${wordCount} palabras, pero solo detectamos ${usedCount} de las palabras semanales. Intenta incluir al menos 3 palabras para completar el reto.`,
      usedWords,
      corrections: passed ? 'Mantén este hábito de producción contextual cada domingo.' : 'Revisa la lista de palabras pendientes arriba.'
    };
  }

  /**
   * Marca las palabras como dominadas (is_mastered: true)
   */
  private static async markWordsAsMastered(words: string[], userId?: string): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const localList: UserVocabularyItem[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VOCAB_KEY) || '[]');
      const updated = localList.map(item => {
        if (words.some(w => w.toLowerCase() === item.word.toLowerCase())) {
          return { ...item, is_mastered: true };
        }
        return item;
      });
      localStorage.setItem(LOCAL_STORAGE_VOCAB_KEY, JSON.stringify(updated));
    } catch {}

    if (userId) {
      try {
        const { getSupabaseClient } = await import('@/lib/supabase');
        const client = getSupabaseClient();
        if (client) {
          for (const w of words) {
            await client
              .from('user_vocabulary')
              .update({ is_mastered: true })
              .eq('user_id', userId)
              .ilike('word', w);
          }
        }
      } catch {}
    }
  }

  /**
   * Calcula el número de semana del año actual
   */
  private static getCurrentWeekNumber(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000;
    const oneWeek = 604800000;
    return Math.floor(diff / oneWeek) + 1;
  }
}
