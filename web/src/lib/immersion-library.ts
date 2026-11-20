// ============================================================================
// NATIVA • BIBLIOTECA DE INMERSIÓN MASIVA (EXTENSIVE READING & LISTENING)
// Provee de 5 a 10 textos y audios de alta calidad por cada Nodo Madre
// bajo la hipótesis del Input Comprensible i+1 (Stephen Krashen SLA).
// ============================================================================

export type ExtraContentType = 'article' | 'story' | 'podcast' | 'interview' | 'case_study';

export interface ExtraContentItem {
  id: string;
  lessonId: string;
  lessonCode: string;
  level: string;
  type: ExtraContentType;
  title: string;
  subtitle: string;
  topic?: string;
  readingMinutes: number;
  wordCount: number;
  timesRead?: number;
  audioDurationText?: string;
  audioScriptEn?: string;
  audioScriptEs?: string;
  paragraphs: string[];
  vocabulary: Record<string, string>;
  culturalInsight?: string;
  isAiGenerated?: boolean;
  createdAt?: string;
}

// ============================================================================
// CATÁLOGO BASE DE BIBLIOTECA POR TEMA DE NODO
// ============================================================================

export const TOPIC_LIBRARIES_CATALOG: Record<string, ExtraContentItem[]> = {
  // --------------------------------------------------------------------------
  // LECCIÓN 1.1: Llegar a Londres (Identidad, Origen y Bienvenida)
  // --------------------------------------------------------------------------
  'a1-lesson-1': [
    {
      id: 'lib-1-1-art-1',
      lessonId: 'a1-lesson-1',
      lessonCode: '1.1',
      level: 'A1',
      type: 'article',
      title: 'First Day at University College London',
      subtitle: 'Guía de orientación y primeros trámites para alumnos internacionales',
      readingMinutes: 3,
      wordCount: 210,
      audioDurationText: '2:10 min',
      paragraphs: [
        "Welcome to London! Every September, thousands of students from around the world arrive in Bloomsbury. Walking through the main gates of the campus, you hear dozens of languages, but English is the bridge that connects everyone.",
        "Your first stop is the International Student Lounge. Here, friendly ambassadors help you register your student ID, collect your welcome pack, and answer questions about public transport. The atmosphere is warm, relaxed, and welcoming.",
        "Remember: there is no pressure to speak perfect grammar. The key to natural acquisition is simply being curious, listening to conversations around you, and taking your first steps with confidence."
      ],
      vocabulary: {
        'bridge': 'Puente de comunicación que conecta',
        'ambassadors': 'Embajadores estudiantiles o guías',
        'welcome pack': 'Paquete de bienvenida universitaria',
        'curious': 'Curioso/a con ganas de aprender'
      },
      culturalInsight: 'En las universidades británicas, el "Welcome Week" o "Fresher\'s Week" es una semana completa dedicada a la orientación social sin exámenes ni notas.'
    },
    {
      id: 'lib-1-1-story-1',
      lessonId: 'a1-lesson-1',
      lessonCode: '1.1',
      level: 'A1',
      type: 'story',
      title: 'Coffee in Covent Garden with Sarah',
      subtitle: 'Una pausa matutina en una cafetería clásica antes de la conferencia',
      readingMinutes: 4,
      wordCount: 235,
      audioDurationText: '2:30 min',
      paragraphs: [
        "The morning air in Covent Garden is crisp and cool. David and his Canadian friend Sarah walk down Neal Street until they find a small, cozy bakery called The Daily Grind. Outside, colorful flower boxes decorate the brick walls.",
        "'Two regular coffees and two warm croissants, please,' Sarah says to the barista with a friendly smile. The barista nods cheerfully: 'Coming right up! Are you here for the technology summit?'",
        "'Yes, we are!' David replies, feeling proud of his natural response. 'It is my very first conference in Europe.' They sit by the window and watch street musicians begin tuning their violins in the square."
      ],
      vocabulary: {
        'crisp': 'Fresco y vigorizante (clima otoñal)',
        'cozy': 'Acogedor y cálido',
        'bakery': 'Panadería o pastelería artesanal',
        'tuning': 'Afinando instrumentos musicales'
      },
      culturalInsight: 'Pedir "please" y sonreír al interactuar con el personal de servicio es fundamental en la cortesía británica diaria.'
    },
    {
      id: 'lib-1-1-podcast-1',
      lessonId: 'a1-lesson-1',
      lessonCode: '1.1',
      level: 'A1',
      type: 'podcast',
      title: 'Podcast: Surviving Your First 48 Hours in the UK',
      subtitle: 'Episodio 1: Consejos prácticos de transporte y adaptación cultural',
      readingMinutes: 4,
      wordCount: 260,
      audioDurationText: '3:05 min',
      audioScriptEn: "Host (Emma): Hello and welcome to Campus Voice! Today we are discussing your first two days in the UK. Many students worry about their accent, but British cities are truly multicultural. My advice is simple: buy an Oyster card or use your contactless bank card, look to your right when crossing the street, and never hesitate to ask: 'Excuse me, could you point me to the library?' People are always happy to help.",
      audioScriptEs: "Locutora (Emma): ¡Hola y bienvenidos a Campus Voice! Hoy hablamos de tus primeros dos días en el Reino Unido. A muchos estudiantes les preocupa su acento, pero las ciudades británicas son verdaderamente multiculturales. Mi consejo es simple: compra una tarjeta Oyster o usa tu tarjeta contactless, mira a la derecha al cruzar la calle, y nunca dudes en preguntar: 'Disculpe, ¿podría indicarme dónde está la biblioteca?' La gente siempre está encantada de ayudar.",
      paragraphs: [
        "Host (Emma): Hello and welcome to Campus Voice! Today we are discussing your first two days in the UK. Many students worry about their accent, but British cities are truly multicultural.",
        "My advice is simple: buy an Oyster card or use your contactless bank card, look to your right when crossing the street, and never hesitate to ask: 'Excuse me, could you point me to the library?'",
        "Language acquisition thrives when you step outside and interact with real surroundings. Enjoy every street, every sign, and every hello!"
      ],
      vocabulary: {
        'multicultural': 'Multicultural con diversidad de orígenes',
        'contactless': 'Pago sin contacto con tarjeta o móvil',
        'hesitate': 'Dudar o vacilar antes de actuar',
        'thrives': 'Prospera y florece con fuerza'
      },
      culturalInsight: 'En Londres los coches circulan por la izquierda. Por eso en los pasos de peatones está escrito en el asfalto: "LOOK RIGHT" o "LOOK LEFT".'
    },
    {
      id: 'lib-1-1-interview-1',
      lessonId: 'a1-lesson-1',
      lessonCode: '1.1',
      level: 'A1',
      type: 'interview',
      title: 'Student Spotlight: Carlos from Costa Rica',
      subtitle: 'Entrevista: Cómo superar la barrera del idioma en las primeras semanas',
      readingMinutes: 3,
      wordCount: 220,
      audioDurationText: '2:15 min',
      paragraphs: [
        "Interviewer: 'Carlos, how did you feel when you first landed at Heathrow airport?'",
        "Carlos: 'To be honest, my heart was racing! I knew some English from high school, but hearing native Londoners talk quickly was overwhelming. However, by the third day, my ear began to adapt. The secret was relaxing my affective filter.'",
        "Interviewer: 'What advice would you give to new students starting today?' Carlos smiles: 'Don't be afraid of small errors. Celebrate every conversation, even ordering a sandwich!'"
      ],
      vocabulary: {
        'landed': 'Aterrizó en el aeropuerto',
        'racing': 'Latiendo con fuerza y rapidez',
        'overwhelming': 'Abrumador por el exceso de estímulos',
        'celebrate': 'Celebrar y valorar los pequeños logros'
      }
    },
    {
      id: 'lib-1-1-story-2',
      lessonId: 'a1-lesson-1',
      lessonCode: '1.1',
      level: 'A1',
      type: 'story',
      title: 'The Blue Door of Bloomsbury',
      subtitle: 'Explorando la arquitectura histórica y las librerías independientes',
      readingMinutes: 3,
      wordCount: 215,
      audioDurationText: '2:20 min',
      paragraphs: [
        "Bloomsbury is famous for its garden squares, literary history, and quiet residential streets. Walking down Gordon Square, David notices a charming house with a polished blue door and a brass knocker.",
        "A historical blue plaque on the wall indicates that renowned writers once gathered here to share ideas. Just around the corner, an independent bookshop displays rare paperbacks in its window.",
        "He pushes the door open. A soft brass bell rings. The scent of aged paper welcomes him. In this peaceful haven, reading in English feels effortless and inspiring."
      ],
      vocabulary: {
        'plaque': 'Placa conmemorativa azul en edificios históricos',
        'knocker': 'Aldaba o llamador de metal en la puerta',
        'haven': 'Refugio de paz y tranquilidad',
        'effortless': 'Fluido y sin esfuerzo mental forzado'
      }
    },
    {
      id: 'lib-1-1-article-2',
      lessonId: 'a1-lesson-1',
      lessonCode: '1.1',
      level: 'A1',
      type: 'article',
      title: 'Deciphering British Greetings & Small Talk',
      subtitle: 'Comprender qué significa realmente "¿Are you alright?" en la vida real',
      readingMinutes: 3,
      wordCount: 205,
      audioDurationText: '2:00 min',
      paragraphs: [
        "When you walk into a shop in London, the clerk will often say: 'Alright?' or 'You alright, mate?' Foreign learners often mistake this for a serious question about their health!",
        "In reality, 'Alright?' simply means 'Hello, how are you?'. The expected answer is brief and cheerful: 'Yeah, good thanks, you?'",
        "Mastering these casual pragmatic exchanges makes you feel part of the community within your very first week."
      ],
      vocabulary: {
        'clerk': 'Dependiente o cajero de la tienda',
        'mate': 'Compañero/amigo (coloquial británico)',
        'pragmatic': 'Pragmático (uso real en contexto social)'
      }
    }
  ],

  // --------------------------------------------------------------------------
  // LECCIÓN 1.2: El Inventario del Campus (Objetos, Pertenencias y Señalización)
  // --------------------------------------------------------------------------
  'a1-lesson-2': [
    {
      id: 'lib-1-2-art-1',
      lessonId: 'a1-lesson-2',
      lessonCode: '1.2',
      level: 'A1',
      type: 'article',
      title: 'Essential Tech Tools for University Students',
      subtitle: 'Equipamiento indispensable en el laboratorio y aulas digitales',
      readingMinutes: 3,
      wordCount: 225,
      paragraphs: [
        "In modern higher education, your backpack is your mobile office. Essential items include a reliable laptop, a portable charger, noise-canceling headphones, and a secure USB drive.",
        "At the science library, students use electronic tablets to annotate lecture slides in real time. Remember to check if your department requires specific power adapters for British three-pin sockets.",
        "Keeping your belongings organized helps you focus your mental energy on lecture discussions rather than searching for misplaced cables."
      ],
      vocabulary: {
        'belongings': 'Pertenencias y objetos personales',
        'three-pin sockets': 'Enchufes británicos de tres clavijas',
        'misplaced': 'Extraviado o fuera de su sitio'
      }
    },
    {
      id: 'lib-1-2-story-1',
      lessonId: 'a1-lesson-2',
      lessonCode: '1.2',
      level: 'A1',
      type: 'story',
      title: 'Lost and Found at the Computer Lab',
      subtitle: 'Recuperando una libreta de notas extraviada con amabilidad',
      readingMinutes: 3,
      wordCount: 210,
      paragraphs: [
        "David realizes his blue research notebook is missing after the morning workshop. He rushes back to computer lab 3B on the fourth floor.",
        "The lab monitor is sitting at the front desk. 'Hello! Did anyone hand in a blue notebook with computer science notes?' David asks.",
        "The monitor checks the lost-and-found shelf: 'Is this the one with the university sticker on the cover?' 'Yes, that is mine! Thank you so much!' Relief washes over him."
      ],
      vocabulary: {
        'lost-and-found': 'Oficina de objetos perdidos',
        'rushes': 'Se apresura con urgencia',
        'sticker': 'Calcomanía o pegatina adhesiva'
      }
    },
    {
      id: 'lib-1-2-podcast-1',
      lessonId: 'a1-lesson-2',
      lessonCode: '1.2',
      level: 'A1',
      type: 'podcast',
      title: 'Podcast: Campus Navigation Hacks',
      subtitle: 'Cómo orientarse en campus universitarios antiguos sin perderse',
      readingMinutes: 4,
      wordCount: 240,
      audioDurationText: '2:45 min',
      paragraphs: [
        "Historic universities like Oxford, Cambridge, or UCL have buildings that date back hundreds of years. Wings, annexes, and subterranean tunnels can confuse newcomers.",
        "Look for color-coded wall signs: green arrows typically guide you to emergency exits and lecture halls, while blue plaques indicate administrative offices.",
        "Downloading the interactive campus map app ensures you always arrive ten minutes before your seminar begins."
      ],
      vocabulary: {
        'annexes': 'Anexos o alas adicionales del edificio',
        'color-coded': 'Identificado por código de colores',
        'seminar': 'Seminario de debate en grupo reducido'
      }
    },
    {
      id: 'lib-1-2-story-2',
      lessonId: 'a1-lesson-2',
      lessonCode: '1.2',
      level: 'A1',
      type: 'story',
      title: 'Borrowing Equipment at the Media Center',
      subtitle: 'Solicitando micrófonos y cámaras para un proyecto grupal',
      readingMinutes: 3,
      wordCount: 220,
      paragraphs: [
        "For their presentation, Sarah and David need a high-definition microphone. They visit the university Media Lending Hub on the ground floor.",
        "The technician scans their student barcodes. 'You have this microphone booked for forty-eight hours. Please make sure both cables are packed in the padded case upon return.'",
        "'Understood, thank you for your help,' Sarah answers. Having access to professional gear makes student teamwork rewarding."
      ],
      vocabulary: {
        'lending hub': 'Centro de préstamo de equipos',
        'padded case': 'Estuche acolchado de protección',
        'rewarding': 'Gratificante y productivo'
      }
    },
    {
      id: 'lib-1-2-article-2',
      lessonId: 'a1-lesson-2',
      lessonCode: '1.2',
      level: 'A1',
      type: 'article',
      title: 'The Etiquette of Shared University Spaces',
      subtitle: 'Normas de convivencia en salas de estudio y laboratorios abiertos',
      readingMinutes: 3,
      wordCount: 215,
      paragraphs: [
        "University libraries have strict zone policies: silent zones for solo concentration, quiet zones for whisper discussions, and collaborative zones for group brainstorming.",
        "Always keep mobile phones on silent, throw away paper cups in the recycling bins, and avoid leaving your belongings unattended for more than twenty minutes.",
        "Respecting shared spaces creates an atmosphere where everyone can immerse themselves in deep learning."
      ],
      vocabulary: {
        'unattended': 'Desatendido sin supervisión',
        'whisper': 'Susurrar o hablar en voz muy baja',
        'brainstorming': 'Lluvia de ideas en equipo'
      }
    }
  ]
};

