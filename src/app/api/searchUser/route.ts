import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
    const { username } = await req.json();

    try {
        const result = await sql`
            SELECT * FROM users WHERE username = ${username};
        `;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        return NextResponse.json({ user: result.rows[0] }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при поиске пользователя: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}