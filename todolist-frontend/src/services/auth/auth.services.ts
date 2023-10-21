import { UserForAuth } from "../../types";
import { ApiRequest } from "../api";

export const AuthService = {
   signIn: async (data: Partial<UserForAuth>) =>
      ApiRequest.post<Partial<UserForAuth>>("/user/signIn", data),
   signUp: async (data: UserForAuth) =>
      ApiRequest.post<UserForAuth>("/user", data),
};
