import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest) {
    try {
        const result = await sql`SELECT * FROM invitations ORDER BY invite_id`;
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении приглашений:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}