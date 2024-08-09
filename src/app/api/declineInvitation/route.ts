import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
    const { invitationId } = await req.json();

    try {
        const invitationResult = await sql`
            SELECT * FROM invitations WHERE invite_id = ${invitationId} AND status = 'pending';
        `;

        if (invitationResult.rows.length === 0) {
            return NextResponse.json({ error: 'Приглашение не найдено' }, { status: 404 });
        }

        await sql`
            DELETE FORM invitations WHERE invite_id = ${invitationId};
        `;

        return NextResponse.json({ message: 'Приглашение удалено' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при удалении приглашения: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}