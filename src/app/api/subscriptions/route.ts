import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        NextResponse.redirect(new URL('/', req.url));
        return NextResponse.redirect(new URL('/', req.url));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as { userId: string };
        const userId = decoded.userId;

        const result = await sql`SELECT * FROM subscriptions WHERE user_id = ${userId}`;
        const subscriptions = result.rows;

        return NextResponse.json(subscriptions, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении подписок', error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}