import Invitations from "@/components/Invitations";
import InvitedUsers from "@/components/InvitedUsers";
import SearchUser from "@/components/SearchUser";
import Sidebar from "@/components/Sidebar";

const User = () => {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <main className="flex flex-col mt-3 ml-4 w-full">
                <h1 className="text-3xl mb-3">Приглашения</h1>
                <div className="flex flex-col gap-2">
                    <SearchUser />
                    <div className="flex flex-row gap-4 items-start w-2/3">
                        <Invitations />
                        <InvitedUsers />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default User;