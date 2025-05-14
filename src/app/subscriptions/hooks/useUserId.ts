'use client';

import { useState, useEffect } from 'react';

export function useUserId(): number | null {
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const storedUsername = window.localStorage.getItem('username');
        if (!storedUsername) return;

        fetch(`/api/getUserData?username=${encodeURIComponent(storedUsername)}`, {
            method: 'GET',
            cache: 'no-store',
        })
            .then(res => res.json())
            .then(data => {
                if (data.user_id) {
                    setUserId(data.user_id);
                } else {
                    console.error('Ошибка в ответе getUserData:', data);
                }
            })
            .catch(err => {
                console.error('Ошибка при получении userId:', err);
            });
    }, []);

    return userId;
}