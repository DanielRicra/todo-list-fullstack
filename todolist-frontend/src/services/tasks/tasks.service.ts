import { ApiRequest } from "../api";
import { Task, TaskForCreate } from "../../types";

export const TaskService = {
   getImportantByUserId: (userId: string) =>
      ApiRequest.get(`/task/important/${userId}`),
   getByTaskListId: (taskListId: string) =>
      ApiRequest.get(`/task/taskList/${taskListId}`),
   update: ({
      taskId,
      data,
   }: {
      taskId: Task["taskId"];
      data: Partial<Task>;
   }) => ApiRequest.put<Partial<Task>>(`/task/${taskId}`, data),
   create: (data: TaskForCreate) =>
      ApiRequest.post<Partial<Task>>(`/task`, data),
   delete: (taskId: Task["taskId"]) => ApiRequest.delete(`/task/delete/${taskId}`),
};
