import LandingSidebar from '@/components/LandingSidebar';

export default function Home() {
  return (
    <div className='flex flex-row'>
      <main className="w-full flex flex-col">
        <div className="flex flex-row text-center">
          <LandingSidebar />
          <div className="flex flex-col gap-3 text center  m-auto">
            <h1 className="w-full text-6xl text-emerald-700">Добро пожаловать в harmonysub</h1>
            <p className="text-xl text-emerald-600">Войдите или зарегистрируйтесь, чтобы  продолжить</p>
          </div>
        </div>
      </main>
    </div>
  );
};