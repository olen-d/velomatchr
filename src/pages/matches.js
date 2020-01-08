import React from "react";

import { 
  Link,
  Route,
  Switch
} from "react-router-dom";

import {
  Container,
  Grid,
  Header,
} from "semantic-ui-react";

import MatchCalculate from "./../components/matchCalculate";
import MatchPreferences from "./../components/matchPreferences";

const Matches = ({ match }) => {
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
            <Link to={`${match.url}/calculate/1`}>CALCULATE</Link><br />
            <Link to={`${match.url}/preferences`}>LINKY</Link><br />
            <Link to={`${match.url}/preferences/signup`}>SIGNUP</Link>
          </Grid.Column>
        </Grid.Row>
          <Switch>
            <Route path={`${match.url}/calculate/:userid`} component={MatchCalculate} />
            <Route path={`${match.url}/preferences/:flow`} component={MatchPreferences} />
            <Route path={`${match.url}/preferences`} component={MatchPreferences} />
          </Switch>
      </Grid>
    </Container>
  );
}
    
export default Matches;
