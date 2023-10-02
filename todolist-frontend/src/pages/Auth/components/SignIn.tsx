import { useState } from "react";
import {
   Alert,
   FormControl,
   FormHelperText,
   IconButton,
   Input,
   InputAdornment,
   InputLabel,
   TextField,
} from "@mui/material";
import { object, string, InferType } from "yup";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { MyLoadingButton } from "../../../components/Buttons/Buttons";
import { AuthService } from "../../../services/auth/auth.services";
import { getErrorMessageByStatusCode } from "../../../utils/auth";
import { useUserContext } from "../../../providers/User";

const userSchema = object({
   password: string()
      .min(5, "Password must have at least 5 characters")
      .required("Password is required"),
   email: string()
      .email("Must be a valid email")
      .required("Must be a valid email"),
});

type User = InferType<typeof userSchema>;

const SignIn = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [responseAlert, setResponseAlert] = useState({
      exist: false,
      message: "",
   });
   const navigate = useNavigate();
   const { login } = useUserContext();

   const { control, handleSubmit } = useForm<User>({
      resolver: yupResolver(userSchema),
   });

   const { isLoading, mutate } = useMutation({
      mutationFn: AuthService.signIn,
   });

   const handleShowPassword = () => {
      setShowPassword((prev) => !prev);
   };

   const onSubmit: SubmitHandler<User> = async (data) => {
      mutate(data, {
         onSuccess: (response) => {
            login(response.data);
            navigate("/dashboard");
         },
         onError: (error) => {
            if (error instanceof AxiosError) {
               setResponseAlert((prev) => ({
                  ...prev,
                  exist: true,
                  message: getErrorMessageByStatusCode(error.response?.status),
               }));
               return;
            }
            setResponseAlert((prev) => ({
               ...prev,
               exist: true,
               message: "Something went wrong",
            }));
         },
      });
   };

   return (
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
         {responseAlert.exist ? (
            <Alert variant="outlined" severity="error">
               {responseAlert.message}
            </Alert>
         ) : null}
         <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
               <TextField
                  label="Email"
                  variant="standard"
                  color="secondary"
                  helperText={error ? error.message : null}
                  error={!!error}
                  {...field}
               />
            )}
         />

         <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
               <FormControl
                  variant="standard"
                  error={!!error}
                  color="secondary"
               >
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                     id="password"
                     type={showPassword ? "text" : "password"}
                     error={!!error}
                     endAdornment={
                        <InputAdornment position="end">
                           <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleShowPassword}
                           >
                              {showPassword ? (
                                 <VisibilityOff />
                              ) : (
                                 <Visibility />
                              )}
                           </IconButton>
                        </InputAdornment>
                     }
                     {...field}
                  />
                  {!!error ? (
                     <FormHelperText id="filled-weight-helper-text">
                        {error.message}
                     </FormHelperText>
                  ) : null}
               </FormControl>
            )}
         />

         <MyLoadingButton variant="contained" type="submit" loading={isLoading}>
            Sign In
         </MyLoadingButton>
      </form>
   );
};
export default SignIn;
