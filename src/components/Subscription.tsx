interface ISubscription {
    title: string;
    price: number;
    renewalType: string;
    startDate: string;
    expiryDate: string;
    paidFrom: string;
    status: string;
};

interface SubscriptionProps {
    subscription: ISubscription;
}

const Subscription: React.FC<SubscriptionProps> = ({ subscription }) => {
    return (
        <div>
            <p>Subscription ${subscription.title}</p>
            <p>${subscription.price}</p>
            <p>${subscription.renewalType}</p>
            <p>${subscription.startDate}</p>
            <p>${subscription.expiryDate}</p>
            <p>${subscription.paidFrom}</p>
            <p>${subscription.status}</p>
        </div>
    );
};

export default Subscription;