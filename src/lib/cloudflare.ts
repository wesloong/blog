// Cloudflare 环境辅助函数
// 在本地开发时，该模块会被 webpack 标记为外部模块，不会尝试解析

import type { D1Database } from '@/types/cloudflare';

// 声明 getRequestContext 的类型，避免构建时错误
declare function getRequestContext(): {
    env?: { DB?: D1Database };
    cf?: unknown;
    ctx?: unknown;
};

export function getDB(): D1Database | null {
    // 在本地开发时，直接返回 null，使用示例数据
    if (
        typeof process !== 'undefined' &&
        process.env.NODE_ENV !== 'production'
    ) {
        return null;
    }

    // 在 Cloudflare 生产环境中尝试获取数据库
    // 注意：@cloudflare/next-on-pages 在构建时被标记为外部模块
    // 在运行时环境中才会加载，所以这里使用动态 require 避免构建错误
    try {
        // 使用动态 require（在 webpack 配置中已标记为外部模块）
        if (typeof require !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const cloudflareModule = require('@cloudflare/next-on-pages');
            if (cloudflareModule?.getRequestContext) {
                const ctx = cloudflareModule.getRequestContext();
                return (ctx?.env?.DB as D1Database) || null;
            }
        }
    } catch (error) {
        // 模块不存在或不在 Cloudflare 环境，这在本地开发时是正常的
        console.debug('Cloudflare module not available:', error);
    }

    return null;
}
