'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;

interface User {
  user_id: number;
  username: string;
  email: string;
  user_sub_id: number | null;
  user_add_id: number | null;
}

interface Subscription {
  subscription_id: number;
  user_id: number;
  title: string;
  start_date: string;
  expiry_date: string;
  price: string;
  renewal_type: string;
  paid_from: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  is_locked: boolean;
  locked_by_user_id: number;
  creator_name: string;
}

interface Invitation {
  invitation_id: number;
  sender_id: number;
  receiver_id: number;
}

const DebugPage: React.FC = () => {
  const [users, setUsers]             = useState<User[]>([]);
  const [subscriptions, setSubs]      = useState<Subscription[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [error, setError]             = useState<string>('');
  const [isAdmin, setIsAdmin]         = useState(false);
  const router = useRouter();

  // Проверка админа
  useEffect(() => {
    const username = typeof window !== 'undefined'
      ? localStorage.getItem('username')
      : null;
    if (username === ADMIN_USERNAME) {
      setIsAdmin(true);
    } else {
      alert('Доступ запрещён.');
      router.push('/');
    }
  }, [router]);

  // Загрузка данных
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/debug/getAllUsers', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setUsers(data);
      else setError(data.error);
    } catch {
      setError('Ошибка при загрузке пользователей');
    }
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const res = await fetch('/api/debug/getAllSubscriptions', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setSubs(data);
      else setError(data.error);
    } catch {
      setError('Ошибка при загрузке подписок');
    }
  }, []);

  const fetchInvitations = useCallback(async () => {
    try {
      const res = await fetch('/api/debug/getAllInvitations', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setInvitations(data);
      else setError(data.error);
    } catch {
      setError('Ошибка при загрузке приглашений');
    }
  }, []);

  // Инициализация
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchSubscriptions();
      fetchInvitations();
    }
  }, [isAdmin, fetchUsers, fetchSubscriptions, fetchInvitations]);

  // Очистка таблиц
  const clearUsers = useCallback(async () => {
    if (!confirm('Очистить всю таблицу пользователей?')) return;
    const res = await fetch('/api/debug/clearAllUsers', { method: 'POST' });
    if (res.ok) {
      alert('Таблица users очищена');
      fetchUsers();
    } else {
      alert('Не удалось очистить users');
    }
  }, [fetchUsers]);

  const clearSubscriptions = useCallback(async () => {
    if (!confirm('Очистить всю таблицу подписок?')) return;
    const res = await fetch('/api/debug/clearAllSubscriptions', { method: 'POST' });
    if (res.ok) {
      alert('Таблица subscriptions очищена');
      fetchSubscriptions();
    } else {
      alert('Не удалось очистить subscriptions');
    }
  }, [fetchSubscriptions]);

  const clearInvitations = useCallback(async () => {
    if (!confirm('Очистить всю таблицу приглашений?')) return;
    const res = await fetch('/api/debug/clearAllInvitations', { method: 'POST' });
    if (res.ok) {
      alert('Таблица invitations очищена');
      fetchInvitations();
    } else {
      alert('Не удалось очистить invitations');
    }
  }, [fetchInvitations]);

  if (!isAdmin) return null;

  return (
    <div className="flex flex-row">
      <Sidebar />
      <main className="flex flex-col lg:mt-3 lg:ml-4 sm:ml-3 w-full">
        <h1 className="text-3xl mb-5">Отладка базы</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Пользователи */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl">Пользователи</h2>
            <button onClick={clearUsers} className="text-sm text-red-600 hover:underline">
              Очистить таблицу
            </button>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">user_id</th>
                  <th className="p-2 border">username</th>
                  <th className="p-2 border">email</th>
                  <th className="p-2 border">user_sub_id</th>
                  <th className="p-2 border">user_add_id</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.user_id}>
                    <td className="p-2 border">{u.user_id}</td>
                    <td className="p-2 border">{u.username}</td>
                    <td className="p-2 border">{u.email}</td>
                    <td className="p-2 border">{u.user_sub_id ?? '–'}</td>
                    <td className="p-2 border">{u.user_add_id ?? '–'}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-2 text-center text-gray-500">
                      Нет пользователей
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Подписки (таблица) */}
        <section className="mb-8/">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl">Подписки</h2>
            <button onClick={clearSubscriptions} className="text-sm text-red-600 hover:underline">
              Очистить таблицу
            </button>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {[
                    'subscription_id','user_id','title','start_date','expiry_date',
                    'price','renewal_type','paid_from','status',
                    'created_at','updated_at','is_locked','locked_by_user_id','creator_name'
                  ].map(col => (
                    <th key={col} className="p-2 border">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => (
                  <tr key={sub.subscription_id}>
                    <td className="p-2 border">{sub.subscription_id}</td>
                    <td className="p-2 border">{sub.user_id}</td>
                    <td className="p-2 border">{sub.title}</td>
                    <td className="p-2 border">{sub.start_date}</td>
                    <td className="p-2 border">{sub.expiry_date}</td>
                    <td className="p-2 border">{sub.price}</td>
                    <td className="p-2 border">{sub.renewal_type}</td>
                    <td className="p-2 border">{sub.paid_from}</td>
                    <td className="p-2 border">{sub.status ? 'true' : 'false'}</td>
                    <td className="p-2 border">{sub.created_at}</td>
                    <td className="p-2 border">{sub.updated_at}</td>
                    <td className="p-2 border">{sub.is_locked ? 'true' : 'false'}</td>
                    <td className="p-2 border">{sub.locked_by_user_id}</td>
                    <td className="p-2 border">{sub.creator_name}</td>
                  </tr>
                ))}
                {subscriptions.length === 0 && (
                  <tr>
                    <td colSpan={14} className="p-2 text-center text-gray-500">
                      Нет подписок
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Приглашения */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl">Приглашения</h2>
            <button onClick={clearInvitations} className="text-sm text-red-600 hover:underline">
              Очистить таблицу
            </button>
          </div>
          <ul className="list-disc pl-5">
            {invitations.map(i => (
              <li key={i.invitation_id} className="mb-1">
                Приглашение #{i.invitation_id}: от {i.sender_id} к {i.receiver_id}
              </li>
            ))}
            {invitations.length === 0 && (
              <li className="text-gray-500">Нет приглашений</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DebugPage;
