import { RouterProvider } from 'react-router-dom';

import './App.scss';
import { UserContextProvider } from './providers/User';
import { router } from './routes/router';

const App = () => {
   return (
      <UserContextProvider>
         <RouterProvider router={router} fallbackElement={<p>Initial...</p>} />
      </UserContextProvider>
   );
};

export default App;
