import { type NextRequest, NextResponse } from 'next/server';

import { createCategory, getCategories, requireAuth } from '@/lib/admin';

export const runtime = 'edge';

export async function GET() {
    try {
        await requireAuth();
        const categories = await getCategories();
        return NextResponse.json(categories);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || '获取栏目失败' },
            { status: 401 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAuth();
        const data = await request.json();
        const category = await createCategory(data);
        return NextResponse.json(category);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || '创建栏目失败' },
            { status: 400 }
        );
    }
}
