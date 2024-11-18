import { Metadata } from "next";
import LandingSidebar from "@/components/LandingSidebar";
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
    title: 'Вход | Harmonysub',
};

const Login = () => {
    return (
        <div className="flex flex-row">
            <main className="w-full flex flex-col">
                <div className="flex flex-row">
                    <LandingSidebar />
                    <LoginForm />
                </div>
            </main>
        </div>
    );
};

export default Login;