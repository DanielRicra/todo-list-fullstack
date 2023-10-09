import { ApiRequest } from "../api";
import { Task, TaskForCreate } from "../../types";

export const TaskService = {
   getImportantByUserId: async (userId: string) =>
      ApiRequest.get(`/task/important/${userId}`),
   getByTaskListId: async (taskListId: string) =>
      ApiRequest.get(`/task/taskList/${taskListId}`),
   update: async ({
      taskId,
      data,
   }: {
      taskId: Task["taskId"];
      data: Partial<Task>;
   }) => ApiRequest.put<Partial<Task>>(`/task/${taskId}`, data),
   create: async (data: TaskForCreate) =>
      ApiRequest.post<Partial<Task>>(`/task`, data),
};
