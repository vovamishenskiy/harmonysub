import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as { userId: string };
        const userId = decoded.userId;

        const userSubIdResult = await sql`
            SELECT user_sub_id FROM users WHERE user_id = ${userId} LIMIT 1;
        `;
        const userSubId = userSubIdResult.rows[0]?.user_sub_id;

        await sql`
            INSERT INTO shared_subscriptions (subscription_id, user_id)
            SELECT subscription_id, ${userSubId} FROM subscriptions WHERE user_id = ${userId}
            ON CONFICT DO NOTHING;
        `;

        const result = await sql`
            SELECT s.*
            FROM subscriptions s
            WHERE s.user_id = ${userId}
            OR s.user_id = ${userSubId};
        `;
        const subscriptions = result.rows;

        return NextResponse.json(subscriptions, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении подписок', error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}