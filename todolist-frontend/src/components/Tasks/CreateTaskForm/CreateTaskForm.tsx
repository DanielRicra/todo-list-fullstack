import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { toast } from "sonner";

import AddSharpIcon from "@mui/icons-material/AddSharp";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { DateTextField } from "../../Inputs/Inputs";
import "./CreateTaskForm.scss";
import type { TaskList } from "../../../types";
import { useGetUserTaskLists } from "../../../hooks/use-task-lists";
import { useUserContext } from "../../../providers/User";
import { useCreateTask } from "../../../hooks/use-tasks";

const initialTaskState = {
   name: "",
   state: false,
   createdAt: "",
   dueDate: "",
};

interface CreateTaskFormProps {
   handleOpenWarning: () => void;
   taskListId?: string;
}
const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
   handleOpenWarning,
   taskListId,
}) => {
   const [taskData, setTaskData] = useState(initialTaskState);
   const [showTaskListMenu, setShowTaskListMenu] = useState(false);
   const [showDatePicker, setShowDatePicker] = useState(false);
   const [selectedTaskList, setSelectedTaskList] = useState<Partial<TaskList>>({
      name: "",
   });
   const [dueDate, setDueDate] = useState(null);
   const location = useLocation();
   const isImportantOrPlanned = location.pathname.includes("/tasks");
   const { user } = useUserContext();
   const { data: taskLists } = useGetUserTaskLists(
      user?.userId ?? 0,
      isImportantOrPlanned
   );
   const { mutate, isLoading: isCreatingTask } = useCreateTask();

   const darkCalendar = createTheme({
      palette: {
         mode: "dark",
         primary: {
            main: "#262b51",
            light: "#363e74",
         },
         secondary: {
            main: "#E65F2B",
         },
         error: { main: "#e23a23" },
         background: {
            default: "#1b1f3a",
            paper: "#242d60",
         },
      },
   });

   useEffect(() => {
      if (taskListId) {
         setSelectedTaskList((prev) => ({
            ...prev,
            taskListId: parseInt(taskListId),
         }));
      }
   }, [taskListId]);

   const onSubmit: React.FormEventHandler = (event) => {
      event.preventDefault();
      if (isImportantOrPlanned && selectedTaskList.taskListId) {
         handleOpenWarning();
         return;
      }

      mutate(
         {
            ...taskData,
            taskListId: selectedTaskList.taskListId ?? 0,
            createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : undefined,
         },
         {
            onSuccess: () => {
               setTaskData(initialTaskState);
               cleanCreateTaskFields();
               toast.success("Task created successfully", { duration: 3000 });
            },
            onError: (error) => {
               toast.error(
                  error instanceof Error
                     ? error.message
                     : "Something went wrong"
               );
            },
         }
      );
   };

   const cleanCreateTaskFields = () => {
      setDueDate(null);
      setShowDatePicker(false);
      setShowTaskListMenu(false);
   };

   return (
      <form className="tasks__create-task" onSubmit={onSubmit}>
         <AddSharpIcon fontSize="small" />
         <input
            type="text"
            placeholder="New Task"
            onChange={(e) =>
               setTaskData((prev) => ({ ...prev, name: e.target.value }))
            }
            value={taskData.name}
         />
         {isImportantOrPlanned && (
            <div className="tasks__select-task-list">
               <div
                  className="tasks__selected-task-list"
                  onClick={() => {
                     setShowTaskListMenu((prev) => !prev);
                     setShowDatePicker(false);
                  }}
               >
                  <DensityMediumOutlinedIcon fontSize="small" />
                  <p>{selectedTaskList.name}</p>
               </div>
               {showTaskListMenu && (
                  <div className="tasks__task-lists">
                     {taskLists &&
                        taskLists.map((taskList) => (
                           <div
                              key={taskList?.taskListId}
                              onClick={() => {
                                 setSelectedTaskList((prev) => ({
                                    ...prev,
                                    name: taskList?.name,
                                    id: taskList?.taskListId,
                                 }));
                                 setShowTaskListMenu(false);
                              }}
                           >
                              <DensityMediumOutlinedIcon fontSize="small" />
                              <p>{taskList?.name}</p>
                           </div>
                        ))}
                  </div>
               )}
            </div>
         )}

         <div className="due-date">
            <div
               className="due-date-content"
               onClick={() => {
                  setShowDatePicker((prev) => !prev);
                  setShowTaskListMenu(false);
               }}
            >
               {dueDate && (
                  <div className="due-date-text">
                     {format(dueDate, "ccc',' MMM d',' y")}
                  </div>
               )}

               <div className="calendar-icon">
                  <CalendarMonthOutlinedIcon />
               </div>
            </div>

            {showDatePicker && (
               <div
                  className={
                     "due-date-date-picker" + (dueDate ? "" : " no-date")
                  }
               >
                  <ThemeProvider theme={darkCalendar}>
                     <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <StaticDatePicker
                           displayStaticWrapperAs="desktop"
                           value={dueDate}
                           onChange={(newDate) => {
                              setDueDate(newDate);
                           }}
                           renderInput={(params) => (
                              <DateTextField {...params} />
                           )}
                        />
                     </LocalizationProvider>
                  </ThemeProvider>
                  {dueDate && (
                     <div
                        className="clean-due-date"
                        onClick={() => {
                           setShowDatePicker(false);
                           setDueDate(null);
                        }}
                     >
                        <CloseOutlinedIcon />
                     </div>
                  )}
               </div>
            )}
         </div>

         <button type="submit" disabled={isCreatingTask}>
            Create
         </button>
      </form>
   );
};

export default CreateTaskForm;
