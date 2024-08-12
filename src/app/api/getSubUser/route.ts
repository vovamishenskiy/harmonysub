import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId не получен' }, { status: 400 });
    }

    try {
        const userResult = await sql`
            SELECT user_sub_id FROM users WHERE user_id = ${userId};
        `;

        if (userResult.rows.length === 0 || !userResult.rows[0].user_sub_id) {
            return NextResponse.json({ error: 'Приглашённый пользователь не найден' }, { status: 404 });
        }

        const invitedUserId = userResult.rows[0].user_sub_id;

        const invitedUserResult = await sql`
            SELECT username, avatar_url FROM users WHERE user_id = ${invitedUserId};
        `;

        const invitedUser = invitedUserResult.rows[0];

        return NextResponse.json({ username: invitedUser.username, avatar_url: invitedUser.avatar_url }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении данных приглашённого пользователя: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}