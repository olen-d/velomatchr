import React from "react";

import MatchPreferencesForm from "../components/matchPreferencesForm";

import {
  Grid,
  Header,
} from "semantic-ui-react";

const MatchPreferences = () => {
  return(
    <>
      <Grid.Row>
        <Grid.Column width={16}>
          <Header 
            as="h1"
            color="orange"
          >
            About Your Matches
          </Header>
        </Grid.Column>
      </Grid.Row>
      <MatchPreferencesForm 
        colWidth={8}
        formTitle={"Your Match Characteristics"}
        formInstructions={"Please tell us your preferences regarding who you'd like to match with."}
        submitBtnContent={"Update Match Preferences"}
        submitRedirect={true}
        submitRedirectURL={"/dashboard"}
        isModal={false}
      />
    </>
  );
}
    
export default MatchPreferences;
