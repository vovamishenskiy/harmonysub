import React from "react";

const ConnectTelegramButton = () => {
    const handleAddBot = () => {
        const botUsername = 'harmonysub_bot';
        window.location.href = `https://t.me/${botUsername}?start`;
    }

    return (
        <button onClick={handleAddBot} className="btn btn-primary">
            Подключить аккаунт к телеграм боту
        </button>
    );
};

export default ConnectTelegramButton;