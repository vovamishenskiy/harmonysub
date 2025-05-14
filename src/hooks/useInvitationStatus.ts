import React, { useState, useMemo, useCallback } from 'react';

export function useInvitationStatus(userId: number | null) {
    const [isInvited, setIsInvited] = useState(false);
    const [isBeingInvited, setIsBeingInvited] = useState(false);

    React.useEffect(() => {
        if (!userId) return;

        fetch(`/api/checkInvitedUsers?userId=${userId}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setIsInvited(data.status);
                localStorage.setItem('isInvited', JSON.stringify(data.status));
            })
            .catch(console.error);

        fetch(`/api/checkBeingInvited?userId=${userId}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setIsBeingInvited(data.status);
                localStorage.setItem('isBeingInvited', JSON.stringify(data.status));
            })
            .catch(console.error);
    }, [userId]);

    return { isInvited, isBeingInvited };
}