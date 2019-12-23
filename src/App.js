import React, { lazy, Suspense, useState } from "react";

import {
  BrowserRouter as Router
} from "react-router-dom";

import "./style.css";

import LoadingSpinner from "./components/loadingSpinner";

import { AuthContext } from "./context/authContext";

const AuthApp = lazy(() => import("./AuthApp"));
const UnAuthApp = lazy(() => import("./UnAuthApp"));

const App = (props) => {
  const [isAuth, setIsAuth] = useState(false);
  const [authTokens, setAuthTokens] = useState();
  const [redirect, setRedirect] = useState();
  
  const setTokens = data => {
    console.log("SETAUTHTOKENS\n", data);
    // console.log("setredirect:\n", redirect);
    localStorage.setItem("user_token", JSON.stringify(data));
    setAuthTokens(data);
    // if (redirect) {
    //   this.props.history.push(redirect);
    // }
    setIsAuth(true); // TODO: Move this to the login and signin Form components
  }

  return(
    <AuthContext.Provider value={{isAuth, setIsAuth, redirect, setRedirect, authTokens, setAuthTokens: setTokens}}>
      <AuthContext.Consumer>
        {({ isAuth }) => (
          isAuth ? <Suspense fallback={<LoadingSpinner />}><AuthApp /></Suspense> : <Suspense fallback={<LoadingSpinner />}><UnAuthApp /></Suspense>
        )}
      </AuthContext.Consumer>
    </AuthContext.Provider>
  );
};

export default App;
