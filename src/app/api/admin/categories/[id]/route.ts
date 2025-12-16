import { type NextRequest, NextResponse } from 'next/server';

import { deleteCategory, requireAuth, updateCategory } from '@/lib/admin';

export const runtime = 'edge';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireAuth();
        const data = await request.json();
        const category = await updateCategory(parseInt(params.id), data);
        return NextResponse.json(category);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || '更新栏目失败' },
            { status: 400 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireAuth();
        await deleteCategory(parseInt(params.id));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || '删除栏目失败' },
            { status: 400 }
        );
    }
}
