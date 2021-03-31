import React, { useEffect, useState } from "react";

import {
  Container,
  Grid
 } from "semantic-ui-react";

import ActionItemsList from "../components/actionItemsList";
import MatchesList from "../components/matchesList";
import ProfileCard from "../components/profileCard";

import { MatchesContext } from "../context/matchesContext";

const Dashboard = () => {
  const [matches, setMatches] = useState([]);
  const [matchesUpdated, setMatchesUpdated] = useState(false);
  const [totalMatched, setTotalMatched] = useState(0);
  const [totalPotential, setTotalPotential] = useState(0);
  const [totalRequested, setTotalRequested] = useState(0);
  const [isMatchedVisible, setIsMatchedVisible] = useState(true);
  const [isPotentialVisible, setIsPotentialVisible] = useState(true);
  const [isRequestedVisible, setIsRequestedVisible] = useState(true);

  useEffect(() => {
    if (totalRequested > 0) {
      setIsRequestedVisible(true);
      setIsMatchedVisible(false);
      setIsPotentialVisible(false);
    } else if (totalPotential > 0 ) {
      setIsRequestedVisible(false);
      setIsMatchedVisible(false);
      setIsPotentialVisible(true);
    } else if (totalMatched > 0) {
      setIsRequestedVisible(false);
      setIsMatchedVisible(true);
      setIsPotentialVisible(false);
    }
  }, [totalMatched, totalPotential, totalRequested]);

  // If new buddy requests, show new buddy requests
  // Else if potential matches, show potential matches
  // Else if matches, show matches

  return(
    <Container>
      <Grid stackable>
        <MatchesContext.Provider value={{matches, setMatches, matchesUpdated, setMatchesUpdated, totalMatched, setTotalMatched, totalPotential, setTotalPotential, totalRequested, setTotalRequested }}>
          <Grid.Column width="4">
            <ProfileCard marginTop="0rem" />
          </Grid.Column>
          <Grid.Column width="8">
            <ActionItemsList></ActionItemsList>
            { isPotentialVisible && <MatchesList showHeadline={true} showMatches={false} status={0} /> }
            { isRequestedVisible && <MatchesList showHeadline={true} showNoMatches={false} status={1} /> }
            { isMatchedVisible && <MatchesList showHeadline={true} showNoMatches={false} status={2} /> }
          </Grid.Column>
          <Grid.Column width={4}>
            &nbsp;
          </Grid.Column>
        </MatchesContext.Provider>
      </Grid>
    </Container>
  );
}

export default Dashboard;
