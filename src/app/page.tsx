import Link from 'next/link';
import { getCurrentUserFromCookies } from '@/lib/auth';
import { getUserTasks } from '@/services/taskServices';

export default async function Home() {
  const user = await getCurrentUserFromCookies();
  if (!user) { 
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white">Please log in to view tasks</h1>
      </div>
    );
  }

  const tasks = await getUserTasks(user.userId);

  return (
    <div className="min-h-screen text-gray-300">
      <h1 className="mt-4 text-3xl font-bold text-center">All users' tasks </h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2">
            <div className="text-black bg-white p-4">
              <Link href={`/tasks/${task.id}`} className="font-semibold">{task.title}</Link>
              <p>
                {task.description && task.description.length > 15
                  ? `${task.description.slice(0, 15)}...`
                  : task.description}
              </p>
              <p>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>
              <p>{task.priority}</p>
              <p>{task.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
