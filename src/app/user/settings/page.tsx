import Sidebar from "@/components/Sidebar";
import UserSettings from "@/components/UserSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Настройки пользователя | Harmonysub',
};
const User = () => {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <main className="flex flex-col mt-3 ml-4 w-full">
                <h1 className="text-3xl mb-3">Настройки пользователя</h1>
                <UserSettings />
            </main>
        </div>
    );
};

export default User;