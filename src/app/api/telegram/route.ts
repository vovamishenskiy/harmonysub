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

async function logWebhookInfo() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${telegram_bot_token}/getWebhookInfo`);
        const data = await response.json()
        console.log('[ DEBUG ] TELEGRAM BOT WEBHOOK INFO: ', data.result);
    } catch (error) {
        console.error('Ошибка при получении информации о вебхуке: ', error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const message: Message = body.message;

        await logWebhookInfo();

        if (message && message.text && message.text.startsWith('/start')) {
            const chatId = message.chat.id;
            const firstName = message.chat.first_name || 'User';

            await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `Здравстуйте, ${firstName}! Чтобы подключить уведомления от приложения Harmonysub пришлите имя пользователя, которые Вы указывали при регистрации в приложении`,
                }),
            });
        } else if (message && message.text) {
            const chatId = message.chat.id;
            const username = message.text;
            const telegram_username = message.chat.username;

            const existingUser = await sql`
                SELECT * FROM users WHERE username = ${username}
            `;

            if (existingUser.rows.length == null) {
                await sql`
                    INSERT INTO users (telegram_chat_id, telegram_username)
                    VALUES (${chatId}, ${telegram_username})
                    ON CONFLICT (telegram_chat_id)
                    DO UPDATE SET
                        telegram_username = EXCLUDED.telegram_username
                    WHERE users.username = ${username}
                `;

                await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: `Вы успешно подключили уведомления от приложения Harmonysub!`,
                    }),
                });

                return NextResponse.json({ message: 'Already connected' });
            } else if (existingUser.rows.length > 0) {
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
        } else {
            console.error('Invalid message format:', message);
            return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
};

export const runtime = 'nodejs';