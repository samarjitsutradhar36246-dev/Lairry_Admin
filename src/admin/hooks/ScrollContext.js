import { createContext, useContext } from "react";

export const ScrollContext = createContext(null);

export function useScrollContainer() {
  return useContext(ScrollContext);
}