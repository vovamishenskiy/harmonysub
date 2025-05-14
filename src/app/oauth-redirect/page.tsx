'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from './loading';

export default function OAuthRedirectPage() {
    const router = useRouter();
    const params = useSearchParams();
    const to = params.get('to') || '/subscriptions';

    useEffect(() => {
        // 1) Забираем инфу о текущем пользователе с нашего API
        fetch('/api/getCurrentUser', { cache: 'no-store' })
            .then(res => res.json())
            .then(user => {
                // ожидаем { user_id, username, avatar_url }
                if (user.username) {
                    localStorage.setItem('username', user.username);
                    localStorage.setItem('avatar_url', user.avatar_url || '');
                }
            })
            .catch(console.error)
            .finally(() => {
                // 2) После записи в localStorage — перекидываем на subscriptions
                router.replace(to);
            });
    }, [router, to]);

    return (
        <Suspense fallback={<Loading />}>
            {null}
        </Suspense>
    )
}