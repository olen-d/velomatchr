import React, { useState } from "react";

import { 
  Link
} from "react-router-dom";

import {
  Container,
  Grid,
  Header
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
        <Grid.Column width="4">
          <ProfileCard marginTop="0rem" />
        </Grid.Column>
        <Grid.Column width="8">
          <Header 
            as="h2"
            color="orange"
          >
            New Buddy Requests
          </Header>
          <p>
          <Link to={"/onboarding/profile"}>LINKY</Link><br />
          <Link to={"/onboarding/match-preferences"}>LINKY2</Link><br />
          <Link to={"/onboarding/survey"}>LINKY3</Link><br />
          <Link to={"/onboarding/matches"}>LINKY4</Link><br />
          <Link to={"/onboarding/verify-email"}>LINKY5</Link><br />
          <Link to={"/email/compose/99"}>EMAIL FORM</Link><br />
          </p>
          <MatchesContext.Provider value={{matches, setMatches, matchesUpdated, setMatchesUpdated}}>
            <MatchesList status={1} />
          </MatchesContext.Provider>
        </Grid.Column>
        <Grid.Column width={4}>
          &nbsp;
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default Dashboard;
