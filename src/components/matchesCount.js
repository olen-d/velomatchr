import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as auth from "./auth";

import { useAuth } from "../context/authContext";

import { Header } from "semantic-ui-react";

import "./matchesCount.css";

const MatchesCount = () => {
  // Get items from context
  const { accessToken, setAccessToken } = useAuth();
  const { user } = auth.getUserInfo(accessToken);
 
  // Set up the state
  const [userId, setUserId] = useState(user);
  const [totalMatches, setTotalMatches] = useState(null);

  useEffect(() => { setUserId(user) }, [user])

  useEffect(() => {
    const getMatchesCount = async () => {
      try {
        const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
        if (isNewAccessToken) { setAccessToken(token); }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/matched/count/user/id/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const json = response.ok ? await response.json() : new Error(response.statusText); 
        const { data: [ { totalMatches }, ], } = json;
        
        setTotalMatches(totalMatches);
      } catch(err) {
        return err;
      }
    };

    if (userId) { getMatchesCount() }
  }, [accessToken, setAccessToken, setTotalMatches, userId]);

  return(
    <div className="matches-count">
      <Header as="h1">
       {totalMatches}
      </Header>
      <p>
        <Link to="/matches">{totalMatches === 1 ? "Buddy" : "Buddies"}</Link>
      </p>
    </div>
  );
}

export default MatchesCount;
