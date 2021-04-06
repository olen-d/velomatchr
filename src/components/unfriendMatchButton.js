import React from "react";
import PropTypes from "prop-types";

import { Button } from "semantic-ui-react";

const UnfriendMatchButton = props => {
  const { postAction } = props;

  return(
    <Button
      type="button"
      size="medium"
      color="grey"
      icon="minus circle"
      content="Unfriend"
      onClick={() => postAction("updateStatus", 3)}
    >
    </Button>
  )
}

const { func } = PropTypes;

UnfriendMatchButton.propTypes = {
  postAction: func,
}

export default UnfriendMatchButton;
