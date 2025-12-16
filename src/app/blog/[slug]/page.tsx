import { Container, Typography, Box, Breadcrumbs, Link as MuiLink, Chip, Grid, Divider, Card, CardContent, Button } from '@mui/material'
import Link from 'next/link'
import { getBlogPost, getBlogPosts, getAdjacentPosts, getRelatedPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import { ViewCounter } from './ViewCounter'
import { Visibility, ThumbUp, ArrowBack, ArrowForward } from '@mui/icons-material'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { ShareButtons } from '@/components/blog/ShareButtons'

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const [adjacentPosts, relatedPosts] = await Promise.all([
    getAdjacentPosts(params.slug),
    getRelatedPosts(params.slug, 3),
  ])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} href="/" color="inherit">
          首页
        </MuiLink>
        <MuiLink component={Link} href="/blog" color="inherit">
          博客
        </MuiLink>
        {post.category && (
          <MuiLink component={Link} href={`/categories/${post.category.slug}`} color="inherit">
            {post.category.name}
          </MuiLink>
        )}
        <Typography color="text.primary">{post.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* 主内容区域 */}
        <Grid item xs={12} md={9}>
          {post.featured_image && (
            <Box
              component="img"
              src={post.featured_image}
              alt={post.title}
              sx={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: 2,
                mb: 4,
              }}
            />
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              {post.title}
            </Typography>
            {post.subtitle && (
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                {post.subtitle}
              </Typography>
            )}
            
            {/* 文章元信息 */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {post.date}
              </Typography>
              {post.author && (
                <Typography variant="body2" color="text.secondary">
                  作者：{post.author}
                </Typography>
              )}
              {post.view_count !== undefined && (
                <Chip
                  icon={<Visibility sx={{ fontSize: 16 }} />}
                  label={<ViewCounter slug={post.slug} initialCount={post.view_count} />}
                  size="small"
                  variant="outlined"
                />
              )}
              {post.like_count !== undefined && (
                <Chip
                  icon={<ThumbUp sx={{ fontSize: 16 }} />}
                  label={post.like_count}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {post.tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    size="small"
                    component={Link}
                    href={`/tags/${tag.slug}`}
                    clickable
                    sx={{ textDecoration: 'none' }}
                  />
                ))}
              </Box>
            )}

            {/* 分享按钮 */}
            <ShareButtons url={`/blog/${post.slug}`} title={post.title} />

            <Divider sx={{ mb: 4 }} />
          </Box>

          {/* 文章内容 */}
          <Box
            id="blog-content"
            sx={{
              '& p': {
                mb: 2,
                lineHeight: 1.8,
              },
              '& h2': {
                mt: 4,
                mb: 2,
                fontWeight: 'bold',
                scrollMarginTop: '100px',
              },
              '& h3': {
                mt: 3,
                mb: 1.5,
                fontWeight: 'bold',
                scrollMarginTop: '100px',
              },
              '& h4': {
                mt: 2,
                mb: 1,
                fontWeight: 'bold',
                scrollMarginTop: '100px',
              },
              '& ul, & ol': {
                mb: 2,
                pl: 3,
              },
              '& li': {
                mb: 1,
              },
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* 上一篇/下一篇文章 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 4 }}>
            {adjacentPosts.prev ? (
              <Button
                component={Link}
                href={`/blog/${adjacentPosts.prev.slug}`}
                startIcon={<ArrowBack />}
                variant="outlined"
                sx={{ flex: 1 }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    上一篇
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {adjacentPosts.prev.title}
                  </Typography>
                </Box>
              </Button>
            ) : (
              <Box sx={{ flex: 1 }} />
            )}
            {adjacentPosts.next ? (
              <Button
                component={Link}
                href={`/blog/${adjacentPosts.next.slug}`}
                endIcon={<ArrowForward />}
                variant="outlined"
                sx={{ flex: 1 }}
              >
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    下一篇
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {adjacentPosts.next.title}
                  </Typography>
                </Box>
              </Button>
            ) : (
              <Box sx={{ flex: 1 }} />
            )}
          </Box>

          {/* 相关文章 */}
          {relatedPosts.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                相关文章
              </Typography>
              <Grid container spacing={3}>
                {relatedPosts.map((relatedPost) => (
                  <Grid item xs={12} sm={6} md={4} key={relatedPost.slug}>
                    <Card
                      component={Link}
                      href={`/blog/${relatedPost.slug}`}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      {relatedPost.featured_image && (
                        <Box
                          component="img"
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          sx={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                          {relatedPost.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {relatedPost.date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {relatedPost.excerpt}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>

        {/* 侧边栏 - 目录 */}
        <Grid item xs={12} md={3}>
          <TableOfContents content={post.content} />
        </Grid>
      </Grid>
    </Container>
  )
}

