// Full 24-lesson generator for University CEFR A1-C2 Curriculum
const fs = require('fs');
const path = require('path');

const a1Lessons = [
  {
    id: 'a1-lesson-1',
    level: 'A1',
    unit: 1,
    unitTitle: 'Unidad 1 • Fundamentos y Supervivencia (Nivel A1)',
    code: '1.1',
    title: 'Identidad, Origen y Verbo To Be',
    subtitle: 'Preséntate con naturalidad y describe tu origen sin traducir mentalmente',
    xpReward: 35,
    prerequisiteId: null,
    step1_dialogue: {
      context: 'Llegada al Centro de Conferencias Internacional en Covent Garden, Londres.',
      lines: [
        { speaker: 'Receptionist', en: "Hello! Welcome to London. Are you David from Nicaragua?", es: "¡Hola! Bienvenido a Londres. ¿Eres David de Nicaragua?", phonetic: "/həˈloʊ ˈwɛlkəm tuː ˈlʌndən/" },
        { speaker: 'David', en: "Yes, I am. I'm very excited to be here for the workshop.", es: "Sí. Estoy muy emocionado de estar aquí para el taller.", phonetic: "/jɛs aɪ æm aɪm ˈvɛri ɪkˈsaɪtɪd/" },
        { speaker: 'Receptionist', en: "Wonderful. Are you thirty years old or twenty-five?", es: "Maravilloso. ¿Tienes treinta años o veinticinco?", phonetic: "/ɑːr juː ˈθɜːrti jɪərz oʊld/" },
        { speaker: 'David', en: "I'm twenty-five years old. My colleague is thirty.", es: "Tengo veinticinco años. Mi colega tiene treinta.", phonetic: "/aɪm ˈtwɛnti faɪv jɪərz oʊld/" },
        { speaker: 'Receptionist', en: "Perfect. This is your access badge and that is room four-B.", es: "Perfecto. Este es tu gafete de acceso y aquella es la sala 4-B.", phonetic: "/ðɪs ɪz jɔːr ˈækˌsɛs bædʒ/" },
        { speaker: 'David', en: "Thank you so much! Is the room on the second floor?", es: "¡Muchas gracias! ¿La sala está en el segundo piso?", phonetic: "/ɪz ðə ruːm ɒn ðə ˈsɛkənd flɔːr/" }
      ]
    },
    step2_comprehension: {
      prompt: "Según la conversación que acabas de escuchar, ¿cuál es la situación real de David?",
      audioContextText: "David is twenty-five years old and he is from Nicaragua.",
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
        { levelLabel: "Nivel 2 • Enlace Fonético", en: "This is your access badge.", phonetic: "/ðɪs ɪz jɔːr ˈækˌsɛs bædʒ/", tip: "Enlaza 'This is' como /ðɪ-sɪz/. La 's' final se fusiona con la 'i'." },
        { levelLabel: "Nivel 3 • Velocidad Nativa", en: "I'm twenty-five years old and she is thirty.", phonetic: "/aɪm ˈtwɛnti faɪv jɪərz oʊld ænd ʃiː ɪz ˈθɜːrti/", tip: "En 'years old', enlaza la 's' sonora con la vocal: /jɪər-zoʊld/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'I have 25 years and am a student from Spain.'",
      explanationConcept: "El error hispanohablante de posesión vs estado",
      options: [
        "I have 25 years old and I am student from Spain.",
        "I am twenty-five years old and I'm a student from Spain.",
        "I am twenty-five years and am student of Spain."
      ],
      correctIndex: 1,
      ruleInsight: "En inglés nunca se posee la edad con 'have'. Tu edad ES tu estado: 'I am 25 years old'. Además, nunca se omite el sujeto 'I'."
    },
    step6_mastery: {
      question: "Reto de Dominio Final: Elige la presentación más natural para un entorno profesional:",
      options: [
        "Hello! I am Carlos, I'm thirty-two years old and I'm an engineer.",
        "Hello! I have Carlos, I have thirty-two years and a engineer.",
        "Hello! Am Carlos, have thirty-two years and an engineer."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 1.1 Superado con Honores! Has dominado el verbo To Be, el sujeto explícito y los números sin traducción."
    }
  },

  {
    id: 'a1-lesson-2',
    level: 'A1',
    unit: 1,
    unitTitle: 'Unidad 1 • Fundamentos y Supervivencia (Nivel A1)',
    code: '1.2',
    title: 'Artículos (A / An) y Demostrativos',
    subtitle: 'Señala objetos en tu entorno y domina la regla del sonido vocálico',
    xpReward: 35,
    prerequisiteId: 'a1-lesson-1',
    step1_dialogue: {
      context: 'Organizando el escritorio de trabajo con un colega de equipo.',
      lines: [
        { speaker: 'Elena', en: "Look at this desk! Is that your laptop over there?", es: "¡Mira este escritorio! ¿Aquella es tu laptop allá?", phonetic: "/lʊk æt ðɪs dɛsk/" },
        { speaker: 'David', en: "No, that is an office computer. This is my laptop right here.", es: "No, aquella es una computadora de oficina. Esta es mi laptop aquí.", phonetic: "/ðæt ɪz ən ˈɔːfɪs kəmˈpjuːtər/" },
        { speaker: 'Elena', en: "Are these your notebooks and those your pens?", es: "¿Estos son tus cuadernos y aquellos son tus bolígrafos?", phonetic: "/ɑːr ðiːz jɔːr ˈnoʊtˌbʊks/" },
        { speaker: 'David', en: "Yes, these are mine. And here is an apple and a sandwich for lunch.", es: "Sí, estos son míos. Y aquí hay una manzana y un sándwich para el almuerzo.", phonetic: "/ən ˈæpəl ænd ə ˈsændwɪtʃ/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué se utiliza 'an apple' pero 'a laptop'?",
      audioContextText: "This is a laptop and here is an apple.",
      options: [
        "Porque 'apple' empieza con sonido vocálico y 'laptop' con sonido consonántico.",
        "Porque 'apple' es femenino en español.",
        "Es una preferencia estilística arbitraria."
      ],
      correctIndex: 0,
      explanation: "¡Exacto! La regla de A/An depende exclusivamente del sonido inicial, no de la letra escrita."
    },
    step3_builder: {
      instruction: "Construye la frase correcta en inglés:",
      targetTranslationEs: "Esta es una manzana y aquella es una universidad.",
      correctWords: ["This", "is", "an", "apple", "and", "that", "is", "a", "university."],
      scrambledWords: ["apple", "that", "a", "This", "an", "university.", "is", "is", "and", "the"]
    },
    step4_shadowing: {
      instruction: "Entrena los demostrativos singulares y plurales:",
      phrases: [
        { levelLabel: "Demostrativo Singular Próximo", en: "This is my laptop right here.", phonetic: "/ðɪs ɪz maɪ ˈlæpˌtɑːp raɪt hɪər/", tip: "Pronuncia 'th' interdental suave poniendo la lengua entre los dientes." },
        { levelLabel: "Demostrativo Singular Lejano", en: "That is an office computer.", phonetic: "/ðæt ɪz ən ˈɔːfɪs kəmˈpjuːtər/", tip: "Enlaza 'That is an' como /ðæ-tɪ-zən/." },
        { levelLabel: "Demostrativos Plurales", en: "These are mine and those are yours.", phonetic: "/ðiːz ɑːr maɪn ænd ðoʊz ɑːr jɔːrz/", tip: "'These' tiene sonido /iː/ largo y 'those' sonido /oʊ/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'This is an university and that is a hour.'",
      explanationConcept: "La trampa de grafía vs fonética en A / An",
      options: [
        "This is an university and that is an hour.",
        "This is a university and that is an hour.",
        "This is a university and that is a hour."
      ],
      correctIndex: 1,
      ruleInsight: "'University' comienza con sonido consonántico /juː/ (requiere 'a'), mientras que 'hour' tiene 'h' muda y empieza con sonido vocálico /aʊər/ (requiere 'an')."
    },
    step6_mastery: {
      question: "¿Cuál opción señala objetos de forma gramaticalmente perfecta?",
      options: [
        "These are my books and that is an umbrella.",
        "This are my books and that is a umbrella.",
        "Those is my books and this is an umbrella."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 1.2 Conquistado! Distingues sonido consonántico de vocálico y manejas demostrativos a la perfección."
    }
  },

  {
    id: 'a1-lesson-3',
    level: 'A1',
    unit: 1,
    unitTitle: 'Unidad 1 • Fundamentos y Supervivencia (Nivel A1)',
    code: '1.3',
    title: 'Rutinas, Hábitos y Tercera Persona (Do / Does)',
    subtitle: 'Comunica tu día a día y domina el auxiliar Do / Does sin confusión',
    xpReward: 40,
    prerequisiteId: 'a1-lesson-2',
    step1_dialogue: {
      context: 'Conversación matutina sobre horarios y rutinas de trabajo en la oficina.',
      lines: [
        { speaker: 'Sara', en: "What time do you usually start work, David?", es: "¿A qué hora comienzas a trabajar usualmente, David?", phonetic: "/wɑːt taɪm duː juː ˈjuːʒuəli stɑːrt wɜːrk/" },
        { speaker: 'David', en: "I always wake up at six and I arrive at the office at eight.", es: "Siempre me despierto a las seis y llego a la oficina a las ocho.", phonetic: "/aɪ ˈɔːlweɪz weɪk ʌp æt sɪks/" },
        { speaker: 'Sara', en: "Does your manager work on weekends too?", es: "¿Tu gerente trabaja los fines de semana también?", phonetic: "/dʌz jɔːr ˈmænɪdʒər wɜːrk ɒn ˈwiːkˌɛndz tuː/" },
        { speaker: 'David', en: "No, he doesn't. He spends time with his family on Sundays.", es: "No. Él pasa tiempo con su familia los domingos.", phonetic: "/noʊ hiː ˈdʌznt hiː spɛndz taɪm/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué hace el gerente de David los fines de semana?",
      audioContextText: "He doesn't work on weekends. He spends time with his family.",
      options: [
        "Trabaja en la oficina los sábados y domingos.",
        "No trabaja en fines de semana; comparte tiempo con su familia.",
        "Viaja al extranjero los domingos."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! 'He doesn't work' confirma que no labora los fines de semana."
    },
    step3_builder: {
      instruction: "Construye la afirmación en tercera persona singular:",
      targetTranslationEs: "Ella trabaja en un hospital y vive en Londres.",
      correctWords: ["She", "works", "in", "a", "hospital", "and", "lives", "in", "London."],
      scrambledWords: ["works", "hospital", "London.", "She", "in", "and", "lives", "work", "in", "a"]
    },
    step4_shadowing: {
      instruction: "Entrena el ritmo del presente simple y la 's' final:",
      phrases: [
        { levelLabel: "Primera Persona", en: "I always wake up early.", phonetic: "/aɪ ˈɔːlweɪz weɪk ʌp ˈɜːrli/", tip: "Enlaza 'wake up' como /weɪ-kʌp/." },
        { levelLabel: "Tercera Persona Singular", en: "He works in an engineering lab.", phonetic: "/hiː wɜːrks ɪn ən ˌɛndʒɪˈnɪərɪŋ læb/", tip: "Haz sonora la 's' final en /wɜːrks/." },
        { levelLabel: "Pregunta con Does", en: "Does she speak English every day?", phonetic: "/dʌz ʃiː spiːk ˈɪŋɡlɪʃ ˈɛvri deɪ/", tip: "Recuerda que con 'Does', 'speak' no lleva 's'." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'Does she works at the university? Yes, she work there.'",
      explanationConcept: "El error de doble marcación de 's' con auxiliar does",
      options: [
        "Does she work at the university? Yes, she works there.",
        "Does she works at the university? Yes, she work there.",
        "Is she work at the university? Yes, she works there."
      ],
      correctIndex: 0,
      ruleInsight: "En preguntas, el auxiliar 'Does' ya absorbe la tercera persona; el verbo principal va en forma base ('Does she work?'). En respuestas afirmativas el verbo sí lleva 's' ('she works')."
    },
    step6_mastery: {
      question: "Reto Final de Rutinas: ¿Cuál pregunta es 100% natural y gramatical?",
      options: [
        "Does your colleague attend the conference every year?",
        "Do your colleague attends the conference every year?",
        "Is your colleague attend the conference every year?"
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 1.3 Superado! Has interiorizado el Presente Simple sin titubear."
    }
  },

  {
    id: 'a1-lesson-4',
    level: 'A1',
    unit: 1,
    unitTitle: 'Unidad 1 • Fundamentos y Supervivencia (Nivel A1)',
    code: '1.4',
    title: 'Espacios, Existencia y Modales (There is / are, Can)',
    subtitle: 'Ubica instalaciones en el campus, pide indicaciones y consulta disponibilidad',
    xpReward: 40,
    prerequisiteId: 'a1-lesson-3',
    step1_dialogue: {
      context: 'En el vestíbulo central buscando el auditorio y la biblioteca.',
      lines: [
        { speaker: 'Student', en: "Excuse me! Is there a computer lab on this floor?", es: "¡Disculpe! ¿Hay un laboratorio de cómputo en este piso?", phonetic: "/ɪz ðɛər ə kəmˈpjuːtər læb/" },
        { speaker: 'Guide', en: "Yes, there is one next to the library. There are twenty PCs inside.", es: "Sí, hay uno al lado de la biblioteca. Hay 20 computadoras adentro.", phonetic: "/jɛs ðɛər ɪz wʌn nɛkst tuː/" },
        { speaker: 'Student', en: "Can I print my research assignment there?", es: "¿Puedo imprimir mi tarea de investigación allí?", phonetic: "/kæn aɪ prɪnt maɪ rɪˈsɜːrtʃ əˈsaɪnmənt/" },
        { speaker: 'Guide', en: "Yes, you can! And there are some study desks available too.", es: "¡Sí, puedes! Y hay algunos escritorios de estudio disponibles también.", phonetic: "/jɛs juː kæn ænd ðɛər ɑːr sʌm/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué recursos se confirman en el laboratorio según la guía?",
      audioContextText: "There are twenty PCs and there are some study desks available.",
      options: [
        "No hay computadoras disponibles hoy.",
        "Hay 20 computadoras y algunos escritorios de estudio disponibles.",
        "Solo los profesores pueden imprimir allí."
      ],
      correctIndex: 1,
      explanation: "¡Excelente! 'There are twenty PCs' y 'some study desks available' confirman ambos recursos."
    },
    step3_builder: {
      instruction: "Construye la oración afirmativa de existencia en plural:",
      targetTranslationEs: "Hay dos bibliotecas en el campus universitario.",
      correctWords: ["There", "are", "two", "libraries", "on", "the", "university", "campus."],
      scrambledWords: ["libraries", "campus.", "is", "There", "two", "the", "are", "university", "on", "have"]
    },
    step4_shadowing: {
      instruction: "Entrena 'There is / There are' y el modal 'Can':",
      phrases: [
        { levelLabel: "Existencia Singular", en: "There is a cafeteria on the ground floor.", phonetic: "/ðɛər ɪz ə ˌkæfəˈtɪəriə ɒn ðə ɡraʊnd flɔːr/", tip: "Enlaza 'There is a' /ðɛə-rɪ-zə/ de forma fluida." },
        { levelLabel: "Existencia Plural", en: "There are many books in the library.", phonetic: "/ðɛər ɑːr ˈmɛni bʊks ɪn ðə ˈlaɪbrəri/", tip: "Usa 'There are' con sustantivos plurales." },
        { levelLabel: "Permiso con Can", en: "Can I enter the auditorium now?", phonetic: "/kæn aɪ ˈɛntər ðiː ˌɔːdɪˈtɔːriəm naʊ/", tip: "Enlaza 'Can I' como /kæ-naɪ/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'In the campus have many students and has a cafeteria.'",
      explanationConcept: "El error hispanohablante de usar 'have' para 'hay'",
      options: [
        "On the campus there are many students and there is a cafeteria.",
        "In the campus have many students and has a cafeteria.",
        "At the campus are having many students and is having a cafeteria."
      ],
      correctIndex: 0,
      ruleInsight: "En inglés nunca se usa el verbo 'have/has' para expresar existencia ('haber'). La única forma correcta es 'There is' (singular) y 'There are' (plural)."
    },
    step6_mastery: {
      question: "¿Cuál opción consulta la existencia de un cajero automático correctamente?",
      options: [
        "Is there an ATM machine near the entrance?",
        "Has an ATM machine near the entrance?",
        "Are there an ATM machine near the entrance?"
      ],
      correctIndex: 0,
      successMessage: "¡Nivel A1 Universitario Completado con Honores! Dominas los 4 módulos esenciales de fundamentos y supervivencia."
    }
  }
];

const a2Lessons = [
  {
    id: 'a2-lesson-1',
    level: 'A2',
    unit: 2,
    unitTitle: 'Unidad 2 • Comunicación Cotidiana (Nivel A2)',
    code: '2.1',
    title: 'Presente Continuo vs Presente Simple',
    subtitle: 'Contrasta lo que ocurre en este instante frente a tu rutina permanente',
    xpReward: 45,
    prerequisiteId: 'a1-lesson-4',
    step1_dialogue: {
      context: 'Llamada telefónica mientras ocurre un imprevisto en la carretera.',
      lines: [
        { speaker: 'Alex', en: "Hey Mark! Are you at the office already?", es: "¡Hola Mark! ¿Ya estás en la oficina?", phonetic: "/ɑːr juː æt ði ˈɔːfɪs/" },
        { speaker: 'Mark', en: "I usually drive to work, but today I'm taking the bus.", es: "Normalmente manejo al trabajo, pero hoy tomo el autobús.", phonetic: "/təˈdeɪ aɪm ˈteɪkɪŋ ðə bʌs/" },
        { speaker: 'Alex', en: "Why? Is your car broken?", es: "¿Por qué? ¿Tu auto está descompuesto?", phonetic: "/waɪ ɪz jɔːr kɑːr ˈbroʊkən/" },
        { speaker: 'Mark', en: "Yes! The mechanic is fixing it right now.", es: "¡Sí! El mecánico lo está reparando ahora mismo.", phonetic: "/ðə məˈkænɪk ɪz ˈfɪksɪŋ ɪt/" },
        { speaker: 'Alex', en: "I understand. I am preparing the meeting room while you arrive.", es: "Entiendo. Estoy preparando la sala de juntas mientras llegas.", phonetic: "/aɪ æm prɪˈpɛərɪŋ/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué Mark está tomando el autobús hoy?",
      audioContextText: "I usually drive to work, but today the mechanic is fixing my car.",
      options: [
        "Porque siempre toma el autobús los lunes.",
        "Porque su mecánico está reparando su auto en este momento.",
        "Porque vendió su vehículo ayer."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! 'Today I am taking the bus' contrasta con su rutina permanente ('I usually drive')."
    },
    step3_builder: {
      instruction: "Construye la oración contrastando rutina y acción temporal:",
      targetTranslationEs: "Normalmente tomo café, pero hoy estoy bebiendo té.",
      correctWords: ["I", "usually", "drink", "coffee,", "but", "today", "I", "am", "drinking", "tea."],
      scrambledWords: ["drinking", "drink", "I", "tea.", "usually", "coffee,", "am", "today", "but", "I"]
    },
    step4_shadowing: {
      instruction: "Entrena la terminación '-ing' sin acentuar la 'g':",
      phrases: [
        { levelLabel: "Rutina Permanente", en: "I work from home every Friday.", phonetic: "/aɪ wɜːrk frəm hoʊm ˈɛvri ˈfraɪdeɪ/", tip: "Presente simple para hábitos fijos." },
        { levelLabel: "Acción en Progreso", en: "The engineer is debugging the script.", phonetic: "/ðiː ˌɛndʒɪˈnɪər ɪz diːˈbʌɡɪŋ ðə skrɪpt/", tip: "Pronuncia '-ing' como sonido nasal /ɪŋ/ sin 'g' dura." },
        { levelLabel: "Contraste Situacional", en: "She usually walks, but now she is running.", phonetic: "/ʃiː ˈjuːʒuəli wɔːks bʌt naʊ ʃiː ɪz ˈrʌnɪŋ/", tip: "Acentúa el contraste entre 'walks' y 'running'." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'Listen! The professor speaks to the students right now.'",
      explanationConcept: "Confundir acción momentánea con rutina permanente",
      options: [
        "Listen! The professor is speaking to the students right now.",
        "Listen! The professor speaks to the students right now.",
        "Listen! The professor are speaking to the students right now."
      ],
      correctIndex: 0,
      ruleInsight: "Con marcadores de inmediatez ('Listen!', 'Look!', 'right now', 'at this moment'), se DEBE usar Presente Continuo (is speaking)."
    },
    step6_mastery: {
      question: "¿Cuál opción describe con exactitud lo que sucede en este instante?",
      options: [
        "Look outside! It is snowing heavily over the campus.",
        "Look outside! It snows heavily over the campus.",
        "Look outside! It is snow heavily over the campus."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 2.1 Superado! Distingues acciones temporales en progreso de rutinas permanentes."
    }
  },

  {
    id: 'a2-lesson-2',
    level: 'A2',
    unit: 2,
    unitTitle: 'Unidad 2 • Comunicación Cotidiana (Nivel A2)',
    code: '2.2',
    title: 'Relatos del Pasado y Biografías Científicas (Past Simple)',
    subtitle: 'Narra anécdotas concluidas y domina los verbos regulares e irregulares',
    xpReward: 45,
    prerequisiteId: 'a2-lesson-1',
    step1_dialogue: {
      context: 'Presentación académica sobre los logros de pioneros de la ciencia.',
      lines: [
        { speaker: 'Professor', en: "Where did Marie Curie conduct her pioneering research on radioactivity?", es: "¿Dónde llevó a cabo Marie Curie su investigación pionera sobre la radiactividad?", phonetic: "/wɛər dɪd məˈriː ˈkjʊəri kənˈdʌkt/" },
        { speaker: 'Student', en: "She worked in Paris. In 1903, she won her first Nobel Prize in Physics.", es: "Ella trabajó en París. En 1903, ganó su primer Premio Nobel de Física.", phonetic: "/ʃiː wɜːrkt ɪn ˈpærɪs ʃiː wʌn hɜːr fɜːrst/" },
        { speaker: 'Professor', en: "Did she discover radium alone or with her husband?", es: "¿Descubrió el radio sola o con su esposo?", phonetic: "/dɪd ʃiː dɪˈskʌvər ˈreɪdiəm əˈloʊn/" },
        { speaker: 'Student', en: "They discovered it together and published their findings in France.", es: "Lo descubrieron juntos y publicaron sus hallazgos en Francia.", phonetic: "/ðeɪ dɪˈskʌvərd ɪt təˈɡɛðər ænd ˈpʌblɪʃt/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué ocurrió en el año 1903 según el diálogo histórico?",
      audioContextText: "In 1903, she won her first Nobel Prize in Physics.",
      options: [
        "Marie Curie llegó a París por primera vez.",
        "Marie Curie ganó su primer Premio Nobel de Física.",
        "Marie Curie canceló su investigación."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! 'Won' es el pasado simple irregular del verbo 'win'."
    },
    step3_builder: {
      instruction: "Construye la afirmación en pasado simple con fecha cerrada:",
      targetTranslationEs: "Ella ganó el premio y publicó su investigación el año pasado.",
      correctWords: ["She", "won", "the", "award", "and", "published", "her", "research", "last", "year."],
      scrambledWords: ["award", "last", "published", "She", "won", "research", "year.", "and", "the", "her"]
    },
    step4_shadowing: {
      instruction: "Practica las 3 pronunciaciones de la terminación regular '-ed':",
      phrases: [
        { levelLabel: "Sonido /t/ (Sordo)", en: "She worked late at the laboratory.", phonetic: "/ʃiː wɜːrkt leɪt æt ðə ləˈbɒrətri/", tip: "Tras sonido 'k', '-ed' suena como /t/ nítido (worked)." },
        { levelLabel: "Sonido /d/ (Sonoro)", en: "They discovered a new compound.", phonetic: "/ðeɪ dɪˈskʌvərd ə njuː ˈkɑːmpaʊnd/", tip: "Tras vocal o consonante sonora, '-ed' suena como /d/ suave." },
        { levelLabel: "Sonido /ɪd/ (Nueva Sílaba)", en: "We started the simulation at dawn.", phonetic: "/wiː ˈstɑːrtɪd ðə ˌsɪmjuˈleɪʃn æt dɔːn/", tip: "Solo tras sonido 't' o 'd' se pronuncia sílaba extra /ɪd/ (started, needed)." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'Did you went to the university yesterday? Yes, I didn't went.'",
      explanationConcept: "Uso incorrecto de pasado con el auxiliar did",
      options: [
        "Did you go to the university yesterday? No, I didn't go.",
        "Did you went to the university yesterday? No, I didn't went.",
        "Were you go to the university yesterday? No, I didn't gone."
      ],
      correctIndex: 0,
      ruleInsight: "El auxiliar 'Did' o 'Didn't' ya porta el tiempo pasado; el verbo principal DEBE volver a su forma base pura: 'Did you go?' y 'I didn't go'."
    },
    step6_mastery: {
      question: "¿Cuál oración biográfica expresa un hito en pasado de forma impecable?",
      options: [
        "The team conducted the clinical trial and published the report in 2021.",
        "The team did conducted the clinical trial and publish the report in 2021.",
        "The team conducted the clinical trial and publish the report last year."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 2.2 Superado! Relatas anécdotas e hitos históricos con dominio fonético del pasado."
    }
  },

  {
    id: 'a2-lesson-3',
    level: 'A2',
    unit: 2,
    unitTitle: 'Unidad 2 • Comunicación Cotidiana (Nivel A2)',
    code: '2.3',
    title: 'Comparativos, Superlativos y Cuantificadores',
    subtitle: 'Evalúa especificaciones técnicas y defiende opciones con datos cuantitativos',
    xpReward: 45,
    prerequisiteId: 'a2-lesson-2',
    step1_dialogue: {
      context: 'Evaluación técnica entre dos servidores para el centro de cómputo.',
      lines: [
        { speaker: 'Architect', en: "Which cloud instance is more suitable for our data processing?", es: "¿Cuál instancia en la nube es más adecuada para nuestro procesamiento de datos?", phonetic: "/wɪtʃ klaʊd ˈɪnstəns ɪz mɔːr ˈsuːtəbl/" },
        { speaker: 'Engineer', en: "Server Alpha is much faster than Beta, but it is as expensive as a mainframe.", es: "El servidor Alfa es mucho más rápido que Beta, pero es tan costoso como un mainframe.", phonetic: "/ˈsɜːrvər ˈælfə ɪz mʌtʃ ˈfæstər ðæn/" },
        { speaker: 'Architect', en: "Does Beta have enough memory for our workload?", es: "¿Beta tiene suficiente memoria para nuestra carga de trabajo?", phonetic: "/dʌz ˈbeɪtə hæv ɪˈnʌf ˈmɛməri/" },
        { speaker: 'Engineer', en: "Beta has fewer cores, but it has the highest reliability in the market.", es: "Beta tiene menos núcleos, pero tiene la confiabilidad más alta del mercado.", phonetic: "/ˈbeɪtə hæz ˈfjuːər kɔːrz bʌt ɪt hæz ðə ˈhaɪɪst/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Cuál es la principal ventaja de Server Beta según el ingeniero?",
      audioContextText: "Beta has fewer cores, but it has the highest reliability in the market.",
      options: [
        "Es el servidor más barato de todos.",
        "Tiene la confiabilidad más alta ('highest reliability') del mercado.",
        "Tiene más núcleos de procesamiento que Server Alpha."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! 'The highest reliability' es el superlativo absoluto que destaca a Beta."
    },
    step3_builder: {
      instruction: "Construye una comparación de igualdad tecnológica:",
      targetTranslationEs: "Este procesador es tan eficiente como el nuevo modelo.",
      correctWords: ["This", "processor", "is", "as", "efficient", "as", "the", "new", "model."],
      scrambledWords: ["efficient", "model.", "as", "is", "This", "processor", "the", "new", "more", "as"]
    },
    step4_shadowing: {
      instruction: "Entrena comparativos de superioridad y cuantificadores:",
      phrases: [
        { levelLabel: "Comparativo Corto (-er than)", en: "This algorithm is faster than the old script.", phonetic: "/ðɪs ˈælɡəˌrɪðəm ɪz ˈfæstər ðæn ðiː oʊld skrɪpt/", tip: "Enlaza 'faster than' como /fæstər-ðən/." },
        { levelLabel: "Comparativo Largo (more than)", en: "Our solution is more scalable than competitors.", phonetic: "/ˈaʊər səˈluːʃn ɪz mɔːr ˈskeɪləbl ðæn/", tip: "Usa 'more' con adjetivos de 3 o más sílabas." },
        { levelLabel: "Cuantificador Preciso", en: "We have only a few minutes left.", phonetic: "/wiː hæv ˈoʊnli ə fjuː ˈmɪnɪts lɛft/", tip: "'A few' con sustantivos contables (minutes, cores)." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'This software is more better and more cheap than the other.'",
      explanationConcept: "Doble comparativo y regla de adjetivos cortos",
      options: [
        "This software is much better and cheaper than the other.",
        "This software is more better and more cheap than the other.",
        "This software is most better and more cheaper than the other."
      ],
      correctIndex: 0,
      ruleInsight: "Nunca uses 'more' con comparativos irregulares ('better', nunca 'more better' ❌) ni con adjetivos monosílabos ('cheaper', nunca 'more cheap' ❌)."
    },
    step6_mastery: {
      question: "¿Cuál opción compara dos soluciones con absoluta precisión cuantitativa?",
      options: [
        "Model A is significantly faster than Model B, but it consumes a little more power.",
        "Model A is more faster than Model B, but it consumes much powers.",
        "Model A is as fast than Model B, but it consumes few power."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel 2.3 Superado! Comparas alternativas técnicas con rigor cuantitativo."
    }
  },

  {
    id: 'a2-lesson-4',
    level: 'A2',
    unit: 2,
    unitTitle: 'Unidad 2 • Comunicación Cotidiana (Nivel A2)',
    code: '2.4',
    title: 'Planes Futuros, Predicciones y Obligaciones (Going to, Will, Must)',
    subtitle: 'Presenta cronogramas, haz previsiones y comunica normas del campus',
    xpReward: 50,
    prerequisiteId: 'a2-lesson-3',
    step1_dialogue: {
      context: 'Planificación de la jornada de puertas abiertas y normas de seguridad.',
      lines: [
        { speaker: 'Coordinator', en: "What are your plans for the open house tomorrow morning?", es: "¿Cuáles son tus planes para la jornada de puertas abiertas mañana por la mañana?", phonetic: "/wɑːt ɑːr jɔːr plænz fɔːr ðiː ˈoʊpən haʊs/" },
        { speaker: 'Assistant', en: "We are going to welcome the international students at nine o'clock.", es: "Vamos a dar la bienvenida a los estudiantes internacionales a las nueve en punto.", phonetic: "/wiː ɑːr ˈɡoʊɪŋ tuː ˈwɛlkəm/" },
        { speaker: 'Coordinator', en: "It looks cloudy outside. Do you think it will rain?", es: "Parece nublado afuera. ¿Crees que lloverá?", phonetic: "/duː juː θɪŋk ɪt wɪl reɪn/" },
        { speaker: 'Assistant', en: "Probably! All visitors must wear visitors' badges and should carry an umbrella.", es: "¡Probablemente! Todos los visitantes deben portar su gafete y deberían llevar paraguas.", phonetic: "/ɔːl ˈvɪzɪtərz mʌst wɛər/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué diferencia comunicativa hay entre 'We are going to welcome' y 'it will rain'?",
      audioContextText: "We are going to welcome the students (plan). Do you think it will rain (prediction)?",
      options: [
        "Ambas frases expresan eventos que ocurrieron la semana pasada.",
        "'Going to' expresa un plan deliberado previo, mientras que 'will' formula una predicción incierta sobre el clima.",
        "'Will' es obligatorio para eventos antes del mediodía."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! 'Going to' se reserva para intenciones premeditadas y 'will' para predicciones y decisiones espontáneas."
    },
    step3_builder: {
      instruction: "Construye la regla institucional con el modal categórico 'must':",
      targetTranslationEs: "Los estudiantes deben usar gafas de seguridad en el laboratorio.",
      correctWords: ["Students", "must", "wear", "safety", "goggles", "in", "the", "laboratory."],
      scrambledWords: ["wear", "safety", "laboratory.", "goggles", "must", "Students", "should", "in", "the", "to"]
    },
    step4_shadowing: {
      instruction: "Entrena la reducción de 'going to' y los modales 'must' y 'should':",
      phrases: [
        { levelLabel: "Intención Planificada", en: "We are going to submit the project on Friday.", phonetic: "/wiː ɑːr ˈɡoʊɪŋ tuː səbˈmɪt ðə ˈprɒdʒɛkt/", tip: "En registro formal mantén 'going to' con claridad sin reducirlo a 'gonna'." },
        { levelLabel: "Obligación Categórica", en: "You must sanitize your hands before entering.", phonetic: "/juː mʌst ˈsænɪˌtaɪz jɔːr hændz bɪˈfɔːr ˈɛntərɪŋ/", tip: "No pronuncies 'to' después de 'must' ('must sanitize', no 'must to')." },
        { levelLabel: "Consejo Constructivo", en: "You should review the lecture recordings.", phonetic: "/juː ʃʊd rɪˈvjuː ðə ˈlɛktʃər rɪˈkɔːrdɪŋz/", tip: "La 'l' en 'should' es totalmente muda: /ʃʊd/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'You don't have to enter the sterile room! It is strictly prohibited!'",
      explanationConcept: "Confusión entre falta de necesidad y prohibición absoluta",
      options: [
        "You must not enter the sterile room! It is strictly prohibited!",
        "You don't have to enter the sterile room! It is strictly prohibited!",
        "You shouldn't to enter the sterile room! It is strictly prohibited!"
      ],
      correctIndex: 0,
      ruleInsight: "'Don't have to' significa que no es necesario (opcional). Cuando algo está estrictamente prohibido, la única forma legítima es 'must not' o 'mustn't'."
    },
    step6_mastery: {
      question: "¿Cuál opción presenta un plan académico formal y una norma institucional impecable?",
      options: [
        "We are going to present our findings tomorrow, and all participants must arrive on time.",
        "We will to present our findings tomorrow, and all participants must to arrive on time.",
        "We are going present our findings tomorrow, and all participants don't have to arrive late."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel A2 Universitario Conquistado! Dominas la proyección futura, predicciones y la comunicación reglamentaria."
    }
  }
];

const b1Lessons = [
  {
    id: 'b1-lesson-1',
    level: 'B1',
    unit: 3,
    unitTitle: 'Unidad 3 • Independencia Lingüística (Nivel B1)',
    code: '3.1',
    title: 'Presente Perfecto: El Puente de tus Logros',
    subtitle: 'Conecta tu trayectoria acumulada con el presente sin fecha de caducidad',
    xpReward: 50,
    prerequisiteId: 'a2-lesson-4',
    step1_dialogue: {
      context: 'Entrevista ejecutiva para liderar un equipo de ingeniería internacional.',
      lines: [
        { speaker: 'VP', en: "Have you ever managed a remote engineering team across different timezones?", es: "¿Alguna vez has gestionado un equipo de ingeniería remoto en diferentes husos horarios?", phonetic: "/hæv juː ˈɛvər ˈmænɪdʒd/" },
        { speaker: 'Candidate', en: "Yes, I have led international squads since 2021.", es: "Sí, he liderado escuadras internacionales desde 2021.", phonetic: "/aɪ hæv lɛd ˌɪntərˈnæʃənl skwɑːdz/" },
        { speaker: 'VP', en: "Impressive! Have you already deployed Kubernetes in production?", es: "¡Impresionante! ¿Ya has desplegado Kubernetes en producción?", phonetic: "/hæv juː ɔːlˈrɛdi dɪˈplɔɪd/" },
        { speaker: 'Candidate', en: "We haven't migrated everything yet, but we have just completed phase one.", es: "No hemos migrado todo todavía, pero acabamos de completar la fase uno.", phonetic: "/wiː hævənt ˈmaɪɡreɪtɪd jɛt/" },
        { speaker: 'VP', en: "Outstanding. You have demonstrated solid architectural leadership.", es: "Sobresaliente. Has demostrado un sólido liderazgo arquitectónico.", phonetic: "/juː hæv ˈdɛmənstreɪtɪd/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Cuál es el estado actual de la migración del candidato?",
      audioContextText: "We haven't migrated everything yet, but we have just completed phase one.",
      options: [
        "Completaron todo el proyecto el año pasado en 2020.",
        "No han terminado todo aún, pero acaban de culminar la primera fase.",
        "Decidieron cancelar la migración a Kubernetes."
      ],
      correctIndex: 1,
      explanation: "¡Brillante! 'Just completed' significa 'acaban de terminar' y 'yet' al final de la negativa marca que sigue abierto."
    },
    step3_builder: {
      instruction: "Construye la frase con marcadores de tiempo abierto:",
      targetTranslationEs: "He vivido aquí durante cinco años y acabo de comprar una casa.",
      correctWords: ["I", "have", "lived", "here", "for", "five", "years", "and", "just", "bought", "a", "home."],
      scrambledWords: ["lived", "for", "home.", "I", "years", "bought", "here", "just", "have", "five", "and", "a"]
    },
    step4_shadowing: {
      instruction: "Entrena las contracciones nativas del Presente Perfecto:",
      phrases: [
        { levelLabel: "Experiencia Vital", en: "I've visited London three times in my life.", phonetic: "/aɪv ˈvɪzɪtɪd ˈlʌndən θriː taɪmz/", tip: "Contrae 'I have' a 'I've' /aɪv/ de un solo golpe vocálico." },
        { levelLabel: "Acción Reciente", en: "We have just finished the deployment.", phonetic: "/wiː hæv dʒʌst ˈfɪnɪʃt ðə dɪˈplɔɪmənt/", tip: "'Just' /dʒʌst/ indica inmediatez inmediata." },
        { levelLabel: "Negativa con Yet", en: "They haven't signed the final agreement yet.", phonetic: "/ðeɪ ˈhævənt saɪnd ðə ˈfaɪnl əˈɡriːmənt jɛt/", tip: "'Yet' al final con tono interrogativo o conclusivo." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'I have seen him yesterday at the conference.'",
      explanationConcept: "Conflicto mortal: tiempo cerrado ('yesterday') vs tiempo abierto",
      options: [
        "I saw him yesterday at the conference.",
        "I have saw him yesterday at the conference.",
        "I had seen him yesterday at the conference."
      ],
      correctIndex: 0,
      ruleInsight: "Si mencionas exactamente cuándo ocurrió el hecho ('yesterday', 'last night', 'in 2019'), DEBES usar Pasado Simple ('saw'), jamás Presente Perfecto."
    },
    step6_mastery: {
      question: "Reto de Nivel B1: Comunica un logro que continúa vigente en tu vida:",
      options: [
        "She has worked at this company since 2018 and loves her role.",
        "She worked at this company since 2018 and has loving her role.",
        "She has work at this company for 2018 and loves her role."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel B1 Consolidado! Dominas el puente entre el pasado y el presente."
    }
  },

  {
    id: 'b1-lesson-2',
    level: 'B1',
    unit: 3,
    unitTitle: 'Unidad 3 • Independencia Lingüística (Nivel B1)',
    code: '3.2',
    title: 'Segundo Condicional y Toma de Decisiones',
    subtitle: 'Plantea hipótesis, resuelve crisis y aconseja sin sonar autoritario',
    xpReward: 55,
    prerequisiteId: 'b1-lesson-1',
    step1_dialogue: {
      context: 'Reunión de estrategia ante un fallo inesperado del servidor central.',
      lines: [
        { speaker: 'CTO', en: "If we had more backup servers in Europe, the traffic surge wouldn't affect us.", es: "Si tuviéramos más servidores de respaldo en Europa, el pico de tráfico no nos afectaría.", phonetic: "/ɪf wiː hæd mɔːr ˈbækʌp ˈsɜːrvərz/" },
        { speaker: 'Engineer', en: "If I were in charge of DevOps, I would migrate to edge clusters today.", es: "Si yo estuviera a cargo de DevOps, migraría a clústeres en el borde hoy mismo.", phonetic: "/ɪf aɪ wɜːr ɪn tʃɑːrdʒ əv dɛvˈɑːps/" },
        { speaker: 'CTO', en: "What would happen if we throttled non-critical requests?", es: "¿Qué pasaría si limitáramos las peticiones no críticas?", phonetic: "/wɑːt wʊd ˈhæpən ɪf wiː ˈθrɑːtəld/" },
        { speaker: 'Engineer', en: "Users would experience minimal latency, and our database would stay healthy.", es: "Los usuarios experimentarían una latencia mínima y nuestra base de datos se mantendría sana.", phonetic: "/ˈjuːzərz wʊd ɪkˈspɪriəns ˈmɪnɪml/" },
        { speaker: 'CTO', en: "If I were you, I would trigger the throttle script right now.", es: "Si yo fuera tú, activaría el script de limitación ahora mismo.", phonetic: "/ɪf aɪ wɜːr juː aɪ wʊd ˈtrɪɡər/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué el ingeniero utiliza 'If I were in charge' en vez de 'If I was'?",
      audioContextText: "If I were in charge of DevOps, I would migrate to edge clusters today.",
      options: [
        "Porque en inglés estándar formal, el modo subjuntivo hipotético usa 'were' para todas las personas.",
        "Porque 'I' se considera plural en términos de ingeniería.",
        "Porque fue un error de dicción del ingeniero."
      ],
      correctIndex: 0,
      explanation: "¡Exacto! El subjuntivo del segundo condicional favorece 'were' ('If I were you', 'If he were here')."
    },
    step3_builder: {
      instruction: "Construye una recomendación diplomática con segundo condicional:",
      targetTranslationEs: "Si yo fuera tú, hablaría con el director primero.",
      correctWords: ["If", "I", "were", "you,", "I", "would", "talk", "to", "the", "director", "first."],
      scrambledWords: ["was", "would", "you,", "were", "talk", "to", "first.", "director", "the", "If", "I", "I"]
    },
    step4_shadowing: {
      instruction: "Domina el enlace de 'would' (/wʊd/) y las hipótesis:",
      phrases: [
        { levelLabel: "Fórmula de Consejo Diplomático", en: "If I were you, I would take that opportunity.", phonetic: "/ɪf aɪ wɜːr juː aɪ wʊd teɪk ðæt ˌɑːpərˈtuːnəti/", tip: "Pronuncia 'would take' suave sin exagerar la 'd' final." },
        { levelLabel: "Pregunta Hipotética", en: "What would you do in this situation?", phonetic: "/wɑːt wʊd juː duː ɪn ðɪs ˌsɪtʃuˈeɪʃn/", tip: "Conecta 'would you' como /wʊ-dʒuː/ de forma natural." },
        { levelLabel: "Consecuencia Imaginada", en: "We would save thousands of hours every month.", phonetic: "/wiː wʊd seɪv ˈθaʊzəndz əv ˈaʊərz ˈɛvri mʌnθ/", tip: "Haz la contracción 'We'd save' (/wiːd seɪv/) para mayor velocidad nativa." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'If I will win the lottery, I would buy a large company.'",
      explanationConcept: "Prohibición de 'will' o 'would' en la cláusula de 'If'",
      options: [
        "If I will win the lottery, I will buy a large company.",
        "If I won the lottery, I would buy a large company.",
        "If I would win the lottery, I will buy a large company."
      ],
      correctIndex: 1,
      ruleInsight: "En el segundo condicional, la cláusula condicional va en Pasado Simple ('If I won...'), NUNCA con 'would' ni 'will'. El 'would' pertenece exclusivamente al resultado."
    },
    step6_mastery: {
      question: "¿Cuál opción expresa una propuesta hipotética profesional impecable?",
      options: [
        "If we had more resources, we would automate the entire pipeline.",
        "If we will have more resources, we would automate the pipeline.",
        "If we have had more resources, we will automate the pipeline."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel B1.2 Superado! Manejas la negociación diplomática y la formulación de hipótesis sin traducir."
    }
  },

  {
    id: 'b1-lesson-3',
    level: 'B1',
    unit: 3,
    unitTitle: 'Unidad 3 • Independencia Lingüística (Nivel B1)',
    code: '3.3',
    title: 'Narración Avanzada y Pasado Perfecto (The Past of the Past)',
    subtitle: 'Narra sucesos encadenados y establece cronologías exactas sin confusión',
    xpReward: 55,
    prerequisiteId: 'b1-lesson-2',
    step1_dialogue: {
      context: 'Investigación de una falla eléctrica en el laboratorio de astronomía.',
      lines: [
        { speaker: 'Investigator', en: "What were you doing when the emergency generator shut down?", es: "¿Qué estabas haciendo cuando el generador de emergencia se apagó?", phonetic: "/wɑːt wɜːr juː ˈduːɪŋ wɛn ðiː ɪˈmɜːrdʒənsi/" },
        { speaker: 'Scientist', en: "I was calibrating the spectrograph. Fortunately, we had already saved our observations.", es: "Estaba calibrando el espectrógrafo. Afortunadamente, ya habíamos guardado nuestras observaciones.", phonetic: "/aɪ wəz ˈkælɪˌbreɪtɪŋ wiː hæd ɔːlˈrɛdi seɪvd/" },
        { speaker: 'Investigator', en: "Had the sensors detected any anomalies before the blackout occurred?", es: "¿Los sensores habían detectado alguna anomalía antes de que ocurriera el apagón?", phonetic: "/hæd ðə ˈsɛnsərz dɪˈtɛktɪd ˈɛni əˈnɑːməliz/" },
        { speaker: 'Scientist', en: "Yes! The telemetry had warned us about voltage drops ten minutes prior.", es: "¡Sí! La telemetría nos había advertido sobre caídas de voltaje diez minutos antes.", phonetic: "/ðə təˈlɛmɪtri hæd wɔːrnd ʌs/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué acción ocurrió primero en el laboratorio según la declaración del científico?",
      audioContextText: "Fortunately, we had already saved our observations before the generator shut down.",
      options: [
        "El generador se apagó y luego guardaron los datos.",
        "Guardaron las observaciones ('had already saved') ANTES de que el generador se apagara.",
        "Perdieron todos los datos de la investigación."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! El Pasado Perfecto ('had saved') marca la acción más antigua en el pasado respecto al apagón."
    },
    step3_builder: {
      instruction: "Construye la oración secuencial con Pasado Perfecto:",
      targetTranslationEs: "Cuando llegamos al laboratorio, el experimento ya había comenzado.",
      correctWords: ["When", "we", "arrived", "at", "the", "lab,", "the", "experiment", "had", "already", "begun."],
      scrambledWords: ["arrived", "lab,", "begun.", "the", "When", "had", "at", "we", "already", "experiment", "has"]
    },
    step4_shadowing: {
      instruction: "Entrena la cadencia narrativa del Pasado Continuo y Perfecto:",
      phrases: [
        { levelLabel: "Acción Interrumpida", en: "While I was working, the alarm went off.", phonetic: "/waɪl aɪ wəz ˈwɜːrkɪŋ ðiː əˈlɑːrm wɛnt ɔːf/", tip: "Pasado continuo interrumpido por pasado simple." },
        { levelLabel: "Pasado del Pasado (Had + PP)", en: "They had already left before the meeting.", phonetic: "/ðeɪ hæd ɔːlˈrɛdi lɛft bɪˈfɔːr ðə ˈmiːtɪŋ/", tip: "Contrae 'They'd already left' /ðeɪd ɔːlˈrɛdi lɛft/." },
        { levelLabel: "Pregunta con Had", en: "Had you seen the telemetry before the crash?", phonetic: "/hæd juː siːn ðə təˈlɛmɪtri bɪˈfɔːr ðə kræʃ/", tip: "Enlaza 'Had you' como /hæ-dʒuː/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'When the police arrived, the suspect already escaped.'",
      explanationConcept: "Omitir el Pasado Perfecto destruye la cronología",
      options: [
        "When the police arrived, the suspect had already escaped.",
        "When the police arrived, the suspect already escaped.",
        "When the police was arriving, the suspect has already escaped."
      ],
      correctIndex: 0,
      ruleInsight: "Si la huida ocurrió antes de la llegada de la policía, es gramaticalmente imperativo usar Pasado Perfecto: 'had already escaped'."
    },
    step6_mastery: {
      question: "¿Cuál opción relata una secuencia histórica con absoluta claridad temporal?",
      options: [
        "By the time the team published the study, other researchers had replicated the results.",
        "By the time the team had published the study, other researchers replicated the results.",
        "By the time the team publish the study, other researchers already replicate the results."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel B1.3 Conquistado! Manejas la cronología narrativa compleja sin titubear."
    }
  },

  {
    id: 'b1-lesson-4',
    level: 'B1',
    unit: 3,
    unitTitle: 'Unidad 3 • Independencia Lingüística (Nivel B1)',
    code: '3.4',
    title: 'Descripción de Procesos Técnicos y Cláusulas Relativas',
    subtitle: 'Describe inventos, metodologías y define objetos sin nombrarlos',
    xpReward: 55,
    prerequisiteId: 'b1-lesson-3',
    step1_dialogue: {
      context: 'Explicación del proceso de purificación en una planta de tratamiento de agua.',
      lines: [
        { speaker: 'Engineer', en: "How is the industrial wastewater treated before it is released into the river?", es: "¿Cómo se trata el agua residual industrial antes de ser liberada al río?", phonetic: "/haʊ ɪz ðiː ɪnˈdʌstriəl ˈweɪstˌwɔːtər ˈtriːtɪd/" },
        { speaker: 'Chemist', en: "The water is filtered through carbon membranes that remove heavy metals.", es: "El agua se filtra a través de membranas de carbono que remueven metales pesados.", phonetic: "/ðə ˈwɔːtər ɪz ˈfɪltərd θruː ˈkɑːrbən ˈmɛmbreɪnz/" },
        { speaker: 'Engineer', en: "What happens to the sludge which is collected during filtration?", es: "¿Qué sucede con el lodo que se recolecta durante la filtración?", phonetic: "/wɑːt ˈhæpənz tuː ðə slʌdʒ wɪtʃ ɪz kəˈlɛktɪd/" },
        { speaker: 'Chemist', en: "It is neutralized by bacteria that convert toxic residues into organic fertilizer.", es: "Es neutralizado por bacterias que convierten residuos tóxicos en fertilizante orgánico.", phonetic: "/ɪt ɪz ˈnuːtrəlaɪzd baɪ bækˈtɪəriə/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Cuál es la función de las membranas descritas en el proceso?",
      audioContextText: "The water is filtered through carbon membranes that remove heavy metals.",
      options: [
        "Aumentar la temperatura del agua tratada.",
        "Remover metales pesados mediante filtración con carbono.",
        "Verter bacterias directamente en el río."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! La cláusula relativa 'that remove heavy metals' define la función técnica de las membranas."
    },
    step3_builder: {
      instruction: "Construye una definición con cláusula relativa (that/which):",
      targetTranslationEs: "Un barómetro es un dispositivo que mide la presión atmosférica.",
      correctWords: ["A", "barometer", "is", "a", "device", "that", "measures", "atmospheric", "pressure."],
      scrambledWords: ["measures", "atmospheric", "is", "pressure.", "A", "barometer", "device", "a", "that", "who"]
    },
    step4_shadowing: {
      instruction: "Entrena la fluidez en descripciones pasivas y cláusulas relativas:",
      phrases: [
        { levelLabel: "Pasiva de Proceso", en: "The sample is heated to extreme temperatures.", phonetic: "/ðə ˈsæmpl ɪz ˈhiːtɪd tuː ɪkˈstriːm ˈtɛmprətʃərz/", tip: "Enlaza 'is heated' como /ɪ-ziːtɪd/." },
        { levelLabel: "Cláusula con That", en: "We need tools that simplify automation.", phonetic: "/wiː niːd tuːlz ðæt ˈsɪmplɪfaɪ ˌɔːtəˈmeɪʃn/", tip: "Usa 'that' para referirte a objetos o sistemas." },
        { levelLabel: "Cláusula con Who", en: "The scientist who designed the protocol won an award.", phonetic: "/ðə ˈsaɪəntɪst huː dɪˈzaɪnd ðə ˈproʊtəkɑːl/", tip: "Usa 'who' exclusivamente con personas." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'The machine who was invented by him is broken.'",
      explanationConcept: "Uso incorrecto del pronombre relativo 'who' para objetos",
      options: [
        "The machine that was invented by him is broken.",
        "The machine who was invented by him is broken.",
        "The machine what was invented by him is broken."
      ],
      correctIndex: 0,
      ruleInsight: "Nunca uses 'who' para objetos o máquinas (solo personas). Usa 'that' o 'which'. Además, nunca uses 'what' como pronombre relativo conectivo en este contexto."
    },
    step6_mastery: {
      question: "¿Cuál opción describe un proceso técnico con precisión impecable?",
      options: [
        "Solar radiation is captured by panels that convert photons into electrical energy.",
        "Solar radiation captures by panels who converts photons into electrical energy.",
        "Solar radiation is capture by panels what convert photons into electrical energy."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel B1 Completo! Eres capaz de describir procesos científicos y redactar manuales técnicos."
    }
  }
];

const b2Lessons = [
  {
    id: 'b2-lesson-1',
    level: 'B2',
    unit: 4,
    unitTitle: 'Unidad 4 • Fluidez y Contexto Académico (Nivel B2)',
    code: '4.1',
    title: 'Voz Pasiva Ejecutiva y Registro Institucional',
    subtitle: 'Enfoca la acción en el resultado y no en el agente con elegancia corporativa',
    xpReward: 60,
    prerequisiteId: 'b1-lesson-4',
    step1_dialogue: {
      context: 'Auditoría internacional de procesos de ciberseguridad.',
      lines: [
        { speaker: 'Auditor', en: "How often are the encryption keys rotated across your cloud servers?", es: "¿Con qué frecuencia se rotan las claves de cifrado en sus servidores en la nube?", phonetic: "/haʊ ˈɔːfn ɑːr ðiː ɪnˈkrɪpʃn kiːz roʊˈteɪtɪd/" },
        { speaker: 'SecurityLead', en: "All sensitive keys are rotated automatically every twenty-four hours.", es: "Todas las claves sensibles se rotan automáticamente cada 24 horas.", phonetic: "/ɔːl ˈsɛnsətɪv kiːz ɑːr roʊˈteɪtɪd/" },
        { speaker: 'Auditor', en: "Were any unauthorized intrusions detected during the third quarter?", es: "¿Se detectó alguna intrusión no autorizada durante el tercer trimestre?", phonetic: "/wɜːr ˈɛni ˌʌnˈɔːθəraɪzd ɪnˈtruːʒənz dɪˈtɛktɪd/" },
        { speaker: 'SecurityLead', en: "No vulnerabilities were found, and our report has been certified.", es: "No se encontró ninguna vulnerabilidad y nuestro informe ha sido certificado.", phonetic: "/noʊ ˌvʌlnərəˈbɪlətiz wɜːr faʊnd/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué el equipo de seguridad prefiere la voz pasiva ('were rotated', 'were found') en este contexto?",
      audioContextText: "All sensitive keys are rotated automatically every twenty-four hours.",
      options: [
        "Porque no saben quién hace el trabajo.",
        "Porque en auditorías técnicas y lenguaje ejecutivo se prioriza el objeto y el resultado, no a la persona individual.",
        "Porque es una forma gramatical informal usada entre amigos."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! La voz pasiva confiere objetividad, rigor institucional y enfoque directo en el sistema."
    },
    step3_builder: {
      instruction: "Construye la afirmación pasiva en presente perfecto:",
      targetTranslationEs: "El nuevo contrato ya ha sido firmado por el cliente.",
      correctWords: ["The", "new", "contract", "has", "already", "been", "signed", "by", "the", "client."],
      scrambledWords: ["been", "contract", "signed", "already", "client.", "The", "new", "was", "has", "by", "the"]
    },
    step4_shadowing: {
      instruction: "Entrena la cadencia formal pasiva sin trabas:",
      phrases: [
        { levelLabel: "Pasiva Presente", en: "Data is encrypted before being stored.", phonetic: "/ˈdeɪtə ɪz ɪnˈkrɪptɪd bɪˈfɔːr ˈbiːɪŋ stɔːrd/", tip: "Enlaza 'is encrypted' /ɪ-zɪnˈkrɪptɪd/ limpiamente." },
        { levelLabel: "Pasiva Pasada", en: "The decision was approved by the board.", phonetic: "/ðə dɪˈsɪʒn wəz əˈpruːvd baɪ ðə bɔːrd/", tip: "La 'ed' en 'approved' suena como /d/ suave." },
        { levelLabel: "Pasiva Perfecta", en: "All updates have been successfully implemented.", phonetic: "/ɔːl ˈʌpdeɪts hæv biːn səkˈsɛsfəli ˈɪmpləmɛntɪd/", tip: "Pronuncia 'have been' como un bloque rítmico corto /hæv bɪn/." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'The confidential files were steal during the weekend.'",
      explanationConcept: "El participio pasado invariable en la voz pasiva",
      options: [
        "The confidential files were stolen during the weekend.",
        "The confidential files were stole during the weekend.",
        "The confidential files had stolen during the weekend."
      ],
      correctIndex: 0,
      ruleInsight: "Toda construcción de voz pasiva requiere el verbo 'to be' + PARTICIPIO PASADO (3ª columna: 'stolen', nunca infinitivo 'steal' ni pasado simple 'stole')."
    },
    step6_mastery: {
      question: "¿Cuál frase pasiva representa un informe corporativo formal riguroso?",
      options: [
        "The incident was quickly resolved and all stakeholders were informed.",
        "The incident did resolved quickly and stakeholders informed.",
        "The incident was resolve fast and stakeholders were inform."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel B2 Sólido Logrado! Tu comunicación escrita y formal refleja la precisión requerida en organizaciones globales."
    }
  },

  {
    id: 'b2-lesson-2',
    level: 'B2',
    unit: 4,
    unitTitle: 'Unidad 4 • Fluidez y Contexto Académico (Nivel B2)',
    code: '4.2',
    title: 'Cleft Sentences y Debate Formal estilo Oxford',
    subtitle: 'Enfoca la atención en puntos neurálgicos y defiende posturas con contundencia',
    xpReward: 60,
    prerequisiteId: 'b2-lesson-1',
    step1_dialogue: {
      context: 'Debate universitario sobre inteligencia artificial en la Sociedad de Debate de Oxford.',
      lines: [
        { speaker: 'DebaterA', en: "What concerns scholars most is not automation, but the opacity of algorithmic bias.", es: "Lo que más preocupa a los académicos no es la automatización, sino la opacidad del sesgo algorítmico.", phonetic: "/wɑːt kənˈsɜːrnz ˈskɑːlərz moʊst/" },
        { speaker: 'DebaterB', en: "It was the lack of ethical oversight that created the vulnerability in the first place.", es: "Fue la falta de supervisión ética lo que generó la vulnerabilidad en primer lugar.", phonetic: "/ɪt wəz ðə læk əv ˈɛθɪkl ˈoʊvərˌsaɪt/" },
        { speaker: 'DebaterA', en: "Could you clarify whether independent audits would mitigate that systemic risk?", es: "¿Podría aclarar si las auditorías independientes mitigarían ese riesgo sistémico?", phonetic: "/kʊd juː ˈklærəˌfaɪ ˈwɛðər/" },
        { speaker: 'DebaterB', en: "What we need is binding international legislation, not voluntary corporate guidelines.", es: "Lo que necesitamos es legislación internacional vinculante, no directrices corporativas voluntarias.", phonetic: "/wɑːt wiː niːd ɪz ˈbaɪndɪŋ/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué función cumple la estructura 'What concerns scholars most is...' en el debate?",
      audioContextText: "What concerns scholars most is not automation, but the opacity of algorithmic bias.",
      options: [
        "Expresa una duda de si la automatización es real.",
        "Aplica una 'cleft sentence' (oración escindida) para enfocar con máxima fuerza el núcleo del argumento.",
        "Es una pregunta informal entre compañeros de cuarto."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! Las 'cleft sentences' (What we need is..., It was X that...) son el recurso retórico por excelencia para dirigir la atención del auditorio."
    },
    step3_builder: {
      instruction: "Construye una oración con énfasis 'cleft sentence':",
      targetTranslationEs: "Lo que necesitamos es mayor transparencia en la investigación.",
      correctWords: ["What", "we", "need", "is", "greater", "transparency", "in", "the", "research."],
      scrambledWords: ["need", "is", "research.", "What", "transparency", "the", "we", "in", "greater", "that"]
    },
    step4_shadowing: {
      instruction: "Practica la entonación persuasiva de debate:",
      phrases: [
        { levelLabel: "Énfasis 'What we need is'", en: "What we need is rigorous empirical evidence.", phonetic: "/wɑːt wiː niːd ɪz ˈrɪɡərəs ɪmˈpɪrɪkl ˈɛvɪdəns/", tip: "Enlaza 'need is' como /niː-dɪz/ con acento en 'rigorous'." },
        { levelLabel: "Estructura 'It was X that'", en: "It was the team that discovered the error.", phonetic: "/ɪt wəz ðə tiːm ðæt dɪˈskʌvərd ðiː ˈɛrər/", tip: "Acentúa fuertemente 'the team' antes de conectar 'that'." },
        { levelLabel: "Pregunta Indirecta de Cortesía", en: "Could you explain how the data was gathered?", phonetic: "/kʊd juː ɪkˈspleɪn haʊ ðə ˈdeɪtə wəz ˈɡæðərd/", tip: "El orden de la cláusula subordinada es afirmativo (sujeto + verbo)." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'Do you know where is the main library located?'",
      explanationConcept: "Inversión errónea en preguntas indirectas",
      options: [
        "Do you know where the main library is located?",
        "Do you know where is the main library located?",
        "Do you know where the main library located is?"
      ],
      correctIndex: 0,
      ruleInsight: "En las preguntas indirectas introducidas por 'Do you know' o 'Could you tell me', la inversión auxiliar-sujeto DESAPARECE y se restablece el orden afirmativo: 'where the main library IS located'."
    },
    step6_mastery: {
      question: "¿Cuál opción representa un argumento enfático impecable para un debate académico?",
      options: [
        "It was the breakthrough in materials science that unlocked renewable efficiency.",
        "It was the breakthrough in materials science which did unlock renewable efficiency.",
        "What was the breakthrough in materials science that unlock renewable efficiency."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel B2 Universitario Conquistado! Dominas el debate formal y el énfasis retórico exigido para la graduación universitaria."
    }
  },

  {
    id: 'b2-lesson-3',
    level: 'B2',
    unit: 4,
    unitTitle: 'Unidad 4 • Fluidez y Contexto Académico (Nivel B2)',
    code: '4.3',
    title: 'Hipótesis Retrospectiva y Tercer Condicional (Contrafácticos)',
    subtitle: 'Modela escenarios alternativos y analiza errores empresariales del pasado',
    xpReward: 60,
    prerequisiteId: 'b2-lesson-2',
    step1_dialogue: {
      context: 'Auditoría post-mortem tras el fallo de lanzamiento de una sonda espacial.',
      lines: [
        { speaker: 'Director', en: "If the telemetry engineers had recalibrated the altitude sensors, the probe wouldn't have crashed.", es: "Si los ingenieros de telemetría hubieran recalibrado los sensores, la sonda no se habría estrellado.", phonetic: "/ɪf ðə təˈlɛmɪtri ˌɛndʒɪˈnɪərz hæd ˌriːˈkælɪbreɪtɪd/" },
        { speaker: 'Analyst', en: "I agree. If we had conducted an extra simulation, we would have spotted the buffer overflow.", es: "De acuerdo. Si hubiésemos hecho una simulación extra, habríamos detectado el desbordamiento de búfer.", phonetic: "/ɪf wiː hæd kənˈdʌktɪd ən ˈɛkstrə/" },
        { speaker: 'Director', en: "I wish the management had authorized the budget extension earlier.", es: "Ojalá la directiva hubiera autorizado la extensión de presupuesto antes.", phonetic: "/aɪ wɪʃ ðə ˈmænɪdʒmənt hæd ˈɔːθəraɪzd/" },
        { speaker: 'Analyst', en: "Indeed. If we had secured those resources, our team would be analyzing orbital data right now.", es: "En efecto. Si hubiéramos asegurado esos recursos, nuestro equipo estaría analizando datos orbitales ahora mismo.", phonetic: "/ɪf wiː hæd sɪˈkjʊərd ðoʊz rɪˈsɔːrsɪz/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué tipo de condicional utiliza el analista en su última intervención?",
      audioContextText: "If we had secured those resources (past), we would be analyzing orbital data right now (present).",
      options: [
        "Un condicional de futuro para la próxima misión.",
        "Un condicional mixto: una causa no ocurrida en el pasado afectando la situación actual en el presente.",
        "Una recomendación informal para el director."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! El condicional mixto combina Past Perfect ('had secured') con 'would be analyzing right now' (presente)."
    },
    step3_builder: {
      instruction: "Construye una hipótesis contrafáctica con tercer condicional:",
      targetTranslationEs: "Si hubiéramos sabido del error, habríamos cancelado el lanzamiento.",
      correctWords: ["If", "we", "had", "known", "about", "the", "bug,", "we", "would", "have", "canceled", "the", "launch."],
      scrambledWords: ["known", "the", "would", "launch.", "If", "we", "had", "canceled", "about", "have", "bug,", "we", "will"]
    },
    step4_shadowing: {
      instruction: "Practica las contracciones nativas en condicionales: 'would've' (/wʊdəv/):",
      phrases: [
        { levelLabel: "Tercer Condicional", en: "We would have prevented the outage.", phonetic: "/wiː wʊd hæv prɪˈvɛntɪd ðiː ˈaʊtɪdʒ/", tip: "Pronuncia 'would have' como /wʊdəv/ fluido." },
        { levelLabel: "Deseo Retrospectivo con Wish", en: "I wish we had tested the backup protocol.", phonetic: "/aɪ wɪʃ wiː hæd ˈtɛstɪd ðə ˈbækʌp ˈproʊtəkɑːl/", tip: "Usa Past Perfect después de 'wish' para arrepentimientos pasados." },
        { levelLabel: "Condicional Mixto", en: "If she had accepted the offer, she would be CEO today.", phonetic: "/ɪf ʃiː hæd əkˈsɛptɪd ðiː ˈɔːfər ʃiː wʊd biː ˌsiː-iː-ˈoʊ/", tip: "Conecta la condición pasada con la realidad presente." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'If we would have known the truth, we would have acted faster.'",
      explanationConcept: "Prohibición de 'would have' en la cláusula condicional de 'If'",
      options: [
        "If we had known the truth, we would have acted faster.",
        "If we would have known the truth, we would have acted faster.",
        "If we would know the truth, we would had acted faster."
      ],
      correctIndex: 0,
      ruleInsight: "Nunca se coloca 'would have' dentro de la cláusula de 'If' (error hispanohablante frecuente). La cláusula condicional lleva Past Perfect ('If we HAD known'), mientras que 'would have' va únicamente en el resultado."
    },
    step6_mastery: {
      question: "¿Cuál opción analiza un error corporativo con rigor contrafáctico de nivel B2?",
      options: [
        "If the board had diversified their portfolio earlier, the company would not have faced bankruptcy.",
        "If the board would have diversified their portfolio earlier, the company wouldn't faced bankruptcy.",
        "If the board diversified their portfolio earlier, the company will not have faced bankruptcy."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel B2.3 Superado! Modelas análisis contrafácticos y tomas de decisiones complejas."
    }
  },

  {
    id: 'b2-lesson-4',
    level: 'B2',
    unit: 4,
    unitTitle: 'Unidad 4 • Fluidez y Contexto Académico (Nivel B2)',
    code: '4.4',
    title: 'Reported Speech Avanzado y Modales de Deducción (Must have)',
    subtitle: 'Cita declaraciones de terceros con verbos precisos y deduce sucesos pasados',
    xpReward: 60,
    prerequisiteId: 'b2-lesson-3',
    step1_dialogue: {
      context: 'Conferencia de prensa de un comité de investigación forense digital.',
      lines: [
        { speaker: 'Journalist', en: "Did the government spokesperson confirm that the servers had been compromised?", es: "¿Confirmó el portavoz del gobierno que los servidores habían sido comprometidos?", phonetic: "/dɪd ðə ˈɡʌvərnmənt ˈspoʊkspɜːrsn kənˈfɜːrm/" },
        { speaker: 'Investigator', en: "The spokesperson denied that user passwords had leaked, but warned that telemetry might have been exposed.", es: "El portavoz negó que las contraseñas se hubieran filtrado, pero advirtió que la telemetría pudo haber sido expuesta.", phonetic: "/ðə ˈspoʊkspɜːrsn dɪˈnaɪd ðæt/" },
        { speaker: 'Journalist', en: "The hackers must have exploited a zero-day vulnerability then!", es: "¡Los atacantes deben haber explotado una vulnerabilidad de día cero entonces!", phonetic: "/ðə ˈhækərz mʌst hæv ɪkˈsplɔɪtɪd/" },
        { speaker: 'Investigator', en: "Indeed. They cannot have breached the firewall without privileged access keys.", es: "En efecto. No pueden haber traspasado el firewall sin claves de acceso privilegiadas.", phonetic: "/ðeɪ ˈkænɑːt hæv briːtʃt ðə ˈfaɪərwɔːl/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué certeza lógica expresa el investigador con 'They cannot have breached the firewall'?",
      audioContextText: "They cannot have breached the firewall without privileged access keys.",
      options: [
        "Es posible que hayan entrado sin contraseñas.",
        "Deducción de imposibilidad lógica en el pasado: era imposible que ingresaran sin claves privilegiadas.",
        "Una recomendación para cambiar los firewalls."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! 'Cannot have + participio' expresa deducción lógica de imposibilidad categórica en el pasado."
    },
    step3_builder: {
      instruction: "Construye una deducción en pasado con 'must have':",
      targetTranslationEs: "Ellos deben haber olvidado apagar los servidores anoche.",
      correctWords: ["They", "must", "have", "forgotten", "to", "turn", "off", "the", "servers", "last", "night."],
      scrambledWords: ["must", "forgotten", "servers", "have", "They", "the", "turn", "night.", "off", "to", "last"]
    },
    step4_shadowing: {
      instruction: "Entrena la entonación en deducciones pasadas:",
      phrases: [
        { levelLabel: "Certeza Positiva (Must have)", en: "He must have received the notification.", phonetic: "/hiː mʌst hæv rɪˈsiːvd ðə ˌnoʊtɪfɪˈkeɪʃn/", tip: "Pronuncia /mʌstəv/ con convicción lógica." },
        { levelLabel: "Imposibilidad Lógica (Can't have)", en: "She can't have deleted the database intentionally.", phonetic: "/ʃiː kænt hæv dɪˈliːtɪd ðə ˈdeɪtəˌbeɪs/", tip: "Acentúa 'can't' fuertemente para denotar imposibilidad." },
        { levelLabel: "Posibilidad Incierta (Might have)", en: "The package might have arrived this morning.", phonetic: "/ðə ˈpækɪdʒ maɪt hæv əˈraɪvd/", tip: "'Might have' denota probabilidad tentativa." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'The director said that he will attend the seminar tomorrow.'",
      explanationConcept: "Falta de correlación temporal (backshift) en Reported Speech formal",
      options: [
        "The director said that he would attend the seminar the following day.",
        "The director said that he will attend the seminar tomorrow.",
        "The director told that he would attend the seminar tomorrow."
      ],
      correctIndex: 0,
      ruleInsight: "En el estilo indirecto formal, cuando el verbo introductorio está en pasado ('said'), se aplica 'backshift': 'will' pasa a 'would' y 'tomorrow' a 'the following day'."
    },
    step6_mastery: {
      question: "¿Cuál opción sintetiza una declaración oficial y deducción lógica con nivel B2 universitario?",
      options: [
        "The audit concluded that the firm must have suffered an unauthorized breach during the migration.",
        "The audit said that the firm must suffered an breach when they migrated.",
        "The audit told that the firm can have suffered an unauthorized breach."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel B2 Completo! Cumples con el estándar oficial de titulación universitaria del MCER."
    }
  }
];

const c1Lessons = [
  {
    id: 'c1-lesson-1',
    level: 'C1',
    unit: 5,
    unitTitle: 'Unidad 5 • Inglés Académico Avanzado EAP (Nivel C1)',
    code: '5.1',
    title: 'Inversión Enfática y Phrasal Verbs Separables',
    subtitle: 'Oratoria persuasiva de alto impacto y precisión idiomática ejecutiva',
    xpReward: 65,
    prerequisiteId: 'b2-lesson-4',
    step1_dialogue: {
      context: 'Debate estratégico de directores en el consejo de administración.',
      lines: [
        { speaker: 'Chairwoman', en: "Seldom have we faced such an unprecedented technological disruption.", es: "Rara vez nos hemos enfrentado a una disrupción tecnológica tan sin precedentes.", phonetic: "/ˈsɛldəm hæv wiː feɪst/" },
        { speaker: 'Director', en: "Indeed. Under no circumstances should we put off this investment.", es: "En efecto. Bajo ninguna circunstancia debemos posponer esta inversión.", phonetic: "/ʌndər noʊ ˈsɜːrkəmstænsɪz/" },
        { speaker: 'Chairwoman', en: "The startup made an offer, but we had to turn it down.", es: "La startup hizo una oferta, pero tuvimos que rechazarla.", phonetic: "/tɜːrn ɪt daʊn/" },
        { speaker: 'Director', en: "We need to come up with a more sustainable roadmap immediately.", es: "Necesitamos idear una hoja de ruta más sostenible de inmediato.", phonetic: "/kʌm ʌp wɪð/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué postura adoptó el consejo respecto a la oferta de la startup?",
      audioContextText: "The startup made an offer, but we had to turn it down.",
      options: [
        "Aceptaron la oferta sin ninguna condición.",
        "Rechazaron la oferta ('turned it down') para buscar una alternativa más sostenible.",
        "Pospusieron la reunión hasta el próximo año."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! 'Turn it down' significa rechazar una oferta formal con el pronombre en medio."
    },
    step3_builder: {
      instruction: "Aplica inversión enfática negativa de nivel C1:",
      targetTranslationEs: "Rara vez he visto tal dedicación en un equipo.",
      correctWords: ["Rarely", "have", "I", "seen", "such", "dedication", "in", "a", "team."],
      scrambledWords: ["seen", "I", "team.", "Rarely", "have", "such", "in", "dedication", "a", "did"]
    },
    step4_shadowing: {
      instruction: "Oratoria de alto impacto con cadencia nativa refinada:",
      phrases: [
        { levelLabel: "Inversión Enfática", en: "Seldom have we witnessed such remarkable innovation.", phonetic: "/ˈsɛldəm hæv wiː ˈwɪtnɪst sʌtʃ rɪˈmɑːrkəbl/", tip: "Tras 'Seldom', invierte auxiliar y sujeto: /hæv wiː/." },
        { levelLabel: "Phrasal Verb Separable", en: "They offered a promotion, but she turned it down.", phonetic: "/ðeɪ ˈɔːfərd ə prəˈmoʊʃn bʌt ʃiː tɜːrnd ɪt daʊn/", tip: "Pronuncia 'turned it down' con ritmo continuo /tɜːrn-dɪt-daʊn/." },
        { levelLabel: "Estructura Not Only... But Also", en: "Not only did he finish early, but he also reduced costs.", phonetic: "/nɑːt ˈoʊnli dɪd hiː ˈfɪnɪʃ ˈɜːrli bʌt hiː ˈɔːlsoʊ/", tip: "Auxiliar 'did' inmediatamente después de 'Not only'." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'The contract was bad, so the manager turned down it.'",
      explanationConcept: "Regla sagrada de separación de Phrasal Verbs con pronombres",
      options: [
        "The contract was bad, so the manager turned it down.",
        "The contract was bad, so the manager turned down it.",
        "The contract was bad, so the manager turned off it."
      ],
      correctIndex: 0,
      ruleInsight: "Cuando el objeto de un phrasal verb separable es un pronombre (it, them, him, her), DEBE ir intercalado en el medio: 'Turn it down' (nunca 'Turn down it' ❌)."
    },
    step6_mastery: {
      question: "Reto de Maestría C1: Redacta una advertencia con máxima solemnidad formal:",
      options: [
        "Under no circumstances should confidential credentials be disclosed.",
        "Under no circumstances confidential credentials should be disclosed.",
        "Under no circumstances should confidential credentials disclosed."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel C1 Maestro Alcanzado! Dominas la oratoria persuasiva, la inversión retórica y los modismos de élite."
    }
  },

  {
    id: 'c1-lesson-2',
    level: 'C1',
    unit: 5,
    unitTitle: 'Unidad 5 • Inglés Académico Avanzado EAP (Nivel C1)',
    code: '5.2',
    title: 'Subjuntivo Formal y Lenguaje Cauteloso (Hedging)',
    subtitle: 'Rigor científico en propuestas de investigación y publicaciones arbitradas',
    xpReward: 70,
    prerequisiteId: 'c1-lesson-1',
    step1_dialogue: {
      context: 'Comité de Bioética evaluando un protocolo de ensayo clínico internacional.',
      lines: [
        { speaker: 'Chair', en: "It is imperative that the principal investigator submit all raw telemetry immediately.", es: "Es imperativo que el investigador principal presente toda la telemetría sin procesar de inmediato.", phonetic: "/ɪt ɪz ɪmˈpɛrətɪv ðæt/" },
        { speaker: 'Reviewer', en: "Notwithstanding the logistical setbacks, the preliminary findings seem to suggest a mild therapeutic correlation.", es: "A pesar de los contratiempos logísticos, los hallazgos preliminares parecen sugerir una leve correlación terapéutica.", phonetic: "/ˌnɑːtwɪθˈstændɪŋ ðə loʊˈdʒɪstɪkl/" },
        { speaker: 'Chair', en: "Be that as it may, we recommend that the dose be recalibrated cautiously.", es: "Sea como fuere, recomendamos que la dosis sea recalibrada con cautela.", phonetic: "/biː ðæt æz ɪt meɪ/" },
        { speaker: 'Reviewer', en: "These anomalies could arguably be attributed to thermal variance rather than chemical degradation.", es: "Estas anomalías podrían atribuirse razonablemente a variaciones térmicas más que a degradación química.", phonetic: "/kʊd ˈɑːrɡjuəbli biː əˈtrɪbjuːtɪd/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué el comité utiliza expresiones como 'seem to suggest' y 'could arguably be attributed'?",
      audioContextText: "These anomalies could arguably be attributed to thermal variance.",
      options: [
        "Porque desconocen por completo el experimento.",
        "Porque en prosa científica de élite se aplica 'hedging' (lenguaje cauteloso) para no hacer afirmaciones dogmáticas prematuras.",
        "Porque el comité rechaza la investigación por mala fe."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! El 'hedging' protege la credibilidad científica permitiendo presentar hipótesis fundamentadas sin caer en falsas certezas absolutas."
    },
    step3_builder: {
      instruction: "Construye una cláusula con subjuntivo formal mandatorio:",
      targetTranslationEs: "Es esencial que el informe se presente antes de la medianoche.",
      correctWords: ["It", "is", "essential", "that", "the", "report", "be", "submitted", "before", "midnight."],
      scrambledWords: ["is", "submitted", "report", "the", "It", "essential", "that", "midnight.", "be", "before", "was"]
    },
    step4_shadowing: {
      instruction: "Entrena la cadencia solemne del subjuntivo y las concesivas:",
      phrases: [
        { levelLabel: "Subjuntivo Mandatorio", en: "It is vital that he remain at the facility.", phonetic: "/ɪt ɪz ˈvaɪtl ðæt hiː rɪˈmeɪn æt ðə fəˈsɪləti/", tip: "En tercera persona singular el verbo se mantiene en infinitivo desnudo ('remain', nunca 'remains')." },
        { levelLabel: "Concesiva Culta", en: "Notwithstanding the delays, the trial was successful.", phonetic: "/ˌnɑːtwɪθˈstændɪŋ ðə dɪˈleɪz ðə ˈtraɪəl wəz səkˈsɛsfəl/", tip: "Pronuncia 'Notwithstanding' en cuatro sílabas fluidas sin cortar." },
        { levelLabel: "Lenguaje Cauteloso (Hedging)", en: "The evidence appears to corroborate our hypothesis.", phonetic: "/ðiː ˈɛvɪdəns əˈpɪərz tuː kəˈrɑːbəˌreɪt ˈaʊər haɪˈpɑːθəsɪs/", tip: "Usa 'appears to' en vez de 'proves' para mantener el rigor científico." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'The committee recommended that the candidate submits his application tomorrow.'",
      explanationConcept: "Falso agregado de '-s' en subjuntivo formal",
      options: [
        "The committee recommended that the candidate submit his application tomorrow.",
        "The committee recommended that the candidate submits his application tomorrow.",
        "The committee recommended that the candidate to submit his application tomorrow."
      ],
      correctIndex: 0,
      ruleInsight: "Tras verbos de mandato o sugerencia (recommend, demand, insist, require), el inglés formal exige la forma base pura sin '-s': 'that he submit' (subjuntivo mandatorio)."
    },
    step6_mastery: {
      question: "¿Cuál formulación cumple con los estándares más rigurosos de una revista científica internacional?",
      options: [
        "The data appears to suggest a moderate correlation, albeit one that warrants further replication.",
        "The data proves 100% our theory and nobody can question it.",
        "The data is suggesting that maybe we did a good job albeit the delays."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel C1 de Escritura Científica Dominado! Tu capacidad de matizar con 'hedging' y subjuntivo está lista para papers indexados."
    }
  },

  {
    id: 'c1-lesson-3',
    level: 'C1',
    unit: 5,
    unitTitle: 'Unidad 5 • Inglés Académico Avanzado EAP (Nivel C1)',
    code: '5.3',
    title: 'Retórica, Oratoria y Colocaciones Complejas (TED-Style Talk)',
    subtitle: 'Domina los marcadores del discurso oral y modula pausas para persuadir auditorios',
    xpReward: 70,
    prerequisiteId: 'c1-lesson-2',
    step1_dialogue: {
      context: 'Conferencia Magistral internacional sobre transición energética.',
      lines: [
        { speaker: 'Speaker', en: "To put it another way, our findings profoundly challenge conventional macroeconomic assumptions.", es: "Dicho de otro modo, nuestros hallazgos desafían profundamente los supuestos macroeconómicos convencionales.", phonetic: "/tuː pʊt ɪt əˈnʌðər weɪ/" },
        { speaker: 'Moderator', en: "Would you say that this transition is economically viable in developing markets?", es: "¿Diría usted que esta transición es económicamente viable en mercados en desarrollo?", phonetic: "/wʊd juː seɪ ðæt ðɪs trænˈzɪʃn/" },
        { speaker: 'Speaker', en: "Far from being a liability, decentralized energy represents an unprecedented leapfrog opportunity.", es: "Lejos de ser una desventaja, la energía descentralizada representa una oportunidad sin precedentes de salto cualitativo.", phonetic: "/fɑːr frəm ˈbiːɪŋ ə ˌlaɪəˈbɪləti/" },
        { speaker: 'Moderator', en: "In light of that, how do you respond to skeptics who foresee insurmountable grid bottlenecks?", es: "A la luz de eso, ¿cómo responde a los escépticos que prevén cuellos de botella insalvables en la red?", phonetic: "/ɪn laɪt əv ðæt haʊ duː juː rɪˈspɑːnd/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Cuál es el núcleo retórico del orador ante la transición energética?",
      audioContextText: "Far from being a liability, decentralized energy represents an unprecedented opportunity.",
      options: [
        "Que la transición energética arruinará los mercados en desarrollo.",
        "Refuta la objeción convirtiendo la supuesta debilidad en una oportunidad histórica ('leapfrog opportunity').",
        "Que pospondrán la energía renovable hasta 2050."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! El marcador 'Far from being a liability' reencuadra el debate de manera altamente persuasiva."
    },
    step3_builder: {
      instruction: "Construye una colocación discursiva culta:",
      targetTranslationEs: "A la luz de estos datos, debemos fomentar una colaboración más estrecha.",
      correctWords: ["In", "light", "of", "these", "findings,", "we", "must", "foster", "closer", "collaboration."],
      scrambledWords: ["findings,", "closer", "foster", "we", "In", "must", "light", "collaboration.", "of", "these", "make"]
    },
    step4_shadowing: {
      instruction: "Entrena marcadores del discurso oral y pausas enfáticas:",
      phrases: [
        { levelLabel: "Reformulación Retórica", en: "To put it another way, complacency is our greatest risk.", phonetic: "/tuː pʊt ɪt əˈnʌðər weɪ kəmˈpleɪsnsi ɪz ˈaʊər ˈɡreɪtɪst rɪsk/", tip: "Pausa breve tras 'To put it another way' para que el auditorio asimile." },
        { levelLabel: "Reencuadre de Objeción", en: "Far from being an obstacle, this constraint drives ingenuity.", phonetic: "/fɑːr frəm ˈbiːɪŋ ən ˈɑːbstəkl/", tip: "Acentúa 'Far from' con firmeza diplomática." },
        { levelLabel: "Colocación Culta", en: "We must profoundly rethink our core strategy.", phonetic: "/wiː mʌst prəˈfaʊndli riːˈθɪŋk ˈaʊər kɔːr ˈstrætədʒi/", tip: "Combina el adverbio 'profoundly' con 'rethink' con sonoridad fluida." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'In my opinion, I think that the project will make big problems.'",
      explanationConcept: "Pleonasmo y vocabulario informal impropio de un discurso C1",
      options: [
        "From our perspective, the initiative presents substantial operational challenges.",
        "In my opinion, I think that the project will make big problems.",
        "For me, the project is having many bad situations."
      ],
      correctIndex: 0,
      ruleInsight: "Erradica redundancias como 'In my opinion, I think' y términos infantiles como 'big problems'. Emplea 'From our perspective' y 'substantial operational challenges'."
    },
    step6_mastery: {
      question: "¿Cuál frase demuestra una colocación léxica de calibre profesional para una charla TED?",
      options: [
        "These empirical revelations profoundly challenge longstanding paradigms in our field.",
        "These empirical revelations very strongly change old ideas in our field.",
        "These facts make a big change in what we thought before."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel C1.3 Conquistado! Tu elocuencia oral y dominio de marcadores discursivos persuade en cualquier foro internacional."
    }
  },

  {
    id: 'c1-lesson-4',
    level: 'C1',
    unit: 5,
    unitTitle: 'Unidad 5 • Inglés Académico Avanzado EAP (Nivel C1)',
    code: '5.4',
    title: 'Crítica Epistemológica, Nominalización y Ensayo Académico',
    subtitle: 'Incrementa la densidad conceptual y redacta con estándares de citación APA/MLA',
    xpReward: 70,
    prerequisiteId: 'c1-lesson-3',
    step1_dialogue: {
      context: 'Revisión por pares de un ensayo de 1,000 palabras en el departamento de filosofía de la ciencia.',
      lines: [
        { speaker: 'PeerReviewer', en: "Your thesis is compelling; however, the nominalization in section three dramatically enhances academic rigor.", es: "Tu tesis es convincente; sin embargo, la nominalización en la sección tres eleva drásticamente el rigor académico.", phonetic: "/jɔːr ˈθiːsɪs ɪz kəmˈpɛlɪŋ/" },
        { speaker: 'Author', en: "I replaced 'because we analyzed the data poorly' with 'due to methodological inconsistency'.", es: "Reemplacé 'porque analizamos los datos mal' con 'debido a inconsistencia metodológica'.", phonetic: "/djuː tuː ˌmɛθədəˈlɑːdʒɪkl ˌɪnkənˈsɪstənsi/" },
        { speaker: 'PeerReviewer', en: "Superb. That removes subjective bias and adheres to international academic style.", es: "Soberbio. Eso elimina el sesgo subjetivo y se adhiere al estilo académico internacional.", phonetic: "/sʊˈpɜːrb ðæt rɪˈmuːvz səbˈdʒɛktɪv ˈbaɪəs/" },
        { speaker: 'Author', en: "Furthermore, all empirical citations have been reconciled with APA seventh edition guidelines.", es: "Además, todas las citas empíricas han sido conciliadas con las pautas APA de séptima edición.", phonetic: "/ˈfɜːrðərmɔːr ɔːl ɪmˈpɪrɪkl saɪˈteɪʃnz/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué beneficio aporta la nominalización ('methodological inconsistency') en el texto académico?",
      audioContextText: "It removes subjective bias and adheres to international academic style.",
      options: [
        "Hace que el texto sea más largo para cumplir el límite de palabras.",
        "Elimina la primera persona subjetiva y dota a la argumentación de objetividad e impersonalidad científica.",
        "Convierte el ensayo en un poema."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! La nominalización transforma verbos y adjetivos en sustantivos conceptuales de alta densidad intelectual."
    },
    step3_builder: {
      instruction: "Aplica nominalización académica para elevar el registro formal:",
      targetTranslationEs: "La implementación del nuevo protocolo redujo las discrepancias operativas.",
      correctWords: ["The", "implementation", "of", "the", "new", "protocol", "curbed", "operational", "discrepancies."],
      scrambledWords: ["protocol", "curbed", "implementation", "The", "discrepancies.", "operational", "new", "of", "the", "when"]
    },
    step4_shadowing: {
      instruction: "Entrena el ritmo denso de la prosa científica escrita leída en voz alta:",
      phrases: [
        { levelLabel: "Nominalización Formal", en: "The sudden cessation of funding halted operations.", phonetic: "/ðə ˈsʌdn sɛˈseɪʃn əv ˈfʌndɪŋ hɔːltɪd ˌɑːpəˈreɪʃnz/", tip: "Usa 'cessation' en lugar de 'they stopped paying'." },
        { levelLabel: "Transición Concesiva", en: "Notwithstanding these findings, further trials are warranted.", phonetic: "/ˌnɑːtwɪθˈstændɪŋ ðiːz ˈfaɪndɪŋz/", tip: "Puntuación de pausa tras el conector introductorio." },
        { levelLabel: "Citación Precisa", en: "As demonstrated by Miller and colleagues in 2023.", phonetic: "/æz ˈdɛmənstreɪtɪd baɪ ˈmɪlər ænd ˈkɑːliːɡz/", tip: "Fórmula de atribución bibliográfica formal." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'Because we destroyed the forest, animals are dying a lot.'",
      explanationConcept: "Registro informal inaceptable para un ensayo universitario",
      options: [
        "Deforestation has precipitated widespread biodiversity depletion.",
        "Because we destroyed the forest, animals are dying a lot.",
        "Due to we killed trees, animals have big problems to live."
      ],
      correctIndex: 0,
      ruleInsight: "En el nivel C1, las relaciones causales se expresan mediante sustantivos nominalizados abstractos: 'Deforestation has precipitated widespread biodiversity depletion'."
    },
    step6_mastery: {
      question: "¿Cuál oración cumple con el estándar de un ensayo crítico arbitrado?",
      options: [
        "Methodological divergence across independent cohorts accounts for the variance in observed efficacy.",
        "Scientists did things differently in different places so the results were not the same.",
        "Because of different ways to do the study, we have different numbers."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel C1 Universitario Completado con Honores! Escribes, debates y publicas con solvencia académica internacional."
    }
  }
];

const c2Lessons = [
  {
    id: 'c2-lesson-1',
    level: 'C2',
    unit: 6,
    unitTitle: 'Unidad 6 • Maestría, Especialización y Publicaciones (Nivel C2)',
    code: '6.1',
    title: 'Pragmática del Discurso, Ironía y Subtexto Cultural',
    subtitle: 'Decodifica segundas intenciones, ironía intelectual y diplomacia de alta tensión',
    xpReward: 80,
    prerequisiteId: 'c1-lesson-4',
    step1_dialogue: {
      context: 'Cumbre geopolítica sobre regulación de tecnologías emergentes en Ginebra.',
      lines: [
        { speaker: 'AmbassadorA', en: "While the proposal is undeniably audacious, one wonders whether its empirical assumptions withstand rigorous scrutiny.", es: "Si bien la propuesta es innegablemente audaz, uno se pregunta si sus supuestos empíricos resisten un escrutinio riguroso.", phonetic: "/waɪl ðə prəˈpoʊzl ɪz ˌʌndɪˈnaɪəbli ɔːˈdeɪʃəs/" },
        { speaker: 'AmbassadorB', en: "With all due respect, our interlocutors offered what might charitably be termed an idiosyncratic interpretation of the treaty.", es: "Con el debido respeto, nuestros interlocutores ofrecieron lo que caritativamente podría calificarse de interpretación idiosincrática del tratado.", phonetic: "/wɪð ɔːl duː rɪˈspɛkt/" },
        { speaker: 'AmbassadorA', en: "Far from being a liability, this discrepancy presents a golden opportunity to forge a binding multilateral consensus.", es: "Lejos de ser una desventaja, esta discrepancia brinda una oportunidad dorada para forjar un consenso multilateral vinculante.", phonetic: "/fɑːr frəm ˈbiːɪŋ ə ˌlaɪəˈbɪləti/" },
        { speaker: 'AmbassadorB', en: "I take your point; nonetheless, we cannot afford to conflate political expediency with methodological soundness.", es: "Comprendo su punto; no obstante, no podemos permitirnos confundir conveniencia política con solidez metodológica.", phonetic: "/aɪ teɪk jɔːr pɔɪnt ˌnʌnðəˈlɛs/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Qué significa realmente cuando el embajador califica la postura como 'an idiosyncratic interpretation'?",
      audioContextText: "Our interlocutors offered what might charitably be termed an idiosyncratic interpretation of the treaty.",
      options: [
        "Que es una interpretación formalmente acordada por todos.",
        "Es una ironía diplomática C2 para señalar con cortesía exquisita que la postura de la contraparte carece de lógica o rigor.",
        "Que los delegados hablaron en un dialecto desconocido."
      ],
      correctIndex: 1,
      explanation: "¡Brillante decodificación pragmática! En C2, 'idiosyncratic' se utiliza con cortesía diplomática para censurar un argumento ilógico sin recurrir a la confrontación abierta."
    },
    step3_builder: {
      instruction: "Construye una objeción diplomática de máxima solemnidad C2:",
      targetTranslationEs: "Lejos de ser un obstáculo, este desafío fortalece nuestra postura.",
      correctWords: ["Far", "from", "being", "an", "obstacle,", "this", "challenge", "strengthens", "our", "position."],
      scrambledWords: ["obstacle,", "strengthens", "Far", "this", "from", "our", "being", "challenge", "an", "position.", "not"]
    },
    step4_shadowing: {
      instruction: "Modula la cadencia y el subtexto de la oratoria diplomática C2:",
      phrases: [
        { levelLabel: "Objeción Diplomática Atenuada", en: "I am not entirely persuaded by that rationale.", phonetic: "/aɪ æm nɑːt ɪnˈtaɪərli pərˈsweɪdɪd baɪ ðæt ˌræʃəˈnæl/", tip: "Enlaza 'not entirely' con suavidad; la atenuación comunica desacuerdo rotundo pero refinado." },
        { levelLabel: "Ironía Intelectual", en: "That is an extraordinarily courageous assumption.", phonetic: "/ðæt ɪz ən ɪkˈstrɔːrdənɛrəli kəˈreɪdʒəs əˈsʌmpʃn/", tip: "En el registro británico C2, calificar algo de 'courageous' significa que es temerario o imprudente." },
        { levelLabel: "Síntesis Antagónica", en: "We must not conflate expediency with principle.", phonetic: "/wiː mʌst nɑːt kənˈfleɪt ɪkˈspiːdiənsi wɪð ˈprɪnsəpl/", tip: "Pronuncia 'conflate' con precisión /kənˈfleɪt/ sin vacilar." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'With all respect, you are completely lying about the treaty.'",
      explanationConcept: "Ruptura del protocolo pragmático en foros de alto nivel",
      options: [
        "With all due respect, that claim does not appear to reflect the empirical record.",
        "With all respect, you are completely lying about the treaty.",
        "With due respect, you have made a false talk."
      ],
      correctIndex: 0,
      ruleInsight: "En la maestría C2 jamás se lanzan acusaciones viscerales ad hominem; se cuestiona la validez empírica de la afirmación mediante perífrasis diplomáticas ('does not appear to reflect the empirical record')."
    },
    step6_mastery: {
      question: "¿Cuál intervención sintetiza con absoluta maestría C2 una postura antagónica durante una sesión plenaria?",
      options: [
        "While I concede the elegance of your model, its foundational premises remain open to formidable methodological objections.",
        "Your model is very pretty but it is completely wrong and bad.",
        "Although your model is elegant, I disagree strongly because I don't like it."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel C2 Conquistado con Honores! Dominas la pragmática, la ironía intelectual y la dialéctica de alta tensión al nivel de un diplomático o catedrático internacional."
    }
  },

  {
    id: 'c2-lesson-2',
    level: 'C2',
    unit: 6,
    unitTitle: 'Unidad 6 • Maestría y Especialización (Nivel C2)',
    code: '6.2',
    title: 'Dialectología Global y Comprensión Multiacento Extrema',
    subtitle: 'Navega acentos nativos cerrados y particularidades sintácticas británicas y transatlánticas',
    xpReward: 80,
    prerequisiteId: 'c2-lesson-1',
    step1_dialogue: {
      context: 'Mesa redonda internacional con representantes de Londres, Sídney, Dublín y Boston.',
      lines: [
        { speaker: 'BritishChair', en: "The committee were of the opinion that further devolution was paramount for regional stability.", es: "El comité sostuvo la opinión de que una mayor descentralización era primordial.", phonetic: "/ðə kəˈmɪti wɜːr əv ðiː əˈpɪnjən/" },
        { speaker: 'AussieScholar', en: "Spot on, mate. From an Antipodean perspective, centralized policymaking has consistently missed the mark.", es: "Completamente de acuerdo. Desde una perspectiva austral, la formulación centralizada de políticas ha errado el tiro constantemente.", phonetic: "/frəm ən ˌæntɪpəˈdiːən pərˈspɛktɪv/" },
        { speaker: 'IrishDelegate', en: "He hadn't ought to have dismissed the counter-evidence so casually, if you ask me.", es: "No debió haber desestimado la contra-evidencia con tanta ligereza, si me lo preguntan.", phonetic: "/hiː ˈhædənt ɔːt tuː hæv dɪsˈmɪst/" },
        { speaker: 'USProfessor', en: "I reckon we're looking at a profound paradigmatic realignment across all four jurisdictions.", es: "Considero que estamos presenciando un profundo realineamiento paradigmático en las cuatro jurisdicciones.", phonetic: "/aɪ ˈrɛkən wɪər ˈlʊkɪŋ æt/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Por qué el moderador británico dice 'The committee WERE' en lugar de 'The committee WAS'?",
      audioContextText: "The committee were of the opinion that further devolution was paramount.",
      options: [
        "Es un error gramatical involuntario del moderador.",
        "En inglés británico estándar formal, los sustantivos colectivos (committee, team, government) conciertan en plural cuando se alude a sus miembros individuales.",
        "Porque 'committee' es plural en todos los dialectos del inglés."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! El inglés británico favorece la concordancia colectiva en plural ('The committee were', 'The team have won'), mientras que el inglés estadounidense prefiere el singular ('The committee was')."
    },
    step3_builder: {
      instruction: "Construye una concordancia colectiva británica formal:",
      targetTranslationEs: "El gobierno han decidido implementar las nuevas directrices.",
      correctWords: ["The", "government", "have", "decided", "to", "implement", "the", "new", "guidelines."],
      scrambledWords: ["decided", "have", "guidelines.", "The", "government", "implement", "to", "new", "the", "has"]
    },
    step4_shadowing: {
      instruction: "Entrena la flexibilidad fonológica multiacento:",
      phrases: [
        { levelLabel: "British RP Colectivo", en: "The board were unanimous in their resolution.", phonetic: "/ðə bɔːrd wɜːr juːˈnænɪməs ɪn ðɛər ˌrɛzəˈluːʃn/", tip: "R no rótica británica suave en 'were' y 'board'." },
        { levelLabel: "Modismo Culto Antipodean", en: "That assessment is entirely spot on.", phonetic: "/ðæt əˈsɛsmənt ɪz ɪnˈtaɪərli spɒt ɒn/", tip: "'Spot on' como afirmación rotunda de precisión." },
        { levelLabel: "Sintaxis Arcaica Irlandesa", en: "You hadn't ought to worry about minor details.", phonetic: "/juː ˈhædənt ɔːt tuː ˈwʌri/", tip: "Fórmula dialectal hiberno-inglesa con 'hadn't ought'." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'British people talk wrong because they say the team are winning instead of is.'",
      explanationConcept: "Intolerancia dialectal vs competencia sociolingüística C2",
      options: [
        "Collective nouns in British English legitimately take plural verb agreement to emphasize individuals.",
        "British people talk wrong because they say the team are winning instead of is.",
        "All dialects must use singular verbs for collective groups."
      ],
      correctIndex: 0,
      ruleInsight: "La maestría C2 implica competencia sociolingüística: reconocer que la concordancia plural británica en sustantivos colectivos ('the team are') es una norma estándar prestigiosa."
    },
    step6_mastery: {
      question: "¿Cuál opción demuestra adaptabilidad sociolingüística de nivel C2?",
      options: [
        "The faculty were divided in their assessment, which prompted a prolonged symposium.",
        "The faculty was dividing in their assessment, which prompt a prolonged symposium.",
        "The faculty were divide in their assessment, what prompted an long symposium."
      ],
      correctIndex: 0,
      successMessage: "¡Nivel C2.2 Dominado! Decodificas acentos nativos cerrados y dominas la dialectología global."
    }
  },

  {
    id: 'c2-lesson-3',
    level: 'C2',
    unit: 6,
    unitTitle: 'Unidad 6 • Maestría, Especialización y Publicaciones (Nivel C2)',
    code: '6.3',
    title: 'Redacción de Papers Científicos y Abstracts IMRAD',
    subtitle: 'Publicaciones para revistas de impacto (Nature / Science) y condensación estilística',
    xpReward: 85,
    prerequisiteId: 'c2-lesson-2',
    step1_dialogue: {
      context: 'Revisión final de un manuscrito para su envío a Nature Neuroscience.',
      lines: [
        { speaker: 'SeniorAuthor', en: "How does our abstract condense the central empirical contribution within the strict two-hundred-word limit?", es: "¿Cómo condensa nuestro abstract la contribución empírica central dentro del límite estricto de 200 palabras?", phonetic: "/haʊ dʌz ˈaʊər ˈæbstrækt kənˈdɛns/" },
        { speaker: 'LeadAuthor', en: "This investigation elucidates the molecular pathways underpinning synaptic plasticity in neurodegenerative models.", es: "Esta investigación dilucida las vías moleculares que sustentan la plasticidad sináptica en modelos neurodegenerativos.", phonetic: "/ðɪs ɪnˌvɛstɪˈɡeɪʃn ɪˈluːsɪdeɪts/" },
        { speaker: 'SeniorAuthor', en: "Does it reconcile the discrepancies reported in previous literature?", es: "¿Concilia las discrepancias reportadas en la literatura previa?", phonetic: "/dʌz ɪt ˈrɛkənˌsaɪl ðə dɪˈskrɛpənsiz/" },
        { speaker: 'LeadAuthor', en: "Yes. The proposed paradigm reconciles seemingly contradictory findings through unified sensitivity analysis.", es: "Sí. El paradigma propuesto concilia hallazgos aparentemente contradictorios mediante análisis de sensibilidad unificado.", phonetic: "/ðə prəˈpoʊzd ˈpærədaɪm ˈrɛkənˌsaɪlz/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Cuál es el valor del término 'elucidates' en el abstract científico?",
      audioContextText: "This investigation elucidates the molecular pathways underpinning synaptic plasticity.",
      options: [
        "Es una palabra poética para adornar el texto.",
        "Es un verbo epistemológico de alta precisión que significa 'esclarecer o dilucidar con evidencia empírica rigurosa'.",
        "Significa que el experimento fue cancelado."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! Verbos como 'elucidate', 'underpin' y 'reconcile' son la firma léxica de las publicaciones arbitradas en revistas indexadas de élite."
    },
    step3_builder: {
      instruction: "Construye una declaración de impacto para un abstract científico C2:",
      targetTranslationEs: "Este estudio dilucida los mecanismos moleculares que sustentan la plasticidad sináptica.",
      correctWords: ["This", "study", "elucidates", "the", "molecular", "mechanisms", "underpinning", "synaptic", "plasticity."],
      scrambledWords: ["molecular", "study", "synaptic", "elucidates", "This", "plasticity.", "the", "mechanisms", "underpinning", "shows"]
    },
    step4_shadowing: {
      instruction: "Practica el ritmo de exposición de papers científicos de alto impacto:",
      phrases: [
        { levelLabel: "Verbo Académico de Vanguardia", en: "This paper elucidates the underlying mechanism.", phonetic: "/ðɪs ˈpeɪpər ɪˈluːsɪdeɪts ðiː ˌʌndərˈlaɪɪŋ ˈmɛkəˌnɪzəm/", tip: "Pronuncia 'elucidates' /ɪˈluːsɪdeɪts/ con fluidez natural sin trabar la lengua." },
        { levelLabel: "Concesión Estratégica en Defensa", en: "I concede that limitation; nonetheless, our findings hold.", phonetic: "/aɪ kənˈsiːd ðæt ˌlɪmɪˈteɪʃn ˌnʌnðəˈlɛs ˈaʊər ˈfaɪndɪŋz hoʊld/", tip: "Haz una pausa intencionada tras el punto y coma antes de 'nonetheless'." },
        { levelLabel: "Reconciliación de Literatura Científica", en: "Our framework reconciles seemingly contradictory data.", phonetic: "/ˈaʊər ˈfreɪmˌwɜːrk ˈrɛkənˌsaɪlz ˈsiːmɪŋli ˌkɑːntrəˈdɪktəri ˈdeɪtə/", tip: "Conecta 'reconciles' directamente con el adverbio /siː-mɪŋ-li/." }
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
      successMessage: "¡Nivel C2.3 Conquistado! Redactas abstracts y artículos científicos aptos para sumisión a revistas indexadas internacionales."
    }
  },

  {
    id: 'c2-lesson-4',
    level: 'C2',
    unit: 6,
    unitTitle: 'Unidad 6 • Maestría, Especialización y Publicaciones (Nivel C2)',
    code: '6.4',
    title: 'Oratoria Magistral y Defensa de Tesis Doctoral ante Sínodos',
    subtitle: 'Dialéctica escolástica, refutación inmediata y serenidad bajo cuestionamiento agresivo',
    xpReward: 90,
    prerequisiteId: 'c2-lesson-3',
    step1_dialogue: {
      context: 'Defensa oral de tesis doctoral frente a un tribunal académico internacional en Cambridge.',
      lines: [
        { speaker: 'Dean', en: "Candidate, how do you reconcile your empirical findings with the prevailing paradigm in neurological plasticity?", es: "Candidato, ¿cómo concilia sus hallazgos empíricos con el paradigma predominante en plasticidad neurológica?", phonetic: "/ˈkændɪˌdeɪt haʊ duː juː ˈrɛkənˌsaɪl/" },
        { speaker: 'Candidate', en: "I concede that our sample size is modest; nonetheless, the statistical significance remains robust across multiple sensitivity analyses.", es: "Concedo que el tamaño de nuestra muestra es modesto; no obstante, la significancia estadística se mantiene robusta en múltiples análisis de sensibilidad.", phonetic: "/aɪ kənˈsiːd ðæt ˈaʊər ˈsæmpl saɪz/" },
        { speaker: 'Dean', en: "Far from undermining your central thesis, that anomaly seems to corroborate your secondary hypothesis.", es: "Lejos de socavar su tesis central, esa anomalía parece corroborar su hipótesis secundaria.", phonetic: "/fɑːr frəm ˌʌndərˈmaɪnɪŋ jɔːr ˈsɛntrəl ˈθiːsɪs/" },
        { speaker: 'Candidate', en: "Precisely. The proposed framework reconciles seemingly contradictory phenomena reported across independent trials.", es: "Precisamente. El marco propuesto concilia fenómenos aparentemente contradictorios reportados en ensayos independientes.", phonetic: "/ðə prəˈpoʊzd ˈfreɪmˌwɜːrk ˈrɛkənˌsaɪlz/" }
      ]
    },
    step2_comprehension: {
      prompt: "¿Cómo respondió el doctorando ante el cuestionamiento sobre el tamaño de su muestra?",
      audioContextText: "I concede that our sample size is modest; nonetheless, the statistical significance remains robust.",
      options: [
        "Negó que la muestra fuera modesta y se negó a responder.",
        "Aplicó la técnica retórica de concesión estratégica ('I concede... nonetheless') demostrando honestidad científica y solidez metodológica.",
        "Pidió postergar la defensa para recolectar más datos."
      ],
      correctIndex: 1,
      explanation: "¡Exacto! En la defensa de tesis C2, la concesión estratégica desarma la crítica del sinodal reconociendo limitaciones menores para reafirmar la contundencia del resultado final."
    },
    step3_builder: {
      instruction: "Construye una refutación escolástica C2:",
      targetTranslationEs: "Lejos de socavar nuestra hipótesis, esta anomalía en realidad la corrobora.",
      correctWords: ["Far", "from", "undermining", "our", "hypothesis,", "this", "anomaly", "actually", "corroborates", "it."],
      scrambledWords: ["anomaly", "hypothesis,", "Far", "it.", "our", "from", "undermining", "corroborates", "this", "actually", "is"]
    },
    step4_shadowing: {
      instruction: "Modula la elocuencia y compostura bajo fuego cruzado académico:",
      phrases: [
        { levelLabel: "Concesión Estratégica", en: "I concede that point; nonetheless, the evidence holds.", phonetic: "/aɪ kənˈsiːd ðæt pɔɪnt ˌnʌnðəˈlɛs ðiː ˈɛvɪdəns hoʊldz/", tip: "Transmite serenidad inquebrantable en el tono de voz." },
        { levelLabel: "Giro Dialéctico", en: "Far from contradicting our model, this validates it.", phonetic: "/fɑːr frəm ˌkɑːntrəˈdɪktɪŋ ˈaʊər ˈmɑːdl ðɪs ˈvælɪdeɪts ɪt/", tip: "Pausa tras 'model' para enfatizar 'validates'." },
        { levelLabel: "Síntesis Epistemológica", en: "Our findings establish a unified paradigm.", phonetic: "/ˈaʊər ˈfaɪndɪŋz ɪˈstæblɪʃ ə ˈjuːnɪfaɪd ˈpærədaɪm/", tip: "Cierra la intervención con contundencia doctoral." }
      ]
    },
    step5_monitor: {
      faultySentence: "❌ 'You are wrong because you didn't read my thesis carefully!'",
      explanationConcept: "Pérdida inaceptable de compostura doctoral",
      options: [
        "With respect to the committee's observation, section four specifically addresses that empirical concern.",
        "You are wrong because you didn't read my thesis carefully!",
        "I don't think you understood what I wrote in the thesis."
      ],
      correctIndex: 0,
      ruleInsight: "En la defensa de grado doctoral jamás se acusa al sinodal de negligencia; se redirige cortésmente la atención al texto: 'With respect to the committee's observation, section four specifically addresses that concern'."
    },
    step6_mastery: {
      question: "¿Cuál declaración resume con máxima elocuencia la conclusión de una defensa doctoral?",
      options: [
        "In conclusion, the proposed framework reconciles disparate empirical observations, thereby establishing a robust foundation for future inquiry.",
        "In conclusion, we showed that our ideas are the best and all previous research is bad.",
        "Finally, my thesis proves everything I wanted to show to the committee."
      ],
      correctIndex: 0,
      successMessage: "¡Doctorado y Maestría Plena C2 Conquistada! Has completado el currículo universitario internacional de principio a fin, desde A1 hasta el pináculo de la academia global."
    }
  }
];

const allLessons = [
  ...a1Lessons,
  ...a2Lessons,
  ...b1Lessons,
  ...b2Lessons,
  ...c1Lessons,
  ...c2Lessons
];

const fileContent = `// ============================================================================
// FLUENTIA • BANCO CURRICULAR UNIVERSITARIO INTENSIVO (NIVELES A1 HASTA C2)
// Adaptado del Manual Oficial Universitario con la Metodología de Stephen Krashen (SLA)
// ============================================================================

export type ExerciseType = 
  | 'DIALOGUE_IMMERSION'       // Paso 1: Audio contextual narrativo de 4-6 turnos
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
  xpReward: number;
  prerequisiteId: string | null;

  // Los 6 Pasos Intensivos
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

export const COMPREHENSIVE_CURRICULUM: IntensiveLesson[] = ${JSON.stringify(allLessons, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'web', 'src', 'lib', 'curriculum-data.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`✅ File written successfully to ${outputPath} with ${allLessons.length} lessons!`);
