import React, { lazy, Suspense, useState } from "react";

import "./style.css";

import LoadingSpinner from "./components/loadingSpinner";

import { AuthContext } from "./context/authContext";

const AuthApp = lazy(() => import("./AuthApp"));
const UnAuthApp = lazy(() => import("./UnAuthApp"));

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [doRedirect, setDoRedirect] = useState(false);
  const [redirectURL, setRedirectURL] = useState(null);
  
  return(
    <AuthContext.Provider value={{isAuth, setIsAuth, doRedirect, setDoRedirect, redirectURL, setRedirectURL, accessToken, setAccessToken}}>
      <AuthContext.Consumer>
        {({ isAuth }) => (
          isAuth ? <Suspense fallback={<LoadingSpinner />}><AuthApp /></Suspense> : <Suspense fallback={<LoadingSpinner />}><UnAuthApp /></Suspense>
        )}
      </AuthContext.Consumer>
    </AuthContext.Provider>
  );
};

export default App;
