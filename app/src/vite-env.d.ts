/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly POSTHOG_TOKEN?: string;
  readonly POSTHOG_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.md?raw' {
  const content: string;
  export default content;
}
