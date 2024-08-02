import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ connected: false }, { status: 401 });

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

        const result = await sql`
            SELECT telegram_chat_id FROM users WHERE user_id = ${userId}
        `;

        const telegramConnected = result.rows.length > 0 && result.rows[0].telegram_chat_id != null;
        console.log(telegramConnected)
        return NextResponse.json({ telegramConnected });
    } catch (error) {
        console.error('Ошибка проверки подключения Телеграм бота: ', error);
        return NextResponse.json({ telegramConnected: false }, { status: 500 });
    }
}