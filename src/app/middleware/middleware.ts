import { NextResponse, NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.redirect(new URL('/', req.url));

    try {
        jwt.verify(token, JWT_SECRET as string);

        return NextResponse.next();
    } catch (error) {
        console.error('Invalid token', error);
        return NextResponse.redirect(new URL('/', req.url));
    };
};

export const config = {
    matcher: ['/subscriptions/*'],
}