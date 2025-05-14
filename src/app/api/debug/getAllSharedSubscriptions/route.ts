// app/api/debug/getAllSharedSubscriptions/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT subscription_id, user_id
      FROM shared_subscriptions
      ORDER BY subscription_id, user_id
    `;
    return NextResponse.json(rows, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Ошибка при получении shared_subscriptions:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
