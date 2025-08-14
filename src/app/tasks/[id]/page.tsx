import { notFound } from 'next/navigation';
import { prisma } from "@/lib/prismaClient";
import TaskActions from '@/components/TaskActions';
import { getCurrentUserFromCookies } from '@/lib/auth'; 

export default async function Page({ params }: { params: { id: string } }) {
    const id = (await params).id;
    
    const auth = await getCurrentUserFromCookies();
    const currentUserId = auth?.userId;

    const task = await prisma.task.findUnique({
        where: { id: Number(id) },
        include: {
            user: {
                select: {
                    name: true
                }
            }
        }
    });

    if (!task) {
        return notFound();
    }

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
        <div className='min-h-screen py-8'>
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Header with title and creator */}
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="font-semibold text-3xl text-gray-900">
                            {task.title}
                        </h1>
                        <div className="text-sm text-gray-500 ml-4">
                            by {task.user.name}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {task.description || "No description provided"}
                        </p>
                    </div>

                    {/* Task Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Due date */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-600 mb-1">Due Date</h4>
                            <span className="text-lg text-gray-900">
                                {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : "No due date"}
                            </span>
                        </div>

                        {/* Priority */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-600 mb-1">Priority</h4>
                            <span className={`text-lg font-medium ${getPriorityColor(task.priority)}`}>
                                {getPriorityText(task.priority)}
                            </span>
                        </div>

                        {/* Status */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-600 mb-1">Status</h4>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Interactive Actions Component */}
                    <TaskActions task={task} currentUserId={currentUserId} />
                </div>
            </div>
        </div>
    );
}