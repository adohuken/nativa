// ============================================================================
// FLUENTIA • TALLER DE PROYECTOS ACADÉMICOS UNIVERSITARIOS (MCER A1 - C2)
// Basado en el Enfoque por Tareas (TBLT) y Rúbricas Oficiales de Oxford/Cambridge
// ============================================================================

export interface AcademicProjectDefinition {
  unit: number;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  title: string;
  badge: string;
  context: string;
  instructions: string;
  suggestedPrompt: string;
  minWords: number;
  maxWords: number;
  requiredKeywords: string[];
  rubricGuidance: {
    taskAchievementTip: string;
    coherenceTip: string;
    lexicalTip: string;
    accuracyTip: string;
  };
}

export const ACADEMIC_PROJECTS: AcademicProjectDefinition[] = [
  {
    unit: 1,
    level: 'A1',
    title: 'Carta de Admisión y Presentación Formal en la Facultad',
    badge: 'Formulario & Perfil',
    context: 'Llegada oficial a University College London. Debes completar tu carta de presentación formal ante el decanato estudiantil.',
    instructions: 'Escribe tu presentación formal indicando tu nombre, edad, país de origen, carrera de interés y qué instalaciones del campus deseas utilizar (biblioteca, laboratorios, aulas).',
    suggestedPrompt: "Hello, my name is David. I am twenty-five years old and I am from Nicaragua. I am a student of Computer Science. This university is very modern. I want to study in the central library...",
    minWords: 35,
    maxWords: 100,
    requiredKeywords: ['student', 'university', 'from', 'am', 'is', 'library'],
    rubricGuidance: {
      taskAchievementTip: 'Menciona claramente tu identidad, edad y motivos de estudio.',
      coherenceTip: 'Conecta tus ideas con conjunciones básicas como "and", "but", "because".',
      lexicalTip: 'Utiliza sustantivos académicos precisos (faculty, campus, laboratory, lecture).',
      accuracyTip: 'Cuida el verbo To Be ("I am", nunca "I have 25 years") y los artículos ("a student").'
    }
  },
  {
    unit: 2,
    level: 'A2',
    title: 'Cartel Normativo y Protocolo de Seguridad del Laboratorio',
    badge: 'Normas & Protocolos',
    context: 'El departamento de ciencias te ha encomendado redactar el manual de directrices y recomendaciones para los nuevos investigadores.',
    instructions: 'Redacta un protocolo que incluya 3 normas obligatorias (must / have to), 2 recomendaciones preventivas (should) y 1 prohibición estricta (must not).',
    suggestedPrompt: "Safety Protocol for Laboratory 4-B. All researchers must wear protective goggles and lab coats. You have to wash your hands before touching biological samples. You should double-check all digital measurements. You mustn't bring food or drinks inside...",
    minWords: 50,
    maxWords: 130,
    requiredKeywords: ['must', 'should', 'laboratory', 'protective', 'safety', 'equipment'],
    rubricGuidance: {
      taskAchievementTip: 'Establece obligaciones ineludibles y prohibiciones claras.',
      coherenceTip: 'Usa marcadores ordenados como "First", "Furthermore", "Finally".',
      lexicalTip: 'Incorpora léxico de bioseguridad y prevención industrial.',
      accuracyTip: 'Distingue con precisión "must not" (prohibido) de "don\'t have to" (opcional).'
    }
  },
  {
    unit: 3,
    level: 'B1',
    title: 'Curriculum Vitae Ejecutivo y Carta de Logros Verificables',
    badge: 'CV & Logros B1',
    context: 'Postulación a una beca internacional de investigación científica o tecnológica en el Imperial College.',
    instructions: 'Describe tu trayectoria profesional y académica conectando tus logros pasados con tu valor actual (Presente Perfecto con for/since/already) y plantea qué aportarías de ser seleccionado (Condicional 2).',
    suggestedPrompt: "Statement of Purpose. I have worked on software engineering and data analytics for over three years. Since 2023, I have led international collaborative repositories. If I were selected for this scholarship, I would contribute to sustainable technological solutions...",
    minWords: 80,
    maxWords: 180,
    requiredKeywords: ['experience', 'have', 'for', 'since', 'if', 'would', 'project'],
    rubricGuidance: {
      taskAchievementTip: 'Demuestra impacto demostrable cuantificando tus años de experiencia.',
      coherenceTip: 'Articula párrafos lógicos con conectores como "Moreover", "Consequently".',
      lexicalTip: 'Emplea verbos de acción fuertes (coordinated, developed, initiated, published).',
      accuracyTip: 'Evita mezclar fechas cerradas en pasado simple con presente perfecto.'
    }
  },
  {
    unit: 4,
    level: 'B2',
    title: 'Discurso de Debate Parlamentario Oxford: Ética e IA',
    badge: 'Debate Oxford B2',
    context: 'Sesión plenaria de la Oxford Union Society. Defiendes una postura rigurosa sobre el impacto ético de la automatización cognitiva.',
    instructions: 'Redacta tu intervención formal utilizando estructuras de énfasis (cleft sentences: "What concerns our delegation is..."), preguntas indirectas diplomáticas y análisis contrafáctico (3er condicional: "Had regulation been enacted...").',
    suggestedPrompt: "Mr. Chairman and esteemed colleagues: What our delegation wishes to underscore is that technological disruption is not inherently detrimental. If institutions had anticipated the velocity of machine learning models, proactive frameworks would have been established earlier. It is precisely empirical transparency that ensures public trust...",
    minWords: 110,
    maxWords: 240,
    requiredKeywords: ['what', 'is', 'empirical', 'evidence', 'would have', 'furthermore', 'hypothesis'],
    rubricGuidance: {
      taskAchievementTip: 'Defiende tu tesis con contundencia retórica y elegancia parlamentaria.',
      coherenceTip: 'Emplea oraciones escindidas (cleft sentences) para guiar la atención del jurado.',
      lexicalTip: 'Usa vocabulario académico de la lista AWL (disparity, cognitive, paradigm, infrastructure).',
      accuracyTip: 'Aplica el condicional retrospectivo sin introducir "would have" dentro del "if".'
    }
  },
  {
    unit: 5,
    level: 'C1',
    title: 'Abstract Indexado y Ensayo Crítico con Estilo APA/MLA',
    badge: 'Paper Indexado C1',
    context: 'Sumisión de manuscrito científico a la revista Nature Machine Intelligence con respuesta a revisores anónimos.',
    instructions: 'Redacta un abstract de investigación que contenga introducción, metodología, hallazgos empíricos y conclusiones cautelosas (hedging: "the data suggest", "arguably"), incluyendo al menos una inversión enfática ("Not only does...", "Seldom have...").',
    suggestedPrompt: "Abstract: Seldom has algorithmic transparency confronted such intense scrutiny across healthcare ecosystems. Not only does the proposed neural architecture enhance diagnostic interpretability, but it also minimizes racial disparity in predictive outcomes. While preliminary metrics arguably support systemic deployment, longitudinal peer review remains imperative before commercial adoption...",
    minWords: 130,
    maxWords: 280,
    requiredKeywords: ['not only', 'suggest', 'arguably', 'empirical', 'findings', 'imperative', 'methodology'],
    rubricGuidance: {
      taskAchievementTip: 'Sintetiza el problema, la metodología y la significancia epistemológica.',
      coherenceTip: 'Flujo cohesivo sin fracturas con nexos de transición (notwithstanding, conversely, thereby).',
      lexicalTip: 'Nominalización académica de alta densidad (disparity, interpretability, scrutiny).',
      accuracyTip: 'Ejecuta la inversión auxiliar-sujeto formal sin vacilación sintáctica.'
    }
  },
  {
    unit: 6,
    level: 'C2',
    title: 'Discurso de Clausura y Defensa de Tesis Doctoral C2',
    badge: 'Defensa Doctoral C2',
    context: 'Gran Salón de Actos de Oxford. Cierre de tu defensa doctoral de 30 minutos frente al tribunal examinador y panel evaluador hostil.',
    instructions: 'Redacta la alocución de cierre de tu tesis de doctorado. Responde con serenidad socrática a las objeciones del tribunal, refuta las críticas mediante evidencia asintótica ("Far from being an ontological flaw..."), utiliza atenuaciones cultas (understatement) y declara el aporte epistemológico universal de tu investigación.',
    suggestedPrompt: "Mr. Chairman, esteemed examiners: Far from representing an ontological deficiency, the integration of Bayesian priors provides the exact mathematical foundation required to avert catastrophic divergence. While we acknowledge the examiner's polite skepticism regarding out-of-distribution generalization, our empirical theorems demonstrate asymptotic stability under minimax perturbation. We respectfully submit that our inquiry establishes a unified theoretical bridge between discrete computing and macro-social equilibrium...",
    minWords: 150,
    maxWords: 350,
    requiredKeywords: ['far from', 'examiners', 'thereby', 'asymptotic', 'substantiate', 'empirical', 'submit'],
    rubricGuidance: {
      taskAchievementTip: 'Desactiva con compostura zen y rigor matemático las objeciones del jurado.',
      coherenceTip: 'Prosa doctoral magistral con cadencia rítmica socrática.',
      lexicalTip: 'Léxico de máxima erudición anglosajona (asymptotic, ontology, perturbation, heuristic).',
      accuracyTip: 'Control absoluto del estilo formal, subjuntivos mandatarios y fórmulas canónicas C2.'
    }
  }
];

