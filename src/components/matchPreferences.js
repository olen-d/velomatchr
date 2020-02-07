import React, { useEffect, useState } from "react";
import {
  useParams
} from "react-router-dom";

import MatchPreferencesForm from "../components/matchPreferencesForm";

import { useAuth } from "../context/authContext";

import {
  Grid,
  Header,
} from "semantic-ui-react";

const MatchPreferences = () => {
  const btnContentUpdate = "Update Match Preferences";
  const btnContentSurvey = "Take the Survey";
  
  const [ submitContent, setSubmitContent ] = useState(btnContentUpdate);
  const [ toSurvey, setToSurvey ] = useState(false);

  const { flow } = useParams();

  const { setToMatchPrefs } = useAuth();

  if (flow === "signup" && submitContent !== btnContentSurvey) {
    setSubmitContent(btnContentSurvey);
    setToSurvey(true);
  } else if (!flow && submitContent !== btnContentUpdate) {
    setSubmitContent(btnContentUpdate);
    setToSurvey(false);
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
        submitBtnContent={submitContent}
        toSurvey={toSurvey}
      />
    </>
  );
}
    
export default MatchPreferences;
