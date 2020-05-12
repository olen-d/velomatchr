import React from "react";

import { Grid, Header } from "semantic-ui-react";

import ProfileFullForm from "./profileFullForm";

const settingsProfile = () => {
  return(
    <>
      <Grid.Column width={8}>
        <Header 
          as="h1"
          color="orange"
        >
          Settings
        </Header>
      </Grid.Column>
      <Grid.Column width={8}>
        <ProfileFullForm
          formTitle={"My Profile"}
          submitBtnContent={"Update Profile"}
          submitRedirect={true} 
          submitRedirectURL={"/dashboard"} 
        />
      </Grid.Column>
    </>
  );
}

export default settingsProfile;
