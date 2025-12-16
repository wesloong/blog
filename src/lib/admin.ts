import { getDB } from './cloudflare'
import { getSession } from './auth'
import { cookies } from 'next/headers'

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  sort_order: number
}

export interface Tag {
  id: number
  name: string
  slug: string
  description?: string
}

export interface PostWithRelations {
  slug: string
  title: string
  subtitle?: string
  date: string
  excerpt: string
  content: string
  markdown_content?: string
  featured_image?: string
  view_count?: number
  category_id?: number
  published: number
  category?: Category
  tags?: Tag[]
}

// 检查管理员是否已登录
export async function requireAuth(): Promise<string> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('admin_session')?.value

  if (!sessionId) {
    throw new Error('未登录')
  }

  const username = getSession(sessionId)
  if (!username) {
    throw new Error('会话已过期')
  }

  return username
}

// 检查是否已登录（不抛出错误）
export async function checkAuth(): Promise<string | null> {
  try {
    return await requireAuth()
  } catch {
    return null
  }
}

// 获取统计数据
export async function getDashboardStats() {
  const db = getDB()
  
  if (!db) {
    return {
      totalPosts: 3,
      publishedPosts: 3,
      draftPosts: 0,
      totalCategories: 0,
      totalTags: 0,
    }
  }

  try {
    const [postsResult, categoriesResult, tagsResult] = await Promise.all([
      db.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published FROM blog_posts').first(),
      db.prepare('SELECT COUNT(*) as total FROM categories').first(),
      db.prepare('SELECT COUNT(*) as total FROM tags').first(),
    ])

    return {
      totalPosts: (postsResult as any)?.total || 0,
      publishedPosts: (postsResult as any)?.published || 0,
      draftPosts: ((postsResult as any)?.total || 0) - ((postsResult as any)?.published || 0),
      totalCategories: (categoriesResult as any)?.total || 0,
      totalTags: (tagsResult as any)?.total || 0,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalCategories: 0,
      totalTags: 0,
    }
  }
}

