import { useState } from 'react';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   TextField,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './styles.scss';

interface TaskListHeaderProps {
   taskListName: string;
}

export const TaskListHeader: React.FC<TaskListHeaderProps> = ({
   taskListName,
}) => {
   const [isMoreClicked, setIsMoreClicked] = useState(false);
   const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
   const [openEditAlert, setOpenEditAlert] = useState(false);
   const [formData, setFormData] = useState('');

   const dark = createTheme({
      palette: {
         mode: 'dark',
         primary: {
            main: '#454f94',
            light: '#363e74',
         },
         secondary: {
            main: '#E65F2B',
         },
         error: { main: '#e23a23' },
         background: {
            default: '#1b1f3a',
            paper: '#292f57',
         },
      },
   });

   const deleteTaskList = () => {
      // axios
      //    .delete(
      //       `https://spring-tstodolist.herokuapp.com/api/taskList/delete/${taskListId}`
      //    )
      //    .then((response) => {
      //    })
      //    .catch((error) => {
      //       console.log(error);
      //    })
      //    .finally(() => {
      //       setOpenDeleteAlert(false);
      //       setIsMoreClicked(false);
      //    });
      console.log('Tasks.tsx -> Implement deleteTaskList');
   };

   const updateTaskList = () => {
      // axios
      //    .put(
      //       `https://spring-tstodolist.herokuapp.com/api/taskList/${taskListId}`,
      //       { name: taskListName, userId: user?.userId }
      //    )
      //    .then((response) => {
      //    })
      //    .catch((error) => {
      //       console.log(error);
      //    })
      //    .then(() => {
      //       setOpenEditAlert(false);
      //       setIsMoreClicked(false);
      //    });
      console.log('Tasks.tsx -> implement updateTaskList');
   };

   const closeAlert = () => {
      setOpenDeleteAlert(false);
      setOpenEditAlert(false);
   };

   return (
      <>
         <div className='tasks__list-tittle'>
            <h2>{taskListName}</h2>
            <div className='more-button'>
               <div
                  className='more-button-icon'
                  onClick={() => setIsMoreClicked((prev) => !prev)}
               >
                  <MoreHorizOutlinedIcon />
               </div>
               {isMoreClicked && (
                  <div className='tasklist__menu'>
                     <p onClick={() => setOpenEditAlert(true)}>Edit name</p>
                     <p onClick={() => setOpenDeleteAlert(true)}>
                        Delete task list
                     </p>
                  </div>
               )}
            </div>
            {isMoreClicked && (
               <span
                  className='overlay__more-icon'
                  onClick={() => setIsMoreClicked(false)}
               />
            )}
         </div>

         <ThemeProvider theme={dark}>
            <Dialog
               open={openDeleteAlert || openEditAlert}
               onClose={closeAlert}
               fullWidth
               aria-labelledby='alert-dialog-title'
               aria-describedby='alert-dialog-description'
            >
               <DialogTitle id='alert-dialog-title'>
                  {openDeleteAlert
                     ? 'Are you sure you want to delete this TaskList and all its tasks?'
                     : 'Update Task List name'}
               </DialogTitle>
               <DialogContent>
                  {openDeleteAlert && (
                     <DialogContentText id='alert-dialog-description'>
                        {taskListName}
                     </DialogContentText>
                  )}
                  {openEditAlert && (
                     <TextField
                        autoFocus
                        margin='dense'
                        id='name'
                        label='Task List Name'
                        type='text'
                        fullWidth
                        color='secondary'
                        variant='standard'
                        value={formData}
                        onChange={(e) => setFormData(e.target.value)}
                     />
                  )}
               </DialogContent>
               <DialogActions>
                  <Button
                     onClick={closeAlert}
                     color='secondary'
                     variant='contained'
                  >
                     Cancel
                  </Button>
                  {openDeleteAlert ? (
                     <Button
                        onClick={deleteTaskList}
                        color='error'
                        variant='contained'
                        autoFocus
                     >
                        Delete
                     </Button>
                  ) : (
                     <Button
                        onClick={updateTaskList}
                        color='primary'
                        variant='contained'
                        autoFocus
                     >
                        Save Changes
                     </Button>
                  )}
               </DialogActions>
            </Dialog>
         </ThemeProvider>
      </>
   );
};
