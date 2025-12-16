import { Container, Typography, Box, Button } from '@mui/material'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        页面未找到
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        抱歉，您访问的页面不存在。
      </Typography>
      <Button variant="contained" component={Link} href="/">
        返回首页
      </Button>
    </Container>
  )
}

