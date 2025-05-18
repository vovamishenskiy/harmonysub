'use client';

import React, { useState, useEffect } from 'react';

interface IInvitedUsers {
    invite_id: number;
    senderusername: string;
    recipientusername: string;
}

const InvitedUsers: React.FC = () => {
    const [invitedUsers, setInvitedUsers] = useState<IInvitedUsers[]>([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

    const getUserId = async (username: string) => {
        try {
            const response = await fetch(`/api/getUserData?username=${username}`);
            const data = await response.json();
            if (response.ok) {
                setUserId(data.user_id);
            } else {
                setError(data.error || 'Ошибка при получении данных пользователя');
            }
        } catch (error) {
            setError('Ошибка при получении данных пользователя');
            console.error('Ошибка при получении данных пользователя: ', error);
        }
    }

    const fetchInvitedUsers = async (userId: number) => {
        try {
            const response = await fetch(`/api/getInvitedUsers?userId=${userId}`);
            const data = await response.json();

            if (response.ok) {
                setInvitedUsers(data.invited_user);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Ошибка при получении приглашений');
            console.error('Ошибка: ', error);
        }
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) getUserId(storedUsername);
    }, []);

    useEffect(() => {
        if (userId) fetchInvitedUsers(userId);
    }, [userId]);

    const handleDelete = async (userId: number) => {
        const storedUsername = localStorage.getItem('username');

        try {
            const response = await fetch('/api/deleteInvitedUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();

            if (response.ok) {
                setInvitedUsers(invitedUsers.filter((invitedUser) => invitedUser.senderusername === storedUsername));
                localStorage.removeItem('isInvited');
                setMessage('Приглашение удалено');
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Ошибка при удалении приглашения');
            console.error('Ошибка при удалении приглашения: ', error);
        }
    }

    return (
        <div className='flex flex-col w-fit'>
            <h2 className='font-medium mb-2 mt-2'>Приглашённые пользователи</h2>
            {message && <p className='text-green-600 text-base'>{message}</p>}
            {error && <p className='text-red-500 text-base'>{error}</p>}
            <ul className='flex flex-row flex-wrap gap-3 w-fit ml-auto mr-auto'>
                {invitedUsers.map((invitedUser) => (
                    <li key={invitedUser.invite_id} className='flex flex-col items-center justify-center w-fit gap-2 rounded-lg background-[rgb(241 245 249)] p-3'>
                        {invitedUser.recipientusername}
                        <button onClick={() => handleDelete(Number(userId))}>Удалить приглашение</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default InvitedUsers;