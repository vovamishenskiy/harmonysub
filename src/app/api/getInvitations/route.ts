import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    try {
        const result = await sql`
            SELECT invitations.invite_id, users.username AS senderUsername 
            FROM invitations 
            JOIN users ON invitations.sender_id = users.user_id 
            WHERE invitations.recipient_id = ${userId} AND invitations.status = 'pending';
        `;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Приглашений не найдено' }, { status: 404 });
        }

        return NextResponse.json({ invitations: result.rows }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении приглашений: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}
