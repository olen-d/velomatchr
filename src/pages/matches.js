import React, { useEffect, useState } from "react";

import { 
  Route,
  Switch,
  useLocation
} from "react-router-dom";

import { MatchesContext } from "../context/matchesContext";

import {
  Container,
  Grid,
  Header,
} from "semantic-ui-react";

import * as auth from "./../components/auth";
import { useAuth } from "./../context/authContext";

import BlockedList from "./../components/blockedList";
import MatchesList from "./../components/matchesList";
import MatchPreferences from "./../components/matchPreferences";
import MatchCard from "./../components/matchCard";

const Matches = ({ match }) => {
  const OneMatch = props => {
    const { status } = props;

    const [matches, setMatches] = useState({ error: null, matchesResult: [], isLoading: false });
    const [matchesFilteredByStatus, setMatchesFilteredByStatus] = useState([]);
    const [userId, setUserId] = useState(null);

    const { accessToken, setAccessToken } = useAuth();
    const { user } = auth.getUserInfo(accessToken);

    const parameters = new URLSearchParams(useLocation().search);

    const addresseeId = parameters.get("addresseeid");
    const requesterId = parameters.get("requesterid");

  useEffect(() => { setUserId(user) }, [user]);
  
  // Fetch Matches Hook
  useEffect(() => {
    setMatches({isLoading: true});
    // TODO: Refactor this and matchesList.js to DRY this up, maybe the MatchLists component performs the fetch for all matches and this does a fetch for OneMatch
    if (addresseeId && requesterId) {
      (async () => {
        try {
          const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
          if (isNewAccessToken) { setAccessToken(token); }
  
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/relationship/ids/?addresseeid=${addresseeId}&requesterid=${requesterId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          const json = response.ok ? await response.json() : null; 
          json ? setMatches({ error: false, isLoading: false, matchesResult: json }) : setMatches({ error: true, isLoading: false, matchesResult: [] });
        } catch(error) {
          setMatches({ error, matchesResult: [], isLoading: false });;
        }
      })()
    }
  }, [accessToken, addresseeId, requesterId, setAccessToken, setMatches, userId]);

  useEffect(() => {
    const { error, matchesResult } = matches;
    let mounted = true;


    if (error) {
      // TODO: Do something about the error
    } else {
      if(Array.isArray(matchesResult)) {
        let filteredMatches = [];

        filteredMatches = matchesResult.filter(
          match => match.status === status 
        );

        const returnedMatches = filteredMatches.length > 10 && status !== 2 ? filteredMatches.slice(0, 10) : filteredMatches;
        if (mounted) {
          setMatchesFilteredByStatus(returnedMatches);
        }
      };
    }
    return ()=> mounted = false;
  }, [matches, status, userId]);

    return(
      <MatchesContext.Provider value={{matches, setMatches}}>
      {matches && matches.matchesResult &&  matchesFilteredByStatus.map(({ id, addressee: { id: addresseeId, firstName, lastName, isEmailVerified, photoLink, city, stateCode, createdAt}, }) => (
        <div className="match-card" key={id}>
          <MatchCard
            status={1}
            requesterId={userId}
            addresseeId={addresseeId}
            firstName={firstName}
            lastName={lastName ? lastName.substring(0,1) + "." : "N."}
            photoLink={photoLink}
            city={city}
            stateCode={stateCode}
            createdAt={new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long"
            }).format(new Date(createdAt))}
            isEmailMatchDisabled={status === 2 && isEmailVerified === 0 ? true : false}
          />
        </div>
      ))}
      </MatchesContext.Provider>
    )
  };

  const MatchLists = () => {
    const [matches, setMatches] = useState({ error: null, matchesResult: [], isLoading: false });

    return(
      <MatchesContext.Provider value={{matches, setMatches}}>
        <Grid.Row>
          <Grid.Column width={4}>
            &nbsp;
          </Grid.Column>
          <Grid.Column width={8}>
            <MatchesList status={2} />
          </Grid.Column>
          <Grid.Column width={4}>
            <MatchesList status={0} />
          </Grid.Column>
        </Grid.Row>
      </MatchesContext.Provider>
    );
  }

  return(
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header 
              as="h1"
              color="orange"
            >
              Matches
            </Header>
          </Grid.Column>
        </Grid.Row>
          <Switch>
            <Route exact path={`${match.url}/`} component={MatchLists} />
            <Route path={`${match.url}/manage-blocked`} component={BlockedList} />
            <Route path={`${match.url}/new-request/ids`} render={(props) => (<OneMatch {...props} status={1} />)} />
            <Route path={`${match.url}/preferences`} component={MatchPreferences} />
          </Switch>
      </Grid>
    </Container>
  );
}
    
export default Matches;
