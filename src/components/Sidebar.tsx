import React from "react";
import Link from "next/link";
import { UserCircleIcon, CogIcon, ArrowLeftEndOnRectangleIcon, QueueListIcon } from "@heroicons/react/16/solid";

interface SidebarProps {
    onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    return (
        <aside className="flex flex-col h-100vh-24px w-1/6 bg-emerald-800 text-white p-4 ml-3 mt-3 mb-3 rounded-2xl">
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
                    {/* TODO: добавить аватар пользователя из Vercel Blob и username */}
                    <UserCircleIcon className="h-6 w-6 mr-3"/>
                    Пользователь
                </div>
                <button className="flex items-center w-full p-2 text-left hover:bg-emerald-700 rounded-md transition ease-in-out" onClick={onLogout}>
                    <ArrowLeftEndOnRectangleIcon className="h-6 w-6 mr-3" />
                    Выход
                </button>
            </div>
        </aside>
    )
}

export default Sidebar;