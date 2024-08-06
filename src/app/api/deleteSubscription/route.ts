import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { subscription_id } = body;

        if (!subscription_id) {
            return NextResponse.json({ error: 'ID подписки не найден' }, { status: 400 });
        }

        const result = await sql`
            DELETE FROM subscriptions WHERE subscription_id = ${subscription_id}
            RETURNING *;
        `;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Подписка не найдена' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
        console.error('Ошибка при удалении подписки: ', error);
        return NextResponse.json({ error: 'Ошибка при удалении подписки' }, { status: 500 });
    }
}