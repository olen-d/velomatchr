import React, { useState } from "react";

import { MatchesContext } from "../context/matchesContext";

import { Grid } from "semantic-ui-react";

import MatchesList from "./../components/matchesList";

const MatchLists = () => {
  const [matches, setMatches] = useState({ error: null, matchesResult: [], isLoading: false });
  const [totalPotential, setTotalPotential] = useState(0);
  const [totalRequested, setTotalRequested] = useState(0);
  const [totalMatched, setTotalMatched] = useState(0);

  return(
    <MatchesContext.Provider value={{matches, setMatches, totalPotential, setTotalPotential, totalRequested, setTotalRequested, totalMatched, setTotalMatched}}>
      <Grid.Row>
        <Grid.Column width={6}>
          <MatchesList showHeadline={true} status={2} />
        </Grid.Column>
        <Grid.Column width={10}>
          <MatchesList showHeadline={true} status={1} />
          <MatchesList showHeadline={true} status={0} />
        </Grid.Column>
      </Grid.Row>
    </MatchesContext.Provider>
  );
}

export default MatchLists;
