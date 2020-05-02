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
        <Grid.Column width={4}>
          &nbsp;
        </Grid.Column>
        <Grid.Column width={8}>
          <ProfileFullForm
            formTitle={"My Profile"}
            submitBtnContent={"Update Profile"}
            submitRedirect={true} 
            submitRedirectURL={"/dashboard"} 
          />
        </Grid.Column>
        <Grid.Column width={4}>
          &nbsp;
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default Settings;
