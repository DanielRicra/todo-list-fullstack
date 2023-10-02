import { createContext, useContext, useEffect, useState } from "react";
import { AuthUser } from "../types";

type UserContextType = {
   user: AuthUser | null;
   signOut: () => void;
   login: (user: AuthUser) => void;
};

const UserContext = createContext<UserContextType>({
   user: null,
   signOut: () => {},
   login: () => {},
});

export const UserContextProvider = ({
   children,
}: {
   children: React.ReactElement;
}) => {
   const [user, setUser] = useState<AuthUser | null>(null);

   const signOut = () => {
      localStorage.removeItem("user");
      setUser(null);
   };

   const login = (user: AuthUser) => {
      setUser(user);
      localStorage.setItem(
         "user",
         JSON.stringify({
            email: user.email,
            userId: user.userId,
            name: user.name,
         })
      );
   };

   useEffect(() => {
      const userData = window.localStorage.getItem("user");

      try {
         if (!userData) {
            throw new Error("No user data in LocalStorage");
         }
         const user: AuthUser = JSON.parse(userData);
         setUser(user);
      } catch (error) {
         setUser(null);
      }
   }, []);

   return (
      <UserContext.Provider value={{ user, signOut, login }}>
         {children}
      </UserContext.Provider>
   );
};

export const useUserContext = () => {
   const context = useContext(UserContext);

   if (context === undefined) {
      throw new Error(
         "useUserContext has to be used within <UserContextProvider>"
      );
   }

   return context;
};
