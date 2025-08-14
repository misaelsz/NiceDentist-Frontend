/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_API_URL: string;
  readonly VITE_MANAGER_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENABLE_MOCK_API: boolean;
  readonly VITE_DEBUG_MODE: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
