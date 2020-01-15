import React, { useEffect } from "react";

import {
  Container,
  Grid,
  Header
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
          <Header 
            as="h2"
            color="orange"
          >
            New Buddy Requests
          </Header>
          <MatchesList status="1" />
        </Grid.Column>
        <Grid.Column width="4">
          &nbsp;
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default Dashboard;
