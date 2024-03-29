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
               },
               {
                  path: ':taskListId',
                  element: (
                     <Suspense>
                        <Tasks />
                     </Suspense>
                  ),
               },
            ],
         },
      ],
   },
   {
      path: 'signin',
      element: (
         <Suspense fallback={<p>Loading pages...</p>}>
            <AuthPage />
         </Suspense>
      ),
   },
   {
      path: 'signup',
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
