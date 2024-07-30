import React from "react";
import Link from "next/link";
import { UserPlusIcon, ArrowRightEndOnRectangleIcon } from "@heroicons/react/16/solid";

const LandingSidebar: React.FC = () => {
    return (
        <aside className="flex flex-col h-100vh-24px w-1/6 bg-emerald-800 text-white p-4 ml-3 mt-3 mb-3 rounded-2xl">
            <nav className="flex-grow">
                <Link href='/'><h4 className="text-xl text-emerald-600 hover:text-emerald-500 transition ease-in-out mb-5">harmonysub</h4></Link>
                <ul>
                    <li className="mb-6">
                        <Link href='/login'>
                            <span className="flex items-center p-2 hover:bg-emerald-700 rounded-md transition ease-in-out">
                                <ArrowRightEndOnRectangleIcon className="h-6 w-6 mr-3" />
                                Вход
                            </span>
                        </Link>
                    </li>
                    <li className="mb-6">
                        <Link href='/registration'>
                            <span className="flex items-center p-2 hover:bg-emerald-700 rounded-md transition ease-in-out">
                                <UserPlusIcon className="h-6 w-6 mr-3" />
                                Регистрация
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default LandingSidebar;