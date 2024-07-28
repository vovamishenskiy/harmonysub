import Sidebar from '@/components/Sidebar'

export default function Home() {
  return (
    <div className='flex flex-row'>
      <Sidebar />
      <main className="flex flex-col"></main>
    </div>
  );
}
