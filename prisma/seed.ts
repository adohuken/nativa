import { PrismaClient, CefrLevel, LanguageSkill, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos pedagógicos iniciales de Stephen Krashen...');

  // 1. Idiomas
  const en = await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: { code: 'en', name: 'English' },
  });

  const es = await prisma.language.upsert({
    where: { code: 'es' },
    update: {},
    create: { code: 'es', name: 'Spanish' },
  });

  // 2. Módulo A1 de Input Comprensible
  const moduleA1 = await prisma.courseModule.upsert({
    where: {
      languageCode_level_orderIndex: {
        languageCode: 'en',
        level: CefrLevel.A1,
        orderIndex: 1,
      },
    },
    update: {},
    create: {
      languageCode: 'en',
      level: CefrLevel.A1,
      orderIndex: 1,
      title: 'First Contact: Natural Immersion',
      description: 'Acquiring high-frequency communicative structures through audio-visual context.',
    },
  });

  // 3. Lección enfocada en LISTENING (desatascar cuello de botella auditivo)
  const lesson1 = await prisma.lesson.upsert({
    where: {
      moduleId_orderIndex: {
        moduleId: moduleA1.id,
        orderIndex: 1,
      },
    },
    update: {},
    create: {
      moduleId: moduleA1.id,
      orderIndex: 1,
      title: 'Coffee & Daily Interactions',
      contextTheme: 'Ordering coffee naturally without mental translation',
      targetSkill: LanguageSkill.LISTENING,
      sections: {
        create: [
          {
            type: ExerciseType.COMPREHENSIBLE_INPUT_GIST,
            orderIndex: 1,
            inputData: {
              context: 'A warm café scene in London.',
              targetPhrase: 'Can I get a black coffee, please?',
              dialogue: [
                { speaker: 'Barista', text: 'Hi there! What can I get for you today?' },
                { speaker: 'Learner', text: 'Hi! Can I get a black coffee, please?' },
                { speaker: 'Barista', text: 'Sure thing, coming right up!' },
              ],
              audioPromptUrl: 'https://assets.zen-language.io/audio/a1_cafe_input.mp3',
            },
          },
          {
            type: ExerciseType.PHONETIC_SHADOWING,
            orderIndex: 2,
            inputData: {
              focusStructure: 'Can I get a...',
              phoneticHint: '/kæn aɪ ɡɛt ə/',
              instruction: 'Listen to the natural rhythm and shadow the pronunciation without pausing.',
            },
          },
          {
            type: ExerciseType.GRAMMAR_IN_ACTION,
            orderIndex: 3,
            inputData: {
              prompt: 'Notice how "Can I get" is used for polite requests without conjugating formally.',
            },
            metadata: {
              explicitGrammarExplanation: 'Modal verb "can" followed by base infinitive "get". Active only in review mode.',
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Datos sembrados con éxito: Módulo "${moduleA1.title}", Lección "${lesson1.title}"`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
