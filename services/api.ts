
import axios from 'axios';
import { Note, User } from '../types'; 


// 1. CONFIGURE AXIOS INSTANCE
// This instance will be the foundation for all API calls.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', // Fallback 
});

// Interceptor to automatically add the JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// 2. AUTHENTICATION API FUNCTIONS
// These functions will handle user login and registration.

interface LoginCredentials {
  username?: string;
  password?: string;
}

export const login = async (credentials: LoginCredentials): Promise<string> => {
  const response = await api.post<string>('/auth/login', credentials);
  return response.data; // Returns the JWT string
};

export const register = async (userData: Partial<User>): Promise<User> => {
  const response = await api.post<User>('/auth/register', userData);
  return response.data;
};


// 3. PROTECTED NOTES API FUNCTIONS
// These functions require a valid JWT and will fail otherwise.

export const getNotes = async (): Promise<Note[]> => {
  const response = await api.get<Note[]>('/api/notes');
  return response.data;
};

export const createNote = async (noteData: Partial<Note>): Promise<Note> => {
  const response = await api.post<Note>('/api/notes', noteData);
  return response.data;
};

export const updateNote = async (id: number | string, noteData: Partial<Note>): Promise<Note> => {
  const response = await api.put<Note>(`/api/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id: number | string): Promise<void> => {
  await api.delete(`/api/notes/${id}`);
};

export const shareNote = async (id: number | string): Promise<string> => {
  const response = await api.post<string>(`/api/notes/${id}/share`);
  return response.data; // Returns the share token
};


// 4. PUBLIC API FUNCTIONS
// These functions do not require authentication.

export const getPublicNote = async (shareToken: string): Promise<Note> => {
  const response = await api.get<Note>(`/api/public/notes/${shareToken}`);
  return response.data;
};
