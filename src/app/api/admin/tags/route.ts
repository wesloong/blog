import { type NextRequest, NextResponse } from 'next/server';

import { createTag, getTags, requireAuth } from '@/lib/admin';

export const runtime = 'edge';

export async function GET() {
    try {
        await requireAuth();
        const tags = await getTags();
        return NextResponse.json(tags);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || '获取标签失败' },
            { status: 401 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAuth();
        const data = await request.json();
        const tag = await createTag(data);
        return NextResponse.json(tag);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || '创建标签失败' },
            { status: 400 }
        );
    }
}
