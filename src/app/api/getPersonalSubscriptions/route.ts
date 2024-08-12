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

        const subscriptions = await sql`
            SELECT s.*
            FROM subscriptions s
            WHERE s.user_id = ${userId} AND s.personal = true;
        `;

        return NextResponse.json(subscriptions.rows, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении личных подписок', error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}