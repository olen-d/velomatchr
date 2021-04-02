import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// TODO: Add prop types

import { useAuth } from "../context/authContext";

import * as auth from "./auth";

import ActionItemCard from "./actionItemCard";

const ActionItemsList = props => {
  const [hasCompletePersonalInfo, setHasCompletePersonalInfo] = useState(true);
  const [hasGeographicCoordinates, setHasGeographicCoordinates] = useState(true);
  const [hasMatchPreferences, setHasMatchPreferences] = useState(true);
  const [hasSurveyAnswers, setHasSurveyAnswers] = useState(true);
  const [hasVerifiedEmail, setHasVerifiedEmail] = useState(true);
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
          fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
        ])
        .catch(error => {
          // TODO: Deal with the error
          console.log("ERROR:\nAction Items List / Action Items\n", + error);
        });
// console.log(actionItemsResponse);
        const actionItemsJson = await Promise.all(actionItemsResponse.map(actionItem => { return actionItem.status === "fulfilled" ? actionItem.value.json() : null }));

        // console.log(actionItemsJson);
        // Check to see if match preferences have been set
        const [{ user: { userMatchPrefs } , }, answersJson, { user: { firstName, gender, isEmailVerified, lastName, latitude, longitude }, }] = actionItemsJson;
        // console.log("CHEESE:\n" + cheese);
        if (userMatchPrefs) { setHasMatchPreferences(true) } else { setHasMatchPreferences(false) };
        // Check for survey answers
        answersJson && answersJson.answers ? setHasSurveyAnswers(true) : setHasSurveyAnswers(false);

        // Check for verified email
        if (isEmailVerified) { setHasVerifiedEmail(true) } else { setHasVerifiedEmail(false) };

        // check for missing lat/long
        if (Math.round(latitude) === 0 && Math.round(longitude) === 0) { setHasGeographicCoordinates(false) } else { setHasGeographicCoordinates (true) };

        // Check for missing personal information
        if (firstName && gender && lastName) { setHasCompletePersonalInfo(true) } else { setHasCompletePersonalInfo(false) };
      })();
    }
  }, [accessToken, setAccessToken, userId]);

  useEffect(() => { setUserId(user) }, [user]);

  return(
     <div className="action-items-list">
      { !hasMatchPreferences && <ActionItemCard action="Set My Match Preferences" headline="Please Set Your Match Preferences" message="We need to know about who you'd like to match with to find your potential matches. " submitRedirectURL="/matches/preferences" /> }
      { !hasSurveyAnswers && <ActionItemCard action="Take Me To The Survey" headline="Please Complete the Survey" message="To find your matches, we need to know a few things about your riding style. Please answer the survey questions so we can find your potential matches. " submitRedirectURL="/survey" /> }
      { !hasVerifiedEmail && <ActionItemCard action="Verify My Email Address" headline="Please Verify Your Email Address" message="To send email to your matches, we need to verify that you have control of the email address you signed up with. " submitRedirectURL="/verify/email" /> }
      { !hasGeographicCoordinates && <ActionItemCard action="Set My Location" headline="Please Set Your Location" message="We need to know where you are to match you with nearby cyclists. " submitRedirectURL="/settings/profile" /> }
      { !hasCompletePersonalInfo && <ActionItemCard action="Complete My Profile" headline="Please Complete Your Profile" message="Some of your profile information has not been filled out. " submitRedirectURL="/settings/profile" /> }
     </div>
  );
};

export default ActionItemsList;
