'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserCircleIcon, CogIcon, ArrowLeftEndOnRectangleIcon, QueueListIcon } from "@heroicons/react/16/solid";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
    onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userPopoverOpen, setUserPopoverOpen] = useState(false);
    const [isInvited, setIsInvited] = useState(false);
    const [isBeingInvited, setIsBeingInvited] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const router = useRouter();
    const currentPath = usePathname();

    const getUserId = async (username: string) => {
        try {
            const response = await fetch(`/api/getUserData?username=${username}`);
            const data = await response.json();
            if (response.ok) {
                setUserId(data.user_id);
            } else {
                setError(data.error || 'Ошибка при получении данных пользователя');
            }
        } catch (error) {
            setError('Ошибка при получении данных пользователя');
            console.error('Ошибка при получении данных пользователя: ', error);
        }
    }

    useEffect(() => {
        if(username) getUserId(username);

        const checkInvited = async (userId: number) => {
            const response = await fetch(`/api/checkInvitedUsers?userId=${userId}`);
            const data = await response.json();
            if (data.status) {
                setIsInvited(data.status);
                localStorage.setItem('isInvited', data.status);
            };
        };
        if(userId) checkInvited(userId);

        const checkBeingInvited = async (userId: number) => {
            const response = await fetch(`/api/checkBeingInvited?userId=${userId}`);
            const data = await response.json();
            if(data.status) {
                setIsBeingInvited(data.status);
                localStorage.setItem('isBeingInvited', data.status);
            }
        }
        if(userId) checkBeingInvited(userId);
    }, [userId, username, isInvited, isBeingInvited]);

    useEffect(() => {
        const avatarUrl = localStorage.getItem('avatar_url');
        const username = localStorage.getItem('username');
        setUserAvatar(avatarUrl);
        setUsername(username);
        setLoading(false);
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
                localStorage.removeItem('isInvited');
                localStorage.removeItem('isBeingInvited');
                if (onLogout) onLogout();
                router.push('/');
            } else {
                console.error('Ошибка выхода');
            }
        } catch (error) {
            console.error('Ошибка при выходе', error);
        }
    };

    const isActiveLink = (path: string) => {
        return `flex items-center p-2 rounded-md transition ease-in-out ${currentPath === path ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`
    }

    const handlePopover = (e: any) => {
        e.stopPropagation();
        setUserPopoverOpen(!userPopoverOpen);
    }

    return (
        <div className="relative">
            <aside className="flex lg:relative lg:flex-col 
            h-100vh-24px lg:min-w-64 lg:max-w-64
            bg-emerald-800 text-white lg:p-4 lg:px-0
            lg:ml-3 lg:mt-3 lg:mb-3 lg:rounded-2xl 
            sm:flex-row sm:items-center 
            sm:justify-around sm:px-2 
            sm:h-12 sm:rounded-none 
            sm:min-w-full sm:m-0 sm:fixed 
            sm:bottom-0 sm:z-[212]">
                <nav className="lg:flex-grow lg:w-full lg:min-h-0 sm:flex-grow-0 sm:w-full sm:min-h-full">
                    <ul className="sm:flex sm:flex-row sm:justify-center sm:items-center sm:gap-12 sm:mt-1 sm:w-full sm:h-full 
                    lg:flex lg:flex-col lg:ml-4 lg:w-auto lg:h-auto lg:mr-4 lg:gap-0 lg:items-start lg:justify-start lg:mt-0">
                        <li className="lg:mb-6 lg:w-full">
                            <Link href='/subscriptions'>
                                <span className={isActiveLink('/subscriptions')}>
                                    <QueueListIcon className="h-6 w-6 lg:mr-3 sm:mr-0" />
                                    <p className="sm:hidden lg:block">Подписки</p>
                                </span>
                            </Link>
                            {isInvited && (
                                <ul className="lg:ml-6 w:3/4 flex-col">
                                    <li className="lg:mt-2 lg:mb-1 lg:w-full">
                                        <Link href='/subscriptions/personal'>
                                            <span className={isActiveLink('/subscriptions/personal')}>
                                                <p className="sm:hidden lg:block lg:text-sm">Личные</p>
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                            {isBeingInvited && (
                                <ul className="lg:ml-6 w:3/4 flex-col">
                                    <li className="lg:mt-2 lg:mb-1 lg:w-full">
                                        <Link href='/subscriptions/personal'>
                                            <span className={isActiveLink('/subscriptions/personal')}>
                                                <p className="sm:hidden lg:block lg:text-sm">Личные</p>
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="lg:mb-6 lg:w-full">
                            <Link href='/user'>
                                <span className={isActiveLink('/user')}>
                                    <UserCircleIcon className="h-6 w-6 lg:mr-3 sm:mr-0" />
                                    <p className="sm:hidden lg:block">Пользователь</p>
                                </span>
                            </Link>
                            {(currentPath.startsWith('/user')) && (
                                <ul className='lg:ml-6 w:3/4 flex-col'>
                                    <li className="lg:mt-2 lg:mb-1 lg:w-full">
                                        <Link href='/user/settings'>
                                            <span className={isActiveLink('/user/settings')}>
                                                <p className="sm:hidden:lg:block lg:text-sm">Настройки пользователя</p>
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="lg:w-full">
                                        <Link href='/user/invites'>
                                            <span className={isActiveLink('/user/invites')}>
                                                <p className="sm:hidden:lg:block lg:text-sm">Приглашения</p>
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="lg:mb-6 lg:w-full">
                            <Link href='/settings'>
                                <span className={isActiveLink('/settings')}>
                                    <CogIcon className="h-6 w-6 lg:mr-3 sm:mr-0" />
                                    <p className="sm:hidden lg:block">Настройки</p>
                                </span>
                            </Link>
                        </li>
                        <li className={`sm:block lg:hidden ${userPopoverOpen ? 'border-emerald-700 border-3 rounded-full' : ''}`}>
                            {userAvatar ? (
                                <Image src={userAvatar} alt="user avatar" onClick={handlePopover} width={24} height={24} className="rounded-full" />
                            ) : (
                                <UserCircleIcon className="h-6 w-6 sm:mr-3" onClick={handlePopover} />
                            )}
                            <div className={`sm:${userPopoverOpen ? 'flex' : 'hidden'} sm:absolute sm:z-[999] sm:bottom-12 sm:right-0 sm:min-w-44 sm:px-2 sm:py-3 sm:bg-emerald-700 sm:rounded-tl-lg sm:h-24`}>
                                {loading ? (
                                    <div className="h-6 w-full bg-emerald-700 rounded-md animate-pulse" />
                                ) : username ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-row gap-4">
                                            {userAvatar ? (
                                                <Image src={userAvatar} alt="user avatar" width={24} height={24} className="h-6 w-6 mr-3 sm:mr-0 rounded-full" />
                                            ) : (
                                                <UserCircleIcon className="h-6 w-6 mr-3 sm:mr-0" />
                                            )}
                                            <p>{username}</p>
                                        </div>
                                        <button className="flex flex-row gap-4 items-center w-full p-2 pl-0 text-left hover:bg-emerald-700 rounded-md transition ease-in-out" onClick={handleLogout}>
                                            <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
                                            Выход
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-row gap-4">
                                            <UserCircleIcon className="h-6 w-6 mr-3 sm:mr-0" />
                                            <p>Пользователь</p>
                                        </div>
                                        <button className="flex flex-row gap-4 items-center w-full p-2 pl-0 text-left hover:bg-emerald-700 rounded-md transition ease-in-out" onClick={handleLogout}>
                                            <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
                                            Выход
                                        </button>
                                    </div>
                                )}</div>
                        </li>
                    </ul>
                </nav>
                <div className="sm:hidden lg:flex lg:flex-col lg:ml-8 lg:w-full">
                    <div className="flex flex-row items-center w-full lg:mb-6">
                        {userAvatar ? (
                            <Image src={userAvatar} alt="user avatar" width={24} height={24} className="lg:h-6 lg:w-6 lg:mr-3 sm:mr-0 rounded-full" />
                        ) : (
                            <UserCircleIcon className="lg:h-6 lg:w-6 lg:mr-3 sm:mr-0" />
                        )}
                        {loading ? (
                            <div className="h-6 w-full bg-emerald-700 rounded-md animate-pulse" />
                        ) : username ? (
                            <p>{username}</p>
                        ) : (
                            <p>Пользователь</p>
                        )}
                    </div>
                    <button className="flex items-center w-full p-0 mb-2 text-left hover:bg-emerald-700 rounded-md transition ease-in-out" onClick={handleLogout}>
                        <ArrowLeftEndOnRectangleIcon className="lg:h-6 lg:w-6 lg:mr-3 sm:mr-0" />
                        Выход
                    </button>
                </div>
            </aside>
        </div>
    )
}

export default Sidebar;