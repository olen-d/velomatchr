import { createContext, useContext } from "react";

export const MatchesContext = createContext();

export const useMatches = () => {
  return useContext(MatchesContext);
}
