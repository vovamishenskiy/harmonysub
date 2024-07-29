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
        <><p>Subscription ${subscription.title}</p></>
    );
};

export default Subscription;