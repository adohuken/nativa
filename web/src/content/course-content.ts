// ============================================================================
// FLUENTIA • ARQUITECTURA DE CONTENIDO: NODOS MADRE Y SUB-NODOS DE INMERSIÓN
// Estructura: courseContent -> moduleId -> lessonId -> subNodes
// ============================================================================

export type SubNodeType = 'reading' | 'listening' | 'srs';

export interface ExtensiveStory {
  id: string;
  title: string;
  wordCount: number;
  readingMinutes: number;
  paragraphs: string[];
  vocabulary: Record<string, string>;
}

export interface ReadingSubNodeContent {
  title: string;
  summary: string;
  wordCount: number;
  readingMinutes: number;
  paragraphs: string[];
  vocabulary: Record<string, string>; // palabra clave en minúsculas -> definición en español
  extensiveStories?: ExtensiveStory[];
}

export interface ListeningSubNodeContent {
  title: string;
  audioDurationText: string;
  audioScriptEn: string;
  audioScriptEs: string;
  culturalInsight: string;
  transcriptLines: {
    speaker: string;
    en: string;
    es: string;
    phonetic?: string;
  }[];
}

export interface SrsSubNodeContent {
  title: string;
  cardCount: number;
  targetPhrases: {
    en: string;
    es: string;
    phonetic?: string;
    context: string;
  }[];
}

export interface SubNode {
  id: string; // ej: "a1-lesson-1-reading"
  motherNodeId: string; // ej: "a1-lesson-1"
  type: SubNodeType;
  title: string;
  label: string;
  durationMinutes: number;
  xpReward: number;
  content: {
    reading?: ReadingSubNodeContent;
    listening?: ListeningSubNodeContent;
    srs?: SrsSubNodeContent;
  };
}

export interface LessonContent {
  lessonId: string;
  lessonCode: string;
  title: string;
  subNodes: SubNode[];
}

export interface ModuleContent {
  moduleId: string;
  unitNumber: number;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  title: string;
  lessons: Record<string, LessonContent>;
}

export interface CourseContent {
  modules: Record<string, ModuleContent>;
}

// ============================================================================
// BANCO DE SUB-NODOS DE INMERSIÓN (MVP GRADUADO)
// ============================================================================

