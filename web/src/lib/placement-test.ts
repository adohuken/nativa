// ============================================================================
// NATIVA • MOTOR ADAPTATIVO DE TEST DE NIVELACIÓN (PLACEMENT TEST 25 PREGUNTAS)
// Algoritmo adaptativo multi-nivel según Stephen Krashen y el MCER (A1 a C2).
// Regla: 3 aciertos en el nivel actual -> Salta al siguiente nivel superior.
//        2 fallos en el nivel actual -> Baja al nivel anterior de consolidación.
// ============================================================================

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const CEFR_LEVELS_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const TOTAL_PLACEMENT_QUESTIONS = 25;

export interface PlacementQuestion {
  id: string;
  level: CEFRLevel;
  prompt: string;
  contextSentence?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'Grammar' | 'Vocabulary' | 'Collocations' | 'Pragmatics';
}

export const PLACEMENT_QUESTIONS_BANK: PlacementQuestion[] = [
  // ==========================================================================
  // --- NIVEL A1 (Acceso / Elemental) ---
  // ==========================================================================
  {
    id: 'a1_q1',
    level: 'A1',
    prompt: 'Completa la frase básica de presentación:',
    contextSentence: 'Hello! I _____ a university student in London.',
    options: ['am', 'is', 'are', 'be'],
    correctIndex: 0,
    explanation: 'Con el pronombre "I" en presente simple se utiliza el verbo "am".',
    category: 'Grammar'
  },
  {
    id: 'a1_q2',
    level: 'A1',
    prompt: 'Elige la opción correcta para una rutina diaria:',
    contextSentence: 'She _____ English every morning before breakfast.',
    options: ['study', 'studies', 'studying', 'is study'],
    correctIndex: 1,
    explanation: 'En 3ra persona singular (She) en presente simple, "study" cambia a "studies".',
    category: 'Grammar'
  },
  {
    id: 'a1_q3',
    level: 'A1',
    prompt: 'Selecciona la preposición adecuada de tiempo:',
    contextSentence: 'Our lecture starts _____ 9:00 AM on Monday.',
    options: ['in', 'on', 'at', 'to'],
    correctIndex: 2,
    explanation: 'Para horas exactas del reloj se utiliza siempre la preposición "at".',
    category: 'Grammar'
  },
  {
    id: 'a1_q4',
    level: 'A1',
    prompt: 'Elige la palabra que completa la oración:',
    contextSentence: 'Can you lend me _____ pen, please? Mine is broken.',
    options: ['a', 'an', 'some', 'any'],
    correctIndex: 0,
    explanation: '"Pen" es un sustantivo contable singular que inicia con consonante, por lo que lleva "a".',
    category: 'Vocabulary'
  },
  {
    id: 'a1_q5',
    level: 'A1',
    prompt: '¿Cómo se responde a una pregunta de edad?',
    contextSentence: 'How old are you? - I _____ twenty-one years old.',
    options: ['have', 'am', 'has', 'am have'],
    correctIndex: 1,
    explanation: 'En inglés la edad se expresa con el verbo to be (I am), nunca con "have".',
    category: 'Grammar'
  },
  {
    id: 'a1_q6',
    level: 'A1',
    prompt: 'Completa la negación básica en presente simple:',
    contextSentence: 'David _____ live in Manchester; he lives in London.',
    options: ['doesn\'t', 'don\'t', 'isn\'t', 'aren\'t'],
    correctIndex: 0,
    explanation: 'En 3ra persona singular se usa el auxiliar negativo "doesn\'t".',
    category: 'Grammar'
  },
  {
    id: 'a1_q7',
    level: 'A1',
    prompt: 'Selecciona el pronombre objeto correcto:',
    contextSentence: 'The professor gave _____ the syllabus on the first day.',
    options: ['we', 'us', 'our', 'ours'],
    correctIndex: 1,
    explanation: '"Us" es el pronombre objeto adecuado tras el verbo transitivo "gave".',
    category: 'Grammar'
  },
  {
    id: 'a1_q8',
    level: 'A1',
    prompt: 'Elige el adjetivo demostrativo para objetos cercanos en plural:',
    contextSentence: '_____ books on my desk belong to the campus library.',
    options: ['This', 'That', 'These', 'Those'],
    correctIndex: 2,
    explanation: '"These" se emplea para sustantivos plurales cercanos en el espacio.',
    category: 'Vocabulary'
  },

  // ==========================================================================
  // --- NIVEL A2 (Plataforma / Básico Alto) ---
  // ==========================================================================
  {
    id: 'a2_q1',
    level: 'A2',
    prompt: 'Completa la oración en tiempo pasado simple:',
    contextSentence: 'Yesterday, we _____ to the campus library and borrowed two books.',
    options: ['go', 'goed', 'went', 'gone'],
    correctIndex: 2,
    explanation: 'El pasado simple del verbo irregular "go" es "went".',
    category: 'Grammar'
  },
  {
    id: 'a2_q2',
    level: 'A2',
    prompt: 'Elige la forma comparativa adecuada:',
    contextSentence: 'Living on campus is usually _____ than renting an apartment downtown.',
    options: ['more cheap', 'cheaper', 'cheapest', 'cheapier'],
    correctIndex: 1,
    explanation: 'Los adjetivos de una sílaba como "cheap" forman el comparativo añadiendo "-er" (cheaper).',
    category: 'Grammar'
  },
  {
    id: 'a2_q3',
    level: 'A2',
    prompt: 'Completa la pregunta en pasado:',
    contextSentence: 'Where _____ you spend your summer vacation last year?',
    options: ['did', 'do', 'were', 'have'],
    correctIndex: 0,
    explanation: 'Para formular preguntas en pasado simple con verbos léxicos se usa el auxiliar "did".',
    category: 'Grammar'
  },
  {
    id: 'a2_q4',
    level: 'A2',
    prompt: 'Identifica el conector que indica causa:',
    contextSentence: 'He didn\'t attend the seminar _____ he was feeling unwell.',
    options: ['although', 'because', 'so', 'therefore'],
    correctIndex: 1,
    explanation: '"Because" introduce la cláusula de razón o motivo.',
    category: 'Collocations'
  },
  {
    id: 'a2_q5',
    level: 'A2',
    prompt: 'Elige el modal para expresar obligación o norma:',
    contextSentence: 'All students _____ wear their safety goggles in the chemistry laboratory.',
    options: ['must', 'might', 'could', 'shall'],
    correctIndex: 0,
    explanation: '"Must" expresa obligación estricta impuesta por normativas.',
    category: 'Grammar'
  },
  {
    id: 'a2_q6',
    level: 'A2',
    prompt: 'Selecciona la forma correcta para un plan de futuro agendado:',
    contextSentence: 'We _____ the academic advisor tomorrow at 10:00 AM.',
    options: ['are meeting', 'meet', 'met', 'were meeting'],
    correctIndex: 0,
    explanation: 'El presente continuo expresa acuerdos futuros confirmados con hora fija.',
    category: 'Grammar'
  },
  {
    id: 'a2_q7',
    level: 'A2',
    prompt: 'Identifica el cuantificador para sustantivos incontables:',
    contextSentence: 'We don\'t have _____ time left before the exam begins.',
    options: ['many', 'much', 'few', 'several'],
    correctIndex: 1,
    explanation: '"Time" (tiempo) es incontable; en oraciones negativas requiere "much".',
    category: 'Vocabulary'
  },
  {
    id: 'a2_q8',
    level: 'A2',
    prompt: 'Completa la expresión de frecuencia temporal:',
    contextSentence: 'She visits the career center _____ a week to check new internships.',
    options: ['once', 'one', 'first', 'single'],
    correctIndex: 0,
    explanation: '"Once a week" significa una vez por semana.',
    category: 'Collocations'
  },

  // ==========================================================================
  // --- NIVEL B1 (Umbral / Intermedio Independiente) ---
  // ==========================================================================
  {
    id: 'b1_q1',
    level: 'B1',
    prompt: 'Selecciona la forma correcta del Presente Perfecto:',
    contextSentence: 'Dr. Harris _____ at this university since 2018.',
    options: ['has taught', 'have taught', 'taught', 'is teaching'],
    correctIndex: 0,
    explanation: 'Acción que comenzó en el pasado y continúa hoy con "since 2018" usa "has taught".',
    category: 'Grammar'
  },
  {
    id: 'b1_q2',
    level: 'B1',
    prompt: 'Completa la condición real (Primer Condicional):',
    contextSentence: 'If you _____ the final project on time, you will pass the course.',
    options: ['will submit', 'submit', 'submitted', 'would submit'],
    correctIndex: 1,
    explanation: 'En el primer condicional, la cláusula con "if" va en presente simple (submit).',
    category: 'Grammar'
  },
  {
    id: 'b1_q3',
    level: 'B1',
    prompt: 'Elige el Phrasal Verb que significa "cancelar":',
    contextSentence: 'Due to severe weather, the administration decided to _____ the seminar.',
    options: ['call off', 'put on', 'give up', 'look into'],
    correctIndex: 0,
    explanation: '"Call off" es el phrasal verb equivalente a "cancel" (cancelar).',
    category: 'Vocabulary'
  },
  {
    id: 'b1_q4',
    level: 'B1',
    prompt: 'Elige la voz pasiva adecuada en pasado simple:',
    contextSentence: 'The scientific report _____ by the research team last week.',
    options: ['was published', 'is published', 'published', 'has published'],
    correctIndex: 0,
    explanation: 'Pasado simple pasivo singular: "was" + participio pasado "published".',
    category: 'Grammar'
  },
  {
    id: 'b1_q5',
    level: 'B1',
    prompt: 'Completa con el Segundo Condicional (hipótesis presente/futura):',
    contextSentence: 'If I _____ more free time, I would join the university debate club.',
    options: ['had', 'have', 'would have', 'will have'],
    correctIndex: 0,
    explanation: 'En segundo condicional la cláusula con "if" usa pasado simple ("had").',
    category: 'Grammar'
  },
  {
    id: 'b1_q6',
    level: 'B1',
    prompt: 'Elige el conector que expresa contraste moderado:',
    contextSentence: 'The tuition is affordable; _____, living expenses in London are high.',
    options: ['however', 'furthermore', 'because', 'so that'],
    correctIndex: 0,
    explanation: '"However" introduce un contraste formal entre dos oraciones independientes.',
    category: 'Collocations'
  },
  {
    id: 'b1_q7',
    level: 'B1',
    prompt: 'Selecciona la preposición correcta para la colocación:',
    contextSentence: 'The team succeeded _____ finishing the software prototype ahead of schedule.',
    options: ['in', 'at', 'on', 'with'],
    correctIndex: 0,
    explanation: 'El verbo "succeed" se acompaña de la preposición "in" seguida de gerundio.',
    category: 'Collocations'
  },
  {
    id: 'b1_q8',
    level: 'B1',
    prompt: 'Completa con el Pasado Perfecto:',
    contextSentence: 'When the lecture began, the students _____ their notebooks.',
    options: ['had already opened', 'already opened', 'have already opened', 'were already opening'],
    correctIndex: 0,
    explanation: 'La acción previa a otro momento en el pasado requiere Pasado Perfecto ("had opened").',
    category: 'Grammar'
  },

  // ==========================================================================
  // --- NIVEL B2 (Avanzado / Intermedio Alto) ---
  // ==========================================================================
  {
    id: 'b2_q1',
    level: 'B2',
    prompt: 'Completa con el Tercer Condicional (hipótesis pasada):',
    contextSentence: 'If they _____ the laboratory protocols, the experiment wouldn\'t have failed.',
    options: ['had followed', 'followed', 'would follow', 'would have followed'],
    correctIndex: 0,
    explanation: 'El tercer condicional requiere "had + past participle" en la cláusula hipotética.',
    category: 'Grammar'
  },
  {
    id: 'b2_q2',
    level: 'B2',
    prompt: 'Selecciona el conector de contraste formal:',
    contextSentence: 'The methodology is innovative; _____, the empirical sample remains rather limited.',
    options: ['moreover', 'nevertheless', 'consequently', 'similarly'],
    correctIndex: 1,
    explanation: '"Nevertheless" introduce una concesión o contraste formal ("sin embargo / no obstante").',
    category: 'Collocations'
  },
  {
    id: 'b2_q3',
    level: 'B2',
    prompt: 'Completa la estructura enfática (Cleft Sentence):',
    contextSentence: 'It was the professor\'s opening remarks _____ triggered the lively debate.',
    options: ['which', 'that', 'whom', 'where'],
    correctIndex: 1,
    explanation: 'En las "it-cleft sentences" enfocadas en el sujeto se utiliza canónicamente "that".',
    category: 'Grammar'
  },
  {
    id: 'b2_q4',
    level: 'B2',
    prompt: 'Identifica la colocación académica precisa:',
    contextSentence: 'The authors failed to _____ substantial evidence to back their thesis.',
    options: ['make', 'provide', 'do', 'compose'],
    correctIndex: 1,
    explanation: 'La colocación académica correcta en inglés es "provide evidence" (aportar evidencia).',
    category: 'Collocations'
  },
  {
    id: 'b2_q5',
    level: 'B2',
    prompt: 'Elige el modal de deducción lógica en pasado:',
    contextSentence: 'The lights are off and the door is locked; the professor _____ the office.',
    options: ['must have left', 'should leave', 'can leave', 'must leave'],
    correctIndex: 0,
    explanation: '"Must have left" expresa una deducción lógica certera sobre un hecho del pasado.',
    category: 'Grammar'
  },
  {
    id: 'b2_q6',
    level: 'B2',
    prompt: 'Completa con la forma adecuada del Reported Speech:',
    contextSentence: 'The dean announced that the faculty _____ a new artificial intelligence track.',
    options: ['would launch', 'will launch', 'is launching', 'launches'],
    correctIndex: 0,
    explanation: 'En estilo indirecto en pasado ("announced"), el futuro "will" se desplaza a "would".',
    category: 'Grammar'
  },
  {
    id: 'b2_q7',
    level: 'B2',
    prompt: 'Selecciona el conector concesivo formal que encabeza la oración:',
    contextSentence: '_____ the data was inconclusive, the committee granted additional funding.',
    options: ['Although', 'Despite', 'In spite of', 'However'],
    correctIndex: 0,
    explanation: '"Although" introduce una cláusula subordinada completa con sujeto y verbo conjugado.',
    category: 'Collocations'
  },
  {
    id: 'b2_q8',
    level: 'B2',
    prompt: 'Identifica el phrasal verb académico que significa "llevar a cabo":',
    contextSentence: 'The researchers decided to _____ a randomized double-blind trial.',
    options: ['carry out', 'bring up', 'run down', 'take after'],
    correctIndex: 0,
    explanation: '"Carry out" significa ejecutar o realizar una investigación o experimento formal.',
    category: 'Vocabulary'
  },

  // ==========================================================================
  // --- NIVEL C1 (Dominio Operativo Eficaz) ---
  // ==========================================================================
  {
    id: 'c1_q1',
    level: 'C1',
    prompt: 'Identifica la Inversión Enfática negativa correcta:',
    contextSentence: 'Rarely _____ such compelling data presented at an international symposium.',
    options: ['we have seen', 'have we seen', 'we saw', 'did we saw'],
    correctIndex: 1,
    explanation: 'Tras adverbios restrictivos iniciales como "Rarely", se invierte el sujeto y el auxiliar ("have we seen").',
    category: 'Grammar'
  },
  {
    id: 'c1_q2',
    level: 'C1',
    prompt: 'Elige la forma del subjuntivo mandativo académico:',
    contextSentence: 'The ethics committee mandated that the clinical trial _____ immediately.',
    options: ['is suspended', 'be suspended', 'was suspended', 'will be suspended'],
    correctIndex: 1,
    explanation: 'Verbos mandativos (demand, mandate, require) exigen subjuntivo base: "that X be suspended".',
    category: 'Grammar'
  },
  {
    id: 'c1_q3',
    level: 'C1',
    prompt: 'Selecciona la expresión académica de matiz (Hedging):',
    contextSentence: 'The preliminary findings _____ suggest an inverse correlation between the variables.',
    options: ['tentatively', 'bluntly', 'carelessly', 'roughly'],
    correctIndex: 0,
    explanation: '"Tentatively suggest" es el recurso canónico de cautela científica (hedging).',
    category: 'Pragmatics'
  },
  {
    id: 'c1_q4',
    level: 'C1',
    prompt: 'Identifica el modismo formal o metáfora de pensamiento:',
    contextSentence: 'Her keynote address shed substantial _____ on the socio-economic implications of AI.',
    options: ['light', 'sun', 'bright', 'clarity'],
    correctIndex: 0,
    explanation: 'La colocación canónica es "shed light on" (arrojar luz sobre un tema).',
    category: 'Collocations'
  },
  {
    id: 'c1_q5',
    level: 'C1',
    prompt: 'Completa con la inversión condicional formal (omisión de "if"):',
    contextSentence: '_____ you require any further documentation, please do not hesitate to contact us.',
    options: ['Should', 'Had', 'Were', 'Could'],
    correctIndex: 0,
    explanation: '"Should you require..." es la inversión condicional de cortesía formal equivalente a "If you require".',
    category: 'Grammar'
  },
  {
    id: 'c1_q6',
    level: 'C1',
    prompt: 'Selecciona el conector de adición de alto registro académico:',
    contextSentence: 'The system optimizes algorithmic throughput; _____, it mitigates GPU memory latency.',
    options: ['furthermore', 'besides of', 'also that', 'in add'],
    correctIndex: 0,
    explanation: '"Furthermore" aporta densidad y formalidad conectiva de nivel C1.',
    category: 'Collocations'
  },
  {
    id: 'c1_q7',
    level: 'C1',
    prompt: 'Identifica la estructura de participio reducida:',
    contextSentence: '_____ by peer reviews, the revised paper was accepted by the editorial board.',
    options: ['Strengthened', 'Strengthening', 'Having strengthen', 'To strengthen'],
    correctIndex: 0,
    explanation: 'Cláusula de participio pasivo reducida ("Strengthened by...") equivalente a "Because it was strengthened".',
    category: 'Grammar'
  },
  {
    id: 'c1_q8',
    level: 'C1',
    prompt: 'Elige el término de precisión académica para "hacer coincidir":',
    contextSentence: 'The curriculum must be closely _____ with European quality framework standards.',
    options: ['aligned', 'mixed', 'coupled', 'glued'],
    correctIndex: 0,
    explanation: '"Aligned with" es el término estándar de política educativa y concordancia curricular.',
    category: 'Vocabulary'
  },

  // ==========================================================================
  // --- NIVEL C2 (Maestría Bilingüe / Registro Doctoral) ---
  // ==========================================================================
  {
    id: 'c2_q1',
    level: 'C2',
    prompt: 'Selecciona la construcción retórica de defensa académica:',
    contextSentence: 'Far from _____ the core hypothesis, the experimental anomalies actually corroborate it.',
    options: ['undermine', 'undermining', 'to undermine', 'undermined'],
    correctIndex: 1,
    explanation: '"Far from" exige gerundio ("undermining") para expresar rechazo categórico de una objeción.',
    category: 'Grammar'
  },
  {
    id: 'c2_q2',
    level: 'C2',
    prompt: 'Identifica la palabra de registro de precisión doctoral:',
    contextSentence: 'The computational parameters converge _____ toward the theoretical limit as n approaches infinity.',
    options: ['asymptotically', 'wildly', 'suddenly', 'casually'],
    correctIndex: 0,
    explanation: '"Asymptotically" representa el rigor léxico científico de convergencia matemática.',
    category: 'Vocabulary'
  },
  {
    id: 'c2_q3',
    level: 'C2',
    prompt: 'Elige el conector discursivo de matiz sofisticado:',
    contextSentence: 'The reform was enacted, _____; its long-term viability remains dubious.',
    options: ['albeit late', 'notwithstanding', 'inasmuch as', 'whereas'],
    correctIndex: 1,
    explanation: '"Notwithstanding" pospuesto actúa como adverbio de contraste de alta sofisticación retórica.',
    category: 'Collocations'
  },
  {
    id: 'c2_q4',
    level: 'C2',
    prompt: 'Elige la respuesta pragmática idónea en un tribunal doctoral:',
    contextSentence: 'Doctoral Chair: "Can you account for this unexpected variance?" Candidate: "_____"',
    options: [
      'We submit that the variance stems from stochastic quantum fluctuations within the sensor array.',
      'I don\'t know, it just appeared that way in the computer output yesterday.',
      'The test is wrong, my program is definitely working without any bug.'
    ],
    correctIndex: 0,
    explanation: '"We submit that..." es la fórmula canónica de argumentación con aplomo y rigor epistemológico C2.',
    category: 'Pragmatics'
  },
  {
    id: 'c2_q5',
    level: 'C2',
    prompt: 'Identifica la estructura de inversión hipotética extrema (Inverted Subjunctive):',
    contextSentence: '_____ the epistemological paradigm shift to occur, foundational textbooks would require rewrite.',
    options: ['Were', 'Should', 'Had', 'Would'],
    correctIndex: 0,
    explanation: '"Were + subject + to-infinitive" expresa una hipótesis remota y altamente formal de registro C2.',
    category: 'Grammar'
  },
  {
    id: 'c2_q6',
    level: 'C2',
    prompt: 'Selecciona la colocación adverbial de exactitud terminológica:',
    contextSentence: 'The statistical analysis proved _____ congruent with the empirical observations.',
    options: ['unassailably', 'hopelessly', 'rudely', 'loosely'],
    correctIndex: 0,
    explanation: '"Unassailably congruent" (incontestablemente congruente) refleja el calibre léxico de C2.',
    category: 'Collocations'
  },
  {
    id: 'c2_q7',
    level: 'C2',
    prompt: 'Elige el término preciso para expresar "omisión intencionada":',
    contextSentence: 'The treaty\'s _____ silence regarding digital currency jurisdiction was deliberate.',
    options: ['conspicuous', 'blind', 'invisible', 'secret'],
    correctIndex: 0,
    explanation: '"Conspicuous silence" es la colocación diplomática estándar para un silencio deliberado y notorio.',
    category: 'Vocabulary'
  },
  {
    id: 'c2_q8',
    level: 'C2',
    prompt: 'Identifica la construcción estilística de concisión absoluta:',
    contextSentence: 'All reservations having been addressed, the defense committee voted _____ to confer the doctorate.',
    options: ['unanimously', 'one by one', 'personally', 'loudly'],
    correctIndex: 0,
    explanation: 'El ablativo absoluto inicial ("All reservations having been...") culmina formalmente con "voted unanimously".',
    category: 'Pragmatics'
  }
];

