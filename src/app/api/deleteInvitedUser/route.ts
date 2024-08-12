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

        const subUserResult = await sql`
            SELECT user_sub_id FROM users WHERE user_id = ${userId} LIMIT 1;
        `;
        const childUserId = subUserResult.rows[0]?.user_sub_id;
        if(!childUserId) return NextResponse.json({error: 'Приглашённый пользователь не найден'}, {status: 404});

        const parentUserResult = await sql`
            SELECT user_add_id FROM users WHERE user_id = ${childUserId} LIMIT 1;
        `;
        const parentUserId = parentUserResult.rows[0]?.user_add_id;
        if(!parentUserId) return NextResponse.json({error: 'Пригласивший пользователь не найден'}, {status: 404});

        await sql`
            DELETE FROM invitations WHERE sender_id = ${parentUserId};
        `;

        await sql`
            DELETE FROM shared_subscriptions WHERE user_id = ${childUserId};
        `;

        await sql`
            UPDATE users SET user_sub_id = null WHERE user_id = ${parentUserId};
        `;

        await sql`
            UPDATE users SET user_add_id = null WHERE user_id = ${childUserId};
        `;

        return NextResponse.json({ message: 'Приглашение удалено' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при удалении приглашения: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}