import Invitations from "@/components/Invitations";
import SearchUser from "@/components/SearchUser";
import Sidebar from "@/components/Sidebar";

const User = () => {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <main className="flex flex-col mt-3 ml-4 w-full">
                <h1 className="text-3xl mb-5">Пользователь</h1>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl mb-2">Приглашения</h2>
                    <SearchUser />
                    <Invitations />
                </div>
            </main>
        </div>
    );
};

export default User;