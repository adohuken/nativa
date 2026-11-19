// ============================================================================
// NATIVA • CONFIGURACIÓN GLOBAL DEL SISTEMA
// Cambiar el nombre de la plataforma aquí lo actualiza en toda la aplicación.
// ============================================================================

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Nativa',
  fullName: 'Nativa • Natural Language Acquisition Engine',
  shortName: 'Nativa',
  tagline: 'Ruta Universitaria A1 → C2',
  version: '2.5',
  domain: 'nativa.io',
  pedagogy: 'Krashen Natural SLA Engine',
} as const;

export const APP_NAME = APP_CONFIG.name;
