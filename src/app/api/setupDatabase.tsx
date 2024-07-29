// pages/api/setupDatabase.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Создание таблицы users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        country VARCHAR(100),
        telegram_username VARCHAR(100),
        telegram_chat_id VARCHAR(100),
        role VARCHAR(50) DEFAULT 'user', -- роль пользователя (user/admin)
        created_at TIMESTAMP DEFAULT NOW(), -- дата создания записи
        updated_at TIMESTAMP DEFAULT NOW(), -- дата последнего обновления записи
        CONSTRAINT username_email_unique UNIQUE (username, email) -- уникальность username и email
      )
    `;

    // Создание триггера для обновления поля updated_at при изменении записи
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE 'plpgsql';

      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `;

    // Создание таблицы subscriptions
    await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        subscription_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(user_id),
        title VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        expiry_date DATE NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        renewal_type VARCHAR(50) NOT NULL,
        paid_from VARCHAR(4) NOT NULL,
        status VARCHAR(50) DEFAULT 'active', -- статус подписки (active/inactive)
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Создание триггера для обновления поля updated_at при изменении записи в subscriptions
    await sql`
      CREATE TRIGGER update_subscriptions_updated_at
      BEFORE UPDATE ON subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `;

    res.status(200).json({ message: 'Database setup completed successfully.' });
  } catch (error) {
    console.error('Error setting up database:', error);
    res.status(500).json({ error: 'Failed to set up the database.' });
  }
}
