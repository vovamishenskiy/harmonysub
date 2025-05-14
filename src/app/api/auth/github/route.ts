// app/api/auth/github/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // Where does the client want to go after login?
    const to = req.nextUrl.searchParams.get('callbackUrl') ?? '/';
    // Encode that into state:
    const state = encodeURIComponent(to);

    const params = new URLSearchParams({
        client_id: process.env.GITHUB_ID!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/github/callback`,
        scope: 'read:user user:email',
        state,
        allow_signup: 'true',
    });

    // 307 → GitHub’s OAuth authorize URL
    return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
