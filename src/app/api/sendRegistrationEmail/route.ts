import { NextResponse } from 'next/server'
import axios from 'axios'

interface RequestBody {
    email: string
    name: string
    username: string
}

export async function POST(request: Request) {
    const { email, name, username } = (await request.json()) as RequestBody

    try {
        const brevoRes = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: 'HarmonySub',
                    email: 'info@harmonysub.ru',
                },
                to: [
                    {
                        email,
                        name,
                    },
                ],
                subject: 'Добро пожаловать в HarmonySub!',
                htmlContent: `
                    <h1>Привет, ${name}!</h1>
                    <p>Вы успешно зарегистрировались.</p>
                    <p>Имя пользователя: <strong>${username}</strong></p>
                    <p>e-mail (для входа по e-mail): <strong>${email}</strong></p>
                `,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.BREVO_API_KEY!,
                },
            }
        )

        if (brevoRes.status === 201 || brevoRes.status === 200) {
            return NextResponse.json({ ok: true })
        } else {
            console.error('Brevo error payload:', brevoRes.data)
            return NextResponse.json(
                { error: 'Brevo вернул ошибку при отправке' },
                { status: 500 }
            )
        }
    } catch (err: any) {
        console.error('Ошибка Brevo:', err.response?.data || err.message)
        return NextResponse.json(
            { error: 'Не удалось отправить письмо через Brevo' },
            { status: 500 }
        )
    }
}