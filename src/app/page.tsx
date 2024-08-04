import LandingSidebar from '@/components/LandingSidebar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-row'>
      <main className="w-full flex flex-col relative">
        <div className="flex flex-row text-center">
          <LandingSidebar />
          <div className="flex flex-col gap-3 text center  m-auto">
            <h1 className="w-full text-6xl text-emerald-700">Добро пожаловать в harmonysub</h1>
            <p className="text-xl text-emerald-600"><Link href='/login' className='hover:text-emerald-500 transition ease-in-out'>Войдите</Link> или <Link href='/registration' className='hover:text-emerald-500 transition ease-in-out'>зарегистрируйтесь</Link>, чтобы  продолжить</p>
          </div>
        </div>
      </main>
    </div>
  );
};