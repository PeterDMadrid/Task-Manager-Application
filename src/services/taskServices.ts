"use server";

import { $Enums } from '@prisma/client';
import { prisma } from "@/lib/prismaClient";
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getCurrentUserFromCookies } from '@/lib/auth';

export async function getUserTasks(userId: number) {
  return prisma.task.findMany({
    where: { userId: userId },
  }); 
}

export async function createTask(formData: FormData) {
    try {

        const currentUser = await getCurrentUserFromCookies();
        if(!currentUser) {
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