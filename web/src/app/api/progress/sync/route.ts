import { NextRequest, NextResponse } from 'next/server';
import { COMPREHENSIVE_CURRICULUM } from '@/lib/curriculum-data';
import { getSupabaseClient } from '@/lib/supabase';

// Mapeo en servidor de lección a prerequisito y recompensa
const PREREQUISITE_MAP: Record<string, string | null> = {};
const XP_MAP: Record<string, number> = {};

COMPREHENSIVE_CURRICULUM.forEach((lesson) => {
  PREREQUISITE_MAP[lesson.id] = lesson.prerequisiteId || null;
  XP_MAP[lesson.id] = lesson.xpReward || 50;
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      completedNodes = [],
      completedSubNodes = [],
      xp = 0,
      streak = 0,
      immersionMinutes = 0,
      skills,
      userProfile
    } = body;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ success: false, message: 'ID de usuario requerido.' }, { status: 400 });
    }

    // =========================================================================
    // VALIDACIÓN DE SEGURIDAD EN EL SERVIDOR: CADENA DE PRERREQUISITOS
    // =========================================================================
    // Evita que un usuario altere el localStorage o envíe requests con nodos C2
    // sin haber completado los nodos A1, A2, B1, B2, C1 previamente.
    const submittedNodes: string[] = Array.isArray(completedNodes) ? completedNodes : [];
    const validatedNodes: string[] = [];

    // Validamos nodo por nodo en orden de dependencia
    for (const node of COMPREHENSIVE_CURRICULUM) {
      if (submittedNodes.includes(node.id)) {
        if (!node.prerequisiteId) {
          // El primer nodo no tiene prerequisito
          validatedNodes.push(node.id);
        } else if (validatedNodes.includes(node.prerequisiteId)) {
          // El prerequisito ya fue validado en esta misma secuencia
          validatedNodes.push(node.id);
        } else {
          // Intento de salto ilegal de nivel: Se rechaza este nodo
          console.warn(`[SEGURIDAD] Usuario ${userId} intentó desbloquear ${node.id} sin completar ${node.prerequisiteId}. Nodo omitido.`);
        }
      }
    }

    // =========================================================================
    // VALIDACIÓN DE XP MÁXIMO RAZONABLE
    // =========================================================================
    const subNodesCount = Array.isArray(completedSubNodes) ? completedSubNodes.length : 0;
    const baseNodeXp = validatedNodes.reduce((acc, id) => acc + (XP_MAP[id] || 50), 0);
    // Cada sub-nodo otorga ~20-30 XP, más bonos de inmersión y repaso (máx 150 por lección)
    const maxTheoreticalXp = (baseNodeXp * 3) + (subNodesCount * 35) + (immersionMinutes * 5) + 500;
    
    // Si el XP enviado es absurdo (ej. 1,000,000 XP inyectado), se ajusta al límite coherente
    const sanitizedXp = Math.min(Math.max(0, Number(xp) || 0), maxTheoreticalXp);

    // =========================================================================
    // PERSISTENCIA EN SUPABASE
    // =========================================================================
    const client = getSupabaseClient();
    if (client) {
      // 1. Guardar en user_progress
      const { error: progressError } = await client.from('user_progress').upsert({
        user_id: userId,
        completed_nodes: validatedNodes,
        completed_subnodes: Array.isArray(completedSubNodes) ? completedSubNodes : [],
        immersion_minutes: Number(immersionMinutes) || 0,
        skills: skills || {},
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      if (progressError) {
        console.error('Error guardando user_progress en Supabase:', progressError);
      }

      // 2. Guardar en profiles
      if (userProfile || sanitizedXp || streak) {
        await client.from('profiles').upsert({
          id: userId,
          email: userProfile?.email || undefined,
          name: userProfile?.name || undefined,
          xp: sanitizedXp,
          streak: Number(streak) || 0,
          current_level: userProfile?.targetLevel?.split(' ')[0] || (validatedNodes.length > 0 ? 'A2' : 'A1'),
          updated_at: new Date().toISOString()
        });
      }
    }

    return NextResponse.json({
      success: true,
      validatedNodes,
      sanitizedXp,
      tamperingDetected: validatedNodes.length < submittedNodes.length
    });

  } catch (error: any) {
    console.error('Error en /api/progress/sync:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Error interno al validar progreso.' }, { status: 500 });
  }
}
