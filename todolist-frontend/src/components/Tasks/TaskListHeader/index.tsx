import { useState, useEffect } from "react";
import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

import "./styles.scss";
import { darkTheme } from "./mui-styles";
import {
   useDeleteTaskList,
   useUpdateTaskList,
} from "../../../hooks/use-task-lists";
import { useNavigate } from "react-router-dom";

interface TaskListHeaderProps {
   taskListName: string;
   userId: number;
   taskListId: number;
}

export const TaskListHeader: React.FC<TaskListHeaderProps> = ({
   taskListName,
   userId,
   taskListId,
}) => {
   const [isMoreClicked, setIsMoreClicked] = useState(false);
   const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
   const [openEditAlert, setOpenEditAlert] = useState(false);
   const [name, setName] = useState("");
   const navigate = useNavigate();

   const { mutate: updateMutate, isLoading: isUpdating } =
      useUpdateTaskList(userId);
   const { mutate: deleteMutate, isLoading: isDeleting } =
      useDeleteTaskList(userId);

   const deleteTaskList = () => {
      deleteMutate(taskListId, {
         onSuccess: () => {
            navigate("/dashboard");
         },
         onSettled: () => {
            setOpenDeleteAlert(false);
            setIsMoreClicked(false);
         },
      });
   };

   const updateTaskList = () => {
      updateMutate(
         {
            taskListId,
            body: { name, userId },
         },
         {
            onSettled: () => {
               setOpenEditAlert(false);
               setIsMoreClicked(false);
            },
         }
      );
   };

   const closeAlert = () => {
      setOpenDeleteAlert(false);
      setOpenEditAlert(false);
   };

   useEffect(() => {
      setName(taskListName);
   }, [taskListName]);

   return (
      <>
         <div className="tasks__list-tittle">
            <h2>{taskListName}</h2>
            <div className="more-button">
               <div
                  className="more-button-icon"
                  onClick={() => setIsMoreClicked((prev) => !prev)}
               >
                  <MoreHorizOutlinedIcon />
               </div>
               {isMoreClicked && (
                  <div className="tasklist__menu">
                     <p onClick={() => setOpenEditAlert(true)}>Edit name</p>
                     <p onClick={() => setOpenDeleteAlert(true)}>
                        Delete task list
                     </p>
                  </div>
               )}
            </div>
            {isMoreClicked && (
               <span
                  className="overlay__more-icon"
                  onClick={() => setIsMoreClicked(false)}
               />
            )}
         </div>

         <ThemeProvider theme={darkTheme}>
            <Dialog
               open={openDeleteAlert || openEditAlert}
               onClose={closeAlert}
               fullWidth
               aria-labelledby="alert-dialog-title"
               aria-describedby="alert-dialog-description"
            >
               <DialogTitle id="alert-dialog-title">
                  {openDeleteAlert
                     ? "Are you sure you want to delete this TaskList and all its tasks?"
                     : "Update Task List name"}
               </DialogTitle>
               <DialogContent>
                  {openDeleteAlert && (
                     <DialogContentText id="alert-dialog-description">
                        {taskListName}
                     </DialogContentText>
                  )}
                  {openEditAlert && (
                     <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Task List Name"
                        type="text"
                        fullWidth
                        color="secondary"
                        variant="standard"
                        disabled={isUpdating}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                     />
                  )}
               </DialogContent>
               <DialogActions>
                  <Button
                     onClick={closeAlert}
                     color="secondary"
                     variant="contained"
                  >
                     Cancel
                  </Button>
                  {openDeleteAlert ? (
                     <Button
                        onClick={deleteTaskList}
                        color="error"
                        variant="contained"
                        autoFocus
                        disabled={isDeleting}
                     >
                        {isDeleting ? "Deleting..." : "Delete"}
                     </Button>
                  ) : (
                     <Button
                        onClick={updateTaskList}
                        color="primary"
                        variant="contained"
                        autoFocus
                        disabled={isUpdating}
                     >
                        {isUpdating ? "Saving changes..." : "Save changes"}
                     </Button>
                  )}
               </DialogActions>
            </Dialog>
         </ThemeProvider>
      </>
   );
};
