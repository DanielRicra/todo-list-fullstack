import { useMemo, useState } from "react";
import { Alert, Box, Skeleton, Snackbar } from "@mui/material";
import { useParams } from "react-router-dom";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import "./Tasks.scss";
import Task from "./Task/Task";
import TaskForm from "./TaskForm/TaskForm";
import CreateTaskForm from "./CreateTaskForm/CreateTaskForm";
import { TaskListHeader } from "./TaskListHeader";
import { useGetTaskList } from "../../hooks/use-task-lists";
import useModalStore from "../../hooks/use-modal-store";

const Tasks = () => {
   const navbar = document.getElementById("navbar");
   const [showCompletedTasks, setShowCompletedTasks] = useState(false);
   const { isOpen: isTaskFormOpen, onClose, onOpen } = useModalStore();

   const [showWarningCreateTask, setShowWarningCreateTask] = useState(false);

   const { taskListId } = useParams();
   const { data: taskList, isLoading } = useGetTaskList(taskListId ?? "");

   const completedTasks = useMemo(() => {
      return taskList?.tasks.filter((task) => !!task.state) ?? [];
   }, [taskList]);

   const pendingTasks = useMemo(() => {
      return taskList?.tasks.filter((task) => !task.state) ?? [];
   }, [taskList]);

   const handleCloseWarning = () => setShowWarningCreateTask(false);
   const handleOpenWarning = () => setShowWarningCreateTask(true);

   return (
      <>
         <div
            className="tasks"
            style={{ height: `calc(100vh - ${navbar?.offsetHeight}px)` }}
         >
            <div className="tasks__container">
               <div className="tasks__list">
                  <TaskListHeader taskListName={taskList?.name ?? ""} />

                  {taskList?.tasks.length === 0 && (
                     <h3 className="h3">There are no tasks yet</h3>
                  )}
                  {isLoading ? (
                     <Box sx={{ width: "100%" }}>
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                     </Box>
                  ) : (
                     <ul>
                        {pendingTasks?.map((task) => (
                           <li key={task.taskId}>
                              <Task
                                 task={task}
                                 onEdit={() => {
                                    onOpen(task);
                                 }}
                              />
                           </li>
                        ))}
                     </ul>
                  )}

                  {completedTasks.length > 0 && (
                     <div>
                        <div
                           className="tasks-subtile"
                           onClick={() =>
                              setShowCompletedTasks((prev) => !prev)
                           }
                        >
                           {showCompletedTasks ? (
                              <KeyboardArrowDownIcon />
                           ) : (
                              <KeyboardArrowRightIcon />
                           )}
                           <p>Completed</p>
                           <span>{completedTasks.length}</span>
                        </div>

                        <ul
                           className={
                              "tasks__completed " +
                              (showCompletedTasks ? "show-tasks" : "hide-tasks")
                           }
                        >
                           {completedTasks.map((task) => (
                              <li key={task.taskId}>
                                 <Task
                                    task={task}
                                    onEdit={() => {
                                       onOpen(task);
                                    }}
                                 />
                              </li>
                           ))}
                        </ul>
                     </div>
                  )}
               </div>

               <CreateTaskForm
                  handleOpenWarning={handleOpenWarning}
                  taskListId={taskListId}
               />
            </div>
         </div>

         <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={showWarningCreateTask}
            autoHideDuration={4000}
            onClose={handleCloseWarning}
         >
            <Alert
               onClose={handleCloseWarning}
               severity="warning"
               variant="filled"
               elevation={6}
               sx={{
                  backgroundColor: "#b74316",
                  color: "#F0f0f0",
                  fontSize: "16px",
               }}
            >
               You must choose or create a list.
            </Alert>
         </Snackbar>

         {isTaskFormOpen ? (
            <>
               <TaskForm />
               <div className="overlay__task-form" onClick={onClose} />
            </>
         ) : null}
      </>
   );
};

export default Tasks;
