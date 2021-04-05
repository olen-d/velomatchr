import React, { useEffect, useState } from "react";

import { checkAccessTokenExpiration, getUserInfo } from "./auth";

import { useAuth } from "../context/authContext";

import {
  Icon,
  Image
} from "semantic-ui-react";

import "./profileBar.css";

const ProfileBar = () => {
  const [photoLinkFull, setPhotoLinkFull] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [userId, setUserId] = useState(null);

  const { accessToken, setAccessToken } = useAuth();

  const { user } = getUserInfo(accessToken);

  useEffect(() => { setUserId(user) }, [user]);

  useEffect(() => {
    if (userId) {
      (async () => {
        try {
          const { isNewAccessToken, accessToken: token } = await checkAccessTokenExpiration(accessToken, userId);
          if (isNewAccessToken) { setAccessToken(token); }

          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const data = response.status === 200 ? await response.json() : false;

          if (data && data.user) { // Skips the destructuring if any of these are null, which would throw a type error
            const {
              user: {
                firstName,
                lastName,
                photoLink,
              },
            } = data;

            const fullname = firstName || lastName ? `${firstName} ${lastName}` : "";

            setProfileData({
              fullname,
              photoLink,
            });

            setPhotoLinkFull(`${process.env.REACT_APP_API_URL}/${photoLink}`);
            // setIsUserProfileError(false);
          } else {
            // setIsUserProfileError(true);
          }
        } catch {
          // setIsUserProfileError(true);
        }
      })();
    }
  }, [accessToken, setAccessToken, userId]);

  return(
    <div className="profile-bar">
      {profileData.photoLink ? <Image src={photoLinkFull} size="tiny" rounded centered /> : <Icon color="grey" name="user circle" size="big" />}<span className="profile-bar-full-name">{profileData.fullname}</span>
    </div>
  )
}

export default ProfileBar;
