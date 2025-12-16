import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getPost, updatePost, deletePost } from '@/lib/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAuth()
    const post = await getPost(params.slug)
    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }
    return NextResponse.json(post)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '获取文章失败' },
      { status: 401 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAuth()
    const data = await request.json()
    const post = await updatePost(params.slug, data)
    return NextResponse.json(post)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '更新文章失败' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAuth()
    await deletePost(params.slug)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '删除文章失败' },
      { status: 400 }
    )
  }
}

