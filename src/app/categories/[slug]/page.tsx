import { Container, Typography, Box, Card, CardContent, Grid, Chip } from '@mui/material'
import Link from 'next/link'
import { getDB } from '@/lib/cloudflare'
import { notFound } from 'next/navigation'
import { Visibility } from '@mui/icons-material'

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  sort_order: number
}

interface BlogPost {
  slug: string
  title: string
  subtitle?: string
  date: string
  excerpt: string
  featured_image?: string
  view_count?: number
}

async function getCategory(slug: string): Promise<Category | null> {
  const db = getDB()
  
  if (!db) {
    return null
  }

  try {
    const result = await db.prepare(
      'SELECT id, name, slug, description, sort_order FROM categories WHERE slug = ?'
    ).bind(slug).first<Category>()

    return result || null
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

async function getCategoryPosts(categoryId: number): Promise<BlogPost[]> {
  const db = getDB()
  
  if (!db) {
    return []
  }

  try {
    const result = await db.prepare(
      `SELECT slug, title, subtitle, date, excerpt, featured_image, view_count 
       FROM blog_posts 
       WHERE category_id = ? AND published = 1 
       ORDER BY date DESC`
    ).bind(categoryId).all<BlogPost>()

    return result.success && result.results ? result.results : []
  } catch (error) {
    console.error('Error fetching category posts:', error)
    return []
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const category = await getCategory(params.slug)

  if (!category) {
    notFound()
  }

  const posts = await getCategoryPosts(category.id)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          {category.name}
        </Typography>
        {category.description && (
          <Typography variant="body1" color="text.secondary">
            {category.description}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          共 {posts.length} 篇文章
        </Typography>
      </Box>

      {posts.length > 0 ? (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.slug}>
              <Card
                component={Link}
                href={`/blog/${post.slug}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                  overflow: 'hidden',
                }}
              >
                {post.featured_image && (
                  <Box
                    component="img"
                    src={post.featured_image}
                    alt={post.title}
                    sx={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                    {post.title}
                  </Typography>
                  {post.subtitle && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, fontStyle: 'italic' }}
                    >
                      {post.subtitle}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    {post.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary">
                      {post.date}
                    </Typography>
                    {post.view_count !== undefined && (
                      <Chip
                        icon={<Visibility sx={{ fontSize: 16 }} />}
                        label={post.view_count}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            该分类下暂无文章
          </Typography>
        </Box>
      )}
    </Container>
  )
}

