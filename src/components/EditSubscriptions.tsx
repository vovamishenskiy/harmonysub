import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { XMarkIcon } from "@heroicons/react/24/outline";

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
};

interface EditSubscriptionProps {
    subscription: ISubscription;
    onClose: (e: any) => void;
    onUpdate: () => void;
    currentUser: number | null;
}

const EditSubscription: React.FC<EditSubscriptionProps> = ({ subscription, onClose, onUpdate, currentUser }) => {
    const [subscriptionName, setSubscriptionName] = useState(subscription.title);
    const [price, setPrice] = useState(subscription.price.toString());
    const [renewalType, setRenewalType] = useState(subscription.renewal_type);
    const [startDate, setStartDate] = useState<Date | null>(new Date(subscription.start_date));
    const [paymentCard, setPaymentCard] = useState(subscription.paid_from);
    const [isStopped, setIsStopped] = useState(subscription.status);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!startDate) return;

        const formatDate = (date: Date) => {
            const offset = date.getTimezoneOffset();
            const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
            return adjustedDate.toISOString().split('T')[0];
        }

        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + parseInt(renewalType, 10));

        const updatedSubscription = {
            subscription_id: subscription.subscription_id,
            user_id: subscription.user_id,
            title: subscriptionName,
            start_date: formatDate(startDate),
            expiry_date: formatDate(expiryDate),
            price: parseFloat(price),
            renewal_type: renewalType,
            paid_from: paymentCard,
            status: isStopped,
        }

        fetch('/api/updateSubscription', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSubscription),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log('Ошибка при обновлении подписки: ', data.error);
                } else if (data.success) {
                    handleClose(e);
                    onUpdate();
                } else {
                    alert(data.error || 'Не удалось обновить подписку');
                }
            })
            .catch((err) => {
                console.error('Ошибка при обновлении подписки: ', err);
            })
    }

    const handleClose = (e: any) => {
        fetch('/api/unlockSubscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscriptionId: subscription.subscription_id, userId: currentUser }),
        })
            .then(() => {
                onClose(e);
            })
            .catch((error) => {
                console.error('Ошибка при снятии блокировки подписки: ', error);
                onClose(e);
            });
    };

    const handleDelete = (e: any) => {
        e.preventDefault();

        fetch('/api/deleteSubscription', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscription_id: subscription.subscription_id, user_id: currentUser }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.error('Ошибка при удалении подписки: ', data.error);
                } else {
                    onClose(e);
                    onUpdate();
                }
            })
            .catch((err) => {
                console.error('Ошибка при удалении подписки: ', err);
            })
    }

    return (
        <div className='w-full h-full z-[212] opacity-100 bg-gray-800/75 flex items-center justify-center absolute top-0 left-0 cursor-pointer' onClick={handleClose}>
            <div className="lg:w-1/3 sm:w-full sm:mx-3 h-auto rounded-xl p-4 bg-white opacity-100 cursor-default z-10" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-row items-baseline justify-between">
                    <p className="text-lg mb-4">Редактировать подписку</p>
                    <button onClick={onClose} className="btn"><XMarkIcon className='w-6 h-6' onClick={handleClose} /></button>
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
                        <DatePicker
                            selected={startDate}
                            onChange={(date: any) => setStartDate(date)}
                            className="block w-full p-2 border rounded-xl bg-transparent h-12 outline-none"
                            dateFormat="dd/MM/yyyy"
                            required
                        />
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
                        <label className="block text-sm font-medium text-gray-700">Оплата с карты</label>
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
                        <div className="flex gap-2 items-center">
                            <span className="ml-2">Подписка остановлена?</span>
                            <input
                                type="checkbox"
                                checked={isStopped}
                                onChange={(e) => setIsStopped(e.target.checked)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 justify-end">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="btn btn-primary bg-red-600 hover:bg-red-500 text-white lg:py-2 sm:py-1 lg:px-4 sm:px-2 lg:text-base sm:text-sm rounded-xl"
                        >
                            Удалить подписку
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary bg-emerald-800 hover:bg-emerald-700 text-white lg:py-2 sm:py-1 lg:px-4 sm:px-2 lg:text-base sm:text-sm rounded-xl"
                        >
                            Сохранить изменения
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSubscription;
