"use client";

import { useState, useEffect } from 'react';
import TaskCard from '@/components/TaskCards';

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

interface HomeClientProps {
  initialTasks: Task[];
  currentUserId: number;
}

export default function HomeClient({ initialTasks, currentUserId }: HomeClientProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filteredTasks, setFilteredTasks] = useState(initialTasks);
  
  // Filter states
  const [userFilter, setUserFilter] = useState<string>('all'); // 'all' or 'mine'
  const [priorityFilter, setPriorityFilter] = useState<string>('all'); // 'all', '1', '2', '3'
  const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', 'TODO', 'IN_PROGRESS', 'COMPLETED'

  // Apply filters whenever filter states change
  useEffect(() => {
    let filtered = [...tasks];

    // User filter
    if (userFilter === 'mine') {
      filtered = filtered.filter(task => task.userId === currentUserId);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority?.toString() === priorityFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, userFilter, priorityFilter, statusFilter, currentUserId]);

  return (
    <div className="min-h-screen text-gray-300 p-6">
      {/* Filters */}
      <div className="max-w-4xl mx-auto mb-8 p-4 bg-gray-800 rounded-lg">
        <div className="flex flex-wrap gap-4 items-center">
          {/* User Filter */}
          <div className="flex items-center gap-2">
            <label className="text-white text-sm font-medium">Show:</label>
            <select 
              value={userFilter} 
              onChange={(e) => setUserFilter(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Tasks</option>
              <option value="mine">My Tasks</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <label className="text-white text-sm font-medium">Priority:</label>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-white text-sm font-medium">Status:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button 
            onClick={() => {
              setUserFilter('all');
              setPriorityFilter('all');
              setStatusFilter('all');
            }}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition-colors"
          >
            Clear Filters
          </button>
        </div>
        
        {/* Results count */}
        <div className="mt-3 text-gray-400 text-sm">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Tasks */}
      {filteredTasks.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-400">
            {tasks.length === 0 ? "No tasks found. Create your first task!" : "No tasks match your filters."}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-start max-w-7xl mx-auto">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} currentUserId={currentUserId}/>
          ))}
        </div>
      )}
    </div>
  );
}
