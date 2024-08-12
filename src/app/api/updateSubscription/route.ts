import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            subscription_id,
            title,
            price,
            renewal_type,
            start_date,
            expiry_date,
            paid_from,
            status,
            user_id,
            personal
        } = body;

        if (!subscription_id) return NextResponse.json({ error: 'ID подписки не найден' }, { status: 400 });

        const userSubIdResult = await sql`
            SELECT user_sub_id, user_add_id FROM users WHERE user_id = ${user_id} LIMIT 1;
        `;
        const parentUserId = userSubIdResult.rows[0]?.user_add_id;
        const childUserId = userSubIdResult.rows[0]?.user_sub_id;

        let finalUserId;

        if (parentUserId === null) {
            finalUserId = user_id;
        } else if (user_id === parentUserId) {
            finalUserId = parentUserId;
        } else if (user_id === childUserId) {
            finalUserId = childUserId;
        } else {
            finalUserId = user_id;
        }

        const result = await sql`
            UPDATE subscriptions
            SET title = ${title}, price = ${price}, renewal_type = ${renewal_type}, start_date = ${start_date}, expiry_date = ${expiry_date}, paid_from = ${paid_from}, status = ${status}, personal = ${personal}
            WHERE subscription_id = ${subscription_id} AND user_id = ${finalUserId}
            RETURNING *;
        `;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Подписка не найдена' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
        console.error('Ошибка при обновлении подписки: ', error);
        return NextResponse.json({ error: 'Ошибка при обновлении подписки' }, { status: 500 });
    }
}