export interface PlacementSessionState {
  currentQuestionIndex: number; // 0 a 24 (25 preguntas)
  currentLevelIndex: number;    // 0 = A1, 1 = A2, 2 = B1, 3 = B2, 4 = C1, 5 = C2
  consecutiveCorrect: number;
  consecutiveWrong: number;
  levelCorrectCount: Record<CEFRLevel, number>;
  levelAttemptCount: Record<CEFRLevel, number>;
  answersHistory: {
    questionId: string;
    level: CEFRLevel;
    isCorrect: boolean;
  }[];
  usedQuestionIds: string[];
}

export function createInitialPlacementState(): PlacementSessionState {
  return {
    currentQuestionIndex: 0,
    currentLevelIndex: 0, // Inicia en A1
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    levelCorrectCount: { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 },
    levelAttemptCount: { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 },
    answersHistory: [],
    usedQuestionIds: []
  };
}

// Obtener la siguiente pregunta según el nivel actual sin repetir
export function getNextQuestion(state: PlacementSessionState): PlacementQuestion {
  const targetLevel = CEFR_LEVELS_ORDER[state.currentLevelIndex];
  
  // Buscar en el banco del nivel actual que no hayan sido usadas
  const available = PLACEMENT_QUESTIONS_BANK.filter(
    q => q.level === targetLevel && !state.usedQuestionIds.includes(q.id)
  );

  if (available.length > 0) {
    const chosen = available[Math.floor(Math.random() * available.length)];
    return chosen;
  }

  // Fallback: si se agotaron en el nivel, buscar en niveles adyacentes
  const fallback = PLACEMENT_QUESTIONS_BANK.find(q => !state.usedQuestionIds.includes(q.id));
  return fallback || PLACEMENT_QUESTIONS_BANK[0];
}

