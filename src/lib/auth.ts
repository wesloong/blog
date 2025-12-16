import { getDB } from './cloudflare'
import bcrypt from 'bcryptjs'

export interface Admin {
  id: number
  username: string
  password_hash: string
}

// 密码校验相关
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// 管理员认证（用户名 + 密码）
export async function authenticateAdmin(username: string, password: string): Promise<boolean> {
  const db = getDB()
  
  if (!db) {
    // 本地开发时的默认管理员（无数据库时）
    if (username === 'admin' && password === 'admin123') {
      return true
    }
    return false
  }

  try {
    const admin = await db.prepare(
      'SELECT id, username, password_hash FROM admins WHERE username = ?'
    ).bind(username).first<Admin>()

    if (!admin) {
      return false
    }

    return await verifyPassword(password, admin.password_hash)
  } catch (error) {
    console.error('Error authenticating admin:', error)
    return false
  }
}

/**
 * 会话相关（简化版）
 *
 * 由于 Next.js / 边缘环境中无法可靠使用进程内内存做会话存储，
 * 这里采用「将用户名直接写入 Cookie」的方式：
 *
 * - createSession：返回用户名字符串，用作 cookie 值
 * - getSession：直接返回传入的字符串（即用户名）
 * - deleteSession：由调用方删除 cookie，本函数为空实现
 *
 * 生产环境建议改为使用 JWT + KV / Session Storage 等更安全的方案。
 */
export function createSession(username: string): string {
  // 直接返回用户名作为会话标识
  return username
}

export function getSession(sessionId: string): string | null {
  // 这里的 sessionId 实际上就是用户名
  if (!sessionId) return null
  return sessionId
}

export function deleteSession(_sessionId: string): void {
  // 会话由 cookie 管理，这里无需额外操作
}

