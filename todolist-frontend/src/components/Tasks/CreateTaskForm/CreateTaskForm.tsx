import { useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "axios";

import AddSharpIcon from "@mui/icons-material/AddSharp";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTextField } from "../../Inputs/Inputs";

import { IMPORTANT, PLANNED } from "../../../constants/taskListId";
import "./CreateTaskForm.scss";
import type { TaskList } from "../../../types";

const initialTaskState = {
   name: "",
   state: false,
   createdAt: "",
   taskListId: 0,
   dueDate: "",
};

interface CreateTaskFormProps {
   handleOpenWarning: () => void;
   taskListId?: string;
}

// TODO: Resolve tasklist, pass a a prop or make a request here

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
   handleOpenWarning,
   taskListId,
}) => {
   const [taskData, setTaskData] = useState(initialTaskState);
   const [showTaskListMenu, setShowTaskListMenu] = useState(false);
   const [showDatePicker, setShowDatePicker] = useState(false);
   const [selectedTaskList, setSelectedTaskList] = useState<TaskList>({
      name: "",
      taskListId: 0,
      tasks: [],
      userId: 1,
   });
   const [dueDate, setDueDate] = useState(null);
   const taskLists: TaskList[] = [
      { name: "New One", taskListId: 1, tasks: [], userId: 1 },
   ];

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
      setTaskData((prev) => ({
         ...prev,
         taskListId: parseInt(taskListId ?? "0", 10),
      }));
      setSelectedTaskList((prev) => ({
         ...prev,
         name: taskLists[0].name,
         taskListId: taskLists[0].taskListId,
      }));
   }, [taskListId]);

   const createTask = () => {
      if (selectedTaskList?.taskListId === undefined) {
         handleOpenWarning();
         return;
      }
      axios
         .post("http://localhost:8080/api/task", {
            ...taskData,
            taskListId:
               taskListId === IMPORTANT.toString() ||
               taskListId === PLANNED.toString()
                  ? selectedTaskList.taskListId
                  : taskData.taskListId,
            createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
         })
         .then((_response) => {
            setTaskData(initialTaskState);
            cleanCreateTaskFields();
         })
         .catch((error) => {
            console.log(error);
         });
   };

   const cleanCreateTaskFields = () => {
      setDueDate(null);
      setShowDatePicker(false);
      setShowTaskListMenu(false);
   };

   return (
      <div className="tasks__create-task">
         <AddSharpIcon fontSize="small" />
         <input
            type="text"
            placeholder="New Task"
            onChange={(e) =>
               setTaskData((prev) => ({ ...prev, name: e.target.value }))
            }
            value={taskData.name}
         />
         {(taskListId === IMPORTANT.toString() ||
            taskListId === PLANNED.toString()) && (
            <div className="tasks__select-tasklist">
               <div
                  className="tasks__selected-tasklist"
                  onClick={() => {
                     setShowTaskListMenu((prev) => !prev);
                     setShowDatePicker(false);
                  }}
               >
                  <DensityMediumOutlinedIcon fontSize="small" />
                  <p>{selectedTaskList.name}</p>
               </div>
               {showTaskListMenu && (
                  <div className="tasks__tasklists">
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

         <div className="duedate">
            <div
               className="duedate-content"
               onClick={() => {
                  setShowDatePicker((prev) => !prev);
                  setShowTaskListMenu(false);
               }}
            >
               {dueDate && (
                  <div className="duedate-text">
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
                     "duedate-date-picker" + (dueDate ? "" : " no-date")
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
                        className="clean-duedate"
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

         <button type="button" onClick={createTask}>
            Create
         </button>
      </div>
   );
};

export default CreateTaskForm;
