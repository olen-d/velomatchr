import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"

import { Link } from "react-router-dom";

import { checkAccessTokenExpiration, getUserInfo } from "./auth";

import { useAuth } from "../context/authContext";

import {
  Button,
  Form,
  Header,
  Icon,
  Image
} from "semantic-ui-react";

import MatchesCount from "./matchesCount";

import "./profileCard.css";

const ProfileCard = () => {
  const [photoLinkFull, setPhotoLinkFull] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [userId, setUserId] = useState(null);
  const [isUserProfileError, setIsUserProfileError] = useState(false);

  const { accessToken, setAccessToken } = useAuth();

  const { user } = getUserInfo(accessToken);

  useEffect(() => { setUserId(user) }, [user]);

  useEffect(() => {
    if (userId) {
      const getUserProfile = async () => {
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
              city,
              country,
              countryCode,
              firstName,
              lastName,
              gender,
              latitude,
              longitude,
              name: username,
              phone,
              photoLink,
              postalCode,
              state,
              stateCode
            },
          } = data;
  
          const fullname = firstName || lastName ? `${firstName} ${lastName}` : "";
  
          setProfileData({
            city,
            country,
            countryCode,
            fullname,
            gender,
            latitude,
            longitude,
            phone,
            photoLink,
            postalCode,
            state,
            stateCode,
            username
          });
  
          setPhotoLinkFull(`${process.env.REACT_APP_API_URL}/${photoLink}`);
          setIsUserProfileError(false);
        } else {
            setIsUserProfileError(true);
        }
      }
      getUserProfile();
    }
  }, [accessToken, setAccessToken, userId]);
// Link to Profile Page (Stub Out)

 return(
  <div className="profile-card">
    <div className="profile-photo">
    {profileData.photoLink ? <Image src={photoLinkFull} size="tiny" rounded centered /> : <Icon color="grey" name="user circle" size="huge" />} 
    </div>
    <div className="profile-full-name">
      <p>
        <Link to={`/profile/username/${profileData.username}`}>{profileData.fullname}</Link>
      </p>
    </div>
    <MatchesCount />
  </div>
 );
}

export default ProfileCard;
