import LandingSidebar from "@/components/LandingSidebar";
import RegistrationForm from "@/components/RegistrationForm";

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