import React, { lazy, Suspense, useState } from "react";

import "./style.css";

import LoadingSpinner from "./components/loadingSpinner";

import { AuthContext } from "./context/authContext";

const AuthApp = lazy(() => import("./AuthApp"));
const UnAuthApp = lazy(() => import("./UnAuthApp"));

const App = (props) => {
  const [isAuth, setIsAuth] = useState(false);
  const [authTokens, setAuthTokens] = useState();
  
  const setTokens = data => {
    localStorage.setItem("user_token", JSON.stringify(data));
    setAuthTokens(data);
    setIsAuth(true);
  }

  return(
  <AuthContext.Provider value={{isAuth, setIsAuth, authTokens, setAuthTokens: setTokens}}>
    <AuthContext.Consumer>
      {({ isAuth }) => (
        isAuth ? <Suspense fallback={<LoadingSpinner />}><AuthApp /></Suspense> : <Suspense fallback={<LoadingSpinner />}><UnAuthApp /></Suspense>
      )}
    </AuthContext.Consumer>
  </AuthContext.Provider>
  );
};

export default App;
