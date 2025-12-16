import { getDB } from './cloudflare';

export interface Tag {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    sort_order: number;
}

export interface BlogPost {
    slug: string;
    title: string;
    subtitle?: string;
    date: string;
    excerpt: string;
    content: string;
    featured_image?: string;
    view_count?: number;
    like_count?: number;
    author?: string;
    category?: Category;
    tags?: Tag[];
}

// 本地开发时的示例数据（当 D2 不可用时）
const fallbackPosts: BlogPost[] = [
    {
        slug: 'welcome-to-my-blog',
        title: '欢迎来到我的博客',
        subtitle: '一个记录技术与思考的地方',
        date: '2024-01-01',
        excerpt: '这是我的第一篇博客文章，介绍这个博客的创建初衷和未来计划。',
        featured_image:
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
        view_count: 128,
        content: `
      <h2>欢迎</h2>
      <p>欢迎来到我的个人博客！这个博客是我用来分享技术、生活和思考的地方。</p>
      
      <h2>关于我</h2>
      <p>我是一名开发者，热爱编程和技术探索。在这里，我会分享：</p>
      <ul>
        <li>技术文章和教程</li>
        <li>项目经验分享</li>
        <li>生活感悟</li>
        <li>读书笔记</li>
      </ul>
      
      <h2>未来计划</h2>
      <p>我会定期更新博客内容，希望能与大家分享更多有价值的内容。如果你有任何建议或想法，欢迎与我联系！</p>
    `
    },
    {
        slug: 'nextjs-mui-setup',
        title: '使用 Next.js 和 MUI 搭建博客',
        subtitle: '从零开始构建现代化博客系统',
        date: '2024-01-02',
        excerpt:
            '介绍如何使用 Next.js 14 和 Material-UI 5 搭建一个现代化的博客系统。',
        featured_image:
            'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
        view_count: 256,
        content: `
      <h2>技术选型</h2>
      <p>这个博客使用了以下技术栈：</p>
      <ul>
        <li><strong>Next.js 14</strong> - React 框架，支持 App Router</li>
        <li><strong>Material-UI 5</strong> - 现代化的 UI 组件库</li>
        <li><strong>TypeScript</strong> - 类型安全的 JavaScript</li>
      </ul>
      
      <h2>项目结构</h2>
      <p>项目采用了 Next.js 的 App Router 结构，主要目录包括：</p>
      <ul>
        <li><code>src/app</code> - 页面和路由</li>
        <li><code>src/components</code> - 可复用组件</li>
        <li><code>src/lib</code> - 工具函数和数据</li>
      </ul>
      
      <h2>主题配置</h2>
      <p>使用 MUI 的 ThemeProvider 来统一管理主题样式，可以轻松切换明暗主题。</p>
    `
    },
    {
        slug: 'typescript-tips',
        title: 'TypeScript 实用技巧',
        subtitle: '提升开发效率的类型系统实践',
        date: '2024-01-03',
        excerpt: '分享一些在日常开发中非常有用的 TypeScript 技巧和最佳实践。',
        featured_image:
            'https://images.unsplash.com/photo-1516116216624-53e6977beab8?w=800&h=400&fit=crop',
        view_count: 89,
        content: `
      <h2>类型推断</h2>
      <p>TypeScript 的类型推断非常强大，可以自动推断变量类型，减少不必要的类型注解。</p>
      
      <h2>泛型的使用</h2>
      <p>泛型让我们可以创建可重用的组件和函数，同时保持类型安全。</p>
      
      <h2>工具类型</h2>
      <p>TypeScript 提供了许多内置的工具类型，如 <code>Partial</code>、<code>Pick</code>、<code>Omit</code> 等，可以大大简化类型定义。</p>
    `
    }
];

export async function getBlogPosts(): Promise<BlogPost[]> {
    const db = getDB();

    if (!db) {
        // 开发环境，返回示例数据
        return Promise.resolve(fallbackPosts);
    }

    try {
        // 从 D1 数据库查询所有文章，按日期降序排列
        const result = await db
            .prepare(
                `SELECT p.slug, p.title, p.subtitle, p.date, p.excerpt, p.content, p.featured_image, 
              COALESCE(p.view_count, 0) as view_count, COALESCE(p.like_count, 0) as like_count, p.category_id,
              c.id as category_id, c.name as category_name, c.slug as category_slug, c.sort_order as category_sort_order
       FROM blog_posts p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.published = 1 
       ORDER BY p.date DESC`
            )
            .all<any>();

        if (!result.success || !result.results) {
            return fallbackPosts;
        }

        // 获取每篇文章的标签
        const posts = await Promise.all(
            result.results.map(async (post: any) => {
                const tagsResult = await db
                    .prepare(
                        `SELECT t.id, t.name, t.slug, t.description
           FROM tags t
           INNER JOIN post_tags pt ON t.id = pt.tag_id
           WHERE pt.post_slug = ?`
                    )
                    .bind(post.slug)
                    .all<Tag>();

                return {
                    slug: post.slug,
                    title: post.title,
                    subtitle: post.subtitle,
                    date: post.date,
                    excerpt: post.excerpt,
                    content: post.content,
                    featured_image: post.featured_image,
                    view_count: post.view_count || 0,
                    like_count: post.like_count || 0,
                    category: post.category_id
                        ? {
                              id: post.category_id,
                              name: post.category_name,
                              slug: post.category_slug,
                              sort_order: post.category_sort_order || 0
                          }
                        : undefined,
                    tags:
                        tagsResult.success && tagsResult.results
                            ? tagsResult.results
                            : []
                };
            })
        );

        return posts;
    } catch (error) {
        console.error('Error fetching blog posts from D1:', error);
        return fallbackPosts;
    }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
    const db = getDB();

    if (!db) {
        // 开发环境，从示例数据中查找
        return Promise.resolve(
            fallbackPosts.find((post) => post.slug === slug) || null
        );
    }

    try {
        // 从 D1 数据库查询单篇文章
        const result = await db
            .prepare(
                `SELECT p.slug, p.title, p.subtitle, p.date, p.excerpt, p.content, p.featured_image, 
              COALESCE(p.view_count, 0) as view_count, COALESCE(p.like_count, 0) as like_count, p.category_id,
              c.id as category_id, c.name as category_name, c.slug as category_slug, c.sort_order as category_sort_order
       FROM blog_posts p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ? AND p.published = 1`
            )
            .bind(slug)
            .first<any>();

        if (!result) {
            return null;
        }

        // 获取标签
        const tagsResult = await db
            .prepare(
                `SELECT t.id, t.name, t.slug, t.description
       FROM tags t
       INNER JOIN post_tags pt ON t.id = pt.tag_id
       WHERE pt.post_slug = ?`
            )
            .bind(slug)
            .all<Tag>();

        return {
            slug: result.slug,
            title: result.title,
            subtitle: result.subtitle,
            date: result.date,
            excerpt: result.excerpt,
            content: result.content,
            featured_image: result.featured_image,
            view_count: result.view_count || 0,
            like_count: result.like_count || 0,
            category: result.category_id
                ? {
                      id: result.category_id,
                      name: result.category_name,
                      slug: result.category_slug,
                      sort_order: result.category_sort_order || 0
                  }
                : undefined,
            tags:
                tagsResult.success && tagsResult.results
                    ? tagsResult.results
                    : []
        };
    } catch (error) {
        console.error('Error fetching blog post from D1:', error);
        return fallbackPosts.find((post) => post.slug === slug) || null;
    }
}

