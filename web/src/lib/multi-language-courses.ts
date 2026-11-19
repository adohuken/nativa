// ============================================================================
// FLUENTIA • BANCO CURRICULAR MULTI-IDIOMA (SLA KRASHEN)
// Proporciona contenidos de inmersión nativos para Inglés, Francés, Alemán,
// Italiano, Japonés y generador de andamiajes para nuevos idiomas agregados en el cPanel.
// ============================================================================

import {
  CourseContent,
  ModuleContent,
  LessonContent,
  SubNode,
  COURSE_CONTENT
} from '@/content/course-content';
import { AppStorage } from '@/lib/storage';

export interface LevelMetadata {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  unitNumber: number;
  moduleId: string;
  name: string;
}

export const LEVELS_CONFIG: Record<string, LevelMetadata> = {
  A1: { level: 'A1', unitNumber: 1, moduleId: 'module-1', name: 'A1 • Elemental' },
  A2: { level: 'A2', unitNumber: 2, moduleId: 'module-2', name: 'A2 • Básico' },
  B1: { level: 'B1', unitNumber: 3, moduleId: 'module-3', name: 'B1 • Intermedio' },
  B2: { level: 'B2', unitNumber: 4, moduleId: 'module-4', name: 'B2 • Avanzado' },
  C1: { level: 'C1', unitNumber: 5, moduleId: 'module-5', name: 'C1 • Profesional' },
  C2: { level: 'C2', unitNumber: 6, moduleId: 'module-6', name: 'C2 • Maestría' },
};

