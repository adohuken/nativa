const fs = require('fs');
const path = require('path');

const curriculumContent = `// ============================================================================
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
    title: 'Identidad, Origen y Verbo To Be',
    subtitle: 'Preséntate con naturalidad y describe tu origen sin traducir mentalmente',
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
    title: 'Artículos (A / An / The) y Demostrativos',
    subtitle: 'Identifica y cataloga recursos en el entorno universitario y de laboratorio',
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
    title: 'Presente Simple, Rutinas y Tercera Persona',
    subtitle: 'Expresa hábitos académicos, frecuencias y domina la terminación -s sin titubeos',
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
    title: 'Espacios, Existencia y Modales Básicos',
    subtitle: 'Navega el campus, formula peticiones corteses con Can/Could y describe existencias',
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
    title: 'Pasado Simple: Hechos Históricos y Trayectoria',
    subtitle: 'Narra hitos científicos y experiencias pasadas dominando la fonética de -ed',
    academicProject: 'Escribir una breve biografía de un científico pionero y narrar una anécdota personal.',
    xpReward: 40,
    prerequisiteId: 'a1-lesson-4',
    step1_dialogue: {
      context: 'En el museo de la Real Sociedad Británica de Ciencias en Londres.',
      lines: [
        { speaker: 'Curator', en: "Did you know that Isaac Newton studied right here in Cambridge?", es: "¿Sabías que Isaac Newton estudió justo aquí en Cambridge?", phonetic: "/dɪd juː noʊ ðæt ˈaɪzək ˈnjuːtn ˈstʌdid raɪt hɪər ɪn ˈkeɪmbrɪdʒ/" },
        { speaker: 'David', en: "Yes! He discovered the law of universal gravitation in 1687.", es: "¡Sí! Él descubrió la ley de gravitación universal en 1687.", phonetic: "/jɛs hiː dɪˈskʌvərd ðə lɔː əv ˌjuːnɪˈvɜːrsəl ˌɡrævɪˈteɪʃn ɪn ˈsɪksˈtiːn ˈeɪti ˈsɛvn/" },
        { speaker: 'Curator', en: "Indeed. He also invented the reflecting telescope.", es: "En efecto. También inventó el telescopio reflector.", phonetic: "/ɪnˈdiːd hiː ˈɔːlsoʊ ɪnˈvɛntɪd ðə rɪˈflɛktɪŋ ˈtɛlɪskoʊp/" },
        { speaker: 'David', en: "I visited his historic apple tree yesterday morning.", es: "Visité su histórico manzano ayer por la mañana.", phonetic: "/aɪ ˈvɪzɪtɪd hɪz hɪˈstɔːrɪk ˈæpl triː ˈjɛstərdeɪ ˈmɔːrnɪŋ/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué logro atribuye David a Isaac Newton durante su visita?",
      audioContextText: "David states that Newton discovered universal gravitation and visited his apple tree yesterday.",
      options: [
        "Newton descubrió la penicilina en Cambridge.",
        "Newton descubrió la ley de gravitación en 1687.",
        "Newton nunca estudió en Cambridge."
      ],
      correctIndex: 1,
      explanation: "David menciona con precisión histórica que Newton descubrió la ley de gravitación en 1687."
    },
    step3_builder: {
      instruction: "Arma la oración narrativa en pasado:",
      targetTranslationEs: "La investigadora publicó su informe después de la conferencia.",
      correctWords: ["The", "researcher", "published", "her", "report", "after", "the", "conference."],
      scrambledWords: ["conference.", "published", "her", "The", "report", "publish", "after", "researcher", "the"]
    },
    step4_shadowing: {
      instruction: "Domina las 3 pronunciaciones del pasado regular (-ed):",
      phrases: [
        { levelLabel: "Terminación /t/ (Sorda)", en: "She worked late at the laboratory.", phonetic: "/ʃiː wɜːrkt leɪt æt ðə ˈlæbrəˌtɔːri/", tip: "Tras consonante sorda 'k', la -ed suena puramente como /t/ sin añadir sílaba." },
        { levelLabel: "Terminación /d/ (Sonora)", en: "They discovered a new compound.", phonetic: "/ðeɪ dɪˈskʌvərd ə njuː ˈkɑːmpaʊnd/", tip: "Tras sonido vocal o sonoro 'r', la terminación vibra suavemente como /d/." },
        { levelLabel: "Terminación /ɪd/ (Extra Sílaba)", en: "He invented a revolutionary device.", phonetic: "/hiː ɪnˈvɛntɪd ə ˌrɛvəˈluːʃəˌnɛri dɪˈvaɪs/", tip: "Solo tras las letras 't' o 'd' se pronuncia una sílaba extra /ɪd/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'Yesterday I didn't went to the laboratory because I was sick.'",
      explanationConcept: "Doble pasado con el auxiliar 'did'",
      options: [
        "Yesterday I didn't went to the laboratory because I am sick.",
        "Yesterday I didn't go to the laboratory because I was sick.",
        "Yesterday I not go to the laboratory because was sick."
      ],
      correctIndex: 1,
      ruleInsight: "Cuando usas el auxiliar negativo del pasado 'didn't', el verbo principal ya no puede ir en pasado ('went'); debe retornar a su forma base ('didn't go')."
    },
    step6_mastery: {
      question: "¿Cómo narras un evento concluido en el año 2020?",
      options: [
        "We completed the first phase of the clinical trial in 2020.",
        "We have completed the first phase in 2020.",
        "We did completed the first phase in 2020."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 2.1 Dominado! Puedes narrar hitos y biografías con exactitud temporal y fonética."
    }
  },
  {
    id: 'a2-lesson-2',
    level: 'A2',
    unit: 2,
    unitTitle: 'Unidad 2 • Comunicación Cotidiana y Relatos',
    code: '2.2',
    title: 'Comparativos, Superlativos y Cuantificadores',
    subtitle: 'Compara soluciones tecnológicas, campus universitarios y maneja cantidades',
    academicProject: 'Comparar dos campus universitarios o dos soluciones tecnológicas y exponer pros y contras.',
    xpReward: 40,
    prerequisiteId: 'a2-lesson-1',
    step1_dialogue: {
      context: 'Debatiendo la elección entre dos servidores en la nube para el proyecto universitario.',
      lines: [
        { speaker: 'Engineer A', en: "Server Alpha is faster than Server Beta, but it is much more expensive.", es: "El servidor Alfa es más rápido que el servidor Beta, pero es mucho más costoso.", phonetic: "/ˈsɜːrvər ˈælfə ɪz ˈfæstər ðæn ˈsɜːrvər ˈbeɪtə bʌt ɪt ɪz mʌtʃ mɔːr ɪkˈspɛnsɪv/" },
        { speaker: 'David', en: "Which one provides the most reliable uptime for students?", es: "¿Cuál de ellos proporciona el tiempo de actividad más confiable para los estudiantes?", phonetic: "/wɪtʃ wʌn prəˈvaɪdz ðə moʊst rɪˈlaɪəbl ˈʌpˌtaɪm fɔːr ˈstjuːdnts/" },
        { speaker: 'Engineer A', en: "Alpha has the highest rating, but we have very few credits left.", es: "Alfa tiene la calificación más alta, pero nos quedan muy pocos créditos.", phonetic: "/ˈælfə hæz ðə ˈhaɪɪst ˈreɪtɪŋ bʌt wiː hæv ˈvɛri fjuː ˈkrɛdɪts lɛft/" },
        { speaker: 'David', en: "Then Beta is better for our current semester budget.", es: "Entonces Beta es mejor para el presupuesto de nuestro semestre actual.", phonetic: "/ðɛn ˈbeɪtə ɪz ˈbɛtər fɔːr ˈaʊər ˈkɜːrənt ˈsɛmɪstər ˈbʌdʒɪt/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué el equipo concluye que Server Beta es más conveniente?",
      audioContextText: "Alpha has the highest rating but Beta is better for the current budget because credits are low.",
      options: [
        "Porque Server Beta es el más rápido de todos.",
        "Porque tienen pocos créditos y Beta se ajusta mejor al presupuesto.",
        "Porque Alpha está roto y no funciona."
      ],
      correctIndex: 1,
      explanation: "El equipo opta por Beta debido a restricciones presupuestarias y la escasez de créditos."
    },
    step3_builder: {
      instruction: "Construye la comparación adecuada:",
      targetTranslationEs: "Esta metodología es más eficiente que el método tradicional.",
      correctWords: ["This", "methodology", "is", "more", "efficient", "than", "the", "traditional", "method."],
      scrambledWords: ["than", "efficient", "method.", "is", "more", "traditional", "the", "This", "methodology"]
    },
    step4_shadowing: {
      instruction: "Entrena los contrastes comparativos y superlativos:",
      phrases: [
        { levelLabel: "Adjetivo Corto (-er than)", en: "Our campus is larger than theirs.", phonetic: "/ˈaʊər ˈkæmpəs ɪz ˈlɑːrdʒər ðæn ðɛərz/", tip: "Agrega '-er' en monosílabos y no olvides la conjunción 'than'." },
        { levelLabel: "Adjetivo Largo (more ... than)", en: "This process is more complicated than expected.", phonetic: "/ðɪs ˈprɑːsɛs ɪz mɔːr ˈkɑːmplɪkeɪtɪd ðæn ɪkˈspɛktɪd/", tip: "En palabras de 3+ sílabas, antepón 'more' sin alterar el adjetivo." },
        { levelLabel: "Superlativo Absoluto", en: "It is the most efficient algorithm available.", phonetic: "/ɪt ɪz ðə moʊst ɪˈfɪʃnt ˈælɡərɪðəm əˈveɪləbl/", tip: "Usa siempre el artículo 'the' antes de 'most'." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'My project is more better and has many informations.'",
      explanationConcept: "Doble comparativo e incontables en inglés",
      options: [
        "My project is much better and has much information.",
        "My project is more good and has many information.",
        "My project is more better and have a lot of informations."
      ],
      correctIndex: 0,
      ruleInsight: "'Good' tiene forma comparativa irregular propia ('better', nunca 'more better'). 'Information' es incontable: nunca lleva 's' y se cuantifica con 'much' o 'a lot of', nunca con 'many'."
    },
    step6_mastery: {
      question: "¿Cuál opción compara correctamente dos opciones de biblioteca universitaria?",
      options: [
        "The central library is quieter and more modern than the branch office.",
        "The central library is more quiet and more modern that the branch office.",
        "The central library is most quiet than the branch office."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 2.2 Superado! Dominas la toma de decisiones basada en comparaciones analíticas."
    }
  },
  {
    id: 'a2-lesson-3',
    level: 'A2',
    unit: 2,
    unitTitle: 'Unidad 2 • Comunicación Cotidiana y Relatos',
    code: '2.3',
    title: 'Proyección Futura: Intenciones vs Decisiones Espontáneas',
    subtitle: 'Diferencia "going to" para planes estructurados y "will" para promesas instantáneas',
    academicProject: 'Presentar el cronograma de un proyecto semestral ante la clase.',
    xpReward: 40,
    prerequisiteId: 'a2-lesson-2',
    step1_dialogue: {
      context: 'Planificando las metas de entregables semestrales con el tutor académico.',
      lines: [
        { speaker: 'Professor', en: "David, what are your team's plans for next month's symposium?", es: "David, ¿cuáles son los planes de tu equipo para el simposio del próximo mes?", phonetic: "/wɑːt ɑːr jɔːr tiːmz plænz fɔːr nɛkst mʌnθs sɪmˈpoʊziəm/" },
        { speaker: 'David', en: "We are going to present our findings on renewable energy in November.", es: "Vamos a presentar nuestros hallazgos sobre energía renovable en noviembre.", phonetic: "/wiː ɑːr ˈɡoʊɪŋ tuː prɪˈzɛnt ˈaʊər ˈfaɪndɪŋz ɒn rɪˈnuːəbl ˈɛnərdʒi ɪn noʊˈvɛmbər/" },
        { speaker: 'Professor', en: "That sounds promising. Who will prepare the executive slides?", es: "Eso suena prometedor. ¿Quién preparará las diapositivas ejecutivas?", phonetic: "/ðæt saʊndz ˈprɑːmɪsɪŋ huː wɪl prɪˈpɛər ðiː ɪɡˈzɛkjətɪv slaɪdz/" },
        { speaker: 'David', en: "I will do that tonight! I promise they will look professional.", es: "¡Yo haré eso esta noche! Prometo que se verán profesionales.", phonetic: "/aɪ wɪl duː ðæt təˈnaɪt aɪ ˈprɑːmɪs ðeɪ wɪl lʊk prəˈfɛʃənl/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué David usa 'are going to' para el simposio pero 'will' para las diapositivas?",
      audioContextText: "David plans to present in November (established plan) and decides to make slides tonight (spontaneous decision/promise).",
      options: [
        "Porque 'will' es solo para eventos pasados.",
        "Porque 'going to' expresa un plan ya programado, mientras que 'will' es una decisión espontánea y promesa.",
        "Porque David no sabe cuándo será el evento."
      ],
      correctIndex: 1,
      explanation: "'Going to' se reserva para intenciones y planes premeditados; 'will' para promesas, ofertas y decisiones tomadas en el momento."
    },
    step3_builder: {
      instruction: "Construye la oración de plan futuro estructurado:",
      targetTranslationEs: "Vamos a entregar el primer borrador el viernes por la mañana.",
      correctWords: ["We", "are", "going", "to", "submit", "the", "first", "draft", "on", "Friday."],
      scrambledWords: ["draft", "to", "on", "submit", "going", "are", "We", "Friday.", "will", "the", "first"]
    },
    step4_shadowing: {
      instruction: "Internaliza la reducción fonética natural del futuro:",
      phrases: [
        { levelLabel: "Reducción de Going to", en: "I'm going to finish the project.", phonetic: "/aɪm ˈɡənə ˈfɪnɪʃ ðə ˈprɑːdʒɛkt/", tip: "En habla fluida, 'going to' se reduce naturalmente a 'gonna' /ɡənə/." },
        { levelLabel: "Contracción de Will ('ll)", en: "I'll send the email right away.", phonetic: "/aɪl sɛnd ðiː ˈiːmeɪl raɪt əˈweɪ/", tip: "Pega la punta de la lengua al paladar superior para el sonido /l/ oscuro." },
        { levelLabel: "Predicción con Evidencia", en: "Look at the data, our hypothesis is going to be confirmed.", phonetic: "/lʊk æt ðə ˈdeɪtə ˈaʊər haɪˈpɑːθəsɪs ɪz ˈɡoʊɪŋ tuː biː kənˈfɜːrmd/", tip: "Cuando hay evidencia visual o empírica inmediata, usa 'going to'." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'Wait, I am going to open the door for you, don't worry!'",
      explanationConcept: "Uso de 'will' para ofertas y decisiones instantáneas",
      options: [
        "Wait, I will open the door for you, don't worry!",
        "Wait, I open the door for you, don't worry!",
        "Wait, I am opening the door for you yesterday."
      ],
      correctIndex: 0,
      ruleInsight: "Al reaccionar en el instante para ayudar u ofrecerte a hacer algo, la norma natural es 'I will open...' (o 'I'll open...'), no 'I am going to'."
    },
    step6_mastery: {
      question: "¿Cómo anuncias a la clase el calendario acordado de tu equipo?",
      options: [
        "We are going to conduct the laboratory experiments next Tuesday.",
        "We will to conduct the laboratory experiments next Tuesday.",
        "We conduct will the experiments next Tuesday."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 2.3 Superado! Tienes precisión estratégica para proyectar el futuro en inglés."
    }
  },
  {
    id: 'a2-lesson-4',
    level: 'A2',
    unit: 2,
    unitTitle: 'Unidad 2 • Comunicación Cotidiana y Relatos',
    code: '2.4',
    title: 'Obligaciones Institucionales y Consejos',
    subtitle: 'Comunica normas de laboratorio (must / have to) y sugerencias (should / ought to)',
    academicProject: 'Redactar un cartel de seguridad para un laboratorio con normas obligatorias y recomendaciones.',
    xpReward: 40,
    prerequisiteId: 'a2-lesson-3',
    step1_dialogue: {
      context: 'Inducción de bioseguridad en el laboratorio de química de la facultad.',
      lines: [
        { speaker: 'Safety Officer', en: "Attention students! You must wear protective goggles at all times in this area.", es: "¡Atención estudiantes! Deben usar gafas protectoras en todo momento en esta área.", phonetic: "/juː mʌst wɛər prəˈtɛktɪv ˈɡɑːɡlz æt ɔːl taɪmz ɪn ðɪs ˈɛəriə/" },
        { speaker: 'David', en: "Do we have to wash our hands before touching the biological samples?", es: "¿Tenemos que lavarnos las manos antes de tocar las muestras biológicas?", phonetic: "/duː wiː hæv tuː wɑːʃ ˈaʊər hændz bɪˈfɔːr ˈtʌtʃɪŋ ðə ˌbaɪəˈlɑːdʒɪkl ˈsæmplz/" },
        { speaker: 'Safety Officer', en: "Yes, you do. And you should also take notes in your digital logbook.", es: "Sí, deben hacerlo. Y también deberían tomar notas en su bitácora digital.", phonetic: "/jɛs juː duː ænd juː ʃʊd ˈɔːlsoʊ teɪk noʊts ɪn jɔːr ˈdɪdʒɪtl ˈlɔːɡbʊk/" },
        { speaker: 'David', en: "Understood. We shouldn't bring any food or drinks inside.", es: "Entendido. No deberíamos ingresar alimentos ni bebidas.", phonetic: "/ˌʌndərˈstʊd wiː ʃʊdnt brɪŋ ˈɛni fuːd ɔːr drɪŋks ɪnˈsaɪd/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Cuál es una regla estricta e ineludible en el laboratorio?",
      audioContextText: "Students must wear protective goggles at all times; food and drinks are strictly forbidden.",
      options: [
        "Llevar comida está permitido si tienen prisa.",
        "Es obligatorio llevar gafas protectoras en todo momento.",
        "Tomar notas es la única regla obligatoria."
      ],
      correctIndex: 1,
      explanation: "'Must wear protective goggles' denota una obligación estricta impuesta por la institución."
    },
    step3_builder: {
      instruction: "Arma la recomendación de seguridad institucional:",
      targetTranslationEs: "Deberías revisar el protocolo antes de iniciar el experimento.",
      correctWords: ["You", "should", "review", "the", "protocol", "before", "starting", "the", "experiment."],
      scrambledWords: ["protocol", "the", "review", "should", "experiment.", "You", "before", "starting", "must"]
    },
    step4_shadowing: {
      instruction: "Practica los modales de obligación y consejo:",
      phrases: [
        { levelLabel: "Obligación Estricta (Must)", en: "You must follow all safety procedures.", phonetic: "/juː mʌst ˈfɑːloʊ ɔːl ˈseɪfti prəˈsiːdʒərz/", tip: "Pronuncia 'must' con autoridad firme sin aspirar la 'u'." },
        { levelLabel: "Obligación Externa (Have to)", en: "We have to submit the safety form.", phonetic: "/wiː hæf tuː səbˈmɪt ðə ˈseɪfti fɔːrm/", tip: "En 'have to', la 'v' se asimila a una 'f' sorda: /hæf tuː/." },
        { levelLabel: "Consejo Prudente (Should)", en: "You should double-check your calculations.", phonetic: "/juː ʃʊd ˈdʌbl tʃɛk jɔːr ˌkælkjuˈleɪʃnz/", tip: "La 'l' en 'should' es muda: /ʃʊd/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'You don't have to smoke here, it is forbidden by the university law!'",
      explanationConcept: "Diferencia crítica entre 'mustn't' (prohibición) y 'don't have to' (falta de necesidad)",
      options: [
        "You mustn't smoke here, it is forbidden by the university law!",
        "You don't have to smoke here, because you can do it later.",
        "You should not have to smoke here by the law."
      ],
      correctIndex: 0,
      ruleInsight: "'Don't have to' significa que no es necesario (pero si quieres, puedes hacerlo). Para prohibiciones absolutas por ley o seguridad, la forma correcta e indispensable es 'must not' ('mustn't')."
    },
    step6_mastery: {
      question: "¿Cómo redactarías una advertencia categórica en el laboratorio?",
      options: [
        "All researchers must wear gloves when handling hazardous chemicals.",
        "All researchers should to wear gloves always.",
        "All researchers have wearing gloves."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel A2 Completado con Honores Universitarios! Tienes solidez operativa y comunicativa cotidiana."
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
    title: 'Presente Perfecto: El Puente de tus Logros',
    subtitle: 'Conecta tu trayectoria pasada con tu impacto presente mediante For, Since, Already y Yet',
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
    title: 'Condicionales 1 y 2: Posibilidad e Hipótesis',
    subtitle: 'Navega escenarios reales (If + Present -> Will) e hipotéticos (If + Past -> Would)',
    academicProject: 'Debatir sobre dilemas éticos y proponer soluciones hipotéticas en una mesa redonda.',
    xpReward: 45,
    prerequisiteId: 'b1-lesson-1',
    step1_dialogue: {
      context: 'Mesa redonda sobre financiamiento de energías renovables en la facultad de ingeniería.',
      lines: [
        { speaker: 'Moderator', en: "What will happen if the university cuts the renewable energy budget?", es: "¿Qué pasará si la universidad reduce el presupuesto de energía renovable?", phonetic: "/wɑːt wɪl ˈhæpən ɪf ðə ˌjuːnɪˈvɜːrsəti kʌts ðə rɪˈnuːəbl ˈɛnərdʒi ˈbʌdʒɪt/" },
        { speaker: 'David', en: "If they cut funding, we will lose access to the solar test facility.", es: "Si recortan los fondos, perderemos el acceso a la instalación de pruebas solares.", phonetic: "/ɪf ðeɪ kʌt ˈfʌndɪŋ wiː wɪl luːz ˈæksɛs tuː ðə ˈsoʊlər tɛst fəˈsɪləti/" },
        { speaker: 'Moderator', en: "And if you had an unlimited endowment, what would you build?", es: "¿Y si tuvieras una donación ilimitada, qué construirías?", phonetic: "/ænd ɪf juː hæd ən ʌnˈlɪmɪtɪd ɪnˈdaʊmənt wɑːt wʊd juː bɪld/" },
        { speaker: 'David', en: "If we had unlimited resources, I would design a fully autonomous zero-carbon campus.", es: "Si tuviéramos recursos ilimitados, yo diseñaría un campus autónomo de cero emisiones.", phonetic: "/ɪf wiː hæd ʌnˈlɪmɪtɪd rɪˈsɔːrsɪz aɪ wʊd dɪˈzaɪn ə ˈfʊli ɔːˈtɑːnəməs ˈzɪroʊ ˈkɑːrbən ˈkæmpəs/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Cuál es la diferencia conceptual entre las dos respuestas dadas por David?",
      audioContextText: "First condition is a realistic consequence of budget cuts; second condition is a hypothetical dream scenario with unlimited funds.",
      options: [
        "Ambas respuestas describen hechos que ya ocurrieron el año pasado.",
        "La primera es una causa y efecto real y probable; la segunda es una hipótesis imaginaria (deseo irreal).",
        "David afirma que el campus ya no necesita recursos monetarios."
      ],
      correctIndex: 1,
      explanation: "El Condicional 1 expresa posibilidades reales; el Condicional 2 explora escenarios hipotéticos e imaginarios."
    },
    step3_builder: {
      instruction: "Arma la estructura del segundo condicional (hipotético):",
      targetTranslationEs: "Si tuviera más tiempo libre, estudiaría un segundo idioma extranjero.",
      correctWords: ["If", "I", "had", "more", "free", "time,", "I", "would", "study", "a", "second", "language."],
      scrambledWords: ["language.", "would", "had", "study", "free", "If", "time,", "second", "I", "will", "more", "a"]
    },
    step4_shadowing: {
      instruction: "Entrena el ritmo condicional de hipótesis y causa:",
      phrases: [
        { levelLabel: "Primer Condicional Real", en: "If you analyze the sample, you will see the reaction.", phonetic: "/ɪf juː ˈænəˌlaɪz ðə ˈsæmpl juː wɪl siː ðə riˈækʃn/", tip: "No uses 'will' dentro de la cláusula con 'if'." },
        { levelLabel: "Segundo Condicional Hipotético", en: "If I were the project manager, I would change the timeline.", phonetic: "/ɪf aɪ wɜːr ðə ˈprɑːdʒɛkt ˈmænɪdʒər aɪ wʊd tʃeɪndʒ ðə ˈtaɪmˌlaɪn/", tip: "En registro formal hipotético, se prefiere 'If I were' en lugar de 'If I was'." },
        { levelLabel: "Contracción de Would ('d)", en: "I'd invest in cleaner technologies.", phonetic: "/aɪd ɪnˈvɛst ɪn ˈkliːnər tɛkˈnɑːlədʒiz/", tip: "'I would' se contrae ágilmente a /aɪd/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'If I will have money tomorrow, I would buy that software license.'",
      explanationConcept: "Mezcla errónea de 'will' en la cláusula 'if' y choque de condicionales",
      options: [
        "If I have money tomorrow, I will buy that software license.",
        "If I will have money tomorrow, I will buy that software license.",
        "If I had money tomorrow, I will buy that software license."
      ],
      correctIndex: 0,
      ruleInsight: "Nunca se coloca 'will' dentro de la cláusula condicional introducida por 'if'. La estructura de Condicional 1 es: If + Presente Simple, Sujeto + will + verbo base."
    },
    step6_mastery: {
      question: "¿Cómo plantearías una hipótesis formal en un debate universitario?",
      options: [
        "If governments adopted carbon taxation, corporations would innovate much faster.",
        "If governments will adopt carbon taxation, corporations would innovate.",
        "If governments adopt carbon taxation, corporations would innovated."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 3.2 Superado! Dominas el razonamiento causal y el pensamiento hipotético formal."
    }
  },
  {
    id: 'b1-lesson-3',
    level: 'B1',
    unit: 3,
    unitTitle: 'Unidad 3 • Independencia Lingüística y Procesos Técnicos',
    code: '3.3',
    title: 'Narración Avanzada y Pasado Perfecto',
    subtitle: 'Estructura secuencias cronológicas precisas utilizando Had + Participio Pasado',
    academicProject: 'Redactar un artículo periodístico con estructura de pirámide invertida y suspenso narrativo.',
    xpReward: 45,
    prerequisiteId: 'b1-lesson-2',
    step1_dialogue: {
      context: 'Revisando un incidente técnico ocurrido en los servidores de la universidad.',
      lines: [
        { speaker: 'Auditor', en: "David, what caused the database corruption during yesterday's backup?", es: "David, ¿qué causó la corrupción de la base de datos durante el respaldo de ayer?", phonetic: "/wɑːt kɔːzd ðə ˈdeɪtəˌbeɪs kəˈrʌpʃn ˈdʊrɪŋ ˈjɛstərdeɪz ˈbækˌʌp/" },
        { speaker: 'David', en: "When the power failed, the system had already processed ninety percent of the records.", es: "Cuando se cortó la energía, el sistema ya había procesado el noventa por ciento de los registros.", phonetic: "/wɛn ðə ˈpaʊər feɪld ðə ˈsɪstəm hæd ɔːlˈrɛdi ˈprɑːsɛst ˈnaɪnti pərˈsɛnt əv ðə ˈrɛkərdz/" },
        { speaker: 'Auditor', en: "Had anyone checked the emergency generator before the storm began?", es: "¿Alguien había revisado el generador de emergencia antes de que comenzara la tormenta?", phonetic: "/hæd ˈɛniˌwʌn tʃɛkt ðiː ɪˈmɜːrdʒənsi ˈdʒɛnəˌreɪtər bɪˈfɔːr ðə stɔːrm bɪˈɡæn/" },
        { speaker: 'David', en: "Yes, the technician had inspected it, but a fuse had blown unnoticed.", es: "Sí, el técnico lo había inspeccionado, pero un fusible se había fundido sin que lo notaran.", phonetic: "/jɛs ðə tɛkˈnɪʃn hæd ɪnˈspɛktɪd ɪt bʌt ə fjuːz hæd bloʊn ʌnˈnoʊtɪst/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué evento ocurrió cronológicamente primero según la explicación de David?",
      audioContextText: "The system had processed 90% of records before the power failed.",
      options: [
        "El corte de energía ocurrió antes de cualquier procesamiento.",
        "El sistema procesó el 90% de los datos antes de que fallara la energía.",
        "La tormenta ocurrió semanas después del respaldo."
      ],
      correctIndex: 1,
      explanation: "El Pasado Perfecto ('had already processed') denota una acción anterior a otro evento pasado ('the power failed')."
    },
    step3_builder: {
      instruction: "Ordena los elementos para marcar la anterioridad temporal:",
      targetTranslationEs: "La reunión ya había terminado cuando el director llegó.",
      correctWords: ["The", "meeting", "had", "already", "ended", "when", "the", "director", "arrived."],
      scrambledWords: ["director", "The", "ended", "arrived.", "already", "when", "meeting", "had", "the"]
    },
    step4_shadowing: {
      instruction: "Practica el ritmo del pasado del pasado:",
      phrases: [
        { levelLabel: "Anterioridad Clásica", en: "By the time we arrived, they had left.", phonetic: "/baɪ ðə taɪm wiː əˈraɪvd ðeɪ hæd lɛft/", tip: "Contrasta el pasado simple con el pasado perfecto 'had left'." },
        { levelLabel: "Contracción Natural ('d)", en: "She'd never seen such results before.", phonetic: "/ʃiːd ˈnɛvər siːn sʌtʃ rɪˈzʌlts bɪˈfɔːr/", tip: "'She had' se contrae fonéticamente a /ʃiːd/." },
        { levelLabel: "Causa Previa", en: "He was tired because he had worked all night.", phonetic: "/hiː wəz ˈtaɪərd bɪˈkəz hiː hæd wɜːrkt ɔːl naɪt/", tip: "'Had worked' explica el motivo de un estado previo." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'When I arrived to the airport, the flight already departed.'",
      explanationConcept: "Omisión del Pasado Perfecto para eventos cronológicamente anteriores",
      options: [
        "When I arrived at the airport, the flight had already departed.",
        "When I arrived to the airport, the flight was already departed.",
        "When I was arriving to the airport, the flight has already departed."
      ],
      correctIndex: 0,
      ruleInsight: "Si el vuelo partió antes de tu llegada al aeropuerto, no puedes usar simple pasado para ambos sin confusión; la acción anterior exige 'had already departed'."
    },
    step6_mastery: {
      question: "¿Cómo redactas la secuencia en un artículo periodístico de suspenso?",
      options: [
        "Investigators realized that the suspect had altered the files hours before the inspection.",
        "Investigators realized that the suspect has altered the files before.",
        "Investigators had realized that the suspect alters the files."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 3.3 Conquistado! Ya dominas la arquitectura narrativa cronológica de calibre periodístico."
    }
  },
  {
    id: 'b1-lesson-4',
    level: 'B1',
    unit: 3,
    unitTitle: 'Unidad 3 • Independencia Lingüística y Procesos Técnicos',
    code: '3.4',
    title: 'Descripción de Procesos Técnicos y Cláusulas Relativas',
    subtitle: 'Explica el funcionamiento de inventos con voz pasiva y cláusulas relativas (who, which, that)',
    academicProject: 'Elaborar un manual de instrucciones describiendo el funcionamiento de un invento.',
    xpReward: 45,
    prerequisiteId: 'b1-lesson-3',
    step1_dialogue: {
      context: 'Presentando una patente de purificación de agua automatizada ante el jurado.',
      lines: [
        { speaker: 'Evaluator', en: "David, how is the contaminated water filtered inside this chamber?", es: "David, ¿cómo se filtra el agua contaminada dentro de esta cámara?", phonetic: "/haʊ ɪz ðə kənˈtæmɪneɪtɪd ˈwɔːtər ˈfɪltərd ɪnˈsaɪd ðɪs ˈtʃeɪmbər/" },
        { speaker: 'David', en: "The water is directed through a microscopic membrane which traps ninety-nine percent of microplastics.", es: "El agua es dirigida a través de una membrana microscópica que atrapa el 99% de microplásticos.", phonetic: "/ðə ˈwɔːtər ɪz dəˈrɛktɪd θruː ə ˌmaɪkrəˈskɑːpɪk ˈmɛmbreɪn wɪtʃ træps ˈnaɪnti naɪn pərˈsɛnt əv ˈmaɪkroʊˌplæstɪks/" },
        { speaker: 'Evaluator', en: "And who controls the ultraviolet sterilization cycle?", es: "¿Y quién controla el ciclo de esterilización ultravioleta?", phonetic: "/ænd huː kənˈtroʊlz ðiː ˌʌltrəˈvaɪələt ˌstɛrələˈzeɪʃn ˈsaɪkl/" },
        { speaker: 'David', en: "It is operated by an internal sensor that detects bacteria automatically.", es: "Es operado por un sensor interno que detecta bacterias automáticamente.", phonetic: "/ɪt ɪz ˈɑːpəˌreɪtɪd baɪ ən ɪnˈtɜːrnl ˈsɛnsər ðæt dɪˈtɛkts bækˈtɪəriə ˌɔːtəˈmætɪkli/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué en este contexto técnico se utiliza 'The water is directed' en lugar de un sujeto personal?",
      audioContextText: "In technical descriptions, passive voice emphasizes the process and the object rather than who performs it.",
      options: [
        "Porque el autor desconoce el idioma inglés.",
        "Porque en descripciones técnicas el foco recae en el proceso y el resultado, no en el operador personal.",
        "Porque no hay nadie que opere la máquina."
      ],
      correctIndex: 1,
      explanation: "La voz pasiva técnica es el estándar en ingeniería y ciencia para describir procesos objetivos."
    },
    step3_builder: {
      instruction: "Construye la descripción técnica con cláusula relativa:",
      targetTranslationEs: "Este es el dispositivo que almacena la energía solar capturada.",
      correctWords: ["This", "is", "the", "device", "which", "stores", "the", "captured", "solar", "energy."],
      scrambledWords: ["stores", "energy.", "the", "which", "device", "This", "solar", "is", "captured", "who"]
    },
    step4_shadowing: {
      instruction: "Practica el tono descriptivo e impersonal de la ingeniería:",
      phrases: [
        { levelLabel: "Voz Pasiva de Proceso", en: "The data is transmitted wirelessly to the server.", phonetic: "/ðə ˈdeɪtə ɪz trænzˈmɪtɪd ˈwaɪərləsli tuː ðə ˈsɜːrvər/", tip: "Enlaza 'is transmitted' sin acentuar indebidamente el auxiliar." },
        { levelLabel: "Cláusula Relativa (Cosas)", en: "A filter which removes chemical residues.", phonetic: "/ə ˈfɪltər wɪtʃ rɪˈmuːvz ˈkɛmɪkl ˈrɛzɪduːz/", tip: "Usa 'which' o 'that' para objetos inanimados." },
        { levelLabel: "Cláusula Relativa (Personas)", en: "Engineers who design sustainable hardware.", phonetic: "/ˌɛndʒəˈnɪərz huː dɪˈzaɪn səˈsteɪnəbl ˈhɑːrdwɛər/", tip: "Usa obligatoriamente 'who' cuando te refieres a personas." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'The inventor which created this machine it was awarded a medal.'",
      explanationConcept: "Pronombre relativo incorrecto para personas y doble sujeto pleonástico",
      options: [
        "The inventor who created this machine was awarded a medal.",
        "The inventor which created this machine was awarded a medal.",
        "The inventor that he created this machine was awarded a medal."
      ],
      correctIndex: 0,
      ruleInsight: "Los seres humanos requieren 'who', nunca 'which'. Además, se debe erradicar el pronombre redundante ('it' o 'he') ya que 'The inventor' es el sujeto directo de la oración."
    },
    step6_mastery: {
      question: "¿Cómo describirías un componente en un manual de instrucciones oficial?",
      options: [
        "The heat is dissipated by a ceramic plate that prevents thermal throttling.",
        "The heat dissipates by a plate who prevent thermal throttling.",
        "The heat is dissipate by a ceramic plate which it prevents heat."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel B1 Completado con Honores Universitarios! Tienes plena independencia técnica y académica."
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
    title: 'Debate Formal estilo Oxford y Preguntas Indirectas',
    subtitle: 'Domina las estructuras de énfasis (cleft sentences), matices diplomáticos y cortesía parlamentaria',
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
    title: 'Hipótesis Retrospectiva y Arrepentimiento',
    subtitle: 'Modela escenarios contrafácticos con Tercer Condicional y Condicionales Mixtos',
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
    title: 'Estilo Indirecto y Verbos Introductorios',
    subtitle: 'Sintetiza declaraciones de comités y conferencias con verbos retóricos (concede, allege, dispute)',
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
    title: 'Deducción Lógica Retrospectiva y Matices Semánticos',
    subtitle: 'Formula inferencias analíticas con modales perfectos (must have, can\\'t have, might have)',
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
    title: 'Estilo Académico, Nominalización e Inversión',
    subtitle: 'Convierte el discurso coloquial en prosa científica de vanguardia mediante inversión enfática',
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
    title: 'El Subjuntivo Formal y Estructuras Concesivas',
    subtitle: 'Redacta dictámenes institucionales y maneja el lenguaje cauteloso (hedging)',
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
    title: 'Retórica, Oratoria y Colocaciones Cultas',
    subtitle: 'Cautiva audiencias académicas con recursos retóricos, tricolon y colocaciones de alta densidad',
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
    title: 'Crítica Epistemológica, Hedging y Citación APA/MLA',
    subtitle: 'Modula afirmaciones con lenguaje prudente (hedging) y debate revisiones ciegas por pares',
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
    title: 'Pragmática del Discurso, Ironía y Subtexto Cultural',
    subtitle: 'Decodifica el subtexto no verbal, la ironía diplomática y los sobrentendidos anglosajones',
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
    title: 'Dialectología Global y Comprensión Multiacento Extrema',
    subtitle: 'Navega dialectos internacionales (RP, General American, Australiano, Escocés e Hiberno-English)',
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
    title: 'Redacción de Papers Científicos, Abstracts y Estilística',
    subtitle: 'Escribe artículos con estructura IMRAD para Nature o Science y gestiona cartas de refutación',
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
    title: 'Oratoria Magistral y Defensa de Tesis Doctoral',
    subtitle: 'Defiende tu tesis doctoral frente a un panel examinador hostil con serenidad socrática',
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
`;

fs.writeFileSync(path.join(__dirname, '../web/src/lib/curriculum-data.ts'), curriculumContent, 'utf8');
console.log('Successfully wrote 24 lessons to web/src/lib/curriculum-data.ts!');
