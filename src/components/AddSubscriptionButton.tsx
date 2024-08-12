'use client';

import React, { useEffect, useState } from 'react';
import { PlusIcon, XMarkIcon, CalendarDateRangeIcon, CreditCardIcon } from '@heroicons/react/24/outline';
// @ts-ignore
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AddSubscriptionButtonProps {
    onUpdate: () => void;
}

const AddSubscriptionButton: React.FC<AddSubscriptionButtonProps> = ({ onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const [subscriptionName, setSubscriptionName] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [price, setPrice] = useState('');
    const [renewalType, setRenewalType] = useState('1');
    const [paymentCard, setPaymentCard] = useState('')
    const [isStopped, setIsStopped] = useState(false);
    const [isPersonal, setIsPersonal] = useState(false);

    const handleOpenClose = (e: any) => {
        e.stopPropagation();
        setOpen(!open);
    }

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
            fetch(`/api/getUserData?username=${storedUsername}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.user_id) {
                        setUserId(data.user_id);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Ошибка при загрузке данных пользователя: ', err);
                    setLoading(false);
                });
        }
    }, []);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!userId || !startDate) return;

        const formatDate = (date: Date) => {
            const offset = date.getTimezoneOffset();
            const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
            return adjustedDate.toISOString().split('T')[0];
        }

        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + parseInt(renewalType, 10));

        const newSubscription = {
            user_id: userId,
            title: subscriptionName,
            start_date: formatDate(startDate),
            expiry_date: formatDate(expiryDate),
            price,
            renewal_type: renewalType,
            paid_from: paymentCard,
            status: isStopped,
            personal: isPersonal,
        }

        fetch('/api/addSubscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSubscription),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log('Ошибка при добавлении подписки: ', data.error);
                } else {
                    setOpen(false);
                    setSubscriptionName('');
                    setStartDate(null);
                    setPrice('');
                    setRenewalType('1');
                    setPaymentCard('');
                    setIsStopped(false);
                    setIsPersonal(false);
                    onUpdate();
                }
            })
            .catch((err) => {
                console.error('Ошибка при добавлении подписки: ', err);
            })
    }

    return (
        <>
            {open ? (
                <div className='w-full h-full z-[212] sm:px-3 lg:px-0 opacity-100 bg-gray-800/75 flex items-center justify-center absolute top-0 left-0 cursor-pointer' onClick={handleOpenClose}>
                    <div className="lg:w-1/3 sm:w-full h-auto rounded-xl p-4 bg-white opacity-100 cursor-default z-10" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-row items-baseline justify-between">
                            <p className="text-lg mb-4">Добавить подписку</p>
                            <button onClick={handleOpenClose} className="btn"><XMarkIcon className='w-6 h-6' /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Название подписки</label>
                                <input
                                    type="text"
                                    className="block w-full p-2 border rounded-xl bg-transparent h-12 outline-none"
                                    value={subscriptionName}
                                    onChange={(e) => setSubscriptionName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Дата начала подписки</label>
                                <div className="flex flex-row items-center gap-1 flex-shrink-0">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date: any) => setStartDate(date)}
                                        className="block lg:w-[589px] sm:w-full p-2 border rounded-xl bg-transparent h-12 outline-none"
                                        dateFormat="dd/MM/yyyy"
                                        required
                                    />
                                    <CalendarDateRangeIcon className='min-w-5 min-h-5 sm:minx-w-5 sm:max-w-5' />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Цена</label>
                                <div className="flex flex-row gap-2 items-center">
                                    <input
                                        type="text"
                                        className="block w-[97%] p-2 border rounded-xl bg-transparent h-12 outline-none"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                    ₽
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Тип продления подписки</label>
                                <select
                                    className="block w-full p-2 border rounded-xl bg-transparent h-12 outline-none"
                                    value={renewalType}
                                    onChange={(e) => setRenewalType(e.target.value)}
                                    required
                                >
                                    <option value="1">1 день</option>
                                    <option value="3">3 дня</option>
                                    <option value="7">7 дней</option>
                                    <option value="14">14 дней</option>
                                    <option value="30">1 месяц</option>
                                    <option value="60">2 месяца</option>
                                    <option value="90">3 месяца</option>
                                    <option value="180">6 месяцев</option>
                                    <option value="365">12 месяцев</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Откуда оплачивается подписка (последние 4 цифры карты)</label>
                                <div className="flex flex-row gap-1 items-center flex-shrink-0">
                                    <input
                                        type="text"
                                        className="block lg:w-[589px] sm:w-full p-2 border rounded-xl bg-transparent h-12 outline-none flex-shrink-0"
                                        value={paymentCard}
                                        onChange={(e) => setPaymentCard(e.target.value)}
                                        maxLength={4}
                                        required
                                    />
                                    <CreditCardIcon className='min-w-5 min-h-5 sm:hidden lg:block' />
                                </div>
                            </div>
                            <div className="mb-4 flex flex-col gap-4">
                                <div className="flex gap-2 items-center">
                                    <span>Подписка остановлена?</span>
                                    <input
                                        type="checkbox"
                                        checked={isStopped}
                                        onChange={(e) => setIsStopped(e.target.checked)}
                                    />
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span title='Если подписка личная, то она не будет видна у приглашённого пользователя'>Личная подписка?</span>
                                    <input
                                        type="checkbox"
                                        checked={isPersonal}
                                        onChange={(e) => setIsPersonal(e.target.checked)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary bg-emerald-800 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl"
                                >
                                    Добавить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <button className="
                    btn btn-primary bg-emerald-800 hover:bg-emerald-700 
                    fixed lg:bottom-10 lg:right-10 w-14 h-14 flex 
                    justify-center items-center rounded-full 
                    transition ease-in-out duration-200 hover:rotate-90 lg:z-[211]
                    sm:z-[-1] sm:bottom-14 sm:right-2
                "
                    onClick={handleOpenClose}>
                    <PlusIcon className='w-8 h-8 text-white' />
                </button>
            )}


        </>
    )
};

export default AddSubscriptionButton;