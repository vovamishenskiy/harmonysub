'use client';

import React, { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
// @ts-ignore
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddSubscriptionButton = () => {
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

    const handleOpen = (e: any) => {
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

        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + parseInt(renewalType, 10));

        const newSubscription = {
            user_id: userId,
            title: subscriptionName,
            start_date: startDate.toISOString().split('T')[0],
            expiry_date: expiryDate.toISOString().split('T')[0],
            price,
            renewal_type: renewalType,
            paid_from: paymentCard,
            status: isStopped,
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
                }
            })
            .catch((err) => {
                console.error('Ошибка при добавлении подписки: ', err);
            })
    }

    return (
        <>
            {open && (
                <div className='w-full h-full opacity-70 bg-gray-800 flex items-center justify-center absolute top-0 left-0 cursor-pointer' onClick={handleOpen}>
                    <div className="w-1/3 h-auto rounded-xl p-4 bg-white cursor-default" onClick={(e) => e.stopPropagation()}>
                        <p className="text-lg mb-4">Добавить подписку</p>
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
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date: Date) => setStartDate(date)}
                                    className="block w-full p-2 border rounded-xl bg-transparent h-12 outline-none"
                                    dateFormat="dd/MM/yyyy"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Цена</label>
                                <input
                                    type="number"
                                    className="block w-full p-2 border rounded-xl bg-transparent h-12 outline-none"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
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
                                <label className="block text-sm font-medium text-gray-700">Откуда подписка оплачивается (последние 4 цифры карты)</label>
                                <input
                                    type="text"
                                    className="block w-full p-2 border rounded-xl bg-transparent h-12 outline-none"
                                    value={paymentCard}
                                    onChange={(e) => setPaymentCard(e.target.value)}
                                    maxLength={4}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Статус подписки</label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isStopped}
                                        onChange={(e) => setIsStopped(e.target.checked)}
                                    />
                                    <span className="ml-2">Остановлена</span>
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
            )}

            <button className="
                btn btn-primary bg-emerald-800 hover:bg-emerald-700 
                absolute bottom-10 right-10 w-14 h-14 flex 
                justify-center items-center rounded-full 
                transition ease-in-out duration-200 hover:rotate-90
            "
                onClick={handleOpen}>
                <PlusIcon className='w-8 h-8 text-white' />
            </button>
        </>
    )
};

export default AddSubscriptionButton;