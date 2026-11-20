import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { provider, apiKey, model } = body;

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 6) {
      return NextResponse.json({
        success: false,
        message: 'La clave API proporcionada está vacía o es demasiado corta.',
        latencyMs: 0
      }, { status: 400 });
    }

    const cleanKey = apiKey.trim();

    // 1. Google Gemini
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;
      const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(8000) });
      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        return NextResponse.json({
          success: true,
          message: '✓ Conexión exitosa con Google Gemini API. Modelos activos y listos para inferencia.',
          latencyMs
        });
      } else {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `HTTP ${res.status}: Error de autenticación en Gemini API`;
        return NextResponse.json({
          success: false,
          message: `✕ Fallo de autenticación en Gemini: ${errMsg}`,
          latencyMs
        }, { status: 400 });
      }
    }

    // 2. Groq Cloud
    if (provider === 'groq') {
      const url = 'https://api.groq.com/openai/v1/models';
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cleanKey}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(8000)
      });
      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        return NextResponse.json({
          success: true,
          message: '✓ Conexión ultrarrápida exitosa con Groq Cloud LPU. Servidores listos.',
          latencyMs
        });
      } else {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `HTTP ${res.status}: Clave de Groq inválida`;
        return NextResponse.json({
          success: false,
          message: `✕ Fallo en Groq: ${errMsg}`,
          latencyMs
        }, { status: 400 });
      }
    }

    // 3. OpenAI
    if (provider === 'openai') {
      const url = 'https://api.openai.com/v1/models';
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cleanKey}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(8000)
      });
      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        return NextResponse.json({
          success: true,
          message: '✓ Conexión verificada con OpenAI. API Key válida y operativa.',
          latencyMs
        });
      } else {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `HTTP ${res.status}: Clave de OpenAI incorrecta`;
        return NextResponse.json({
          success: false,
          message: `✕ Fallo en OpenAI: ${errMsg}`,
          latencyMs
        }, { status: 400 });
      }
    }

    // 4. DeepSeek
    if (provider === 'deepseek') {
      const url = 'https://api.deepseek.com/models';
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cleanKey}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(8000)
      });
      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        return NextResponse.json({
          success: true,
          message: '✓ Conexión exitosa con DeepSeek AI. Modelos V3 y R1 autorizados.',
          latencyMs
        });
      } else {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `HTTP ${res.status}: Clave de DeepSeek inválida`;
        return NextResponse.json({
          success: false,
          message: `✕ Fallo en DeepSeek: ${errMsg}`,
          latencyMs
        }, { status: 400 });
      }
    }

    // 5. ElevenLabs
    if (provider === 'elevenlabs') {
      const url = 'https://api.elevenlabs.io/v1/user';
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'xi-api-key': cleanKey
        },
        signal: AbortSignal.timeout(8000)
      });
      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        const userJson = await res.json().catch(() => ({}));
        const tier = userJson?.subscription?.tier || 'activo';
        return NextResponse.json({
          success: true,
          message: `✓ Conexión exitosa con ElevenLabs. Plan: ${tier}. Síntesis de voz lista.`,
          latencyMs
        });
      } else {
        return NextResponse.json({
          success: false,
          message: `✕ Clave de ElevenLabs inválida o sin suscripción activa (HTTP ${res.status}).`,
          latencyMs
        }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: false,
      message: `Proveedor no soportado: ${provider}`,
      latencyMs: Date.now() - startTime
    }, { status: 400 });

  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    return NextResponse.json({
      success: false,
      message: `Error de red al conectar con el servidor: ${error?.message || 'Tiempo de espera agotado'}`,
      latencyMs
    }, { status: 500 });
  }
}
