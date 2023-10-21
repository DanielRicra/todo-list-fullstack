import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
   Checkbox,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { format, isBefore } from "date-fns";
import { InferType, boolean, object, string } from "yup";
import { Controller, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { toast } from "sonner";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedTwoToneIcon from "@mui/icons-material/RadioButtonUncheckedTwoTone";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import GradeIcon from "@mui/icons-material/Grade";
import { ThemeProvider } from "@mui/material/styles";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

import "./TaskForm.scss";
import { DateTextField } from "../../Inputs/Inputs";
import useModalStore from "../../../hooks/use-modal-store";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkboxStyle, darkTheme } from "./mui-styles";
import { useDeleteTask, useUpdateTask } from "../../../hooks/use-tasks";

const updateTaskSchema = object({
   name: string()
      .typeError("Name must be a string")
      .required("Name is required"),
   note: string().typeError("Note must be a string").optional(),
   state: boolean().default(false),
   important: boolean().default(false),
});

type UpdateTask = InferType<typeof updateTaskSchema>;

const TaskForm = () => {
   const { onClose, taskToUpdate: task } = useModalStore();

   const {
      control,
      handleSubmit,
      formState: { errors },
   } = useForm<UpdateTask>({
      resolver: yupResolver(updateTaskSchema),
      defaultValues: {
         important: task?.important ?? false,
         state: task?.state ?? false,
         name: task?.name ?? "",
         note: task?.note ?? "",
      },
   });

   const [dueDate, setDueDate] = useState(
      task?.dueDate ? new Date(task.dueDate.concat(" 00:00:00")) : null
   );
   const [showCalendar, setShowCalendar] = useState(false);
   const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

   const { mutate: deleteTaskMutation } = useDeleteTask(task?.taskListId);
   const { mutate: updateTaskMutation } = useUpdateTask(task?.taskListId);

   const handleUpdate = (values: UpdateTask) => {
      updateTaskMutation(
         {
            data: {
               ...values,
               completedAt: values.state
                  ? format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
                  : null,
               dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
               taskListId: task?.taskListId ?? 0,
            },
            taskId: task?.taskId ?? 0,
         },
         {
            onSuccess: () => {
               toast.success("Task updated successfully");
               onClose();
            },
            onError: (error) => {
               const defaultMessage = "Something went wrong, try again later!";
               toast.error(
                  error instanceof AxiosError
                     ? error.response?.data.message || defaultMessage
                     : defaultMessage
               );
            },
         }
      );
   };

   const deleteTask = () => {
      deleteTaskMutation(task?.taskId ?? 0, {
         onSuccess: () => {
            setIsOpenDeleteModal(false);
            toast.success("Task deleted successfully");
            onClose();
         },
         onError: (error) => {
            const defaultMessage = "Something went wrong, try again later!";
            toast.error(
               error instanceof AxiosError
                  ? error.response?.data.message || defaultMessage
                  : defaultMessage
            );
            console.log("Error", error);
         },
      });
   };

   const closeAlert = () => {
      setIsOpenDeleteModal(false);
   };

   return (
      <div className="task-form">
         <div className="task-form__close">
            <CloseOutlinedIcon onClick={onClose} />
         </div>
         <div className="flex flex-col justify-between flex-1">
            <div className="task-form__details">
               <div className="task">
                  <Controller
                     name="state"
                     control={control}
                     render={({ field: { value, ...field } }) => (
                        <Checkbox
                           aria-label="Task state"
                           icon={<RadioButtonUncheckedTwoToneIcon />}
                           checkedIcon={<CheckCircleRoundedIcon />}
                           sx={checkboxStyle}
                           checked={value}
                           {...field}
                        />
                     )}
                  />

                  <div className="task__details">
                     <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                           <input
                              type="text"
                              placeholder="Add task"
                              {...field}
                           />
                        )}
                     />
                     {errors.name ? (
                        <p className="field-error">{errors.name.message}</p>
                     ) : null}
                  </div>

                  <Controller
                     name="important"
                     control={control}
                     render={({ field: { value, ...field } }) => (
                        <Checkbox
                           aria-label="Task important"
                           icon={<GradeOutlinedIcon />}
                           checkedIcon={<GradeIcon />}
                           sx={checkboxStyle}
                           checked={value}
                           {...field}
                        />
                     )}
                  />
               </div>

               <div className="task-form__due-date">
                  <div
                     className={
                        "due-date-content " +
                        (isBefore(
                           new Date(dueDate?.toDateString() + " 23:59:59"),
                           new Date()
                        )
                           ? "date-expired"
                           : "")
                     }
                     onClick={() => {
                        setShowCalendar((prev) => !prev);
                     }}
                  >
                     <div className="due-date-text">
                        {dueDate
                           ? "Due " + format(dueDate, "ccc',' MMM d',' y")
                           : "Add due date"}
                     </div>

                     <div className="calendar-icon">
                        {showCalendar ? (
                           <KeyboardArrowUpRoundedIcon className="animate-arrow" />
                        ) : (
                           <CalendarMonthOutlinedIcon />
                        )}
                     </div>
                  </div>

                  {showCalendar && (
                     <div className="due-date-date-picker">
                        <ThemeProvider theme={darkTheme}>
                           <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <StaticDatePicker
                                 displayStaticWrapperAs="desktop"
                                 value={dueDate}
                                 onChange={(date) => {
                                    setDueDate(date);
                                 }}
                                 renderInput={(params) => (
                                    <DateTextField {...params} />
                                 )}
                              />
                           </LocalizationProvider>
                        </ThemeProvider>
                     </div>
                  )}

                  <div
                     className="clean-due-date"
                     onClick={() => setDueDate(null)}
                  >
                     <CloseOutlinedIcon />
                  </div>
               </div>

               <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                     <textarea rows={3} placeholder="Add note" {...field} />
                  )}
               />
            </div>

            <div className="task-form__footer">
               <button
                  type="button"
                  className="update-button"
                  onClick={handleSubmit(handleUpdate)}
               >
                  Save Changes
               </button>
               <div className="box">
                  <p>
                     {task
                        ? task.completedAt
                           ? "Completed at " +
                             format(
                                new Date(task.completedAt),
                                "eee',' MMM d',' y"
                             )
                           : "Created on" +
                             format(new Date(task?.createdAt), "h:mm a")
                        : "--"}
                  </p>
                  <div onClick={() => setIsOpenDeleteModal(true)}>
                     <DeleteOutlinedIcon sx={{ color: "#b9b9b9" }} />
                  </div>
               </div>
            </div>
         </div>

         <ThemeProvider theme={darkTheme}>
            <Dialog
               open={isOpenDeleteModal}
               onClose={closeAlert}
               aria-labelledby="alert-dialog-title"
               aria-describedby="alert-dialog-description"
            >
               <DialogTitle id="alert-dialog-title">
                  Are you sure you want to delete this task?
               </DialogTitle>
               <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                     {task?.name}
                  </DialogContentText>
               </DialogContent>
               <DialogActions>
                  <Button
                     onClick={closeAlert}
                     color="secondary"
                     variant="contained"
                  >
                     Disagree
                  </Button>
                  <Button
                     onClick={deleteTask}
                     color="error"
                     variant="contained"
                     autoFocus
                  >
                     Agree
                  </Button>
               </DialogActions>
            </Dialog>
         </ThemeProvider>
      </div>
   );
};

export default TaskForm;
