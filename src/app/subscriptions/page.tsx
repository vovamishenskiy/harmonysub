'use client';

import React, { useEffect, useState } from 'react';
import Subscription from '@/components/Subscription';
import SubscriptionSkeleton from '@/components/SubscriptionSkeleton';
import Sidebar from '@/components/Sidebar';
import AddSubscriptionButton from '@/components/AddSubscriptionButton';
import Image from 'next/image';

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
};

interface IUser {
  username: string;
  avatar_url: string;
}

const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [invitedUser, setInvitedUser] = useState<IUser | null>(null);

  const fetchSubscriptions = () => {
    fetch('/api/subscriptions')
      .then((res) => res.json())
      .then((data) => {
        setSubscriptions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка при получении подписок: ', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const interval = setInterval(fetchSubscriptions, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex flex-row'>
      <Sidebar />
      <main className="flex flex-col lg:mt-3 lg:ml-4 lg:mr-0 sm:ml-3 sm:mr-3 w-full">
        <div className="flex flex-row gap-2">
          <h1 className="text-3xl mb-5">Подписки</h1>
          {invitedUser && (
            <div className="flex flex-row gap-1">
              <span className='text-3xl'>+</span>
              <Image src={invitedUser.avatar_url} width={24} height={24} alt={`Приглашённый пользователь ${invitedUser.username}`} className="lg:h-6 lg:w-6 lg:mr-3 sm:mr-0 rounded-full" />
            </div>
          )}
        </div>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: subscriptions.length || 1 }).map((_, index) => (
              <SubscriptionSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-row flex-wrap lg:items-start lg:justify-normal lg:gap-4 h-auto
            sm:items-center sm:gap-3 sm:justify-between">
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription) => (
                <Subscription
                  key={subscription.subscription_id}
                  subscription={subscription}
                  onUpdate={fetchSubscriptions}
                />
              ))
            ) : (
              <p>У Вас ещё нет подписок, добавьте первую с помощью кнопки в правом нижнем углу</p>
            )}
          </div>
        )}
        <AddSubscriptionButton onUpdate={fetchSubscriptions} />
      </main>
    </div>
  );
};

export default Subscriptions;