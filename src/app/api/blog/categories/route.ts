import { NextResponse } from 'next/server';

import { getDB } from '@/lib/cloudflare';

export const runtime = 'edge';

export async function GET() {
    try {
        const db = getDB();

        if (!db) {
            return NextResponse.json([]);
        }

        const result = await db
            .prepare(
                'SELECT id, name, slug, description, sort_order FROM categories ORDER BY sort_order, name'
            )
            .all();

        if (result.success && result.results) {
            return NextResponse.json(result.results);
        }

        return NextResponse.json([]);
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: '获取分类失败' }, { status: 500 });
    }
}
