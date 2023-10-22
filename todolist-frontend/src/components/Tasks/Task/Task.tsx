import { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { blue, indigo } from "@mui/material/colors";
import { format, isBefore } from "date-fns";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedTwoToneIcon from "@mui/icons-material/RadioButtonUncheckedTwoTone";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import GradeIcon from "@mui/icons-material/Grade";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

import "./Task.scss";
import type { Task as TaskI } from "../../../types";
import { useUpdateTask } from "../../../hooks/use-tasks";
import { toast } from "sonner";

interface TaskProps {
   task: TaskI;
   onEdit: () => void;
}

const Task: React.FC<TaskProps> = ({ task, onEdit }) => {
   const [formData, setFormData] = useState<TaskI>(structuredClone(task));
   const { mutate: updateMutate, isLoading: isUpdating } = useUpdateTask(
      task.taskListId
   );

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let completedDate: string | undefined | null =
         e.target.name === "state"
            ? format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
            : formData.completedAt;
      if (e.target.name === "state" && formData.state === true) {
         completedDate = null;
      }
      updateMutate(
         {
            taskId: task.taskId,
            data: {
               ...formData,
               [e.target.name]: e.target.checked,
               completedAt: completedDate,
            },
         },
         {
            onSuccess: () => {
               toast.success("Task updated successfully");
            },
            onError: () => {
               toast.error("Couldn't update task, try again later.");
            },
         }
      );
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
   };

   useEffect(() => {
      setFormData(structuredClone(task));
   }, [task]);

   return (
      <div className="task" onClick={onEdit}>
         <Checkbox
            name="state"
            aria-label="Task state"
            icon={<RadioButtonUncheckedTwoToneIcon />}
            checkedIcon={<CheckCircleRoundedIcon />}
            sx={{
               color: blue[50],
               "&.Mui-checked": {
                  color: indigo[100],
               },
               padding: "0",
            }}
            checked={formData.state}
            onClick={(e) => e.stopPropagation()}
            onChange={handleChange}
            disabled={isUpdating}
         />

         <div className="task__details">
            <p
               style={{
                  textDecoration: formData.state ? "line-through" : "none",
               }}
            >
               {formData.name}
            </p>

            {(formData.dueDate || formData.note) && (
               <p className="task__details-more-info">
                  {formData.dueDate && (
                     <span
                        className={
                           isBefore(
                              new Date(formData.dueDate.concat(" 23:59:59")),
                              new Date()
                           ) && formData.state === false
                              ? "date-expired"
                              : ""
                        }
                     >
                        <CalendarTodayOutlinedIcon
                           sx={{ color: "primary.main", fontSize: "13px" }}
                        />
                        {format(
                           new Date(formData.dueDate.concat(" 00:00:00")),
                           "eee',' MMM d"
                        )}
                     </span>
                  )}
                  <span>
                     {formData.note ? (
                        <StickyNote2OutlinedIcon
                           sx={{ color: "primary.main", fontSize: "14px" }}
                        />
                     ) : (
                        ""
                     )}
                  </span>
               </p>
            )}
         </div>

         <Checkbox
            name="important"
            aria-label="Task important"
            icon={<GradeOutlinedIcon />}
            checkedIcon={<GradeIcon />}
            sx={{
               color: blue[50],
               "&.Mui-checked": {
                  color: indigo[100],
               },
               padding: "0",
            }}
            onClick={(e) => e.stopPropagation()}
            checked={formData.important}
            onChange={handleChange}
            disabled={isUpdating}
         />
      </div>
   );
};

export default Task;
