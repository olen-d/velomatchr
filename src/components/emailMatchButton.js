import React from "react";
import PropTypes from "prop-types";

import { Button } from "semantic-ui-react";

const EmailMatchButton = props => {
  const { isEmailMatchDisabled, postAction } = props;

  return(
    <Button
      disabled={isEmailMatchDisabled}
      type="button"
      size="medium"
      color="red"
      icon="envelope"
      content="Email Buddy"
      onClick={() => postAction("composeEmail", 0)}
    >
    </Button>
  )
}

const { bool, func } = PropTypes;

EmailMatchButton.propTypes = {
  isEmailMatchDisabled: bool,
  postAction: func,
}

export default EmailMatchButton;
