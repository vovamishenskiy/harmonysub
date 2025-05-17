'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CreditCardIcon, PencilIcon, ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import { PlayIcon, StopIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import EditSubscription from "@/components/EditSubscriptions";
import { addDays, addMonths, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Image from 'next/image';
import { services, ServiceList } from '@/lib/services';

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
}

interface SubscriptionProps {
    subscription: ISubscription;
    onUpdate: () => void;
    logoUrl?: string;
}

// Хук для получения текущего userId из localStorage
function useCurrentUser() {
    const [currentUser, setCurrentUser] = useState<number | null>(null);

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) return;

        fetch(`/api/getUserData?username=${username}`)
            .then(res => res.json())
            .then(data => {
                if (data.user_id) setCurrentUser(data.user_id);
            })
            .catch(console.error);
    }, []);

    return currentUser;
}

// Преобразование даты в строку вида "10 октября 2025"
const formatDate = (date: Date) => format(date, 'd MMMM yyyy', { locale: ru });

// Вычисление даты окончания с учётом календарных месяцев
const calculateExpiryDate = (startISO: string, renewalType: string) => {
    const start = new Date(startISO);
    const amount = parseInt(renewalType, 10);

    if (amount < 30) {
        return addDays(start, amount);
    }
    return addMonths(start, Math.floor(amount / 30));
};

// Отображение типа возобновления
const renewalMap: Record<string, string> = {
    '1': '1 день',
    '3': '3 дня',
    '7': '7 дней',
    '14': '14 дней',
    '30': '1 месяц',
    '60': '2 месяца',
    '90': '3 месяца',
    '180': '6 месяцев',
    '365': '12 месяцев'
};
const formatRenewalType = (rt: string) => renewalMap[rt] ?? 'Неизвестно';

