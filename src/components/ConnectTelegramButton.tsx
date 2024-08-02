'use client';

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
        window.location.href = `https://t.me/${botUsername}?start`;
    }

    const handleDisconnect = () => {
        const botUsername = 'harmonysub_bot';
        window.location.href = `https://t.me/${botUsername}?disconnect`;
        // fetch('/api/disconnectTelegram', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         if(data.message === 'Подключение к телеграм боту удалено') {
        //             setIsConnected(false);
        //         } else {
        //             console.error('Ошибка при отключении телеграм бота: ', data.error);
        //         }
        //     })
        //     .catch((err) => {
        //         console.error('Ошибка при отключении телеграм бота: ', err);
        //     })
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