'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from './button';
import { updateTask, deleteTask } from '@/services/taskServices'; // Adjust path as needed

interface Task {
  id: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: number | null;
  status: string;
  userId: number;
  user: {
    name: string;
  };
}

interface TaskCardProps {
  task: Task;
  currentUserId?: number;
}

export default function TaskCard({ task, currentUserId }: TaskCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    priority: task.priority,
    status: task.status,
  });
  const [isPending, startTransition] = useTransition();

  const canModify = currentUserId === task.userId;

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      priority: task.priority,
      status: task.status,
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('title', editData.title);
        formData.append('description', editData.description);
        formData.append('dueDate', editData.dueDate);
        if (editData.priority !== null) {
          formData.append('priority', editData.priority.toString());
        }
        formData.append('status', editData.status);

        await updateTask(task.id, formData);
        setIsEditing(false);
        router.refresh();
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
      }
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      startTransition(async () => {
        try {
          await deleteTask(task.id);
          router.refresh();
        } catch (error) {
          console.error('Error deleting task:', error);
          alert('Failed to delete task. Please try again.');
        }
      });
    }
  };

  const handleInputChange = (field: string, value: string | number | null) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 w-full sm:w-full md:w-104 lg:w-96 border-2 border-blue-200">
        {/* Edit form */}
        <div className="space-y-4">
          {/* Title input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
          </div>

          {/* Description input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
          </div>

          {/* Due date input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={editData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
          </div>

          {/* Priority select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={editData.priority || ''}
              onChange={(e) => handleInputChange('priority', e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            >
              <option value="">No Priority</option>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
          </div>

          {/* Status select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={editData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-2">
            <Button label="Cancel" onClick={handleCancel} disabled={isPending}/>
            <Button label={isPending ? 'Saving...' : 'Save'} onClick={handleSave} disabled={isPending}/>
          </div>
        </div>

        {/* Creator info (always visible) */}
        <div className="text-xs text-gray-500 mt-4 pt-2 border-t">
          Created by {task.user.name}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full sm:w-full md:w-104 lg:w-96 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
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
      <p className="text-gray-500/50 text-xs mb-4">
        {task.description && task.description.length > 100
          ? `${task.description.slice(0, 100)}...`
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
      <div className="flex justify-between items-center mb-4">
        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
          {getPriorityText(task.priority)} Priority
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {/* Edit and Delete buttons - only show if user can modify */}
      {canModify && (
        <div className="flex justify-between items-center">
          <Button label="Edit" onClick={handleEdit} disabled={isPending}/>
          <Button label="Delete" onClick={handleDelete} disabled={isPending} />
        </div>
      )}

      {/* Show message if user cannot modify */}
      {!canModify && (
        <div className="text-xs text-gray-400 text-center py-2">
          You can only edit your own tasks
        </div>
      )}
    </div>
  );
}
