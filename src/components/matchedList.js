import React, { useEffect, useState } from "react"

import auth from "./auth";

import {
  Container,
  Grid,
  Header,
  Icon
 } from "semantic-ui-react";

 import { useAuth } from "../context/authContext";
 import { MatchedContext } from "../context/matchedContext";

 import MatchedCard from "./matchedCard";

 const MatchedList = () => {
  const [userId, setUserId] = useState(null);
  const [matches, setMatches] = useState([]);

  const { authTokens } = useAuth();

  const userInfo = auth.getUserInfo(authTokens);

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/matches/user/${userId}`)
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
      const filteredMatches = matches.filter(
          match => match.status === 2
      );
      setMatches(filteredMatches);
    }
  });

  if(matches.length === 0)
  {
    return(
      <div className="no-matches-found">
        No matches were found.
      </div>
    )
  } else {
    return(
     <MatchedContext.Provider value={{matches, setMatches}}>
      <div className="matches-list">
        {matches.map(match => (
          <div className="match-card" key={match.id}>
            <MatchedCard
              requesterId={userId}
              addresseeId={match.addressee.id}
              firstName={match.addressee.firstName}
              lastName={match.addressee.lastName}
              photoLink={match.addressee.photoLink}
              city={match.addressee.city}
              state={match.addressee.state}
              createdAt={match.addressee.createdAt}
              negativeStatus="3"
            />
          </div>
        ))}
      </div>
    </MatchedContext.Provider>
    )
  }
}

 export default MatchedList;
