// app/api/auth/yandex/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET!;
const BASE_URL = process.env.NEXTAUTH_URL!; // e.g. http://localhost:3000

export async function GET(req: NextRequest) {
    const url = req.nextUrl;
    const code = url.searchParams.get('code')!;
    // 1) обмен кода на токен
    const tokenRes = await fetch('https://oauth.yandex.ru/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: process.env.YANDEX_ID!,
            client_secret: process.env.YANDEX_SECRET!,
            redirect_uri: `${BASE_URL}/api/auth/yandex/callback`,
        })
    });
    if (!tokenRes.ok) return NextResponse.redirect(BASE_URL);
    const { access_token } = await tokenRes.json();

    // 2) забираем профиль
    const profileRes = await fetch(
        `https://login.yandex.ru/info?format=json&oauth_token=${access_token}`
    );
    if (!profileRes.ok) return NextResponse.redirect(BASE_URL);
    const p = await profileRes.json() as any; // first_name, last_name, login, default_email…

    // 3) upsert в users
    const name = p.first_name ?? p.display_name ?? p.login;
    const surname = p.last_name ?? '';
    const username = p.login;
    const email = p.default_email;
    const avatar = p.userpic_url
        ? p.userpic_url
        : p.default_avatar_id
            ? `https://avatars.yandex.net/get-yapic/${p.default_avatar_id}/islands-200`
            : '';
    const country = 'RU';
    const randomHash = await bcrypt.hash(crypto.randomUUID(), 10);

    let userId: number;
    try {
        const insertRes = await sql`
      INSERT INTO users
        (name, surname, username, email, password, avatar_url, country)
      VALUES
        (${name}, ${surname}, ${username}, ${email}, ${randomHash}, ${avatar}, ${country})
      ON CONFLICT (email) DO UPDATE
        SET
          name       = EXCLUDED.name,
          surname    = EXCLUDED.surname,
          username   = EXCLUDED.username,
          avatar_url = EXCLUDED.avatar_url
      RETURNING user_id;
    `;
        userId = insertRes.rows[0]!.user_id;
    } catch (err: any) {
        // ловим только уникальную ошибку по username
        const isUsernameConflict =
            err.code === '23505' &&
            (err.constraint === 'users_username_key' ||
                String(err.detail).includes('Key (username)'));
        if (isUsernameConflict) {
            // вместо падения — берём существующий user_id
            const existing = await sql`
        SELECT user_id 
        FROM users 
        WHERE username = ${username}
        LIMIT 1;
      `;
            if (!existing.rows.length) {
                console.error('Username conflict, but no such user found:', username);
                return NextResponse.redirect(BASE_URL);
            }
            userId = existing.rows[0]!.user_id;
        } else {
            console.error('Unexpected error on upsert user:', err);
            return NextResponse.redirect(BASE_URL);
        }
    }

    // 4) ставим только JWT-куку
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '6h' });
    const cookie = serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 6 * 3600,
    });

    // 5) редиректим на спец-страницу, которая на клиенте наполнит localStorage и дальше пойдёт на /subscriptions
    const res = NextResponse.redirect(`${BASE_URL}/oauth-redirect?to=/subscriptions`);
    res.headers.set('Set-Cookie', cookie);
    return res;
}
