import Sidebar from "@/components/Sidebar";
import ConnectTelegramButton from '@/components/ConnectTelegramButton';

const Settings = () => {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <main className="flex flex-col mt-3 ml-4">
                <h1 className="text-3xl mb-5">Настройки</h1>
                <ConnectTelegramButton />
            </main>
        </div>
    );
};

export default Settings;