'use client';

import { revalidatePath } from "next/cache";
import React, { useState, useEffect } from "react";

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
        revalidatePath('/settings')
    }

    const handleDisconnect = () => {
        const botUsername = 'harmonysub_bot';
        window.open(`https://t.me/${botUsername}?disconnect`, '_target');
        revalidatePath('/settings')
    }

    if (loading) {
        return (<p>Загрузка...</p>);
    }

    return (
        <button onClick={isConnected ? handleDisconnect : handleConnect} className="btn btn-primary">
            {isConnected ? 'Отключить аккаунт от телеграм бота' : 'Подключить аккаунт к телеграм боту'}
        </button>
    );
};

export default ConnectTelegramButton;