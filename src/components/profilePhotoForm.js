import React from "react";
// import PropTypes from "prop-types";

import { Grid, Header, Icon } from "semantic-ui-react";

const ProfilePhotoForm = props => {
  const { colWidth, formTitle } = props;

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
    </Grid.Column>
  );
}

ProfilePhotoForm.defaultProps = {
  colWidth: 6,
  formTitle: "Current Photograph"
}

export default ProfilePhotoForm;
