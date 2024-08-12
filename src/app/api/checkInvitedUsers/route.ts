import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let status = false;

    if (!userId) {
        return NextResponse.json({ error: 'Отсутствует userId' }, { status: 400 });
    };

    try {
        const result = await sql`
            SELECT user_sub_id FROM users WHERE user_id = ${userId} LIMIT 1;
        `;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Приглашённых пользователей не найдено' }, { status: 404 });
        }

        const userSubId = result.rows[0].user_sub_id;

        if(userSubId !== null) status = true;

        return NextResponse.json({ status }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении приглашённых пользователей: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}