import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface ISubscription {
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
    logoUrl?: string;
};

export function useSubscriptions(pollInterval = 5000) {
    const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String | null>(null);
    const intervalRef = useRef<NodeJS.Timeout>();

    const fetchSubscriptions = useCallback(async () => {
        try {
            const res = await fetch('/api/subscriptions', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const text = await res.text();
                setError(`Ошибка ${res.status}`);
                return;
            }

            const data: ISubscription[] = await res.json();
            setSubscriptions(data);
        } catch (err) {
            setError('Сетевая ошибка при загрузке подписок');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubscriptions();
        intervalRef.current = setInterval(fetchSubscriptions, pollInterval);
        return () => clearInterval(intervalRef.current);
    }, [fetchSubscriptions, pollInterval]);

    const subsMemo = useMemo(() => subscriptions, [subscriptions]);

    return {
        subscriptions: subsMemo,
        loading,
        error,
        refetch: fetchSubscriptions,
    };
}