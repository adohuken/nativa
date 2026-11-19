// ============================================================================
// TEMARIO UNIVERSITARIO DE INGLÉS (MCER A1 - C2) • FLUENTIA SLA ENGINE
// Basado en el Currículo Académico de Educación Superior y Estándares Internacionales
// (Oxford, Cambridge & English for Academic Purposes) integrado con el Modelo de Krashen
// ============================================================================

export interface SublevelTopic {
  number: string;
  title: string;
  grammarFocus: string;
  vocabularyLexicon: string;
  academicProject: string; // Tarea comunicativa o proyecto universitario
  communicativeGoal: string;
  keyExamples: { en: string; es: string }[];
  slaInsight: string;
}

export interface Sublevel {
  code: string; // ej: A1.1, A1.2, B1.1, B2.1, C1.1, C2.1
  title: string;
  summary: string;
  targetCompetence: string;
  estimatedHours: number;
  topics: SublevelTopic[];
}

export interface CefrLevelDetail {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  title: string;
  mcerBadge: string;
  colorScheme: {
    badgeBg: string;
    badgeText: string;
    border: string;
    gradient: string;
  };
  globalObjective: string;
  pedagogicalBottleneck: string; // Qué habilidad suele ser el cuello de botella
  academicScope: string;
  sublevels: Sublevel[];
}

