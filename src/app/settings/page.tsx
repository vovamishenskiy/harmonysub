import Sidebar from "@/components/Sidebar";
import ConnectTelegramButton from '@/components/ConnectTelegramButton';
import UserSettings from "@/components/UserSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Настройки | Harmonysub',
};

const Settings = () => {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <main className="flex flex-col mt-3 ml-4 w-full">
                <h1 className="text-3xl mb-5">Настройки</h1>
                <UserSettings />
                <div className="h-10 w-full"></div>
                <ConnectTelegramButton />
            </main>
        </div>
    );
};

export default Settings;