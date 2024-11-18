import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest) {
    try {
        const result = await sql`SELECT * FROM users ORDER BY user_id`;
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении пользователей: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}