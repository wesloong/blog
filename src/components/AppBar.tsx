'use client'

import { AppBar as MuiAppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import Link from 'next/link'
import { OwlLogo } from './OwlLogo'

export function AppBar() {
  return (
    <MuiAppBar position="static" sx={{ backgroundColor: '#1E293B' }}>
      <Toolbar>
        <Box
          component={Link}
          href="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <OwlLogo width={40} height={40} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
            }}
          >
            Wesloong Blog
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} href="/">
            首页
          </Button>
          <Button color="inherit" component={Link} href="/categories">
            分类
          </Button>
          <Button color="inherit" component={Link} href="/about">
            关于
          </Button>
        </Box>
      </Toolbar>
    </MuiAppBar>
  )
}

