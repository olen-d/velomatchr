import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import * as auth from "./auth";

import {
  Button,
  Form,
  Header,
  Icon,
  Image,
  Segment
} from "semantic-ui-react";

import { useAuth } from "../context/authContext";

import ErrorContainer from "./errorContainer";
import SuccessContainer from "./successContainer";

const ProfilePhotoForm = props => {
  const { formTitle, profilePhotoBtnContent } = props;

  // Error container items
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  // Success container items
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(null);
  // Rest of the state
  const [photoLink, setPhotoLink] = useState(null);
  const [profilePhotographFile, setProfilePhotographFile] = useState(null);
  const [showUserIcon, setShowUserIcon] = useState(true);
  const [userId, setUserId] = useState(null);

  const { accessToken, setAccessToken } = useAuth();
  
  const { user } = auth.getUserInfo(accessToken);

    // Style

    const extraMarginBottom = {
      marginBottom: "1.25rem"
    };

  const uploadFile = e => {
    setProfilePhotographFile(e.target.files[0]);
  }

  useEffect(() => { setUserId(user); }, [user]);

  useEffect(() => {
    if (userId) {
      (async () => {
        const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
        if (isNewAccessToken) { setAccessToken(token); }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/photo-link/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.status === 200 ? await response.json() : false;

        if ( data && data.status === 200) {

          const { data: { photoLink: initialPhotoLink }, } = data;

          if (initialPhotoLink) {
            setPhotoLink(`${process.env.REACT_APP_API_URL}/${initialPhotoLink}`);
            setShowUserIcon(false);
          } else {
            setShowUserIcon(true);
          }
        }
      })();
    }
  }, [accessToken, photoLink, setAccessToken, userId]);

  useEffect (() => {
    if (profilePhotographFile && userId) {
      (async () => {
        const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
        if (isNewAccessToken) { setAccessToken(token); }
  
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("profilePhotographFile", profilePhotographFile);
  
        fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/update/photograph`, {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }).then(response => {
          if(!response.ok) {
            setIsErrorHeader("Profile Photograph Not Uploaded");
            setIsErrorMessage("The network response was not ok. Please check your internet connection and try again. ");
            setIsError(true);
          }
          return response.json();
        }).then(data => {
          if (data && data.success) {
            const { originalname, path } = data;
  
            setShowUserIcon(false);
            setPhotoLink(`${process.env.REACT_APP_API_URL}/${path}`);
            setIsSuccessHeader("Profile Photograph Uploaded");
            setIsSuccessMessage("\"" + originalname + "\" was successfully uploaded. ");
            setIsSuccess(true);
          } else {
            setIsErrorHeader("Profile Photograph Not Uploaded");
            setIsErrorMessage("The database was not updated. Please try again. ");
            setIsError(true);
          }
        }).catch(error => {
          setIsErrorHeader("Profile Photograph Not Uploaded");
          setIsErrorMessage("Something went terribly awry and your photograph was not uploaded. Please try again. ");
          setIsError(true);
        });
      })()
    }
  }, [accessToken, profilePhotographFile, setAccessToken, userId]);

  return(
    <div className="profile-photo-form">
      <Header 
        as="h2" 
        textAlign="left"
        color="grey"
      >
        {formTitle}
      </Header>
      <ErrorContainer
        header={isErrorHeader}
        message={isErrorMessage}
        show={isError}
      />
      <SuccessContainer
        header={isSuccessHeader}
        message={isSuccessMessage}
        show={isSuccess}
      />
      <Segment>
        { showUserIcon ? <Icon color="grey" name="user circle" size="massive" style={extraMarginBottom} /> : <Image src={photoLink} size="small" rounded style={extraMarginBottom} /> }
        <Form >
          <Button
            as="label"
            htmlFor="profilePhotographFile"
            className="fluid"
            type="button"
            color="red"
            size="large"
            icon="upload"
            labelPosition="left"
            content={profilePhotoBtnContent}
          >
          </Button>
          <input
            type="file"
            id="profilePhotographFile"
            name="profilePhotographFile"
            style={{ display: "none" }}
            onChange={uploadFile}
          />
        </Form>
      </Segment>
    </div>
  );
}

ProfilePhotoForm.defaultProps = {
  colWidth: 6,
  formTitle: "Current Photograph",
  profilePhotoBtnContent: "Upload Profile Photo",
}

const { number, string } = PropTypes;

ProfilePhotoForm.propTypes = {
  colWidth: number,
  formTitle: string,
  profilePhotoBtnContent: string,
}

export default ProfilePhotoForm;
