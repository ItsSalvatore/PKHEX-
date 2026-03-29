/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** POST save bytes to PKHeX.Core bridge, e.g. `/api/pkhex-parse` (dev proxy) or `http://127.0.0.1:5177/parse`. */
  readonly VITE_PKHEX_BRIDGE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
