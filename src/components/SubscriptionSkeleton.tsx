import React from 'react';

const SubscriptionSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse flex flex-row space-x-6">
            <div className="bg-gray-300 h-64 w-80 rounded-md"></div>
        </div>
    );
};

export default SubscriptionSkeleton;