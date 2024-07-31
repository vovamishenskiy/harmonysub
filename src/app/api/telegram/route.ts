import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
const telegram_bot_token = process.env.TELEGRAM_BOT_TOKEN;

interface Message {
    message_id: number;
    chat: {
        id: number;
        username?: string;
    };
    text?: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const message: Message = body.message;

        if (message && message.text && message.text.startsWith('/start')) {
            const chatId = message.chat.id;
            const username = message.chat.username || 'unknown';

            try {
                await sql`
                    INSERT INTO users (telegram_chat_id, telegram_username)
                    VALUES (${chatId}, ${username})
                    ON CONFLICT (telegram_chat_id) DO NOTHING;
                `;

                await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: `Здравствуйте, ${username}! Вы успешно подключили уведомления от приложения Harmonysub`,
                    }),
                });

                return NextResponse.json({ message: 'OK' });
            } catch (error) {
                console.error('Ошибка при сохранении chat_id:', error);
                return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
};

export const runtime = 'nodejs';