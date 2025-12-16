import { NextRequest, NextResponse } from 'next/server'
import { incrementViewCount } from '@/lib/blog'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await incrementViewCount(params.slug)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json(
      { error: '更新访问人数失败' },
      { status: 500 }
    )
  }
}

