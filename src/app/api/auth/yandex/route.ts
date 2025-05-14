import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // Где нас вернуть после успешного OAuth?
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || '/';
    // Кладём его (URL-encoded) в state
    const state = encodeURIComponent(callbackUrl);

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.YANDEX_ID!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/yandex/callback`,
        state,
    });

    return NextResponse.redirect(`https://oauth.yandex.ru/authorize?${params}`);
}