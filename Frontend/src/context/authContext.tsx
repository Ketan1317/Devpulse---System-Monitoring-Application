import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AuthContextType, AuthData } from "@/types/auth";

interface AuthContextValue extends AuthContextType {
  loading: boolean;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");

    if (savedAuth) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuth(JSON.parse(savedAuth));
    }

    setLoading(false);
  }, []);

  const login = (authData: AuthData) => {
    localStorage.setItem(
      "auth",
      JSON.stringify(authData)
    );

    setAuth(authData);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        isAuthenticated: !!auth,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};