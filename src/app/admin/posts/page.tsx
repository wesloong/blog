'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Autocomplete,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import { MarkdownEditor } from '@/components/admin/MarkdownEditor'
import { marked } from 'marked'

interface Category {
  id: number
  name: string
  slug: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

interface Post {
  slug: string
  title: string
  subtitle?: string
  date: string
  excerpt: string
  content: string
  markdown_content?: string
  featured_image?: string
  view_count?: number
  category_id?: number
  published: number
  category?: Category
  tags?: Tag[]
}

export default function PostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    subtitle: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    markdown_content: '',
    featured_image: '',
    category_id: '',
    published: 0,
    tag_ids: [] as number[],
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/admin/tags')
      if (res.ok) {
        const data = await res.json()
        setTags(data)
      }
    } catch (err) {
      console.error('Failed to fetch tags:', err)
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchCategories()
    fetchTags()
  }, [])

  const handleOpen = (post?: Post) => {
    if (post) {
      setEditing(post)
      setFormData({
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle || '',
        date: post.date,
        excerpt: post.excerpt,
        markdown_content: post.markdown_content || post.content,
        featured_image: post.featured_image || '',
        category_id: post.category_id?.toString() || '',
        published: post.published,
        tag_ids: post.tags?.map((t) => t.id) || [],
      })
    } else {
      setEditing(null)
      setFormData({
        slug: '',
        title: '',
        subtitle: '',
        date: new Date().toISOString().split('T')[0],
        excerpt: '',
        markdown_content: '',
        featured_image: '',
        category_id: '',
        published: 0,
        tag_ids: [],
      })
    }
    setOpen(true)
    setError('')
  }

  const handleClose = () => {
    setOpen(false)
    setEditing(null)
    setError('')
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      // 将 Markdown 转换为 HTML
      const htmlContent = marked(formData.markdown_content || '')

      const postData = {
        ...formData,
        content: htmlContent,
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
        tag_ids: formData.tag_ids,
      }

      const url = editing
        ? `/api/admin/posts/${editing.slug}`
        : '/api/admin/posts'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      if (res.ok) {
        handleClose()
        fetchPosts()
      } else {
        const data = await res.json()
        setError(data.error || '操作失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      const res = await fetch(`/api/admin/posts/${slug}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchPosts()
      } else {
        const data = await res.json()
        alert(data.error || '删除失败')
      }
    } catch (err) {
      alert('网络错误，请稍后重试')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          文章管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          新建文章
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>标题</TableCell>
              <TableCell>栏目</TableCell>
              <TableCell>标签</TableCell>
              <TableCell>日期</TableCell>
              <TableCell>状态</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.slug}>
                <TableCell>{post.title}</TableCell>
                <TableCell>
                  {post.category ? (
                    <Chip label={post.category.name} size="small" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {post.tags && post.tags.length > 0 ? (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {post.tags.map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell>
                  <Chip
                    label={post.published ? '已发布' : '草稿'}
                    color={post.published ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => router.push(`/blog/${post.slug}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(post)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(post.slug)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { height: '90vh' } }}
      >
        <DialogTitle>
          {editing ? '编辑文章' : '新建文章'}
        </DialogTitle>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="标题"
            value={formData.title}
            onChange={(e) => {
              setFormData({
                ...formData,
                title: e.target.value,
                slug:
                  formData.slug ||
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, ''),
              })
            }}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData({ ...formData, slug: e.target.value })
            }
            margin="normal"
            required
            helperText="URL 友好的标识符，只能包含字母、数字和连字符"
          />
          <TextField
            fullWidth
            label="副标题"
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
            margin="normal"
            placeholder="可选：文章的副标题"
          />
          <TextField
            fullWidth
            label="展示图 URL"
            value={formData.featured_image}
            onChange={(e) =>
              setFormData({ ...formData, featured_image: e.target.value })
            }
            margin="normal"
            placeholder="https://example.com/image.jpg"
            helperText="输入文章展示图的 URL 地址"
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="发布日期"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <FormControl margin="normal" sx={{ minWidth: 200 }}>
              <InputLabel>栏目</InputLabel>
              <Select
                value={formData.category_id}
                label="栏目"
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
              >
                <MenuItem value="">无</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.published === 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      published: e.target.checked ? 1 : 0,
                    })
                  }
                />
              }
              label="发布"
              sx={{ mt: 2 }}
            />
          </Box>
          <Autocomplete
            multiple
            options={tags}
            getOptionLabel={(option) => option.name}
            value={tags.filter((t) => formData.tag_ids.includes(t.id))}
            onChange={(e, newValue) =>
              setFormData({
                ...formData,
                tag_ids: newValue.map((t) => t.id),
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="标签"
                margin="normal"
                placeholder="选择标签"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.name}
                />
              ))
            }
          />
          <TextField
            fullWidth
            label="摘要"
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            margin="normal"
            multiline
            rows={2}
            required
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Markdown 内容
            </Typography>
            <MarkdownEditor
              value={formData.markdown_content}
              onChange={(value) =>
                setFormData({ ...formData, markdown_content: value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? '保存中...' : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

