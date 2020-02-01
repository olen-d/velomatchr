import React, { useEffect, useState } from "react";

import auth from "./auth";


import { useAuth } from "../context/authContext";

const MatchesCount = () => {
  const [userId, setUserId] = useState(null);
  const [totalMatches, setTotalMatches] = useState(null);

  // Get items from context
  const { authTokens } = useAuth();

  const userInfo = auth.getUserInfo(authTokens);

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/relationships/matched/count/user/${userId}`)
    .then(response => {
      return response.ok ? response.json() : new Error(response.statusText); 
    })
    .then(json => {
      setTotalMatches(json[0].totalMatches);
    })
    .catch(err => {
      return err;
    });
  }, [setTotalMatches, userId]);

  return(
    <div>
      {totalMatches}
    </div>
  );
}

export default MatchesCount;
