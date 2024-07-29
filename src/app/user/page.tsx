import Sidebar from "@/components/Sidebar";

const User = () => {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <main className="flex flex-col mt-3 ml-4">
                <h1 className="text-3xl mb-5">Пользователь</h1>
            </main>
        </div>
    );
};

export default User;