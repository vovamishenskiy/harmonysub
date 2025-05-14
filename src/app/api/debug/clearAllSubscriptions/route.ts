// app/api/debug/clearAllSubscriptions/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    // Очистим сначала зависимые shared_subscriptions, затем subscriptions
    await sql`TRUNCATE TABLE shared_subscriptions RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE subscriptions RESTART IDENTITY CASCADE`;
    return NextResponse.json({ message: 'Таблица subscriptions очищена' });
  } catch (error) {
    console.error('Ошибка очистки subscriptions:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
