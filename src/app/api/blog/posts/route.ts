import { NextResponse } from 'next/server';

import { getBlogPosts } from '@/lib/blog';

export const runtime = 'edge';

export async function GET() {
    try {
        const posts = await getBlogPosts();
        return NextResponse.json(posts);
    } catch (error: any) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ error: '获取文章失败' }, { status: 500 });
    }
}
