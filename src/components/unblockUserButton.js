import React from "react";
import PropTypes from "prop-types";

import { Button } from "semantic-ui-react";

const UnblockUserButton = props => {
  const { postAction } = props;

  return(
    <Button
      type="button"
      size="tiny"
      color="yellow"
      icon="undo alternate"
      content="Unblock"
      onClick={() => postAction(0)}
    >
    </Button>
  );
}

const { func } = PropTypes;

UnblockUserButton.propTypes = {
  postAction: func
}

export default UnblockUserButton;
