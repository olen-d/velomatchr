import React from "react";
import PropTypes from "prop-types";

import { Button } from "semantic-ui-react";

const BlockUserButton = props => {
  const { postAction } = props;

  return(
    <Button
      type="button"
      size="large"
      basic={true}
      fluid={true}
      color="grey"
      icon="ban"
      content="Block"
      onClick={() => postAction("updateStatus", 4)}
    >
    </Button>
  )
}

const { func } = PropTypes;

BlockUserButton.propTypes = {
  postAction: func
}

export default BlockUserButton;
