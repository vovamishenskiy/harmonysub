'use client';

import { CreditCardIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
}

const Subscription: React.FC<SubscriptionProps> = ({ subscription, onUpdate }) => {
    const [expiring, setExpiring] = useState(false);
    const [editing, setEditing] = useState(false);
    const [subscriptionName, setSubscriptionName] = useState('');
    const [price, setPrice] = useState('');
    const [paymentCard, setPaymentCard] = useState('')
    const [isStopped, setIsStopped] = useState(false);

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

    const handleEdit = (e: any) => {
        e.stopPropagation();
        setEditing(!editing);
    }

    return (
        <>
            <Card className="bg-slate-100 p-4 rounded-xl w-80 h-auto" data-id={subscription.subscription_id}>
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

            {editing && (
                <EditSubscription subscription={subscription} onClose={handleEdit} onUpdate={onUpdate} />
            )}
        </>
    );
};

export default Subscription;