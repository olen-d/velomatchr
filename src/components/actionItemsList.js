import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// TODO: Add prop types

import { useAuth } from "../context/authContext";

import * as auth from "./auth";

import ActionItemCard from "./actionItemCard";

const ActionItemsList = props => {
  const [hasMatchPreferences, setHasMatchPreferences] = useState(null);
  // Survey
  // Email Verification
  // Profile
  // Notification Preferences
  const [userId, setUserId] = useState(null);

  const { accessToken, setAccessToken } = useAuth();
  const { user } = auth.getUserInfo(accessToken);

  useEffect(() => {
    if (userId) {
      (async () => {
        const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
        if (isNewAccessToken) { setAccessToken(token); }

        const actionItemsResponse = await Promise.allSettled([
          fetch(`${process.env.REACT_APP_API_URL}/api/users/matches/preferences/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch(`${process.env.REACT_APP_API_URL}/api/survey/user/id/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch(`${process.env.REACT_APP_API_URL}/api//users/id/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
        ])
        .catch(error => {
          // TODO: Deal with the error
          console.log("ERROR:\nAction Items List / Action Items\n", + error);
        });

        const actionItemsJson = await Promise.all(actionItemsResponse.map(actionItem => { return actionItem.status === "fulfilled" ? actionItem.value.json() : null }));

        // console.log(actionItemsJson);
        // Check to see if match preferences have been set
        const [{ user: { userMatchPrefs } , }] = actionItemsJson;
        if (userMatchPrefs) { setHasMatchPreferences(true) }
      })();
    }
  }, [accessToken, setAccessToken, userId]);

  useEffect(() => { setUserId(user) }, [user]);

  return(
     <div className="action-items-list">
      { !hasMatchPreferences && <ActionItemCard action="Set My Match Preferences" headline="Please Set Your Match Preferences" message="We need to know about who you'd like to match with to find your potential matches." submitRedirectURL="/matches/preferences" /> }
     </div>
  );
};

export default ActionItemsList;
