export interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: "CREATOR" | "USER";
  profilePic?: string | null;
  isOnline?: boolean;
}

export interface AuthState {
  userId: string | null;
  token: string | null;
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: "CREATOR" | "USER";
}