// Cloudflare Workers 环境类型定义

// D1Database 类型定义（来自 @cloudflare/workers-types）
export interface D1Database {
    prepare: (query: string) => D1PreparedStatement;
    exec: (query: string) => Promise<D1ExecResult>;
    batch: <T = unknown>(
        statements: D1PreparedStatement[]
    ) => Promise<Array<D1Result<T>>>;
}

export interface D1PreparedStatement {
    bind: (...values: any[]) => D1PreparedStatement;
    first: <T = unknown>(colName?: string) => Promise<T | null>;
    run: () => Promise<D1Result>;
    all: <T = unknown>() => Promise<D1Result<T>>;
    raw: <T = unknown>() => Promise<T[]>;
}

export interface D1Result<T = unknown> {
    success: boolean;
    meta: {
        duration: number;
        size_after?: number;
        rows_read: number;
        rows_written: number;
        last_row_id?: number;
        changed_db?: boolean;
        changes?: number;
    };
    results?: T[];
    error?: string;
}

export interface D1ExecResult {
    count: number;
    duration: number;
}

export interface Env {
    DB: D1Database;
    // 如果需要 KV
    // BLOG_KV: KVNamespace
}

declare global {
    interface Request {
        env?: Env;
    }
}
