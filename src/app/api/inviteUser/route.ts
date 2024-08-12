import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
    const { username, userId } = await req.json();

    try {
        const userResult = await sql`
            SELECT * FROM users WHERE username = ${username};
        `;

        if (userResult.rows.length === 0) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        const userIdRecipient = userResult.rows[0].user_id;

        await sql`
            INSERT INTO invitations (sender_id, recipient_id, status)
            VALUES (${userId}, ${userIdRecipient}, 'pending');
        `;

        return NextResponse.json({ message: 'Приглашение отправлено' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при отправке приглашения: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}