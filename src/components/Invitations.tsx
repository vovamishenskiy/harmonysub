'use client';

import React, { useState, useEffect } from 'react';

interface Invitation {
    invite_id: number;
    senderusername: string;
}

const Invitations: React.FC = () => {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
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

    const fetchInvitations = async (userId: number) => {
        try {
            const response = await fetch(`/api/getInvitations?userId=${userId}`);
            const data = await response.json();

            if (response.ok) {
                setInvitations(data.invitations);
                console.log(data.invitations);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Ошибка при получении приглашений');
            console.error('Ошибка: ', error);
        }
    };

    const pollInvitations = async (userId: number) => {
        while (true) {
            await fetchInvitations(userId);
            await new Promise((resolve) => {
                setError('');
                setTimeout(resolve, 5000)
            });
        }
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) getUserId(storedUsername);
    }, []);

    useEffect(() => {
        if (userId) {
            fetchInvitations(userId);
            pollInvitations(userId);
        }
    }, [userId]);

    const handleAccept = async (invitationId: number) => {
        try {
            const response = await fetch('/api/acceptInvitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ invitationId }),
            });

            const data = await response.json();

            if (response.ok) {
                setInvitations(invitations.filter((invitation) => invitation.invite_id !== invitationId));
                setMessage('Приглашение принято');
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Ошибка при принятии приглашения');
            console.error('Ошибка при принятии приглашения: ', error);
        }
    }

    const handleDecline = async (invitationId: number) => {
        try {
            const response = await fetch('/api/declineInvitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ invitationId }),
            });

            const data = await response.json();

            if (response.ok) {
                setInvitations(invitations.filter((invitation) => invitation.invite_id !== invitationId));
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
        <div className='flex flex-col'>
            <h2 className='font-medium mb-2 mt-2'>Ваши приглашения</h2>
            {message && <p className='text-green-600 text-base'>{message}</p>}
            {error && <p className='text-red-500 text-base'>{error}</p>}
            <ul className='flex flex-row flex-wrap gap-3'>
                {invitations.map((invitation) => (
                    <li key={invitation.invite_id} className='flex flex-col gap-2 bg-slate-100 rounded-xl w-fit p-3'>
                        <p className='font-medium text-center'>Приглашение</p>
                        <div className="flex flex-row items-center gap-2">
                            <p className='text-slate-500'>Пользователь: </p>
                            <p>{invitation.senderusername}</p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <button onClick={() => handleAccept(invitation.invite_id)} className='btn w-1/2 bg-emerald-700 p-1 rounded-xl text-white'>
                                Принять
                            </button>
                            <button onClick={() => handleDecline(invitation.invite_id)} className='btn w-1/2 bg-red-600 p-1 rounded-xl text-white'>
                                Удалить
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Invitations;