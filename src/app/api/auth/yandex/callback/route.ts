// app/api/auth/yandex/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
    const url = req.nextUrl;
    const rawState = url.searchParams.get('state') || '/';
    const code = url.searchParams.get('code')!;

    // 1) Decode state → маршрут, куда реально возвращаться
    let decoded = rawState;
    try { decoded = decodeURIComponent(decoded); } catch { }
    if (!decoded.startsWith('/')) decoded = '/' + decoded;

    const origin = url.origin; // берём протокол+домен напрямую
    const redirectUri = `${origin}/api/auth/yandex/callback`;
    const finalState = encodeURIComponent(decoded);

    // 2) Обмениваем code → access_token
    const tokenRes = await fetch('https://oauth.yandex.ru/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: process.env.YANDEX_ID!,
            client_secret: process.env.YANDEX_SECRET!,
            redirect_uri: redirectUri,
        }),
    });
    if (!tokenRes.ok) {
        console.error('Yandex token error:', await tokenRes.text());
        return NextResponse.redirect(origin);
    }
    const { access_token } = await tokenRes.json();

    // 3) Запрашиваем профиль
    const profileRes = await fetch(
        `https://login.yandex.ru/info?format=json&oauth_token=${access_token}`
    );
    if (!profileRes.ok) {
        console.error('Yandex profile error:', await profileRes.text());
        return NextResponse.redirect(origin);
    }
    const p = await profileRes.json() as {
        first_name?: string;
        last_name?: string;
        display_name?: string;
        login: string;
        default_email: string;
        userpic_url?: string;
        default_avatar_id?: string;
    };

    // 4) Подготавливаем поля для БД
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

    // 5) Upsert + обход конфликта username
    let userId: number;
    try {
        const insertRes = await sql`
      INSERT INTO users
        (name,surname,username,email,password,avatar_url,country)
      VALUES
        (${name},${surname},${username},${email},${randomHash},${avatar},${country})
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
        const detail = String(err.detail || '');
        const isUsrConflict =
            err.code === '23505' &&
            (err.constraint === 'users_username_key' || detail.includes('Key (username)'));
        if (isUsrConflict) {
            const sel = await sql`
        SELECT user_id
        FROM users
        WHERE username = ${username}
        LIMIT 1;
      `;
            if (!sel.rows.length) {
                console.error('Username conflict but not found:', username);
                return NextResponse.redirect(origin);
            }
            userId = sel.rows[0]!.user_id;
        } else {
            console.error('Unexpected upsert error:', err);
            return NextResponse.redirect(origin);
        }
    }

    // 6) Ставим JWT-куку
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '6h' });
    const cookie = serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 6 * 3600,
    });

    // 7) Редиректим на промежуточную клиентскую страницу
    //    передав тот же decoded путь в параметре "to"
    const res = NextResponse.redirect(
        `${origin}/oauth-redirect?to=${encodeURIComponent(decoded)}`
    );
    res.headers.set('Set-Cookie', cookie);
    return res;
}
