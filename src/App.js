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
  const [toDashboard, setToDashboard] = useState(false);
  const [toMatchPrefs, setToMatchPrefs] = useState(false);
  
  // const setTokens = data => {
  //   console.log("App.js - 23 DATA:\n", data);
  //   localStorage.setItem("user_token", JSON.stringify(data));
  //   debugger;
  //   setAuthTokens(data);
  // }
  
  return(
    <Router>
      <AuthContext.Provider value={{isAuth, setIsAuth, toDashboard, setToDashboard, toMatchPrefs, setToMatchPrefs, authTokens, setAuthTokens}}>
        <AuthContext.Consumer>
          {({ isAuth }) => (
            isAuth ? <Suspense fallback={<LoadingSpinner />}><AuthApp /></Suspense> : <Suspense fallback={<LoadingSpinner />}><UnAuthApp /></Suspense>
          )}
        </AuthContext.Consumer>
      </AuthContext.Provider>
    </Router>
  );
};

export default App;
