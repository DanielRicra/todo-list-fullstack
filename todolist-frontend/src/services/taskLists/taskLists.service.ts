import { TaskList } from '../../types';
import { ApiRequest } from '../api';

export const TaskListService = {
   getManyByUserId: async (userId: number) =>
      ApiRequest.get(`/taskList/user?id=${userId}`),
   getOne: async (taskListId: string) =>
      ApiRequest.get(`/taskList/${taskListId}`),
   create: async (body: Partial<TaskList>) => ApiRequest.post<Partial<TaskList>>('/taskList', body),
   update: async (body: Partial<TaskList>, taskListId: string) =>
      ApiRequest.put<Partial<TaskList>>(`/taskList/${taskListId}`, body),
   delete: async (taskListId: string) =>
      ApiRequest.delete(`/taskList/delete/${taskListId}`),
};
