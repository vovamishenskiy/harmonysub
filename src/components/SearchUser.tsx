'use client';

import React, { useState, useEffect } from 'react';

const SearchUser = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            fetch(`/api/getUserData?username=${storedUsername}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.user_id) {
                        setUserId(data.user_id);
                    }
                })
                .catch((err) => {
                    console.error('Ошибка при загрузке данных пользователя: ', err);
                });
        }
    }, []);

    const handleInvite = async () => {
        try {
            const response = await fetch('/api/inviteUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, userId }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Приглашение отправлено');
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Ошибка при отправке приглашения');
            console.error('Ошибка при отправке пришлашения: ', error);
        }
    };

    return (
        <div className='flex flex-row items-center gap-2'>
            <input type="text" className='block w-1/6 p-2 border rounded-xl bg-transparent h-12 outline-none' placeholder='Введите имя пользователя' value={username} onChange={(e) => setUsername(e.target.value)} />
            <button onClick={handleInvite} className='btn bg-emerald-700 text-white p-2 rounded-xl'>Пригласить</button>
            {message && <p>{message}</p>}
        </div>
    )
}

export default SearchUser;