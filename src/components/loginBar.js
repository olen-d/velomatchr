import React, { Component } from "react";
import auth from "./auth";

import { 
  BrowserRouter as Router, 

  Link, 
  NavLink,
  Redirect, 
  Route,
  Switch
} from "react-router-dom";

import {
  Container,
  Divider,
  Menu, 
  Button
} from 'semantic-ui-react';

import Home from "./../pages/home";
import Survey from "./../pages/survey";
import Login from "./../pages/login";

class LoginBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // State goes here...
    }
  }

  logout = () => {
    auth.logout();
  }

  render() {
    return(
      <>
        <Container>
          <Router>
            <Menu secondary>
              <Menu.Item as={Link} to="/" name="home">
                <i className="fas fa-bicycle"></i>
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                  <Button as={Link} to="/login" color="red">
                    Sign In
                  </Button>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            <hr />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/login" component ={Login} />
              <Route path="*" render={ () => "404 NOT FOUND" } />
            </Switch>
          </Router>
        </Container>
      </>
    );
  }
}
  
export default LoginBar;
  