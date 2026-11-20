// ============================================================================
// FLUENTIA / NATIVA • GESTIÓN CENTRALIZADA DE APIS Y PROVEEDORES DE IA
// Permite configurar llaves de Gemini, OpenAI, Groq, DeepSeek y ElevenLabs
// con soporte para failover automático (rotador inteligente de respaldo).
// ============================================================================

export type AiProvider = 'gemini' | 'groq' | 'openai' | 'deepseek' | 'elevenlabs';

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
  providers: {
    gemini: ProviderKeyConfig;
    groq: ProviderKeyConfig;
    openai: ProviderKeyConfig;
    deepseek: ProviderKeyConfig;
    elevenlabs: ProviderKeyConfig;
  };
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
    description: 'Generación ultra contextual con ventana de contexto de 1M tokens y soporte multimodal nativo.',
    badge: 'Recomendado • Nivel y Audio',
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
    badge: 'Velocidad Extrema',
    color: 'from-orange-500 to-amber-400',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', tag: 'Equivalente a GPT-4' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', tag: 'Micro-latencia (150ms)' }
    ],
    placeholder: 'gsk_...',
    dashboardUrl: 'https://console.groq.com/keys'
  },
  openai: {
    name: 'OpenAI',
    description: 'Modelos de referencia GPT-4o y Whisper para transcripción fonética y análisis oral.',
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
GEMINI_API_KEY="${settings.providers.gemini.key}"
GEMINI_MODEL="${settings.providers.gemini.model}"

# Groq Cloud API
GROQ_API_KEY="${settings.providers.groq.key}"
GROQ_MODEL="${settings.providers.groq.model}"

# OpenAI API
OPENAI_API_KEY="${settings.providers.openai.key}"
OPENAI_MODEL="${settings.providers.openai.model}"

# DeepSeek API
DEEPSEEK_API_KEY="${settings.providers.deepseek.key}"
DEEPSEEK_MODEL="${settings.providers.deepseek.model}"

# ElevenLabs API
ELEVENLABS_API_KEY="${settings.providers.elevenlabs.key}"
`;
  }
}
