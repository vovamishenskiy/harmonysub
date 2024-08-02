'use client';

import React, { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";

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

    if (loading) {
        return (<p>Загрузка...</p>);
    }

    return (
        <div className="flex flex-col">
            {isConnected ? (
                <div className="flex flex-col">
                    <div className="flex flex-row gap-2">
                        <CheckCircleIcon className="w-6 h-6 mb-3" />
                        <p>Уведомления от телеграм бота подключены</p>
                    </div>
                    <button onClick={handleConnect} className="btn btn-primary rounded-xl w-2/3 p-2 bg-emerald-700 hover:bg-emerald-600 text-white transition ease">
                        Отключить уведомления
                    </button>
                </div>
            ) : (
                <div className="flex flex-col">
                    <div className="flex flex-row gap-2">
                        <XCircleIcon className="w-6 h-6 mb-3" />
                        <p>Уведомления от телеграм бота отключены</p>
                    </div>
                    <button onClick={handleDisconnect} className="btn btn-primary rounded-xl w-2/3 p-2 bg-emerald-700 hover:bg-emerald-600 text-white transition ease">
                        Подключить уведомления
                    </button>
                </div>
            )}
        </div>
    );
};

export default ConnectTelegramButton;