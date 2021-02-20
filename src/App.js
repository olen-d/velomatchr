import React, { lazy, Suspense, useState } from "react";

import { decodeToken, getRefreshToken, newAccessToken } from "./components/auth";

import LoadingSpinner from "./components/loadingSpinner";

import { AuthContext } from "./context/authContext";

import Footer from "./components/footer";

import "./App.css";

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
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        // Something went really wrong, either the refresh token doesn't exist or is invalid (e.g. undefined)
        // Delete the refresh token
        localStorage.removeItem("user_refresh_token");
        setIsAuth(false);
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
      <Footer />
    </AuthContext.Provider>
  );
};

export default App;
