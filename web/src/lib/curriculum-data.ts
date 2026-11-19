// ============================================================================
// FLUENTIA • BANCO CURRICULAR UNIVERSITARIO COMPLETO (MCER A1 HASTA C2)
// Basado en el Temario Universitario Oficial y la Metodología de Stephen Krashen (SLA)
// ============================================================================

export type ExerciseType = 
  | 'DIALOGUE_IMMERSION'       // Paso 1: Audio contextual narrativo de 6-8 turnos
  | 'AUDITORY_COMPREHENSION'   // Paso 2: Pregunta auditiva de sentido global (Gist)
  | 'SENTENCE_BUILDER'         // Paso 3: Constructor de frases por bloques ordenables
  | 'SHADOWING_STUDIO'         // Paso 4: Práctica fonética de 3 frases progresivas
  | 'MONITOR_REPAIR'           // Paso 5: Corrección del filtro hispanohablante (Monitor Model)
  | 'MASTERY_CHALLENGE';       // Paso 6: Reto final para abrir el candado

export interface DialogueLine {
  speaker: string;
  en: string;
  es: string;
  phonetic?: string;
}

export interface ShadowingPhrase {
  levelLabel: string;
  en: string;
  phonetic: string;
  tip: string;
}

export interface StoryEvent {
  id: string;
  en: string;
  es: string;
  order: number;
}

export interface NoticingInsight {
  concept: string;
  quoteEn: string;
  quoteEs: string;
  explanation: string;
  pragmaticChoice?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    insight: string;
  };
}

export interface IntensiveLesson {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  unit: number;
  unitTitle: string;
  code: string;
  title: string;
  subtitle: string;
  academicProject?: string;
  xpReward: number;
  prerequisiteId: string | null;

