// Cloudflare Workers 环境类型定义

export interface Env {
  DB: D1Database
  // 如果需要 KV
  // BLOG_KV: KVNamespace
}

declare global {
  interface Request {
    env?: Env
  }
}

