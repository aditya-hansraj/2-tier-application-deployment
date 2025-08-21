import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { postRequest, getRequest, putRequest } from "../utils/services";
import { User, AuthContextType } from "../types/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
console.log("Backend URL:", BACKEND_URL);
const BASE_URL = `${BACKEND_URL}/api/auth`;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });

  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [authLoading, setAuthLoading] = useState(false);

  const updateLoginInfo = useCallback(
    (info: { username: string; password: string }) => {
      setLoginInfo(info);
    },
    [],
  );

  const updateRegisterInfo = useCallback(
    (info: { username: string; email: string; password: string }) => {
      setRegisterInfo(info);
    },
    [],
  );

  const login = useCallback(
    async (event: any) => {
      event.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);
      const response = await postRequest(
        `${BASE_URL}/login`,
        JSON.stringify(loginInfo),
      );

      setIsLoginLoading(false);
      setLoginInfo({
        username: "",
        password: "",
      });

      if (response.error) return setLoginError(response.error);

      const token = response.data.token;
      localStorage.setItem("token", token);
      setJwtToken(token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    },
    [loginInfo],
  );

  const register = useCallback(
    async (event: any) => {
      event.preventDefault();
      setIsRegisterLoading(false);
      setRegisterError(null);
      console.log("Requesting to URL: ", `${BASE_URL}/register`);
      const response = await postRequest(
        `${BASE_URL}/register`,
        JSON.stringify(registerInfo),
      );

      setIsRegisterLoading(false);
      setRegisterInfo({
        username: "",
        email: "",
        password: "",
      });

      if (response.error) return setRegisterError(response.error);

      const token = response.data.token;
      localStorage.setItem("token", token);
      setJwtToken(token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    },
    [registerInfo],
  );

  const logout = async () => {
    localStorage.removeItem("token");
    setJwtToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<void> => {
      setIsLoginLoading(true);
      try {
        const response = await putRequest(
          `${BASE_URL}/user/change-password`,
          JSON.stringify({ currentPassword, newPassword }),
          jwtToken
        );
        setIsLoginLoading(false);
        if (response.success) {
          console.log("Password updated successfully.");
          window.location.href = '/me';
        } else {
          throw new Error(response.error || "Failed to update password.");
        }
      } catch (error: any) {
        console.error("Error updating password:", error.message);
        throw new Error(error.message || "An error occurred while updating the password.");
      }
    },
    [jwtToken] 
  );

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          setAuthLoading(true);
          const response = await getRequest(`${BASE_URL}/me`, token);
          setAuthLoading(false);
          if (response.error) throw new Error(response.error);
          setUser(response.data.user);
          setIsAuthenticated(true);
          setJwtToken(token);
        } catch (error) {
          console.error("Failed to decode token or fetch user:", error);
          localStorage.removeItem("token");
          setUser(null);
          setJwtToken(null);
          setIsAuthenticated(false);
          setAuthLoading(false);
          setJwtToken(null);
        }
      } else {
        logout();
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated,
        loginInfo,
        updateLoginInfo,
        isLoginLoading,
        loginError,
        registerInfo,
        updateRegisterInfo,
        isRegisterLoading,
        registerError,
        authLoading,
        jwtToken,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
