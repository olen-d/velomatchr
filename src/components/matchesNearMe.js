import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  Message,
} from "semantic-ui-react"

import LoadingSpinner from "./loadingSpinner";

const MatchesNearMe = props => {
  const { latitude, longitude, show } = props;

  const [matches, setMatches] = useState({});

  const MatchesNearMeMessage = () => {
    return(
      <p>
        Sign up now to meet new riding buddies. We'll ask you a few brief questions, have you fill out a short survey, and quickly get you riding with a buddy.
      </p>
    );
  }
  
  // Fetch Matches Hook
  useEffect(() => {
    setMatches({isLoading: true});

    fetch(`${process.env.REACT_APP_API_URL}/api/matches/near/location/${latitude}/${longitude}`)
    .then(response => {
      return response.ok ? response.json() : setMatches({ error: response.statusText, matchesResult: [], isLoading: false }); 
    })
    .then(json => {
      const totalMatches = json.length;
      setMatches({ matchesResult: json, totalMatches, isLoading: false });
    })
    .catch(error => {
      setMatches({ error, matchesResult: [], isLoading: false });;
    });
  }, [latitude, longitude]);

  if(show) {
    return(
      <Message color="orange">
        <Message.Header>
          {matches.isLoading ? "Loading potential matches..." : `There are ${matches.totalMatches} potential matches near you!`}
        </Message.Header>
        {matches.isLoading ? <LoadingSpinner /> : <MatchesNearMeMessage />} 
      </Message>
    );
  } else {
    return(null);
  }
}

MatchesNearMe.defaultProps = {
  latitude: 0.0,
  longitude: 0.0,
  show: true
}

const { bool, number } = PropTypes;

MatchesNearMe.propTypes = {
  latitude: number,
  longitude: number,
  show: bool
}

export default MatchesNearMe;
