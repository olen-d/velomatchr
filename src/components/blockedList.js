import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";

import { checkAccessTokenExpiration, getUserInfo } from "./auth";

import { useAuth } from "../context/authContext";

import BlockedCard from "./blockedCard";

const BlockedList = () => {
  const [blockedUsers, setBlockedUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const { accessToken, setAccessToken } = useAuth();

  const { user } = getUserInfo(accessToken);

  const updateBlockedUsers = (addresseeId) => {
    const newBlockedUsers = blockedUsers.filter(item => {return item.addresseeId !== addresseeId});
    setBlockedUsers(newBlockedUsers);
  }

  useEffect(()=> { setUserId(user) }, [user]);

  // Get the list of blocked users
  useEffect(() => {
    if (userId) {
      // Add isLoading...

      (async () => {
        try {
          const { isNewAccessToken, accessToken: token } = await checkAccessTokenExpiration(accessToken, userId);
          if (isNewAccessToken) { setAccessToken(token); }

          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/user/blocked/id/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const json = response.ok ? await response.json() : false;
          if (json && json.status === 200) {
            const { data } = json;
            setBlockedUsers(data);
            setIsLoading(false);
          } else {
            setBlockedUsers([])
            setIsLoading(false);
          }
        } catch (error) {
          // TODO: Deal with the error
          console.log(error);
        }
      })()
    }
  }, [accessToken, setAccessToken, setBlockedUsers, userId]);

  if (isLoading) {
    return(
      <p>
        Loading...
      </p>
    );
  } else {
    return(
      <div className="blocked-users-list">
      {blockedUsers.map(({ id, addressee: { id: addresseeId, firstName, lastName, isEmailVerified, photoLink, city, stateCode, createdAt}, }) => (
        <div className="blocked-card-wrapper" key={id}>
          <BlockedCard
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
            updateBlockedUsers={updateBlockedUsers}
          />
        </div>
      ))}
      </div>
    );
  }

}

export default BlockedList;
