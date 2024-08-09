import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
    try {
        const {
            user_id,
            title,
            start_date,
            expiry_date,
            price,
            renewal_type,
            paid_from,
            status
        } = await req.json();

        console.log(user_id,
            title,
            start_date,
            expiry_date,
            price,
            renewal_type,
            paid_from,
            status)

        if (!user_id || !title || !start_date || !expiry_date || !price || !renewal_type || !paid_from) {
            return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 });
        }

        const startDate = new Date(start_date);
        const renewalDays = parseInt(renewal_type, 10);
        const expiryDate = new Date(startDate);
        expiryDate.setDate(startDate.getDate() + renewalDays);

        const userSubIdResult = await sql`
            SELECT user_sub_id FROM users WHERE user_id = ${user_id} LIMIT 1;
        `;
        const invitedUserId = userSubIdResult.rows[0]?.user_sub_id || user_id;

        const result = await sql`
            INSERT INTO subscriptions(user_id, title, start_date, expiry_date, price, renewal_type, paid_from, status)
            VALUES (
                ${invitedUserId},
                ${title},
                ${startDate.toISOString().split('T')[0]},
                ${expiryDate.toISOString().split('T')[0]},
                ${price},
                ${renewal_type},
                ${paid_from},
                ${status}
            )
            RETURNING *;
        `;

        return NextResponse.json({ message: 'Подписка успешно добавлена', data: result.rows[0] });
    } catch (error) {
        console.error('Ошибка при добавлении подписки: ', error);
        return NextResponse.json({ error: 'Ошибка при добавлении подписки' }, { status: 500 });
    }
}