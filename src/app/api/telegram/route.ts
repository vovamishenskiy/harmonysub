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
                limit = 0;

                return NextResponse.json({ message: 'Пользователь отправил старт боту' });
            } else if (limit == 0) {
                limit = 1;
                return NextResponse.json({ message: 'Бот уже ответил' });
            }
        } else if (message && message.text && message.text.startsWith('/disconnect')) {
            const chatId = message.chat.id;
            const firstName = message.chat.first_name;

            await sql`
                UPDATE users
                SET telegram_chat_id = NULL, telegram_username = NULL
                WHERE telegram_chat_id = ${chatId}
            `;

            if (limit == 1) {
                await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: 'Вы успешно отключили уведомления от приложения Harmonysub, если захотите снова подключить их используйте команду /start',
                    }),
                })
                limit = 0;

                return NextResponse.json({ message: 'Пользователь отключил уведомления от приложения' });
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
                    UPDATE users 
                    SET telegram_chat_id = ${chatId}, telegram_username = ${telegram_username}
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
                            text: `Пользователя с таким именем пользователя не существует или Вы уже подключили уведомления от приложения Harmonysub!`,
                        }),
                    });

                    return NextResponse.json({ message: 'Нет такого пользователя или пользователь уже подключил телеграм к приложению' });
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

export async function GET(req: NextRequest) {
    try {
        const currentDate = new Date().toISOString().split('T')[0];

        const expiringSubscriptions = await sql`
            SELECT username, telegram_chat_id, telegram_username, expiry_date, title
            FROM users
            WHERE expiry_date BETWEEN ${currentDate} AND (DATE(${currentDate}) + INTERVAL '3 days)
        `;

        for (const user of expiringSubscriptions.rows) {
            const { telegram_chat_id, telegram_username, expiry_date, title } = user;

            if (telegram_chat_id) {
                await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: telegram_chat_id,
                        text: `Здравствуйте, Ваша подписка ${title} истекает ${expiry_date} (через 3 дня). Не забудьте обновить данные в приложении Harmonysub!`
                    }),
                });
            }
        }

        return NextResponse.json({ message: 'Уведомления отправлены' });
    } catch (error) {
        console.error('Ошибка при проверке подписок: ', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}

export const runtime = 'nodejs';