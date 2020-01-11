import React, { useEffect } from "react";

import { 
  Link,
  Route,
  Switch
} from "react-router-dom";

import { useAuth } from "../context/authContext";

import {
  Container,
  Grid,
  Header,
} from "semantic-ui-react";

import MatchPreferences from "./../components/matchPreferences";

const Matches = ({ match }) => {
  const { setUpdatedSurvey } = useAuth();
  useEffect(() => setUpdatedSurvey(false), [setUpdatedSurvey]);

  return(
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header 
              as="h1"
              color="orange"
            >
              Matches
            </Header>
            <Link to={`${match.url}/preferences`}>LINKY</Link><br />
            <Link to={`${match.url}/preferences/signup`}>SIGNUP</Link>
          </Grid.Column>
        </Grid.Row>
          <Switch>
            <Route path={`${match.url}/preferences/:flow`} component={MatchPreferences} />
            <Route path={`${match.url}/preferences`} component={MatchPreferences} />
          </Switch>
      </Grid>
    </Container>
  );
}
    
export default Matches;
