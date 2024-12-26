import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
//import { Active, DataRef, Over } from '@dnd-kit/core';
//import { ColumnDragData } from '@/app/dashboard/kanban/_components/board-column';
//import { TaskDragData } from '@/app/dashboard/kanban/_components/task-card';

//type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

