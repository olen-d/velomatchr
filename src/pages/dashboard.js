import React, { useEffect, useState } from "react";

import {
  Container,
  Grid,
  Header
 } from "semantic-ui-react";

import MatchesCount from "../components/matchesCount";
import MatchesList from "../components/matchesList";

import { MatchesContext } from "../context/matchesContext";
import { useAuth } from "../context/authContext";

const Dashboard = () => {
  const { setToDashboard } = useAuth();

  const [matches, setMatches] = useState([]);

  useEffect(() => setToDashboard(false), [setToDashboard]);
  
  return(
    <Container>
      <Grid stackable>
        <Grid.Column width="4">
          <MatchesCount />
        </Grid.Column>
        <Grid.Column width="8">
          <Header 
            as="h2"
            color="orange"
          >
            New Buddy Requests
          </Header>
          <MatchesContext.Provider value={{matches, setMatches}}>
            <MatchesList status="1" />
          </MatchesContext.Provider>
        </Grid.Column>
        <Grid.Column width="4">
          &nbsp;
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default Dashboard;
