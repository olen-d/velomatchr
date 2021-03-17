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
  const { colWidth, submitBtnContent, submitRedirect, submitRedirectURL } = props;

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
      <Grid.Column width={colWidth}>
        <Header
          as="h2"
          textAlign="center"
          color="grey"
        >
          Your Potential Matches
        </Header>
        <MatchesList showHeadline={false} status={0} />
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
  colWidth: 6,
  submitBtnContent: "Finished",
  submitRedirect: true,
  submitRedirectURL: "/onboarding/verify-email"
}

const { bool, number, string } = PropTypes;

MatchesNewUser.propTypes = {
  colWidth: number,
  submitBtnContent: string,
  submitRedirect: bool,
  submitRedirectURL: string
}

export default MatchesNewUser;
