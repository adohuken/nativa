// ============================================================================
// FLUENTIA • BANCO GLOBAL DE HISTORIAS COMPARTIDAS (CONTENT LAKE)
// Arquitectura centralizada de historias generadas por IA reutilizables
// Indexada por nivel (A1-C2) y tema para consulta O(1) y ahorro masivo de tokens.
// ============================================================================

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface GlobalStory {
  id: string;
  level: CEFRLevel;
  topic: string; // ej. "Technology", "Travel", "Call Center", "University Campus", "Customer Service"
  title: string;
  subtitle?: string;
  content: string; // El texto generado
  paragraphs: string[];
  word_count: number;
  times_read: number; // Contador de cuántas veces se ha abierto esta historia
  status: 'approved' | 'rejected'; // por defecto "approved"
  vocabulary?: Record<string, string>;
  cultural_insight?: string;
  reading_minutes: number;
  created_at: string;
}

const STORAGE_KEY = 'fluentia_global_stories_lake';

// Catálogo semilla inicial del Content Lake (Pre-generadas y aprobadas)
const SEED_GLOBAL_STORIES: GlobalStory[] = [
  {
    id: 'story-seed-cc-01',
    level: 'B1',
    topic: 'Call Center',
    title: 'The Calm Resolution • High-Volume Tier 1 Scenario',
    subtitle: 'Protocolo de empatía y contención con un cliente insatisfecho',
    content: `Elena puts on her headset as the incoming queue light flashes amber. A customer connects with a frustrated tone: "I have been waiting for my replacement unit for three days!"\n\nWithout hesitating or sounding defensive, Elena breathes calmly and applies the active listening framework: "I understand how frustrating this delay must be, Mr. Stevens. I am checking your order status right now to get this resolved for you today."\n\nHer composed demeanor immediately lowers the emotional tension. Within ninety seconds, she confirms the dispatch tracking code and issues a complimentary express delivery voucher. The customer concludes: "Thank you for actually listening."`,
    paragraphs: [
      `Elena puts on her headset as the incoming queue light flashes amber. A customer connects with a frustrated tone: "I have been waiting for my replacement unit for three days!"`,
      `Without hesitating or sounding defensive, Elena breathes calmly and applies the active listening framework: "I understand how frustrating this delay must be, Mr. Stevens. I am checking your order status right now to get this resolved for you today."`,
      `Her composed demeanor immediately lowers the emotional tension. Within ninety seconds, she confirms the dispatch tracking code and issues a complimentary express delivery voucher. The customer concludes: "Thank you for actually listening."`
    ],
    word_count: 104,
    times_read: 184,
    status: 'approved',
    vocabulary: {
      'headset': 'Auriculares profesionales con micrófono',
      'defensive': 'Actitud a la defensiva o reactiva',
      'demeanor': 'Comportamiento o porte profesional sereno',
      'complimentary': 'De cortesía / sin costo adicional'
    },
    cultural_insight: 'En atención al cliente norteamericana, validar el sentimiento del cliente ("I understand how frustrating...") antes de pedir el número de cuenta desactiva el 80% de los conflictos.',
    reading_minutes: 3,
    created_at: '2026-10-12T09:15:00Z'
  },
  {
    id: 'story-seed-cc-02',
    level: 'B2',
    topic: 'Call Center',
    title: 'De-escalating Billing Discrepancies with Tact',
    subtitle: 'Manejo asertivo de objeciones financieras y acuerdos de pago',
    content: `When dealing with unexpected billing charges, customers often perceive system errors as bad faith. Marcus, a senior resolution representative, knows that precision in phrasing determines whether a call escalates or concludes satisfactorily.\n\n"Let us examine line item number four together," Marcus suggests calmly while sharing his screen reference. "I see where the confusion arose regarding the recurring service fee. What I can do immediately is apply an account credit and align your billing cycle."\n\nBy focusing on what he CAN do rather than standard corporate disclaimers, Marcus maintains rapport and turns a cancellation risk into a loyal subscriber.`,
    paragraphs: [
      `When dealing with unexpected billing charges, customers often perceive system errors as bad faith. Marcus, a senior resolution representative, knows that precision in phrasing determines whether a call escalates or concludes satisfactorily.`,
      `"Let us examine line item number four together," Marcus suggests calmly while sharing his screen reference. "I see where the confusion arose regarding the recurring service fee. What I can do immediately is apply an account credit and align your billing cycle."`,
      `By focusing on what he CAN do rather than standard corporate disclaimers, Marcus maintains rapport and turns a cancellation risk into a loyal subscriber.`
    ],
    word_count: 112,
    times_read: 231,
    status: 'approved',
    vocabulary: {
      'discrepancy': 'Discrepancia o inconsistencia en cuentas',
      'de-escalate': 'Reducir la tensión de un conflicto',
      'rapport': 'Conexión y sintonía interpersonal',
      'disclaimer': 'Descargo de responsabilidad o cláusula'
    },
    cultural_insight: 'El lenguaje asertivo positivo ("What I can do is...") es 10 veces más persuasivo que decir "Our policy does not allow...".',
    reading_minutes: 3,
    created_at: '2026-10-18T14:20:00Z'
  },
  {
    id: 'story-seed-tech-01',
    level: 'A2',
    topic: 'Technology',
    title: 'The Morning Standup Meeting',
    subtitle: 'Vocabulario ágil y actualización diaria de tareas en equipo de software',
    content: `Every weekday at nine thirty, the engineering team joins a fifteen-minute video call called the standup.\n\nSophie speaks first: "Yesterday, I completed the login page design and fixed two bugs in the database. Today, I am going to build the user profile settings. I do not have any blockers."\n\nHer teammate Alex smiles: "Great job, Sophie. If you need assistance with the authentication token, let me know this afternoon." The team aligns quickly and starts coding.`,
    paragraphs: [
      `Every weekday at nine thirty, the engineering team joins a fifteen-minute video call called the standup.`,
      `Sophie speaks first: "Yesterday, I completed the login page design and fixed two bugs in the database. Today, I am going to build the user profile settings. I do not have any blockers."`,
      `Her teammate Alex smiles: "Great job, Sophie. If you need assistance with the authentication token, let me know this afternoon." The team aligns quickly and starts coding.`
    ],
    word_count: 85,
    times_read: 312,
    status: 'approved',
    vocabulary: {
      'standup': 'Reunión diaria breve de sincronización ágil',
      'blockers': 'Obstáculos o impedimentos que detienen una tarea',
      'authentication': 'Verificación de identidad y seguridad de usuario'
    },
    cultural_insight: 'En equipos de desarrollo internacionales, el reporte diario sigue la tríada: qué hice ayer, qué haré hoy y si tengo bloqueos.',
    reading_minutes: 2,
    created_at: '2026-10-25T11:00:00Z'
  },
  {
    id: 'story-seed-tech-02',
    level: 'B2',
    topic: 'Technology',
    title: 'Deploying Without Downtime: The Blue-Green Pipeline',
    subtitle: 'Arquitectura de despliegue continuo y resiliencia en la nube',
    content: `The lead DevOps architect monitors the telemetry dashboard as the deployment command executes. In high-traffic environments, a few seconds of server unavailability can translate to thousands in lost transactions.\n\n"Traffic is shifting from the blue cluster to the green staging cluster," she announces to the release channel. "All health checks are returning two hundred OK, and latency metrics remain well below fifty milliseconds."\n\nWith zero dropped connections, the new microservice is live globally, proving the value of automated continuous integration.`,
    paragraphs: [
      `The lead DevOps architect monitors the telemetry dashboard as the deployment command executes. In high-traffic environments, a few seconds of server unavailability can translate to thousands in lost transactions.`,
      `"Traffic is shifting from the blue cluster to the green staging cluster," she announces to the release channel. "All health checks are returning two hundred OK, and latency metrics remain well below fifty milliseconds."`,
      `With zero dropped connections, the new microservice is live globally, proving the value of automated continuous integration.`
    ],
    word_count: 89,
    times_read: 156,
    status: 'approved',
    vocabulary: {
      'telemetry': 'Métricas y monitoreo en tiempo real de sistemas',
      'downtime': 'Tiempo de inactividad no planificado del servidor',
      'latency': 'Tiempo de respuesta o retraso de red'
    },
    cultural_insight: 'La cultura de ingeniería moderna valora la automatización transparente ("boring deployments") por encima de los lanzamientos manuales heroicos.',
    reading_minutes: 3,
    created_at: '2026-11-02T16:45:00Z'
  },
  {
    id: 'story-seed-travel-01',
    level: 'A1',
    topic: 'Travel',
    title: 'Arriving at London Heathrow Terminal 5',
    subtitle: 'Instrucciones sencillas de orientación, metro y equipaje',
    content: `Carlos lands at Heathrow Airport after a long flight. He follows the yellow signs that say "Arrivals and Baggage Reclaim".\n\nAt the customs desk, the immigration officer asks: "What is the purpose of your visit to the United Kingdom?" Carlos answers clearly: "I am visiting for two weeks as a tourist."\n\nThe officer stamps his passport: "Welcome to London. Enjoy your stay." Carlos collects his red suitcase and takes the Underground train directly to central London.`,
    paragraphs: [
      `Carlos lands at Heathrow Airport after a long flight. He follows the yellow signs that say "Arrivals and Baggage Reclaim".`,
      `At the customs desk, the immigration officer asks: "What is the purpose of your visit to the United Kingdom?" Carlos answers clearly: "I am visiting for two weeks as a tourist."`,
      `The officer stamps his passport: "Welcome to London. Enjoy your stay." Carlos collects his red suitcase and takes the Underground train directly to central London.`
    ],
    word_count: 83,
    times_read: 429,
    status: 'approved',
    vocabulary: {
      'baggage reclaim': 'Área de recogida de equipaje',
      'customs': 'Aduana y control migratorio',
      'underground': 'El metro de Londres (el "Tube")'
    },
    cultural_insight: 'En el Reino Unido, decir "please" y "thank you" con tono tranquilo en los controles de aduana genera una interacción rápida y amable.',
    reading_minutes: 2,
    created_at: '2026-10-05T08:00:00Z'
  },
  {
    id: 'story-seed-univ-01',
    level: 'B1',
    topic: 'University Campus',
    title: 'Library Research & Academic Referencing',
    subtitle: 'Navegación por el archivo universitario y citas bibliográficas',
    content: `The Radcliffe Science Library is quiet, bathed in the soft glow of reading lamps. Sofia sits at a wooden study desk with five journal articles on renewable energy systems.\n\n"Excuse me," she whispers to the librarian at the help desk. "Could you show me how to access the university database for peer-reviewed papers?"\n\n"Of course," the librarian responds warmly. "You can log in with your single sign-on credentials. Remember to cite your sources using Harvard style to ensure academic integrity in your dissertation."`,
    paragraphs: [
      `The Radcliffe Science Library is quiet, bathed in the soft glow of reading lamps. Sofia sits at a wooden study desk with five journal articles on renewable energy systems.`,
      `"Excuse me," she whispers to the librarian at the help desk. "Could you show me how to access the university database for peer-reviewed papers?"`,
      `"Of course," the librarian responds warmly. "You can log in with your single sign-on credentials. Remember to cite your sources using Harvard style to ensure academic integrity in your dissertation."`
    ],
    word_count: 94,
    times_read: 275,
    status: 'approved',
    vocabulary: {
      'peer-reviewed': 'Revisado por pares académicos',
      'credentials': 'Credenciales de acceso institucional',
      'dissertation': 'Tesis o trabajo de grado'
    },
    cultural_insight: 'Las universidades británicas y estadounidenses penalizan severamente el plagio accidental; citar correctamente es un requisito formativo fundamental.',
    reading_minutes: 3,
    created_at: '2026-10-14T10:30:00Z'
  },
  {
    id: 'story-seed-biz-01',
    level: 'C1',
    topic: 'Business & Work',
    title: 'Strategic Negotiations & Value Propositions',
    subtitle: 'Argumentación ejecutiva en juntas directivas y rondas de inversión',
    content: `The board room in Canary Wharf overlooks the Thames. Mariana presents the quarterly expansion forecast, anticipating objections regarding operational margins.\n\n"While initial capital expenditure appears substantial," Mariana articulates with measured poise, "our projected compound annual growth rate outpaces the sector average by four percentage points. Furthermore, the recurring revenue structure mitigates downside volatility."\n\nThe senior partners exchange brief glances of consensus. Her ability to synthesize complex quantitative data into strategic foresight secures unanimous approval for the next funding round.`,
    paragraphs: [
      `The board room in Canary Wharf overlooks the Thames. Mariana presents the quarterly expansion forecast, anticipating objections regarding operational margins.`,
      `"While initial capital expenditure appears substantial," Mariana articulates with measured poise, "our projected compound annual growth rate outpaces the sector average by four percentage points. Furthermore, the recurring revenue structure mitigates downside volatility."`,
      `The senior partners exchange brief glances of consensus. Her ability to synthesize complex quantitative data into strategic foresight secures unanimous approval for the next funding round.`
    ],
    word_count: 92,
    times_read: 198,
    status: 'approved',
    vocabulary: {
      'capital expenditure': 'Gasto de capital en activos e infraestructura (CapEx)',
      'mitigate': 'Atenuar o mitigar riesgos',
      'unanimous': 'Unánime y sin votos disidentes'
    },
    cultural_insight: 'En el inglés corporativo de alto nivel, los eufemismos y el vocabulario analítico ("mitigates downside volatility") comunican solidez sin sonar agresivo.',
    reading_minutes: 3,
    created_at: '2026-11-05T12:00:00Z'
  }
];

