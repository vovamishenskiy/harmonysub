import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key: string) {
    const [value, setValue] = useState<string | null>(() => {
        if(typeof window === 'undefined') return null;
        return localStorage.getItem(key);
    });

    useEffect(() => {
        if(typeof window === 'undefined') return;
        const onStorage = (e: StorageEvent) => {
            if(e.key === key) setValue(e.newValue);
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [key]);

    const onSetValue = useCallback((newVal: string | null) => {
        if(typeof window !== 'undefined') {
            if(newVal === null) localStorage.removeItem(key);
            else localStorage.setItem(key, newVal);
            setValue(newVal);
        }
    }, [key]);

    return [value, onSetValue] as const;
}