  // Los 6 Pasos Intensivos Krashen
  step1_dialogue: {
    context: string;
    lines: DialogueLine[];
  };
  step2_comprehension: {
    prompt: string;
    audioContextText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  step3_builder: {
    instruction: string;
    targetTranslationEs: string;
    correctWords: string[];
    scrambledWords: string[];
  };
  step3_story_sequence?: {
    instruction: string;
    events: StoryEvent[];
  };
  step4_shadowing: {
    instruction: string;
    phrases: ShadowingPhrase[];
  };
  step5_monitor: {
    faultySentence: string;
    explanationConcept: string;
    options: string[];
    correctIndex: number;
    ruleInsight: string;
  };
  step5_noticing?: NoticingInsight;
  step6_mastery: {
    question: string;
    options: string[];
    correctIndex: number;
    successMessage: string;
  };
}

export const COMPREHENSIVE_CURRICULUM: IntensiveLesson[] = [
  // ==========================================================================
  // UNIDAD 1: NIVEL A1 • FUNDAMENTOS Y SUPERVIVENCIA UNIVERSITARIA
  // ==========================================================================
  {
    id: 'a1-lesson-1',
    level: 'A1',
    unit: 1,
    unitTitle: 'Unidad 1 • Fundamentos y Supervivencia Universitaria',
    code: '1.1',
    title: 'Llegar a Londres: quién soy y de dónde vengo',
    subtitle: 'Preséntate con naturalidad en el centro de conferencias y describe tu origen sin traducir mentalmente',
    academicProject: 'Presentarse formal e informalmente ante la facultad y llenar formularios de admisión.',
    xpReward: 35,
    prerequisiteId: null,
    step1_dialogue: {
      context: 'Llegada al Centro de Conferencias Internacional en Covent Garden, Londres.',
      lines: [
        { speaker: 'Receptionist', en: "Hello! Welcome to London. Are you David from Nicaragua?", es: "¡Hola! Bienvenido a Londres. ¿Eres David de Nicaragua?", phonetic: "/həˈloʊ ˈwɛlkəm tuː ˈlʌndən/" },
        { speaker: 'David', en: "Yes, I am. I'm very excited to be here for the workshop.", es: "Sí. Estoy muy emocionado de estar aquí para el taller.", phonetic: "/jɛs aɪ æm aɪm ˈvɛri ɪkˈsaɪtɪd/" },
        { speaker: 'Receptionist', en: "Wonderful. Are you thirty years old or twenty-five?", es: "Maravilloso. ¿Tienes treinta años o veinticinco?", phonetic: "/ɑːr juː ˈθɜːrti jɪərz oʊld/" },
        { speaker: 'David', en: "I'm twenty-five years old. My colleague is thirty.", es: "Tengo veinticinco años. Mi colega tiene treinta.", phonetic: "/aɪm ˈtwɛnti faɪv jɪərz oʊld/" },
        { speaker: 'Receptionist', en: "Perfect. This is your access badge and that is room four-B.", es: "Perfecto. Este es tu gafete de acceso y aquella es la sala 4-B.", phonetic: "/ðɪs ɪz jɔːr ˈæksɛs bædʒ/" },
        { speaker: 'David', en: "Thank you so much! Is the room on the second floor?", es: "¡Muchas gracias! ¿La sala está en el segundo piso?", phonetic: "/ɪz ðə ruːm ɒn ðə ˈsɛkənd flɔːr/" }
      ]
    },
    step2_comprehension: {
      prompt: "Según la conversación que acabas de escuchar, ¿cuál es la situación real de David?",
      audioContextText: "David is twenty-five years old and he is from Nicaragua attending a university workshop.",
      options: [
        "David has thirty years and lives in London permanently.",
        "David is twenty-five years old and is attending a workshop.",
        "David is not from Nicaragua and his badge is lost."
      ],
      correctIndex: 1,
      explanation: "¡Excelente comprensión auditiva! David tiene 25 años y acude al taller en Londres."
    },
    step3_builder: {
      instruction: "Construye la oración correcta en inglés tocando las palabras en orden:",
      targetTranslationEs: "Tengo veinticinco años y soy de Nicaragua.",
      correctWords: ["I", "am", "twenty-five", "years", "old", "and", "I'm", "from", "Nicaragua."],
      scrambledWords: ["from", "years", "I", "Nicaragua.", "am", "and", "have", "twenty-five", "I'm", "old"]
    },
    step4_shadowing: {
      instruction: "Entrena tu pronunciación y el ritmo enlazado con estas 3 frases:",
      phrases: [
        { levelLabel: "Nivel 1 • Ritmo Corto", en: "I am ready for the workshop.", phonetic: "/aɪ æm ˈrɛdi fɔːr ðə ˈwɜːrkˌʃɑːp/", tip: "Pronuncia 'I am' como una base firme sin cortar el aliento." },
        { levelLabel: "Nivel 2 • Enlace Fonético", en: "This is your access badge.", phonetic: "/ðɪs ɪz jɔːr ˈæksɛs bædʒ/", tip: "Enlaza 'This is' como /ðɪ-sɪz/. La 's' final se fusiona con la vocal." },
        { levelLabel: "Nivel 3 • Velocidad Nativa", en: "I'm twenty-five years old and she is thirty.", phonetic: "/aɪm ˈtwɛnti faɪv jɪərz oʊld ænd ʃiː ɪz ˈθɜːrti/", tip: "En 'years old', enlaza la 's' sonora con la vocal: /jɪər-zoʊld/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'I have 25 years and am a student from Spain.'",
      explanationConcept: "El error hispanohablante de posesión vs estado (To Be)",
      options: [
        "I have 25 years old and I am student from Spain.",
        "I am twenty-five years old and I'm a student from Spain.",
        "I am twenty-five years and am student of Spain."
      ],
      correctIndex: 1,
      ruleInsight: "En inglés la edad es un estado ontológico: eres tu edad ('I am 25 years old'). Nunca utilices el verbo poseer ('have'). Además, los sustantivos contables singulares requieren artículo ('a student')."
    },
    step6_mastery: {
      question: "¿Cómo responderías con naturalidad nativa si el recepcionista te pregunta: 'Are you from Madrid?'",
      options: [
        "No, I am not. I'm from Managua, Nicaragua.",
        "No, I don't. I from Managua.",
        "No, I have not from Madrid."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 1.1 Dominado! Tu cerebro asimiló el verbo To Be sin pasar por la traducción de 'tener'."
    }
  },
  {
    id: 'a1-lesson-2',
    level: 'A1',
    unit: 1,
    unitTitle: 'Unidad 1 • Fundamentos y Supervivencia Universitaria',
    code: '1.2',
    title: 'El inventario del campus: pedir y señalar lo que necesitas',
    subtitle: 'Identifica, solicita y cataloga recursos en el laboratorio universitario',
    academicProject: 'Identificar y catalogar recursos en el laboratorio universitario.',
    xpReward: 35,
    prerequisiteId: 'a1-lesson-1',
    step1_dialogue: {
      context: 'En el laboratorio universitario de informática de University College London.',
      lines: [
        { speaker: 'Lab Assistant', en: "Excuse me, is this an electronic tablet or a notebook?", es: "Disculpe, ¿es esto una tableta electrónica o un cuaderno?", phonetic: "/ɪz ðɪs ən ˌɪlɛkˈtrɑːnɪk ˈtæblət ɔːr ə ˈnoʊtbʊk/" },
        { speaker: 'David', en: "This is an electronic tablet. Those are the lab notebooks.", es: "Esta es una tableta electrónica. Aquellos son los cuadernos del laboratorio.", phonetic: "/ðɪs ɪz ən ˌɪlɛkˈtrɑːnɪk ˈtæblət ðoʊz ɑːr ðə læb ˈnoʊtbʊks/" },
        { speaker: 'Lab Assistant', en: "Great! And where is the main server key?", es: "¡Genial! ¿Y dónde está la llave del servidor principal?", phonetic: "/ɡreɪt ænd wɛər ɪz ðə meɪn ˈsɜːrvər kiː/" },
        { speaker: 'David', en: "That is the key right there, next to the monitor.", es: "Aquella es la llave justo allí, al lado del monitor.", phonetic: "/ðæt ɪz ðə kiː raɪt ðɛər nɛkst tuː ðə ˈmɑːnɪtər/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué objeto específico está señalando David cuando utiliza 'That is the key'?",
      audioContextText: "That is the key right there, next to the monitor on the desk.",
      options: [
        "Un objeto que tiene en su propia mano.",
        "Un objeto que está a cierta distancia, cerca del monitor.",
        "Un grupo de cuadernos sobre la mesa."
      ],
      correctIndex: 1,
      explanation: "'That' se usa para un solo objeto que se encuentra a cierta distancia del hablante."
    },
    step3_builder: {
      instruction: "Ordena los bloques para formar la descripción correcta:",
      targetTranslationEs: "Esta es una oportunidad importante para el equipo.",
      correctWords: ["This", "is", "an", "important", "opportunity", "for", "the", "team."],
      scrambledWords: ["team.", "This", "a", "important", "for", "is", "opportunity", "an", "the"]
    },
    step4_shadowing: {
      instruction: "Entrena el contraste vocal entre 'a' y 'an':",
      phrases: [
        { levelLabel: "Regla del Sonido Vocal", en: "This is an apple and that is a computer.", phonetic: "/ðɪs ɪz ən ˈæpl ænd ðæt ɪz ə kəmˈpjuːtər/", tip: "'An' se usa antes de sonidos vocálicos para evitar el choque de aire." },
        { levelLabel: "Demostrativo Plural", en: "These books are very useful.", phonetic: "/ðiːz bʊks ɑːr ˈvɛri ˈjuːsfəl/", tip: "Alarga la vocal en 'These' /ðiːz/ para diferenciarlo de 'This' /ðɪs/." },
        { levelLabel: "Distancia Lejana", en: "Those are the laboratory instruments.", phonetic: "/ðoʊz ɑːr ðə ˈlæbrəˌtɔːri ˈɪnstrəmənts/", tip: "Comienza con la lengua entre los dientes en 'Those' /ðoʊz/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'This is a university and that is a hour of class.'",
      explanationConcept: "Sonido vocálico vs consonántico en 'a' vs 'an'",
      options: [
        "This is an university and that is a hour of class.",
        "This is a university and that is an hour of class.",
        "This is an university and that is an hour of class."
      ],
      correctIndex: 1,
      ruleInsight: "'University' empieza con sonido consonántico /juː/ (como 'you'), por lo que lleva 'a'. En cambio, 'hour' tiene una 'h' muda y suena como vocal /aʊər/, por lo que exige 'an'."
    },
    step6_mastery: {
      question: "¿Cuál opción clasifica correctamente varios objetos cercanos a ti?",
      options: [
        "These are our research documents.",
        "This are our research documents.",
        "Those is our research documents."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 1.2 Conquistado! Ya dominas la catalogación espacial y los artículos definidos e indefinidos."
    }
  },
  {
    id: 'a1-lesson-3',
    level: 'A1',
    unit: 1,
    unitTitle: 'Unidad 1 • Fundamentos y Supervivencia Universitaria',
    code: '1.3',
    title: 'Un día en la universidad: ritmos, rutinas y horarios',
    subtitle: 'Coordina calendarios, hábitos de estudio y frecuencias académicas con tu equipo',
    academicProject: 'Describir un horario semanal de estudio y entrevistar a un compañero sobre rutinas.',
    xpReward: 35,
    prerequisiteId: 'a1-lesson-2',
    step1_dialogue: {
      context: 'En la cafetería universitaria coordinando el calendario de investigación semestral.',
      lines: [
        { speaker: 'Sarah', en: "David, what time do you usually start your study sessions?", es: "David, ¿a qué hora comienzas habitualmente tus sesiones de estudio?", phonetic: "/wɑːt taɪm duː juː ˈjuːʒuəli stɑːrt jɔːr ˈstʌdi ˈsɛʃənz/" },
        { speaker: 'David', en: "I always wake up at six, and my research partner arrives at eight.", es: "Siempre me despierto a las seis, y mi compañera de investigación llega a las ocho.", phonetic: "/aɪ ˈɔːlweɪz weɪk ʌp æt sɪks ænd maɪ rɪˈsɜːrtʃ ˈpɑːrtnər əˈraɪvz æt eɪt/" },
        { speaker: 'Sarah', en: "Does she bring the library books every morning?", es: "¿Ella trae los libros de la biblioteca cada mañana?", phonetic: "/dʌz ʃiː brɪŋ ðə ˈlaɪˌbrɛri bʊks ˈɛvri ˈmɔːrnɪŋ/" },
        { speaker: 'David', en: "Yes, she does. She never misses a morning lecture.", es: "Sí. Ella nunca falta a una clase matutina.", phonetic: "/jɛs ʃiː dʌz ʃiː ˈnɛvər ˈmɪsɪz ə ˈmɔːrnɪŋ ˈlɛktʃər/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué ocurre todas las mañanas según la respuesta de David?",
      audioContextText: "David's partner arrives at eight and she never misses a morning lecture.",
      options: [
        "David nunca asiste a las conferencias.",
        "La compañera de David llega a las ocho y nunca falta a clases.",
        "Sarah cancela las sesiones de estudio por la tarde."
      ],
      correctIndex: 1,
      explanation: "David confirma que su compañera llega a las ocho y nunca pierde una clase matutina."
    },
    step3_builder: {
      instruction: "Arma la frase en el orden gramatical y temporal exacto:",
      targetTranslationEs: "Ella siempre lee artículos científicos antes de dormir.",
      correctWords: ["She", "always", "reads", "scientific", "papers", "before", "sleeping."],
      scrambledWords: ["reads", "sleeping.", "papers", "always", "She", "read", "before", "scientific"]
    },
    step4_shadowing: {
      instruction: "Internaliza la sonoridad de la 's' de tercera persona:",
      phrases: [
        { levelLabel: "Adverbio de Frecuencia", en: "I usually study in the central library.", phonetic: "/aɪ ˈjuːʒuəli ˈstʌdi ɪn ðə ˈsɛntrəl ˈlaɪˌbrɛri/", tip: "Coloca 'usually' entre el sujeto y el verbo principal." },
        { levelLabel: "Tercera Persona Sonora", en: "He arrives at eight sharp.", phonetic: "/hiː əˈraɪvz æt eɪt ʃɑːrp/", tip: "La terminación en 'arrives' suena como un zumbido /z/ vibrante." },
        { levelLabel: "Pregunta con Auxiliar", en: "Does she practice speaking every day?", phonetic: "/dʌz ʃiː ˈpræktɪs ˈspiːkɪŋ ˈɛvri deɪ/", tip: "Al usar 'Does', el verbo vuelve a su forma base sin la 's' final." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'He always work hard and do not complains.'",
      explanationConcept: "Concordancia de tercera persona singular en presente",
      options: [
        "He always works hard and does not complain.",
        "He always work hard and does not complains.",
        "He always working hard and do not complain."
      ],
      correctIndex: 0,
      ruleInsight: "En la afirmación de tercera persona (he/she/it) agregamos -s ('works'). En la negación usamos 'does not' y el verbo principal queda en infinitivo desnudo ('complain')."
    },
    step6_mastery: {
      question: "¿Cuál oración describe con precisión nativa la rutina de un investigador?",
      options: [
        "Dr. Evans analyzes experimental data every afternoon.",
        "Dr. Evans analyze experimental data every afternoon.",
        "Dr. Evans is analyze experimental data always."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 1.3 Superado! La tercera persona ya fluye en tu memoria procedimental sin esfuerzo reflexivo."
    }
  },
  {
    id: 'a1-lesson-4',
    level: 'A1',
    unit: 1,
    unitTitle: 'Unidad 1 • Fundamentos y Supervivencia Universitaria',
    code: '1.4',
    title: 'Encontrar el aula: pedir indicaciones con cortesía',
    subtitle: 'Navega el campus, formula peticiones corteses y ubica salas y auditorios',
    academicProject: 'Dar direcciones para llegar a la biblioteca universitaria y pedir en el comedor estudiantil.',
    xpReward: 40,
    prerequisiteId: 'a1-lesson-3',
    step1_dialogue: {
      context: 'En el patio central de la universidad buscando el auditorio de ciencias.',
      lines: [
        { speaker: 'Student', en: "Excuse me, is there a quiet study room near the main gate?", es: "Disculpe, ¿hay una sala de estudio silenciosa cerca de la puerta principal?", phonetic: "/ɪz ðɛər ə ˈkwaɪət ˈstʌdi ruːm nɪər ðə meɪn ɡeɪt/" },
        { speaker: 'Guide', en: "Yes, there is. There are three study halls on the first floor.", es: "Sí, la hay. Hay tres salas de estudio en el primer piso.", phonetic: "/jɛs ðɛər ɪz ðɛər ɑːr θriː ˈstʌdi hɔːlz ɒn ðə fɜːrst flɔːr/" },
        { speaker: 'Student', en: "Could you please tell me how to get to the dining hall?", es: "¿Podría por favor decirme cómo llegar al comedor estudiantil?", phonetic: "/kʊd juː pliːz tɛl miː haʊ tuː ɡɛt tuː ðə ˈdaɪnɪŋ hɔːl/" },
        { speaker: 'Guide', en: "Of course. Go straight ahead and turn right at the fountain.", es: "Por supuesto. Vaya recto y gire a la derecha en la fuente.", phonetic: "/ɒv kɔːrs ɡoʊ streɪt əˈhɛd ænd tɜːrn raɪt æt ðə ˈfaʊntn/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Dónde se encuentran las salas de estudio silenciosas según el guía?",
      audioContextText: "There are three study halls located on the first floor near the gate.",
      options: [
        "En el sótano al lado del comedor.",
        "En el primer piso del edificio principal.",
        "No hay ninguna sala disponible en el campus."
      ],
      correctIndex: 1,
      explanation: "El guía señala que hay tres salas de estudio ubicadas en el primer piso."
    },
    step3_builder: {
      instruction: "Ordena los bloques para formular una petición cortés:",
      targetTranslationEs: "¿Podría usted prestarme el mapa del campus por favor?",
      correctWords: ["Could", "you", "lend", "me", "the", "campus", "map,", "please?"],
      scrambledWords: ["map,", "you", "the", "Could", "lend", "please?", "me", "campus", "can"]
    },
    step4_shadowing: {
      instruction: "Practica la entonación cortés ascendente:",
      phrases: [
        { levelLabel: "Existencia Singular", en: "Is there a computer available?", phonetic: "/ɪz ðɛər ə kəmˈpjuːtər əˈveɪləbl/", tip: "Eleva el tono al final de la pregunta de confirmación." },
        { levelLabel: "Existencia Plural", en: "There are many books in the archive.", phonetic: "/ðɛər ɑːr ˈmɛni bʊks ɪn ðiː ˈɑːrkaɪv/", tip: "Pronuncia 'There are' como /ðɛ-rɑːr/ en un solo golpe de voz." },
        { levelLabel: "Petición Formal", en: "Could I have a cup of tea, please?", phonetic: "/kʊd aɪ hæv ə kʌp əv tiː pliːz/", tip: "La 'l' en 'Could' es completamente muda: /kʊd/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'In this university have many laboratories.'",
      explanationConcept: "Confusión del verbo tener con existencia existencial (There is / There are)",
      options: [
        "In this university has many laboratories.",
        "In this university there are many laboratories.",
        "In this university are having many laboratories."
      ],
      correctIndex: 1,
      ruleInsight: "En español se usa el impersonal 'hay', pero en inglés nunca se usa 'have' o 'has' para indicar existencia; la estructura correcta obligatoria es 'there is' (singular) o 'there are' (plural)."
    },
    step6_mastery: {
      question: "¿Cómo indicas que hay un cajero automático en la entrada?",
      options: [
        "There is an ATM right at the entrance.",
        "It have an ATM right at the entrance.",
        "Is having an ATM right at the entrance."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel A1 Completado con Honores Universitarios! Tienes la base de supervivencia y presencia académica."
    }
  },

  // ==========================================================================
  // UNIDAD 2: NIVEL A2 • COMUNICACIÓN COTIDIANA Y RELATOS ACADÉMICOS
  // ==========================================================================
  {
    id: 'a2-lesson-1',
    level: 'A2',
    unit: 2,
    unitTitle: 'Unidad 2 • Comunicación Cotidiana y Relatos',
    code: '2.1',
    title: 'Mi primer fin de semana en Londres: contar qué hice',
    subtitle: 'Narra anécdotas de viajes, lugares visitados y experiencias del fin de semana dominando el pasado simple natural',
    academicProject: 'Escribir un diario de viaje narrando las anécdotas y lugares visitados en tu primer fin de semana.',
    xpReward: 40,
    prerequisiteId: 'a1-lesson-4',
    step1_dialogue: {
      context: 'En la sala común de la residencia universitaria charlando sobre el fin de semana.',
      lines: [
        { speaker: 'Emma', en: "How was your first weekend in London, David? Did you explore the city?", es: "¿Cómo estuvo tu primer fin de semana en Londres, David? ¿Exploraste la ciudad?", phonetic: "/haʊ wəz jɔːr fɜːrst ˈwiːkˌɛnd ɪn ˈlʌndən ˈdeɪvɪd dɪd juː ɪkˈsplɔːr ðə ˈsɪti/" },
        { speaker: 'David', en: "It was fantastic! On Saturday morning, I walked through Hyde Park and saw Kensington Palace.", es: "¡Fue fantástico! El sábado por la mañana caminé por Hyde Park y vi el Palacio de Kensington.", phonetic: "/ɪt wəz fænˈtæstɪk ɒn ˈsætərdeɪ ˈmɔːrnɪŋ aɪ wɔːkt θruː haɪd pɑːrk ænd sɔː ˈkɛnzɪŋtən ˈpæləs/" },
        { speaker: 'Emma', en: "Did you visit any museums? The British Museum is very close to campus.", es: "¿Visitaste algún museo? El Museo Británico está muy cerca del campus.", phonetic: "/dɪd juː ˈvɪzɪt ˈɛni mjuːˈziːəmz ðə ˈbrɪtɪʃ mjuːˈziːəm ɪz ˈvɛri kloʊs tuː ˈkæmpəs/" },
        { speaker: 'David', en: "Yes! I spent three hours there, and then I ate traditional fish and chips near Covent Garden.", es: "¡Sí! Pasé tres horas allí, y luego comí pescado con papas tradicional cerca de Covent Garden.", phonetic: "/jɛs aɪ spɛnt θriː ˈaʊərz ðɛər ænd ðɛn aɪ eɪt trəˈdɪʃənl fɪʃ ænd tʃɪps nɪər ˈkʌvənt ˈɡɑːrdn/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué actividades realizó David durante su primer fin de semana en Londres?",
      audioContextText: "David walked through Hyde Park, visited the British Museum, and ate fish and chips near Covent Garden.",
      options: [
        "Se quedó estudiando en su habitación todo el sábado.",
        "Caminó por Hyde Park, visitó el Museo Británico y comió fish and chips.",
        "Viajó a Cambridge para visitar a un profesor."
      ],
      correctIndex: 1,
      explanation: "David relata que caminó por Hyde Park, recorrió el Museo Británico y almorzó comida tradicional."
    },
    step3_builder: {
      instruction: "Arma la oración de anécdota en pasado:",
      targetTranslationEs: "Ayer visitamos la biblioteca histórica cerca de Russell Square.",
      correctWords: ["Yesterday", "we", "visited", "the", "historic", "library", "near", "Russell", "Square."],
      scrambledWords: ["library", "Russell", "visited", "the", "Square.", "Yesterday", "historic", "we", "near", "visit"]
    },
    step4_shadowing: {
      instruction: "Domina las 3 pronunciaciones del pasado regular (-ed) en anécdotas:",
      phrases: [
        { levelLabel: "Terminación /t/ (Sorda)", en: "I walked through Hyde Park on Saturday.", phonetic: "/aɪ wɔːkt θruː haɪd pɑːrk ɒn ˈsætərdeɪ/", tip: "Tras consonante sorda 'k', la -ed suena puramente como /t/ sin añadir sílaba." },
        { levelLabel: "Terminación /d/ (Sonora)", en: "We explored the historic streets of London.", phonetic: "/wiː ɪkˈsplɔːrd ðə hɪˈstɔːrɪk striːts əv ˈlʌndən/", tip: "Tras sonido vocal o sonoro 'r', la terminación vibra suavemente como /d/." },
        { levelLabel: "Terminación /ɪd/ (Extra Sílaba)", en: "David visited the British Museum yesterday.", phonetic: "/ˈdeɪvɪd ˈvɪzɪtɪd ðə ˈbrɪtɪʃ mjuːˈziːəm ˈjɛstərdeɪ/", tip: "Solo tras las letras 't' o 'd' se pronuncia una sílaba extra /ɪd/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'Yesterday I didn't went to the museum because it was closed.'",
      explanationConcept: "Doble pasado con el auxiliar 'did'",
      options: [
        "Yesterday I didn't went to the museum because it was closed.",
        "Yesterday I didn't go to the museum because it was closed.",
        "Yesterday I not go to the museum because was closed."
      ],
      correctIndex: 1,
      ruleInsight: "Cuando usas el auxiliar negativo del pasado 'didn't', el verbo principal ya no puede ir en pasado ('went'); debe retornar a su forma base ('didn't go')."
    },
    step6_mastery: {
      question: "¿Cómo narras qué comiste y qué hiciste el sábado pasado?",
      options: [
        "On Saturday I visited the market and had lunch with my roommates.",
        "On Saturday I have visited the market and eat lunch.",
        "On Saturday I did visited the market and having lunch."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 2.1 Dominado! Puedes narrar anécdotas de viajes y experiencias personales con total naturalidad."
    }
  },
  {
    id: 'a2-lesson-2',
    level: 'A2',
    unit: 2,
    unitTitle: 'Unidad 2 • Comunicación Cotidiana y Relatos',
    code: '2.2',
    title: 'Compras en el campus: comparar precios y calidades',
    subtitle: 'Compara precios, opciones de comida y materiales en las tiendas del campus con comparativos y superlativos',
    academicProject: 'Elaborar una guía comparativa de precios y servicios para nuevos estudiantes del campus.',
    xpReward: 40,
    prerequisiteId: 'a2-lesson-1',
    step1_dialogue: {
      context: 'En la tienda universitaria del campus comparando mochilas y suministros de estudio.',
      lines: [
        { speaker: 'Clerk', en: "Welcome! Are you looking for student essentials today?", es: "¡Bienvenido! ¿Buscas artículos esenciales para estudiantes hoy?", phonetic: "/ˈwɛlkəm ɑːr juː ˈlʊkɪŋ fɔːr ˈstjuːdnt ɪˈsɛnʃlz təˈdeɪ/" },
        { speaker: 'David', en: "Yes, I need a laptop backpack. Which one is better for daily campus life?", es: "Sí, necesito una mochila para portátil. ¿Cuál es mejor para la vida diaria del campus?", phonetic: "/jɛs aɪ niːd ə ˈlæpˌtɑːp ˈbækˌpæk wɪtʃ wʌn ɪz ˈbɛtər fɔːr ˈdeɪli ˈkæmpəs laɪf/" },
        { speaker: 'Clerk', en: "The blue backpack is lighter than the leather bag, but the black one is the most durable.", es: "La mochila azul es más ligera que la de cuero, pero la negra es la más duradera.", phonetic: "/ðə bluː ˈbækˌpæk ɪz ˈlaɪtər ðæn ðə ˈlɛðər bæɡ bʌt ðə blæk wʌn ɪz ðə moʊst ˈdʊrəbl/" },
        { speaker: 'David', en: "The blue one is also cheaper than the black bag. It fits my student budget perfectly!", es: "La azul también es más barata que la negra. ¡Se ajusta perfecto a mi presupuesto de estudiante!", phonetic: "/ðə bluː wʌn ɪz ˈɔːlsoʊ ˈtʃiːpər ðæn ðə blæk bæɡ ɪt fɪts maɪ ˈstjuːdnt ˈbʌdʒɪt ˈpɜːrfɪktli/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué David decide elegir la mochila azul?",
      audioContextText: "The blue backpack is lighter and cheaper than the other options, fitting David's student budget.",
      options: [
        "Porque es la más cara de toda la tienda.",
        "Porque es más ligera, más económica y se ajusta a su presupuesto.",
        "Porque no quedaban mochilas negras en el almacén."
      ],
      correctIndex: 1,
      explanation: "David opta por la mochila azul porque es más ligera y más barata que las otras opciones."
    },
    step3_builder: {
      instruction: "Construye la comparación adecuada de precios y servicios:",
      targetTranslationEs: "La cafetería del norte es más barata que el restaurante central.",
      correctWords: ["The", "north", "cafe", "is", "cheaper", "than", "the", "central", "restaurant."],
      scrambledWords: ["than", "restaurant.", "is", "cheaper", "central", "the", "The", "north", "cafe", "more"]
    },
    step4_shadowing: {
      instruction: "Entrena los contrastes comparativos y superlativos cotidianos:",
      phrases: [
        { levelLabel: "Adjetivo Corto (-er than)", en: "This store is cheaper than the supermarket.", phonetic: "/ðɪs stɔːr ɪz ˈtʃiːpər ðæn ðə ˈsuːpərˌmɑːrkɪt/", tip: "Agrega '-er' en monosílabos y enlaza con la conjunción 'than'." },
        { levelLabel: "Adjetivo Largo (more ... than)", en: "This laptop is more expensive than my phone.", phonetic: "/ðɪs ˈlæpˌtɑːp ɪz mɔːr ɪkˈspɛnsɪv ðæn maɪ foʊn/", tip: "En adjetivos de 3+ sílabas, antepón 'more' sin alterar el adjetivo." },
        { levelLabel: "Superlativo Absoluto", en: "It is the most popular coffee shop on campus.", phonetic: "/ɪt ɪz ðə moʊst ˈpɑːpjələr ˈkɔːfi ʃɑːp ɒn ˈkæmpəs/", tip: "Usa siempre el artículo 'the' antes de 'most'." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'This bookstore is more cheaper and has more good books than the other.'",
      explanationConcept: "Doble comparativo e irregularidades de 'good' y adjetivos cortos",
      options: [
        "This bookstore is cheaper and has better books than the other.",
        "This bookstore is more cheap and has more good books than the other.",
        "This bookstore is cheaper and has more better books than the other."
      ],
      correctIndex: 0,
      ruleInsight: "'Cheap' es adjetivo corto (su comparativo es 'cheaper', nunca 'more cheaper'). 'Good' tiene forma irregular propia ('better', nunca 'more good' ni 'more better')."
    },
    step6_mastery: {
      question: "¿Cuál opción compara correctamente dos opciones de bibliotecas del campus?",
      options: [
        "The science library is quieter and more modern than the main building.",
        "The science library is more quiet and more modern that the main building.",
        "The science library is most quiet than the main building."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 2.2 Superado! Dominas la toma de decisiones basada en comparaciones cotidianas en el campus."
    }
  },
  {
    id: 'a2-lesson-3',
    level: 'A2',
    unit: 2,
    unitTitle: 'Unidad 2 • Comunicación Cotidiana y Relatos',
    code: '2.3',
    title: 'Compromisos y planes: organizar una salida con amigos de la facultad',
    subtitle: 'Planifica una excursión de fin de semana y asume acuerdos espontáneos con amigos (will vs going to)',
    academicProject: 'Organizar y presentar el itinerario de una salida grupal con amigos de la facultad.',
    xpReward: 40,
    prerequisiteId: 'a2-lesson-2',
    step1_dialogue: {
      context: 'En la cafetería universitaria planeando una salida de fin de semana con amigos.',
      lines: [
        { speaker: 'Sophie', en: "David, are you going to join us for the weekend trip to Greenwich on Saturday?", es: "David, ¿nos vas a acompañar al viaje de fin de semana a Greenwich el sábado?", phonetic: "/ɑːr juː ˈɡoʊɪŋ tuː dʒɔɪn ʌs fɔːr ðə ˈwiːkˌɛnd trɪp tuː ˈɡrɛnɪtʃ ɒn ˈsætərdeɪ/" },
        { speaker: 'David', en: "Yes, definitely! We are going to take the river boat from Westminster Pier at ten o'clock.", es: "¡Sí, definitivamente! Vamos a tomar el barco del río desde el muelle de Westminster a las diez.", phonetic: "/jɛs ˈdɛfɪnətli wiː ɑːr ˈɡoʊɪŋ tuː teɪk ðə ˈrɪvər boʊt frɒm ˈwɛstˌmɪnstər pɪər æt tɛn əˈklɑːk/" },
        { speaker: 'Sophie', en: "Great! Who will buy the group tickets online?", es: "¡Genial! ¿Quién comprará los boletos grupales por internet?", phonetic: "/ɡreɪt huː wɪl baɪ ðə ɡruːp ˈtɪkɪts ˈɒnˌlaɪn/" },
        { speaker: 'David', en: "I will buy them right now on my phone! I promise to send the confirmation to our chat.", es: "¡Yo los compraré ahora mismo en mi teléfono! Prometo enviar la confirmación a nuestro chat.", phonetic: "/aɪ wɪl baɪ ðɛm raɪt naʊ ɒn maɪ foʊn aɪ ˈprɑːmɪs tuː sɛnd ðə ˌkɑːnfərˈmeɪʃn tuː ˈaʊər tʃæt/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué David usa 'are going to' para el barco pero 'will' para comprar los boletos?",
      audioContextText: "Taking the boat is a pre-arranged group plan (going to), while offering to buy tickets is a spontaneous decision and promise (will).",
      options: [
        "Porque 'will' solo se utiliza para hablar del pasado.",
        "Porque 'going to' expresa un plan ya programado, mientras que 'will' es una decisión espontánea y promesa inmediata.",
        "Porque David no sabe cómo llegar a Greenwich."
      ],
      correctIndex: 1,
      explanation: "'Going to' se reserva para planes e intenciones previas; 'will' para ofertas espontáneas, decisiones al momento y promesas."
    },
    step3_builder: {
      instruction: "Construye la oración de plan de fin de semana:",
      targetTranslationEs: "Vamos a visitar el observatorio el sábado por la tarde.",
      correctWords: ["We", "are", "going", "to", "visit", "the", "observatory", "on", "Saturday", "afternoon."],
      scrambledWords: ["afternoon.", "visit", "on", "going", "Saturday", "We", "to", "are", "will", "the", "observatory"]
    },
    step4_shadowing: {
      instruction: "Internaliza la reducción fonética natural del futuro:",
      phrases: [
        { levelLabel: "Reducción de Going to", en: "We're going to take the boat tomorrow.", phonetic: "/wɪər ˈɡənə teɪk ðə boʊt təˈmɔːroʊ/", tip: "En conversación informal natural, 'going to' se reduce a 'gonna' /ɡənə/." },
        { levelLabel: "Contracción de Will ('ll)", en: "I'll book the tickets right away.", phonetic: "/aɪl bʊk ðə ˈtɪkɪts raɪt əˈweɪ/", tip: "Pega la punta de la lengua al paladar superior para el sonido /l/ ágil." },
        { levelLabel: "Decisión Espontánea", en: "Wait for me, I will carry that heavy bag for you.", phonetic: "/weɪt fɔːr miː aɪ wɪl ˈkæri ðæt ˈhɛvi bæɡ fɔːr juː/", tip: "Usa 'will' ante una necesidad o ayuda inmediata." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'Wait, I am going to buy your coffee, don't worry!'",
      explanationConcept: "Uso de 'will' para ofertas y decisiones instantáneas",
      options: [
        "Wait, I will buy your coffee, don't worry!",
        "Wait, I buy your coffee, don't worry!",
        "Wait, I am buying your coffee yesterday."
      ],
      correctIndex: 0,
      ruleInsight: "Al reaccionar en el instante para invitar o ayudar a alguien, la norma natural es 'I will buy...' (o 'I'll buy...'), no 'I am going to'."
    },
    step6_mastery: {
      question: "¿Cómo anuncias a tus compañeros un plan de viaje ya organizado?",
      options: [
        "We are going to meet at the train station at nine tomorrow morning.",
        "We will to meet at the train station at nine tomorrow morning.",
        "We meet will at the train station tomorrow."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 2.3 Superado! Tienes precisión estratégica para proyectar planes y hacer compromisos en inglés."
    }
  },
  {
    id: 'a2-lesson-4',
    level: 'A2',
    unit: 2,
    unitTitle: 'Unidad 2 • Comunicación Cotidiana y Relatos',
    code: '2.4',
    title: 'Normas del campus: qué podemos y qué no podemos hacer',
    subtitle: 'Comunica reglas de la residencia estudiantil, biblioteca y áreas comunes usando verbos modales',
    academicProject: 'Redactar la guía de convivencia y normas de la residencia universitaria para estudiantes internacionales.',
    xpReward: 40,
    prerequisiteId: 'a2-lesson-3',
    step1_dialogue: {
      context: 'Sesión de inducción con el asesor de la residencia estudiantil sobre normas del campus.',
      lines: [
        { speaker: 'Advisor', en: "Welcome to International Student House! Here are a few essential residence rules.", es: "¡Bienvenidos a la Casa de Estudiantes Internacionales! Aquí tienen algunas normas esenciales de convivencia.", phonetic: "/ˈwɛlkəm tuː ˌɪntərˈnæʃənl ˈstjuːdnt haʊs hɪər ɑːr ə fjuː ɪˈsɛnʃl ˈrɛzɪdəns ruːlz/" },
        { speaker: 'David', en: "What are the rules regarding kitchen use and quiet hours?", es: "¿Cuáles son las reglas sobre el uso de la cocina y las horas de silencio?", phonetic: "/wɑːt ɑːr ðə ruːlz rɪˈɡɑːrdɪŋ ˈkɪtʃɪn juːs ænd ˈkwaɪət ˈaʊərz/" },
        { speaker: 'Advisor', en: "You must clean the shared kitchen after cooking, and you have to respect quiet hours after ten p.m.", es: "Deben limpiar la cocina compartida después de cocinar, y tienen que respetar las horas de silencio después de las diez p.m.", phonetic: "/juː mʌst kliːn ðə ʃɛərd ˈkɪtʃɪn ˈæftər ˈkʊkɪŋ ænd juː hæv tuː rɪˈspɛkt ˈkwaɪət ˈaʊərz ˈæftər tɛn piː ɛm/" },
        { speaker: 'David', en: "Understood. Can we invite guests over during the weekend?", es: "Entendido. ¿Podemos invitar amigos durante el fin de semana?", phonetic: "/ˌʌndərˈstʊd kæn wiː ɪnˈvaɪt ɡɛsts ˈoʊvər ˈdʊrɪŋ ðə ˈwiːkˌɛnd/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Cuál es una regla obligatoria e ineludible en la residencia estudiantil?",
      audioContextText: "Students must clean the shared kitchen after cooking and respect quiet hours after 10 p.m.",
      options: [
        "Invitar invitados a dormir sin avisar está permitido.",
        "Es obligatorio limpiar la cocina compartida tras cocinar y respetar el silencio después de las diez p.m.",
        "No está permitido cocinar ningún tipo de comida caliente."
      ],
      correctIndex: 1,
      explanation: "El asesor indica con claridad que limpiar la cocina tras cocinar y respetar el silencio son deberes obligatorios."
    },
    step3_builder: {
      instruction: "Arma la regla de convivencia de la residencia:",
      targetTranslationEs: "Debes mostrar tu credencial de estudiante en la entrada principal.",
      correctWords: ["You", "must", "show", "your", "student", "card", "at", "the", "main", "entrance."],
      scrambledWords: ["card", "main", "must", "show", "entrance.", "your", "You", "at", "student", "the", "can"]
    },
    step4_shadowing: {
      instruction: "Practica los modales de obligación, permiso y prohibición:",
      phrases: [
        { levelLabel: "Obligación Estricta (Must)", en: "You must clean the kitchen after cooking.", phonetic: "/juː mʌst kliːn ðə ˈkɪtʃɪn ˈæftər ˈkʊkɪŋ/", tip: "Pronuncia 'must' con firmeza y tono claro." },
        { levelLabel: "Permiso Amable (Can)", en: "You can study in the common lounge anytime.", phonetic: "/juː kæn ˈstʌdi ɪn ðə ˈkɑːmən laʊndʒ ˈɛniˌtaɪm/", tip: "'Can' expresa permiso o posibilidad relajada." },
        { levelLabel: "Prohibición Absoluta (Mustn't)", en: "You mustn't make loud noise after ten.", phonetic: "/juː ˈmʌsnt meɪk laʊd nɔɪz ˈæftər tɛn/", tip: "En 'mustn't', la 't' intermedia es muda: se pronuncia /ˈmʌsnt/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'You don't have to smoke in the bedrooms, it is strictly forbidden by the campus rules!'",
      explanationConcept: "Diferencia crítica entre 'mustn't' (prohibición) y 'don't have to' (falta de necesidad)",
      options: [
        "You mustn't smoke in the bedrooms, it is strictly forbidden by the campus rules!",
        "You don't have to smoke in the bedrooms, because you can do it outside later.",
        "You should not have to smoke in the bedrooms by the rules."
      ],
      correctIndex: 0,
      ruleInsight: "'Don't have to' significa que no es necesario (pero podrías si quisieras). Para prohibiciones absolutas por reglamento o seguridad, la forma indispensable es 'must not' ('mustn't')."
    },
    step6_mastery: {
      question: "¿Cómo redactarías una norma de convivencia en la biblioteca del campus?",
      options: [
        "Students must keep mobile phones on silent mode inside the study rooms.",
        "Students should to keep mobile phones on silent mode always.",
        "Students have keeping mobile phones on silent mode."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel A2 Completado con Honores Universitarios! Tienes solidez operativa, comunicativa y social en el campus."
    }
  },

  // ==========================================================================
  // UNIDAD 3: NIVEL B1 • INDEPENDENCIA LINGÜÍSTICA Y PROCESOS TÉCNICOS
  // ==========================================================================
  {
    id: 'b1-lesson-1',
    level: 'B1',
    unit: 3,
    unitTitle: 'Unidad 3 • Independencia Lingüística y Procesos Técnicos',
    code: '3.1',
    title: 'Mi portafolio: lo que he logrado hasta hoy',
    subtitle: 'Conecta tus investigaciones previas con tus proyectos actuales para solicitar becas',
    academicProject: 'Realizar una entrevista de trabajo simulada y redactar un CV con logros verificables.',
    xpReward: 45,
    prerequisiteId: 'a2-lesson-4',
    step1_dialogue: {
      context: 'Entrevista de pasantía internacional en el Imperial College de Londres.',
      lines: [
        { speaker: 'Interviewer', en: "Welcome David. Have you ever worked with large-scale relational databases?", es: "Bienvenido David. ¿Alguna vez has trabajado con bases de datos relacionales a gran escala?", phonetic: "/hæv juː ˈɛvər wɜːrkt wɪð lɑːrdʒ skeɪl rɪˈleɪʃənl ˈdeɪtəˌbeɪsɪz/" },
        { speaker: 'David', en: "Yes, I have developed web systems for three years and I have lived in this tech ecosystem since 2023.", es: "Sí, he desarrollado sistemas web durante tres años y he vivido en este ecosistema desde 2023.", phonetic: "/aɪ hæv dɪˈvɛləpt wɛb ˈsɪstəmz fɔːr θriː jɪərz ænd aɪ hæv lɪvd ɪn ðɪs tɛk ˈiːkoʊˌsɪstəm sɪns ˈtwɛnti ˈtwɛnti θriː/" },
        { speaker: 'Interviewer', en: "Impressive. Have you submitted your academic portfolio yet?", es: "Impresionante. ¿Ya has entregado tu portafolio académico?", phonetic: "/ɪmˈprɛsɪv hæv juː səbˈmɪtɪd jɔːr ˌækəˈdɛmɪk pɔːrtˈfoʊlioʊ jɛt/" },
        { speaker: 'David', en: "I have already uploaded all repositories to the admissions portal.", es: "Ya he subido todos los repositorios al portal de admisiones.", phonetic: "/aɪ hæv ɔːlˈrɛdi ʌpˈloʊdɪd ɔːl rɪˈpɑːzətɔːriz tuː ðiː ædˈmɪʃənz ˈpɔːrtl/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué temporalidad describe la respuesta de David sobre sus tres años de experiencia?",
      audioContextText: "David has developed systems for three years, meaning he started in the past and still does it today.",
      options: [
        "Una acción que empezó en el pasado, concluyó hace tres años y ya no practica.",
        "Una trayectoria iniciada en el pasado que continúa vigente e impacta su presente.",
        "Un plan futuro que piensa iniciar en el año 2028."
      ],
      correctIndex: 1,
      explanation: "El Presente Perfecto conecta la experiencia previa con la relevancia presente del candidato."
    },
    step3_builder: {
      instruction: "Construye la afirmación de experiencia profesional:",
      targetTranslationEs: "He coordinado proyectos internacionales durante más de dos años.",
      correctWords: ["I", "have", "coordinated", "international", "projects", "for", "over", "two", "years."],
      scrambledWords: ["coordinated", "years.", "projects", "I", "international", "for", "have", "over", "two", "since"]
    },
    step4_shadowing: {
      instruction: "Practica las contracciones nativas del presente perfecto:",
      phrases: [
        { levelLabel: "Contracción Nítida", en: "I've worked on multiple research initiatives.", phonetic: "/aɪv wɜːrkt ɒn ˈmʌltɪpl rɪˈsɜːrtʃ ɪˈnɪʃətɪvz/", tip: "Contrae 'I have' a un ágil /aɪv/ pegando el labio inferior a los dientes." },
        { levelLabel: "Marcador Temporal Since", en: "She has led the department since October.", phonetic: "/ʃiː hæz lɛd ðə dɪˈpɑːrtmənt sɪns ɒkˈtoʊbər/", tip: "'Since' marca el punto de partida específico en el tiempo." },
        { levelLabel: "Marcador Temporal For", en: "We have collaborated for several months.", phonetic: "/wiː hæv kəˈlæbəˌreɪtɪd fɔːr ˈsɛvrəl mʌnθs/", tip: "'For' cuantifica la duración acumulada del periodo." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'I have graduated from high school in 2018 and I work here since two years.'",
      explanationConcept: "Confusión entre Presente Perfecto (periodo abierto) y Pasado Simple (año cerrado)",
      options: [
        "I graduated from high school in 2018 and I have worked here for two years.",
        "I have graduated from high school in 2018 and I work here for two years.",
        "I graduated from high school in 2018 and I am working here since two years."
      ],
      correctIndex: 0,
      ruleInsight: "Una fecha cerrada en el pasado ('in 2018') exige Pasado Simple ('graduated'). La duración que continúa hasta hoy exige Presente Perfecto con 'for' ('have worked here for two years')."
    },
    step6_mastery: {
      question: "¿Cómo expresas en tu CV que ya concluiste la fase piloto de investigación?",
      options: [
        "We have already concluded the initial pilot phase with remarkable outcomes.",
        "We already conclude the initial pilot phase yesterday.",
        "We have yet concluded the initial pilot phase."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 3.1 Dominado! Ahora comunicas logros y trayectoria con autoridad profesional B1."
    }
  },
  {
    id: 'b1-lesson-2',
    level: 'B1',
    unit: 3,
    unitTitle: 'Unidad 3 • Independencia Lingüística y Procesos Técnicos',
    code: '3.2',
    title: 'Resolver problemas en el campus: si esto pasa, haremos aquello',
    subtitle: 'Formula soluciones prácticas a imprevistos cotidianos y académicos evaluando causa y efecto con condicionales',
    academicProject: 'Elaborar un plan de contingencia para resolver imprevistos durante la semana de exámenes y proyectos.',
    xpReward: 45,
    prerequisiteId: 'b1-lesson-1',
    step1_dialogue: {
      context: 'Resolviendo contingencias y problemas técnicos antes de la presentación final del proyecto.',
      lines: [
        { speaker: 'Tutor', en: "David, what will your team do if the lecture hall projector does not work tomorrow?", es: "David, ¿qué hará tu equipo si el proyector del aula magna no funciona mañana?", phonetic: "/wɑːt wɪl jɔːr tiːm duː ɪf ðə ˈlɛktʃər hɔːl prəˈdʒɛktər dʌz nɑːt wɜːrk təˈmɔːroʊ/" },
        { speaker: 'David', en: "If the projector fails, we will use printed handouts and share our slides digitally.", es: "Si el proyector falla, usaremos folletos impresos y compartiremos las diapositivas digitalmente.", phonetic: "/ɪf ðə prəˈdʒɛktər feɪlz wiː wɪl juːz ˈprɪntɪd ˈhændaʊts ænd ʃɛər ˈaʊər slaɪdz ˈdɪdʒɪtli/" },
        { speaker: 'Tutor', en: "Good thinking. And if you had more preparation time, what would you add?", es: "Buen plan. ¿Y si tuvieras más tiempo de preparación, qué agregarías?", phonetic: "/ɡʊd ˈθɪŋkɪŋ ænd ɪf juː hæd mɔːr ˌprɛpəˈreɪʃn taɪm wɑːt wʊd juː æd/" },
        { speaker: 'David', en: "If we had three extra days, I would record video interviews with local London students.", es: "Si tuviéramos tres días extra, yo grabaría entrevistas en video con estudiantes locales de Londres.", phonetic: "/ɪf wiː hæd θriː ˈɛkstrə deɪz aɪ wʊd rɪˈkɔːrd ˈvɪdioʊ ˈɪntərvjuːz wɪð ˈloʊkl ˈlʌndən ˈstjuːdnts/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Cuál es la diferencia conceptual entre las dos soluciones que plantea David?",
      audioContextText: "The first condition is an immediate realistic contingency (if it fails, we will use handouts); the second is a hypothetical reflection (if we had extra time, I would record interviews).",
      options: [
        "Ambas respuestas describen sucesos que ya ocurrieron el mes pasado.",
        "La primera es una causa y efecto real y probable ante un imprevisto; la segunda es una hipótesis imaginaria sobre el tiempo disponible.",
        "David afirma que el proyector ya está roto y no habrá presentación."
      ],
      correctIndex: 1,
      explanation: "El Condicional 1 expresa contingencias y soluciones reales; el Condicional 2 explora escenarios hipotéticos con 'would'."
    },
    step3_builder: {
      instruction: "Arma la estructura del segundo condicional para resolver problemas:",
      targetTranslationEs: "Si tuviera más tiempo libre, estudiaría en la biblioteca central todos los días.",
      correctWords: ["If", "I", "had", "more", "free", "time,", "I", "would", "study", "at", "the", "library."],
      scrambledWords: ["library.", "would", "had", "study", "free", "If", "time,", "the", "I", "will", "more", "at"]
    },
    step4_shadowing: {
      instruction: "Entrena el ritmo condicional de contingencias y causa:",
      phrases: [
        { levelLabel: "Primer Condicional Real", en: "If the bus is late, we will take the underground.", phonetic: "/ɪf ðə bʌs ɪz leɪt wiː wɪl teɪk ðiː ˈʌndərɡraʊnd/", tip: "No uses 'will' dentro de la cláusula con 'if'." },
        { levelLabel: "Segundo Condicional Hipotético", en: "If I were in your position, I would speak to the professor.", phonetic: "/ɪf aɪ wɜːr ɪn jɔːr pəˈzɪʃn aɪ wʊd spiːk tuː ðə prəˈfɛsər/", tip: "En registro formal hipotético, se prefiere 'If I were' en lugar de 'If I was'." },
        { levelLabel: "Contracción de Would ('d)", en: "I'd print extra copies just in case.", phonetic: "/aɪd prɪnt ˈɛkstrə ˈkɑːpiz dʒʌst ɪn keɪs/", tip: "'I would' se contrae ágilmente a /aɪd/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'If the internet will fail tomorrow, we would use our mobile data.'",
      explanationConcept: "Mezcla errónea de 'will' en la cláusula 'if' y discordancia condicional",
      options: [
        "If the internet fails tomorrow, we will use our mobile data.",
        "If the internet will fail tomorrow, we will use our mobile data.",
        "If the internet failed tomorrow, we will use our mobile data."
      ],
      correctIndex: 0,
      ruleInsight: "Nunca se coloca 'will' dentro de la cláusula condicional con 'if'. La estructura del Condicional 1 es: If + Presente Simple ('fails'), Sujeto + will + verbo base ('we will use')."
    },
    step6_mastery: {
      question: "¿Cómo plantearías una solución de contingencia para tu equipo de trabajo?",
      options: [
        "If the weather is bad on Saturday, we will move our study session indoors.",
        "If the weather will be bad on Saturday, we will to move our study session.",
        "If the weather is bad on Saturday, we would moved our study session."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 3.2 Superado! Dominas el razonamiento causal, la resolución de imprevistos y el pensamiento hipotético formal."
    }
  },
  {
    id: 'b1-lesson-3',
    level: 'B1',
    unit: 3,
    unitTitle: 'Unidad 3 • Independencia Lingüística y Procesos Técnicos',
    code: '3.3',
    title: 'Evolución del entorno: cómo ha cambiado mi ciudad y universidad',
    subtitle: 'Explica la transformación urbana y académica conectando eventos pasados con el pasado perfecto (had done)',
    academicProject: 'Escribir una crónica testimonial sobre la transformación de un campus o ciudad a través de los años.',
    xpReward: 45,
    prerequisiteId: 'b1-lesson-2',
    step1_dialogue: {
      context: 'Conversando con un profesor veterano sobre la evolución histórica del campus universitario.',
      lines: [
        { speaker: 'Professor', en: "David, did you know that this modern library plaza did not exist ten years ago?", es: "David, ¿sabías que esta moderna plaza de la biblioteca no existía hace diez años?", phonetic: "/dɪd juː noʊ ðæt ðɪs ˈmɑːdərn ˈlaɪbrəri ˈplɑːzə dɪd nɑːt ɪɡˈzɪst tɛn jɪərz əˈɡoʊ/" },
        { speaker: 'David', en: "Really? What had stood here before the university renovated the central quad?", es: "¿De verdad? ¿Qué había estado aquí antes de que la universidad remodelara el patio central?", phonetic: "/ˈriːəli wɑːt hæd stʊd hɪər bɪˈfɔːr ðə ˌjuːnɪˈvɜːrsəti ˈrɛnəˌveɪtɪd ðə ˈsɛntrəl kwɑːd/" },
        { speaker: 'Professor', en: "An old brick warehouse had occupied this space until the council approved the expansion in 2018.", es: "Un antiguo almacén de ladrillos había ocupado este espacio hasta que el consejo aprobó la expansión en 2018.", phonetic: "/æn oʊld brɪk ˈwɛərhaʊs hæd ˈɑːkjəˌpaɪd ðɪs speɪs ənˈtɪl ðə ˈkaʊnsl əˈpruːvd ðiː ɪkˈspænʃn ɪn ˈtwɛnti ˈeɪtiːn/" },
        { speaker: 'David', en: "By the time my cohort arrived, the city had completely modernized the entire transit corridor.", es: "Para cuando llegó mi generación, la ciudad ya había modernizado por completo todo el corredor de transporte.", phonetic: "/baɪ ðə taɪm maɪ ˈkoʊhɔːrt əˈraɪvd ðə ˈsɪti hæd kəmˈpliːtli ˈmɑːdərnaɪzd ðiː ɪnˈtaɪər ˈtrænzɪt ˈkɔːrɪdɔːr/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué situación existía cronológicamente antes de la remodelación universitaria de 2018?",
      audioContextText: "An old brick warehouse had occupied the area before the council approved the expansion.",
      options: [
        "El corredor de transporte moderno ya existía desde el siglo diecinueve.",
        "Un antiguo almacén de ladrillos había ocupado el espacio antes de las obras de expansión.",
        "La plaza de la biblioteca fue construida sin autorización del consejo."
      ],
      correctIndex: 1,
      explanation: "El Pasado Perfecto ('had occupied') marca que el almacén existía con anterioridad a la remodelación aprobada en 2018."
    },
    step3_builder: {
      instruction: "Ordena los elementos para marcar la anterioridad temporal:",
      targetTranslationEs: "La reunión ya había terminado cuando el profesor llegó.",
      correctWords: ["The", "meeting", "had", "already", "ended", "when", "the", "professor", "arrived."],
      scrambledWords: ["professor", "The", "ended", "arrived.", "already", "when", "meeting", "had", "the"]
    },
    step4_shadowing: {
      instruction: "Practica el ritmo del pasado del pasado:",
      phrases: [
        { levelLabel: "Anterioridad Clásica", en: "By the time we arrived, the train had already left.", phonetic: "/baɪ ðə taɪm wiː əˈraɪvd ðə treɪn hæd ɔːlˈrɛdi lɛft/", tip: "Contrasta el pasado simple de llegada con el pasado perfecto 'had left'." },
        { levelLabel: "Contracción Natural ('d)", en: "She'd never visited London before this year.", phonetic: "/ʃiːd ˈnɛvər ˈvɪzɪtɪd ˈlʌndən bɪˈfɔːr ðɪs jɪər/", tip: "'She had' se contrae ágilmente a /ʃiːd/." },
        { levelLabel: "Causa Previa", en: "The campus was quiet because students had finished classes.", phonetic: "/ðə ˈkæmpəs wəz ˈkwaɪət bɪˈkəz ˈstjuːdnts hæd ˈfɪnɪʃt ˈklæsɪz/", tip: "'Had finished' explica el motivo de un estado previo." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'When I arrived to the station, the train already departed two minutes ago.'",
      explanationConcept: "Omisión del Pasado Perfecto para eventos cronológicamente anteriores",
      options: [
        "When I arrived at the station, the train had already departed.",
        "When I arrived to the station, the train was already departed.",
        "When I was arriving to the station, the train has already departed."
      ],
      correctIndex: 0,
      ruleInsight: "Si el tren partió antes de tu llegada, no puedes usar simple pasado para ambos sin ambigüedad; la acción previa exige 'had already departed'."
    },
    step6_mastery: {
      question: "¿Cómo narras la evolución previa de un vecindario en una crónica?",
      options: [
        "Residents explained that local shops had thrived long before the shopping center opened.",
        "Residents explained that local shops has thrived before the shopping center.",
        "Residents had explained that local shops thrives long ago."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 3.3 Conquistado! Ya dominas la arquitectura narrativa cronológica de evolución y contexto histórico."
    }
  },
  {
    id: 'b1-lesson-4',
    level: 'B1',
    unit: 3,
    unitTitle: 'Unidad 3 • Independencia Lingüística y Procesos Técnicos',
    code: '3.4',
    title: 'Guía de servicios: cómo funciona el sistema de bibliotecas y transporte',
    subtitle: 'Describe los procedimientos del campus y de la ciudad con foco objetivo usando la voz pasiva cotidiana',
    academicProject: 'Elaborar una guía informativa que explique cómo se utilizan los servicios públicos y la biblioteca universitaria.',
    xpReward: 45,
    prerequisiteId: 'b1-lesson-3',
    step1_dialogue: {
      context: 'En el mostrador de servicios estudiantiles conociendo el uso de la biblioteca y transporte urbano.',
      lines: [
        { speaker: 'Services Officer', en: "Welcome to campus student services! How can I assist you with university facilities?", es: "¡Bienvenido a los servicios estudiantiles del campus! ¿Cómo puedo ayudarte con las instalaciones universitarias?", phonetic: "/ˈwɛlkəm tuː ˈkæmpəs ˈstjuːdnt ˈsɜːrvɪsɪz haʊ kæn aɪ əˈsɪst juː wɪð ˌjuːnɪˈvɜːrsəti fəˈsɪlətiz/" },
        { speaker: 'David', en: "Could you explain how books are borrowed and how the student transit discount is activated?", es: "¿Podría explicarme cómo se toman prestados los libros y cómo se activa el descuento de transporte para estudiantes?", phonetic: "/kʊd juː ɪkˈspleɪn haʊ bʊks ɑːr ˈbɑːroʊd ænd haʊ ðə ˈstjuːdnt ˈtrænzɪt ˈdɪskaʊnt ɪz ˈæktɪveɪtɪd/" },
        { speaker: 'Services Officer', en: "Books are scanned at self-service kiosks, and study rooms are reserved online through the campus portal.", es: "Los libros se escanean en quioscos de autoservicio, y las salas de estudio se reservan por internet en el portal del campus.", phonetic: "/bʊks ɑːr skænd æt sɛlf ˈsɜːrvɪs ˈkiːɑːsks ænd ˈstʌdi ruːmz ɑːr rɪˈzɜːrvd ˈɒnˌlaɪn θruː ðə ˈkæmpəs ˈpɔːrtl/" },
        { speaker: 'David', en: "And where are student discount travel cards issued?", es: "¿Y en dónde se emiten las tarjetas de transporte con descuento para estudiantes?", phonetic: "/ænd wɛər ɑːr ˈstjuːdnt ˈdɪskaʊnt ˈtrævl kɑːrdz ˈɪʃuːd/" },
        { speaker: 'Services Officer', en: "Cards are issued at the main transit office once your enrollment is verified.", es: "Las tarjetas se emiten en la oficina principal de transporte una vez que se verifica tu matrícula.", phonetic: "/kɑːrdz ɑːr ˈɪʃuːd æt ðə meɪn ˈtrænzɪt ˈɑːfɪs wʌns jɔːr ɪnˈroʊlmənt ɪz ˈvɛrɪfaɪd/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué en este contexto institucional se utiliza 'Books are scanned' en lugar de mencionar a una persona específica?",
      audioContextText: "Passive voice emphasizes the institutional process and the service itself, making the explanation objective and clear.",
      options: [
        "Porque nadie sabe quién escanea los libros.",
        "Porque en guías de servicios el foco comunicativo recae en el procedimiento objetivo y en el usuario del servicio.",
        "Porque los libros no pueden escanearse."
      ],
      correctIndex: 1,
      explanation: "La voz pasiva se emplea en guías y reglamentos para describir procedimientos impersonales de uso público."
    },
    step3_builder: {
      instruction: "Construye la descripción del servicio con cláusula relativa:",
      targetTranslationEs: "Este es el portal que gestiona las reservas de salas de estudio.",
      correctWords: ["This", "is", "the", "portal", "which", "manages", "the", "study", "room", "reservations."],
      scrambledWords: ["manages", "reservations.", "the", "which", "portal", "This", "study", "is", "room", "who"]
    },
    step4_shadowing: {
      instruction: "Practica el tono descriptivo de servicios universitarios:",
      phrases: [
        { levelLabel: "Voz Pasiva Cotidiana", en: "Study rooms are reserved online in advance.", phonetic: "/ˈstʌdi ruːmz ɑːr rɪˈzɜːrvd ˈɒnˌlaɪn ɪn ədˈvæns/", tip: "Enlaza suavemente 'are reserved' sin acentuar el auxiliar." },
        { levelLabel: "Cláusula Relativa (Cosas)", en: "The card which provides discounts on the underground.", phonetic: "/ðə kɑːrd wɪtʃ prəˈvaɪdz ˈdɪskaʊnts ɒn ðiː ˈʌndərɡraʊnd/", tip: "Usa 'which' o 'that' para servicios o documentos." },
        { levelLabel: "Cláusula Relativa (Personas)", en: "Advisors who assist international students daily.", phonetic: "/ædˈvaɪzərz huː əˈsɪst ˌɪntərˈnæʃənl ˈstjuːdnts ˈdeɪli/", tip: "Usa 'who' para referirte al personal o personas." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'The librarian which issued my card it explained the loan policy.'",
      explanationConcept: "Pronombre relativo incorrecto para personas y doble sujeto pleonástico",
      options: [
        "The librarian who issued my card explained the loan policy.",
        "The librarian which issued my card explained the loan policy.",
        "The librarian that he issued my card explained the loan policy."
      ],
      correctIndex: 0,
      ruleInsight: "Los seres humanos exigen 'who', nunca 'which'. Además, se debe erradicar el pronombre pleonástico redundante ('it' o 'he') ya que 'The librarian' es el sujeto directo de la oración."
    },
    step6_mastery: {
      question: "¿Cómo describirías el procedimiento de préstamo en una guía para nuevos alumnos?",
      options: [
        "Books are checked out through automated terminals that scan your student barcode.",
        "Books check out by automated terminals who scan student barcode.",
        "Books are check out through terminals which it scans student barcode."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel B1 Completado con Honores Universitarios! Tienes plena independencia práctica, comunicativa y operativa en el entorno anglófono."
    }
  },

  // ==========================================================================
  // UNIDAD 4: NIVEL B2 • FLUIDEZ, DEBATE FORMAL Y CONTEXTO ACADÉMICO
  // ==========================================================================
  {
    id: 'b2-lesson-1',
    level: 'B2',
    unit: 4,
    unitTitle: 'Unidad 4 • Fluidez, Debate Formal y Contexto Académico',
    code: '4.1',
    title: 'Estructurar un argumento: debatir ideas en comités',
    subtitle: 'Defiende tu postura en debates estilo Oxford usando transiciones lógicas y cortesía parlamentaria',
    academicProject: 'Participar en un debate formal estilo Oxford defendiendo con rigor una postura asignada.',
    xpReward: 50,
    prerequisiteId: 'b1-lesson-4',
    step1_dialogue: {
      context: 'Debate de la Sociedad de Unión Universitaria de Oxford sobre Inteligencia Artificial.',
      lines: [
        { speaker: 'Debater A', en: "Mr. Chairman, the opposition asserts that AI eliminates intellectual jobs without precedent.", es: "Señor Presidente, la oposición afirma que la IA elimina empleos intelectuales sin precedentes.", phonetic: "/ˈmɪstər ˈtʃɛərmən ðiː ˌɑːpəˈzɪʃn əˈsɜːrts ðæt eɪ aɪ ɪˈlɪmɪneɪts ˌɪntəˈlɛktʃuəl dʒɑːbz wɪðˈaʊt ˈprɛsɪdənt/" },
        { speaker: 'David', en: "What the honourable colleague overlooks is that technology historically shifts labor toward higher cognitive tasks.", es: "Lo que el honorable colega pasa por alto es que la tecnología históricamente desplaza el trabajo hacia tareas cognitivas más elevadas.", phonetic: "/wɑːt ðiː ˈɑːnərəbl ˈkɑːliːɡ ˌoʊvərˈlʊks ɪz ðæt tɛkˈnɑːlədʒi hɪˈstɔːrɪkli ʃɪfts ˈleɪbər təˈwɔːrd ˈhaɪər ˈkɑːɡnətɪv tæsks/" },
        { speaker: 'Debater A', en: "Could the speaker clarify whether this transition is viable for developing economies?", es: "¿Podría el orador aclarar si esta transición es viable para las economías en desarrollo?", phonetic: "/kʊd ðə ˈspiːkər ˈklærəfaɪ ˈwɛðər ðɪs trænˈzɪʃn ɪz ˈvaɪəbl fɔːr dɪˈvɛləpɪŋ ɪˈkɑːnəmiz/" },
        { speaker: 'David', en: "It is precisely strategic investment in STEM that empowers emerging nations to leapfrog legacy infrastructure.", es: "Es precisamente la inversión estratégica en CTIM lo que permite a las naciones emergentes superar la infraestructura obsoleta.", phonetic: "/ɪt ɪz prɪˈsaɪsli strəˈtiːdʒɪk ɪnˈvɛstmənt ɪn stɛm ðæt ɪmˈpaʊərz ɪˈmɜːrdʒɪŋ ˈneɪʃnz tuː ˈliːpfrɔːɡ ˈlɛɡəsi ˌɪnfrəˈstrʌktʃər/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué recurso retórico utiliza David con la frase 'What the honourable colleague overlooks is...'?",
      audioContextText: "David employs a pseudo-cleft sentence to front and emphasize the specific limitation of the opponent's claim.",
      options: [
        "Un insulto personal directo prohibido en Oxford.",
        "Una oración escindida (cleft sentence) de énfasis parlamentario formal.",
        "Una traducción literal del lunfardo latinoamericano."
      ],
      correctIndex: 1,
      explanation: "Las 'cleft sentences' ('What X overlooks is Y') focalizan la atención en el núcleo de la refutación con elegancia diplomática."
    },
    step3_builder: {
      instruction: "Construye la oración hendida enfática (It-cleft):",
      targetTranslationEs: "Es la evidencia empírica lo que valida nuestra hipótesis.",
      correctWords: ["It", "is", "the", "empirical", "evidence", "that", "validates", "our", "hypothesis."],
      scrambledWords: ["that", "evidence", "empirical", "is", "validates", "It", "our", "the", "hypothesis.", "what"]
    },
    step4_shadowing: {
      instruction: "Internaliza la prosodia parlamentaria y el énfasis asertivo:",
      phrases: [
        { levelLabel: "Énfasis Hendido (Pseudo-cleft)", en: "What we must establish is a reproducible baseline.", phonetic: "/wɑːt wiː mʌst ɪˈstæblɪʃ ɪz ə ˌriːprəˈduːsəbl ˈbeɪslaɪn/", tip: "Pausa brevemente antes de 'is' para que el auditorio anticipe el argumento." },
        { levelLabel: "Pregunta Indirecta Diplomática", en: "I would be interested to know how this impacts latency.", phonetic: "/aɪ wʊd biː ˈɪntrəstɪd tuː noʊ haʊ ðɪs ˈɪmpækts ˈleɪtənsi/", tip: "En la pregunta indirecta el orden de palabras sigue la estructura afirmativa." },
        { levelLabel: "Foco Enfático (It-cleft)", en: "It was our team that discovered the security flaw.", phonetic: "/ɪt wəz ˈaʊər tiːm ðæt dɪˈskʌvərd ðə sɪˈkjʊrəti flɔː/", tip: "Eleva la entonación sobre 'our team' para marcar el crédito exclusivo." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'Can you tell me where is the data stored and who did write this paper?'",
      explanationConcept: "Inversión incorrecta en preguntas indirectas",
      options: [
        "Can you tell me where the data is stored and who wrote this paper?",
        "Can you tell me where is the data stored and who wrote this paper?",
        "Can you tell me where does the data store and who did write this paper?"
      ],
      correctIndex: 0,
      ruleInsight: "Tras una fórmula cortés introductoria ('Can you tell me...'), la cláusula subordinada no invierte sujeto y verbo ni usa auxiliares do/did: debe mantener orden afirmativo ('where the data is stored')."
    },
    step6_mastery: {
      question: "¿Cuál intervención evidencia el estándar de oratoria B2 en un debate académico?",
      options: [
        "What concerns our delegation most is the lack of peer-reviewed longitudinal data.",
        "What is concerning us is that they don't have good data.",
        "It is that we think their data is not very good."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 4.1 Dominado! Tu elocuencia argumentativa compite con los estándares de Oxford."
    }
  },
  {
    id: 'b2-lesson-2',
    level: 'B2',
    unit: 4,
    unitTitle: 'Unidad 4 • Fluidez, Debate Formal y Contexto Académico',
    code: '4.2',
    title: 'Evaluar lo que pudo haber sido: análisis de decisiones pasadas',
    subtitle: 'Modela escenarios retrospectivos y reflexiona sobre giros estratégicos en proyectos',
    academicProject: 'Analizar un error corporativo emblemático y modelar qué hubiera ocurrido de tomarse otra decisión.',
    xpReward: 50,
    prerequisiteId: 'b2-lesson-1',
    step1_dialogue: {
      context: 'Estudio de caso en la Escuela de Negocios de Londres sobre el colapso de Kodak.',
      lines: [
        { speaker: 'Professor', en: "David, if Kodak had commercialized the digital camera they invented in 1975, would they have survived?", es: "David, si Kodak hubiera comercializado la cámara digital que inventaron en 1975, ¿habrían sobrevivido?", phonetic: "/ɪf ˈkoʊdæk hæd kəˈmɜːrʃəlaɪzd ðə ˈdɪdʒɪtl ˈkæmərə ðeɪ ɪnˈvɛntɪd wʊd ðeɪ hæv sərˈvaɪvd/" },
        { speaker: 'David', en: "Undoubtedly. If they hadn't prioritized film revenue, they would have dominated the digital era.", es: "Indudablemente. Si no hubieran priorizado los ingresos por rollos, habrían dominado la era digital.", phonetic: "/ʌnˈdaʊtɪdli ɪf ðeɪ ˈhædnt praɪˈɔːrəˌtaɪzd fɪlm ˈrɛvənuː ðeɪ wʊd hæv ˈdɑːmɪneɪtɪd ðə ˈdɪdʒɪtl ˈɛrə/" },
        { speaker: 'Professor', en: "And how does that historical error impact our present case?", es: "¿Y cómo impacta ese error histórico nuestro caso actual?", phonetic: "/ænd haʊ dʌz ðæt hɪˈstɔːrɪkl ˈɛrər ˈɪmpækt ˈaʊər ˈprɛznt keɪs/" },
        { speaker: 'David', en: "If they had adapted back then, Kodak would still be an industry titan today.", es: "Si se hubieran adaptado en aquel entonces, Kodak aún sería un titán de la industria hoy en día.", phonetic: "/ɪf ðeɪ hæd əˈdæptɪd bæk ðɛn ˈkoʊdæk wʊd stɪl biː ən ˈɪndəstri ˈtaɪtn təˈdeɪ/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué tipo de condicional utiliza David en su última réplica ('If they had adapted..., Kodak would still be...')?",
      audioContextText: "David uses a mixed conditional connecting a past counterfactual condition with a present state of reality.",
      options: [
        "Un condicional de futuro simple.",
        "Un condicional mixto: condición en el pasado con consecuencia vigente en el presente.",
        "Una descripción de un evento que ocurrirá la próxima semana."
      ],
      correctIndex: 1,
      explanation: "El condicional mixto combina 'had + participio' (pasado irreal) con 'would + verbo base' (consecuencia presente)."
    },
    step3_builder: {
      instruction: "Arma la estructura del tercer condicional retrospectivo:",
      targetTranslationEs: "Si hubiéramos realizado más pruebas, habríamos detectado el error.",
      correctWords: ["If", "we", "had", "conducted", "more", "tests,", "we", "would", "have", "detected", "the", "bug."],
      scrambledWords: ["detected", "would", "tests,", "more", "If", "bug.", "have", "had", "we", "the", "conducted", "we"]
    },
    step4_shadowing: {
      instruction: "Domina las contracciones de alta velocidad en habla nativa:",
      phrases: [
        { levelLabel: "Contracción Completa (would've)", en: "We would've prevented the outage.", phonetic: "/wiː ˈwʊdəv prɪˈvɛntɪd ðiː ˈaʊtɪdʒ/", tip: "Pronuncia 'would have' como un fluido /wʊdəv/." },
        { levelLabel: "Condicional Mixto Clave", en: "If I had taken that course, I would know how to code now.", phonetic: "/ɪf aɪ hæd ˈteɪkən ðæt kɔːrs aɪ wʊd noʊ haʊ tuː koʊd naʊ/", tip: "Contrasta la acción pasada ('taken') con el estado actual ('now')." },
        { levelLabel: "Arrepentimiento con Should Have", en: "They should have backed up the database.", phonetic: "/ðeɪ ʃʊdəv ˈbækt ʌp ðə ˈdeɪtəˌbeɪs/", tip: "'Should have' se contrae como /ʃʊdəv/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'If we would have known about the storm, we would have cancelled the trip.'",
      explanationConcept: "Uso indebido de 'would have' en la cláusula con 'if'",
      options: [
        "If we had known about the storm, we would have cancelled the trip.",
        "If we would know about the storm, we would have cancelled the trip.",
        "If we had knew about the storm, we would have cancelled the trip."
      ],
      correctIndex: 0,
      ruleInsight: "Nunca se coloca 'would have' en la cláusula que lleva 'if'. La regla del 3er condicional es estricta: If + had + participio pasado, Sujeto + would have + participio pasado."
    },
    step6_mastery: {
      question: "¿Cómo sintetizarías un análisis contrafáctico corporativo riguroso?",
      options: [
        "Had management recognized consumer shifts earlier, the bankruptcy could have been averted.",
        "If management would recognize shifts, they avoided bankruptcy.",
        "Had management recognize shifts, bankruptcy was avoided."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 4.2 Superado! Dominas la inversión contrafáctica ('Had management...') y el condicional retrospectivo."
    }
  },
  {
    id: 'b2-lesson-3',
    level: 'B2',
    unit: 4,
    unitTitle: 'Unidad 4 • Fluidez, Debate Formal y Contexto Académico',
    code: '4.3',
    title: 'Citar a los expertos: reportar discursos e investigaciones ajenas',
    subtitle: 'Comunica posturas de otros científicos en simposios respetando los matices de autoría',
    academicProject: 'Sintetizar una conferencia magistral y redactar un informe ejecutivo para un comité directivo.',
    xpReward: 50,
    prerequisiteId: 'b2-lesson-2',
    step1_dialogue: {
      context: 'Redactando el informe ejecutivo tras la conferencia del decano de investigación.',
      lines: [
        { speaker: 'Colleague', en: "David, did the dean confirm whether our departmental budget was approved?", es: "David, ¿confirmó el decano si se aprobó el presupuesto de nuestro departamento?", phonetic: "/dɪd ðə diːn kənˈfɜːrm ˈwɛðər ˈaʊər ˌdiːpɑːrtˈmɛntl ˈbʌdʒɪt wəz əˈpruːvd/" },
        { speaker: 'David', en: "He explained that the board had authorized eighty percent of the capital expenditure.", es: "Explicó que la junta había autorizado el ochenta por ciento del gasto de capital.", phonetic: "/hiː ɪkˈspleɪnd ðæt ðə bɔːrd hæd ˈɔːθəraɪzd ˈeɪti pərˈsɛnt əv ðə ˈkæpɪtl ɪkˈspɛndɪtʃər/" },
        { speaker: 'Colleague', en: "Did he mention the laboratory expansion deadline?", es: "¿Mencionó el plazo para la ampliación del laboratorio?", phonetic: "/dɪd hiː ˈmɛnʃn ðə ˈlæbrəˌtɔːri ɪkˈspænʃn ˈdɛdlaɪn/" },
        { speaker: 'David', en: "He urged us to submit revised blueprints before the end of the fiscal quarter.", es: "Nos instó a enviar los planos revisados antes de que termine el trimestre fiscal.", phonetic: "/hiː ɜːrdʒd ʌs tuː səbˈmɪt rɪˈvaɪzd ˈbluːprɪnts bɪˈfɔːr ðiː ɛnd əv ðə ˈfɪskl ˈkwɔːrtər/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué matiz comunicativo aporta el verbo 'urged' en la síntesis de David?",
      audioContextText: "David uses 'urged' to indicate strong encouragement and urgency rather than a neutral statement.",
      options: [
        "Indica que el decano prohibió la entrega de planos.",
        "Indica un exhorto o recomendación enfática con sentido de urgencia institucional.",
        "Indica que el decano renunció a su cargo."
      ],
      correctIndex: 1,
      explanation: "Los verbos de reporte avanzados ('urge', 'insist', 'contend') transmiten la fuerza ilocucionaria del hablante original."
    },
    step3_builder: {
      instruction: "Ordena los bloques en estilo indirecto académico:",
      targetTranslationEs: "La investigadora insistió en que los resultados debían ser verificados.",
      correctWords: ["The", "researcher", "insisted", "that", "the", "results", "had", "to", "be", "verified."],
      scrambledWords: ["had", "The", "be", "results", "insisted", "that", "researcher", "to", "verified.", "the"]
    },
    step4_shadowing: {
      instruction: "Practica los verbos de reporte con sus preposiciones precisas:",
      phrases: [
        { levelLabel: "Verbo + That Clause", en: "She acknowledged that anomalies were detected.", phonetic: "/ʃiː əkˈnɑːlɪdʒd ðæt əˈnɑːməliz wɜːr dɪˈtɛktɪd/", tip: "'Acknowledge' reconoce la validez de un punto o dato." },
        { levelLabel: "Verbo + Objeto + Infinitivo", en: "He encouraged the scholars to publish early.", phonetic: "/hiː ɪnˈkɜːrɪdʒd ðə ˈskɑːlərz tuː ˈpʌblɪʃ ˈɜːrli/", tip: "Con 'encourage' se enlaza directamente con el objeto y el infinitivo con 'to'." },
        { levelLabel: "Verbo + Preposición", en: "They apologized for delaying the final review.", phonetic: "/ðeɪ əˈpɑːlədʒaɪzd fɔːr dɪˈleɪɪŋ ðə ˈfaɪnl rɪˈvjuː/", tip: "Tras preposiciones como 'for', el verbo va obligatoriamente en gerundio (-ing)." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'The committee suggested us to postpone the clinical trial until next year.'",
      explanationConcept: "Patrón verbal erróneo con 'suggest'",
      options: [
        "The committee suggested that we postpone the clinical trial until next year.",
        "The committee suggested us postponing the clinical trial.",
        "The committee suggested to us to postpone the trial."
      ],
      correctIndex: 0,
      ruleInsight: "'Suggest' jamás se construye con objeto directo + infinitivo ('suggested us to'). Exige una cláusula con 'that' ('suggested that we postpone') o gerundio ('suggested postponing')."
    },
    step6_mastery: {
      question: "¿Cómo reportarías formalmente en un informe la postura de un panel examinador?",
      options: [
        "The committee contended that further longitudinal testing was warranted prior to authorization.",
        "The committee said that they want more tests before authorize.",
        "The committee told that tests are needed."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 4.3 Dominado! Tu redacción ejecutiva refleja el rigor del estilo indirecto avanzado."
    }
  },
  {
    id: 'b2-lesson-4',
    level: 'B2',
    unit: 4,
    unitTitle: 'Unidad 4 • Fluidez, Debate Formal y Contexto Académico',
    code: '4.4',
    title: 'Llegar a conclusiones lógicas: deducir qué ocurrió con las pruebas',
    subtitle: 'Reconstruye anomalías de datos empíricos y formula deducciones científicas con cautela',
    academicProject: 'Redactar un ensayo argumentativo analizando un caso de estudio judicial o científico controvertido.',
    xpReward: 50,
    prerequisiteId: 'b2-lesson-3',
    step1_dialogue: {
      context: 'Investigando una anomalía electromagnética en los datos del radiotelescopio.',
      lines: [
        { speaker: 'Astrophysicist', en: "David, the sensor registered a massive signal spike at zero-three-hundred hours. Could it be extraterrestrial?", es: "David, el sensor registró un pico masivo a las 03:00. ¿Podría ser extraterrestre?", phonetic: "/ˈdeɪvɪd ðə ˈsɛnsər ˈrɛdʒɪstərd ə ˈmæsɪv ˈsɪɡnəl spaɪk æt ˈzɪroʊ θriː ˈhʌndrəd ˈaʊərz kʊd ɪt biː ˌɛkstrətəˈrɛstriəl/" },
        { speaker: 'David', en: "It can't have been an alien transmission; the frequency matches local microwave interference.", es: "No puede haber sido una transmisión extraterrestre; la frecuencia coincide con interferencia de microondas local.", phonetic: "/ɪt kænt hæv biːn ən ˈeɪliən trænzˈmɪʃn ðə ˈfriːkwənsi ˈmætʃɪz ˈloʊkl ˈmaɪkrəˌweɪv ˌɪntərˈfɪərəns/" },
        { speaker: 'Astrophysicist', en: "Then the night technician must have operated equipment near the receiver.", es: "Entonces el técnico nocturno debe de haber operado equipos cerca del receptor.", phonetic: "/ðɛn ðə naɪt tɛkˈnɪʃn mʌst hæv ˈɑːpəˌreɪtɪd ɪˈkwɪpmənt nɪər ðə rɪˈsiːvər/" },
        { speaker: 'David', en: "Precisely. He might not have realized the shield was unlatched.", es: "Precisamente. Puede que no se haya dado cuenta de que el blindaje estaba desenganchado.", phonetic: "/prɪˈsaɪsli hiː maɪt nɑːt hæv ˈriːəlaɪzd ðə ʃiːld wəz ʌnˈlætʃt/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué certeza expresa David con 'It can't have been an alien transmission'?",
      audioContextText: "David expresses logical impossibility based on physical evidence matching local interference.",
      options: [
        "Cree que es muy probable que haya extraterrestres.",
        "Expresa imposibilidad lógica absoluta basada en evidencia física incompatible.",
        "No tiene ninguna opinión al respecto."
      ],
      correctIndex: 1,
      explanation: "'Can't have been' expresa una conclusión de imposibilidad lógica categórica sobre un hecho pasado."
    },
    step3_builder: {
      instruction: "Arma la deducción lógica afirmativa de alta certeza:",
      targetTranslationEs: "El equipo debe haber olvidado calibrar los sensores antes de la prueba.",
      correctWords: ["The", "team", "must", "have", "forgotten", "to", "calibrate", "the", "sensors."],
      scrambledWords: ["sensors.", "must", "calibrate", "forgotten", "have", "The", "team", "to", "should"]
    },
    step4_shadowing: {
      instruction: "Entrena los grados de certeza en deducción deductiva:",
      phrases: [
        { levelLabel: "Imposibilidad Lógica", en: "She can't have fabricated the raw data.", phonetic: "/ʃiː kænt hæv ˈfæbrɪkeɪtɪd ðə rɔː ˈdeɪtə/", tip: "Enlaza 'can't have' sin cortar la continuidad fonética: /kænt-həv/." },
        { levelLabel: "Certeza Lógica Positiva", en: "They must have discovered a breakthrough.", phonetic: "/ðeɪ mʌst hæv dɪˈskʌvərd ə ˈbreɪkˌθruː/", tip: "Usa 'must have' para inferir con alta convicción que algo ocurrió." },
        { levelLabel: "Posibilidad Hipotética", en: "A glitch might have skewed the readings.", phonetic: "/ə ɡlɪtʃ maɪt hæv skjuːd ðə ˈriːdɪŋz/", tip: "'Might have' denota una probabilidad latente sin confirmación concluyente." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'The author mustn't have understood the theory, because his conclusion is completely false.'",
      explanationConcept: "Uso erróneo de 'mustn't have' en deducción de imposibilidad en inglés estándar",
      options: [
        "The author can't have understood the theory, because his conclusion is completely false.",
        "The author didn't must understand the theory.",
        "The author shouldn't have understood the theory yesterday."
      ],
      correctIndex: 0,
      ruleInsight: "En inglés estándar americano y británico para expresar imposibilidad deductiva ('es imposible que haya entendido'), se utiliza 'can't have' o 'couldn't have', nunca 'mustn't have'."
    },
    step6_mastery: {
      question: "¿Cuál formulación sintetiza una deducción científica rigurosa?",
      options: [
        "Given the sudden loss of pressure, a microscopic fracture must have developed along the primary valve.",
        "Given the loss of pressure, maybe a fracture happened.",
        "A fracture must to happen along the valve."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel B2 Completado con Honores Universitarios! Tienes solvencia argumentativa y deductiva para entornos académicos globales."
    }
  },

  // ==========================================================================
  // UNIDAD 5: NIVEL C1 • INGLÉS ACADÉMICO AVANZADO (EAP) Y ORATORIA
  // ==========================================================================
  {
    id: 'c1-lesson-1',
    level: 'C1',
    unit: 5,
    unitTitle: 'Unidad 5 • Inglés Académico Avanzado (EAP)',
    code: '5.1',
    title: 'El discurso que convence: cómo enfatizar sin gritar',
    subtitle: 'Eleva la fuerza retórica de ponencias magistrales mediante cadencias solemnes y persuasión',
    academicProject: 'Reescribir un informe técnico informal convirtiéndolo en una revisión bibliográfica de calibre universitario.',
    xpReward: 55,
    prerequisiteId: 'b2-lesson-4',
    step1_dialogue: {
      context: 'Simposio Internacional de Bioética e Inteligencia Artificial en University College London.',
      lines: [
        { speaker: 'Chairwoman', en: "Seldom have we witnessed such profound philosophical friction regarding autonomous neural systems.", es: "Rara vez hemos presenciado una fricción filosófica tan profunda respecto a los sistemas neuronales autónomos.", phonetic: "/ˈsɛldəm hæv wiː ˈwɪtnɪst sʌtʃ prəˈfaʊnd ˌfɪləˈsɑːfɪkl ˈfrɪkʃn/" },
        { speaker: 'David', en: "Indeed. Not only does algorithmic opacity undermine accountability, but it also erodes judicial transparency.", es: "En efecto. La opacidad algorítmica no solo socava la rendición de cuentas, sino que también erosiona la transparencia judicial.", phonetic: "/nɑːt ˈoʊnli dʌz ˌælɡəˈrɪðmɪk oʊˈpæsəti ˌʌndərˈmaɪn əˌkaʊntəˈbɪləti/" },
        { speaker: 'Chairwoman', en: "Under no circumstances should regulatory bodies overlook these socio-ethical implications.", es: "Bajo ninguna circunstancia deberían los organismos reguladores pasar por alto estas implicaciones socioéticas.", phonetic: "/ˈʌndər noʊ ˈsɜːrkəmstænsɪz ʃʊd ˈrɛɡjələˌtɔːri ˈbɑːdiz ˌoʊvərˈlʊk/" },
        { speaker: 'David', en: "Only when rigorous empirical audits are mandated will public trust be substantively restored.", es: "Solo cuando se ordenen auditorías empíricas rigurosas se restaurará sustantivamente la confianza pública.", phonetic: "/ˈoʊnli wɛn ˈrɪɡərəs ɪmˈpɪrɪkl ˈɔːdɪts ɑːr ˈmændeɪtɪd wɪl ˈpʌblɪk trʌst biː rɪˈstɔːrd/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué estructura sintáctica caracteriza las intervenciones formales de David y la moderadora?",
      audioContextText: "Both speakers use negative/restrictive inversion ('Seldom have we', 'Not only does', 'Under no circumstances should') to elevate the academic register.",
      options: [
        "Inversión enfática tras adverbios negativos y restrictivos al inicio de la cláusula.",
        "Uso exclusivo de preguntas informales de cafetería.",
        "Voz activa coloquial con modismos cotidianos."
      ],
      correctIndex: 0,
      explanation: "La inversión académica antepone expresiones como 'Seldom', 'Not only' o 'Under no circumstances' provocando la inversión auxiliar-sujeto."
    },
    step3_builder: {
      instruction: "Arma la inversión negativa enfática de alto registro:",
      targetTranslationEs: "Rara vez los investigadores han encontrado correlaciones tan concluyentes.",
      correctWords: ["Rarely", "have", "researchers", "encountered", "such", "conclusive", "correlations."],
      scrambledWords: ["correlations.", "have", "researchers", "Rarely", "such", "encountered", "conclusive", "did"]
    },
    step4_shadowing: {
      instruction: "Perfecciona la cadencia de la inversión académica:",
      phrases: [
        { levelLabel: "Inversión Restrictiva", en: "Seldom does an invention reshape society so rapidly.", phonetic: "/ˈsɛldəm dʌz ən ɪnˈvɛnʃn ˌriːˈʃeɪp səˈsaɪəti soʊ ˈræpɪdli/", tip: "Acentúa 'Seldom' y enlaza inmediatamente con el auxiliar /dʌz/." },
        { levelLabel: "Prohibición Categórica", en: "Under no circumstances may data be altered.", phonetic: "/ˈʌndər noʊ ˈsɜːrkəmstænsɪz meɪ ˈdeɪtə biː ˈɔːltərd/", tip: "Mantén un tono solemne y pausado tras la frase adverbial inicial." },
        { levelLabel: "Doble Cláusula Enfática", en: "Not only is the model scalable, but it is also cost-effective.", phonetic: "/nɑːt ˈoʊnli ɪz ðə ˈmɑːdl ˈskeɪləbl bʌt ɪt ɪz ˈɔːlsoʊ kɔːst ɪˈfɛktɪv/", tip: "Invierte solo en la primera cláusula ('is the model'), no en la segunda." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'Not only the researcher presented the data, but he also answered all hostile questions.'",
      explanationConcept: "Falta de inversión obligatoria tras 'Not only' al inicio",
      options: [
        "Not only did the researcher present the data, but he also answered all hostile questions.",
        "Not only the researcher did present the data, but he also answered.",
        "Not only was the researcher presented the data, but he also answered."
      ],
      correctIndex: 0,
      ruleInsight: "Al abrir con 'Not only', la sintaxis inglesa exige obligatoriamente invertir el orden con el auxiliar correspondiente ('did the researcher present'), emulando la estructura interrogativa pero con valor asertivo."
    },
    step6_mastery: {
      question: "¿Cuál opción exhibe la nominalización e inversión más sofisticada para una tesis doctoral?",
      options: [
        "Hardly had the paradigm been postulated when empirical contradictions emerged across laboratories.",
        "The paradigm was hardly postulated and suddenly people saw errors.",
        "Hardly the paradigm was postulated when problems came."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 5.1 Conquistado! Tu redacción posee la elegancia y densidad estilística del inglés doctoral C1."
    }
  },
  {
    id: 'c1-lesson-2',
    level: 'C1',
    unit: 5,
    unitTitle: 'Unidad 5 • Inglés Académico Avanzado (EAP)',
    code: '5.2',
    title: 'El arte del matiz: expresar certeza cautelosa en papers',
    subtitle: 'Atenúa afirmaciones científicas para blindar tus hallazgos ante revisores pares',
    academicProject: 'Redactar una propuesta formal de política pública o enmienda de bioética ante un comité regulador.',
    xpReward: 55,
    prerequisiteId: 'c1-lesson-1',
    step1_dialogue: {
      context: 'Comité de Ética en Ensayos Clínicos dictaminando sobre terapia génica.',
      lines: [
        { speaker: 'Regulator', en: "The board recommends that every principal investigator submit their raw sequencing datasets for independent verification.", es: "La junta recomienda que cada investigador principal envíe sus conjuntos de datos de secuenciación sin procesar para verificación independiente.", phonetic: "/ðə bɔːrd ˌrɛkəˈmɛndz ðæt ˈɛvri ˈprɪnsəpl ɪnˈvɛstəˌɡeɪtər səbˈmɪt/" },
        { speaker: 'David', en: "It is imperative that patient confidentiality be preserved, be that as it may with public disclosure requirements.", es: "Es imperativo que la confidencialidad del paciente sea preservada, sea como fuere con los requisitos de divulgación pública.", phonetic: "/ɪt ɪz ɪmˈpɛrətɪv ðæt ˈpeɪʃnt ˌkɑːnfɪˌdɛnʃiˈæləti biː prɪˈzɜːrvd/" },
        { speaker: 'Regulator', en: "We also demand that the trial not proceed until full clearance has been granted.", es: "También exigimos que el ensayo no proceda hasta que se haya otorgado la autorización total.", phonetic: "/wiː ˈɔːlsoʊ dɪˈmænd ðæt ðə ˈtraɪəl nɑːt prəˈsiːd/" },
        { speaker: 'David', en: "Notwithstanding these hurdles, preliminary results suggest a statistically significant therapeutic efficacy.", es: "A pesar de estos obstáculos, los resultados preliminares sugieren una eficacia terapéutica estadísticamente significativa.", phonetic: "/ˌnɑːtwɪθˈstændɪŋ ðiːz ˈhɜːrdlz prɪˈlɪmɪˌnɛri rɪˈzʌlts səɡˈdʒɛst/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué el regulador utiliza 'submit' en lugar de 'submits' al referirse a 'every principal investigator'?",
      audioContextText: "In formal mandative subjunctive, the verb remains in its bare base form regardless of third-person singular.",
      options: [
        "Porque el regulador cometió un error tipográfico en el acta.",
        "Porque el subjuntivo mandatario exige la forma base pura del verbo sin la desinencia '-s'.",
        "Porque 'every' siempre es considerado estrictamente plural en inglés."
      ],
      correctIndex: 1,
      explanation: "El subjuntivo mandatario formal tras verbos como 'recommend', 'demand' o 'insist' requiere la forma base desnuda (bare infinitive)."
    },
    step3_builder: {
      instruction: "Arma la directriz de subjuntivo formal con voz pasiva:",
      targetTranslationEs: "Es esencial que el protocolo sea revisado antes de la publicación.",
      correctWords: ["It", "is", "essential", "that", "the", "protocol", "be", "reviewed", "before", "publication."],
      scrambledWords: ["is", "reviewed", "that", "essential", "It", "publication.", "be", "the", "protocol", "before"]
    },
    step4_shadowing: {
      instruction: "Domina la prosodia del subjuntivo mandatario y las concesivas:",
      phrases: [
        { levelLabel: "Subjuntivo Mandatario", en: "We insist that the defendant remain silent.", phonetic: "/wiː ɪnˈsɪst ðæt ðə dɪˈfɛndənt rɪˈmeɪn ˈsaɪlənt/", tip: "Usa 'remain' sin '-s' independientemente del sujeto." },
        { levelLabel: "Concesión Arcaica Culta", en: "Be that as it may, our position stands.", phonetic: "/biː ðæt æz ɪt meɪ ˈaʊər pəˈzɪʃn stændz/", tip: "Pronuncia esta locución idiomática de transición con fluidez cohesionada." },
        { levelLabel: "Negación en Subjuntivo", en: "It is crucial that he not disclose the findings.", phonetic: "/ɪt ɪz ˈkruːʃl ðæt hiː nɑːt dɪsˈkloʊz ðə ˈfaɪndɪŋz/", tip: "La negación del subjuntivo se forma simplemente anteponiendo 'not' sin auxiliar." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'The dean requested that Dr. Hayes is present and does not speaks to journalists.'",
      explanationConcept: "Uso incorrecto del indicativo en lugar del subjuntivo mandatario",
      options: [
        "The dean requested that Dr. Hayes be present and not speak to journalists.",
        "The dean requested that Dr. Hayes was present and didn't speak to journalists.",
        "The dean requested that Dr. Hayes must be present and not to speak."
      ],
      correctIndex: 0,
      ruleInsight: "Tras fórmulas de mandato formal ('requested that...'), el verbo 'to be' permanece como 'be' y la negación se expresa con 'not + forma base' ('not speak'), prescindiendo de 'does not'."
    },
    step6_mastery: {
      question: "¿Cuál formulación de política pública ostenta el registro formal C1 idóneo?",
      options: [
        "We propose that a comprehensive ethical audit be undertaken forthwith by an external ombudsman.",
        "We propose that an ethical audit is done fast by someone outside.",
        "We propose that they must do an audit quickly."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 5.2 Superado! Dominas el instrumental retórico y normativo del más alto nivel académico."
    }
  },
  {
    id: 'c1-lesson-3',
    level: 'C1',
    unit: 5,
    unitTitle: 'Unidad 5 • Inglés Académico Avanzado (EAP)',
    code: '5.3',
    title: 'Reformular con impacto: destacar lo que de verdad importa',
    subtitle: 'Dirige la atención del comité evaluador hacia los descubrimientos más disruptivos',
    academicProject: 'Impartir una conferencia magistral estilo TED de 10 minutos con sesión oral de preguntas hostiles.',
    xpReward: 55,
    prerequisiteId: 'c1-lesson-2',
    step1_dialogue: {
      context: 'Conferencia magistral en el Royal Institute of International Affairs (Chatham House).',
      lines: [
        { speaker: 'Moderator', en: "David, your keynote address challenged prevailing geopolitical orthodoxy. What is your central thesis?", es: "David, tu conferencia magistral desafió la ortodoxia geopolítica imperante. ¿Cuál es tu tesis central?", phonetic: "/jɔːr ˈkiːˌnoʊt əˈdrɛs ˈtʃælɪndʒd prɪˈveɪlɪŋ ˌdʒiːoʊpəˈlɪtɪkl ˈɔːrθədɑːksi/" },
        { speaker: 'David', en: "Our empirical inquiry sheds light on a glaring contradiction: in stark contrast to theoretical models, resource nationalism exacerbates supply chain volatility.", es: "Nuestra indagación empírica arroja luz sobre una contradicción flagrante: en marcado contraste con los modelos teóricos, el nacionalismo de recursos exacerba la volatilidad de la cadena de suministro.", phonetic: "/ˈaʊər ɪmˈpɪrɪkl ɪnˈkwaɪəri ʃɛdz laɪt ɒn ə ˈɡlɛərɪŋ ˌkɑːntrəˈdɪkʃn/" },
        { speaker: 'Moderator', en: "A compelling argument indeed. Yet critics claim your framework oversimplifies bilateral trade friction.", es: "Un argumento convincente sin duda. Sin embargo, los críticos afirman que tu marco simplifica en exceso la fricción comercial bilateral.", phonetic: "/ə kəmˈpɛlɪŋ ˈɑːrɡjumənt ɪnˈdiːd jɛt ˈkrɪtɪks kleɪm jɔːr ˈfreɪmˌwɜːrk/" },
        { speaker: 'David', en: "Far from oversimplifying the dilemma, our findings pave the way for a nuanced paradigm that balances sovereignty with multilateral cooperation.", es: "Lejos de simplificar en exceso el dilema, nuestros hallazgos allanan el camino para un paradigma matizado que equilibra soberanía con cooperación multilateral.", phonetic: "/fɑːr frəm ˌoʊvərsɪmpləˈfaɪɪŋ ðə dɪˈlɛmə ˈaʊər ˈfaɪndɪŋz peɪv ðə weɪ/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué colocación culta utiliza David para indicar un contraste absoluto entre la teoría y la realidad empírica?",
      audioContextText: "David states: 'in stark contrast to theoretical models, resource nationalism exacerbates volatility'.",
      options: [
        "In very big difference.",
        "In stark contrast to.",
        "Completely opposed with."
      ],
      correctIndex: 1,
      explanation: "'In stark contrast to' es una colocación académica C1 de alta precisión retórica para marcar oposiciones categóricas."
    },
    step3_builder: {
      instruction: "Construye la aserción retórica de oratoria culta:",
      targetTranslationEs: "Esta investigación allana el camino para un avance tecnológico sin precedentes.",
      correctWords: ["This", "research", "paves", "the", "way", "for", "an", "unprecedented", "technological", "breakthrough."],
      scrambledWords: ["unprecedented", "paves", "breakthrough.", "research", "way", "the", "This", "for", "technological", "an"]
    },
    step4_shadowing: {
      instruction: "Practica las colocaciones académicas avanzadas con entonación de orador:",
      phrases: [
        { levelLabel: "Colocación de Impacto", en: "Our findings shed light on this elusive phenomenon.", phonetic: "/ˈaʊər ˈfaɪndɪŋz ʃɛd laɪt ɒn ðɪs ɪˈluːsɪv fəˈnɑːmɪnən/", tip: "'Shed light on' (/ʃɛd laɪt ɒn/) se pronuncia sin fragmentación rítmica." },
        { levelLabel: "Contraste Sofisticado", en: "In stark contrast to prior assumptions.", phonetic: "/ɪn stɑːrk ˈkɑːntræst tuː ˈpraɪər əˈsʌmpʃnz/", tip: "Marca el acento en 'stark' y 'contrast' para dar relieve semántico." },
        { levelLabel: "Apertura Retórica", en: "Far from being a liability, this is an asset.", phonetic: "/fɑːr frəm ˈbiːɪŋ ə ˌlaɪəˈbɪləti ðɪs ɪz ən ˈæsɛt/", tip: "'Far from being' establece una inversión de expectativas en la audiencia." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'This paper does a big light on the problem and makes the way for new ideas.'",
      explanationConcept: "Colocaciones incorrectas traducidas literalmente del español",
      options: [
        "This paper sheds light on the problem and paves the way for novel paradigms.",
        "This paper throws light at the problem and opens the road for ideas.",
        "This paper gives a big light into the problem and creates paths."
      ],
      correctIndex: 0,
      ruleInsight: "En inglés culto las ideas no 'hacen luz' ni 'abren camino'; se emplean colocaciones léxicas fosilizadas como 'sheds light on' y 'paves the way for'."
    },
    step6_mastery: {
      question: "¿Cómo abrirías una sección concluyente en una ponencia ante un auditorio académico internacional?",
      options: [
        "Far from reaching a definitive impasse, our empirical inquiries furnish compelling evidence of systemic resilience.",
        "We are not in an impasse because we have good proofs.",
        "Our study is proving that things are not bad."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 5.3 Conquistado! Tu oratoria exhibe la sofisticación léxica de un catedrático internacional."
    }
  },
  {
    id: 'c1-lesson-4',
    level: 'C1',
    unit: 5,
    unitTitle: 'Unidad 5 • Inglés Académico Avanzado (EAP)',
    code: '5.4',
    title: 'El tono del debate: sonar diplomático y persuasivo en comités',
    subtitle: 'Modula afirmaciones con prudencia científica y defiende enmiendas ante revisiones ciegas',
    academicProject: 'Escribir un ensayo crítico de 1,000 palabras con citas APA/MLA sometido a revisión ciega por pares.',
    xpReward: 55,
    prerequisiteId: 'c1-lesson-3',
    step1_dialogue: {
      context: 'Respondiendo a los comentarios de los revisores anónimos en la revista Nature Machine Intelligence.',
      lines: [
        { speaker: 'Reviewer 2', en: "The authors claim their algorithm eradicates bias, which strikes this reviewer as an overstatement unsupported by the data.", es: "Los autores afirman que su algoritmo erradica el sesgo, lo cual a este revisor le parece una exageración no respaldada por los datos.", phonetic: "/ðiː ˈɔːθərz kleɪm ðɛər ˈælɡərɪðəm ɪˈrædɪkeɪts ˈbaɪəs wɪtʃ straɪks ðɪs rɪˈvjuːər/" },
        { speaker: 'David', en: "We concede the point. In our revised manuscript, we have hedged our conclusions: the data merely suggest that the proposed architecture may mitigate algorithmic disparities.", es: "Concedemos el punto. En el manuscrito revisado hemos matizado nuestras conclusiones: los datos meramente sugieren que la arquitectura propuesta podría mitigar las disparidades algorítmicas.", phonetic: "/wiː kənˈsiːd ðə pɔɪnt ɪn ˈaʊər rɪˈvaɪzd ˈmænjəskrɪpt wiː hæv hɛdʒd ˈaʊər kənˈkluːʒnz/" },
        { speaker: 'Reviewer 2', en: "Much better. How do you address the apparent sample size limitation noted by Reviewer 1?", es: "Mucho mejor. ¿Cómo abordan la aparente limitación del tamaño de muestra señalada por el Revisor 1?", phonetic: "/mʌtʃ ˈbɛtər haʊ duː juː əˈdrɛs ðiː əˈpærənt ˈsæmpl saɪz ˌlɪmɪˈteɪʃn/" },
        { speaker: 'David', en: "As evidenced by Smith et al. (2024), longitudinal statistical validity is arguably retained even within constrained sample cohorts.", es: "Como evidencian Smith et al. (2024), la validez estadística longitudinal es presumiblemente conservada incluso en cohortes muestrales reducidas.", phonetic: "/æz ˈɛvɪdənst baɪ smɪθ ɛt æl ˌlɑːndʒəˈtuːdənl stəˈtɪstɪkl vəˈlɪdəti ɪz ˈɑːrɡjuəbli rɪˈteɪnd/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué estrategia retórica adoptó David para satisfacer la objeción del Revisor 2?",
      audioContextText: "David replaced the absolute claim ('eradicates bias') with hedged academic language ('suggest that... may mitigate', 'arguably retained').",
      options: [
        "Retiró el paper y canceló la investigación.",
        "Sustituyó afirmaciones dogmáticas absolutas por lenguaje prudente modulado ('hedging').",
        "Insultó al revisor anónimo por no entender matemáticas."
      ],
      correctIndex: 1,
      explanation: "El 'hedging' académico ('suggest', 'may indicate', 'arguably') es indispensable para evitar generalizaciones no verificables."
    },
    step3_builder: {
      instruction: "Arma la formulación con lenguaje académico matizado (hedging):",
      targetTranslationEs: "La evidencia preliminar parecería sugerir una correlación moderada entre ambas variables.",
      correctWords: ["Preliminary", "evidence", "would", "seem", "to", "suggest", "a", "moderate", "correlation", "between", "both", "variables."],
      scrambledWords: ["moderate", "evidence", "between", "would", "Preliminary", "suggest", "to", "both", "correlation", "variables.", "a", "seem"]
    },
    step4_shadowing: {
      instruction: "Practica los atenuadores epistémicos de la literatura científica:",
      phrases: [
        { levelLabel: "Verbo Atenuado", en: "The findings tend to indicate a systemic trend.", phonetic: "/ðə ˈfaɪndɪŋz tɛnd tuː ˈɪndɪkeɪt ə sɪˈstɛmɪk trɛnd/", tip: "Usa 'tend to indicate' en lugar de afirmaciones deterministas tajantes." },
        { levelLabel: "Adverbio de Resguardo", en: "This is arguably the most robust metric available.", phonetic: "/ðɪs ɪz ˈɑːrɡjuəbli ðə moʊst roʊˈbʌst ˈmɛtrɪk əˈveɪləbl/", tip: "'Arguably' defiende una postura reconociendo que es debatible." },
        { levelLabel: "Citación Canónica APA", en: "As corroborated by Johnson and Lee (2023).", phonetic: "/æz kəˈrɑːbəˌreɪtɪd baɪ ˈdʒɑːnsn ænd liː/", tip: "Lee fluidamente fórmulas de atribución bibliográfica." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'This experiment totally proves that the old theory is one hundred percent wrong.'",
      explanationConcept: "Afirmación dogmática y absoluta inaceptable en revistas de arbitraje por pares",
      options: [
        "These empirical observations cast substantial doubt on the tenability of the incumbent theoretical framework.",
        "This experiment proves that the old theory is completely mistaken.",
        "These data show that the past authors did not know anything."
      ],
      correctIndex: 0,
      ruleInsight: "En la literatura científica de alto impacto nunca se afirma que algo 'totalmente prueba' ('totally proves') el error ajeno; se recurre a fórmulas epistemológicas elegantes como 'casts substantial doubt on the tenability of...'."
    },
    step6_mastery: {
      question: "¿Cómo refutarías cortésmente una crítica en un peer-review response letter?",
      options: [
        "While we appreciate the reviewer's insightful perspective, our findings suggest that the alternative hypothesis remains plausible under specific parametric constraints.",
        "The reviewer is totally wrong because our model works perfectly.",
        "We do not agree with the reviewer and we refuse to change our paper."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel C1 Completado con Honores Universitarios! Posees la prudencia epistemológica y la destreza de publicación internacional."
    }
  },

  // ==========================================================================
  // UNIDAD 6: NIVEL C2 • MAESTRÍA DOCTORAL, DIALECTOLOGÍA Y PAPERS INDEXADOS
  // ==========================================================================
  {
    id: 'c2-lesson-1',
    level: 'C2',
    unit: 6,
    unitTitle: 'Unidad 6 • Maestría Doctoral y Especialización',
    code: '6.1',
    title: 'La negociación en la cumbre: decir mucho entre líneas',
    subtitle: 'Interpreta el subtexto y los matices no dichos en cumbres multilaterales de alto nivel',
    academicProject: 'Deconstruir un debate geopolítico internacional identificando subtexto y falacias veladas.',
    xpReward: 60,
    prerequisiteId: 'c1-lesson-4',
    step1_dialogue: {
      context: 'Mesa de negociación multilateral a puerta cerrada en el Palacio de las Naciones, Ginebra.',
      lines: [
        { speaker: 'Diplomat A', en: "With all due respect to the delegation, this proposal is certainly ambitious, not to say remarkably courageous.", es: "Con el debido respeto a la delegación, esta propuesta es ciertamente ambiciosa, por no decir notablemente valiente.", phonetic: "/wɪð ɔːl djuː rɪˈspɛkt tuː ðə ˌdɛləˈɡeɪʃn ðɪs prəˈpoʊzl ɪz ˈsɜːrtnli æmˈbɪʃəs/" },
        { speaker: 'David', en: "We appreciate the delegate's characteristic understatement. If 'courageous' implies high geopolitical risk, we have factored that contingency into our stress models.", es: "Agradecemos la atenuación característica del delegado. Si 'valiente' insinúa un alto riesgo geopolítico, hemos incorporado esa contingencia en nuestros modelos de tensión.", phonetic: "/wiː əˈpriːʃieɪt ðə ˈdɛləɡəts ˌkærəktəˈrɪstɪk ˈʌndərsteɪtmənt/" },
        { speaker: 'Diplomat A', en: "I hear what you say; perhaps we might revisit the sovereignty clauses at a later juncture.", es: "Escucho lo que dice; tal vez podríamos revisar las cláusulas de soberanía en una coyuntura posterior.", phonetic: "/aɪ hɪər wɑːt juː seɪ pərˈhæps wiː maɪt ˌriːˈvɪzɪt ðə ˈsɑːvrənti ˈklɔːzɪz/" },
        { speaker: 'David', en: "Taking that as a polite demurral, let us table the contested annex and proceed with consensus articles.", es: "Tomando eso como una educada objeción, pausemos el anexo disputado y avancemos con los artículos de consenso.", phonetic: "/ˈteɪkɪŋ ðæt æz ə pəˈlaɪt dɪˈmɜːrəl lɛt ʌs ˈteɪbl ðə kənˈtɛstɪd ˈænɛks/" }
      ]
    },
    step2_comprehension: {
      prompt: "En el código diplomático británico, ¿qué significa realmente la frase 'I hear what you say'?",
      audioContextText: "In British pragmatic discourse, 'I hear what you say' is a diplomatic euphemism for 'I disagree fundamentally with your stance and have no intention of discussing it further'.",
      options: [
        "Que el diplomático tiene problemas auditivos y pide que hablen más fuerte.",
        "Es un rechazo diplomático velado que significa 'discrepo de raíz y no tengo intención de ceder'.",
        "Que está cien por ciento de acuerdo y firmará el tratado de inmediato."
      ],
      correctIndex: 1,
      explanation: "El dominio C2 radica en comprender la pragmática situacional: la divergencia entre el significado literal y la intención ilocucionaria real del hablante nativo culto."
    },
    step3_builder: {
      instruction: "Construye la expresión de diplomacia matizada con atenuación culta:",
      targetTranslationEs: "Con el debido respeto, tal vez deberíamos reconsiderar las implicaciones de esta decisión.",
      correctWords: ["With", "all", "due", "respect,", "we", "might", "perhaps", "reconsider", "the", "implications", "of", "this", "decision."],
      scrambledWords: ["respect,", "decision.", "perhaps", "we", "reconsider", "With", "the", "implications", "due", "all", "might", "of", "this"]
    },
    step4_shadowing: {
      instruction: "Practica la entonación contenida del understatement británico:",
      phrases: [
        { levelLabel: "Atenuación Irónica", en: "That is certainly one way of looking at it.", phonetic: "/ðæt ɪz ˈsɜːrtnli wʌn weɪ əv ˈlʊkɪŋ æt ɪt/", tip: "Significa implícitamente: 'Tu postura es absurda y completamente errónea'." },
        { levelLabel: "Objeción Parlamentaria", en: "I would take slight issue with that assertion.", phonetic: "/aɪ wʊd teɪk slaɪt ˈɪʃuː wɪð ðæt əˈsɜːrʃn/", tip: "Significa: 'Rechazo terminantemente lo que acabas de afirmar'." },
        { levelLabel: "Desacuerdo Velado", en: "With the greatest respect, I remain unconvinced.", phonetic: "/wɪð ðə ˈɡreɪtɪst rɪˈspɛkt aɪ rɪˈmeɪn ˌʌnkənˈvɪnst/", tip: "Fórmula canónica para disentir sin alterar el protocolo diplomático." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'The British ambassador told me my idea was very interesting, so that means he will fund it right now.'",
      explanationConcept: "Error de lectura pragmática del understatement anglosajón",
      options: [
        "The British ambassador termed my idea 'interesting', which in this context conveys polite skepticism rather than endorsement.",
        "The British ambassador told me my idea was interesting, so he agrees.",
        "The British ambassador said my idea is interesting, meaning he loved it."
      ],
      correctIndex: 0,
      ruleInsight: "En la cultura académica y diplomática británica, calificar una propuesta de 'very interesting' suele significar 'is unrealistic or flawed'. Traducirlo literalmente como entusiasmo es un error pragmático clásico."
    },
    step6_mastery: {
      question: "¿Cómo formularías una objeción pragmática en una cumbre internacional sin quebrar el decoro?",
      options: [
        "While we acknowledge the noble intentions behind the draft, its feasibility remains, at least in our estimation, open to question.",
        "Your draft is terrible and impossible to do.",
        "I don't like your document at all."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 6.1 Conquistado! Descodificas y ejecutas la pragmática del discurso con la finura de un diplomático internacional."
    }
  },
  {
    id: 'c2-lesson-2',
    level: 'C2',
    unit: 6,
    unitTitle: 'Unidad 6 • Maestría Doctoral y Especialización',
    code: '6.2',
    title: 'Inglés sin fronteras: descifrar dialectos y acentos globales',
    subtitle: 'Interactúa fluidamente con investigadores escoceses, australianos, británicos e indios',
    academicProject: 'Moderar una mesa redonda universitaria en vivo con panelistas de 4 continentes sin titubeos.',
    xpReward: 60,
    prerequisiteId: 'c2-lesson-1',
    step1_dialogue: {
      context: 'Mesa redonda global en Edimburgo con investigadores de Reino Unido, Australia, Escocia e India.',
      lines: [
        { speaker: 'Scottish Scholar', en: "Och, the wee anomalies in the empirical sample cannae be swept under the carpet, mind you.", es: "Ah, las pequeñas anomalías en la muestra empírica no pueden esconderse bajo la alfombra, fíjate.", phonetic: "/ɒx ðə wiː əˈnɑːməliz ɪn ðiː ɪmˈpɪrɪkl ˈsæmpl ˈkæni biː swɛpt/" },
        { speaker: 'Aussie Researcher', en: "No worries mate, but if we reckon the baseline data is fair dinkum, we ought to crack on with the peer review.", es: "Sin problema compañero, pero si consideramos que los datos de base son legítimos, deberíamos ponernos en marcha con la revisión por pares.", phonetic: "/noʊ ˈwʌriz meɪt bʌt ɪf wiː ˈrɛkən ðə ˈbeɪslaɪn ˈdeɪtə ɪz fɛər ˈdɪŋkəm/" },
        { speaker: 'David', en: "Synthesizing both perspectives: while our Scottish colleague rightly counsels caution regarding the variance, our Australian colleague's call for momentum is well taken.", es: "Sintetizando ambas perspectivas: si bien nuestro colega escocés aconseja cautela con la varianza, el llamado de nuestro colega australiano es oportuno.", phonetic: "/ˈsɪnθəˌsaɪzɪŋ boʊθ pərˈspɛktɪvz waɪl ˈaʊər ˈskɑːtɪʃ ˈkɑːliːɡ ˈraɪtli ˈkaʊnslz/" },
        { speaker: 'Scottish Scholar', en: "Spot on! That bridges the gap brilliantly.", es: "¡Exactamente en el clavo! Eso salva la brecha de manera brillante.", phonetic: "/spɑːt ɒn ðæt ˈbrɪdʒɪz ðə ɡæp ˈbrɪljəntli/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué significa el término dialectal australiano 'fair dinkum' en la intervención del investigador?",
      audioContextText: "In Australian English, 'fair dinkum' means authentic, genuine, or true.",
      options: [
        "Que los datos son falsos o manipulados.",
        "Que los datos son genuinos, auténticos y confiables.",
        "Que el proyecto está cancelado."
      ],
      correctIndex: 1,
      explanation: "'Fair dinkum' es un modismo australiano canónico que denota legitimidad y veracidad inobjetable."
    },
    step3_builder: {
      instruction: "Arma la mediación ecuménica de multiacento académico:",
      targetTranslationEs: "A pesar de las variaciones dialectales, el consenso metodológico fue alcanzado unánimemente.",
      correctWords: ["Despite", "dialectal", "variations,", "methodological", "consensus", "was", "unanimously", "reached."],
      scrambledWords: ["unanimously", "variations,", "Despite", "reached.", "consensus", "dialectal", "was", "methodological"]
    },
    step4_shadowing: {
      instruction: "Entrena los contrastes fonológicos de los dialectos globales:",
      phrases: [
        { levelLabel: "Inglés Escocés (Rhotic R)", en: "The research bird flies over the firth.", phonetic: "/ðə rɪˈsɜːrtʃ bɜːrd flaɪz ˈoʊvər ðə fɜːrθ/", tip: "Pronuncia la 'r' con vibración apical marcada (rótica escocesa)." },
        { levelLabel: "Australiano (Diptongo Amplio)", en: "Today we analyse the climate change survey.", phonetic: "/təˈdaɪ wiː ˈænəˌlaɪz ðə ˈklaɪmət tʃeɪndʒ ˈsɜːrveɪ/", tip: "El sonido de 'today' se aproxima a /təˈdaɪ/ en acento broad australiano." },
        { levelLabel: "British RP (Non-rhotic & Glottal)", en: "Water is better kept in the laboratory.", phonetic: "/ˈwɔːtər ɪz ˈbɛtə kɛpt ɪn ðə ləˈbɒrətri/", tip: "En RP no se pronuncia la 'r' final y 'laboratory' se acentúa en la segunda sílaba." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'Because he spoke with an Irish accent, his scientific thesis was not valid.'",
      explanationConcept: "Prejuicio dialectal frente al estándar de inteligibilidad global C2",
      options: [
        "A scholar's regional phonology or dialect in no way detracts from the conceptual rigor of their empirical thesis.",
        "Because he spoke with an accent, people didn't understand.",
        "His thesis was invalid because of accent issues."
      ],
      correctIndex: 0,
      ruleInsight: "En el nivel C2 de maestría internacional, el hablante posee competencia intercultural plena para procesar, valorar y mediar entre cualquier variedad nativa o no nativa del inglés sin interferencia comunicativa."
    },
    step6_mastery: {
      question: "¿Cómo actuarías como moderador ante una frase coloquial regional en una cumbre?",
      options: [
        "Paraphrase the colloquial dialectism into international standard academic English to ensure mutual comprehension across all delegations.",
        "Interrupt the speaker and demand they speak proper British English only.",
        "Ignore the intervention completely."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 6.2 Conquistado! Posees oído cosmopolita y competencia sociolingüística global."
    }
  },
  {
    id: 'c2-lesson-3',
    level: 'C2',
    unit: 6,
    unitTitle: 'Unidad 6 • Maestría Doctoral y Especialización',
    code: '6.3',
    title: 'El texto impecable: pulir un artículo al nivel de Science',
    subtitle: 'Sincroniza la coherencia discursiva, el ritmo sintáctico y el léxico doctoral con estructura IMRAD',
    academicProject: 'Redactar un paper científico completo con abstract de 250 palabras listo para sumisión indexada.',
    xpReward: 60,
    prerequisiteId: 'c2-lesson-2',
    step1_dialogue: {
      context: 'Revisión final de manuscrito con el editor en jefe antes del envío a Science.',
      lines: [
        { speaker: 'Editor-in-Chief', en: "David, the abstract is cogent, but does it clearly articulate the novelty of the theoretical paradigm?", es: "David, el resumen es convincente, pero ¿articula claramente la novedad del paradigma teórico?", phonetic: "/ˈdeɪvɪd ðiː ˈæbstrækt ɪz ˈkoʊdʒənt bʌt dʌz ɪt ˈklɪərli ɑːrˈtɪkjəleɪt/" },
        { speaker: 'David', en: "Yes. We specifically demonstrate that our synthesized polymer exhibits anomalous superconducting characteristics at ambient temperatures.", es: "Sí. Demostramos específicamente que nuestro polímero sintetizado exhibe características superconductoras anómalas a temperatura ambiente.", phonetic: "/wiː spəˈsɪfɪkli ˈdɛmənˌstreɪt ðæt ˈaʊər ˈsɪnθəsaɪzd ˈpɑːlɪmər ɪɡˈzɪbɪts/" },
        { speaker: 'Editor-in-Chief', en: "That is ground-breaking. Have you preemptively countered the expected thermodynamic skepticism?", es: "Eso es revolucionario. ¿Han refutado preventivamente el escepticismo termodinámico esperado?", phonetic: "/ðæt ɪz ˈɡraʊndˌbreɪkɪŋ hæv juː priːˈɛmptɪvli ˈkaʊntərd/" },
        { speaker: 'David', en: "Section four elucidates the quantum lattice dynamics, thereby reconciling these observations with established macroscopic laws.", es: "La sección cuatro dilucida la dinámica de red cuántica, reconciliando así estas observaciones con las leyes macroscópicas establecidas.", phonetic: "/ˈsɛkʃn fɔːr ɪˈluːsɪdeɪts ðə ˈkwɑːntəm ˈlætɪs daɪˈnæmɪks/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Cuál es el propósito del conector formal 'thereby' en la explicación de David?",
      audioContextText: "David states: 'Section four elucidates the lattice dynamics, thereby reconciling these observations with established laws'.",
      options: [
        "Indica una duda o indecisión del equipo.",
        "Indica consecuencia lógica directa e instrumental: 'por medio de lo cual / reconciliando de este modo'.",
        "Significa que van a posponer el experimento."
      ],
      correctIndex: 1,
      explanation: "'Thereby + gerundio' es un nexo de alta densidad estilística característico de los abstracts y conclusiones indexadas."
    },
    step3_builder: {
      instruction: "Arma la síntesis concluyente para un abstract de Science:",
      targetTranslationEs: "El modelo propuesto reconcilia observaciones empíricas dispares, estableciendo así un marco unificado.",
      correctWords: ["The", "proposed", "model", "reconciles", "disparate", "empirical", "observations,", "thereby", "establishing", "a", "unified", "framework."],
      scrambledWords: ["thereby", "reconciles", "framework.", "disparate", "establishing", "proposed", "a", "empirical", "The", "unified", "observations,", "model"]
    },
    step4_shadowing: {
      instruction: "Practica el ritmo de exposición de papers científicos de alto impacto:",
      phrases: [
        { levelLabel: "Verbo Académico de Vanguardia", en: "This paper elucidates the underlying mechanism.", phonetic: "/ðɪs ˈpeɪpər ɪˈluːsɪdeɪts ðiː ˌʌndərˈlaɪɪŋ ˈmɛkəˌnɪzəm/", tip: "Pronuncia 'elucidates' /ɪˈluːsɪdeɪts/ con fluidez natural sin trabar la lengua." },
        { levelLabel: "Concesión Estratégica en Defensa", en: "I concede that limitation; nonetheless, our findings hold.", phonetic: "/aɪ kənˈsiːd ðæt ˌlɪmɪˈteɪʃn ˌnʌnðəˈlɛs ˈaʊər ˈfaɪndɪŋz hoʊld/", tip: "Haz una pausa intencionada tras el punto y coma antes de 'nonetheless'." },
        { levelLabel: "Reconciliación de Literatura", en: "Our framework reconciles seemingly contradictory data.", phonetic: "/ˈaʊər ˈfreɪmˌwɜːrk ˈrɛkənˌsaɪlz ˈsiːmɪŋli ˌkɑːntrəˈdɪktəri ˈdeɪtə/", tip: "Conecta 'reconciles' directamente con el adverbio /siː-mɪŋ-li/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'This paper wants to explain things that other scientists did wrong.'",
      explanationConcept: "Registro informal inaceptable para un paper indexado en Nature o Science",
      options: [
        "This paper elucidates discrepancies identified across prior literature.",
        "This paper wants to explain things that other scientists did wrong.",
        "This paper is explaining what errors other researchers made."
      ],
      correctIndex: 0,
      ruleInsight: "En la literatura científica internacional se erradican los verbos antropomórficos informales ('wants to explain'); la prosa C2 emplea términos de precisión epistemológica ('elucidates discrepancies identified across prior literature')."
    },
    step6_mastery: {
      question: "¿Cuál oración sintetiza con perfección C2 el aporte final de una investigación doctoral?",
      options: [
        "The proposed paradigm reconciles disparate empirical observations, thereby establishing a unified theoretical framework.",
        "The proposed paradigm is good because it connects many things that were not connected before.",
        "Our study makes everything clear and proves all others were mistaken."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 6.3 Conquistado! Tu pluma posee el calibre estilístico y la sobriedad requerida por Nature y Science."
    }
  },
  {
    id: 'c2-lesson-4',
    level: 'C2',
    unit: 6,
    unitTitle: 'Unidad 6 • Maestría Doctoral y Especialización',
    code: '6.4',
    title: 'La defensa del doctorado: responder con soltura ante el tribunal',
    subtitle: 'Sostén tu tesis viva voce en Oxford con aplomo ante las interrogaciones socráticas de los examinadores',
    academicProject: 'Simular la defensa de una tesis doctoral de 30 minutos frente a un tribunal académico con preguntas hostiles.',
    xpReward: 65,
    prerequisiteId: 'c2-lesson-3',
    step1_dialogue: {
      context: 'Defensa oral de tesis doctoral en el Gran Salón de Ceremonias de la Universidad de Oxford.',
      lines: [
        { speaker: 'External Examiner', en: "Candidate, isn't your reliance on heuristic Bayesian priors an ontological flaw that invalidates your entire predictive model?", es: "Candidato, ¿no es acaso su confianza en priors bayesianos heurísticos una falla ontológica que invalida todo su modelo predictivo?", phonetic: "/ˈkændɪdeɪt ˈɪznt jɔːr rɪˈlaɪəns ɒn hjuːˈrɪstɪk ˈbeɪziən ˈpraɪərz ən ˌɑːntəˈlɑːdʒɪkl flɔː/" },
        { speaker: 'David', en: "Far from being an ontological flaw, the specification of informative priors is the mathematical bedrock that shields our algorithm from stochastic overfitting.", es: "Lejos de ser una falla ontológica, la especificación de priors informativos es el cimiento matemático que protege nuestro algoritmo del sobreajuste estocástico.", phonetic: "/fɑːr frəm ˈbiːɪŋ ən ˌɑːntəˈlɑːdʒɪkl flɔː ðə ˌspɛsɪfɪˈkeɪʃn əv ɪnˈfɔːrmətɪv ˈpraɪərz/" },
        { speaker: 'External Examiner', en: "And how do you substantiate that claim when confronting out-of-distribution adversarial vectors?", es: "¿Y cómo fundamenta esa afirmación cuando se enfrenta a vectores adversarios fuera de distribución?", phonetic: "/ænd haʊ duː juː səbˈstænʃieɪt ðæt kleɪm wɛn kənˈfrʌntɪŋ/" },
        { speaker: 'David', en: "By demonstrating, as proven in Chapter Six, that the empirical error bounds converge asymptotically to zero even under minimax adversarial perturbation.", es: "Demostrando, como se demuestra en el Capítulo Seis, que los límites de error empírico convergen asintóticamente a cero incluso bajo perturbación adversaria minimax.", phonetic: "/baɪ ˈdɛmənˌstreɪtɪŋ æz ˈpruːvn ɪn ˈtʃæptər sɪks ðæt ðiː ɪmˈpɪrɪkl ˈɛrər baʊndz kənˈvɜːrdʒ/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Cómo desarma David la objeción hostil del examinador externo durante la defensa doctoral?",
      audioContextText: "David reframes the purported flaw into a mathematical asset and cites empirical chapter proofs with asymptotic convergence.",
      options: [
        "Acepta que el modelo es inútil y se disculpa con el tribunal.",
        "Refraustura el supuesto defecto como un pilar protector y cita pruebas formales de convergencia asintótica.",
        "Pide al tribunal que lo evalúe otro día porque está cansado."
      ],
      correctIndex: 1,
      explanation: "David emplea oratoria socrática: refórmula la premisa hostil ('Far from being...') y aporta rigor formal incontrovertible."
    },
    step3_builder: {
      instruction: "Arma la defensa retórica frente al tribunal examinador:",
      targetTranslationEs: "Lejos de socavar la teoría, este hallazgo corrobora su validez universal.",
      correctWords: ["Far", "from", "undermining", "the", "theory,", "this", "finding", "corroborates", "its", "universal", "validity."],
      scrambledWords: ["corroborates", "its", "theory,", "undermining", "finding", "universal", "validity.", "Far", "this", "from", "the"]
    },
    step4_shadowing: {
      instruction: "Perfecciona la cadencia de la defensa doctoral con aplomo zen:",
      phrases: [
        { levelLabel: "Refutación Elegante", en: "Far from being a liability, it is our greatest asset.", phonetic: "/fɑːr frəm ˈbiːɪŋ ə ˌlaɪəˈbɪləti ɪt ɪz ˈaʊər ˈɡreɪtɪst ˈæsɛt/", tip: "Mantén un tono de voz sereno sin agresividad ni vacilación." },
        { levelLabel: "Fundamentación Matemática", en: "The error bounds converge asymptotically to zero.", phonetic: "/ðiː ˈɛrər baʊndz kənˈvɜːrdʒ ˌæsɪmˈtɑːtɪkli tuː ˈzɪroʊ/", tip: "Pronuncia 'asymptotically' /ˌæsɪmˈtɑːtɪkli/ con métrica limpia." },
        { levelLabel: "Cierre Concluyente", en: "We submit that the hypothesis is rigorously validated.", phonetic: "/wiː səbˈmɪt ðæt ðə haɪˈpɑːθəsɪs ɪz ˈrɪɡərəsli ˈvælɪdeɪtɪd/", tip: "'We submit that' es la fórmula canónica de entrega y cierre perentorio." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'I think the professor is wrong because my computer simulation worked good.'",
      explanationConcept: "Registro infantil y defensivo en un tribunal doctoral de grado",
      options: [
        "With respect, the empirical simulations substantiate our theoretical assertions beyond the stochastic margin of error.",
        "I think the professor is wrong because my simulation worked well.",
        "The professor does not see that my program is good."
      ],
      correctIndex: 0,
      ruleInsight: "En una defensa de tesis doctoral C2, nunca se personaliza la discrepancia ('the professor is wrong'); se eleva el argumento a la evidencia objetiva ('substantiate our theoretical assertions beyond the stochastic margin of error')."
    },
    step6_mastery: {
      question: "¿Cuál declaración sintetiza la culminación triunfal de la carrera académica del estudiante?",
      options: [
        "Mr. Chairman, members of the tribunal: we submit that our inquiry bridges the gap between quantum kinetics and macroeconomic equilibrium, thereby completing our doctoral defense.",
        "Thanks everyone, I think I finished my presentation and I hope you give me the title.",
        "That is all I have to say about this project today."
      ],
      correctIndex: 0,
      successMessage: "🎉 ¡DOCTORADO Y MAESTRÍA PLENA MCER C2 CONQUISTADA! 🎉 Has completado con éxito el currículo universitario internacional de principio a fin: 24 clases intensivas, 6 niveles MCER (A1 a C2), con Stephen Krashen y el más alto rigor de Oxford y Cambridge."
    }
  }
];
