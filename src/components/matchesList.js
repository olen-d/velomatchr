import React, { useContext, useEffect, useState } from "react"

import auth from "./auth";

import {
  Container,
  Grid,
  Header,
  Icon
 } from "semantic-ui-react";

 import { useAuth } from "../context/authContext";

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
    }
}, [matches, props.status]);

   return(
     <div className="matches-list">
      <div>CheeseBurgerZ: {userId}</div>
      <div>STATUS: {props.status}</div>
     </div>
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
