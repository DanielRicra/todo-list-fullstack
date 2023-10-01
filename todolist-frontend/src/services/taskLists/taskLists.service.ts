import { TaskList } from '../../types';
import { ApiRequest } from '../api';

export const TaskListService = {
   getByUserId: async (userId: string) =>
      ApiRequest.get(`/taskList/user?id=${userId}`),
   getOne: async (taskListId: string) =>
      ApiRequest.get(`/taskList/${taskListId}`),
   create: async <T>(body: T) => ApiRequest.post<T>('/taskList', body),
   update: async (body: Partial<TaskList>, taskListId: string) =>
      ApiRequest.put<Partial<TaskList>>(`/taskList/${taskListId}`, body),
   delete: async (taskListId: string) =>
      ApiRequest.delete(`/taskList/delete/${taskListId}`),
};
