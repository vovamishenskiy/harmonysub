'use client';

import React, { useState, useEffect } from "react";
import { BellAlertIcon, BellSlashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const Skeleton: React.FC = () => (
    <div className='animate-pulse bg-gray-300 h-20 rounded-xl w-1/4' />
);

const ConnectTelegramButton = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/checkTelegramConnection')
            .then((res) => res.json())
            .then((data) => {
                setIsConnected(data.telegramConnected);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Ошибка проверки подключения Телеграм бота: ', err);
                setLoading(false);
            });
    }, []);

    const handleConnect = () => {
        const botUsername = 'harmonysub_bot';
        window.open(`https://t.me/${botUsername}?start`, '_target');
    }

    const handleDisconnect = () => {
        const botUsername = 'harmonysub_bot';
        window.open(`https://t.me/${botUsername}?disconnect`, '_target');
    }

    const checkConnection = async () => {
        setLoading(true);
        await fetch('/api/checkTelegramConnection')
            .then((res) => res.json())
            .then((data) => {
                setIsConnected(data.telegramConnected);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Ошибка проверки подключения Телеграм бота: ', err);
                setLoading(false);
            });
    }

    if (loading) {
        return (
            <div className="flex flex-col">
                <p className="text-xl mb-3">Настройки уведомлений</p>
                <div className="pl-2">
                    <Skeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <p className="text-xl mb-3">Настройки уведомлений</p>
            {isConnected ? (
                <div className="flex flex-col pl-2">
                    <div className="flex flex-row gap-2 items-start">
                        <BellAlertIcon className="w-6 h-6 mb-3" />
                        <p>Уведомления от телеграм бота подключены</p>
                        <button className="btn btn-primary" onClick={checkConnection}><ArrowPathIcon className="w-5 h-5 mt-0.5 ml-1" /></button>
                    </div>
                    <button onClick={handleDisconnect} className="btn btn-primary rounded-xl w-80 p-2 bg-emerald-700 hover:bg-emerald-600 text-white transition ease">
                        Отключить уведомления
                    </button>
                </div>
            ) : (
                <div className="flex flex-col">
                    <div className="flex flex-row gap-2 items-start pl-2">
                        <BellSlashIcon className="w-6 h-6 mb-3" />
                        <p>Уведомления от телеграм бота отключены</p>
                        <button className="btn btn-primary" onClick={checkConnection}><ArrowPathIcon className="w-5 h-5 mt-0.5 ml-1" /></button>
                    </div>
                    <button onClick={handleConnect} className="btn btn-primary rounded-xl w-80 p-2 bg-emerald-700 hover:bg-emerald-600 text-white transition ease">
                        Подключить уведомления
                    </button>
                </div>
            )}
        </div>
    );
};

export default ConnectTelegramButton;