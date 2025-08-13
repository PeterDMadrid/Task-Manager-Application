import Link from 'next/link';
import { getCurrentUserFromCookies } from '@/lib/auth';
import { getAllTask } from '@/services/taskServices';
import TaskCard from '@/components/TaskCards';

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

  return (
    <div className="items-center min-h-screen text-gray-300">
      <h1 className="mt-4 mb-8 text-3xl text-center font-bold text-white">
        All Tasks
      </h1>
      {tasks.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-400">No tasks found. Create your first task!</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-start w-full mx-auto">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
