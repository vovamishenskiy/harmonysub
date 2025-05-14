import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useLogout(onLogout?: () => void) {
    const router = useRouter();
    return useCallback(async () => {
        try {
            const res = await fetch('/api/logout', { method: 'POST' });
            if (res.ok) {
                ['avatar_url', 'username', 'isInvited', 'isBeingInvited'].forEach(key => localStorage.removeItem(key));
                onLogout?.();
                router.push('/');
            }
        } catch (err) {
            console.error('Logout error', err);
        }
    }, [onLogout, router]);
}