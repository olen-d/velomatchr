import React, { useEffect, useState } from "react"

import auth from "./auth";

import {
  Container,
  Grid,
  Header,
  Icon
 } from "semantic-ui-react";

 import { useAuth } from "../context/authContext";
 import { MatchesContext } from "../context/matchesContext";

 import MatchCard from "./matchCard";

 const MatchesList = props => {
  const [userId, setUserId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [matchesFilterdByStatus, setMatchesFilterdByStatus] = useState([]);

  const { authTokens } = useAuth();

  const userInfo = auth.getUserInfo(authTokens);

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/relationships/user/${userId}`)
    .then(response => {
      return response.ok ? response.json() : new Error(response.statusText); 
    })
    .then(json => {
      setMatches(json);
    })
    .catch(err => {
      return err;
    });
  }, [userId]);

  useEffect(() => {
    if(Array.isArray(matches) && matches.length) {
      let status = parseInt(props.status);
      let filteredMatches = matches.filter(
        match => match.status === status
      );
      setMatchesFilterdByStatus(filteredMatches);
    };
});

   return(
     <MatchesContext.Provider value={{matches, setMatches}}>
      <div className="matches-list">
        {matchesFilterdByStatus.map(match => (
          <div className="match-card" key={match.id}>
            <MatchCard
              requesterId={userId}
              addresseeId={match.addressee.id}
              firstName={match.addressee.firstName}
              lastName={match.addressee.lastName}
              photoLink={match.addressee.photoLink}
              city={match.addressee.city}
              state={match.addressee.state}
              createdAt={match.addressee.createdAt}
              positiveStatus="1"
              negativeStatus="3"
            />
          </div>
        ))}
      </div>
     </MatchesContext.Provider>
   )
 }

 export default MatchesList;

 // Loading spinner
 // Check for matches
 // If user has no matches, run the magical mystery matching algorithm
 // Return the list of matches

 // Match flow
 // Run matches when user completes survey
 // Present list of potential matches
 // User declines or approves match
 // Declined matches get a status code of decline and never match in the future
 // Approved match sends a friend request to the addressee
