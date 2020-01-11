import React, { useEffect } from "react";

import {
  Container,
  Grid
 } from "semantic-ui-react";

import MatchesList from "../components/matchesList";

import { useAuth } from "../context/authContext";

const Dashboard = () => {
  const { setToDashboard } = useAuth();
  useEffect(() => setToDashboard(false), [setToDashboard]);
  
  return(
    <Container>
      <Grid stackable>
        <Grid.Column width="4">
          &nbsp;
        </Grid.Column>
        <Grid.Column width="8">
          <MatchesList status="0" />
        </Grid.Column>
        <Grid.Column width="4">
          &nbsp;
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default Dashboard;
