import React, { useState } from "react";

import {
  Container,
  Grid
 } from "semantic-ui-react";

import MatchesList from "../components/matchesList";
import ProfileCard from "../components/profileCard";

import { MatchesContext } from "../context/matchesContext";

const Dashboard = () => {
  const [matches, setMatches] = useState([]);
  const [matchesUpdated, setMatchesUpdated] = useState(false);

  return(
    <Container>
      <Grid stackable>
        <MatchesContext.Provider value={{matches, setMatches, matchesUpdated, setMatchesUpdated}}>
          <Grid.Column width="4">
            <ProfileCard marginTop="0rem" />
          </Grid.Column>
          <Grid.Column width="8">
            <MatchesList showNoMatches={false} status={1} />
            <MatchesList showNoMatches={false} status={2} />
          </Grid.Column>
          <Grid.Column width={4}>
            &nbsp;
          </Grid.Column>
        </MatchesContext.Provider>
      </Grid>
    </Container>
  );
}

export default Dashboard;
