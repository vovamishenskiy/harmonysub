import LandingSidebar from "@/components/LandingSidebar";
import RegistrationForm from "@/components/RegistrationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Регистрация | Harmonysub',
};

const Register = () => {
    return (
        <div className="flex flex-row">
            <main className="w-full flex flex-col">
                <div className="flex flex-row text-center">
                    <LandingSidebar />
                    <RegistrationForm />
                </div>
            </main>
        </div>
    );
};

export default Register;