export const COMPLETE_SYLLABUS: CefrLevelDetail[] = [
  // ==========================================================================
  // NIVEL 1: A1 – FUNDAMENTOS Y SUPERVIVENCIA COMUNICATIVA
  // ==========================================================================
  {
    id: 'level-a1',
    level: 'A1',
    title: 'Nivel A1 • Fundamentos y Supervivencia',
    mcerBadge: 'Acceso Inicial (Breakthrough)',
    colorScheme: {
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-400',
      border: 'border-emerald-500/30',
      gradient: 'from-emerald-500 to-teal-400',
    },
    globalObjective: 'Comprender y utilizar expresiones cotidianas de uso muy frecuente, presentarse y sostener interacciones básicas inmediatas.',
    pedagogicalBottleneck: 'Comprensión auditiva en habla enlazada y erradicación del error hispanohablante de usar "have" para expresar la edad.',
    academicScope: 'Interacción en el campus, trámites de secretaría académica y supervivencia inicial en entornos angloparlantes.',
    sublevels: [
      {
        code: 'A1.1',
        title: 'Módulo 1: Identidad y Entorno Inmediato',
        summary: 'Verbo to be, pronombres personales, adjetivos posesivos y artículos.',
        targetCompetence: 'Presentarse formal e informalmente y llenar formularios universitarios.',
        estimatedHours: 35,
        topics: [
          {
            number: '1.1',
            title: 'Llegar a Londres: quién soy y de dónde vengo',
            grammarFocus: 'Conjugaciones del verbo to be (am, is, are), oraciones afirmativas, negativas e interrogativas con sujeto explícito obligatorio.',
            vocabularyLexicon: 'Países, nacionalidades, profesiones, números del 1 al 100, el alfabeto fonético.',
            academicProject: 'Presentarse formal e informalmente ante la facultad y llenar formularios de admisión universitaria.',
            communicativeGoal: 'Decir edad, origen, profesión y estado anímico sin traducir mentalmente.',
            keyExamples: [
              { en: "I am twenty-five years old and I am an engineering student.", es: "Tengo veinticinco años y soy estudiante de ingeniería." },
              { en: "Are you from Nicaragua or Costa Rica?", es: "¿Eres de Nicaragua o de Costa Rica?" }
            ],
            slaInsight: "En inglés nunca se posee la edad con 'have'. Tu edad ES tu estado: 'I am 25'. Además, el pronombre 'I' nunca se omite."
          },
          {
            number: '1.2',
            title: 'El inventario del campus: pedir y señalar lo que necesitas',
            grammarFocus: 'Regla fonética de artículos A (+ consonante) y An (+ sonido vocálico), demostrativos (This, That, These, Those).',
            vocabularyLexicon: 'Objetos de estudio, dispositivos tecnológicos del campus y pertenencias personales.',
            academicProject: 'Identificar y catalogar recursos en el laboratorio universitario.',
            communicativeGoal: 'Señalar objetos en el entorno a corta y larga distancia con precisión fonética.',
            keyExamples: [
              { en: "This is an apple and that is a university building.", es: "Esta es una manzana y aquel es un edificio universitario." },
              { en: "These are my research notebooks and those are your pens.", es: "Estos son mis cuadernos de investigación y aquellos son tus bolígrafos." }
            ],
            slaInsight: "La elección entre 'a' y 'an' depende del sonido fonético inicial de la palabra siguiente, no de la letra escrita (/ən ˈaʊər/, /ə ˌjuːnɪˈvɜːrsəti/)."
          }
        ]
      },
      {
        code: 'A1.2',
        title: 'Módulo 2: Rutinas, Tiempo y Espacios',
        summary: 'Presente simple, adverbios de frecuencia, preposiciones y existencia espacial.',
        targetCompetence: 'Describir un día típico, dar direcciones en el campus y pedir comida.',
        estimatedHours: 40,
        topics: [
          {
            number: '1.3',
            title: 'Un día en la universidad: ritmos, rutinas y horarios',
            grammarFocus: 'Presente simple, tercera persona (-s / -es), auxiliares do/does, preposiciones de tiempo (in, on, at).',
            vocabularyLexicon: 'Actividades diarias, días de la semana, meses, la hora, relaciones familiares.',
            academicProject: 'Describir un horario semanal de estudio y entrevistar a un compañero sobre sus rutinas académicas.',
            communicativeGoal: 'Comunicar horarios fijos y hábitos recurrentes con fluidez rítmica.',
            keyExamples: [
              { en: "She attends seminars on Mondays at eight in the morning.", es: "Ella asiste a seminarios los lunes a las ocho de la mañana." },
              { en: "Does your professor usually upload the lecture slides?", es: "¿Tu profesor suele subir las diapositivas de la clase?" }
            ],
            slaInsight: "Al utilizar el auxiliar interrogativo 'Does', el verbo principal vuelve a su forma base sin la terminación '-s' ('Does he study?')."
          },
          {
            number: '1.4',
            title: 'Encontrar el aula: pedir indicaciones con cortesía',
            grammarFocus: 'Existencia con There is / There are, preposiciones de lugar, contables e incontables (some/any), modal can / can\'t.',
            vocabularyLexicon: 'Instalaciones del campus, biblioteca, cafetería, deportes y ropa.',
            academicProject: 'Dar direcciones para llegar a la biblioteca universitaria y pedir un menú en el comedor estudiantil.',
            communicativeGoal: 'Ubicar dependencias en el campus y consultar disponibilidad de recursos.',
            keyExamples: [
              { en: "There are two computer labs on the second floor.", es: "Hay dos laboratorios de computación en el segundo piso." },
              { en: "Can I borrow some books from the central library?", es: "¿Puedo tomar prestados algunos libros de la biblioteca central?" }
            ],
            slaInsight: "Se utiliza 'some' en oraciones afirmativas y peticiones corteses, mientras que 'any' se reserva para preguntas generales y negaciones."
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // NIVEL 2: A2 – COMUNICACIÓN COTIDIANA Y EXPERIENCIAS PASADAS
  // ==========================================================================
  {
    id: 'level-a2',
    level: 'A2',
    title: 'Nivel A2 • Comunicación Cotidiana',
    mcerBadge: 'Plataforma (Waystage)',
    colorScheme: {
      badgeBg: 'bg-teal-500/10',
      badgeText: 'text-teal-400',
      border: 'border-teal-500/30',
      gradient: 'from-teal-500 to-cyan-400',
    },
    globalObjective: 'Comunicar tareas simples y habituales, describir aspectos del pasado y expresar necesidades inmediatas o planes futuros.',
    pedagogicalBottleneck: 'Dominio de los verbos irregulares en pasado simple y diferenciación entre intenciones (going to) y predicciones (will).',
    academicScope: 'Intercambios culturales universitarios, redacción de biografías breves y presentación de proyectos académicos iniciales.',
    sublevels: [
      {
        code: 'A2.1',
        title: 'Módulo 1: Relatos del Pasado y Comparaciones',
        summary: 'Pasado simple regular e irregular, comparativos, superlativos y cuantificadores.',
        targetCompetence: 'Narrar anécdotas de viaje, biografías académicas y debatir ventajas/desventajas de productos.',
        estimatedHours: 40,
        topics: [
          {
            number: '2.1',
            title: 'Pioneros de la ciencia: contar cómo ocurrió un descubrimiento',
            grammarFocus: 'Pasado simple, verbos regulares e irregulares, Was / Were, terminación fonética -ed (/t/, /d/, /ɪd/), auxiliar did.',
            vocabularyLexicon: 'Viajes, becas de intercambio, biografías, hitos históricos de la ciencia.',
            academicProject: 'Escribir una breve biografía de un científico pionero y narrar una anécdota personal de viaje.',
            communicativeGoal: 'Describir eventos concluidos en un punto temporal específico sin vacilar.',
            keyExamples: [
              { en: "Marie Curie won two Nobel Prizes in Physics and Chemistry.", es: "Marie Curie ganó dos premios Nobel en Física y Química." },
              { en: "We arrived in London last week and visited the British Museum.", es: "Llegamos a Londres la semana pasada y visitamos el Museo Británico." }
            ],
            slaInsight: "Solo se añade la terminación /ɪd/ a los verbos regulares que terminan en sonido 't' o 'd' (wanted, needed); el resto suena /t/ o /d/."
          },
          {
            number: '2.2',
            title: 'Elegir la mejor opción: comparar tecnologías y recursos',
            grammarFocus: 'Comparativos y superlativos (-er / -est, more / most), igualdad con as... as, cuantificadores (much, many, a few, a little).',
            vocabularyLexicon: 'Geografía mundial, medios de transporte, especificaciones técnicas de computadoras.',
            academicProject: 'Comparar dos campus universitarios o dos soluciones tecnológicas y exponer sus pros y contras.',
            communicativeGoal: 'Evaluar opciones y defender la mejor alternativa con argumentos cuantitativos.',
            keyExamples: [
              { en: "This laptop is much faster than the older model, but it is as expensive as a workstation.", es: "Esta laptop es mucho más rápida que el modelo anterior, pero es tan costosa como una estación de trabajo." },
              { en: "There are only a few spots available in the advanced seminar.", es: "Solo hay unos pocos cupos disponibles en el seminario avanzado." }
            ],
            slaInsight: "Usa 'a few' con sustantivos contables (students, books) y 'a little' con incontables (time, information)."
          }
        ]
      },
      {
        code: 'A2.2',
        title: 'Módulo 2: Planes, Futuro y Normas Institucionales',
        summary: 'Going to, presente continuo futuro, will y modales de obligación y consejo.',
        targetCompetence: 'Presentar un plan de proyecto, itinerarios y dar recomendaciones sobre normas del campus.',
        estimatedHours: 40,
        topics: [
          {
            number: '2.3',
            title: 'Compromisos y planes: decidir el futuro del equipo',
            grammarFocus: 'Proyección futura: Going to (intenciones previas), Presente Continuo (citas programadas), Will (decisiones inmediatas).',
            vocabularyLexicon: 'Metas académicas, clima futuro, fechas de exámenes, eventos y conferencias.',
            academicProject: 'Presentar el cronograma de un proyecto semestral ante la clase.',
            communicativeGoal: 'Diferenciar entre planes organizados de antemano y ofrecimientos espontáneos.',
            keyExamples: [
              { en: "We are going to present our findings next Friday at 10 AM.", es: "Vamos a presentar nuestros hallazgos el próximo viernes a las 10 AM." },
              { en: "Don't worry about the projector, I will set it up for you.", es: "No te preocupes por el proyector, yo lo configuraré por ti." }
            ],
            slaInsight: "En inglés hablado, 'going to' se reduce con frecuencia a /ɡənə/ ('gonna') en contextos informales; mantén la forma plena en exposiciones académicas."
          },
          {
            number: '2.4',
            title: 'Reglas de convivencia y seguridad en el laboratorio',
            grammarFocus: 'Obligaciones y consejos: Have to (regla externa), Must (obligación categórica), Should (consejo/sugerencia), Infinitivo de propósito.',
            vocabularyLexicon: 'Salud, cuerpo humano, reglamento de laboratorios, normas de ética universitaria.',
            academicProject: 'Redactar un cartel de seguridad para un laboratorio con las normas obligatorias y recomendaciones de higiene.',
            communicativeGoal: 'Instruir a compañeros sobre reglamentos oficiales y brindar asesoría constructiva.',
            keyExamples: [
              { en: "Students must wear protective goggles to enter the chemistry lab.", es: "Los estudiantes deben usar gafas de protección para ingresar al laboratorio de química." },
              { en: "You should review your notes every evening to retain key concepts.", es: "Deberías repasar tus apuntes cada noche para retener los conceptos clave." }
            ],
            slaInsight: "'Mustn't' significa prohibición estricta, mientras que 'don't have to' indica que no es obligatorio pero sí opcional."
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // NIVEL 3: B1 – INDEPENDENCIA LINGÜÍSTICA Y OPINIÓN
  // ==========================================================================
  {
    id: 'level-b1',
    level: 'B1',
    title: 'Nivel B1 • Independencia Lingüística',
    mcerBadge: 'Umbral (Threshold)',
    colorScheme: {
      badgeBg: 'bg-sky-500/10',
      badgeText: 'text-sky-400',
      border: 'border-sky-500/30',
      gradient: 'from-sky-500 to-blue-500',
    },
    globalObjective: 'Desenvolverse en la mayoría de las situaciones de viaje o estudio, producir textos sencillos y coherentes, y justificar opiniones.',
    pedagogicalBottleneck: 'Uso correcto del Presente Perfecto sin mezclarlo con Pasado Simple cuando hay marcadores de tiempo cerrado.',
    academicScope: 'Entrevistas de trabajo universitarias, redacción de CV básico, comprensión de noticias y descripción de procesos científicos.',
    sublevels: [
      {
        code: 'B1.1',
        title: 'Módulo 1: Experiencias, Logros y Condiciones',
        summary: 'Presente perfecto (ever, never, just, already, yet, for/since), condicionales tipo 1 y 2.',
        targetCompetence: 'Simular entrevistas laborales, redactar un CV y debatir dilemas éticos.',
        estimatedHours: 45,
        topics: [
          {
            number: '3.1',
            title: 'Mi portafolio: lo que he logrado hasta hoy',
            grammarFocus: 'Presente perfecto (Have/Has + Participio), marcadores temporales (ever, never, already, yet, just), duración (for vs since).',
            vocabularyLexicon: 'Logros académicos, certificaciones, publicaciones, cine y literatura contemporánea.',
            academicProject: 'Realizar una entrevista de trabajo simulada y redactar un Curriculum Vitae con logros verificables.',
            communicativeGoal: 'Conectar la experiencia previa con las capacidades actuales sin fijar fechas cerradas.',
            keyExamples: [
              { en: "I have worked with distributed software architectures for three years.", es: "He trabajado con arquitecturas de software distribuidas durante tres años." },
              { en: "Have you ever led an international research team?", es: "¿Alguna vez has liderado un equipo de investigación internacional?" }
            ],
            slaInsight: "Si se indica una fecha exacta en el pasado ('yesterday', 'in 2022'), se DEBE usar Pasado Simple, nunca Presente Perfecto."
          },
          {
            number: '3.2',
            title: 'Riesgos y experimentos: qué pasaría si cambiamos las variables',
            grammarFocus: 'Condicionales 1 y 2 (If + Present Simple / Past Simple, will / would + base), formulación de hipótesis y alternativas.',
            vocabularyLexicon: 'Dilemas éticos, medio ambiente, finanzas personales, gestión de riesgos.',
            academicProject: 'Debatir sobre dilemas éticos y proponer soluciones hipotéticas a problemáticas locales en una mesa redonda.',
            communicativeGoal: 'Plantear alternativas y aconsejar con cortesía diplomática sin sonar impositivo.',
            keyExamples: [
              { en: "If we invest in renewable energy, our campus will reduce its carbon footprint.", es: "Si invertimos en energía renovable, nuestro campus reducirá su huella de carbono." },
              { en: "If I were in charge of the department, I would fund more research grants.", es: "Si yo estuviera a cargo del departamento, financiaría más becas de investigación." }
            ],
            slaInsight: "En el segundo condicional formal, la norma culta prefiere 'were' para todas las personas gramaticales ('If I were you', 'If she were here')."
          }
        ]
      },
      {
        code: 'B1.2',
        title: 'Módulo 2: Narración Avanzada y Procesos Técnicos',
        summary: 'Pasado continuo, pasado perfecto simple, voz pasiva y cláusulas relativas.',
        targetCompetence: 'Redactar noticias periodísticas y explicar cómo funciona un invento sin nombrarlo.',
        estimatedHours: 45,
        topics: [
          {
            number: '3.3',
            title: 'Evolución de un proyecto: qué cambió mientras trabajábamos',
            grammarFocus: 'Narración avanzada: Pasado Continuo (acciones simultáneas/interrumpidas), Pasado Perfecto (had + participio), conectores de secuencia.',
            vocabularyLexicon: 'Misterios, crímenes, accidentes científicos, descubrimientos inesperados.',
            academicProject: 'Redactar un artículo periodístico con estructura de pirámide invertida y suspenso narrativo.',
            communicativeGoal: 'Establecer con claridad la cronología de eventos secuenciales complejos.',
            keyExamples: [
              { en: "When the team arrived at the observatory, the telescope had already recorded the anomaly.", es: "Cuando el equipo llegó al observatorio, el telescopio ya había registrado la anomalía." },
              { en: "While we were running the simulation, the server suddenly crashed.", es: "Mientras estábamos ejecutando la simulación, el servidor colapsó repentinamente." }
            ],
            slaInsight: "El Pasado Perfecto actúa como ancla temporal: indica cuál de dos sucesos pasados ocurrió primero en la línea cronológica."
          },
          {
            number: '3.4',
            title: 'Protocolos y manuales: cómo se opera la tecnología',
            grammarFocus: 'Voz pasiva en presente y pasado (is/was + participio), cláusulas relativas definitorias (who, which, that, where).',
            vocabularyLexicon: 'Ciencia, inventos, manufactura, procesos de filtración y síntesis.',
            academicProject: 'Elaborar un manual de instrucciones describiendo el funcionamiento de un invento sin revelar su nombre comercial.',
            communicativeGoal: 'Explicar procedimientos técnicos poniendo el foco en el resultado y no en la persona.',
            keyExamples: [
              { en: "The sample is heated to two hundred degrees before it is analyzed.", es: "La muestra se calienta a doscientos grados antes de ser analizada." },
              { en: "A device that measures atmospheric pressure is called a barometer.", es: "Un dispositivo que mide la presión atmosférica se llama barómetro." }
            ],
            slaInsight: "La voz pasiva es el pilar de los textos científicos porque confiere objetividad e imparcialidad al excluir al agente individual."
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // NIVEL 4: B2 – FLUIDEZ, ARGUMENTACIÓN Y CONTEXTO ACADÉMICO
  // (Nivel Mínimo Habitual de Graduación Universitaria)
  // ==========================================================================
  {
    id: 'level-b2',
    level: 'B2',
    title: 'Nivel B2 • Fluidez y Contexto Académico',
    mcerBadge: 'Avanzado Intermedio (Vantage)',
    colorScheme: {
      badgeBg: 'bg-indigo-500/10',
      badgeText: 'text-indigo-400',
      border: 'border-indigo-500/30',
      gradient: 'from-indigo-500 to-purple-500',
    },
    globalObjective: 'Interactuar con hablantes nativos con fluidez y naturalidad, defender puntos de vista en debates formales y redactar informes académicos detallados.',
    pedagogicalBottleneck: 'Uso espontáneo de Reported Speech con verbos introductorios precisos y modales de deducción en pasado (must have, can\'t have).',
    academicScope: 'Nivel de titulación universitaria estándar, debates estilo Oxford, redacción de ensayos argumentativos y análisis de casos de estudio.',
    sublevels: [
      {
        code: 'B2.1',
        title: 'Módulo 1: Debate Formal y Análisis Hipotético',
        summary: 'Cleft sentences, preguntas indirectas, used to/would, tercer condicional y mixtos.',
        targetCompetence: 'Participar en debates formales estilo Oxford y analizar errores históricos/empresariales.',
        estimatedHours: 50,
        topics: [
          {
            number: '4.1',
            title: 'Estructurar un argumento: debatir ideas en comités',
            grammarFocus: 'Cleft sentences (What we need is..., It was the algorithm that...), preguntas indirectas de cortesía, contrastes used to vs would vs be used to.',
            vocabularyLexicon: 'Medios de comunicación, sesgos cognitivos, psicología social, tendencias demográficas.',
            academicProject: 'Participar en un debate formal estilo Oxford defendiendo con rigor una postura asignada por sorteo.',
            communicativeGoal: 'Aportar contundencia a los argumentos sin perder el registro formal de cortesía.',
            keyExamples: [
              { en: "What concerns researchers most is the lack of peer-reviewed data.", es: "Lo que más preocupa a los investigadores es la falta de datos revisados por pares." },
              { en: "Could you please clarify whether the methodology was verified independently?", es: "¿Podría aclarar si la metodología fue verificada de manera independiente?" }
            ],
            slaInsight: "En las preguntas indirectas el orden de las palabras vuelve a ser afirmativo: 'Do you know where the lab IS?' (nunca 'where is the lab' ❌)."
          },
          {
            number: '4.2',
            title: 'Evaluar lo que pudo haber sido: análisis de decisiones pasadas',
            grammarFocus: 'Tercer condicional (If + Past Perfect, would have + participio), condicionales mixtos (pasado afectando presente), wish / if only.',
            vocabularyLexicon: 'Historia alternativa, colapsos financieros, toma de decisiones estratégicas, gestión de crisis.',
            academicProject: 'Analizar un error histórico o corporativo emblemático y modelar qué hubiera ocurrido de tomarse otra decisión.',
            communicativeGoal: 'Evaluar escenarios contrafácticos con absoluta precisión sintáctica.',
            keyExamples: [
              { en: "If the engineers had double-checked the sensor, the mission would not have failed.", es: "Si los ingenieros hubieran verificado dos veces el sensor, la misión no habría fracasado." },
              { en: "If we had secured funding last year, we would be operating our pilot plant today.", es: "Si hubiésemos asegurado financiamiento el año pasado, hoy estaríamos operando nuestra planta piloto." }
            ],
            slaInsight: "Los condicionales mixtos combinan la causa en el pasado (Past Perfect) con su repercusión viva en el presente (would + base)."
          }
        ]
      },
      {
        code: 'B2.2',
        title: 'Módulo 2: Reporte Académico, Deducción y Matices',
        summary: 'Reported Speech con verbos ricos, voz pasiva avanzada, modales de deducción y gerundios/infinitivos.',
        targetCompetence: 'Redactar informes ejecutivos a partir de conferencias y escribir ensayos argumentativos de 400 palabras.',
        estimatedHours: 50,
        topics: [
          {
            number: '4.3',
            title: 'Citar a los expertos: reportar discursos e investigaciones ajenas',
            grammarFocus: 'Reported speech con backshift temporal, verbos introductorios avanzados (claim, deny, warn, urge, emphasize), pasiva impersonal (It is said that...).',
            vocabularyLexicon: 'Periodismo de investigación, política internacional, informes de auditoría, patentes.',
            academicProject: 'Sintetizar una conferencia magistral y redactar un informe ejecutivo para un comité directivo.',
            communicativeGoal: 'Citar fuentes fidedignas reflejando el grado de compromiso o escepticismo del autor original.',
            keyExamples: [
              { en: "The spokesperson denied that sensitive user data had been compromised.", es: "El portavoz negó que los datos sensibles de los usuarios hubiesen sido comprometidos." },
              { en: "It is widely believed that quantum encryption will redefine digital privacy.", es: "Se cree ampliamente que el cifrado cuántico redefinirá la privacidad digital." }
            ],
            slaInsight: "Sustituye 'said' o 'told' por verbos con carga semántica rica como 'advise', 'recommend' o 'refuse' para elevar la madurez de tus textos."
          },
          {
            number: '4.4',
            title: 'Llegar a conclusiones lógicas: deducir qué ocurrió con las pruebas',
            grammarFocus: 'Modales de deducción lógica en presente y pasado (must have, might have, can\'t have), verbos seguidos de gerundio vs infinitivo con cambio de sentido (remember, stop, forget, regret).',
            vocabularyLexicon: 'Misterios científicos sin resolver, jurisprudencia, lógica formal, neurociencia.',
            academicProject: 'Redactar un ensayo argumentativo de 400 palabras analizando un caso de estudio judicial o científico controvertido.',
            communicativeGoal: 'Expresar grados de certidumbre analítica sin caer en afirmaciones categóricas injustificadas.',
            keyExamples: [
              { en: "The data is inconsistent; the sensors cannot have been calibrated properly.", es: "Los datos son inconsistentes; los sensores no pueden haber sido calibrados adecuadamente." },
              { en: "The team stopped using the old protocol to test the new algorithm.", es: "El equipo dejó de usar el protocolo antiguo para probar el nuevo algoritmo." }
            ],
            slaInsight: "'Stop doing' significa interrumpir un hábito por completo; 'stop to do' significa pausar una actividad para iniciar otra diferente."
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // NIVEL 5: C1 – INGLÉS ACADÉMICO AVANZADO (EAP) Y PROFESIONAL
  // ==========================================================================
  {
    id: 'level-c1',
    level: 'C1',
    title: 'Nivel C1 • Inglés Académico Avanzado',
    mcerBadge: 'Dominio Operativo Eficaz (Effective)',
    colorScheme: {
      badgeBg: 'bg-purple-500/10',
      badgeText: 'text-purple-400',
      border: 'border-purple-500/30',
      gradient: 'from-purple-500 to-fuchsia-500',
    },
    globalObjective: 'Comprender textos extensos y exigentes, expresarse con fluidez y espontaneidad, y producir textos complejos bien estructurados con léxico de alta precisión.',
    pedagogicalBottleneck: 'Inversión enfática espontánea, uso natural del subjuntivo formal y empleo calibrado de lenguaje cauteloso (hedging) en publicaciones.',
    academicScope: 'English for Academic Purposes (EAP), redacción de propuestas de investigación, impartición de charlas estilo TED y ensayos de 1,000 palabras con citas APA/MLA.',
    sublevels: [
      {
        code: 'C1.1',
        title: 'Módulo 1: Cohesión Académica, Inversión y Subjuntivo',
        summary: 'Inversión negativa, cláusulas participiales, nominalización, Academic Word List (AWL) y modo subjuntivo.',
        targetCompetence: 'Transformar textos informales en prosa académica y redactar propuestas de investigación con rigor.',
        estimatedHours: 60,
        topics: [
          {
            number: '5.1',
            title: 'El discurso que convence: cómo enfatizar sin gritar',
            grammarFocus: 'Inversión negativa restrictiva (Seldom, Rarely, Under no circumstances, Not only... but also), cláusulas participiales (Having completed...), nominalización de verbos.',
            vocabularyLexicon: 'Léxico académico AWL (Academic Word List), conectores formales de cohesión.',
            academicProject: 'Reescribir un informe técnico informal convirtiéndolo en una revisión bibliográfica de calibre universitario.',
            communicativeGoal: 'Incrementar la densidad conceptual y la solemnidad retórica de la prosa científica.',
            keyExamples: [
              { en: "Seldom have we witnessed such comprehensive transformation across distributed systems.", es: "Rara vez hemos presenciado una transformación tan exhaustiva en sistemas distribuidos." },
              { en: "Having evaluated multiple parameters, the committee recommended immediate adoption.", es: "Habiendo evaluado múltiples parámetros, el comité recomendó su adopción inmediata." }
            ],
            slaInsight: "La nominalización (transformar 'we decided' en 'the decision was made') elimina la primera persona informal y dota al texto de autoridad académica."
          },
          {
            number: '5.2',
            title: 'El arte del matiz: expresar certeza cautelosa en papers',
            grammarFocus: 'Modo subjuntivo mandatorio (It is vital/essential that he be/submit), cláusulas concesivas avanzadas (Albeit, Notwithstanding, Inasmuch as).',
            vocabularyLexicon: 'Gobernanza universitaria, bioética, economía global, políticas públicas.',
            academicProject: 'Redactar una propuesta formal de política pública o enmienda de bioética ante un comité regulador.',
            communicativeGoal: 'Formular resoluciones oficiales con el registro protocolar del derecho y la diplomacia internacional.',
            keyExamples: [
              { en: "It is imperative that the researcher submit all raw telemetry before publication.", es: "Es imperativo que el investigador presente toda la telemetría sin procesar antes de la publicación." },
              { en: "Notwithstanding the logistical setbacks, the trial yielded statistically significant outcomes.", es: "A pesar de los contratiempos logísticos, el ensayo arrojó resultados estadísticamente significativos." }
            ],
            slaInsight: "En el subjuntivo formal en tercera persona singular no se añade '-s' al verbo ('that he submit', nunca 'that he submits' ❌)."
          }
        ]
      },
      {
        code: 'C1.2',
        title: 'Módulo 2: Oratoria Magistral y Crítica Académica',
        summary: 'Marcadores del discurso oral, colocaciones cultas, lenguaje cauteloso (hedging) y citación APA/MLA.',
        targetCompetence: 'Impartir charlas estilo TED de 10 minutos con ronda de preguntas y escribir ensayos críticos de 1,000 palabras.',
        estimatedHours: 60,
        topics: [
          {
            number: '5.3',
            title: 'Reformular con impacto: destacar lo que de verdad importa',
            grammarFocus: 'Discourse markers, elipsis y sustitución pragmática, colocaciones complejas (profoundly affect, staunch supporter, foster collaboration).',
            vocabularyLexicon: 'Negociación estratégica, liderazgo de opinión, oratoria de impacto, modismos refinados.',
            academicProject: 'Impartir una conferencia magistral estilo TED de 10 minutos con defensa oral en sesión de preguntas y respuestas.',
            communicativeGoal: 'Modular la entonación y las pausas para persuadir a auditorios especializados sin titubeos.',
            keyExamples: [
              { en: "To put it another way, our findings profoundly challenge conventional assumptions.", es: "Dicho de otro modo, nuestros hallazgos desafían profundamente los supuestos convencionales." },
              { en: "Far from being a liability, this anomaly represents a breakthrough.", es: "Lejos de ser una desventaja, esta anomalía representa un avance revolucionario." }
            ],
            slaInsight: "Los marcadores de discurso conectan ideas entre párrafos orales, permitiendo guiar al oyente a través de argumentos de alta complejidad."
          },
          {
            number: '5.4',
            title: 'El tono del debate: sonar diplomático y persuasivo en comités',
            grammarFocus: 'Lenguaje cauteloso (hedging: appears to suggest, tends to indicate, could ostensibly be attributed to), puntuación avanzada (punto y coma, guión largo em-dash).',
            vocabularyLexicon: 'Epistemología, análisis empírico de datos, crítica metodológica, bibliografía indexada.',
            academicProject: 'Escribir un ensayo crítico de 1,000 palabras con citas en formato APA/MLA sometido a revisión ciega por pares.',
            communicativeGoal: 'Matizar conclusiones de investigaciones evitando dogmatismos y garantizando rigor científico.',
            keyExamples: [
              { en: "The preliminary findings seem to suggest a mild correlation, albeit one that warrants further inquiry.", es: "Los hallazgos preliminares parecen sugerir una correlación leve, si bien amerita mayor indagación." },
              { en: "These anomalies could arguably be attributed to instrument thermal fluctuations.", es: "Estas anomalías podrían atribuirse razonablemente a fluctuaciones térmicas del instrumento." }
            ],
            slaInsight: "En la literatura científica de alto impacto nunca se afirma 'this proves': se utiliza hedging ('the evidence strongly suggests') para preservar la honestidad académica."
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // NIVEL 6: C2 – MAESTRÍA, ESPECIALIZACIÓN E INVESTIGACIÓN UNIVERSITARIA
  // ==========================================================================
  {
    id: 'level-c2',
    level: 'C2',
    title: 'Nivel C2 • Maestría y Especialización',
    mcerBadge: 'Maestría Plena (Mastery)',
    colorScheme: {
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-400',
      border: 'border-amber-500/30',
      gradient: 'from-amber-400 via-rose-500 to-red-500',
    },
    globalObjective: 'Comprender con facilidad prácticamente todo lo que se oye o lee, reconstruir información de diversas fuentes y expresarse con total precisión, matiz, ironía y elegancia idiomática nativa.',
    pedagogicalBottleneck: 'Captación de la ironía contextual, subtexto cultural implícito, variaciones dialectales y oratoria de alta tensión ante sínodos evaluadores.',
    academicScope: 'Seminarios doctorales de especialidad, redacción de papers científicos para revistas indexadas (Nature, Science), moderación de paneles internacionales y defensa de tesis doctoral.',
    sublevels: [
      {
        code: 'C2.1',
        title: 'Módulo 1: Análisis Pragmático, Discurso y Dialectología',
        summary: 'Decodificación de ironía, sarcasmo académico, subtexto cultural y dialectos globales (RP, General American, Australian, Hiberno-English).',
        targetCompetence: 'Analizar el discurso geopolítico internacional y moderar debates con ponentes de múltiples dialectos.',
        estimatedHours: 70,
        topics: [
          {
            number: '6.1',
            title: 'La negociación en la cumbre: decir mucho entre líneas',
            grammarFocus: 'Pragmática del discurso, estructuras atenuadas de desacuerdo cortés (I take your point, however; With all due respect; I am not entirely persuaded), entonación irónica y subtexto cultural.',
            vocabularyLexicon: 'Retórica diplomática, alusiones culturales canónicas, expresiones idiomáticas cultas poco frecuentes.',
            academicProject: 'Deconstruir un debate geopolítico internacional identificando el subtexto, las falacias veladas y la postura real no explícita.',
            communicativeGoal: 'Descifrar segundas intenciones y matices ideológicos implícitos en discursos de alta diplomacia.',
            keyExamples: [
              { en: "While the proposal is undeniably audacious, one wonders whether its assumptions withstand rigorous scrutiny.", es: "Si bien la propuesta es innegablemente audaz, uno se pregunta si sus supuestos resisten un escrutinio riguroso." },
              { en: "He offered what might charitably be termed an idiosyncratic interpretation of the data.", es: "Ofreció lo que caritativamente podría denominarse una interpretación idiosincrática de los datos." }
            ],
            slaInsight: "En C2 el reto no es gramatical sino pragmático: entender lo que el hablante nativo QUIERE decir más allá de las palabras literales pronunciadas."
          },
          {
            number: '6.2',
            title: 'Inglés sin fronteras: descifrar dialectos y acentos globales',
            grammarFocus: 'Fonología contrastiva (British Received Pronunciation, General American, Australian English, Scottish, Irish, Indian English), variaciones sintácticas dialectales.',
            vocabularyLexicon: 'Léxico regional especializado, modismos autóctonos británicos y transatlánticos.',
            academicProject: 'Moderar una mesa redonda universitaria en vivo con panelistas de 4 continentes sin requerir repetición de intervenciones.',
            communicativeGoal: 'Procesar instantáneamente registros orales con acentos cerrados y velocidad coloquial nativa.',
            keyExamples: [
              { en: "The committee were of the opinion that further devolution was paramount.", es: "El comité sostuvo la opinión de que una mayor descentralización era primordial (concordancia británica colectiva)." },
              { en: "He hadn't ought to have dismissed the counter-evidence so casually.", es: "No debió haber desestimado la contra-evidencia con tanta ligereza." }
            ],
            slaInsight: "La maestría C2 implica la flexibilidad de alternar entre diferentes variedades del inglés sin juzgarlas como errores, sino como variantes legítimas."
          }
        ]
      },
      {
        code: 'C2.2',
        title: 'Módulo 2: Publicaciones Indexadas y Defensa de Tesis',
        summary: 'Estructura de papers científicos (IMRAD), redacción de abstracts para conferencias de élite y oratoria para defensa doctoral.',
        targetCompetence: 'Redactar artículos para revistas científicas indexadas y defender una tesis doctoral ante un tribunal riguroso.',
        estimatedHours: 70,
        topics: [
          {
            number: '6.3',
            title: 'El texto impecable: pulir un artículo al nivel de Science',
            grammarFocus: 'Estructura IMRAD (Introduction, Methods, Results, and Discussion), condensación sintáctica sin ambigüedades, eliminación de pleonasmos y prosa de élite.',
            vocabularyLexicon: 'Léxico científico de vanguardia, terminología de metaanálisis, revisión de pares internacional.',
            academicProject: 'Redactar un paper científico completo con su respectivo abstract de 250 palabras listo para sumisión a una revista indexada.',
            communicativeGoal: 'Comunicar descubrimientos de vanguardia con la máxima concisión, elegancia e impacto bibliométrico.',
            keyExamples: [
              { en: "This investigation elucidates the molecular pathways underpinning synaptic plasticity in neurodegenerative models.", es: "Esta investigación dilucida las vías moleculares que sustentan la plasticidad sináptica en modelos neurodegenerativos." },
              { en: "The proposed framework reconciles seemingly contradictory empirical findings reported across independent trials.", es: "El marco propuesto concilia hallazgos empíricos aparentemente contradictorios reportados en ensayos independientes." }
            ],
            slaInsight: "La estilística de nivel C2 prioriza la economía verbal: cada palabra debe aportar peso conceptual; los rellenos son eliminados implacablemente."
          },
          {
            number: '6.4',
            title: 'La defensa del doctorado: responder con soltura ante el tribunal',
            grammarFocus: 'Sintaxis de refutación inmediata, síntesis de posturas antagónicas en tiempo real, modulación de la compostura bajo cuestionamiento agresivo.',
            vocabularyLexicon: 'Dialéctica escolástica, argumentación epistemológica, defensa metodológica ante sínodos.',
            academicProject: 'Simular la defensa de una tesis doctoral de 30 minutos frente a un panel académico evaluador con preguntas hostiles.',
            communicativeGoal: 'Defender hipótesis innovadoras con compostura, rigor inquebrantable y elocuencia académica intachable.',
            keyExamples: [
              { en: "I concede that the sample size is modest; nonetheless, the statistical significance remains robust against sensitivity analysis.", es: "Concedo que el tamaño muestral es modesto; no obstante, la significancia estadística se mantiene robusta frente al análisis de sensibilidad." },
              { en: "Far from undermining our thesis, the anomaly highlighted by the panel actually corroborates our secondary hypothesis.", es: "Lejos de socavar nuestra tesis, la anomalía señalada por el tribunal en realidad corrobora nuestra hipótesis secundaria." }
            ],
            slaInsight: "El nivel C2 representa la internalización completa del idioma: la persona ya no piensa en estructuras gramaticales, sino puramente en el contenido epistemológico que comunica."
          }
        ]
      }
    ]
  }
];

// ============================================================================
// MARCO PEDAGÓGICO UNIVERSITARIO Y RÚBRICAS OFICIALES MCER
// ============================================================================
export const UNIVERSITY_PEDAGOGICAL_FRAMEWORK = {
  rubrics: [
    {
      criterion: "Task Achievement & Response (Cumplimiento de la Tarea)",
      weightPercentage: 25,
      description: "Capacidad de responder a todos los requerimientos comunicativos del proyecto o debate con profundidad analítica y sustentación rigurosa."
    },
    {
      criterion: "Coherence & Cohesion (Coherencia y Cohesión)",
      weightPercentage: 25,
      description: "Estructuración lógica de las ideas, uso fluido de conectores discursivos, progresión temática sin digresiones y claridad de párrafos."
    },
    {
      criterion: "Lexical Resource (Riqueza y Precisión Léxica)",
      weightPercentage: 25,
      description: "Amplitud de vocabulario formal (AWL), uso natural de colocaciones cultas, modismos apropiados y ausencia de traducción literal."
    },
    {
      criterion: "Grammatical Range & Accuracy (Precisión y Rango Gramatical)",
      weightPercentage: 25,
      description: "Dominio de estructuras sintácticas avanzadas (inversión, pasiva, subjuntivo, condicionales) con control impecable de puntuación y entonación."
    }
  ],
  methodology: {
    flippedClassroom: {
      title: "Modelo de Aula Invertida (Flipped Classroom)",
      ratio: "80% Práctica Oral Activa / 20% Trabajo Autónomo Previo",
      principle: "El estudiante adquiere la teoría gramatical y el vocabulario mediante comprensión auditiva y lectura autónoma previa en la plataforma, reservando el 80% del tiempo para debates, resolución de dilemas y oratoria activa."
    },
    authenticMaterials: {
      title: "Inmersión Progresiva con Materiales Auténticos",
      stages: [
        { level: "A1 - A2", focus: "Diálogos situacionales calibrados con habla natural y apoyo fonético enlazado." },
        { level: "B1", focus: "Integración gradual de extractos de noticias reales de la BBC y NPR." },
        { level: "B2", focus: "Artículos completos de The Economist, The Guardian y conferencias TED." },
        { level: "C1 - C2", focus: "Papers científicos de Nature y Science, debates parlamentarios y seminarios doctorales sin adaptar." }
      ]
    },
    krashenIntegration: {
      title: "Sinergia Krashen SLA + Rigor Académico Universitario",
      points: [
        "Input Comprensible Calibrado (i + 1): Exposición rica en contexto ligeramente por encima del nivel actual.",
        "Filtro Afectivo Zen: Cero penalización por errores en la fase de adquisición; la confianza del estudiante es la máxima prioridad.",
        "Monitor Tardío: La gramática reflexiva solo se activa al final de cada unidad para pulir la producción escrita y académica formal."
      ]
    }
  }
};

export const DAILY_STUDY_PLAN = {
  totalMinutes: 45,
  blocks: [
    {
      timeMinutes: 15,
      title: "Bloque 1: Inmersión Sonora Auténtica (i + 1)",
      description: "Escucha activa de escenas académicas y diálogos nativos sin muleta de traducción en español para automatizar la decodificación auditiva."
    },
    {
      timeMinutes: 15,
      title: "Bloque 2: Shadowing & Fonética Muscular",
      description: "Entrenamiento neuromuscular repitiendo frases modelo a diferentes velocidades (0.8x y 1.0x) imitando enlaces y entonación melódica."
    },
    {
      timeMinutes: 15,
      title: "Bloque 3: Monitor Tardío & Proyecto Comunicativo",
      description: "Reflexión sintáctica sobre los vicios hispanohablantes a erradicar y resolución del reto de desbloqueo final."
    }
  ]
};