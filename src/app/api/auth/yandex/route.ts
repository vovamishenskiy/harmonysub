import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // куда вернуться после логина?
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || '/';
    // кодируем его в state
    const state = encodeURIComponent(callbackUrl);

    const origin = req.nextUrl.origin;
    const redirectUri = `${origin}/api/auth/yandex/callback`;

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.YANDEX_ID!,
        redirect_uri: redirectUri,
        state,
    });

    return NextResponse.redirect(
        `https://oauth.yandex.ru/authorize?${params}`
    );
}