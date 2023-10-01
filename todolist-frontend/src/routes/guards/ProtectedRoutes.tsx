import { Outlet, Navigate } from 'react-router-dom';
import { useUserContext } from '../../providers/User';

const ProtectedRoutes = () => {
   const { user } = useUserContext();

   if (!user) {
      return <Navigate to="/login" />
   }

   return (
      <>
         <div>Layout</div>
         <Outlet />
      </>
   );
};

export default ProtectedRoutes;
