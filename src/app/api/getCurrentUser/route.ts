// app/api/getCurrentUser/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { sql } from '@vercel/postgres';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = (payload as any).userId;
        const db = await sql`SELECT username, avatar_url FROM users WHERE user_id = ${userId} LIMIT 1`;
        const row = db.rows[0];
        if (!row) throw new Error('User not found');
        return NextResponse.json({
            user_id: userId,
            username: row.username,
            avatar_url: row.avatar_url,
        });
    } catch (e) {
        console.error('getCurrentUser error', e);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
