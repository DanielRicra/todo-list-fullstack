import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";

import "./App.scss";
import { UserContextProvider } from "./providers/User";

const queryClient = new QueryClient();

const App = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <UserContextProvider>
            <RouterProvider
               router={router}
               fallbackElement={<p>Initial...</p>}
            />
         </UserContextProvider>
      </QueryClientProvider>
   );
};

export default App;
