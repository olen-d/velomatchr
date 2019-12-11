import React, { Component } from "react";

import { 
  BrowserRouter as Router,  
  Route,
  Switch
} from "react-router-dom";

import "./style.css";

import NavBar from "./components/navbar"
import Footer from "./components/footer"

import Home from "./pages/home";
import Survey from "./pages/survey";
import Login from "./pages/login";
import MatchPreferences from "./pages/matchPreferences";

class Template extends Component {
  render () {
    return (
      <Router>
        <NavBar cbfp={this.cb} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/survey" component={Survey} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" render={ () => "LOGGED OUT"}/>
            <Route exact path="/matches/preferences" component={MatchPreferences} />
            <Route path="*" render={ () => "404 NOT FOUND" } />
          </Switch>
        <Footer />
      </Router>
    );
  }
}

export default Template;
