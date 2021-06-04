import React from "react";

import { Divider, Grid } from "semantic-ui-react";

import ProfilePersonalForm from "./ProfilePersonalForm";
import ProfilePhotoForm from "./profilePhotoForm";

const SettingsProfile = () => {
  return(
    <Grid.Column width={8}>
      <ProfilePhotoForm
        formTitle={"My Profile Photograph"}
        profilePhotoBtnContent={"Upload Profile Photo"}
      />
      <Divider hidden></Divider>
      <ProfilePersonalForm
        formTitle={"My Personal Information"}
        submitBtnContent={"Update Personal Information"}
        submitRedirect={true} 
        submitRedirectURL={"/dashboard"} 
      />
    </Grid.Column>
  );
}

export default SettingsProfile;
