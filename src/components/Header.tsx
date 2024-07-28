import { ReactNode } from "react";
import { UserCircleIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/16/solid";

interface HeaderProps {
    title: string;
    navLinks?: { label: string, href: string }[];
    user?: { name: string, avatarUrl?: string };
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, navLinks, user, onLogout }) => {
    return (
        <header>
            <h1>{title}</h1>
            <nav>
                <ul>
                    {navLinks?.map((link) => (
                        <li key={link.href}>
                            <a href={link.href}>{link.label}</a>
                        </li>
                    ))}
                </ul>
            </nav>
            {user && (
                <div>
                    {user.avatarUrl ? (<img src={user.avatarUrl} alt={user.name} />) : (<UserCircleIcon />)}
                    <span className="text-xs font-light text-sky-300">{user.name}</span>
                    {onLogout && <button onClick={onLogout}><ArrowLeftEndOnRectangleIcon className="size-8 text-sky-600"/> Выход</button>}
                </div>
            )}
            <ArrowLeftEndOnRectangleIcon className="size-8 text-sky-600"/>
        </header>
    )
}

export default Header;