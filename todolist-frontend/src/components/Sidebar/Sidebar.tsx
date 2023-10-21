import { useState } from "react";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import {
   Alert,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Skeleton,
   TextField,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import "./Sidebar.scss";
import { IMPORTANT, PLANNED } from "../../constants/taskListId";
import { Link, useParams } from "react-router-dom";
import {
   useCreateTaskList,
   useGetUserTaskLists,
} from "../../hooks/use-task-lists";
import { useUserContext } from "../../providers/User";

interface SidebarProps {
   showSidebar: boolean;
   setShowSidebar: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ showSidebar, setShowSidebar }) => {
   const [openFormList, setOpenFormList] = useState(false);
   const [taskListName, setTaskListName] = useState("");

   const { user } = useUserContext();
   const { data: taskLists, status } = useGetUserTaskLists(user?.userId ?? 0);
   const { mutate, isLoading: isCreatingTaskList } = useCreateTaskList();

   const { taskListId } = useParams();

   const dark = createTheme({
      palette: {
         mode: "dark",
         primary: {
            main: "#454f94",
         },
         secondary: {
            main: "#E65F2B",
         },
         error: { main: "#e23a23" },
         background: {
            default: "#1b1f3a",
            paper: "#292f57",
         },
      },
   });

   const createNewTaskList = () => {
      mutate(
         { name: taskListName, userId: user?.userId },
         {
            onSuccess: () => {
               setTaskListName("");
               setOpenFormList(false);
            },
         }
      );
   };

   const handleFormListClose = () => {
      setOpenFormList(false);
   };

   return (
      <>
         <div className={"sidebar" + (showSidebar ? " show" : "")}>
            <div
               className="sidebar__menu-icon"
               onClick={() => setShowSidebar(false)}
            >
               <MenuOutlinedIcon />
            </div>

            <h1 className="h1 sidebar-container">Ts To Do</h1>
            <div className="sidebar__menu">
               <ul>
                  <li
                     className={
                        taskListId === IMPORTANT.toString()
                           ? "sidebar-container active"
                           : "sidebar-container"
                     }
                  >
                     <Link to="/dashboard/tasks/important">
                        <GradeOutlinedIcon fontSize="small" />
                        <p>Important</p>
                     </Link>
                  </li>
                  <li
                     className={
                        taskListId === PLANNED.toString()
                           ? "sidebar-container active"
                           : "sidebar-container"
                     }
                  >
                     <Link to="/dashboard/tasks/planned">
                        <CalendarMonthOutlinedIcon fontSize="small" />
                        <p>Planned</p>
                     </Link>
                  </li>
               </ul>
            </div>

            <div className="sidebar__tasklists">
               {status === "loading" ? <Skeleton /> : null}
               {status === "success" && taskLists?.length === 0 ? (
                  <div className="sidebar__tasklists-empty">
                     There is no list to save tasks yet, create one to start
                     saving tasks. Click in 'New List' at the bottom left
                  </div>
               ) : null}
               {status === "success" && taskLists?.length > 0 ? (
                  <ul>
                     {taskLists.map((taskList) => (
                        <li
                           key={taskList.taskListId}
                           className={
                              "sidebar-container " +
                              (taskList.taskListId.toString() === taskListId
                                 ? "active"
                                 : "")
                           }
                        >
                           <Link to={`/dashboard/${taskList.taskListId}`}>
                              <ListRoundedIcon fontSize="small" />
                              <p>{taskList.name}</p>
                              {taskList?.tasks?.length > 0 && (
                                 <span>
                                    {
                                       taskList.tasks?.filter(
                                          (task) => task.state === false
                                       ).length
                                    }
                                 </span>
                              )}
                           </Link>
                        </li>
                     ))}
                  </ul>
               ) : (
                  <div>
                     <Alert variant="outlined" severity="error">
                        Something went wrong.
                     </Alert>
                  </div>
               )}
            </div>

            <div className="sidebar__create-tasklist">
               <button type="button" onClick={() => setOpenFormList(true)}>
                  <AddSharpIcon fontSize="small" /> New List
               </button>
            </div>

            <ThemeProvider theme={dark}>
               <Dialog
                  open={openFormList}
                  onClose={handleFormListClose}
                  fullWidth
                  color="primary"
               >
                  <DialogTitle>Create new Task List</DialogTitle>
                  <DialogContent>
                     <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Task List Name"
                        type="text"
                        fullWidth
                        color="secondary"
                        variant="standard"
                        value={taskListName}
                        onChange={(e) => setTaskListName(e.target.value)}
                     />
                  </DialogContent>
                  <DialogActions>
                     <Button
                        onClick={handleFormListClose}
                        color="secondary"
                        variant="contained"
                        disabled={isCreatingTaskList}
                     >
                        Cancel
                     </Button>
                     <Button
                        onClick={createNewTaskList}
                        color="primary"
                        variant="contained"
                        disabled={isCreatingTaskList}
                     >
                        {isCreatingTaskList ? "Creating..." : "Create"}
                     </Button>
                  </DialogActions>
               </Dialog>
            </ThemeProvider>
         </div>

         {showSidebar && (
            <div
               className="full-overlay"
               onClick={() => setShowSidebar(false)}
            />
         )}
      </>
   );
};

export default Sidebar;
