import React from "react"

import { 
  Link,
  Route,
  Switch
} from "react-router-dom";

import {
  Container,
  Form,
  Grid,
  Header,
  Icon
} from "semantic-ui-react"

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
            <Link to={`${match.url}/preferences`}>LINKY</Link>
          </Grid.Column>
        </Grid.Row>
          <Switch>
            <Route path={`${match.url}/preferences`} component={MatchPreferences} />
          </Switch>
      </Grid>
    </Container>
  );
}
    
export default Matches;
