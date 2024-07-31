import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { parse } from 'cookie';

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
        const data = await response.json();
        console.log('[ DEBUG ] TELEGRAM BOT WEBHOOK INFO: ', data.result);
    } catch (error) {
        console.error('Ошибка при получении информации о вебхуке: ', error);
    }
}

export async function POST(req: NextRequest) {
    try {
        logWebhookInfo();

        const body = await req.json();
        const message: Message = body.message;

        const userId = req.cookies.get('userId')?.value;

        console.log('user id: ', userId)

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized: No userId in cookies' }, { status: 401 });
        }

        if (message && message.text) {
            const chatId = message.chat.id;

            if (message.text.startsWith('/start')) {
                const username = message.chat.username || 'unknown';
                const firstName = message.chat.first_name || 'Пользователь';

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

                await sql`
                    INSERT INTO users (telegram_chat_id, telegram_username)
                    VALUES (${chatId}, ${username})
                    ON CONFLICT (user_id) 
                    DO UPDATE SET 
                        telegram_chat_id = EXCLUDED.telegram_chat_id,
                        telegram_username = EXCLUDED.telegram_username
                    WHERE user_id = ${userId}
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
            } else if (message.text === '/disconnect') {
                await sql`
                    UPDATE users
                    SET telegram_chat_id = NULL, telegram_username = NULL
                    WHERE user_id = ${userId}
                `;

                await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: 'Вы успешно отключили уведомления от приложения Harmonysub.',
                    }),
                });

                return NextResponse.json({ message: 'Telegram disconnected via bot' });
            }
        } else {
            return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}

export const runtime = 'nodejs';