// 相邻文章的简化类型（只包含 slug 和 title）
export interface AdjacentPost {
    slug: string;
    title: string;
}

// 获取相邻文章（上一篇和下一篇）
export async function getAdjacentPosts(
    slug: string
): Promise<{ prev: AdjacentPost | null; next: AdjacentPost | null }> {
    const db = getDB();

    if (!db) {
        return { prev: null, next: null };
    }

    try {
        const currentPost = await db
            .prepare(
                'SELECT date FROM blog_posts WHERE slug = ? AND published = 1'
            )
            .bind(slug)
            .first<{ date: string }>();

        if (!currentPost) {
            return { prev: null, next: null };
        }

        // 获取上一篇文章（日期更早）
        const prevResult = await db
            .prepare(
                `SELECT slug, title FROM blog_posts 
       WHERE published = 1 AND date < ? 
       ORDER BY date DESC LIMIT 1`
            )
            .bind(currentPost.date)
            .first<{ slug: string; title: string }>();

        // 获取下一篇文章（日期更晚）
        const nextResult = await db
            .prepare(
                `SELECT slug, title FROM blog_posts 
       WHERE published = 1 AND date > ? 
       ORDER BY date ASC LIMIT 1`
            )
            .bind(currentPost.date)
            .first<{ slug: string; title: string }>();

        return {
            prev: prevResult
                ? {
                      slug: prevResult.slug,
                      title: prevResult.title
                  }
                : null,
            next: nextResult
                ? {
                      slug: nextResult.slug,
                      title: nextResult.title
                  }
                : null
        };
    } catch (error) {
        console.error('Error fetching adjacent posts:', error);
        return { prev: null, next: null };
    }
}

// 获取相关文章（基于标签或分类）
export async function getRelatedPosts(
    slug: string,
    limit: number = 3
): Promise<BlogPost[]> {
    const db = getDB();

    if (!db) {
        return [];
    }

    try {
        // 获取当前文章的标签和分类
        const currentPost = await db
            .prepare(
                `SELECT p.category_id, GROUP_CONCAT(pt.tag_id) as tag_ids
       FROM blog_posts p
       LEFT JOIN post_tags pt ON p.slug = pt.post_slug
       WHERE p.slug = ? AND p.published = 1
       GROUP BY p.slug, p.category_id`
            )
            .bind(slug)
            .first<{ category_id?: number; tag_ids?: string }>();

        if (!currentPost) {
            return [];
        }

        // 构建查询：优先匹配相同分类和标签的文章
        let query = `
      SELECT DISTINCT p.slug, p.title, p.subtitle, p.date, p.excerpt, p.featured_image, p.view_count
      FROM blog_posts p
      WHERE p.slug != ? AND p.published = 1
    `;

        const params: any[] = [slug];

        if (currentPost.category_id) {
            query += ' AND p.category_id = ?';
            params.push(currentPost.category_id);
        }

        if (currentPost.tag_ids) {
            const tagIds = currentPost.tag_ids.split(',');
            query += ` AND EXISTS (
        SELECT 1 FROM post_tags pt 
        WHERE pt.post_slug = p.slug 
        AND pt.tag_id IN (${tagIds.map(() => '?').join(',')})
      )`;
            params.push(...tagIds);
        }

        query += ' ORDER BY p.date DESC LIMIT ?';
        params.push(limit);

        const result = await db
            .prepare(query)
            .bind(...params)
            .all<BlogPost>();

        return result.success && result.results ? result.results : [];
    } catch (error) {
        console.error('Error fetching related posts:', error);
        return [];
    }
}

// 增加文章访问人数
export async function incrementViewCount(slug: string): Promise<void> {
    const db = getDB();

    if (!db) {
        return;
    }

    try {
        await db
            .prepare(
                'UPDATE blog_posts SET view_count = COALESCE(view_count, 0) + 1 WHERE slug = ?'
            )
            .bind(slug)
            .run();
    } catch (error) {
        console.error('Error incrementing view count:', error);
    }
}
