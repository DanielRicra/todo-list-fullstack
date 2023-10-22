import { TaskList } from "../../types";
import { ApiRequest } from "../api";

export const TaskListService = {
   getManyByUserId: (userId: number) =>
      ApiRequest.get(`/taskList/user?id=${userId}`),
   getOne: (taskListId: string) => ApiRequest.get(`/taskList/${taskListId}`),
   create: (body: Partial<TaskList>) =>
      ApiRequest.post<Partial<TaskList>>("/taskList", body),
   update: ({
      body,
      taskListId,
   }: {
      body: Partial<TaskList>;
      taskListId: number;
   }) => ApiRequest.put<Partial<TaskList>>(`/taskList/${taskListId}`, body),
   delete: (taskListId: number) =>
      ApiRequest.delete(`/taskList/delete/${taskListId}`),
};
