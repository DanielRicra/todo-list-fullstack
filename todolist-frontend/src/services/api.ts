import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
   baseURL: BASE_URL,
   headers: { 'Content-Type': 'application/json' },
});

export const ApiRequest = {
   get: async (url: string) => await api.get(url),
   post: async <T>(url: string, body: T) => await api.post(url, body),
   put: async <T>(url: string, body: T) => await api.put(url, body),
   delete: async (url: string) => await api.delete(url),
};
