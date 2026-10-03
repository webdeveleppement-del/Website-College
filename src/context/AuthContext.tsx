import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getMe,
  getStoredUser,
  login as loginApi,
  logout as logoutApi,
  type User,
} from "../api/auth";


interface AuthContextType {

  user: User | null;

  loading: boolean;

  isAuthenticated: boolean;

  login: (
    username: string,
    password: string
  ) => Promise<User>;

  refreshUser: () => void;

  logout: () => void;
}


const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);


interface AuthProviderProps {

  children: ReactNode;
}


export function AuthProvider({
  children,
}: AuthProviderProps) {

  const [
    user,
    setUser
  ] = useState<User | null>(
    getStoredUser()
  );

  const [
    loading,
    setLoading
  ] = useState(true);


  useEffect(() => {

    const initializeAuth =
      async () => {

        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) {

          setLoading(false);

          return;
        }

        try {

          const currentUser =
            await getMe();

          setUser(
            currentUser
          );

        } catch {

          logoutApi();

          setUser(null);

        } finally {

          setLoading(false);
        }
      };


    initializeAuth();

  }, []);


  const login = async (
    username: string,
    password: string
  ) => {

    const response =
      await loginApi(
        username,
        password
      );

    setUser(
      response.user
    );

    return response.user;
  };


  const logout = () => {

    logoutApi();

    setUser(null);
  };

  const refreshUser = () => {
    setUser(
      getStoredUser()
    );
  };


  return (

    <AuthContext.Provider
      value={{
        user,

        loading,

        isAuthenticated:
          Boolean(user),

        login,

        refreshUser,

        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}


export function useAuth() {

  const context =
    useContext(
      AuthContext
    );

  if (!context) {

    throw new Error(
      "useAuth doit être utilisé à l'intérieur de AuthProvider."
    );
  }

  return context;
}
