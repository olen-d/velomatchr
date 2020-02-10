import React from "react";
import auth from "./auth";

import { 
  Link, 
  NavLink,
} from "react-router-dom";

import { useAuth } from "../context/authContext";

import {
  Container,
  Menu, 
} from 'semantic-ui-react';

const NavBar = props => {
  const { setIsAuth, setAuthTokens, setDoRedirect, setRedirectURL } = useAuth();

  const logout = () => {
    const newAuthStatus = auth.logout();
    setIsAuth(newAuthStatus);
    setAuthTokens(null);
    setDoRedirect(false);
    setRedirectURL(false);
  }

  return(
    <Container>
      <Menu inverted color="red">
        <Menu.Item as={ Link } to="/dashboard">
          <i className="fas fa-bicycle"></i>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item as={ NavLink } to="/survey">
            Survey
          </Menu.Item>
          <Menu.Item as={ NavLink } to="/matches">
            Matches
          </Menu.Item>
          <Menu.Item as={ NavLink } to="/messages">
            Messages
          </Menu.Item>
          <Menu.Item as={ NavLink } to="/settings">
            Settings
          </Menu.Item>
          <Menu.Item as={ NavLink } to="/" onClick={logout}>
            Sign Out
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Container>
  );
}
  
export default NavBar;
  