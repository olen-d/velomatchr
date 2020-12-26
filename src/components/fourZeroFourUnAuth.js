import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import { Grid } from "semantic-ui-react";

import SignUpButton from "./signupButton";

const signinStyle = {
  display: "inline",
  marginTop: "1rem",
  marginLeft: "1rem"
}

const signinLinkStyle = {
  fontWeight: "bold"
}

const FourZeroFourUnAuth = props => {
  const { colWidth } = props;

  return(
    <Grid.Row>
      <Grid.Column width={colWidth}>
        <SignUpButton buttonColor="red" buttonType="standard" />
        <p style={signinStyle}>
          Already have an account? <Link to="/login" style={signinLinkStyle}>Sign In</Link>
        </p>
      </Grid.Column>
    </Grid.Row>
  );
}

FourZeroFourUnAuth.defaultProps = {
  colWidth: 16
};

const { number } = PropTypes;

FourZeroFourUnAuth.propTypes = {
  colWidth: number
};

export default FourZeroFourUnAuth;
