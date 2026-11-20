// ============================================================================
// FLUENTIA / NATIVA • GESTIÓN CENTRALIZADA DE APIS Y PROVEEDORES DE IA
// Configuración de llaves de Gemini, Groq, OpenAI, DeepSeek, ElevenLabs,
// OpenRouter, Mistral AI, Cloudflare Workers AI, Cerebras y Cohere
// con soporte para failover automático (rotador inteligente de respaldo).
// ============================================================================

export type AiProvider = 
  | 'gemini' 
  | 'groq' 
  | 'openai' 
  | 'deepseek' 
  | 'openrouter' 
  | 'mistral' 
  | 'cerebras' 
  | 'cohere' 
  | 'cloudflare' 
  | 'elevenlabs';

export interface ProviderKeyConfig {
  key: string;
  model: string;
  isActive: boolean;
  lastTestedAt?: string;
  testStatus?: 'success' | 'error' | 'untested';
  testMessage?: string;
  latencyMs?: number;
}

export interface AiSystemSettings {
  primaryProvider: AiProvider;
  fallbackProvider: AiProvider;
  enableAutoFailover: boolean;
  temperature: number; // 0.2 - 1.0 (default 0.7 para pedagogía SLA)
  providers: Record<AiProvider, ProviderKeyConfig>;
}

const STORAGE_KEY = 'fluentia_ai_system_settings';

export const DEFAULT_AI_SETTINGS: AiSystemSettings = {
  primaryProvider: 'gemini',
  fallbackProvider: 'groq',
  enableAutoFailover: true,
  temperature: 0.7,
  providers: {
    gemini: {
      key: '',
      model: 'gemini-2.0-flash',
      isActive: true,
      testStatus: 'untested'
    },
    groq: {
      key: '',
      model: 'llama-3.3-70b-versatile',
      isActive: true,
      testStatus: 'untested'
    },
    openai: {
      key: '',
      model: 'gpt-4o-mini',
      isActive: false,
      testStatus: 'untested'
    },
    deepseek: {
      key: '',
      model: 'deepseek-chat',
      isActive: false,
      testStatus: 'untested'
    },
    openrouter: {
      key: '',
      model: 'anthropic/claude-3.5-sonnet',
      isActive: false,
      testStatus: 'untested'
    },
    mistral: {
      key: '',
      model: 'mistral-large-latest',
      isActive: false,
      testStatus: 'untested'
    },
    cerebras: {
      key: '',
      model: 'llama3.3-70b',
      isActive: false,
      testStatus: 'untested'
    },
    cohere: {
      key: '',
      model: 'command-r-plus-08-2024',
      isActive: false,
      testStatus: 'untested'
    },
    cloudflare: {
      key: '',
      model: '@cf/meta/llama-3.3-70b-instruct',
      isActive: false,
      testStatus: 'untested'
    },
    elevenlabs: {
      key: '',
      model: 'eleven_multilingual_v2',
      isActive: false,
      testStatus: 'untested'
    }
  }
};

