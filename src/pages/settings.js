import React from "react";

import {
  Container,
  Grid
 } from "semantic-ui-react";

import ProfileRequiredForm from "../components/profileRequiredForm";

const Settings = () => {
  return(
    <Container>
      <Grid stackable>
      <ProfileRequiredForm
          colWidth={6}
          formTitle={"My Profile"}
        />
      </Grid>
    </Container>
  );
}

export default Settings;
