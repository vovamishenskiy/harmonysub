// app/api/auth/oauth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
    const { email, name, avatar_url } = await req.json();

    // Ищем пользователя
    const result = await sql`
    SELECT user_id, username, email, avatar_url
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;
    if (result.rows.length > 0) {
        return NextResponse.json(result.rows[0]);
    }

    // Если не нашли — создаём
    const insert = await sql`
    INSERT INTO users (email, username, avatar_url)
    VALUES (${email}, ${name}, ${avatar_url})
    RETURNING user_id, username, email, avatar_url
  `;
    return NextResponse.json(insert.rows[0]);
}