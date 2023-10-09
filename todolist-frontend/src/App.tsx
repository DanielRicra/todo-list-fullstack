import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";

import "./App.scss";
import { UserContextProvider } from "./providers/User";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
         <Toaster
            closeButton
            richColors
            theme="dark"
            position="bottom-center"
         />
         <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
   );
};

export default App;
