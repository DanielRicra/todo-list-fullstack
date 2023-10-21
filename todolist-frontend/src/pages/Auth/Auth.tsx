import { ThemeProvider } from "@mui/material/styles";
import { Link, Navigate, useLocation } from "react-router-dom";

import "./Auth.scss";
import { darkTheme } from "./styles";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import { useUserContext } from "../../providers/User";

const Auth = () => {
   const location = useLocation();
   const { user } = useUserContext();

   const isSignUp = location.pathname.includes("/signup");

   if (user) {
      return <Navigate to="/dashboard" />;
   }

   return (
      <div className="auth">
         <h1 className="h1">{isSignUp ? "Sign Up" : "Log In"}</h1>
         <div className="auth__container">
            <ThemeProvider theme={darkTheme}>
               {isSignUp ? <SignUp /> : <SignIn />}
            </ThemeProvider>

            <div style={{ textAlign: "center" }}>
               <Link
                  to={`${isSignUp ? "/signin" : "/signup"}`}
                  className="link-signin-signup"
               >
                  {isSignUp
                     ? "Already have an Account? Sign In"
                     : "Don't have an account? Sign Up"}
               </Link>
            </div>
         </div>
      </div>
   );
};

export default Auth;
