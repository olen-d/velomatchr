import React, { useContext, useEffect, useState } from "react";
// import PropTypes from "prop-types";

import auth from "./auth";

import ProfilePhotoForm from "./profilePhotoForm";
import ProfileRequiredForm from "./profileRequiredForm";
import { Grid } from "semantic-ui-react";

import { AuthContext } from "../context/authContext";

const ProfileFullForm = () => {
  const [fullName, setFullName] = useState(null);
  const [gender, setGender] = useState(null);
  const [photoLink, setPhotoLink] = useState(null);
  const [userId, setUserId] = useState(null);

  const context = useContext(AuthContext);
  const token = context.authTokens;

  const userInfo = auth.getUserInfo(token);

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user]);

  useEffect(() => {
    const getUserProfile = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${userId}`);
      const data = await response.json();

      if (data && data.user) { // Skips the destructuring if any of these are null, which would throw a type error
        const { user: { firstName, lastName, gender: userGender, photoLink }, } = data;
        setFullName(firstName + " " + lastName);
        setGender(userGender);
        setPhotoLink(photoLink);
      }
    }
    getUserProfile();
  }, [userId]);

  return(
    <>
      <Grid.Row>
        <ProfilePhotoForm
          colWidth={8}
          formTitle={"Current Photograph"}
          profilePhotoBtnContent={"Upload Profile Photo"}
          photoLink={photoLink}
          userId={userId}
        />
      </Grid.Row>
      <Grid.Row>
      <ProfileRequiredForm 
          colWidth={8}
          formTitle={"My Profile"}
        />
      </Grid.Row>
    </>
  );
}

export default ProfileFullForm;
