import React from "react";
// import PropTypes from "prop-types";

import { checkAccessTokenExpiration } from "./auth";

import { useAuth } from "../context/authContext";

import UnblockUserButton from "./unblockUserButton";

const BlockedCard = props => {
  const {
    requesterId,
    addresseeId,
    firstName,
    lastName,
    photoLink,
    city,
    stateCode,
    createdAt,
    updateBlockedUsers
  } = props;

  const { accessToken, setAccessToken } = useAuth();

  let pl = null;

  if(photoLink) {
    const slash = photoLink.indexOf("/");

    const pub = slash === -1 ? "public\\" : "public/";
    pl = photoLink.replace(pub, "")
  }

  const postAction = async value => {
    try {
      const { isNewAccessToken, accessToken: token } = await checkAccessTokenExpiration(accessToken, requesterId);
      if (isNewAccessToken) { setAccessToken(token); }
  
      const status = parseInt(value);
      // TODO: Need to update context based on status...
      const actionData = {
        requesterId,
        addresseeId,
        status,
        actionUserId: requesterId,
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/status/update`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(actionData)
      });
  
      const json = response.ok ? await response.json() : false;

      if (json && json.status === 200) {
        // Remove the user from the blocked list
        updateBlockedUsers(addresseeId);
      } else {
        // Error
      }
    } catch (error) {
      // TODO: Deal with the error
      console.log("blockedCard ERROR:", error);
    }
  }

  return(
    <div className="blocked-card">
      <div className="blocked-card-profile photo">
        { photoLink ? ( <img src={pl} width="100px" height="auto" alt={firstName} /> ) : ( <i className="fas fa-user-circle"></i> ) }
      </div>
      <div className="blocked-card-full-name">
        {firstName} {lastName}
      </div>
      <div className="blocked-card-address">
        {city}, {stateCode}
      </div>
      <div className="blocked-card-joined">
        Member Since: {createdAt}
      </div>
      <div className="blocked-card-actions">
        <UnblockUserButton postAction={postAction} />
      </div>
    </div>
  );
}

export default BlockedCard;