// Procesar respuesta del alumno y aplicar la regla adaptativa:
// Si acierta 3 de su nivel -> Salta directamente al siguiente nivel.
// Si falla 2 de su nivel -> Baja al nivel anterior.
export function processAnswer(
  state: PlacementSessionState,
  question: PlacementQuestion,
  selectedOptionIndex: number
): {
  nextState: PlacementSessionState;
  isCorrect: boolean;
  levelChanged: 'UP' | 'DOWN' | 'SAME';
} {
  const isCorrect = selectedOptionIndex === question.correctIndex;
  let nextLevelIndex = state.currentLevelIndex;
  let nextConsecutiveCorrect = isCorrect ? state.consecutiveCorrect + 1 : 0;
  let nextConsecutiveWrong = !isCorrect ? state.consecutiveWrong + 1 : 0;
  let levelChanged: 'UP' | 'DOWN' | 'SAME' = 'SAME';

  const updatedLevelCorrect = { ...state.levelCorrectCount };
  const updatedLevelAttempt = { ...state.levelAttemptCount };

  updatedLevelAttempt[question.level] = (updatedLevelAttempt[question.level] || 0) + 1;
  if (isCorrect) {
    updatedLevelCorrect[question.level] = (updatedLevelCorrect[question.level] || 0) + 1;
  }

  // Regla 1: 3 aciertos consecutivos en el nivel actual -> Salto de nivel
  if (nextConsecutiveCorrect >= 3) {
    if (nextLevelIndex < CEFR_LEVELS_ORDER.length - 1) {
      nextLevelIndex += 1;
      levelChanged = 'UP';
    }
    nextConsecutiveCorrect = 0;
  }

  // Regla 2: 2 fallos consecutivos en el nivel actual -> Descenso de nivel
  if (nextConsecutiveWrong >= 2) {
    if (nextLevelIndex > 0) {
      nextLevelIndex -= 1;
      levelChanged = 'DOWN';
    }
    nextConsecutiveWrong = 0;
  }

  const nextState: PlacementSessionState = {
    currentQuestionIndex: state.currentQuestionIndex + 1,
    currentLevelIndex: nextLevelIndex,
    consecutiveCorrect: nextConsecutiveCorrect,
    consecutiveWrong: nextConsecutiveWrong,
    levelCorrectCount: updatedLevelCorrect,
    levelAttemptCount: updatedLevelAttempt,
    answersHistory: [
      ...state.answersHistory,
      {
        questionId: question.id,
        level: question.level,
        isCorrect
      }
    ],
    usedQuestionIds: [...state.usedQuestionIds, question.id]
  };

  return { nextState, isCorrect, levelChanged };
}

