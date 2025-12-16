'use client';

import CssBaseline from '@mui/material/CssBaseline';
import {
    createTheme,
    ThemeProvider as MuiThemeProvider
} from '@mui/material/styles';
import { type ReactNode } from 'react';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2'
        },
        secondary: {
            main: '#dc004e'
        }
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
        ].join(',')
    }
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
}
