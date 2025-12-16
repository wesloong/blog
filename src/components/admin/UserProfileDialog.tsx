'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Avatar,
  Typography,
} from '@mui/material'
import { Person as PersonIcon } from '@mui/icons-material'

interface AdminInfo {
  username: string
  email?: string
  display_name?: string
  avatar?: string
}

interface UserProfileDialogProps {
  open: boolean
  onClose: () => void
  adminInfo: AdminInfo | null
  onUpdate: () => void
}

export function UserProfileDialog({
  open,
  onClose,
  adminInfo,
  onUpdate,
}: UserProfileDialogProps) {
  const [formData, setFormData] = useState({
    email: '',
    display_name: '',
    avatar: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (adminInfo) {
      setFormData({
        email: adminInfo.email || '',
        display_name: adminInfo.display_name || '',
        avatar: adminInfo.avatar || '',
      })
    }
  }, [adminInfo, open])

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSuccess('资料更新成功')
        onUpdate()
        setTimeout(() => {
          onClose()
          setSuccess('')
        }, 1500)
      } else {
        const data = await res.json()
        setError(data.error || '更新失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return 'A'
    return name.charAt(0).toUpperCase()
  }

  const displayName = formData.display_name || adminInfo?.username || 'Admin'

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>修改资料</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={formData.avatar}
            sx={{ width: 80, height: 80, mb: 2, bgcolor: 'secondary.main' }}
          >
            {formData.avatar ? null : getInitials(displayName)}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {adminInfo?.username}
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="显示名称"
          value={formData.display_name}
          onChange={(e) =>
            setFormData({ ...formData, display_name: e.target.value })
          }
          margin="normal"
          placeholder="留空则使用用户名"
        />
        <TextField
          fullWidth
          label="邮箱"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="头像 URL"
          value={formData.avatar}
          onChange={(e) =>
            setFormData({ ...formData, avatar: e.target.value })
          }
          margin="normal"
          placeholder="https://example.com/avatar.jpg"
          helperText="输入头像图片的 URL 地址"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? '保存中...' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

