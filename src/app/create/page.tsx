import { createTask } from "@/actions/actions";

export default function Create() {
  return (
    <div className="min-h-screen">
      <form action={createTask} className="flex flex-col gap-2 items-center">
        <div className="flex flex-col mt-24 text-white p-6 shadow-lg shadow-black-500/50 max-w-md mx-auto w-full">
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
        </div>

        <button
          type="submit"
          className="cursor-pointer w-mdtext-lg py-4 px-8 border border-white my-custom-font bg-black hover:bg-white hover:text-black text-white "
        >
          CREATE TASK
        </button>
      </form>
    </div>
  );
}