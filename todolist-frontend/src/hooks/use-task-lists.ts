import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TaskListService } from "../services/taskLists/task-lists.service";
import type { TaskList } from "../types";
import { taskListKey, taskListsKey } from "../constants/query-keys";

export function useGetUserTaskLists(userId: number, enabled = true) {
   return useQuery({
      queryKey: [taskListsKey, userId],
      queryFn: async () => {
         const response = await TaskListService.getManyByUserId(userId);
         return response.data as TaskList[];
      },
      enabled,
   });
}

export function useCreateTaskList() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: TaskListService.create,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [taskListsKey] });
      },
   });
}

export function useGetTaskList(taskListId: string) {
   return useQuery({
      queryKey: [taskListKey, taskListId],
      queryFn: async () => {
         const response = await TaskListService.getOne(taskListId);
         return response.data as TaskList;
      },
   });
}
