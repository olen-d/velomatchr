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
  { key: "notifications", text: "Notifications", value: "/settings/notifications"},
  { key: "account", text: "Account", value: "/settings/account"}
];

const NavBar = () => {
  const { accessToken, setIsAuth, setAccessToken, setDoRedirect, setRedirectURL } = useAuth();

  const logout = async () => {
    const newAuthStatus = await auth.logout(accessToken);
    setIsAuth(newAuthStatus);

    if (newAuthStatus) {
      // Logout failed
      // TODO: Set an error notification letting the user know they were not logged out.
    } else {
      setAccessToken(null);
      setRedirectURL("/home");
      setDoRedirect(true);
    }

    return null;
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
          <Menu.Item onClick={logout}>
            Sign Out
          </Menu.Item>
        </Menu.Menu>
      </Menu>

    </Container>
  );
}
  
export default NavBar;
  