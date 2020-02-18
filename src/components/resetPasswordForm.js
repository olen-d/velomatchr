import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  Form,
  Grid, 
  Header,
  Segment
} from "semantic-ui-react"

import ErrorContainer from "./errorContainer";

const ResetPasswordForm = props => {
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
      <ErrorContainer
        header={isErrorHeader}
        message={isErrorMessage}
        show={isError}
      />
    </Grid.Column>
  );
}

ResetPasswordForm.defaultProps = {
  colWidth: 6,
  formTitle: "Reset Password"
}

ResetPasswordForm.propTypes = {
  colWidth: PropTypes.number,
  formTitle: PropTypes.string
}

export default ResetPasswordForm;