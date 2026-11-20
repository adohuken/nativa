import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project, studentText, userId, aiProvider, apiKey, model } = body;

    if (!studentText || typeof studentText !== 'string' || studentText.trim().length < 5) {
      return NextResponse.json({
        success: false,
        message: 'El texto del proyecto es demasiado breve para ser evaluado.'
      }, { status: 400 });
    }

    const cleanText = studentText.trim();
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

    // Prompt evaluativo de rúbricas Cambridge / Oxford SLA
    const systemPrompt = `You are a Senior Oxford and Cambridge University SLA Assessor. Evaluate the student's writing project following Task-Based Language Teaching (TBLT) and CEFR standards (${project.level || 'B1'}).
You MUST return ONLY a valid JSON object with no markdown wrapping, no backticks, and no explanations outside the JSON.
The JSON structure must be:
{
  "overallScore": <integer 0-100>,
  "rubricScores": {
    "taskAchievement": <integer 0-25>,
    "coherenceCohesion": <integer 0-25>,
    "lexicalResource": <integer 0-25>,
    "grammaticalAccuracy": <integer 0-25>
  },
  "feedback": "<detailed academic feedback paragraph in Spanish acknowledging achievements and analyzing level>",
  "tips": [
    "<Specific tip 1 in Spanish with concrete example from their text>",
    "<Specific tip 2 in Spanish for improving grammatical accuracy or formal register>",
    "<Specific tip 3 in Spanish for advanced vocabulary or cohesive devices>"
  ]
}`;

    const userPrompt = `PROJECT DETAILS:
- Unit: ${project.unit} (${project.level})
- Title: ${project.title}
- Context: ${project.context}
- Instructions: ${project.instructions}
- Target Length: ${project.minWords} - ${project.maxWords} words (Student wrote: ${wordCount} words)
- Required Keywords to check: ${(project.requiredKeywords || []).join(', ')}

STUDENT SUBMISSION:
"""
${cleanText}
"""

Evaluate rigorously based on:
1. Task Achievement (0-25): Did the student fulfill the communicative goal of the task?
2. Coherence & Cohesion (0-25): Did they use logical paragraph structure and linking devices?
3. Lexical Resource (0-25): Did they use accurate vocabulary suitable for level ${project.level} and include target keywords?
4. Grammatical Accuracy (0-25): Are complex sentence structures attempted with minimal errors?
Provide overallScore (sum of 4 criteria, 0-100) and EXACTLY 3 specific, actionable improvement tips in Spanish.`;

    let evaluationResult: any = null;
    let providerUsed = 'fallback';

    // 1. Intentar llamar al proveedor de IA proporcionado
    if (apiKey && apiKey.trim().length > 5) {
      const cleanKey = apiKey.trim();

      // GROQ CLOUD
      if (aiProvider === 'groq') {
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${cleanKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model || 'llama-3.3-70b-versatile',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              temperature: 0.3,
              response_format: { type: 'json_object' }
            }),
            signal: AbortSignal.timeout(12000)
          });

          if (res.ok) {
            const data = await res.json();
            const rawContent = data.choices?.[0]?.message?.content;
            if (rawContent) {
              evaluationResult = JSON.parse(rawContent);
              providerUsed = 'Groq LPU (Llama 3.3)';
            }
          }
        } catch (e) {
          console.warn('Groq evaluation attempt failed, falling back:', e);
        }
      }

      // OPENROUTER
      if (!evaluationResult && aiProvider === 'openrouter') {
        try {
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${cleanKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model || 'meta-llama/llama-3.3-70b-instruct',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              temperature: 0.3
            }),
            signal: AbortSignal.timeout(12000)
          });

          if (res.ok) {
            const data = await res.json();
            const raw = data.choices?.[0]?.message?.content;
            if (raw) {
              const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
              evaluationResult = JSON.parse(cleaned);
              providerUsed = 'OpenRouter';
            }
          }
        } catch (e) {
          console.warn('OpenRouter evaluation attempt failed:', e);
        }
      }

      // CEREBRAS
      if (!evaluationResult && aiProvider === 'cerebras') {
        try {
          const res = await fetch('https://api.cerebras.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${cleanKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model || 'llama3.3-70b',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              temperature: 0.3
            }),
            signal: AbortSignal.timeout(10000)
          });

          if (res.ok) {
            const data = await res.json();
            const raw = data.choices?.[0]?.message?.content;
            if (raw) {
              const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
              evaluationResult = JSON.parse(cleaned);
              providerUsed = 'Cerebras Inferencia CS-3';
            }
          }
        } catch (e) {
          console.warn('Cerebras evaluation failed:', e);
        }
      }

      // GEMINI
      if (!evaluationResult && (aiProvider === 'gemini' || cleanKey.startsWith('AIzaSy'))) {
        try {
          const targetModel = model || 'gemini-2.0-flash';
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${cleanKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
              generationConfig: {
                temperature: 0.3,
                responseMimeType: 'application/json'
              }
            }),
            signal: AbortSignal.timeout(12000)
          });

          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              evaluationResult = JSON.parse(text);
              providerUsed = 'Google Gemini 2.0';
            }
          }
        } catch (e) {
          console.warn('Gemini evaluation attempt failed:', e);
        }
      }
    }

    // 2. FALLBACK HEURÍSTICO INTELIGENTE SI LA IA NO RESPONDE
    if (!evaluationResult || typeof evaluationResult.overallScore !== 'number') {
      const lower = cleanText.toLowerCase();

      // Task score
      let task = 22;
      if (wordCount < project.minWords * 0.5) task = 12;
      else if (wordCount < project.minWords) task = 17;
      else if (wordCount > project.maxWords * 1.4) task = 19;

      // Lexical score
      const keywords: string[] = project.requiredKeywords || [];
      const matched = keywords.filter(k => lower.includes(k.toLowerCase())).length;
      const ratio = keywords.length > 0 ? matched / keywords.length : 1;
      const lexical = Math.min(25, Math.max(12, Math.round(ratio * 25)));

      // Coherence score
      const connectors = ['furthermore', 'moreover', 'however', 'consequently', 'therefore', 'because', 'first', 'finally', 'while', 'in addition'];
      const foundConn = connectors.filter(c => lower.includes(c)).length;
      const coherence = Math.min(25, Math.max(14, 14 + (foundConn * 2.5)));

      // Grammar accuracy
      let accuracy = 22;
      if (lower.includes('i have 20 years') || lower.includes('i have 25 years')) accuracy -= 4;
      if (lower.includes('more better') || lower.includes('did not went')) accuracy -= 5;
      accuracy = Math.max(12, Math.min(25, accuracy));

      const total = Math.round(task + lexical + coherence + accuracy);

      evaluationResult = {
        overallScore: total,
        rubricScores: {
          taskAchievement: Math.round(task),
          coherenceCohesion: Math.round(coherence),
          lexicalResource: Math.round(lexical),
          grammaticalAccuracy: Math.round(accuracy)
        },
        feedback: total >= 80 
          ? `¡Excelente entrega académica (${total}/100)! Tu redacción cumple con la meta comunicativa del nivel ${project.level}. Desarrollaste las ideas con fluidez y conectores apropiados.`
          : `Proyecto evaluado (${total}/100). Has alcanzado el umbral básico de comunicación. Te sugerimos enriquecer las transiciones entre párrafos e incluir más vocabulario académico de la unidad.`,
        tips: [
          `1. Meta Comunicativa: Asegúrate de cubrir todos los requerimientos puntuales de la consigna (${project.instructions.slice(0, 80)}...).`,
          `2. Conectores Lógicos: Incorpora nexos discursivos formales como "Furthermore", "Nevertheless" o "Consequently" para articular las ideas sin saltos abruptos.`,
          `3. Riqueza Léxica: Emplea más palabras clave del banco oficial de la unidad (${keywords.slice(0, 3).join(', ')}) para elevar el registro académico.`
        ]
      };
      providerUsed = 'Evaluador Heurístico TBLT';
    }

    // 3. PERSISTIR EN SUPABASE (TABLA project_submissions) SI HAY USUARIO Y SUPABASE ACTIVO
    if (userId && isSupabaseConfigured) {
      try {
        const client = getSupabaseClient();
        if (client) {
          await client.from('project_submissions').insert({
            user_id: userId,
            unit: project.unit,
            level: project.level,
            title: project.title,
            content: cleanText,
            word_count: wordCount,
            overall_score: evaluationResult.overallScore,
            rubric_scores: evaluationResult.rubricScores,
            feedback: evaluationResult.feedback,
            created_at: new Date().toISOString()
          });
        }
      } catch (dbErr) {
        console.error('Error saving submission to Supabase:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      overallScore: evaluationResult.overallScore,
      rubricScores: evaluationResult.rubricScores,
      feedback: evaluationResult.feedback,
      tips: evaluationResult.tips || [],
      wordCount,
      providerUsed
    });

  } catch (err: any) {
    console.error('Project evaluation error:', err);
    return NextResponse.json({
      success: false,
      message: err?.message || 'Error interno al evaluar el proyecto.'
    }, { status: 500 });
  }
}
