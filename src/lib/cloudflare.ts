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
    // 使用字符串拼接来避免构建时解析 @cloudflare/next-on-pages
    // 这个模块只在 Cloudflare 运行时环境中可用
    try {
        // 使用字符串拼接来动态构建模块路径，避免构建时解析
        // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
        const moduleName = '@cloudflare' + '/next-on-pages';
        if (typeof require !== 'undefined') {
            // eslint-disable-next-line
            const cloudflareModule = require(moduleName);
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
