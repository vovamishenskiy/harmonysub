import { CreditCardIcon } from "@heroicons/react/24/outline";

interface ISubscription {
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
}

const Subscription: React.FC<SubscriptionProps> = ({ subscription }) => {
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

    return (
        <div className="flex flex-col gap-1 border border-emerald-700 rounded-lg py-2 px-3">
            <p className="text-2xl border-b border-emerald-600">{subscription.title}</p>
            <p>Цена: {formattedPrice}</p>
            <p>Срок: {renewalType}</p>
            <p>Дата начала: {startDate}</p>
            <p>Дата окончания: {expiryDate}</p>
            <p className="flex flex-row">Откуда оплачивается: • • • • {subscription.paid_from} <CreditCardIcon className="w-6 h-6 ml-2" title="Карта, с которой оплачивается подписка" /></p>
            <p>Статус: {subscription.status === true ? 'остановлена' : 'действует'}</p>
        </div>
    );
};

export default Subscription;