import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TaskListService } from "../services/taskLists/task-lists.service";
import type { TaskList } from "../types";
import { taskListKey, taskListsKey } from "../constants/query-keys";
import { toast } from "sonner";
import { AxiosError } from "axios";

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

export function useUpdateTaskList(userId?: number | null) {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: TaskListService.update,
      onSuccess: () => {
         toast.success("Task list updated successfully");
         return Promise.all([
            queryClient.invalidateQueries({ queryKey: [taskListKey] }),
            queryClient.invalidateQueries({ queryKey: [taskListsKey, userId] }),
         ]);
      },
      onError: (error) => {
         const defaultMessage = "Something went wrong, try again later.";
         toast.error(
            error instanceof AxiosError
               ? error.response?.data.message || defaultMessage
               : defaultMessage
         );
      },
   });
}

export function useDeleteTaskList(userId?: number | null) {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: TaskListService.delete,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [taskListsKey, userId] });
         toast.success("Task list deleted successfully");
      },
      onError: (error) => {
         const defaultMessage = "Something went wrong, try again later.";
         toast.error(
            error instanceof AxiosError
               ? error.response?.data.message || defaultMessage
               : defaultMessage
         );
      },
   });
}