export const POPULAR_TOPICS = [
  'Call Center',
  'Technology',
  'Travel',
  'University Campus',
  'Business & Work',
  'Everyday Life',
  'Customer Service',
  'Healthcare'
] as const;

export class GlobalStoriesService {
  // Índices en memoria para consultas O(1) ultra rápidas
  private static indexByLevelTopic: Map<string, string[]> = new Map();
  private static indexByLevel: Map<string, string[]> = new Map();
  private static indexByTopic: Map<string, string[]> = new Map();
  private static storiesMap: Map<string, GlobalStory> = new Map();
  private static isInitialized = false;

  private static getCompositeKey(level: string, topic: string): string {
    return `${level.toUpperCase().trim()}:::${topic.toLowerCase().trim()}`;
  }

  /**
   * Inicializa la base de datos y construye los índices invertidos
   */
  public static init(): void {
    if (this.isInitialized && typeof window !== 'undefined') return;

    let loadedStories: GlobalStory[] = [];

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedStories = parsed;
          }
        }
      } catch (err) {
        console.error('Error loading global stories:', err);
      }
    }

    // Si está vacío, cargar las semillas
    if (loadedStories.length === 0) {
      loadedStories = [...SEED_GLOBAL_STORIES];
      this.persistToDisk(loadedStories);
    }

    this.rebuildIndexes(loadedStories);
    this.isInitialized = true;
  }

  /**
   * Reconstruye los índices para consultas instantáneas
   */
  private static rebuildIndexes(stories: GlobalStory[]): void {
    this.storiesMap.clear();
    this.indexByLevelTopic.clear();
    this.indexByLevel.clear();
    this.indexByTopic.clear();

    for (const story of stories) {
      this.storiesMap.set(story.id, story);

      // 1. Índice compuesto Level + Topic
      const compositeKey = this.getCompositeKey(story.level, story.topic);
      const existingComposite = this.indexByLevelTopic.get(compositeKey) || [];
      existingComposite.push(story.id);
      this.indexByLevelTopic.set(compositeKey, existingComposite);

      // 2. Índice por Level
      const lvlKey = story.level.toUpperCase().trim();
      const existingLvl = this.indexByLevel.get(lvlKey) || [];
      existingLvl.push(story.id);
      this.indexByLevel.set(lvlKey, existingLvl);

      // 3. Índice por Topic
      const topKey = story.topic.toLowerCase().trim();
      const existingTop = this.indexByTopic.get(topKey) || [];
      existingTop.push(story.id);
      this.indexByTopic.set(topKey, existingTop);
    }
  }

  private static persistToDisk(stories: GlobalStory[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    } catch (err) {
      console.error('Error persisting global stories lake:', err);
    }
  }

  /**
   * Obtiene todas las historias del banco
   */
  public static getAllStories(): GlobalStory[] {
    this.init();
    return Array.from(this.storiesMap.values());
  }

  /**
   * Búsqueda optimizada por índices con filtros y búsqueda de texto
   */
  public static getStoriesFiltered(filters: {
    level?: string;
    topic?: string;
    status?: 'approved' | 'rejected' | 'all';
    searchTerm?: string;
  }): GlobalStory[] {
    this.init();
    let candidates: GlobalStory[] = [];

    const { level, topic, status = 'all', searchTerm } = filters;

    // Uso de índices si están disponibles
    if (level && topic && level !== 'ALL' && topic !== 'ALL') {
      const key = this.getCompositeKey(level, topic);
      const ids = this.indexByLevelTopic.get(key) || [];
      candidates = ids.map(id => this.storiesMap.get(id)!).filter(Boolean);
    } else if (level && level !== 'ALL') {
      const ids = this.indexByLevel.get(level.toUpperCase().trim()) || [];
      candidates = ids.map(id => this.storiesMap.get(id)!).filter(Boolean);
    } else if (topic && topic !== 'ALL') {
      const ids = this.indexByTopic.get(topic.toLowerCase().trim()) || [];
      candidates = ids.map(id => this.storiesMap.get(id)!).filter(Boolean);
    } else {
      candidates = Array.from(this.storiesMap.values());
    }

    // Filtrar por status
    if (status !== 'all') {
      candidates = candidates.filter(s => s.status === status);
    }

    // Filtrar por búsqueda de texto
    if (searchTerm && searchTerm.trim().length > 0) {
      const q = searchTerm.toLowerCase().trim();
      candidates = candidates.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
      );
    }

    return candidates.sort((a, b) => b.times_read - a.times_read);
  }

  /**
   * LÓGICA DE CACHÉ Y BANCO GLOBAL:
   * 1. Busca en global_stories donde coincida level y topic (y status === 'approved')
   * 2. Si hay resultados, devuelve uno aleatoriamente.
   * 3. Si no hay, retorna null (para llamar al rotador de IAs)
   */
  public static findRandomCachedStory(level: string, topic: string): GlobalStory | null {
    this.init();
    const key = this.getCompositeKey(level, topic);
    const ids = this.indexByLevelTopic.get(key) || [];

    // Filtrar solo las que tengan status 'approved'
    const approvedStories = ids
      .map(id => this.storiesMap.get(id)!)
      .filter(s => s && s.status === 'approved');

    if (approvedStories.length === 0) {
      // Intento secundario: buscar si algún tema similar contiene la palabra clave
      const fallbackTopicMatches = Array.from(this.storiesMap.values()).filter(s =>
        s.level.toUpperCase() === level.toUpperCase() &&
        s.status === 'approved' &&
        (s.topic.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(s.topic.toLowerCase()))
      );

      if (fallbackTopicMatches.length > 0) {
        const randIdx = Math.floor(Math.random() * fallbackTopicMatches.length);
        return fallbackTopicMatches[randIdx];
      }

      return null;
    }

    // Devolver aleatoriamente para variar el input a diferentes alumnos
    const randomIndex = Math.floor(Math.random() * approvedStories.length);
    return approvedStories[randomIndex];
  }

  /**
   * Incrementa el contador de veces leída (times_read) de una historia
   */
  public static incrementTimesRead(storyId: string): number {
    this.init();
    const story = this.storiesMap.get(storyId);
    if (!story) return 0;

    story.times_read = (story.times_read || 0) + 1;
    this.storiesMap.set(storyId, story);

    this.persistToDisk(Array.from(this.storiesMap.values()));
    return story.times_read;
  }

  /**
   * Guarda una nueva historia en el banco global y actualiza los índices
   */
  public static saveStory(storyData: {
    level: CEFRLevel;
    topic: string;
    title: string;
    subtitle?: string;
    content: string;
    paragraphs?: string[];
    vocabulary?: Record<string, string>;
    cultural_insight?: string;
    reading_minutes?: number;
    status?: 'approved' | 'rejected';
  }): GlobalStory {
    this.init();

    const timestamp = Date.now();
    const id = `global-story-${storyData.level.toLowerCase()}-${storyData.topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp}`;

    const paragraphs = storyData.paragraphs && storyData.paragraphs.length > 0
      ? storyData.paragraphs
      : storyData.content.split('\n\n').filter(p => p.trim().length > 0);

    const words = storyData.content.split(/\s+/).filter(Boolean).length;
    const minutes = storyData.reading_minutes || Math.max(2, Math.ceil(words / 45));

    const newStory: GlobalStory = {
      id,
      level: storyData.level,
      topic: storyData.topic,
      title: storyData.title,
      subtitle: storyData.subtitle || `Historia de inmersión en ${storyData.topic} (Nivel ${storyData.level})`,
      content: storyData.content,
      paragraphs,
      word_count: words,
      times_read: 1, // Primera lectura del estudiante que la solicitó
      status: storyData.status || 'approved', // Por defecto aprobada para consumo inmediato
      vocabulary: storyData.vocabulary || {},
      cultural_insight: storyData.cultural_insight,
      reading_minutes: minutes,
      created_at: new Date().toISOString()
    };

    const currentList = Array.from(this.storiesMap.values());
    currentList.unshift(newStory);

    this.rebuildIndexes(currentList);
    this.persistToDisk(currentList);

    // Sincronización asíncrona hacia Supabase (tabla global_stories)
    if (typeof window !== 'undefined') {
      import('@/lib/supabase').then(({ getSupabaseClient, isSupabaseConfigured }) => {
        const client = getSupabaseClient();
        if (client && isSupabaseConfigured) {
          Promise.resolve(client.from('global_stories').upsert({
            id: newStory.id,
            level: newStory.level,
            topic: newStory.topic,
            title: newStory.title,
            subtitle: newStory.subtitle,
            content: newStory.content,
            paragraphs: newStory.paragraphs,
            word_count: newStory.word_count,
            times_read: newStory.times_read,
            status: newStory.status,
            vocabulary: newStory.vocabulary,
            cultural_insight: newStory.cultural_insight,
            reading_minutes: newStory.reading_minutes,
            created_at: newStory.created_at
          }, { onConflict: 'id' })).then(({ error }: any) => {
            if (error) console.warn('[Supabase] Error al sincronizar global_story:', error);
          }).catch((err: any) => console.warn('[Supabase] Exception al sincronizar global_story:', err));
        }
      });
    }

    return newStory;
  }

  /**
   * Elimina una historia del banco global (para curación y moderación en el cPanel)
   */
  public static deleteStory(storyId: string): boolean {
    this.init();
    if (!this.storiesMap.has(storyId)) return false;

    this.storiesMap.delete(storyId);
    const updated = Array.from(this.storiesMap.values());

    this.rebuildIndexes(updated);
    this.persistToDisk(updated);
    return true;
  }

  /**
   * Actualiza el status (aprobada / rechazada) de una historia
   */
  public static updateStoryStatus(storyId: string, status: 'approved' | 'rejected'): boolean {
    this.init();
    const story = this.storiesMap.get(storyId);
    if (!story) return false;

    story.status = status;
    this.storiesMap.set(storyId, story);
    this.persistToDisk(Array.from(this.storiesMap.values()));
    return true;
  }

  /**
   * MOTOR PRINCIPAL: Buscar en caché global o generar nueva con el rotador IA
   */
  public static async getOrGenerateStory(
    level: CEFRLevel,
    topic: string,
    contextHint?: string
  ): Promise<{ story: GlobalStory; isFromCache: boolean }> {
    this.init();

    // 1. Verificar si ya existe en global_stories
    const cached = this.findRandomCachedStory(level, topic);
    if (cached) {
      // Incrementar contador de lecturas globales
      this.incrementTimesRead(cached.id);
      return { story: cached, isFromCache: true };
    }

    // 2. Si no hay en caché, intentar generar a través del Proxy de IA seguro en el servidor
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/ai/proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate_story',
            level,
            topic,
            contextHint
          }),
          signal: AbortSignal.timeout(12000)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.story) {
            const serverStory = data.story;
            const saved = this.saveStory({
              level,
              topic,
              title: serverStory.title || `${topic} Scenario`,
              subtitle: serverStory.subtitle,
              content: Array.isArray(serverStory.paragraphs) ? serverStory.paragraphs.join('\n\n') : (serverStory.content || ''),
              paragraphs: Array.isArray(serverStory.paragraphs) ? serverStory.paragraphs : undefined,
              vocabulary: serverStory.vocabulary,
              cultural_insight: serverStory.cultural_insight,
              reading_minutes: serverStory.reading_minutes,
              status: 'approved'
            });
            return { story: saved, isFromCache: false };
          }
        }
      }
    } catch (proxyErr) {
      console.warn('Proxy de IA no disponible o timeout, recurriendo a motor local:', proxyErr);
    }

    // 3. Respaldo pedagógico local con latencia realista
    await new Promise(resolve => setTimeout(resolve, 600));

    const generated = this.synthesizeAiStory(level, topic, contextHint);
    const saved = this.saveStory({
      level,
      topic,
      title: generated.title,
      subtitle: generated.subtitle,
      content: generated.paragraphs.join('\n\n'),
      paragraphs: generated.paragraphs,
      vocabulary: generated.vocabulary,
      cultural_insight: generated.cultural_insight,
      reading_minutes: generated.reading_minutes,
      status: 'approved'
    });

    return { story: saved, isFromCache: false };
  }

  /**
   * Rotador de generación de textos contextuales i+1
   */
  private static synthesizeAiStory(
    level: CEFRLevel,
    topic: string,
    hint?: string
  ): {
    title: string;
    subtitle: string;
    paragraphs: string[];
    vocabulary: Record<string, string>;
    cultural_insight: string;
    reading_minutes: number;
  } {
    const timestampCode = Math.floor(1000 + Math.random() * 9000);

    if (topic.toLowerCase().includes('call') || topic.toLowerCase().includes('customer')) {
      return {
        title: `Empathy and Fast Resolution • Case #${timestampCode}`,
        subtitle: `Escenario de BPO y Customer Support en nivel ${level}`,
        paragraphs: [
          `Agent Ryan answers the call within three seconds. The caller explains that a payment was processed twice due to a browser refresh error.`,
          `Ryan immediately checks the transaction ledger: "I see both transaction identifiers right here on my console. You did nothing wrong, Ms. Vance; this was an automatic gateway duplicate. I am voiding the secondary charge immediately."`,
          `Relieved by the proactive and transparent explanation, the customer leaves a top satisfaction rating before disconnecting.`
        ],
        vocabulary: {
          'transaction ledger': 'Libro o registro de transacciones contables',
          'gateway': 'Pasarela de pago electrónico',
          'voiding': 'Anular o invalidar una transacción financiera antes del cobro'
        },
        cultural_insight: 'En atención al cliente en inglés, asumir la responsabilidad del sistema sin culpar al usuario ("You did nothing wrong") genera máxima confianza.',
        reading_minutes: 3
      };
    }

    if (topic.toLowerCase().includes('tech') || topic.toLowerCase().includes('code')) {
      return {
        title: `The Architecture Code Review • Branch #${timestampCode}`,
        subtitle: `Discusión técnica de desarrollo de software y optimización en nivel ${level}`,
        paragraphs: [
          `During the pull request review, Maya highlights an asynchronous function in the authentication service that could trigger a race condition under heavy load.`,
          `"If we wrap this promise in an exponential backoff retry mechanism," Maya writes in her comment, "we can prevent database connection timeouts when third-party APIs lag."`,
          `Her colleague accepts the suggestion within twenty minutes, remarking that code reviews are the best way to maintain platform resilience.`
        ],
        vocabulary: {
          'race condition': 'Condición de carrera (conflicto de sincronización asíncrona)',
          'exponential backoff': 'Estrategia de reintentos con retraso creciente',
          'resilience': 'Resiliencia y tolerancia a fallos de un sistema'
        },
        cultural_insight: 'En equipos de software globales, los comentarios en Code Reviews se formulan como sugerencias colaborativas ("If we wrap...") en lugar de órdenes directas.',
        reading_minutes: 3
      };
    }

    // Historia por defecto temática
    return {
      title: `A Professional Conversation on ${topic} • Session #${timestampCode}`,
      subtitle: `Texto de inmersión comprensible i+1 generado para nivel ${level}`,
      paragraphs: [
        `David enters the meeting room ready to discuss current developments regarding ${topic}. The room is quiet, and the participants are reviewing the agenda documents.`,
        `"Thank you everyone for gathering this morning," the project director begins. "Our primary focus today is establishing clear communication channels and reviewing practical examples in ${topic}."`,
        `David contributes several key insights based on real-world situations, demonstrating how consistent immersion and natural vocabulary acquisition build genuine communicative fluency.`
      ],
      vocabulary: {
        'agenda': 'Orden del día o programa de la reunión',
        'channels': 'Canales formales de comunicación',
        'fluency': 'Fluidez natural y espontánea sin traducción mental'
      },
      cultural_insight: 'Las reuniones profesionales estructuradas en el entorno internacional priorizan la claridad concisa y los puntos de acción concretos.',
      reading_minutes: 2
    };
  }

  /**
   * Métricas y estadísticas del Content Lake para el panel de administración
   */
  public static getLakeStats(): {
    totalStories: number;
    totalReads: number;
    estimatedTokensSaved: number;
    topicsCount: number;
    levelsBreakdown: Record<string, number>;
  } {
    this.init();
    const all = Array.from(this.storiesMap.values());
    const totalStories = all.length;
    const totalReads = all.reduce((acc, s) => acc + (s.times_read || 0), 0);

    // Cada lectura que reutiliza una historia ahorra ~600 tokens de generación de IA
    const estimatedTokensSaved = Math.max(0, (totalReads - totalStories) * 650);

    const topicsSet = new Set(all.map(s => s.topic.toLowerCase().trim()));
    const topicsCount = topicsSet.size;

    const levelsBreakdown: Record<string, number> = {
      A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0
    };

    for (const story of all) {
      if (levelsBreakdown[story.level] !== undefined) {
        levelsBreakdown[story.level]++;
      }
    }

    return {
      totalStories,
      totalReads,
      estimatedTokensSaved,
      topicsCount,
      levelsBreakdown
    };
  }
}
