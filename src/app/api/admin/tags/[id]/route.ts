import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, updateTag, deleteTag } from '@/lib/admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()
    const data = await request.json()
    const tag = await updateTag(parseInt(params.id), data)
    return NextResponse.json(tag)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '更新标签失败' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()
    await deleteTag(parseInt(params.id))
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '删除标签失败' },
      { status: 400 }
    )
  }
}

