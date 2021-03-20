import React from "react";
import PropTypes from "prop-types";

import {
  Message,
} from "semantic-ui-react"

const WarningContainer = props => {
  const { handleDismiss, header, message, show } = props;
  
  if(show) {
    return(
      <Message warning onDismiss={handleDismiss}>
        <Message.Header>
          {header}
        </Message.Header>
        <Message.Content>
          {message} 
        </Message.Content>
      </Message>
    );
  } else {
    return(null);
  }
}

WarningContainer.defaultProps = {
  header: "No Header Specified",
  message: "No message was provided.",
  show: false
}

const { bool, func, string } = PropTypes;

WarningContainer.propTypes = {
  handleDismiss: func,
  header: string,
  message: string,
  show: bool
}

export default WarningContainer;
