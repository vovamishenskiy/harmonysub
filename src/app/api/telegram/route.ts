import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

const telegram_bot_token = process.env.TELEGRAM_BOT_TOKEN;

interface Message {
    message_id: number;
    chat: {
        id: number;
        username?: string;
        first_name?: string;
    };
    text?: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const message: Message = body.message;

        console.log('Received message:', message); // Логирование для диагностики

        if (message && message.text && message.text.startsWith('/start')) {
            const chatId = message.chat.id;
            const username = message.chat.username || 'unknown';
            const firstName = message.chat.first_name || 'User';

            // Проверка на существующего пользователя
            const existingUser = await sql`
                SELECT * FROM users WHERE telegram_chat_id = ${chatId}
            `;

            if (existingUser.rows.length > 0) {
                await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: `Вы уже подключили уведомления от приложения Harmonysub!`,
                    }),
                });

                return NextResponse.json({ message: 'Already connected' });
            }

            // Вставка нового пользователя
            await sql`
                INSERT INTO users (telegram_chat_id, telegram_username)
                VALUES (${chatId}, ${username})
                ON CONFLICT (telegram_chat_id) 
                DO UPDATE SET 
                    telegram_username = EXCLUDED.telegram_username
                WHERE users.telegram_username IS DISTINCT FROM EXCLUDED.telegram_username;
            `;

            await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `Здравствуйте, ${firstName}! Вы успешно подключили уведомления от приложения Harmonysub`,
                }),
            });

            return NextResponse.json({ message: 'OK' });
        } else {
            console.error('Invalid message format:', message); // Логирование для диагностики
            return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
};

export const runtime = 'nodejs';