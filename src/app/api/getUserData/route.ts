import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) return NextResponse.json({ error: 'Имя пользователя не указано' }, { status: 400 });

    try {
        const user = await sql`
            SELECT email, country FROM users WHERE username = ${username}
        `;

        if (user.rows.length === 0) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        const { email, country } = user.rows[0];
        return NextResponse.json({ email, country });
    } catch (error) {
        console.error('Ошибка при получении данных пользователя: ', error);
        return NextResponse.json({ error: 'Ошибка при получении данных пользователя' }, { status: 500 });
    }
}