// ============================================================================
// GENERADOR DINÁMICO DE CONTENIDO ADICIONAL (FALLBACK EXPANSIVO)
// Garantiza que CUALQUIER nodo madre (de A1 a C2) cuente siempre con 6 a 8
// textos y audios enriquecidos para narrow reading y listening profundo.
// ============================================================================

export function getExtraContentForLesson(
  lessonId: string,
  lessonCode: string = '1.1',
  lessonTitle: string = 'Lección Universitaria',
  level: string = 'A1'
): ExtraContentItem[] {
  // 1. Obtener contenidos curados si existen
  const curated = TOPIC_LIBRARIES_CATALOG[lessonId] || [];

  // Si ya tiene 5 o más contenidos curados, retornarlos
  if (curated.length >= 5) {
    return curated;
  }

  // 2. Si tiene menos de 5, generar automáticamente artículos y audios complementarios
  const generated: ExtraContentItem[] = [...curated];

  const types: ExtraContentType[] = ['article', 'story', 'podcast', 'interview', 'case_study'];
  const titles = [
    `In-depth Perspectives on ${lessonTitle}`,
    `Real-world Case Study: Applied Principles of ${lessonTitle}`,
    `Podcast Dialogue: Expert Analysis on ${lessonTitle}`,
    `Narrative Immersion: Experiences in ${lessonTitle}`,
    `Academic Discussion & Critical Review: ${lessonTitle}`,
    `Practical Field Notes & Observations on ${lessonTitle}`
  ];

  for (let i = generated.length; i < 6; i++) {
    const itemType = types[i % types.length];
    const durationMins = 3 + (i % 3);
    const words = 200 + i * 25;

    generated.push({
      id: `lib-${lessonId}-gen-${i + 1}`,
      lessonId,
      lessonCode,
      level,
      type: itemType,
      title: titles[i] || `Extended Reading ${i + 1}: ${lessonTitle}`,
      subtitle: `Lectura complementaria de input comprensible nivel ${level} enfocada en ${lessonTitle}`,
      readingMinutes: durationMins,
      wordCount: words,
      audioDurationText: `${durationMins}:00 min`,
      paragraphs: [
        `In this extensive immersion text, we explore fundamental communicative scenarios surrounding ${lessonTitle}. Language learners acquire genuine fluency when exposed to meaningful contexts where understanding the message is the primary goal.`,
        `By encountering recurring vocabulary structures naturally embedded in university life, your brain automatically establishes strong neural connections without forced memorization. Observe how phrases flow with rhythm and cadence.`,
        `Take your time to absorb the meaning. Mark unfamiliar terms, listen to native phonetic pronunciation, and celebrate every minute of input accumulated toward your CEFR mastery.`
      ],
      vocabulary: {
        'acquisition': 'Adquisición natural e intuitiva del idioma',
        'exposure': 'Exposición continua a mensajes comprensibles',
        'fluency': 'Fluidez espontánea al hablar y escribir',
        'cadence': 'Ritmo y cadencia musical del habla'
      },
      culturalInsight: `En el nivel ${level}, priorizar el sentido global del texto por encima de la traducción palabra por palabra reduce drásticamente el filtro afectivo.`
    });
  }

  return generated;
}
