import React, { useEffect, useState } from "react";

import { 
  Link,
  Route,
  Switch
} from "react-router-dom";

import { MatchesContext } from "../context/matchesContext";
import { useAuth } from "../context/authContext";

import {
  Container,
  Grid,
  Header,
} from "semantic-ui-react";

import MatchesList from "./../components/matchesList";
import MatchPreferences from "./../components/matchPreferences";

const Matches = ({ match }) => {
  const { setUpdatedSurvey } = useAuth();

  const MatchLists = () => {
    const [matches, setMatches] = useState([]);
    return(
      <MatchesContext.Provider value={{matches, setMatches}}>
        <Grid.Row>
          <Grid.Column width={4}>
            &nbsp;
          </Grid.Column>
          <Grid.Column width={8}>
            <Header
              as="h2"
              color="orange"
            >
              Buddies
            </Header>
            <MatchesList status={2} />
          </Grid.Column>
          <Grid.Column width={4}>
            <Header
              as="h2"
              color="orange"
            >
              Potential Matches
            </Header>
            <MatchesList status={0} />
          </Grid.Column>
        </Grid.Row>
      </MatchesContext.Provider>
    );
  }

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
            <Route exact path={`${match.url}/`} component={MatchLists} />
            <Route path={`${match.url}/preferences/:flow`} component={MatchPreferences} />
            <Route path={`${match.url}/preferences`} component={MatchPreferences} />
          </Switch>
      </Grid>
    </Container>
  );
}
    
export default Matches;
