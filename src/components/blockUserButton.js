import React from "react";
// import PropTypes from "prop-types";

import { Button } from "semantic-ui-react";

const BlockUserButton = props => {
  const { postAction } = props;

  return(
    <Button
      type="button"
      size="tiny"
      color="yellow"
      icon="ban"
      content="Block"
      onClick={() => postAction("updateStatus", 4)}
    >
    </Button>
  )
}

// Default Props
// Prop Types

export default BlockUserButton;
