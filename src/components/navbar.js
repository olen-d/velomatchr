import React, { Component } from "react";

import { 
  BrowserRouter as Router, 
  Link, 
  NavLink, 
  Route,
  Switch
} from "react-router-dom";

import {
  Container,
  Menu 
} from 'semantic-ui-react';

import Home from "./../pages/home";
import Survey from "./../pages/survey";
import Login from "./../pages/login";

class NavBar extends Component {
  state = {
    userToken: ""
  };
  
  componentDidMount() {
    if (localStorage.getItem("user_token") != null) {
      const userToken = localStorage.getItem("user_token");
      this.setState({ userToken: userToken });
    } else {
      this.setState({ userToken: "" })
    }
  }

  render() {
    return(
      <>
        <Container>
          <Router>
            <Menu inverted color="red">
              <Menu.Item 
                as={ Link } to="/" name="home"
              >
                <i className="fas fa-bicycle"></i>
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item as={ NavLink } to="/survey">
                  Survey
                </Menu.Item>
                <Menu.Item as={ NavLink } to="/buddies">
                  Buddies
                </Menu.Item>
                <Menu.Item as={ NavLink } to="/messages">
                  Messages
                </Menu.Item>
                <Menu.Item as={ NavLink } to="/settings">
                  Settings
                </Menu.Item>
                <Menu.Item as={ NavLink } to="/login">
                  Sign In
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/survey" component={Survey} />
              <Route exact path="/login" component={Login} /> 
              <Route path="*" component={ () => "404 NOT FOUND" } />
            </Switch>
          </Router>
        </Container>
      </>
    );
  }
}
  
  export default NavBar;
  