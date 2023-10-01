import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import ProtectedRoutes from './guards/ProtectedRoutes';
import { DashboardLayout, DashboardWelcome } from '../pages/Dashboard';

const AuthPage = lazy(() => import('../pages/Auth/Auth'));
const Tasks = lazy(() => import('../components/Tasks/Tasks'));

export const router = createBrowserRouter([
   {
      path: '/',
      element: <ProtectedRoutes />,
      children: [
         {
            index: true,
            element: <Navigate to='/dashboard' />,
         },
         {
            path: 'dashboard',
            element: <DashboardLayout />,
            children: [
               {
                  index: true,
                  element: <DashboardWelcome />,
               },
               {
                  path: ':taskListId',
                  element: (
                     <Suspense>
                        <Tasks />
                     </Suspense>
                  ),
               },
               {
                  path: 'tasks/important',
                  element: (
                     <Suspense>
                        <div>Important</div>
                     </Suspense>
                  ),
               },
               {
                  path: 'tasks/planned',
                  element: (
                     <Suspense>
                        <div>Planned</div>
                     </Suspense>
                  ),
               }
            ],
         },
      ],
   },
   {
      path: 'login',
      element: (
         <Suspense fallback={<p>Loading pages...</p>}>
            <AuthPage />
         </Suspense>
      ),
   },
   {
      path: '*',
      element: <div>404</div>,
   },
]);
