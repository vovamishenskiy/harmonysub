'use client';

import React, { useMemo, useCallback, useState } from 'react';
import Image from 'next/image';

import Sidebar from '@/components/Sidebar';
import Subscription from '@/components/Subscription';
import SubscriptionSkeleton from '@/components/SubscriptionSkeleton';
import AddSubscriptionButton from '@/components/AddSubscriptionButton';

import { useSubscriptions } from './hooks/useSubscriptions';
import { useUserId } from './hooks/useUserId';
import { useInvitedUser } from './hooks/useInvitedUser';
import { useInvitationFlag } from './hooks/useInvitationFlag';

export interface IUser {
  username: string;
  avatar_url: string;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const EXPIRING_WINDOW = 3 * MS_PER_DAY;

const Subscriptions: React.FC = () => {
  const userId = useUserId();
  const isInvited = useInvitationFlag();
  const invitedUser = useInvitedUser(userId);
  const { subscriptions, loading, error, refetch } = useSubscriptions();
  const [showActive, setShowActive] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);
  const [showExpiring, setShowExpiring] = useState(false);
  const [showExpired, setShowExpired] = useState(false);

  const handleUpdate = useCallback(() => {
    refetch();
  }, [refetch]);

  const filteredSubs = useMemo(() => {
    if (!showExpiring && !showCancelled && !showExpired && !showActive) {
      return subscriptions;
    }

    const now = Date.now();

    return subscriptions.filter(sub => {
      const expiryTime = new Date(sub.expiry_date).getTime();
      const delta = expiryTime - now;

      const isCancelled = sub.status === true;
      const isExpiring = !isCancelled && delta >= 0 && delta <= EXPIRING_WINDOW;
      const isExpired = !isCancelled && delta < 0;
      const isActive = sub.status === false && !isExpiring && delta > 3;

      return (showActive && isActive)
        || (showExpiring && isExpiring)
        || (showCancelled && isCancelled)
        || (showExpired && isExpired);
    });
  }, [subscriptions, showActive, showExpiring, showCancelled, showExpired]);

  const skeletons = useMemo(() => {
    const count = subscriptions.length || 1;
    return Array.from({ length: count }).map((_, i) => (
      <SubscriptionSkeleton key={i} />
    ));
  }, [subscriptions.length]);

  const cards = useMemo(() => {
    return filteredSubs.map(sub => {
      return (
        <Subscription
          key={sub.subscription_id}
          subscription={sub}
          onUpdate={handleUpdate}
        />
      );
    });
  }, [filteredSubs, handleUpdate]);

  return (
    <div className='flex flex-row'>
      <Sidebar />
      <main className="flex flex-col lg:mt-3 lg:ml-4 lg:mr-0 sm:ml-3 sm:mr-3 w-full">
        {isInvited ? (
          <h1 className="text-3xl mb-5 flex flex-row items-center gap-2 pt-4">
            Общие подписки
            {invitedUser && (
              <div className="flex flex-row items-center gap-1">
                <span className='text-xl font-normal'>+</span>
                <Image
                  src={invitedUser.avatar_url}
                  title={`Приглашённый пользователь ${invitedUser.username}`}
                  width={24} height={24}
                  alt={`Приглашённый пользователь ${invitedUser.username}`}
                  className="lg:h-6 lg:w-6 lg:mr-3 sm:mr-0 rounded-full"
                  priority
                />
              </div>
            )}
          </h1>
        ) : (
          <h1 className="text-3xl mb-5 pt-4">Подписки</h1>
        )}

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowActive(prev => !prev)}
            className={`px-3 py-1 rounded-xl min-h-9 min-w-[125px] transition-all hover:text-emerald-900 ${showActive
              ? 'border-2 border-emerald-700 text-white bg-emerald-700 hover:text-white'
              : 'border-2 border-emerald-700 text-gray-800 bg-transparent'}`}
          >
            Активные
          </button>
          <button
            onClick={() => setShowExpiring(prev => !prev)}
            className={`px-3 py-1 rounded-xl min-h-9 min-w-[125px] transition-all hover:text-emerald-900 ${showExpiring
              ? 'border-2 border-emerald-700 text-white bg-emerald-700 hover:text-white'
              : 'border-2 border-emerald-700 text-gray-800 bg-transparent'}`}
          >
            Истекающие
          </button>
          <button
            onClick={() => setShowExpired(prev => !prev)}
            className={`px-3 py-1 rounded-xl min-h-9 min-w-[125px] transition-all hover:text-emerald-900 ${showExpired
              ? 'border-2 border-emerald-700 text-white bg-emerald-700 hover:text-white'
              : 'border-2 border-emerald-700 text-gray-800 bg-transparent'}`}
          >
            Истёкшие
          </button>
          <button
            onClick={() => setShowCancelled(prev => !prev)}
            className={`px-3 py-1 rounded-xl min-h-9 min-w-[125px] transition-all hover:text-emerald-900 ${showCancelled
              ? 'border-2 border-emerald-700 text-white bg-emerald-700 hover:text-white'
              : 'border-2 border-emerald-700 text-gray-800 bg-transparent'}`}
          >
            Отменённые
          </button>
        </div>

