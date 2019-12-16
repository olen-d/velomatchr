import React, { Component } from "react";
import { 
  BrowserRouter as Router, 
  Route,
  Switch
} from "react-router-dom";

import "./style.css";

import LoginBar from "./components/loginBar"
import Footer from "./components/footer"

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

class UnAuthApp extends Component {

  render () {
    return (
      <Router>
        <LoginBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="*" render={ () => "404 NOT FOUND" } />
        </Switch>
        <Footer />
      </Router>
    );
  }
}

export default UnAuthApp;
