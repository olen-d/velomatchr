import React from "react";
import PropTypes from "prop-types";

import { Button } from "semantic-ui-react";

const AddMatchButton = props => {
  const { postAction, status } = props;

  return(
    <Button
      type="button"
      size="tiny"
      color="yellow"
      icon="user plus"
      content="Add Buddy"
      onClick={() => postAction("updateStatus", status + 1)}
    >
    </Button>
  )
}

const { func, number } = PropTypes;

AddMatchButton.propTypes = {
  postAction: func,
  status: number
}

export default AddMatchButton;