        {error &&
          <div className="text-red-500 mb-4">
            {error}
          </div>
        }

        {loading ? (
          <div className="space y-4">{skeletons}</div>
        ) : (
          <div className="flex flex-row flex-wrap lg:items-start lg:justify-normal lg:gap-4 lg:mr-4 h-auto sm:items-center sm:gap-3 sm:justify-between">
            {subscriptions.length > 0 ? <>{cards}</> : (
              <p>
                У Вас ещё нет подписок, добавьте первую с помощью кнопки в правом
                нижнем углу
              </p>
            )}
          </div>
        )}

        <AddSubscriptionButton onUpdate={handleUpdate} />
      </main>
    </div>
  );
}

export default React.memo(Subscriptions);

// const Subscriptions: React.FC = () => {
//   const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [invitedUser, setInvitedUser] = useState<IUser | null>(null);
//   const [isInvited, setIsInvited] = useState(false);
//   const [error, setError] = useState('');
//   const [userId, setUserId] = useState(null);

//   const getUserId = async (username: string) => {
//     try {
//       const response = await fetch(`/api/getUserData?username=${username}`);
//       const data = await response.json();
//       if (response.ok) {
//         setUserId(data.user_id);
//       } else {
//         setError(data.error || 'Ошибка при получении данных пользователя');
//       }
//     } catch (error) {
//       setError('Ошибка при получении данных пользователя');
//       console.error('Ошибка при получении данных пользователя: ', error);
//     }
//   }

//   const fetchInvitedUser = (userId: number) => {
//     fetch(`/api/getSubUser?userId=${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (!data.error) {
//           setInvitedUser({ username: data.username, avatar_url: data.avatar_url });
//         }
//       })
//       .catch((err) => {
//         console.error('Ошибка при получении информации о приглашённом пользователе: ', err);
//       })
//   }



//   const checkedIfInvited = () => {
//     const isInvited = localStorage.getItem('isInvited');
//     let boolIsInvited: boolean = false;
//     if (isInvited) boolIsInvited = JSON.parse(isInvited);
//     setIsInvited(boolIsInvited);
//   }

//   useEffect(() => {
//     const storedUsername = localStorage.getItem('username');
//     if (storedUsername) getUserId(storedUsername);

//     if (userId) fetchInvitedUser(userId);
//     checkedIfInvited();

//     const interval = setInterval(fetchSubscriptions, 5000);
//     return () => clearInterval(interval);
//   }, [userId]);

//   return (
//     <div className='flex flex-row'>
//       <Sidebar />
//       <main className="flex flex-col lg:mt-3 lg:ml-4 lg:mr-0 sm:ml-3 sm:mr-3 w-full">
//         {isInvited ? (
//           <h1 className="text-3xl mb-5 flex flex-row items-center gap-2">
//             Подписки
//             {invitedUser && (
//               <div className="flex flex-row items-center gap-1">
//                 <span className='text-xl font-normal'>+</span>
//                 <Image src={invitedUser.avatar_url} title={`Приглашённый пользователь ${invitedUser.username}`} width={24} height={24} alt={`Приглашённый пользователь ${invitedUser.username}`} className="lg:h-6 lg:w-6 lg:mr-3 sm:mr-0 rounded-full" />
//               </div>
//             )}
//           </h1>
//         ) : (
//           <h1 className="text-3xl mb-5">Общие подписки</h1>
//         )}

//         {loading ? (
//           <div className="space-y-4">
//             {Array.from({ length: subscriptions.length || 1 }).map((_, index) => (
//               <SubscriptionSkeleton key={index} />
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-row flex-wrap lg:items-start lg:justify-normal lg:gap-4 h-auto
//             sm:items-center sm:gap-3 sm:justify-between">
//             {subscriptions.length > 0 ? (
//               subscriptions.map((subscription) => (
//                 <Subscription
//                   key={subscription.subscription_id}
//                   subscription={subscription}
//                   onUpdate={fetchSubscriptions}
//                 />
//               ))
//             ) : (
//               <p>У Вас ещё нет подписок, добавьте первую с помощью кнопки в правом нижнем углу</p>
//             )}
//           </div>
//         )}
//         <AddSubscriptionButton onUpdate={fetchSubscriptions} />
//       </main>
//     </div>
//   );
// };