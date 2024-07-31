import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const telegram_bot_token = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        const result = await sql`
            SELECT telegram_chat_id FROM users WHERE user_id = ${userId}
        `;
        const chatId = result.rows[0]?.telegram_chat_id;

        await sql`
            UPDATE users
            SET telegram_chat_id = NULL, telegram_username = NULL
            WHERE user_id = ${userId}
        `;

        if (chatId) {
            await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: 'Вы успешно отключили уведомления от приложения Harmonysub',
                }),
            });
        }

        return NextResponse.json({ message: 'Подключение к телеграм боту удалено' });
    } catch (error) {
        console.error('Error disconnecting Telegram:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}