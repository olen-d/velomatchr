import React from "react";

import {
  Container,
  Grid
 } from "semantic-ui-react";

import ProfileFullForm from "../components/profileFullForm";

const Settings = () => {
  return(
    <Container>
      <Grid stackable>
        <ProfileFullForm />
      </Grid>
    </Container>
  );
}

export default Settings;
