import React, { useEffect } from "react"

import MatchPreferencesForm from "../components/matchPreferencesForm"

import { useAuth } from "../context/authContext";

import {
  Container,
  Form,
  Grid,
  Header,
  Icon
} from "semantic-ui-react"

const MatchPreferences = () => {
  const { setToMatchPrefs } = useAuth();
  useEffect(() => setToMatchPrefs(false), [setToMatchPrefs]);

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
        colWidth="8"
        formTitle="Your Match Characteristics"
        formInstructions="Please tell us your preferences regarding who you'd like to match with."
        submitContent="Take the Survey"
      />
    </>
  );
}
    
export default MatchPreferences;
