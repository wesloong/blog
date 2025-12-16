'use client'

import { useState, useEffect } from 'react'
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'

interface Tag {
  id: number
  name: string
  slug: string
  description?: string
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Tag | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    fetchTags()
  }, [])

  const handleOpen = (tag?: Tag) => {
    if (tag) {
      setEditing(tag)
      setFormData({
        name: tag.name,
        slug: tag.slug,
        description: tag.description || '',
      })
    } else {
      setEditing(null)
      setFormData({ name: '', slug: '', description: '' })
    }
    setOpen(true)
    setError('')
  }

  const handleClose = () => {
    setOpen(false)
    setEditing(null)
    setFormData({ name: '', slug: '', description: '' })
    setError('')
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      const url = editing
        ? `/api/admin/tags/${editing.id}`
        : '/api/admin/tags'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        handleClose()
        fetchTags()
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

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个标签吗？')) return

    try {
      const res = await fetch(`/api/admin/tags/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchTags()
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
          标签管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          新建标签
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>名称</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>描述</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>{tag.name}</TableCell>
                <TableCell>{tag.slug}</TableCell>
                <TableCell>{tag.description || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(tag)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(tag.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editing ? '编辑标签' : '新建标签'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="名称"
            value={formData.name}
            onChange={(e) => {
              setFormData({
                ...formData,
                name: e.target.value,
                slug: formData.slug || e.target.value.toLowerCase().replace(/\s+/g, '-'),
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
          />
          <TextField
            fullWidth
            label="描述"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={3}
          />
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

