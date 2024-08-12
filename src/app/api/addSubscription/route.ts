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
            status,
            personal
        } = await req.json();

        if (!user_id || !title || !start_date || !expiry_date || !price || !renewal_type || !paid_from) {
            return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 });
        }

        const startDate = new Date(start_date);
        const renewalDays = parseInt(renewal_type, 10);
        const expiryDate = new Date(startDate);
        expiryDate.setDate(startDate.getDate() + renewalDays);

        const userSubIdResult = await sql`
            SELECT user_sub_id, user_add_id FROM users WHERE user_id = ${user_id} LIMIT 1;
        `;
        const parentUserId = userSubIdResult.rows[0]?.user_add_id;
        const childUserId = userSubIdResult.rows[0]?.user_sub_id;

        let finalUserId;

        if(parentUserId === null) {
            finalUserId = user_id;
        } else if(user_id === parentUserId) {
            finalUserId = parentUserId;
        } else if(user_id === childUserId) {
            finalUserId = childUserId;
        } else {
            finalUserId = user_id;
        }

        const result = await sql`
            INSERT INTO subscriptions(user_id, title, start_date, expiry_date, price, renewal_type, paid_from, status, personal)
            VALUES (
                ${finalUserId},
                ${title},
                ${startDate.toISOString().split('T')[0]},
                ${expiryDate.toISOString().split('T')[0]},
                ${price},
                ${renewal_type},
                ${paid_from},
                ${status},
                ${personal}
            )
            RETURNING *;
        `;

        return NextResponse.json({ message: 'Подписка успешно добавлена', data: result.rows[0] });
    } catch (error) {
        console.error('Ошибка при добавлении подписки: ', error);
        return NextResponse.json({ error: 'Ошибка при добавлении подписки' }, { status: 500 });
    }
}