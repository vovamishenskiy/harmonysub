import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserCircleIcon, CogIcon, ArrowLeftEndOnRectangleIcon, QueueListIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

interface SidebarProps {
    onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const avatarUrl = localStorage.getItem('avatar_url');
        const username = localStorage.getItem('username');
        setUserAvatar(avatarUrl);
        setUsername(username);
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                localStorage.removeItem('avatar_url');
                localStorage.removeItem('username');
                if (onLogout) onLogout();
                router.push('/');
            } else {
                console.error('Ошибка выхода');
            }
        } catch (error) {
            console.error('Ошибка при выходе', error);
        }
    };

    return (
        <aside className="flex flex-col h-100vh-24px min-w-64 max-w-64 bg-emerald-800 text-white p-4 ml-3 mt-3 mb-3 rounded-2xl">
            <nav className="flex-grow">
                <ul>
                    <li className="mb-6">
                        <Link href='/subscriptions'>
                            <span className="flex items-center p-2 hover:bg-emerald-700 rounded-md transition ease-in-out">
                                <QueueListIcon className="h-6 w-6 mr-3" />
                                Подписки
                            </span>
                        </Link>
                    </li>
                    <li className="mb-6">
                        <Link href='/user'>
                            <span className="flex items-center p-2 hover:bg-emerald-700 rounded-md transition ease-in-out">
                                <UserCircleIcon className="h-6 w-6 mr-3" />
                                Пользователь
                            </span>
                        </Link>
                    </li>
                    <li className="mb-6">
                        <Link href='/settings'>
                            <span className="flex items-center p-2 hover:bg-emerald-700 rounded-md transition ease-in-out">
                                <CogIcon className="h-6 w-6 mr-3" />
                                Настройки
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="mb-auto">
                <div className="flex flex-row items-center w-full mb-6 ml-1.5">
                    {userAvatar ? (
                        <Image src={userAvatar} alt="user avatar" width={24} height={24} className="h-6 w-6 mr-3 rounded-full" />
                    ) : (
                        <UserCircleIcon className="h-6 w-6 mr-3" />
                    )}
                    {username ? (
                        <p>{username}</p>
                    ) : (
                        <p>Пользователь</p>
                    )}
                </div>
                <button className="flex items-center w-full p-2 text-left hover:bg-emerald-700 rounded-md transition ease-in-out" onClick={handleLogout}>
                    <ArrowLeftEndOnRectangleIcon className="h-6 w-6 mr-3" />
                    Выход
                </button>
            </div>
        </aside>
    )
}

export default Sidebar;