export interface Activity {
  name: string;
  date: Date;
  userAgent: string;
  _id?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  activities: Activity[];
}

export interface AuthContextType {
  user: User | null;
  login: (event: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loginInfo: { username: string; password: string };
  updateLoginInfo: (info: { username: string; password: string }) => void;
  loginError: string | null;
  isLoginLoading: boolean;
  register: (event: any) => Promise<void>;
  updateRegisterInfo: (info: {
    username: string;
    email: string;
    password: string;
  }) => void;
  registerInfo: { username: string; email: string; password: string };
  isRegisterLoading: boolean;
  registerError: string | null;
  authLoading: boolean;
  jwtToken: string | null;
  updatePassword: (oldPassword: string, newPassword: string ) => void;
}
