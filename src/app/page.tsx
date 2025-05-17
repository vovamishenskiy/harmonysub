import LandingSidebar from '@/components/LandingSidebar';
import Link from 'next/link';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Главная | Harmonysub',
};


export default function Home() {
  return (
    <div className='flex lg:flex-row sm:flex-col'>
      <main className="w-full sm:h-screen flex flex-col relative">
        <div className="flex lg:flex-row sm:flex-col text-center">
          <LandingSidebar />
          <div className="flex flex-col gap-3 text-center m-auto sm:px-3 sm:h-screen">
            <div className="sm:block lg:hidden sm:h-[40%]"></div>
            <div className='flex flex-col gap-3 text-center lg:m-auto'>
              <h1 className="w-full lg:text-6xl sm:text-2xl text-emerald-700">Добро пожаловать в H  armonysub</h1>
              <p className="lg:text-xl sm:text-base text-emerald-600"><Link href='/login' className='hover:text-emerald-500 transition ease-in-out'>Войдите</Link> или <Link href='/registration' className='hover:text-emerald-500 transition ease-in-out'>зарегистрируйтесь</Link>, чтобы  продолжить</p>
            </div>
            <div className="sm:block lg:hidden sm:h-[40%]"></div>
          </div>
        </div>
      </main>
    </div>
  );
};