// app/api/debug/clearAllUsers/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    return NextResponse.json({ message: 'Таблица users очищена' });
  } catch (error) {
    console.error('Ошибка очистки users:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
