import React from "react";

import {
  Redirect, 
  Route,
  Switch
} from "react-router-dom";

import "./style.css";

import LoginBar from "./components/loginBar"
import Footer from "./components/footer"

import Home from "./pages/home";
import LoginPage from "./pages/login";
import Signup from "./pages/signup";

import { useAuth } from "./context/authContext";

const UnAuthApp = () => {
  const { doRedirect, redirectURL, setDoRedirect } = useAuth();

  if (doRedirect) {
    setDoRedirect(false);
    return (<Redirect to={`${redirectURL}`} />);
  }

  return (
    <>
      <LoginBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={Signup} />
        <Route path="*" render={ () => "404 NOT FOUND" } />
      </Switch>
      <Footer />
    </>
  );
}

export default UnAuthApp;
