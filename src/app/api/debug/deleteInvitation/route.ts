import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
    const { invitationId } = await req.json();

    if (!invitationId) return NextResponse.json({ error: 'Отсутствует invitationId' }, { status: 400 });

    try {
        await sql`DELETE FROM invitations WHERE invitation_id = ${invitationId}`;
        return NextResponse.json({ message: 'Приглашение удалено' });
    } catch (error) {
        console.error('Ошибка при удалении приглашения:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}