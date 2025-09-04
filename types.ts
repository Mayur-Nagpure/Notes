// Defines the structure of a User object
export interface User {
  id?: number | string;       // Optional because it's not present on creation
  username: string;
  email?: string;             
  password?: string;          //  sent on registration/login
  roles?: string;
}

// Defines the structure of a Note object
export interface Note {
  id: number | string;
  title: string;
  content: string;
  createdAt?: string;         
  updatedAt?: string;         
  isPublic?: boolean;
  shareToken?: string | null;
}
