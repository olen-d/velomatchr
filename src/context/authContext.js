import { createContext, useContext } from "react";

export const AuthContext = createContext({setIsAuth: () => {}});

export function useAuth() {
  return useContext(AuthContext);
}
