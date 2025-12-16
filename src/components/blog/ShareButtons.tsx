'use client';

import { Facebook, Link as LinkIcon, Twitter } from '@mui/icons-material';
import { Alert, Box, IconButton, Snackbar, Typography } from '@mui/material';
import { useState } from 'react';

interface ShareButtonsProps {
    url: string;
    title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const getFullUrl = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}${url}`;
        }
        return url;
    };

    const handleShare = (platform: string) => {
        const fullUrl = getFullUrl();
        let shareUrl = '';
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(fullUrl);
                setOpenSnackbar(true);
                return;
        }
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                分享：
            </Typography>
            <IconButton
                size="small"
                onClick={() => {
                    handleShare('facebook');
                }}
                sx={{ color: '#1877F2' }}
                aria-label="分享到 Facebook"
            >
                <Facebook />
            </IconButton>
            <IconButton
                size="small"
                onClick={() => {
                    handleShare('twitter');
                }}
                sx={{ color: '#1DA1F2' }}
                aria-label="分享到 Twitter"
            >
                <Twitter />
            </IconButton>
            <IconButton
                size="small"
                onClick={() => {
                    handleShare('copy');
                }}
                aria-label="复制链接"
            >
                <LinkIcon />
            </IconButton>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => {
                    setOpenSnackbar(false);
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => {
                        setOpenSnackbar(false);
                    }}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    链接已复制到剪贴板
                </Alert>
            </Snackbar>
        </Box>
    );
}
