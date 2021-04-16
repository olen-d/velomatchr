import React from "react";

import {
  Route,
  Switch
} from "react-router-dom";

import {
  Container,
  Grid
} from "semantic-ui-react";

import ComposeEmailForm from "./../components/composeEmailForm";
import ProfileBar from "./../components/profileBar";

const Email = ({ match }) => {
  return(
    <Container>
      <Grid stackable>
      <Grid.Row>
          <Grid.Column width={16}>
            <ProfileBar></ProfileBar>
          </Grid.Column>
        </Grid.Row>
        <Switch>
          <Route exact path={`${match.url}/compose/:id`} render={() => <ComposeEmailForm colWidth={10} formTitle={"Compose an Email"} />} />
        </Switch>
        <Grid.Column width={6}>
          &nbsp;
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default Email;
