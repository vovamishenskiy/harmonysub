import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useCurrentUser() {
    const [avatarUrl, setAvatarUrl] = useLocalStorage('avatar_url');
    const [username, setUsername] = useLocalStorage('username');
    const [userId, setUserId] = useState<number | null>(null);

    const fetchUserId = useCallback(async (storedUsername: string) => {
        try {
            const res = await fetch(`/api/getUserData?username=${encodeURIComponent(storedUsername)}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Fetch userId failed');
            const data = await res.json();
            setUserId(data.user_id);
        } catch (err) {
            console.error('Ошибка при получении userId:', err);
        }
    }, []);

    useEffect(() => {
        if (username) {
            fetchUserId(username);
        } else {
            setUserId(null);
        }
    }, [username, fetchUserId]);

    return { avatarUrl, username, userId, setAvatarUrl, setUsername };
}