// Generador de Nodos para Francés
function createFrenchCourseContent(): CourseContent {
  return {
    modules: {
      'module-1': {
        moduleId: 'module-1',
        unitNumber: 1,
        level: 'A1',
        title: 'Unité 1 • Fondements et Survie Universitaire à Paris',
        lessons: {
          'a1-lesson-1': {
            lessonId: 'a1-lesson-1',
            lessonCode: '1.1',
            title: 'Arriver à Paris: qui je suis et d\'où je viens',
            subNodes: [
              {
                id: 'a1-lesson-1-reading',
                motherNodeId: 'a1-lesson-1',
                type: 'reading',
                title: 'Lecture d\'Immersion: Arrivée au Quartier Latin',
                label: 'Lecture Guidée',
                durationMinutes: 2,
                xpReward: 20,
                content: {
                  reading: {
                    title: 'Bonjour Paris: Au Centre de Conférences de la Sorbonne',
                    summary: 'David se présente lors d\'une conférence universitaire à Paris avec son amie Sarah.',
                    wordCount: 88,
                    readingMinutes: 2,
                    paragraphs: [
                      'Bonjour! Je m\'appelle David. Je viens du Nicaragua, mais aujourd\'hui je suis à Paris. Je participe à une grande conférence universitaire près de la Sorbonne. C\'est ma première fois en France.',
                      'Je suis étudiant en informatique. J\'ai vingt ans. Je suis ici avec mon amie Sarah. Elle est aussi étudiante. Elle vient du Canada.',
                      'Nous sommes très heureux d\'être ici. La conférence commence aujourd\'hui. Nous sommes prêts pour les cours. Êtes-vous prêts aussi?'
                    ],
                    vocabulary: {
                      'conférence': 'Conferencia (reunión académica)',
                      'étudiant': 'Estudiante universitario/a',
                      'ami': 'Amigo / amiga',
                      'heureux': 'Feliz / contento',
                      'prêt': 'Listo / preparado'
                    }
                  }
                }
              },
              {
                id: 'a1-lesson-1-listening',
                motherNodeId: 'a1-lesson-1',
                type: 'listening',
                title: 'Écoute Réceptive: Arrivée à l\'Hôtel Parisien',
                label: 'Audio Natif',
                durationMinutes: 2,
                xpReward: 20,
                content: {
                  listening: {
                    title: 'Enregistrement à l\'Hôtel du Quartier Latin',
                    audioDurationText: '1:10 min',
                    audioScriptEn: 'Réceptionniste: Bonjour monsieur! Bienvenue à l\'Hôtel de Paris. Vous êtes ici pour la conférence?\nDavid: Oui, tout à fait. Je m\'appelle David Abarca.\nRéceptionniste: Parfait. Vous venez d\'Espagne?\nDavid: Non, je viens du Nicaragua.\nRéceptionniste: Enchanté! Et qui est cette demoiselle?\nDavid: C\'est Sarah. C\'est mon amie. Elle vient du Canada. Nous sommes étudiants.\nRéceptionniste: Très bien. Voici vos clés. Vous êtes à la chambre 304.',
                    audioScriptEs: 'Recepcionista: ¡Buenos días señor! Bienvenido al Hotel de París. ¿Viene por la conferencia?\nDavid: Sí, efectivamente. Me llamo David Abarca.\nRecepcionista: Perfecto. ¿Viene de España?\nDavid: No, vengo de Nicaragua.\nRecepcionista: ¡Encantado! ¿Y quién es esta señorita?\nDavid: Es Sarah. Es mi amiga. Viene de Canadá. Somos estudiantes.\nRecepcionista: Muy bien. Aquí tienen sus llaves. Están en la habitación 304.',
                    culturalInsight: 'En France, il est indispensable de toujours saluer d\'un "Bonjour monsieur/madame" avant de demander un service.',
                    transcriptLines: [
                      { speaker: 'RÉCEPTIONNISTE', en: 'Bonjour monsieur! Bienvenue à l\'Hôtel de Paris.', es: '¡Buenos días señor! Bienvenido al Hotel de París.' },
                      { speaker: 'DAVID', en: 'Oui, tout à fait. Je m\'appelle David Abarca.', es: 'Sí, efectivamente. Me llamo David Abarca.' },
                      { speaker: 'RÉCEPTIONNISTE', en: 'Voici vos clés. Vous êtes à la chambre 304.', es: 'Aquí tienen sus llaves. Están en la habitación 304.' }
                    ]
                  }
                }
              },
              {
                id: 'a1-lesson-1-srs',
                motherNodeId: 'a1-lesson-1',
                type: 'srs',
                title: 'Consolidation SRS: Vocabulaire Fondamental',
                label: 'Répétition Espacée',
                durationMinutes: 2,
                xpReward: 15,
                content: {
                  srs: {
                    title: 'Mazo de Repaso SRS: Première Rencontre',
                    cardCount: 5,
                    targetPhrases: [
                      { en: 'Je m\'appelle David et je suis étudiant.', es: 'Me llamo David y soy estudiante.', context: 'Présentation de base' },
                      { en: 'Je viens du Nicaragua.', es: 'Vengo de Nicaragua.', context: 'Origine et provenance' },
                      { en: 'Nous sommes très heureux d\'être ici.', es: 'Estamos muy felices de estar aquí.', context: 'Politesse' }
                    ]
                  }
                }
              }
            ]
          },
          'a1-lesson-2': {
            lessonId: 'a1-lesson-2',
            lessonCode: '1.2',
            title: 'L\'inventaire du campus: demander ce dont on a besoin',
            subNodes: [
              {
                id: 'a1-lesson-2-reading',
                motherNodeId: 'a1-lesson-2',
                type: 'reading',
                title: 'Lecture d\'Immersion: Ma Chambre Universitaire',
                label: 'Lecture Guidée',
                durationMinutes: 2,
                xpReward: 20,
                content: {
                  reading: {
                    title: 'Dans ma chambre à la Cité Universitaire',
                    summary: 'David décrit sa chambre et ses fournitures pour les cours à Paris.',
                    wordCount: 82,
                    readingMinutes: 2,
                    paragraphs: [
                      'Voici ma chambre à la résidence universitaire. Elle est petite mais très agréable. Il y a un lit, un bureau et une grande fenêtre.',
                      'Ceci est mon ordinateur portable. Il est sur le bureau. Voilà mon sac à dos. J\'ai un cahier et un stylo dans mon sac.',
                      'J\'ai besoin d\'un livre pour mon cours d\'histoire. Où est la bibliothèque? Je dois y aller cet après-midi.'
                    ],
                    vocabulary: {
                      'bureau': 'Escritorio / despacho',
                      'sac à dos': 'Mochila',
                      'cahier': 'Cuaderno',
                      'stylo': 'Bolígrafo',
                      'bibliothèque': 'Biblioteca'
                    }
                  }
                }
              },
              {
                id: 'a1-lesson-2-listening',
                motherNodeId: 'a1-lesson-2',
                type: 'listening',
                title: 'Écoute: Emprunter des Affaires au Campus',
                label: 'Audio Natif',
                durationMinutes: 2,
                xpReward: 20,
                content: {
                  listening: {
                    title: 'Au Bureau d\'Accueil des Étudiants',
                    audioDurationText: '1:05 min',
                    audioScriptEn: 'David: Excusez-moi, Sarah. Tu as un stylo bleu s\'il te plaît?\nSarah: Oui, bien sûr! Tiens, voilà un stylo et une feuille.\nDavid: Merci beaucoup. Tu sais où se trouve la bibliothèque centrale?\nSarah: Oui, elle est juste à côté du bâtiment des sciences.',
                    audioScriptEs: 'David: Disculpa, Sarah. ¿Tienes un bolígrafo azul por favor?\nSarah: ¡Sí, por supuesto! Toma, aquí tienes un bolígrafo y una hoja.\nDavid: Muchas gracias. ¿Sabes dónde queda la biblioteca central?\nSarah: Sí, está justo al lado del edificio de ciencias.',
                    culturalInsight: 'Utiliser "s\'il te plaît" entre étudiants et "s\'il vous plaît" avec le personnel.',
                    transcriptLines: [
                      { speaker: 'DAVID', en: 'Excusez-moi, tu as un stylo s\'il te plaît?', es: 'Disculpa, ¿tienes un bolígrafo por favor?' },
                      { speaker: 'SARAH', en: 'Oui, bien sûr! Tiens.', es: '¡Sí, por supuesto! Toma.' }
                    ]
                  }
                }
              },
              {
                id: 'a1-lesson-2-srs',
                motherNodeId: 'a1-lesson-2',
                type: 'srs',
                title: 'Consolidation SRS: Fournitures et Lieux',
                label: 'Répétition Espacée',
                durationMinutes: 2,
                xpReward: 15,
                content: {
                  srs: {
                    title: 'Mazo SRS: Matériel d\'étude',
                    cardCount: 4,
                    targetPhrases: [
                      { en: 'Où se trouve la bibliothèque centrale?', es: '¿Dónde se encuentra la biblioteca central?', context: 'Demander un lieu' },
                      { en: 'J\'ai besoin d\'un cahier et d\'un stylo.', es: 'Necesito un cuaderno y un bolígrafo.', context: 'Fournitures' }
                    ]
                  }
                }
              }
            ]
          },
          'a1-lesson-3': {
            lessonId: 'a1-lesson-3',
            lessonCode: '1.3',
            title: 'Une journée à l\'université: routines et horaires',
            subNodes: [
              {
                id: 'a1-lesson-3-reading',
                motherNodeId: 'a1-lesson-3',
                type: 'reading',
                title: 'Lecture d\'Immersion: Ma Journée Type',
                label: 'Lecture Guidée',
                durationMinutes: 2,
                xpReward: 20,
                content: {
                  reading: {
                    title: 'La Routine d\'un Étudiant à Paris',
                    summary: 'David raconte son emploi du temps quotidien entre cours, métro et révisions.',
                    wordCount: 85,
                    readingMinutes: 2,
                    paragraphs: [
                      'Tous les matins, je me réveille à sept heures. Je prends un café et un croissant au petit-déjeuner.',
                      'À huit heures et demie, je prends la ligne 4 du métro. Les cours commencent à neuf heures précises dans le grand amphithéâtre.',
                      'À midi, je déjeune au restaurant universitaire avec mes camarades. L\'après-midi, nous étudions ensemble jusqu\'à dix-sept heures.'
                    ],
                    vocabulary: {
                      'se réveiller': 'Despertarse',
                      'croissant': 'Cruasán',
                      'amphithéâtre': 'Aula magna / anfiteatro',
                      'restaurant universitaire': 'Comedor universitario (Resto U)'
                    }
                  }
                }
              },
              {
                id: 'a1-lesson-3-listening',
                motherNodeId: 'a1-lesson-3',
                type: 'listening',
                title: 'Écoute: Planifier l\'Après-Midi',
                label: 'Audio Natif',
                durationMinutes: 2,
                xpReward: 20,
                content: {
                  listening: {
                    title: 'Rendez-vous devant l\'amphi',
                    audioDurationText: '1:10 min',
                    audioScriptEn: 'Sarah: Salut David! À quelle heure termine ton cours de maths?\nDavid: Il termine à quatorze heures. Et toi?\nSarah: Moi à quinze heures. On se retrouve au café de la place pour réviser?\nDavid: Excellente idée, à tout à l\'heure!',
                    audioScriptEs: 'Sarah: ¡Hola David! ¿A qué hora termina tu clase de matemáticas?\nDavid: Termina a las dos de la tarde. ¿Y tú?\nSarah: Yo a las tres. ¿Nos encontramos en el café de la plaza para repasar?\nDavid: ¡Excelente idea, hasta luego!',
                    culturalInsight: 'En France, les horaires de cours sont stricts; arriver 5 minutes avant est de mise.',
                    transcriptLines: [
                      { speaker: 'SARAH', en: 'À quelle heure termine ton cours?', es: '¿A qué hora termina tu clase?' },
                      { speaker: 'DAVID', en: 'À quatorze heures. On se retrouve après.', es: 'A las dos de la tarde. Nos vemos después.' }
                    ]
                  }
                }
              },
              {
                id: 'a1-lesson-3-srs',
                motherNodeId: 'a1-lesson-3',
                type: 'srs',
                title: 'Consolidation SRS: Horaires et Rendez-vous',
                label: 'Répétition Espacée',
                durationMinutes: 2,
                xpReward: 15,
                content: {
                  srs: {
                    title: 'Mazo SRS: Les heures et la routine',
                    cardCount: 4,
                    targetPhrases: [
                      { en: 'Le cours commence à neuf heures précises.', es: 'La clase empieza a las nueve en punto.', context: 'Horaires' },
                      { en: 'On se retrouve devant la bibliothèque.', es: 'Nos encontramos frente a la biblioteca.', context: 'Rendez-vous' }
                    ]
                  }
                }
              }
            ]
          },
          'a1-lesson-4': {
            lessonId: 'a1-lesson-4',
            lessonCode: '1.4',
            title: 'Nourriture et survie: commander un café et payer',
            subNodes: [
              {
                id: 'a1-lesson-4-reading',
                motherNodeId: 'a1-lesson-4',
                type: 'reading',
                title: 'Lecture d\'Immersion: Au Bistro Parisien',
                label: 'Lecture Guidée',
                durationMinutes: 2,
                xpReward: 20,
                content: {
                  reading: {
                    title: 'Commander au comptoir d\'un Café',
                    summary: 'David apprend les codes de politesse pour commander son premier café à Paris.',
                    wordCount: 80,
                    readingMinutes: 2,
                    paragraphs: [
                      'J\'entre dans un petit bistro du boulevard Saint-Michel. Le serveur me regarde et dit: "Bonjour, que désirez-vous?"',
                      'Je réponds poliment: "Un café au lait et une tartine beurrée, s\'il vous plaît." Il prépare la commande rapidement.',
                      'Je demande l\'addition: "C\'est combien, s\'il vous plaît?" Ça fait quatre euros. Je paie par carte bancaire avec mon téléphone.'
                    ],
                    vocabulary: {
                      'bistro': 'Bistró / café típico',
                      'café au lait': 'Café con leche',
                      'tartine': 'Tostada con mantequilla',
                      'addition': 'La cuenta',
                      'carte bancaire': 'Tarjeta bancaria'
                    }
                  }
                }
              },
              {
                id: 'a1-lesson-4-listening',
                motherNodeId: 'a1-lesson-4',
                type: 'listening',
                title: 'Écoute: Au Comptoir du Barista',
                label: 'Audio Natif',
                durationMinutes: 2,
                xpReward: 20,
                content: {
                  listening: {
                    title: 'Commande rapide au Café Saint-Germain',
                    audioDurationText: '1:00 min',
                    audioScriptEn: 'Serveur: Bonjour! Vous désirez consommer sur place ou à emporter?\nDavid: Sur place, s\'il vous plaît. Un expresso et un croissant.\nServeur: Très bien, ça fera trois euros cinquante.\nDavid: Voilà. Est-ce que vous prenez la carte?\nServeur: Oui, sans contact à partir d\'un euro. Merci bonne journée!',
                    audioScriptEs: 'Camarero: ¡Buenos días! ¿Desea tomar aquí o para llevar?\nDavid: Para tomar aquí, por favor. Un expreso y un cruasán.\nCamarero: Muy bien, son tres euros cincuenta.\nDavid: Aquí tiene. ¿Aceptan tarjeta?\nCamarero: Sí, sin contacto a partir de un euro. ¡Gracias y buen día!',
                    culturalInsight: 'Boire un café au comptoir (debout) est souvent moins cher qu\'en terrasse.',
                    transcriptLines: [
                      { speaker: 'SERVEUR', en: 'Sur place ou à emporter?', es: '¿Para tomar aquí o para llevar?' },
                      { speaker: 'DAVID', en: 'Sur place s\'il vous plaît. Un café au lait.', es: 'Para tomar aquí, por favor. Un café con leche.' }
                    ]
                  }
                }
              },
              {
                id: 'a1-lesson-4-srs',
                motherNodeId: 'a1-lesson-4',
                type: 'srs',
                title: 'Consolidation SRS: Politesse et Paiement',
                label: 'Répétition Espacée',
                durationMinutes: 2,
                xpReward: 15,
                content: {
                  srs: {
                    title: 'Mazo SRS: Au restaurant',
                    cardCount: 4,
                    targetPhrases: [
                      { en: 'L\'addition, s\'il vous plaît.', es: 'La cuenta, por favor.', context: 'Payer au restaurant' },
                      { en: 'Sur place ou à emporter?', es: '¿Para tomar aquí o para llevar?', context: 'Commande' }
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
        title: 'Unité 2 • Communication Quotidienne et Voyages',
        lessons: generateScaffoldLessons('a2', '2', 'A2', 'fr', 'Voyages et Campus')
      },
      'module-3': {
        moduleId: 'module-3',
        unitNumber: 3,
        level: 'B1',
        title: 'Unité 3 • Projets Académiques et Résolution de Problèmes',
        lessons: generateScaffoldLessons('b1', '3', 'B1', 'fr', 'Projets et Débats')
      },
      'module-4': {
        moduleId: 'module-4',
        unitNumber: 4,
        level: 'B2',
        title: 'Unité 4 • Débat Universitaire et Argumentation',
        lessons: generateScaffoldLessons('b2', '4', 'B2', 'fr', 'Argumentation Critique')
      },
      'module-5': {
        moduleId: 'module-5',
        unitNumber: 5,
        level: 'C1',
        title: 'Unité 5 • Rhétorique Académique et Recherche',
        lessons: generateScaffoldLessons('c1', '5', 'C1', 'fr', 'Écriture Académique')
      },
      'module-6': {
        moduleId: 'module-6',
        unitNumber: 6,
        level: 'C2',
        title: 'Unité 6 • Soutenance de Thèse et Maîtrise Bilingue',
        lessons: generateScaffoldLessons('c2', '6', 'C2', 'fr', 'Maîtrise Doctorale')
      }
    }
  };
}

// Generador de Nodos de Andamiaje para Unidades Superiores y Nuevos Idiomas
export function generateScaffoldLessons(
  prefix: string,
  unitNum: string,
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
  langCode: string,
  domainTheme: string
): Record<string, LessonContent> {
  const result: Record<string, LessonContent> = {};

  const titlesByLevel: Record<string, string[]> = {
    A1: [
      'Primer encuentro en la universidad: saludos y presentaciones',
      'El inventario del campus: pedir materiales y orientarse',
      'La rutina del estudiante: horarios y vida académica',
      'Supervivencia en la ciudad: compras y pedir café'
    ],
    A2: [
      'Mi primer fin de semana: anécdotas y relatos en pasado',
      'Compras en el campus: comparar precios y calidades',
      'Compromisos y planes: organizar salidas con compañeros',
      'Normas del campus: deberes, permisos y prohibiciones'
    ],
    B1: [
      'Mi portafolio académico: logros e hitos personales',
      'Resolver imprevistos en el campus: condicionales prácticos',
      'Transformaciones urbanas: cómo ha evolucionado el campus',
      'Guía de recursos: cómo funcionan los laboratorios y servicios'
    ],
    B2: [
      'Estructurar una tesis: argumentar con solidez en seminarios',
      'Evaluación de hipótesis: análisis crítico de decisiones pasadas',
      'Citas y referencias: reportar discursos de investigadores',
      'Deducción lógica: formular hipótesis a partir de evidencias'
    ],
    C1: [
      'El discurso persuasivo: énfasis retórico en conferencias',
      'El matiz científico: cautela y precisión en papers',
      'Reformulación de impacto: sintetizar ideas complejas',
      'Diplomacia y mediación en comités universitarios'
    ],
    C2: [
      'Negociación de alto nivel: pragmática implícita y registros',
      'Variación sociolingüística y dialectos internacionales',
      'Redacción impecable para publicaciones indexadas',
      'Defensa ante el tribunal: soltura y rigor doctoral'
    ]
  };

  const levelTitles = titlesByLevel[level] || titlesByLevel.A1;

  for (let i = 1; i <= 4; i++) {
    const lessonId = `${prefix}-lesson-${i}`;
    const code = `${unitNum}.${i}`;
    const title = levelTitles[i - 1];

    result[lessonId] = {
      lessonId,
      lessonCode: code,
      title: `${title} (${domainTheme})`,
      subNodes: [
        {
          id: `${lessonId}-reading`,
          motherNodeId: lessonId,
          type: 'reading',
          title: `Lectura de Inmersión Graduada • ${code}`,
          label: 'Lectura Guiada',
          durationMinutes: 3,
          xpReward: 25,
          content: {
            reading: {
              title: `Immersion Reading Practice • ${code} [${langCode.toUpperCase()}]`,
              summary: `Texto de inmersión nivel ${level} diseñado bajo la hipótesis del Input Comprensible i+1.`,
              wordCount: 180 + (i * 20),
              readingMinutes: 3,
              paragraphs: [
                `Texto auténtico y graduado para el nivel ${level} enfocado en ${title.toLowerCase()}.`,
                `Los estudiantes procesan el significado contextual antes de reparar en la forma formal.`,
                `Esta práctica fomenta la fluidez sin traducción mental ni ansiedad de desempeño.`
              ],
              vocabulary: {
                'objetivo': 'Meta pedagógica del nodo',
                'contexto': 'Escenario de inmersión comunicativa',
                'adquisición': 'Internalización implícita del lenguaje'
              }
            }
          }
        },
        {
          id: `${lessonId}-listening`,
          motherNodeId: lessonId,
          type: 'listening',
          title: `Audio Receptivo Nativo • ${code}`,
          label: 'Audio Natif',
          durationMinutes: 2,
          xpReward: 25,
          content: {
            listening: {
              title: `Auditory Immersion • ${code} (${title})`,
              audioDurationText: '1:30 min',
              audioScriptEn: `Audio script for lesson ${code} in ${langCode.toUpperCase()}.\nSpeaker A: Hello, welcome to our discussion on ${title}.\nSpeaker B: Thank you! I am ready to review the core points today.`,
              audioScriptEs: `Guión de audio para la lección ${code} en ${langCode.toUpperCase()}.\nInterlocutor A: Hola, bienvenido a nuestra discusión sobre ${title}.\nInterlocutor B: ¡Gracias! Estoy listo para revisar los puntos clave hoy.`,
              culturalInsight: `Cápsula cultural de nivel ${level} sobre normas de cortesía y comunicación en ${langCode.toUpperCase()}.`,
              transcriptLines: [
                { speaker: 'PROFESOR', en: `Welcome to module ${code}.`, es: `Bienvenidos al módulo ${code}.` },
                { speaker: 'ESTUDIANTE', en: `Thank you, let's explore ${title}.`, es: `Gracias, exploremos ${title}.` }
              ]
            }
          }
        },
        {
          id: `${lessonId}-srs`,
          motherNodeId: lessonId,
          type: 'srs',
          title: `Repaso Espaciado (SRS) • ${code}`,
          label: 'Répétition Espacée',
          durationMinutes: 2,
          xpReward: 15,
          content: {
            srs: {
              title: `Mazo SRS • Lección ${code}`,
              cardCount: 4,
              targetPhrases: [
                { en: `Key academic phrase for ${code}`, es: `Frase académica clave para ${code}`, context: 'Uso universitario' },
                { en: `Pragmatic expression in ${langCode.toUpperCase()}`, es: `Expresión pragmática en ${langCode.toUpperCase()}`, context: 'Comunicación cotidiana' }
              ]
            }
          }
        }
      ]
    };
  }

  return result;
}

// Generador genérico para cualquier nuevo idioma
export function createGenericCourseForLanguage(langId: string, langName: string): CourseContent {
  const levels: Array<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'> = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const prefixes = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
  const modules: Record<string, ModuleContent> = {};

  levels.forEach((lvl, idx) => {
    const unitNumber = idx + 1;
    const moduleId = `module-${unitNumber}`;
    const prefix = prefixes[idx];

    modules[moduleId] = {
      moduleId,
      unitNumber,
      level: lvl,
      title: `Unidad ${unitNumber} • Curso Universitario de ${langName} (${lvl})`,
      lessons: generateScaffoldLessons(prefix, `${unitNumber}`, lvl, langId, `${langName} Universitario`)
    };
  });

  return { modules };
}

// Obtener o inicializar contenido para un idioma
export function getCourseContentForLanguage(languageId: string): CourseContent {
  // 1. Si existe en localStorage modificado por el usuario/admin, retornarlo
  if (typeof window !== 'undefined') {
    const saved = AppStorage.getCustomCourseContent(languageId);
    if (saved && saved.modules && Object.keys(saved.modules).length > 0) {
      return saved;
    }
  }

  // 2. Si es inglés, el curso nativo base
  if (languageId === 'english') {
    return COURSE_CONTENT;
  }

  // 3. Si es francés, el banco completo en francés
  if (languageId === 'french') {
    return createFrenchCourseContent();
  }

  // 4. Para cualquier otro idioma (alemán, italiano, japonés, portugués, etc.)
  const fallbackNames: Record<string, string> = {
    german: 'Alemán',
    italian: 'Italiano',
    japanese: 'Japonés',
    portuguese: 'Portugués'
  };
  const name = fallbackNames[languageId] || languageId.toUpperCase();
  return createGenericCourseForLanguage(languageId, name);
}

// Guardar lección actualizada en un idioma
export function saveLessonInLanguage(
  languageId: string,
  level: string,
  lessonId: string,
  updatedData: {
    title: string;
    subtitle?: string;
    scenario?: string;
    reading?: {
      title: string;
      minutes: number;
      paragraphs: string[];
      vocabulary: Record<string, string>;
    };
    listening?: {
      title: string;
      durationText: string;
      audioUrl?: string;
      scriptEn: string;
      scriptEs: string;
      culturalInsight: string;
    };
  }
): CourseContent {
  const course = getCourseContentForLanguage(languageId);
  const lvlConfig = LEVELS_CONFIG[level] || LEVELS_CONFIG.A1;
  const modId = lvlConfig.moduleId;

  if (!course.modules[modId]) {
    course.modules[modId] = {
      moduleId: modId,
      unitNumber: lvlConfig.unitNumber,
      level: lvlConfig.level,
      title: `Unidad ${lvlConfig.unitNumber} (${level})`,
      lessons: {}
    };
  }

  const mod = course.modules[modId];
  if (!mod.lessons[lessonId]) {
    const unitNum = lvlConfig.unitNumber;
    const lessonIdx = lessonId.split('-').pop() || '1';
    mod.lessons[lessonId] = {
      lessonId,
      lessonCode: `${unitNum}.${lessonIdx}`,
      title: updatedData.title,
      subNodes: []
    };
  }

  const lesson = mod.lessons[lessonId];
  lesson.title = updatedData.title;

  // Actualizar SubNodo Reading
  if (updatedData.reading) {
    let rNode = lesson.subNodes.find(s => s.type === 'reading');
    if (!rNode) {
      rNode = {
        id: `${lessonId}-reading`,
        motherNodeId: lessonId,
        type: 'reading',
        title: 'Lectura de Inmersión',
        label: 'Lectura Guiada',
        durationMinutes: updatedData.reading.minutes,
        xpReward: 20,
        content: {}
      };
      lesson.subNodes.push(rNode);
    }
    rNode.durationMinutes = updatedData.reading.minutes;
    rNode.content.reading = {
      title: updatedData.reading.title,
      summary: `Lectura guiada de inmersión para ${updatedData.title}`,
      wordCount: updatedData.reading.paragraphs.join(' ').split(/\s+/).length,
      readingMinutes: updatedData.reading.minutes,
      paragraphs: updatedData.reading.paragraphs,
      vocabulary: updatedData.reading.vocabulary
    };
  }

  // Actualizar SubNodo Listening
  if (updatedData.listening) {
    let lNode = lesson.subNodes.find(s => s.type === 'listening');
    if (!lNode) {
      lNode = {
        id: `${lessonId}-listening`,
        motherNodeId: lessonId,
        type: 'listening',
        title: 'Audio Receptivo',
        label: 'Audio Natif',
        durationMinutes: 2,
        xpReward: 20,
        content: {}
      };
      lesson.subNodes.push(lNode);
    }
    lNode.content.listening = {
      title: updatedData.listening.title,
      audioDurationText: updatedData.listening.durationText,
      audioScriptEn: updatedData.listening.scriptEn,
      audioScriptEs: updatedData.listening.scriptEs,
      culturalInsight: updatedData.listening.culturalInsight,
      transcriptLines: updatedData.listening.scriptEn.split('\n').filter(Boolean).map(line => {
        const [speaker, text] = line.includes(':') ? line.split(':') : ['LOCUTOR', line];
        return {
          speaker: speaker.trim().toUpperCase(),
          en: (text || '').trim(),
          es: ''
        };
      })
    };
  }

  // Guardar en Storage
  AppStorage.saveCustomCourseContent(course, languageId);
  return course;
}
