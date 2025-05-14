import { useState, useEffect } from 'react';

export function useInvitationFlag() {
    const [isInvited, setIsInvited] = useState(false);

    useEffect(() => {
        const flag = localStorage.getItem('isInvited');
        setIsInvited(flag ? JSON.parse(flag) : false);
    }, []);

    return isInvited;
}