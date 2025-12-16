import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 如果是登录页面，设置 header 标识，然后直接通过
    if (pathname === '/admin/login') {
        const response = NextResponse.next();
        response.headers.set('x-admin-path', 'login');
        return response;
    }

    // 如果是其他 admin 路由，检查 session
    if (pathname.startsWith('/admin')) {
        const session = request.cookies.get('admin_session');

        // 如果没有 session，重定向到登录页
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // 设置 header 标识这是需要认证的页面
        const response = NextResponse.next();
        response.headers.set('x-admin-path', 'protected');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*'
};
