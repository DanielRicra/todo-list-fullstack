import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "../services";
import { taskListKey } from "../constants/query-keys";

export function useCreateTask() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: TaskService.create,
      onSuccess: (response) => {
         queryClient.invalidateQueries({
            queryKey: [taskListKey, `${response.data.taskListId}`],
         });
      },
   });
}

export function useUpdateTask(taskListId?: number) {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: TaskService.update,
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: [taskListKey, taskListId?.toString()],
         });
      },
   });
}

export function useDeleteTask(taskListId?: number) {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: TaskService.delete,
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: [taskListKey, taskListId?.toString()],
         });
      },
   });
}
