import React from "react";
import PropTypes from "prop-types";

import {
  Message,
} from "semantic-ui-react"

const SuccessContainer = props => {
  const { header, message, show } = props;
  if(show) {
    return(
      <Message positive>
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

SuccessContainer.defaultProps = {
  header: "No Header Specified",
  message: "No message was provided.",
  show: false
}

const { bool, string } = PropTypes;

SuccessContainer.propTypes = {
  header: string,
  message: string,
  show: bool
}

export default SuccessContainer;
