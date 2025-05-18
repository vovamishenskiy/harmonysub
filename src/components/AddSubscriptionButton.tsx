'use client';

import React, { useEffect, useState, useRef } from 'react';
import { PlusIcon, XMarkIcon, CalendarDateRangeIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { services, ServiceList } from '@/lib/services';
// @ts-ignore
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AddSubscriptionButtonProps {
    onUpdate: () => void;
}

interface Service {
    name: string;
    logoUrl: string;
}

const AddSubscriptionButton: React.FC<AddSubscriptionButtonProps> = ({ onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [subscriptionName, setSubscriptionName] = useState('');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [price, setPrice] = useState('');
    const [renewalType, setRenewalType] = useState('1');
    const [paymentCard, setPaymentCard] = useState('');
    const [isStopped, setIsStopped] = useState(false);
    const [isPersonal, setIsPersonal] = useState(false);

    const [username, setUsername] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const [imgError, setImgError] = useState(false)

    // закрытие дропдауна по клику вне
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // получаем userId
    useEffect(() => {
        const stored = localStorage.getItem('username');
        if (!stored) { setLoading(false); return; }
        setUsername(stored);
        fetch(`/api/getUserData?username=${stored}`)
            .then(r => r.json())
            .then(d => setUserId(d.user_id))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleOpenClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(o => !o);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !startDate) return;

        const formatDate = (d: Date) => {
            const offset = d.getTimezoneOffset();
            return new Date(d.getTime() - offset * 60000).toISOString().split('T')[0];
        };

        const expiry = new Date(startDate);
        expiry.setDate(expiry.getDate() + parseInt(renewalType, 10));

        const payload = {
            user_id: userId,
            title: subscriptionName,
            start_date: formatDate(startDate),
            expiry_date: formatDate(expiry),
            price,
            renewal_type: renewalType,
            paid_from: paymentCard,
            status: isStopped,
            personal: isPersonal,
            logo_url: selectedService?.logoUrl || ''
        };

        fetch('/api/addSubscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(r => r.json())
            .then(data => {
                if (!data.error) {
                    setOpen(false);
                    setSubscriptionName('');
                    setSelectedService(null);
                    setStartDate(null);
                    setPrice('');
                    setRenewalType('1');
                    setPaymentCard('');
                    setIsStopped(false);
                    setIsPersonal(false);
                    onUpdate();
                } else console.error(data.error);
            })
            .catch(console.error);
    };

    return (
        <>
            {open ? (
                <div
                    className="fixed inset-0 z-20 bg-gray-800/75 flex items-center justify-center"
                    onClick={handleOpenClose}
                >
                    <div
                        className="bg-white rounded-xl p-4 w-full max-w-lg"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Добавить подписку</h2>
                            <button onClick={handleOpenClose}><XMarkIcon className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="relative mb-4" ref={wrapperRef}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Название подписки
                                </label>
                                <input
                                    type="text"
                                    className="block w-full p-2 border rounded-xl bg-transparent h-12 outline-none"
                                    value={subscriptionName}
                                    onChange={e => {
                                        setSubscriptionName(e.target.value);
                                        setSelectedService(null);
                                        setDropdownOpen(true);
                                    }}
                                    onFocus={() => setDropdownOpen(true)}
                                    required
                                />
                                {dropdownOpen && (
                                    <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border rounded-xl shadow-lg">
                                        {services
                                            .filter(s => s.name.toLowerCase().includes(subscriptionName.toLowerCase()))
                                            .map((service: ServiceList) => (
                                                <li
                                                    key={service.name}
                                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => {
                                                        setSubscriptionName(service.name);
                                                        setDropdownOpen(false);
                                                    }}
                                                >
                                                    {!imgError && service.logoUrl ? (
                                                        <Image
                                                            src={service.logoUrl}
                                                            alt={service.name}
                                                            width={24}
                                                            height={24}
                                                            onError={() => setImgError(true)}
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 28 28"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-6 h-6 text-gray-400"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                                            />
                                                        </svg>
                                                    )}
                                                    <span>{service.name}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Дата начала подписки
                                </label>
                                <div className="flex items-center gap-2">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={d => setStartDate(d)}
                                        className="w-full p-2 border rounded-xl bg-transparent h-12 outline-none"
                                        dateFormat="dd/MM/yyyy"
                                        required
                                    />
                                    <CalendarDateRangeIcon className="w-5 h-5 text-gray-500" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Цена
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="flex-grow p-2 border rounded-xl bg-transparent h-12 outline-none"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        required
                                    />
                                    <span>₽</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Тип продления
                                </label>
                                <select
                                    className="w-full p-2 border rounded-xl bg-transparent h-12 outline-none"
                                    value={renewalType}
                                    onChange={e => setRenewalType(e.target.value)}
                                    required
                                >
                                    <option value="0">Пробная</option>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Карта (последние 4 цифры)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="flex-grow p-2 border rounded-xl bg-transparent h-12 outline-none"
                                        value={paymentCard}
                                        onChange={e => setPaymentCard(e.target.value)}
                                        maxLength={4}
                                        required
                                    />
                                    <CreditCardIcon className="w-5 h-5 text-gray-500" />
                                </div>
                            </div>

                            <div className="mb-4 flex flex-col gap-2">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={isStopped}
                                        onChange={e => setIsStopped(e.target.checked)}
                                    />
                                    <span>Остановлена?</span>
                                </label>
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={isPersonal}
                                        onChange={e => setIsPersonal(e.target.checked)}
                                    />
                                    <span>Личная подписка?</span>
                                </label>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-emerald-800 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl"
                                >
                                    Добавить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <button
                    className="fixed lg:bottom-10 lg:right-10 w-14 h-14 bg-emerald-800 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center transition-transform hover:rotate-90"
                    onClick={handleOpenClose}
                >
                    <PlusIcon className="w-8 h-8" />
                </button>
            )}
        </>
    );
};

export default AddSubscriptionButton;
