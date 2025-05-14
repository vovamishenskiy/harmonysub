'use client';

import React, { useCallback, useMemo } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Subscription from '@/components/Subscription';
import SubscriptionSkeleton from '@/components/SubscriptionSkeleton';
import AddSubscriptionButton from '@/components/AddSubscriptionButton';
import { Metadata } from 'next';
import { usePersonalSubscriptions } from '../hooks/usePersonalSubscriptions';
import { useUserId } from '../hooks/useUserId';
import { useInvitedUser } from '../hooks/useInvitedUser';
import { useInvitationFlag } from '../hooks/useInvitationFlag';

const PersonalSubscriptions: React.FC = () => {
    const userId = useUserId();
    const isInvited = useInvitationFlag();
    const invitedUser = useInvitedUser(userId);
    const { subscriptions, loading, error, refetch } = usePersonalSubscriptions();

    const handleUpdate = useCallback(() => {
        refetch();
    }, [refetch]);

    const skeletons = useMemo(() => {
        const count = subscriptions.length || 1;
        return Array.from({ length: count }).map((_, i) => (
            <SubscriptionSkeleton key={i} />
        ));
    }, [subscriptions.length]);

    const cards = useMemo<React.ReactNode[]>(() =>
        subscriptions.map(sub => (
            <Subscription
                key={sub.subscription_id}
                subscription={sub}
                onUpdate={handleUpdate}
            />
        )),
        [subscriptions, handleUpdate]
    );

    return (
        <div className="flex flex-row">
            <Sidebar />

            <main className="flex flex-col lg:mt-3 lg:ml-4 sm:ml-3 w-full">
                {/* Заголовок с приглашённым */}
                {isInvited ? (
                    <h1 className="text-3xl mb-5 flex items-center gap-2">
                        Личные подписки
                        {invitedUser && (
                            <div className="flex items-center gap-1">
                                <span className="text-xl font-normal">+</span>
                                <Image
                                    src={invitedUser.avatar_url}
                                    alt={`Приглашённый ${invitedUser.username}`}
                                    title={`Приглашённый ${invitedUser.username}`}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                    priority
                                />
                            </div>
                        )}
                    </h1>
                ) : (
                    <h1 className="text-3xl mb-5">Личные подписки</h1>
                )}

                {/* Ошибки */}
                {error && (
                    <div className="text-red-500 mb-4">
                        {error}
                    </div>
                )}

                {/* Контент */}
                {loading ? (
                    <div className="space-y-4">{skeletons}</div>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {subscriptions.length > 0 ? (
                            <>{cards}</>
                        ) : (
                            <p>
                                У Вас ещё нет личных подписок, добавьте первую с помощью кнопки в правом
                                нижнем углу и отметив подписку как личную с помощью чекбокса
                            </p>
                        )}
                    </div>
                )}

                <AddSubscriptionButton onUpdate={handleUpdate} />
            </main>
        </div>
    );
};

export default React.memo(PersonalSubscriptions);