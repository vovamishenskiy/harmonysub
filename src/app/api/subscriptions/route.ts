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
        const userSubId = userSubIdResult.rows[0]?.user_sub_id || userId;

        let subscriptions;

        if (userSubId) {
            subscriptions = await sql`
                SELECT s.*
                FROM subscriptions s
                WHERE s.user_id = ${userId}
                OR s.user_id = ${userSubId}
                UNION
                SELECT ss.*
                FROM subscriptions ss
                INNER JOIN shared_subscriptions shs ON ss.subscription_id = shs.subscription_id
                WHERE shs.user_id = ${userSubId};
            `;
        } else {
            subscriptions = await sql`
                SELECT s.*
                FROM subscriotions s
                WHERE s.user_id = ${userId};
            `;
        }

        return NextResponse.json(subscriptions.rows, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении подписок', error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}