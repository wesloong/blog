import {
    Article as ArticleIcon,
    Category as CategoryIcon,
    Edit as EditIcon,
    Label as LabelIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Box, Grid, Paper, Typography } from '@mui/material';

import { getDashboardStats } from '@/lib/admin';

export const runtime = 'edge';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                    sx={{
                        bgcolor: `${color}.light`,
                        color: `${color}.main`,
                        borderRadius: 1,
                        p: 1.5,
                        mr: 2
                    }}
                >
                    {icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" component="div" fontWeight="bold">
                        {value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {title}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats();

    return (
        <Box>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="bold"
            >
                仪表板
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                站点数据概览
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="总文章数"
                        value={stats.totalPosts}
                        icon={<ArticleIcon />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="已发布"
                        value={stats.publishedPosts}
                        icon={<VisibilityIcon />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="草稿"
                        value={stats.draftPosts}
                        icon={<EditIcon />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="栏目数"
                        value={stats.totalCategories}
                        icon={<CategoryIcon />}
                        color="info"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="标签数"
                        value={stats.totalTags}
                        icon={<LabelIcon />}
                        color="secondary"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
