/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NAVER_CLIENT_ID: string
  readonly VITE_NAVER_CLIENT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
