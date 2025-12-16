'use client';

import { Visibility } from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Grid,
    Typography
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { type BlogPost } from '@/lib/blog';

// Banner组件
function AnimatedBanner() {
    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: { xs: 12, md: 16 },
                mb: 6,
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                mt: 0,
                pt: 0
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            color: 'white',
                            mb: 2,
                            fontSize: { xs: '2.5rem', md: '4rem' },
                            animation: 'bounceIn 1s ease-out'
                        }}
                    >
                        欢迎来到我的博客
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: { xs: '1.2rem', md: '1.5rem' },
                            animation: 'bounceIn 1s ease-out 0.3s both'
                        }}
                    >
                        分享技术、生活与思考
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

// 文章卡片组件，带滚动动画
function PostCard({ post }: { post: BlogPost }) {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Box ref={cardRef}>
                <Card
                    component={Link}
                    href={`/blog/${post.slug}`}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        transition:
                            'transform 0.3s, box-shadow 0.3s, opacity 0.6s ease-out',
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                            ? 'translateY(0)'
                            : 'translateY(30px)',
                        '&:hover': {
                            transform: isVisible
                                ? 'translateY(-8px)'
                                : 'translateY(30px)',
                            boxShadow: 8
                        },
                        overflow: 'hidden'
                    }}
                >
                    {post.featured_image && (
                        <CardMedia
                            component="img"
                            height="200"
                            image={post.featured_image}
                            alt={post.title}
                            sx={{
                                objectFit: 'cover',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                }
                            }}
                        />
                    )}
                    <CardContent
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="h2"
                            gutterBottom
                            fontWeight="bold"
                        >
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
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 'auto'
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {post.date}
                            </Typography>
                            <Chip
                                icon={<Visibility sx={{ fontSize: 16 }} />}
                                label={post.view_count ?? 0}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Grid>
    );
}

export default function Home() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch('/api/blog/posts');
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (err) {
                console.error('Failed to fetch posts:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    return (
        <>
            <AnimatedBanner />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {loading ? (
                    <Typography>加载中...</Typography>
                ) : (
                    <Grid container spacing={4}>
                        {posts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </Grid>
                )}
            </Container>
        </>
    );
}
