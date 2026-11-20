// ============================================================================
// NATIVA • TRACKS DE ESPECIALIZACIÓN PROFESIONAL (SLA KRASHEN BPO & INDUSTRY)
// Define las rutas especializadas independientes (ej. Call Center, IT, Enfermería)
// con la misma arquitectura de Nodos Madre y Sub-Nodos de Inmersión.
// ============================================================================

import { CourseContent, SubNode } from '@/content/course-content';

export type CourseType = 'general' | 'specialized';

export interface SpecializedTrack {
  id: string;
  slug: string;
  languageId: string;
  courseType: CourseType;
  name: string;
  title: string;
  tagline: string;
  description: string;
  industry: string;
  icon: 'headset' | 'code' | 'stethoscope' | 'briefcase' | 'phone';
  level: string;
  badge: string;
  accentColor: string;
  gradient: string;
  modulesCount: number;
  lessonsCount: number;
  courseContent: CourseContent;
}

// ============================================================================
// CONTENIDO NATIVO DEL TRACK: CALL CENTER & CUSTOMER SERVICE
// ============================================================================

export const CALL_CENTER_COURSE_CONTENT: CourseContent = {
  modules: {
    'mod-cc-1': {
      moduleId: 'mod-cc-1',
      unitNumber: 1,
      level: 'B1',
      title: 'Módulo 1 • Primer Contacto (First Contact & Active Listening)',
      lessons: {
        'cc-node-1-1': {
          lessonId: 'cc-node-1-1',
          lessonCode: '1.1',
          title: 'Apertura de Llamada: Saludo Profesional y Verificación',
          subNodes: [
            {
              id: 'cc-node-1-1-reading',
              motherNodeId: 'cc-node-1-1',
              type: 'reading',
              title: 'Lectura Profesional: Protocolo Estándar de Apertura BPO',
              label: 'Lectura BPO',
              durationMinutes: 3,
              xpReward: 25,
              content: {
                reading: {
                  title: 'Standard Call Opening & Customer Identification Flow',
                  summary: 'Protocolo de los primeros 15 segundos en soporte BPO telefónico para clientes en Estados Unidos.',
                  wordCount: 140,
                  readingMinutes: 3,
                  paragraphs: [
                    'In top-tier BPO customer service environments, the first 15 seconds establish the tone for the entire interaction. Every inbound call begins with a clear, positive opening statement that introduces your name, the company branding, and an immediate willingness to assist.',
                    'The standard opening sequence follows three key steps: a professional greeting, identifying yourself, and asking an open-ended question such as "How may I brighten your day today?" or "How may I assist you with your account?"',
                    'Once the customer states their concern, verification must take place smoothly. Agents verify the account holder through two-factor authentication, security PIN, or billing zip code without sounding robotic or bureaucratic. Tone of voice and cadence are critical.'
                  ],
                  vocabulary: {
                    'inbound': 'Llamada entrante al centro de soporte',
                    'greeting': 'Saludo de bienvenida formal',
                    'cadence': 'Ritmo y entonación vocal al hablar',
                    'open-ended question': 'Pregunta abierta que invita a detallar el problema',
                    'two-factor authentication': 'Autenticación en dos pasos para validar identidad',
                    'zip code': 'Código postal de facturación del cliente',
                    'account holder': 'Titular oficial de la cuenta'
                  }
                }
              }
            },
            {
              id: 'cc-node-1-1-listening',
              motherNodeId: 'cc-node-1-1',
              type: 'listening',
              title: 'Audio de Llamada Real: Inbound Verification Call',
              label: 'Audio Telefónico',
              durationMinutes: 2,
              xpReward: 25,
              content: {
                listening: {
                  title: 'Simulación de Llamada: Apertura y Verificación de Cuenta',
                  audioDurationText: '1:15 min',
                  audioScriptEn: 'Agent (Alex): Thank you for calling Apex Cloud Support. My name is Alex. May I have your full name and account number please?\nCustomer (Mark): Hi Alex, this is Mark Sullivan. My account number is 884-902.\nAgent (Alex): Thank you so much, Mr. Sullivan. For security purposes, could you please confirm the billing zip code on file?\nCustomer (Mark): Sure, it\'s 94107, San Francisco.\nAgent (Alex): Perfect, thank you for confirming that! I have your dashboard right in front of me. How can I assist you today, Mr. Sullivan?',
                  audioScriptEs: 'Agente (Alex): Gracias por llamar a Soporte Apex Cloud. Mi nombre es Alex. ¿Podría darme su nombre completo y número de cuenta por favor?\nCliente (Mark): Hola Alex, soy Mark Sullivan. Mi número de cuenta es 884-902.\nAgente (Alex): Muchísimas gracias, Sr. Sullivan. Por motivos de seguridad, ¿podría confirmarme el código postal de facturación registrado?\nCliente (Mark): Seguro, es 94107, San Francisco.\nAgente (Alex): Perfecto, ¡gracias por confirmarlo! Tengo su panel de control frente a mí. ¿En qué le puedo asistir hoy, Sr. Sullivan?',
                  culturalInsight: 'En atención al cliente en EE.UU., dirigirse al cliente por su apellido ("Mr. Sullivan") hasta que él indique usar su nombre de pila transmite respeto profesional inmediato.',
                  transcriptLines: [
                    { speaker: 'AGENT', en: 'Thank you for calling Apex Cloud Support. My name is Alex. May I have your full name and account number?', es: 'Gracias por llamar a Soporte Apex Cloud. Mi nombre es Alex. ¿Me da su nombre completo y número de cuenta?' },
                    { speaker: 'CUSTOMER', en: 'Hi Alex, this is Mark Sullivan. My account number is 884-902.', es: 'Hola Alex, soy Mark Sullivan. Mi número de cuenta es 884-902.' },
                    { speaker: 'AGENT', en: 'Thank you so much, Mr. Sullivan. For security purposes, could you please confirm your billing zip code?', es: 'Muchísimas gracias, Sr. Sullivan. Por seguridad, ¿podría confirmar su código postal?' },
                    { speaker: 'CUSTOMER', en: 'Sure, it is 94107.', es: 'Seguro, es 94107.' },
                    { speaker: 'AGENT', en: 'Perfect! I have your profile right here. How may I assist you today?', es: '¡Perfecto! Tengo su perfil justo aquí. ¿Cómo le puedo asistir hoy?' }
                  ]
                }
              }
            },
            {
              id: 'cc-node-1-1-srs',
              motherNodeId: 'cc-node-1-1',
              type: 'srs',
              title: 'Mazo SRS: Frases Estándar de Apertura BPO',
              label: 'Repaso Espaciado',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                srs: {
                  title: 'Frases Clave de Apertura y Validación',
                  cardCount: 4,
                  targetPhrases: [
                    { en: 'Thank you for calling customer support, my name is Alex.', es: 'Gracias por llamar a atención al cliente, mi nombre es Alex.', context: 'Saludo inicial obligatorio' },
                    { en: 'May I have the pleasure of knowing who I am speaking with?', es: '¿Podría tener el gusto de saber con quién tengo el placer de hablar?', context: 'Identificación cortés' },
                    { en: 'For security purposes, could you please confirm the billing zip code on file?', es: 'Por motivos de seguridad, ¿podría confirmar el código postal registrado?', context: 'Validación de seguridad' },
                    { en: 'I have your account pulled up right now. How can I help you today?', es: 'Tengo su cuenta abierta justo ahora. ¿Cómo puedo ayudarle hoy?', context: 'Transición al problema' }
                  ]
                }
              }
            }
          ]
        },
        'cc-node-1-2': {
          lessonId: 'cc-node-1-2',
          lessonCode: '1.2',
          title: 'Escucha Activa: Empatía y Parafraseo del Problema',
          subNodes: [
            {
              id: 'cc-node-1-2-reading',
              motherNodeId: 'cc-node-1-2',
              type: 'reading',
              title: 'Lectura Profesional: El Poder de la Escucha Activa',
              label: 'Lectura BPO',
              durationMinutes: 3,
              xpReward: 25,
              content: {
                reading: {
                  title: 'Empathy Statements & Effective Paraphrasing',
                  summary: 'Cómo demostrar comprensión sin interrumpir al cliente y validar su frustración.',
                  wordCount: 135,
                  readingMinutes: 3,
                  paragraphs: [
                    'Active listening is the cornerstone of exceptional customer service. When a customer explains their issue, avoid cutting them off or giving pre-packaged responses. Instead, use verbal nods like "I understand", "I see", and "Certainly".',
                    'Paraphrasing means restating the core issue in your own words. For example: "If I understood correctly, you were charged twice for your monthly subscription, and you need a refund for the duplicate charge. Is that accurate?"',
                    'Empathy statements such as "I completely understand how frustrating unexpected charges can be" immediately lower customer tension and establish trust.'
                  ],
                  vocabulary: {
                    'paraphrasing': 'Parafrasear (repetir el problema con tus palabras para confirmar)',
                    'empathy statement': 'Declaración de empatía para conectar emocionalmente',
                    'verbal nods': 'Asentimientos verbales breves mientras el cliente habla',
                    'duplicate charge': 'Cargo duplicado en la tarjeta de crédito',
                    'cut off': 'Interrumpir a alguien mientras habla'
                  }
                }
              }
            },
            {
              id: 'cc-node-1-2-listening',
              motherNodeId: 'cc-node-1-2',
              type: 'listening',
              title: 'Audio de Llamada: Demostrando Empatía Genuina',
              label: 'Audio Telefónico',
              durationMinutes: 2,
              xpReward: 25,
              content: {
                listening: {
                  title: 'Diálogo: Manejo de un Cobro Inesperado',
                  audioDurationText: '1:20 min',
                  audioScriptEn: 'Customer (Laura): Look, I just checked my bank statement and I see two charges of $89 from your company! I only authorized one!\nAgent (Carlos): I completely understand your concern, Ms. Davis. An unexpected duplicate charge is definitely frustrating, and I apologize for the inconvenience.\nCustomer (Laura): Thank you. I just need my money back today.\nAgent (Carlos): Absolutely. Just to ensure we are on the exact same page: you authorized the primary charge on November 10th, but a second pending transaction appeared this morning, correct?\nCustomer (Laura): Yes, exactly. Thank you for listening.',
                  audioScriptEs: 'Cliente (Laura): ¡Mire, acabo de revisar el extracto bancario y veo dos cobros de $89 de su empresa! ¡Yo solo autoricé uno!\nAgente (Carlos): Comprendo totalmente su preocupación, Sra. Davis. Un cobro duplicado inesperado es definitivamente frustrante, y me disculpo por el inconveniente.\nCliente (Laura): Gracias. Solo necesito que me devuelvan el dinero hoy.\nAgente (Carlos): Por supuesto. Solo para asegurarme de que estamos en la misma sintonía: usted autorizó el cobro principal el 10 de noviembre, pero apareció una segunda transacción pendiente esta mañana, ¿correcto?\nCliente (Laura): Sí, exactamente. Gracias por escucharme.',
                  culturalInsight: 'Validar la emoción del cliente antes de saltar a la parte técnica evita que el cliente se ponga a la defensiva.',
                  transcriptLines: [
                    { speaker: 'CUSTOMER', en: 'I see two charges of $89 from your company! I only authorized one!', es: '¡Veo dos cobros de $89 de su empresa! ¡Solo autoricé uno!' },
                    { speaker: 'AGENT', en: 'I completely understand your concern. A duplicate charge is definitely frustrating, and I apologize.', es: 'Comprendo su preocupación. Un cobro duplicado es frustrante y me disculpo.' },
                    { speaker: 'AGENT', en: 'Just to ensure we are on the same page: you authorized one payment, but a second one appeared, correct?', es: 'Para estar en la misma sintonía: usted autorizó un pago pero apareció un segundo, ¿correcto?' },
                    { speaker: 'CUSTOMER', en: 'Yes, exactly. Thank you for listening.', es: 'Sí, exactamente. Gracias por escuchar.' }
                  ]
                }
              }
            },
            {
              id: 'cc-node-1-2-srs',
              motherNodeId: 'cc-node-1-2',
              type: 'srs',
              title: 'Mazo SRS: Frases de Empatía y Parafraseo',
              label: 'Repaso Espaciado',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                srs: {
                  title: 'Declaraciones de Empatía para Llamadas',
                  cardCount: 4,
                  targetPhrases: [
                    { en: 'I completely understand how frustrating this situation must be for you.', es: 'Comprendo completamente lo frustrante que debe ser esta situación para usted.', context: 'Empatía genuina' },
                    { en: 'Just to make sure we are on the exact same page, let me recap what happened.', es: 'Para asegurarme de que estamos en la misma sintonía, permítame recapitular lo sucedido.', context: 'Parafraseo' },
                    { en: 'You have definitely reached the right person to take care of this today.', es: 'Definitivamente ha llegado con la persona correcta para encargarse de esto hoy.', context: 'Tranquilizar al cliente' }
                  ]
                }
              }
            }
          ]
        }
      }
    },
    'mod-cc-2': {
      moduleId: 'mod-cc-2',
      unitNumber: 2,
      level: 'B1',
      title: 'Módulo 2 • Resolución (Troubleshooting & Action Plan)',
      lessons: {
        'cc-node-2-1': {
          lessonId: 'cc-node-2-1',
          lessonCode: '2.1',
          title: 'Diagnóstico Técnico y Preguntas de Sondeo',
          subNodes: [
            {
              id: 'cc-node-2-1-reading',
              motherNodeId: 'cc-node-2-1',
              type: 'reading',
              title: 'Lectura Profesional: Técnicas de Sondeo en Soporte BPO',
              label: 'Lectura BPO',
              durationMinutes: 3,
              xpReward: 25,
              content: {
                reading: {
                  title: 'Probing Questions & Root Cause Analysis',
                  summary: 'Cómo hacer preguntas específicas sin abrumar al cliente no técnico.',
                  wordCount: 145,
                  readingMinutes: 3,
                  paragraphs: [
                    'When diagnosing a technical or account issue, asking the right questions saves minutes on the average handling time (AHT). Probing questions narrow down the root cause quickly.',
                    'Begin with broad diagnostic inquiries like "When did you first notice this error message?" before moving to specific checks like "Have you attempted clearing your browser cache or restarting the application?"',
                    'Always guide the customer through step-by-step instructions using clear transitional signposts: "First, let us click on Settings... Next, look for the Network tab... Finally, please tell me what status appears."'
                  ],
                  vocabulary: {
                    'average handling time (AHT)': 'Tiempo promedio de gestión de una llamada',
                    'root cause': 'Causa raíz o motivo principal del fallo',
                    'probing questions': 'Preguntas de sondeo para aislar el problema',
                    'troubleshoot': 'Diagnosticar y resolver un fallo técnico',
                    'signposts': 'Palabras de transición (First, Next, Then, Finally)'
                  }
                }
              }
            },
            {
              id: 'cc-node-2-1-listening',
              motherNodeId: 'cc-node-2-1',
              type: 'listening',
              title: 'Audio de Llamada: Guía Paso a Paso de Diagnóstico',
              label: 'Audio Telefónico',
              durationMinutes: 2,
              xpReward: 25,
              content: {
                listening: {
                  title: 'Soporte Técnico: Restablecer Conexión de Software',
                  audioDurationText: '1:18 min',
                  audioScriptEn: 'Agent (Sam): Let\'s run a quick diagnostic together. Could you tell me what light is showing on your main modem?\nCustomer (Elena): The power light is solid green, but the internet symbol is blinking orange.\nAgent (Sam): Excellent observation, that tells us the device is receiving power but lost connection with the local gateway. Let\'s unplug the power cord for fifteen seconds to power-cycle it.\nCustomer (Elena): Alright, I just unplugged it. Counting to fifteen...\nAgent (Sam): Perfect. Please plug it back in and let\'s watch the lights calibrate.',
                  audioScriptEs: 'Agente (Sam): Hagamos un diagnóstico rápido juntos. ¿Podría decirme qué luz se muestra en su módem principal?\nCliente (Elena): La luz de encendido está verde fija, pero el símbolo de internet parpadea en naranja.\nAgente (Sam): Excelente observación, eso nos indica que el equipo recibe energía pero perdió conexión con la puerta de enlace. Desconectemos el cable durante quince segundos para reiniciar el ciclo eléctrico.\nCliente (Elena): Muy bien, acabo de desconectarlo. Contando hasta quince...\nAgente (Sam): Perfecto. Por favor conéctelo de nuevo y observemos cómo se calibran las luces.',
                  culturalInsight: 'Agradecer y felicitar al cliente ("Excellent observation") eleva su confianza y reduce la tensión tecnológica.',
                  transcriptLines: [
                    { speaker: 'AGENT', en: 'Could you tell me what light is currently showing on your device?', es: '¿Podría decirme qué luz se muestra actualmente en su equipo?' },
                    { speaker: 'CUSTOMER', en: 'The internet symbol is blinking orange.', es: 'El símbolo de internet está parpadeando en naranja.' },
                    { speaker: 'AGENT', en: 'Let us unplug the power cord for fifteen seconds to power-cycle the unit.', es: 'Desconectemos el cable quince segundos para reiniciar el ciclo de energía.' },
                    { speaker: 'CUSTOMER', en: 'Plugged it back in. The green light is now solid!', es: 'Lo volví a conectar. ¡La luz verde ahora está fija!' }
                  ]
                }
              }
            },
            {
              id: 'cc-node-2-1-srs',
              motherNodeId: 'cc-node-2-1',
              type: 'srs',
              title: 'Mazo SRS: Preguntas de Sondeo Técnico',
              label: 'Repaso Espaciado',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                srs: {
                  title: 'Preguntas de Diagnóstico Técnico',
                  cardCount: 4,
                  targetPhrases: [
                    { en: 'Could you please describe what happens on your screen when you click Submit?', es: '¿Podría describir qué ocurre en su pantalla al hacer clic en Enviar?', context: 'Sondeo de error' },
                    { en: 'Let us perform a quick power-cycle to refresh your connection.', es: 'Hagamos un reinicio rápido de energía para refrescar su conexión.', context: 'Instrucción técnica' },
                    { en: 'When did you first notice this issue occurring?', es: '¿Cuándo notó por primera vez que ocurría este problema?', context: 'Línea de tiempo del fallo' }
                  ]
                }
              }
            }
          ]
        },
        'cc-node-2-2': {
          lessonId: 'cc-node-2-2',
          lessonCode: '2.2',
          title: 'Procedimiento de Espera (Hold) y Entrega de Solución',
          subNodes: [
            {
              id: 'cc-node-2-2-reading',
              motherNodeId: 'cc-node-2-2',
              type: 'reading',
              title: 'Lectura Profesional: El Protocolo Perfecto de Hold',
              label: 'Lectura BPO',
              durationMinutes: 3,
              xpReward: 25,
              content: {
                reading: {
                  title: 'Placing Callers on Hold & Returning Gracefully',
                  summary: 'Las reglas de oro de BPO para poner a un cliente en espera sin generar quejas.',
                  wordCount: 130,
                  readingMinutes: 3,
                  paragraphs: [
                    'Never put a customer on hold without asking for permission first and giving a concrete timeframe. The golden rule is: Reason + Estimated Time + Permission Request.',
                    'For instance: "Mr. Sullivan, I need to consult with our billing specialist to process your refund. May I place you on a brief hold for about two minutes while I review this?"',
                    'Always return with a thank you: "Thank you for your patience while on hold, Mr. Sullivan. I have wonderful news for you..."'
                  ],
                  vocabulary: {
                    'place on hold': 'Poner en espera la llamada',
                    'timeframe': 'Marco de tiempo estimado (ej. 2 minutos)',
                    'billing specialist': 'Especialista del departamento de facturación',
                    'thank you for your patience': 'Gracias por su paciencia (frase obligatoria al volver)'
                  }
                }
              }
            },
            {
              id: 'cc-node-2-2-listening',
              motherNodeId: 'cc-node-2-2',
              type: 'listening',
              title: 'Audio de Llamada: Solicitando Espera y Regresando con la Solución',
              label: 'Audio Telefónico',
              durationMinutes: 2,
              xpReward: 25,
              content: {
                listening: {
                  title: 'Simulación: Hold y Aprobación de Reembolso',
                  audioDurationText: '1:15 min',
                  audioScriptEn: 'Agent (Maria): In order to reverse the duplicate transaction, I need to access our supervisor portal. May I place you on hold for two to three minutes while I finalize this approval?\nCustomer (James): Sure, go ahead Maria.\nAgent (Maria): Thank you so much, I will be right back with you.\n[2 minutes later]\nAgent (Maria): Thank you for holding, Mr. James! I appreciate your patience. I am pleased to inform you that the $89 charge has been reversed successfully.',
                  audioScriptEs: 'Agente (Maria): Para revertir la transacción duplicada, necesito acceder a nuestro portal de supervisores. ¿Podría ponerlo en espera por dos o tres minutos mientras finalizo esta aprobación?\nCliente (James): Seguro, adelante María.\nAgente (Maria): Muchísimas gracias, vuelvo con usted enseguida.\n[2 minutos después]\nAgente (Maria): ¡Gracias por esperar, Sr. James! Aprecio su paciencia. Me complace informarle que el cobro de $89 ha sido revertido exitosamente.',
                  culturalInsight: 'Si la espera va a tomar más de 2 minutos, el protocolo BPO exige volver a la línea para actualizar al cliente: "I am still working on this for you".',
                  transcriptLines: [
                    { speaker: 'AGENT', en: 'May I place you on a brief hold for two minutes while I process this?', es: '¿Podría ponerle en espera dos minutos mientras proceso esto?' },
                    { speaker: 'CUSTOMER', en: 'Sure, go ahead.', es: 'Seguro, adelante.' },
                    { speaker: 'AGENT', en: 'Thank you for your patience on hold! The charge has been reversed.', es: '¡Gracias por su paciencia en espera! El cobro ha sido revertido.' }
                  ]
                }
              }
            },
            {
              id: 'cc-node-2-2-srs',
              motherNodeId: 'cc-node-2-2',
              type: 'srs',
              title: 'Mazo SRS: Frases de Procedimiento Hold',
              label: 'Repaso Espaciado',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                srs: {
                  title: 'Frases de Espera y Retorno en Llamada',
                  cardCount: 3,
                  targetPhrases: [
                    { en: 'May I place you on a brief hold for two minutes while I consult our tier 2 support?', es: '¿Puedo ponerlo en una breve espera por dos minutos mientras consulto con soporte nivel 2?', context: 'Pedir espera' },
                    { en: 'Thank you so much for your patience while on hold.', es: 'Muchas gracias por su paciencia mientras estuvo en espera.', context: 'Retorno cortés' },
                    { en: 'I am pleased to inform you that your request has been fully resolved.', es: 'Me complace informarle que su solicitud ha sido completamente resuelta.', context: 'Entrega de solución' }
                  ]
                }
              }
            }
          ]
        }
      }
    },
    'mod-cc-3': {
      moduleId: 'mod-cc-3',
      unitNumber: 3,
      level: 'B2',
      title: 'Módulo 3 • Cliente Difícil (De-escalation & Irate Customers)',
      lessons: {
        'cc-node-3-1': {
          lessonId: 'cc-node-3-1',
          lessonCode: '3.1',
          title: 'Desescalada Verbal y Asertividad sin Confrontación',
          subNodes: [
            {
              id: 'cc-node-3-1-reading',
              motherNodeId: 'cc-node-3-1',
              type: 'reading',
              title: 'Lectura Profesional: Psicología de la Desescalada Telefónica',
              label: 'Lectura BPO',
              durationMinutes: 3,
              xpReward: 25,
              content: {
                reading: {
                  title: 'De-escalation Strategies for Highly Frustrated Callers',
                  summary: 'Cómo desarmar la agresión verbal utilizando tono sereno, vocabulario profesional y la técnica HEAT.',
                  wordCount: 150,
                  readingMinutes: 3,
                  paragraphs: [
                    'In customer support, agents encounter callers who shout, demand compensation, or use aggressive language. Winning the argument is losing the customer. Professional de-escalation relies on the HEAT framework: Hear, Empathize, Apologize, Take Action.',
                    'When a caller is screaming, lower your own vocal pitch and speak at half your usual speed. This psychological technique, known as pacing and leading, subconsciously compels the caller to match your calm state.',
                    'Replace defensive phrases like "That is our policy" with customer-centric alternatives: "I want to do everything within my power to resolve this for you today."'
                  ],
                  vocabulary: {
                    'de-escalation': 'Desescalada (reducir la tensión de un cliente molesto)',
                    'irate caller': 'Llamante enfurecido o sumamente irritado',
                    'pacing and leading': 'Técnica de modular la voz para calmar al interlocutor',
                    'framework': 'Marco de trabajo o metodología estructurada',
                    'within my power': 'Dentro de mis facultades o alcance'
                  }
                }
              }
            },
            {
              id: 'cc-node-3-1-listening',
              motherNodeId: 'cc-node-3-1',
              type: 'listening',
              title: 'Audio de Llamada: Manejando un Cliente Furioso',
              label: 'Audio Telefónico',
              durationMinutes: 2,
              xpReward: 25,
              content: {
                listening: {
                  title: 'Simulación: Desescalando a un Cliente Molesto',
                  audioDurationText: '1:25 min',
                  audioScriptEn: 'Customer (Robert): This is absolute garbage! I have been transferred three times and your system deleted my flight reservation! I want someone fired!\nAgent (Diana): Mr. Vance, I hear you, and you have every right to be angry. Being transferred three times when your flight is on the line is completely unacceptable.\nCustomer (Robert): Exactly! Finally someone who gets it.\nAgent (Diana): I am not going to transfer you anywhere. My name is Diana, and I am taking personal ownership of your ticket right now until you are safely booked on your flight. Let us fix this together.',
                  audioScriptEs: 'Cliente (Robert): ¡Esto es una absoluta basura! ¡Me han transferido tres veces y su sistema borró mi reserva de vuelo! ¡Quiero que despidan a alguien!\nAgente (Diana): Sr. Vance, lo escucho, y tiene todo el derecho de estar molesto. Que lo transfieran tres veces con su vuelo en juego es totalmente inaceptable.\nCliente (Robert): ¡Exactamente! Por fin alguien que lo entiende.\nAgente (Diana): No lo voy a transferir a ningún lado. Mi nombre es Diana, y asumo la responsabilidad personal de su caso en este momento hasta que esté registrado en su vuelo. Resolvamos esto juntos.',
                  culturalInsight: 'Tomar "propiedad personal" ("I am taking personal ownership") desactiva de inmediato la furia del cliente angloparlante porque ya no se siente una pelota rebotando entre departamentos.',
                  transcriptLines: [
                    { speaker: 'CUSTOMER', en: 'I have been transferred three times and your system deleted my reservation!', es: '¡Me han transferido tres veces y su sistema borró mi reserva!' },
                    { speaker: 'AGENT', en: 'You have every right to be angry. Being transferred three times is completely unacceptable.', es: 'Tiene todo el derecho de estar molesto. Ser transferido tres veces es inaceptable.' },
                    { speaker: 'AGENT', en: 'I am taking personal ownership of your case right now. Let us fix this together.', es: 'Asumo la responsabilidad de su caso ahora mismo. Resolvamos esto juntos.' }
                  ]
                }
              }
            },
            {
              id: 'cc-node-3-1-srs',
              motherNodeId: 'cc-node-3-1',
              type: 'srs',
              title: 'Mazo SRS: Frases de Desescalada Verbal',
              label: 'Repaso Espaciado',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                srs: {
                  title: 'Frases para Desarmar Clientes Molestos',
                  cardCount: 4,
                  targetPhrases: [
                    { en: 'You have every right to feel upset, and I sincerely apologize for what you experienced.', es: 'Tiene todo el derecho de sentirse molesto, y me disculpo sinceramente por lo que experimentó.', context: 'Validación' },
                    { en: 'I am taking personal ownership of this call and will stay with you until it is resolved.', es: 'Asumo responsabilidad personal de esta llamada y me quedaré con usted hasta resolverlo.', context: 'Propiedad personal' },
                    { en: 'I understand your frustration, and I am here to find a workable solution right now.', es: 'Entiendo su frustración y estoy aquí para encontrar una solución viable justo ahora.', context: 'Asertividad' }
                  ]
                }
              }
            }
          ]
        },
        'cc-node-3-2': {
          lessonId: 'cc-node-3-2',
          lessonCode: '3.2',
          title: 'Límites Profesionales, Políticas y Escalación al Supervisor',
          subNodes: [
            {
              id: 'cc-node-3-2-reading',
              motherNodeId: 'cc-node-3-2',
              type: 'reading',
              title: 'Lectura Profesional: Límites y Transferencias a Supervisor',
              label: 'Lectura BPO',
              durationMinutes: 3,
              xpReward: 25,
              content: {
                reading: {
                  title: 'Professional Boundaries & Warm Escalations',
                  summary: 'Cómo transferir a un supervisor con un traspaso cálido (warm transfer) y poner límites al lenguaje ofensivo.',
                  wordCount: 140,
                  readingMinutes: 3,
                  paragraphs: [
                    'Every BPO contract defines clear boundary guidelines. If a caller resorts to profanity or personal insults, agents must deliver two polite warnings before initiating a disconnected call protocol.',
                    'When a customer insists on speaking with a supervisor, perform a "warm transfer". A warm transfer means you brief the supervisor on the full backstory before connecting the caller, preventing the customer from repeating their ordeal.',
                    'Frame policies positively: instead of "I cannot do that", use "What I can do for you is apply a $50 credit and consult my manager for an exception."'
                  ],
                  vocabulary: {
                    'warm transfer': 'Transferencia con briefing previo al supervisor',
                    'cold transfer': 'Transferencia ciega sin avisar (práctica prohibida en BPO)',
                    'profanity': 'Lenguaje soez o insultos verbales',
                    'brief': 'Informar brevemente los hechos del caso al compañero',
                    'exception': 'Excepción a la regla o política comercial'
                  }
                }
              }
            },
            {
              id: 'cc-node-3-2-listening',
              motherNodeId: 'cc-node-3-2',
              type: 'listening',
              title: 'Audio de Llamada: Realizando un Warm Transfer al Supervisor',
              label: 'Audio Telefónico',
              durationMinutes: 2,
              xpReward: 25,
              content: {
                listening: {
                  title: 'Traspaso Profesional: Briefing Interno con el Supervisor',
                  audioDurationText: '1:18 min',
                  audioScriptEn: 'Agent (Tom): Hey Sarah, I have Mr. Davis on line 2. His shipment arrived damaged for the second time. I already verified the account and approved a $75 credit, but he is requesting overnight courier replacement which requires tier 3 authorization.\nSupervisor (Sarah): Great summary, Tom. Does he have the damaged tracking number ready?\nAgent (Tom): Yes, it is documented in case notes #4910.\nSupervisor (Sarah): Perfect, patch him through, I will take the call.\nAgent (Tom): [To Customer] Mr. Davis, thank you for waiting. I have my floor supervisor Sarah on the line, and she is fully briefed on your situation.',
                  audioScriptEs: 'Agente (Tom): Hola Sarah, tengo al Sr. Davis en la línea 2. Su envío llegó dañado por segunda vez. Ya verifiqué la cuenta y aprobé un crédito de $75, pero solicita reemplazo por mensajería nocturna lo cual requiere autorización nivel 3.\nSupervisora (Sarah): Excelente resumen, Tom. ¿Tiene listo el número de rastreo dañado?\nAgente (Tom): Sí, está documentado en las notas del caso #4910.\nSupervisora (Sarah): Perfecto, pásamelo, tomaré la llamada.\nAgente (Tom): [Al cliente] Sr. Davis, gracias por esperar. Tengo a mi supervisora Sarah en línea y está totalmente informada de su situación.',
                  culturalInsight: 'Decirle al cliente que el supervisor ya está informado ("she is fully briefed") le genera un alivio instantáneo al no tener que volver a contar su historia desde cero.',
                  transcriptLines: [
                    { speaker: 'AGENT (INTERNAL)', en: 'I have verified the account and approved a credit, but he needs tier 3 authorization.', es: 'Verifiqué la cuenta y aprobé un crédito, pero necesita autorización nivel 3.' },
                    { speaker: 'SUPERVISOR', en: 'Great summary, patch him through.', es: 'Excelente resumen, pásamelo.' },
                    { speaker: 'AGENT (TO CALLER)', en: 'I have my supervisor Sarah on the line, and she is fully briefed on your situation.', es: 'Tengo a mi supervisora Sarah en línea y está plenamente informada de su situación.' }
                  ]
                }
              }
            },
            {
              id: 'cc-node-3-2-srs',
              motherNodeId: 'cc-node-3-2',
              type: 'srs',
              title: 'Mazo SRS: Transferencias y Límites Profesionales',
              label: 'Repaso Espaciado',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                srs: {
                  title: 'Frases para Transferencia y Establecer Límites',
                  cardCount: 3,
                  targetPhrases: [
                    { en: 'I want to help you, but I must respectfully ask that we keep our conversation professional.', es: 'Quiero ayudarle, pero debo pedirle respetuosamente mantener la conversación profesional.', context: 'Límites ante insultos' },
                    { en: 'I am going to connect you with my supervisor and brief her so you do not have to repeat yourself.', es: 'Voy a conectarlo con mi supervisora e informarla para que no tenga que repetirse.', context: 'Warm transfer' },
                    { en: 'What I can certainly do for you right now is submit an expedited review ticket.', es: 'Lo que ciertamente puedo hacer por usted ahora mismo es enviar un ticket de revisión expedita.', context: 'Enfoque positivo' }
                  ]
                }
              }
            }
          ]
        }
      }
    },
    'mod-cc-4': {
      moduleId: 'mod-cc-4',
      unitNumber: 4,
      level: 'B2',
      title: 'Módulo 4 • Soporte & Cierre (Wrap-up, CSAT & Closing)',
      lessons: {
        'cc-node-4-1': {
          lessonId: 'cc-node-4-1',
          lessonCode: '4.1',
          title: 'Confirmación de Solución y Calidad CSAT',
          subNodes: [
            {
              id: 'cc-node-4-1-reading',
              motherNodeId: 'cc-node-4-1',
              type: 'reading',
              title: 'Lectura Profesional: El Impacto de la Primera Resolución (FCR)',
              label: 'Lectura BPO',
              durationMinutes: 3,
              xpReward: 25,
              content: {
                reading: {
                  title: 'First Contact Resolution (FCR) & CSAT Score Optimization',
                  summary: 'Cómo asegurar que el cliente no tenga que volver a llamar y garantizar calificaciones de 5 estrellas en encuestas.',
                  wordCount: 135,
                  readingMinutes: 3,
                  paragraphs: [
                    'First Contact Resolution (FCR) and Customer Satisfaction (CSAT) are the two most scrutinized KPIs in global outsourcing operations. Resolving the stated issue is only half the battle; ensuring no secondary issues arise is the other half.',
                    'Before closing any call, perform a comprehensive solution check: "We verified that your password reset worked, and we logged into your dashboard successfully. Is there any other device where you need access?"',
                    'This proactive step eliminates repeat calls within 48 hours and directly drives promoter scores on post-call automated surveys.'
                  ],
                  vocabulary: {
                    'First Contact Resolution (FCR)': 'Resolución en el primer contacto',
                    'CSAT (Customer Satisfaction)': 'Métrica de satisfacción del cliente',
                    'KPI (Key Performance Indicator)': 'Indicador clave de rendimiento',
                    'repeat call': 'Llamada repetida por el mismo motivo',
                    'promoter score': 'Puntuación de recomendación del cliente'
                  }
                }
              }
            },
            {
              id: 'cc-node-4-1-listening',
              motherNodeId: 'cc-node-4-1',
              type: 'listening',
              title: 'Audio de Llamada: Asegurando la Solución y CSAT',
              label: 'Audio Telefónico',
              durationMinutes: 2,
              xpReward: 25,
              content: {
                listening: {
                  title: 'Diálogo: Verificación Integral del Servicio',
                  audioDurationText: '1:12 min',
                  audioScriptEn: 'Agent (Kevin): Wonderful, Mr. Miller! We just tested your backup email and confirmed your multi-factor codes are sending instantly. Have you received the test SMS?\nCustomer (Miller): Yes, just popped up on my phone. Everything is working like a charm.\nAgent (Kevin): That is fantastic news! Aside from securing your login credentials, is there anything else I can take care of for you today to make your experience seamless?\nCustomer (Miller): No Kevin, you went above and beyond. Thanks a million.',
                  audioScriptEs: 'Agente (Kevin): ¡Maravilloso, Sr. Miller! Acabamos de probar su correo de respaldo y confirmamos que sus códigos de doble factor se envían al instante. ¿Recibió el SMS de prueba?\nCliente (Miller): Sí, acaba de aparecer en mi teléfono. Todo funciona a las mil maravillas.\nAgente (Kevin): ¡Esa es una noticia fantástica! Aparte de asegurar sus credenciales de inicio de sesión, ¿hay algo más de lo que me pueda encargar por usted hoy para que su experiencia sea perfecta?\nCliente (Miller): No Kevin, fuiste más allá de lo esperado. Un millón de gracias.',
                  culturalInsight: 'La frase "went above and beyond" en la cultura corporativa estadounidense es el mayor cumplido que un cliente puede dar y garantiza un CSAT de 100%.',
                  transcriptLines: [
                    { speaker: 'AGENT', en: 'Have you received the test confirmation on your phone?', es: '¿Ha recibido la confirmación de prueba en su teléfono?' },
                    { speaker: 'CUSTOMER', en: 'Yes, just popped up. Everything is working like a charm.', es: 'Sí, acaba de aparecer. Todo funciona de maravilla.' },
                    { speaker: 'AGENT', en: 'Aside from this, is there anything else I can take care of for you today?', es: 'Aparte de esto, ¿hay algo más de lo que pueda encargarme por usted hoy?' }
                  ]
                }
              }
            },
            {
              id: 'cc-node-4-1-srs',
              motherNodeId: 'cc-node-4-1',
              type: 'srs',
              title: 'Mazo SRS: Verificación de Solución y Calidad',
              label: 'Repaso Espaciado',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                srs: {
                  title: 'Frases para FCR y Satisfacción CSAT',
                  cardCount: 3,
                  targetPhrases: [
                    { en: 'Just to confirm, are you able to see the updated balance on your screen right now?', es: 'Solo para confirmar, ¿puede ver el saldo actualizado en su pantalla ahora mismo?', context: 'Verificación de solución' },
                    { en: 'Is there anything else, large or small, that I can help you with today?', es: '¿Hay algo más, grande o pequeño, con lo que pueda ayudarle hoy?', context: 'Pregunta de cierre integral' },
                    { en: 'We truly appreciate your loyalty with us over the past four years.', es: 'Realmente apreciamos su lealtad con nosotros durante los últimos cuatro años.', context: 'Fidelización' }
                  ]
                }
              }
            }
          ]
        },
        'cc-node-4-2': {
          lessonId: 'cc-node-4-2',
          lessonCode: '4.2',
          title: 'Cierre Profesional de Llamada y Documentación de Ticket',
          subNodes: [
            {
              id: 'cc-node-4-2-reading',
              motherNodeId: 'cc-node-4-2',
              type: 'reading',
              title: 'Lectura Profesional: El Cierre de Llamada y Notas CRM',
              label: 'Lectura BPO',
              durationMinutes: 3,
              xpReward: 25,
              content: {
                reading: {
                  title: 'Call Wrap-up Standards & Case Documentation',
                  summary: 'Cómo redactar notas concisas en el CRM y despedir al cliente dejando una impresión duradera.',
                  wordCount: 140,
                  readingMinutes: 3,
                  paragraphs: [
                    'The final impression is what stays with the caller when they receive the survey. A branded closing statement reinforces the professional identity of the company and leaves the customer feeling valued.',
                    'The standard closing script follows: Warm thanks + Company brand + Good wishes. Example: "Thank you for choosing Apex Wireless, Mr. Miller. Have a wonderful rest of your week!"',
                    'Immediately following call termination, agents enter Wrap-up status (ACW - After Call Work) to write case notes in CRM using the standard format: Caller Intent, Action Taken, Outcome, Follow-up Required.'
                  ],
                  vocabulary: {
                    'ACW (After Call Work)': 'Tiempo posterior a la llamada para documentar notas',
                    'branded closing': 'Despedida corporativa institucional',
                    'case notes': 'Notas registradas en el software CRM de la empresa',
                    'outcome': 'Resultado final del trámite o llamada',
                    'follow-up': 'Seguimiento futuro acordado con el cliente'
                  }
                }
              }
            },
            {
              id: 'cc-node-4-2-listening',
              motherNodeId: 'cc-node-4-2',
              type: 'listening',
              title: 'Audio de Llamada: Cierre Magistral de Llamada',
              label: 'Audio Telefónico',
              durationMinutes: 2,
              xpReward: 25,
              content: {
                listening: {
                  title: 'Despedida Telefónica y Envío de Resumen por Email',
                  audioDurationText: '1:10 min',
                  audioScriptEn: 'Agent (Rachel): You will also receive an email confirmation with your case ticket number #8841 within the next ten minutes for your records.\nCustomer (Thomas): That is great, thanks for sending that over.\nAgent (Rachel): It has been an absolute pleasure assisting you today, Mr. Thomas. Thank you for choosing CloudPay solutions, and have a fantastic weekend ahead!\nCustomer (Thomas): You too Rachel, bye now!\nAgent (Rachel): Goodbye!',
                  audioScriptEs: 'Agente (Rachel): También recibirá una confirmación por correo electrónico con su número de ticket #8841 en los próximos diez minutos para su archivo personal.\nCliente (Thomas): Genial, gracias por enviarlo.\nAgente (Rachel): Ha sido un absoluto placer asistirle hoy, Sr. Thomas. ¡Gracias por elegir las soluciones CloudPay, y que tenga un fantástico fin de semana!\nCliente (Thomas): ¡Igualmente Rachel, adiós!\nAgente (Rachel): ¡Hasta luego!',
                  culturalInsight: 'Deseos específicos ("have a fantastic weekend" o "enjoy your evening") suenan mucho más cálidos que un simple "have a good day".',
                  transcriptLines: [
                    { speaker: 'AGENT', en: 'You will receive an email confirmation with your case ticket number within ten minutes.', es: 'Recibirá una confirmación con su número de ticket en diez minutos.' },
                    { speaker: 'AGENT', en: 'It has been an absolute pleasure assisting you. Have a fantastic weekend ahead!', es: 'Ha sido un placer asistirle. ¡Que tenga un fantástico fin de semana!' },
                    { speaker: 'CUSTOMER', en: 'You too, thanks again for your help!', es: '¡Igualmente, gracias de nuevo por su ayuda!' }
                  ]
                }
              }
            },
            {
              id: 'cc-node-4-2-srs',
              motherNodeId: 'cc-node-4-2',
              type: 'srs',
              title: 'Mazo SRS: Cierre Profesional y Despedida',
              label: 'Repaso Espaciado',
              durationMinutes: 2,
              xpReward: 20,
              content: {
                srs: {
                  title: 'Frases para Cierre de Llamada BPO',
                  cardCount: 3,
                  targetPhrases: [
                    { en: 'Your confirmation ticket number is documented as #8841.', es: 'Su número de ticket de confirmación queda registrado como #8841.', context: 'Número de ticket' },
                    { en: 'It has been an absolute pleasure assisting you today.', es: 'Ha sido un absoluto placer asistirle el día de hoy.', context: 'Cortesía final' },
                    { en: 'Thank you for calling support, and have a wonderful rest of your day!', es: '¡Gracias por llamar a soporte y que tenga un maravilloso resto del día!', context: 'Despedida cordial' }
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
// TRACK PRINCIPAL DE CALL CENTER
// ============================================================================

export const DEFAULT_SPECIALIZED_TRACKS: Record<string, SpecializedTrack> = {
  'call-center': {
    id: 'call-center-english',
    slug: 'call-center',
    languageId: 'english',
    courseType: 'specialized',
    name: 'Call Center English',
    title: 'Call Center & Customer Service',
    tagline: 'Atención al Cliente BPO, Resolución de Conflictos y Soporte Telefónico',
    description: 'Domina las llamadas en inglés con clientes en EE.UU./UK: saludo profesional, verificación, empatía, técnicas de desescalada, gestión de esperas y métricas CSAT/FCR.',
    industry: 'BPO & Soporte Telefónico Internacional',
    icon: 'headset',
    level: 'B1 - B2 Profesional',
    badge: 'Track Especializado',
    accentColor: 'text-amber-400',
    gradient: 'from-amber-500 via-orange-400 to-amber-600',
    modulesCount: 4,
    lessonsCount: 8,
    courseContent: CALL_CENTER_COURSE_CONTENT
  }
};

// ============================================================================
// MÉTODOS DE PERSISTENCIA Y CARGA DE TRACKS
// ============================================================================

const STORAGE_KEYS = {
  SPECIALIZED_TRACKS: 'nativa_specialized_tracks_registry',
  TRACK_CONTENT_PREFIX: 'nativa_track_content_'
};

export function getAllSpecializedTracks(): Record<string, SpecializedTrack> {
  const merged: Record<string, SpecializedTrack> = { ...DEFAULT_SPECIALIZED_TRACKS };
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SPECIALIZED_TRACKS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          Object.assign(merged, parsed);
        }
      }
    } catch {}
  }
  return merged;
}

export function getTrackBySlug(slug: string): SpecializedTrack {
  const all = getAllSpecializedTracks();
  return all[slug] || DEFAULT_SPECIALIZED_TRACKS['call-center'];
}

export function getTrackCourseContent(trackSlug: string): CourseContent {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.TRACK_CONTENT_PREFIX}${trackSlug}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.modules) {
          return parsed;
        }
      }
    } catch {}
  }
  const track = getTrackBySlug(trackSlug);
  return track.courseContent || CALL_CENTER_COURSE_CONTENT;
}

export function saveTrackCourseContent(trackSlug: string, content: CourseContent): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_KEYS.TRACK_CONTENT_PREFIX}${trackSlug}`, JSON.stringify(content));
  } catch {}
}

export function saveSpecializedTrack(track: SpecializedTrack): void {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllSpecializedTracks();
    all[track.slug] = track;
    localStorage.setItem(STORAGE_KEYS.SPECIALIZED_TRACKS, JSON.stringify(all));
  } catch {}
}
