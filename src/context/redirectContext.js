import React, { createContext, useContext } from "react";

const initialState = {
  doRedirect: false,
  location: "/"
}

const reducer = (state, action) => {
  const { type } = action;
  switch (type) {
    case "location":
      return {location: "Ninjastan"};
    default:
      throw new Error();
  }
}
const RedirectStateContext = createContext(initialState);
const RedirectDispatchContext = createContext();

const useRedirectState = () => {
  const context = useContext(RedirectStateContext);
  return context;
}

export {useRedirectState, RedirectDispatchContext};