export function evaluateProjectSubmission(
  project: AcademicProjectDefinition,
  studentText: string
) {
  const words = studentText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Task Achievement (0 - 25)
  let taskScore = 0;
  if (wordCount >= project.minWords && wordCount <= project.maxWords * 1.3) {
    taskScore = 24;
  } else if (wordCount >= project.minWords * 0.7) {
    taskScore = 18;
  } else if (wordCount >= project.minWords * 0.4) {
    taskScore = 12;
  } else {
    taskScore = 8;
  }

  // 2. Lexical Resource (0 - 25)
  const lowerText = studentText.toLowerCase();
  let matchedKeywords = 0;
  project.requiredKeywords.forEach((kw) => {
    if (lowerText.includes(kw.toLowerCase())) {
      matchedKeywords += 1;
    }
  });

  const keywordRatio = project.requiredKeywords.length > 0 
    ? matchedKeywords / project.requiredKeywords.length 
    : 1;
  const lexicalScore = Math.min(25, Math.round(keywordRatio * 25));

  // 3. Coherence and Cohesion (0 - 25)
  const cohesionMarkers = [
    'and', 'because', 'furthermore', 'moreover', 'however', 'consequently',
    'in addition', 'first', 'finally', 'while', 'whereas', 'thereby',
    'not only', 'notwithstanding', 'in contrast', 'therefore', 'as a result'
  ];
  let foundMarkers = 0;
  cohesionMarkers.forEach((m) => {
    if (lowerText.includes(m)) foundMarkers += 1;
  });
  const coherenceScore = Math.min(25, Math.max(12, foundMarkers * 5));

  // 4. Grammatical Accuracy (0 - 25)
  // Penalizaciones leves por errores comunes
  let accuracyScore = 23;
  if (lowerText.includes('i have 25 years') || lowerText.includes('i have 20 years')) accuracyScore -= 6;
  if (lowerText.includes('if i would have')) accuracyScore -= 6;
  if (lowerText.includes('more better') || lowerText.includes('more good')) accuracyScore -= 6;
  if (lowerText.includes('informations')) accuracyScore -= 4;
  if (lowerText.includes('did not went')) accuracyScore -= 6;

  accuracyScore = Math.max(10, Math.min(25, accuracyScore));

  const overallScore = taskScore + lexicalScore + coherenceScore + accuracyScore; // 0 - 100

  let feedback = '';
  if (overallScore >= 88) {
    feedback = `¡Trabajo académico de excelencia sobresaliente (${overallScore}/100)! Tu redacción demuestra dominio del registro, vocabulario técnico preciso y una articulación lógica impecable acorde al nivel MCER ${project.level}.`;
  } else if (overallScore >= 70) {
    feedback = `¡Muy buen proyecto universitario (${overallScore}/100)! Has cumplido los objetivos esenciales de la tarea con cohesión adecuada. Revisa las palabras clave sugeridas para enriquecer aún más tu léxico.`;
  } else {
    feedback = `Proyecto recibido (${overallScore}/100). Te recomendamos ampliar la extensión para cumplir la longitud mínima requerida e incorporar las estructuras gramaticales de la unidad.`;
  }

  return {
    overallScore,
    wordCount,
    rubricScores: {
      taskAchievement: taskScore,
      coherenceCohesion: coherenceScore,
      lexicalResource: lexicalScore,
      grammaticalAccuracy: accuracyScore
    },
    feedback,
    isPassing: overallScore >= 60
  };
}
