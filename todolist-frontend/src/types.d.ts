export type AuthUser = {
   email: string;
   userId: number;
   name: string;
};

export interface TaskList {
   taskListId: number;
   name: string;
   userId: number;
   tasks: Task[];
}

export interface Task {
   taskId: number;
   name: string;
   state: boolean;
   createdAt: string;
   dueDate?: string | null;
   note?: string;
   completedAt?: string | null;
   taskListId: number;
   important?: boolean;
}

export interface TaskForCreate {
   name: string;
   state: boolean;
   taskListId: number;
   createdAt: string;
   dueDate?: string;
   note?: string;
   completedAt?: string;
   important?: boolean;
}

export interface UserForAuth {
   email: string;
   password: string;
   name: string;
}