// Calcular el nivel definitivo al completar las 25 preguntas
export function calculateFinalLevel(state: PlacementSessionState): {
  level: CEFRLevel;
  title: string;
  description: string;
  scorePercentage: number;
  totalCorrect: number;
} {
  const total = state.answersHistory.length;
  const totalCorrect = state.answersHistory.filter(a => a.isCorrect).length;
  const scorePercentage = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;

  // Algoritmo ponderado por niveles sostenidos:
  // Evalúa el nivel más alto donde el alumno alcanzó al menos un 60% de aciertos
  let determinedLevelIndex = state.currentLevelIndex;

  for (let i = CEFR_LEVELS_ORDER.length - 1; i >= 0; i--) {
    const lvl = CEFR_LEVELS_ORDER[i];
    const attempts = state.levelAttemptCount[lvl] || 0;
    const correct = state.levelCorrectCount[lvl] || 0;

    if (attempts >= 2 && (correct / attempts) >= 0.6) {
      determinedLevelIndex = Math.max(determinedLevelIndex, i);
      break;
    }
  }

  const finalLevel = CEFR_LEVELS_ORDER[determinedLevelIndex];

  const LEVEL_META: Record<CEFRLevel, { title: string; description: string }> = {
    A1: {
      title: 'A1 • Elemental (Acceso Natural)',
      description: 'Dominio de frases básicas de supervivencia, presentaciones y estructuras fundamentales de input comprensible.'
    },
    A2: {
      title: 'A2 • Plataforma (Básico Independiente)',
      description: 'Capacidad para relatar experiencias pasadas, formular comparaciones y desenvolverse en rutinas universitarias.'
    },
    B1: {
      title: 'B1 • Umbral (Intermedio Autónomo)',
      description: 'Fluidez para conectar ideas, formular hipótesis con condicionales y comprender textos de inmersión sin subtítulos.'
    },
    B2: {
      title: 'B2 • Avanzado (Competencia Académica)',
      description: 'Manejo de estructuras enfáticas, debate argumentativo, oratoria y comprensión de conferencias fluidas.'
    },
    C1: {
      title: 'C1 • Dominio Operativo Eficaz',
      description: 'Precisión con inversiones complejas, registro científico matizado (hedging) y defensa de ideas complejas.'
    },
    C2: {
      title: 'C2 • Maestría Bilingüe Doctoral',
      description: 'Competencia lingüística cercana al nativo culto, apto para defensas doctorales, publicaciones indexadas y negociación internacional.'
    }
  };

  return {
    level: finalLevel,
    title: LEVEL_META[finalLevel].title,
    description: LEVEL_META[finalLevel].description,
    scorePercentage,
    totalCorrect
  };
}

