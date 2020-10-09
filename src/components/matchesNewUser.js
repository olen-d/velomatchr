import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  Grid,
  Header
} from "semantic-ui-react";

import { useAuth } from "../context/authContext";
import { MatchesContext } from "../context/matchesContext";

import MatchesList from "./../components/matchesList";

const MatchesNewUser = props => {
  const { submitBtnContent, submitRedirect, submitRedirectURL } = props;

  const [matches, setMatches] = useState({ error: null, matchesResult: [], isLoading: false });
  const [matchesUpdated, setMatchesUpdated] = useState(false);

  const { setDoRedirect, setRedirectURL } = useAuth();

  const doneMatching = () => {
    if(submitRedirect) {
      setRedirectURL(submitRedirectURL);
      setDoRedirect(true);
    }
  }

  return(
    <MatchesContext.Provider value={{matches, setMatches, matchesUpdated, setMatchesUpdated}}>
      <Grid.Column width={4}>
        &nbsp;
      </Grid.Column>
      <Grid.Column width={8}>
        <Header
          as="h2"
          color="orange"
        >
          Potential Matches
        </Header>
        <MatchesList status={0} />
        <Button
          className="fluid"
          type="button"
          color="red"
          size="large"
          icon="check circle"
          labelPosition="left"
          content={submitBtnContent}
          onClick={doneMatching}
        >
        </Button>
      </Grid.Column>
      <Grid.Column width={4}>
        &nbsp;
      </Grid.Column>
    </MatchesContext.Provider>
  );
}

MatchesNewUser.defaultProps = {
  submitBtnContent: "Finished",
  submitRedirect: true,
  submitRedirectURL: "/onboarding/verify-email"
}

const { bool, string } = PropTypes;

MatchesNewUser.propTypes = {
  submitBtnContent: string,
  submitRedirect: bool,
  submitRedirectURL: string
}

export default MatchesNewUser;
