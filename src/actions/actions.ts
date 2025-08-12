"use server";

import { PrismaClient } from '../generated/prisma';
import { $Enums } from '../generated/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createTask(formData: FormData) {
    const prisma = new PrismaClient();

    try {
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
            },
        });

        revalidatePath('/');
        redirect('/'); // Redirect after successful creation
        
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}