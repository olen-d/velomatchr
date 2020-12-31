import React from "react";

import { 
  Route,
  Switch
} from "react-router-dom";

import {
  Container,
  Grid,
  Header
 } from "semantic-ui-react";

import FourZeroFour from "./fourZeroFour";
import FourZeroFourAuth from "../components/fourZeroFourAuth";
import SettingsAccount from "../components/settingsAccount";
import SettingsNotifications from "../components/settingsNotifications";
import SettingsProfile from "../components/settingsProfile";

const Settings = ({ match }) => {
  return(
    <Container>
      <Grid stackable>
        <Grid.Column width={4}>
          &nbsp;
        </Grid.Column>
        <Grid.Column width={8}>
          <Header 
            as="h1"
            color="orange"
          >
            Settings
          </Header>
        <Switch>
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
