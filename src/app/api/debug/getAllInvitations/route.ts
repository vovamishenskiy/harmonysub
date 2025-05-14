// app/api/debug/getAllInvitations/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const result = await sql`
      SELECT invite_id, sender_id, receiver_id, status
      FROM invitations
      ORDER BY invite_id
    `;
    return NextResponse.json(result.rows, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (err) {
    console.error('Ошибка при получении приглашений:', err);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}