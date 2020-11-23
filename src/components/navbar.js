import React from "react";
import * as auth from "./auth";

import {
  Link, 
  NavLink,
} from "react-router-dom";

import { useAuth } from "../context/authContext";

import {
  Container,
  Menu, 
} from 'semantic-ui-react';

import NavDropdown from "./navDropdown";

const matchesItems = [
  { key: "matches", text: "All Matches", value: "/matches"},
  { key: "preferences", text: "Preferences", value: "/matches/preferences" }
];

const settingsItems = [
  { key: "profile", text: "Profile", value: "/settings/profile"},
  { key: "account", text: "Account", value: "/settings/account"}
];

const NavBar = props => {
  const { accessToken, setIsAuth, setAccessToken, setDoRedirect, setRedirectURL } = useAuth();

  const logout = () => {
    const newAuthStatus = auth.logout(accessToken);
    setIsAuth(newAuthStatus);
    setAccessToken(null);
    setDoRedirect(false);
    setRedirectURL(null);
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
          <NavDropdown title="Matches" items={ matchesItems } />
          <Menu.Item as={ NavLink } to="/messages">
            Messages
          </Menu.Item>
          <NavDropdown title="Settings" items={ settingsItems } />
          <Menu.Item as={ NavLink } to="/" onClick={logout}>
            Sign Out
          </Menu.Item>
        </Menu.Menu>
      </Menu>

    </Container>
  );
}
  
export default NavBar;
  