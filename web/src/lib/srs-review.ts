// ============================================================================
// FLUENTIA • MOTOR DE REPASO ESPACIADO INTELIGENTE (SRS - SPATIAL REPETITION)
// Genera barajas dinámicas a partir de los 24 temarios universitarios (A1 - C2)
// Aplicando la hipótesis del Monitor de Krashen y la curva de retención de Ebbinghaus
// ============================================================================

import { COMPREHENSIVE_CURRICULUM, IntensiveLesson } from './curriculum-data';
import { AppStorage, StarredPhrase } from './storage';

export type FlashcardCategory = 'VOCABULARY' | 'IDIOM' | 'SYNTAX' | 'COLLOCATION' | 'MONITOR' | 'STARRED';

export interface FlashcardItem {
  id: string;
  lessonId: string;
  level: string;
  unit: number;
  category: FlashcardCategory;
  categoryLabel: string;
  front: string;
  phonetic?: string;
  audioText: string;
  back: string;
  explanation?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  ruleWarning?: string;
}

export function generateSrsDeck(completedNodeIds: string[], levelFilter: string = 'ALL'): FlashcardItem[] {
  // Si no hay nodos completados aún, tomamos la primera lección o el nivel actual
  const eligibleLessons = COMPREHENSIVE_CURRICULUM.filter(lesson => {
    const isCompletedOrActive = completedNodeIds.includes(lesson.id) || lesson.id === 'a1-lesson-1' || completedNodeIds.length === 0;
    if (levelFilter === 'ALL') return isCompletedOrActive;
    return isCompletedOrActive && lesson.level === levelFilter;
  });

  const sourceLessons = eligibleLessons.length > 0 
    ? eligibleLessons 
    : COMPREHENSIVE_CURRICULUM.filter(l => levelFilter === 'ALL' || l.level === levelFilter);

  const deck: FlashcardItem[] = [];

  // Inyección Prioritaria: Frases Estrella seleccionadas por el estudiante (⭐)
  const starredPhrases = AppStorage.getStarredPhrases();
  starredPhrases.forEach((st) => {
    if (levelFilter === 'ALL' || st.level === levelFilter) {
      deck.push({
        id: `starred-${st.id}`,
        lessonId: st.lessonId,
        level: st.level,
        unit: 1,
        category: 'STARRED',
        categoryLabel: '⭐ Frase Estrella Guardada por Ti',
        front: st.en,
        phonetic: st.phonetic,
        audioText: st.en,
        back: st.es,
        explanation: st.context ? `Guardada en contexto: "${st.context}"` : 'Frase seleccionada personalmente por ti para adquisición prioritaria.',
        exampleSentence: st.en,
        exampleTranslation: st.es,
      });
    }
  });

  sourceLessons.forEach((lesson) => {
    // 1. Tarjetas de Fonética y Frases Clave de Shadowing (Etapa 4)
    if (lesson.step4_shadowing?.phrases && Array.isArray(lesson.step4_shadowing.phrases)) {
      lesson.step4_shadowing.phrases.forEach((phrase, pIdx) => {
        deck.push({
          id: `shadow-${lesson.id}-${pIdx}`,
          lessonId: lesson.id,
          level: lesson.level,
          unit: lesson.unit,
          category: 'VOCABULARY',
          categoryLabel: 'Fonética & Shadowing',
          front: phrase.en,
          phonetic: phrase.phonetic,
          audioText: phrase.en,
          back: phrase.tip || phrase.levelLabel,
          explanation: phrase.tip || `Clave de pronunciación y ritmo natural para nivel ${lesson.level}.`,
          exampleSentence: phrase.en,
          exampleTranslation: phrase.tip,
        });
      });
    }

    // 2. Tarjetas de Inmersión Conversacional (Etapa 1)
    if (lesson.step1_dialogue?.lines && Array.isArray(lesson.step1_dialogue.lines)) {
      lesson.step1_dialogue.lines.slice(0, 3).forEach((line, lIdx) => {
        deck.push({
          id: `dialogue-${lesson.id}-${lIdx}`,
          lessonId: lesson.id,
          level: lesson.level,
          unit: lesson.unit,
          category: 'COLLOCATION',
          categoryLabel: 'Colocación & Uso Real',
          front: line.en,
          phonetic: line.phonetic,
          audioText: line.en,
          back: line.es,
          explanation: `Intervención de ${line.speaker} en: "${lesson.step1_dialogue.context}"`,
          exampleSentence: line.en,
          exampleTranslation: line.es,
        });
      });
    }

    // 3. Tarjetas de Sintaxis y Automatización de Oración (Etapa 3)
    if (lesson.step3_builder?.correctWords) {
      const sentence = lesson.step3_builder.correctWords.join(' ');
      deck.push({
        id: `syntax-${lesson.id}`,
        lessonId: lesson.id,
        level: lesson.level,
        unit: lesson.unit,
        category: 'SYNTAX',
        categoryLabel: 'Estructura Sintáctica',
        front: `¿Cómo dirías en inglés natural:\n"${lesson.step3_builder.targetTranslationEs}"?`,
        audioText: sentence,
        back: sentence,
        explanation: lesson.step3_builder.instruction,
        exampleSentence: sentence,
        exampleTranslation: lesson.step3_builder.targetTranslationEs,
      });
    }

    // 4. Tarjetas del Monitor Gramatical y Caza de Errores (Etapa 5)
    if (lesson.step5_monitor?.options) {
      const correctOption = lesson.step5_monitor.options[lesson.step5_monitor.correctIndex] || lesson.step5_monitor.options[0];
      deck.push({
        id: `monitor-${lesson.id}`,
        lessonId: lesson.id,
        level: lesson.level,
        unit: lesson.unit,
        category: 'MONITOR',
        categoryLabel: 'Monitor Gramatical SLA',
        front: `Detecta y corrige el error común en:\n"${lesson.step5_monitor.faultySentence}"`,
        audioText: correctOption,
        back: `Forma Correcta:\n${correctOption}`,
        explanation: lesson.step5_monitor.ruleInsight || lesson.step5_monitor.explanationConcept,
        ruleWarning: lesson.step5_monitor.explanationConcept,
      });
    }

    // 5. Tarjetas de Reto de Maestría Universitaria (Etapa 6)
    if (lesson.step6_mastery?.options) {
      const correctMastery = lesson.step6_mastery.options[lesson.step6_mastery.correctIndex] || lesson.step6_mastery.options[0];
      deck.push({
        id: `mastery-${lesson.id}`,
        lessonId: lesson.id,
        level: lesson.level,
        unit: lesson.unit,
        category: 'COLLOCATION',
        categoryLabel: 'Reto de Maestría',
        front: `Pregunta de Maestría:\n${lesson.step6_mastery.question}`,
        audioText: correctMastery,
        back: `Respuesta:\n${correctMastery}`,
        explanation: lesson.step6_mastery.successMessage,
      });
    }
  });

  // Barajar aleatoriamente para repaso espaciado
  return deck.sort(() => Math.random() - 0.5);
}
