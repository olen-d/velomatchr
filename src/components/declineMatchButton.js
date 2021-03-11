import React from "react";
import PropTypes from "prop-types";

import { Button } from "semantic-ui-react";

const DeclineMatchButton = props => {
  const { postAction } = props;

  return(
    <Button
      type="button"
      size="tiny"
      color="yellow"
      icon="user delete"
      content="Decline"
      onClick={() => postAction("updateStatus", 3)}
    >
    </Button>
  )
}

const { func } = PropTypes;

DeclineMatchButton.propTypes = {
  postAction: func,
}

export default DeclineMatchButton;
