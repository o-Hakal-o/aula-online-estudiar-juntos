/**
 * Configuración de variables de entorno
 * Lee las variables desde import.meta.env (Vite)
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    console.warn(`Variable de entorno ${key} no está definida`);
  }
  return value || "";
};

export const env = {
  // API Configuration
  API_BASE_URL: getEnvVar("VITE_API_BASE_URL", "http://127.0.0.1:8000"),

  // App Configuration
  APP_NAME: getEnvVar("VITE_APP_NAME", "EnfermeríaOnline"),
  APP_ENV: getEnvVar("MODE", "development"),

  // Feature Flags (si los necesitas en el futuro)
  ENABLE_ANALYTICS: getEnvVar("VITE_ENABLE_ANALYTICS", "false") === "true",
} as const;

// Validación de variables críticas
if (!env.API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL no está configurada");
}
