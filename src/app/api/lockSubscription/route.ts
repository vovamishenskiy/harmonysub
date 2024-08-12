import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
    const { subscriptionId, userId } = await req.json();

    try {
        const result = await sql`
            SELECT is_locked, locked_by_user_id FROM subscriptions WHERE subscription_id = ${subscriptionId};
        `;

        if (result.rows[0].is_locked) {
            return NextResponse.json({ error: 'Подписка уже редактируется другим пользователем' }, { status: 409 });
        }

        await sql`
            UPDATE subsrciption
            SET is_locked = true, locked_by_user_id = ${userId}
            WHERE subscription_id = ${subscriptionId};
        `;

        return NextResponse.json({ message: 'Подписка заблокирована для редактирования' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при блокировке подписки: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}