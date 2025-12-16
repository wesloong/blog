import { Container, Typography, Box, Card, CardContent, Grid, Chip } from '@mui/material'
import Link from 'next/link'
import { getDB } from '@/lib/cloudflare'

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  sort_order: number
}

async function getCategories(): Promise<Category[]> {
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

async function getCategoryPostsCount(categoryId: number): Promise<number> {
  const db = getDB()
  
  if (!db) {
    return 0
  }

  try {
    const result = await db.prepare(
      'SELECT COUNT(*) as count FROM blog_posts WHERE category_id = ? AND published = 1'
    ).bind(categoryId).first<{ count: number }>()

    return result?.count || 0
  } catch (error) {
    console.error('Error fetching category posts count:', error)
    return 0
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      postCount: await getCategoryPostsCount(category.id),
    }))
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          分类
        </Typography>
        <Typography variant="body1" color="text.secondary">
          浏览所有文章分类
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {categoriesWithCount.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card
              component={Link}
              href={`/categories/${category.slug}`}
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
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="h2" fontWeight="bold">
                    {category.name}
                  </Typography>
                  <Chip label={`${category.postCount} 篇`} size="small" color="primary" />
                </Box>
                {category.description && (
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {categoriesWithCount.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            暂无分类
          </Typography>
        </Box>
      )}
    </Container>
  )
}

