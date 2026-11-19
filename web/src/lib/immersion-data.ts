// ============================================================================
// FLUENTIA • BIBLIOTECA DE INMERSIÓN MASIVA (NARROW READING KRASHENIANO)
// Textos graduados (200 - 450 palabras) con reciclaje léxico temático (Narrow Reading)
// Diseñados bajo la hipótesis del Input Comprensible i+1 y filtro afectivo zen
// ============================================================================

export interface ImmersionStory {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  themeSeries: string; // Serie temática para Narrow Reading (mismo contexto, vocabulario reciclado)
  title: string;
  subtitle: string;
  wordCount: number;
  readingMinutes: number;
  audioDurationText: string;
  unlockedByLessonId: string;
  summary: string;
  paragraphs: string[];
  vocabularySpotlight: { word: string; meaning: string; phonetic: string }[];
  voluntaryCheck?: {
    question: string;
    options: string[];
    correctIndex: number;
    insight: string;
  };
}

export const IMMERSION_STORIES: ImmersionStory[] = [
  // ==========================================================================
  // NIVEL A1 • CRÓNICAS DE COVENT GARDEN Y VIDA EN EL CAMPUS
  // ==========================================================================
  {
    id: 'story-a1-1',
    level: 'A1',
    themeSeries: 'Covent Garden Chronicles (Parte 1)',
    title: 'First Morning in London',
    subtitle: 'David despierta en Bloomsbury y da sus primeros pasos hacia el centro universitario',
    wordCount: 220,
    readingMinutes: 3,
    audioDurationText: '2m 15s',
    unlockedByLessonId: 'a1-lesson-1',
    summary: 'David llega a su residencia cerca de Russell Square. Describe la habitación, el clima fresco de la mañana y su primera conversación en la recepción.',
    paragraphs: [
      "The sun rises quietly over the brick buildings of Russell Square. David wakes up at seven o'clock in his university residence room. The room is small but very comfortable. There is a wooden desk near the window, a blue lamp, and a shelf with his notebook.",
      "He opens the window and feels the fresh autumn air of London. Outside, people are walking to the underground station with hot coffee in their hands. David is excited because today is his first day at the international student center in Covent Garden.",
      "He walks down the stairs to the reception desk. The receptionist, Sarah, smiles and says: 'Good morning! Is this your first time in the city?' David smiles back and answers: 'Yes, it is. I am from Nicaragua, and I am very happy to be here.' Sarah hands him a colorful city map and marks the fastest walking route.",
      "David steps into the street. The red buses pass by, and the sound of English is everywhere. He does not need to translate every word in his head; he simply looks, listens, and takes his first confident step forward into London."
    ],
    vocabularySpotlight: [
      { word: 'brick buildings', meaning: 'edificios de ladrillo rojo típicos británicos', phonetic: '/brɪk ˈbɪldɪŋz/' },
      { word: 'autumn air', meaning: 'aire fresco de otoño', phonetic: '/ˈɔːtəm ɛər/' },
      { word: 'hands him', meaning: 'le entrega en mano', phonetic: '/hændz hɪm/' }
    ],
    voluntaryCheck: {
      question: "¿Cómo se siente David en su primera mañana al salir a la calle?",
      options: [
        "Nervioso y buscando un diccionario para traducir cada letrero.",
        "Emocionado y receptivo, escuchando el inglés que lo rodea de forma natural.",
        "Confundido porque se perdió camino al aeropuerto."
      ],
      correctIndex: 1,
      insight: "David experimenta un filtro afectivo bajo: se enfoca en absorber el entorno sin presionarse a traducir mentalmente."
    }
  },
  {
    id: 'story-a1-2',
    level: 'A1',
    themeSeries: 'Covent Garden Chronicles (Parte 2)',
    title: 'A Quiet Afternoon at the Student Library',
    subtitle: 'Navegar los pasillos de la biblioteca y pedir ayuda al bibliotecario',
    wordCount: 240,
    readingMinutes: 3,
    audioDurationText: '2m 30s',
    unlockedByLessonId: 'a1-lesson-2',
    summary: 'David explora la biblioteca de University College London, buscando libros para el taller y solicitando su tarjeta de lector.',
    paragraphs: [
      "The university library is warm, quiet, and smells of old paper and fresh coffee. High wooden arches support the ceiling, and tall windows let in the soft gray light of London. Students from dozens of countries sit at long oak tables with their laptops.",
      "David walks through the aisles of section B. He is looking for introductory books on renewable energy. On the third shelf, there is a thick volume with a blue cover. Beside it, an electronic tablet displays the library catalog.",
      "He approaches the service counter where a librarian with silver glasses is organizing returned books. 'Excuse me,' David says politely, 'could you please tell me where the study rooms are?'",
      "The librarian nods gently. 'Of course. The silent study area is on the second floor, right next to the computer lab. You can use your student card to enter.'",
      "David thanks her and walks upstairs. He finds a quiet desk by the window. As he reads through the first chapter, he notices how many words he already recognizes from his morning dialogues. Language acquisition is quietly happening."
    ],
    vocabularySpotlight: [
      { word: 'wooden arches', meaning: 'arcos de madera del techo', phonetic: '/ˈwʊdn ˈɑːrtʃɪz/' },
      { word: 'aisles', meaning: 'pasillos entre estanterías', phonetic: '/aɪlz/' },
      { word: 'approaches', meaning: 'se aproxima con naturalidad', phonetic: '/əˈproʊtʃɪz/' }
    ],
    voluntaryCheck: {
      question: "¿Dónde se encuentra la sala de estudio silencioso según la bibliotecaria?",
      options: [
        "En el sótano junto a la cafetería.",
        "En el segundo piso, junto al laboratorio de computación.",
        "Afuera del edificio principal."
      ],
      correctIndex: 1,
      insight: "Las indicaciones espaciales sencillas ('second floor, next to') son las primeras que el cerebro automatiza con input natural."
    }
  },
  {
    id: 'story-a1-3',
    level: 'A1',
    themeSeries: 'Covent Garden Chronicles (Parte 3)',
    title: 'The Coffee Shop Conversation',
    subtitle: 'Compartir una mesa y ordenar comida en un café británico',
    wordCount: 235,
    readingMinutes: 3,
    audioDurationText: '2m 25s',
    unlockedByLessonId: 'a1-lesson-3',
    summary: 'David pide un té caliente y un sándwich, y entabla una breve charla amistosa con una estudiante de arquitectura.',
    paragraphs: [
      "At four o'clock, the rain begins to fall over London. David walks into a small, cozy coffee shop on Gower Street. The air is filled with the aroma of roasted coffee beans and warm cinnamon pastries.",
      "He stands in line and listens to the customers in front of him. When it is his turn, the barista smiles: 'Hello there, what can I get for you today?' David replies naturally: 'A medium black tea and a cheese toastie, please.' The barista asks: 'To have here or takeaway?' David responds: 'To have here, thank you.'",
      "Since the coffee shop is busy, David asks an international student sitting alone at a small round table: 'Is this seat free?' The student smiles warmly: 'Yes, absolutely, please sit down!'",
      "Her name is Emma, and she studies architecture. Over the next fifteen minutes, they chat about their courses, the city weather, and how different London feels from their hometowns. David realizes he is having a real, meaningful conversation in English without feeling anxious."
    ],
    vocabularySpotlight: [
      { word: 'cinnamon pastries', meaning: 'pasteles de canela', phonetic: '/ˈsɪnəmən ˈpeɪstriz/' },
      { word: 'takeaway', meaning: 'para llevar (término británico habitual)', phonetic: '/ˈteɪkəweɪ/' },
      { word: 'is this seat free?', meaning: '¿está libre este asiento? (fórmula cortés habitual)', phonetic: '/ɪz ðɪs siːt friː/' }
    ]
  },

  // ==========================================================================
  // NIVEL A2 • RELATOS CIENTÍFICOS Y EXPERIENCIAS COTIDIANAS
  // ==========================================================================
  {
    id: 'story-a2-1',
    level: 'A2',
    themeSeries: 'Scientific Pioneers & Daily Discoveries',
    title: 'The Day the Apple Fell: History at Trinity College',
    subtitle: 'Caminar por los jardines donde Isaac Newton formuló la ley de gravitación',
    wordCount: 280,
    readingMinutes: 4,
    audioDurationText: '3m 00s',
    unlockedByLessonId: 'a2-lesson-1',
    summary: 'Un recorrido por el patio de Cambridge recordando cómo los científicos del pasado observaban la naturaleza antes de redactar sus leyes.',
    paragraphs: [
      "During their weekend trip to Cambridge, David and his workshop classmates walked through the historic gates of Trinity College. The ancient stone buildings stood tall against the afternoon sky, surrounded by emerald-green lawns.",
      "Near the entrance of the Great Court, their guide pointed to a distinctive green tree. 'That apple tree,' she explained, 'is a descendant of the famous tree that grew in Isaac Newton's garden in Woolsthorpe. In sixteen sixty-six, when Cambridge closed because of the plague, Newton returned home and spent months observing nature.'",
      "David stopped to look at the branches. Newton did not invent gravity while memorizing rules from a textbook; he watched an apple fall straight to the ground and asked himself a simple question: why does the apple always descend perpendicular to the earth?",
      "The guide continued: 'Newton observed patterns over many years. He tested his ideas with mathematics, but everything started with curiosity and careful observation.'",
      "David reflected on this idea. Learning English follows a very similar path: instead of memorizing abstract grammar charts, real mastery begins by observing natural language, listening to native patterns, and letting the brain discover the underlying harmony."
    ],
    vocabularySpotlight: [
      { word: 'emerald-green lawns', meaning: 'jardines de césped verde esmeralda', phonetic: '/ˈɛmərəld ɡriːn lɔːnz/' },
      { word: 'descendant', meaning: 'descendiente directo', phonetic: '/dɪˈsɛndənt/' },
      { word: 'perpendicular', meaning: 'en línea recta hacia abajo', phonetic: '/ˌpɜːrpənˈdɪkjələr/' }
    ]
  },
  {
    id: 'story-a2-2',
    level: 'A2',
    themeSeries: 'Scientific Pioneers & Daily Discoveries',
    title: 'Choosing Between Two Cloud Servers',
    subtitle: 'Debate de laboratorio comparando rendimiento, costo y confiabilidad',
    wordCount: 295,
    readingMinutes: 4,
    audioDurationText: '3m 15s',
    unlockedByLessonId: 'a2-lesson-2',
    summary: 'El equipo de David evalúa dos proveedores de servidores para su proyecto de datos universitario.',
    paragraphs: [
      "On Tuesday morning, the research team met in the computing lab to make an important technical decision. Their data project required a cloud server that could handle heavy numerical simulations without crashing.",
      "Elena opened the comparison chart on the large wall monitor. 'We have two main options,' she began. 'Server Alpha is significantly faster than Server Beta, but it is also much more expensive per gigabyte. Server Beta, on the other hand, offers better customer support and has a simpler backup system.'",
      "David analyzed the latency metrics. 'If we look at peak university hours, Server Alpha shows thirty percent fewer delays. However, our monthly budget is limited. Is Server Alpha really worth the extra cost, or can we optimize Server Beta to meet our targets?'",
      "The team discussed the trade-offs for over an hour. They compared storage capacity, security protocols, and annual pricing plans. In the end, they agreed on a balanced hybrid solution: using Server Beta for routine development and reserving Server Alpha for final benchmark tests.",
      "David felt a deep sense of accomplishment. He had not only contributed to an authentic technical decision, but he had done so entirely in English, comparing complex features and expressing nuanced opinions effortlessly."
    ],
    vocabularySpotlight: [
      { word: 'significantly faster', meaning: 'notablemente más rápido', phonetic: '/sɪɡˈnɪfɪkəntli ˈfæstər/' },
      { word: 'trade-offs', meaning: 'compromisos o concesiones entre ventajas y desventajas', phonetic: '/ˈtreɪd ɒfs/' },
      { word: 'benchmark tests', meaning: 'pruebas de rendimiento estandarizadas', phonetic: '/ˈbɛntʃmɑːrk tɛsts/' }
    ]
  },

  // ==========================================================================
  // NIVEL B1 • INDEPENDENCIA TÉCNICA Y PROYECTOS INTERNACIONALES
  // ==========================================================================
  {
    id: 'story-b1-1',
    level: 'B1',
    themeSeries: 'The Academic Journey (Parte 1)',
    title: 'Building the Portfolio: What We Have Achieved',
    subtitle: 'El puente entre el esfuerzo pasado y las oportunidades académicas presentes',
    wordCount: 340,
    readingMinutes: 5,
    audioDurationText: '3m 45s',
    unlockedByLessonId: 'b1-lesson-1',
    summary: 'David redacta su portafolio de investigación para presentar ante el comité de becas de la facultad.',
    paragraphs: [
      "The deadline for the international scholarship application was only two weeks away. Sitting at his desk with a cup of Earl Grey tea, David opened his research portfolio folder. Over the past eight months, his academic life had transformed dramatically.",
      "'I have lived in London since October,' he wrote in his opening statement, 'and during this period, I have collaborated with engineers from six different countries. We have designed an open-source environmental monitoring device that has already collected over fifty thousand data points across urban parks.'",
      "He paused to review the phrasing. The present perfect came naturally to him now: it wasn't a dry grammatical rule about 'have' plus a participle, but a vital conceptual bridge. It connected the tireless experiments he had conducted in the laboratory with the real-world value he was delivering today.",
      "He had already published preliminary findings in the department newsletter, but he had not yet presented them to the senior faculty board. That presentation was scheduled for next Thursday. In his portfolio, he carefully documented his methodology, the challenges his team had overcome, and the prospective applications of their research.",
      "As he closed his laptop, David realized that his confidence had evolved. Speaking English was no longer a conscious performance or a test of memory; it had become an indispensable instrument for communicating his passions, his science, and his vision for the future."
    ],
    vocabularySpotlight: [
      { word: 'transformed dramatically', meaning: 'se ha transformado de forma rotunda', phonetic: '/trænsˈfɔːrmd drəˈmætɪkli/' },
      { word: 'conceptual bridge', meaning: 'puente conceptual entre pasado y presente', phonetic: '/kənˈsɛptʃuəl brɪdʒ/' },
      { word: 'tireless experiments', meaning: 'experimentos incansables', phonetic: '/ˈtaɪərlɪs ɪkˈspɛrɪmənts/' }
    ]
  },

  // ==========================================================================
  // NIVEL B2 • DISCURSO CRÍTICO Y DEBATE ACADÉMICO
  // ==========================================================================
  {
    id: 'story-b2-1',
    level: 'B2',
    themeSeries: 'Critical Debates in Modern Science',
    title: 'The Artificial Intelligence Ethics Forum',
    subtitle: 'Reportar citas de expertos, contrastar hipótesis y defender principios',
    wordCount: 380,
    readingMinutes: 5,
    audioDurationText: '4m 10s',
    unlockedByLessonId: 'b2-lesson-1',
    summary: 'Un debate en el auditorio de Oxford debatiendo la autoría y la transparencia de los modelos algorítmicos en la ciencia médica.',
    paragraphs: [
      "The amphitheater of the Oxford Martin School was packed with researchers, philosophers, and software engineers. The topic on the agenda was both urgent and contentious: to what extent should autonomous diagnostic models be permitted to recommend invasive medical treatments without explicit human corroboration?",
      "Professor Al-Mansoor argued that machine learning systems had already demonstrated diagnostic accuracy rates superior to those of senior radiologists. 'If empirical data confirms that algorithmic accuracy minimizes mortal diagnostic oversights,' she asserted, 'then withholding deployment constitutes an ethical failure.'",
      "However, Dr. Catherine Vance countered with cautionary nuance. She pointed out that while predictive metrics appeared robust in controlled laboratory trials, underlying datasets frequently harbored demographic sampling biases that could exacerbate systemic health disparities. 'Correlation must never be conflated with causal pathology,' she reminded the audience.",
      "David listened intently from the third row, taking detailed notes on the dialectical strategies employed by both speakers. He noticed how masterfully they utilized discourse markers—such as 'on the premise that', 'notwithstanding the evident gains', and 'conversely'—to qualify their claims without sounding dismissive.",
      "When the floor was opened for floor inquiries, David stepped up to the microphone. Citing recent reproducibility studies, he posed a question regarding how peer-review boards should calibrate auditing protocols. The panel commended the inquiry, and for the next ten minutes, his question anchored the focal debate of the evening."
    ],
    vocabularySpotlight: [
      { word: 'contentious', meaning: 'polémico, sujeto a vivo debate', phonetic: '/kənˈtɛnʃəs/' },
      { word: 'withholding deployment', meaning: 'retener o frenar la implementación', phonetic: '/wɪðˈhoʊldɪŋ dɪˈplɔɪmənt/' },
      { word: 'conflated with', meaning: 'confundido o equiparado indebidamente con', phonetic: '/kənˈfleɪtɪd wɪð/' }
    ]
  },

  // ==========================================================================
  // NIVEL C1 • ELEGANCIA ESTILÍSTICA Y RETÓRICA AVANZADA
  // ==========================================================================
  {
    id: 'story-c1-1',
    level: 'C1',
    themeSeries: 'Advanced Rhetoric & Scholarly Writing',
    title: 'The Art of Academic Hedging: Writing for Science',
    subtitle: 'Cómo expresar certeza rigurosa sin caer en dogmatismos ni exageraciones',
    wordCount: 410,
    readingMinutes: 6,
    audioDurationText: '4m 30s',
    unlockedByLessonId: 'c1-lesson-1',
    summary: 'La revisión editorial de un artículo científico donde el profesor enseña a David el poder de la mitigación epistémica (hedges).',
    paragraphs: [
      "In the paneled office overlooking the college gardens, Professor Sterling placed David's draft manuscript upon the desk. Red pen marks were scattered across the margins, not indicating grammatical errors, but rather signaling stylistic recalibrations.",
      "'David,' the professor remarked softly, 'your empirical findings are compelling, yet your assertions border on rhetorical overreach. Observe line fourteen: you write that the empirical results prove that urban microclimates are irreversibly altered by synthetic pavement. In peer-reviewed scholarly literature, one rarely proves; one demonstrates, suggests, or provides substantive evidence for.'",
      "Sterling picked up the pen and amended the clause: 'The empirical findings provide compelling evidence suggesting that urban microclimates may undergo significant perturbations.'",
      "David observed the alteration. The revised sentence did not weaken the scholarship; on the contrary, it fortified it against adversarial critique. By deploying epistemic hedges—modal auxiliaries such as 'may', adverbs such as 'substantively', and cognitive verbs such as 'indicate'—the claim gained academic authority.",
      "Through this editorial dialogue, David internalized the profound distinction between colloquial assertion and scholarly discourse. True fluency at the C1 level was not merely an expansion of lexicon; it was an intimate appreciation of discursive humility, intellectual precision, and the stylistic cadence that academic peer reviewers respect."
    ],
    vocabularySpotlight: [
      { word: 'rhetorical overreach', meaning: 'extralimitación retórica o exageración no respaldada', phonetic: '/rɪˈtɔːrɪkl ˈoʊvərriːtʃ/' },
      { word: 'epistemic hedges', meaning: 'atenuadores de cautela científica para no sonar dogmático', phonetic: '/ˌɛpɪˈstiːmɪk ˈhɛdʒɪz/' },
      { word: 'adversarial critique', meaning: 'crítica rigurosa o fiscalizadora de un revisor par', phonetic: '/ˌædvərˈsɛriəl krɪˈtiːk/' }
    ]
  },

  // ==========================================================================
  // NIVEL C2 • MAESTRÍA DOCTORAL, DIPLOMACIA Y DEFENSA DE TESIS
  // ==========================================================================
  {
    id: 'story-c2-1',
    level: 'C2',
    themeSeries: 'The Doctoral Defense & High Diplomacy',
    title: 'The Viva Voce: Standing Before the Oxford Tribunal',
    subtitle: 'La prueba suprema: responder con aplomo y agudeza dialéctica ante el tribunal de tesis',
    wordCount: 440,
    readingMinutes: 6,
    audioDurationText: '4m 50s',
    unlockedByLessonId: 'c2-lesson-4',
    summary: 'El momento culminante de la carrera académica de David en el Divinity School de Oxford defendiendo su tesis doctoral.',
    paragraphs: [
      "The heavy oak doors of the Divinity School closed behind David, muffling the distant chime of the Radcliffe Camera clock. Across the leather-topped conference table sat the internal and external examiners, their academic gowns casting solemn shadows against the fifteenth-century stone vaulting.",
      "The external examiner, a renowned professor from the Max Planck Institute, leaned forward with a penetrating gaze. 'Candidate,' he commenced, his tone measured and deliberate, 'while your mathematical framework is ostensibly elegant, one cannot help but question whether your ontological reliance upon Bayesian priors does not fundamentally compromise the replicability of your predictive modeling in volatile stochastic regimes.'",
      "In that critical instant, any lingering tendency to translate from his native tongue vanished entirely. David drew a calm breath, feeling the culmination of years of immersive language acquisition. His response was immediate, poised, and rhetorically formidable.",
      "'With all due respect to the examiner’s critique,' David replied steadily, 'the introduction of informative priors does not constitute an epistemological concession to subjectivity. On the contrary, when calibrated against longitudinal observational constraints, our Bayesian architecture systematically diminishes model variance where classical frequentist approximations catastrophically collapse.'",
      "The examiner paused, exchanged a subtle, approving glance with his colleague, and made a quiet annotation in his dossier. The cross-examination continued for three rigorous hours, touching on every nuanced implication of the dissertation. When the tribunal finally rose and extended their hands to address him as 'Doctor,' David realized that he had achieved complete communicative transcendence: the English language was no longer an external subject he studied, but a natural extension of his mind."
    ],
    vocabularySpotlight: [
      { word: 'viva voce', meaning: 'defensa oral de tesis doctoral en universidades británicas', phonetic: '/ˈvaɪvə ˈvoʊtsi/' },
      { word: 'ontological reliance', meaning: 'dependencia sobre los supuestos fundamentales de la realidad', phonetic: '/ˌɑːntəˈlɑːdʒɪkl rɪˈlaɪəns/' },
      { word: 'communicative transcendence', meaning: 'trascendencia comunicativa absoluta donde la lengua es transparente al pensamiento', phonetic: '/kəˈmjuːnɪkətɪv trænˈsɛndəns/' }
    ]
  }
];
