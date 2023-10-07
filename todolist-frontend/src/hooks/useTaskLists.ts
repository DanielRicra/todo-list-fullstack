import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TaskListService } from "../services/taskLists/taskLists.service";
import type { TaskList } from "../types";

const taskListsKey = "taskLists";
const taskListKey = "taskList";

export function useGetUserTaskLists(userId: number) {
   return useQuery({
      queryKey: [taskListsKey, userId],
      queryFn: async () => {
         const response = await TaskListService.getManyByUserId(userId);
         return response.data as TaskList[];
      },
   });
}

export function useCreateTaskList() {
   const queryClient = useQueryClient();
   return useMutation({ 
      mutationFn: TaskListService.create,
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: [taskListsKey]})}
   })
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
