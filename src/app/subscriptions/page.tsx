'use client';

import React, { useEffect, useState } from 'react';
import Subscription from '@/components/Subscription';
import SubscriptionSkeleton from '@/components/SubscriptionSkeleton';
import Sidebar from '@/components/Sidebar';

interface ISubscription {
  title: string;
  price: number;
  renewalType: string;
  startDate: string;
  expiryDate: string;
  paidFrom: string;
  status: string;
};

const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <div className='flex flex-row'>
      <Sidebar />
      <main className="flex flex-col mt-3 ml-4">
        <h1 className="text-3xl mb-5">Подписки</h1>
        {loading ? (
          <div className="space-y-4">
            <SubscriptionSkeleton />
            <SubscriptionSkeleton />
            <SubscriptionSkeleton />
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription, index) => (
                <Subscription key={index} subscription={subscription} />
              ))
            ) : (
              <p>Подписок нет</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Subscriptions;