import React, { useEffect, useState } from "react";
import {
  useParams
} from "react-router-dom";

import MatchPreferencesForm from "../components/matchPreferencesForm";

import { useAuth } from "../context/authContext";

import {
  Grid,
  Header,
} from "semantic-ui-react"

const MatchPreferences = () => {
  const [ submitContent, setSubmitContent ] = useState("Update Match Preferences");
  const [ toSurvey, setToSurvey ] = useState(false);

  const { flow } = useParams();

  const { setToMatchPrefs } = useAuth();

  if (flow === "signup" && submitContent !=="Take the Survey") {
    setSubmitContent("Take the Survey");
    setToSurvey(true);
  }

  useEffect(() => setToMatchPrefs(false), [setToMatchPrefs]);

  return(
    <>
      <div>FLOW: { flow }</div>
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
        submitContent={submitContent}
        toSurvey={toSurvey}
      />
    </>
  );
}
    
export default MatchPreferences;
