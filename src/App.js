import React, { Component } from "react";
import Auth from "./components/auth"

import "./style.css";

import AuthApp from "./AuthApp"
import UnAuthApp from "./UnAuthApp"

class App extends Component {

  render () {
    const isAuth = Auth.isAuthenticated();
    return (
      isAuth ? <AuthApp /> : <UnAuthApp />      
    );
  }
}

export default App;
