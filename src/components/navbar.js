import React, { useEffect, useState } from "react";
import * as auth from "./auth";

import {
  Link, 
  NavLink,
  useLocation
} from "react-router-dom";

import { useAuth } from "../context/authContext";

import {
  Container,
  Grid,
  Icon,
  Menu, 
} from 'semantic-ui-react';

import NavDropdown from "./navDropdown";

import "./navbar.css";

const matchesItems = [
  { key: "matches", text: "All Matches", value: "/matches"},
  { key: "manage-blocked", text: "Manage Blocking", value: "/matches/manage-blocked"},
  { key: "preferences", text: "Preferences", value: "/matches/preferences" }
];

const settingsItems = [
  { key: "profile", text: "Profile", value: "/settings/profile"},
  { key: "notifications", text: "Notifications", value: "/settings/notifications"},
  { key: "account", text: "Account", value: "/settings/account"}
];

const NavBar = () => {

  const [ hamburgerIsVisible, setHamburgerIsVisible ] = useState(false);
  const [ navbarIsVisible, setNavbarIsVisible ] = useState(false);

  const { accessToken, setIsAuth, setAccessToken, setDoRedirect, setRedirectURL } = useAuth();

  const location = useLocation();

  const getWindowDimensions = () => {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  const handleToggleNavbarVisibility = () => {
    setNavbarIsVisible(!navbarIsVisible);
  }

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

  useEffect(() => {
    const handleResize = () => {
      const { innerWidth } = getWindowDimensions(); // Ignore innerHeight, may be useful in the future for detecting portrait or landscape orientation
      const isMobileTablet = innerWidth < 768 ? true : false;
      setHamburgerIsVisible(isMobileTablet);
      setNavbarIsVisible(!isMobileTablet);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const { innerWidth } = getWindowDimensions();
    innerWidth < 768 ? setHamburgerIsVisible(true) : setNavbarIsVisible(true);
  }, []);

  // Close the responsive navbar when the hamburger menu icon is visible and the user has navigated to a new route
  useEffect(() => {
    hamburgerIsVisible && setNavbarIsVisible(false);
  }, [hamburgerIsVisible, location]);

  return(
    <Container>
      { hamburgerIsVisible &&
        <Grid.Row>
          <div className="navbar-mobile">
            <div className="navbar-identity">
              VELOMATCHR
            </div>
            <div className="navbar-hamburger">
              <Icon name="bars" onClick={handleToggleNavbarVisibility} size="big" />
            </div>
          </div>
        </Grid.Row>
      }
      { navbarIsVisible &&
        <Grid.Row columns={16}>
          <Menu color="red" inverted stackable>
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
        </Grid.Row>
      }
    </Container>
  );
}

export default NavBar;
