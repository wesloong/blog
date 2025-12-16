'use client';

import { Box, type SxProps, type Theme } from '@mui/material';
import Image from 'next/image';

interface OwlLogoProps {
    width?: number;
    height?: number;
    sx?: SxProps<Theme>;
}

export function OwlLogo({ width = 200, height = 200, sx }: OwlLogoProps) {
    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...sx
            }}
        >
            <Image
                src="/logo.svg"
                alt="Wesloong Blog Logo"
                width={width}
                height={height}
                priority
                style={{
                    maxWidth: '100%',
                    height: 'auto'
                }}
            />
        </Box>
    );
}
