import { createContext, useContext } from "react";

export const MatchedContext = createContext();

export const useMatched = () => {
  return useContext(MatchedContext);
}
