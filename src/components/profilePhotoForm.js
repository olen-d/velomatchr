import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";

import { Button, Grid, Header, Icon } from "semantic-ui-react";

const ProfilePhotoForm = props => {
  const { colWidth, formTitle, profilePhotoBtnContent } = props;

  const [profilePhotographFile, setProfilePhotographFile] = useState(null);

  const uploadFile = e => {
    setProfilePhotographFile(e.target.files[0]);
  }

  useEffect (() => {
    if (profilePhotographFile) {
      const formData = new FormData();
      formData.append("profilePhotographFile", profilePhotographFile);
      
    }
  }, [profilePhotographFile]);

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
    </Grid.Column>
  );
}

ProfilePhotoForm.defaultProps = {
  colWidth: 6,
  formTitle: "Current Photograph",
  profilePhotoBtnContent: "Upload Profile Photo"
}

export default ProfilePhotoForm;
