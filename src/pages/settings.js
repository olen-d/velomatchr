import React, { useEffect, useState } from "react";

import {
  Link,
  Route,
  Switch
} from "react-router-dom";

import {
  Container,
  Grid,
  Header,
  Menu,
  Message
 } from "semantic-ui-react";

import FourZeroFour from "./fourZeroFour";
import FourZeroFourAuth from "../components/fourZeroFourAuth";
import ProfileBar from "../components/profileBar";
import SettingsAccount from "../components/settingsAccount";
import SettingsNotifications from "../components/settingsNotifications";
import SettingsProfile from "../components/settingsProfile";

const SettingsRoot = () => {
  return(
    <div className="settings-root">
      <Message>
        Please use the menu to review and update your profile, notifications, or account settings.
      </Message>
    </div>
  )
}

const Settings = ({location, match }) => {
  const [isFluid, setIsFluid] = useState(null);

  const getWindowDimensions = () => {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    const handleResize = () => {
      const { innerWidth } = getWindowDimensions(); // Ignore innerHeight, may be useful in the future for detecting portrait or landscape orientation
      const isMobileTablet = innerWidth < 768 ? true : false;
      setIsFluid(isMobileTablet);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const { innerWidth } = getWindowDimensions();
    innerWidth < 768 ? setIsFluid(true) : setIsFluid(false);
  }, []);

  return(
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <ProfileBar></ProfileBar>
          </Grid.Column>
        </Grid.Row>
        <Grid.Column width={4}>
          <Menu fluid={isFluid} vertical>
            <Menu.Item
              as={Link}
              to="/settings/profile"
              active={location.pathname === "/settings/profile"}
            >
              Profile
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/settings/notifications"
              active={location.pathname === "/settings/notifications"}
            >
              Notifications
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/settings/account"
              active={location.pathname === "/settings/account"}
            >
              Account
            </Menu.Item>
          </Menu>
        </Grid.Column>
        <Grid.Column width={8}>
          <Header 
            as="h1"
            color="orange"
          >
            Settings
          </Header>
        <Switch>
            <Route exact path={`${match.url}/`} component={SettingsRoot} />
            <Route exact path={`${match.url}/profile`} component={SettingsProfile} />
            <Route exact path={`${match.url}/notifications`} component={SettingsNotifications} />
            <Route path={`${match.url}/account`} component={SettingsAccount} />
            <Route path="*" render={() => (<FourZeroFour><FourZeroFourAuth /></FourZeroFour>)} />
          </Switch>
        </Grid.Column>
        <Grid.Column width={4}>
          &nbsp;
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default Settings;
