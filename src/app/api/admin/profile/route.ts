import { type NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '@/lib/admin';
import { getDB } from '@/lib/cloudflare';

export const runtime = 'edge';

export async function GET() {
    try {
        const username = await requireAuth();
        const db = getDB();

        if (!db) {
            // 本地开发，返回默认信息
            return NextResponse.json({
                username,
                email: '',
                display_name: '',
                avatar: ''
            });
        }

        try {
            const admin = await db
                .prepare(
                    'SELECT username, email, display_name, avatar FROM admins WHERE username = ?'
                )
                .bind(username)
                .first<{
                    username: string;
                    email?: string;
                    display_name?: string;
                    avatar?: string;
                }>();

            if (admin) {
                return NextResponse.json(admin);
            }

            return NextResponse.json({
                username,
                email: '',
                display_name: '',
                avatar: ''
            });
        } catch (error) {
            console.error('Error fetching admin profile:', error);
            return NextResponse.json({
                username,
                email: '',
                display_name: '',
                avatar: ''
            });
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || '获取用户信息失败' },
            { status: 401 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const username = await requireAuth();
        const data = await request.json();
        const db = getDB();

        if (!db) {
            return NextResponse.json(
                { error: '数据库不可用' },
                { status: 500 }
            );
        }

        const updates: string[] = [];
        const values: any[] = [];

        if (data.email !== undefined) {
            updates.push('email = ?');
            values.push(data.email || null);
        }
        if (data.display_name !== undefined) {
            updates.push('display_name = ?');
            values.push(data.display_name || null);
        }
        if (data.avatar !== undefined) {
            updates.push('avatar = ?');
            values.push(data.avatar || null);
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { error: '没有要更新的字段' },
                { status: 400 }
            );
        }

        values.push(username);

        await db
            .prepare(
                `UPDATE admins SET ${updates.join(', ')}, updated_at = unixepoch() WHERE username = ?`
            )
            .bind(...values)
            .run();

        // 获取更新后的信息
        const admin = await db
            .prepare(
                'SELECT username, email, display_name, avatar FROM admins WHERE username = ?'
            )
            .bind(username)
            .first<{
                username: string;
                email?: string;
                display_name?: string;
                avatar?: string;
            }>();

        return NextResponse.json(admin);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || '更新用户信息失败' },
            { status: 400 }
        );
    }
}
