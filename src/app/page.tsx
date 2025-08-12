import Link from 'next/link';
import { PrismaClient } from '../generated/prisma';

export default async function Home() {
  const prisma = new PrismaClient();
  const tasks = await prisma.task.findMany();

  return (
    <div className="min-h-screen text-gray-300">
      <h1 className="mt-4 text-3xl font-bold text-center">All users' tasks </h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2">
            <div className="text-black bg-white p-4">
              <Link href={`/tasks/${task.id}`} className="font-semibold">{task.title}</Link>
              <p>{task.description}</p>
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