export const PROVIDER_INFO: Record<AiProvider, {
  name: string;
  description: string;
  badge: string;
  color: string;
  models: { id: string; name: string; tag: string }[];
  placeholder: string;
  dashboardUrl: string;
}> = {
  gemini: {
    name: 'Google Gemini',
    description: 'Generación ultra contextual con ventana de 1M tokens, audio nativo y pedagogía SLA.',
    badge: 'Recomendado • Multimodal',
    color: 'from-blue-500 to-cyan-400',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', tag: 'Ultra Rápido • Ideal para Historias' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', tag: 'Alta Precisión Curricular' }
    ],
    placeholder: 'AIzaSy...',
    dashboardUrl: 'https://aistudio.google.com/app/apikey'
  },
  groq: {
    name: 'Groq Cloud',
    description: 'Velocidad extrema (500+ tokens/segundo) con unidades LPU. Cero latencia en respuestas.',
    badge: 'Velocidad LPU (500 t/s)',
    color: 'from-orange-500 to-amber-400',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', tag: 'Equivalente a GPT-4' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', tag: 'Micro-latencia (150ms)' }
    ],
    placeholder: 'gsk_...',
    dashboardUrl: 'https://console.groq.com/keys'
  },
  cerebras: {
    name: 'Cerebras Inference',
    description: 'La inferencia más rápida del planeta impulsada por el chip Wafer-Scale CS-3 (más de 2,000 t/s).',
    badge: 'Hiper-Velocidad (2,000+ t/s)',
    color: 'from-emerald-500 to-teal-400',
    models: [
      { id: 'llama3.3-70b', name: 'Llama 3.3 70B', tag: 'Velocidad récord en modelos grandes' },
      { id: 'llama3.1-8b', name: 'Llama 3.1 8B', tag: '2,200 tokens/segundo instantáneo' }
    ],
    placeholder: 'csk-...',
    dashboardUrl: 'https://cloud.cerebras.ai/'
  },
  openrouter: {
    name: 'OpenRouter',
    description: 'Hub unificado con acceso a más de 200 modelos (Claude 3.5, GPT-4o, Llama 3.3, DeepSeek) con saldo compartido.',
    badge: 'Hub Multi-Modelo Universal',
    color: 'from-blue-600 to-indigo-600',
    models: [
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', tag: 'Máxima Inteligencia Lingüística' },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', tag: 'Alta calidad a bajo coste' },
      { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Free)', tag: 'Nivel gratuito' },
      { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', tag: 'Razonamiento avanzado' }
    ],
    placeholder: 'sk-or-v1-...',
    dashboardUrl: 'https://openrouter.ai/keys'
  },
  mistral: {
    name: 'Mistral AI',
    description: 'Modelos europeos de referencia con fluidez multilingüe nativa, razonamiento denso y precisión sintáctica.',
    badge: 'Líder Multilingüe Europeo',
    color: 'from-amber-600 to-orange-500',
    models: [
      { id: 'mistral-large-latest', name: 'Mistral Large 2', tag: 'Nivel GPT-4o Multilingüe' },
      { id: 'mistral-small-latest', name: 'Mistral Small 3', tag: 'Rápido, denso y económico' },
      { id: 'codestral-latest', name: 'Codestral', tag: 'Especialista gramatical' }
    ],
    placeholder: 'Pega tu clave de Mistral...',
    dashboardUrl: 'https://console.mistral.ai/api-keys'
  },
  cohere: {
    name: 'Cohere',
    description: 'Modelos Command R+ creados para comprensión multilingüe nativa, RAG y análisis de colocaciones.',
    badge: 'Especialista RAG & Semántica',
    color: 'from-teal-600 to-emerald-400',
    models: [
      { id: 'command-r-plus-08-2024', name: 'Command R+', tag: 'Líder en 10+ idiomas nativos' },
      { id: 'command-r-08-2024', name: 'Command R', tag: 'Eficiencia y respuesta rápida' }
    ],
    placeholder: 'Pega tu API Key de Cohere...',
    dashboardUrl: 'https://dashboard.cohere.com/api-keys'
  },
  cloudflare: {
    name: 'Cloudflare Workers AI',
    description: 'Inferencia serverless global distribuida en los centros de datos de la red perimetral de Cloudflare.',
    badge: 'Red Edge Global Serverless',
    color: 'from-orange-500 to-yellow-500',
    models: [
      { id: '@cf/meta/llama-3.3-70b-instruct', name: 'Llama 3.3 70B (Edge)', tag: 'Ejecutado en red CDN global' },
      { id: '@cf/meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instant', tag: 'Micro-latencia en el borde' }
    ],
    placeholder: 'Bearer API Token (o AccountID:Token)...',
    dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/workers/ai'
  },
  openai: {
    name: 'OpenAI',
    description: 'Modelos GPT-4o y Whisper para transcripción fonética y análisis oral de alta precisión.',
    badge: 'Estándar de la Industria',
    color: 'from-emerald-500 to-teal-400',
    models: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', tag: 'Rápido y Muy Económico' },
      { id: 'gpt-4o', name: 'GPT-4o Completo', tag: 'Máxima Capacidad Analítica' }
    ],
    placeholder: 'sk-proj-...',
    dashboardUrl: 'https://platform.openai.com/api-keys'
  },
  deepseek: {
    name: 'DeepSeek AI',
    description: 'Modelos de vanguardia V3 y R1 con costos de inferencia hasta 90% más bajos.',
    badge: 'Bajo Costo & Razonamiento',
    color: 'from-indigo-500 to-purple-400',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek V3 (Chat)', tag: 'Excelente en Gramática y Fluidez' },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1', tag: 'Razonamiento Lingüístico Profundo' }
    ],
    placeholder: 'sk-...',
    dashboardUrl: 'https://platform.deepseek.com/api_keys'
  },
  elevenlabs: {
    name: 'ElevenLabs',
    description: 'Síntesis de voz neural ultrarrealista con entonación nativa británica y estadounidense.',
    badge: 'Voz Humana Nativa',
    color: 'from-pink-500 to-rose-400',
    models: [
      { id: 'eleven_multilingual_v2', name: 'Multilingual v2', tag: 'Acentos Nativos y Emoción' },
      { id: 'eleven_turbo_v2_5', name: 'Turbo v2.5', tag: 'Baja Latencia para Streaming' }
    ],
    placeholder: 'xi-...',
    dashboardUrl: 'https://elevenlabs.io/app/settings/api-keys'
  }
};

