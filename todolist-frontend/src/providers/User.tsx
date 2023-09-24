import { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser } from '../types';

type UserContextType = {
   user: AuthUser | null;
};

const UserContext = createContext<UserContextType>({ user: null });

export const UserContextProvider = ({
   children,
}: {
   children: React.ReactElement;
}) => {
   const [user, setUser] = useState<AuthUser | null>(null);

   useEffect(() => {
      const userData = window.localStorage.getItem('user');
      try {
         if (!userData) {
            throw new Error('No user data in LocalStorage');
         }
         const user: AuthUser = JSON.parse(userData);
         setUser(user);
      } catch (error) {
         setUser(null);
      }
   }, []);

   return (
      <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
   );
};

export const useUserContext = () => {
   const context = useContext(UserContext);

   if (context === undefined) {
      throw new Error(
         'useUserContext has to be used within <UserContextProvider>'
      );
   }

   return context;
};
