import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export interface ISubscription {
    subscription_id: number;
    user_id: number;
    title: string;
    price: number;
    renewal_type: string;
    start_date: string;
    expiry_date: string;
    paid_from: string;
    status: boolean;
    is_locked: boolean;
    locked_by_user_id: number | null;
}

export function usePersonalSubscriptions(pollInterval = 5000) {
    const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout>();

    const fetchPersonalSubscriptions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/getPersonalSubscriptions', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) {
                const text = await res.text();
                setError(`Ошибка ${res.status}`);
                console.error('[usePersonalSubscriptions]', text);
                return;
            }
            const data: ISubscription[] = await res.json();
            setSubscriptions(data);
        } catch (err) {
            console.error('[usePersonalSubscriptions]', err);
            setError('Сетевая ошибка при загрузке личных подписок');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPersonalSubscriptions();
        intervalRef.current = setInterval(fetchPersonalSubscriptions, pollInterval);
        return () => clearInterval(intervalRef.current);
    }, [fetchPersonalSubscriptions, pollInterval]);

    const subsMemo = useMemo(() => subscriptions, [subscriptions]);

    return {
        subscriptions: subsMemo,
        loading,
        error,
        refetch: fetchPersonalSubscriptions
    };
}
