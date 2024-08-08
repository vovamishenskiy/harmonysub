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

        const invite = invitationResult.rows[0];

        await sql`
            INSERT INTO shared_subscriptions (subscription_id, user_id)
            SELECT subscription_id, ${invite.recipient_id} FROM subscriptions WHERE user_id = ${invite.sender_id};
        `;

        await sql`
            UPDATE invitations SET status = 'accepted' WHERE invite_id = ${invitationId};
        `;

        return NextResponse.json({ message: 'Приглашение принято' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при принятии приглашения: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}