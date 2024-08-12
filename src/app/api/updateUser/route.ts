import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    const { username, newUsername, newEmail, newPassword, newCountry } = await req.json();

    if (!newUsername && !newEmail && !newPassword && !newCountry) {
        return NextResponse.json({ error: 'Не предоставлено обновлений пользователя' }, { status: 400 });
    }

    try {
        if (newUsername) {
            await sql`
                UPDATE users
                SET username = ${newUsername}
                WHERE username = ${username}
            `;
        }

        if (newEmail) {
            await sql`
                UPDATE users
                SET email = ${newEmail}
                WHERE username = ${username}
            `;
        }

        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await sql`
                UPDATE users
                SET password = ${hashedPassword}
                WHERE username = ${username}
            `;
        }

        if (newCountry) {
            await sql`
                UPDATE users
                SET country = ${newCountry}
                WHERE username = ${username}
            `;
        }

        return NextResponse.json({ message: 'Данные пользователя успешно обновлены' });
    } catch (error) {
        console.error('Ошибка при обновлении данных пользователя: ', error);
        return NextResponse.json({ error: 'Ошибка при обновлении данных пользователя' }, { status: 500 });
    }
}