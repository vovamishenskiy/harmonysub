'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserCircleIcon, CogIcon, ArrowLeftEndOnRectangleIcon, QueueListIcon } from '@heroicons/react/16/solid';
import { usePathname, useRouter } from 'next/navigation';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useInvitationStatus } from '@/hooks/useInvitationStatus';
import { useLogout } from '@/hooks/useLogout';

const Sidebar: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
    const { avatarUrl, username, userId } = useCurrentUser();
    const { isInvited, isBeingInvited } = useInvitationStatus(userId);
    const logout = useLogout(onLogout);
    const pathname = usePathname();

    // Окно поповера пользователя
    const [popoverOpen, setPopoverOpen] = useState(false);
    const togglePopover = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setPopoverOpen(open => !open);
    }, []);

    // Утилита для подсветки активной ссылки
    const isActive = useCallback(
        (path: string) => pathname === path,
        [pathname]
    );

    const linkClass = useCallback(
        (path: string) => `flex items-center p-2 rounded-md transition ease-in-out ${isActive(path) ? 'bg-emerald-700' : 'hover:bg-emerald-700'
            }`,
        [isActive]
    );

    // Мемоизированные элементы меню
    const menuItems = useMemo(() => [
        { href: '/subscriptions', icon: <QueueListIcon className='h-6 w-6 lg:mr-3 sm:mr-0' />, label: 'Подписки', submenu: isInvited || isBeingInvited ? [{ href: '/subscriptions/personal', label: 'Личные' }] : [] },
        { href: '/user', icon: <UserCircleIcon className='h-6 w-6 lg:mr-3 sm:mr-0' />, label: 'Пользователь', submenu: pathname.startsWith('/user') ? [{ href: '/user/settings', label: 'Настройки' }, { href: '/user/invites', label: 'Приглашения' }] : [] },
        { href: '/settings', icon: <CogIcon className='h-6 w-6 lg:mr-3 sm:mr-0' />, label: 'Настройки', submenu: [] }
    ], [isInvited, isBeingInvited, pathname]);

    return (
        <div className="relative">
            <aside className="flex lg:relative lg:flex-col h-100vh-24px lg:min-w-64 lg:max-w-64 bg-emerald-800 text-white lg:p-4 lg:px-0 lg:ml-3 lg:mt-3 lg:mb-3 lg:rounded-2xl sm:flex-row sm:items-center sm:justify-around sm:px-2 sm:h-12 sm:rounded-none sm:min-w-full sm:m-0 sm:fixed sm:bottom-0 sm:z-[212]">
                <nav className="lg:flex-grow lg:w-full lg:min-h-0 sm:flex-grow-0 sm:w-full sm:min-h-full">
                    <ul className="sm:flex sm:flex-row sm:justify-center sm:items-center sm:gap-12 sm:mt-1 sm:w-full sm:h-full lg:flex lg:flex-col lg:ml-4 lg:w-auto lg:h-auto lg:mr-4 lg:gap-0 lg:items-start lg:justify-start lg:mt-0">
                        {menuItems.map(item => (
                            <li key={item.href} className="lg:mb-6 lg:w-full">
                                <Link href={item.href} className={linkClass(item.href)}>
                                    {item.icon}
                                    <p className="sm:hidden lg:block">{item.label}</p>
                                </Link>
                                {item.submenu.length > 0 && (
                                    <ul className="lg:ml-6 w:3/4 flex-col">
                                        {item.submenu.map(sub => (
                                            <li key={sub.href} className="lg:mt-2 lg:mb-1 lg:w-full">
                                                <Link href={sub.href} className={linkClass(sub.href)}>
                                                    <p className="sm:hidden lg:block lg:text-sm">{sub.label}</p>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                        {/* Popover для мобильного */}
                        <li className={`sm:block lg:hidden ${popoverOpen ? 'border-emerald-700 border-3 rounded-full' : ''}`}>
                            {avatarUrl ? (
                                <Image src={avatarUrl} alt="user avatar" onClick={togglePopover} width={24} height={24} className="rounded-full" />
                            ) : (
                                <UserCircleIcon className="h-6 w-6 sm:mr-3" onClick={togglePopover} />
                            )}
                            {popoverOpen && (
                                <div className="sm:absolute sm:z-[999] sm:bottom-12 sm:right-0 sm:min-w-44 sm:px-2 sm:py-3 sm:bg-emerald-700 sm:rounded-tl-lg sm:h-24">
                                    {username ? (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-row gap-4">
                                                {avatarUrl ? (
                                                    <Image src={avatarUrl} alt="user avatar" width={24} height={24} className="h-6 w-6 mr-3 sm:mr-0 rounded-full" />
                                                ) : (
                                                    <UserCircleIcon className="h-6 w-6 mr-3 sm:mr-0" />
                                                )}
                                                <p>{username}</p>
                                            </div>
                                            <button className="flex items-center p-2 rounded-md transition ease-in-out hover:bg-emerald-700" onClick={logout}>
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
                                            <button className="flex items-center p-2 rounded-md transition ease-in-out hover:bg-emerald-700" onClick={logout}>
                                                <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
                                                Выход
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    </ul>
                </nav>
                <div className="sm:hidden lg:flex lg:flex-col lg:ml-8 lg:mr-8 lg:w-[calc(100%-2rem)]">
                    <div className="flex flex-row items-center w-full lg:mb-6 lg:ml-2">
                        {avatarUrl ? (
                            <Image src={avatarUrl} alt="user avatar" width={24} height={24} className="lg:h-6 lg:w-6 lg:mr-3 sm:mr-0 rounded-full" />
                        ) : (
                            <UserCircleIcon className="lg:h-6 lg:w-6 lg:mr-3 sm:mr-0" />
                        )}
                        <p>{username || 'Пользователь'}</p>
                    </div>
                    <button className="flex items-center p-2 rounded-md transition ease-in-out hover:bg-emerald-700" onClick={logout}>
                        <ArrowLeftEndOnRectangleIcon className="lg:h-6 lg:w-6 lg:mr-3 sm:mr-0" />
                        Выход
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default React.memo(Sidebar);