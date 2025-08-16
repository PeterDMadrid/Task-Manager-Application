import { createTask } from '@/services/taskServices';
import { getCurrentUserFromCookies } from '@/lib/auth';
import Button from '@/components/button';


export default async function Create() {
  const user = await getCurrentUserFromCookies();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white">Please log in to create tasks</h1>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded text-white bg-gray-800 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Create Task
      </h2>
      <form action={createTask} className="flex flex-col gap-2 items-center">
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Title"
            name="title"
            required
          />
          <textarea
            className="border p-2 mb-2 w-full"
            placeholder="Description"
            name="description"
            required
          ></textarea>
          <input
            className="border p-2 mb-2 w-full"
            type="date"
            name="dueDate"
            placeholder="Due Date"
          />
          <select
            className="border p-2 mb-2 w-full bg-gray-900 text-white focus:bg-black focus:text-white focus:border-blue-500 transition-colors"
            name="priority"
            defaultValue=""
            required
          >
            <option value="" disabled className="text-gray-400 bg-gray-900">
              Select Priority
            </option>
            <option value="1" className="text-white bg-gray-900">Low</option>
            <option value="2" className="text-white bg-gray-900">Medium</option>
            <option value="3" className="text-white bg-gray-900">High</option>
          </select>
          <select
            className="border p-2 mb-4 w-full bg-gray-900 text-white focus:bg-black focus:text-white focus:border-blue-500 transition-colors"
            name="status"
            defaultValue=""
            required
          >
            <option value="" disabled className="text-gray-400 bg-gray-900">
              Select Status
            </option>
            <option value="TODO" className="text-white bg-gray-900">To Do</option>
            <option value="IN_PROGRESS" className="text-white bg-gray-900">In Progress</option>
            <option value="COMPLETED" className="text-white bg-gray-900">Completed</option>
          </select>
        <Button label="CREATE TASK" type="submit" />
      </form>
    </div>
  );
}