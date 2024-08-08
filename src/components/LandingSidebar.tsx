'use client';

import React from "react";
import Link from "next/link";
import { UserPlusIcon, ArrowRightEndOnRectangleIcon } from "@heroicons/react/16/solid";
import { usePathname } from "next/navigation";

const LandingSidebar: React.FC = () => {
    const currentPath = usePathname();

    const isActiveLink = (path: string) => {
        return `flex items-center p-2 hover:bg-emerald-700 rounded-md transition ease-in-out ${currentPath === path ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`
    }

    return (
        <aside className="flex sm:z-[212] lg:flex-col sm:flex-row h-100vh-24px sm:h-12 lg:min-w-64 lg:max-w-64 bg-emerald-800 text-white lg:p-4 lg:ml-3 lg:mt-3 lg:mb-3 lg:rounded-2xl sm:rounded-none sm:fixed sm:bottom-0 sm:min-w-full sm:m-0 lg:relative">
            <nav className="flex-grow">
                <Link href='/' className="lg:block sm:hidden"><h4 className="text-xl text-center text-emerald-600 hover:text-emerald-500 transition ease-in-out mb-5">harmonysub</h4></Link>
                <ul className="sm:flex sm:flex-row sm:items-center sm:justify-around lg:flex lg:flex-col lg:items-start">
                    <li className="lg:mb-4 lg:w-full sm:m-0">
                        <Link href='/login'>
                            <span className={isActiveLink('/login')}>
                                <ArrowRightEndOnRectangleIcon className="h-6 w-6 lg:mr-3 sm:m-0" />
                                <p className="sm:hidden lg:block">Вход</p>
                            </span>
                        </Link>
                    </li>
                    <Link href='/' className="sm:block lg:hidden"><h4 className="text-xl text-center text-emerald-600 hover:text-emerald-500 transition ease-in-out mb-3 mt-2">harmonysub</h4></Link>
                    <li className="lg:mb-4 lg:w-full sm:m-0">
                        <Link href='/registration'>
                            <span className={isActiveLink('/registration')}>
                                <UserPlusIcon className="h-6 w-6 lg:mr-3 sm:m-0" />
                                <p className="sm:hidden lg:block">Регистрация</p>
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default LandingSidebar;