import { Container, Typography, Box, Paper } from '@mui/material'

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          关于我
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" paragraph>
            欢迎来到我的个人博客！
          </Typography>
          <Typography variant="body1" paragraph>
            我是一名热爱技术的开发者，喜欢探索新技术，分享学习心得。
          </Typography>
          <Typography variant="body1" paragraph>
            这个博客主要用于记录和分享：
          </Typography>
          <ul>
            <li>
              <Typography variant="body1" component="span">
                技术文章和教程
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                项目开发经验
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                生活感悟和思考
              </Typography>
            </li>
          </ul>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            如果你有任何问题或建议，欢迎与我联系！
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

