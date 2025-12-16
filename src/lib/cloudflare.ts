// Cloudflare 环境辅助函数
// 在本地开发时，该模块会被 webpack 标记为外部模块，不会尝试解析

export function getDB() {
  // 在本地开发时，直接返回 null，使用示例数据
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    return null
  }
  
  // 在 Cloudflare 生产环境中尝试获取数据库
  try {
    // 使用动态 require（在 webpack 配置中已标记为外部模块）
    if (typeof require !== 'undefined') {
      const cloudflareModule = require('@cloudflare/next-on-pages')
      if (cloudflareModule && cloudflareModule.getRequestContext) {
        const ctx = cloudflareModule.getRequestContext()
        return ctx?.env?.DB || null
      }
    }
  } catch (error) {
    // 模块不存在或不在 Cloudflare 环境，这在本地开发时是正常的
    console.debug('Cloudflare module not available:', error)
  }
  
  return null
}

