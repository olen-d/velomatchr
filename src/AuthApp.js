import React, { Component } from "react";

import { 
  BrowserRouter as Router,  
  Route,
  Switch,
  useRouteMatch
} from "react-router-dom";

import "./style.css";

import Footer from "./components/footer"
import NavBar from "./components/navbar"

import Home from "./pages/home";
import Login from "./pages/login";
import Matches from "./pages/matches";
import Survey from "./pages/survey";

class Template extends Component {
  render () {
    return (
      <Router>
        <NavBar cbfp={this.cb} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/logout" render={ () => "LOGGED OUT"}/>
            <Route path="/matches" component={Matches} />
            <Route path="/survey" component={Survey} />
            <Route path="*" render={ () => "404 NOT FOUND" } />
          </Switch>
        <Footer />
      </Router>
    );
  }
}

export default Template;
