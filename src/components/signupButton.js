import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import { Button } from "semantic-ui-react";

const SignUpButton = props => {
  const { buttonColor, buttonType } = props;

  if (buttonType === "basic") {
    return (
      <Button basic as={Link} to="/signup" color={buttonColor}>
        Sign Up
      </Button>
    );
  } else {
    return (
      <Button as={Link} to="/signup" color={buttonColor}>
        Sign Up
      </Button>
    );
  }
}

SignUpButton.defaultProps = {
  buttonColor: "red",
  buttonType: "basic"
}

const { string } = PropTypes;

SignUpButton.propTypes = {
  buttonColor: string,
  buttonType: string
}
export default SignUpButton;
