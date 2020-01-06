import React, { useEffect } from "react";

import {
  Container,
  Grid
 } from "semantic-ui-react";

import LoginForm from "../components/loginForm";

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
          DORITOS
        </Grid.Column>
        <Grid.Column width="4">
          &nbsp;
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default Dashboard;
