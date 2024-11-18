'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;

interface Subscription {
    subscription_id: number;
    title: string;
    description: string;
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

const DebugPage = () => {
    const [users, setUsers] = useState([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const username = localStorage.getItem('username');

            if (username === ADMIN_USERNAME) {
                setIsAdmin(true);
            } else {
                alert('Доступ запрещён.');
                router.push('/');
            }
        }
    }, [router]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/debug/getAllUsers');
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Ошибка при загрузке пользователей');
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const response = await fetch('/api/debug/getAllSubscriptions');
            const data = await response.json();
            if (response.ok) {
                setSubscriptions(data);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Ошибка при загрузке подписок');
        }
    };

    const fetchInvitations = async () => {
        try {
            const response = await fetch('/api/debug/getAllInvitations');
            const data = await response.json();
            if (response.ok) {
                setInvitations(data);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Ошибка при загрузке приглашений');
        }
    };

    const deleteUser = async (userId: number) => {
        try {
            const response = await fetch('/api/debug/deleteUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                alert('Пользователь удалён');
                fetchUsers();
            } else {
                const data = await response.json();
                alert(data.error || 'Ошибка удаления пользователя');
            }
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
        }
    };

    const deleteSubscription = async (subscriptionId: number) => {
        try {
            const response = await fetch('/api/debug/deleteSubscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriptionId }),
            });

            if (response.ok) {
                alert('Подписка удалена');
                setSubscriptions((prevSubscriptions) =>
                    prevSubscriptions.filter((sub) => sub.subscription_id !== subscriptionId)
                );
                closeModal();
                fetchSubscriptions();
            } else {
                const data = await response.json();
                alert(data.error || 'Ошибка удаления подписки');
            }
        } catch (error) {
            console.error('Ошибка при удалении подписки:', error);
        }
    };

    const openSubscriptionDetails = (subscription: any) => {
        setSelectedSubscription(subscription);
    };

    const openInvitationDetails = (invitation: any) => {
        setSelectedInvitation(invitation);
    };

    const closeModal = () => {
        setSelectedSubscription(null);
        setSelectedInvitation(null);
    };

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
            fetchSubscriptions();
            fetchInvitations();
        }
    }, [isAdmin]);

    if (!isAdmin) return null;

    return (
        <div className="flex flex-row">
            <Sidebar />
            <main className="flex flex-col lg:mt-3 lg:ml-4 lg:mr-0 sm:ml-3 sm:mr-3 w-full">
                <h1 className="text-3xl mb-5">Отладка</h1>

                {error && <p className='text-red-500'>{error}</p>}

                <div className="flex flex-row justify-between items-start max-w-3xl">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg">Пользователи</h2>
                        <ul>
                            {users.map((user: any) => (
                                <li key={user.user_id} className='hover:text-emerald-600 cursor-pointer'>
                                    {user.username} (ID: {user.user_id})
                                    <button className='ml-4 text-red-500' onClick={() => deleteUser(user.user_id)}>Удалить</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg">Подписки</h2>
                        <ul>
                            {subscriptions.map((sub: any) => (
                                <li key={sub.subscription_id} className='hover:text-emerald-600 cursor-pointer'>
                                    <button onClick={() => openSubscriptionDetails(sub)}>
                                        {sub.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg">Приглашения</h2>
                        <ul>
                            {invitations.map((inv: any) => (
                                <li key={inv.invitation_id} className='hover:text-emerald-600 cursor-pointer'>
                                    <button className="text-blue-600" onClick={() => openInvitationDetails(inv)}>
                                        От: {inv.sender_id}, Кому: {inv.receiver_id}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {selectedSubscription && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
                            <h2 className="text-2xl mb-2">Информация о подписке</h2>
                            <p><strong>ID:</strong> {selectedSubscription.subscription_id}</p>
                            <p><strong>Название:</strong> {selectedSubscription.title}</p>
                            <p><strong>Дата начала:</strong> {new Date(selectedSubscription.start_date).toLocaleString()}</p>
                            <p><strong>Дата окончания:</strong> {new Date(selectedSubscription.expiry_date).toLocaleString()}</p>
                            <p><strong>Цена:</strong> {selectedSubscription.price}</p>
                            <p><strong>Тип продления:</strong> {selectedSubscription.renewal_type}</p>
                            <p><strong>Оплачено с:</strong> {selectedSubscription.paid_from}</p>
                            <p><strong>Статус:</strong> {selectedSubscription.status ? 'Активно' : 'Не активно'}</p>
                            <p><strong>Дата создания:</strong> {new Date(selectedSubscription.created_at).toLocaleString()}</p>
                            <p><strong>Дата обновления:</strong> {new Date(selectedSubscription.updated_at).toLocaleString()}</p>
                            <p><strong>Заблокировано:</strong> {selectedSubscription.is_locked ? 'Да' : 'Нет'}</p>
                            <p><strong>Заблокировано пользователем:</strong> {selectedSubscription.locked_by_user_id}</p>
                            <p><strong>Создатель подписки:</strong> {selectedSubscription.creator_name}</p>
                            <div className="flex flex-row gap-4 items-end">
                                <div className="mt-4">
                                    <button
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                        onClick={() => deleteSubscription(selectedSubscription.subscription_id)}
                                    >
                                        Удалить подписку
                                    </button>
                                </div>
                                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 h-fit" onClick={closeModal}>
                                    Закрыть
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Модальное окно для приглашения */}
                {selectedInvitation && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Информация о приглашении</h2>
                            <p>ID: {selectedInvitation.invitation_id}</p>
                            <p>Отправитель: {selectedInvitation.sender_id}</p>
                            <p>Получатель: {selectedInvitation.receiver_id}</p>
                            <button className="mt-4 text-red-600" onClick={closeModal}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DebugPage;
