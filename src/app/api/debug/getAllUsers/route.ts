// app/api/debug/getAllUsers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest) {
    try {
        const { rows } = await sql`
            SELECT user_id, username, email
            FROM users
            ORDER BY user_id
    `;
        return NextResponse.json(rows, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store'
            }
        });
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}
