import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
    try {
        const cookie = serialize('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: -1,
            path: '/'
        });

        const response = NextResponse.json({
            message: 'Выход выполнен успешно',
        }, { status: 200 });

        response.headers.append('Set-Cookie', cookie);
        response.headers.delete('Authorization');

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}