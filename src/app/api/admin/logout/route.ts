import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { deleteSession } from '@/lib/auth';

export const runtime = 'edge';

export async function POST() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;

    if (sessionId) {
        deleteSession(sessionId);
    }

    cookieStore.delete('admin_session');

    return NextResponse.json({ success: true });
}
