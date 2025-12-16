import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getPosts, createPost } from '@/lib/admin'

export async function GET() {
  try {
    await requireAuth()
    const posts = await getPosts()
    return NextResponse.json(posts)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '获取文章失败' },
      { status: 401 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const data = await request.json()
    const post = await createPost(data)
    return NextResponse.json(post)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '创建文章失败' },
      { status: 400 }
    )
  }
}

