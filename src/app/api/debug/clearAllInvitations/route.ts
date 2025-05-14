// app/api/debug/clearAllInvitations/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    await sql`TRUNCATE TABLE invitations RESTART IDENTITY CASCADE`;
    return NextResponse.json({ message: 'Таблица invitations очищена' });
  } catch (error) {
    console.error('Ошибка очистки invitations:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
