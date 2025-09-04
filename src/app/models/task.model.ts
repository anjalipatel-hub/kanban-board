import { SubTask } from './subTask.model';

export interface Task {
  title: string;
  description: string;
  status: string;
  subtasks: SubTask[];
  id: number;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
}
