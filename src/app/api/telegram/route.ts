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
        let limit = 1;

        await logWebhookInfo();

        if (message && message.text && message.text.startsWith('/start')) {
            const chatId = message.chat.id;
            const firstName = message.chat.first_name;

            if (limit == 1) {
                await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: `Здравстуйте, ${firstName}! Чтобы подключить уведомления от приложения Harmonysub пришлите имя пользователя, которые Вы указывали при регистрации в приложении`,
                    }),
                })
                    .then((res) => console.log(res.json()));
                limit = 0;

                return NextResponse.json({ message: 'Пользователь отправил старт боту' });
            } else if (limit == 0) {
                limit = 1;
                return NextResponse.json({ message: 'Бот уже ответил' });
            }
        } else if (message && message.text) {
            const chatId = message.chat.id;
            const username = message.text;
            const telegram_username = message.chat.username;

            const existingUser = await sql`
                SELECT * FROM users WHERE telegram_chat_id = ${chatId}
            `;

            if (existingUser.rows.length == 0) {
                await sql`
                    INSERT INTO users (telegram_chat_id, telegram_username)
                    VALUES (${chatId}, ${telegram_username})
                    ON CONFLICT (telegram_chat_id)
                    DO UPDATE SET
                        telegram_username = EXCLUDED.telegram_username
                    WHERE users.username = ${username}
                `;

                if (limit == 1) {
                    await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: `Вы успешно подключили уведомления от приложения Harmonysub!`,
                        }),
                    });

                    limit = 0;
                    return NextResponse.json({ message: 'Пользователь успешно подключил телеграм к приложению' });
                } else if (limit == 0) {
                    limit = 1;
                    return NextResponse.json({ message: 'Бот уже ответил' });
                }
            } else if (existingUser.rows.length > 0) {
                if (limit == 1) {
                    await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: `Вы уже подключили уведомления от приложения Harmonysub!`,
                        }),
                    });

                    return NextResponse.json({ message: 'Пользователь уже подключил телеграм к приложению' });
                } else if (limit == 0) {
                    limit = 1;
                    return NextResponse.json({ message: 'Бот уже ответил' });
                }
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