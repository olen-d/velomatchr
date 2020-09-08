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

const Email = ({ match }) => {
  return(
    <Container>
      <Grid stackable>
        <Switch>
          <Route exact path={`${match.url}/compose/:id`} render={() => <ComposeEmailForm colWidth={6} formTitle={"Email"} />} />
        </Switch>
      </Grid>
    </Container>
  );
}

export default Email;
