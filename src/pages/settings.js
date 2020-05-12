import React from "react";

import { 
  Route,
  Switch
} from "react-router-dom";

import {
  Container,
  Grid
 } from "semantic-ui-react";

import SettingsProfile from "../components/settingsProfile";

const Settings = ({ match }) => {
  return(
    <Container>
      <Grid stackable>
        <Grid.Column width={4}>
          &nbsp;
        </Grid.Column>
        <Grid.Column width={8}>
        <Switch>
            <Route exact path={`${match.url}/profile`} component={SettingsProfile} />
            {/* <Route path={`${match.url}/preferences`} component={MatchPreferences} /> */}
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
