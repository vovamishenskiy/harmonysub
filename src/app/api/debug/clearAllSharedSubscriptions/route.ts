// app/api/debug/clearAllSharedSubscriptions/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    await sql`TRUNCATE TABLE shared_subscriptions RESTART IDENTITY CASCADE`;
    return NextResponse.json({ message: 'Таблица shared_subscriptions очищена' });
  } catch (error) {
    console.error('Ошибка очистки shared_subscriptions:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
