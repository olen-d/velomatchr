import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"

import { Link } from "react-router-dom";

import { checkAccessTokenExpiration, getUserInfo } from "./auth";

import { useAuth } from "../context/authContext";

import {
  Icon,
  Image
} from "semantic-ui-react";

import ErrorContainer from "./errorContainer";
import MatchesCount from "./matchesCount";

import "./profileCard.css";

const ProfileCard = props => {
  const { marginTop } = props;
  const [photoLinkFull, setPhotoLinkFull] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [userId, setUserId] = useState(null);
  const [isUserProfileError, setIsUserProfileError] = useState(false);

  const { accessToken, setAccessToken } = useAuth();

  // Styles
  const profileCard = {
    marginTop,
    width: "100%",
    textAlign: "center"
  }
  

  const { user } = getUserInfo(accessToken);

  useEffect(() => { setUserId(user) }, [user]);

  useEffect(() => {
    if (userId) {
      const getUserProfile = async () => {
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
        } catch {
          setIsUserProfileError(true);
        }
      }
      getUserProfile();
    }
  }, [accessToken, setAccessToken, userId]);

  if (isUserProfileError) {
    return(
      <div style={profileCard}>
        <ErrorContainer
          header="Profile Error"
          message="The user profile could not be loaded."
          show={true}
        >
        </ErrorContainer>
      </div>
    );
  } else {
    return(
      <div style={profileCard}>
        <div className="profile-card-photo">
        {profileData.photoLink ? <Image src={photoLinkFull} size="tiny" rounded centered /> : <Icon color="grey" name="user circle" size="huge" />} 
        </div>
        <div className="profile-card-full-name">
          <p>
            <Link to={`/profile/username/${profileData.username}`}>{profileData.fullname}</Link>
          </p>
        </div>
        <MatchesCount />
      </div>
    );
  }
}

ProfileCard.defaultProps = {
  marginTop: "0rem"
}

const { number, string } = PropTypes;

ProfileCard.propTypes = {
  marginTop: PropTypes.oneOfType([
    number,
    string
  ])
}

export default ProfileCard;
