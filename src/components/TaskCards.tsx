// components/TaskCard.tsx
import Link from 'next/link';

interface Task {
  id: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: number | null;
  status: string;
  user: {
    name: string;
  };
}

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const getPriorityColor = (priority: number | null) => {
    if (priority === null) return 'text-gray-600';
    switch (priority) {
      case 1: return 'text-green-600';
      case 2: return 'text-yellow-600';
      case 3: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityText = (priority: number | null) => {
    if (priority === null) return 'No Priority';
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mx-4 bg-white rounded-lg shadow-md p-6 w-full sm:w-44 md:w-64 lg:w-72 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      {/* Header with title and creator */}
      <div className="flex justify-between items-start mb-3">
        <Link 
          href={`/tasks/${task.id}`} 
          className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors duration-200"
        >
          {task.title}
        </Link>
        <div className="text-xs text-gray-500 ml-2">
          by {task.user.name}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        {task.description && task.description.length > 60
          ? `${task.description.slice(0, 60)}...`
          : task.description || "No description"}
      </p>

      {/* Due date */}
      <div className="flex items-center mb-3">
        <span className="text-xs text-gray-500 mr-2">Due:</span>
        <span className="text-sm text-gray-700">
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No due date"}
        </span>
      </div>

      {/* Priority and Status */}
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
          {getPriorityText(task.priority)} Priority
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}