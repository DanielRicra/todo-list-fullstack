import { useNavigate } from "react-router-dom";

import { useGetUserTaskLists } from "../../../hooks/use-task-lists";
import { useUserContext } from "../../../providers/User";
import { useEffect } from "react";

const Welcome = () => {
   const navigate = useNavigate();
   const { user } = useUserContext();

   const { data: taskLists, isLoading } = useGetUserTaskLists(
      user?.userId ?? NaN
   );

   useEffect(() => {
      if (taskLists?.[0].taskListId && !isLoading) {
         navigate(`/dashboard/${taskLists[0].taskListId}`)
      }
   }, [taskLists, isLoading]);

   return (
      <div className="welcome">
         <h2>Welcome to the Todo List app</h2>
         <p>Please create a new TaskList, on the left side bar, to add new tasks</p>
      </div>
   );
};
export default Welcome;
