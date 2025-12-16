import { headers } from 'next/headers';

import { AdminLayout } from '@/components/admin/AdminLayout';

// 检查是否是登录页面，如果是，不渲染管理布局
export default async function AdminLayoutWrapper({
    children
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const adminPath = headersList.get('x-admin-path');

    // 如果是登录页面，直接返回，不渲染管理布局
    if (adminPath === 'login') {
        return <>{children}</>;
    }

    // 其他页面需要管理布局（middleware 已经确保认证）
    return <AdminLayout>{children}</AdminLayout>;
}
