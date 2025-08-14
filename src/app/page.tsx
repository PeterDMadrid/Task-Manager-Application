// app/page.tsx
import { getCurrentUserFromCookies } from '@/lib/auth';
import { getAllTask } from '@/services/taskServices';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const user = await getCurrentUserFromCookies();
  
  if (!user) { 
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white">Please log in to view tasks</h1>
      </div>
    );
  }

  const tasks = await getAllTask(user.userId);

  return <HomeClient initialTasks={tasks} currentUserId={user.userId} />;
}
