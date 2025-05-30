// app/api/debug/getAllSubscriptions/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        s.subscription_id,
        s.user_id,
        s.title,
        s.start_date,
        s.expiry_date,
        s.price,
        s.renewal_type,
        s.paid_from,
        s.status,
        s.created_at,
        s.updated_at,
        s.is_locked,
        s.locked_by_user_id,
        u.username AS creator_name
      FROM subscriptions s
      LEFT JOIN users u ON s.user_id = u.user_id
    `;
    console.log('DEBUG getAllSubscriptions, rows count =', result.rows.length);
    return NextResponse.json(result.rows, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (err) {
    console.error('Ошибка при загрузке подписок:', err);
    return NextResponse.json(
      { error: 'Ошибка при загрузке подписок' },
      { status: 500 }
    );
  }
}
