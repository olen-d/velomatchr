import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import auth from "./auth";

import { useAuth } from "../context/authContext";

import { Header } from "semantic-ui-react";


const MatchesCount = () => {
  // Get items from context
  const { authTokens: token } = useAuth();
  const { user } = auth.getUserInfo(token);

  // Set up the state
  const [userId, setUserId] = useState(null);
  const [totalMatches, setTotalMatches] = useState(null);

  useEffect(() => { setUserId(user) }, [user])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/relationships/matched/count/user/id/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      return response.ok ? response.json() : new Error(response.statusText); 
    })
    .then(json => {
      const { data: [ { totalMatches }, ], } = json;
      setTotalMatches(totalMatches);
    })
    .catch(err => {
      return err;
    });
  }, [setTotalMatches, token, userId]);

  return(
    <div>
      <Header as="h1" color="black">
       {totalMatches}
      </Header>
      <p>
        <Link to="/matches">Buddies</Link>
      </p>
    </div>
  );
}

export default MatchesCount;
