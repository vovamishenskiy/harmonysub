import React from 'react';

const SubscriptionSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse flex flex-row space-x-6">
            <div className="bg-gray-300 h-32 w-60 rounded-md"></div>
            <div className="bg-gray-300 h-32 w-60 rounded-md"></div>
            <div className="bg-gray-300 h-32 w-60 rounded-md"></div>
            <div className="bg-gray-300 h-32 w-60 rounded-md"></div>
        </div>
    );
};

export default SubscriptionSkeleton;