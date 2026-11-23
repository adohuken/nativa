import { NextRequest, NextResponse } from 'next/server';

// Mapeo de proveedores a nombres de variables de entorno en el servidor
const PROVIDER_ENV_MAP: Record<string, string> = {
  gemini: 'GEMINI_API_KEY',
  groq: 'GROQ_API_KEY',
  cerebras: 'CEREBRAS_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
  openai: 'OPENAI_API_KEY',
  mistral: 'MISTRAL_API_KEY',
  deepseek: 'DEEPSEEK_API_KEY',
  cohere: 'COHERE_API_KEY',
  cloudflare: 'CLOUDFLARE_AI_TOKEN',
  elevenlabs: 'ELEVENLABS_API_KEY'
};

function getServerKey(provider: string): string | null {
  const envName = PROVIDER_ENV_MAP[provider.toLowerCase()];
  if (!envName) return null;
  const val = process.env[envName];
  return (val && val.trim().length > 0) ? val.trim() : null;
}

export async function GET() {
  // Reporta el estado de configuración de los proveedores en el servidor sin exponer las llaves
  const configuredProviders: Record<string, boolean> = {};
  for (const [provider, envVar] of Object.entries(PROVIDER_ENV_MAP)) {
    const val = process.env[envVar];
    configuredProviders[provider] = Boolean(val && val.trim().length > 5);
  }

  return NextResponse.json({
    status: 'ok',
    configuredProviders
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'generate_story', provider, model, ...params } = body;

    // 1. ACCIÓN: ESTADO DE CONFIGURACIÓN
    if (action === 'status') {
      const configuredProviders: Record<string, boolean> = {};
      for (const [p, envVar] of Object.entries(PROVIDER_ENV_MAP)) {
        const val = process.env[envVar];
        configuredProviders[p] = Boolean(val && val.trim().length > 5);
      }
      return NextResponse.json({ success: true, configuredProviders });
    }

    // 2. ACCIÓN: GENERAR HISTORIA DE INMERSIÓN
    if (action === 'generate_story') {
      const { level = 'B1', topic = 'General', contextHint } = params;

      // Buscar qué proveedores tienen llaves válidas en el servidor
      const targetProvider = provider || (getServerKey('gemini') ? 'gemini' : getServerKey('groq') ? 'groq' : 'fallback');
      const apiKey = getServerKey(targetProvider);

      const systemPrompt = `You are a Senior SLA (Second Language Acquisition) Pedagogical Content Creator for Nativa.
Generate an immersive, natural, Krashen i+1 comprehensible input story for CEFR level ${level} about topic "${topic}".
Context hint: ${contextHint || 'Professional or daily life communicative context'}.
Rules:
- Appropriate lexical density and grammar for level ${level}.
- Natural phrasing, zero artificial or robotic text.
- Must return ONLY valid JSON without markdown wrapping or backticks.
JSON format:
{
  "title": "<Engaging story title in English>",
  "subtitle": "<Pedagogical subtitle in Spanish explaining the communicative scenario>",
  "paragraphs": [
    "<Paragraph 1 in English>",
    "<Paragraph 2 in English>",
    "<Paragraph 3 in English>"
  ],
  "vocabulary": {
    "<key word 1>": "<Spanish contextual definition>",
    "<key word 2>": "<Spanish contextual definition>",
    "<key word 3>": "<Spanish contextual definition>"
  },
  "cultural_insight": "<One sentence in Spanish explaining a pragmatic, communicative or cultural nuance related to the text>",
  "reading_minutes": <estimated integer minutes to read, e.g. 2 or 3>
}`;

      const userPrompt = `Create an authentic immersion story for level ${level} regarding "${topic}". Include target vocabulary and pragmatic notes.`;

      // Si hay llave de Gemini en el servidor
      if (apiKey && (targetProvider === 'gemini' || getServerKey('gemini'))) {
        const gemKey = targetProvider === 'gemini' ? apiKey : getServerKey('gemini')!;
        const gemModel = model || 'gemini-2.0-flash';
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${gemModel}:generateContent?key=${gemKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
              generationConfig: {
                temperature: 0.7,
                responseMimeType: 'application/json'
              }
            }),
            signal: AbortSignal.timeout(12000)
          });

          if (res.ok) {
            const data = await res.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleaned);
              return NextResponse.json({
                success: true,
                story: parsed,
                providerUsed: 'gemini',
                modelUsed: gemModel
              });
            }
          }
        } catch (geminiErr) {
          console.warn('Gemini proxy call failed, evaluating fallback:', geminiErr);
        }
      }

      // Si hay llave de Groq en el servidor
      const groqKey = getServerKey('groq');
      if (groqKey) {
        const groqModel = model || 'llama-3.3-70b-versatile';
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: groqModel,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              temperature: 0.7,
              response_format: { type: 'json_object' }
            }),
            signal: AbortSignal.timeout(10000)
          });

          if (res.ok) {
            const data = await res.json();
            const rawContent = data?.choices?.[0]?.message?.content;
            if (rawContent) {
              const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleaned);
              return NextResponse.json({
                success: true,
                story: parsed,
                providerUsed: 'groq',
                modelUsed: groqModel
              });
            }
          }
        } catch (groqErr) {
          console.warn('Groq proxy call failed:', groqErr);
        }
      }

      // Fallback seguro si aún no se configuraron API keys en el servidor
      return NextResponse.json({
        success: false,
        message: 'No hay API Keys de IA activas en las variables de entorno del servidor (.env.local o Dokploy). Añade GEMINI_API_KEY o GROQ_API_KEY para habilitar la inferencia en tiempo real.',
        needsKeySetup: true
      });
    }

    // 3. ACCIÓN: COMPLETION O CHAT GENÉRICO
    if (action === 'chat' || action === 'complete') {
      const { messages, systemPrompt: sys, temperature = 0.7 } = params;
      const primaryKey = getServerKey(provider || 'groq') || getServerKey('gemini');

      if (!primaryKey) {
        return NextResponse.json({
          success: false,
          message: 'No hay credenciales de IA configuradas en el servidor.'
        }, { status: 400 });
      }

      // Groq generic chat
      const groqKey = getServerKey('groq');
      if (groqKey) {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model || 'llama-3.3-70b-versatile',
            messages: [
              ...(sys ? [{ role: 'system', content: sys }] : []),
              ...(messages || [])
            ],
            temperature
          })
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({
            success: true,
            text: data?.choices?.[0]?.message?.content || '',
            providerUsed: 'groq'
          });
        }
      }

      return NextResponse.json({
        success: false,
        message: 'Fallo al procesar la solicitud con los proveedores disponibles.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: false,
      message: `Acción '${action}' no reconocida en el proxy de IA.`
    }, { status: 400 });

  } catch (error: any) {
    console.error('Error en /api/ai/proxy:', error);
    return NextResponse.json({
      success: false,
      message: error?.message || 'Error interno del servidor en el proxy de IA.'
    }, { status: 500 });
  }
}
