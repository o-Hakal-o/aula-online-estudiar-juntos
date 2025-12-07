/// <reference types="vite/client" />

// Tipos para variables de entorno
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_ENABLE_ANALYTICS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}