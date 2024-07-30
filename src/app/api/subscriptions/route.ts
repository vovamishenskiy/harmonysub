import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const token = req.cookies.token;

        if (!token) return res.status(401).json({ error: 'Требуется авторизация' });

        try {
            const decoded = jwt.verify(token, JWT_SECRET as string) as { userId: string };
            const userId = decoded.userId;

            const result = await sql`SELECT * FROM subscriptions WHERE user_id = ${userId}`;
            const subscriptions = result.rows;

            return res.status(200).json(subscriptions);
        } catch (error) {
            console.error('Ошибка при получении подписок', error);
            return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    } else {
        return res.status(405).json({ error: 'Метод не разрешен' });
    }
}