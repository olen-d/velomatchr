import React from "react";

import { Grid } from "semantic-ui-react";

import ProfileFullForm from "./profileFullForm";

const SettingsProfile = () => {
  return(
    <Grid.Column width={8}>
      <ProfileFullForm
        formTitle={"My Profile"}
        submitBtnContent={"Update Profile"}
        submitRedirect={true} 
        submitRedirectURL={"/dashboard"} 
      />
    </Grid.Column>
  );
}

export default SettingsProfile;
