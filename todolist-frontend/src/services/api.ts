import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
   baseURL: BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

export const ApiRequest = {
   get: (url: string) => api.get(url),
   post: <T>(url: string, body: T) => api.post(url, body),
   put: <T>(url: string, body: T) => api.put(url, body),
   delete: (url: string) => api.delete(url),
};
