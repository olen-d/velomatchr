import React from "react";
// import PropTypes from "prop-types";

import ProfilePhotoForm from "./profilePhotoForm";
import ProfileRequiredForm from "./profileRequiredForm";
import { Grid } from "semantic-ui-react";

const ProfileFullForm = () => {

  return(
    <>
      <Grid.Row>
        <ProfilePhotoForm
          colWidth={8}
          formTitle={"Current Photograph"}
          profilePhotoBtnContent={"Upload Profile Photo"}
        />
      </Grid.Row>
      <Grid.Row>
      <ProfileRequiredForm 
          colWidth={8}
          formTitle={"My Profile"}
        />
      </Grid.Row>
    </>
  );
}

export default ProfileFullForm;
