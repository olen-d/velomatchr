import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";

import { Button, Form, Grid, Header, Icon } from "semantic-ui-react";

const ProfilePhotoForm = props => {
  const { colWidth, formTitle, profilePhotoBtnContent, userId } = props;

  const [profilePhotographFile, setProfilePhotographFile] = useState(null);

  const uploadFile = e => {
    setProfilePhotographFile(e.target.files[0]);
  }

  useEffect (() => {
    if (profilePhotographFile && userId) {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("profilePhotographFile", profilePhotographFile);

      fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/photograph/update`, {
        method: "post",
        body: formData
      }).then(response => {
        if(!response.ok) {
          throw new Error ("Network response was not ok.");
        }
        return response.json();
      }).then(data => {
        if (data) {
          console.log("DATA", data);
        } else {
          console.log("EPIC FAIL");
        }
      }).catch(error => {
        console.log("SOME OTHER EPIC FAIL - ERROR:\n", error);
      });
    }
  }, [profilePhotographFile, userId]);

  return(
    <Grid.Column width={colWidth}>
      <Header 
        as="h2" 
        textAlign="center"
        color="grey"
      >
        {formTitle}
      </Header>
      <Icon color="grey" name="user circle" size="massive" />
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

    </Grid.Column>
  );
}

ProfilePhotoForm.defaultProps = {
  colWidth: 6,
  formTitle: "Current Photograph",
  profilePhotoBtnContent: "Upload Profile Photo"
}

export default ProfilePhotoForm;
