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
  Menu, 
  Button
} from 'semantic-ui-react';

import Home from "./../pages/home";
import Survey from "./../pages/survey";
import Login from "./../pages/login";

class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userToken: "",
      authenticated: false
    }
  }

  setStateAuth = (authData) => {
    // this.setState({ authenticated: "doritos and pie"});
    // this.setState({ userToken: authData.token})
    // this.setState({ authenticated: authData.authenticated })
  }




  logout = () => {
    auth.logout();
    // this.setState({ authenticated: false });
  }

  // componentDidUpdate() {
  //   if (localStorage.getItem("user_token") != null) {
  //     const userToken = localStorage.getItem("user_token");
  //     this.setState({ userToken: userToken });
  //     this.setState({ authenticated: true });
  //   } else {
  //     this.setState({ userToken: "" })
  //     this.setState({ authenticated: false });
  //   }
  //   console.log("&&&&&&&&\n",this.state);
  // }

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
                <Menu.Item as={ NavLink } to="/" onClick={this.logout} >
                  Sign Out
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/survey" component={Survey} />
              <Route exact path="/login" component ={Login} />
              <Route exact path="/logout" render={ () => "LOGGED OUT"}/>
              <Route path="*" render={ () => "404 NOT FOUND" } />
            </Switch>
          </Router>
        </Container>
      </>
    );
  }
}
  
export default NavBar;
  