export class AiConfigService {
  public static getSettings(): AiSystemSettings {
    if (typeof window === 'undefined') return DEFAULT_AI_SETTINGS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_AI_SETTINGS,
          ...parsed,
          providers: {
            ...DEFAULT_AI_SETTINGS.providers,
            ...(parsed.providers || {})
          }
        };
      }
    } catch {}
    return DEFAULT_AI_SETTINGS;
  }

  public static saveSettings(settings: AiSystemSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('Error saving AI system settings:', err);
    }
  }

  public static getKeyForProvider(provider: AiProvider): string {
    const settings = this.getSettings();
    return settings.providers[provider]?.key || '';
  }

  public static isAnyKeyConfigured(): boolean {
    const settings = this.getSettings();
    return Object.values(settings.providers).some(p => p.key && p.key.trim().length > 5);
  }

  /**
   * Genera el bloque de variables para el archivo .env.local
   */
  public static exportToEnvFormat(settings: AiSystemSettings): string {
    return `# ============================================================================
# NATIVA • CONFIGURACIÓN DE PROVEEDORES DE IA (Generado desde el cPanel)
# ============================================================================
NEXT_PUBLIC_APP_NAME="Nativa"

# Google Gemini API
GEMINI_API_KEY="${settings.providers.gemini?.key || ''}"
GEMINI_MODEL="${settings.providers.gemini?.model || 'gemini-2.0-flash'}"

# Groq Cloud API
GROQ_API_KEY="${settings.providers.groq?.key || ''}"
GROQ_MODEL="${settings.providers.groq?.model || 'llama-3.3-70b-versatile'}"

# Cerebras Inference API (2,000+ tokens/s)
CEREBRAS_API_KEY="${settings.providers.cerebras?.key || ''}"
CEREBRAS_MODEL="${settings.providers.cerebras?.model || 'llama3.3-70b'}"

# OpenRouter (Hub Multi-Modelo)
OPENROUTER_API_KEY="${settings.providers.openrouter?.key || ''}"
OPENROUTER_MODEL="${settings.providers.openrouter?.model || 'anthropic/claude-3.5-sonnet'}"

# Mistral AI API
MISTRAL_API_KEY="${settings.providers.mistral?.key || ''}"
MISTRAL_MODEL="${settings.providers.mistral?.model || 'mistral-large-latest'}"

# Cohere API
COHERE_API_KEY="${settings.providers.cohere?.key || ''}"
COHERE_MODEL="${settings.providers.cohere?.model || 'command-r-plus-08-2024'}"

# Cloudflare Workers AI Token
CLOUDFLARE_AI_TOKEN="${settings.providers.cloudflare?.key || ''}"
CLOUDFLARE_AI_MODEL="${settings.providers.cloudflare?.model || '@cf/meta/llama-3.3-70b-instruct'}"

# OpenAI API
OPENAI_API_KEY="${settings.providers.openai?.key || ''}"
OPENAI_MODEL="${settings.providers.openai?.model || 'gpt-4o-mini'}"

# DeepSeek API
DEEPSEEK_API_KEY="${settings.providers.deepseek?.key || ''}"
DEEPSEEK_MODEL="${settings.providers.deepseek?.model || 'deepseek-chat'}"

# ElevenLabs API
ELEVENLABS_API_KEY="${settings.providers.elevenlabs?.key || ''}"
`;
  }
}
