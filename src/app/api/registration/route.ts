import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import md5 from 'md5';
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
    try {
        const { name, surname, username, password, email, country } = await req.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        const emailHash = md5(email.trim().toLowerCase());
        const avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=retro`;

        const result = await sql`
            INSERT INTO users (name, surname, username, password, email, country, avatar_url)
            VALUES (${name}, ${surname}, ${username}, ${hashedPassword}, ${email}, ${country}, ${avatarUrl})
            RETURNING user_id, name, surname, username, email, country, avatar_url;
        `;

        const user = result.rows[0];

        await sendMail(
            email,
            'Добро пожаловать в Harmonysub!',
            `<h1>Привет, ${name}!</h1>
             <p>Вы успешно зарегистрировались.</p>
             <p>Имя пользователя: <strong>${username}</strong></p>
             <p>e-mail (для входа по e-mail): <strong>${email}</strong></p>`
        );

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Ошибка при регистрации пользователя: ', error);
        return NextResponse.json({ error: 'Ошибка при регистрации пользователя' }, { status: 500 });
    };
};