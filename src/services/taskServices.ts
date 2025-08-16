"use server";

import { $Enums } from '@prisma/client';
import { prisma } from "@/lib/prismaClient";
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getCurrentUserFromCookies } from '@/lib/auth';

export async function getAllTask(userId: number) {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error('Failed to fetch tasks');
    }
}

export async function createTask(formData: FormData) {
    try {

        const currentUser = await getCurrentUserFromCookies();
        if (!currentUser) {
            {
                redirect('/login');
                return;
            }
        }

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const dueDate = formData.get('dueDate') as string;
        const priority = formData.get('priority') ? Number(formData.get('priority')) : null;
        const status = formData.get('status') as string;

        await prisma.task.create({
            data: {
                title,
                description: description || null,
                dueDate: dueDate ? new Date(dueDate) : null,
                priority,
                status: status as $Enums.TaskStatus,
                userId: currentUser.userId,
            },
        });

        revalidatePath('/');

    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }

    redirect('/');
}

export async function updateTask(taskId: number, formData: FormData) {
    try {
        const currentUser = await getCurrentUserFromCookies();
        if (!currentUser) {
            redirect('/login');
            return;
        }

        // Check if the task belongs to the current user
        const existingTask = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId: currentUser.userId,
            },
        });

        if (!existingTask) {
            throw new Error('Task not found or you do not have permission to edit this task');
        }

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const dueDate = formData.get('dueDate') as string;
        const priority = formData.get('priority') ? Number(formData.get('priority')) : null;
        const status = formData.get('status') as string;

        await prisma.task.update({
            where: { id: taskId },
            data: {
                title,
                description: description || null,
                dueDate: dueDate ? new Date(dueDate) : null,
                priority,
                status: status as $Enums.TaskStatus,
            },
        });

        revalidatePath('/');
        return { success: true };

    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function deleteTask(taskId: number) {
    try {
        const currentUser = await getCurrentUserFromCookies();
        if (!currentUser) {
            redirect('/login');
            return;
        }

        // Check if the task belongs to the current user
        const existingTask = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId: currentUser.userId,
            },
        });

        if (!existingTask) {
            throw new Error('Task not found or you do not have permission to delete this task');
        }

        await prisma.task.delete({
            where: { id: taskId },
        });

        revalidatePath('/');
        return { success: true };

    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}