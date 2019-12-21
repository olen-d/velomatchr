import React, { Suspense, useContext, useState, useReducer } from "react";

import "./style.css";

import LoadingSpinner from "./components/loadingSpinner";

import { AuthContext } from "./context/authContext";
import { useRedirectState, RedirectDispatchContext } from "./context/redirectContext";

import AuthApp from "./AuthApp";
import UnAuthApp from "./UnAuthApp";

import {
  Button
} from "semantic-ui-react"

const Test = props => {
  console.log(useRedirectState());
  const redirectState = useRedirectState();

  return(
    <>
    CONTEXT: {redirectState.location}
    </>
  )
}

const Test2 = props => {
  const [state, dispatch] = useReducer(RedirectDispatchContext.reducer, "Cheeseburger")
    
  return(
    <Button 
    fluid
    type="button"
    color="red"
    size="large"
    onClick={()=> dispatch({type: "location"})}
  >
    Testinator
  </Button>
  )
}

const App = (props) => {
  const [isAuth, setIsAuth] = useState(false);
  const [authTokens, setAuthTokens] = useState();
  
  const setTokens = data => {
    localStorage.setItem("user_token", JSON.stringify(data));
    setAuthTokens(data);
    setIsAuth(true);
  }

  return(
    <>
    <Test />
    <Test2 />
    <AuthContext.Provider value={{isAuth, authTokens, setAuthTokens: setTokens}}>
      <AuthContext.Consumer>
        {({ isAuth }) => (
          isAuth ? <AuthApp /> : <UnAuthApp />
        )}
      </AuthContext.Consumer>
    </AuthContext.Provider>
    </>
  );
};

export default App;
