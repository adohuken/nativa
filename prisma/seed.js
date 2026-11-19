const { PrismaClient, CefrLevel, LanguageSkill, ExerciseType } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando módulos del Temario Universitario (MCER A1 - C2)...');

  // 1. Idiomas
  await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: { code: 'en', name: 'English' },
  });

  await prisma.language.upsert({
    where: { code: 'es' },
    update: {},
    create: { code: 'es', name: 'Spanish' },
  });

  // 2. Módulos Universitarios A1 a C2
  const universityModules = [
    {
      level: CefrLevel.A1,
      orderIndex: 1,
      title: 'Módulo 1 (A1): Fundamentos y Supervivencia Comunicativa',
      description: 'Verbo to be, identidad, demostrativos, hábitos y espacios del campus.',
    },
    {
      level: CefrLevel.A2,
      orderIndex: 2,
      title: 'Módulo 2 (A2): Comunicación Cotidiana y Experiencias Pasadas',
      description: 'Pasado simple, comparativos, intenciones futuras y normas institucionales.',
    },
    {
      level: CefrLevel.B1,
      orderIndex: 3,
      title: 'Módulo 3 (B1): Independencia Lingüística y Opinión',
      description: 'Presente perfecto, condicionales 1 y 2, narración de sucesos y descripción de procesos técnicos.',
    },
    {
      level: CefrLevel.B2,
      orderIndex: 4,
      title: 'Módulo 4 (B2): Fluidez, Argumentación y Contexto Académico',
      description: 'Cleft sentences, debate Oxford, tercer condicional, reported speech y pasiva avanzada.',
    },
    {
      level: CefrLevel.C1,
      orderIndex: 5,
      title: 'Módulo 5 (C1): Inglés Académico Avanzado (EAP) y Profesional',
      description: 'Inversión enfática, modo subjuntivo, lenguaje cauteloso (hedging) y colocaciones complejas.',
    },
    {
      level: CefrLevel.C2,
      orderIndex: 6,
      title: 'Módulo 6 (C2): Maestría, Especialización y Publicaciones',
      description: 'Pragmática del discurso, ironía cultural, redacción de papers indexados y defensa de tesis doctoral.',
    },
  ];

  for (const mod of universityModules) {
    const createdMod = await prisma.courseModule.upsert({
      where: {
        languageCode_level_orderIndex: {
          languageCode: 'en',
          level: mod.level,
          orderIndex: mod.orderIndex,
        },
      },
      update: {
        title: mod.title,
        description: mod.description,
      },
      create: {
        languageCode: 'en',
        level: mod.level,
        orderIndex: mod.orderIndex,
        title: mod.title,
        description: mod.description,
      },
    });

    console.log(`✅ Módulo listo: [${mod.level}] ${createdMod.title}`);
  }

  console.log('🎉 Siembra universitaria completada con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
