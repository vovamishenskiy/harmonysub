import Sidebar from "@/components/Sidebar";
import ConnectTelegramButton from '../../../.history/src/components/ConnectTelegramButton_20240731112230';

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