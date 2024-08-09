'use client';

import { CreditCardIcon, PencilIcon, ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import { PlayIcon, StopIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import React, { useState, useEffect } from "react";
// @ts-ignore
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import EditSubscription from "@/components/EditSubscriptions";

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

interface SubscriptionProps {
    subscription: ISubscription;
    onUpdate: () => void;
    currentUser: number;
}

const Subscription: React.FC<SubscriptionProps> = ({ subscription, onUpdate, currentUser }) => {
    const [expiring, setExpiring] = useState(false);
    const [editing, setEditing] = useState(false);
    const [subscriptionName, setSubscriptionName] = useState('');
    const [price, setPrice] = useState('');
    const [paymentCard, setPaymentCard] = useState('')
    const [isStopped, setIsStopped] = useState(false);
    const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return Intl.DateTimeFormat('ru-RU', { day: 'numeric', 'month': 'long', 'year': 'numeric' }).format(date);
    };

    const formatRenewalType = (renewalType: string) => {
        const renewalMap: { [key: string]: string } = {
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
        return renewalMap[renewalType] || 'Неизвестно';
    }

    const formatPrice = (price: number) => {
        return `${Math.round(price)} ₽`;
    }

    const startDate = formatDate(subscription.start_date);
    const expiryDate = formatDate(subscription.expiry_date);
    const renewalType = formatRenewalType(subscription.renewal_type);
    const formattedPrice = formatPrice(subscription.price);

    useEffect(() => {
        const today = new Date();
        const expiry = new Date(subscription.expiry_date);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 3) {
            setExpiring(true);
        } else {
            setExpiring(false);
        }
    }, [subscription.expiry_date]);

    const handleEdit = async (e: any) => {
        e.stopPropagation();

        const response = await fetch('/api/lockSubscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscriptionId: subscription.subscription_id, userId: currentUser }),
        });

        const data = await response.json();

        if (response.ok) {
            setEditing(true);
        } else {
            alert(data.error || 'Не удалось заблокировать подписку для редактирования');
        }
    }

    const handleMobileDetails = (e: any) => {
        e.stopPropagation();
        setMobileDetailsOpen(!mobileDetailsOpen);
    }

    return (
        <>
            <div className="lg:block sm:hidden">
                <Card className="bg-slate-100 p-2 rounded-xl w-auto min-w-80 h-auto" data-id={subscription.subscription_id}>
                    <CardHeader className="flex flex-row items-center">
                        <p className="text-2xl hover:text-emerald-700 cursor-pointer transition ease-in-out duration-250" onClick={handleEdit}>{subscription.title}</p>
                        {expiring && <span className="w-auto ml-auto py-1 px-2 rounded-full text-white bg-red-500 font-light text-sm">Истекает</span>}
                    </CardHeader>
                    <Divider className="my-2 " />
                    <CardBody className="flex flex-col gap-2">
                        <p>Цена: {formattedPrice}</p>
                        <p>Срок: {renewalType}</p>
                        <p>Дата начала: {startDate}</p>
                        <p>Дата окончания: {expiryDate}</p>
                        <p className="flex flex-row">Откуда оплачивается: • • • • {subscription.paid_from} <CreditCardIcon className="w-6 h-6 ml-2" title="Карта, с которой оплачивается подписка" /></p>
                        <p>Статус: {subscription.status === true ? 'остановлена' : 'действует'}</p>
                    </CardBody>
                </Card>
            </div>
            <div className="lg:hidden sm:block sm:w-auto">
                <Card className="bg-slate-100 p-3 rounded-xl min-w-40 w-auto h-auto" data-id={subscription.subscription_id}>
                    <CardHeader className="flex flex-row items-center p-0" onClick={handleMobileDetails}>
                        <p className="text-2xl font-normal pb-1 hover:text-emerald-700 cursor-pointer transition ease-in-out duration-250">{subscription.title}</p>
                    </CardHeader>
                    <CardBody className="flex flex-col gap-2 p-0">
                        <p className="flex flex-row items-center justify-between text-sm">{startDate} <PlayIcon className="w-6 h-6 text-green-600" /></p>
                        <p className="flex flex-row items-center justify-between text-sm">{expiryDate} <StopIcon className="w-6 h-6 text-red-600" /></p>
                        <p className="flex flex-row items-center justify-between text-sm">{renewalType} <ArrowPathRoundedSquareIcon className="w-6 h-6 text-blue-700" /></p>
                        <div className="flex flex-row items-center w-full pt-1">
                            {expiring && <span className="w-auto px-2 h-6 flex justify-center items-center rounded-full text-white bg-red-500 font-light text-sm">Истекает</span>}
                            <button onClick={handleEdit} className="w-auto h-auto ml-auto"><PencilIcon className="w-6 h-6" /></button>
                        </div>
                    </CardBody>
                </Card>
                {/* TODO: сделать компонент SubscriptionDetails для мобильных устройств с деталями подписки */}
                {/* {mobileDetailsOpen &&
                    <SubscriptionDetails />
                } */}
            </div>

            {editing && (
                <EditSubscription subscription={subscription} onClose={() => setEditing(false)} onUpdate={onUpdate} currentUser={currentUser} />
            )}
        </>
    );
};

export default Subscription;