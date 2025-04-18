import Invitations from "@/components/Invitations";
import SearchUser from "@/components/SearchUser";
import Sidebar from "@/components/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Пользователь | Harmonysub',
};
const User = () => {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <main className="flex flex-col mt-3 ml-4 w-full">
                <h1 className="text-3xl mb-5">Пользователь</h1>
            </main>
        </div>
    );
};

export default User;