import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin'
import { getDB } from '@/lib/cloudflare'
import { authenticateAdmin, hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const username = await requireAuth()
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '请填写所有字段' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '新密码长度至少为 6 位' },
        { status: 400 }
      )
    }

    // 验证当前密码
    const isValid = await authenticateAdmin(username, currentPassword)
    if (!isValid) {
      return NextResponse.json(
        { error: '当前密码错误' },
        { status: 401 }
      )
    }

    // 更新密码
    const db = getDB()
    if (!db) {
      return NextResponse.json(
        { error: '数据库不可用' },
        { status: 500 }
      )
    }

    const newPasswordHash = await hashPassword(newPassword)
    await db.prepare(
      'UPDATE admins SET password_hash = ?, updated_at = unixepoch() WHERE username = ?'
    ).bind(newPasswordHash, username).run()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '修改密码失败' },
      { status: 400 }
    )
  }
}

