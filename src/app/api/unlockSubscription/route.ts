import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
    const { subscriptionId, userId } = await req.json();

    try {
        await sql`
            UPDATE subscriptions
            SET is_locked = false, locked_by_user_id = NULL
            WHERE subscription_id = ${subscriptionId} AND locked_by_user_id = ${userId};
        `;

        return NextResponse.json({ message: 'Блокировка снята' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при снятии блокировки подписки: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}