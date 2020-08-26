import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";

import {
  Button,
  Form,
  Header,
  Icon,
  Image
} from "semantic-ui-react";

import ErrorContainer from "./errorContainer";
import SuccessContainer from "./successContainer";

const ProfilePhotoForm = props => {
  const { formTitle, photoLink, profilePhotoBtnContent, token, userId } = props;

  // Error container items
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  // Success container items
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(null);
  // Rest of the state
  const [photoLinkImage, setPhotoLinkImage] = useState(null);
  const [profilePhotographFile, setProfilePhotographFile] = useState(null);
  const [showUserIcon, setShowUserIcon] = useState(true);

  const uploadFile = e => {
    setProfilePhotographFile(e.target.files[0]);
  }

  useEffect (() => {
    if (profilePhotographFile && userId) {
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
          setPhotoLinkImage(`${process.env.REACT_APP_API_URL}/${path}`);
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
    }
  }, [profilePhotographFile, token, userId]);

  useEffect (() => {
    if (photoLink) {
      setShowUserIcon(false);
      setPhotoLinkImage(`${process.env.REACT_APP_API_URL}/${photoLink}`);
    }
  }, [photoLink]);
  
  return(
    <>
      <Header 
        as="h3" 
        textAlign="left"
        color="grey"
      >
        {formTitle}
      </Header>
      { showUserIcon ? <Icon color="grey" name="user circle" size="massive" /> : <Image src={photoLinkImage} size="small" rounded /> }
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
    </>
  );
}

ProfilePhotoForm.defaultProps = {
  colWidth: 6,
  formTitle: "Current Photograph",
  photoLink: null,
  profilePhotoBtnContent: "Upload Profile Photo",
  token: "",
  userId: 0
}

export default ProfilePhotoForm;
