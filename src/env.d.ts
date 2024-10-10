/// <reference path="../.astro/types.d.ts" />
interface ImportMetaEnv {
  readonly OPENAI_API_KEY: string
  readonly UPSTASH_REDIS_URL: string
  readonly UPSTASH_REDIS_TOKEN: string
  readonly GITHUB_ACCESS_TOKEN: string
}

declare module "pdfjs-dist/build/pdf.min.mjs" // FIX: check @types/pdfjs-dist
