import React, { lazy, Suspense, useState } from "react";

import { decodeToken, getRefreshToken, newAccessToken } from "./components/auth";

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
  
  (async () => {
    if (!isAuth) {
      try {
        // Check localstorage for a refresh token
        const refreshToken = await JSON.parse(getRefreshToken());
        
        // If it exists, use it to get a valid token
        if (refreshToken) {
          const { userId } = decodeToken(refreshToken);

          const { isNewAccessToken, accessToken: token } = await newAccessToken(userId);

          if (isNewAccessToken) {
            setAccessToken(token);
            setIsAuth(true);
          }
        }
      } catch (error) {
        // TODO: Deal with the error
        console.log(error);
      }
    }
  })();

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
