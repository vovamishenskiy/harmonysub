import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Отсутствует userId' }, { status: 400 });
    };

    try {
        const result = await sql`
            SELECT i.invite_id, i.sender_id, u.username as recipientusername
            FROM invitations i JOIN users u ON i.recipient_id = u.user_id WHERE i.sender_id = ${userId};
        `;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Приглашённых пользователей не найдено' }, { status: 404 });
        }

        return NextResponse.json({ invited_user: result.rows }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении приглашённых пользователей: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}