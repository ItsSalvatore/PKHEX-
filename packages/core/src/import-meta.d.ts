/** Injected when `@pkhex/core` is bundled by Vite; optional in other environments. */
interface ImportMetaEnv {
  readonly DEV?: boolean;
  readonly VITE_PKHEX_BRIDGE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
