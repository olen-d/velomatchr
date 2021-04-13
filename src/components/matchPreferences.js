import React from "react";

import MatchPreferencesForm from "../components/matchPreferencesForm";

import {
  Grid
} from "semantic-ui-react";

const MatchPreferences = () => {
  return(
    <>
      <Grid.Row>
        <MatchPreferencesForm 
          colWidth={8}
          formTitle={"Your Match Preferences"}
          formInstructions={"Please tell us about who you'd like to match with."}
          submitBtnContent={"Update Match Preferences"}
          submitRedirect={true}
          submitRedirectURL={"/dashboard"}
          isModal={false}
        />
      </Grid.Row>
    </>
  );
}
    
export default MatchPreferences;