export const COURSE_CONTENT: CourseContent = {
  modules: {
    'module-1': {
      moduleId: 'module-1',
      unitNumber: 1,
      level: 'A1',
      title: 'Unidad 1 • Fundamentos y Supervivencia Universitaria',
      lessons: {
        'a1-lesson-1': {
          lessonId: 'a1-lesson-1',
          lessonCode: '1.1',
          title: 'Llegar a Londres: quién soy y de dónde vengo',
          subNodes: [
            {
              id: 'a1-lesson-1-reading',
              motherNodeId: 'a1-lesson-1',
              type: 'reading',
              title: 'Lectura de Inmersión: Arriving at the Conference',
              label: 'Lectura Guiada',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                reading: {
                  title: 'Hello London: At the Covent Garden Conference',
                  summary: 'David se presenta en la conferencia de Covent Garden en Londres junto a su amiga Sarah de Canadá.',
                  wordCount: 84,
                  readingMinutes: 2,
                  paragraphs: [
                    'Hello! My name is David. I am from Nicaragua, but today I am in London. I am at a big conference in Covent Garden. It is my first time in the UK.',
                    'I am a student at the university. I study computer science. I am twenty years old. I am here with my friend Sarah. She is a student too. She is from Canada.',
                    'We are very happy to be here. The conference starts today. We are ready for the class. Are you ready too?'
                  ],
                  vocabulary: {
                    'conference': 'Conferencia (reunión académica o profesional)',
                    'student': 'Estudiante (persona que cursa estudios)',
                    'friend': 'Amigo / amiga',
                    'from': 'De, proveniente de (origen o procedencia)',
                    'ready': 'Listo / lista, preparado/a',
                    'welcome': 'Bienvenido / bienvenida'
                  },
                  extensiveStories: [
                    {
                      id: 'ext-1-1-a',
                      title: 'Meeting Classmates at the Welcome Desk',
                      wordCount: 145,
                      readingMinutes: 2,
                      paragraphs: [
                        'The conference room is full of students from different countries. Sarah introduces David to Michael. Michael is twenty-one years old and he is from Germany. He studies computer science too.',
                        'They sit together at a big wooden table. "Are you ready for the keynote speech?" Michael asks with a smile. "Yes, we are very excited," David replies. "London is an amazing city."',
                        'The professor walks to the front of the room. "Welcome to our international conference," she says. Everyone claps. David feels confident, happy, and completely ready to learn.'
                      ],
                      vocabulary: {
                        'conference': 'Conferencia',
                        'student': 'Estudiante',
                        'friend': 'Amigo/a',
                        'from': 'De (origen)',
                        'ready': 'Listo/a',
                        'welcome': 'Bienvenido/a'
                      }
                    },
                    {
                      id: 'ext-1-1-b',
                      title: 'A Coffee Before the First Lecture',
                      wordCount: 140,
                      readingMinutes: 2,
                      paragraphs: [
                        'Before the conference starts, David and Sarah go to the small café near Covent Garden. The barista is very polite. "Good morning! Welcome to London. What can I get for you today?"',
                        'David smiles and says: "Hello! I am David. Can we have two cups of black coffee, please?" Sarah adds: "And two croissants, please." They sit by the window and watch the red buses.',
                        '"This city is very big, but I am not nervous," Sarah says. "We have our badges, our friend Michael is here, and our class starts in fifteen minutes." David agrees: "We are completely ready."'
                      ],
                      vocabulary: {
                        'conference': 'Conferencia',
                        'student': 'Estudiante',
                        'friend': 'Amigo/a',
                        'ready': 'Listo/a',
                        'welcome': 'Bienvenido/a'
                      }
                    }
                  ]
                }
              }
            },
            {
              id: 'a1-lesson-1-listening',
              motherNodeId: 'a1-lesson-1',
              type: 'listening',
              title: 'Escucha Comprensiva: Arriving at the London Hotel',
              label: 'Inmersión Sonora',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                listening: {
                  title: 'Checking in at the London Hotel',
                  audioDurationText: '1:15 min',
                  audioScriptEn: 'Receptionist: Good morning! Welcome to the London Hotel. Are you here for the conference? David: Yes, I am. My name is David Abarca. Receptionist: Are you from Spain? David: No, I am not. I am from Nicaragua. Receptionist: Oh, nice! And who is she? David: This is Sarah. She is my friend. She is from Canada. We are students. Receptionist: Perfect. Here are your keys. You are in room 304.',
                  audioScriptEs: 'Recepcionista: ¡Buenos días! Bienvenido al London Hotel. ¿Está aquí por la conferencia? David: Sí, así es. Mi nombre es David Abarca. Recepcionista: ¿Es de España? David: No, soy de Nicaragua. Recepcionista: ¡Oh, qué bien! ¿Y quién es ella? David: Esta es Sarah. Es mi amiga. Es de Canadá. Somos estudiantes. Recepcionista: Perfecto. Aquí tienen sus llaves. Están en la habitación 304.',
                  culturalInsight: 'En el Reino Unido, es muy común saludar con un "Good morning" o "Good afternoon" a recepcionistas y desconocidos. Es un signo de cortesía.',
                  transcriptLines: [
                    {
                      speaker: 'Receptionist',
                      en: 'Good morning! Welcome to the London Hotel. Are you here for the conference?',
                      es: '¡Buenos días! Bienvenido al London Hotel. ¿Está aquí por la conferencia?',
                      phonetic: '/ɡʊd ˈmɔːnɪŋ ˈwɛlkəm tuː ðə ˈlʌndən həʊˈtɛl/'
                    },
                    {
                      speaker: 'David',
                      en: 'Yes, I am. My name is David Abarca.',
                      es: 'Sí, así es. Mi nombre es David Abarca.',
                      phonetic: '/jɛs aɪ æm maɪ neɪm ɪz ˈdeɪvɪd əˈbɑːrkə/'
                    },
                    {
                      speaker: 'Receptionist',
                      en: 'Are you from Spain?',
                      es: '¿Es usted de España?',
                      phonetic: '/ɑːr juː frɒm speɪn/'
                    },
                    {
                      speaker: 'David',
                      en: 'No, I am not. I am from Nicaragua.',
                      es: 'No, no lo soy. Soy de Nicaragua.',
                      phonetic: '/nəʊ aɪ æm nɒt aɪ æm frɒm nɪkəˈrɑːɡwə/'
                    },
                    {
                      speaker: 'Receptionist',
                      en: 'Oh, nice! And who is she?',
                      es: '¡Oh, qué bien! ¿Y quién es ella?',
                      phonetic: '/əʊ naɪs ænd huː ɪz ʃiː/'
                    },
                    {
                      speaker: 'David',
                      en: 'This is Sarah. She is my friend. She is from Canada. We are students.',
                      es: 'Esta es Sarah. Es mi amiga. Es de Canadá. Somos estudiantes.',
                      phonetic: '/ðɪs ɪz ˈsɛərə ʃiː ɪz maɪ frɛnd ʃiː ɪz frɒm ˈkænədə/'
                    },
                    {
                      speaker: 'Receptionist',
                      en: 'Perfect. Here are your keys. You are in room 304.',
                      es: 'Perfecto. Aquí están sus llaves. Están en la habitación 304.',
                      phonetic: '/ˈpɜːfɪkt hɪər ɑːr jɔːr kiːz juː ɑːr ɪn ruːm θriː əʊ fɔː/'
                    }
                  ]
                }
              }
            },
            {
              id: 'a1-lesson-1-srs',
              motherNodeId: 'a1-lesson-1',
              type: 'srs',
              title: 'Repaso Espaciado: Vocabulario Clave del Nodo 1.1',
              label: 'Mazo de Repaso',
              durationMinutes: 2,
              xpReward: 15,
              content: {
                srs: {
                  title: 'Vocabulario Clave • Misión 1.1',
                  cardCount: 6,
                  targetPhrases: [
                    {
                      en: 'Conference',
                      es: 'Conferencia',
                      phonetic: '/ˈkɒnfərəns/',
                      context: 'Vocabulario Clave'
                    },
                    {
                      en: 'Student',
                      es: 'Estudiante',
                      phonetic: '/ˈstjuːdənt/',
                      context: 'Vocabulario Clave'
                    },
                    {
                      en: 'Friend',
                      es: 'Amigo / Amiga',
                      phonetic: '/frɛnd/',
                      context: 'Vocabulario Clave'
                    },
                    {
                      en: 'From',
                      es: 'De (origen o procedencia)',
                      phonetic: '/frɒm/',
                      context: 'Vocabulario Clave'
                    },
                    {
                      en: 'Ready',
                      es: 'Listo / Lista',
                      phonetic: '/ˈrɛdi/',
                      context: 'Vocabulario Clave'
                    },
                    {
                      en: 'Welcome',
                      es: 'Bienvenido / Bienvenida',
                      phonetic: '/ˈwɛlkəm/',
                      context: 'Vocabulario Clave'
                    }
                  ]
                }
              }
            }
          ]
        },
        'a1-lesson-2': {
          lessonId: 'a1-lesson-2',
          lessonCode: '1.2',
          title: 'El primer día en el campus: mi rutina y mis horarios',
          subNodes: [
            {
              id: 'a1-lesson-2-reading',
              motherNodeId: 'a1-lesson-2',
              type: 'reading',
              title: 'Lectura de Inmersión: My University Room',
              label: 'Lectura Guiada',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                reading: {
                  title: 'My Room in the University Residence',
                  summary: 'David describe su habitación de estudiante, los objetos sobre su escritorio y su necesidad de ir a la biblioteca.',
                  wordCount: 75,
                  readingMinutes: 2,
                  paragraphs: [
                    'This is my room in the university. It is small but very nice. There is a bed, a desk, and a big window. There are two chairs.',
                    'This is my laptop. It is on the desk. That is my backpack. It is on the bed. I have a notebook and a pen in my backpack.',
                    'I need a book for my class. The book is not here. Where is the library? I need to go to the library today.'
                  ],
                  vocabulary: {
                    'desk': 'Escritorio',
                    'laptop': 'Portátil (computadora portátil)',
                    'backpack': 'Mochila',
                    'notebook': 'Cuaderno',
                    'library': 'Biblioteca',
                    'next to': 'Al lado de'
                  },
                  extensiveStories: [
                    {
                      id: 'ext-1-2-a',
                      title: 'Organizing the Study Desk',
                      wordCount: 142,
                      readingMinutes: 2,
                      paragraphs: [
                        'David is in his room at the student residence. The room is quiet and bright. He puts his laptop on the desk and connects the power cable. Next to the laptop, there is a blue pen and a notebook.',
                        'His backpack is on the chair. Inside the backpack, there is a dictionary and his student ID card. "Where is my chemistry book?" he asks himself. "It is not on the bed. It is not under the desk."',
                        'He checks the schedule on his phone. "Ah, the book is at the campus library," he remembers. "I need to walk to the library before noon." He grabs his backpack, closes the door, and walks happily down the hall.'
                      ],
                      vocabulary: {
                        'desk': 'Escritorio',
                        'laptop': 'Portátil',
                        'backpack': 'Mochila',
                        'notebook': 'Cuaderno',
                        'library': 'Biblioteca',
                        'next to': 'Al lado de'
                      }
                    },
                    {
                      id: 'ext-1-2-b',
                      title: 'A Visit to the Campus Shop',
                      wordCount: 140,
                      readingMinutes: 2,
                      paragraphs: [
                        'Sarah and David walk through the ground floor of the university building. They need study supplies for the new semester. "Look, the campus shop is next to the cafeteria," Sarah points out.',
                        'They enter the shop. There are many colorful notebooks, pens, highlighters, and backpacks on the shelves. A friendly clerk asks: "Can I help you find anything?"',
                        'David says: "Yes, please. I need a notebook for computer science and two black pens." Sarah buys a green folder for her math papers. Everything is easy to find, and now their desks are fully prepared.'
                      ],
                      vocabulary: {
                        'desk': 'Escritorio',
                        'laptop': 'Portátil',
                        'backpack': 'Mochila',
                        'notebook': 'Cuaderno',
                        'library': 'Biblioteca',
                        'next to': 'Al lado de'
                      }
                    }
                  ]
                }
              }
            },
            {
              id: 'a1-lesson-2-listening',
              motherNodeId: 'a1-lesson-2',
              type: 'listening',
              title: 'Escucha Comprensiva: Borrowing a Pen and Finding the Shop',
              label: 'Inmersión Sonora',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                listening: {
                  title: 'Looking for Study Supplies in the Campus Building',
                  audioDurationText: '1:15 min',
                  audioScriptEn: 'David: Excuse me, Sarah. Do you have a pen? Sarah: Yes, I do. Here you go. David: Thank you. And do you have a notebook? Sarah: No, I don\'t. Sorry. But there is a shop in the building. They have notebooks and books. David: Where is the shop? Sarah: It is next to the cafeteria. Look, that is the shop. David: Ah, I see it. Thanks!',
                  audioScriptEs: 'David: Disculpa, Sarah. ¿Tienes un bolígrafo? Sarah: Sí. Aquí tienes. David: Gracias. ¿Y tienes un cuaderno? Sarah: No, lo siento. Pero hay una tienda en el edificio. Tienen cuadernos y libros. David: ¿Dónde está la tienda? Sarah: Está al lado de la cafetería. Mira, esa es la tienda. David: ¡Ah, ya la veo! ¡Gracias!',
                  culturalInsight: 'En las universidades británicas, la palabra "shop" se usa mucho para tiendas pequeñas dentro del campus, mientras que "store" es más común para grandes supermercados en EE. UU.',
                  transcriptLines: [
                    {
                      speaker: 'David',
                      en: 'Excuse me, Sarah. Do you have a pen?',
                      es: 'Disculpa, Sarah. ¿Tienes un bolígrafo?',
                      phonetic: '/ɪksˈkjuːz miː ˈsɛərə duː juː hæv ə pɛn/'
                    },
                    {
                      speaker: 'Sarah',
                      en: 'Yes, I do. Here you go.',
                      es: 'Sí. Aquí tienes.',
                      phonetic: '/jɛs aɪ duː hɪər juː ɡəʊ/'
                    },
                    {
                      speaker: 'David',
                      en: 'Thank you. And do you have a notebook?',
                      es: 'Gracias. ¿Y tienes un cuaderno?',
                      phonetic: '/ˈθæŋk juː ænd duː juː hæv ə ˈnəʊtˌbʊk/'
                    },
                    {
                      speaker: 'Sarah',
                      en: 'No, I don\'t. Sorry. But there is a shop in the building. They have notebooks and books.',
                      es: 'No, lo siento. Pero hay una tienda en el edificio. Tienen cuadernos y libros.',
                      phonetic: '/nəʊ aɪ dəʊnt ˈsɒri bʌt ðɛər ɪz ə ʃɒp ɪn ðə ˈbɪldɪŋ/'
                    },
                    {
                      speaker: 'David',
                      en: 'Where is the shop?',
                      es: '¿Dónde está la tienda?',
                      phonetic: '/wɛər ɪz ðə ʃɒp/'
                    },
                    {
                      speaker: 'Sarah',
                      en: 'It is next to the cafeteria. Look, that is the shop.',
                      es: 'Está al lado de la cafetería. Mira, esa es la tienda.',
                      phonetic: '/ɪt ɪz nɛkst tuː ðə ˌkæfəˈtɪəriə lʊk ðæt ɪz ðə ʃɒp/'
                    },
                    {
                      speaker: 'David',
                      en: 'Ah, I see it. Thanks!',
                      es: '¡Ah, ya la veo! ¡Gracias!',
                      phonetic: '/ɑː aɪ siː ɪt θæŋks/'
                    }
                  ]
                }
              }
            },
            {
              id: 'a1-lesson-2-srs',
              motherNodeId: 'a1-lesson-2',
              type: 'srs',
              title: 'Repaso Espaciado: Vocabulario Clave del Nodo 1.2',
              label: 'Mazo de Repaso',
              durationMinutes: 2,
              xpReward: 15,
              content: {
                srs: {
                  title: 'Vocabulario Clave • Misión 1.2',
                  cardCount: 6,
                  targetPhrases: [
                    {
                      en: 'Desk',
                      es: 'Escritorio',
                      phonetic: '/dɛsk/',
                      context: 'Vocabulario Clave'
                    },
                    {
                      en: 'Laptop',
                      es: 'Portátil',
                      phonetic: '/ˈlæpˌtɒp/',
                      context: 'Vocabulario Clave'
                    },
                    {
                      en: 'Backpack',
                      es: 'Mochila',
                      phonetic: '/ˈbækˌpæk/',
                      context: 'Vocabulario Clave'
                    },
                    {
                      en: 'Notebook',
                      es: 'Cuaderno',
                      phonetic: '/ˈnəʊtˌbʊk/',
                      context: 'Vocabulario Clave'
                    },
                    {
                      en: 'Library',
                      es: 'Biblioteca',
                      phonetic: '/ˈlaɪbrəri/',
                      context: 'Vocabulario Clave'
                    },
                    {
                      en: 'Next to',
                      es: 'Al lado de',
                      phonetic: '/nɛkst tuː/',
                      context: 'Preposición de Lugar'
                    }
                  ]
                }
              }
            }
          ]
        },
        'a1-lesson-3': {
          lessonId: 'a1-lesson-3',
          lessonCode: '1.3',
          title: 'Ubicarse en la ciudad: direcciones, transporte y metro',
          subNodes: [
            {
              id: 'a1-lesson-3-reading',
              motherNodeId: 'a1-lesson-3',
              type: 'reading',
              title: 'Lectura de Inmersión: Daily Routine and Free Time',
              label: 'Lectura Guiada',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                reading: {
                  title: 'Daily Schedule and Campus Activities',
                  summary: 'David describe su rutina diaria: levantarse temprano, desayunar, clases, estudio con Sarah y tardes libres.',
                  wordCount: 77,
                  readingMinutes: 2,
                  paragraphs: [
                    'I usually wake up at 7:00 AM. I always eat breakfast in the cafeteria. I drink coffee and eat toast. Then, I go to my class at 9:00 AM. My class is very interesting.',
                    'After class, I sometimes study in the library with Sarah. We read and write. At 1:00 PM, we have lunch.',
                    'In the afternoon, I never sleep. I play football with my friends. In the evening, I usually watch TV in my room.'
                  ],
                  vocabulary: {
                    'usually': 'Usualmente',
                    'always': 'Siempre',
                    'never': 'Nunca',
                    'sometimes': 'A veces',
                    'schedule': 'Horario',
                    'free': 'Libre'
                  },
                  extensiveStories: [
                    {
                      id: 'ext-1-3-a',
                      title: 'Friday Afternoon Without Classes',
                      wordCount: 145,
                      readingMinutes: 2,
                      paragraphs: [
                        'On Friday morning, Sarah and David check their academic schedule on the university portal. Chemistry class ends at twelve noon, and there are no lectures scheduled for the afternoon.',
                        '"We are completely free today!" Sarah says happily. "I usually stay in the library on Fridays, but the weather is sunny today. Let us take the Tube to the city center."',
                        'David agrees: "I always enjoy walking in Covent Garden. We can eat lunch in an authentic café and see the street performers." They grab their backpacks and head to the underground station.'
                      ],
                      vocabulary: {
                        'usually': 'Usualmente',
                        'always': 'Siempre',
                        'never': 'Nunca',
                        'sometimes': 'A veces',
                        'schedule': 'Horario',
                        'free': 'Libre'
                      }
                    },
                    {
                      id: 'ext-1-3-b',
                      title: 'Evening Study Habits',
                      wordCount: 142,
                      readingMinutes: 2,
                      paragraphs: [
                        'David maintains a consistent routine in London. He usually returns to his student room by six in the evening. He drinks a cup of warm tea and opens his notebook.',
                        'He sometimes calls his family in Nicaragua to share his experiences. "The professors here are very supportive and my classes are never boring," he explains proudly.',
                        'At eight o\'clock, he reviews his vocabulary cards for twenty minutes. Consistency is the secret to natural acquisition. Before sleeping, he prepares his schedule for tomorrow with confidence.'
                      ],
                      vocabulary: {
                        'usually': 'Usualmente',
                        'always': 'Siempre',
                        'never': 'Nunca',
                        'sometimes': 'A veces',
                        'schedule': 'Horario',
                        'free': 'Libre'
                      }
                    }
                  ]
                }
              }
            },
            {
              id: 'a1-lesson-3-listening',
              motherNodeId: 'a1-lesson-3',
              type: 'listening',
              title: 'Escucha Comprensiva: Class Schedule and Free Afternoon',
              label: 'Inmersión Sonora',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                listening: {
                  title: 'Checking the Class Timetable with Sarah',
                  audioDurationText: '1:20 min',
                  audioScriptEn: 'Sarah: David, what time is the chemistry class? David: It is at 10:30 AM. It is in room 402. Sarah: Oh, no. I always have math at 10:30. Do you have the schedule? David: Yes, look. Chemistry is on Monday and Wednesday. Math is on Tuesday and Thursday. Sarah: Perfect! So, we don\'t have class on Friday afternoon. David: No, we don\'t. We are free! Let\'s go to the city center.',
                  audioScriptEs: 'Sarah: David, ¿a qué hora es la clase de química? David: Es a las 10:30 AM. Es en el aula 402. Sarah: Oh no. Siempre tengo matemáticas a las 10:30. ¿Tienes el horario? David: Sí, mira. Química es lunes y miércoles. Matemáticas es martes y jueves. Sarah: ¡Perfecto! Así que no tenemos clase el viernes por la tarde. David: ¡No tenemos! ¡Estamos libres! Vamos al centro de la ciudad.',
                  culturalInsight: 'El sistema de transporte público en Londres (The Tube) es famoso. Los británicos suelen decir "city centre" en lugar de "downtown".',
                  transcriptLines: [
                    {
                      speaker: 'Sarah',
                      en: 'David, what time is the chemistry class?',
                      es: 'David, ¿a qué hora es la clase de química?',
                      phonetic: '/ˈdeɪvɪd wɒt taɪm ɪz ðə ˈkɛmɪstri klɑːs/'
                    },
                    {
                      speaker: 'David',
                      en: 'It is at 10:30 AM. It is in room 402.',
                      es: 'Es a las 10:30 AM. Es en el aula 402.',
                      phonetic: '/ɪt ɪz æt tɛn ˈθɜːti eɪ ɛm ɪt ɪz ɪn ruːm fɔː əʊ tuː/'
                    },
                    {
                      speaker: 'Sarah',
                      en: 'Oh, no. I always have math at 10:30. Do you have the schedule?',
                      es: 'Oh no. Siempre tengo matemáticas a las 10:30. ¿Tienes el horario?',
                      phonetic: '/əʊ nəʊ aɪ ˈɔːlweɪz hæv mæθ duː juː hæv ðə ˈʃɛdjuːl/'
                    },
                    {
                      speaker: 'David',
                      en: 'Yes, look. Chemistry is on Monday and Wednesday. Math is on Tuesday and Thursday.',
                      es: 'Sí, mira. Química es los lunes y miércoles. Matemáticas martes y jueves.',
                      phonetic: '/jɛs lʊk ˈkɛmɪstri ɪz ɒn ˈmʌndeɪ ænd ˈwɛnzdeɪ/'
                    },
                    {
                      speaker: 'Sarah',
                      en: 'Perfect! So, we don\'t have class on Friday afternoon.',
                      es: '¡Perfecto! Así que no tenemos clase el viernes por la tarde.',
                      phonetic: '/ˈpɜːfɪkt səʊ wiː dəʊnt hæv klɑːs ɒn ˈfraɪdeɪ ˌɑːftəˈnuːn/'
                    },
                    {
                      speaker: 'David',
                      en: 'No, we don\'t. We are free! Let\'s go to the city center.',
                      es: '¡No, no tenemos! ¡Estamos libres! Vamos al centro de la ciudad.',
                      phonetic: '/nəʊ wiː dəʊnt wiː ɑːr friː lɛts ɡəʊ tuː ðə ˈsɪti ˈsɛntər/'
                    }
                  ]
                }
              }
            },
            {
              id: 'a1-lesson-3-srs',
              motherNodeId: 'a1-lesson-3',
              type: 'srs',
              title: 'Repaso Espaciado: Vocabulario Clave del Nodo 1.3',
              label: 'Mazo de Repaso',
              durationMinutes: 2,
              xpReward: 15,
              content: {
                srs: {
                  title: 'Vocabulario Clave • Misión 1.3',
                  cardCount: 6,
                  targetPhrases: [
                    {
                      en: 'Usually',
                      es: 'Usualmente',
                      phonetic: '/ˈjuːʒʊəli/',
                      context: 'Adverbio de Frecuencia'
                    },
                    {
                      en: 'Always',
                      es: 'Siempre',
                      phonetic: '/ˈɔːlweɪz/',
                      context: 'Adverbio de Frecuencia'
                    },
                    {
                      en: 'Never',
                      es: 'Nunca',
                      phonetic: '/ˈnɛvər/',
                      context: 'Adverbio de Frecuencia'
                    },
                    {
                      en: 'Sometimes',
                      es: 'A veces',
                      phonetic: '/ˈsʌmˌtaɪmz/',
                      context: 'Adverbio de Frecuencia'
                    },
                    {
                      en: 'Schedule',
                      es: 'Horario',
                      phonetic: '/ˈʃɛdjuːl/',
                      context: 'Vocabulario Clave'
                    },
                    {
                      en: 'Free',
                      es: 'Libre',
                      phonetic: '/friː/',
                      context: 'Vocabulario Clave'
                    }
                  ]
                }
              }
            }
          ]
        },
        'a1-lesson-4': {
          lessonId: 'a1-lesson-4',
          lessonCode: '1.4',
          title: 'Comida y supervivencia: pedir café, comer en el campus y pagar',
          subNodes: [
            {
              id: 'a1-lesson-4-reading',
              motherNodeId: 'a1-lesson-4',
              type: 'reading',
              title: 'Lectura de Inmersión: Finding the Conference Auditorium',
              label: 'Lectura Guiada',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                reading: {
                  title: 'Directions to the Main Auditorium',
                  summary: 'David pide indicaciones a un guardia de seguridad para encontrar el auditorio de la conferencia con la puerta azul.',
                  wordCount: 75,
                  readingMinutes: 2,
                  paragraphs: [
                    'I am in the main building. I need to find the auditorium. It is a big room for the conference. I see a security guard.',
                    '"Excuse me, where is the auditorium?" I ask. "Go straight and turn left," he says. "It is next to the main library. It has a big blue door."',
                    'I walk straight. I turn left. I see the blue door. The auditorium is very big and there are many students. I am not late. The conference starts now.'
                  ],
                  vocabulary: {
                    'where is...?': '¿Dónde está...?',
                    'go straight': 'Ve derecho (recto)',
                    'turn left': 'Gira a la izquierda',
                    'turn right': 'Gira a la derecha',
                    'next to': 'Al lado de',
                    'near': 'Cerca',
                    'far': 'Lejos',
                    'excuse me': 'Disculpe'
                  },
                  extensiveStories: [
                    {
                      id: 'ext-1-4-a',
                      title: 'Finding the International Office',
                      wordCount: 145,
                      readingMinutes: 2,
                      paragraphs: [
                        'David needs to validate his visa documents at the international student office. The campus is large, with ancient stone arches and modern glass corridors. He pauses near the courtyard.',
                        'He sees a campus guide wearing a yellow lanyard. "Excuse me, where is the international office?" David asks politely. "Go straight past the library and turn left at the fountain," the guide explains. "It is next to the lecture hall."',
                        'David thanks him and follows the instructions. He walks straight, turns left, and sees the entrance with a blue glass door. He arrives right on time for his appointment.'
                      ],
                      vocabulary: {
                        'where is...?': '¿Dónde está...?',
                        'go straight': 'Ve derecho',
                        'turn left': 'Gira a la izquierda',
                        'next to': 'Al lado de',
                        'near': 'Cerca',
                        'far': 'Lejos',
                        'excuse me': 'Disculpe'
                      }
                    },
                    {
                      id: 'ext-1-4-b',
                      title: 'A Walk to the Science Laboratory',
                      wordCount: 142,
                      readingMinutes: 2,
                      paragraphs: [
                        'After his morning lecture, David wants to borrow reference books. A new student looks confused near the entrance. "Excuse me, is the main laboratory far from here?" she asks.',
                        '"No, it is very near," David replies enthusiastically. "Go out of this door, turn right, and walk for two minutes. You will see a tall brick building with a red roof."',
                        '"Thank you so much!" she says with relief. David smiles. Giving clear directions in English makes him feel truly integrated into university life in London.'
                      ],
                      vocabulary: {
                        'where is...?': '¿Dónde está...?',
                        'go straight': 'Ve derecho',
                        'turn right': 'Gira a la derecha',
                        'next to': 'Al lado de',
                        'near': 'Cerca',
                        'far': 'Lejos',
                        'excuse me': 'Disculpe'
                      }
                    }
                  ]
                }
              }
            },
            {
              id: 'a1-lesson-4-listening',
              motherNodeId: 'a1-lesson-4',
              type: 'listening',
              title: 'Escucha Comprensiva: Asking the Guard for Directions',
              label: 'Inmersión Sonora',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                listening: {
                  title: 'Directions to the Science Laboratory',
                  audioDurationText: '1:15 min',
                  audioScriptEn: 'David: Excuse me, sir. Can you help me? Guard: Of course. What do you need? David: I am looking for the science laboratory. Is it far? Guard: No, it is near. Go out of this building, turn right, and walk for two minutes. It is the building with the red roof. David: Turn right and the red roof. Got it. Thank you so much! Guard: You\'re welcome. Have a good day!',
                  audioScriptEs: 'David: Disculpe, señor. ¿Puede ayudarme? Guardia: Por supuesto. ¿Qué necesita? David: Estoy buscando el laboratorio de ciencias. ¿Está lejos? Guardia: No, está cerca. Salga de este edificio, gire a la derecha y camine durante dos minutos. Es el edificio con el tejado rojo. David: Girar a la derecha y tejado rojo. Entendido. ¡Muchas gracias! Guardia: ¡De nada! ¡Tenga un buen día!',
                  culturalInsight: 'Al pedir indicaciones, los británicos usan mucho "Excuse me" para interrumpir amablemente. Es de mala educación no decirlo antes de preguntar.',
                  transcriptLines: [
                    {
                      speaker: 'David',
                      en: 'Excuse me, sir. Can you help me?',
                      es: 'Disculpe, señor. ¿Puede ayudarme?',
                      phonetic: '/ɪksˈkjuːz miː sɜː kæn juː hɛlp miː/'
                    },
                    {
                      speaker: 'Guard',
                      en: 'Of course. What do you need?',
                      es: 'Por supuesto. ¿Qué necesita?',
                      phonetic: '/ɒv kɔːs wɒt duː juː niːd/'
                    },
                    {
                      speaker: 'David',
                      en: 'I am looking for the science laboratory. Is it far?',
                      es: 'Estoy buscando el laboratorio de ciencias. ¿Está lejos?',
                      phonetic: '/aɪ æm ˈlʊkɪŋ fɔː ðə ˈsaɪəns ləˈbɒrətəri ɪz ɪt fɑː/'
                    },
                    {
                      speaker: 'Guard',
                      en: 'No, it is near. Go out of this building, turn right, and walk for two minutes. It is the building with the red roof.',
                      es: 'No, está cerca. Salga de este edificio, gire a la derecha y camine dos minutos. Es el edificio con el tejado rojo.',
                      phonetic: '/nəʊ ɪt ɪz nɪər ɡəʊ aʊt ɒv ðɪs ˈbɪldɪŋ tɜːn raɪt/'
                    },
                    {
                      speaker: 'David',
                      en: 'Turn right and the red roof. Got it. Thank you so much!',
                      es: 'Girar a la derecha y el tejado rojo. Entendido. ¡Muchas gracias!',
                      phonetic: '/tɜːn raɪt ænd ðə rɛd ruːf ˈɡɒt ɪt ˈθæŋk juː səʊ mʌtʃ/'
                    },
                    {
                      speaker: 'Guard',
                      en: 'You\'re welcome. Have a good day!',
                      es: 'De nada. ¡Que tenga un buen día!',
                      phonetic: '/jɔːr ˈwɛlkəm hæv ə ɡʊd deɪ/'
                    }
                  ]
                }
              }
            },
            {
              id: 'a1-lesson-4-srs',
              motherNodeId: 'a1-lesson-4',
              type: 'srs',
              title: 'Repaso Espaciado: Vocabulario Clave del Nodo 1.4',
              label: 'Mazo de Repaso',
              durationMinutes: 2,
              xpReward: 15,
              content: {
                srs: {
                  title: 'Vocabulario Clave • Misión 1.4',
                  cardCount: 6,
                  targetPhrases: [
                    {
                      en: 'Where is...?',
                      es: '¿Dónde está...?',
                      phonetic: '/wɛər ɪz/',
                      context: 'Preguntar Ubicación'
                    },
                    {
                      en: 'Go straight',
                      es: 'Ve derecho',
                      phonetic: '/ɡəʊ streɪt/',
                      context: 'Dar Indicaciones'
                    },
                    {
                      en: 'Turn left / Turn right',
                      es: 'Gira a la izquierda / derecha',
                      phonetic: '/tɜːn lɛft / tɜːn raɪt/',
                      context: 'Dar Indicaciones'
                    },
                    {
                      en: 'Next to',
                      es: 'Al lado de',
                      phonetic: '/nɛkst tuː/',
                      context: 'Ubicación'
                    },
                    {
                      en: 'Near / Far',
                      es: 'Cerca / Lejos',
                      phonetic: '/nɪər / fɑː/',
                      context: 'Distancia'
                    },
                    {
                      en: 'Excuse me',
                      es: 'Disculpe',
                      phonetic: '/ɪksˈkjuːz miː/',
                      context: 'Cortesía'
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    },
    'module-2': {
      moduleId: 'module-2',
      unitNumber: 2,
      level: 'A2',
      title: 'Unidad 2 • Comunicación Cotidiana y Relatos',
      lessons: {
        'a2-lesson-1': {
          lessonId: 'a2-lesson-1',
          lessonCode: '2.1',
          title: 'Mi primer fin de semana en Londres: contar qué hice',
          subNodes: [
            {
              id: 'a2-lesson-1-reading',
              motherNodeId: 'a2-lesson-1',
              type: 'reading',
              title: 'Lectura de Inmersión: My First Weekend in London',
              label: 'Lectura Guiada',
              durationMinutes: 3,
              xpReward: 20,
              content: {
                reading: {
                  title: 'My First Weekend in London: Markets and Museums',
                  summary: 'David relata sus primeras experiencias de fin de semana explorando Camden Market y el Museo de Historia Natural en South Kensington.',
                  wordCount: 225,
                  readingMinutes: 3,
                  paragraphs: [
                    'Last Saturday morning, the weather in London was surprisingly clear and bright. I decided to wake up early and explore the city beyond the university campus.',
                    'First, I took the Northern Line northbound towards Camden Town. The market was already full of creative artists, vintage clothes shops, and delicious street food stalls from all over the world. I bought a warm cup of cider and a handmade notebook.',
                    'In the afternoon, I met my classmate Elena near South Kensington. We spent three hours wandering through the Natural History Museum. We saw gigantic dinosaur skeletons and admired the Victorian architecture of the Hintze Hall.',
                    'We were quite tired by six in the evening, so we stopped at an authentic tea shop on Exhibition Road. We ordered traditional scones with clotted cream and strawberry jam while sharing stories about our home countries.',
                    'It was an unforgettable first weekend. Writing down what I did in my journal helped me realize how much my confidence in English had grown in just one week.'
                  ],
                  vocabulary: {
                    'surprisingly': 'sorprendentemente',
                    'explore': 'explorar o recorrer una ciudad',
                    'stalls': 'puestos de venta ambulantes o de mercado',
                    'wandering': 'pasear o deambular con calma',
                    'skeletons': 'esqueletos fósiles en exposición',
                    'admired': 'admiró / contempló con asombro',
                    'scones': 'panecillos típicos británicos para el té',
                    'unforgettable': 'inolvidable'
                  }
                }
              }
            },
            {
              id: 'a2-lesson-1-listening',
              motherNodeId: 'a2-lesson-1',
              type: 'listening',
              title: 'Escucha Comprensiva: Sharing Weekend Stories at the Residence',
              label: 'Inmersión Sonora',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                listening: {
                  title: 'Weekend Stories at the Student Common Room',
                  audioDurationText: '1:40 min',
                  audioScriptEn: 'On Sunday evening, university students gathered in the common room to chat about their weekend adventures. Some went to local markets, others studied in peaceful cafes near the river Thames, and a few visited famous national art galleries.',
                  audioScriptEs: 'El domingo por la noche, los estudiantes universitarios se reunieron en la sala común para conversar sobre sus aventuras del fin de semana.',
                  culturalInsight: 'Los lunes por la mañana en el Reino Unido siempre inician con la pregunta de cortesía: "How was your weekend? Did you do anything nice?".',
                  transcriptLines: [
                    {
                      speaker: 'Elena',
                      en: 'Did you manage to find Camden Market easily yesterday?',
                      es: '¿Lograste encontrar el mercado de Camden fácilmente ayer?',
                      phonetic: '/dɪd juː ˈmænɪdʒ tuː faɪnd ˈkæmdən ˈmɑːkɪt ˈiːzɪli ˈjɛstədeɪ/'
                    },
                    {
                      speaker: 'David',
                      en: 'Yes, I did! I took the Tube and arrived in twenty minutes. It was fantastic.',
                      es: '¡Sí! Tomé el metro y llegué en veinte minutos. Fue fantástico.',
                      phonetic: '/jɛs aɪ dɪd aɪ tʊk ðə tjuːb ænd əˈraɪvd ɪn ˈtwɛnti ˈmɪnɪts/'
                    }
                  ]
                }
              }
            },
            {
              id: 'a2-lesson-1-srs',
              motherNodeId: 'a2-lesson-1',
              type: 'srs',
              title: 'Repaso Espaciado: 5 Patrones de Pasado Simple y Anécdotas',
              label: 'Mazo de Repaso',
              durationMinutes: 2,
              xpReward: 15,
              content: {
                srs: {
                  title: '5 Patrones para Relatar el Pasado',
                  cardCount: 5,
                  targetPhrases: [
                    {
                      en: 'What did you do last weekend?',
                      es: '¿Qué hiciste el fin de semana pasado?',
                      phonetic: '/wɒt dɪd juː duː lɑːst ˈwiːkˌɛnd/',
                      context: 'Pregunta conversacional clásica de apertura de semana.'
                    },
                    {
                      en: 'I visited the museum and bought some souvenirs.',
                      es: 'Visité el museo y compré algunos recuerdos.',
                      phonetic: '/aɪ ˈvɪzɪtɪd ðə mjuːˈziːəm ænd bɔːt sʌm ˌsuːvəˈnɪərz/',
                      context: 'Combinar verbos regulares e irregulares en pasado.'
                    },
                    {
                      en: 'We had a wonderful time walking along the river.',
                      es: 'La pasamos de maravilla caminando junto al río.',
                      phonetic: '/wiː hæd ə ˈwʌndərfʊl taɪm ˈwɔːkɪŋ əˈlɒŋ ðə ˈrɪvər/',
                      context: 'Describir sensaciones y disfrute pasado.'
                    },
                    {
                      en: 'I took the wrong bus, but I found a charming bookstore.',
                      es: 'Tomé el autobús equivocado, pero encontré una librería encantadora.',
                      phonetic: '/aɪ tʊk ðə rɒŋ bʌs bʌt aɪ faʊnd ə ˈtʃɑːmɪŋ ˈbʊkˌstɔːr/',
                      context: 'Contar un pequeño imprevisto positivo.'
                    },
                    {
                      en: 'She did not come to the common room yesterday.',
                      es: 'Ella no vino a la sala común ayer.',
                      phonetic: '/ʃiː dɪd nɒt kʌm tuː ðə ˈkɒmən ruːm ˈjɛstədeɪ/',
                      context: 'Negación en pasado simple con did not.'
                    }
                  ]
                }
              }
            }
          ]
        },
        'a2-lesson-2': {
          lessonId: 'a2-lesson-2',
          lessonCode: '2.2',
          title: 'Compras en el campus: comparar precios y calidades',
          subNodes: [
            {
              id: 'a2-lesson-2-reading',
              motherNodeId: 'a2-lesson-2',
              type: 'reading',
              title: 'Lectura de Inmersión: Campus Shopping & Student Budget',
              label: 'Lectura Guiada',
              durationMinutes: 3,
              xpReward: 20,
              content: {
                reading: {
                  title: 'Smart Student Shopping: Comparing Prices Around Campus',
                  summary: 'Comparativa de costos entre la librería oficial del campus, tiendas de segunda mano y supermercados locales.',
                  wordCount: 230,
                  readingMinutes: 3,
                  paragraphs: [
                    'Managing a student budget in London requires making thoughtful comparisons every week. Prices can vary significantly depending on where you shop.',
                    'The official university bookstore is closer and more convenient than outside stores, but its new textbooks are often more expensive than second-hand copies available online.',
                    'For everyday groceries, the local market in Russell Square offers fresher fruit and cheaper vegetables than the high-street express supermarkets.',
                    'David discovered that buying store-brand items was just as good as purchasing international brand names, but fifty percent cheaper.',
                    'By comparing options carefully and taking advantage of student discounts with his campus card, David managed to keep his living expenses balanced and sustainable.'
                  ],
                  vocabulary: {
                    'budget': 'presupuesto financiero',
                    'thoughtful': 'reflexivo, meditado',
                    'convenient': 'cómodo, accesible',
                    'second-hand': 'de segunda mano o usado',
                    'cheaper': 'más económico / barato',
                    'fresher': 'más fresco (comparativo de fresh)',
                    'discounts': 'descuentos comerciales para estudiantes',
                    'sustainable': 'sostenible a lo largo del tiempo'
                  }
                }
              }
            },
            {
              id: 'a2-lesson-2-listening',
              motherNodeId: 'a2-lesson-2',
              type: 'listening',
              title: 'Escucha Comprensiva: Comparing Laptops at the Tech Store',
              label: 'Inmersión Sonora',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                listening: {
                  title: 'Comparing Tech Options for University Courses',
                  audioDurationText: '1:35 min',
                  audioScriptEn: 'This model is lighter and more portable than the heavier workstation, but its battery lasts twice as long. For university lectures and library work, portability is definitely more important than raw processing power.',
                  audioScriptEs: 'Este modelo es más ligero y portátil que la estación de trabajo pesada, pero su batería dura el doble. Para clases y biblioteca, la portabilidad es más importante.',
                  culturalInsight: 'Las comparaciones con "better than" y "as... as" son fundamentales en el Reino Unido al evaluar valor por dinero ("good value for money").',
                  transcriptLines: [
                    {
                      speaker: 'Store Assistant',
                      en: 'Which of these two laptops is better suited for data science?',
                      es: '¿Cuál de estos dos portátiles se adapta mejor a ciencia de datos?',
                      phonetic: '/wɪtʃ ɒv ðiːz tuː ˈlæpˌtɒps ɪz ˈbɛtər ˈsuːtɪd/'
                    },
                    {
                      speaker: 'Student',
                      en: 'The silver one has a faster processor, but the black one is much cheaper.',
                      es: 'El plateado tiene un procesador más rápido, pero el negro es mucho más barato.',
                      phonetic: '/ðə ˈsɪlvər wʌn hæz ə ˈfɑːstər ˈprəʊsɛsər/'
                    }
                  ]
                }
              }
            },
            {
              id: 'a2-lesson-2-srs',
              motherNodeId: 'a2-lesson-2',
              type: 'srs',
              title: 'Repaso Espaciado: 5 Patrones de Comparación y Calidad',
              label: 'Mazo de Repaso',
              durationMinutes: 2,
              xpReward: 15,
              content: {
                srs: {
                  title: '5 Patrones de Comparativos y Superlativos',
                  cardCount: 5,
                  targetPhrases: [
                    {
                      en: 'This notebook is more expensive than that one.',
                      es: 'Este cuaderno es más caro que aquel.',
                      phonetic: '/ðɪs ˈnəʊtˌbʊk ɪz mɔːr ɪkˈspɛnsɪv ðæn ðæt wʌn/',
                      context: 'Comparar precios entre dos artículos.'
                    },
                    {
                      en: 'The campus library is the quietest place to study.',
                      es: 'La biblioteca del campus es el lugar más tranquilo para estudiar.',
                      phonetic: '/ðə ˈkæmpəs ˈlaɪbrəri ɪz ðə ˈkwaɪətɪst pleɪs tuː ˈstʌdi/',
                      context: 'Superlativo de excelencia o lugar.'
                    },
                    {
                      en: 'Is this meal as healthy as the fresh salad?',
                      es: '¿Esta comida es tan saludable como la ensalada fresca?',
                      phonetic: '/ɪz ðɪs miːl æz ˈhɛlθi æz ðə frɛʃ ˈsæləd/',
                      context: 'Comparación de igualdad con as... as.'
                    },
                    {
                      en: 'Used textbooks are much cheaper than brand-new editions.',
                      es: 'Los libros de texto usados son mucho más baratos que las ediciones nuevas.',
                      phonetic: '/juːzd ˈtɛkstˌbʊks ɑːr mʌtʃ ˈtʃiːpər ðæn brænd njuː ɪˈdɪʃənz/',
                      context: 'Intensificar un comparativo con much.'
                    },
                    {
                      en: 'Which option offers the best value for money?',
                      es: '¿Qué opción ofrece la mejor relación calidad-precio?',
                      phonetic: '/wɪtʃ ˈɒpʃən ˈɒfərz ðə bɛst ˈvæljuː fɔːr ˈmʌni/',
                      context: 'Pregunta clave al tomar decisiones de compra.'
                    }
                  ]
                }
              }
            }
          ]
        },
        'a2-lesson-3': {
          lessonId: 'a2-lesson-3',
          lessonCode: '2.3',
          title: 'Compromisos y planes: organizar una salida con amigos de la facultad',
          subNodes: [
            {
              id: 'a2-lesson-3-reading',
              motherNodeId: 'a2-lesson-3',
              type: 'reading',
              title: 'Lectura de Inmersión: Planning a Faculty Weekend Trip to Greenwich',
              label: 'Lectura Guiada',
              durationMinutes: 3,
              xpReward: 20,
              content: {
                reading: {
                  title: 'Organizing a Group Excursion to Greenwich',
                  summary: 'Los compañeros de facultad organizan una visita en barco por el Támesis hacia el Real Observatorio de Greenwich.',
                  wordCount: 220,
                  readingMinutes: 3,
                  paragraphs: [
                    'Next Saturday, the international student society is organizing an excursion to historic Greenwich. Five students met in the student union to coordinate the schedule.',
                    '"We are going to take the river bus from Westminster Pier at ten in the morning," explained Sophie. "The river journey will give us a scenic view of Tower Bridge and the city skyline."',
                    'David checked the weather forecast on his smartphone. "It looks like it will be slightly cloudy, but it is not going to rain. I will bring my camera to take photos of the Prime Meridian."',
                    'They also agreed on meeting points and lunch arrangements. They decided to have a picnic lunch in Greenwich Park if the weather remains dry.',
                    'Planning group activities in English helped everyone practice future intentions with "going to" and spontaneous decisions with "will" in a very natural way.'
                  ],
                  vocabulary: {
                    'excursion': 'excursión o paseo grupal',
                    'coordinate': 'coordinar detalles y horarios',
                    'pier': 'muelle o embarcadero',
                    'skyline': 'horizonte o silueta urbana de la ciudad',
                    'forecast': 'pronóstico meteorológico',
                    'meridian': 'meridiano cero de referencia geográfica',
                    'arrangements': 'acuerdos y preparativos organizativos'
                  }
                }
              }
            },
            {
              id: 'a2-lesson-3-listening',
              motherNodeId: 'a2-lesson-3',
              type: 'listening',
              title: 'Escucha Comprensiva: Making Weekend Plans on the Phone',
              label: 'Inmersión Sonora',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                listening: {
                  title: 'Coordinating Meeting Times with Classmates',
                  audioDurationText: '1:30 min',
                  audioScriptEn: 'Hey David! Are you still coming with us to Greenwich this Saturday? Yes, absolutely! What time are we meeting at the pier? We are meeting at nine-forty-five sharp by ticket barrier two.',
                  audioScriptEs: '¡Hola David! ¿Todavía vienes con nosotros a Greenwich este sábado? ¡Sí, totalmente! ¿A qué hora nos vemos en el muelle? Nos vemos a las nueve y cuarenta y cinco en punto.',
                  culturalInsight: 'En la cultura británica, "sharp" después de la hora (ej. "at ten sharp") significa puntualidad exacta sin retraso.',
                  transcriptLines: [
                    {
                      speaker: 'Sophie',
                      en: 'Are you going to join the group for lunch after the observatory tour?',
                      es: '¿Te vas a unir al grupo para el almuerzo después del recorrido por el observatorio?',
                      phonetic: '/ɑːr juː ˈɡəʊɪŋ tuː dʒɔɪn ðə ɡruːp fɔːr lʌntʃ/'
                    },
                    {
                      speaker: 'David',
                      en: 'Yes, definitely! I will buy some sandwiches at the station beforehand.',
                      es: '¡Sí, definitivamente! Compraré unos sándwiches en la estación antes.',
                      phonetic: '/jɛs ˈdɛfɪnɪtli aɪ wɪl baɪ sʌm ˈsænwɪdʒɪz/'
                    }
                  ]
                }
              }
            },
            {
              id: 'a2-lesson-3-srs',
              motherNodeId: 'a2-lesson-3',
              type: 'srs',
              title: 'Repaso Espaciado: 5 Patrones de Futuro (Will vs Going To)',
              label: 'Mazo de Repaso',
              durationMinutes: 2,
              xpReward: 15,
              content: {
                srs: {
                  title: '5 Patrones para Planes y Futuro',
                  cardCount: 5,
                  targetPhrases: [
                    {
                      en: 'We are going to meet at the station tomorrow morning.',
                      es: 'Nos vamos a reunir en la estación mañana por la mañana.',
                      phonetic: '/wiː ɑːr ˈɡəʊɪŋ tuː miːt æt ðə ˈsteɪʃən təˈmɒrəʊ ˈmɔːnɪŋ/',
                      context: 'Planes previos acordados con going to.'
                    },
                    {
                      en: 'I will help you carry the luggage, do not worry.',
                      es: 'Yo te ayudo a cargar el equipaje, no te preocupes.',
                      phonetic: '/aɪ wɪl hɛlp juː ˈkæri ðə ˈlʌɡɪdʒ duː nɒt ˈwʌri/',
                      context: 'Decisión espontánea de ayuda con will.'
                    },
                    {
                      en: 'What are your plans for this upcoming weekend?',
                      es: '¿Cuáles son tus planes para este próximo fin de semana?',
                      phonetic: '/wɒt ɑːr jɔːr plænz fɔːr ðɪs ˌʌpˈkʌmɪŋ ˈwiːkˌɛnd/',
                      context: 'Preguntar por planes sociales.'
                    },
                    {
                      en: 'I think it will be sunny in the afternoon.',
                      es: 'Creo que estará soleado por la tarde.',
                      phonetic: '/aɪ θɪŋk ɪt wɪl biː ˈsʌni ɪn ðə ˌɑːftəˈnuːn/',
                      context: 'Predicción basada en opinión personal.'
                    },
                    {
                      en: 'Are you going to attend the faculty seminar next week?',
                      es: '¿Vas a asistir al seminario de la facultad la próxima semana?',
                      phonetic: '/ɑːr juː ˈɡəʊɪŋ tuː əˈtɛnd ðə ˈfækəlti ˈsɛmɪnɑːr nɛkst wiːk/',
                      context: 'Confirmar asistencia a eventos programados.'
                    }
                  ]
                }
              }
            }
          ]
        },
        'a2-lesson-4': {
          lessonId: 'a2-lesson-4',
          lessonCode: '2.4',
          title: 'Normas del campus: qué podemos y qué no podemos hacer',
          subNodes: [
            {
              id: 'a2-lesson-4-reading',
              motherNodeId: 'a2-lesson-4',
              type: 'reading',
              title: 'Lectura de Inmersión: Residence Hall Guidelines & Library Rules',
              label: 'Lectura Guiada',
              durationMinutes: 3,
              xpReward: 20,
              content: {
                reading: {
                  title: 'Living on Campus: Rights, Responsibilities and Modals',
                  summary: 'Guía de convivencia estudiantil: normas sobre el silencio nocturno, reciclaje y acceso a la biblioteca 24 horas.',
                  wordCount: 220,
                  readingMinutes: 3,
                  paragraphs: [
                    'Every student residence hall in the university maintains specific rules designed to ensure a peaceful and productive academic environment for all residents.',
                    'According to the residence handbook, students must observe quiet hours from ten o\'clock at night until seven o\'clock in the morning. Loud music and noisy parties in the bedrooms are strictly prohibited during these hours.',
                    'In the communal kitchen, residents have to wash and dry their own cooking utensils immediately after preparing meals. You can store your food in the shared refrigerators, but all items must have your name and room number clearly labeled.',
                    'Visitors are allowed during the day, but overnight guests must be registered at the security desk beforehand. You do not have to pay extra for guests, but you are responsible for their conduct.',
                    'Understanding modal verbs like "must", "can", and "have to" allows students to navigate community expectations smoothly and avoid unnecessary misunderstandings.'
                  ],
                  vocabulary: {
                    'guidelines': 'pautas y directrices de convivencia',
                    'ensure': 'garantizar y asegurar',
                    'handbook': 'manual oficial de normas',
                    'prohibited': 'prohibido expresamente',
                    'communal': 'de uso compartido o comunitario',
                    'utensils': 'utensilios de cocina y cubiertos',
                    'conduct': 'comportamiento y conducta cívica',
                    'misunderstandings': 'malentendidos o confusiones'
                  }
                }
              }
            },
            {
              id: 'a2-lesson-4-listening',
              motherNodeId: 'a2-lesson-4',
              type: 'listening',
              title: 'Escucha Comprensiva: Residence Hall Warden Induction',
              label: 'Inmersión Sonora',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                listening: {
                  title: 'Warden Induction Briefing at the Residence Hall',
                  audioDurationText: '1:40 min',
                  audioScriptEn: 'Welcome everyone! As hall residents, you have access to excellent facilities. You can use the quiet study room at any time. However, you must always tap your key fob to enter, and you cannot prop doors open for security reasons.',
                  audioScriptEs: '¡Bienvenidos a todos! Como residentes tienen acceso a excelentes instalaciones. Pueden usar la sala de estudio en silencio a cualquier hora. Sin embargo, deben pasar siempre su llavero magnético.',
                  culturalInsight: 'En universidades británicas, el "Hall Warden" o tutor de residencia es el encargado de supervisar el bienestar y el cumplimiento de las normas.',
                  transcriptLines: [
                    {
                      speaker: 'Hall Warden',
                      en: 'Remember that you must not smoke anywhere inside the building.',
                      es: 'Recuerden que no deben fumar en ningún lugar dentro del edificio.',
                      phonetic: '/rɪˈmɛmbər ðæt juː mʌst nɒt sməʊk ˈɛnɪwɛər ɪnˈsaɪd/'
                    },
                    {
                      speaker: 'Student',
                      en: 'Do we have to book the laundry room in advance?',
                      es: '¿Tenemos que reservar la sala de lavandería con anticipación?',
                      phonetic: '/duː wiː hæv tuː bʊk ðə ˈlɔːndri ruːm ɪn ədˈvɑːns/'
                    }
                  ]
                }
              }
            },
            {
              id: 'a2-lesson-4-srs',
              motherNodeId: 'a2-lesson-4',
              type: 'srs',
              title: 'Repaso Espaciado: 5 Patrones de Obligación, Permiso y Prohibición',
              label: 'Mazo de Repaso',
              durationMinutes: 2,
              xpReward: 15,
              content: {
                srs: {
                  title: '5 Patrones de Verbos Modales (Must, Can, Have to)',
                  cardCount: 5,
                  targetPhrases: [
                    {
                      en: 'You must show your student ID card at the entrance.',
                      es: 'Debes mostrar tu carnet de estudiante en la entrada.',
                      phonetic: '/juː mʌst ʃəʊ jɔːr ˈstjuːdənt aɪˈdiː kɑːd æt ðɪ ˈɛntrəns/',
                      context: 'Obligación formal y estricta con must.'
                    },
                    {
                      en: 'You do not have to buy the textbook; it is in the library.',
                      es: 'No tienes que comprar el libro; está en la biblioteca.',
                      phonetic: '/juː duː nɒt hæv tuː baɪ ðə ˈtɛkstˌbʊk ɪt ɪz ɪn ðə ˈlaɪbrəri/',
                      context: 'Ausencia de obligación con do not have to.'
                    },
                    {
                      en: 'Students can borrow up to ten books at a time.',
                      es: 'Los estudiantes pueden tomar prestados hasta diez libros a la vez.',
                      phonetic: '/ˈstjuːdənts kæn ˈbɒrəʊ ʌp tuː tɛn bʊks æt ə taɪm/',
                      context: 'Permiso y posibilidad con can.'
                    },
                    {
                      en: 'You must not bring food into the computer laboratory.',
                      es: 'No debes ingresar comida a la sala de computadoras.',
                      phonetic: '/juː mʌst nɒt brɪŋ fuːd ˈɪntuː ðə kəmˈpjuːtər ləˈbɒrətəri/',
                      context: 'Prohibición estricta con must not.'
                    },
                    {
                      en: 'Do we have to wear protective glasses in this area?',
                      es: '¿Tenemos que usar gafas de protección en esta área?',
                      phonetic: '/duː wiː hæv tuː wɛər prəˈtɛktɪv ˈɡlɑːsɪz ɪn ðɪs ˈɛəriə/',
                      context: 'Preguntar por requisitos y normas de seguridad.'
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    },
    'module-3': {
      moduleId: 'module-3',
      unitNumber: 3,
      level: 'B1',
      title: 'Unidad 3 • Independencia y Fluidez Laboral/Técnica',
      lessons: {
        'b1-lesson-1': {
          lessonId: 'b1-lesson-1',
          lessonCode: '3.1',
          title: 'Mi portafolio: lo que he logrado hasta hoy',
          subNodes: [
            {
              id: 'b1-lesson-1-reading',
              motherNodeId: 'b1-lesson-1',
              type: 'reading',
              title: 'Lectura de Inmersión: Presenting Academic Portfolios & Experience',
              label: 'Lectura Guiada',
              durationMinutes: 3,
              xpReward: 20,
              content: {
                reading: {
                  title: 'Crafting an Academic Portfolio for International Fellowships',
                  summary: 'Cómo conectar proyectos pasados con logros presentes usando el Present Perfect en un contexto de postulación académica.',
                  wordCount: 235,
                  readingMinutes: 3,
                  paragraphs: [
                    'When preparing an academic portfolio for international fellowships, presenting continuous growth is essential. Review committees want to see not only what you studied, but what tangible milestones you have achieved over time.',
                    '"Over the past three years, I have conducted field research in Central America and developed open-source educational software," explained David in his personal statement. "I have collaborated with interdisciplinary teams and published two peer-reviewed conference papers."',
                    'The Present Perfect tense acts as a powerful bridge connecting past efforts with present capability. It highlights that the experience gained continues to inform your current academic competence.',
                    'In addition to technical achievements, highlighting soft skills such as cross-cultural communication demonstrates maturity and independence.',
                    'Having a polished portfolio ready gives scholars the confidence to articulate their qualifications clearly during competitive scholarship interviews.'
                  ],
                  vocabulary: {
                    'portfolio': 'portafolio o compilación de logros académicos',
                    'milestones': 'hitos o logros trascendentales',
                    'conducted': 'llevó a cabo, ejecutó una investigación',
                    'collaborated': 'colaboró con equipos interdisciplinarios',
                    'peer-reviewed': 'revisado por pares académicos',
                    'bridge': 'puente que conecta conceptos o tiempos',
                    'qualifications': 'credenciales y competencias profesionales'
                  }
                }
              }
            },
            {
              id: 'b1-lesson-1-listening',
              motherNodeId: 'b1-lesson-1',
              type: 'listening',
              title: 'Escucha Comprensiva: Internship Interview at Imperial College',
              label: 'Inmersión Sonora',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                listening: {
                  title: 'Interview Discussion on Prior Research Experience',
                  audioDurationText: '1:45 min',
                  audioScriptEn: 'Could you tell us about the most significant project you have completed so far? Certainly! I have recently finalized a longitudinal study on environmental data systems, which has already received positive feedback from our faculty committee.',
                  audioScriptEs: '¿Podría contarnos sobre el proyecto más significativo que ha completado hasta ahora? Por supuesto, recientemente he finalizado un estudio longitudinal.',
                  culturalInsight: 'En entrevistas académicas en el Reino Unido, conectar la experiencia previa con palabras como "already", "recently" y "so far" proyecta proactividad y dinamismo.',
                  transcriptLines: [
                    {
                      speaker: 'Interviewer',
                      en: 'Have you ever managed a research team before this placement?',
                      es: '¿Alguna vez has gestionado un equipo de investigación antes de esta pasantía?',
                      phonetic: '/hæv juː ˈɛvər ˈmænɪdʒd ə rɪˈsɜːtʃ tiːm bɪˈfɔː ðɪs ˈpleɪsmənt/'
                    },
                    {
                      speaker: 'Candidate',
                      en: 'Yes, I have led a four-person student group for over twelve months.',
                      es: 'Sí, he liderado un grupo estudiantil de cuatro personas durante más de doce meses.',
                      phonetic: '/jɛs aɪ hæv lɛd ə fɔː ˈpɜːsən ˈstjuːdənt ɡruːp/'
                    }
                  ]
                }
              }
            },
            {
              id: 'b1-lesson-1-srs',
              motherNodeId: 'b1-lesson-1',
              type: 'srs',
              title: 'Repaso Espaciado: 5 Patrones de Presente Perfecto y Trayectoria',
              label: 'Mazo de Repaso',
              durationMinutes: 2,
              xpReward: 15,
              content: {
                srs: {
                  title: '5 Patrones de Trayectoria Profesional',
                  cardCount: 5,
                  targetPhrases: [
                    {
                      en: 'I have worked on this project for six months.',
                      es: 'He trabajado en este proyecto durante seis meses.',
                      phonetic: '/aɪ hæv wɜːkt ɒn ðɪs ˈprɒdʒɛkt fɔː sɪks mʌnθs/',
                      context: 'Duración con for en Presente Perfecto.'
                    },
                    {
                      en: 'Have you ever presented your research at an international conference?',
                      es: '¿Alguna vez has presentado tu investigación en un congreso internacional?',
                      phonetic: '/hæv juː ˈɛvər prɪˈzɛntɪd jɔːr rɪˈsɜːtʃ æt ən ˌɪntəˈnæʃənl ˈkɒnfərəns/',
                      context: 'Preguntar por experiencias de vida con ever.'
                    },
                    {
                      en: 'We have already submitted our final laboratory report.',
                      es: 'Ya hemos entregado nuestro informe final de laboratorio.',
                      phonetic: '/wiː hæv ɔːlˈrɛdi səbˈmɪtɪd ˈaʊər ˈfaɪnl ləˈbɒrətəri rɪˈpɔːt/',
                      context: 'Acción completada con already.'
                    },
                    {
                      en: 'She has not received the official confirmation email yet.',
                      es: 'Ella aún no ha recibido el correo de confirmación oficial.',
                      phonetic: '/ʃiː hæz nɒt rɪˈsiːvd ðɪ əˈfɪʃəl ˌkɒnfəˈmeɪʃən ˈiːmeɪl jɛt/',
                      context: 'Acción pendiente con yet al final.'
                    },
                    {
                      en: 'I have gained significant experience in scientific data analysis.',
                      es: 'He adquirido una experiencia significativa en análisis de datos científicos.',
                      phonetic: '/aɪ hæv ɡeɪnd sɪɡˈnɪfɪkənt ɪkˈspɪəriəns ɪn ˌsaɪənˈtɪfɪk ˈdeɪtə əˈnæləsɪs/',
                      context: 'Declarar competencias acumuladas.'
                    }
                  ]
                }
              }
            }
          ]
        },
        'b1-lesson-2': {
          lessonId: 'b1-lesson-2',
          lessonCode: '3.2',
          title: 'Resolver problemas en el campus: si esto pasa, haremos aquello',
          subNodes: [
            {
              id: 'b1-lesson-2-reading',
              motherNodeId: 'b1-lesson-2',
              type: 'reading',
              title: 'Lectura de Inmersión: Contingency Planning for Final Presentations',
              label: 'Lectura Guiada',
              durationMinutes: 3,
              xpReward: 20,
              content: {
                reading: {
                  title: 'Problem-Solving on Campus: Planning Contingencies with Conditionals',
                  summary: 'Estrategias para resolver imprevistos técnicos y logísticos antes de una presentación académica usando condicionales.',
                  wordCount: 230,
                  readingMinutes: 3,
                  paragraphs: [
                    'Unexpected problems are a normal part of academic life. Whether the campus projector fails or presentation files get corrupted, having a clear contingency plan makes all the difference.',
                    '"If the WiFi connection goes down during our demonstration, we will switch to our offline backup slides immediately," noted Sarah during the group rehearsal.',
                    'Evaluating cause and effect using conditional structures helps teams anticipate obstacles calmly. If team members know exactly what action to take when an obstacle arises, anxiety disappears.',
                    '"If we had more time, we would redesign the whole interface," admitted David. "However, if we focus on the core functionality today, our examiners will appreciate the clarity of our solution."',
                    'Mastering realistic conditions (First Conditional) and hypothetical scenarios (Second Conditional) empowers university students to handle practical dilemmas with maturity and composure.'
                  ],
                  vocabulary: {
                    'contingency': 'plan de contingencia ante imprevistos',
                    'corrupted': 'archivos digitales dañados o ilegibles',
                    'rehearsal': 'ensayo previo a una presentación',
                    'anticipate': 'anticipar obstáculos con serenidad',
                    'examiners': 'evaluadores del jurado académico',
                    'functionality': 'funcionalidad operativa principal',
                    'composure': 'calma y compostura bajo presión'
                  }
                }
              }
            },
            {
              id: 'b1-lesson-2-listening',
              motherNodeId: 'b1-lesson-2',
              type: 'listening',
              title: 'Escucha Comprensiva: Technical Support Troubleshooting',
              label: 'Inmersión Sonora',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                listening: {
                  title: 'Troubleshooting with the IT Helpdesk',
                  audioDurationText: '1:35 min',
                  audioScriptEn: 'If the terminal does not accept your student login, try restarting the authentication service first. If that still does not work, bring your campus card to the IT helpdesk in room 102 and we will reset your credentials within five minutes.',
                  audioScriptEs: 'Si la terminal no acepta tu usuario, intenta reiniciar el servicio. Si sigue sin funcionar, trae tu carnet a soporte.',
                  culturalInsight: 'Los servicios de soporte técnico británicos utilizan condicionales claros ("If X happens, please do Y") para guiar de manera metódica y respetuosa.',
                  transcriptLines: [
                    {
                      speaker: 'Student',
                      en: 'What will happen if our experiment does not finish before six?',
                      es: '¿Qué pasará si nuestro experimento no termina antes de las seis?',
                      phonetic: '/wɒt wɪl ˈhæpən ɪf ˈaʊər ɪkˈspɛrɪmənt dʌz nɒt ˈfɪnɪʃ/'
                    },
                    {
                      speaker: 'Lab Technician',
                      en: 'If you notify the security desk in advance, they will extend your access pass.',
                      es: 'Si avisas al puesto de seguridad con anticipación, extenderán tu pase de acceso.',
                      phonetic: '/ɪf juː ˈnəʊtɪfaɪ ðə sɪˈkjʊərɪti dɛsk/'
                    }
                  ]
                }
              }
            },
            {
              id: 'b1-lesson-2-srs',
              motherNodeId: 'b1-lesson-2',
              type: 'srs',
              title: 'Repaso Espaciado: 5 Patrones de Causa-Efecto y Condicionales',
              label: 'Mazo de Repaso',
              durationMinutes: 2,
              xpReward: 15,
              content: {
                srs: {
                  title: '5 Patrones de Condicionales (1st & 2nd)',
                  cardCount: 5,
                  targetPhrases: [
                    {
                      en: 'If it rains tomorrow, we will study inside the library.',
                      es: 'Si llueve mañana, estudiaremos dentro de la biblioteca.',
                      phonetic: '/ɪf ɪt reɪnz təˈmɒrəʊ wiː wɪl ˈstʌdi ɪnˈsaɪd ðə ˈlaɪbrəri/',
                      context: 'Primer condicional: situación real y probable.'
                    },
                    {
                      en: 'If I have time this evening, I will review your draft.',
                      es: 'Si tengo tiempo esta tarde, revisaré tu borrador.',
                      phonetic: '/ɪf aɪ hæv taɪm ðɪs ˈiːvnɪŋ aɪ wɪl rɪˈvjuː jɔːr drɑːft/',
                      context: 'Ofrecimiento condicional de ayuda.'
                    },
                    {
                      en: 'What will you do if the laboratory is closed?',
                      es: '¿Qué harás si el laboratorio está cerrado?',
                      phonetic: '/wɒt wɪl juː duː ɪf ðə ləˈbɒrətəri ɪz kləʊzd/',
                      context: 'Preguntar por planes alternativos.'
                    },
                    {
                      en: 'If I had more funding, I would purchase better equipment.',
                      es: 'Si tuviera más financiamiento, compraría mejor equipo.',
                      phonetic: '/ɪf aɪ hæd mɔːr ˈfʌndɪŋ aɪ wʊd ˈpɜːtʃəs ˈbɛtər ɪˈkwɪpmənt/',
                      context: 'Segundo condicional: hipótesis imaginaria en presente.'
                    },
                    {
                      en: 'If you follow the protocol carefully, the results will be accurate.',
                      es: 'Si sigues el protocolo con cuidado, los resultados serán precisos.',
                      phonetic: '/ɪf juː ˈfɒləʊ ðə ˈprəʊtəkɒl ˈkɛəfʊli ðə rɪˈzʌlts wɪl biː ˈækjʊrət/',
                      context: 'Garantía condicional en procedimientos académicos.'
                    }
                  ]
                }
              }
            }
          ]
        },
        'b1-lesson-3': {
          lessonId: 'b1-lesson-3',
          lessonCode: '3.3',
          title: 'Evolución del entorno: cómo ha cambiado mi ciudad y universidad',
          subNodes: [
            {
              id: 'b1-lesson-3-reading',
              motherNodeId: 'b1-lesson-3',
              type: 'reading',
              title: 'Lectura de Inmersión: The Transformation of University Spaces',
              label: 'Lectura Guiada',
              durationMinutes: 3,
              xpReward: 20,
              content: {
                reading: {
                  title: 'How Campus and City Life Evolved Over Decades',
                  summary: 'Un recorrido por la historia del campus de Bloomsbury y cómo la tecnología transformó las bibliotecas antes de la llegada de la era digital.',
                  wordCount: 235,
                  readingMinutes: 3,
                  paragraphs: [
                    'Walking through the historic quadrangle of the university, it is fascinating to see how educational spaces have adapted across generations.',
                    'Fifty years ago, students had to consult physical card catalogues in quiet subterranean archives before they could borrow a single research volume. By the time computers arrived in the late nineteen-eighties, librarians had already indexed thousands of manuscripts by hand.',
                    'Professor Davies, who has taught here since nineteen ninety-two, often reminds students about this transition: "Before we had high-speed internet, scholars had traveled across continents just to verify a footnote."',
                    'Today, the campus has integrated modern solar-powered study pods and collaborative glass workshops while preserving its nineteenth-century Victorian facade.',
                    'Using the Past Perfect (had done) allows students to articulate chronology clearly, explaining what had happened before another significant turning point occurred.'
                  ],
                  vocabulary: {
                    'quadrangle': 'patio cuadrangular universitario tradicional',
                    'subterranean': 'subterráneo o bajo tierra',
                    'catalogues': 'catálogos de fichas bibliográficas',
                    'manuscripts': 'manuscritos y documentos históricos',
                    'transition': 'transición evolutiva a lo largo del tiempo',
                    'preserving': 'conservando el patrimonio arquitectónico',
                    'chronology': 'secuencia cronológica de hechos'
                  }
                }
              }
            },
            {
              id: 'b1-lesson-3-listening',
              motherNodeId: 'b1-lesson-3',
              type: 'listening',
              title: 'Escucha Comprensiva: A Veteran Professor\'s Campus Tour',
              label: 'Inmersión Sonora',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                listening: {
                  title: 'Reminiscing About the Old University Quarters',
                  audioDurationText: '1:45 min',
                  audioScriptEn: 'When I first joined the department in 1985, this modern science center did not exist. The university had originally used this plot as a botanical garden before the expansion was approved.',
                  audioScriptEs: 'Cuando me uní al departamento en 1985, este centro moderno de ciencias no existía. La universidad había usado originalmente este terreno como jardín botánico.',
                  culturalInsight: 'En la tradición académica británica, la historia de los colegios mayores y sus transformaciones es motivo de orgullo y conversación habitual.',
                  transcriptLines: [
                    {
                      speaker: 'Professor Davies',
                      en: 'Had you heard about the ancient underground tunnel system before today?',
                      es: '¿Habías oído hablar del antiguo sistema de túneles subterráneos antes de hoy?',
                      phonetic: '/hæd juː hɜːd əˈbaʊt ðɪ ˈeɪnʃənt ˈʌndəɡraʊnd ˈtʌnl ˈsɪstɪm/'
                    },
                    {
                      speaker: 'Student',
                      en: 'No, I hadn\'t! Someone told me they had discovered it during renovations.',
                      es: '¡No! Alguien me dijo que lo habían descubierto durante las remodelaciones.',
                      phonetic: '/nəʊ aɪ ˈhædnt ˈsʌmwʌn təʊld miː ðeɪ hæd dɪsˈkʌvəd ɪt/'
                    }
                  ]
                }
              }
            },
            {
              id: 'b1-lesson-3-srs',
              motherNodeId: 'b1-lesson-3',
              type: 'srs',
              title: 'Repaso Espaciado: 5 Patrones de Pasado Perfecto y Cronología',
              label: 'Mazo de Repaso',
              durationMinutes: 2,
              xpReward: 15,
              content: {
                srs: {
                  title: '5 Patrones de Cronología Pasada (Had Done)',
                  cardCount: 5,
                  targetPhrases: [
                    {
                      en: 'When I arrived at the lecture hall, the professor had already started.',
                      es: 'Cuando llegué al aula magna, el profesor ya había comenzado.',
                      phonetic: '/wɛn aɪ əˈraɪvd æt ðə ˈlɛktʃər hɔːl ðə prəˈfɛsər hæd ɔːlˈrɛdi ˈstɑːtɪd/',
                      context: 'Acción que ocurrió antes de otro momento en el pasado.'
                    },
                    {
                      en: 'They had lived in London for three years before moving to Cambridge.',
                      es: 'Habían vivido en Londres durante tres años antes de mudarse a Cambridge.',
                      phonetic: '/ðeɪ hæd lɪvd ɪn ˈlʌndən fɔː θriː jɪərz bɪˈfɔː ˈmuːvɪŋ tuː ˈkeɪmbrɪdʒ/',
                      context: 'Periodo concluido antes de un segundo evento pasado.'
                    },
                    {
                      en: 'She realized that she had left her student badge in the dormitory.',
                      es: 'Se dio cuenta de que había dejado su credencial en el dormitorio.',
                      phonetic: '/ʃiː ˈrɪəlaɪzd ðæt ʃiː hæd lɛft hɜː ˈstjuːdənt bædʒ ɪn ðə ˈdɔːmɪtri/',
                      context: 'Darse cuenta de un hecho previo.'
                    },
                    {
                      en: 'The city had changed dramatically by the time we returned.',
                      es: 'La ciudad había cambiado dramáticamente para cuando regresamos.',
                      phonetic: '/ðə ˈsɪti hæd tʃeɪndʒd drəˈmætɪkəli baɪ ðə taɪm wiː rɪˈtɜːnd/',
                      context: 'Evolución urbana concluida antes de una fecha.'
                    },
                    {
                      en: 'Had you ever visited the British Museum before that trip?',
                      es: '¿Habías visitado alguna vez el Museo Británico antes de ese viaje?',
                      phonetic: '/hæd juː ˈɛvər ˈvɪzɪtɪd ðə ˈbrɪtɪʃ mjuːˈziːəm bɪˈfɔː ðæt trɪp/',
                      context: 'Pregunta en Pasado Perfecto.'
                    }
                  ]
                }
              }
            }
          ]
        },
        'b1-lesson-4': {
          lessonId: 'b1-lesson-4',
          lessonCode: '3.4',
          title: 'Guía de servicios: cómo funciona el sistema de bibliotecas y transporte',
          subNodes: [
            {
              id: 'b1-lesson-4-reading',
              motherNodeId: 'b1-lesson-4',
              type: 'reading',
              title: 'Lectura de Inmersión: Operating Guides, Library Lending and Transport',
              label: 'Lectura Guiada',
              durationMinutes: 3,
              xpReward: 20,
              content: {
                reading: {
                  title: 'How Public and Academic Services Are Operated in London',
                  summary: 'Manual explicativo sobre el uso de la biblioteca universitaria, reserva de salas y el sistema de cobro automático por zonas en el transporte público con voz pasiva.',
                  wordCount: 240,
                  readingMinutes: 3,
                  paragraphs: [
                    'Navigating public and institutional systems in the United Kingdom becomes intuitive once their operating procedures are understood.',
                    'At the main university library, all book loans are processed automatically through RFID self-service kiosks. When an item is borrowed, a digital receipt is sent directly to the student\'s university inbox. Books are renewed automatically up to three times unless they are requested by another reader.',
                    'Similarly, the London transport network is managed through automated fare caps. Fares are calculated according to the zones crossed, and daily caps are applied so commuters are never overcharged.',
                    'When problems occur, assistance is provided at customer service windows or via verified mobile applications.',
                    'Using the Passive Voice (is processed, are calculated, is sent) allows writers to describe official systems objectively, putting the spotlight on the procedure rather than the individual person.'
                  ],
                  vocabulary: {
                    'intuitive': 'intuitivo y fácil de asimilar',
                    'processed': 'procesado de forma automática',
                    'receipt': 'comprobante o recibo digital',
                    'renewed': 'renovado periódicamente',
                    'fares': 'tarifas de transporte público',
                    'calculated': 'calculadas en función de variables',
                    'spotlight': 'foco de atención o protagonismo',
                    'objectively': 'de manera objetiva y neutral'
                  }
                }
              }
            },
            {
              id: 'b1-lesson-4-listening',
              motherNodeId: 'b1-lesson-4',
              type: 'listening',
              title: 'Escucha Comprensiva: Library Helpdesk Advice on Thesis Archiving',
              label: 'Inmersión Sonora',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                listening: {
                  title: 'How Theses Are Submitted and Catalogued',
                  audioDurationText: '1:40 min',
                  audioScriptEn: 'Final dissertations are submitted digitally through the academic repository. Once a submission is reviewed by the departmental board, it is assigned an international DOI number and made accessible to scholars worldwide.',
                  audioScriptEs: 'Las tesis finales son enviadas digitalmente. Una vez que la entrega es revisada, se le asigna un DOI y se hace accesible.',
                  culturalInsight: 'Los manuales e instrucciones de servicio en el Reino Unido prefieren la voz pasiva para mantener un tono formal, objetivo y despersonalizado.',
                  transcriptLines: [
                    {
                      speaker: 'Librarian',
                      en: 'How are inter-library book requests handled when an item is unavailable?',
                      es: '¿Cómo se manejan las solicitudes de préstamo interbibliotecario cuando un libro no está disponible?',
                      phonetic: '/haʊ ɑːr ˌɪntəˈlaɪbrəri bʊk rɪˈkwɛsts ˈhændld/'
                    },
                    {
                      speaker: 'Student Advisor',
                      en: 'They are requested from the British Library and delivered within forty-eight hours.',
                      es: 'Son solicitados a la British Library y entregados en cuarenta y ocho horas.',
                      phonetic: '/ðeɪ ɑːr rɪˈkwɛstɪd frɒm ðə ˈbrɪtɪʃ ˈlaɪbrəri/'
                    }
                  ]
                }
              }
            },
            {
              id: 'b1-lesson-4-srs',
              motherNodeId: 'b1-lesson-4',
              type: 'srs',
              title: 'Repaso Espaciado: 5 Patrones de Voz Pasiva en Procesos',
              label: 'Mazo de Repaso',
              durationMinutes: 2,
              xpReward: 15,
              content: {
                srs: {
                  title: '5 Patrones de Voz Pasiva de Procesos y Servicios',
                  cardCount: 5,
                  targetPhrases: [
                    {
                      en: 'Student identity cards are issued at the registry desk.',
                      es: 'Los carnets de estudiante son emitidos en el mostrador de registro.',
                      phonetic: '/ˈstjuːdənt aɪˈdɛntɪti kɑːdz ɑːr ˈɪʃuːd æt ðə ˈrɛdʒɪstri dɛsk/',
                      context: 'Voz pasiva en presente: proceso institucional.'
                    },
                    {
                      en: 'English is spoken by international scholars across the entire faculty.',
                      es: 'El inglés es hablado por académicos internacionales en toda la facultad.',
                      phonetic: '/ˈɪŋɡlɪʃ ɪz ˈspəʊkən baɪ ˌɪntəˈnæʃənl ˈskɒlərz/',
                      context: 'Pasiva con agente introducido por by.'
                    },
                    {
                      en: 'All library books must be returned before the end of the term.',
                      es: 'Todos los libros de la biblioteca deben ser devueltos antes del fin del trimestre.',
                      phonetic: '/ɔːl ˈlaɪbrəri bʊks mʌst biː rɪˈtɜːnd bɪˈfɔː ðɪ ɛnd ɒv ðə tɜːm/',
                      context: 'Pasiva con verbo modal (must be returned).'
                    },
                    {
                      en: 'These research papers were published in peer-reviewed journals.',
                      es: 'Estos artículos de investigación fueron publicados en revistas arbitradas.',
                      phonetic: '/ðiːz rɪˈsɜːtʃ ˈpeɪpərz wɜː ˈpʌblɪʃt ɪn pɪə rɪˈvjuːd ˈdʒɜːnlz/',
                      context: 'Voz pasiva en pasado (were published).'
                    },
                    {
                      en: 'Fares are automatically calculated when you tap your card.',
                      es: 'Las tarifas son calculadas automáticamente al apoyar tu tarjeta.',
                      phonetic: '/fɛərz ɑːr ˌɔːtəˈmætɪkəli ˈkælkjʊleɪtɪd wɛn juː tæp jɔːr kɑːd/',
                      context: 'Explicar automatización y servicios públicos.'
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    }
  }
};

// ============================================================================
// GENERADOR AUTOMÁTICO DE PLANTILLAS PARA UNIDADES 2 A 6 (A2 HASTA C2)
// Permite que todas las 24 lecciones tengan sus 3 SubNodos listos inmediatamente
// para que el usuario inyecte sus textos y audios específicos.
// ============================================================================

export function getSubNodesForLesson(lessonId: string, languageId: string = 'english'): SubNode[] {
  // 0. Si existe contenido modificado o creado en el cPanel de Administración (/admin) en localStorage
  if (typeof window !== 'undefined') {
    try {
      const customRaw = localStorage.getItem(`fluentia_custom_course_content_${languageId}`);
      if (customRaw) {
        const customData = JSON.parse(customRaw);
        if (customData?.modules) {
          for (const mod of Object.values<any>(customData.modules)) {
            if (mod?.lessons?.[lessonId]?.subNodes && mod.lessons[lessonId].subNodes.length > 0) {
              return mod.lessons[lessonId].subNodes;
            }
          }
        }
      }
    } catch {
      // fallback al contenido por defecto
    }
  }

  // 1. Si no es inglés, intentar buscar en el banco nativo del idioma
  if (languageId && languageId !== 'english') {
    try {
      // Si el navegador ya tiene el curso cargado o scaffolded
      const customRaw = typeof window !== 'undefined' ? localStorage.getItem(`fluentia_custom_course_content_${languageId}`) : null;
      if (customRaw) {
        const customData = JSON.parse(customRaw);
        for (const mod of Object.values<any>(customData.modules || {})) {
          if (mod?.lessons?.[lessonId]?.subNodes) return mod.lessons[lessonId].subNodes;
        }
      }
    } catch { }
  }

  // 2. Si existe contenido detallado explícito en COURSE_CONTENT, devolverlo
  for (const mod of Object.values(COURSE_CONTENT.modules)) {
    if (mod.lessons[lessonId]) {
      return mod.lessons[lessonId].subNodes;
    }
  }

  // 2. Si es una lección de A2 a C2 que aún no tiene JSON personalizado,
  // generar automáticamente la tríada de SubNodos de inmersión correspondiente
  return [
    {
      id: `${lessonId}-reading`,
      motherNodeId: lessonId,
      type: 'reading',
      title: 'Lectura de Inmersión Textual (Narrow Reading)',
      label: 'Lectura Guiada',
      durationMinutes: 3,
      xpReward: 20,
      content: {
        reading: {
          title: `Immersion Reading Practice • ${lessonId.toUpperCase()}`,
          summary: 'Texto graduado rico en contexto pragmático para adquirir vocabulario sin traducción mental.',
          wordCount: 250,
          readingMinutes: 3,
          paragraphs: [
            'Immersive exposure through comprehensible input is the core pillar of natural second language acquisition. When you read narratives directly connected to communicative tasks, your brain acquires grammatical structures unconsciously.',
            'In academic and professional environments, recognizing contextual markers and discourse connectors allows you to comprehend subtle nuances without pausing to consult a dictionary.',
            'Take your time to absorb the meaning of this passage. Click on any word you do not recognize to view its definition, pronunciation, and contextual meaning.'
          ],
          vocabulary: {
            'immersive': 'inmersivo (que envuelve en el idioma)',
            'comprehensible': 'comprensible y asimilable',
            'pillar': 'pilar fundamental',
            'nuances': 'matices sutiles de significado',
            'discourse': 'discurso comunicativo estructurado'
          }
        }
      }
    },
    {
      id: `${lessonId}-listening`,
      motherNodeId: lessonId,
      type: 'listening',
      title: 'Inmersión Sonora Receptiva (Native Audio)',
      label: 'Escucha Pasiva',
      durationMinutes: 2,
      xpReward: 20,
      content: {
        listening: {
          title: `Receptive Listening Immersion • ${lessonId.toUpperCase()}`,
          audioDurationText: '1:30 min',
          audioScriptEn: 'Listen to this native passage carefully. Pay attention to connected speech, elision, and natural intonation rhythms rather than translating every individual syllable.',
          audioScriptEs: 'Escucha este pasaje nativo con atención. Fíjate en los enlaces entre palabras y la entonación natural.',
          culturalInsight: 'La escucha repetida sin presión de evaluación fortalece el mapeo auditivo cerebral (filtro afectivo bajo).',
          transcriptLines: [
            {
              speaker: 'Native Speaker',
              en: 'Listening repeatedly to authentic input strengthens your natural intuition for language patterns.',
              es: 'Escuchar repetidamente input auténtico fortalece tu intuición natural para los patrones del idioma.',
              phonetic: '/ˈlɪsənɪŋ rɪˈpiːtɪdli tuː ɔːˈθɛntɪk ˈɪnpʊt/'
            }
          ]
        }
      }
    },
    {
      id: `${lessonId}-srs`,
      motherNodeId: lessonId,
      type: 'srs',
      title: 'Repaso Espaciado: 5 Estructuras Clave de la Misión',
      label: 'Mazo SRS',
      durationMinutes: 2,
      xpReward: 15,
      content: {
        srs: {
          title: `5 Estructuras Clave • ${lessonId.toUpperCase()}`,
          cardCount: 5,
          targetPhrases: [
            {
              en: 'Acquisition occurs when we understand messages in a low-anxiety environment.',
              es: 'La adquisición ocurre cuando comprendemos mensajes en un ambiente de baja ansiedad.',
              phonetic: '/ˌækwaɪˈzɪʃən əˈkɜːrz wɛn wiː ˌʌndərˈstænd ˈmɛsɪdʒɪz/',
              context: 'Principio de Adquisición Natural SLA.'
            },
            {
              en: 'Consistent exposure leads to spontaneous fluency over time.',
              es: 'La exposición constante conduce a una fluidez espontánea con el tiempo.',
              phonetic: '/kənˈsɪstənt ɪkˈspəʊʒər liːdz tuː spɒnˈteɪniəs ˈfluːənsi/',
              context: 'Principio de Fluidez Orgánica.'
            }
          ]
        }
      }
    }
  ];
}

export function getSubNodeById(subNodeId: string, languageId: string = 'english'): SubNode | undefined {
  const parts = subNodeId.split('-');
  const type = parts[parts.length - 1] as SubNodeType;
  const motherNodeId = parts.slice(0, -1).join('-');

  const subNodes = getSubNodesForLesson(motherNodeId, languageId);
  return subNodes.find(s => s.id === subNodeId || s.type === type);
}

// ============================================================================
// ARQUITECTURA MULTI-IDIOMA: LANGUAGE HUB REGISTRY
// ============================================================================

export interface LanguageHubEntry {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  tagline: string;
  description: string;
  levelsCount: number;
  lessonsCount: number;
  status: 'active' | 'coming_soon';
  colorGradient: string;
  badgeText: string;
  courseContent?: CourseContent;
}

export const LANGUAGES_REGISTRY: Record<string, LanguageHubEntry> = {
  english: {
    id: 'english',
    name: 'Inglés',
    nativeName: 'English',
    flag: '🇬🇧',
    tagline: 'Supervivencia Universitaria & Fluidez Académica',
    description: 'Adquisición natural desde los pasillos de Covent Garden hasta la defensa de tesis en Oxford con enfoque SLA.',
    levelsCount: 6,
    lessonsCount: 24,
    status: 'active',
    colorGradient: 'from-emerald-500 to-teal-400',
    badgeText: 'Activo • MCER A1 → C2',
    courseContent: COURSE_CONTENT
  },
  french: {
    id: 'french',
    name: 'Francés',
    nativeName: 'Français',
    flag: '🇫🇷',
    tagline: 'La Sorbona, Barrio Latino y Francés Universitario',
    description: 'Inmersión comunicativa en París: vida en el campus, debate académico y expresión formal FLE.',
    levelsCount: 6,
    lessonsCount: 24,
    status: 'coming_soon',
    colorGradient: 'from-blue-500 to-indigo-400',
    badgeText: 'Próximamente • En Desarrollo'
  },
  german: {
    id: 'german',
    name: 'Alemán',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    tagline: 'Ciencia, Tecnología e Innovación Universitaria',
    description: 'Estructuración lógica, precisión técnica en TU Munich y vida cotidiana estudiantil en Berlín.',
    levelsCount: 6,
    lessonsCount: 24,
    status: 'coming_soon',
    colorGradient: 'from-amber-500 to-orange-400',
    badgeText: 'Próximamente • En Desarrollo'
  },
  italian: {
    id: 'italian',
    name: 'Italiano',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    tagline: 'Humanidades, Arte, Diseño y Expresión Cultural',
    description: 'Comunicación viva en Florencia y Bolonia, análisis crítico del arte y fluidez conversacional.',
    levelsCount: 6,
    lessonsCount: 24,
    status: 'coming_soon',
    colorGradient: 'from-rose-500 to-pink-400',
    badgeText: 'Próximamente • En Desarrollo'
  },
  japanese: {
    id: 'japanese',
    name: 'Japonés',
    nativeName: '日本語',
    flag: '🇯🇵',
    tagline: 'Inmersión Contextual en Tokio & Lenguaje Académico',
    description: 'Kanji en contexto pragmático, cortesía keigo universitaria y vida cotidiana en Japón.',
    levelsCount: 6,
    lessonsCount: 24,
    status: 'coming_soon',
    colorGradient: 'from-red-500 to-rose-400',
    badgeText: 'Próximamente • En Desarrollo'
  }
};

export function getLanguageEntry(id: string): LanguageHubEntry {
  if (typeof window !== 'undefined') {
    try {
      const customRaw = localStorage.getItem('fluentia_custom_languages_registry');
      if (customRaw) {
        const customReg = JSON.parse(customRaw);
        if (customReg && customReg[id]) {
          return customReg[id];
        }
      }
    } catch {
      // fallback
    }
  }
  return LANGUAGES_REGISTRY[id] || LANGUAGES_REGISTRY['english'];
}

export function getAllLanguages(): Record<string, LanguageHubEntry> {
  const merged: Record<string, LanguageHubEntry> = { ...LANGUAGES_REGISTRY };
  if (typeof window !== 'undefined') {
    try {
      const customRaw = localStorage.getItem('fluentia_custom_languages_registry');
      if (customRaw) {
        const customReg = JSON.parse(customRaw);
        if (customReg && typeof customReg === 'object') {
          Object.assign(merged, customReg);
        }
      }
    } catch {
      // fallback
    }
  }
  return merged;
}
