'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Button from './button';
import { updateTask, deleteTask } from '@/services/taskServices';

interface Task {
  id: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: number | null;
  status: string;
  userId: number;
}

interface TaskActionsProps {
  task: Task;
  currentUserId?: number;
}

export default function TaskActions({ task, currentUserId }: TaskActionsProps) {
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

  const handleBack = () => {
    router.back();
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
          router.push('/'); // Redirect to tasks list after deletion
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
      <div className="space-y-4 mt-6">
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
            rows={4}
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
          <Button label="Cancel" onClick={handleCancel} disabled={isPending} />
          <Button label={isPending ? 'Saving...' : 'Save'} onClick={handleSave} disabled={isPending} />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Back button */}
      <div className="mb-4">
        <Button label="← Back" onClick={handleBack} disabled={isPending} />
      </div>

      {/* Edit and Delete buttons - only show if user can modify */}
      {canModify && (
        <div className="flex justify-between items-center">
          <Button label="Edit" onClick={handleEdit} disabled={isPending} />
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
