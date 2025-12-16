'use client';

import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';
import { useState } from 'react';

interface ChangePasswordDialogProps {
    open: boolean;
    onClose: () => void;
}

export function ChangePasswordDialog({
    open,
    onClose
}: ChangePasswordDialogProps) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setError('');
        setSuccess('');
        onClose();
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        // 验证
        if (
            !formData.currentPassword ||
            !formData.newPassword ||
            !formData.confirmPassword
        ) {
            setError('请填写所有字段');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('新密码长度至少为 6 位');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('两次输入的新密码不一致');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('新密码不能与当前密码相同');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            if (res.ok) {
                setSuccess('密码修改成功');
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } else {
                const data = await res.json();
                setError(data.error || '密码修改失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>修改密码</DialogTitle>
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
                <TextField
                    fullWidth
                    label="当前密码"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            currentPassword: e.target.value
                        });
                    }}
                    margin="normal"
                    required
                    autoFocus
                />
                <TextField
                    fullWidth
                    label="新密码"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            newPassword: e.target.value
                        });
                    }}
                    margin="normal"
                    required
                    helperText="密码长度至少为 6 位"
                />
                <TextField
                    fullWidth
                    label="确认新密码"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            confirmPassword: e.target.value
                        });
                    }}
                    margin="normal"
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? '修改中...' : '修改密码'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
