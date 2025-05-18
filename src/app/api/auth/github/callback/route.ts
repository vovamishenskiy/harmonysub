// app/api/auth/github/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET!;
const BASE_URL = process.env.GITHUB_URL!;

export async function GET(req: NextRequest) {
    const url = req.nextUrl;
    const rawState = url.searchParams.get('state') || '/';
    const code = url.searchParams.get('code')!;

    // Decode state once → "/subscriptions"
    let redirectPath = decodeURIComponent(rawState);
    if (!redirectPath.startsWith('/')) redirectPath = '/' + redirectPath;
    const redirectUrl = `${url.origin}${redirectPath}`;

    // 1) Exchange code → access_token (must include same redirect_uri!)
    const tokRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams({
            client_id: process.env.GITHUB_ID!,
            client_secret: process.env.GITHUB_SECRET!,
            code,
            redirect_uri: `${BASE_URL}/api/auth/github/callback`,
        }),
    });
    if (!tokRes.ok) {
        console.error('GitHub token error:', await tokRes.text());
        return NextResponse.redirect(BASE_URL);
    }
    const { access_token } = await tokRes.json();

    // 2) Fetch user profile
    const profileRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    if (!profileRes.ok) {
        console.error('GitHub profile error:', await profileRes.text());
        return NextResponse.redirect(BASE_URL);
    }
    const profile = await profileRes.json() as {
        login: string;
        avatar_url: string;
        email: string | null;
    };

    // 3) Ensure we have an email
    let email = profile.email;
    if (!email) {
        const emailsRes = await fetch('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' }
        });
        if (emailsRes.ok) {
            const list = await emailsRes.json();
            if (Array.isArray(list)) {
                const primary = list.find((e: any) => e.primary && e.verified);
                email = primary?.email || list[0]?.email;
            }
        }
    }
    if (!email) {
        console.error('No email returned from GitHub');
        return NextResponse.redirect(BASE_URL);
    }

    // 4) Prepare fields
    const username = profile.login;
    const avatar_url = profile.avatar_url;
    const country = 'RU';
    const randomHash = await bcrypt.hash(crypto.randomUUID(), 10);

    // 5) Upsert user, handling both email- and username-unique conflicts
    let userId: number;
    try {
        const ins = await sql`
      INSERT INTO users
        (email, username, avatar_url, password, country)
      VALUES
        (${email}, ${username}, ${avatar_url}, ${randomHash}, ${country})
      ON CONFLICT (email) DO UPDATE
        SET username   = EXCLUDED.username,
            avatar_url = EXCLUDED.avatar_url
      RETURNING user_id;
    `;
        userId = ins.rows[0]!.user_id;
    } catch (err: any) {
        // If the clash is on username, fetch that user instead of erroring
        const isUsrConflict =
            err.code === '23505' &&
            (err.constraint === 'users_username_key' ||
                String(err.detail).includes('Key (username)'));
        if (isUsrConflict) {
            const sel = await sql`
        SELECT user_id 
        FROM users 
        WHERE username = ${username}
        LIMIT 1;
      `;
            if (!sel.rows.length) {
                console.error('Username conflict but no such user:', username);
                return NextResponse.redirect(BASE_URL);
            }
            userId = sel.rows[0]!.user_id;
        } else {
            console.error('Unexpected upsert error:', err);
            return NextResponse.redirect(BASE_URL);
        }
    }

    // 6) Issue a JWT cookie
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '6h' });
    const cookie = serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 6 * 3600,
    });

    // 7) Finally redirect the user (with the JWT cookie set)
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set('Set-Cookie', cookie);
    return response;
}