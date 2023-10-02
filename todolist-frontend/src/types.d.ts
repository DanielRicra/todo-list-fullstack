export type AuthUser = {
   email: string;
   userId: number;
   name: string;
};

export interface TaskList {
  taskListId: number
  name: string
  userId: number
  tasks: Task[]
}

export interface Task {
  taskId: number
  name: string
  state: boolean
  createdAt: string
  dueDate?: string
  note?: string
  completedAt?: string
  taskListId: number
  important?: boolean
}

export interface UserForAuth {
  email: string;
  password: string;
  name: string;
}