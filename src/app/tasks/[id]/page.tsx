import { notFound } from 'next/navigation';
import { prisma } from "@/lib/prismaClient";

export default async function Page({ params }: { params: { id: string } }) {
    const id = (await params).id;
    const task = await prisma.task.findUnique({
        where: { id: Number(id) },
    });
    if (!task) {
        return notFound();
    }   
    return (
        <div className='min-h-screen'>
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md ">
                <h2 className="text-2xl font-semibold mb-2">{task.title}</h2>
                <p className="text-gray-700 mb-4">{task.description}</p>
                <p className="text-gray-600">Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
                <p className="text-gray-600">Priority: {task.priority}</p>
                <p className="text-gray-600">Status: {task.status}</p>
            </div>
        </div>
    );
}