import React, { useState, useMemo, useCallback } from 'react';

export function useCurrentUser() {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    React.useEffect(() => {
        const storedAvatar = localStorage.getItem('avatar_url');
        const storedUser = localStorage.getItem('username');
        setAvatarUrl(storedAvatar);
        setUsername(storedUser);

        if (storedUser) {
            fetch(`/api/getUserData?username=${storedUser}`, { credentials: 'include' })
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(data => setUserId(data.user_id))
                .catch(console.error);
        }
    }, []);

    return { avatarUrl, username, userId };
}