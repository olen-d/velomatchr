import React from "react";
import PropTypes from "prop-types";

import { Button } from "semantic-ui-react";

const EmailMatchButton = props => {
  const { postAction } = props;

  return(
    <Button
      type="button"
      size="tiny"
      color="yellow"
      icon="envelope"
      content="Email Buddy"
      onClick={() => postAction("composeEmail", 0)}
    >
    </Button>
  )
}

const { func } = PropTypes;

EmailMatchButton.propTypes = {
  postAction: func,
}

export default EmailMatchButton;
