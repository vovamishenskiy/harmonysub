import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) return NextResponse.json({ error: 'Отсутствует subscriptionId' }, { status: 400 });

    try {
        await sql`DELETE FROM subscriptions WHERE subscription_id = ${subscriptionId}`;
        return NextResponse.json({ message: 'Подписка удалена' });
    } catch (error) {
        console.error('Ошибка при удалении подписки:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}