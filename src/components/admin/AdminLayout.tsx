'use client';

import {
    Article as ArticleIcon,
    Category as CategoryIcon,
    Dashboard as DashboardIcon,
    Label as LabelIcon,
    Lock as LockIcon,
    Logout as LogoutIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import {
    AppBar,
    Avatar,
    Box,
    Container,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ChangePasswordDialog } from './ChangePasswordDialog';
import { UserProfileDialog } from './UserProfileDialog';

const drawerWidth = 240;

const menuItems = [
    { text: '仪表板', icon: <DashboardIcon />, path: '/admin' },
    { text: '文章管理', icon: <ArticleIcon />, path: '/admin/posts' },
    { text: '栏目管理', icon: <CategoryIcon />, path: '/admin/categories' },
    { text: '标签管理', icon: <LabelIcon />, path: '/admin/tags' }
];

interface AdminInfo {
    username: string;
    email?: string;
    display_name?: string;
    avatar?: string;
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);

    useEffect(() => {
        fetchAdminInfo();
    }, []);

    const fetchAdminInfo = async () => {
        try {
            const res = await fetch('/api/admin/profile');
            if (res.ok) {
                const data = await res.json();
                setAdminInfo(data);
            }
        } catch (err) {
            console.error('Failed to fetch admin info:', err);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileOpen = () => {
        setProfileOpen(true);
        handleMenuClose();
    };

    const handlePasswordOpen = () => {
        setPasswordOpen(true);
        handleMenuClose();
    };

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
        handleMenuClose();
    };

    const getInitials = (name?: string) => {
        if (!name) return 'A';
        return name.charAt(0).toUpperCase();
    };

    const displayName =
        adminInfo?.display_name || adminInfo?.username || 'Admin';

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        管理后台
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            {displayName}
                        </Typography>
                        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                            <Avatar
                                src={adminInfo?.avatar}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: 'secondary.main'
                                }}
                            >
                                {adminInfo?.avatar
                                    ? null
                                    : getInitials(displayName)}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                        >
                            <MenuItem onClick={handleProfileOpen}>
                                <ListItemIcon>
                                    <PersonIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>修改资料</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handlePasswordOpen}>
                                <ListItemIcon>
                                    <LockIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>修改密码</ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>退出登录</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box'
                    }
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        router.push(item.path);
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` }
                }}
            >
                <Toolbar />
                <Container maxWidth="lg">{children}</Container>
            </Box>
            <UserProfileDialog
                open={profileOpen}
                onClose={() => {
                    setProfileOpen(false);
                }}
                adminInfo={adminInfo}
                onUpdate={fetchAdminInfo}
            />
            <ChangePasswordDialog
                open={passwordOpen}
                onClose={() => {
                    setPasswordOpen(false);
                }}
            />
        </Box>
    );
}