// Mapeo curricular: Lecciones a desbloquear automáticamente según el nivel alcanzado
export function getUnlockedLessonsForLevel(targetLevel: CEFRLevel): string[] {
  const targetIndex = CEFR_LEVELS_ORDER.indexOf(targetLevel);
  const unlocked: string[] = [];

  const LEVEL_LESSON_MAP: Record<CEFRLevel, string[]> = {
    A1: ['a1-lesson-1', 'a1-lesson-2', 'a1-lesson-3', 'a1-lesson-4'],
    A2: ['a2-lesson-1', 'a2-lesson-2', 'a2-lesson-3', 'a2-lesson-4'],
    B1: ['b1-lesson-1', 'b1-lesson-2', 'b1-lesson-3', 'b1-lesson-4'],
    B2: ['b2-lesson-1', 'b2-lesson-2', 'b2-lesson-3', 'b2-lesson-4'],
    C1: ['c1-lesson-1', 'c1-lesson-2', 'c1-lesson-3', 'c1-lesson-4'],
    C2: ['c2-lesson-1', 'c2-lesson-2', 'c2-lesson-3', 'c2-lesson-4']
  };

  for (let i = 0; i <= targetIndex; i++) {
    const lvl = CEFR_LEVELS_ORDER[i];
    unlocked.push(...(LEVEL_LESSON_MAP[lvl] || []));
  }

  return unlocked;
}
