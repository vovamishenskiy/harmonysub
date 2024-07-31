import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (error) {
        console.error('Invalid token:', error);
        return NextResponse.redirect(new URL('/', req.url));
    }
}

export const config = {
    matcher: ['/subscriptions/:path*', '/user/:path*', '/settings/:path*'],
}