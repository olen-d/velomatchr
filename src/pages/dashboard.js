import React, { useEffect } from "react"

import {
  Container,
  Grid,
  Header,
  Icon
 } from "semantic-ui-react"

import LoginForm from "../components/loginForm";

import { useAuth } from "../context/authContext";

const Dashboard = () => {
  const { setToDashboard } = useAuth();
  useEffect(() => setToDashboard(false), [setToDashboard]);
  
  return(
    <Container>
      <Grid stackable>
        <LoginForm 
          colWidth="6"
          formTitle="Sign In"
        />
      </Grid>
    </Container>
  );
}

export default Dashboard;
