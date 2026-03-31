/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  /** Override PKHeX.Core bridge URL; when unset in dev, `@pkhex/core` defaults to `/api/pkhex-parse` (Vite proxy). */
  readonly VITE_PKHEX_BRIDGE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