// 栏目管理
export async function getCategories(): Promise<Category[]> {
  const db = getDB()
  
  if (!db) {
    return []
  }

  try {
    const result = await db.prepare(
      'SELECT id, name, slug, description, sort_order FROM categories ORDER BY sort_order, name'
    ).all<Category>()

    return result.success && result.results ? result.results : []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<Category> {
  const db = getDB()
  
  if (!db) {
    throw new Error('数据库不可用')
  }

  await db.prepare(
    'INSERT INTO categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)'
  ).bind(data.name, data.slug, data.description || null, data.sort_order).run()

  const result = await db.prepare(
    'SELECT * FROM categories WHERE slug = ?'
  ).bind(data.slug).first<Category>()

  if (!result) {
    throw new Error('创建栏目失败')
  }

  return result
}

export async function updateCategory(id: number, data: Partial<Omit<Category, 'id'>>): Promise<Category> {
  const db = getDB()
  
  if (!db) {
    throw new Error('数据库不可用')
  }

  const updates: string[] = []
  const values: any[] = []

  if (data.name !== undefined) {
    updates.push('name = ?')
    values.push(data.name)
  }
  if (data.slug !== undefined) {
    updates.push('slug = ?')
    values.push(data.slug)
  }
  if (data.description !== undefined) {
    updates.push('description = ?')
    values.push(data.description)
  }
  if (data.sort_order !== undefined) {
    updates.push('sort_order = ?')
    values.push(data.sort_order)
  }

  values.push(id)

  await db.prepare(
    `UPDATE categories SET ${updates.join(', ')}, updated_at = unixepoch() WHERE id = ?`
  ).bind(...values).run()

  const result = await db.prepare(
    'SELECT * FROM categories WHERE id = ?'
  ).bind(id).first<Category>()

  if (!result) {
    throw new Error('更新栏目失败')
  }

  return result
}

export async function deleteCategory(id: number): Promise<void> {
  const db = getDB()
  
  if (!db) {
    throw new Error('数据库不可用')
  }

  await db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run()
}

// 标签管理
export async function getTags(): Promise<Tag[]> {
  const db = getDB()
  
  if (!db) {
    return []
  }

  try {
    const result = await db.prepare(
      'SELECT id, name, slug, description FROM tags ORDER BY name'
    ).all<Tag>()

    return result.success && result.results ? result.results : []
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export async function createTag(data: Omit<Tag, 'id'>): Promise<Tag> {
  const db = getDB()
  
  if (!db) {
    throw new Error('数据库不可用')
  }

  await db.prepare(
    'INSERT INTO tags (name, slug, description) VALUES (?, ?, ?)'
  ).bind(data.name, data.slug, data.description || null).run()

  const result = await db.prepare(
    'SELECT * FROM tags WHERE slug = ?'
  ).bind(data.slug).first<Tag>()

  if (!result) {
    throw new Error('创建标签失败')
  }

  return result
}

export async function updateTag(id: number, data: Partial<Omit<Tag, 'id'>>): Promise<Tag> {
  const db = getDB()
  
  if (!db) {
    throw new Error('数据库不可用')
  }

  const updates: string[] = []
  const values: any[] = []

  if (data.name !== undefined) {
    updates.push('name = ?')
    values.push(data.name)
  }
  if (data.slug !== undefined) {
    updates.push('slug = ?')
    values.push(data.slug)
  }
  if (data.description !== undefined) {
    updates.push('description = ?')
    values.push(data.description)
  }

  values.push(id)

  await db.prepare(
    `UPDATE tags SET ${updates.join(', ')}, updated_at = unixepoch() WHERE id = ?`
  ).bind(...values).run()

  const result = await db.prepare(
    'SELECT * FROM tags WHERE id = ?'
  ).bind(id).first<Tag>()

  if (!result) {
    throw new Error('更新标签失败')
  }

  return result
}

export async function deleteTag(id: number): Promise<void> {
  const db = getDB()
  
  if (!db) {
    throw new Error('数据库不可用')
  }

  await db.prepare('DELETE FROM tags WHERE id = ?').bind(id).run()
}

// 文章管理
export async function getPosts(): Promise<PostWithRelations[]> {
  const db = getDB()
  
  if (!db) {
    return []
  }

  try {
    const result = await db.prepare(
      `SELECT p.slug, p.title, p.subtitle, p.date, p.excerpt, p.content, p.markdown_content, 
              p.featured_image, p.view_count, p.category_id, p.published, p.created_at, p.updated_at,
              c.id as category_id, c.name as category_name, c.slug as category_slug
       FROM blog_posts p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    ).all<any>()

    if (!result.success || !result.results) {
      return []
    }

    // 获取每篇文章的标签
    const posts = await Promise.all(
      result.results.map(async (post: any) => {
        const tagsResult = await db.prepare(
          `SELECT t.id, t.name, t.slug, t.description
           FROM tags t
           INNER JOIN post_tags pt ON t.id = pt.tag_id
           WHERE pt.post_slug = ?`
        ).bind(post.slug).all<Tag>()

        return {
          ...post,
          category: post.category_id ? {
            id: post.category_id,
            name: post.category_name,
            slug: post.category_slug,
          } : undefined,
          tags: tagsResult.success && tagsResult.results ? tagsResult.results : [],
        }
      })
    )

    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getPost(slug: string): Promise<PostWithRelations | null> {
  const db = getDB()
  
  if (!db) {
    return null
  }

  try {
    const post = await db.prepare(
      `SELECT p.slug, p.title, p.subtitle, p.date, p.excerpt, p.content, p.markdown_content,
              p.featured_image, p.view_count, p.category_id, p.published,
              c.id as category_id, c.name as category_name, c.slug as category_slug
       FROM blog_posts p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ?`
    ).bind(slug).first<any>()

    if (!post) {
      return null
    }

    const tagsResult = await db.prepare(
      `SELECT t.id, t.name, t.slug, t.description
       FROM tags t
       INNER JOIN post_tags pt ON t.id = pt.tag_id
       WHERE pt.post_slug = ?`
    ).bind(slug).all<Tag>()

    return {
      ...post,
      category: post.category_id ? {
        id: post.category_id,
        name: post.category_name,
        slug: post.category_slug,
      } : undefined,
      tags: tagsResult.success && tagsResult.results ? tagsResult.results : [],
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function createPost(data: {
  slug: string
  title: string
  subtitle?: string
  date: string
  excerpt: string
  content: string
  markdown_content?: string
  featured_image?: string
  category_id?: number
  published: number
  tag_ids?: number[]
}): Promise<PostWithRelations> {
  const db = getDB()
  
  if (!db) {
    throw new Error('数据库不可用')
  }

  await db.prepare(
    `INSERT INTO blog_posts (slug, title, subtitle, date, excerpt, content, markdown_content, featured_image, category_id, published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    data.slug,
    data.title,
    data.subtitle || null,
    data.date,
    data.excerpt,
    data.content,
    data.markdown_content || null,
    data.featured_image || null,
    data.category_id || null,
    data.published
  ).run()

  // 添加标签关联
  if (data.tag_ids && data.tag_ids.length > 0) {
    for (const tagId of data.tag_ids) {
      await db.prepare(
        'INSERT INTO post_tags (post_slug, tag_id) VALUES (?, ?)'
      ).bind(data.slug, tagId).run()
    }
  }

  return await getPost(data.slug) as PostWithRelations
}

export async function updatePost(slug: string, data: Partial<Omit<PostWithRelations, 'slug' | 'tags'>> & { tag_ids?: number[] }): Promise<PostWithRelations> {
  const db = getDB()
  
  if (!db) {
    throw new Error('数据库不可用')
  }

  const updates: string[] = []
  const values: any[] = []

  if (data.title !== undefined) {
    updates.push('title = ?')
    values.push(data.title)
  }
  if (data.subtitle !== undefined) {
    updates.push('subtitle = ?')
    values.push(data.subtitle)
  }
  if (data.date !== undefined) {
    updates.push('date = ?')
    values.push(data.date)
  }
  if (data.excerpt !== undefined) {
    updates.push('excerpt = ?')
    values.push(data.excerpt)
  }
  if (data.content !== undefined) {
    updates.push('content = ?')
    values.push(data.content)
  }
  if (data.markdown_content !== undefined) {
    updates.push('markdown_content = ?')
    values.push(data.markdown_content)
  }
  if (data.featured_image !== undefined) {
    updates.push('featured_image = ?')
    values.push(data.featured_image)
  }
  if (data.category_id !== undefined) {
    updates.push('category_id = ?')
    values.push(data.category_id)
  }
  if (data.published !== undefined) {
    updates.push('published = ?')
    values.push(data.published)
  }

  values.push(slug)

  await db.prepare(
    `UPDATE blog_posts SET ${updates.join(', ')}, updated_at = unixepoch() WHERE slug = ?`
  ).bind(...values).run()

  // 更新标签关联
  if (data.tag_ids !== undefined) {
    // 删除旧标签
    await db.prepare('DELETE FROM post_tags WHERE post_slug = ?').bind(slug).run()
    // 添加新标签
    if (data.tag_ids.length > 0) {
      for (const tagId of data.tag_ids) {
        await db.prepare(
          'INSERT INTO post_tags (post_slug, tag_id) VALUES (?, ?)'
        ).bind(slug, tagId).run()
      }
    }
  }

  return await getPost(slug) as PostWithRelations
}

export async function deletePost(slug: string): Promise<void> {
  const db = getDB()
  
  if (!db) {
    throw new Error('数据库不可用')
  }

  await db.prepare('DELETE FROM blog_posts WHERE slug = ?').bind(slug).run()
}

