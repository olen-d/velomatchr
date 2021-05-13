import React from "react";

import { Grid } from "semantic-ui-react";

import LocationForm from "./LocationForm";

const SettingsLocation = () => {
  return(
    <Grid.Column width={8}>
      <LocationForm
        formTitle={"My Location"}
        submitBtnContent={"Update Location"}
        submitRedirect={true} 
        submitRedirectURL={"/dashboard"} 
      />
    </Grid.Column>
  );
}

export default SettingsLocation;
