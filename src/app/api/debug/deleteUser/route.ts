import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
    const { userId } = await req.json();

    if (!userId) return NextResponse.json({ error: 'Отсутствует userId' }, { status: 400 });

    try {
        await sql`DELETE FROM users WHERE user_id = ${userId}`;
        return NextResponse.json({ message: 'Пользователь удалён' });
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}