const Subscription: React.FC<SubscriptionProps> = React.memo(({ subscription, onUpdate }) => {
    const currentUser = useCurrentUser();
    const [editing, setEditing] = useState(false);
    const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

    const expiryDate = useMemo(
        () => calculateExpiryDate(subscription.start_date, subscription.renewal_type),
        [subscription.start_date, subscription.renewal_type]
    );

    const formattedStart = useMemo(
        () => formatDate(new Date(subscription.start_date)),
        [subscription.start_date]
    );

    const formattedExpiry = useMemo(
        () => formatDate(expiryDate),
        [expiryDate]
    );

    const formattedPrice = useMemo(
        () => `${Math.round(subscription.price)} ₽`,
        [subscription.price]
    );

    const renewalTypeLabel = useMemo(
        () => formatRenewalType(subscription.renewal_type),
        [subscription.renewal_type]
    );

    const isExpiring = useMemo(() => {
        const diffDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
    }, [expiryDate]);

    const isExpired = useMemo(() => expiryDate.getTime() < Date.now(), [expiryDate]);

    const handleEdit = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUser) return;

        const res = await fetch('/api/lockSubscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscriptionId: subscription.subscription_id, userId: currentUser })
        });

        const data = await res.json();
        if (res.ok) setEditing(true);
        else alert(data.error ?? 'Не удалось заблокировать подписку');
    }, [currentUser, subscription.subscription_id]);

    const toggleMobileDetails = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setMobileDetailsOpen(open => !open);
    }, []);

    const service = services.find(s => s.name === subscription.title);
    const logoUrl = service?.logoUrl;

    return (
        <>
            {/* Desktop */}
            <div className="lg:block sm:hidden lg:h-[120px] min-w-[270px]">
                <Card className='bg-slate-100 p-2 pb-6 rounded-xl w-full h-full'>
                    <CardHeader className="flex items-center justify-between py-0">
                        <div className="flex flex-row items-center gap-2 pr-3">
                            {logoUrl && (
                                <div className="w-8 h-8 rounded-xl overflow-hidden mt-[4px]">
                                    <Image
                                        src={logoUrl}
                                        alt={subscription.title}
                                        width={32}
                                        height={32}
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                            )}
                            {!logoUrl && (
                                <div className="w-8 h-8 rounded-xl bg-stone-200 flex items-center justify-center pt-1 pl-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>
                                </div>
                            )}
                            <h2
                                className="text-2xl cursor-pointer hover:text-emerald-700 pr-2 overflow-x-hidden max-w-[330px] whitespace-nowrap"
                                onClick={handleEdit}
                            >
                                {subscription.title}
                            </h2>
                        </div>
                        <div className='flex flex-col items-center justify-center h-8 pt-[2.9px]'>
                            <p className='text-xl'>{formattedPrice}</p>
                        </div>
                    </CardHeader>
                    <CardBody className='py-0 mb-0 mt-auto'>
                        {!subscription.status && !isExpiring && !isExpired &&
                            <div className="flex flex-row gap-2">
                                <span className="ml-10 px-2 py-1 text-sm text-black bg-[#80ed99BF] rounded-[10px] flex flex-row items-center justify-center">
                                    Активна
                                </span>
                                <p className='pb-[4px]'>до {formattedExpiry}</p>
                            </div>
                        }
                        {
                            !subscription.status && isExpired &&
                            <div className='flex flex-row items-center gap-2'>
                                <span className="ml-10 px-2 py-1 text-sm text-red-700 bg-red-200 rounded-[10px] flex flex-row items-center justify-center">
                                    Истекла
                                </span>
                                <p className='pb-[4px]'>до {formattedExpiry}</p>
                            </div>
                        }
                        {subscription.status &&
                            <div className="flex flex-row gap-2">
                                <span className="ml-10 px-2 py-1 text-sm text-black bg-stone-200 rounded-[10px] flex flex-row items-center justify-center">
                                    Отменена
                                </span>
                                <p className='pt-[1px]'>{formattedExpiry}</p>
                            </div>
                        }
                        {!subscription.status && isExpiring && !isExpired &&
                            <div className='flex flex-row items-center gap-2'>
                                <span className="ml-10 px-2 py-1 text-sm text-red-700 bg-red-200 rounded-[10px] flex flex-row items-center justify-center">
                                    <span className="inline-block w-2 h-2 bg-red-700 rounded-full animate-pulse mr-2" />
                                    Истекает
                                </span>
                                <p className='pb-[4px]'>до {formattedExpiry}</p>
                            </div>
                        }
                    </CardBody>
                </Card>
            </div>

            {/* Mobile */}
            <div className="lg:hidden sm:block w-full">
                <Card className="bg-slate-100 p-3 rounded-xl min-w-[200px]">
                    <CardHeader onClick={toggleMobileDetails} className="flex items-center p-0">
                        <h2 className="text-2xl hover:text-emerald-700 cursor-pointer">{subscription.title}</h2>
                        <div className="ml-auto flex gap-2">
                            <PlayIcon className="w-6 h-6 text-green-600" />
                            <StopIcon className="w-6 h-6 text-red-600" />
                            <ArrowPathRoundedSquareIcon className="w-6 h-6 text-blue-700" />
                        </div>
                    </CardHeader>

                    {mobileDetailsOpen && (
                        <CardBody className="flex flex-col gap-2 pt-2">
                            <p className="flex justify-between text-sm">{formattedStart}</p>
                            <p className="flex justify-between text-sm">{formattedExpiry}</p>
                            <p className="flex justify-between text-sm">{renewalTypeLabel}</p>
                            <div className="flex items-center pt-1">
                                {isExpiring && <span className="px-2 text-sm text-white bg-red-500 rounded-full">Истекает</span>}
                                <button onClick={handleEdit} className="ml-auto">
                                    <PencilIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </CardBody>
                    )}
                </Card>
            </div>

            {/* Edit Modal */}
            {editing && (
                <EditSubscription
                    subscription={subscription}
                    onClose={() => setEditing(false)}
                    onUpdate={onUpdate}
                    currentUser={currentUser}
                />
            )}
        </>
    );
});

Subscription.displayName = 'Subscripton';

export default Subscription;