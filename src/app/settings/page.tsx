'use client';

import Sidebar from "@/components/Sidebar";
import ConnectTelegramButton from '@/components/ConnectTelegramButton';
import UserSettings from "@/components/UserSettings";
import { Metadata } from "next";
import { useState } from "react";

const Settings = () => {
    const [activeTab, setActiveTab] = useState<'user' | 'notifications'>('user');

    return (
        <div className="flex flex-row">
            <Sidebar />
            <main className="flex flex-col mt-3 ml-4 w-full">
                <h1 className="text-3xl mb-3 pt-4">Настройки</h1>
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('user')}
                        className={`px-4 py-2 rounded-t-lg border-b-2 ${activeTab === 'user'
                                ? 'border-emerald-700 text-emerald-700'
                                : 'border-transparent text-gray-600 hover:text-emerald-700'
                            }`}
                    >
                        Пользователь
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`px-4 py-2 rounded-t-lg border-b-2 ${activeTab === 'notifications'
                                ? 'border-emerald-700 text-emerald-700'
                                : 'border-transparent text-gray-600 hover:text-emerald-700'
                            }`}
                    >
                        Уведомления
                    </button>
                </div>

                {/* Содержимое вкладки */}
                {activeTab === 'user' && <UserSettings />}
                {activeTab === 'notifications' && <ConnectTelegramButton />}
            </main>
        </div>
    );
};

export default Settings;