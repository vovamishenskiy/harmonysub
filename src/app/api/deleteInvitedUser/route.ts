import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: 'Отсутствует userId' }, { status: 400 });
    };

    try {
        const invitationResult = await sql`
            SELECT * FROM invitations WHERE sender_id = ${userId} AND status = 'accepted';
        `;

        if (invitationResult.rows.length === 0) {
            return NextResponse.json({ error: 'Приглашение не найдено' }, { status: 404 });
        }

        const userSubIdResult = await sql`
            SELECT user_sub_id FROM users where user_id = ${userId} LIMIT 1;
        `;
        const userSubId = userSubIdResult.rows[0]?.user_sub_id;

        await sql`
            DELETE FROM invitations WHERE sender_id = ${userId};
        `;

        await sql`
            DELETE FROM shared_subscriptions WHERE user_id = ${userSubId};
        `;

        await sql`
            UPDATE users SET user_sub_id = null WHERE user_id = ${userId};
        `;

        return NextResponse.json({ message: 'Приглашение удалено' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при удалении приглашения: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}