import { useState, useEffect, useCallback } from 'react';
import type { IUser } from '../page';

export function useInvitedUser(userId: number | null) {
    const [invitedUser, setInvitedUser] = useState<IUser | null>(null);

    const fetchInvited = useCallback(async () => {
        if (!userId) return;

        try {
            const res = await fetch(`/api/getSubUser?userId=${userId}`);
            const data = await res.json();

            if (!data.error) {
                setInvitedUser({
                    username: data.username,
                    avatar_url: data.avatar_url,
                });
            }
        } catch (err) {
            console.error('Ошибка при получении приглашённого пользователя: ', err);
        }
    }, [userId]);

    useEffect(() => {
        fetchInvited();
    }, [fetchInvited]);

    return invitedUser;
}